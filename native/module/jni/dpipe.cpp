#include "dpipe.hpp"

#include <EGL/egl.h>
#include <GLES3/gl32.h>
#include <android/log.h>
#include <sys/syscall.h>
#include <unistd.h>

#include <chrono>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <map>
#include <string>
#include <vector>

#include "core.hpp"
#include "dpipe_shaders.hpp"
#include "dpmath.hpp"
#include "fxrt.hpp"
#include "liveshader.hpp"

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {

namespace {

struct Rt { GLuint tex = 0, fbo = 0; int w = 0, h = 0; };
struct Prog {
    GLuint id = 0;
    GLint u[32];
    Prog() { for (auto& x : u) x = -1; }
};

const char* kU[] = {"uColor", "uDepth", "uTexA", "uTexB", "uTexC", "uHist", "uFocus", "uInvVP", "uVP", "uPrevVP", "uCam", "uView",
                    "uMx0", "uMx1", "uMx2", "uMx3", "uSs0", "uSs1", "uSs2", "uDf0", "uDf1", "uDf2", "uDf3", "uDbg", "uOl0", "uOl1", "uOl2"};
constexpr int kUN = sizeof kU / sizeof kU[0];

// ---- keadaan pelacakan
long g_tid = 0;                // thread render (thread pemanggil eglSwapBuffers)
unsigned g_cur = 0;            // FBO draw aktif
std::map<unsigned, int> g_vpW, g_vpH;
unsigned g_depthFunc = 0;
float g_cb0[61 * 4];
bool g_cb0Seen = false;
bool g_msaa = false;
unsigned g_cb0Prog = 0;                 // program terakhir yang punya CB0 dipakai di FBO non-default
struct Cb0Locs { int loc[4]; bool ok; int ubo; int uboOff; };   // ubo >= 0: CB0 ada di uniform block (titik ikat ubo, offset byte uboOff)
std::map<unsigned, Cb0Locs> g_hasCb0;   // lokasi uniform CB0[0..3] per program
long g_probeOk = 0, g_probeFail = 0, g_uboReads = 0, g_uboFail = 0;
long g_uboDiag[9] = {0}, g_uboWhy[5] = {0};   // diag: bind,buf,start,size,off,err,mapErr,copyErr,map2Err; why: buf0,glerr,size,mapA,copy
GLuint g_cpBuf = 0;
std::string g_probeDiag;                // nama uniform "CB*" dari program pertama yang gagal
long g_u4Calls = 0, g_u4Max = 0, g_cb0Reads = 0;
bool g_failed = false;
bool g_cfgDp = false, g_cfgSafe = false, g_cfgDis = false;
bool g_enabled = false;  // di-cache tiap frame (hook dipanggil ribuan kali per frame)
std::string g_failWhy, g_dir;
int g_bbW = 0, g_bbH = 0;
long g_frame = 0, g_ran = 0, g_captures = 0;
bool g_capturedFrame = false, g_pending = false, g_validFrame = false;
long g_drawsInCur = 0;
std::string g_note;            // catatan terakhir (format depth dll)

// ---- hasil tangkapan frame ini
float g_sceneVP[16];           // baris-mayor: baris i = CB0[i]
float g_cam[3];
bool g_reversed = false;
int g_dW = 0, g_dH = 0;
GLenum g_dFmt = 0;
GLuint g_dTex = 0, g_dFbo = 0;
float g_prevVP[16];
bool g_prevValid = false;

void* g_ctx = nullptr;
Prog g_prog[6];
Rt g_rdepth;                 // depth sandi ReShade (R32F) untuk runtime FX
Rt g_color, g_ao[2], g_ss[2], g_comp, g_focus[2];
int g_aoIdx = 0, g_ssIdx = 0, g_fcIdx = 0;
GLuint g_vao = 0;
std::chrono::steady_clock::time_point g_lastWrite;

long tid() { return static_cast<long>(syscall(SYS_gettid)); }
bool onRender() { return g_tid != 0 && tid() == g_tid; }

void writeStatus() {
    if (g_dir.empty()) return;
    char b[3200];
    snprintf(b, sizeof b,
             "depth_pipe: %s (config depth_pipe=%d safe=%d disable=%d g_dir=%s tid=%ld)\nfailed: %s\nframes=%ld captures=%ld passes_run=%ld\nbackbuffer=%dx%d\ndepth_copy=%dx%d fmt=0x%x reversed=%d\ncb0_seen=%d cb0_reads=%ld cb0_prog=%u\n"
             "u4fv_calls=%ld u4fv_maxcount=%ld\nmsaa=%d probe_ok=%ld probe_fail=%ld ubo_reads=%ld ubo_fail=%ld\n%s\nprobe=%s\nubo_diag=bind:%ld buf:%ld start:%ld size:%ld off:%ld err:0x%lx mapA_err:0x%lx copy_err:0x%lx map2_err:0x%lx\nubo_why=buf0:%ld glerr:%ld size:%ld mapA:%ld copy:%ld\nnote=%s\n",
             g_failed ? "GAGAL" : (g_enabled ? "aktif" : "NONAKTIF"), g_cfgDp ? 1 : 0, g_cfgSafe ? 1 : 0, g_cfgDis ? 1 : 0, g_dir.c_str(), g_tid, g_failWhy.c_str(), g_frame, g_captures, g_ran, g_bbW, g_bbH, g_dW, g_dH, g_dFmt, g_reversed ? 1 : 0, g_cb0Seen ? 1 : 0, g_cb0Reads, g_cb0Prog,
             g_u4Calls, g_u4Max, g_msaa ? 1 : 0, g_probeOk, g_probeFail, g_uboReads, g_uboFail, fxrtStatus().c_str(), g_probeDiag.c_str(), g_uboDiag[0], g_uboDiag[1], g_uboDiag[2], g_uboDiag[3], g_uboDiag[4], g_uboDiag[5], g_uboDiag[6], g_uboDiag[7], g_uboDiag[8], g_uboWhy[0], g_uboWhy[1], g_uboWhy[2], g_uboWhy[3], g_uboWhy[4], g_note.c_str());
    FILE* f = fopen((g_dir + "/dp_status.txt").c_str(), "w");
    if (f) { fputs(b, f); fclose(f); }
}

void fail(const std::string& why) {
    if (g_failed) return;
    g_failed = true;
    g_failWhy = why;
    LOG("depth pipeline dimatikan: %s", why.c_str());
    writeStatus();
}

GLuint compile(GLenum type, const std::string& src) {
    GLuint s = glCreateShader(type);
    const char* c = src.c_str();
    glShaderSource(s, 1, &c, nullptr);
    glCompileShader(s);
    GLint ok = 0;
    glGetShaderiv(s, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[600] = {0};
        glGetShaderInfoLog(s, sizeof log - 1, nullptr, log);
        g_note = std::string("compile: ") + log;
        LOG("dpipe compile: %s", log);
        glDeleteShader(s);
        return 0;
    }
    return s;
}

bool buildProg(int i) {
    Prog& p = g_prog[i];
    if (p.id) return true;
    GLuint v = compile(GL_VERTEX_SHADER, dpVertex()), f = compile(GL_FRAGMENT_SHADER, dpFragment(static_cast<DpPass>(i)));
    if (!v || !f) return false;
    GLuint id = glCreateProgram();
    glAttachShader(id, v);
    glAttachShader(id, f);
    glLinkProgram(id);
    glDeleteShader(v);
    glDeleteShader(f);
    GLint ok = 0;
    glGetProgramiv(id, GL_LINK_STATUS, &ok);
    if (!ok) {
        char log[600] = {0};
        glGetProgramInfoLog(id, sizeof log - 1, nullptr, log);
        g_note = std::string("link: ") + log;
        glDeleteProgram(id);
        return false;
    }
    p.id = id;
    for (int k = 0; k < kUN; k++) p.u[k] = glGetUniformLocation(id, kU[k]);
    return true;
}

bool ensureRt(Rt& r, int w, int h, GLenum ifmt = GL_RGBA16F) {
    if (r.tex && r.w == w && r.h == h) return true;
    if (r.tex) glDeleteTextures(1, &r.tex);
    if (r.fbo) glDeleteFramebuffers(1, &r.fbo);
    r = Rt();
    glGenTextures(1, &r.tex);
    glBindTexture(GL_TEXTURE_2D, r.tex);
    glTexStorage2D(GL_TEXTURE_2D, 1, ifmt, w, h);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glGenFramebuffers(1, &r.fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, r.fbo);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, r.tex, 0);
    GLenum st = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    r.w = w;
    r.h = h;
    if (st != GL_FRAMEBUFFER_COMPLETE) { g_note = "FBO fx tidak lengkap"; return false; }
    // bersihkan agar histori awal nol
    const GLfloat z[4] = {0, 0, 0, 0};
    glClearBufferfv(GL_COLOR, 0, z);
    return true;
}

struct GLState {
    GLint prog = 0, activeTex = 0, vao = 0, readFb = 0, drawFb = 0;
    GLint tex[8] = {0}, samp[8] = {0};
    GLint vp[4] = {0}, sc[4] = {0};
    GLboolean cm[4] = {1, 1, 1, 1}, dm = 1;
    GLboolean blend = 0, depth = 0, cull = 0, scissor = 0, stencil = 0, discard = 0, a2c = 0, dither = 0;
    void save() {
        glGetIntegerv(GL_CURRENT_PROGRAM, &prog);
        glGetIntegerv(GL_ACTIVE_TEXTURE, &activeTex);
        for (int i = 0; i < 8; i++) {
            glActiveTexture(GL_TEXTURE0 + i);
            glGetIntegerv(GL_TEXTURE_BINDING_2D, &tex[i]);
            glGetIntegerv(GL_SAMPLER_BINDING, &samp[i]);
        }
        glActiveTexture(static_cast<GLenum>(activeTex));
        glGetIntegerv(GL_VERTEX_ARRAY_BINDING, &vao);
        glGetIntegerv(GL_READ_FRAMEBUFFER_BINDING, &readFb);
        glGetIntegerv(GL_DRAW_FRAMEBUFFER_BINDING, &drawFb);
        glGetIntegerv(GL_VIEWPORT, vp);
        glGetIntegerv(GL_SCISSOR_BOX, sc);
        glGetBooleanv(GL_COLOR_WRITEMASK, cm);
        glGetBooleanv(GL_DEPTH_WRITEMASK, &dm);
        blend = glIsEnabled(GL_BLEND);
        depth = glIsEnabled(GL_DEPTH_TEST);
        cull = glIsEnabled(GL_CULL_FACE);
        scissor = glIsEnabled(GL_SCISSOR_TEST);
        stencil = glIsEnabled(GL_STENCIL_TEST);
        discard = glIsEnabled(GL_RASTERIZER_DISCARD);
        a2c = glIsEnabled(GL_SAMPLE_ALPHA_TO_COVERAGE);
        dither = glIsEnabled(GL_DITHER);
    }
    static void cap(GLenum c, GLboolean on) { on ? glEnable(c) : glDisable(c); }
    void restore() const {
        glBindFramebuffer(GL_READ_FRAMEBUFFER, static_cast<GLuint>(readFb));
        glBindFramebuffer(GL_DRAW_FRAMEBUFFER, static_cast<GLuint>(drawFb));
        for (int i = 0; i < 8; i++) {
            glActiveTexture(GL_TEXTURE0 + i);
            glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(tex[i]));
            glBindSampler(i, static_cast<GLuint>(samp[i]));
        }
        glActiveTexture(static_cast<GLenum>(activeTex));
        glUseProgram(static_cast<GLuint>(prog));
        glBindVertexArray(static_cast<GLuint>(vao));
        glViewport(vp[0], vp[1], vp[2], vp[3]);
        glScissor(sc[0], sc[1], sc[2], sc[3]);
        glColorMask(cm[0], cm[1], cm[2], cm[3]);
        glDepthMask(dm);
        cap(GL_BLEND, blend);
        cap(GL_DEPTH_TEST, depth);
        cap(GL_CULL_FACE, cull);
        cap(GL_SCISSOR_TEST, scissor);
        cap(GL_STENCIL_TEST, stencil);
        cap(GL_RASTERIZER_DISCARD, discard);
        cap(GL_SAMPLE_ALPHA_TO_COVERAGE, a2c);
        cap(GL_DITHER, dither);
    }
};

