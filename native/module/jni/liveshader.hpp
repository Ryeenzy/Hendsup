// RYEENZYXNZ live shader rewrite: dipanggil di glShaderSource (sebelum driver compile).
// Menulis ulang GLSL ES 3.00 milik Roblox dengan uniform RZ0..RZ7 (vec4) yang diisi dari config lewat hook glUseProgram,
// jadi slider panel berlaku langsung. Nilai identitas = tampilan asli.
//   RZ0 = (F0, LOD_refl, floor_refl, gain_refl)        RZ1 = (rough_mult, sun_spec_gain, 0, 0)
//   RZ2 = (levels_black, levels_white, curves, contrast) RZ3 = (brightness, saturation, vibrance, warmth)
//   RZ4 = (bloom_gain, exposure_gamma_mult, grade_on, gamma)  RZ5 = (hue, split_shadow, split_high, 0)
//   RZ6 = (refl_sat, refl_tint, refl_pow, flat_refl)     RZ7 = (flat_lod, 0, 0, 0)
//   RZ8 = (fog_intensity, fog_density, fog_start, fog_opacity)  RZ9 = (fog_temp, fog_sat, fog_bright, 0)
//   RZ10 = (rim_intensity, rim_power, rim_sharp, rim_bias)  RZ11 = (rim_r, rim_g, rim_b, rim_rgb)
//   RZ12 = (rim_speed, rim_light, rim_spread, rim_fade)     RZ13 = (highlight, hl_comp, shadow_strength, 0)
//   RZ15=(fog_end,fog_height,fog_hfall,fog_dfall) RZ16=(smooth,scatter,sky,adapt) RZ17=(cam,r,g,b) RZ18=(rim_soft,rim_edge,rim_mat,0) RZ19=(refl_rough,refl_fade,refl_dist,0)
//   RZ14 = (ao_strength_exp, ao_radius_mult, ao_detail, 0)   -> SSAO BAWAAN Roblox (shader ScreenSpaceSSAOCB, depthBufferTexture)
// Sasaran:
//   * shader PBR (reflect()+IBL)  : F0/LOD/gain/kekasaran/highlight + warna pantulan
//   * shader 'flat' (lantai, baseplate: lit tanpa normal): pantulan langit palsu (asumsi permukaan datar)
//   * semua fragment shader yang punya baris gamma-out sqrt(clamp(x * CB0[20].y,...)): color grading
//   * shader komposit akhir (FXComposition): penguat bloom
#pragma once
#include <algorithm>
#include <cmath>
#include <cstring>
#include <string>

#include "config.hpp"

