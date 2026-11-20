#include "hook.hpp"

#include <elf.h>
#include <sys/mman.h>
#include <unistd.h>

#include <cstdio>
#include <cstring>

namespace rz {
namespace {

struct FindCtx {
    const char* suffix;
    LoadedImage* out;
    bool found;
};

int iterCb(struct dl_phdr_info* info, size_t, void* data) {
    auto* c = static_cast<FindCtx*>(data);
    if (!info->dlpi_name || !*info->dlpi_name) return 0;
    size_t n = strlen(info->dlpi_name), s = strlen(c->suffix);
    if (n < s || strcmp(info->dlpi_name + n - s, c->suffix) != 0) return 0;
    c->out->base = info->dlpi_addr;
    c->out->phdr = info->dlpi_phdr;
    c->out->phnum = info->dlpi_phnum;
    c->out->path = info->dlpi_name;
    c->found = true;
    return 1;
}

// .dynamic pointers are link-time RVAs on bionic but may already be absolute on other libcs.
uintptr_t fixAddr(const LoadedImage& im, uintptr_t v) { return v >= im.base ? v : im.base + v; }

int protOf(uintptr_t addr) {
    FILE* f = fopen("/proc/self/maps", "r");
    if (!f) return -1;
    char line[512];
    int result = -1;
    while (fgets(line, sizeof line, f)) {
        unsigned long lo = 0, hi = 0;
        char perms[8] = {0};
        if (sscanf(line, "%lx-%lx %7s", &lo, &hi, perms) != 3) continue;
        if (addr >= lo && addr < hi) {
            result = 0;
            if (perms[0] == 'r') result |= PROT_READ;
            if (perms[1] == 'w') result |= PROT_WRITE;
            if (perms[2] == 'x') result |= PROT_EXEC;
            break;
        }
    }
    fclose(f);
    return result;
}

#if defined(__aarch64__)
constexpr unsigned kJumpSlot = 1026;  // R_AARCH64_JUMP_SLOT
#elif defined(__x86_64__)
constexpr unsigned kJumpSlot = 7;  // R_X86_64_JUMP_SLOT (host tests)
#else
constexpr unsigned kJumpSlot = 0xffffffff;
#endif

}  // namespace

bool findImage(const char* suffix, LoadedImage& out) {
    FindCtx c{suffix, &out, false};
    dl_iterate_phdr(iterCb, &c);
    return c.found;
}

std::string buildId(const LoadedImage& im) {
    for (int i = 0; i < im.phnum; i++) {
        const ElfW(Phdr)& ph = im.phdr[i];
        if (ph.p_type != PT_NOTE) continue;
        const uint8_t* p = reinterpret_cast<const uint8_t*>(im.base + ph.p_vaddr);
        const uint8_t* end = p + ph.p_memsz;
        while (p + sizeof(ElfW(Nhdr)) <= end) {
            const auto* nh = reinterpret_cast<const ElfW(Nhdr)*>(p);
            size_t nameOff = sizeof(ElfW(Nhdr));
            size_t descOff = nameOff + ((nh->n_namesz + 3u) & ~3u);
            size_t next = descOff + ((nh->n_descsz + 3u) & ~3u);
            if (nh->n_namesz > 256 || nh->n_descsz > 4096 || p + next > end) break;
            if (nh->n_type == NT_GNU_BUILD_ID && nh->n_namesz == 4 && memcmp(p + nameOff, "GNU", 4) == 0) {
                std::string hex;
                char b[3];
                for (uint32_t k = 0; k < nh->n_descsz; k++) {
                    snprintf(b, sizeof b, "%02x", p[descOff + k]);
                    hex += b;
                }
                return hex;
            }
            p += next;
        }
    }
    return "";
}

uintptr_t findPltSlot(const LoadedImage& im, const char* symbol) {
    const ElfW(Dyn)* dyn = nullptr;
    for (int i = 0; i < im.phnum; i++)
        if (im.phdr[i].p_type == PT_DYNAMIC) dyn = reinterpret_cast<const ElfW(Dyn)*>(im.base + im.phdr[i].p_vaddr);
    if (!dyn) return 0;
    uintptr_t jmprel = 0, symtab = 0, strtab = 0;
    size_t pltrelsz = 0;
    for (const ElfW(Dyn)* d = dyn; d->d_tag != DT_NULL; d++) {
        switch (d->d_tag) {
            case DT_JMPREL: jmprel = fixAddr(im, d->d_un.d_ptr); break;
            case DT_PLTRELSZ: pltrelsz = d->d_un.d_val; break;
            case DT_SYMTAB: symtab = fixAddr(im, d->d_un.d_ptr); break;
            case DT_STRTAB: strtab = fixAddr(im, d->d_un.d_ptr); break;
            default: break;
        }
    }
    if (!jmprel || !symtab || !strtab || !pltrelsz) return 0;
    const auto* rel = reinterpret_cast<const ElfW(Rela)*>(jmprel);
    size_t count = pltrelsz / sizeof(ElfW(Rela));
    const auto* syms = reinterpret_cast<const ElfW(Sym)*>(symtab);
    for (size_t i = 0; i < count; i++) {
        if (ELF64_R_TYPE(rel[i].r_info) != kJumpSlot) continue;
        const char* name = reinterpret_cast<const char*>(strtab) + syms[ELF64_R_SYM(rel[i].r_info)].st_name;
        if (strcmp(name, symbol) == 0) return im.base + rel[i].r_offset;
    }
    return 0;
}

static bool writeSlot(uintptr_t slot, void* value, void** old) {
    long ps = sysconf(_SC_PAGESIZE);
    uintptr_t page = slot & ~static_cast<uintptr_t>(ps - 1);
    int orig = protOf(slot);
    if (orig < 0) return false;
    if (mprotect(reinterpret_cast<void*>(page), ps, PROT_READ | PROT_WRITE) != 0) return false;
    void** p = reinterpret_cast<void**>(slot);
    if (old) *old = *p;
    __atomic_store_n(p, value, __ATOMIC_SEQ_CST);
    mprotect(reinterpret_cast<void*>(page), ps, orig);
    return true;
}

bool patchSlot(uintptr_t slot, void* newFn, void** oldFn) { return slot && newFn && writeSlot(slot, newFn, oldFn); }
bool restoreSlot(uintptr_t slot, void* original) { return slot && original && writeSlot(slot, original, nullptr); }

}  // namespace rz
