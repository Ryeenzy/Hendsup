// RYEENZYXNZ engine config. Plain key=value lines (file rz_config.cfg, written by the in-game overlay).
// Strict: any unknown key / malformed / out-of-range line rejects the WHOLE update (fail closed, previous config stays).
// "Neutral" values (everything at its default) make the shader a pass-through.
#pragma once
#include <cstdlib>
#include <cstring>
#include <string>

namespace rz {

struct Config {
    bool enabled = false;
    float strength = 1.f;        // global multiplier for every effect (0..1.5)

    // color grading (additive form: 0 = neutral)
    float brightness = 0.f;      // -0.5..0.5
    float contrast = 0.f;        // -0.5..1
    float saturation = 0.f;      // -1..1.5
    float warmth = 0.f;          // -1..1
    float exposure = 0.f;        // EV, -2..2
    float levelsBlack = 0.f;     // 0..0.5   (Levels.fx BlackPoint/255)
    float levelsWhite = 1.f;     // 0.5..1   (Levels.fx WhitePoint/255)
    float curves = 0.f;          // 0..1     S-curve amount
    float vibrance = 0.f;        // -1..1

    // LIVE: tulis ulang shader Roblox sendiri (liveshader.hpp) dengan uniform hidup; tanpa pass layar
    bool live = false;           // aktif saat shader dikompilasi (restart Roblox setelah mengubahnya)
    float glass = 0.f;           // 0..1 mode kaca: semua material memantul (tekstur asli tidak diubah)
    float wet = 0.f;             // 0..1 efek basah/becek (kekasaran turun)
    float glossClarity = 0.f;    // 0..1 kejernihan pantulan (LOD lebih rendah = lebih tajam)
    float glossSharp = 0.f;      // 0..1 ketajaman/kontras pantulan
    float glossSat = 1.f;        // 0..2 kekayaan warna pantulan (1 = asli)
    float glossTint = 0.f;       // -1..1 dingin/hangat pada pantulan
    float glossSpec = 0.f;       // 0..1 highlight matahari
    float flatRefl = 0.f;        // 0..1 pantulan langit di material 'flat' (lantai/baseplate)
    float gamma = 1.f;           // 0.5..2 gamma warna (1 = asli)
    float hue = 0.f;             // -0.5..0.5 geser hue (putaran penuh = 1)
    float splitShadow = 0.f;     // -1..1 warna bayangan (dingin..hangat)
    float splitHigh = 0.f;       // -1..1 warna highlight (dingin..hangat)
    float highlight = 0.f;       // 0..1 penguat highlight
    float hlComp = 0.f;          // 0..1 kompresi highlight
    float shadowStrength = 0.f;  // -1..1 kekuatan bayangan
    bool master = false;          // saklar utama: mati = semua uniform identitas (tampilan asli)

    // fog adaptif (menulis ulang faktor/warna fog milik shader)
    bool fogOn = false;
    float fogIntensity = 1.f;    // 0..3
    float fogDensity = 1.f;      // 0..3
    float fogStart = 0.f;        // 0..1 (fog baru muncul setelah ini)
    float fogOpacity = 1.f;      // 0..1 batas atas fog
    float fogTemp = 0.f;         // -1..1 dingin..hangat
    float fogSat = 1.f;          // 0..2
    float fogBright = 1.f;       // 0..2
    float fogEnd = 0.f;          // 0..1 (x500 stud) jarak fog penuh; 0 = mati
    float fogR = 1.f, fogG = 1.f, fogB = 1.f;  // warna fog pilihan
    float fogCmix = 0.f;         // 0..1 campuran warna pilihan
    float fogHeight = 0.f;       // 0..1 (x400 stud) tinggi dasar fog
    float fogHfall = 0.f;        // 0..1 pudar fog di atas tinggi; 0 = fog tinggi mati
    float fogDfall = 1.f;        // 0.5..3 eksponen jarak
    float fogSmooth = 0.f;       // 0..1
    float fogScatter = 0.f;      // 0..1 hamburan atmosfer (warna matahari)
    float fogSky = 0.f;          // 0..1 campur warna langit
    float fogAdapt = 0.f;        // 0..1 densitas adaptif terhadap cahaya
    float fogCam = 0.f;          // 0..1 respons ketinggian kamera

