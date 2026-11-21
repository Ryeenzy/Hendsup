// RYEENZYXNZ depth pipeline: GLSL ES 3.00 untuk pass layar (AO, SSR, komposit, DOF, autofocus, debug).
// Semua pass membaca depth hardware yang disalin dari FBO scene Roblox (lihat dpipe.cpp) dan merekonstruksi posisi dunia
// lewat invers ViewProjection (CB0[0..3] milik Roblox). Dapat diuji di WebGL2 (tests/dpipe_math.py).
#pragma once
#include <string>

namespace rz {

enum DpPass { kDpAo = 0, kDpSsr = 1, kDpComp = 2, kDpFinal = 3, kDpFocus = 4, kDpDepthLin = 5 };

inline const char* dpVertex() {
    return "#version 300 es\n"
           "out vec2 vUv;\n"
           "void main() {\n"
           "    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));\n"
           "    vUv = p;\n"
           "    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);\n"
           "}\n";
}

inline const char* dpCommon() {
    return R"(#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uColor;   // salinan backbuffer (hasil akhir post Roblox, sebelum UI)
uniform sampler2D uDepth;   // salinan depth scene
uniform sampler2D uTexA;    // AO
uniform sampler2D uTexB;    // SSR (rgb = warna pantulan, a = bobot)
uniform sampler2D uTexC;    // komposit (masukan DOF)
uniform sampler2D uHist;    // histori temporal / fokus sebelumnya
uniform sampler2D uFocus;   // autofocus 1x1
uniform mat4 uInvVP;
uniform mat4 uVP;
uniform mat4 uPrevVP;
uniform vec4 uCam;   // xyz = posisi kamera, w = nomor frame
uniform vec4 uView;  // x = 1/lebar keluaran, y = 1/tinggi keluaran, z = flipY, w = reversed-z
uniform vec4 uMx0;   // intensity, radius, samples, 0
uniform vec4 uMx1;   // darkness, softness, fine, coarse
uniform vec4 uMx2;   // normalBias, depthBias, edge, blurPx
uniform vec4 uMx3;   // denoise, temporal, 0, 0
uniform vec4 uSs0;   // intensity, steps, maxDist, thickness
uniform vec4 uSs1;   // fade, edgeFade, floorOnly, blur
uniform vec4 uSs2;   // temporal, 0, 0, 0
uniform vec4 uDf0;   // intensity, focusDist, range, transition
uniform vec4 uDf1;   // near, far, radiusPx, bokeh
uniform vec4 uDf2;   // shape, samples, aperture, focalLength
uniform vec4 uDf3;   // autofocus, smoothing, fg, bg
uniform vec4 uDbg;   // x = mode debug
uniform vec4 uOl0;   // outline: strength, thickness, sensitivity, softness
uniform vec4 uOl1;   // fadeStart, fadeEnd, skyEdges, blend
uniform vec4 uOl2;   // rgb, debug
in vec2 vUv;
layout(location = 0) out vec4 o;

vec2 flipUv(vec2 u) { return uView.z > 0.5 ? vec2(u.x, 1.0 - u.y) : u; }
bool isSky(float d) { return uView.w > 0.5 ? d <= 0.000001 : d >= 0.999999; }
float dep(vec2 du) { return textureLod(uDepth, du, 0.0).x; }
vec4 unproj(vec2 du, float d) { return uInvVP * vec4(du * 2.0 - 1.0, d * 2.0 - 1.0, 1.0); }
vec3 posAt(vec2 du) { float d = dep(du); vec4 h = unproj(du, d); return h.xyz / h.w; }
float wAt(vec2 du) { float d = dep(du); if (isSky(d)) return 100000.0; return 1.0 / unproj(du, d).w; }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

// ---- PrismShade Outline: depth terbalik (0.1/jarak), langit = 0
float olInv(vec2 u) {
    float d = dep(u);
    if (isSky(d)) return 0.0;
    return 0.1 / max(1.0 / unproj(u, d).w, 0.1);
}
float olBend(float c, float a, float b) {
    float nearest = max(c, max(a, b));
    return abs(a + b - 2.0 * c) / max(nearest, 1e-6);
}

vec3 normalAt(vec2 du, vec3 P) {
    vec2 t = 1.0 / vec2(textureSize(uDepth, 0));
    vec3 pr = posAt(du + vec2(t.x, 0.0)), pl = posAt(du - vec2(t.x, 0.0));
    vec3 pu = posAt(du + vec2(0.0, t.y)), pd = posAt(du - vec2(0.0, t.y));
    vec3 dx = length(pr - P) < length(P - pl) ? (pr - P) : (P - pl);
    vec3 dy = length(pu - P) < length(P - pd) ? (pu - P) : (P - pd);
    vec3 n = cross(dx, dy);
    float l = length(n);
    n = l > 1e-8 ? n / l : vec3(0.0, 1.0, 0.0);
    if (dot(n, uCam.xyz - P) < 0.0) n = -n;
    return n;
}

float aoScale(vec3 P, vec3 N, float rad, int ns, float noise, float Pw) {
    vec3 T = normalize(abs(N.y) < 0.99 ? cross(vec3(0.0, 1.0, 0.0), N) : cross(vec3(1.0, 0.0, 0.0), N));
    vec3 B = cross(N, T);
    float occ = 0.0;
    for (int i = 0; i < 64; i++) {
        if (i >= ns) break;
        vec2 xi = fract(vec2(0.7548776662, 0.5698402910) * float(i + 1) + vec2(noise, fract(noise * 7.31)));
        float ph = 6.2831853 * xi.x;
        float r = sqrt(xi.y);
        vec3 d = vec3(r * cos(ph), r * sin(ph), sqrt(max(1.0 - xi.y, 0.0)));
        float sc = (float(i) + 0.5) / float(ns);
        sc = mix(0.15, 1.0, sc * sc);
        vec3 sp = P + N * uMx2.x + (T * d.x + B * d.y + N * d.z) * rad * sc;
        vec4 c = uVP * vec4(sp, 1.0);
        if (c.w <= 0.0001) continue;
        vec2 du = (c.xy / c.w) * 0.5 + 0.5;
        if (du.x < 0.0 || du.y < 0.0 || du.x > 1.0 || du.y > 1.0) continue;
        float sd = dep(du);
        if (isSky(sd)) continue;
        float sw = 1.0 / unproj(du, sd).w;
        float diff = c.w - sw;
        float rc = smoothstep(0.0, 1.0, rad / max(abs(Pw - sw), 0.0001));
        occ += step(uMx2.y, diff) * rc;
    }
    return 1.0 - occ / float(ns);
}

vec3 cocOf(float w, float focus, vec2 rangeTrans) {  // x = kekuatan blur 0..1, y = 1 bila foreground
    float tr = mix(10.0, 400.0, rangeTrans.y);
    float farK = clamp((w - focus - rangeTrans.x) / tr, 0.0, 1.0) * uDf1.y * uDf3.w;
    float nearK = clamp((focus - rangeTrans.x - w) / (tr * 0.5), 0.0, 1.0) * uDf1.x * uDf3.z;
    return vec3(max(farK, nearK), nearK > farK ? 1.0 : 0.0, 0.0);
}
)";
}

