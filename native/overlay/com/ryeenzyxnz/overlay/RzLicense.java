package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;

/**
 * Pengecekan lisensi key lewat server (Vercel relay), bukan dicek di dalam APK.
 * Cache lokal menyimpan hasil terakhir supaya tetap bisa dipakai offline (masa tenggang),
 * tapi status "aktif" tetap harus pernah diverifikasi online minimal sekali.
 */
final class RzLicense {
    interface Done { void on(boolean ok, String msg); }

    /** Masa tenggang offline: hasil valid terakhir tetap dipakai selama ini tanpa koneksi. */
    static final long GRACE_MS = 72L * 60 * 60 * 1000;
    /** Jarak minimal antar pengecekan ulang otomatis saat online. */
    static final long RECHECK_MS = 6L * 60 * 60 * 1000;

    static final class Info {
        String key = "";
        boolean ok = false;
        long exp = 0;      // 0 = tanpa batas waktu
        long checkedAt = 0;
        String note = "";
        boolean dev = false; // device developer (whitelist server), buka menu tersembunyi
    }

    private static File file(File dir) { return new File(dir, "license.cfg"); }

    static synchronized Info read(File dir) {
        Info i = new Info();
        try {
            InputStream in = new FileInputStream(file(dir));
            String s = RzFx.readAll(in);
            for (String line : s.split("\n")) {
                int eq = line.indexOf('=');
                if (eq < 0) continue;
                String k = line.substring(0, eq).trim(), v = line.substring(eq + 1).trim();
                if (k.equals("key")) i.key = v;
                else if (k.equals("ok")) i.ok = "1".equals(v);
                else if (k.equals("exp")) i.exp = parseLong(v);
                else if (k.equals("checked")) i.checkedAt = parseLong(v);
                else if (k.equals("note")) i.note = v;
                else if (k.equals("dev")) i.dev = "1".equals(v);
            }
        } catch (Throwable ignore) { }
        return i;
    }

    private static long parseLong(String v) { try { return Long.parseLong(v); } catch (Throwable t) { return 0; } }

    private static synchronized void write(File dir, Info i) {
        try {
            FileOutputStream o = new FileOutputStream(file(dir));
            String s = "key=" + i.key + "\nok=" + (i.ok ? "1" : "0") + "\nexp=" + i.exp
                + "\nchecked=" + i.checkedAt + "\nnote=" + (i.note == null ? "" : i.note.replace("\n", " "))
                + "\ndev=" + (i.dev ? "1" : "0") + "\n";
            o.write(s.getBytes("UTF-8"));
            o.close();
        } catch (Throwable ignore) { }
    }

    static String endpoint(Activity a) {
        try {
            InputStream in = a.getAssets().open("ryeenzyxnz/license_url.txt");
            String s = RzFx.readAll(in).trim();
            return s.startsWith("https://") ? s : "";
        } catch (Throwable t) { return ""; }
    }

    static String activateEndpoint(Activity a) {
        try {
            InputStream in = a.getAssets().open("ryeenzyxnz/activate_url.txt");
            String s = RzFx.readAll(in).trim();
            return s.startsWith("https://") ? s : "";
        } catch (Throwable t) { return ""; }
    }

    static String devicesEndpoint(Activity a) {
        try {
            InputStream in = a.getAssets().open("ryeenzyxnz/devices_url.txt");
            String s = RzFx.readAll(in).trim();
            return s.startsWith("https://") ? s : "";
        } catch (Throwable t) { return ""; }
    }

