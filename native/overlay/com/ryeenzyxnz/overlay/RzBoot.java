package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.io.File;
import java.lang.reflect.Method;
import java.util.WeakHashMap;

/** Titik masuk. Dipanggil dari payload native (lewat JNI) di dalam proses Roblox. */
public final class RzBoot {
    private static final String TAG = "RYEENZYXNZ";
    private static boolean started = false;
    private static boolean callbacksRegistered = false;
    private static final Callbacks LIFECYCLE = new Callbacks();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    private static final WeakHashMap<Activity, Runnable> ATTACH_RETRIES = new WeakHashMap<>();
    private static RzState state;
    private static File dir;
    private static final WeakHashMap<Activity, RzPanel> PANELS = new WeakHashMap<>();

    public static synchronized void start(String filesDir) {
        try {
            if (dir == null) {
                dir = new File(filesDir);
                if (!dir.exists() && !dir.mkdirs() && !dir.isDirectory()) {
                    Log.e(TAG, "direktori data tidak bisa dibuat: " + dir);
                    return;
                }
            }
            if (state == null) state = new RzState(dir);
            final Application app = application();
            if (app == null) {
                // Jangan kunci started=true di sini: JNI dapat mencoba lagi setelah Application siap.
                Log.w(TAG, "Application belum tersedia; start akan dicoba lagi");
                return;
            }
            if (!started) {
                started = true;
                extractFx(app, dir);
            }
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                public void run() {
                    try {
                        if (!callbacksRegistered) {
                            app.registerActivityLifecycleCallbacks(LIFECYCLE);
                            callbacksRegistered = true;
                        }
                        Activity cur = currentActivity();
                        if (cur != null) attach(cur);
                    } catch (Throwable t) {
                        Log.e(TAG, "registrasi lifecycle gagal", t);
                    }
                }
            });
            Log.i(TAG, "overlay siap");
        } catch (Throwable t) {
            Log.e(TAG, "start gagal", t);
        }
    }

    // Shader efek ReShade (assets/ryeenzyxnz/fx-es) disalin ke <files>/fx-es agar bisa dibaca engine native. Ulang bila STAMP berubah.
    private static final String FX_STAMP = "fx1";

    private static void extractFx(final Application app, final File filesDir) {
        new Thread(new Runnable() {
            public void run() {
                try {
                    File out = new File(filesDir, "fx-es");
                    File stamp = new File(out, ".stamp");
                    String have = "";
                    try { if (stamp.exists()) { java.io.BufferedReader r = new java.io.BufferedReader(new java.io.FileReader(stamp)); have = String.valueOf(r.readLine()); r.close(); } } catch (Throwable ignore) { }
                    if (FX_STAMP.equals(have)) return;
                    android.content.res.AssetManager am = app.getAssets();
                    String[] top = am.list("ryeenzyxnz/fx-es");
                    if (top == null || top.length == 0) { Log.w(TAG, "fx-es tidak ada di assets (patch ulang dengan patch.sh terbaru)"); return; }
                    deleteTree(out);
                    int n = copyAssets(am, "ryeenzyxnz/fx-es", out);
                    java.io.FileWriter w = new java.io.FileWriter(stamp);
                    w.write(FX_STAMP + "\n");
                    w.close();
                    Log.i(TAG, "fx-es diekstrak: " + n + " berkas");
                } catch (Throwable t) {
                    Log.w(TAG, "ekstrak fx-es gagal: " + t);
                }
            }
        }, "rz-fx-extract").start();
    }

    private static void deleteTree(File f) {
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteTree(k);
        f.delete();
    }

    private static int copyAssets(android.content.res.AssetManager am, String path, File out) throws java.io.IOException {
        String[] list = am.list(path);
        int n = 0;
        if (list != null && list.length > 0) {
            out.mkdirs();
            for (String name : list) n += copyAssets(am, path + "/" + name, new File(out, name));
            return n;
        }
        java.io.InputStream in = am.open(path);
        java.io.FileOutputStream fo = new java.io.FileOutputStream(out);
        byte[] buf = new byte[16384];
        int r;
        while ((r = in.read(buf)) > 0) fo.write(buf, 0, r);
        fo.close();
        in.close();
        return n + 1;
    }

    private static Application application() {
        try {
            Class<?> at = Class.forName("android.app.ActivityThread");
            Object app = at.getMethod("currentApplication").invoke(null);
            if (app instanceof Application) return (Application) app;
        } catch (Throwable ignore) { }
        try {
            Class<?> ag = Class.forName("android.app.AppGlobals");
            Object app = ag.getMethod("getInitialApplication").invoke(null);
            if (app instanceof Application) return (Application) app;
        } catch (Throwable ignore) { }
        return null;
    }

    /** Activity yang sudah tampil sebelum overlay siap (hidden API; boleh gagal). */
    private static Activity currentActivity() {
        try {
            Class<?> at = Class.forName("android.app.ActivityThread");
            Object thread = at.getMethod("currentActivityThread").invoke(null);
            java.lang.reflect.Field f = at.getDeclaredField("mActivities");
            f.setAccessible(true);
            java.util.Map<?, ?> m = (java.util.Map<?, ?>) f.get(thread);
            for (Object rec : m.values()) {
                java.lang.reflect.Field pf = rec.getClass().getDeclaredField("paused");
                pf.setAccessible(true);
                if (!pf.getBoolean(rec)) {
                    java.lang.reflect.Field af = rec.getClass().getDeclaredField("activity");
                    af.setAccessible(true);
                    return (Activity) af.get(rec);
                }
            }
        } catch (Throwable ignore) { }
        return null;
    }

    private static void scheduleAttach(final Activity a) {
        Runnable old = ATTACH_RETRIES.remove(a);
        if (old != null) MAIN.removeCallbacks(old);
        final Runnable[] holder = new Runnable[1];
        holder[0] = new Runnable() {
            int attempt = 0;
            public void run() {
                if (a.isFinishing()) { ATTACH_RETRIES.remove(a); return; }
                try { if (a.isDestroyed()) { ATTACH_RETRIES.remove(a); return; } } catch (Throwable ignored) { }
                attach(a);
                if (++attempt < 7) MAIN.postDelayed(this, 300);
                else ATTACH_RETRIES.remove(a);
            }
        };
        ATTACH_RETRIES.put(a, holder[0]);
        MAIN.post(holder[0]);
    }

    private static void attach(Activity a) {
        try {
            if (!a.getClass().getName().startsWith("com.roblox")) return;
            RzPanel existing = PANELS.get(a);
            if (existing != null) {
                // Roblox dapat kembali ke lobby/game tanpa menghancurkan Activity.
                // Pastikan overlay lama masih menempel pada decor aktif dan dapat menerima touch.
                existing.ensureAttached();
                return;
            }
            RzPanel p = new RzPanel(a, state, dir);
            p.attach();
            PANELS.put(a, p);
        } catch (Throwable t) {
            Log.e(TAG, "attach gagal", t);
        }
    }

    private static final class Callbacks implements Application.ActivityLifecycleCallbacks {
        public void onActivityResumed(Activity a) { scheduleAttach(a); }
        public void onActivityWindowFocusChanged(Activity a, boolean hasFocus) {
            if (hasFocus) scheduleAttach(a);
        }
        public void onActivityDestroyed(Activity a) {
            Runnable pending = ATTACH_RETRIES.remove(a);
            if (pending != null) MAIN.removeCallbacks(pending);
            RzPanel p = PANELS.remove(a);
            if (p != null) p.detach();
        }
        public void onActivityCreated(Activity a, Bundle b) { }
        public void onActivityStarted(Activity a) { }
        public void onActivityPaused(Activity a) { }
        public void onActivityStopped(Activity a) { }
        public void onActivitySaveInstanceState(Activity a, Bundle b) { }
    }
}