inline const char* dpBodyAo() {
    return R"(
void main() {
    vec2 du = flipUv(vUv);
    float d = dep(du);
    if (isSky(d)) { o = vec4(1.0, 1.0e5, 0.0, 1.0); return; }
    vec3 P = posAt(du);
    vec3 N = normalAt(du, P);
    float Pw = (uVP * vec4(P, 1.0)).w;
    float noise = ign(gl_FragCoord.xy + 5.588238 * uCam.w);
    int ns = int(uMx0.z + 0.5);
    float fine = aoScale(P, N, uMx0.y * 0.25, max(ns / 2, 2), noise, Pw);
    float coarse = aoScale(P, N, uMx0.y, ns, fract(noise + 0.37), Pw);
    float ao = (fine * uMx1.z + coarse * uMx1.w) / max(uMx1.z + uMx1.w, 0.001);
    ao = pow(clamp(ao, 0.0, 1.0), max(uMx1.x, 0.05));
    ao = mix(ao, smoothstep(0.0, 1.0, ao), uMx1.y);
    vec2 t = 1.0 / vec2(textureSize(uDepth, 0));
    float e = max(abs(wAt(du + vec2(t.x, 0.0)) - wAt(du - vec2(t.x, 0.0))), abs(wAt(du + vec2(0.0, t.y)) - wAt(du - vec2(0.0, t.y)))) / max(Pw, 0.001);
    ao = mix(ao, 1.0, uMx2.z * clamp(e * 20.0, 0.0, 1.0));
    if (uMx3.y > 0.0) {
        vec4 pc = uPrevVP * vec4(P, 1.0);
        if (pc.w > 0.0001) {
            vec2 pu = flipUv((pc.xy / pc.w) * 0.5 + 0.5);
            if (pu.x > 0.0 && pu.y > 0.0 && pu.x < 1.0 && pu.y < 1.0) {
                vec2 h = texture(uHist, pu).xy;
                // Anti-ghosting: objek bergerak (avatar) meninggalkan jejak bila histori dipakai apa adanya.
                // Tolak histori bila kedalamannya beda (>1%) atau nilai AO-nya jauh beda dari frame sekarang.
                float valid = 1.0 - clamp(abs(h.y - pc.w) / (0.01 * pc.w), 0.0, 1.0);
                valid *= 1.0 - smoothstep(0.04, 0.16, abs(h.x - ao));
                float hv = clamp(h.x, ao - 0.1, ao + 0.1);
                ao = mix(ao, hv, uMx3.y * 0.8 * valid);
            }
        }
    }
    o = vec4(ao, Pw, 0.0, 1.0);
}
)";
}

