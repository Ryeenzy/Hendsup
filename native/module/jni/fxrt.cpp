#include "fxrt.hpp"
#include <GLES3/gl32.h>
#include <android/log.h>
#include <sys/stat.h>
#include <chrono>
#include <cstdio>
#include <fstream>
#include <memory>
#include <sstream>
#include "fxrt_util.hpp"

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {
namespace {
using fxu::JV;

constexpr int kBakedW = 1920, kBakedH = 1080;

struct TexD {
    std::string name;
    int w = 1, h = 1, levels = 1, fmt = 0;
    std::string sem;
    GLuint id = 0;
    int aw = 0, ah = 0;   // ukuran aktual
};
struct SampD { std::string glName; int tex = -1; };
struct PassD {
    std::string vsSrc, psSrc, psName;
    int w = 0, h = 0, clear = 0;
    int rt[8];
    std::vector<std::pair<int, int>> samplers;   // (indeks sampler, titik tekstur)
    GLuint prog = 0;
    std::vector<GLint> sLoc, uLoc;
    bool skip = false;
    PassD() { for (int& r : rt) r = -1; }
};
struct UniD {
    std::string name, glName, source;
    int rows = 1, base = 7;
    bool isFloat = true;
    std::vector<float> def;
    float amin = 0, amax = 1, astep = 1;
};
struct Eff {
    std::string id, err;
    bool loaded = false, failed = false;
    std::vector<TexD> tex;
    std::vector<SampD> samp;
    std::vector<std::vector<PassD>> tech;
    std::vector<UniD> uni;
    int curW = 0, curH = 0;
};

struct Img { GLuint tex = 0, fbo = 0; int w = 0, h = 0; };

std::string g_cfgDir, g_fxDir, g_err;
fxu::FxCfg g_cfg;
std::string g_cfgText;
std::map<std::string, std::unique_ptr<Eff>> g_eff;
Img g_a, g_b;
GLuint g_fbo = 0;
long g_runs = 0, g_passes = 0, g_failedPasses = 0;
int g_nOn = 0, g_nRun = 0;
std::chrono::steady_clock::time_point g_t0 = std::chrono::steady_clock::now(), g_tPrev = g_t0;
float g_frameMs = 16.f;

std::string readFile(const std::string& p) {
    std::ifstream f(p, std::ios::binary);
    std::stringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

GLenum glFmt(int f) {
    switch (f) {
        case 10: case 11: return GL_RGBA16F;
        case 54: return GL_R16F;
        case 34: return GL_RG16F;
        case 61: return GL_R8;
        case 24: return GL_RGB10_A2;
        case 41: return GL_R32F;
        default: return GL_RGBA8;
    }
}

void freeImg(Img& i) {
    if (i.tex) glDeleteTextures(1, &i.tex);
    if (i.fbo) glDeleteFramebuffers(1, &i.fbo);
    i = Img();
}
bool ensureImg(Img& i, int w, int h) {
    if (i.tex && i.w == w && i.h == h) return true;
    freeImg(i);
    glGenTextures(1, &i.tex);
    glBindTexture(GL_TEXTURE_2D, i.tex);
    glTexStorage2D(GL_TEXTURE_2D, 1, GL_RGBA8, w, h);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glGenFramebuffers(1, &i.fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, i.fbo);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, i.tex, 0);
    i.w = w; i.h = h;
    return glCheckFramebufferStatus(GL_FRAMEBUFFER) == GL_FRAMEBUFFER_COMPLETE;
}

GLuint compile(GLenum type, const std::string& src, std::string& err) {
    GLuint s = glCreateShader(type);
    const char* c = src.c_str();
    glShaderSource(s, 1, &c, nullptr);
    glCompileShader(s);
    GLint ok = 0;
    glGetShaderiv(s, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[400] = {0};
        glGetShaderInfoLog(s, sizeof log - 1, nullptr, log);
        err = std::string(type == GL_VERTEX_SHADER ? "vs: " : "ps: ") + log;
        glDeleteShader(s);
        return 0;
    }
    return s;
}

bool loadEffect(Eff& e) {
    e.loaded = true;
    const std::string dir = g_fxDir + "/" + e.id;
    std::string txt = readFile(dir + "/manifest.json");
    JV m;
    if (txt.empty() || !fxu::parseJson(txt, m)) { e.failed = true; e.err = "manifest tidak ada/rusak"; return false; }
    std::map<std::string, int> texIdx;
    if (const JV* ts = m.get("textures"))
        for (const JV& t : ts->a) {
            TexD d;
            d.name = t.str("name"); d.w = static_cast<int>(t.num("w", 1)); d.h = static_cast<int>(t.num("h", 1));
            d.levels = static_cast<int>(t.num("levels", 1)); d.fmt = static_cast<int>(t.num("fmt")); d.sem = t.str("semantic");
            texIdx[d.name] = static_cast<int>(e.tex.size());
            e.tex.push_back(d);
        }
    if (const JV* ss = m.get("samplers"))
        for (const JV& s : ss->a) {
            SampD d;
            d.glName = fxu::glNameSampler(s.str("name"));
            auto it = texIdx.find(s.str("tex"));
            d.tex = it == texIdx.end() ? -1 : it->second;
            e.samp.push_back(d);
        }
    if (const JV* us = m.get("uniforms"))
        for (const JV& u : us->a) {
            UniD d;
            d.name = u.str("name"); d.glName = fxu::glNameUniform(d.name);
            d.rows = static_cast<int>(u.num("rows", 1)); d.base = static_cast<int>(u.num("base", 7));
            d.isFloat = u.num("float", 1) != 0;
            if (const JV* df = u.get("def")) for (const JV& x : df->a) d.def.push_back(static_cast<float>(x.n));
            while (static_cast<int>(d.def.size()) < d.rows) d.def.push_back(0.f);
            if (const JV* an = u.get("ann")) {
                d.source = an->str("source");
                auto first = [&](const char* k, float dv) { const JV* v = an->get(k); return v && v->t == JV::Arr && !v->a.empty() ? static_cast<float>(v->a[0].n) : (v && v->t == JV::Num ? static_cast<float>(v->n) : dv); };
                d.amin = first("min", 0.f); d.amax = first("max", 1.f); d.astep = first("step", 1.f);
            }
            e.uni.push_back(d);
        }
    const JV* tq = m.get("techniques");
    if (!tq) { e.failed = true; e.err = "tanpa technique"; return false; }
    for (const JV& t : tq->a) {
        std::vector<PassD> ps;
        for (const JV& p : t.get("passes")->a) {
            PassD d;
            d.w = static_cast<int>(p.num("w")); d.h = static_cast<int>(p.num("h")); d.clear = static_cast<int>(p.num("clear"));
            d.psName = p.str("ps");
            if (const JV* r = p.get("rt"))
                for (size_t i = 0; i < r->a.size() && i < 8; i++) { auto it = texIdx.find(r->a[i].s); d.rt[i] = (r->a[i].s.empty() || it == texIdx.end()) ? -1 : it->second; }
            if (const JV* s = p.get("samplers"))
                for (const JV& x : s->a) d.samplers.emplace_back(static_cast<int>(x.num("index")), static_cast<int>(x.num("binding")));
            d.vsSrc = readFile(dir + "/" + p.str("vs_file"));
            d.psSrc = readFile(dir + "/" + p.str("ps_file"));
            if (d.vsSrc.empty() || d.psSrc.empty()) { e.failed = true; e.err = "file shader hilang: " + d.psName; return false; }
            // pass stencil-only (MXAO StencilSetup) tak punya keluaran warna berguna; tanpa stencil buffer ia akan merusak gambar
            if (d.psName.find("Stencil") != std::string::npos) d.skip = true;
            ps.push_back(std::move(d));
        }
        e.tech.push_back(std::move(ps));
    }
    // kompilasi
    for (auto& t : e.tech)
        for (auto& p : t) {
            if (p.skip) continue;
            std::string err;
            GLuint v = compile(GL_VERTEX_SHADER, p.vsSrc, err);
            GLuint f = v ? compile(GL_FRAGMENT_SHADER, p.psSrc, err) : 0;
            if (!v || !f) { if (v) glDeleteShader(v); e.failed = true; e.err = p.psName + " " + err; return false; }
            GLuint id = glCreateProgram();
            glAttachShader(id, v); glAttachShader(id, f);
            glLinkProgram(id);
            glDeleteShader(v); glDeleteShader(f);
            GLint ok = 0;
            glGetProgramiv(id, GL_LINK_STATUS, &ok);
            if (!ok) {
                char log[300] = {0};
                glGetProgramInfoLog(id, sizeof log - 1, nullptr, log);
                glDeleteProgram(id);
                e.failed = true; e.err = p.psName + " link: " + log;
                return false;
            }
            p.prog = id;
            for (const auto& sp : p.samplers) p.sLoc.push_back(glGetUniformLocation(id, e.samp[static_cast<size_t>(sp.first)].glName.c_str()));
            for (const auto& u : e.uni) p.uLoc.push_back(glGetUniformLocation(id, u.glName.c_str()));
        }
    return true;
}

void freeEffectGl(Eff& e) {
    for (auto& t : e.tex) if (t.id && t.sem.empty()) { glDeleteTextures(1, &t.id); t.id = 0; }
    for (auto& t : e.tech) for (auto& p : t) if (p.prog) { glDeleteProgram(p.prog); p.prog = 0; }
}

bool ensureTex(Eff& e, int W, int H) {
    if (e.curW == W && e.curH == H) return true;
    for (auto& t : e.tex) if (t.id && t.sem.empty()) { glDeleteTextures(1, &t.id); t.id = 0; }
    for (auto& t : e.tex) {
        if (!t.sem.empty()) continue;
        t.aw = fxu::scaleDim(t.w, kBakedW, W);
        t.ah = fxu::scaleDim(t.h, kBakedH, H);
        glGenTextures(1, &t.id);
        glBindTexture(GL_TEXTURE_2D, t.id);
        glTexStorage2D(GL_TEXTURE_2D, t.levels > 1 ? t.levels : 1, glFmt(t.fmt), t.aw, t.ah);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, t.levels > 1 ? GL_LINEAR_MIPMAP_LINEAR : GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    }
    e.curW = W; e.curH = H;
    return glGetError() == GL_NO_ERROR;
}

void setUniforms(const Eff& e, const PassD& p, long frame) {
    const float timerMs = std::chrono::duration<float, std::milli>(std::chrono::steady_clock::now() - g_t0).count();
    for (size_t i = 0; i < e.uni.size(); i++) {
        GLint loc = p.uLoc[i];
        if (loc < 0) continue;
        const UniD& u = e.uni[i];
        std::vector<float> v = u.def;
        auto it = g_cfg.val.find(e.id + "." + u.name);
        if (it != g_cfg.val.end()) for (size_t k = 0; k < it->second.size() && k < v.size(); k++) v[k] = it->second[k];
        if (!u.source.empty()) {
            if (u.source == "frametime") v[0] = g_frameMs;
            else if (u.source == "framecount") v[0] = static_cast<float>(frame);
            else if (u.source == "timer") v[0] = timerMs;
            else if (u.source == "bufready_depth") v[0] = 1.f;
            else if (u.source == "pingpong") {
                const float span = u.amax - u.amin > 1e-6f ? u.amax - u.amin : 1.f, sp = u.astep > 0.f ? u.astep : 1.f;
                const float ph = std::fmod(timerMs * 0.001f * sp, span * 2.f);
                v[0] = u.amin + (ph < span ? ph : span * 2.f - ph);
                if (v.size() > 1) v[1] = ph < span ? 1.f : -1.f;
            } else if (u.source == "random") v[0] = u.amin + (u.amax - u.amin) * static_cast<float>(rand() % 10000) / 10000.f;
            else for (float& x : v) x = 0.f;   // mouse/key/camera: tidak ada
        }
        const bool isInt = !u.isFloat;
        if (isInt) {
            if (u.base == 5) glUniform1ui(loc, static_cast<GLuint>(v[0] < 0 ? 0 : v[0]));
            else glUniform1i(loc, static_cast<GLint>(std::lround(v[0])));
        } else {
            switch (u.rows) {
                case 1: glUniform1f(loc, v[0]); break;
                case 2: glUniform2f(loc, v[0], v[1]); break;
                case 3: glUniform3f(loc, v[0], v[1], v[2]); break;
                default: glUniform4f(loc, v[0], v[1], v[2], v.size() > 3 ? v[3] : 0.f); break;
            }
        }
    }
}

void refreshCfg() {
    const std::string path = g_cfgDir + "/rz_fx.cfg";
    const std::string text = readFile(path);
    if (text == g_cfgText) return;
    g_cfgText = text;
    g_cfg = text.empty() ? fxu::FxCfg() : fxu::parseFxCfg(text);
}

}  // namespace

void fxrtSetDirs(const std::string& cfgDir, const std::string& fxDir) { g_cfgDir = cfgDir; g_fxDir = fxDir; }

int fxrtEnabled() {
    if (g_cfgDir.empty() || g_fxDir.empty()) return 0;
    static auto lastCheck = std::chrono::steady_clock::time_point::min();
    const auto now = std::chrono::steady_clock::now();
    if (lastCheck == std::chrono::steady_clock::time_point::min() ||
        now - lastCheck >= std::chrono::milliseconds(100)) {
        refreshCfg();  // cek isi file 10x/detik; tak bergantung pada resolusi mtime filesystem
        lastCheck = now;
    }
    g_nOn = static_cast<int>(g_cfg.on.size());
    return g_nOn;
}

void fxrtReset() {
    g_eff.clear();   // objek GL milik konteks lama sudah tak berlaku
    g_a = Img(); g_b = Img(); g_fbo = 0;
}

unsigned fxrtRun(unsigned colorFbo, unsigned depthTex, int W, int H, long frame) {
    const auto now = std::chrono::steady_clock::now();
    g_frameMs = std::chrono::duration<float, std::milli>(now - g_tPrev).count();
    g_tPrev = now;
    if (g_cfg.on.empty() || W < 16 || H < 16) return 0;
    if (!ensureImg(g_a, W, H) || !ensureImg(g_b, W, H)) { g_err = "gambar kerja gagal"; return 0; }
    if (!g_fbo) glGenFramebuffers(1, &g_fbo);
    glBindFramebuffer(GL_READ_FRAMEBUFFER, colorFbo);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, g_a.fbo);
    glBlitFramebuffer(0, 0, W, H, 0, 0, W, H, GL_COLOR_BUFFER_BIT, GL_NEAREST);
    bool any = false;
    int ran = 0;
    Img* cur = &g_a;
    Img* oth = &g_b;
    for (const std::string& id : g_cfg.on) {
        auto& slot = g_eff[id];
        if (!slot) { slot.reset(new Eff()); slot->id = id; }
        Eff& e = *slot;
        if (e.failed) continue;
        if (!e.loaded && !loadEffect(e)) { LOG("fxrt: %s gagal: %s", id.c_str(), e.err.c_str()); freeEffectGl(e); g_err = id + ": " + e.err; continue; }
        if (!ensureTex(e, W, H)) { e.failed = true; e.err = "alokasi tekstur gagal"; g_err = id + ": " + e.err; continue; }
        glGetError();
        for (auto& t : e.tech) {
            for (auto& p : t) {
                if (p.skip || !p.prog) continue;
                // target
                int tw = W, th = H;
                const bool toBack = p.rt[0] < 0;
                glBindFramebuffer(GL_FRAMEBUFFER, toBack ? oth->fbo : g_fbo);
                if (!toBack) {
                    for (int i = 0; i < 8; i++) {
                        if (p.rt[i] < 0) continue;
                        TexD& td = e.tex[static_cast<size_t>(p.rt[i])];
                        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 + static_cast<GLenum>(i), GL_TEXTURE_2D, td.id, 0);
                        if (i == 0) { tw = td.aw; th = td.ah; }
                    }
                    for (int i = 0; i < 8; i++) if (p.rt[i] < 0) glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 + static_cast<GLenum>(i), GL_TEXTURE_2D, 0, 0);
                    GLenum all[8];
                    for (int i = 0; i < 8; i++) all[i] = p.rt[i] >= 0 ? GL_COLOR_ATTACHMENT0 + static_cast<GLenum>(i) : GL_NONE;
                    glDrawBuffers(8, all);
                } else {
                    GLenum b0 = GL_COLOR_ATTACHMENT0;
                    glDrawBuffers(1, &b0);
                }
                glViewport(0, 0, tw, th);
                if (p.clear) { const GLfloat z[4] = {0, 0, 0, 0}; glClearBufferfv(GL_COLOR, 0, z); }
                glUseProgram(p.prog);
                for (size_t si = 0; si < p.samplers.size(); si++) {
                    const SampD& sd = e.samp[static_cast<size_t>(p.samplers[si].first)];
                    GLuint tex = 0;
                    if (sd.tex >= 0) {
                        const TexD& td = e.tex[static_cast<size_t>(sd.tex)];
                        tex = td.sem == "COLOR" ? cur->tex : (td.sem == "DEPTH" ? depthTex : td.id);
                    }
                    const int unit = p.samplers[si].second;
                    glActiveTexture(GL_TEXTURE0 + static_cast<GLenum>(unit));
                    glBindTexture(GL_TEXTURE_2D, tex);
                    glBindSampler(static_cast<GLuint>(unit), 0);
                    if (p.sLoc[si] >= 0) glUniform1i(p.sLoc[si], unit);
                }
                setUniforms(e, p, frame);
                glDrawArrays(GL_TRIANGLES, 0, 3);
                g_passes++;
                if (!toBack) {
                    for (int i = 0; i < 8; i++) {
                        if (p.rt[i] < 0) continue;
                        TexD& td = e.tex[static_cast<size_t>(p.rt[i])];
                        if (td.levels > 1) { glActiveTexture(GL_TEXTURE0); glBindTexture(GL_TEXTURE_2D, td.id); glGenerateMipmap(GL_TEXTURE_2D); }
                    }
                } else {
                    std::swap(cur, oth);
                }
                any = true;
                GLenum er = glGetError();
                if (er != GL_NO_ERROR) {
                    while (glGetError() != GL_NO_ERROR) {}
                    char b[96];
                    snprintf(b, sizeof b, "GL 0x%x di pass %s", er, p.psName.c_str());
                    e.failed = true; e.err = b; g_err = id + ": " + b; g_failedPasses++;
                    LOG("fxrt: %s", g_err.c_str());
                    break;
                }
            }
            if (e.failed) break;
        }
        if (!e.failed) ran++;
    }
    g_nRun = ran;
    g_runs++;
    const GLenum b0 = GL_COLOR_ATTACHMENT0;
    glDrawBuffers(1, &b0);
    while (glGetError() != GL_NO_ERROR) {}
    return any ? cur->fbo : 0;
}

std::string fxrtStatus() {
    char b[420];
    snprintf(b, sizeof b, "fx_on=%d fx_run=%d fx_frames=%ld fx_passes=%ld fx_fail=%ld fx_err=%s", g_nOn, g_nRun, g_runs, g_passes, g_failedPasses, g_err.c_str());
    return b;
}

}  // namespace rz
