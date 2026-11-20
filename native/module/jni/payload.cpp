// APK-embedded entry point: libroblox.so is patched with DT_NEEDED -> libryeenzyxnz.so, so this constructor runs
// inside Roblox (no root, no Zygisk, no second APK).
//  * installs the eglSwapBuffers hook (core.cpp) that runs the post-process pass
//  * loads the in-game overlay (button + panel) from the embedded dex
//  * config comes from <files>/rz_config.cfg (written by the overlay); status goes to <files>/rz_status.txt
#include <android/log.h>
#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>

#include <atomic>
#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <thread>

#include "config.hpp"
#include "core.hpp"
#include "fxrt.hpp"
#include "glhooks.hpp"
#include "jvm_boot.hpp"

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace {

// Patch tool fills this fixed-width buffer with the exact GNU build-id from the selected APK.
constexpr char kBuildId[129] = "4a916f58386d0c329a1202bfc4df0c392e869487";

std::string readFile(const std::string& p) {
    std::string out;
    if (FILE* f = fopen(p.c_str(), "r")) {
        char b[512];
        size_t n;
        while ((n = fread(b, 1, sizeof b, f)) > 0 && out.size() < 16384) out.append(b, n);
        fclose(f);
    }
    return out;
}
void writeFile(const std::string& p, const std::string& d) {
    std::string tmp = p + ".tmp";
    if (FILE* f = fopen(tmp.c_str(), "w")) {
        fwrite(d.data(), 1, d.size(), f);
        fclose(f);
        rename(tmp.c_str(), p.c_str());
    }
}

std::string pkgName() {
    char name[256] = {0};
    if (FILE* f = fopen("/proc/self/cmdline", "r")) { fread(name, 1, sizeof name - 1, f); fclose(f); }
    return name;
}

// delete Roblox's compiled-shader caches (shadercache*) so shaders are compiled from source again
int clearShaderCache(const std::string& root, int depth) {
    int n = 0;
    if (DIR* d = opendir(root.c_str())) {
        while (dirent* e = readdir(d)) {
            std::string nm = e->d_name;
            if (nm == "." || nm == "..") continue;
            std::string full = root + "/" + nm;
            struct stat st;
            if (lstat(full.c_str(), &st) != 0) continue;
            if (S_ISDIR(st.st_mode)) { if (depth > 0) n += clearShaderCache(full, depth - 1); }
            else if (nm.rfind("shadercache", 0) == 0 && unlink(full.c_str()) == 0) n++;
        }
        closedir(d);
    }
    return n;
}

std::string appDir() {
    std::string pkg = pkgName();
    const char* name = pkg.c_str();
    if (!*name) return "";
    for (const char* base : {"/data/user/0/", "/data/data/"}) {
        std::string d = std::string(base) + name + "/files";
        struct stat st;
        if (stat(d.c_str(), &st) == 0 || mkdir(d.c_str(), 0700) == 0) return d;
    }
    return "";
}

std::string g_overlay = "starting";

void payloadMain() {
    std::string dir = appDir();
    if (dir.empty()) { LOG("no app dir; payload idle"); return; }

    // Jangan pernah memaksa pengguna ke Save/Safe Mode berdasarkan jumlah boot.
    // Boot counter lama direset agar instalasi yang sebelumnya terkunci bisa pulih.
    writeFile(dir + "/rz_boot.cnt", "0");
    const bool safe = false;   // Safe Mode dihapus total

    rz::Config cfg;
    const std::string cfgPath = dir + "/rz_config.cfg";
    std::string lastConfigText = readFile(cfgPath);
    if (rz::parseConfig(lastConfigText, cfg)) LOG("config loaded");
    cfg.safe = safe;
    cfg.disable = false;
    rz::coreSetConfig(cfg);

    const std::string pkg = pkgName();
    rz::fxrtSetDirs(dir, dir + "/fx-es");
    rz::glhooksSetPaths("/storage/emulated/0/Android/data/" + pkg + "/files/RYEENZYXNZ", dir + "/rz_shader_rules.txt");
    if (cfg.clearShaderCache && !safe) {
        int n = clearShaderCache(dir, 4) + clearShaderCache(dir + "/../cache", 4);
        LOG("shader cache files removed: %d", n);
    }

    if (!safe) {
        // coreStart waits for libroblox.so and installs the hook; run it off this thread so the overlay/config loop starts now.
        std::thread([cfg]() { LOG("core state: %s", rz::coreStart(cfg, 120000, kBuildId).c_str()); }).detach();
    }

    std::string lastConfig = readFile(cfgPath);
    bool overlayOk = false;
    int tries = 0;
    auto nextBoot = std::chrono::steady_clock::now() + std::chrono::milliseconds(1500);
    for (;;) {
        std::this_thread::sleep_for(std::chrono::milliseconds(250));

        if (!overlayOk && tries < 12 && std::chrono::steady_clock::now() >= nextBoot) {
            g_overlay = rz::bootOverlay(dir);
            tries++;
            overlayOk = g_overlay.empty();
            if (overlayOk) g_overlay = "ok";
            nextBoot = std::chrono::steady_clock::now() + std::chrono::milliseconds(2000);
        }

        const std::string configText = readFile(cfgPath);
        if (!configText.empty() && configText != lastConfig) {
            rz::Config c;
            if (rz::parseConfig(configText, c)) {
                lastConfig = configText;
                c.safe = rz::coreConfig().safe;
                c.disable = false;
                rz::coreSetConfig(c);
            } else {
                LOG("rz_config.cfg rejected (invalid); keeping previous config");
            }
        }

        char b[512];
        rz::GlStats gs = rz::glhooksStats();
        snprintf(b, sizeof b, "fps=%.0f;frames=%llu;state=%s;overlay=%s;seen=%d;dumped=%d;patched=%d;bin=%d;depth=%d;hooks=%s",
                 rz::coreFps(), static_cast<unsigned long long>(rz::coreFrames()),
                 rz::coreState().c_str(), g_overlay.c_str(), gs.seen, gs.dumped, gs.patched,
                 gs.binaryBlocked, gs.depthEvents, rz::glhooksSummary().c_str());
        writeFile(dir + "/rz_status.txt", b);

    }
}

__attribute__((constructor, used)) void rzInit() { std::thread(payloadMain).detach(); }

}  // namespace