void resetCtx() {
    g_dTex = g_dFbo = 0;
    g_dW = g_dH = 0;
    for (auto& p : g_prog) p = Prog();
    g_color = Rt(); g_comp = Rt();
    for (int i = 0; i < 2; i++) { g_ao[i] = Rt(); g_ss[i] = Rt(); g_focus[i] = Rt(); }
    g_vao = 0;
    g_cpBuf = 0;
    g_rdepth = Rt();
    fxrtReset();
    g_prevValid = false;
}

float clampf(float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); }

// Baca CB0 langsung dari program shader scene (tak bergantung pada pola unggahan Roblox).
bool readCb0() {
    if (!g_cb0Prog || !glIsProgram(g_cb0Prog)) return g_cb0Seen;
    auto it = g_hasCb0.find(g_cb0Prog);
    if (it == g_hasCb0.end() || !it->second.ok) return g_cb0Seen;
    while (glGetError() != GL_NO_ERROR) {}
    float tmp[4][4];
    if (it->second.ubo >= 0) {
        // CB0 ada di uniform block: baca isi buffer yang sedang terikat di titik ikat itu
        GLint buf = 0;
        GLint64 st64 = 0, sz64 = 0;
        GLuint bnd = static_cast<GLuint>(it->second.ubo);
        glGetIntegeri_v(GL_UNIFORM_BUFFER_BINDING, bnd, &buf);
        glGetInteger64i_v(GL_UNIFORM_BUFFER_START, bnd, &st64);
        glGetInteger64i_v(GL_UNIFORM_BUFFER_SIZE, bnd, &sz64);
        GLenum e0 = glGetError();
        g_uboDiag[0] = it->second.ubo; g_uboDiag[1] = buf; g_uboDiag[2] = static_cast<long>(st64); g_uboDiag[3] = static_cast<long>(sz64);
        g_uboDiag[4] = it->second.uboOff; g_uboDiag[5] = static_cast<long>(e0);
        if (buf == 0 || e0 != GL_NO_ERROR) { g_uboFail++; g_uboWhy[buf == 0 ? 0 : 1]++; return g_cb0Seen; }
        GLint off = static_cast<GLint>(st64) + it->second.uboOff;
        if (sz64 > 0 && it->second.uboOff + 64 > sz64) { g_uboFail++; g_uboWhy[2]++; return g_cb0Seen; }
        GLint prev = 0, prevW = 0;
        glGetIntegerv(GL_COPY_READ_BUFFER_BINDING, &prev);
        glGetIntegerv(GL_COPY_WRITE_BUFFER_BINDING, &prevW);
        bool okm = false;
        // A: map langsung
        glBindBuffer(GL_COPY_READ_BUFFER, static_cast<GLuint>(buf));
        void* m = glMapBufferRange(GL_COPY_READ_BUFFER, off, 64, GL_MAP_READ_BIT);
        if (m) { memcpy(tmp, m, 64); glUnmapBuffer(GL_COPY_READ_BUFFER); okm = true; }
        else { g_uboDiag[6] = static_cast<long>(glGetError()); g_uboWhy[3]++; }
        // B: salin ke buffer milik kita lalu baca
        if (!okm) {
            while (glGetError() != GL_NO_ERROR) {}
            if (!g_cpBuf) {
                glGenBuffers(1, &g_cpBuf);
                glBindBuffer(GL_COPY_WRITE_BUFFER, g_cpBuf);
                glBufferData(GL_COPY_WRITE_BUFFER, 64, nullptr, GL_STREAM_READ);
            }
            glBindBuffer(GL_COPY_WRITE_BUFFER, g_cpBuf);
            glCopyBufferSubData(GL_COPY_READ_BUFFER, GL_COPY_WRITE_BUFFER, off, 0, 64);
            GLenum e1 = glGetError();
            if (e1 == GL_NO_ERROR) {
                void* m2 = glMapBufferRange(GL_COPY_WRITE_BUFFER, 0, 64, GL_MAP_READ_BIT);
                if (m2) { memcpy(tmp, m2, 64); glUnmapBuffer(GL_COPY_WRITE_BUFFER); okm = true; }
                else g_uboDiag[8] = static_cast<long>(glGetError());
            } else { g_uboDiag[7] = static_cast<long>(e1); g_uboWhy[4]++; }
        }
        glBindBuffer(GL_COPY_READ_BUFFER, static_cast<GLuint>(prev));
        glBindBuffer(GL_COPY_WRITE_BUFFER, static_cast<GLuint>(prevW));
        while (glGetError() != GL_NO_ERROR) {}
        if (!okm) { g_uboFail++; return g_cb0Seen; }
        g_uboReads++;
    } else {
        for (int i = 0; i < 4; i++) glGetUniformfv(g_cb0Prog, it->second.loc[i], tmp[i]);
        if (glGetError() != GL_NO_ERROR) return g_cb0Seen;
    }
    for (int i = 0; i < 4; i++) memcpy(g_cb0 + i * 4, tmp[i], sizeof tmp[i]);
    g_cb0Seen = true;
    g_cb0Reads++;
    return true;
}

