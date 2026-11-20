// Shared engine used by both entry points (Zygisk module and APK-embedded payload).
#pragma once
#include <cstdint>
#include <string>

#include "config.hpp"

namespace rz {

// Waits (up to timeoutMs) for libroblox.so, verifies the build ID (unless cfg.allowAnyBuild), installs the
// eglSwapBuffers hook (and, if cfg.forceGles, a dlopen hook that blocks libvulkan). Returns "hooked" or "inactive:<reason>".
std::string coreStart(const Config& initial, int timeoutMs, const char* expectedBuildId);
void coreSetConfig(const Config& c);
Config coreConfig();
int coreAutoLevel();        // level performa otomatis 0..3 (auto_perf)
uint64_t coreFrames();
float coreFps();            // frames/second since the previous call (min 400 ms window)
std::string coreState();    // "hooked", "inactive:...", "effects-failed:...", "stopped"
void coreStop();            // restore all patched GOT slots

}  // namespace rz
