#include <cassert>
#include <cstdio>
#include <cstring>
#include <dlfcn.h>
#include "../jni/config.hpp"
#include "../jni/hook.hpp"

static int g_calls = 0;
static size_t (*g_orig)(const char*) = nullptr;
extern "C" size_t fake_strlen(const char* s) { g_calls++; return g_orig(s) + 1000; }

int main() {
    void* h = dlopen("./libtarget.so", RTLD_NOW);
    assert(h);
    auto call = reinterpret_cast<size_t (*)(const char*)>(dlsym(h, "target_call"));
    assert(call && call("abcd") == 4);

    rz::LoadedImage im;
    assert(rz::findImage("/libtarget.so", im));
    printf("image base=%lx path=%s\n", (unsigned long)im.base, im.path.c_str());
    std::string bid = rz::buildId(im);
    printf("build-id=%s\n", bid.c_str());
    assert(bid.size() == 40);

    uintptr_t slot = rz::findPltSlot(im, "strlen");
    printf("strlen slot=%lx\n", (unsigned long)slot);
    assert(slot != 0);
    assert(rz::findPltSlot(im, "no_such_symbol") == 0);

    void* old = nullptr;
    assert(rz::patchSlot(slot, (void*)fake_strlen, &old));
    g_orig = reinterpret_cast<size_t (*)(const char*)>(old);
    assert(call("abcd") == 1004 && g_calls == 1);   // hook fires
    assert(rz::restoreSlot(slot, old));
    assert(call("abcd") == 4 && g_calls == 1);       // restored, hook gone
    printf("HOOK ENGINE OK\n");

    rz::Config c;
    assert(rz::parseConfig("enabled=1\nglossy=1\nglossy_amount=0.7\nglass=0.5\nbloom=0.2\n", c));   // kunci Glossy/Glass lama: diterima, diabaikan
    assert(c.enabled && c.bloom > 0.19f && c.bloom < 0.21f);
    rz::Config keep = c;
    assert(!rz::parseConfig("bloom=5\n", c));             // out of range
    assert(!rz::parseConfig("evil=1\n", c));              // unknown key
    assert(!rz::parseConfig("bloom=abc\n", c));           // not a number
    assert(!rz::parseConfig("bloom=nan\n", c));           // NaN
    assert(!rz::parseConfig("enabled=2\n", c));           // bad bool
    assert(c.enabled == keep.enabled && c.bloom == keep.bloom);  // failed parse leaves config untouched
    printf("CONFIG PARSER OK\n");
    return 0;
}