inline const char* dpBodySsr() {
    return R"(
void main() {
    vec2 du = flipUv(vUv);
    float d = dep(du);
    if (isSky(d)) { o = vec4(0.0); return; }
    vec3 P = posAt(du);
    vec3 N = normalAt(du, P);
    vec3 V = normalize(P - uCam.xyz);
    vec3 R = reflect(V, N);
    float Pw = (uVP * vec4(P, 1.0)).w;
    float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, -V), 0.0), 5.0);
    float floorMask = mix(1.0, smoothstep(0.55, 0.9, N.y), uSs1.z);
    float camFade = 1.0 - smoothstep(0.82, 0.995, dot(R, -V));   // lebih longgar: permukaan avatar yang menghadap kamera tetap memantul
    int steps = int(uSs0.y + 0.5);
    float maxD = uSs0.z;
    float thick = uSs0.w;
    float jitter = ign(gl_FragCoord.xy + 3.14159 * uCam.w);
    vec3 ro = P + N * (0.02 + 0.002 * Pw);
    float prevT = 0.0;
    float hitT = -1.0;
    vec2 hitUv = vec2(0.0);
    for (int i = 0; i < 128; i++) {
        if (i >= steps) break;
        float s = (float(i) + jitter) / float(steps);
        float t = maxD * (s * s * 0.6 + s * 0.4);
        vec4 c = uVP * vec4(ro + R * t, 1.0);
        if (c.w <= 0.01) break;
        vec2 u = (c.xy / c.w) * 0.5 + 0.5;
        if (u.x < 0.0 || u.y < 0.0 || u.x > 1.0 || u.y > 1.0) break;
        float sd = dep(u);
        if (!isSky(sd)) {
            float sw = 1.0 / unproj(u, sd).w;
            float diff = c.w - sw;
            if (diff > 0.0 && diff < thick + (t - prevT) * 0.75) {
                float lo = prevT, hi = t;
                vec2 bu = u;
                for (int k = 0; k < 6; k++) {
                    float tm = 0.5 * (lo + hi);
                    vec4 cm = uVP * vec4(ro + R * tm, 1.0);
                    vec2 um = (cm.xy / cm.w) * 0.5 + 0.5;
                    float dm = dep(um);
                    float swm = isSky(dm) ? 1.0e9 : 1.0 / unproj(um, dm).w;
                    if (cm.w > swm) { hi = tm; bu = um; } else { lo = tm; }
                }
                hitT = hi;
                hitUv = bu;
                break;
            }
        }
        prevT = t;
    }
    if (hitT < 0.0) { o = vec4(0.0); return; }
    vec3 col = texture(uColor, flipUv(hitUv)).rgb;
    float e = min(min(hitUv.x, 1.0 - hitUv.x), min(hitUv.y, 1.0 - hitUv.y));
    float edge = smoothstep(0.0, uSs1.y * 0.2 + 0.001, e);
    float distFade = mix(1.0, 1.0 - clamp(hitT / maxD, 0.0, 1.0), uSs1.x);
    float w = uSs0.x * (0.5 + 0.5 * fres) * edge * distFade * floorMask * camFade;   // dasar 0.5 (sebelumnya 0.2): objek tegak seperti avatar tidak lagi tipis
    vec4 res = vec4(col, clamp(w, 0.0, 1.0));
    if (uSs2.x > 0.0) {
        vec4 pc = uPrevVP * vec4(P, 1.0);
        if (pc.w > 0.0001) {
            vec2 pu = flipUv((pc.xy / pc.w) * 0.5 + 0.5);
            if (pu.x > 0.0 && pu.y > 0.0 && pu.x < 1.0 && pu.y < 1.0) {
                vec4 h = texture(uHist, pu);
                float dc = length(h.rgb - res.rgb);
                float hvalid = (1.0 - smoothstep(0.08, 0.3, dc)) * (1.0 - smoothstep(0.1, 0.4, abs(h.a - res.a)));
                h.rgb = clamp(h.rgb, res.rgb - 0.12, res.rgb + 0.12);
                res = mix(res, h, uSs2.x * 0.7 * hvalid);
            }
        }
    }
    o = res;
}
)";
}

