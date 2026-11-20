// GOT/PLT import hooking for an already-loaded shared object. No hardcoded offsets:
// slots are found by symbol name through the object's own DT_JMPREL table.
#pragma once
#include <cstdint>
#include <link.h>
#include <string>

namespace rz {

struct LoadedImage {
    uintptr_t base = 0;
    const ElfW(Phdr)* phdr = nullptr;
    int phnum = 0;
    std::string path;
};

// Finds a loaded object whose path ends with `suffix` (e.g. "/libroblox.so").
bool findImage(const char* suffix, LoadedImage& out);

// GNU build ID (lowercase hex) of a loaded image, or "" if absent.
std::string buildId(const LoadedImage& im);

// Address of the JUMP_SLOT GOT entry for `symbol`, or 0 if the object does not import it via PLT.
uintptr_t findPltSlot(const LoadedImage& im, const char* symbol);

// Replace the pointer in `slot` with `newFn`; the previous value is stored in *oldFn.
// Temporarily makes the page writable and restores the original protection.
bool patchSlot(uintptr_t slot, void* newFn, void** oldFn);

// Put `original` back into `slot`.
bool restoreSlot(uintptr_t slot, void* original);

}  // namespace rz
