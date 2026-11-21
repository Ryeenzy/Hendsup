package com.ryeenzyxnz.overlay;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Parser preset ReShade (.ini/.txt) -> nilai engine RYEENZYXNZ. Pemetaan sama dengan versi uji offline. */
final class RzIni {
    static final class Result {
        final Map<String, Float> cfg = new LinkedHashMap<>();
        final List<String> applied = new ArrayList<>();
        final List<String> ignored = new ArrayList<>();
        int techniques = 0;
    }

    private static float clamp(float x, float a, float b) { return x < a ? a : (x > b ? b : x); }
    private static float log2(double x) { return (float) (Math.log(x) / Math.log(2)); }

    /** [section lowercase] -> (key lowercase -> value). Kunci tanpa section ada di "" . */
    static Map<String, Map<String, String>> parse(String text, List<String> order) {
        Map<String, Map<String, String>> ini = new HashMap<>();
        ini.put("", new HashMap<String, String>());
        Map<String, String> cur = ini.get("");
        if (text == null) return ini;
        if (text.startsWith("﻿")) text = text.substring(1);
        for (String raw : text.split("\r\n|\r|\n")) {
            String line = raw.trim();
            if (line.isEmpty() || line.startsWith(";") || line.startsWith("#") || line.startsWith("//")) continue;
            if (line.startsWith("[") && line.endsWith("]")) {
                String name = line.substring(1, line.length() - 1).trim().toLowerCase(Locale.US);
                if (!ini.containsKey(name)) { ini.put(name, new HashMap<String, String>()); order.add(name); }
                cur = ini.get(name);
            } else {
                int eq = line.indexOf('=');
                if (eq > 0) cur.put(line.substring(0, eq).trim().toLowerCase(Locale.US), line.substring(eq + 1).trim());
            }
        }
        return ini;
    }

    private static String stem(String name) {
        int at = name.indexOf('@');
        if (at >= 0) name = name.substring(at + 1);
        name = name.trim().toLowerCase(Locale.US);
        if (name.endsWith(".fx")) name = name.substring(0, name.length() - 3);
        return name;
    }

    private static final class P {
        final Map<String, String> sec;
        P(Map<String, String> s) { sec = s == null ? new HashMap<String, String>() : s; }
        boolean has(String k) { return sec.containsKey(k); }
        float n(String k, float d) {
            String r = sec.get(k);
            if (r == null) return d;
            int c = r.indexOf(',');
            try { return Float.parseFloat((c >= 0 ? r.substring(0, c) : r).trim()); } catch (NumberFormatException e) { return d; }
        }
        float[] vec(String k) {
            String r = sec.get(k);
            if (r == null) return new float[0];
            String[] parts = r.split(",");
            float[] out = new float[parts.length];
            for (int i = 0; i < parts.length; i++) {
                try { out[i] = Float.parseFloat(parts[i].trim()); } catch (NumberFormatException e) { out[i] = 0f; }
            }
            return out;
        }
    }

    private static void add(Map<String, Float> c, String k, float d) {
        Float old = c.get(k);
        c.put(k, (old == null ? 0f : old) + d);
    }