inline const char* dpBodyComp() {
    return R"(
void main() {
    vec3 base = texture(uColor, vUv).rgb;
    if (uMx0.x > 0.0) {
        vec2 du = flipUv(vUv);
        float w0 = wAt(du);
        float rpx = uMx2.w;
        float sum = 0.0, ws = 0.0;
        for (int y = -2; y <= 2; y++) {
            for (int x = -2; x <= 2; x++) {
                vec2 off = vec2(float(x), float(y)) * (rpx * 0.5) * uView.xy;
                float aoS = texture(uTexA, vUv + off).x;
                float wS = wAt(flipUv(vUv + off));
                float wt = exp(-abs(wS - w0) / max(w0 * 0.02, 0.01)) * (1.0 + 0.0 * uMx3.x);
                if (rpx <= 0.0) wt = (x == 0 && y == 0) ? 1.0 : 0.0;
                sum += aoS * wt;
                ws += wt;
            }
        }
        float ao = clamp(sum / max(ws, 0.0001), 0.0, 1.0);
        float I = uMx0.x;
        base *= mix(1.0, ao, min(I, 1.0)) * pow(max(ao, 0.0001), max(I - 1.0, 0.0));
    }
    if (uSs0.x > 0.0) {
        vec4 acc = vec4(0.0);
        float bl = uSs1.w * 8.0;
        float wsum = 0.0;
        float cA = 0.0;
        for (int i = 0; i < 9; i++) {
            vec2 off = vec2(float(i % 3) - 1.0, float(i / 3) - 1.0) * bl * uView.xy;
            vec4 s = texture(uTexB, vUv + off);
            float wt = (i == 4) ? 2.0 : 1.0;
            if (bl <= 0.0 && i != 4) wt = 0.0;
            acc.rgb += s.rgb * s.a * wt;
            acc.a += s.a * wt;
            wsum += wt;
            if (i == 4) cA = s.a;
        }
        float a = max(acc.a / wsum, cA);   // jangan encerkan pantulan di tepi objek kecil (avatar) oleh tetangga yang tidak kena
        vec3 rc = acc.a > 0.0001 ? acc.rgb / acc.a : base;
        base = mix(base, rc, clamp(a, 0.0, 1.0));
    }
    o = vec4(base, 1.0);
}
)";
}