    // rimlight (shader PBR; butuh normal)
    bool rimOn = false;
    float rimIntensity = 1.f;    // 0..3
    float rimR = 1.f, rimG = 1.f, rimB = 1.f;  // 0..1
    bool rimRgb = false;
    float rimSpeed = 0.5f;       // 0..3
    float rimWidth = 0.5f;       // 0..1
    float rimSharp = 0.3f;       // 0..1
    float rimPower = 3.f;        // 1..8 (Fresnel power)
    float rimBias = 0.f;         // 0..0.5
    float rimLight = 0.f;        // 0..1 arah cahaya
    float rimSpread = 1.f;       // 0.5..4
    float rimFade = 0.f;         // 0..1 pudar menurut jarak
    float rimSoft = 0.f;         // 0..1
    float rimEdge = 0.f;         // 0..3 kecerahan tepi
    float rimMat = 0.f;          // 0..1 sensitivitas material (gelap = lebih rim)
    // pantulan IBL
    float reflRough = 1.f;       // 0.1..1 ambang kekasaran (1 = semua)
    float reflFade = 0.f;        // 0..1 pudar menurut jarak
    float reflDist = 0.5f;       // 0..1 jarak pantulan (x500 stud)
    // performa
    bool perfFps = false, perfBatt = false, perfTherm = false, autoPerf = false;
    float fpsTarget = 40.f;      // 20..60
    bool perfSsr = false, perfHdr = false, perfFog = false, perfRim = false, perfAo = false;
    bool hdrOn = false;
    float quality = 2.f;         // 0..3 Low/Medium/High/Ultra
    float aoRadius = 1.f;        // 0.5..3 radius SSAO bawaan Roblox
    float aoDetail = 1.f;        // 0.5..2 sensitivitas kedalaman SSAO bawaan
    // depth pipeline (dpipe.cpp): AO / SSR / DOF berbasis depth scene
    bool depthPipe = true;
    float dpDebug = 0.0f;
    bool dpFlip = false;
    float dpRev = 0.0f;
    bool dpVpTr = false;
    float dpScale = 1.0f;
    bool mxOn = false;
    float mxInt = 1.0f;
    float mxRad = 1.5f;
    float mxSamples = 16.0f;
    float mxRays = 2.0f;
    float mxDark = 1.0f;
    float mxSoft = 0.3f;
    float mxFine = 0.6f;
    float mxCoarse = 1.0f;
    float mxNbias = 0.03f;
    float mxDbias = 0.03f;
    float mxEdge = 0.5f;
    float mxBlur = 2.0f;
    float mxDenoise = 0.5f;
    float mxTemp = 0.5f;
    float mxRes = 0.5f;
    float mxQual = 1.0f;
    bool ssOn = false;
    float ssInt = 1.0f;
    float ssSteps = 48.0f;
    float ssDist = 60.0f;
    float ssThick = 1.0f;
    float ssFade = 0.4f;
    float ssEdge = 0.5f;
    float ssFloor = 0.0f;
    float ssBlur = 0.2f;
    float ssTemp = 0.5f;
    float ssRes = 0.75f;
    float ssQual = 1.0f;
    bool dfOn = false;
    float dfInt = 0.7f;
    float dfFocus = 40.0f;
    float dfRange = 10.0f;
    float dfNear = 0.6f;
    float dfFar = 1.0f;
    float dfRad = 12.0f;
    float dfBokeh = 0.3f;
    float dfShape = 0.0f;
    float dfSamples = 32.0f;
    float dfAper = 4.0f;
    float dfFocal = 50.0f;
    float dfTrans = 0.4f;
    float dfFg = 1.0f;
    float dfBg = 1.0f;
    bool dfAuto = false;
    float dfSmooth = 0.8f;
    bool olOn = false;           // PrismShade Outline (pass depth)
    float olStr = 0.8f, olThick = 1.f, olSens = 0.75f, olSoft = 0.5f, olStart = 120.f, olEnd = 450.f;
    float olR = 1.f, olG = 1.f, olB = 1.f, olBlend = 1.f, olDbg = 0.f;
    bool olSky = false;
    bool perfDof = false;
    bool traceNow = false;       // tepi naik = rekam 1 frame (butuh trace aktif saat start)
    bool trace = false;          // catat satu frame render (FBO, texture, draw) ke trace_frame.txt

