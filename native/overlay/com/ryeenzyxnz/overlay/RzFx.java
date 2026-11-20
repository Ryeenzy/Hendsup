package com.ryeenzyxnz.overlay;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Efek ReShade (hasil tools/fxc) + nilai parameternya. Metadata UI (label, min, max, jenis kontrol, default) datang dari
 * anotasi ui_* di file .fx asli lewat fx_ui.json. Nilai disimpan di rz_fx.cfg:
 *   on=Efek1,Efek2           efek yang dinyalakan
 *   v.Efek.Uniform=1,2,3     nilai (satu angka per komponen)
 */
final class RzFx {
    static final class U {
        String name, label, type, cat = "", tip = "";
        int n = 1;
        boolean isFloat, isBool;
        float[] def = new float[] { 0f };
        boolean hasMin, hasMax;
        float min, max, step;
        List<String> items = new ArrayList<>();

        boolean isColor() { return "color".equals(type) && n >= 3; }
        boolean isCombo() { return !items.isEmpty() && n == 1; }
        float lo() { return hasMin ? min : Math.min(0f, minDef() * 3f); }
        float hi() {
            if (hasMax) return max;
            float d = maxDef();
            return isFloat ? Math.max(1f, d * 3f) : Math.max(10f, d * 3f);
        }
        private float minDef() { float m = def[0]; for (float x : def) m = Math.min(m, x); return m; }
        private float maxDef() { float m = def[0]; for (float x : def) m = Math.max(m, x); return m; }
    }

    static final class Fx {
        String id, label, tip = "";
        List<U> uniforms = new ArrayList<>();
    }

    final List<Fx> effects = new ArrayList<>();
    private final Map<String, float[]> values = new HashMap<>();
    private final Set<String> enabled = new LinkedHashSet<>();
    private final File cfg;

    RzFx(File dir) { cfg = new File(dir, "rz_fx.cfg"); }

    // ---------------------------------------------------------------- indeks (fx_ui.json)
    static String readAll(InputStream in) throws java.io.IOException {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n;
        while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
        in.close();
        return bo.toString("UTF-8");
    }