inline const char* dpBodyFinal() {
    return R"(
void main() {
    vec2 du = flipUv(vUv);
    vec4 src = texture(uTexC, vUv);
    vec3 c = src.rgb;
    float mode = uDbg.x;
    if (uDf0.x > 0.0) {
        float focus = uDf3.x > 0.5 ? texture(uFocus, vec2(0.5)).x : uDf0.y;
        float w0 = wAt(du);
        vec3 k0 = cocOf(w0, focus, uDf0.zw);
        float apF = clamp(4.0 / max(uDf2.z, 0.5), 0.25, 4.0) * clamp(uDf2.w / 50.0, 0.2, 4.0);
        float rc = uDf1.z * k0.x * uDf0.x * apF;
        if (rc > 0.4) {
            int ns = int(uDf2.y + 0.5);
            vec3 acc = c;
            float wsum = 1.0;
            for (int i = 0; i < 96; i++) {
                if (i >= ns) break;
                float a = float(i) * 2.39996323;
                float r = sqrt((float(i) + 0.5) / float(ns));
                if (uDf2.x > 0.5 && uDf2.x < 1.5) {
                    float ang = mod(a, 1.0471976) - 0.5235988;
                    r *= 0.866 / cos(ang);
                } else if (uDf2.x >= 1.5) {
                    r *= 0.55 + 0.45 * abs(cos(2.5 * a));
                }
                vec2 offPx = vec2(cos(a), sin(a)) * r * rc;
                vec2 tap = vUv + offPx * uView.xy;
                float ws = wAt(flipUv(tap));
                vec3 ks = cocOf(ws, focus, uDf0.zw);
                float rs = uDf1.z * ks.x * uDf0.x * apF;
                if (ws > w0) rs = min(rs, rc);
                float dpx = length(offPx);
                float wt = clamp(rs - dpx + 1.0, 0.0, 1.0);
                vec3 cs = texture(uTexC, tap).rgb;
                wt *= 1.0 + uDf1.w * 3.0 * max(luma(cs) - 0.7, 0.0);
                acc += cs * wt;
                wsum += wt;
            }
            c = acc / wsum;
        }
    }
    if (uOl0.x > 0.0 || uOl2.w > 0.5) {  // PrismShade Outline (diterjemahkan dari PrismShade_Outline.fx)
        vec2 sz = vec2(textureSize(uColor, 0));
        vec2 stp = vec2((sz.y / sz.x), 1.0) * (uOl0.y * 0.0016);
        vec2 dg = stp * 0.7071;
        float c0 = olInv(du), e = olInv(du + vec2(stp.x, 0.0)), w = olInv(du - vec2(stp.x, 0.0));
        float n = olInv(du - vec2(0.0, stp.y)), s = olInv(du + vec2(0.0, stp.y));
        float ne = olInv(du + vec2(dg.x, -dg.y)), sw = olInv(du + vec2(-dg.x, dg.y));
        float nw = olInv(du - dg), se = olInv(du + dg);
        float bend = max(max(olBend(c0, e, w), olBend(c0, n, s)), max(olBend(c0, ne, sw), olBend(c0, nw, se)));
        float thr = mix(0.5, 0.008, sqrt(uOl0.z));
        float edge = smoothstep(thr, thr * mix(1.0, 4.0, uOl0.w), bend);
        float nearest = max(c0, max(max(e, w), max(n, s)));
        float dstu = 0.1 / max(nearest, 1e-6);
        float fade = 1.0 - smoothstep(uOl1.x, max(uOl1.y, uOl1.x + 1.0), dstu);
        float sky = nearest <= 1e-6 ? 1.0 : 0.0;
        float againstSky = min(min(c0, min(e, w)), min(n, s)) <= 1e-6 ? 1.0 : 0.0;
        if (uOl1.z < 0.5 && againstSky > 0.5) edge = 0.0;
        edge *= mix(fade, 1.0, sky) * (uOl2.w > 0.5 ? 1.0 : uOl0.x);
        vec3 oc = uOl2.rgb;
        if (uOl2.w > 0.5) c = vec3(edge);
        else if (uOl1.w < 0.5) c = mix(c, oc, edge);
        else if (uOl1.w < 1.5) c = c + oc * edge;
        else c = c * mix(vec3(1.0), oc, edge);
    }
    if (mode > 0.5) {
        float d = dep(du);
        vec3 P = posAt(du);
        if (mode < 1.5) {
            c = isSky(d) ? vec3(0.0, 0.0, 0.3) : vec3(fract(log2(max(wAt(du), 1.0)) * 0.5));
        } else if (mode < 2.5) {
            c = isSky(d) ? vec3(0.0) : normalAt(du, P) * 0.5 + 0.5;
        } else if (mode < 3.5) {
            c = vec3(texture(uTexA, vUv).x);
        } else if (mode < 4.5) {
            vec4 s = texture(uTexB, vUv);
            c = s.rgb * s.a;
        } else if (mode < 5.5) {
            vec3 g = abs(fract(P / 4.0 + 0.5) - 0.5);
            float line = 1.0 - smoothstep(0.0, 0.04, min(g.x, min(g.y, g.z)));
            c = mix(c, vec3(1.0, 0.1, 0.1), isSky(d) ? 0.0 : line);
        } else {
            float focus = uDf3.x > 0.5 ? texture(uFocus, vec2(0.5)).x : uDf0.y;
            c = vec3(cocOf(wAt(du), focus, uDf0.zw).x);
        }
    }
    o = vec4(c, 1.0);
}
)";
}

