package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Preset NYATA (angka-angka hasil racikan) tidak dikompilasi ke dalam APK sama sekali.
 * Dikirim server cuma kalau key lisensi valid, lalu disimpan di cache lokal (dir/presets.json)
 * supaya tab PRESET tetap bisa dipakai offline tanpa perlu minta ulang tiap buka panel.
 */
final class RzPresetsRemote {
    interface Done { void on(boolean ok); }

    private static final long RECHECK_MS = 6L * 60 * 60 * 1000;

    private static File cacheFile(File dir) { return new File(dir, "presets.json"); }
    private static File tsFile(File dir) { return new File(dir, ".presets_ts"); }

    static String endpoint(Activity a) {
        try {
            InputStream in = a.getAssets().open("ryeenzyxnz/presets_url.txt");
            String s = RzFx.readAll(in).trim();
            return s.startsWith("https://") ? s : "";
        } catch (Throwable t) { return ""; }
    }

    static boolean needsRecheck(File dir) {
        try {
            File f = tsFile(dir);
            if (!f.exists()) return true;
            long last = Long.parseLong(RzFx.readAll(new FileInputStream(f)).trim());
            return System.currentTimeMillis() - last > RECHECK_MS;
        } catch (Throwable t) { return true; }
    }

    /** Baca cache lokal saja, tanpa jaringan. Kosong kalau belum pernah berhasil diambil. */
    static List<RzPresets.Preset> read(File dir) {
        List<RzPresets.Preset> out = new ArrayList<>();
        try {
            File f = cacheFile(dir);
            if (!f.exists()) return out;
            String s = RzFx.readAll(new FileInputStream(f));
            JSONArray arr = new JSONArray(s);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.getJSONObject(i);
                String name = o.optString("name", "Preset " + (i + 1));
                JSONObject vals = o.optJSONObject("values");
                Map<String, Float> m = new HashMap<>();
                if (vals != null) {
                    java.util.Iterator<String> it = vals.keys();
                    while (it.hasNext()) { String k = it.next(); m.put(k, (float) vals.optDouble(k, 0)); }
                }
                out.add(new RzPresets.Preset(name, m));
            }
        } catch (Throwable ignore) { }
        return out;
    }

    private static void stamp(File dir) {
        try { FileOutputStream o = new FileOutputStream(tsFile(dir)); o.write(String.valueOf(System.currentTimeMillis()).getBytes("UTF-8")); o.close(); } catch (Throwable ignore) { }
    }

    /** Minta preset ke server pakai key yang sudah tervalidasi. Hasil disimpan ke cache lokal. */
    static void fetch(final Activity act, final File dir, final String endpointUrl, final String key, final Done cb) {
        final Handler main = new Handler(Looper.getMainLooper());
        if (endpointUrl.isEmpty() || key == null || key.isEmpty()) { cb.on(false); return; }
        new Thread(new Runnable() {
            public void run() {
                boolean ok = false;
                try {
                    JSONObject body = new JSONObject();
                    body.put("key", key);
                    body.put("device", RzLicense.deviceId(act));
                    byte[] data = body.toString().getBytes("UTF-8");
                    HttpURLConnection c = (HttpURLConnection) new URL(endpointUrl).openConnection();
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
                        if (j.optBoolean("ok", false)) {
                            JSONArray presets = j.optJSONArray("presets");
                            if (presets != null) {
                                FileOutputStream fo = new FileOutputStream(cacheFile(dir));
                                fo.write(presets.toString().getBytes("UTF-8"));
                                fo.close();
                                ok = true;
                            }
                        }
                    }
                } catch (Throwable ignore) { }
                if (ok) stamp(dir);
                final boolean fok = ok;
                main.post(new Runnable() { public void run() { cb.on(fok); } });
            }
        }).start();
    }
}