    // bloom
    float bloom = 0.f;           // 0..3
    float bloomThreshold = 0.7f; // 0.2..1
    float bloomRadius = 1.f;     // 0.5..3

    // depth of field (screen-space: blur grows with distance from the focus point)
    bool dof = false;
    float dofAmount = 0.5f;      // 0..1
    float dofCx = 0.5f;          // 0..1
    float dofCy = 0.5f;          // 0..1
    float dofRadius = 0.3f;      // 0.05..0.9 sharp area radius (fraction of screen height)

    // glossy (sharpen + specular highlight lift on every surface: parts and avatars alike)
    bool glossy = false;
    float glossyAmount = 0.5f;   // 0..1
    // ambient occlusion approximation (darkens creases)
    float ao = 0.f;              // 0..1

    // sun rays
    bool sunrays = false;
    float sunraysAmount = 0.5f;
    float sunX = 0.5f;
    float sunY = 0.85f;

    // in-engine shader access (glhooks.cpp)
    bool shaderDump = false;         // write every Roblox shader source to <external files>/RYEENZYXNZ/shaders
    bool shaderRules = false;        // rewrite shaders with rz_shader_rules.txt before they are compiled
    bool blockProgramBinary = false; // swallow glProgramBinary so Roblox compiles from source (experimental)
    bool clearShaderCache = false;   // delete Roblox's shadercache* files at next start