inline const char* dpBodyFocus() {
    return R"(
void main() {
    float acc = 0.0, n = 0.0;
    for (int i = 0; i < 5; i++) {
        vec2 u = vec2(0.5) + (i == 0 ? vec2(0.0) : (i == 1 ? vec2(0.02, 0.0) : (i == 2 ? vec2(-0.02, 0.0) : (i == 3 ? vec2(0.0, 0.02) : vec2(0.0, -0.02)))));
        float w = wAt(u);
        if (w < 99999.0) { acc += w; n += 1.0; }
    }
    float prev = texture(uHist, vec2(0.5)).x;
    float cur = n > 0.0 ? acc / n : (prev > 0.0 ? prev : uDf0.y);
    if (prev <= 0.0) prev = cur;
    o = vec4(mix(cur, prev, clamp(uDf3.y, 0.0, 0.98)), 0.0, 0.0, 1.0);
}
)";
}

// Depth Roblox -> penyandian yang diasumsikan efek ReShade (terbalik, far 1000): shader membalik (1-d) lalu d/(1000-999d)
inline const char* dpBodyDepthLin() {
    return R"(
void main() {
    vec2 du = flipUv(vUv);
    float d = dep(du);
    float lin = 1.0;
    if (!isSky(d)) lin = clamp((1.0 / unproj(du, d).w) / 1000.0, 0.0, 1.0);
    float dd = 1000.0 * lin / (1.0 + 999.0 * lin);
    o = vec4(1.0 - dd, 0.0, 0.0, 1.0);
}
)";
}

inline std::string dpFragment(DpPass p) {
    std::string s = dpCommon();
    switch (p) {
        case kDpAo: s += dpBodyAo(); break;
        case kDpSsr: s += dpBodySsr(); break;
        case kDpComp: s += dpBodyComp(); break;
        case kDpFinal: s += dpBodyFinal(); break;
        case kDpFocus: s += dpBodyFocus(); break;
        case kDpDepthLin: s += dpBodyDepthLin(); break;
    }
    return s;
}

}  // namespace rz