// cari lokasi CB0[0..3]: nama per elemen, lalu "CB0[0]"/"CB0" + offset, lalu enumerasi uniform aktif
Cb0Locs probeCb0(unsigned prog) {
    Cb0Locs r{{-1, -1, -1, -1}, false, -1, 0};
    while (glGetError() != GL_NO_ERROR) {}
    bool all = true;
    for (int i = 0; i < 4; i++) {
        char nm[16];
        snprintf(nm, sizeof nm, "CB0[%d]", i);
        r.loc[i] = glGetUniformLocation(prog, nm);
        if (r.loc[i] < 0) all = false;
    }
    if (!all) {
        GLint base = glGetUniformLocation(prog, "CB0[0]");
        if (base < 0) base = glGetUniformLocation(prog, "CB0");
        if (base >= 0) { for (int i = 0; i < 4; i++) r.loc[i] = base + i; all = true; }
    }
    while (glGetError() != GL_NO_ERROR) {}
    if (!all) {
        // Roblox GLES: CB0 sering berada di uniform block. Cari uniform aktif "CB0[0]"/"CB0" dan block pemiliknya.
        const char* names[2] = {"CB0[0]", "CB0"};
        for (int k = 0; k < 2 && !all; k++) {
            GLuint idx = GL_INVALID_INDEX;
            glGetUniformIndices(prog, 1, &names[k], &idx);
            if (idx == GL_INVALID_INDEX) continue;
            GLint blk = -1, off = 0;
            glGetActiveUniformsiv(prog, 1, &idx, GL_UNIFORM_BLOCK_INDEX, &blk);
            glGetActiveUniformsiv(prog, 1, &idx, GL_UNIFORM_OFFSET, &off);
            if (blk < 0) continue;
            GLint bind = -1;
            glGetActiveUniformBlockiv(prog, static_cast<GLuint>(blk), GL_UNIFORM_BLOCK_BINDING, &bind);
            if (bind >= 0 && glGetError() == GL_NO_ERROR) { r.ubo = bind; r.uboOff = off; all = true; }
        }
    }
    while (glGetError() != GL_NO_ERROR) {}
    if (!all && g_probeDiag.empty()) {
        GLint n = 0, maxLen = 0, blocks = 0;
        glGetProgramiv(prog, GL_ACTIVE_UNIFORMS, &n);
        glGetProgramiv(prog, GL_ACTIVE_UNIFORM_MAX_LENGTH, &maxLen);
        glGetProgramiv(prog, GL_ACTIVE_UNIFORM_BLOCKS, &blocks);
        char b[160];
        snprintf(b, sizeof b, "prog=%u uniforms=%d blocks=%d:", prog, n, blocks);
        g_probeDiag = b;
        std::vector<char> nm(static_cast<size_t>(maxLen > 0 ? maxLen : 64) + 1);
        int shown = 0;
        for (int i = 0; i < n && shown < 6; i++) {
            GLint sz = 0; GLenum ty = 0; GLsizei len = 0;
            glGetActiveUniform(prog, static_cast<GLuint>(i), static_cast<GLsizei>(nm.size() - 1), &len, &sz, &ty, nm.data());
            nm[static_cast<size_t>(len)] = 0;
            if (nm[0] == 'C' && nm[1] == 'B') {
                snprintf(b, sizeof b, " %s(loc=%d,n=%d)", nm.data(), glGetUniformLocation(prog, nm.data()), sz);
                g_probeDiag += b;
                shown++;
            }
        }
        while (glGetError() != GL_NO_ERROR) {}
    }
    r.ok = all;
    return r;
}

