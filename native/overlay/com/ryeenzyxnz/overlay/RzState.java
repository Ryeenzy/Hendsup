package com.ryeenzyxnz.overlay;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Semua nilai pengaturan. Nama kunci, tipe, dan rentang HARUS sama dengan module/jni/config.hpp. */
final class RzState {
    static final class Key {
        final String name; final float def, lo, hi; final boolean bool;
        Key(String n, float d, float l, float h, boolean b) { name = n; def = d; lo = l; hi = h; bool = b; }
    }

    static final List<Key> KEYS = new ArrayList<>();
    static final Map<String, Key> BY = new HashMap<>();
    private static void f(String n, float d, float l, float h) { add(new Key(n, d, l, h, false)); }
    private static void b(String n, boolean d) { add(new Key(n, d ? 1 : 0, 0, 1, true)); }
    private static void add(Key k) { KEYS.add(k); BY.put(k.name, k); }
    static {
        b("enabled", false);
        f("strength", 1f, 0f, 1.5f);
        f("brightness", 0f, -0.5f, 0.5f);
        f("contrast", 0f, -0.5f, 1f);
        f("saturation", 0f, -1f, 1.5f);
        f("warmth", 0f, -1f, 1f);
        f("exposure", 0f, -2f, 2f);
        f("levels_black", 0f, 0f, 0.5f);
        f("levels_white", 1f, 0.5f, 1f);
        f("curves", 0f, 0f, 1f);
        f("vibrance", 0f, -1f, 1f);
        b("live", false);
        f("glass", 0f, 0f, 1f);
        f("wet", 0f, 0f, 1f);
        f("gloss_clarity", 0f, 0f, 1f);
        f("gloss_sharp", 0f, 0f, 1f);
        f("gloss_sat", 1f, 0f, 2f);
        f("gloss_tint", 0f, -1f, 1f);
        f("gloss_spec", 0f, 0f, 1f);
        f("flat_refl", 0f, 0f, 1f);
        f("gamma", 1f, 0.5f, 2f);
        f("hue", 0f, -0.5f, 0.5f);
        f("split_shadow", 0f, -1f, 1f);
        f("split_high", 0f, -1f, 1f);
        f("highlight", 0f, 0f, 1f);
        f("hl_comp", 0f, 0f, 1f);
        f("shadow_strength", 0f, -1f, 1f);
        b("master", false);
        b("fog_on", false);
        f("fog_intensity", 1f, 0f, 3f);
        f("fog_density", 1f, 0f, 3f);
        f("fog_start", 0f, 0f, 1f);
        f("fog_opacity", 1f, 0f, 1f);
        f("fog_temp", 0f, -1f, 1f);
        f("fog_sat", 1f, 0f, 2f);
        f("fog_bright", 1f, 0f, 2f);
        b("rim_on", false);
        f("rim_intensity", 1f, 0f, 3f);
        f("rim_r", 1f, 0f, 1f);
        f("rim_g", 1f, 0f, 1f);
        f("rim_b", 1f, 0f, 1f);
        b("rim_rgb", false);
        f("rim_speed", 0.5f, 0f, 3f);
        f("rim_width", 0.5f, 0f, 1f);
        f("rim_sharp", 0.3f, 0f, 1f);
        f("rim_power", 3f, 1f, 8f);
        f("rim_bias", 0f, 0f, 0.5f);
        f("rim_light", 0f, 0f, 1f);
        f("rim_spread", 1f, 0.5f, 4f);
        f("rim_fade", 0f, 0f, 1f);
        f("ao_radius", 1f, 0.5f, 3f);
        f("ao_detail", 1f, 0.5f, 2f);
        f("fog_end", 0f, 0f, 1f);
        f("fog_r", 1f, 0f, 1f);
        f("fog_g", 1f, 0f, 1f);
        f("fog_b", 1f, 0f, 1f);
        f("fog_cmix", 0f, 0f, 1f);
        f("fog_height", 0f, 0f, 1f);
        f("fog_hfall", 0f, 0f, 1f);
        f("fog_dfall", 1f, 0.5f, 3f);
        f("fog_smooth", 0f, 0f, 1f);
        f("fog_scatter", 0f, 0f, 1f);
        f("fog_sky", 0f, 0f, 1f);
        f("fog_adapt", 0f, 0f, 1f);
        f("fog_cam", 0f, 0f, 1f);
        f("rim_soft", 0f, 0f, 1f);
        f("rim_edge", 0f, 0f, 3f);
        f("rim_mat", 0f, 0f, 1f);
        f("refl_rough", 1f, 0.1f, 1f);
        f("refl_fade", 0f, 0f, 1f);
        f("refl_dist", 0.5f, 0f, 1f);
        b("perf_fps", false);
        b("perf_batt", false);
        b("perf_therm", false);
        b("auto_perf", false);
        f("fps_target", 40f, 20f, 60f);
        b("perf_ssr", false);
        b("perf_hdr", false);
        b("perf_fog", false);
        b("perf_rim", false);
        b("perf_ao", false);
        b("hdr_on", false);
        f("quality", 2f, 0f, 3f);
        b("depth_pipe", true);
        f("dp_debug", 0.0f, 0.0f, 6.0f);
        b("dp_flip", false);
        f("dp_rev", 0.0f, 0.0f, 2.0f);
        b("dp_vptr", false);
        f("dp_scale", 1.0f, 0.25f, 1.0f);
        b("mx_on", false);
        f("mx_int", 1.0f, 0.0f, 3.0f);
        f("mx_rad", 1.5f, 0.1f, 10.0f);
        f("mx_samples", 16.0f, 4.0f, 48.0f);
        f("mx_rays", 2.0f, 1.0f, 8.0f);
        f("mx_dark", 1.0f, 0.2f, 3.0f);
        f("mx_soft", 0.3f, 0.0f, 1.0f);
        f("mx_fine", 0.6f, 0.0f, 1.0f);
        f("mx_coarse", 1.0f, 0.0f, 1.0f);
        f("mx_nbias", 0.03f, 0.0f, 0.5f);
        f("mx_dbias", 0.03f, 0.0f, 0.5f);
        f("mx_edge", 0.5f, 0.0f, 1.0f);
        f("mx_blur", 2.0f, 0.0f, 6.0f);
        f("mx_denoise", 0.5f, 0.0f, 1.0f);
        f("mx_temp", 0.5f, 0.0f, 1.0f);
        f("mx_res", 0.5f, 0.25f, 1.0f);
        f("mx_qual", 1.0f, 0.0f, 3.0f);
        b("ss_on", false);
        f("ss_int", 1.0f, 0.0f, 2.0f);
        f("ss_steps", 48.0f, 8.0f, 128.0f);
        f("ss_dist", 60.0f, 5.0f, 300.0f);
        f("ss_thick", 1.0f, 0.1f, 5.0f);
        f("ss_fade", 0.4f, 0.0f, 1.0f);
        f("ss_edge", 0.5f, 0.0f, 1.0f);
        f("ss_floor", 0.0f, 0.0f, 1.0f);
        f("ss_blur", 0.2f, 0.0f, 1.0f);
        f("ss_temp", 0.5f, 0.0f, 1.0f);
        f("ss_res", 0.75f, 0.25f, 1.0f);
        f("ss_qual", 1.0f, 0.0f, 3.0f);
        b("df_on", false);
        f("df_int", 0.7f, 0.0f, 1.0f);
        f("df_focus", 40.0f, 1.0f, 500.0f);
        f("df_range", 10.0f, 0.0f, 200.0f);
        f("df_near", 0.6f, 0.0f, 1.0f);
        f("df_far", 1.0f, 0.0f, 1.0f);
        f("df_rad", 12.0f, 1.0f, 40.0f);
        f("df_bokeh", 0.3f, 0.0f, 1.0f);
        f("df_shape", 0.0f, 0.0f, 2.0f);
        f("df_samples", 32.0f, 8.0f, 96.0f);
        f("df_aper", 4.0f, 1.0f, 16.0f);
        f("df_focal", 50.0f, 10.0f, 200.0f);
        f("df_trans", 0.4f, 0.0f, 1.0f);
        f("df_fg", 1.0f, 0.0f, 1.0f);
        f("df_bg", 1.0f, 0.0f, 1.0f);
        b("df_auto", false);
        f("df_smooth", 0.8f, 0.0f, 1.0f);
        b("ol_on", false);
        f("ol_str", 0.8f, 0f, 1f);
        f("ol_thick", 1f, 0.25f, 4f);
        f("ol_sens", 0.75f, 0f, 1f);
        f("ol_soft", 0.5f, 0f, 1f);
        f("ol_start", 120f, 1f, 1000f);
        f("ol_end", 450f, 1f, 2000f);
        f("ol_r", 1f, 0f, 1f);
        f("ol_g", 1f, 0f, 1f);
        f("ol_b", 1f, 0f, 1f);
        f("ol_blend", 1f, 0f, 2f);
        b("ol_sky", false);
        f("ol_debug", 0f, 0f, 1f);
        b("perf_dof", false);
        b("trace", false);
        b("trace_now", false);
        f("bloom", 0f, 0f, 3f);
        f("bloom_threshold", 0.7f, 0.2f, 1f);
        f("bloom_radius", 1f, 0.5f, 3f);
        b("dof", false);
        f("dof_amount", 0.5f, 0f, 1f);
        f("dof_cx", 0.5f, 0f, 1f);
        f("dof_cy", 0.5f, 0f, 1f);
        f("dof_radius", 0.3f, 0.05f, 0.9f);
        b("glossy", false);
        f("glossy_amount", 0.5f, 0f, 1f);
        f("ao", 0f, 0f, 1f);
        b("sunrays", false);
        f("sunrays_amount", 0.5f, 0f, 1f);
        f("sun_x", 0.5f, 0f, 1f);
        f("sun_y", 0.85f, 0f, 1f);
        b("shader_dump", false);
        b("shader_rules", false);
        b("block_program_binary", false);
        b("clear_shader_cache", false);
        b("force_gles", true);
        b("allow_any_build", true);
    }