    /** Khusus menu Developer: tanya server berapa device aktif. Server sendiri yang nolak kalau bukan device developer. */
    static void fetchUserAktif(final Activity act, final String endpoint, final Done cb) {
        final Handler main = new Handler(Looper.getMainLooper());
        if (endpoint.isEmpty()) { cb.on(false, "Endpoint belum dikonfigurasi di APK ini"); return; }
        new Thread(new Runnable() {
            public void run() {
                boolean ok = false; String msg;
                try {
                    JSONObject body = new JSONObject();
                    body.put("device", deviceId(act));
                    byte[] data = body.toString().getBytes("UTF-8");
                    HttpURLConnection c = (HttpURLConnection) new URL(endpoint).openConnection();
                    c.setConnectTimeout(10000);
                    c.setReadTimeout(10000);
                    c.setRequestMethod("POST");
                    c.setDoOutput(true);
                    c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                    java.io.OutputStream o = c.getOutputStream();
                    o.write(data);
                    o.close();
                    int code = c.getResponseCode();
                    InputStream rs = code >= 200 && code < 300 ? c.getInputStream() : c.getErrorStream();
                    String resp = rs != null ? RzFx.readAll(rs) : "";
                    c.disconnect();
                    if (code == 200) {
                        JSONObject j = new JSONObject(resp);
                        ok = j.optBoolean("ok", false);
                        msg = ok ? ("Aktif 24 jam: " + j.optInt("active_24h", 0) + "  ·  Total pernah aktivasi: " + j.optInt("total", 0))
                                 : j.optString("error", "Gagal");
                    } else {
                        msg = "Server menolak (kode " + code + ")";
                    }
                } catch (Throwable t) {
                    msg = "Gagal menghubungi server: periksa koneksi internet";
                }
                final boolean fok = ok; final String fmsg = msg;
                main.post(new Runnable() { public void run() { cb.on(fok, fmsg); } });
            }
        }).start();
    }

    /** Status terkini dari cache saja (tanpa jaringan): sudah boleh dipakai atau belum. */
    static boolean usable(File dir) {
        Info i = read(dir);
        if (i.key.isEmpty() || !i.ok) return false;
        long now = System.currentTimeMillis();
        if (i.exp != 0 && now > i.exp) return false;
        if (now - i.checkedAt > GRACE_MS) return false;
        return true;
    }

    /** Device ini ketandai developer di server (whitelist DEV_DEVICES), dari cache terakhir. */
    static boolean isDev(File dir) { return read(dir).dev; }

    static boolean needsRecheck(File dir) {
        Info i = read(dir);
        if (i.key.isEmpty()) return false;
        return System.currentTimeMillis() - i.checkedAt > RECHECK_MS;
    }

    static String deviceId(Activity a) {
        try {
            String aid = Settings.Secure.getString(a.getContentResolver(), Settings.Secure.ANDROID_ID);
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] h = md.digest((aid + "|" + Build.MODEL).getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (int b = 0; b < 8; b++) sb.append(String.format(java.util.Locale.US, "%02x", h[b]));
            return sb.toString();
        } catch (Throwable t) { return "unknown"; }
    }