// ---- tangkap depth dari FBO yang sedang terikat (draw)
void tryCapture(unsigned fbo) {
    if (g_failed || fbo == 0) return;
    auto itw = g_vpW.find(fbo);
    if (itw == g_vpW.end()) return;
    int w = itw->second, h = g_vpH[fbo];
    if (w < 200 || h < 120) return;
    if (g_bbW > 0 && static_cast<long>(w) * h < static_cast<long>(g_bbW) * g_bbH / 8) return;  // kecil: shadow map dll
    if (g_capturedFrame && static_cast<long>(w) * h < static_cast<long>(g_dW) * g_dH) return;
    void* ctx = eglGetCurrentContext();
    if (ctx == EGL_NO_CONTEXT) return;
    if (ctx != g_ctx) { g_ctx = ctx; resetCtx(); }
    while (glGetError() != GL_NO_ERROR) {}

    GLint type = 0;
    glGetFramebufferAttachmentParameteriv(GL_DRAW_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE, &type);
    if (glGetError() != GL_NO_ERROR || type == GL_NONE) {
        glGetFramebufferAttachmentParameteriv(GL_DRAW_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE, &type);
        if (glGetError() != GL_NO_ERROR || type == GL_NONE) return;
    }
    GLint name = 0, fmt = 0, samples = 0;
    glGetFramebufferAttachmentParameteriv(GL_DRAW_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME, &name);
    if (type == GL_RENDERBUFFER) {
        GLint prevRb = 0;
        glGetIntegerv(GL_RENDERBUFFER_BINDING, &prevRb);
        glBindRenderbuffer(GL_RENDERBUFFER, static_cast<GLuint>(name));
        glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_INTERNAL_FORMAT, &fmt);
        glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_SAMPLES, &samples);
        glBindRenderbuffer(GL_RENDERBUFFER, static_cast<GLuint>(prevRb));
    } else if (type == GL_TEXTURE) {
        GLint level = 0, prevTex = 0;
        glGetFramebufferAttachmentParameteriv(GL_DRAW_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL, &level);
        glGetIntegerv(GL_TEXTURE_BINDING_2D, &prevTex);
        glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(name));
        glGetTexLevelParameteriv(GL_TEXTURE_2D, level, GL_TEXTURE_INTERNAL_FORMAT, &fmt);
        glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(prevTex));
    }
    if (glGetError() != GL_NO_ERROR || fmt == 0) { g_note = "tak bisa membaca format depth"; return; }
    g_msaa = samples > 0;
    const bool ds = fmt == GL_DEPTH24_STENCIL8 || fmt == GL_DEPTH32F_STENCIL8;
    if (!(ds || fmt == GL_DEPTH_COMPONENT16 || fmt == GL_DEPTH_COMPONENT24 || fmt == GL_DEPTH_COMPONENT32F)) {
        char b[64]; snprintf(b, sizeof b, "format depth tak dikenal 0x%x", fmt); g_note = b; return;
    }

    GLint prevRead = 0, prevTex = 0, prevActive = 0;
    GLboolean scissor = glIsEnabled(GL_SCISSOR_TEST);
    glGetIntegerv(GL_READ_FRAMEBUFFER_BINDING, &prevRead);
    glGetIntegerv(GL_ACTIVE_TEXTURE, &prevActive);
    glActiveTexture(GL_TEXTURE0);
    glGetIntegerv(GL_TEXTURE_BINDING_2D, &prevTex);
    if (!g_dTex || g_dW != w || g_dH != h || g_dFmt != static_cast<GLenum>(fmt)) {
        if (g_dTex) glDeleteTextures(1, &g_dTex);
        if (g_dFbo) glDeleteFramebuffers(1, &g_dFbo);
        glGenTextures(1, &g_dTex);
        glBindTexture(GL_TEXTURE_2D, g_dTex);
        glTexStorage2D(GL_TEXTURE_2D, 1, static_cast<GLenum>(fmt), w, h);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glGenFramebuffers(1, &g_dFbo);
        glBindFramebuffer(GL_DRAW_FRAMEBUFFER, g_dFbo);
        glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, ds ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, g_dTex, 0);
        g_dW = w; g_dH = h; g_dFmt = static_cast<GLenum>(fmt);
    }
    glBindFramebuffer(GL_READ_FRAMEBUFFER, fbo);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, g_dFbo);
    glDisable(GL_SCISSOR_TEST);
    glBlitFramebuffer(0, 0, w, h, 0, 0, w, h, GL_DEPTH_BUFFER_BIT, GL_NEAREST);
    // kembalikan keadaan
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, fbo);
    glBindFramebuffer(GL_READ_FRAMEBUFFER, static_cast<GLuint>(prevRead));
    glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(prevTex));
    glActiveTexture(static_cast<GLenum>(prevActive));
    if (scissor) glEnable(GL_SCISSOR_TEST);
    GLenum err = glGetError();
    if (err != GL_NO_ERROR) {
        char b[96]; snprintf(b, sizeof b, "GL error 0x%x saat menyalin depth (fmt 0x%x, %dx%d)", err, fmt, w, h);
        fail(b);
        return;
    }
    g_capturedFrame = true;
    readCb0();
    g_validFrame = g_cb0Seen;
    g_captures++;
    memcpy(g_sceneVP, g_cb0, sizeof g_sceneVP);
    const Config cfg = coreConfig();
    g_reversed = cfg.dpRev < 0.5f ? (g_depthFunc == GL_GREATER || g_depthFunc == GL_GEQUAL) : (cfg.dpRev > 1.5f);
    char b[128];
    snprintf(b, sizeof b, "depth fmt=0x%x tipe=%s fbo=%u depthFunc=0x%x", fmt, type == GL_RENDERBUFFER ? "renderbuffer" : "texture", fbo, g_depthFunc);
    g_note = b;
}

