#include "glhooks.hpp"
#include "dpipe.hpp"

#include <EGL/egl.h>
#include <GLES3/gl3.h>
#include <android/log.h>
#include <sys/stat.h>

#include <cstdio>
#include <cstring>
#include <mutex>
#include <set>
#include <unordered_map>

#include "core.hpp"
#include "liveshader.hpp"
#include "shaderpatch.hpp"
#include "trace.hpp"

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {
namespace {

using ShaderSourceFn = void (*)(GLuint, GLsizei, const GLchar* const*, const GLint*);
using ProgramBinaryFn = void (*)(GLuint, GLenum, const void*, GLsizei);
using FbTex2DFn = void (*)(GLenum, GLenum, GLenum, GLuint, GLint);
using ProgFn = void (*)(GLuint);
using GetProcFn = __eglMustCastToProperFunctionPointerType (*)(const char*);

ShaderSourceFn o_ShaderSource = nullptr;
ProgramBinaryFn o_ProgramBinary = nullptr;
FbTex2DFn o_FbTex2D = nullptr;
ProgFn o_UseProgram = nullptr, o_LinkProgram = nullptr, o_DeleteProgram = nullptr;
GetProcFn o_GetProc = nullptr;

struct Slot { uintptr_t addr = 0; void* orig = nullptr; };
Slot s_ShaderSource, s_ProgramBinary, s_FbTex2D, s_GetProc, s_Use, s_Link, s_Delete;
std::vector<Slot> s_trace;
std::string g_how[6];  // per hook: "", "plt", "egl"  (0 src,1 bin,2 fb,3 use,4 link,5 delete)

struct ProgLive { GLint loc[kRzCount]; ProgLive() { for (int i = 0; i < kRzCount; i++) loc[i] = -1; } bool any = false; LiveParams sent; bool sentValid = false; };
std::unordered_map<GLuint, ProgLive> g_progs;
std::mutex g_pm;  // melindungi g_progs (Roblox bisa memakai lebih dari satu thread GL)
int g_liveRewritten = 0, g_liveUploads = 0;

std::mutex g_mu;
std::string g_dumpDir, g_rulesPath;
GlStats g_stats;
std::set<std::string> g_hashes;
std::vector<Rule> g_rules;
time_t g_rulesMtime = 0;
long long g_rulesCheckedMs = 0;
bool g_infoWritten = false;
int g_logLines = 0;

constexpr int kMaxDumps = 700;
constexpr size_t kMaxSrc = 1u << 20;

long long nowMs() {
    timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return static_cast<long long>(ts.tv_sec) * 1000 + ts.tv_nsec / 1000000;
}

void mkdirs(const std::string& p) {
    for (size_t i = 1; i < p.size(); i++)
        if (p[i] == '/') mkdir(p.substr(0, i).c_str(), 0775);
    mkdir(p.c_str(), 0775);
}

void writeText(const std::string& path, const std::string& data, const char* mode = "w") {
    if (FILE* f = fopen(path.c_str(), mode)) { fwrite(data.data(), 1, data.size(), f); fclose(f); }
}

std::string readText(const std::string& path) {
    std::string out;
    if (FILE* f = fopen(path.c_str(), "r")) {
        char b[4096];
        size_t n;
        while ((n = fread(b, 1, sizeof b, f)) > 0 && out.size() < 262144) out.append(b, n);
        fclose(f);
    }
    return out;
}

void logLine(const std::string& s) {
    std::lock_guard<std::mutex> l(g_mu);
    if (g_logLines++ > 400 || g_dumpDir.empty()) return;
    writeText(g_dumpDir + "/gl_log.txt", s + "\n", "a");
}

void reloadRulesIfChanged() {
    long long t = nowMs();
    std::lock_guard<std::mutex> l(g_mu);
    if (t - g_rulesCheckedMs < 1000) return;
    g_rulesCheckedMs = t;
    struct stat st;
    if (g_rulesPath.empty() || stat(g_rulesPath.c_str(), &st) != 0) { g_rules.clear(); g_rulesMtime = 0; return; }
    if (st.st_mtime == g_rulesMtime) return;
    g_rulesMtime = st.st_mtime;
    g_rules = parseRules(readText(g_rulesPath));
    LOG("shader rules loaded: %zu", g_rules.size());
}

void writeInfoOnce() {
    {
        std::lock_guard<std::mutex> l(g_mu);
        if (g_infoWritten || g_dumpDir.empty()) return;
        g_infoWritten = true;
        mkdirs(g_dumpDir);
        mkdirs(g_dumpDir + "/shaders");
    }
    auto s = [](GLenum e) { const GLubyte* v = glGetString(e); return std::string(v ? reinterpret_cast<const char*>(v) : "?"); };
    std::string info = "GL_VENDOR=" + s(GL_VENDOR) + "\nGL_RENDERER=" + s(GL_RENDERER) + "\nGL_VERSION=" + s(GL_VERSION) +
                       "\nGLSL=" + s(GL_SHADING_LANGUAGE_VERSION) + "\n";
    writeText(g_dumpDir + "/gl_info.txt", info);
}

void h_ShaderSource(GLuint shader, GLsizei count, const GLchar* const* str, const GLint* len) {
    auto orig = o_ShaderSource;
    if (!orig) return;
    Config cfg = coreConfig();
    // Siapkan uniform RZ pada shader compile pertama. Saklar LIVE hanya mengubah uniform
    // saat glUseProgram, jadi ON/OFF berikutnya tidak membutuhkan relog/recompile.
    const bool liveOn = !cfg.safe && !cfg.disable && o_UseProgram != nullptr;
    if (cfg.safe || cfg.disable || !(cfg.shaderDump || cfg.shaderRules || liveOn || cfg.trace) || count <= 0 || !str) {
        orig(shader, count, str, len);
        return;
    }
    std::string src;
    for (GLsizei i = 0; i < count; i++) {
        if (!str[i]) continue;
        if (len && len[i] >= 0) src.append(str[i], static_cast<size_t>(len[i]));
        else src.append(str[i]);
        if (src.size() > kMaxSrc) break;
    }
    if (src.size() > kMaxSrc) { orig(shader, count, str, len); return; }

    if (cfg.shaderDump) writeInfoOnce();
    std::string h = hashHex(src);
    traceShaderHash(shader, h);
    bool fresh = false;
    {
        std::lock_guard<std::mutex> l(g_mu);
        g_stats.seen++;
        if (cfg.shaderDump && g_stats.dumped < kMaxDumps && !g_dumpDir.empty() && g_hashes.insert(h).second) {
            g_stats.dumped++;
            fresh = true;
        }
    }
    if (fresh) writeText(g_dumpDir + "/shaders/" + h + ".txt", src);

    if (liveOn) {
        int edits = 0;
        std::string out = liveRewrite(src, &edits);
        if (!out.empty()) {
            { std::lock_guard<std::mutex> l(g_mu); g_stats.patched++; g_liveRewritten++; }
            if (cfg.shaderDump && !g_dumpDir.empty()) writeText(g_dumpDir + "/shaders/" + h + ".live.txt", out);
            const GLchar* p = out.c_str();
            GLint n = static_cast<GLint>(out.size());
            orig(shader, 1, &p, &n);
            return;
        }
    }

    if (cfg.shaderRules) {
        reloadRulesIfChanged();
        std::vector<Rule> rules;
        { std::lock_guard<std::mutex> l(g_mu); rules = g_rules; }
        if (!rules.empty()) {
            int hits = 0;
            std::string out = applyRules(src, rules, &hits);
            if (hits > 0 && out != src) {
                { std::lock_guard<std::mutex> l(g_mu); g_stats.patched++; }
                if (cfg.shaderDump && !g_dumpDir.empty()) writeText(g_dumpDir + "/shaders/" + h + ".patched.txt", out);
                const GLchar* p = out.c_str();
                GLint n = static_cast<GLint>(out.size());
                orig(shader, 1, &p, &n);
                return;
            }
        }
    }
    orig(shader, count, str, len);
}

void h_ProgramBinary(GLuint program, GLenum fmt, const void* bin, GLsizei n) {
    auto orig = o_ProgramBinary;
    if (!orig) return;
    Config cfg = coreConfig();
    if (cfg.blockProgramBinary && !cfg.safe && !cfg.disable) {
        std::lock_guard<std::mutex> l(g_mu);
        g_stats.binaryBlocked++;  // swallowed: the program stays unlinked, Roblox is expected to recompile from source
        return;
    }
    orig(program, fmt, bin, n);
}

void h_FbTex2D(GLenum target, GLenum attachment, GLenum textarget, GLuint tex, GLint level) {
    auto orig = o_FbTex2D;
    if (!orig) return;
    traceOnFbTex(target, attachment, tex, level);
    if (attachment == GL_DEPTH_ATTACHMENT || attachment == GL_DEPTH_STENCIL_ATTACHMENT) {
        Config cfg = coreConfig();
        if (cfg.shaderDump) {
            { std::lock_guard<std::mutex> l(g_mu); g_stats.depthEvents++; }
            char b[160];
            snprintf(b, sizeof b, "depth attach: target=0x%x attachment=0x%x tex=%u level=%d", target, attachment, tex, level);
            logLine(b);
        }
    }
    orig(target, attachment, textarget, tex, level);
}

void h_UseProgram(GLuint program) {
    auto orig = o_UseProgram;
    if (!orig) return;
    orig(program);
    traceOnUseProgram(program);
    dpOnUseProgram(program);
    Config cfg = coreConfig();
    if (cfg.safe || cfg.disable || program == 0) return;
    std::lock_guard<std::mutex> pl_lock(g_pm);
    auto it = g_progs.find(program);
    if (it == g_progs.end()) {
        ProgLive pl;
        for (int i = 0; i < kRzCount; i++) {
            char nm[8];
            snprintf(nm, sizeof nm, "RZ%d", i);
            pl.loc[i] = glGetUniformLocation(program, nm);
            if (pl.loc[i] >= 0) pl.any = true;
        }
        it = g_progs.emplace(program, pl).first;
    }
    ProgLive& pl = it->second;
    if (!pl.any) return;
    LiveParams lp = liveParams(cfg, coreAutoLevel());
    if (pl.sentValid && memcmp(&pl.sent, &lp, sizeof lp) == 0) return;
    for (int i = 0; i < kRzCount; i++)
        if (pl.loc[i] >= 0) glUniform4fv(pl.loc[i], 1, lp.u[i]);
    pl.sent = lp;
    pl.sentValid = true;
    g_liveUploads++;
}

void h_LinkProgram(GLuint program) {
    auto orig = o_LinkProgram;
    if (!orig) return;
    { std::lock_guard<std::mutex> l(g_pm); g_progs.erase(program); }  // lokasi uniform berubah setelah link ulang
    dpOnProgramGone(program);
    orig(program);
}

void h_DeleteProgram(GLuint program) {
    auto orig = o_DeleteProgram;
    if (!orig) return;
    { std::lock_guard<std::mutex> l(g_pm); g_progs.erase(program); }  // id program bisa dipakai ulang
    dpOnProgramGone(program);
    orig(program);
}

__eglMustCastToProperFunctionPointerType h_GetProc(const char* name) {
    auto orig = o_GetProc;
    if (!orig) return nullptr;
    auto p = orig(name);
    if (!p || !name) return p;
    if (traceInstalled()) {
        int tn = 0;
        const TraceHook* th = traceHooks(&tn);
        for (int i = 0; i < tn; i++)
            if (!strcmp(name, th[i].name)) { *th[i].orig = reinterpret_cast<void*>(p); return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(th[i].hook); }
    }
    if (!strcmp(name, "glShaderSource")) { o_ShaderSource = reinterpret_cast<ShaderSourceFn>(p); if (g_how[0].empty()) g_how[0] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_ShaderSource); }
    if (!strcmp(name, "glProgramBinary")) { o_ProgramBinary = reinterpret_cast<ProgramBinaryFn>(p); if (g_how[1].empty()) g_how[1] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_ProgramBinary); }
    if (!strcmp(name, "glFramebufferTexture2D")) { o_FbTex2D = reinterpret_cast<FbTex2DFn>(p); if (g_how[2].empty()) g_how[2] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_FbTex2D); }
    if (!strcmp(name, "glUseProgram")) { o_UseProgram = reinterpret_cast<ProgFn>(p); if (g_how[3].empty()) g_how[3] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_UseProgram); }
    if (!strcmp(name, "glLinkProgram")) { o_LinkProgram = reinterpret_cast<ProgFn>(p); if (g_how[4].empty()) g_how[4] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_LinkProgram); }
    if (!strcmp(name, "glDeleteProgram")) { o_DeleteProgram = reinterpret_cast<ProgFn>(p); if (g_how[5].empty()) g_how[5] = "egl"; return reinterpret_cast<__eglMustCastToProperFunctionPointerType>(&h_DeleteProgram); }
    return p;
}