    boolean loadIndex(String json) {
        try {
            effects.clear();
            JSONArray arr = new JSONObject(json).getJSONArray("effects");
            for (int i = 0; i < arr.length(); i++) {
                JSONObject e = arr.getJSONObject(i);
                Fx fx = new Fx();
                fx.id = e.getString("id");
                JSONArray techs = e.optJSONArray("techs");
                fx.label = fx.id;
                if (techs != null && techs.length() > 0) {
                    fx.label = techs.getJSONObject(0).optString("label", fx.id);
                    fx.tip = techs.getJSONObject(0).optString("tip", "");
                }
                JSONArray us = e.optJSONArray("uniforms");
                for (int k = 0; us != null && k < us.length(); k++) {
                    JSONObject o = us.getJSONObject(k);
                    U u = new U();
                    u.name = o.getString("name");
                    u.label = o.optString("label", u.name);
                    u.type = o.optString("type", "");
                    u.n = Math.max(1, Math.min(16, o.optInt("n", 1)));
                    u.isFloat = o.optInt("float", 1) != 0;
                    u.isBool = o.optInt("bool", 0) != 0;
                    JSONArray d = o.optJSONArray("def");
                    u.def = new float[u.n];
                    for (int c = 0; c < u.n; c++) u.def[c] = d != null && c < d.length() ? (float) d.optDouble(c, 0) : 0f;
                    if (o.has("min")) { u.hasMin = true; u.min = (float) o.optDouble("min", 0); }
                    if (o.has("max")) { u.hasMax = true; u.max = (float) o.optDouble("max", 1); }
                    u.step = (float) o.optDouble("step", 0);
                    u.cat = o.optString("cat", "");
                    u.tip = o.optString("tip", "");
                    JSONArray it = o.optJSONArray("items");
                    for (int c = 0; it != null && c < it.length(); c++) u.items.add(it.getString(c));
                    fx.uniforms.add(u);
                }
                effects.add(fx);
            }
            return !effects.isEmpty();
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "fx_ui.json: " + t);
            return false;
        }
    }

    Fx find(String id) {
        for (Fx f : effects) if (f.id.equalsIgnoreCase(id)) return f;
        return null;
    }

    // ---------------------------------------------------------------- nilai
    private static String key(Fx f, U u) { return f.id + "." + u.name; }

    float[] get(Fx f, U u) {
        float[] v = values.get(key(f, u));
        return v != null && v.length == u.n ? v : u.def;
    }

    void set(Fx f, U u, float[] v) {
        float[] c = new float[u.n];
        for (int i = 0; i < u.n; i++) {
            float x = i < v.length ? v[i] : 0f;
            if (x != x) x = u.def[i];
            if (u.isBool) x = x >= 0.5f ? 1f : 0f;
            else if (!u.isFloat) x = Math.round(x);
            c[i] = x;
        }
        values.put(key(f, u), c);
    }

    boolean isOn(Fx f) { return enabled.contains(f.id); }

    void setOn(Fx f, boolean on) { if (on) enabled.add(f.id); else enabled.remove(f.id); }

    int enabledCount() { return enabled.size(); }

    void reset(Fx f) {
        for (U u : f.uniforms) values.remove(key(f, u));
    }

    // ---------------------------------------------------------------- simpan / muat
    private static String join(float[] v) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < v.length; i++) {
            if (i > 0) sb.append(',');
            sb.append(String.format(Locale.US, "%.6g", v[i]));
        }
        return sb.toString();
    }

    String toText() {
        StringBuilder sb = new StringBuilder("# RYEENZYXNZ efek ReShade\n");
        StringBuilder on = new StringBuilder();
        for (String s : enabled) { if (on.length() > 0) on.append(','); on.append(s); }
        sb.append("on=").append(on).append('\n');
        for (Map.Entry<String, float[]> e : values.entrySet()) sb.append("v.").append(e.getKey()).append('=').append(join(e.getValue())).append('\n');
        return sb.toString();
    }

    void save() {
        try {
            File tmp = new File(cfg.getPath() + ".tmp");
            FileOutputStream o = new FileOutputStream(tmp);
            o.write(toText().getBytes("UTF-8"));
            o.close();
            if (!tmp.renameTo(cfg)) throw new java.io.IOException("rename");
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "save fx: " + t);
        }
    }

    void load() {
        try {
            if (!cfg.exists()) {   // pertama kali: tidak ada efek yang aktif (semua OFF)
                save();
                return;
            }
            parseText(readAll(new FileInputStream(cfg)));
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "load fx: " + t);
        }
    }

    void parseText(String text) {
        values.clear();
        enabled.clear();
        for (String line : text.split("\n")) {
            int eq = line.indexOf('=');
            if (eq <= 0 || line.startsWith("#")) continue;
            String k = line.substring(0, eq).trim(), v = line.substring(eq + 1).trim();
            if (k.equals("on")) {
                for (String s : v.split(",")) if (!s.trim().isEmpty()) enabled.add(s.trim());
            } else if (k.startsWith("v.")) {
                String[] parts = v.split(",");
                float[] f = new float[parts.length];
                try { for (int i = 0; i < parts.length; i++) f[i] = Float.parseFloat(parts[i].trim()); } catch (NumberFormatException e) { continue; }
                values.put(k.substring(2), f);
            }
        }
    }

    // ---------------------------------------------------------------- preset .ini ReShade
    /** Terapkan preset ReShade: Techniques= menyalakan efek, [file.fx] key=value mengisi parameter. Mengembalikan jumlah nilai terpakai. */
    int applyIni(String text) {
        List<String> order = new ArrayList<>();
        Map<String, Map<String, String>> ini = RzIni.parse(text, order);
        int used = 0;
        String techs = ini.get("").get("techniques");
        if (techs != null) {
            enabled.clear();
            for (String t : techs.split(",")) {
                int at = t.indexOf('@');
                String fn = (at >= 0 ? t.substring(at + 1) : t).trim();
                if (fn.toLowerCase(Locale.US).endsWith(".fx")) fn = fn.substring(0, fn.length() - 3);
                Fx f = find(fn);
                if (f != null) { enabled.add(f.id); used++; }
            }
        }
        for (String sec : order) {
            String s = sec;
            if (s.toLowerCase(Locale.US).endsWith(".fx")) s = s.substring(0, s.length() - 3);
            Fx f = find(s);
            if (f == null) continue;
            Map<String, String> kv = ini.get(sec);
            for (U u : f.uniforms) {
                String raw = null;
                for (Map.Entry<String, String> e : kv.entrySet()) if (e.getKey().equalsIgnoreCase(u.name)) raw = e.getValue();
                if (raw == null) continue;
                String[] parts = raw.split(",");
                float[] v = new float[u.n];
                try {
                    for (int i = 0; i < u.n; i++) {
                        String p = parts[Math.min(i, parts.length - 1)].trim();
                        if (p.equalsIgnoreCase("true")) v[i] = 1f; else if (p.equalsIgnoreCase("false")) v[i] = 0f; else v[i] = Float.parseFloat(p);
                    }
                } catch (NumberFormatException e) { continue; }
                set(f, u, v);
                used++;
            }
        }
        return used;
    }
}
