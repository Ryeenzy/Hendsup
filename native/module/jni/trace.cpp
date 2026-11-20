#include "trace.hpp"
#include "dpipe.hpp"

#include <GLES3/gl32.h>
#include <android/log.h>

#include <cstdarg>
#include <cstdio>
#include <cstring>
#include <map>
#include <mutex>
#include <set>
#include <vector>

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {
namespace {

struct TexInfo { int w = 0, h = 0, levels = 1; unsigned fmt = 0; const char* via = ""; };
struct FboInfo { unsigned color0 = 0, depth = 0, stencil = 0, depthStencil = 0; };

std::mutex g_tm;
bool g_installed = false, g_recording = false, g_done = false, g_lastNow = false;
std::string g_dir, g_buf;
std::map<unsigned, TexInfo> g_tex;
std::map<unsigned, FboInfo> g_fbo;
std::map<unsigned, std::string> g_shaderHash;           // shader id -> hash
std::map<unsigned, std::vector<std::string>> g_progHash;  // program id -> hash
unsigned g_curFbo = 0, g_curProg = 0, g_unit = 0, g_boundTex[32] = {0};
int g_frameDraws = 0;
constexpr size_t kMaxBuf = 1500000;

// pointer ke fungsi asli
void (*o_BindFramebuffer)(GLenum, GLuint) = nullptr;
void (*o_BindTexture)(GLenum, GLuint) = nullptr;
void (*o_ActiveTexture)(GLenum) = nullptr;
void (*o_TexStorage2D)(GLenum, GLsizei, GLenum, GLsizei, GLsizei) = nullptr;
void (*o_TexImage2D)(GLenum, GLint, GLint, GLsizei, GLsizei, GLint, GLenum, GLenum, const void*) = nullptr;
void (*o_Viewport)(GLint, GLint, GLsizei, GLsizei) = nullptr;
void (*o_Clear)(GLbitfield) = nullptr;
void (*o_DrawArrays)(GLenum, GLint, GLsizei) = nullptr;
void (*o_DrawElements)(GLenum, GLsizei, GLenum, const void*) = nullptr;
void (*o_DrawArraysInst)(GLenum, GLint, GLsizei, GLsizei) = nullptr;
void (*o_DrawElementsInst)(GLenum, GLsizei, GLenum, const void*, GLsizei) = nullptr;
void (*o_Invalidate)(GLenum, GLsizei, const GLenum*) = nullptr;
void (*o_AttachShader)(GLuint, GLuint) = nullptr;
void (*o_BlitFb)(GLint, GLint, GLint, GLint, GLint, GLint, GLint, GLint, GLbitfield, GLenum) = nullptr;

void add(const char* fmt, ...) __attribute__((format(printf, 1, 2)));
void add(const char* fmt, ...) {
    if (!g_recording || g_buf.size() > kMaxBuf) return;
    char b[512];
    va_list ap;
    va_start(ap, fmt);
    vsnprintf(b, sizeof b, fmt, ap);
    va_end(ap);
    g_buf += b;
    g_buf += '\n';
}

std::string hashes(unsigned prog) {
    auto it = g_progHash.find(prog);
    if (it == g_progHash.end()) return "-";
    std::string s;
    for (auto& h : it->second) { if (!s.empty()) s += ","; s += h; }
    return s;
}

// Daftar texture yang terikat di unit 0..7 saat draw (hanya saat merekam)
std::string unitsBound() {
    std::string s;
    for (int i = 0; i < 8; i++) {
        if (!g_boundTex[i]) continue;
        char b[24];
        snprintf(b, sizeof b, "%s%d=%u", s.empty() ? "" : " ", i, g_boundTex[i]);
        s += b;
    }
    return s.empty() ? "-" : s;
}

void h_BindFramebuffer(GLenum t, GLuint f) {
    if (!o_BindFramebuffer) return;
    { std::lock_guard<std::mutex> l(g_tm); if (t == GL_FRAMEBUFFER || t == GL_DRAW_FRAMEBUFFER) g_curFbo = f; add("bindfbo target=0x%x fbo=%u", t, f); }
    dpOnBindFbo(t, f);
    o_BindFramebuffer(t, f);
}
void h_ActiveTexture(GLenum u) {
    if (!o_ActiveTexture) return;
    { std::lock_guard<std::mutex> l(g_tm); g_unit = u >= GL_TEXTURE0 && u < GL_TEXTURE0 + 32 ? u - GL_TEXTURE0 : 0; }
    o_ActiveTexture(u);
}
void h_BindTexture(GLenum t, GLuint tex) {
    if (!o_BindTexture) return;
    { std::lock_guard<std::mutex> l(g_tm); if (t == GL_TEXTURE_2D) g_boundTex[g_unit & 31] = tex; }
    o_BindTexture(t, tex);
}
void h_TexStorage2D(GLenum t, GLsizei levels, GLenum fmt, GLsizei w, GLsizei h) {
    if (!o_TexStorage2D) return;
    { std::lock_guard<std::mutex> l(g_tm); unsigned id = g_boundTex[g_unit & 31]; if (t == GL_TEXTURE_2D && id) { TexInfo& ti = g_tex[id]; ti.w = w; ti.h = h; ti.levels = levels; ti.fmt = fmt; ti.via = "storage"; } }
    o_TexStorage2D(t, levels, fmt, w, h);
}
void h_TexImage2D(GLenum t, GLint lvl, GLint ifmt, GLsizei w, GLsizei h, GLint b, GLenum f, GLenum ty, const void* d) {
    if (!o_TexImage2D) return;
    { std::lock_guard<std::mutex> l(g_tm); unsigned id = g_boundTex[g_unit & 31]; if (t == GL_TEXTURE_2D && lvl == 0 && id) { TexInfo& ti = g_tex[id]; ti.w = w; ti.h = h; ti.fmt = static_cast<unsigned>(ifmt); ti.via = "image"; } }
    o_TexImage2D(t, lvl, ifmt, w, h, b, f, ty, d);
}
void h_Viewport(GLint x, GLint y, GLsizei w, GLsizei h) {
    if (!o_Viewport) return;
    { std::lock_guard<std::mutex> l(g_tm); add("viewport %d %d %d %d (fbo=%u)", x, y, w, h, g_curFbo); }
    dpOnViewport(x, y, w, h);
    o_Viewport(x, y, w, h);
}
void h_Clear(GLbitfield m) {
    if (!o_Clear) return;
    { std::lock_guard<std::mutex> l(g_tm); add("clear mask=0x%x fbo=%u", m, g_curFbo); }
    o_Clear(m);
}
void logDraw(const char* kind, GLenum mode, GLsizei count, GLsizei inst) {
    std::lock_guard<std::mutex> l(g_tm);
    if (!g_recording) return;
    g_frameDraws++;
    add("draw %s mode=0x%x count=%d inst=%d fbo=%u prog=%u hash=%s tex[%s]", kind, mode, count, inst, g_curFbo, g_curProg, hashes(g_curProg).c_str(), unitsBound().c_str());
}
void h_DrawArrays(GLenum m, GLint f, GLsizei c) { if (!o_DrawArrays) return; logDraw("arrays", m, c, 1); dpBeforeDraw(m, c); o_DrawArrays(m, f, c); dpAfterDraw(m, c); }
void h_DrawElements(GLenum m, GLsizei c, GLenum t, const void* i) { if (!o_DrawElements) return; logDraw("elements", m, c, 1); dpBeforeDraw(m, c); o_DrawElements(m, c, t, i); dpAfterDraw(m, c); }
void h_DrawArraysInst(GLenum m, GLint f, GLsizei c, GLsizei n) { if (!o_DrawArraysInst) return; logDraw("arraysInst", m, c, n); dpBeforeDraw(m, c); o_DrawArraysInst(m, f, c, n); dpAfterDraw(m, c); }
void h_DrawElementsInst(GLenum m, GLsizei c, GLenum t, const void* i, GLsizei n) { if (!o_DrawElementsInst) return; logDraw("elementsInst", m, c, n); dpBeforeDraw(m, c); o_DrawElementsInst(m, c, t, i, n); dpAfterDraw(m, c); }
void h_Invalidate(GLenum t, GLsizei n, const GLenum* a) {
    if (!o_Invalidate) return;
    { std::lock_guard<std::mutex> l(g_tm); std::string s; for (GLsizei i = 0; i < n && a && i < 8; i++) { char b[16]; snprintf(b, sizeof b, "0x%x ", a[i]); s += b; } add("invalidate fbo=%u att=%s", g_curFbo, s.c_str()); }
    dpOnInvalidate(t, n, a);
    o_Invalidate(t, n, a);
}
void h_AttachShader(GLuint prog, GLuint sh) {
    if (!o_AttachShader) return;
    { std::lock_guard<std::mutex> l(g_tm); auto it = g_shaderHash.find(sh); if (it != g_shaderHash.end()) g_progHash[prog].push_back(it->second); }
    o_AttachShader(prog, sh);
}
void h_BlitFb(GLint a, GLint b, GLint c, GLint d, GLint e, GLint f, GLint g, GLint h, GLbitfield m, GLenum fl) {
    if (!o_BlitFb) return;
    { std::lock_guard<std::mutex> l(g_tm); add("blit src(%d,%d,%d,%d) dst(%d,%d,%d,%d) mask=0x%x", a, b, c, d, e, f, g, h, m); }
    o_BlitFb(a, b, c, d, e, f, g, h, m, fl);
    dpAfterBlit();
}
void (*o_DepthFunc)(GLenum) = nullptr;
void (*o_Uniform4fv)(GLint, GLsizei, const GLfloat*) = nullptr;
void h_DepthFunc(GLenum f) { if (!o_DepthFunc) return; dpOnDepthFunc(f); o_DepthFunc(f); }
void h_Uniform4fv(GLint l, GLsizei c, const GLfloat* v) { if (!o_Uniform4fv) return; dpOnUniform4fv(c, v); o_Uniform4fv(l, c, v); }

TraceHook kHooks[] = {
    {"glBindFramebuffer", reinterpret_cast<void*>(&h_BindFramebuffer), reinterpret_cast<void**>(&o_BindFramebuffer)},
    {"glBindTexture", reinterpret_cast<void*>(&h_BindTexture), reinterpret_cast<void**>(&o_BindTexture)},
    {"glActiveTexture", reinterpret_cast<void*>(&h_ActiveTexture), reinterpret_cast<void**>(&o_ActiveTexture)},
    {"glTexStorage2D", reinterpret_cast<void*>(&h_TexStorage2D), reinterpret_cast<void**>(&o_TexStorage2D)},
    {"glTexImage2D", reinterpret_cast<void*>(&h_TexImage2D), reinterpret_cast<void**>(&o_TexImage2D)},
    {"glViewport", reinterpret_cast<void*>(&h_Viewport), reinterpret_cast<void**>(&o_Viewport)},
    {"glClear", reinterpret_cast<void*>(&h_Clear), reinterpret_cast<void**>(&o_Clear)},
    {"glDrawArrays", reinterpret_cast<void*>(&h_DrawArrays), reinterpret_cast<void**>(&o_DrawArrays)},
    {"glDrawElements", reinterpret_cast<void*>(&h_DrawElements), reinterpret_cast<void**>(&o_DrawElements)},
    {"glDrawArraysInstanced", reinterpret_cast<void*>(&h_DrawArraysInst), reinterpret_cast<void**>(&o_DrawArraysInst)},
    {"glDrawElementsInstanced", reinterpret_cast<void*>(&h_DrawElementsInst), reinterpret_cast<void**>(&o_DrawElementsInst)},
    {"glInvalidateFramebuffer", reinterpret_cast<void*>(&h_Invalidate), reinterpret_cast<void**>(&o_Invalidate)},
    {"glAttachShader", reinterpret_cast<void*>(&h_AttachShader), reinterpret_cast<void**>(&o_AttachShader)},
    {"glBlitFramebuffer", reinterpret_cast<void*>(&h_BlitFb), reinterpret_cast<void**>(&o_BlitFb)},
    {"glDepthFunc", reinterpret_cast<void*>(&h_DepthFunc), reinterpret_cast<void**>(&o_DepthFunc)},
    {"glUniform4fv", reinterpret_cast<void*>(&h_Uniform4fv), reinterpret_cast<void**>(&o_Uniform4fv)},
};

const char* fmtName(unsigned f) {
    switch (f) {
        case GL_DEPTH_COMPONENT16: return "DEPTH16";
        case GL_DEPTH_COMPONENT24: return "DEPTH24";
        case GL_DEPTH_COMPONENT32F: return "DEPTH32F";
        case GL_DEPTH24_STENCIL8: return "DEPTH24_STENCIL8";
        case GL_DEPTH32F_STENCIL8: return "DEPTH32F_STENCIL8";
        case GL_RGBA8: return "RGBA8";
        case GL_RGB8: return "RGB8";
        case GL_R8: return "R8";
        case GL_RG8: return "RG8";
        case GL_R16F: return "R16F";
        case GL_RG16F: return "RG16F";
        case GL_RGBA16F: return "RGBA16F";
        case GL_R32F: return "R32F";
        case GL_RGB10_A2: return "RGB10_A2";
        case GL_R11F_G11F_B10F: return "R11G11B10F";
        case GL_SRGB8_ALPHA8: return "SRGB8_A8";
        default: return "";
    }
}

void finish() {
    std::string out;
    char b[256];
    out += "# RYEENZYXNZ trace frame\n== textures (dibuat sejak start) ==\n";
    for (auto& kv : g_tex) {
        snprintf(b, sizeof b, "tex %u: %dx%d levels=%d fmt=0x%x %s via=%s\n", kv.first, kv.second.w, kv.second.h, kv.second.levels, kv.second.fmt, fmtName(kv.second.fmt), kv.second.via);
        out += b;
    }
    out += "== fbo attachments ==\n";
    for (auto& kv : g_fbo) {
        snprintf(b, sizeof b, "fbo %u: color0=%u depth=%u stencil=%u depthStencil=%u\n", kv.first, kv.second.color0, kv.second.depth, kv.second.stencil, kv.second.depthStencil);
        out += b;
    }
    snprintf(b, sizeof b, "== frame (draws=%d) ==\n", g_frameDraws);
    out += b;
    out += g_buf;
    FILE* f = fopen((g_dir + "/trace_frame.txt").c_str(), "w");
    if (f) { fwrite(out.data(), 1, out.size(), f); fclose(f); }
    LOG("trace frame ditulis: %zu byte, draws=%d, tex=%zu", out.size(), g_frameDraws, g_tex.size());
}

}  // namespace

const TraceHook* traceHooks(int* count) { *count = static_cast<int>(sizeof kHooks / sizeof kHooks[0]); return kHooks; }
void traceSetDir(const std::string& dir) { std::lock_guard<std::mutex> l(g_tm); g_dir = dir; }
bool traceInstalled() { return g_installed; }
void traceSetInstalled(bool v) { g_installed = v; }

void traceShaderHash(unsigned shader, const std::string& hash) {
    if (!g_installed) return;
    std::lock_guard<std::mutex> l(g_tm);
    g_shaderHash[shader] = hash;
}
void traceOnUseProgram(unsigned program) {
    if (!g_installed) return;
    std::lock_guard<std::mutex> l(g_tm);
    g_curProg = program;
    add("use prog=%u hash=%s", program, hashes(program).c_str());
}
void traceOnFbTex(unsigned target, unsigned attachment, unsigned tex, int level) {
    if (!g_installed) return;
    std::lock_guard<std::mutex> l(g_tm);
    (void)target; (void)level;
    FboInfo& fi = g_fbo[g_curFbo];
    if (attachment == GL_COLOR_ATTACHMENT0) fi.color0 = tex;
    else if (attachment == GL_DEPTH_ATTACHMENT) fi.depth = tex;
    else if (attachment == GL_STENCIL_ATTACHMENT) fi.stencil = tex;
    else if (attachment == GL_DEPTH_STENCIL_ATTACHMENT) fi.depthStencil = tex;
    add("fbtex fbo=%u att=0x%x tex=%u", g_curFbo, attachment, tex);
}

void traceOnSwap(bool traceNow) {
    if (!g_installed) return;
    std::lock_guard<std::mutex> l(g_tm);
    if (g_recording) {  // frame yang direkam selesai
        g_recording = false;
        g_done = true;
        finish();
        g_buf.clear();
    } else if (traceNow && !g_lastNow && !g_done) {  // tepi naik: mulai rekam frame berikutnya
        g_buf.clear();
        g_frameDraws = 0;
        g_recording = true;
        LOG("trace frame: mulai merekam");
    }
    if (!traceNow) g_done = false;  // matikan lalu nyalakan lagi = rekam ulang
    g_lastNow = traceNow;
}

}  // namespace rz