void bindTex(int unit, GLuint tex) {
    glActiveTexture(GL_TEXTURE0 + unit);
    glBindTexture(GL_TEXTURE_2D, tex);
    glBindSampler(unit, 0);
}

struct Mats { float vp[16], inv[16], prev[16]; bool ok; };

Mats makeMats(const Config& cfg) {
    Mats m;
    m.ok = false;
    double a[16], ia[16];
    for (int i = 0; i < 16; i++) a[i] = g_sceneVP[i];
    if (cfg.dpVpTr) {  // kolom-mayor: transpose menjadi baris-mayor
        for (int r = 0; r < 4; r++)
            for (int c = 0; c < 4; c++) a[r * 4 + c] = g_sceneVP[c * 4 + r];
    }
    if (!dpInvert4x4(a, ia)) return m;
    {   // posisi kamera = kolom ke-3 inverse VP (titik dengan clip.w = 0), tak butuh CB0[11]
        double w = ia[14];
        if (std::fabs(w) > 1e-12) { g_cam[0] = static_cast<float>(ia[2] / w); g_cam[1] = static_cast<float>(ia[6] / w); g_cam[2] = static_cast<float>(ia[10] / w); }
    }
    for (int i = 0; i < 16; i++) { m.vp[i] = static_cast<float>(a[i]); m.inv[i] = static_cast<float>(ia[i]); }
    if (g_prevValid) memcpy(m.prev, g_prevVP, sizeof m.prev); else memcpy(m.prev, m.vp, sizeof m.prev);
    memcpy(g_prevVP, m.vp, sizeof g_prevVP);
    g_prevValid = true;
    m.ok = true;
    return m;
}

void setCommon(const Prog& p, const Mats& m, const Config& cfg, int outW, int outH, long frame) {
    if (p.u[7] >= 0) glUniformMatrix4fv(p.u[7], 1, GL_TRUE, m.inv);
    if (p.u[8] >= 0) glUniformMatrix4fv(p.u[8], 1, GL_TRUE, m.vp);
    if (p.u[9] >= 0) glUniformMatrix4fv(p.u[9], 1, GL_TRUE, m.prev);
    if (p.u[10] >= 0) glUniform4f(p.u[10], g_cam[0], g_cam[1], g_cam[2], static_cast<float>(frame % 1024));
    if (p.u[11] >= 0) glUniform4f(p.u[11], 1.f / outW, 1.f / outH, cfg.dpFlip ? 1.f : 0.f, g_reversed ? 1.f : 0.f);
}

struct Fx {
    bool ao, ss, df, dbg;
    float mx[4][4], ssu[3][4], df4[4][4], ol[3][4];
};