    /**
     * Aktivasi otomatis: minta key langsung dari server pakai ID device, tanpa user mengetik apa pun.
     * Dipanggil sekali saat pertama kali panel dibuka dan belum ada key tersimpan.
     */
    static void autoActivate(final Activity act, final File dir, final String activateUrl, final Done cb) {
        final Handler main = new Handler(Looper.getMainLooper());
        if (activateUrl.isEmpty()) { cb.on(false, ""); return; }
        new Thread(new Runnable() {
            public void run() {
                boolean ok = false; String msg = ""; String key = ""; long exp = 0; boolean dev = false;
                try {
                    JSONObject body = new JSONObject();
                    body.put("device", deviceId(act));
                    byte[] data = body.toString().getBytes("UTF-8");
                    HttpURLConnection c = (HttpURLConnection) new URL(activateUrl).openConnection();
                    c.setConnectTimeout(10000);
                    c.setReadTimeout(10000);
                    c.setRequestMethod("POST");
                    c.setDoOutput(true);
                    c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                    java.io.OutputStream o = c.getOutputStream();
                    o.write(data);
                    o.close();
                    int code = c.getResponseCode();
                    InputStream rs = code >= 200 && code < 300 ? c.getInputStream() : c.getErrorStream();
                    String resp = rs != null ? RzFx.readAll(rs) : "";
                    c.disconnect();
                    if (code == 200) {
                        JSONObject j = new JSONObject(resp);
                        ok = j.optBoolean("ok", false);
                        key = j.optString("key", "");
                        exp = j.optLong("exp", 0);
                        dev = j.optBoolean("dev", false);
                        msg = ok ? "Aktif otomatis" : j.optString("error", "Aktivasi ditolak server");
                    } else {
                        msg = "Aktivasi ditolak server";
                    }
                } catch (Throwable t) {
                    msg = "Gagal menghubungi server saat aktivasi";
                }
                final boolean fok = ok; final String fmsg = msg; final String fkey = key; final long fexp = exp; final boolean fdev = dev;
                if (fok && !fkey.isEmpty()) {
                    Info i = new Info();
                    i.key = fkey; i.ok = true; i.exp = fexp; i.checkedAt = System.currentTimeMillis(); i.note = fmsg; i.dev = fdev;
                    write(dir, i);
                }
                main.post(new Runnable() { public void run() { cb.on(fok, fmsg); } });
            }
        }).start();
    }

    /** Verifikasi key ke server. Hasil disimpan ke cache lokal (dipakai untuk masa tenggang offline). */
    static void verify(final Activity act, final File dir, final String endpoint, final String keyIn, final Done cb) {
        final String key = keyIn == null ? "" : keyIn.trim().toUpperCase(java.util.Locale.US);
        final Handler main = new Handler(Looper.getMainLooper());
        if (endpoint.isEmpty()) { cb.on(false, "Server lisensi belum dikonfigurasi di APK ini"); return; }
        if (key.isEmpty()) { cb.on(false, "Masukkan key lisensi"); return; }
        new Thread(new Runnable() {
            public void run() {
                boolean ok = false; String msg; long exp = 0; boolean dev = false;
                try {
                    JSONObject body = new JSONObject();
                    body.put("key", key);
                    body.put("device", deviceId(act));
                    byte[] data = body.toString().getBytes("UTF-8");
                    HttpURLConnection c = (HttpURLConnection) new URL(endpoint).openConnection();
                    c.setConnectTimeout(10000);
                    c.setReadTimeout(10000);
                    c.setRequestMethod("POST");
                    c.setDoOutput(true);
                    c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                    java.io.OutputStream o = c.getOutputStream();
                    o.write(data);
                    o.close();
                    int code = c.getResponseCode();
                    InputStream rs = code >= 200 && code < 300 ? c.getInputStream() : c.getErrorStream();
                    String resp = rs != null ? RzFx.readAll(rs) : "";
                    c.disconnect();
                    if (code == 200) {
                        JSONObject j = new JSONObject(resp);
                        ok = j.optBoolean("ok", false);
                        exp = j.optLong("exp", 0);
                        dev = j.optBoolean("dev", false);
                        msg = ok ? "Lisensi aktif" : j.optString("error", "Key tidak valid");
                    } else if (code == 429) {
                        msg = "Terlalu banyak percobaan, coba lagi nanti";
                    } else {
                        msg = "Key tidak valid atau ditolak server";
                    }
                } catch (Throwable t) {
                    msg = "Gagal menghubungi server: periksa koneksi internet";
                }
                final boolean fok = ok; final String fmsg = msg; final long fexp = exp; final boolean fdev = dev;
                Info i = new Info();
                i.key = key; i.ok = fok; i.exp = fexp; i.checkedAt = System.currentTimeMillis(); i.note = fmsg; i.dev = fdev;
                if (fok || !key.isEmpty()) write(dir, i);
                main.post(new Runnable() { public void run() { cb.on(fok, fmsg); } });
            }
        }).start();
    }
}