namespace rz {

constexpr int kRzCount = 20;
struct LiveParams { float u[kRzCount][4]; };

// level performa efektif 0..3: pilihan pengguna, kualitas (Low=2, Medium=1), atau auto (autoLevel)
inline int perfLevel(const Config& c, int autoLevel) {
    int l = c.perfTherm ? 3 : c.perfBatt ? 2 : c.perfFps ? 1 : 0;
    int q = c.quality < 0.5f ? 2 : c.quality < 1.5f ? 1 : 0;
    if (c.autoPerf) l = std::max(l, std::min(3, std::max(0, autoLevel)));
    return std::max(l, q);
}

inline LiveParams liveParams(const Config& cin, int autoLevel = 0) {
    Config c = cin;
    if (!c.live || !c.master) { Config d; d.strength = 1.f; c = d; }  // OFF -> uniform identitas, tanpa perlu compile ulang
    const int lvl = perfLevel(c, autoLevel);
    const bool pRimX = c.perfRim || lvl >= 1, pFog = c.perfFog || lvl >= 1;
    const bool pRimOff = lvl >= 2, pHdr = c.perfHdr || lvl >= 2 || !c.hdrOn, pAo = c.perfAo || lvl >= 2;
    const bool pSsr = c.perfSsr || lvl >= 3, gradeOff = lvl >= 3;
    if (pSsr) c.flatRefl = 0.f;
    if (pAo && c.aoRadius > 1.f) c.aoRadius = 1.f;
    float s = std::min(std::max(c.strength, 0.f), 1.5f);
    const float gl = std::min(1.f, std::max(0.f, c.glass)) * std::min(1.f, s);
    if (gl > 0.f) c.flatRefl = std::max(c.flatRefl, gl);
    float g = std::max((c.glossy ? c.glossyAmount : 0.f) * s, gl);
    float w = std::min(1.f, std::max(c.wet * s, gl * 0.9f));
    float ge = std::min(1.f, std::max(g, w));
    float cl = std::min(1.f, c.glossClarity * s), sh = std::min(1.f, c.glossSharp * s);
    float spec = std::min(1.f, std::max(w, c.glossSpec * s));
    if (gl > 0.f) cl = std::max(cl, gl * 0.7f);
    float contrast = 1.f + c.contrast * s, sat = 1.f + c.saturation * s;
    float bright = c.brightness * 0.3f * s, vib = c.vibrance * s, warm = c.warmth * s;
    float lb = c.levelsBlack * s, lw = 1.f - (1.f - c.levelsWhite) * s, curves = std::min(1.f, c.curves * s);
    float expo = std::exp2(c.exposure * s) ;
    float gam = 1.f + (c.gamma - 1.f) * s, hue = c.hue * s, ss = c.splitShadow * s, sh2 = c.splitHigh * s;
    bool grade = lb > 1e-4f || lw < 1.f - 1e-4f || curves > 1e-4f || std::fabs(contrast - 1.f) > 1e-4f ||
                 std::fabs(bright) > 1e-4f || std::fabs(sat - 1.f) > 1e-4f || std::fabs(vib) > 1e-4f ||
                 std::fabs(warm) > 1e-4f || std::fabs(expo - 1.f) > 1e-4f || std::fabs(gam - 1.f) > 1e-4f ||
                 std::fabs(hue) > 1e-4f || std::fabs(ss) > 1e-4f || std::fabs(sh2) > 1e-4f ||
                 c.highlight > 1e-4f || c.hlComp > 1e-4f || std::fabs(c.shadowStrength) > 1e-4f;
    float lod = 5.f * (1.f - 0.7f * ge) * (1.f - 0.8f * cl);
    if (c.quality > 2.5f) lod *= 0.85f;          // Ultra: pantulan sedikit lebih tajam
    if (pSsr) lod = std::max(lod, 3.f);          // lebih murah (mip lebih rendah)
    float v[kRzCount][4] = {
        {0.04f + 0.26f * ge, lod, 0.5f * ge, 1.f + 1.5f * ge},
        {1.f - 0.8f * w, 1.f + 3.f * spec, 0.f, 0.f},
        {lb, lw, curves, contrast},
        {bright, sat, vib, warm},
        {1.f + c.bloom * s, std::pow(expo, 0.4545f), (grade && !gradeOff) ? 1.f : 0.f, gam},
        {hue, ss, sh2, 0.f},
        {std::min(2.f, 1.f + (c.glossSat - 1.f) * s), c.glossTint * s, 1.f + 1.0f * sh, std::min(1.f, c.flatRefl * s)},
        {std::max(0.f, lod * 0.6f), 0.f, 0.f, 0.f},
        {c.fogOn ? c.fogIntensity : 1.f, c.fogOn ? c.fogDensity : 1.f, c.fogOn ? c.fogStart : 0.f, c.fogOn ? c.fogOpacity : 1.f},
        {c.fogOn ? c.fogTemp : 0.f, c.fogOn ? c.fogSat : 1.f, c.fogOn ? c.fogBright : 1.f, (c.fogOn && !pFog) ? c.fogCmix : 0.f},
        {(c.rimOn && !pRimOff) ? c.rimIntensity * s : 0.f, std::min(10.f, std::max(0.5f, c.rimPower * (1.5f - c.rimWidth))), c.rimSharp, c.rimBias},
        {c.rimR, c.rimG, c.rimB, c.rimRgb ? 1.f : 0.f},
        {c.rimSpeed, c.rimLight, c.rimSpread, c.rimFade},
        {pHdr ? 0.f : c.highlight * s, pHdr ? 0.f : c.hlComp * s, pHdr ? 0.f : c.shadowStrength * s, 0.f},
        {1.f + 3.f * std::min(1.f, std::max(0.f, c.ao)) * s, 1.f + (c.aoRadius - 1.f) * s, 1.f + (c.aoDetail - 1.f) * s, 0.f},
        {(c.fogOn && !pFog) ? c.fogEnd : 0.f, c.fogHeight * 400.f, (c.fogOn && !pFog) ? c.fogHfall : 0.f, (c.fogOn && !pFog) ? c.fogDfall : 1.f},
        {(c.fogOn && !pFog) ? c.fogSmooth : 0.f, (c.fogOn && !pFog) ? c.fogScatter : 0.f, (c.fogOn && !pFog) ? c.fogSky : 0.f, (c.fogOn && !pFog) ? c.fogAdapt : 0.f},
        {(c.fogOn && !pFog) ? c.fogCam : 0.f, c.fogR, c.fogG, c.fogB},
        {pRimX ? 0.f : c.rimSoft, pRimX ? 0.f : c.rimEdge, pRimX ? 0.f : c.rimMat, 0.f},
        {c.reflRough, c.reflFade * s, 50.f + c.reflDist * 450.f, 0.f},
    };
    LiveParams p;
    memcpy(p.u, v, sizeof v);
    return p;
}

namespace live_detail {

inline bool has(const std::string& s, const char* t) { return s.find(t) != std::string::npos; }

inline size_t replaceAll(std::string& s, const std::string& a, const std::string& b) {
    size_t n = 0, p = 0;
    while ((p = s.find(a, p)) != std::string::npos) { s.replace(p, a.size(), b); p += b.size(); n++; }
    return n;
}

inline bool isIdent(const std::string& s) {  // "_123" atau "VARYING9"
    if (s.empty()) return false;
    if (s[0] == '_') {
        if (s.size() < 2) return false;
        for (size_t i = 1; i < s.size(); i++) if (s[i] < '0' || s[i] > '9') return false;
        return true;
    }
    if (s.compare(0, 7, "VARYING") == 0 && s.size() > 7) {
        for (size_t i = 7; i < s.size(); i++) if (s[i] < '0' || s[i] > '9') return false;
        return true;
    }
    return false;
}
inline bool isVar(const std::string& s) { return s.size() >= 2 && s[0] == '_' && isIdent(s); }

inline bool usedAsEnvLod(const std::string& src, const std::string& var) {
    const std::string needle = ", " + var + ")";
    size_t p = 0;
    while ((p = src.find("textureLod(PrefilteredEnv", p)) != std::string::npos) {
        size_t e = src.find(';', p);
        if (e == std::string::npos) break;
        if (src.substr(p, e - p).find(needle) != std::string::npos) return true;
        p = e;
    }
    return false;
}

template <class F>
inline int rewriteFloatLines(std::string& src, F fn) {
    int n = 0;
    size_t pos = 0;
    std::string out;
    out.reserve(src.size() + 256);
    while (pos < src.size()) {
        size_t nl = src.find('\n', pos);
        size_t end = nl == std::string::npos ? src.size() : nl;
        std::string line = src.substr(pos, end - pos);
        size_t a = line.find_first_not_of(' ');
        std::string repl;
        if (a != std::string::npos && line.compare(a, 7, "float _") == 0 && line.back() == ';') {
            size_t eq = line.find(" = ", a);
            if (eq != std::string::npos) {
                std::string var = line.substr(a + 6, eq - (a + 6));
                std::string rhs = line.substr(eq + 3, line.size() - 1 - (eq + 3));
                if (isVar(var) && rhs.find(';') == std::string::npos && fn(src, var, rhs, repl)) {
                    line = line.substr(0, a) + "float " + var + " = " + repl + ";";
                    n++;
                }
            }
        }
        out += line;
        if (nl != std::string::npos) out += '\n';
        pos = end + 1;
        if (nl == std::string::npos) break;
    }
    src.swap(out);
    return n;
}

// bungkus textureLod(PrefilteredEnv...,vec4(vec3(...)...).xyz  (pantulan permukaan; BUKAN fog yang memakai "vec4(-vec3(")
inline int wrapEnvSamples(std::string& s) {
    int n = 0;
    size_t p = 0;
    while ((p = s.find("textureLod(PrefilteredEnv", p)) != std::string::npos) {
        size_t open = s.find('(', p);
        size_t q = s.find("vec4(", open);
        bool fog = q != std::string::npos && s.compare(q, 10, "vec4(-vec3") == 0;
        int depth = 0;
        size_t i = open;
        for (; i < s.size(); i++) {
            if (s[i] == '(') depth++;
            else if (s[i] == ')' && --depth == 0) break;
        }
        if (i >= s.size()) break;
        if (!fog && s.compare(i + 1, 4, ".xyz") == 0) {
            s.insert(i + 5, ")");
            s.insert(p, "rz_refl(");
            n++;
            p += 8 + (i - p) + 6;
        } else {
            p = i + 1;
        }
    }
    return n;
}

inline std::string lineAt(const std::string& s, size_t pos, size_t* b, size_t* e) {
    size_t st = s.rfind('\n', pos);
    st = st == std::string::npos ? 0 : st + 1;
    size_t en = s.find('\n', pos);
    if (en == std::string::npos) en = s.size();
    *b = st; *e = en;
    return s.substr(st, en - st);
}

// "<prefix><ident>.x" mulai di pos; kembalikan ident, geser pos
inline bool takeIdentX(const std::string& s, size_t& pos, const char* stop, std::string& id) {
    size_t e = s.find(".x", pos);
    if (e == std::string::npos) return false;
    id = s.substr(pos, e - pos);
    if (!isIdent(id)) return false;
    pos = e + 2;
    size_t l = strlen(stop);
    if (s.compare(pos, l, stop) != 0) return false;
    pos += l;
    return true;
}

// pantulan langit palsu pada shader 'flat'. Mengembalikan jumlah perubahan.
inline int addFlatReflection(std::string& s) {
    size_t fp = s.find("vec4(-vec3(");
    while (fp != std::string::npos) {
        size_t lb, le;
        std::string line = lineAt(s, fp, &lb, &le);
        if (line.find("textureLod(PrefilteredEnvTexture") == std::string::npos) { fp = s.find("vec4(-vec3(", fp + 1); continue; }
        size_t pos = fp + 11;
        std::string B, A, N;
        // B.x ? A.x : N.x,
        size_t q = s.find(".x ? ", pos);
        if (q == std::string::npos) return 0;
        B = s.substr(pos, q - pos);
        pos = q + 5;
        if (!takeIdentX(s, pos, " : ", A)) return 0;
        size_t e = s.find(".x,", pos);
        if (e == std::string::npos) return 0;
        N = s.substr(pos, e - pos);
        if (!isIdent(B) || !isIdent(A) || !isIdent(N)) return 0;
        // cari baris mix(vec3(...), LIT.xyz, vec3(F)) sesudah baris fog
        size_t from = le + 1, mb = 0, me = 0;
        size_t m = from;
        std::string mixLine, lit;
        for (int guard = 0; guard < 8 && m < s.size(); guard++) {
            std::string l = lineAt(s, m, &mb, &me);
            size_t k = l.find("= mix(vec3(");
            if (k != std::string::npos) {
                size_t t = l.rfind(".xyz, vec3(");
                if (t != std::string::npos) {
                    size_t b2 = l.rfind(", ", t);
                    if (b2 != std::string::npos) {
                        lit = l.substr(b2 + 2, t - (b2 + 2));
                        if (isVar(lit)) { mixLine = l; break; }
                    }
                }
            }
            m = me + 1;
        }
        if (mixLine.empty()) return 0;
        size_t t = mixLine.rfind(".xyz, vec3(");
        size_t b2 = mixLine.rfind(", ", t);
        std::string newMix = mixLine.substr(0, b2 + 2) + "(" + lit + ".xyz + rzRefl)" + mixLine.substr(t + 4);
        std::string add =
            "    vec3 rzN = normalize(" + N + ".xyz);\n"
            "    float rzUp = clamp(rzN.y, 0.0, 1.0);\n"
            "    vec3 rzR = vec3(-rzN.x, rzN.y, -rzN.z);\n"
            "    vec3 rzA = mat3(vec3(CB0[58].xyz), vec3(CB0[59].xyz), vec3(CB0[60].xyz)) * rzR;\n"
            "    vec3 rzC = textureLod(PrefilteredEnvTexture, vec4(vec3(" + B + ".x ? rzA.x : rzR.x, " + B + ".y ? rzA.y : rzR.y, " + B +
            ".z ? rzA.z : rzR.z), 0.0).xyz, RZ7.x).xyz * mix(CB0[31].xyz, CB0[30].xyz, vec3(clamp(rzR.y * 1.58823525905609130859375, 0.0, 1.0)));\n"
            "    vec3 rzRefl = rz_refl(rzC) * (RZ6.w * (0.12 + pow(1.0 - rzUp, 5.0)) * clamp(rzN.y * 6.0, 0.0, 1.0));\n";
        s.replace(mb, me - mb, add + newMix);
        return 1;
    }
    return 0;
}

}  // namespace live_detail

inline const char* liveReflFn() {
    return "vec3 rz_refl(vec3 c)\n{\n"
           "    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
           "    c = mix(vec3(l), c, RZ6.x);\n"
           "    c *= vec3(1.0 + (RZ6.y * 0.3), 1.0, 1.0 - (RZ6.y * 0.3));\n"
           "    return pow(max(c, vec3(0.0)), vec3(RZ6.z));\n}\n\n";
}

inline const char* liveFogFn() {
    return "float rz_fogx(float fd, float d, vec3 v, float hv)\n{\n"
           "    if (RZ8.x == 1.0 && RZ8.z <= 0.0 && RZ8.w >= 1.0 && RZ15.x <= 0.0 && RZ15.z <= 0.0 && RZ15.w == 1.0 && RZ16.x <= 0.0 && RZ16.w <= 0.0 && RZ17.x <= 0.0) return fd;\n"
           "    float a = 1.0 - pow(fd, max(RZ8.x, 0.001));\n"
           "    if (RZ8.z > 0.0)\n    {\n"
           "        float s0 = RZ8.z * 400.0;\n"
           "        a *= smoothstep(s0, s0 + max(s0 * 0.5, 20.0), d);\n"
           "    }\n"
           "    if (RZ15.z > 0.0 && hv > 0.5)\n    {\n"
           "        float wy = CB0[11].y - v.y;\n"
           "        a *= exp(-(max(wy - RZ15.y, 0.0) * (RZ15.z * 0.05)));\n"
           "    }\n"
           "    if (RZ15.w != 1.0) a = pow(max(a, 0.0), RZ15.w);\n"
           "    a = mix(a, (a * a) * (3.0 - (2.0 * a)), RZ16.x);\n"
           "    float lamp = dot(CB0[15].xyz, vec3(0.2126, 0.7152, 0.0722));\n"
           "    a *= mix(1.0, clamp(1.5 / (0.5 + (lamp * 0.5)), 0.5, 1.5), RZ16.w);\n"
           "    a *= mix(1.0, 1.0 - (0.5 * clamp(CB0[11].y / 300.0, 0.0, 1.0)), RZ17.x);\n"
           "    a = clamp(a * RZ8.w, 0.0, 1.0);\n"
           "    if (RZ15.x > 0.0)\n    {\n"
           "        float e = RZ15.x * 500.0;\n"
           "        a = max(a, smoothstep(e * 0.6, e, d));\n"
           "    }\n"
           "    return 1.0 - a;\n}\n\n"
           "vec3 rz_fogc(vec3 c)\n{\n"
           "    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
           "    c = mix(vec3(l), c, RZ9.y);\n"
           "    c = mix(c, RZ17.yzw * RZ17.yzw, RZ9.w);\n"
           "    c += CB0[15].xyz * (RZ16.y * 0.15);\n"
           "    c = mix(c, CB0[31].xyz, RZ16.z);\n"
           "    c *= RZ9.z;\n"
           "    return c * vec3(1.0 + (RZ9.x * 0.3), 1.0, 1.0 - (RZ9.x * 0.3));\n}\n\n";
}

inline const char* liveRimFn() {
    return "vec3 rz_rim(vec3 n, vec3 v, vec3 base)\n{\n"
           "    if (RZ10.x <= 0.0) return vec3(0.0);\n"
           "    float dist = length(v);\n"
           "    n = normalize(n);\n    v = normalize(v);\n"
           "    float x = clamp((1.0 - max(dot(n, v), 0.0)) + RZ10.w, 0.0, 1.0);\n"
           "    float r = pow(x, RZ10.y);\n"
           "    r = pow(r, 1.0 - (0.6 * RZ18.x));\n"
           "    r = mix(r, smoothstep(0.35, 0.75, r), RZ10.z);\n"
           "    r *= 1.0 + (RZ18.y * (((x * x) * x) * x));\n"
           "    r *= mix(1.0, clamp(1.0 - dot(base, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0), RZ18.z);\n"
           "    vec3 col = RZ11.xyz;\n"
           "    if (RZ11.w > 0.5)\n    {\n"
           "        float t = CB0[19].w * RZ12.x;\n"
           "        col = vec3(0.5) + (vec3(0.5) * cos(6.2831853 * (vec3(t) + vec3(0.0, 0.3333, 0.6667))));\n"
           "    }\n"
           "    float l = mix(1.0, clamp((dot(n, CB0[16].xyz) * 0.5) + 0.5, 0.0, 1.0), RZ12.y);\n"
           "    float fade = 1.0 - (RZ12.w * clamp(dist / 300.0, 0.0, 1.0));\n"
           "    return col * (((r * RZ10.x) * pow(l, RZ12.z)) * fade);\n}\n\n";
}

inline const char* liveRfadeFn() {
    return "float rz_rfade(float rough, float d)\n{\n"
           "    float t = 1.0 - smoothstep(RZ19.x, RZ19.x + 0.25, rough);\n"
           "    return t * (1.0 - (RZ19.y * smoothstep(RZ19.z * 0.3, RZ19.z, d)));\n}\n\n";
}

inline const char* liveGradeFn() {
    return "vec3 rz_grade(vec3 c)\n{\n"
           "    if (RZ4.z < 0.5) return c;\n"
           "    c *= RZ4.y;\n"
           "    c = clamp((c - RZ2.x) / max(RZ2.y - RZ2.x, 0.001), 0.0, 1.0);\n"
           "    c = pow(c, vec3(RZ4.w));\n"
           "    c = mix(c, (c * c) * (vec3(3.0) - (c * 2.0)), RZ2.z);\n"
           "    c = ((c - vec3(0.5)) * RZ2.w) + vec3(0.5 + RZ3.x);\n"
           "    float lh = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
           "    c *= 1.0 + (RZ13.x * lh * lh);\n"
           "    vec3 over = max(c - vec3(0.6), vec3(0.0));\n"
           "    c = min(c, vec3(0.6)) + (over / (vec3(1.0) + (over * (4.0 * RZ13.y))));\n"
           "    c *= 1.0 - ((RZ13.z * 0.5) * (1.0 - smoothstep(0.0, 0.5, lh)));\n"
           "    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
           "    float s = max(c.x, max(c.y, c.z)) - min(c.x, min(c.y, c.z));\n"
           "    c = mix(vec3(l), c, max(RZ3.y + (RZ3.z * (1.0 - s)), 0.0));\n"
           "    if (abs(RZ5.x) > 0.0005)\n    {\n"
           "        float h = RZ5.x * 6.2831853;\n"
           "        float ch = cos(h);\n        float sh = sin(h);\n"
           "        vec3 yiq = vec3(dot(c, vec3(0.299, 0.587, 0.114)), dot(c, vec3(0.596, -0.274, -0.322)), dot(c, vec3(0.211, -0.523, 0.312)));\n"
           "        vec2 iq = vec2((yiq.y * ch) - (yiq.z * sh), (yiq.y * sh) + (yiq.z * ch));\n"
           "        c = vec3((yiq.x + (0.956 * iq.x)) + (0.621 * iq.y), (yiq.x - (0.272 * iq.x)) - (0.647 * iq.y), (yiq.x - (1.106 * iq.x)) + (1.703 * iq.y));\n"
           "    }\n"
           "    c *= vec3(1.0 + (RZ3.w * 0.1), 1.0, 1.0 - (RZ3.w * 0.1));\n"
           "    float lm = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
           "    c += vec3(0.08, 0.0, -0.08) * ((RZ5.y * (1.0 - lm)) + (RZ5.z * lm));\n"
           "    return clamp(c, vec3(0.0), vec3(1.0));\n}\n\n";
}

// Return shader baru, atau string kosong bila shader ini tidak disentuh. *edits = jumlah perubahan.
inline std::string liveRewrite(const std::string& src, int* edits) {
    using namespace live_detail;
    if (edits) *edits = 0;
    if (src.compare(0, 15, "#version 300 es") != 0) return std::string();
    if (has(src, "gl_Position")) return std::string();  // vertex shader
    const bool pbr = has(src, "PrefilteredEnvTexture") && has(src, "reflect(");
    const bool flat = !pbr && has(src, "PrefilteredEnvTexture") && has(src, "vec4(-vec3(") && has(src, "CB0[58]") &&
                      has(src, "CB0[30]") == has(src, "CB0[30]");
    const bool comp = has(src, "CB1[2].xyz") && has(src, "Texture0Texture") && has(src, "_entryPointOutput = vec4(dot(");
    const std::string gammaKey = " * CB0[20].y, vec3(0.0), vec3(1.0)));";
    const bool grade = has(src, "sqrt(clamp(") && has(src, gammaKey.c_str());
    const bool ssao = has(src, "depthBufferTexture") && has(src, "randMapTexture") && has(src, "ScreenSpaceSSAOCB");
    if (!pbr && !flat && !comp && !grade && !ssao) return std::string();

    std::string s = src;
    int n = 0;
    bool uRf = false;
    std::string roughVar;
    const bool hasV4 = has(src, "length(VARYING4.xyz)") || has(src, "VARYING4.xyz");
    bool u0 = false, u1 = false, uGrade = false, uRefl = false, uFlat = false, uBloom = false, uFog = false, uRim = false;
    std::string rimN, rimV;

    if (pbr) {
        if (replaceAll(s, "vec3(0.039999999105930328369140625)", "vec3(RZ0.x)")) { n++; u0 = true; }
        n += rewriteFloatLines(s, [&](const std::string& all, const std::string& var, const std::string& rhs, std::string& out) {
            if (rhs.size() > 6 && rhs.compare(rhs.size() - 6, 6, " * 5.0") == 0 && isVar(rhs.substr(0, rhs.size() - 6)) &&
                usedAsEnvLod(all, var)) {
                out = rhs.substr(0, rhs.size() - 6) + " * RZ0.y";
                u0 = true;
                return true;
            }
            if (rhs == "CB0[31].w * clamp(1.0 - (VARYING3.w * CB0[28].y), 0.0, 1.0)") {
                std::string rf = roughVar.empty() ? "" : " * rz_rfade(" + roughVar + ", " + (hasV4 ? "length(VARYING4.xyz)" : "0.0") + ")";
                out = "min(max(CB0[31].w, RZ0.z) * clamp(1.0 - (VARYING3.w * CB0[28].y), 0.0, 1.0) * RZ0.w" + rf + ", 1.0)";
                u0 = true;
                if (!rf.empty()) uRf = true;
                return true;
            }
            if (rhs.compare(0, 31, "0.08900000154972076416015625 + ") == 0) {
                roughVar = var;
                out = "max((" + rhs + ") * RZ1.x, RZ1.x < 0.999 ? 0.03 : 0.0)";
                u1 = true;
                return true;
            }
            return false;
        });
        if (replaceAll(s, "* CB0[15].xyz) * 1.0)", "* CB0[15].xyz) * RZ1.y)")) { n++; u1 = true; }
        if (wrapEnvSamples(s)) { n++; uRefl = true; }
    }

    if (flat) {
        // fungsi rz_refl harus ada sebelum dipakai; addFlatReflection memakai RZ6/RZ7
        std::string t = s;
        if (addFlatReflection(t)) { s.swap(t); n++; uFlat = true; uRefl = true; }
    }

    if (pbr) {
        size_t r = s.find("= reflect(-");
        if (r != std::string::npos) {
            size_t a = r + 11, c1 = s.find(", ", a), c2 = c1 == std::string::npos ? c1 : s.find(")", c1);
            if (c2 != std::string::npos) {
                std::string V = s.substr(a, c1 - a), N = s.substr(c1 + 2, c2 - (c1 + 2));
                if (isIdent(V) && isIdent(N)) { rimV = V; rimN = N; }
            }
        }
    }

    {   // fog adaptif: faktor fog + warna fog
        const std::string k1 = "clamp(exp2((CB0[18].z * ", k2 = ") + CB0[18].x) - CB0[18].w, 0.0, 1.0)";
        size_t p = 0;
        int k = 0;
        while ((p = s.find(k1, p)) != std::string::npos) {
            size_t e = s.find(k2, p + k1.size());
            if (e == std::string::npos || e - p > 80) { p += k1.size(); continue; }
            std::string X = s.substr(p + k1.size(), e - (p + k1.size()));
            std::string vv = "vec3(0.0)", hv = "0.0";
            if (X.compare(0, 7, "length(") == 0 && X.size() > 12 && X.compare(X.size() - 5, 5, ".xyz)") == 0) {
                std::string id = X.substr(7, X.size() - 12);
                if (isIdent(id)) { vv = id + ".xyz"; hv = "1.0"; }
            }
            std::string rep = "rz_fogx(clamp(exp2((CB0[18].z * RZ8.y * " + X + ") + CB0[18].x) - CB0[18].w, 0.0, 1.0), " + X + ", " + vv + ", " + hv + ")";
            s.replace(p, e + k2.size() - p, rep);
            p += rep.size();
            k++;
        }
        if (k) {
            n += k;
            uFog = true;
            if (replaceAll(s, "CB0[19].xyz", "rz_fogc(CB0[19].xyz)")) n++;
        }
    }

    if (grade) {
        size_t p = 0;
        int k = 0;
        while ((p = s.find(gammaKey, p)) != std::string::npos) {
            size_t b, e;
            std::string line = lineAt(s, p, &b, &e);
            // "    vec3 V = sqrt(clamp(" -> sisipkan baris "V = rz_grade(V);" sesudahnya
            size_t a = line.find_first_not_of(' ');
            if (a != std::string::npos && line.compare(a, 5, "vec3 ") == 0) {
                size_t eq = line.find(" = sqrt(clamp(", a);
                std::string var = eq == std::string::npos ? "" : line.substr(a + 5, eq - (a + 5));
                if (isVar(var) && line.back() == ';') {
                    std::string ind = line.substr(0, a);
                    std::string ins = "\n" + ind + var + " = rz_grade(" + var + ");";
                    size_t shift = 0;
                    if (!rimN.empty()) {  // rimlight: sisipkan sebelum baris gamma, tambahkan ke warna
                        size_t kk = line.find(" = sqrt(clamp(") + strlen(" = sqrt(clamp(");
                        size_t mm = line.find(" * CB0[20].y", kk);
                        if (mm != std::string::npos) {
                            std::string arg = line.substr(kk, mm - kk);
                            std::string rv = "rzRim" + std::to_string(k);
                            std::string nl = ind + "vec3 " + rv + " = rz_rim(" + rimN + ".xyz, " + rimV + ".xyz, " + arg + ");\n" +
                                             line.substr(0, kk) + "(" + arg + " + " + rv + ")" + line.substr(mm);
                            s.replace(b, e - b, nl);
                            shift = nl.size() - line.size();
                            e += shift;
                            uRim = true;
                            n++;
                        }
                    }
                    s.insert(e, ins);
                    k++;
                    p = e + ins.size();
                    continue;
                }
            }
            p = e;
        }
        if (k) { n += k; uGrade = true; }
    }

    if (comp && replaceAll(s, "vec3(CB1[5].x)", "vec3(clamp(CB1[5].x * RZ4.x, 0.0, 1.0))")) { n++; uBloom = true; }

    bool uAo = false;
    if (ssao) {  // SSAO bawaan Roblox: radius, sensitivitas kedalaman, kekuatan (eksponen pada hasil akhir)
        const std::string rad = "CB1[2].xy * (0.0040000001899898052215576171875 / ";
        if (replaceAll(s, rad, "CB1[2].xy * RZ14.y * (0.0040000001899898052215576171875 / ")) { n++; uAo = true; }
        if (replaceAll(s, "CB1[0].zw * 100.0)", "CB1[0].zw * 100.0 * max(RZ14.y, 1.0))")) { n++; uAo = true; }
        if (replaceAll(s, "(124.99999237060546875 / sqrt(", "(124.99999237060546875 * RZ14.z / sqrt(")) { n++; uAo = true; }
        size_t eo = s.find("_entryPointOutput = vec4(");
        if (eo != std::string::npos) {
            const std::string aoOld = ", 0.0, 1.0), 1.0)";
            size_t pe = s.find(aoOld, eo);
            size_t le = s.find(';', eo);
            if (pe != std::string::npos && pe < le) { s.replace(pe, aoOld.size(), ", 0.0, 1.0), RZ14.x)"); n++; uAo = true; }
        }
    }

    if (!n) return std::string();
    std::string decl;
    auto U = [&](int i) { decl += "uniform vec4 RZ" + std::to_string(i) + ";\n"; };
    if (u0) U(0);
    if (u1) U(1);
    if (uGrade) { U(2); U(3); U(4); U(5); U(13); }
    else if (uBloom) U(4);
    if (uFog) { U(8); U(9); U(15); U(16); U(17); }
    if (uRim) { U(10); U(11); U(12); U(18); }
    if (uRf) U(19);
    if (uAo) U(14);
    if (uRefl) U(6);
    if (uFlat) U(7);
    if (uRefl) decl += liveReflFn();
    if (uFog) decl += liveFogFn();
    if (uRim) decl += liveRimFn();
    if (uRf) decl += liveRfadeFn();
    if (uGrade) decl += liveGradeFn();
    size_t m = s.find("void main()");
    if (m == std::string::npos) return std::string();
    s.insert(m, decl + "\n");
    if (edits) *edits = n;
    return s;
}

}  // namespace rz
