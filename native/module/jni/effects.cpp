#include "effects.hpp"

#include <EGL/egl.h>
#include <GLES3/gl3.h>
#include <android/log.h>

#include <cstring>

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "RYEENZYXNZ", __VA_ARGS__)

namespace rz {
namespace {

const char* kVert = R"(#version 300 es
out vec2 vUv;
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    vUv = p;
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
)";

// Screen-space post pass (no scene depth available from the final framebuffer):
//  DOF   = blur that grows with distance from a focus point (tilt/radial depth-of-field look)
//  AO    = darkens pixels darker than their neighbourhood (crease darkening)
//  Bloom = bright-pass glow, Levels/Curves/exposure/grade are exact per-pixel operations.
const char* kFrag = R"(#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec4 uA;   // brightness, contrast, saturation, warmth
uniform vec4 uB;   // exposure(EV), levelsBlack, levelsWhite, curves
uniform vec4 uC;   // bloom, bloomThreshold, bloomRadius, ao
uniform vec4 uD;   // dofAmount, dofCx, dofCy, dofRadius
uniform vec4 uE;   // (x dicadangkan), sunrays, 0, 0
uniform vec2 uSun;
in vec2 vUv;
out vec4 o;

vec3 tap(vec2 uv) { return texture(uTex, uv).rgb; }
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
    vec3 src = tap(vUv);
    vec3 c = src;
    float aspect = uTexel.y / uTexel.x;

    // ---- DOF
    if (uD.x > 0.0) {
        vec2 d = (vUv - uD.yz) * vec2(aspect, 1.0);
        float coc = smoothstep(uD.w, uD.w + 0.40, length(d)) * uD.x;
        float r = coc * 18.0;
        if (r > 0.4) {
            vec3 acc = c;
            float w = 1.0;
            for (int i = 0; i < 14; i++) {
                float a = float(i) * 2.39996;
                float k = sqrt((float(i) + 0.5) / 14.0);
                vec2 off = vec2(cos(a), sin(a)) * k * r * uTexel;
                vec3 s = tap(vUv + off);
                float wt = 1.0 + 1.5 * max(lum(s) - 0.8, 0.0);   // bokeh-ish: bright points weigh more
                acc += s * wt;
                w += wt;
            }
            c = acc / w;
        }
    }

    // ---- AO (crease darkening)
    if (uC.w > 0.0) {
        float l0 = lum(c);
        float avg = 0.0;
        for (int i = 0; i < 8; i++) {
            float a = float(i) * 0.7854;
            vec2 dir = vec2(cos(a), sin(a));
            avg += lum(tap(vUv + dir * 5.0 * uTexel)) + lum(tap(vUv + dir * 12.0 * uTexel));
        }
        avg /= 16.0;
        float occ = clamp((avg - l0) * 2.2, 0.0, 1.0);
        c *= 1.0 - occ * uC.w * 0.9;
    }

    // ---- Bloom
    if (uC.x > 0.0) {
        vec3 glow = vec3(0.0);
        float sp = uC.z;
        for (int i = 0; i < 8; i++) {
            float a = float(i) * 0.7854;
            vec2 dir = vec2(cos(a), sin(a));
            glow += max(tap(vUv + dir * 8.0 * sp * uTexel) - vec3(uC.y), vec3(0.0));
            glow += max(tap(vUv + dir * 20.0 * sp * uTexel) - vec3(uC.y), vec3(0.0));
        }
        c += glow * (uC.x * 0.16);
    }

    // ---- Sun rays
    if (uE.y > 0.0) {
        vec2 stepv = (uSun - vUv) * (0.9 / 20.0);
        vec2 uv = vUv;
        float decay = 1.0;
        vec3 acc = vec3(0.0);
        for (int i = 0; i < 20; i++) {
            uv += stepv;
            acc += max(tap(uv) - vec3(0.7), vec3(0.0)) * decay;
            decay *= 0.94;
        }
        c += acc * vec3(1.0, 0.85, 0.6) * (uE.y * 0.28);
    }