    // engine
    bool forceGles = true;        // block libvulkan at start so Roblox falls back to GLES (restart Roblox to apply)
    bool allowAnyBuild = true;   // skip the exact build-ID check (default ON: izinkan versi Roblox lain)
    bool disable = false;        // DIPERTAHANKAN hanya demi kompatibilitas berkas lama; selalu dipaksa false
    bool safe = false;           // Safe Mode DIHAPUS: nilai dari berkas diabaikan, selalu false
};

inline bool parseFloat(const char* s, float lo, float hi, float& out) {
    char* end = nullptr;
    float v = strtof(s, &end);
    if (end == s || *end != '\0' || !(v >= lo && v <= hi)) return false;  // also rejects NaN
    out = v;
    return true;
}

inline bool parseBool(const char* s, bool& out) {
    if (strcmp(s, "0") == 0) { out = false; return true; }
    if (strcmp(s, "1") == 0) { out = true; return true; }
    return false;
}

inline bool parseConfig(const std::string& text, Config& cfg) {
    Config c;  // defaults so removed keys fall back safely
    size_t pos = 0;
    while (pos < text.size()) {
        size_t nl = text.find('\n', pos);
        if (nl == std::string::npos) nl = text.size();
        std::string line = text.substr(pos, nl - pos);
        pos = nl + 1;
        while (!line.empty() && (line.back() == '\r' || line.back() == ' ')) line.pop_back();
        if (line.empty() || line[0] == '#') continue;
        size_t eq = line.find('=');
        if (eq == std::string::npos) return false;
        std::string k = line.substr(0, eq), v = line.substr(eq + 1);
        const char* s = v.c_str();
        bool ok;
        if (k == "enabled") ok = parseBool(s, c.enabled);
        else if (k == "strength") ok = parseFloat(s, 0.f, 1.5f, c.strength);
        else if (k == "brightness") ok = parseFloat(s, -0.5f, 0.5f, c.brightness);
        else if (k == "contrast") ok = parseFloat(s, -0.5f, 1.f, c.contrast);
        else if (k == "saturation") ok = parseFloat(s, -1.f, 1.5f, c.saturation);
        else if (k == "warmth") ok = parseFloat(s, -1.f, 1.f, c.warmth);
        else if (k == "exposure") ok = parseFloat(s, -2.f, 2.f, c.exposure);
        else if (k == "levels_black") ok = parseFloat(s, 0.f, 0.5f, c.levelsBlack);
        else if (k == "levels_white") ok = parseFloat(s, 0.5f, 1.f, c.levelsWhite);
        else if (k == "curves") ok = parseFloat(s, 0.f, 1.f, c.curves);
        else if (k == "vibrance") ok = parseFloat(s, -1.f, 1.f, c.vibrance);
        else if (k == "live") ok = parseBool(s, c.live);
        else if (k == "glass") ok = parseFloat(s, 0.f, 1.f, c.glass);
        else if (k == "wet") ok = parseFloat(s, 0.f, 1.f, c.wet);
        else if (k == "gloss_clarity") ok = parseFloat(s, 0.f, 1.f, c.glossClarity);
        else if (k == "gloss_sharp") ok = parseFloat(s, 0.f, 1.f, c.glossSharp);
        else if (k == "gloss_sat") ok = parseFloat(s, 0.f, 2.f, c.glossSat);
        else if (k == "gloss_tint") ok = parseFloat(s, -1.f, 1.f, c.glossTint);
        else if (k == "gloss_spec") ok = parseFloat(s, 0.f, 1.f, c.glossSpec);
        else if (k == "flat_refl") ok = parseFloat(s, 0.f, 1.f, c.flatRefl);
        else if (k == "gamma") ok = parseFloat(s, 0.5f, 2.f, c.gamma);
        else if (k == "hue") ok = parseFloat(s, -0.5f, 0.5f, c.hue);
        else if (k == "split_shadow") ok = parseFloat(s, -1.f, 1.f, c.splitShadow);
        else if (k == "split_high") ok = parseFloat(s, -1.f, 1.f, c.splitHigh);
        else if (k == "highlight") ok = parseFloat(s, 0.f, 1.f, c.highlight);
        else if (k == "hl_comp") ok = parseFloat(s, 0.f, 1.f, c.hlComp);
        else if (k == "shadow_strength") ok = parseFloat(s, -1.f, 1.f, c.shadowStrength);
        else if (k == "master") ok = parseBool(s, c.master);
        else if (k == "fog_on") ok = parseBool(s, c.fogOn);
        else if (k == "fog_intensity") ok = parseFloat(s, 0.f, 3.f, c.fogIntensity);
        else if (k == "fog_density") ok = parseFloat(s, 0.f, 3.f, c.fogDensity);
        else if (k == "fog_start") ok = parseFloat(s, 0.f, 1.f, c.fogStart);
        else if (k == "fog_opacity") ok = parseFloat(s, 0.f, 1.f, c.fogOpacity);
        else if (k == "fog_temp") ok = parseFloat(s, -1.f, 1.f, c.fogTemp);
        else if (k == "fog_sat") ok = parseFloat(s, 0.f, 2.f, c.fogSat);
        else if (k == "fog_bright") ok = parseFloat(s, 0.f, 2.f, c.fogBright);
        else if (k == "rim_on") ok = parseBool(s, c.rimOn);
        else if (k == "rim_intensity") ok = parseFloat(s, 0.f, 3.f, c.rimIntensity);
        else if (k == "rim_r") ok = parseFloat(s, 0.f, 1.f, c.rimR);
        else if (k == "rim_g") ok = parseFloat(s, 0.f, 1.f, c.rimG);
        else if (k == "rim_b") ok = parseFloat(s, 0.f, 1.f, c.rimB);
        else if (k == "rim_rgb") ok = parseBool(s, c.rimRgb);
        else if (k == "rim_speed") ok = parseFloat(s, 0.f, 3.f, c.rimSpeed);
        else if (k == "rim_width") ok = parseFloat(s, 0.f, 1.f, c.rimWidth);
        else if (k == "rim_sharp") ok = parseFloat(s, 0.f, 1.f, c.rimSharp);
        else if (k == "rim_power") ok = parseFloat(s, 1.f, 8.f, c.rimPower);
        else if (k == "rim_bias") ok = parseFloat(s, 0.f, 0.5f, c.rimBias);
        else if (k == "rim_light") ok = parseFloat(s, 0.f, 1.f, c.rimLight);
        else if (k == "rim_spread") ok = parseFloat(s, 0.5f, 4.f, c.rimSpread);
        else if (k == "rim_fade") ok = parseFloat(s, 0.f, 1.f, c.rimFade);
        else if (k == "ao_radius") ok = parseFloat(s, 0.5f, 3.f, c.aoRadius);
        else if (k == "ao_detail") ok = parseFloat(s, 0.5f, 2.f, c.aoDetail);
        else if (k == "fog_end") ok = parseFloat(s, 0.f, 1.f, c.fogEnd);
        else if (k == "fog_r") ok = parseFloat(s, 0.f, 1.f, c.fogR);
        else if (k == "fog_g") ok = parseFloat(s, 0.f, 1.f, c.fogG);
        else if (k == "fog_b") ok = parseFloat(s, 0.f, 1.f, c.fogB);
        else if (k == "fog_cmix") ok = parseFloat(s, 0.f, 1.f, c.fogCmix);
        else if (k == "fog_height") ok = parseFloat(s, 0.f, 1.f, c.fogHeight);
        else if (k == "fog_hfall") ok = parseFloat(s, 0.f, 1.f, c.fogHfall);
        else if (k == "fog_dfall") ok = parseFloat(s, 0.5f, 3.f, c.fogDfall);
        else if (k == "fog_smooth") ok = parseFloat(s, 0.f, 1.f, c.fogSmooth);
        else if (k == "fog_scatter") ok = parseFloat(s, 0.f, 1.f, c.fogScatter);
        else if (k == "fog_sky") ok = parseFloat(s, 0.f, 1.f, c.fogSky);
        else if (k == "fog_adapt") ok = parseFloat(s, 0.f, 1.f, c.fogAdapt);
        else if (k == "fog_cam") ok = parseFloat(s, 0.f, 1.f, c.fogCam);
        else if (k == "rim_soft") ok = parseFloat(s, 0.f, 1.f, c.rimSoft);
        else if (k == "rim_edge") ok = parseFloat(s, 0.f, 3.f, c.rimEdge);
        else if (k == "rim_mat") ok = parseFloat(s, 0.f, 1.f, c.rimMat);
        else if (k == "refl_rough") ok = parseFloat(s, 0.1f, 1.f, c.reflRough);
        else if (k == "refl_fade") ok = parseFloat(s, 0.f, 1.f, c.reflFade);
        else if (k == "refl_dist") ok = parseFloat(s, 0.f, 1.f, c.reflDist);
        else if (k == "perf_fps") ok = parseBool(s, c.perfFps);
        else if (k == "perf_batt") ok = parseBool(s, c.perfBatt);
        else if (k == "perf_therm") ok = parseBool(s, c.perfTherm);
        else if (k == "auto_perf") ok = parseBool(s, c.autoPerf);
        else if (k == "fps_target") ok = parseFloat(s, 20.f, 60.f, c.fpsTarget);
        else if (k == "perf_ssr") ok = parseBool(s, c.perfSsr);
        else if (k == "perf_hdr") ok = parseBool(s, c.perfHdr);
        else if (k == "perf_fog") ok = parseBool(s, c.perfFog);
        else if (k == "perf_rim") ok = parseBool(s, c.perfRim);
        else if (k == "perf_ao") ok = parseBool(s, c.perfAo);
        else if (k == "hdr_on") ok = parseBool(s, c.hdrOn);
        else if (k == "quality") ok = parseFloat(s, 0.f, 3.f, c.quality);
        else if (k == "depth_pipe") ok = parseBool(s, c.depthPipe);
        else if (k == "dp_debug") ok = parseFloat(s, 0.0f, 6.0f, c.dpDebug);
        else if (k == "dp_flip") ok = parseBool(s, c.dpFlip);
        else if (k == "dp_rev") ok = parseFloat(s, 0.0f, 2.0f, c.dpRev);
        else if (k == "dp_vptr") ok = parseBool(s, c.dpVpTr);
        else if (k == "dp_scale") ok = parseFloat(s, 0.25f, 1.0f, c.dpScale);
        else if (k == "mx_on") ok = parseBool(s, c.mxOn);
        else if (k == "mx_int") ok = parseFloat(s, 0.0f, 3.0f, c.mxInt);
        else if (k == "mx_rad") ok = parseFloat(s, 0.1f, 10.0f, c.mxRad);
        else if (k == "mx_samples") ok = parseFloat(s, 4.0f, 48.0f, c.mxSamples);
        else if (k == "mx_rays") ok = parseFloat(s, 1.0f, 8.0f, c.mxRays);
        else if (k == "mx_dark") ok = parseFloat(s, 0.2f, 3.0f, c.mxDark);
        else if (k == "mx_soft") ok = parseFloat(s, 0.0f, 1.0f, c.mxSoft);
        else if (k == "mx_fine") ok = parseFloat(s, 0.0f, 1.0f, c.mxFine);
        else if (k == "mx_coarse") ok = parseFloat(s, 0.0f, 1.0f, c.mxCoarse);
        else if (k == "mx_nbias") ok = parseFloat(s, 0.0f, 0.5f, c.mxNbias);
        else if (k == "mx_dbias") ok = parseFloat(s, 0.0f, 0.5f, c.mxDbias);
        else if (k == "mx_edge") ok = parseFloat(s, 0.0f, 1.0f, c.mxEdge);
        else if (k == "mx_blur") ok = parseFloat(s, 0.0f, 6.0f, c.mxBlur);
        else if (k == "mx_denoise") ok = parseFloat(s, 0.0f, 1.0f, c.mxDenoise);
        else if (k == "mx_temp") ok = parseFloat(s, 0.0f, 1.0f, c.mxTemp);
        else if (k == "mx_res") ok = parseFloat(s, 0.25f, 1.0f, c.mxRes);
        else if (k == "mx_qual") ok = parseFloat(s, 0.0f, 3.0f, c.mxQual);
        else if (k == "ss_on") ok = parseBool(s, c.ssOn);
        else if (k == "ss_int") ok = parseFloat(s, 0.0f, 2.0f, c.ssInt);
        else if (k == "ss_steps") ok = parseFloat(s, 8.0f, 128.0f, c.ssSteps);
        else if (k == "ss_dist") ok = parseFloat(s, 5.0f, 300.0f, c.ssDist);
        else if (k == "ss_thick") ok = parseFloat(s, 0.1f, 5.0f, c.ssThick);
        else if (k == "ss_fade") ok = parseFloat(s, 0.0f, 1.0f, c.ssFade);
        else if (k == "ss_edge") ok = parseFloat(s, 0.0f, 1.0f, c.ssEdge);
        else if (k == "ss_floor") ok = parseFloat(s, 0.0f, 1.0f, c.ssFloor);
        else if (k == "ss_blur") ok = parseFloat(s, 0.0f, 1.0f, c.ssBlur);
        else if (k == "ss_temp") ok = parseFloat(s, 0.0f, 1.0f, c.ssTemp);
        else if (k == "ss_res") ok = parseFloat(s, 0.25f, 1.0f, c.ssRes);
        else if (k == "ss_qual") ok = parseFloat(s, 0.0f, 3.0f, c.ssQual);
        else if (k == "df_on") ok = parseBool(s, c.dfOn);
        else if (k == "df_int") ok = parseFloat(s, 0.0f, 1.0f, c.dfInt);
        else if (k == "df_focus") ok = parseFloat(s, 1.0f, 500.0f, c.dfFocus);
        else if (k == "df_range") ok = parseFloat(s, 0.0f, 200.0f, c.dfRange);
        else if (k == "df_near") ok = parseFloat(s, 0.0f, 1.0f, c.dfNear);
        else if (k == "df_far") ok = parseFloat(s, 0.0f, 1.0f, c.dfFar);
        else if (k == "df_rad") ok = parseFloat(s, 1.0f, 40.0f, c.dfRad);
        else if (k == "df_bokeh") ok = parseFloat(s, 0.0f, 1.0f, c.dfBokeh);
        else if (k == "df_shape") ok = parseFloat(s, 0.0f, 2.0f, c.dfShape);
        else if (k == "df_samples") ok = parseFloat(s, 8.0f, 96.0f, c.dfSamples);
        else if (k == "df_aper") ok = parseFloat(s, 1.0f, 16.0f, c.dfAper);
        else if (k == "df_focal") ok = parseFloat(s, 10.0f, 200.0f, c.dfFocal);
        else if (k == "df_trans") ok = parseFloat(s, 0.0f, 1.0f, c.dfTrans);
        else if (k == "df_fg") ok = parseFloat(s, 0.0f, 1.0f, c.dfFg);
        else if (k == "df_bg") ok = parseFloat(s, 0.0f, 1.0f, c.dfBg);
        else if (k == "df_auto") ok = parseBool(s, c.dfAuto);
        else if (k == "df_smooth") ok = parseFloat(s, 0.0f, 1.0f, c.dfSmooth);
        else if (k == "ol_on") ok = parseBool(s, c.olOn);
        else if (k == "ol_str") ok = parseFloat(s, 0.0f, 1.0f, c.olStr);
        else if (k == "ol_thick") ok = parseFloat(s, 0.25f, 4.0f, c.olThick);
        else if (k == "ol_sens") ok = parseFloat(s, 0.0f, 1.0f, c.olSens);
        else if (k == "ol_soft") ok = parseFloat(s, 0.0f, 1.0f, c.olSoft);
        else if (k == "ol_start") ok = parseFloat(s, 1.0f, 1000.0f, c.olStart);
        else if (k == "ol_end") ok = parseFloat(s, 1.0f, 2000.0f, c.olEnd);
        else if (k == "ol_r") ok = parseFloat(s, 0.0f, 1.0f, c.olR);
        else if (k == "ol_g") ok = parseFloat(s, 0.0f, 1.0f, c.olG);
        else if (k == "ol_b") ok = parseFloat(s, 0.0f, 1.0f, c.olB);
        else if (k == "ol_blend") ok = parseFloat(s, 0.0f, 2.0f, c.olBlend);
        else if (k == "ol_sky") ok = parseBool(s, c.olSky);
        else if (k == "ol_debug") ok = parseFloat(s, 0.0f, 1.0f, c.olDbg);
        else if (k == "perf_dof") ok = parseBool(s, c.perfDof);
        else if (k == "trace") ok = parseBool(s, c.trace);
        else if (k == "trace_now") ok = parseBool(s, c.traceNow);
        else if (k == "bloom") ok = parseFloat(s, 0.f, 3.f, c.bloom);
        else if (k == "bloom_threshold") ok = parseFloat(s, 0.2f, 1.f, c.bloomThreshold);
        else if (k == "bloom_radius") ok = parseFloat(s, 0.5f, 3.f, c.bloomRadius);
        else if (k == "dof") ok = parseBool(s, c.dof);
        else if (k == "dof_amount") ok = parseFloat(s, 0.f, 1.f, c.dofAmount);
        else if (k == "dof_cx") ok = parseFloat(s, 0.f, 1.f, c.dofCx);
        else if (k == "dof_cy") ok = parseFloat(s, 0.f, 1.f, c.dofCy);
        else if (k == "dof_radius") ok = parseFloat(s, 0.05f, 0.9f, c.dofRadius);
        else if (k == "glossy") ok = parseBool(s, c.glossy);
        else if (k == "glossy_amount") ok = parseFloat(s, 0.f, 1.f, c.glossyAmount);
        else if (k == "ao") ok = parseFloat(s, 0.f, 1.f, c.ao);
        else if (k == "sunrays") ok = parseBool(s, c.sunrays);
        else if (k == "sunrays_amount") ok = parseFloat(s, 0.f, 1.f, c.sunraysAmount);
        else if (k == "sun_x") ok = parseFloat(s, 0.f, 1.f, c.sunX);
        else if (k == "sun_y") ok = parseFloat(s, 0.f, 1.f, c.sunY);
        else if (k == "shader_dump") ok = parseBool(s, c.shaderDump);
        else if (k == "shader_rules") ok = parseBool(s, c.shaderRules);
        else if (k == "block_program_binary") ok = parseBool(s, c.blockProgramBinary);
        else if (k == "clear_shader_cache") ok = parseBool(s, c.clearShaderCache);
        else if (k == "force_gles") ok = parseBool(s, c.forceGles);
        else if (k == "allow_any_build") ok = parseBool(s, c.allowAnyBuild);
        else if (k == "disable") { ok = parseBool(s, c.disable); c.disable = false; }  // diterima tapi diabaikan
        else if (k == "safe") { ok = parseBool(s, c.safe); c.safe = false; }           // Safe Mode tidak ada lagi
        else ok = false;  // unknown key
        if (!ok) return false;
    }
    cfg = c;
    return true;
}

}  // namespace rz