    static Result fromText(String text) {
        Result r = new Result();
        List<String> order = new ArrayList<>();
        Map<String, Map<String, String>> ini = parse(text, order);

        List<String> files = new ArrayList<>();
        String tech = ini.get("").get("techniques");
        if (tech != null) {
            for (String it : tech.split(",")) {
                String s = stem(it);
                if (!s.isEmpty() && !files.contains(s)) files.add(s);
            }
        } else {
            for (String name : order) {
                String s = stem(name);
                if (!s.equals("ryeenzyxnz") && !files.contains(s)) files.add(s);
            }
        }
        r.techniques = files.size();
        Map<String, Float> c = r.cfg;

        for (String s : files) {
            Map<String, String> sec = ini.get(s + ".fx");
            if (sec == null) sec = ini.get(s);
            P p = new P(sec);
            String msg = null, why = null;
            switch (s) {
                case "bloominghdr": {
                    float[] bi = p.vec("bloom_intensity");
                    float bx = bi.length > 0 ? bi[0] : 0.1f, by = bi.length > 1 ? bi[1] : (bi.length > 0 ? bi[0] : 0.5f);
                    float bloom = clamp((bx + by) * 0.8f, 0, 3);
                    c.put("bloom", bloom);
                    c.put("bloom_radius", clamp(p.n("bloom_spread", 1), 0.5f, 3));
                    c.put("bloom_threshold", clamp(0.70f - (p.n("bloomsensitivity", 1) - 1) * 0.15f, 0.2f, 1));
                    float ex = p.n("exp", 0.177f);
                    if (ex > 0.001f) add(c, "exposure", clamp(log2(ex / 0.177f) * 0.6f, -2, 2));
                    add(c, "brightness", clamp((2.2f - p.n("gamma", 2.2f)) * 0.04f, -0.15f, 0.15f));
                    add(c, "contrast", clamp((p.n("contrast", 1) - 1) * 0.5f, -0.5f, 0.5f));
                    add(c, "saturation", clamp(p.n("saturate", 1) - 1, -1, 1));
                    msg = String.format(Locale.US, "Bloom %.2f + koreksi warna", bloom);
                    break;
                }
                case "quint_ssr": {
                    float a = clamp(p.n("ssr_reflection_intensity", 1), 0, 2);
                    c.put("ss_on", 1f); c.put("ss_int", a);
                    msg = String.format(Locale.US, "SSR layar (intensitas %.2f)", a);
                    break;
                }
                case "quint_mxao": {
                    float a = clamp((p.n("mxao_ssao_amount", 1) / 2) * clamp(p.n("mxao_sample_radius", 1) / 2, 0.4f, 1.5f), 0, 1);
                    c.put("ao", a);
                    msg = String.format(Locale.US, "AO perkiraan (kekuatan %.2f)", a);
                    break;
                }
                case "clarity": {
                    float st = p.n("claritystrength", 0);
                    if (st > 0) add(c, "contrast", clamp(st * 0.15f, 0, 0.3f));
                    msg = st > 0 ? "Clarity -> tambah kontras" : "Clarity = 0, tidak ada perubahan";
                    break;
                }
                case "quint_dof": {
                    float rf = clamp(p.n("fadof_shaperadius", 20.5f) / 20.5f, 0.3f, 1.6f);
                    float near = clamp(p.n("fadof_nearblurcurve", 6) / 10 * rf, 0, 1);
                    float far = clamp(p.n("fadof_farblurcurve", 1.5f) / 4 * rf, 0, 1);
                    float[] ac = p.vec("fadof_autofocuscenter");
                    c.put("dof", 1f);
                    c.put("dof_amount", (near + far) / 2);
                    c.put("dof_cx", clamp(ac.length > 0 ? ac[0] : 0.5f, 0, 1));
                    c.put("dof_cy", clamp(ac.length > 1 ? ac[1] : 0.5f, 0, 1));
                    c.put("dof_radius", clamp(p.n("fadof_autofocusradius", 0.6f) * 0.35f + p.n("fadof_hyperfocus", 0.1f), 0.05f, 0.9f));
                    msg = String.format(Locale.US, "DOF layar (kekuatan %.2f)", (near + far) / 2);
                    break;
                }
                case "curves": {
                    float cv = clamp(p.n("contrast", 0) * 1.5f, 0, 1);
                    c.put("curves", cv);
                    msg = String.format(Locale.US, "Curves S-curve %.2f", cv);
                    break;
                }
                case "levels": {
                    float bp = clamp(p.n("blackpoint", 0), 0, 127) / 255f;
                    float wp = clamp(p.n("whitepoint", 255), 128, 255) / 255f;
                    c.put("levels_black", bp); c.put("levels_white", wp);
                    msg = String.format(Locale.US, "Levels %.0f-%.0f (tepat)", bp * 255, wp * 255);
                    break;
                }
                case "vibrance": {
                    add(c, "saturation", clamp(p.n("vibrance", 0) * 0.5f, -1, 1));
                    msg = "Vibrance -> saturasi";
                    break;
                }
                case "tonemap": {
                    add(c, "saturation", clamp(p.n("saturation", 0), -1, 1));
                    add(c, "exposure", clamp(p.n("exposure", 0), -2, 2));
                    add(c, "brightness", clamp((1 - p.n("gamma", 1)) * 0.1f, -0.15f, 0.15f));
                    msg = "Tonemap -> saturasi/exposure/gamma";
                    break;
                }
                case "deband": why = "Roblox tidak punya padanan (banding ditangani engine)"; break;
                case "fxaa": case "smaa": why = "anti-aliasing diatur engine Roblox"; break;
                case "lumasharpen": why = "belum ada padanan di engine"; break;
                default: why = "belum ada padanan di engine"; break;
            }
            if (msg != null) r.applied.add(s + " : " + msg); else r.ignored.add(s + " : " + why);
        }

        Map<String, String> nat = ini.get("ryeenzyxnz");
        if (nat != null) {
            P p = new P(nat);
            int n = 0;
            if (p.has("sunrays")) { float v = p.n("sunrays", 0); c.put("sunrays", v > 0 ? 1f : 0f); if (v > 0) c.put("sunrays_amount", clamp(v, 0, 1)); n++; }
            for (Map.Entry<String, String> e : nat.entrySet()) {
                String k = e.getKey();
                if (k.equals("sunrays") || !RzState.BY.containsKey(k) || RzState.userOwned(k)) continue;
                c.put(k, p.n(k, RzState.BY.get(k).def)); n++;
            }
            r.applied.add("[RYEENZYXNZ] : " + n + " nilai langsung");
        }
        return r;
    }
}