    // ---- Grade: exposure -> levels -> curves -> brightness/contrast -> saturation -> warmth
    c *= exp2(uB.x);
    c = (c - vec3(uB.y)) / max(uB.z - uB.y, 0.05);
    c = clamp(c, 0.0, 1.0);
    c = mix(c, c * c * (3.0 - 2.0 * c), uB.w);
    c += vec3(uA.x);
    c = (c - 0.5) * (1.0 + uA.y) + 0.5;
    float l = lum(c);
    c = mix(vec3(l), c, 1.0 + uA.z);
    c.r += uA.w * 0.06;
    c.b -= uA.w * 0.06;
    o = vec4(clamp(c, 0.0, 1.0), 1.0);
}
)";

struct GLState {
    GLint prog = 0, activeTex = 0, tex0 = 0, sampler0 = 0, vao = 0, readFb = 0, drawFb = 0;
    GLint vp[4] = {0, 0, 0, 0}, sc[4] = {0, 0, 0, 0};
    GLboolean cm[4] = {1, 1, 1, 1}, dm = 1;
    GLboolean blend = 0, depth = 0, cull = 0, scissor = 0, stencil = 0, discard = 0, a2c = 0;

    void save() {
        glGetIntegerv(GL_CURRENT_PROGRAM, &prog);
        glGetIntegerv(GL_ACTIVE_TEXTURE, &activeTex);
        glActiveTexture(GL_TEXTURE0);
        glGetIntegerv(GL_TEXTURE_BINDING_2D, &tex0);
        glGetIntegerv(GL_SAMPLER_BINDING, &sampler0);
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
    }

    static void cap(GLenum c, GLboolean on) { on ? glEnable(c) : glDisable(c); }

    void restore() const {
        glBindFramebuffer(GL_READ_FRAMEBUFFER, static_cast<GLuint>(readFb));
        glBindFramebuffer(GL_DRAW_FRAMEBUFFER, static_cast<GLuint>(drawFb));
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(tex0));
        glBindSampler(0, static_cast<GLuint>(sampler0));
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
    }
};

GLuint compile(GLenum type, const char* src) {
    GLuint s = glCreateShader(type);
    glShaderSource(s, 1, &src, nullptr);
    glCompileShader(s);
    GLint ok = 0;
    glGetShaderiv(s, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[512] = {0};
        glGetShaderInfoLog(s, sizeof log - 1, nullptr, log);
        LOG("shader compile failed: %s", log);
        glDeleteShader(s);
        return 0;
    }
    return s;
}

}  // namespace

bool Effects::fail(const char* why) {
    failed_ = true;
    reason_ = why;
    LOG("effects disabled: %s", why);
    return false;
}

bool Effects::createProgram() {
    GLuint v = compile(GL_VERTEX_SHADER, kVert), f = compile(GL_FRAGMENT_SHADER, kFrag);
    if (!v || !f) return false;
    GLuint p = glCreateProgram();
    glAttachShader(p, v);
    glAttachShader(p, f);
    glLinkProgram(p);
    glDeleteShader(v);
    glDeleteShader(f);
    GLint ok = 0;
    glGetProgramiv(p, GL_LINK_STATUS, &ok);
    if (!ok) {
        char log[512] = {0};
        glGetProgramInfoLog(p, sizeof log - 1, nullptr, log);
        LOG("program link failed: %s", log);
        glDeleteProgram(p);
        return false;
    }
    prog_ = p;
    uTex_ = glGetUniformLocation(p, "uTex");
    uTexel_ = glGetUniformLocation(p, "uTexel");
    uA_ = glGetUniformLocation(p, "uA");
    uB_ = glGetUniformLocation(p, "uB");
    uC_ = glGetUniformLocation(p, "uC");
    uD_ = glGetUniformLocation(p, "uD");
    uE_ = glGetUniformLocation(p, "uE");
    uSun_ = glGetUniformLocation(p, "uSun");
    glGenVertexArrays(1, &vao_);
    return true;
}

