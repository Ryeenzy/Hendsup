package com.ryeenzyxnz.overlay;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * Preset pengguna: satu berkas teks per preset, format sama dengan ekspor/impor berkas.
 *
 * Disimpan di folder PUBLIK (/storage/emulated/0/RYEENZYXNZ/presets), BUKAN di <files> punya app,
 * supaya kalau Roblox di-uninstall lalu dipasang lagi, presetnya tetap ada (folder app di-hapus
 * total pas uninstall, folder publik tidak). Kalau folder publik gagal ditulis (perangkat/Android
 * versi tertentu menolak, lihat PUBLIC_HINT), otomatis balik pakai <files>/presets seperti biasa
 * (preset tetap jalan, cuma nggak ikut selamat kalau di-uninstall).
 */
final class RzPresetStore {
    static final String MAGIC = "# RYEENZYXNZ preset";
    static final File PUBLIC_DIR = new File("/storage/emulated/0/RYEENZYXNZ/presets");

    private final File dir;
    final boolean usingPublic;

    RzPresetStore(File filesDir) {
        File candidate = PUBLIC_DIR;
        boolean ok = false;
        try {
            candidate.mkdirs();
            File probe = new File(candidate, ".rw_probe");
            FileOutputStream o = new FileOutputStream(probe);
            o.write('1');
            o.close();
            ok = probe.delete() || true;
        } catch (Throwable ignore) { ok = false; }
        if (ok) {
            dir = candidate;
            migrateFromInternal(filesDir);
        } else {
            dir = new File(filesDir, "presets");
            dir.mkdirs();
        }
        usingPublic = ok;
    }

    /** Sekali jalan: pindahin preset lama yang kesimpen di <files>/presets (versi sebelum ini) ke folder publik. */
    private void migrateFromInternal(File filesDir) {
        try {
            File old = new File(filesDir, "presets");
            File[] fs = old.listFiles();
            if (fs == null) return;
            for (File f : fs) {
                if (!f.getName().endsWith(".rzp")) continue;
                File dest = new File(dir, f.getName());
                if (dest.exists()) continue;
                byte[] data = RzFx.readAll(new FileInputStream(f)).getBytes("UTF-8");
                FileOutputStream o = new FileOutputStream(dest);
                o.write(data);
                o.close();
            }
        } catch (Throwable ignore) { }
    }

    static String clean(String n) {
        if (n == null) return "";
        StringBuilder sb = new StringBuilder();
        for (char c : n.trim().toCharArray()) if (Character.isLetterOrDigit(c) || c == ' ' || c == '_' || c == '-' || c == '.') sb.append(c);
        String r = sb.toString().trim();
        return r.length() > 40 ? r.substring(0, 40).trim() : r;
    }

    List<String> list() {
        List<String> r = new ArrayList<>();
        File[] fs = dir.listFiles();
        if (fs != null) for (File f : fs) if (f.getName().endsWith(".rzp")) r.add(f.getName().substring(0, f.getName().length() - 4));
        Collections.sort(r, String.CASE_INSENSITIVE_ORDER);
        return r;
    }

    private File file(String name) { return new File(dir, clean(name) + ".rzp"); }

    boolean exists(String name) { return file(name).exists(); }

    boolean save(String name, String text) {
        if (clean(name).isEmpty()) return false;
        try {
            FileOutputStream o = new FileOutputStream(file(name));
            o.write(text.getBytes("UTF-8"));
            o.close();
            return true;
        } catch (Throwable t) { return false; }
    }

    String read(String name) {
        try {
            File f = file(name);
            if (!f.exists()) return null;
            return RzFx.readAll(new FileInputStream(f));
        } catch (Throwable t) { return null; }
    }

    boolean delete(String name) { return file(name).delete(); }

    /** Teks preset: kunci engine + bagian [fx] (efek tambahan menyala + nilainya). */
    static String build(String name, RzState st, RzFx fx) {
        StringBuilder sb = new StringBuilder(MAGIC).append('\n');
        sb.append("name=").append(name).append('\n');
        for (RzState.Key k : RzState.KEYS) {
            float x = st.get(k.name);
            sb.append(k.name).append('=');
            if (k.bool) sb.append(x >= 0.5f ? "1" : "0"); else sb.append(String.format(Locale.US, "%.3f", x));
            sb.append('\n');
        }
        return sb.toString();
    }

    static boolean recognizes(String text) {
        return text != null && (text.startsWith(MAGIC) || text.startsWith("# RYEENZYXNZ config"));
    }

    /** Terapkan teks preset ke state (+ efek tambahan). Mengembalikan jumlah nilai engine yang dipakai, -1 bila bukan format ini. */
    static int apply(String text, RzState st, RzFx fx) {
        if (!recognizes(text)) return -1;
        int at = text.indexOf("[fx]");
        String engine = at >= 0 ? text.substring(0, at) : text;
        int n = 0;
        for (String line : engine.split("\n")) {
            int eq = line.indexOf('=');
            if (eq <= 0 || line.startsWith("#")) continue;
            String k = line.substring(0, eq).trim();
            if (!RzState.BY.containsKey(k) || RzState.userOwned(k)) continue;
            try { st.set(k, Float.parseFloat(line.substring(eq + 1).trim())); n++; } catch (NumberFormatException ignore) { }
        }
        return n;
    }
}
