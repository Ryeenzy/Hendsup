#include "trace.hpp"
#include "core.hpp"

#include <EGL/egl.h>
#include <android/log.h>
#include <dlfcn.h>
#include <cstring>

#include <atomic>
#include <chrono>
#include <mutex>
#include <thread>

#include "effects.hpp"
#include "dpipe.hpp"
#include "glhooks.hpp"
#include "hook.hpp"

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {
namespace {

EGLBoolean (*g_origSwap)(EGLDisplay, EGLSurface) = nullptr;
void* (*g_origDlopen)(const char*, int) = nullptr;
uintptr_t g_swapSlot = 0, g_dlopenSlot = 0;
Effects g_fx;
std::mutex g_mu;
Config g_cfg;
std::string g_state = "starting";
std::atomic<uint64_t> g_frames{0};
std::atomic<bool> g_forceGles{false};
std::atomic<int> g_autoLevel{0};


uint64_t g_lastFrames = 0;
std::chrono::steady_clock::time_point g_lastT = std::chrono::steady_clock::now();
float g_lastFps = 0;

void setState(const std::string& s) {
    std::lock_guard<std::mutex> l(g_mu);
    g_state = s;
}

EGLBoolean hookedSwap(EGLDisplay d, EGLSurface s) {
    auto orig = g_origSwap;
    if (!orig) return EGL_FALSE;
    g_frames.fetch_add(1, std::memory_order_relaxed);
    Config cfg;
    {
        std::lock_guard<std::mutex> l(g_mu);
        cfg = g_cfg;
    }
    traceOnSwap(cfg.traceNow);
    {
        EGLint bw = 0, bh = 0;
        if (cfg.depthPipe && !cfg.safe && !cfg.disable) { eglQuerySurface(d, s, EGL_WIDTH, &bw); eglQuerySurface(d, s, EGL_HEIGHT, &bh); }
        dpOnSwap(bw, bh);
    }
    {   // auto performa: turunkan level bila FPS di bawah target 3 detik berturut-turut, naikkan lagi bila longgar 15 detik
        static auto t0 = std::chrono::steady_clock::now();
        static int fr = 0, low = 0, high = 0;
        fr++;
        auto now = std::chrono::steady_clock::now();
        double dt = std::chrono::duration<double>(now - t0).count();
        if (dt >= 1.0) {
            double fps = fr / dt;
            fr = 0; t0 = now;
            int lvl = g_autoLevel.load();
            if (!cfg.autoPerf) { lvl = 0; low = high = 0; }
            else if (fps < cfg.fpsTarget - 3.0) { high = 0; if (++low >= 3 && lvl < 3) { lvl++; low = 0; } }
            else if (fps > cfg.fpsTarget + 12.0) { low = 0; if (++high >= 15 && lvl > 0) { lvl--; high = 0; } }
            else { low = high = 0; }
            if (lvl != g_autoLevel.load()) { g_autoLevel.store(lvl); LOG("auto perf level -> %d (fps %.1f)", lvl, fps); }
        }
    }
    if (cfg.enabled && !cfg.live && !cfg.disable && !cfg.safe && !g_fx.failed() && eglGetCurrentSurface(EGL_DRAW) == s) {
        EGLint w = 0, h = 0;
        eglQuerySurface(d, s, EGL_WIDTH, &w);
        eglQuerySurface(d, s, EGL_HEIGHT, &h);
        if (w >= 64 && h >= 64) g_fx.render(cfg, w, h);
    }
    return orig(d, s);
}

void* hookedDlopen(const char* name, int flags) {
    auto orig = g_origDlopen;
    if (!orig) return nullptr;
    if (g_forceGles.load() && name && strstr(name, "libvulkan")) {
        LOG("blocked dlopen(%s) -> forcing GLES", name);
        return orig("/rz_blocked/libvulkan.so", flags);  // fails cleanly and sets a real dlerror()
    }
    return orig(name, flags);
}

}  // namespace

std::string coreStart(const Config& initial, int timeoutMs, const char* expectedBuildId) {
    {
        std::lock_guard<std::mutex> l(g_mu);
        g_cfg = initial;
        g_cfg.safe = false;
        g_cfg.disable = false;
    }
    LoadedImage im;
    auto deadline = std::chrono::steady_clock::now() + std::chrono::milliseconds(timeoutMs);
    while (!findImage("/libroblox.so", im)) {
        if (std::chrono::steady_clock::now() > deadline) { setState("inactive:libroblox-not-loaded"); return coreState(); }
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
    std::string bid = buildId(im);
    if (!initial.allowAnyBuild && expectedBuildId && bid != expectedBuildId) {
        LOG("build id mismatch: expected=%s actual=%s", expectedBuildId ? expectedBuildId : "(none)", bid.c_str());
        setState("inactive:build-id-mismatch");
        return coreState();
    }
    g_swapSlot = findPltSlot(im, "eglSwapBuffers");
    if (!g_swapSlot) { setState("inactive:eglSwapBuffers-not-imported"); return coreState(); }

    // Hook dlopen selalu dipasang; saklar force_gles dapat berubah saat sesi berjalan.
    {
        g_dlopenSlot = findPltSlot(im, "dlopen");
        if (g_dlopenSlot) {
            g_forceGles.store(initial.forceGles);
            g_origDlopen = *reinterpret_cast<void* (**)(const char*, int)>(g_dlopenSlot);
            void* old = nullptr;
            if (patchSlot(g_dlopenSlot, reinterpret_cast<void*>(&hookedDlopen), &old))
                g_origDlopen = reinterpret_cast<void* (*)(const char*, int)>(old);
            else { g_origDlopen = nullptr; g_dlopenSlot = 0; g_forceGles.store(false); }
        }
    }

    g_origSwap = *reinterpret_cast<EGLBoolean (**)(EGLDisplay, EGLSurface)>(g_swapSlot);
    void* old = nullptr;
    if (!patchSlot(g_swapSlot, reinterpret_cast<void*>(&hookedSwap), &old)) {
        g_origSwap = nullptr;
        setState("inactive:patch-failed");
        return coreState();
    }
    g_origSwap = reinterpret_cast<EGLBoolean (*)(EGLDisplay, EGLSurface)>(old);
    glhooksInstall(im);
    setState("hooked");
    LOG("hooked eglSwapBuffers slot=%lx build=%s", static_cast<unsigned long>(g_swapSlot), bid.c_str());
    return coreState();
}

void coreSetConfig(const Config& cin) {
    Config c = cin;
    c.safe = false;      // Safe Mode dihapus: tidak ada jalur apa pun yang boleh mengaktifkannya
    c.disable = false;
    {
        std::lock_guard<std::mutex> l(g_mu);
        g_cfg = c;
    }
    g_forceGles.store(c.forceGles);
}
Config coreConfig() {
    std::lock_guard<std::mutex> l(g_mu);
    return g_cfg;
}
int coreAutoLevel() { return g_autoLevel.load(); }

uint64_t coreFrames() { return g_frames.load(); }

float coreFps() {
    std::lock_guard<std::mutex> l(g_mu);
    auto now = std::chrono::steady_clock::now();
    double dt = std::chrono::duration<double>(now - g_lastT).count();
    if (dt < 0.4) return g_lastFps;
    uint64_t fr = g_frames.load();
    g_lastFps = static_cast<float>((fr - g_lastFrames) / dt);
    g_lastFrames = fr;
    g_lastT = now;
    return g_lastFps;
}

std::string coreState() {
    if (g_fx.failed()) return std::string("effects-failed:") + g_fx.reason();
    std::lock_guard<std::mutex> l(g_mu);
    return g_state;
}

void coreStop() {
    if (g_swapSlot && g_origSwap) restoreSlot(g_swapSlot, reinterpret_cast<void*>(g_origSwap));
    if (g_dlopenSlot && g_origDlopen) restoreSlot(g_dlopenSlot, reinterpret_cast<void*>(g_origDlopen));
    glhooksRemove();
    g_forceGles.store(false);
    setState("stopped");
}

}  // namespace rz