bool hookSlot(const LoadedImage& im, const char* sym, void* hook, Slot& slot, void** origOut) {
    slot.addr = findPltSlot(im, sym);
    if (!slot.addr) return false;
    void* old = nullptr;
    if (!patchSlot(slot.addr, hook, &old)) { slot.addr = 0; return false; }
    slot.orig = old;
    *origOut = old;
    return true;
}

}  // namespace

void glhooksSetPaths(const std::string& dumpDir, const std::string& rulesPath) {
    std::lock_guard<std::mutex> l(g_mu);
    g_dumpDir = dumpDir;
    g_rulesPath = rulesPath;
    if (!dumpDir.empty()) mkdirs(dumpDir);
    traceSetDir(dumpDir);
    dpSetDir(dumpDir);
}

bool glhooksInstall(const LoadedImage& im) {
    int n = 0;
    void* o = nullptr;
    if (hookSlot(im, "glShaderSource", reinterpret_cast<void*>(&h_ShaderSource), s_ShaderSource, &o)) { o_ShaderSource = reinterpret_cast<ShaderSourceFn>(o); g_how[0] = "plt"; n++; }
    if (hookSlot(im, "glProgramBinary", reinterpret_cast<void*>(&h_ProgramBinary), s_ProgramBinary, &o)) { o_ProgramBinary = reinterpret_cast<ProgramBinaryFn>(o); g_how[1] = "plt"; n++; }
    if (hookSlot(im, "glFramebufferTexture2D", reinterpret_cast<void*>(&h_FbTex2D), s_FbTex2D, &o)) { o_FbTex2D = reinterpret_cast<FbTex2DFn>(o); g_how[2] = "plt"; n++; }
    if (hookSlot(im, "glUseProgram", reinterpret_cast<void*>(&h_UseProgram), s_Use, &o)) { o_UseProgram = reinterpret_cast<ProgFn>(o); g_how[3] = "plt"; n++; }
    if (hookSlot(im, "glLinkProgram", reinterpret_cast<void*>(&h_LinkProgram), s_Link, &o)) { o_LinkProgram = reinterpret_cast<ProgFn>(o); g_how[4] = "plt"; n++; }
    if (hookSlot(im, "glDeleteProgram", reinterpret_cast<void*>(&h_DeleteProgram), s_Delete, &o)) { o_DeleteProgram = reinterpret_cast<ProgFn>(o); g_how[5] = "plt"; n++; }
    // ES3 / late-bound functions arrive through eglGetProcAddress
    if (hookSlot(im, "eglGetProcAddress", reinterpret_cast<void*>(&h_GetProc), s_GetProc, &o)) { o_GetProc = reinterpret_cast<GetProcFn>(o); n++; }
    // Pasang hook depth/trace sejak awal agar toggle fitur dapat aktif real-time.
    // Callback internal tetap no-op ketika depth_pipe/trace OFF.
    {
        int tn = 0;
        const TraceHook* th = traceHooks(&tn);
        s_trace.assign(static_cast<size_t>(tn), Slot());
        int tc = 0;
        for (int i = 0; i < tn; i++) {
            void* oo = nullptr;
            if (hookSlot(im, th[i].name, th[i].hook, s_trace[static_cast<size_t>(i)], &oo)) { *th[i].orig = oo; tc++; }
        }
        traceSetInstalled(true);  // sisanya masuk lewat eglGetProcAddress
        LOG("depth/trace hooks via plt=%d dari %d", tc, tn);
        n += tc;
    }
    LOG("glhooks installed=%d (%s)", n, glhooksSummary().c_str());
    return n > 0;
}

