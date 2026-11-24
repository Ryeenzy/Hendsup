package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.graphics.Outline;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.view.ViewOutlineProvider;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.Switch;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Tombol bulat + panel RYEENZYXNZ yang digambar sebagai View Android di dalam jendela Roblox. */
/** Tombol bulat + panel RYEENZYXNZ yang digambar sebagai View Android di dalam jendela Roblox. */
final class RzPanel {
    private static final int TEXT = 0xFFEDEDEE, OK = 0xFF86D26B, BAD = 0xFFE5786D, OFF = 0xFF2A2A2D, DARK = 0xFF0B1005;
    // Warna ini berubah mengikuti tema (Liquid Glass / Solid); diisi oleh applyTheme().
    private int BG, ROW, ROWHI, SUB, MUTED, STROKE, HAIR, SIDE, CARD, DETAILBG;
    private static final android.view.animation.Interpolator EASE = new android.view.animation.PathInterpolator(0.22f, 1f, 0.36f, 1f);

    private final Activity act;
    private final RzState st;
    private final File dir;
    private final float density;
    private final Handler h = new Handler(Looper.getMainLooper());
    private final List<Runnable> refreshers = new ArrayList<>();
    private final Runnable saveR;
    private final RzUi ui;
    private final RzPresetStore store;
    private int accent, accent2;
    private static final float DESIGN_W = 620f, DESIGN_H = 424f, SHADOW_M = 30f;
    private final float auto;
    private float panelScale = 1f;      // skala efektif panel (Ukuran panel + batas layar); animasi buka/tutup harus kembali ke nilai ini
    private View panelShadow;
    private Typeface fBody, fBold, fTitle, fMono;
    private final Map<View, GradientDrawable> tabBg = new java.util.HashMap<>();
    private final Map<View, Integer> tabCol = new java.util.HashMap<>();
    private GradientDrawable pillBg, statusDot;
    private static final int TAB_OFF = 0x001F1F21;
    private int pillCol = ROW;
    private ValueAnimator dotPulse;
    private android.graphics.Bitmap logoFab, logoFull;

    private FrameLayout root;
    private TextView fab, statusTv, toast, reportTv, pillLbl, fpsTv, sceneTag;
    private LinearLayout pill, mainCol, tileRow;
    private RzScene scene;
    private RzSpark spark;
    private FrameLayout rightFrame;
    private android.widget.ImageView pwrIv;
    private GradientDrawable pwrBg;
    private final List<View> details = new ArrayList<>();
    private View curDetail;
    private LinearLayout panel;
    private final LinkedHashMap<String, View> pages = new LinkedHashMap<>();
    private final LinkedHashMap<String, LinearLayout> tabs = new LinkedHashMap<>();
    private boolean updating = false;
    private String curPreset = "-";
    private List<RzPresets.Preset> presets;
    private final RzFx fx;
    private boolean licOk = false;
    private boolean builtDev = false;   // tab EFFECT dibangun hanya bila perangkat ini developer
    private boolean fxLoaded;
    private LinearLayout fxList;
    private boolean fxOnlyOn;
    private String fxQuery = "";
    private String selPreset = "";
    private LinearLayout savedList;
    private EditText nameBox;
    private String curTab = "MAIN";

    RzPanel(Activity a, RzState state, File filesDir) {
        act = a; st = state; dir = filesDir;
        // Key disembunyikan dari UI; buat dapetin Device ID (misal buat diisi ke DEV_DEVICES di
        // Vercel), lihat log ini lewat: adb logcat -s RYEENZYXNZ
        android.util.Log.i("RYEENZYXNZ", "device=" + RzLicense.deviceId(a));
        android.util.DisplayMetrics dm = a.getResources().getDisplayMetrics();
        density = dm.density;
        // Auto scale: seluruh panel (ukuran desain DESIGN_W x DESIGN_H dp) harus muat di layar, sekecil apa pun layarnya.
        float longPx = Math.max(dm.widthPixels, dm.heightPixels), shortPx = Math.min(dm.widthPixels, dm.heightPixels);
        float fit = Math.min(longPx * 0.94f / (DESIGN_W * dm.density), shortPx * 0.90f / (DESIGN_H * dm.density));
        auto = Math.max(0.4f, Math.min(1.3f, fit));
        ui = new RzUi(filesDir);
        store = new RzPresetStore(filesDir);
        reloadStyle();
        fTitle = font("ChakraPetch-SemiBold.ttf", Typeface.create("sans-serif-medium", Typeface.NORMAL));
        fMono = font("ShareTechMono-Regular.ttf", Typeface.MONOSPACE);
        logoFab = bitmap("logo_fab.png");
        logoFull = bitmap("logo_full.png");
        fx = new RzFx(filesDir);
        try { fxLoaded = fx.loadIndex(RzFx.readAll(a.getAssets().open("ryeenzyxnz/fx_ui.json"))); } catch (Throwable t) { fxLoaded = false; }
        if (!fxLoaded) {
            try { File ff = new File(filesDir, "fx_ui.json"); if (ff.exists()) fxLoaded = fx.loadIndex(RzFx.readAll(new java.io.FileInputStream(ff))); } catch (Throwable t) { }
        }
        fx.load();
        presets = RzPresets.builtin(dir);
        migrate();
        migrateAllowBuild();
        migrateV24();
        if (!RzLicense.isDev(dir)) disableFxForNonDev();
        saveR = new Runnable() { public void run() { st.save(); fx.save(); } };
    }

    /** Sekali jalan: matikan hal yang kini disembunyikan dari UI supaya tidak aktif tanpa kontrol. */
    private void migrate() {
        File stamp = new File(dir, ".ui_v22");
        if (stamp.exists()) return;
        // Migrasi satu kali: semua saklar boolean kembali OFF, termasuk setting lama
        // yang pernah tersimpan ON. Nilai numerik netral/default tetap dipertahankan.
        for (RzState.Key key : RzState.KEYS) if (key.bool) st.set(key.name, 0f);
        st.set("allow_any_build", 1);   // satu-satunya saklar yang default ON: izinkan versi Roblox lain
        st.set("dp_scale", 1); st.set("dp_debug", 0);
        for (RzFx.Fx f : fx.effects) if (fx.isOn(f)) fx.setOn(f, false);
        st.save(); fx.save();
        try { new java.io.FileOutputStream(stamp).close(); } catch (Throwable ignore) { }
    }

    /** Migrasi v23 (sekali): "Izinkan versi Roblox lain" jadi ON untuk instalasi yang sudah ada. Setelah itu pilihan pengguna dihormati. */
    private void migrateAllowBuild() {
        File stamp = new File(dir, ".ui_v23");
        if (stamp.exists()) return;
        st.set("allow_any_build", 1);
        st.save();
        try { new java.io.FileOutputStream(stamp).close(); } catch (Throwable ignore) { }
    }

    /** Migrasi v24 (sekali): Depth Pipeline dan Paksa OpenGL ES jadi ON terus; saklarnya pindah ke menu Developer. */
    private void migrateV24() {
        File stamp = new File(dir, ".ui_v24");
        if (stamp.exists()) return;
        st.set("depth_pipe", 1);
        st.set("force_gles", 1);
        st.save();
        try { new java.io.FileOutputStream(stamp).close(); } catch (Throwable ignore) { }
    }

    /** Tab EFFECT hanya untuk developer: untuk pengguna biasa semua efek FX dipastikan mati agar tidak aktif tanpa kontrol. */
    private void disableFxForNonDev() {
        boolean any = false;
        for (RzFx.Fx f : fx.effects) if (fx.isOn(f)) { fx.setOn(f, false); any = true; }
        if (any) fx.save();
    }

    private android.graphics.Bitmap bitmap(String file) {
        try {
            java.io.InputStream in = act.getAssets().open("ryeenzyxnz/" + file);
            android.graphics.Bitmap b = android.graphics.BitmapFactory.decodeStream(in);
            in.close();
            return b;
        } catch (Throwable t) { return null; }
    }

    private boolean compactTabs() {
        android.util.DisplayMetrics dm = act.getResources().getDisplayMetrics();
        float panelW = Math.min(420f * ui.scale, 0.94f * dm.widthPixels / (density * auto));
        return panelW < 340f;
    }

    private int tabIcon(String name) {
        switch (name) {
            case "MAIN": return RzIcons.MAIN;
            case "PRESET": return RzIcons.PRESET;
            case "EFFECT": return RzIcons.EFFECT;
            case "SETTING": return RzIcons.SETTING;
            case "FEEDBACK": return RzIcons.FEEDBACK;
            default: return RzIcons.CREDIT;
        }
    }

    private Typeface font(String file, Typeface fallback) {
        try { return Typeface.createFromAsset(act.getAssets(), "ryeenzyxnz/fonts/" + file); } catch (Throwable t) { return fallback; }
    }

    // ------------------------------------------------------------------ util
    private int dp(float v) { return (int) (v * density * auto + 0.5f); }