bool Effects::ensureTexture(int w, int h) {
    if (tex_ && tw_ == w && th_ == h) return true;
    if (tex_) glDeleteTextures(1, &tex_);
    glGenTextures(1, &tex_);
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, tex_);
    GLint alpha = 0;
    glGetIntegerv(GL_ALPHA_BITS, &alpha);  // default framebuffer is bound for reading
    if (alpha > 0) glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, nullptr);
    else glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB8, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, nullptr);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    tw_ = w;
    th_ = h;
    return true;
}

bool Effects::render(const Config& cfg, int w, int h) {
    if (failed_) return false;
    void* ctx = eglGetCurrentContext();
    if (ctx == EGL_NO_CONTEXT) return true;  // nothing to do this frame
    if (ctx != ctx_) {                       // new/lost context: old object ids are meaningless
        ctx_ = ctx;
        prog_ = vao_ = tex_ = 0;
        tw_ = th_ = 0;
        checkedVersion_ = false;
    }
    if (!checkedVersion_) {
        const char* ver = reinterpret_cast<const char*>(glGetString(GL_VERSION));
        if (!ver || !strstr(ver, "OpenGL ES 3")) return fail("context is not OpenGL ES 3.x");
        checkedVersion_ = true;
        LOG("GL context: %s", ver);
    }

    while (glGetError() != GL_NO_ERROR) {}  // drain errors that are not ours

    GLState st;
    st.save();

    glBindFramebuffer(GL_READ_FRAMEBUFFER, 0);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0);
    GLint samples = 0;
    glGetIntegerv(GL_SAMPLES, &samples);
    bool ok = true;
    const char* why = "";
    if (samples > 0) { ok = false; why = "multisampled default framebuffer (cannot copy)"; }
    if (ok && !prog_ && !createProgram()) { ok = false; why = "shader build failed"; }
    if (ok) ensureTexture(w, h);

    if (ok) {
        glDisable(GL_BLEND);
        glDisable(GL_DEPTH_TEST);
        glDisable(GL_CULL_FACE);
        glDisable(GL_SCISSOR_TEST);
        glDisable(GL_STENCIL_TEST);
        glDisable(GL_RASTERIZER_DISCARD);
        glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE);
        glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
        glViewport(0, 0, w, h);
        glBindSampler(0, 0);
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, tex_);
        glCopyTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0, 0, 0, w, h);
        glUseProgram(prog_);
        glUniform1i(uTex_, 0);
        glUniform2f(uTexel_, 1.f / w, 1.f / h);
        const float k = cfg.strength;
        auto cl = [](float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); };
        glUniform4f(uA_, cl(cfg.brightness * k, -0.5f, 0.5f), cl(cfg.contrast * k, -0.5f, 1.f), cl(cfg.saturation * k, -1.f, 1.5f),
                    cl(cfg.warmth * k, -1.f, 1.f));
        glUniform4f(uB_, cl(cfg.exposure * k, -2.f, 2.f), cfg.levelsBlack * k, 1.f - (1.f - cfg.levelsWhite) * k, cl(cfg.curves * k, 0.f, 1.f));
        glUniform4f(uC_, cfg.bloom * k, cfg.bloomThreshold, cfg.bloomRadius, cl(cfg.ao * k, 0.f, 1.f));
        glUniform4f(uD_, cfg.dof ? cl(cfg.dofAmount * k, 0.f, 1.f) : 0.f, cfg.dofCx, 1.f - cfg.dofCy, cfg.dofRadius);
        glUniform4f(uE_, 0.f, cfg.sunrays ? cl(cfg.sunraysAmount * k, 0.f, 1.f) : 0.f, 0.f, 0.f);
        glUniform2f(uSun_, cfg.sunX, cfg.sunY);
        glBindVertexArray(vao_);
        glDrawArrays(GL_TRIANGLES, 0, 3);
    }

    st.restore();
    GLenum err = glGetError();
    while (glGetError() != GL_NO_ERROR) {}
    if (!ok) return fail(why);
    if (err != GL_NO_ERROR) {
        LOG("GL error 0x%x during pass", err);
        return fail("GL error during pass");
    }
    return true;
}

}  // namespace rz
