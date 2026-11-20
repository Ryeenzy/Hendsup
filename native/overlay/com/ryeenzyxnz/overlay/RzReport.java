package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/** Kirim laporan bug / saran. Tujuan: URL relay milik developer (disarankan) atau langsung webhook Discord. */
final class RzReport {
    interface Done { void on(boolean ok, String msg); }

    static final long MIN_GAP_MS = 30_000;
    static final String VERSION = "v21";

    static String endpoint(Activity a) {
        try {
            InputStream in = a.getAssets().open("ryeenzyxnz/report_url.txt");
            String s = RzFx.readAll(in).trim();
            return s.startsWith("https://") ? s : "";
        } catch (Throwable t) { return ""; }
    }

    private static String clip(String s, int n) { return s == null ? "" : (s.length() > n ? s.substring(0, n) : s); }

    static long waitMs(File dir) {
        try {
            File f = new File(dir, ".report_ts");
            if (!f.exists()) return 0;
            long last = Long.parseLong(RzFx.readAll(new java.io.FileInputStream(f)).trim());
            long left = last + MIN_GAP_MS - System.currentTimeMillis();
            return Math.max(0, left);
        } catch (Throwable t) { return 0; }
    }

    private static void stamp(File dir) {
        try { FileOutputStream o = new FileOutputStream(new File(dir, ".report_ts")); o.write(String.valueOf(System.currentTimeMillis()).getBytes("UTF-8")); o.close(); } catch (Throwable ignore) { }
    }

    static void send(final Activity act, final File dir, final String url, final String category, final String message,
                     final String contact, final String diag, final Done cb) {
        final Handler main = new Handler(Looper.getMainLooper());
        new Thread(new Runnable() {
            public void run() {
                boolean ok = false; String msg;
                try {
                    String device = Build.MANUFACTURER + " " + Build.MODEL + " · Android " + Build.VERSION.RELEASE + " (API " + Build.VERSION.SDK_INT + ")";
                    boolean discord = url.contains("discord.com/api/webhooks") || url.contains("discordapp.com/api/webhooks");
                    JSONObject body = new JSONObject();
                    if (discord) {
                        JSONObject allowed = new JSONObject(); allowed.put("parse", new JSONArray());
                        body.put("username", "RYEENZYXNZ Report");
                        body.put("allowed_mentions", allowed);
                        JSONArray embeds = new JSONArray();
                        JSONObject e = new JSONObject();
                        e.put("title", "[" + category + "] RYEENZYXNZ " + VERSION);
                        e.put("description", clip(message, 1800));
                        e.put("color", category.equals("Bug") ? 0xE07070 : 0x5EEAD4);
                        JSONArray fields = new JSONArray();
                        fields.put(new JSONObject().put("name", "Perangkat").put("value", clip(device, 200)));
                        if (!contact.isEmpty()) fields.put(new JSONObject().put("name", "Kontak").put("value", clip(contact, 200)));
                        e.put("fields", fields);
                        embeds.put(e);
                        if (!diag.isEmpty()) embeds.put(new JSONObject().put("title", "Status engine").put("description", "```\n" + clip(diag, 1800).replace("```", "'''") + "\n```"));
                        body.put("embeds", embeds);
                    } else {
                        body.put("app", "RYEENZYXNZ").put("ver", VERSION).put("category", category).put("message", clip(message, 1800))
                            .put("contact", clip(contact, 200)).put("device", clip(device, 200)).put("diag", clip(diag, 1800));
                    }
                    byte[] data = body.toString().getBytes("UTF-8");
                    HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                    c.setConnectTimeout(10000);
                    c.setReadTimeout(10000);
                    c.setRequestMethod("POST");
                    c.setDoOutput(true);
                    c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                    c.setRequestProperty("User-Agent", "RYEENZYXNZ/" + VERSION);
                    OutputStream o = c.getOutputStream();
                    o.write(data);
                    o.close();
                    int code = c.getResponseCode();
                    c.disconnect();
                    ok = code >= 200 && code < 300;
                    msg = ok ? "Laporan terkirim. Terima kasih!" : "Server menolak (kode " + code + ")";
                    if (ok) stamp(dir);
                } catch (Throwable t) {
                    msg = "Gagal mengirim: periksa koneksi internet";
                }
                final boolean fok = ok; final String fmsg = msg;
                main.post(new Runnable() { public void run() { cb.on(fok, fmsg); } });
            }
        }).start();
    }
}