void glhooksRemove() {
    if (s_ShaderSource.addr && s_ShaderSource.orig) restoreSlot(s_ShaderSource.addr, s_ShaderSource.orig);
    if (s_ProgramBinary.addr && s_ProgramBinary.orig) restoreSlot(s_ProgramBinary.addr, s_ProgramBinary.orig);
    if (s_FbTex2D.addr && s_FbTex2D.orig) restoreSlot(s_FbTex2D.addr, s_FbTex2D.orig);
    if (s_Use.addr && s_Use.orig) restoreSlot(s_Use.addr, s_Use.orig);
    if (s_Link.addr && s_Link.orig) restoreSlot(s_Link.addr, s_Link.orig);
    if (s_Delete.addr && s_Delete.orig) restoreSlot(s_Delete.addr, s_Delete.orig);
    if (s_GetProc.addr && s_GetProc.orig) restoreSlot(s_GetProc.addr, s_GetProc.orig);
    for (auto& sl : s_trace) if (sl.addr && sl.orig) restoreSlot(sl.addr, sl.orig);
}

GlStats glhooksStats() {
    std::lock_guard<std::mutex> l(g_mu);
    return g_stats;
}

std::string glhooksSummary() {
    auto f = [](const std::string& s) { return s.empty() ? std::string("none") : s; };
    return "ShaderSource=" + f(g_how[0]) + ",ProgramBinary=" + f(g_how[1]) + ",FbTex2D=" + f(g_how[2]) + ",Use=" + f(g_how[3]) + ",Link=" + f(g_how[4]) +
           ",live=" + std::to_string(g_liveRewritten) + "/" + std::to_string(g_liveUploads) +
           ",GetProc=" + (o_GetProc ? "hooked" : "none");
}

}  // namespace rz