    private GradientDrawable rr(int color, float rDp) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(color);
        g.setCornerRadius(dp(rDp));
        return g;
    }

    private TextView tv(String text, float sp, int color, boolean bold) {
        TextView t = new TextView(act);
        t.setText(text);
        t.setTextSize(TypedValue.COMPLEX_UNIT_PX, sp * 1.1f * auto * density);
        t.setTextColor(color);
        t.setTypeface(bold ? fBold : fBody);
        return t;
    }

    private LinearLayout.LayoutParams lp(int w, int hgt, int top) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(w, hgt);
        p.topMargin = dp(top);
        return p;
    }

    private void changed() { if (scene != null) scene.invalidate(); h.removeCallbacks(saveR); h.postDelayed(saveR, 150); }

    private void refreshAll() {
        updating = true;
        for (Runnable r : refreshers) { try { r.run(); } catch (Throwable ignore) { } }
        updating = false;
    }

    void notify(String msg, boolean good) {
        toast.setText(msg);
        toast.setTextColor(good ? TEXT : BAD);
        toast.animate().cancel();
        toast.setVisibility(View.VISIBLE);
        toast.setAlpha(0f);
        toast.setTranslationY(dp(8));
        toast.animate().alpha(1f).translationY(0f).setDuration(200).setInterpolator(EASE).start();
        h.removeCallbacks(hideToast);
        h.postDelayed(hideToast, 2600);
    }
    private final Runnable hideToast = new Runnable() { public void run() {
        if (toast == null) return;
        toast.animate().alpha(0f).setDuration(180).withEndAction(new Runnable() { public void run() { if (toast != null) toast.setVisibility(View.GONE); } }).start();
    } };

    // ------------------------------------------------------------------ dragging
    private void drag(final View handle, final View target, final Runnable onClick) {
        final int slop = ViewConfiguration.get(act).getScaledTouchSlop();
        handle.setOnTouchListener(new View.OnTouchListener() {
            float dx, dy, sx, sy; boolean moved;
            public boolean onTouch(View v, MotionEvent e) {
                switch (e.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        dx = target.getX() - e.getRawX(); dy = target.getY() - e.getRawY();
                        sx = e.getRawX(); sy = e.getRawY(); moved = false;
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        if (!moved && Math.abs(e.getRawX() - sx) + Math.abs(e.getRawY() - sy) > slop) moved = true;
                        if (moved) {
                            float nx = e.getRawX() + dx, ny = e.getRawY() + dy;
                            target.setX(Math.max(0, Math.min(root.getWidth() - target.getWidth(), nx)));
                            target.setY(Math.max(0, Math.min(root.getHeight() - target.getHeight(), ny)));
                        }
                        return true;
                    case MotionEvent.ACTION_UP:
                        if (!moved && onClick != null) onClick.run();
                        return true;
                    default:
                        return true;
                }
            }
        });
    }

    // ------------------------------------------------------------------ tema dan shadow
    private boolean glass() { return ui.theme == 0; }

    /** Baca ulang warna aksen, font, dan tema dari pengaturan; dipanggil saat start dan setiap rebuild. */
    private void reloadStyle() {
        accent = RzUi.ACCENTS[ui.accent];
        accent2 = RzUi.ACCENTS2[ui.accent];
        applyTheme();
        fBody = font(RzUi.FONT_MED[ui.font], Typeface.create("sans-serif-condensed", Typeface.NORMAL));
        fBold = font(RzUi.FONT_BOLD[ui.font], Typeface.create("sans-serif-condensed", Typeface.BOLD));
    }

    private float keepPx = Float.NaN, keepPy, keepFx, keepFy;
    private boolean instantOpen;

    private void applyTheme() {
        if (glass()) {
            BG = 0x7A0E0E16; ROW = 0x17FFFFFF; ROWHI = 0x2DFFFFFF; SUB = 0xFFC9CBD2; MUTED = 0xFFA3A6AF;
            STROKE = 0x40FFFFFF; HAIR = 0x24FFFFFF; SIDE = 0x00000000; CARD = 0x14FFFFFF; DETAILBG = 0xF5101018;
        } else {
            BG = 0xFF0C0C0D; ROW = 0xFF151516; ROWHI = 0xFF1F1F21; SUB = 0xFF9B9DA2; MUTED = 0xFF65676C;
            STROKE = 0xFF34343A; HAIR = 0xFF2A2A2F; SIDE = 0xFF0F0F10; CARD = 0xFF111112; DETAILBG = 0xFF0C0C0D;
        }
    }

    private static int blend(int a, int b, float t) { return (Integer) new ArgbEvaluator().evaluate(t, b, a); }

    /** Permukaan bergradasi (terang di kiri atas, gelap di kanan bawah) dengan garis tepi tipis. */
    private GradientDrawable surface(float rDp) {
        GradientDrawable g = new GradientDrawable(GradientDrawable.Orientation.TL_BR,
                glass() ? new int[] { 0x26FFFFFF, 0x0AFFFFFF } : new int[] { 0xFF242428, 0xFF141416 });
        g.setCornerRadius(dp(rDp));
        g.setStroke(dp(1), HAIR);
        return g;
    }

    /** Latar kartu/kontainer: kaca sungguhan di tema Glass, gradasi biasa di tema Solid. */
    private Drawable glassSurface(float rDp) {
        return glass() ? new RzGlass(dp(rDp), dp(1), accent, 1) : surface(rDp);
    }

    private int[] cardOn() {
        return glass() ? new int[] { (accent & 0x00FFFFFF) | 0x4D000000, 0x14FFFFFF } : new int[] { blend(accent, 0xFF1A1A1E, 0.26f), 0xFF141416 };
    }

    private int[] cardOff() {
        return glass() ? new int[] { 0x26FFFFFF, 0x0AFFFFFF } : new int[] { 0xFF242428, 0xFF141416 };
    }

    /** Shadow lewat elevation. Di Android 9+ warna bayangan bisa diatur (dipakai untuk glow aksen). */
    private void elev(View v, float d, int spot) {
        v.setElevation(dp(d * 1.5f));
        // Outline bawaan dari background memberi alpha 0 bila warna latar tembus pandang atau garis tepinya transparan,
        // sehingga bayangan tidak tampil sama sekali. Alpha dipatok 0.9 (di bawah 1 agar bayangan tidak tembus ke dalam kaca).
        v.setOutlineProvider(new ViewOutlineProvider() {
            @Override public void getOutline(View view, Outline o) {
                Drawable bg = view.getBackground();
                if (bg != null) bg.getOutline(o);
                if (o.isEmpty()) o.setRect(0, 0, view.getWidth(), view.getHeight());
                o.setAlpha(0.9f);
            }
        });
        if (Build.VERSION.SDK_INT >= 28) {
            v.setOutlineSpotShadowColor(spot);
            v.setOutlineAmbientShadowColor(0xFF000000);
        }
    }

    /** Kartu terangkat dan mengecil sedikit saat disentuh. */
    private void lift(final View v) {
        v.setOnTouchListener((x, e) -> {
            int a = e.getActionMasked();
            if (a == MotionEvent.ACTION_DOWN) x.animate().scaleX(0.97f).scaleY(0.97f).translationZ(dp(6)).setDuration(90).start();
            else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) x.animate().scaleX(1f).scaleY(1f).translationZ(0f).setDuration(200).setInterpolator(EASE).start();
            return false;
        });
    }

    // ------------------------------------------------------------------ animasi
    private void press(final View v) {
        v.setOnTouchListener((x, e) -> {
            int a = e.getActionMasked();
            if (a == MotionEvent.ACTION_DOWN) x.animate().scaleX(0.97f).scaleY(0.97f).setDuration(90).start();
            else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) x.animate().scaleX(1f).scaleY(1f).setDuration(160).setInterpolator(EASE).start();
            return false;
        });
    }

    private void tint(final GradientDrawable g, int from, int to) {
        if (from == to) { g.setColor(to); return; }
        ValueAnimator a = ValueAnimator.ofObject(new ArgbEvaluator(), from, to);
        a.setDuration(180);
        a.addUpdateListener(v -> g.setColor((Integer) v.getAnimatedValue()));
        a.start();
    }

    private GradientDrawable dotDrawable(int color) {
        GradientDrawable g = new GradientDrawable();
        g.setShape(GradientDrawable.OVAL);
        g.setColor(color);
        g.setSize(dp(7), dp(7));
        g.setBounds(0, 0, dp(7), dp(7));
        return g;
    }

    /** Elemen halaman masuk bergantian: pudar + naik sedikit. */
    private void stagger(View pg) {
        if (!(pg instanceof ScrollView)) return;
        View c = ((ScrollView) pg).getChildAt(0);
        if (!(c instanceof LinearLayout)) return;
        LinearLayout col = (LinearLayout) c;
        int n = Math.min(col.getChildCount(), 9);
        for (int i = 0; i < n; i++) {
            View k = col.getChildAt(i);
            k.setAlpha(0f);
            k.setTranslationY(dp(10));
            k.animate().alpha(1f).translationY(0f).setStartDelay(40 + i * 35L).setDuration(260).setInterpolator(EASE).start();
        }
    }

    /** Buka/tutup isi grup dengan tinggi yang meluncur. */
    private void slide(final View v, final boolean open, int widthPx) {
        final ViewGroup.LayoutParams lpv = v.getLayoutParams();
        v.measure(View.MeasureSpec.makeMeasureSpec(widthPx, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
        final int full = v.getMeasuredHeight();
        if (open) { lpv.height = 0; v.setAlpha(0f); v.setVisibility(View.VISIBLE); }
        ValueAnimator a = open ? ValueAnimator.ofInt(0, full) : ValueAnimator.ofInt(full, 0);
        a.setDuration(Math.min(380, 200 + full / 12));
        a.setInterpolator(EASE);
        a.addUpdateListener(x -> {
            lpv.height = (Integer) x.getAnimatedValue();
            float f = full == 0 ? 1f : lpv.height / (float) full;
            v.setAlpha(f);
            v.setLayoutParams(lpv);
        });
        a.addListener(new android.animation.AnimatorListenerAdapter() {
            public void onAnimationEnd(android.animation.Animator an) {
                lpv.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                v.setAlpha(1f);
                if (!open) v.setVisibility(View.GONE);
                v.setLayoutParams(lpv);
            }
        });
        a.start();
    }

    // ------------------------------------------------------------------ widgets
    private void section(LinearLayout p, String text) {
        TextView t = tv(text, 12, SUB, true);
        t.setPadding(dp(4), dp(16), 0, dp(4));
        p.addView(t, lp(-1, -2, 0));
    }

    private void toggle(LinearLayout p, String label, final String key) {
        final Switch sw = new Switch(act);
        sw.setText(label);
        sw.setTextColor(TEXT);
        sw.setTextSize(TypedValue.COMPLEX_UNIT_PX, 14 * auto * density);
        sw.setTypeface(fBody);
        sw.setBackground(rr(ROW, 8));
        sw.setPadding(dp(12), dp(12), dp(12), dp(12));
        int[][] states = { { android.R.attr.state_checked }, {} };
        sw.setThumbTintList(new ColorStateList(states, new int[] { TEXT, MUTED }));
        sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
        sw.setOnCheckedChangeListener((b, on) -> {
            if (updating) return;
            if (key.equals("master") && on && !licOk) {
                sw.setChecked(false);
                notify("Lisensi belum aktif. Masukkan key di tab CREDIT.", false);
                return;
            }
            st.set(key, on ? 1 : 0); changed();
        });
        refreshers.add(() -> sw.setChecked(st.on(key)));
        p.addView(sw, lp(-1, -2, 4));
    }

    private void slider(LinearLayout p, String label, final String key, final String fmt) {
        final RzState.Key k = RzState.BY.get(key);
        LinearLayout box = new LinearLayout(act);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackground(rr(ROW, 8));
        box.setPadding(dp(12), dp(12), dp(12), dp(8));
        LinearLayout top = new LinearLayout(act);
        top.setOrientation(LinearLayout.HORIZONTAL);
        TextView name = tv(label, 13, TEXT, false);
        final TextView val = tv("", 12, TEXT, false);
        val.setTypeface(fMono);
        top.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        top.addView(val, new LinearLayout.LayoutParams(-2, -2));
        box.addView(top, lp(-1, -2, 0));
        final SeekBar sb = new SeekBar(act);
        sb.setMax(1000);
        sb.setProgressTintList(ColorStateList.valueOf(accent));
        sb.setThumbTintList(ColorStateList.valueOf(TEXT));
        sb.setProgressBackgroundTintList(ColorStateList.valueOf(OFF));
        box.addView(sb, lp(-1, -2, 2));
        final Runnable show = () -> val.setText(String.format(Locale.US, fmt, st.get(key)));
        sb.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int prog, boolean fromUser) {
                if (!fromUser || updating) return;
                st.set(key, k.lo + (k.hi - k.lo) * prog / 1000f);
                show.run(); changed();
            }
            public void onStartTrackingTouch(SeekBar s) { }
            public void onStopTrackingTouch(SeekBar s) { }
        });
        refreshers.add(() -> { sb.setProgress(Math.round((st.get(key) - k.lo) / (k.hi - k.lo) * 1000f)); show.run(); });
        p.addView(box, lp(-1, -2, 4));
    }

    private TextView button(LinearLayout p, String text, final Runnable r, boolean hot, int icon) {
        TextView b = button(p, text, r, hot);
        RzIcons ic = new RzIcons(icon, dp(18), hot ? DARK : TEXT);
        b.setCompoundDrawables(ic, null, null, null);
        b.setCompoundDrawablePadding(dp(8));
        b.setGravity(Gravity.CENTER);
        return b;
    }

    private TextView button(LinearLayout p, String text, final Runnable r, boolean hot) {
        final TextView b = tv(text, 13, TEXT, true);
        b.setGravity(Gravity.CENTER);
        b.setSingleLine(true);
        b.setMaxLines(1);
        b.setAutoSizeTextTypeUniformWithConfiguration(8, 14, 1, TypedValue.COMPLEX_UNIT_SP);
        GradientDrawable bb = rr(hot ? accent : ROW, 8);
        if (!hot) bb.setStroke(dp(1), HAIR);
        b.setBackground(bb);
        b.setTextColor(hot ? DARK : TEXT);
        b.setPadding(dp(12), dp(12), dp(12), dp(12));
        b.setOnClickListener(v -> r.run());
        press(b);
        elev(b, hot ? 4 : 2, hot ? accent : 0xFF000000);
        p.addView(b, lp(-1, -2, 4));
        return b;
    }

    private interface Pick { void on(int index); }

    private void chips(LinearLayout p, List<String> labels, Pick pick) {
        LinearLayout grid = new LinearLayout(act);
        grid.setOrientation(LinearLayout.VERTICAL);
        fillChips(grid, labels, pick);
        p.addView(grid, lp(-1, -2, 0));
    }

    /** Baris sampel warna (lingkaran); yang terpilih diberi cincin putih. */
    private void swatches(LinearLayout p, int[] cols, int sel, final Pick pick) {
        LinearLayout grid = new LinearLayout(act);
        grid.setOrientation(LinearLayout.VERTICAL);
        LinearLayout rowL = null;
        for (int i = 0; i < cols.length; i++) {
            if (i % 5 == 0) {
                rowL = new LinearLayout(act);
                rowL.setOrientation(LinearLayout.HORIZONTAL);
                grid.addView(rowL, lp(-1, -2, 4));
            }
            final int idx = i;
            FrameLayout cell = new FrameLayout(act);
            View dot = new View(act);
            GradientDrawable d = new GradientDrawable();
            d.setShape(GradientDrawable.OVAL);
            d.setColor(cols[i]);
            d.setStroke(dp(i == sel ? 3 : 1), i == sel ? 0xFFFFFFFF : 0x55FFFFFF);
            dot.setBackground(d);
            if (i == sel) dot.setElevation(dp(4));
            cell.addView(dot, new FrameLayout.LayoutParams(dp(32), dp(32), Gravity.CENTER));
            cell.setOnClickListener(v -> pick.on(idx));
            rowL.addView(cell, new LinearLayout.LayoutParams(0, dp(42), 1f));
        }
        p.addView(grid, lp(-1, -2, 0));
    }

    private void fillChips(LinearLayout grid, List<String> labels, final Pick pick) {
        grid.removeAllViews();
        LinearLayout rowL = null;
        for (int i = 0; i < labels.size(); i++) {
            if (i % 2 == 0) {
                rowL = new LinearLayout(act);
                rowL.setOrientation(LinearLayout.HORIZONTAL);
                grid.addView(rowL, lp(-1, -2, 4));
            }
            final int idx = i;
            String lbl = labels.get(i);
            boolean sel = lbl.startsWith("● ");
            if (sel) lbl = lbl.substring(2);
            TextView c = tv(lbl, 12, sel ? accent : TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setSingleLine(true);
            c.setMaxLines(1);
            c.setAutoSizeTextTypeUniformWithConfiguration(8, 13, 1, TypedValue.COMPLEX_UNIT_SP);
            GradientDrawable cb = rr(sel ? ROWHI : ROW, 8);
            cb.setStroke(dp(1), sel ? ((accent & 0x00FFFFFF) | 0x99000000) : HAIR);
            c.setBackground(cb);
            c.setPadding(dp(8), dp(12), dp(8), dp(12));
            press(c);
            c.setOnClickListener(v -> pick.on(idx));
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, -2, 1f);
            cp.leftMargin = (i % 2 == 1) ? dp(4) : 0;
            rowL.addView(c, cp);
        }
    }

    private LinearLayout page(String name) {
        ScrollView sv = new ScrollView(act);
        sv.setVerticalScrollBarEnabled(false);
        LinearLayout col = new LinearLayout(act);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(12), dp(4), dp(12), dp(12));
        col.setClipChildren(false);
        sv.setClipToPadding(false);
        sv.setClipChildren(false);
        sv.addView(col, new ViewGroup.LayoutParams(-1, -2));
        sv.setVisibility(View.GONE);
        pages.put(name, sv);
        return col;
    }

    private void showTab(String name) {
        if (!pages.containsKey(name)) name = "MAIN";
        boolean switched = !name.equals(curTab);
        if (curDetail != null) { View d = curDetail; curDetail = null; d.animate().cancel(); d.setVisibility(View.GONE); }
        for (Map.Entry<String, View> e : pages.entrySet()) e.getValue().setVisibility(e.getKey().equals(name) ? View.VISIBLE : View.GONE);
        for (Map.Entry<String, LinearLayout> e : tabs.entrySet()) {
            boolean on = e.getKey().equals(name);
            Object[] o = (Object[]) e.getValue().getTag();
            ((RzIcons) o[0]).setColor(on ? accent : SUB);
            ((TextView) o[1]).setTextColor(on ? TEXT : SUB);
        }
        curTab = name;
        moveTabInd(switched);
        if (switched) {
            View pg = pages.get(name);
            pg.setAlpha(0f);
            pg.setTranslationY(dp(8));
            pg.animate().alpha(1f).translationY(0f).setDuration(240).setInterpolator(EASE).start();
            stagger(pg);
        }
    }

    private FrameLayout tabsBox;
    private View tabInd;

    /** Tab 3 kolom x 2 baris di bawah pilihan kualitas; penanda aktif meluncur antar sel. */
    private void buildTabs(LinearLayout left) {
        tabsBox = new FrameLayout(act);
        tabsBox.setPadding(dp(4), dp(4), dp(4), dp(4));
        tabsBox.setBackground(glassSurface(14));
        tabsBox.setClipChildren(false);
        elev(tabsBox, 4, 0xFF000000);
        tabInd = new View(act);
        GradientDrawable ig = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM,
                glass() ? new int[] { 0x57FFFFFF, 0x24FFFFFF } : new int[] { 0xFF3A3A41, 0xFF26262B });
        ig.setCornerRadius(dp(10));
        tabInd.setBackground(ig);
        tabInd.setElevation(dp(3));
        tabsBox.addView(tabInd, new FrameLayout.LayoutParams(dp(10), dp(34)));
        LinearLayout grid = new LinearLayout(act);
        grid.setOrientation(LinearLayout.VERTICAL);
        grid.setClipChildren(false);
        grid.setElevation(dp(4));
        tabsBox.addView(grid, new FrameLayout.LayoutParams(-1, -2));
        final List<String> names = new ArrayList<>(pages.keySet());
        LinearLayout row = null;
        for (int i = 0; i < 6; i++) {
            if (i % 3 == 0) {
                row = new LinearLayout(act);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rp2 = new LinearLayout.LayoutParams(-1, dp(34));
                if (i > 0) rp2.topMargin = dp(2);
                grid.addView(row, rp2);
            }
            if (i >= names.size()) { row.addView(new View(act), new LinearLayout.LayoutParams(0, -1, 1f)); continue; }
            final String name = names.get(i);
            LinearLayout t = new LinearLayout(act);
            t.setOrientation(LinearLayout.HORIZONTAL);
            t.setGravity(Gravity.CENTER);
            RzIcons ic = new RzIcons(tabIcon(name), dp(16), SUB);
            android.widget.ImageView iv = new android.widget.ImageView(act);
            iv.setImageDrawable(ic);
            t.addView(iv, new LinearLayout.LayoutParams(dp(16), dp(16)));
            TextView lbl = tv(name.charAt(0) + name.substring(1).toLowerCase(Locale.US), 11, SUB, true);
            lbl.setSingleLine(true);
            {   // kecilkan teks bila tidak muat di sel tab (248dp / 3 kolom, dikurangi ikon dan jarak)
                float availPx = (dp(248) - dp(8)) / 3f - dp(16) - dp(4) - dp(8);
                float tw = lbl.getPaint().measureText(lbl.getText().toString());
                if (tw > availPx && tw > 0) lbl.setTextSize(TypedValue.COMPLEX_UNIT_PX, lbl.getTextSize() * availPx / tw);
            }
            LinearLayout.LayoutParams lp2 = new LinearLayout.LayoutParams(-2, -2);
            lp2.leftMargin = dp(4);
            t.addView(lbl, lp2);
            t.setTag(new Object[] { ic, lbl });
            t.setContentDescription(name);
            t.setClickable(true);
            t.setOnClickListener(v -> showTab(name));
            press(t);
            tabs.put(name, t);
            row.addView(t, new LinearLayout.LayoutParams(0, -1, 1f));
        }
        left.addView(tabsBox, lp(-1, -2, 8));
        tabsBox.addOnLayoutChangeListener((v, l, tp, r, b, ol, ot, or, ob) -> { if (r - l != or - ol) moveTabInd(false); });
    }

    private void moveTabInd(boolean animate) {
        if (tabsBox == null || tabInd == null || tabsBox.getWidth() == 0) return;
        int idx = 0, k = 0;
        for (String n : tabs.keySet()) { if (n.equals(curTab)) idx = k; k++; }
        int pad = dp(4), ch = dp(34);
        float cw = (tabsBox.getWidth() - 2 * pad) / 3f;
        ViewGroup.LayoutParams lpi = tabInd.getLayoutParams();
        if (lpi.width != Math.round(cw) || lpi.height != ch) { lpi.width = Math.round(cw); lpi.height = ch; tabInd.setLayoutParams(lpi); }
        float x = pad + (idx % 3) * cw, y = pad + (idx / 3) * (ch + dp(2));
        tabInd.animate().cancel();
        if (animate) tabInd.animate().translationX(x).translationY(y).setDuration(450).setInterpolator(EASE).start();
        else { tabInd.setTranslationX(x); tabInd.setTranslationY(y); }
    }

    /** Label tab aktif melebar dan memudar masuk. */
    private void labelAnim(final TextView lbl, final boolean show) {
        lbl.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        final int full = lbl.getMeasuredWidth();
        final ViewGroup.LayoutParams lpl = lbl.getLayoutParams();
        ValueAnimator a = ValueAnimator.ofInt(Math.max(0, lpl.width), show ? full : 0);
        a.setDuration(320);
        a.setInterpolator(EASE);
        a.addUpdateListener(x -> {
            lpl.width = (Integer) x.getAnimatedValue();
            lbl.setAlpha(full == 0 ? 0f : Math.min(1f, lpl.width / (float) full));
            lbl.setLayoutParams(lpl);
        });
        a.start();
    }

    private RzSwitch bindSwitch(final String key) {
        final RzSwitch sw = new RzSwitch(act, density * auto, accent);
        sw.setClickable(true);
        sw.setOnClickListener(v -> {
            boolean on = !st.on(key);
            if (key.equals("master") && on && !licOk) { notify("Lisensi belum aktif. Masukkan key di tab CREDIT.", false); return; }
            st.set(key, on ? 1 : 0); changed(); refreshAll();
        });
        refreshers.add(() -> sw.setOn(st.on(key), true));
        return sw;
    }

    private void openDetail(View d) {
        if (curDetail != null) return;
        curDetail = d;
        d.animate().cancel();
        d.setVisibility(View.VISIBLE);
        d.setTranslationX(rightFrame.getWidth());
        d.scrollTo(0, 0);
        d.animate().translationX(0f).setDuration(420).setInterpolator(EASE).start();
    }

    private void closeDetail() {
        if (curDetail == null) return;
        final View d = curDetail;
        curDetail = null;
        d.animate().cancel();
        d.animate().translationX(rightFrame.getWidth()).setDuration(320).setInterpolator(EASE)
                .withEndAction(new Runnable() { public void run() { if (curDetail != d) d.setVisibility(View.GONE); } }).start();
        refreshAll();
    }

    /** Satu efek: kartu di grid halaman MAIN + halaman detail yang meluncur dari kanan. Mengembalikan kolom isi detail. */
    private LinearLayout detail(final String title, final String onKey, final String valKey, int icon, boolean wide) {
        final ScrollView sv = new ScrollView(act);
        sv.setVerticalScrollBarEnabled(false);
        sv.setBackgroundColor(DETAILBG);
        sv.setVisibility(View.GONE);
        sv.setClipToPadding(false);
        sv.setClipChildren(false);
        LinearLayout col = new LinearLayout(act);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setClipChildren(false);
        col.setPadding(dp(12), dp(4), dp(12), dp(12));
        sv.addView(col, new ViewGroup.LayoutParams(-1, -2));
        details.add(sv);

        LinearLayout hd = new LinearLayout(act);
        hd.setOrientation(LinearLayout.HORIZONTAL);
        hd.setGravity(Gravity.CENTER_VERTICAL);
        android.widget.ImageView bk = new android.widget.ImageView(act);
        bk.setImageDrawable(new RzIcons(RzIcons.BACK, dp(18), TEXT));
        bk.setScaleType(android.widget.ImageView.ScaleType.CENTER);
        bk.setBackground(rr(ROW, 9));
        bk.setOnClickListener(v -> closeDetail());
        press(bk);
        hd.addView(bk, new LinearLayout.LayoutParams(dp(32), dp(32)));
        TextView ht = tv(title, 15, TEXT, true);
        ht.setPadding(dp(12), 0, 0, 0);
        hd.addView(ht, new LinearLayout.LayoutParams(0, -2, 1f));
        if (onKey != null) hd.addView(bindSwitch(onKey), new LinearLayout.LayoutParams(dp(34), dp(20)));
        col.addView(hd, lp(-1, -2, 0));
        col.addView(new View(act), lp(-1, dp(8), 0));

        final LinearLayout tile = new LinearLayout(act);
        tile.setOrientation(LinearLayout.VERTICAL);
        tile.setPadding(dp(12), dp(12), dp(12), dp(12));
        final GradientDrawable tbg = surface(14);
        tile.setBackground(glass()
                ? new android.graphics.drawable.LayerDrawable(new Drawable[] { tbg, new RzGlass(dp(14), dp(1), accent, 1) })
                : tbg);
        elev(tile, 5, 0xFF000000);
        tile.setClickable(true);
        lift(tile);
        tile.setOnClickListener(v -> openDetail(sv));
        LinearLayout top = new LinearLayout(act);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        final GradientDrawable ibg = rr(ROW, 9);
        final RzIcons ric = new RzIcons(icon, dp(18), SUB);
        android.widget.ImageView iv = new android.widget.ImageView(act);
        iv.setImageDrawable(ric);
        iv.setScaleType(android.widget.ImageView.ScaleType.CENTER);
        iv.setBackground(ibg);
        top.addView(iv, new LinearLayout.LayoutParams(dp(32), dp(32)));
        top.addView(new View(act), new LinearLayout.LayoutParams(0, 1, 1f));
        if (onKey != null) top.addView(bindSwitch(onKey), new LinearLayout.LayoutParams(dp(34), dp(20)));
        tile.addView(top, new LinearLayout.LayoutParams(-1, -2));
        tile.addView(tv(title, 13, TEXT, true), lp(-1, -2, 12));
        final TextView sub = tv("", 11, MUTED, false);
        sub.setTypeface(fMono);
        tile.addView(sub, lp(-1, -2, 0));
        refreshers.add(() -> {
            boolean on = onKey != null && st.on(onKey);
            ibg.setColor(on ? accent : ROW);
            ric.setColor(on ? DARK : SUB);
            tbg.setColors(on ? cardOn() : cardOff());
            tbg.setStroke(dp(1), on ? ((accent & 0x00FFFFFF) | 0x80000000) : HAIR);
            if (Build.VERSION.SDK_INT >= 28) tile.setOutlineSpotShadowColor(on ? ((accent & 0x00FFFFFF) | 0xCC000000) : 0xFF000000);
            sub.setTextColor(on ? SUB : MUTED);
            sub.setText(onKey == null ? "Warna dan kurva" : !on ? "Nonaktif" : valKey == null ? "Aktif" : String.format(Locale.US, "Intensitas %.2f", st.get(valKey)));
        });

        if (wide) {
            LinearLayout row = new LinearLayout(act);
            row.setOrientation(LinearLayout.HORIZONTAL);
            mainCol.addView(row, lp(-1, -2, 8));
            row.addView(tile, new LinearLayout.LayoutParams(-1, -2));
            tileRow = null;
        } else {
            if (tileRow == null || tileRow.getChildCount() >= 2) {
                tileRow = new LinearLayout(act);
                tileRow.setOrientation(LinearLayout.HORIZONTAL);
                tileRow.setClipChildren(false);
                mainCol.addView(tileRow, lp(-1, -2, 8));
            }
            LinearLayout.LayoutParams tp = new LinearLayout.LayoutParams(0, -2, 1f);
            if (tileRow.getChildCount() == 1) tp.leftMargin = dp(8);
            tileRow.addView(tile, tp);
        }
        return col;
    }

    private void gradingSliders(LinearLayout p) {
        slider(p, "Exposure", "exposure", "%+.2f");
        slider(p, "Brightness", "brightness", "%+.2f");
        slider(p, "Contrast", "contrast", "%+.2f");
        slider(p, "Saturation", "saturation", "%+.2f");
        slider(p, "Warmth", "warmth", "%+.2f");
        slider(p, "Vibrance", "vibrance", "%+.2f");
        slider(p, "Gamma", "gamma", "%.2f");
    }

    // ------------------------------------------------------------------ dropdown (grup yang bisa dilipat)
    private LinearLayout group(LinearLayout pg, String title, final String onKey) {
        final LinearLayout card = new LinearLayout(act);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackground(glassSurface(14));
        elev(card, 4, 0xFF000000);
        LinearLayout head = new LinearLayout(act);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(16), dp(12), dp(12), dp(12));
        final TextView name = tv(title, 14, TEXT, true);
        final TextView dot = tv("", 11, accent, false);
        dot.setTypeface(fMono);
        dot.setCompoundDrawablePadding(dp(6));
        final android.widget.ImageView arrow = new android.widget.ImageView(act);
        arrow.setImageDrawable(new RzIcons(RzIcons.CHEVRON, dp(16), SUB));
        head.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        head.addView(dot, new LinearLayout.LayoutParams(-2, -2));
        LinearLayout.LayoutParams ap = new LinearLayout.LayoutParams(dp(16), dp(16));
        ap.leftMargin = dp(8);
        head.addView(arrow, ap);
        final LinearLayout body = new LinearLayout(act);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(8), 0, dp(8), dp(12));
        body.setVisibility(View.GONE);
        press(head);
        head.setOnClickListener(v -> {
            boolean open = body.getVisibility() != View.VISIBLE;
            slide(body, open, card.getWidth());
            arrow.animate().rotation(open ? 90f : 0f).setDuration(220).setInterpolator(EASE).start();
        });
        card.addView(head, new LinearLayout.LayoutParams(-1, -2));
        card.addView(body, new LinearLayout.LayoutParams(-1, -2));
        pg.addView(card, lp(-1, -2, 8));
        if (onKey != null) refreshers.add(() -> {
            boolean on = st.on(onKey);
            dot.setText(on ? "Aktif" : "");
            dot.setCompoundDrawables(on ? dotDrawable(accent) : null, null, null, null);
        });
        return body;
    }

    // ------------------------------------------------------------------ presets
    private void applyPreset(String name, Map<String, Float> values) {
        st.applyPreset(values);
        curPreset = name;
        refreshAll(); changed();
        notify("Preset: " + name, true);
    }

    /** Terapkan teks preset format sendiri (.rzp). */
    private boolean applyText(String name, String text) {
        int n = RzPresetStore.apply(text, st, fx);
        if (n < 0) { notify("Format preset tidak dikenali", false); return false; }
        curPreset = name;
        refreshAll(); changed();
        notify("Preset: " + name, true);
        return true;
    }

    /** Impor dari teks (.ini / .txt preset pihak lain). */
    private void importText(String name, String text) {
        RzIni.Result r = RzIni.fromText(text);
        if (r.techniques == 0 && r.applied.isEmpty()) { notify("Format preset tidak dikenali", false); return; }
        applyPreset(name, r.cfg);
        refreshAll(); changed();
        SpannableStringBuilder sb = new SpannableStringBuilder(name + " : " + r.techniques + " teknik terbaca" + "\n");
        for (String l : r.applied) append(sb, "✓ ", OK, l);
        for (String l : r.ignored) append(sb, "✗ ", BAD, l);
        reportTv.setText(sb);
    }

    private void append(SpannableStringBuilder sb, String mark, int color, String line) {
        int s = sb.length();
        sb.append(mark);
        sb.setSpan(new ForegroundColorSpan(color), s, sb.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        sb.append(line).append('\n');
    }

    private String presetNameOf(String text) {
        for (String l : text.split("\n")) if (l.startsWith("name=")) return RzPresetStore.clean(l.substring(5));
        return "";
    }

    private String wantedName() {
        String n = nameBox == null ? "" : RzPresetStore.clean(nameBox.getText().toString());
        return n.isEmpty() ? selPreset : n;
    }

    private void saveCurrent() {
        String n = wantedName();
        if (n.isEmpty()) { notify("Masukkan nama preset", false); return; }
        boolean ok = store.save(n, RzPresetStore.build(n, st, fx));
        if (ok) { selPreset = n; curPreset = n; rebuildSaved(); }
        notify(ok ? "Preset disimpan: " + n : "Gagal menyimpan preset", ok);
    }

    private void importFile() {
        boolean ok = RzFilePick.open(act, uri -> {
            if (uri == null) { notify("Impor dibatalkan", false); return; }
            try {
                String t = RzFilePick.readText(act, uri);
                if (RzPresetStore.recognizes(t)) {
                    String n = presetNameOf(t);
                    if (n.isEmpty()) n = "Impor";
                    if (applyText(n, t)) { store.save(n, t); selPreset = n; rebuildSaved(); }
                } else {
                    importText("Preset impor", t);
                }
            } catch (Throwable e) { notify("Gagal membaca file", false); }
        });
        if (!ok) notify("Pemilih file tidak tersedia. Gunakan impor teks di bawah", false);
    }

    private void exportFile() {
        final String n0 = wantedName();
        final String n = n0.isEmpty() ? "RYEENZYXNZ" : n0;
        final String text = RzPresetStore.build(n, st, fx);
        boolean ok = RzFilePick.create(act, n + ".rzp", uri -> {
            if (uri == null) { notify("Ekspor dibatalkan", false); return; }
            try { RzFilePick.writeText(act, uri, text); notify("Preset diekspor ke file", true); }
            catch (Throwable e) { notify("Gagal menulis file", false); }
        });
        if (!ok) notify("Pemilih file tidak tersedia", false);
    }

    private void rebuildSaved() {
        if (savedList == null) return;
        savedList.removeAllViews();
        List<String> names = store.list();
        if (names.isEmpty()) { savedList.addView(tv("Belum ada preset tersimpan.", 13, SUB, false), lp(-1, -2, 6)); return; }
        for (final String n : names) {
            LinearLayout row = new LinearLayout(act);
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.setGravity(Gravity.CENTER_VERTICAL);
            boolean sel = n.equals(selPreset);
            row.setBackground(rr(sel ? 0xFF2A2A2E : ROW, 10));
            TextView t = tv((sel ? "● " : "") + n, 14, sel ? accent : TEXT, true);
            t.setPadding(dp(12), dp(10), dp(8), dp(10));
            t.setSingleLine(true);
            t.setEllipsize(android.text.TextUtils.TruncateAt.END);
            t.setOnClickListener(v -> {
                String txt = store.read(n);
                if (txt == null) { notify("Preset tidak terbaca", false); return; }
                selPreset = n;
                if (nameBox != null) nameBox.setText(n);
                applyText(n, txt);
                rebuildSaved();
            });
            row.addView(t, new LinearLayout.LayoutParams(0, -2, 1f));
            TextView del = tv("HAPUS", 11, BAD, true);
            del.setPadding(dp(10), dp(10), dp(12), dp(10));
            del.setOnClickListener(v -> {
                store.delete(n);
                if (n.equals(selPreset)) selPreset = "";
                rebuildSaved();
                notify("Preset dihapus: " + n, true);
            });
            row.addView(del, new LinearLayout.LayoutParams(-2, -2));
            savedList.addView(row, lp(-1, -2, 5));
        }
    }

    // ------------------------------------------------------------------ build
    void ensureAttached() {
        if (act.isFinishing()) return;
        try { if (act.isDestroyed()) return; } catch (Throwable ignored) { }
        View decor = act.getWindow() == null ? null : act.getWindow().getDecorView();
        if (!(decor instanceof ViewGroup)) return;
        if (root != null && root.getParent() == decor && root.isAttachedToWindow()) {
            root.setElevation(dp(32));
            ((ViewGroup) decor).bringChildToFront(root);
            root.bringToFront();
            if (fab != null) fab.setElevation(dp(40));
            if (panel != null) panel.setElevation(dp(24));
            root.post(new Runnable() { public void run() { if (root != null) place(); } });
            return;
        }
        if (root != null && root.getParent() instanceof ViewGroup) {
            try { ((ViewGroup) root.getParent()).removeView(root); } catch (Throwable ignored) { }
        }
        attach();
    }

    void attach() {
        if (act.isFinishing()) return;
        try { if (act.isDestroyed()) return; } catch (Throwable ignored) { }
        View decor = act.getWindow() == null ? null : act.getWindow().getDecorView();
        if (!(decor instanceof ViewGroup)) return;
        if (root != null && root.getParent() == decor && root.isAttachedToWindow()) return;
        applyTheme();
        pages.clear(); tabs.clear(); refreshers.clear(); details.clear(); curDetail = null; tileRow = null;
        fxList = null; fxStatus = null; fxCount = null; savedList = null; nameBox = null;
        root = new FrameLayout(act);
        root.setClipChildren(false);
        // Root hanya menjadi wadah; area kosong harus meneruskan touch ke Roblox.
        root.setClickable(false);
        root.setFocusable(false);
        root.setFocusableInTouchMode(false);
        buildPanel();
        buildFab();
        setOpen(false);
        ((ViewGroup) decor).addView(root, new FrameLayout.LayoutParams(-1, -1));
        root.setElevation(dp(32));
        root.setClickable(false);
        root.setFocusable(false);
        root.post(new Runnable() {
            public void run() {
                if (root != null && root.getParent() == decor) root.bringToFront();
                place();
            }
        });
        root.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> {
            if (r - l != or - ol || b - t != ob - ot) root.post(new Runnable() { public void run() { place(); } });
        });
        refreshLicense();
        refreshAll();
        poll.run();
    }

    private void refreshLicense() {
        licOk = RzLicense.usable(dir);
        if (!licOk) {
            boolean changedAny = false;
            if (st.on("enabled")) { st.set("enabled", 0); changedAny = true; }
            if (st.on("master")) { st.set("master", 0); changedAny = true; }
            if (changedAny) changed();
        }
        RzLicense.Info info = RzLicense.read(dir);
        if (info.key.isEmpty()) {
            // belum pernah aktivasi sama sekali: minta key otomatis, tanpa user ketik apa pun
            String au = RzLicense.activateEndpoint(act);
            if (!au.isEmpty()) {
                RzLicense.autoActivate(act, dir, au, (ok, msg) -> {
                    licOk = RzLicense.usable(dir);
                    refreshAll();
                    fetchPresetsIfNeeded();
                    if (RzLicense.isDev(dir) != builtDev) rebuild(curTab);
                });
            }
            return;
        }
        String ep = RzLicense.endpoint(act);
        if (!ep.isEmpty() && RzLicense.needsRecheck(dir)) {
            RzLicense.verify(act, dir, ep, info.key, (ok, msg) -> {
                licOk = RzLicense.usable(dir);
                if (!licOk) {
                    boolean changedAny = false;
                    if (st.on("enabled")) { st.set("enabled", 0); changedAny = true; }
                    if (st.on("master")) { st.set("master", 0); changedAny = true; }
                    if (changedAny) changed();
                }
                refreshAll();
                fetchPresetsIfNeeded();
                if (RzLicense.isDev(dir) != builtDev) rebuild(curTab);
            });
        } else {
            fetchPresetsIfNeeded();
        }
    }

    /** Ambil isi preset dari server kalau lisensi valid dan cache lokal belum ada / sudah lama. */
    private void fetchPresetsIfNeeded() {
        if (!licOk) return;
        String pep = RzPresetsRemote.endpoint(act);
        if (pep.isEmpty()) return;
        if (!presets.isEmpty() && !RzPresetsRemote.needsRecheck(dir)) return;
        RzLicense.Info info = RzLicense.read(dir);
        if (info.key.isEmpty()) return;
        RzPresetsRemote.fetch(act, dir, pep, info.key, ok -> {
            if (ok) { presets = RzPresets.builtin(dir); rebuild(curTab); }
        });
    }

    /** Bangun ulang seluruh panel (mis. setelah ganti warna aksen). */
    private void rebuild(final String tab) {
        final boolean open = panel != null && panel.getVisibility() == View.VISIBLE;
        final View oldRoot = root;
        final boolean had = panel != null && fab != null;
        final float px = had ? panel.getX() : Float.NaN, py = had ? panel.getY() : 0f, fx0 = had ? fab.getX() : 0f, fy0 = had ? fab.getY() : 0f;
        // Hentikan loop polling lama sebelum membuat view tree baru.
        h.removeCallbacks(poll);
        if (dotPulse != null) { dotPulse.cancel(); dotPulse = null; }
        h.removeCallbacks(saveR);
        h.removeCallbacks(hideToast);
        root = null;
        reloadStyle();
        keepPx = px; keepPy = py; keepFx = fx0; keepFy = fy0;
        instantOpen = true;
        attach();
        instantOpen = false;
        if (root == null) { keepPx = Float.NaN; return; }
        if (had) { panel.setX(px); panel.setY(py); fab.setX(fx0); fab.setY(fy0); }
        showTab(tab);
        if (open) setOpen(true, true);
        // View baru disembunyikan sampai frame pertamanya siap, lalu view lama dilepas pada frame yang sama (tanpa kedip).
        final View nr = root;
        if (oldRoot != null && oldRoot.getParent() instanceof ViewGroup) {
            nr.setAlpha(0f);
            nr.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
                @Override public boolean onPreDraw() {
                    nr.getViewTreeObserver().removeOnPreDrawListener(this);
                    place(); // ukuran dan posisi panel baru ditetapkan sebelum ditampilkan
                    nr.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
                        @Override public boolean onPreDraw() {
                            nr.getViewTreeObserver().removeOnPreDrawListener(this);
                            nr.setAlpha(1f);
                            try { ((ViewGroup) oldRoot.getParent()).removeView(oldRoot); } catch (Throwable ignored) { }
                            return true;
                        }
                    });
                    nr.postInvalidate();
                    return true;
                }
            });
        }
    }

    void detach() {
        // Batalkan seluruh pekerjaan tertunda agar Activity lama tidak disentuh setelah relog.
        h.removeCallbacksAndMessages(null);
        if (dotPulse != null) { dotPulse.cancel(); dotPulse = null; }
        if (root != null && root.getParent() instanceof ViewGroup) {
            try { ((ViewGroup) root.getParent()).removeView(root); } catch (Throwable ignored) { }
        }
        root = null;
        panel = null;
        fab = null;
        pill = null;
        statusTv = null;
        toast = null;
        reportTv = null;
        fxList = null;
        savedList = null;
        nameBox = null;
    }

    /** Samakan posisi, skala, alpha, dan visibilitas bayangan dengan panel (dipanggil tiap sebelum menggambar). */
    private void syncShadow() {
        View sh = panelShadow;
        if (sh == null || panel == null) return;
        boolean vis = panel.getVisibility() == View.VISIBLE;
        if ((sh.getVisibility() == View.VISIBLE) != vis) sh.setVisibility(vis ? View.VISIBLE : View.GONE);
        if (!vis) return;
        int m = dp(SHADOW_M);
        sh.setX(panel.getX() - m);
        sh.setY(panel.getY() - m);
        sh.setPivotX(sh.getWidth() / 2f);
        sh.setPivotY(sh.getHeight() / 2f);
        sh.setScaleX(panel.getScaleX());
        sh.setScaleY(panel.getScaleY());
        sh.setAlpha(Math.min(1f, panel.getAlpha() / Math.max(0.01f, ui.opacity)));
    }

    private void sizePanel() {
        int w = root.getWidth(), hh = root.getHeight();
        if (w <= 0) return;
        ViewGroup.LayoutParams lpP = panel.getLayoutParams();
        lpP.width = dp(DESIGN_W);
        lpP.height = dp(DESIGN_H);
        panel.setLayoutParams(lpP);
        // Skala tambahan dari pengaturan "Ukuran panel", dibatasi agar panel tidak pernah keluar dari layar.
        float fitS = Math.min(w * 0.97f / lpP.width, hh * 0.95f / lpP.height);
        float sc = Math.max(0.3f, Math.min(ui.scale, fitS));
        panel.setPivotX(lpP.width / 2f);
        panel.setPivotY(lpP.height / 2f);
        panelScale = sc;
        panel.setScaleX(sc);
        panel.setScaleY(sc);
        if (panelShadow != null) {
            int m = dp(SHADOW_M);
            ViewGroup.LayoutParams sp = panelShadow.getLayoutParams();
            if (sp.width != lpP.width + 2 * m || sp.height != lpP.height + 2 * m) {
                sp.width = lpP.width + 2 * m; sp.height = lpP.height + 2 * m;
                panelShadow.setLayoutParams(sp);
            }
        }
        panel.setAlpha(ui.opacity);
        fab.setAlpha(ui.fabOpacity);
        ViewGroup.LayoutParams fp = fab.getLayoutParams();
        fp.width = dp(ui.fabSize); fp.height = dp(ui.fabSize);
        fab.setLayoutParams(fp);
    }

    private void place() {
        int w = root.getWidth(), hh = root.getHeight();
        if (w <= 0) { root.post(new Runnable() { public void run() { place(); } }); return; }
        sizePanel();
        ViewGroup.LayoutParams lpP = panel.getLayoutParams();
        panel.setX((w - lpP.width) / 2f);
        panel.setY((hh - lpP.height) / 2f);
        fab.setX(dp(14)); fab.setY(Math.min(dp(110), hh - dp(70)));
        if (!Float.isNaN(keepPx)) { panel.setX(keepPx); panel.setY(keepPy); fab.setX(keepFx); fab.setY(keepFy); keepPx = Float.NaN; }
    }

    private void setOpen(final boolean on) { setOpen(on, false); }

    private void setOpen(final boolean on, final boolean instant) {
        if (panel == null) return;
        boolean was = panel.getVisibility() == View.VISIBLE;
        panel.animate().cancel();
        if (on) {
            panel.setVisibility(View.VISIBLE);
            if (instant) {
                panel.setAlpha(ui.opacity); panel.setScaleX(panelScale); panel.setScaleY(panelScale);
            } else if (!was) {
                final float y0 = panel.getY();
                panel.setAlpha(0f); panel.setScaleX(panelScale * 0.94f); panel.setScaleY(panelScale * 0.94f); panel.setY(y0 + dp(14));
                panel.animate().alpha(ui.opacity).scaleX(panelScale).scaleY(panelScale).y(y0).setDuration(260).setInterpolator(EASE).start();
                stagger(pages.get(curTab));
            }
        } else if (was) {
            final float y0 = panel.getY();
            panel.animate().alpha(0f).scaleX(panelScale * 0.97f).scaleY(panelScale * 0.97f).y(y0 + dp(8)).setDuration(160).withEndAction(new Runnable() {
                public void run() {
                    if (panel == null) return;
                    panel.setVisibility(View.GONE);
                    panel.setAlpha(ui.opacity); panel.setScaleX(panelScale); panel.setScaleY(panelScale); panel.setY(y0);
                }
            }).start();
        }
        if (logoFab != null && !on) {
            fab.setText("");
            fab.setBackground(new RzLogo(logoFab, 0x33FFFFFF, dp(1)));
        } else {
            fab.setText(on ? "×" : "RZ");
            fab.setTextSize(TypedValue.COMPLEX_UNIT_PX, (on ? 24 : 16) * auto * density);
            GradientDrawable g = rr(accent, 0);
            g.setShape(GradientDrawable.OVAL);
            g.setStroke(dp(1), 0x33FFFFFF);
            fab.setBackground(g);
        }
        if (instant) { fab.setScaleX(1f); fab.setScaleY(1f); return; }
        fab.setScaleX(0.88f); fab.setScaleY(0.88f);
        fab.animate().scaleX(1f).scaleY(1f).setDuration(220).setInterpolator(EASE).start();
    }

    private void buildFab() {
        fab = tv("RZ", 15, DARK, true);
        fab.setTypeface(fTitle);
        fab.setGravity(Gravity.CENTER);
        GradientDrawable g = rr(accent, 0);
        g.setShape(GradientDrawable.OVAL);
        g.setStroke(dp(1), 0x33FFFFFF);
        fab.setBackground(g);
        fab.setElevation(dp(12));
        fab.setClickable(true);
        fab.setFocusable(true);
        FrameLayout.LayoutParams p = new FrameLayout.LayoutParams(dp(ui.fabSize), dp(ui.fabSize));
        root.addView(fab, p);
        drag(fab, fab, () -> setOpen(panel.getVisibility() != View.VISIBLE));
    }

    private void buildPanel() {
        panel = new LinearLayout(act);
        panel.setOrientation(LinearLayout.VERTICAL);
        if (glass()) {
            panel.setBackground(new RzGlass(dp(20), dp(1), accent, 0));
        } else {
            GradientDrawable bg = new GradientDrawable(GradientDrawable.Orientation.TL_BR,
                    new int[] { 0xFF1C1C20, 0xFF0C0C0D, 0xFF18181C });
            bg.setCornerRadius(dp(20));
            bg.setStroke(dp(1), STROKE);
            panel.setBackground(bg);
        }
        panel.setClipToOutline(true);
        elev(panel, 32, 0xFF000000);
        panel.setClickable(true);
        panel.setFocusable(true);
        // Bayangan buatan di belakang panel (view terpisah supaya tidak terpotong clipToOutline milik panel).
        panelShadow = new View(act);
        panelShadow.setBackground(new RzShadow(dp(SHADOW_M), dp(20), glass() ? 0x0D : 0x12));
        panelShadow.setClickable(false);
        panelShadow.setFocusable(false);
        panelShadow.setVisibility(View.GONE);
        root.addView(panelShadow, new FrameLayout.LayoutParams(dp(300), dp(320)));
        root.addView(panel, new FrameLayout.LayoutParams(dp(300), dp(320)));
        panel.getViewTreeObserver().addOnPreDrawListener(new android.view.ViewTreeObserver.OnPreDrawListener() {
            @Override public boolean onPreDraw() { syncShadow(); return true; }
        });
        details.clear();
        tileRow = null;

        // header: logo, judul + status engine, tombol power, tutup
        LinearLayout head = new LinearLayout(act);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(16), dp(12), dp(12), dp(12));
        if (logoFull != null) {
            android.widget.ImageView mk = new android.widget.ImageView(act);
            mk.setImageBitmap(logoFull);
            mk.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
            mk.setClipToOutline(true);
            mk.setOutlineProvider(new android.view.ViewOutlineProvider() {
                public void getOutline(View v, android.graphics.Outline o) { o.setRoundRect(0, 0, v.getWidth(), v.getHeight(), dp(9)); }
            });
            LinearLayout.LayoutParams mp = new LinearLayout.LayoutParams(dp(32), dp(32));
            mp.rightMargin = dp(12);
            head.addView(mk, mp);
        }
        LinearLayout titles = new LinearLayout(act);
        titles.setOrientation(LinearLayout.VERTICAL);
        TextView title = tv("RYEENZYXNZ", 15, TEXT, true);
        title.setTypeface(fTitle);
        title.setLetterSpacing(0.04f);
        titles.addView(title);
        statusTv = tv("Shader Engine v0.7.0", 11, SUB, false);
        statusTv.setTypeface(fMono);
        statusTv.setSingleLine(true);
        statusDot = dotDrawable(MUTED);
        statusTv.setCompoundDrawables(statusDot, null, null, null);
        statusTv.setCompoundDrawablePadding(dp(6));
        titles.addView(statusTv);
        head.addView(titles, new LinearLayout.LayoutParams(0, -2, 1f));

        pill = new LinearLayout(act);
        pill.setOrientation(LinearLayout.HORIZONTAL);
        pill.setGravity(Gravity.CENTER_VERTICAL);
        pill.setPadding(dp(8), dp(8), dp(14), dp(8));
        pillBg = rr(ROW, 20);
        pillBg.setStroke(dp(1), HAIR);
        pill.setBackground(pillBg);
        pwrBg = new GradientDrawable();
        pwrBg.setShape(GradientDrawable.OVAL);
        pwrBg.setColor(OFF);
        pwrIv = new android.widget.ImageView(act);
        pwrIv.setBackground(pwrBg);
        pwrIv.setScaleType(android.widget.ImageView.ScaleType.CENTER);
        pwrIv.setImageDrawable(new RzIcons(RzIcons.POWER, dp(14), SUB));
        pill.addView(pwrIv, new LinearLayout.LayoutParams(dp(22), dp(22)));
        pillLbl = tv("OFF", 12, SUB, true);
        LinearLayout.LayoutParams plp = new LinearLayout.LayoutParams(-2, -2);
        plp.leftMargin = dp(8);
        pill.addView(pillLbl, plp);
        press(pill);
        pill.setClickable(true);
        pill.setOnClickListener(v -> {
            if (!st.on("enabled") && !licOk) { notify("Lisensi belum aktif. Masukkan key di tab CREDIT.", false); return; }
            int next = st.on("enabled") ? 0 : 1;
            st.set("enabled", next); st.set("master", next); refreshAll(); changed();
        });
        pillCol = OFF;
        refreshers.add(() -> {
            boolean on = st.on("enabled");
            pillLbl.setText(on ? "ON" : "OFF");
            pillLbl.setTextColor(on ? TEXT : SUB);
            pillBg.setStroke(dp(1), on ? ((accent & 0x00FFFFFF) | 0x8C000000) : HAIR);
            int to = on ? accent : OFF;
            tint(pwrBg, pillCol, to);
            pillCol = to;
            ((RzIcons) pwrIv.getDrawable()).setColor(on ? DARK : SUB);
        });
        head.addView(pill, new LinearLayout.LayoutParams(-2, -2));
        TextView close = tv("×", 20, SUB, true);
        close.setGravity(Gravity.CENTER);
        close.setBackground(rr(ROW, 9));
        press(close);
        close.setOnClickListener(v -> setOpen(false));
        LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(dp(32), dp(32));
        cp.leftMargin = dp(8);
        head.addView(close, cp);
        panel.addView(head, new LinearLayout.LayoutParams(-1, -2));
        drag(titles, panel, null);

        LinearLayout main = new LinearLayout(act);
        main.setOrientation(LinearLayout.HORIZONTAL);
        main.setPadding(dp(12), 0, dp(12), dp(12));
        main.setClipChildren(false);
        panel.addView(main, new LinearLayout.LayoutParams(-1, 0, 1f));

        // kolom kiri: pratinjau live, FPS, kualitas
        LinearLayout left = new LinearLayout(act);
        left.setOrientation(LinearLayout.VERTICAL);
        left.setClipChildren(false);
        main.addView(left, new LinearLayout.LayoutParams(dp(248), -1));
        FrameLayout sf = new FrameLayout(act);
        GradientDrawable sbg = rr(0xFF000000, 14);
        sbg.setStroke(dp(1), HAIR);
        sf.setBackground(sbg);
        sf.setClipToOutline(true);
        elev(sf, 6, 0xFF000000);
        scene = new RzScene(act, st);
        sf.addView(scene, new FrameLayout.LayoutParams(-1, -2));
        sceneTag = tv("shader aktif", 10, 0xFFD7D7DA, false);
        sceneTag.setTypeface(fMono);
        sceneTag.setCompoundDrawablePadding(dp(6));
        sceneTag.setPadding(dp(8), dp(4), dp(8), dp(4));
        sceneTag.setBackground(rr(0xAA000000, 6));
        FrameLayout.LayoutParams stp = new FrameLayout.LayoutParams(-2, -2, Gravity.TOP | Gravity.LEFT);
        stp.leftMargin = dp(8); stp.topMargin = dp(8);
        sf.addView(sceneTag, stp);
        final Runnable tagUpd = () -> {
            boolean on = st.on("enabled") && !scene.raw;
            sceneTag.setText(on ? "shader aktif" : "tanpa shader");
            sceneTag.setCompoundDrawables(dotDrawable(on ? OK : 0xFFD9774A), null, null, null);
        };
        refreshers.add(() -> { tagUpd.run(); scene.invalidate(); });
        scene.setOnTouchListener((v, e) -> {
            if (scene.gifMode()) return false;   // GIF tidak punya versi "tanpa shader"
            int a = e.getActionMasked();
            if (a == MotionEvent.ACTION_DOWN) { scene.raw = true; tagUpd.run(); scene.invalidate(); }
            else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) { scene.raw = false; tagUpd.run(); scene.invalidate(); }
            return true;
        });
        left.addView(sf, new LinearLayout.LayoutParams(-1, -2));

        LinearLayout fc = new LinearLayout(act);
        fc.setOrientation(LinearLayout.HORIZONTAL);
        fc.setGravity(Gravity.CENTER_VERTICAL);
        fc.setPadding(dp(12), dp(6), dp(12), dp(6));
        fc.setBackground(glassSurface(12));
        elev(fc, 3, 0xFF000000);
        LinearLayout ft = new LinearLayout(act);
        ft.setOrientation(LinearLayout.VERTICAL);
        ft.addView(tv("Frame rate", 11, SUB, false));
        fpsTv = tv("--", 20, TEXT, false);
        fpsTv.setTypeface(fMono);
        ft.addView(fpsTv);
        fc.addView(ft, new LinearLayout.LayoutParams(0, -2, 1f));
        spark = new RzSpark(act, accent, dp(1.5f));
        fc.addView(spark, new LinearLayout.LayoutParams(dp(80), dp(30)));
        left.addView(fc, lp(-1, -2, 8));
        qualityRow(left, false);

        // kolom kanan: halaman, detail yang meluncur, dock tab
        rightFrame = new FrameLayout(act);
        LinearLayout.LayoutParams rp = new LinearLayout.LayoutParams(0, -1, 1f);
        rp.leftMargin = dp(12);
        main.addView(rightFrame, rp);

        buildMainPage();
        buildPresetPage();
        builtDev = RzLicense.isDev(dir);
        if (builtDev) buildEffectPage();
        buildSettingPage();
        buildFeedbackPage();
        buildCreditPage();

        for (String name : pages.keySet()) rightFrame.addView(pages.get(name), new FrameLayout.LayoutParams(-1, -1));
        for (View d : details) rightFrame.addView(d, new FrameLayout.LayoutParams(-1, -1));

        buildTabs(left);

        toast = tv("", 12, TEXT, true);
        toast.setGravity(Gravity.CENTER);
        GradientDrawable tbg = rr(glass() ? 0xF21C1C26 : 0xFF202023, 10);
        tbg.setStroke(dp(1), STROKE);
        toast.setBackground(tbg);
        toast.setPadding(dp(16), dp(8), dp(16), dp(8));
        toast.setElevation(dp(16));
        toast.setVisibility(View.GONE);
        FrameLayout.LayoutParams tl = new FrameLayout.LayoutParams(-2, -2, Gravity.TOP | Gravity.CENTER_HORIZONTAL);
        tl.topMargin = dp(4);
        rightFrame.addView(toast, tl);
        showTab(curTab);
    }

    // ------------------------------------------------------------------ tab PRESET
    private void buildPresetPage() {
        LinearLayout p = page("PRESET");
        section(p, "Preset bawaan");
        if (presets.isEmpty()) {
            note(p, "Preset belum termuat. Pastikan lisensi aktif dan koneksi internet tersedia, lalu buka panel ini lagi.");
        } else {
            List<String> names = new ArrayList<>();
            for (RzPresets.Preset x : presets) names.add(x.name);
            chips(p, names, i -> applyPreset(presets.get(i).name, presets.get(i).values));
        }
        section(p, "Preset tersimpan");
        note(p, store.usingPublic
            ? "Preset disimpan di folder RYEENZYXNZ dan tetap ada setelah Roblox dipasang ulang."
            : "Preset disimpan di data Roblox dan akan terhapus jika Roblox di-uninstall. Akses folder publik tidak tersedia.");
        savedList = new LinearLayout(act);
        savedList.setOrientation(LinearLayout.VERTICAL);
        p.addView(savedList, lp(-1, -2, 0));
        rebuildSaved();
        section(p, "Tambah preset baru");
        nameBox = new EditText(act);
        nameBox.setHint("Nama preset");
        nameBox.setHintTextColor(SUB);
        nameBox.setTextColor(TEXT);
        nameBox.setTypeface(fBody);
        nameBox.setSingleLine(true);
        nameBox.setTextSize(TypedValue.COMPLEX_UNIT_PX, 15 * auto * density);
        nameBox.setBackground(rr(ROW, 8));
        nameBox.setPadding(dp(12), dp(10), dp(12), dp(10));
        p.addView(nameBox, lp(-1, -2, 6));
        button(p, "SAVE  ·  simpan pengaturan sekarang", this::saveCurrent, true, RzIcons.SAVE);
        button(p, "IMPORT  ·  buka dari file", this::importFile, false, RzIcons.IMPORT);
        button(p, "EXPORT  ·  simpan ke file", this::exportFile, false, RzIcons.EXPORT);
        note(p, "Preset menyimpan semua pengaturan di tab MAIN. File ekspor berformat .rzp dan dapat dibagikan.");

        LinearLayout adv = group(p, "Impor dari teks", null);
        button(adv, "Tempel dari clipboard", () -> {
            try {
                ClipboardManager cm = (ClipboardManager) act.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData d = cm.getPrimaryClip();
                String t = (d != null && d.getItemCount() > 0) ? d.getItemAt(0).coerceToText(act).toString() : "";
                if (t.trim().isEmpty()) notify("Clipboard kosong. Salin preset terlebih dahulu", false);
                else importAny(t);
            } catch (Throwable e) { notify("Clipboard tidak bisa dibaca", false); }
        }, true);
        final EditText box = new EditText(act);
        box.setHint("...atau tempel isi preset di sini");
        box.setHintTextColor(SUB);
        box.setTextColor(TEXT);
        box.setTextSize(TypedValue.COMPLEX_UNIT_PX, 11 * auto * density);
        box.setTypeface(Typeface.MONOSPACE);
        box.setBackground(rr(ROW, 8));
        box.setPadding(dp(10), dp(8), dp(10), dp(8));
        box.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        box.setMinLines(4);
        box.setGravity(Gravity.TOP);
        adv.addView(box, lp(-1, -2, 6));
        button(adv, "Terapkan teks di atas", () -> importAny(box.getText().toString()), false);
        section(adv, "Hasil impor");
        reportTv = tv("Belum ada impor.", 12, SUB, false);
        reportTv.setBackground(rr(0xFF121212, 10));
        reportTv.setPadding(dp(12), dp(8), dp(12), dp(8));
        adv.addView(reportTv, lp(-1, -2, 0));
    }

    private void importAny(String t) {
        if (RzPresetStore.recognizes(t)) {
            String n = presetNameOf(t);
            if (n.isEmpty()) n = "Impor";
            if (applyText(n, t)) { store.save(n, t); selPreset = n; rebuildSaved(); }
        } else importText("Preset impor", t);
    }

    // ------------------------------------------------------------------ tab SETTING
    private void buildSettingPage() {
        LinearLayout g = page("SETTING");
        section(g, "Tema panel");
        List<String> th = new ArrayList<>();
        for (int i = 0; i < RzUi.THEME_NAMES.length; i++) th.add((i == ui.theme ? "● " : "") + RzUi.THEME_NAMES[i]);
        chips(g, th, i -> { ui.theme = i; ui.save(); rebuild("SETTING"); });
        section(g, "Tampilan panel");
        fxSlider(g, "Transparansi panel", 0.5f, 1f, true, new float[] { ui.opacity }, v -> { ui.opacity = v; panel.setAlpha(v); ui.save(); });
        fxSlider(g, "Ukuran panel", 0.65f, 1.05f, true, new float[] { ui.scale }, v -> { ui.scale = v; sizePanel(); ui.save(); });
        fxSlider(g, "Ukuran tombol RZ", 40f, 80f, false, new float[] { ui.fabSize }, v -> { ui.fabSize = v; sizePanel(); ui.save(); });
        fxSlider(g, "Transparansi tombol RZ", 0.3f, 1f, true, new float[] { ui.fabOpacity }, v -> { ui.fabOpacity = v; fab.setAlpha(v); ui.save(); });
        section(g, "Font");
        List<String> fn = new ArrayList<>();
        for (int i = 0; i < RzUi.FONT_NAMES.length; i++) fn.add((i == ui.font ? "● " : "") + RzUi.FONT_NAMES[i]);
        chips(g, fn, i -> { ui.font = i; ui.save(); rebuild("SETTING"); });
        section(g, "Warna aksen");
        swatches(g, RzUi.ACCENTS, ui.accent, i -> { if (i == ui.accent) return; ui.accent = i; ui.save(); rebuild("SETTING"); });
        button(g, "Posisi tombol RZ kembali ke awal", () -> { fab.setX(dp(14)); fab.setY(Math.min(dp(110), root.getHeight() - dp(70))); notify("Posisi tombol dikembalikan", true); }, false);
        button(g, "Reset tampilan", () -> { ui.reset(); ui.save(); rebuild("SETTING"); }, false, RzIcons.RESET);
        note(g, "Tampilan menyesuaikan ukuran layar. Ketuk tombol RZ untuk membuka atau menutup panel. Geser tombol atau judul panel untuk memindahkannya.");
    }

    /** Mesin, Data, Developer: tersembunyi; dibuka dengan mengetuk judul di tab CREDIT 7 kali. */
    private void buildHiddenInto(LinearLayout p) {
        section(p, "Mesin");
        toggle(p, "Paksa OpenGL ES (perlu sebelum renderer dimuat)", "force_gles");
        toggle(p, "Depth Pipeline (SSR, MXAO, DOF, Outline, efek FX)", "depth_pipe");
        toggle(p, "Izinkan versi Roblox lain", "allow_any_build");
        section(p, "Data");
        button(p, "Reset semua ke default", () -> {
            boolean en = st.on("enabled");
            st.resetAll(); st.set("enabled", en ? 1 : 0);
            curPreset = "-"; refreshAll(); changed(); notify("Pengaturan direset", true);
        }, false);
        section(p, "Developer");
        buildDevInto(p);
    }

    // ------------------------------------------------------------------ tab FEEDBACK
    private String fbCat = "Bug";
    private boolean fbDiag = true;

    private void buildFeedbackPage() {
        LinearLayout p = page("FEEDBACK");
        final String url = RzReport.endpoint(act);
        note(p, "Sampaikan bug atau saran. Laporan dikirim langsung ke developer.");
        section(p, "Jenis laporan");
        final TextView sel = tv("Dipilih: " + fbCat, 13, accent, true);
        List<String> cats = new ArrayList<>();
        cats.add("Bug"); cats.add("Saran"); cats.add("Lainnya");
        chips(p, cats, i -> { fbCat = i == 0 ? "Bug" : i == 1 ? "Saran" : "Lainnya"; sel.setText("Dipilih: " + fbCat); });
        p.addView(sel, lp(-2, -2, 6));
        section(p, "Pesan");
        final EditText msg = new EditText(act);
        msg.setHint("Jelaskan masalahnya: apa yang terjadi, di layar/grafik apa, efek mana");
        msg.setHintTextColor(SUB);
        msg.setTextColor(TEXT);
        msg.setTypeface(fBody);
        msg.setTextSize(TypedValue.COMPLEX_UNIT_PX, 14 * auto * density);
        msg.setBackground(rr(ROW, 8));
        msg.setPadding(dp(12), dp(10), dp(12), dp(10));
        msg.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        msg.setFilters(new android.text.InputFilter[] { new android.text.InputFilter.LengthFilter(1000) });
        msg.setMinLines(5);
        msg.setGravity(Gravity.TOP);
        p.addView(msg, lp(-1, -2, 6));
        section(p, "Kontak (opsional)");
        final EditText contact = new EditText(act);
        contact.setHint("Username Discord / WhatsApp, kalau mau dibalas");
        contact.setHintTextColor(SUB);
        contact.setTextColor(TEXT);
        contact.setTypeface(fBody);
        contact.setSingleLine(true);
        contact.setTextSize(TypedValue.COMPLEX_UNIT_PX, 14 * auto * density);
        contact.setBackground(rr(ROW, 8));
        contact.setPadding(dp(12), dp(10), dp(12), dp(10));
        contact.setFilters(new android.text.InputFilter[] { new android.text.InputFilter.LengthFilter(80) });
        p.addView(contact, lp(-1, -2, 6));
        final Switch sw = new Switch(act);
        sw.setText("Sertakan info perangkat dan status engine");
        sw.setTextColor(TEXT);
        sw.setTypeface(fBody);
        sw.setTextSize(TypedValue.COMPLEX_UNIT_PX, 14 * auto * density);
        sw.setBackground(rr(ROW, 8));
        sw.setPadding(dp(12), dp(10), dp(12), dp(10));
        int[][] states = { { android.R.attr.state_checked }, {} };
        sw.setThumbTintList(new ColorStateList(states, new int[] { DARK, 0xFF8E9196 }));
        sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
        sw.setChecked(fbDiag);
        sw.setOnCheckedChangeListener((b, on) -> fbDiag = on);
        p.addView(sw, lp(-1, -2, 6));
        note(p, "Data yang dikirim: pesan, kontak, model perangkat, versi Android, dan status engine (opsional). Tidak ada data akun Roblox.");
        final TextView[] btn = new TextView[1];
        btn[0] = button(p, "KIRIM LAPORAN", () -> {
            if (url.isEmpty()) { notify("Pengiriman belum dikonfigurasi", false); return; }
            final String m = msg.getText().toString().trim();
            if (m.length() < 10) { notify("Pesan terlalu pendek (minimal 10 karakter)", false); return; }
            long w = RzReport.waitMs(dir);
            if (w > 0) { notify("Tunggu " + (w / 1000 + 1) + " detik lagi", false); return; }
            btn[0].setEnabled(false);
            btn[0].setText("Mengirim...");
            RzReport.send(act, dir, url, fbCat, m, contact.getText().toString().trim(), fbDiag ? lastStatus : "", (ok, text) -> {
                btn[0].setEnabled(true);
                btn[0].setText("KIRIM LAPORAN");
                if (ok) msg.setText("");
                notify(text, ok);
            });
        }, true, RzIcons.SEND);
        if (url.isEmpty()) note(p, "Alamat penerima laporan belum dikonfigurasi.");
    }

    // ------------------------------------------------------------------ tab CREDIT
    private void buildCreditPage() {
        LinearLayout p = page("CREDIT");
        LinearLayout c = new LinearLayout(act);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setGravity(Gravity.CENTER_HORIZONTAL);
        GradientDrawable cg = rr(CARD, 14);
        cg.setStroke(dp(1), HAIR);
        c.setBackground(cg);
        c.setPadding(dp(16), dp(24), dp(16), dp(24));
        if (logoFull != null) {
            android.widget.ImageView iv = new android.widget.ImageView(act);
            iv.setImageBitmap(logoFull);
            iv.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
            iv.setClipToOutline(true);
            iv.setOutlineProvider(new android.view.ViewOutlineProvider() {
                public void getOutline(View v, android.graphics.Outline o) { o.setRoundRect(0, 0, v.getWidth(), v.getHeight(), dp(22)); }
            });
            LinearLayout.LayoutParams ip = new LinearLayout.LayoutParams(dp(96), dp(96));
            ip.bottomMargin = dp(14);
            c.addView(iv, ip);
        }
        TextView t = tv("RYEENZYXNZ", 22, TEXT, true);
        t.setTypeface(fTitle);
        t.setLetterSpacing(0.04f);
        t.setGravity(Gravity.CENTER);
        c.addView(t, lp(-2, -2, 0));
        TextView a = tv("Developed by RYEENZYXNZ", 15, TEXT, true);
        a.setGravity(Gravity.CENTER);
        c.addView(a, lp(-2, -2, 16));
        TextView b = tv("Team: #KNTL — Knights of Network Technology Labs", 14, SUB, false);
        b.setGravity(Gravity.CENTER);
        c.addView(b, lp(-1, -2, 8));
        TextView d = tv("Experimental Graphics Project", 13, SUB, false);
        d.setGravity(Gravity.CENTER);
        c.addView(d, lp(-1, -2, 18));
        TextView e = tv("© 2026", 13, SUB, false);
        e.setGravity(Gravity.CENTER);
        c.addView(e, lp(-1, -2, 2));
        TextView x = tv("Shader ini masih dalam tahap eksperimental. Beberapa efek bisa berubah, tidak stabil, atau tidak jalan di semua perangkat.", 12, SUB, false);
        x.setGravity(Gravity.CENTER);
        x.setPadding(dp(8), dp(14), dp(8), 0);
        c.addView(x, lp(-1, -2, 14));
        final LinearLayout hidden = new LinearLayout(act);
        hidden.setOrientation(LinearLayout.VERTICAL);
        hidden.setVisibility(View.GONE);
        buildHiddenInto(hidden);
        final int[] taps = { 0 };
        t.setOnClickListener(v -> {
            if (++taps[0] >= 7) {
                taps[0] = 0;
                if (!RzLicense.isDev(dir)) return; // bukan device developer -> ketuk 7x tidak ngapa-ngapain
                boolean show = hidden.getVisibility() != View.VISIBLE;
                hidden.setVisibility(show ? View.VISIBLE : View.GONE);
                notify(show ? "Menu developer dibuka" : "Menu developer ditutup", true);
            }
        });
        p.addView(c, lp(-1, -2, 10));
        p.addView(buildLicenseCard(), lp(-1, -2, 10));
        p.addView(hidden, lp(-1, -2, 8));
    }

    private LinearLayout buildLicenseCard() {
        final LinearLayout c = new LinearLayout(act);
        c.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable cg = rr(CARD, 14);
        cg.setStroke(dp(1), HAIR);
        c.setBackground(cg);
        c.setPadding(dp(16), dp(16), dp(16), dp(16));
        TextView title = tv("Lisensi", 14, TEXT, true);
        c.addView(title, lp(-2, -2, 0));
        final TextView status = tv("", 12, SUB, false);
        status.setPadding(0, dp(4), 0, 0);
        c.addView(status, lp(-1, -2, 0));
        // Key-nya sengaja TIDAK ditampilkan di UI (nggak ada kotak, nggak ada tombol VERIFIKASI) —
        // semua otomatis di background (lihat refreshLicense()/fetchPresetsIfNeeded() di attach()).
        Runnable refresh = () -> {
            RzLicense.Info info = RzLicense.read(dir);
            if (info.key.isEmpty()) status.setText("Mengaktifkan lisensi...");
            else if (licOk) status.setText("Aktif" + (info.exp > 0 ? (" · berlaku sampai " + android.text.format.DateFormat.format("d MMM yyyy", info.exp)) : "") );
            else status.setText(info.note == null || info.note.isEmpty() ? "Tidak aktif" : info.note);
            status.setTextColor(licOk ? OK : (info.key.isEmpty() ? SUB : BAD));
        };
        refresh.run();
        refreshers.add(refresh);
        return c;
    }

    // ------------------------------------------------------------------ tab EFFECT (ReShade FX)
    private TextView fxStatus, fxCount;

    private void buildEffectPage() {
        LinearLayout p = page("EFFECT");
        section(p, "Prasyarat");
        note(p, "Efek berjalan melalui Depth Pipeline. Menyalakan satu efek akan mengaktifkan Shader secara otomatis.");
        toggle(p, "ON/OFF Shader", "master");
        section(p, "Status");
        fxCount = tv("", 12, TEXT, true);
        fxCount.setPadding(dp(4), dp(2), dp(4), 0);
        p.addView(fxCount, lp(-1, -2, 0));
        fxStatus = tv("Menunggu engine...", 11, SUB, false);
        fxStatus.setPadding(dp(4), dp(2), dp(4), dp(4));
        p.addView(fxStatus, lp(-1, -2, 0));
        button(p, "Matikan semua efek", () -> {
            for (RzFx.Fx f : fx.effects) if (fx.isOn(f)) fx.setOn(f, false);
            rebuildFxList(); updateFxCount(); changed(); notify("Semua efek dimatikan", true);
        }, false);
        section(p, "Daftar efek");
        buildFxInto(p);
        updateFxCount();
    }

    private void updateFxCount() {
        if (fxCount != null) fxCount.setText("Efek aktif: " + fx.enabledCount() + " dari " + fx.effects.size());
    }

    /** Efek hanya jalan bila Depth Pipeline + master ON; nyalakan keduanya saat pengguna mengaktifkan sebuah efek. */
    private void fxEnsureRunning() {
        boolean ch = false;
        if (!st.on("depth_pipe")) { st.set("depth_pipe", 1); ch = true; }
        if (!st.on("master")) {
            if (!licOk) notify("Lisensi belum aktif. Buka tab CREDIT untuk mengaktifkan.", false);
            else { st.set("master", 1); st.set("enabled", 1); ch = true; }
        }
        if (ch) { refreshAll(); notify("Shader diaktifkan otomatis untuk efek ini", true); }
    }

    private void buildFxInto(LinearLayout p) {
        if (!fxLoaded) {
            note(p, "Daftar efek tidak ditemukan. Patch ulang menggunakan versi terbaru.");
            return;
        }
        note(p, "Nyalakan saklar untuk mengaktifkan efek. Ketuk nama efek untuk mengatur parameter.");
        final EditText q = new EditText(act);
        q.setHint("cari efek...");
        q.setHintTextColor(SUB);
        q.setTextColor(TEXT);
        q.setSingleLine(true);
        q.setTextSize(TypedValue.COMPLEX_UNIT_PX, 13 * auto * density);
        q.setBackground(rr(ROW, 8));
        q.setPadding(dp(10), dp(8), dp(10), dp(8));
        q.addTextChangedListener(new android.text.TextWatcher() {
            public void beforeTextChanged(CharSequence c, int a, int b, int d) { }
            public void onTextChanged(CharSequence c, int a, int b, int d) { fxQuery = c.toString().trim().toLowerCase(Locale.US); rebuildFxList(); }
            public void afterTextChanged(android.text.Editable e) { }
        });
        p.addView(q, lp(-1, -2, 6));
        List<String> modes = new ArrayList<>();
        modes.add("Semua efek");
        modes.add("Hanya yang aktif");
        chips(p, modes, i -> { fxOnlyOn = i == 1; rebuildFxList(); });
        fxList = new LinearLayout(act);
        fxList.setOrientation(LinearLayout.VERTICAL);
        p.addView(fxList, lp(-1, -2, 4));
        rebuildFxList();
    }

    private void rebuildFxList() {
        if (fxList == null) return;
        fxList.removeAllViews();
        int shown = 0;
        for (final RzFx.Fx f : fx.effects) {
            if (fxOnlyOn && !fx.isOn(f)) continue;
            if (!fxQuery.isEmpty() && !(f.id.toLowerCase(Locale.US).contains(fxQuery) || f.label.toLowerCase(Locale.US).contains(fxQuery))) continue;
            if (++shown > 120) break;
            fxList.addView(fxRow(f), lp(-1, -2, 6));
        }
        if (shown == 0) fxList.addView(tv("Tidak ada efek yang cocok.", 12, SUB, false), lp(-1, -2, 6));
    }

    private View fxRow(final RzFx.Fx f) {
        final LinearLayout box = new LinearLayout(act);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackground(rr(ROW, 8));
        LinearLayout head = new LinearLayout(act);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(12), dp(8), dp(8), dp(8));
        final TextView name = tv("▸ " + f.label + (f.label.equals(f.id) ? "" : "  (" + f.id + ")"), 13, TEXT, false);
        head.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        final Switch sw = new Switch(act);
        int[][] states = { { android.R.attr.state_checked }, {} };
        sw.setThumbTintList(new ColorStateList(states, new int[] { DARK, 0xFF8E9196 }));
        sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
        sw.setChecked(fx.isOn(f));
        sw.setOnCheckedChangeListener((b, on) -> { fx.setOn(f, on); if (on) fxEnsureRunning(); updateFxCount(); changed(); });
        head.addView(sw, new LinearLayout.LayoutParams(-2, -2));
        box.addView(head, lp(-1, -2, 0));
        final LinearLayout body = new LinearLayout(act);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(8), 0, dp(8), dp(8));
        body.setVisibility(View.GONE);
        box.addView(body, lp(-1, -2, 0));
        final boolean[] built = { false };
        name.setOnClickListener(v -> {
            boolean open = body.getVisibility() != View.VISIBLE;
            if (open && !built[0]) { buildFxBody(body, f); built[0] = true; }
            body.setVisibility(open ? View.VISIBLE : View.GONE);
            name.setText((open ? "▾ " : "▸ ") + f.label + (f.label.equals(f.id) ? "" : "  (" + f.id + ")"));
        });
        return box;
    }

    private void buildFxBody(LinearLayout body, final RzFx.Fx f) {
        if (!f.tip.isEmpty()) body.addView(tv(f.tip, 11, SUB, false), lp(-1, -2, 2));
        String lastCat = null;
        int n = 0;
        for (final RzFx.U u : f.uniforms) {
            if (u.type.equals("none")) continue;
            if (!u.cat.equals(lastCat == null ? "" : lastCat) || lastCat == null && !u.cat.isEmpty()) {
                if (!u.cat.isEmpty()) section(body, u.cat);
                lastCat = u.cat;
            }
            fxControl(body, f, u);
            n++;
        }
        if (n == 0) body.addView(tv("Efek ini tidak punya parameter.", 11, SUB, false), lp(-1, -2, 4));
        button(body, "Kembalikan ke bawaan", () -> {
            fx.reset(f); body.removeAllViews(); buildFxBody(body, f); changed();
        }, false);
    }

    private void fxControl(LinearLayout body, final RzFx.Fx f, final RzFx.U u) {
        if (u.isBool || "checkbox".equals(u.type)) {
            final Switch sw = new Switch(act);
            sw.setText(u.label);
            sw.setTextColor(TEXT);
            sw.setTextSize(TypedValue.COMPLEX_UNIT_PX, 12 * auto * density);
            sw.setPadding(dp(8), dp(6), dp(8), dp(6));
            int[][] states = { { android.R.attr.state_checked }, {} };
            sw.setThumbTintList(new ColorStateList(states, new int[] { DARK, 0xFF8E9196 }));
            sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
            sw.setChecked(fx.get(f, u)[0] >= 0.5f);
            sw.setOnCheckedChangeListener((b, on) -> { fx.set(f, u, new float[] { on ? 1f : 0f }); changed(); });
            body.addView(sw, lp(-1, -2, 4));
            return;
        }
        if (u.isCombo()) {
            body.addView(tv(u.label, 12, TEXT, false), lp(-1, -2, 6));
            final List<TextView> opts = new ArrayList<>();
            LinearLayout rowL = new LinearLayout(act);
            rowL.setOrientation(LinearLayout.VERTICAL);
            for (int i = 0; i < u.items.size(); i++) {
                final int idx = i;
                final TextView o = tv(u.items.get(i), 12, TEXT, true);
                o.setPadding(dp(10), dp(7), dp(10), dp(7));
                o.setOnClickListener(v -> {
                    fx.set(f, u, new float[] { idx });
                    for (int k = 0; k < opts.size(); k++) opts.get(k).setBackground(rr(k == idx ? 0xFF3A3A3D : ROWHI, 8));
                    changed();
                });
                opts.add(o);
                rowL.addView(o, lp(-1, -2, 3));
            }
            int cur = Math.round(fx.get(f, u)[0]);
            for (int k = 0; k < opts.size(); k++) opts.get(k).setBackground(rr(k == cur ? 0xFF3A3A3D : ROWHI, 8));
            body.addView(rowL, lp(-1, -2, 0));
            return;
        }
        String[] comp = u.isColor() ? new String[] { " R", " G", " B", " A" } : new String[] { " x", " y", " z", " w" };
        for (int c = 0; c < u.n && c < 4; c++) {
            final int ci = c;
            final float lo = u.isColor() ? 0f : u.lo(), hi = u.isColor() ? 1f : u.hi();
            String label = u.label + (u.n > 1 ? comp[c] : "");
            fxSlider(body, label, lo, hi, u.isFloat, new float[] { fx.get(f, u)[c] }, v -> {
                float[] cur = fx.get(f, u).clone();
                cur[ci] = v;
                fx.set(f, u, cur);
                changed();
            });
        }
    }

    private interface FloatSet { void on(float v); }

    private void fxSlider(LinearLayout p, String label, final float lo, final float hi, final boolean isFloat, float[] init, final FloatSet set) {
        LinearLayout box = new LinearLayout(act);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(8), dp(4), dp(8), dp(2));
        LinearLayout top = new LinearLayout(act);
        top.setOrientation(LinearLayout.HORIZONTAL);
        TextView name = tv(label, 12, TEXT, false);
        final TextView val = tv("", 12, accent, true);
        top.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        top.addView(val, new LinearLayout.LayoutParams(-2, -2));
        box.addView(top, lp(-1, -2, 0));
        final SeekBar sb = new SeekBar(act);
        sb.setMax(1000);
        sb.setProgressTintList(ColorStateList.valueOf(accent));
        sb.setThumbTintList(ColorStateList.valueOf(Color.WHITE));
        sb.setProgressBackgroundTintList(ColorStateList.valueOf(OFF));
        final float span = hi - lo <= 0f ? 1f : hi - lo;
        float cur0 = Math.max(lo, Math.min(hi, init[0]));
        sb.setProgress(Math.round((cur0 - lo) / span * 1000f));
        val.setText(isFloat ? String.format(Locale.US, "%.3f", cur0) : String.format(Locale.US, "%d", Math.round(cur0)));
        sb.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int prog, boolean fromUser) {
                if (!fromUser) return;
                float v = lo + span * prog / 1000f;
                if (!isFloat) v = Math.round(v);
                val.setText(isFloat ? String.format(Locale.US, "%.3f", v) : String.format(Locale.US, "%d", Math.round(v)));
                set.on(v);
            }
            public void onStartTrackingTouch(SeekBar s) { }
            public void onStopTrackingTouch(SeekBar s) { }
        });
        box.addView(sb, lp(-1, -2, 1));
        p.addView(box, lp(-1, -2, 2));
    }
    // ------------------------------------------------------------------ tab MAIN
    private void na(LinearLayout p, String label, String why) {
        LinearLayout row = new LinearLayout(act);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setBackground(rr(0xFF121212, 10));
        row.setPadding(dp(12), dp(8), dp(12), dp(8));
        TextView a = tv(label, 12, 0xFF6E6E73, false);
        TextView b = tv(why, 10, 0xFF6E6E73, false);
        b.setGravity(Gravity.END);
        row.addView(a, new LinearLayout.LayoutParams(0, -2, 1f));
        row.addView(b, new LinearLayout.LayoutParams(0, -2, 1f));
        p.addView(row, lp(-1, -2, 4));
    }

    private void note(LinearLayout p, String text) {
        TextView n = tv(text, 11, SUB, false);
        n.setPadding(dp(4), dp(4), dp(4), dp(2));
        p.addView(n, lp(-1, -2, 0));
    }

    private static final String[] MAIN_KEYS = {
        "bloom", "highlight", "exposure", "contrast", "gamma", "levels_white",
        "hl_comp", "shadow_strength", "fog_on", "fog_intensity", "fog_density", "fog_start", "fog_opacity", "fog_temp",
        "fog_sat", "fog_bright", "rim_on", "rim_intensity", "rim_r", "rim_g", "rim_b", "rim_rgb", "rim_speed", "rim_width",
        "rim_sharp", "rim_power", "rim_bias", "rim_light", "rim_spread", "rim_fade", "ao", "ao_radius", "ao_detail",
        "fog_end", "fog_r", "fog_g", "fog_b", "fog_cmix", "fog_height", "fog_hfall", "fog_dfall", "fog_smooth", "fog_scatter",
        "fog_sky", "fog_adapt", "fog_cam", "rim_soft", "rim_edge", "rim_mat", "refl_rough", "refl_fade", "refl_dist",
        "perf_fps", "perf_batt", "perf_therm", "auto_perf", "fps_target", "perf_ssr", "perf_hdr", "perf_fog", "perf_rim", "perf_ao",
        "hdr_on", "quality",
        "mx_on", "mx_int", "mx_rad", "mx_samples", "mx_rays", "mx_dark", "mx_soft", "mx_fine", "mx_coarse", "mx_nbias", "mx_dbias", "mx_edge", "mx_blur", "mx_denoise", "mx_temp", "mx_res", "mx_qual", "ss_on", "ss_int", "ss_steps", "ss_dist", "ss_thick", "ss_fade", "ss_edge", "ss_floor", "ss_blur", "ss_temp", "ss_res", "ss_qual", "df_on", "df_int", "df_focus", "df_range", "df_near", "df_far", "df_rad", "df_bokeh", "df_shape", "df_samples", "df_aper", "df_focal", "df_trans", "df_fg", "df_bg", "df_auto", "df_smooth", "ol_on", "ol_str", "ol_thick", "ol_sens", "ol_soft", "ol_blend", "ol_start", "ol_end", "ol_sky", "ol_r", "ol_g", "ol_b", "ol_debug", "perf_dof"
    };

    private void qualityRow(LinearLayout p, boolean label) {
        final String[] names = { "Low", "Medium", "High", "Ultra" };
        if (label) {
            TextView ql = tv("Shader Quality", 13, TEXT, false);
            ql.setPadding(dp(4), dp(12), 0, dp(4));
            p.addView(ql, lp(-1, -2, 0));
        }
        LinearLayout seg = new LinearLayout(act);
        seg.setOrientation(LinearLayout.HORIZONTAL);
        GradientDrawable sbg = rr(ROW, 10);
        sbg.setStroke(dp(1), HAIR);
        seg.setBackground(sbg);
        seg.setPadding(dp(4), dp(4), dp(4), dp(4));
        final TextView[] items = new TextView[4];
        for (int i = 0; i < 4; i++) {
            final int q = i;
            TextView t = tv(names[i], 12, SUB, true);
            t.setGravity(Gravity.CENTER);
            t.setSingleLine(true);
            t.setPadding(dp(2), dp(8), dp(2), dp(8));
            t.setOnClickListener(v -> { st.set("quality", q); changed(); refreshAll(); notify("Quality " + names[q], true); });
            press(t);
            seg.addView(t, new LinearLayout.LayoutParams(0, -2, 1f));
            items[i] = t;
        }
        refreshers.add(() -> {
            int cur = Math.round(st.get("quality"));
            for (int j = 0; j < 4; j++) {
                boolean on = j == cur;
                items[j].setBackground(on ? rr(ROWHI, 7) : null);
                items[j].setTextColor(on ? TEXT : SUB);
            }
        });
        p.addView(seg, lp(-1, -2, label ? 0 : 8));
    }

    private void buildMainPage() {
        LinearLayout root0 = page("MAIN");
        mainCol = root0;
        tileRow = null;
        LinearLayout p;

        p = detail("Global", "master", "strength", RzIcons.GLOBAL, true);
        toggle(p, "ON/OFF Shader", "master");
        slider(p, "Global Shader Intensity", "strength", "%.2f");
        toggle(p, "Mode LIVE: ubah shader Roblox langsung (ON/OFF real-time)", "live");
        note(p, "Low: hemat performa. Medium: tanpa rim dan fog tambahan. High: kualitas penuh. Ultra: pantulan lebih tajam.");
        toggle(p, "Battery Saver", "perf_batt");
        toggle(p, "Thermal Performance Mode", "perf_therm");
        button(p, "Reset Main Settings", () -> {
            for (String k : MAIN_KEYS) st.set(k, RzState.BY.get(k).def);
            curPreset = "-"; refreshAll(); changed(); notify("Pengaturan MAIN direset", true);
        }, false);
        button(p, "Restore Defaults", () -> {
            boolean en = st.on("enabled");
            st.resetAll(); st.set("enabled", en ? 1 : 0);
            curPreset = "-"; refreshAll(); changed(); notify("Pengaturan awal dipulihkan", true);
        }, false);

        section(root0, "Efek shader");
        p = detail("SSR", "ss_on", "ss_int", RzIcons.SSR, false);
        note(p, "Memantulkan objek dan avatar pada permukaan.");
        toggle(p, "Enable SSR", "ss_on");
        slider(p, "SSR Intensity", "ss_int", "%.2f");
        slider(p, "Reflection Quality", "ss_qual", "%.0f");
        slider(p, "Reflection Resolution", "ss_res", "%.2f");
        slider(p, "Reflection Thickness", "ss_thick", "%.2f");
        slider(p, "Ray Step Count", "ss_steps", "%.0f");
        slider(p, "Max Ray Distance", "ss_dist", "%.0f");
        slider(p, "SSR Fade (jarak)", "ss_fade", "%.2f");
        slider(p, "Edge Fade", "ss_edge", "%.2f");
        slider(p, "Hanya permukaan datar (lantai)", "ss_floor", "%.2f");
        slider(p, "Reflection Blur", "ss_blur", "%.2f");
        slider(p, "Temporal Stability", "ss_temp", "%.2f");

        p = detail("MXAO", "mx_on", "mx_int", RzIcons.AO, false);
        note(p, "AO Intensity, Radius, dan Detail mengatur SSAO bawaan Roblox. MXAO menambah oklusi berbasis kedalaman.");
        slider(p, "AO Intensity (SSAO bawaan)", "ao", "%.2f");
        slider(p, "AO Radius", "ao_radius", "%.2f");
        slider(p, "Detail Strength (sensitivitas depth)", "ao_detail", "%.2f");
        toggle(p, "Performance Mode (AO: radius dibatasi)", "perf_ao");
        toggle(p, "Enable MXAO", "mx_on");
        slider(p, "MXAO Intensity", "mx_int", "%.2f");
        slider(p, "MXAO Radius (stud)", "mx_rad", "%.2f");
        slider(p, "AO Quality", "mx_qual", "%.0f");
        slider(p, "AO Resolution", "mx_res", "%.2f");
        slider(p, "Sample Count", "mx_samples", "%.0f");
        slider(p, "Ray Count", "mx_rays", "%.0f");
        slider(p, "Shadow Darkness", "mx_dark", "%.2f");
        slider(p, "Shadow Softness", "mx_soft", "%.2f");
        slider(p, "Fine Occlusion", "mx_fine", "%.2f");
        slider(p, "Coarse Occlusion", "mx_coarse", "%.2f");
        slider(p, "Normal Bias", "mx_nbias", "%.3f");
        slider(p, "Depth Bias", "mx_dbias", "%.3f");
        slider(p, "Edge Correction", "mx_edge", "%.2f");
        slider(p, "Blur Strength", "mx_blur", "%.1f");
        slider(p, "Denoise", "mx_denoise", "%.2f");
        slider(p, "Temporal Stability", "mx_temp", "%.2f");

        p = detail("Depth of Field", "df_on", "df_int", RzIcons.DOF, false);
        note(p, "Mengaburkan area sesuai jaraknya dari fokus.");
        toggle(p, "Enable DOF", "df_on");
        slider(p, "DOF Intensity", "df_int", "%.2f");
        toggle(p, "Autofocus (titik tengah layar)", "df_auto");
        slider(p, "Focus Distance (stud)", "df_focus", "%.0f");
        slider(p, "Focus Range", "df_range", "%.0f");
        slider(p, "Focus Smoothing", "df_smooth", "%.2f");
        slider(p, "Near Blur Strength", "df_near", "%.2f");
        slider(p, "Far Blur Strength", "df_far", "%.2f");
        slider(p, "Foreground Blur", "df_fg", "%.2f");
        slider(p, "Background Blur", "df_bg", "%.2f");
        slider(p, "Blur Radius (px @1080p)", "df_rad", "%.0f");
        slider(p, "Depth Transition", "df_trans", "%.2f");
        slider(p, "Bokeh Intensity", "df_bokeh", "%.2f");
        slider(p, "Bokeh Shape (0 bulat,1 hexagon,2 bintang)", "df_shape", "%.0f");
        slider(p, "Bokeh Quality (jumlah sampel)", "df_samples", "%.0f");
        slider(p, "Aperture (f-stop)", "df_aper", "%.1f");
        slider(p, "Focal Length (mm)", "df_focal", "%.0f");
        toggle(p, "Performance Mode (DOF)", "perf_dof");

        p = detail("Outline", "ol_on", "ol_str", RzIcons.OL, false);
        note(p, "Menggambar garis tepi pada siluet dan lipatan objek.");
        toggle(p, "Enable Outline", "ol_on");
        slider(p, "Strength", "ol_str", "%.2f");
        slider(p, "Thickness", "ol_thick", "%.2f");
        slider(p, "Sensitivity", "ol_sens", "%.2f");
        slider(p, "Softness", "ol_soft", "%.2f");
        slider(p, "Blend (0 replace, 1 add, 2 multiply)", "ol_blend", "%.0f");
        slider(p, "Fade start (stud)", "ol_start", "%.0f");
        slider(p, "Fade end (stud)", "ol_end", "%.0f");
        toggle(p, "Garis terhadap langit", "ol_sky");
        slider(p, "Warna R", "ol_r", "%.2f");
        slider(p, "Warna G", "ol_g", "%.2f");
        slider(p, "Warna B", "ol_b", "%.2f");
        slider(p, "Tampilkan mask (debug)", "ol_debug", "%.0f");

        p = detail("Adaptive Fog", "fog_on", "fog_intensity", RzIcons.FOG, false);
        note(p, "Kabut mengikuti ketinggian. Sesuaikan nilainya di perangkat Anda.");
        toggle(p, "Enable Adaptive Fog", "fog_on");
        slider(p, "Fog Intensity", "fog_intensity", "%.2f");
        slider(p, "Fog Density", "fog_density", "%.2f");
        slider(p, "Fog Start Distance", "fog_start", "%.2f");
        slider(p, "Fog End Distance (0 = mati)", "fog_end", "%.2f");
        slider(p, "Fog Opacity", "fog_opacity", "%.2f");
        slider(p, "Fog Color Temperature", "fog_temp", "%+.2f");
        slider(p, "Fog Color: Merah", "fog_r", "%.2f");
        slider(p, "Fog Color: Hijau", "fog_g", "%.2f");
        slider(p, "Fog Color: Biru", "fog_b", "%.2f");
        slider(p, "Fog Color: campuran warna pilihan", "fog_cmix", "%.2f");
        slider(p, "Fog Saturation", "fog_sat", "%.2f");
        slider(p, "Fog Brightness", "fog_bright", "%.2f");
        slider(p, "Fog Height (tinggi dasar)", "fog_height", "%.2f");
        slider(p, "Height Falloff (0 = mati)", "fog_hfall", "%.2f");
        slider(p, "Distance Falloff", "fog_dfall", "%.2f");
        slider(p, "Fog Smoothness", "fog_smooth", "%.2f");
        slider(p, "Atmospheric Scattering", "fog_scatter", "%.2f");
        slider(p, "Sky Blending", "fog_sky", "%.2f");
        slider(p, "Adaptive Density (menurut cahaya)", "fog_adapt", "%.2f");
        slider(p, "Camera Distance Response (tinggi kamera)", "fog_cam", "%.2f");
        toggle(p, "Performance Mode (Fog)", "perf_fog");

        p = detail("Rimlight", "rim_on", "rim_intensity", RzIcons.RIM, false);
        note(p, "Berlaku pada material PBR. Material flat belum didukung.");
        toggle(p, "Enable Rimlight", "rim_on");
        slider(p, "Rimlight Intensity", "rim_intensity", "%.2f");
        slider(p, "Rimlight Color: Merah", "rim_r", "%.2f");
        slider(p, "Rimlight Color: Hijau", "rim_g", "%.2f");
        slider(p, "Rimlight Color: Biru", "rim_b", "%.2f");
        toggle(p, "RGB Mode", "rim_rgb");
        slider(p, "Color Cycle Speed", "rim_speed", "%.2f");
        slider(p, "Rim Width", "rim_width", "%.2f");
        slider(p, "Rim Sharpness", "rim_sharp", "%.2f");
        slider(p, "Rim Softness", "rim_soft", "%.2f");
        slider(p, "Fresnel Power", "rim_power", "%.2f");
        slider(p, "Fresnel Bias", "rim_bias", "%.2f");
        slider(p, "Light Direction", "rim_light", "%.2f");
        slider(p, "Light Spread", "rim_spread", "%.2f");
        slider(p, "Edge Brightness", "rim_edge", "%.2f");
        slider(p, "Material Sensitivity (gelap = lebih rim)", "rim_mat", "%.2f");
        slider(p, "Distance Fade", "rim_fade", "%.2f");
        toggle(p, "Performance Mode (Rim: tanpa soft/edge/material)", "perf_rim");

        p = detail("HDR & Bloom", "hdr_on", "bloom", RzIcons.HDR, false);
        note(p, "Threshold, radius, dan lens dirt belum tersedia.");
        toggle(p, "Enable HDR (highlight/kompresi/bayangan)", "hdr_on");
        slider(p, "Bloom Intensity (penguat bloom engine)", "bloom", "%.2f");
        slider(p, "Highlight Intensity", "highlight", "%.2f");
        slider(p, "HDR Tone Mapping / Highlight Compression", "hl_comp", "%.2f");
        slider(p, "Shadow Strength", "shadow_strength", "%+.2f");
        toggle(p, "Performance Mode (HDR)", "perf_hdr");

        p = detail("Warna & Grading", null, null, RzIcons.GRADE, false);
        gradingSliders(p);
        buildColorInto(p);

    }

    private void buildColorInto(LinearLayout p) {
        section(p, "Koreksi warna");
        slider(p, "Brightness", "brightness", "%+.2f");
        slider(p, "Kontras", "contrast", "%+.2f");
        slider(p, "Saturasi", "saturation", "%+.2f");
        slider(p, "Warmth (dingin ke hangat)", "warmth", "%+.2f");
        slider(p, "Vibrance", "vibrance", "%+.2f");
        slider(p, "Gamma", "gamma", "%.2f");
        slider(p, "Hue (geser warna)", "hue", "%+.2f");
        section(p, "Color grading: split toning");
        slider(p, "Warna bayangan (dingin ke hangat)", "split_shadow", "%+.2f");
        slider(p, "Warna highlight (dingin ke hangat)", "split_high", "%+.2f");
        slider(p, "Exposure (EV)", "exposure", "%+.2f");
        section(p, "Levels dan Curves");
        slider(p, "Levels: titik hitam", "levels_black", "%.3f");
        slider(p, "Levels: titik putih", "levels_white", "%.3f");
        slider(p, "Curves (S-curve)", "curves", "%.2f");
    }

    private TextView shaderInfo;
    private String lastStatus = "";

    private void buildDevInto(LinearLayout p) {
        TextView intro = tv("Akses langsung ke shader milik Roblox. Dump menyimpan kode shader asli; aturan menulis ulangnya sebelum dikompilasi. "
                + "Perubahan baru berlaku setelah Roblox ditutup paksa dan dibuka lagi.", 11, SUB, false);
        intro.setPadding(dp(4), dp(4), dp(4), 0);
        p.addView(intro, lp(-1, -2, 0));
        section(p, "User aktif");
        final TextView userStat = tv("Belum dicek", 12, SUB, false);
        p.addView(userStat, lp(-1, -2, 6));
        final TextView[] userBtn = new TextView[1];
        userBtn[0] = button(p, "Cek user aktif", () -> {
            String ep = RzLicense.devicesEndpoint(act);
            userBtn[0].setEnabled(false);
            userStat.setText("Memeriksa...");
            RzLicense.fetchUserAktif(act, ep, (ok, msg) -> {
                userBtn[0].setEnabled(true);
                userStat.setText(msg);
                userStat.setTextColor(ok ? OK : BAD);
            });
        }, false);
        section(p, "Dump shader");
        toggle(p, "Simpan semua shader Roblox (dump)", "shader_dump");
        toggle(p, "Hapus cache shader saat start", "clear_shader_cache");
        toggle(p, "Blokir program binary (eksperimental)", "block_program_binary");
        toggle(p, "Trace: aktifkan hook (restart Roblox setelah ini)", "trace");
        toggle(p, "Trace: rekam 1 frame (nyalakan di dalam game, lalu matikan)", "trace_now");
        section(p, "Aturan tulis-ulang");
        toggle(p, "Terapkan aturan ke shader", "shader_rules");
        final EditText rules = new EditText(act);
        rules.setHint("[contains:TEKS] CARI ==> GANTI");
        rules.setHintTextColor(SUB);
        rules.setTextColor(TEXT);
        rules.setTextSize(TypedValue.COMPLEX_UNIT_PX, 11 * auto * density);
        rules.setTypeface(Typeface.MONOSPACE);
        rules.setBackground(rr(ROW, 8));
        rules.setPadding(dp(10), dp(8), dp(10), dp(8));
        rules.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        rules.setMinLines(5);
        rules.setGravity(Gravity.TOP);
        try {
            File rf = new File(dir, "rz_shader_rules.txt");
            if (rf.exists()) { BufferedReader r = new BufferedReader(new FileReader(rf)); StringBuilder sb = new StringBuilder(); String l; while ((l = r.readLine()) != null) sb.append(l).append('\n'); r.close(); rules.setText(sb.toString()); }
        } catch (Throwable ignore) { }
        p.addView(rules, lp(-1, -2, 6));
        button(p, "Simpan aturan", () -> {
            try {
                java.io.FileOutputStream o = new java.io.FileOutputStream(new File(dir, "rz_shader_rules.txt"));
                o.write(rules.getText().toString().getBytes("UTF-8")); o.close();
                notify("Aturan tersimpan. Restart Roblox", true);
            } catch (Throwable e) { notify("Gagal menyimpan aturan", false); }
        }, true);
        section(p, "Status dari engine");
        shaderInfo = tv("Menunggu engine...", 12, TEXT, false);
        shaderInfo.setBackground(rr(0xFF121212, 10));
        shaderInfo.setPadding(dp(12), dp(8), dp(12), dp(8));
        p.addView(shaderInfo, lp(-1, -2, 0));
        button(p, "Salin status ke clipboard", () -> {
            try {
                ClipboardManager cm = (ClipboardManager) act.getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("RYEENZYXNZ", lastStatus));
                notify("Status disalin", true);
            } catch (Throwable e) { notify("Gagal menyalin", false); }
        }, false);
        TextView where = tv("Hasil dump: Android/data/com.roblox.client/files/RYEENZYXNZ/shaders (ambil dengan adb pull).", 11, SUB, false);
        where.setPadding(dp(4), dp(8), dp(4), 0);
        p.addView(where, lp(-1, -2, 0));
    }

    // laporan: fitur nyala di config, apakah engine benar-benar menjalankannya, dan alasannya kalau tidak
    private String featureReport(String line, String dp) {
        java.util.HashMap<String, String> m = new java.util.HashMap<>();
        for (String kv : (line + ";" + dp.replace('\n', ';').replace(' ', ';')).split(";")) { int e = kv.indexOf('='); if (e > 0) m.put(kv.substring(0, e), kv.substring(e + 1)); }
        boolean hooked = "hooked".equals(m.get("state"));
        long ran = 0; try { ran = Long.parseLong(m.get("passes_run")); } catch (Throwable ignore) { }
        boolean cb0 = "1".equals(m.get("cb0_seen"));
        boolean msaa = "1".equals(m.get("msaa"));
        StringBuilder b = new StringBuilder();
        String[][] live = {{"fog_on", "Fog adaptif"}, {"rim_on", "Rimlight"}, {"hdr_on", "HDR/grading"}};
        for (String[] f : live) {
            boolean on = st.on(f[0]);
            b.append(on ? (hooked ? "[OK] " : "[?]  ") : "[off] ").append(f[1]).append(on && !hooked ? " - engine belum aktif" : "").append('\n');
        }
        String[][] dpf = {{"mx_on", "MXAO"}, {"ss_on", "SSR"}, {"df_on", "DOF"}, {"ol_on", "Outline"}};
        for (String[] f : dpf) {
            boolean on = st.on("depth_pipe") && st.on(f[0]);
            String why = !on ? "" : ran > 0 ? "" : !st.on("depth_pipe") ? "" : dp.isEmpty() ? " - GAGAL: engine native tidak menulis dp_status.txt (payload lama / belum restart / depth_pipe mati di config)" : dp.contains("NONAKTIF") ? " - GAGAL: engine native menganggap depth_pipe nonaktif (lihat baris config di status)" : !cb0 ? " - GAGAL: matriks kamera (CB0) tak terbaca" : msaa ? " - cek MSAA" : " - belum ada pass jalan";
            b.append(!on ? "[off] " : ran > 0 ? "[OK] " : "[GAGAL] ").append(f[1]).append(why).append('\n');
        }
        b.append("Bloom lanjutan (threshold/radius/lens dirt): belum diimplementasi\n");
        return b.toString();
    }

    // ------------------------------------------------------------------ status dari engine
    private final Runnable poll = new Runnable() {
        public void run() {
            try {
                File f = new File(dir, "rz_status.txt");
                String line = "";
                if (f.exists()) { BufferedReader r = new BufferedReader(new FileReader(f)); line = r.readLine(); r.close(); }
                String state = "menunggu engine", fps = "";
                String dpTxt = "";
                try {
                    File df = new File(dir, "dp_status.txt");
                    // engine native menulis ke <external>/Android/data/<paket>/files/RYEENZYXNZ (folder dump), bukan filesDir
                    File dx = new File("/storage/emulated/0/Android/data/" + act.getPackageName() + "/files/RYEENZYXNZ/dp_status.txt");
                    File ex = act.getExternalFilesDir(null) == null ? null : new File(act.getExternalFilesDir(null), "RYEENZYXNZ/dp_status.txt");
                    for (File c : new File[] { dx, ex, df }) if (c != null && c.exists() && c.length() > 0) { df = c; break; }
                    if (df.exists()) {
                        BufferedReader dr = new BufferedReader(new FileReader(df));
                        String l2; StringBuilder sb = new StringBuilder();
                        while ((l2 = dr.readLine()) != null) sb.append(l2).append('\n');
                        dr.close();
                        dpTxt = sb.toString();
                    }
                } catch (Throwable ignore2) { }
                if (fxStatus != null) {
                    String fxl = "";
                    for (String l3 : dpTxt.split("\n")) if (l3.startsWith("fx_on=")) fxl = l3;
                    int ei = fxl.indexOf(" fx_err=");
                    String err = ei >= 0 ? fxl.substring(ei + 8).trim() : "";
                    String fxNum = ei >= 0 ? fxl.substring(0, ei) : fxl;
                    java.util.HashMap<String, String> fm = new java.util.HashMap<>();
                    for (String kv : fxNum.split(" ")) { int e = kv.indexOf('='); if (e > 0) fm.put(kv.substring(0, e), kv.substring(e + 1)); }
                    boolean bad = !err.isEmpty() && !err.equals("-");
                    String fxOn = fm.get("fx_on") == null ? "0" : fm.get("fx_on");
                    fxStatus.setText(fxl.isEmpty() ? "Menunggu data engine. Masuk ke dalam game."
                            : "Aktif " + fxOn + " · berjalan " + fm.get("fx_run") + " · gagal " + fm.get("fx_fail") + (bad ? "\nError: " + err : ""));
                    fxStatus.setTextColor(fxl.isEmpty() ? SUB : (bad || !"0".equals(fm.get("fx_fail")) ? BAD : OK));
                }
                String rep = featureReport(line == null ? "" : line, dpTxt);
                lastStatus = (line == null ? "" : line) + (dpTxt.isEmpty() ? "" : "\n" + dpTxt) + "\n--- laporan fitur ---\n" + rep;
                if (shaderInfo != null && line != null) {
                    java.util.HashMap<String, String> m = new java.util.HashMap<>();
                    for (String kv : line.split(";")) { int e = kv.indexOf('='); if (e > 0) m.put(kv.substring(0, e), kv.substring(e + 1)); }
                    shaderInfo.setText("shader terlihat: " + m.get("seen") + "\ndisimpan: " + m.get("dumped") + "\ndiubah aturan: " + m.get("patched")
                            + "\nprogram binary diblokir: " + m.get("bin") + "\nlampiran depth: " + m.get("depth") + "\nhook: " + m.get("hooks")
                            + (dpTxt.isEmpty() ? "" : "\n--- depth pipeline ---\n" + dpTxt) + "\n--- laporan fitur ---\n" + rep);
                }
                if (line != null) for (String kv : line.split(";")) {
                    if (kv.startsWith("state=")) state = kv.substring(6);
                    else if (kv.startsWith("fps=")) fps = kv.substring(4);
                }
                if (fpsTv != null) {
                    try { float fv = Float.parseFloat(fps); fpsTv.setText(String.format(Locale.US, "%.0f", fv)); if (spark != null) spark.push(fv); }
                    catch (Throwable ig) { fpsTv.setText("--"); }
                }
                boolean good = state.equals("hooked");
                int dotC = good ? OK : (state.startsWith("waiting") || state.startsWith("menunggu") ? MUTED : BAD);
                if (statusDot != null) statusDot.setColor(dotC);
                if (good && (dotPulse == null || !dotPulse.isRunning()) && statusDot != null) {
                    dotPulse = ValueAnimator.ofInt(255, 90);
                    dotPulse.setDuration(1400);
                    dotPulse.setRepeatMode(ValueAnimator.REVERSE);
                    dotPulse.setRepeatCount(ValueAnimator.INFINITE);
                    dotPulse.addUpdateListener(va -> { if (statusDot != null) { statusDot.setAlpha((Integer) va.getAnimatedValue()); statusTv.invalidate(); } });
                    dotPulse.start();
                } else if (!good && dotPulse != null) { dotPulse.cancel(); dotPulse = null; if (statusDot != null) statusDot.setAlpha(255); }
                statusTv.setTextColor(SUB);
                statusTv.setText(good ? "engine aktif" + (fps.isEmpty() ? "" : " · " + fps + " FPS") : "engine: " + state);
            } catch (Throwable ignore) { }
            h.postDelayed(this, 700);
        }
    };
}