    /** Kunci yang TIDAK diubah oleh preset (milik pengguna). */
    static boolean userOwned(String k) {
        return k.equals("enabled") || k.equals("live") || k.equals("master") || k.equals("strength") || k.equals("force_gles") || k.equals("allow_any_build")
                || k.startsWith("perf_") || k.equals("auto_perf") || k.equals("fps_target") || k.equals("quality") || k.equals("depth_pipe") || k.startsWith("dp_") || k.equals("trace") || k.equals("trace_now") || k.startsWith("shader_") || k.equals("block_program_binary") || k.equals("clear_shader_cache");
    }

    final HashMap<String, Float> v = new HashMap<>();
    private final File cfgFile;

    RzState(File dir) {
        cfgFile = new File(dir, "rz_config.cfg");
        resetAll();
        load();
    }

    float get(String k) { Float x = v.get(k); return x == null ? BY.get(k).def : x; }
    boolean on(String k) { return get(k) >= 0.5f; }

    void set(String k, float x) {
        Key key = BY.get(k);
        if (key == null || x != x) return;
        if (key.bool) x = x >= 0.5f ? 1f : 0f;
        v.put(k, Math.max(key.lo, Math.min(key.hi, x)));
    }

    void resetAll() { for (Key k : KEYS) v.put(k.name, k.def); }