Fx makeFx(const Config& cin, int lvl) {
    Config c = cin;
    Fx f;
    const float s = clampf(c.strength, 0.f, 1.5f);
    const bool pAo = c.perfAo || lvl >= 1, pSs = c.perfSsr || lvl >= 1, pDf = c.perfDof || lvl >= 1;  // level 1: setengah sampel
    const bool off = lvl >= 3;  // mode termal: matikan pass berat
    f.ao = c.mxOn && !off;
    f.ss = c.ssOn && !off;
    f.df = c.dfOn && !off;
    f.dbg = c.dpDebug > 0.5f;
    static const float qm[4] = {0.5f, 1.f, 1.5f, 2.f};
    auto q = [](float v) { int i = static_cast<int>(v + 0.5f); return qm[i < 0 ? 0 : (i > 3 ? 3 : i)]; };
    float ns = clampf(c.mxSamples * q(c.mxQual) * (c.mxRays / 2.f) * (pAo ? 0.5f : 1.f), 4.f, 64.f);
    float steps = clampf(c.ssSteps * q(c.ssQual) * (pSs ? 0.5f : 1.f), 8.f, 128.f);
    float dns = clampf(c.dfSamples * (pDf ? 0.5f : 1.f), 8.f, 96.f);
    float hs = 1.f;  // radius px relatif 1080p dihitung di pemanggil
    (void)hs;
    float v0[4][4] = {{c.mxInt * s, c.mxRad, ns, 0.f}, {c.mxDark, c.mxSoft, c.mxFine, c.mxCoarse},
                      {c.mxNbias, c.mxDbias, c.mxEdge, c.mxBlur * (0.5f + c.mxDenoise)}, {c.mxDenoise, c.mxTemp, 0.f, 0.f}};
    memcpy(f.mx, v0, sizeof v0);
    float v1[3][4] = {{c.ssInt * s, steps, c.ssDist, c.ssThick}, {c.ssFade, c.ssEdge, c.ssFloor, c.ssBlur}, {c.ssTemp, 0.f, 0.f, 0.f}};
    memcpy(f.ssu, v1, sizeof v1);
    float v2[4][4] = {{c.dfInt * s, c.dfFocus, c.dfRange, c.dfTrans}, {c.dfNear, c.dfFar, c.dfRad, c.dfBokeh},
                      {c.dfShape, dns, c.dfAper, c.dfFocal}, {c.dfAuto ? 1.f : 0.f, c.dfSmooth, c.dfFg, c.dfBg}};
    memcpy(f.df4, v2, sizeof v2);
    float v3[3][4] = {{c.olOn && !off ? c.olStr * s : 0.f, c.olThick, c.olSens, c.olSoft},
                      {c.olStart, c.olEnd, c.olSky ? 1.f : 0.f, c.olBlend}, {c.olR, c.olG, c.olB, c.olDbg}};
    memcpy(f.ol, v3, sizeof v3);
    return f;
}

void setFx(const Prog& p, const Fx& f, const Config& cfg) {
    if (p.u[12] >= 0) glUniform4fv(p.u[12], 1, f.mx[0]);
    if (p.u[13] >= 0) glUniform4fv(p.u[13], 1, f.mx[1]);
    if (p.u[14] >= 0) glUniform4fv(p.u[14], 1, f.mx[2]);
    if (p.u[15] >= 0) glUniform4fv(p.u[15], 1, f.mx[3]);
    if (p.u[16] >= 0) glUniform4fv(p.u[16], 1, f.ssu[0]);
    if (p.u[17] >= 0) glUniform4fv(p.u[17], 1, f.ssu[1]);
    if (p.u[18] >= 0) glUniform4fv(p.u[18], 1, f.ssu[2]);
    if (p.u[19] >= 0) glUniform4fv(p.u[19], 1, f.df4[0]);
    if (p.u[20] >= 0) glUniform4fv(p.u[20], 1, f.df4[1]);
    if (p.u[21] >= 0) glUniform4fv(p.u[21], 1, f.df4[2]);
    if (p.u[22] >= 0) glUniform4fv(p.u[22], 1, f.df4[3]);
    if (p.u[23] >= 0) glUniform4f(p.u[23], cfg.dpDebug, 0.f, 0.f, 0.f);
    if (p.u[24] >= 0) glUniform4fv(p.u[24], 1, f.ol[0]);
    if (p.u[25] >= 0) glUniform4fv(p.u[25], 1, f.ol[1]);
    if (p.u[26] >= 0) glUniform4fv(p.u[26], 1, f.ol[2]);
}

void samplers(const Prog& p) {
    for (int i = 0; i < 7; i++) if (p.u[i] >= 0) glUniform1i(p.u[i], i);
}

void draw(const Prog& p, GLuint target, int w, int h) {
    glBindFramebuffer(GL_FRAMEBUFFER, target);
    glViewport(0, 0, w, h);
    glUseProgram(p.id);
    samplers(p);
    glDrawArrays(GL_TRIANGLES, 0, 3);
}

void runPass() {
    if (g_failed) return;
    const Config cfg = coreConfig();
    if (!cfg.depthPipe || cfg.safe || cfg.disable || !cfg.master) return;
    const int lvl = perfLevel(cfg, coreAutoLevel());
    Fx fx = makeFx(cfg, lvl);
    const bool olRun = fx.ol[0][0] > 0.f || fx.ol[2][3] > 0.5f;
    const int fxN = fxrtEnabled();
    if (!(fx.ao || fx.ss || fx.df || fx.dbg || olRun || fxN > 0)) return;
    if (!g_validFrame || !g_dTex || g_bbW < 64 || g_bbH < 64) return;
    void* ctx = eglGetCurrentContext();
    if (ctx == EGL_NO_CONTEXT || ctx != g_ctx) return;
    while (glGetError() != GL_NO_ERROR) {}
    Mats m = makeMats(cfg);
    if (!m.ok) { g_note = "ViewProjection tak bisa diinvers"; return; }

    std::string firstErr;
    auto chk = [&](const char* where) {
        GLenum e = glGetError();
        if (e == GL_NO_ERROR) return;
        if (firstErr.empty()) { char bb[64]; snprintf(bb, sizeof bb, "%s=0x%x", where, e); firstErr = bb; }
        while (glGetError() != GL_NO_ERROR) {}
    };
    GLState st;
    st.save();
    chk("save");
    GLint samples = 0;
    glBindFramebuffer(GL_READ_FRAMEBUFFER, 0);
    glGetIntegerv(GL_SAMPLES, &samples);
    bool ok = samples == 0;
    if (!ok) g_note = "framebuffer default multisample";
    for (int i = 0; ok && i < 6; i++) {
        const bool need = (i == kDpDepthLin && fxN > 0) || (i == kDpAo && fx.ao) || (i == kDpSsr && fx.ss) || i == kDpComp || i == kDpFinal || (i == kDpFocus && fx.df && cfg.dfAuto);
        if (need && !buildProg(i)) ok = false;
    }
    const int W = g_bbW, H = g_bbH;
    const float scale = cfg.dpScale;
    auto sc = [&](float r, int v) { int x = static_cast<int>(v * clampf(r * scale, 0.25f, 1.f)); return x < 16 ? 16 : x; };
    const bool aoPerf = cfg.perfAo || lvl >= 2, ssPerf = cfg.perfSsr || lvl >= 2;
    const int aoW = sc(aoPerf ? std::min(cfg.mxRes, 0.5f) : cfg.mxRes, W), aoH = sc(aoPerf ? std::min(cfg.mxRes, 0.5f) : cfg.mxRes, H);
    const int ssW = sc(ssPerf ? std::min(cfg.ssRes, 0.5f) : cfg.ssRes, W), ssH = sc(ssPerf ? std::min(cfg.ssRes, 0.5f) : cfg.ssRes, H);
    if (ok) ok = ensureRt(g_color, W, H, GL_RGBA8);
    if (ok && (fx.ao)) ok = ensureRt(g_ao[0], aoW, aoH) && ensureRt(g_ao[1], aoW, aoH);
    if (ok && (fx.ss)) ok = ensureRt(g_ss[0], ssW, ssH) && ensureRt(g_ss[1], ssW, ssH);
    if (ok && (fx.ao || fx.ss)) ok = ensureRt(g_comp, W, H);
    if (ok && fx.df && cfg.dfAuto) ok = ensureRt(g_focus[0], 1, 1) && ensureRt(g_focus[1], 1, 1);
    chk("prep");
    if (ok && !g_vao) glGenVertexArrays(1, &g_vao);
    if (ok) {
        glBindVertexArray(g_vao);
        glDisable(GL_BLEND); glDisable(GL_DEPTH_TEST); glDisable(GL_CULL_FACE); glDisable(GL_SCISSOR_TEST);
        glDisable(GL_STENCIL_TEST); glDisable(GL_RASTERIZER_DISCARD); glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE); glDisable(GL_DITHER);
        glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
        chk("state");
        // 1) salin backbuffer (hasil post Roblox, belum ada UI)
        // blit (bukan glCopyTexSubImage2D): backbuffer tanpa alpha / format beda -> copy memberi INVALID_OPERATION, blit mengonversi
        glBindFramebuffer(GL_READ_FRAMEBUFFER, 0);
        glReadBuffer(GL_BACK);
        glBindFramebuffer(GL_DRAW_FRAMEBUFFER, g_color.fbo);
        glBlitFramebuffer(0, 0, W, H, 0, 0, W, H, GL_COLOR_BUFFER_BIT, GL_NEAREST);
        chk("copyBackbuffer");
        if (fxN > 0) {   // runtime efek ReShade: depth disandikan ulang -> rantai pass -> hasil kembali ke g_color
            if (ensureRt(g_rdepth, W, H, GL_R32F)) {
                glBindTexture(GL_TEXTURE_2D, g_rdepth.tex);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
                const Prog& dp = g_prog[kDpDepthLin];
                glUseProgram(dp.id);
                setCommon(dp, m, cfg, W, H, 0);
                bindTex(1, g_dTex);
                draw(dp, g_rdepth.fbo, W, H);
                chk("depth_reshade");
                const unsigned res = fxrtRun(g_color.fbo, g_rdepth.tex, W, H, g_frame);
                glBindVertexArray(g_vao);
                chk("fxrt");
                if (res) {
                    glBindFramebuffer(GL_READ_FRAMEBUFFER, res);
                    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, g_color.fbo);
                    glBlitFramebuffer(0, 0, W, H, 0, 0, W, H, GL_COLOR_BUFFER_BIT, GL_NEAREST);
                    chk("fxrt_result");
                }
            } else { g_note = "R32F untuk depth ReShade gagal"; }
        }
        const long frame = cfg.mxTemp > 0.f || cfg.ssTemp > 0.f ? g_frame : 0;
        const float hscale = H / 1080.f;
        fx.df4[1][2] = cfg.dfRad * hscale;

        GLuint compTex = g_color.tex;
        if (fx.ao) {
            const Prog& p = g_prog[kDpAo];
            glUseProgram(p.id);
            setCommon(p, m, cfg, aoW, aoH, frame); setFx(p, fx, cfg);
            bindTex(1, g_dTex);
            bindTex(5, g_ao[1 - g_aoIdx].tex);
            draw(p, g_ao[g_aoIdx].fbo, aoW, aoH); chk("draw_ao");
        }
        if (fx.ss) {
            const Prog& p = g_prog[kDpSsr];
            glUseProgram(p.id);
            setCommon(p, m, cfg, ssW, ssH, frame); setFx(p, fx, cfg);
            bindTex(0, g_color.tex);
            bindTex(1, g_dTex);
            bindTex(5, g_ss[1 - g_ssIdx].tex);
            draw(p, g_ss[g_ssIdx].fbo, ssW, ssH); chk("draw_ssr");
        }
        if (fx.ao || fx.ss) {
            const Prog& p = g_prog[kDpComp];
            glUseProgram(p.id);
            setCommon(p, m, cfg, W, H, frame); setFx(p, fx, cfg);
            bindTex(0, g_color.tex);
            bindTex(1, g_dTex);
            bindTex(2, fx.ao ? g_ao[g_aoIdx].tex : g_color.tex);
            bindTex(3, fx.ss ? g_ss[g_ssIdx].tex : g_color.tex);
            if (!fx.ao) { float z[4] = {0, 0, 0, 0}; glUniform4fv(p.u[12], 1, z); }
            if (!fx.ss) { float z[4] = {0, 0, 0, 0}; glUniform4fv(p.u[16], 1, z); }
            draw(p, g_comp.fbo, W, H); chk("draw_comp");
            compTex = g_comp.tex;
        }
        if (fx.df && cfg.dfAuto) {
            const Prog& p = g_prog[kDpFocus];
            glUseProgram(p.id);
            setCommon(p, m, cfg, 1, 1, frame); setFx(p, fx, cfg);
            bindTex(1, g_dTex);
            bindTex(5, g_focus[1 - g_fcIdx].tex);
            draw(p, g_focus[g_fcIdx].fbo, 1, 1); chk("draw_focus");
        }
        {   // 4) akhir -> framebuffer 0 (DOF + debug)
            const Prog& p = g_prog[kDpFinal];
            glUseProgram(p.id);
            setCommon(p, m, cfg, W, H, frame);
            Fx fx2 = fx;
            if (!fx.df) fx2.df4[0][0] = 0.f;
            setFx(p, fx2, cfg);
            bindTex(0, g_color.tex);
            bindTex(1, g_dTex);
            bindTex(2, fx.ao ? g_ao[g_aoIdx].tex : g_color.tex);
            bindTex(3, fx.ss ? g_ss[g_ssIdx].tex : g_color.tex);
            bindTex(4, compTex);
            bindTex(6, (fx.df && cfg.dfAuto) ? g_focus[g_fcIdx].tex : g_color.tex);
            draw(p, 0, W, H); chk("draw_final");
        }
        if (fx.ao) g_aoIdx = 1 - g_aoIdx;
        if (fx.ss) g_ssIdx = 1 - g_ssIdx;
        if (fx.df && cfg.dfAuto) g_fcIdx = 1 - g_fcIdx;
    }
    chk("akhir");
    st.restore();
    GLenum err = glGetError();
    while (glGetError() != GL_NO_ERROR) {}
    if (!ok) { fail(g_note.empty() ? "persiapan pass gagal" : g_note); return; }
    if (err != GL_NO_ERROR || !firstErr.empty()) {
        char b[160];
        snprintf(b, sizeof b, "GL error 0x%x saat pass (pertama: %s; restore=0x%x)", err ? err : 0x502, firstErr.empty() ? "restore" : firstErr.c_str(), err);
        fail(b); return;
    }
    g_ran++;
}

}  // namespace