    /** Terapkan preset: semua kunci non-milik-pengguna kembali ke default lalu ditimpa oleh {@code p}. */
    void applyPreset(Map<String, Float> p) {
        for (Key k : KEYS) if (!userOwned(k.name)) v.put(k.name, k.def);
        for (Map.Entry<String, Float> e : p.entrySet()) if (!userOwned(e.getKey())) set(e.getKey(), e.getValue());
    }

    String toText() {
        StringBuilder sb = new StringBuilder("# RYEENZYXNZ config\n");
        for (Key k : KEYS) {
            float x = get(k.name);
            sb.append(k.name).append('=');
            if (k.bool) sb.append(x >= 0.5f ? "1" : "0");
            else sb.append(String.format(Locale.US, "%.3f", x));
            sb.append('\n');
        }
        return sb.toString();
    }

    /** Preset pengguna: salinan config di rz_user_preset.cfg (Save/Load Preset di tab Main). */
    boolean saveUser() {
        try {
            FileOutputStream o = new FileOutputStream(new File(cfgFile.getParentFile(), "rz_user_preset.cfg"));
            o.write(toText().getBytes("UTF-8"));
            o.close();
            return true;
        } catch (Throwable t) { return false; }
    }

    boolean loadUser() {
        try {
            File f = new File(cfgFile.getParentFile(), "rz_user_preset.cfg");
            if (!f.exists()) return false;
            FileInputStream in = new FileInputStream(f);
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[1024]; int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            in.close();
            for (String line : bo.toString("UTF-8").split("\n")) {
                int eq = line.indexOf('=');
                if (eq <= 0 || line.startsWith("#")) continue;
                String k = line.substring(0, eq);
                if (userOwned(k)) continue;
                try { set(k, Float.parseFloat(line.substring(eq + 1).trim())); } catch (NumberFormatException ignore) { }
            }
            return true;
        } catch (Throwable t) { return false; }
    }

    void save() {
        try {
            File tmp = new File(cfgFile.getPath() + ".tmp");
            FileOutputStream o = new FileOutputStream(tmp);
            o.write(toText().getBytes("UTF-8"));
            o.close();
            if (!tmp.renameTo(cfgFile)) throw new java.io.IOException("rename");
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "save config: " + t);
        }
    }

    private void load() {
        try {
            if (!cfgFile.exists()) return;
            FileInputStream in = new FileInputStream(cfgFile);
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[1024]; int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            in.close();
            for (String line : bo.toString("UTF-8").split("\n")) {
                int eq = line.indexOf('=');
                if (eq <= 0 || line.startsWith("#")) continue;
                try { set(line.substring(0, eq), Float.parseFloat(line.substring(eq + 1).trim())); } catch (NumberFormatException ignore) { }
            }
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "load config: " + t);
        }
    }
}