void dpSetDir(const std::string& dir) { g_dir = dir; }

bool dpEnabled() { return g_enabled && !g_failed; }

void dpOnUseProgram(unsigned prog) {
    if (!onRender() || !dpEnabled() || prog == 0) return;
    auto it = g_hasCb0.find(prog);
    if (it == g_hasCb0.end()) {
        Cb0Locs l = probeCb0(prog);
        (l.ok ? g_probeOk : g_probeFail)++;
        it = g_hasCb0.emplace(prog, l).first;
    }
    if (it->second.ok && g_cur != 0) g_cb0Prog = prog;
}

void dpOnProgramGone(unsigned prog) {
    g_hasCb0.erase(prog);
    if (g_cb0Prog == prog) g_cb0Prog = 0;
}

void dpOnBindFbo(unsigned target, unsigned fbo) {
    if (!onRender() || !dpEnabled()) return;
    if (target != GL_FRAMEBUFFER && target != GL_DRAW_FRAMEBUFFER) return;
    if (g_cur != 0 && g_cur != fbo && g_drawsInCur > 0 && !g_capturedFrame) tryCapture(g_cur);  // FBO scene dilepas tanpa invalidate
    g_cur = fbo;
    g_drawsInCur = 0;
}

void dpOnViewport(int x, int y, int w, int h) {
    (void)x; (void)y;
    if (!onRender() || !dpEnabled() || g_cur == 0) return;
    g_vpW[g_cur] = w;
    g_vpH[g_cur] = h;
}

void dpOnDepthFunc(unsigned func) {
    if (!onRender() || !dpEnabled() || g_cur == 0) return;
    g_depthFunc = func;
}

void dpOnUniform4fv(int count, const float* v) {
    if (!onRender() || !dpEnabled()) return;
    g_u4Calls++;
    if (count > g_u4Max) g_u4Max = count;
    if (count != 61 || !v) return;
    memcpy(g_cb0, v, sizeof g_cb0);
    g_cb0Seen = true;
}

void dpOnInvalidate(unsigned target, int n, const unsigned* att) {
    (void)target;
    if (!onRender() || !dpEnabled() || g_cur == 0 || !att) return;
    for (int i = 0; i < n; i++)
        if (att[i] == GL_DEPTH_ATTACHMENT || att[i] == GL_DEPTH_STENCIL_ATTACHMENT) { tryCapture(g_cur); return; }
}

void dpBeforeDraw(unsigned mode, int count) {
    if (!onRender() || !dpEnabled()) return;
    if (g_pending && g_cur == 0 && !(mode == GL_TRIANGLES && count == 3)) {
        g_pending = false;
        runPass();
    }
}

void dpAfterDraw(unsigned mode, int count) {
    if (!onRender() || !dpEnabled()) return;
    g_drawsInCur++;
    if (g_cur == 0 && mode == GL_TRIANGLES && count == 3 && g_validFrame) g_pending = true;
}

void dpAfterBlit() {
    if (!onRender() || !dpEnabled()) return;
    if (g_cur == 0 && g_validFrame) g_pending = true;
}

void dpOnSwap(int width, int height) {
    if (g_tid == 0) g_tid = tid();
    if (tid() != g_tid) return;
    g_frame++;
    {
        const Config c = coreConfig();
        g_cfgDp = c.depthPipe; g_cfgSafe = c.safe; g_cfgDis = c.disable;
        g_enabled = c.depthPipe && !c.safe && !c.disable;
    }
    if (width > 0) { g_bbW = width; g_bbH = height; }
    if (!g_failed && g_pending && dpEnabled()) { g_pending = false; runPass(); }
    g_pending = false;
    g_validFrame = false;
    g_capturedFrame = false;
    g_cur = 0;
    g_drawsInCur = 0;
    auto now = std::chrono::steady_clock::now();
    if (std::chrono::duration<double>(now - g_lastWrite).count() > 2.0) { g_lastWrite = now; writeStatus(); }
}

std::string dpStatus() {
    char b[128];
    snprintf(b, sizeof b, "dp=%s captures=%ld run=%ld", g_failed ? "gagal" : "ok", g_captures, g_ran);
    return b;
}

}  // namespace rz
