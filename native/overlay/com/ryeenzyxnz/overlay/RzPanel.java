package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
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
    private static final int BG = 0xFF050505, ROW = 0xFF141414, ROWHI = 0xFF202020,
            TEXT = 0xFFEDEDEF, SUB = 0xFF8E9196, OK = 0xFFE4E4E7, BAD = 0xFFE07070, OFF = 0xFF2A2A2A, STROKE = 0xFF3A3A3D,
            DARK = 0xFF0A0A0A, SIDE = 0xFF0A0A0A, CARD = 0xFF0E0E0F;

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
    private final float auto;
    private Typeface fBody, fBold, fTitle;
    private android.graphics.Bitmap logoFab, logoFull;

    private FrameLayout root;
    private TextView fab, pill, statusTv, toast, reportTv;
    private LinearLayout panel;
    private final LinkedHashMap<String, View> pages = new LinkedHashMap<>();
    private final LinkedHashMap<String, TextView> tabs = new LinkedHashMap<>();
    private boolean updating = false;
    private String curPreset = "-";
    private List<RzPresets.Preset> presets;
    private final RzFx fx;
    private boolean licOk = false;
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
        float longDp = Math.max(dm.widthPixels, dm.heightPixels) / dm.density, shortDp = Math.min(dm.widthPixels, dm.heightPixels) / dm.density;
        auto = Math.max(0.8f, Math.min(1.3f, Math.min(longDp / 700f, shortDp / 400f)));
        ui = new RzUi(filesDir);
        store = new RzPresetStore(filesDir);
        accent = RzUi.ACCENTS[ui.accent];
        accent2 = RzUi.ACCENTS2[ui.accent];
        fBody = font(RzUi.FONT_MED[ui.font], Typeface.create("sans-serif-condensed", Typeface.NORMAL));
        fBold = font(RzUi.FONT_BOLD[ui.font], Typeface.create("sans-serif-condensed", Typeface.BOLD));
        fTitle = font("Orbitron.ttf", Typeface.create("sans-serif-black", Typeface.NORMAL));
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
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp * 1.1f * auto);
        t.setTextColor(color);
        t.setTypeface(bold ? fBold : fBody);
        return t;
    }

    private LinearLayout.LayoutParams lp(int w, int hgt, int top) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(w, hgt);
        p.topMargin = dp(top);
        return p;
    }

    private void changed() { h.removeCallbacks(saveR); h.postDelayed(saveR, 150); }

    private void refreshAll() {
        updating = true;
        for (Runnable r : refreshers) { try { r.run(); } catch (Throwable ignore) { } }
        updating = false;
    }

    void notify(String msg, boolean good) {
        toast.setText(msg);
        toast.setTextColor(good ? TEXT : BAD);
        toast.setVisibility(View.VISIBLE);
        h.removeCallbacks(hideToast);
        h.postDelayed(hideToast, 2600);
    }
    private final Runnable hideToast = new Runnable() { public void run() { if (toast != null) toast.setVisibility(View.GONE); } };

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

    // ------------------------------------------------------------------ widgets
    private void section(LinearLayout p, String text) {
        TextView t = tv(text.toUpperCase(Locale.US), 11, accent, true);
        t.setLetterSpacing(0.1f);
        t.setPadding(dp(4), dp(9), 0, dp(2));
        p.addView(t, lp(-1, -2, 0));
    }

    private void toggle(LinearLayout p, String label, final String key) {
        final Switch sw = new Switch(act);
        sw.setText(label);
        sw.setTextColor(TEXT);
        sw.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14 * auto);
        sw.setTypeface(fBody);
        sw.setBackground(rr(ROW, 10));
        sw.setPadding(dp(12), dp(10), dp(12), dp(10));
        int[][] states = { { android.R.attr.state_checked }, {} };
        sw.setThumbTintList(new ColorStateList(states, new int[] { DARK, 0xFF8E9196 }));
        sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
        sw.setOnCheckedChangeListener((b, on) -> {
            if (updating) return;
            if (key.equals("master") && on && !licOk) {
                sw.setChecked(false);
                notify("Lisensi belum aktif. Buka tab CREDIT untuk masukkan key.", false);
                return;
            }
            st.set(key, on ? 1 : 0); changed();
        });
        refreshers.add(() -> sw.setChecked(st.on(key)));
        p.addView(sw, lp(-1, -2, 6));
    }

    private void slider(LinearLayout p, String label, final String key, final String fmt) {
        final RzState.Key k = RzState.BY.get(key);
        LinearLayout box = new LinearLayout(act);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackground(rr(ROW, 10));
        box.setPadding(dp(12), dp(8), dp(12), dp(6));
        LinearLayout top = new LinearLayout(act);
        top.setOrientation(LinearLayout.HORIZONTAL);
        TextView name = tv(label, 13, TEXT, false);
        final TextView val = tv("", 12, accent, true);
        top.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        top.addView(val, new LinearLayout.LayoutParams(-2, -2));
        box.addView(top, lp(-1, -2, 0));
        final SeekBar sb = new SeekBar(act);
        sb.setMax(1000);
        sb.setProgressTintList(ColorStateList.valueOf(accent));
        sb.setThumbTintList(ColorStateList.valueOf(Color.WHITE));
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
        p.addView(box, lp(-1, -2, 6));
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
        b.setBackground(rr(hot ? accent : ROW, 10));
        b.setTextColor(hot ? DARK : TEXT);
        b.setPadding(dp(12), dp(10), dp(12), dp(10));
        b.setOnClickListener(v -> r.run());
        p.addView(b, lp(-1, -2, 6));
        return b;
    }

    private interface Pick { void on(int index); }

    private void chips(LinearLayout p, List<String> labels, Pick pick) {
        LinearLayout grid = new LinearLayout(act);
        grid.setOrientation(LinearLayout.VERTICAL);
        fillChips(grid, labels, pick);
        p.addView(grid, lp(-1, -2, 0));
    }

    private void fillChips(LinearLayout grid, List<String> labels, final Pick pick) {
        grid.removeAllViews();
        LinearLayout rowL = null;
        for (int i = 0; i < labels.size(); i++) {
            if (i % 2 == 0) {
                rowL = new LinearLayout(act);
                rowL.setOrientation(LinearLayout.HORIZONTAL);
                grid.addView(rowL, lp(-1, -2, 6));
            }
            final int idx = i;
            TextView c = tv(labels.get(i), 12, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setSingleLine(true);
            c.setMaxLines(1);
            c.setAutoSizeTextTypeUniformWithConfiguration(8, 13, 1, TypedValue.COMPLEX_UNIT_SP);
            c.setBackground(rr(ROW, 10));
            c.setPadding(dp(8), dp(10), dp(8), dp(10));
            c.setOnClickListener(v -> pick.on(idx));
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, -2, 1f);
            cp.leftMargin = (i % 2 == 1) ? dp(6) : 0;
            rowL.addView(c, cp);
        }
    }

    private LinearLayout page(String name) {
        ScrollView sv = new ScrollView(act);
        sv.setVerticalScrollBarEnabled(false);
        LinearLayout col = new LinearLayout(act);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(10), dp(2), dp(10), dp(48));
        sv.addView(col, new ViewGroup.LayoutParams(-1, -2));
        sv.setVisibility(View.GONE);
        pages.put(name, sv);
        return col;
    }

    private void showTab(String name) {
        if (!pages.containsKey(name)) name = "MAIN";
        for (Map.Entry<String, View> e : pages.entrySet()) e.getValue().setVisibility(e.getKey().equals(name) ? View.VISIBLE : View.GONE);
        for (Map.Entry<String, TextView> e : tabs.entrySet()) {
            boolean on = e.getKey().equals(name);
            e.getValue().setBackground(rr(on ? accent : SIDE, 10));
            e.getValue().setTextColor(on ? DARK : SUB);
            Object ic = e.getValue().getTag();
            if (ic instanceof RzIcons) ((RzIcons) ic).setColor(on ? DARK : SUB);
        }
        curTab = name;
    }

    // ------------------------------------------------------------------ dropdown (grup yang bisa dilipat)
    private LinearLayout group(LinearLayout pg, String title, final String onKey) {
        final LinearLayout card = new LinearLayout(act);
        card.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable cg = rr(CARD, 12);
        cg.setStroke(dp(1), 0xFF26262A);
        card.setBackground(cg);
        LinearLayout head = new LinearLayout(act);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(12), dp(9), dp(12), dp(9));
        final TextView name = tv(title.toUpperCase(Locale.US), 13, TEXT, true);
        name.setLetterSpacing(0.08f);
        final TextView dot = tv("", 10, accent, true);
        dot.setLetterSpacing(0.1f);
        final TextView arrow = tv("▸", 14, SUB, true);
        head.addView(name, new LinearLayout.LayoutParams(0, -2, 1f));
        head.addView(dot, new LinearLayout.LayoutParams(-2, -2));
        LinearLayout.LayoutParams ap = new LinearLayout.LayoutParams(-2, -2);
        ap.leftMargin = dp(10);
        head.addView(arrow, ap);
        final LinearLayout body = new LinearLayout(act);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(8), 0, dp(8), dp(10));
        body.setVisibility(View.GONE);
        head.setOnClickListener(v -> {
            boolean open = body.getVisibility() != View.VISIBLE;
            body.setVisibility(open ? View.VISIBLE : View.GONE);
            arrow.setText(open ? "▾" : "▸");
            name.setTextColor(open ? accent : TEXT);
        });
        card.addView(head, new LinearLayout.LayoutParams(-1, -2));
        card.addView(body, new LinearLayout.LayoutParams(-1, -2));
        pg.addView(card, lp(-1, -2, 8));
        if (onKey != null) refreshers.add(() -> dot.setText(st.on(onKey) ? "AKTIF" : ""));
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
        if (n < 0) { notify("Isi bukan preset yang dikenali", false); return false; }
        curPreset = name;
        refreshAll(); changed();
        notify("Preset: " + name, true);
        return true;
    }

    /** Impor dari teks (.ini / .txt preset pihak lain). */
    private void importText(String name, String text) {
        RzIni.Result r = RzIni.fromText(text);
        if (r.techniques == 0 && r.applied.isEmpty()) { notify("Isi tidak dikenali sebagai preset", false); return; }
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
        if (n.isEmpty()) { notify("Isi nama preset dulu", false); return; }
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
        if (!ok) notify("Pemilih file tidak tersedia. Pakai impor teks di bawah", false);
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
            if (panel != null) panel.setElevation(dp(40));
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
        pages.clear(); tabs.clear(); refreshers.clear();
        fxList = null; savedList = null; nameBox = null;
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
        boolean open = panel != null && panel.getVisibility() == View.VISIBLE;
        // Hentikan loop polling lama sebelum membuat view tree baru.
        h.removeCallbacks(poll);
        h.removeCallbacks(saveR);
        h.removeCallbacks(hideToast);
        if (root != null && root.getParent() instanceof ViewGroup) ((ViewGroup) root.getParent()).removeView(root);
        root = null;
        attach();
        showTab(tab);
        if (open) setOpen(true);
    }

    void detach() {
        // Batalkan seluruh pekerjaan tertunda agar Activity lama tidak disentuh setelah relog.
        h.removeCallbacksAndMessages(null);
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

    private void sizePanel() {
        int w = root.getWidth(), hh = root.getHeight();
        if (w <= 0) return;
        ViewGroup.LayoutParams lpP = panel.getLayoutParams();
        lpP.width = Math.min(dp(420 * ui.scale), (int) (w * 0.94f));
        lpP.height = Math.min(dp(360 * ui.scale), (int) (hh * 0.88f));
        panel.setLayoutParams(lpP);
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
    }

    private void setOpen(boolean on) {
        panel.setVisibility(on ? View.VISIBLE : View.GONE);
        if (logoFab != null && !on) {
            fab.setText("");
            fab.setBackground(new RzLogo(logoFab, 0x99FFFFFF, dp(1.5f)));
        } else {
            fab.setText(on ? "×" : "RZ");
            fab.setTextSize(TypedValue.COMPLEX_UNIT_SP, (on ? 24 : 16) * auto);
            GradientDrawable g = new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[] { accent, accent2 });
            g.setShape(GradientDrawable.OVAL);
            g.setStroke(dp(1.5f), 0x99FFFFFF);
            fab.setBackground(g);
        }
    }

    private void buildFab() {
        fab = tv("RZ", 15, DARK, true);
        fab.setTypeface(fTitle);
        fab.setGravity(Gravity.CENTER);
        GradientDrawable g = new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[] { accent, accent2 });
        g.setShape(GradientDrawable.OVAL);
        g.setStroke(dp(1.5f), 0x99FFFFFF);
        fab.setBackground(g);
        fab.setElevation(dp(40));
        fab.setClickable(true);
        fab.setFocusable(true);
        FrameLayout.LayoutParams p = new FrameLayout.LayoutParams(dp(ui.fabSize), dp(ui.fabSize));
        root.addView(fab, p);
        drag(fab, fab, () -> setOpen(panel.getVisibility() != View.VISIBLE));
    }

    private void buildPanel() {
        panel = new LinearLayout(act);
        panel.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable bg = rr(BG, 16);
        bg.setStroke(dp(1.5f), STROKE);
        panel.setBackground(bg);
        panel.setClipToOutline(true);
        panel.setElevation(dp(40));
        panel.setClickable(true);
        panel.setFocusable(true);
        root.addView(panel, new FrameLayout.LayoutParams(dp(280), dp(320)));

        // header
        LinearLayout head = new LinearLayout(act);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(14), dp(8), dp(10), dp(8));
        LinearLayout titles = new LinearLayout(act);
        titles.setOrientation(LinearLayout.VERTICAL);
        TextView title = tv("RYEENZYXNZ", 14, Color.WHITE, true);
        title.setTypeface(fTitle);
        title.setLetterSpacing(0.06f);
        title.getPaint().setShader(new LinearGradient(0, 0, dp(150), 0, accent, accent2, Shader.TileMode.CLAMP));
        titles.addView(title);
        statusTv = tv("Shader Engine v0.7.0", 11, SUB, false);
        statusTv.setSingleLine(true);
        titles.addView(statusTv);
        head.addView(titles, new LinearLayout.LayoutParams(0, -2, 1f));
        pill = tv("OFF", 12, SUB, true);
        pill.setGravity(Gravity.CENTER);
        pill.setPadding(dp(14), dp(6), dp(14), dp(6));
        pill.setOnClickListener(v -> {
            if (!st.on("enabled") && !licOk) { notify("Lisensi belum aktif. Buka tab CREDIT untuk masukkan key.", false); return; }
            int next = st.on("enabled") ? 0 : 1;
            st.set("enabled", next); st.set("master", next); refreshAll(); changed();
        });
        refreshers.add(() -> {
            boolean on = st.on("enabled");
            pill.setText(on ? "ON" : "OFF");
            pill.setBackground(rr(on ? OK : OFF, 14));
            pill.setTextColor(on ? DARK : SUB);
        });
        head.addView(pill, new LinearLayout.LayoutParams(-2, -2));
        TextView close = tv("×", 20, TEXT, true);
        close.setGravity(Gravity.CENTER);
        close.setBackground(rr(ROW, 14));
        close.setOnClickListener(v -> setOpen(false));
        LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(dp(30), dp(30));
        cp.leftMargin = dp(8);
        head.addView(close, cp);
        panel.addView(head, new LinearLayout.LayoutParams(-1, -2));
        drag(titles, panel, null);

        // isi: tab di SAMPING (kiri), halaman di kanan
        View divTop = new View(act);
        divTop.setBackgroundColor(STROKE);
        panel.addView(divTop, new LinearLayout.LayoutParams(-1, dp(1)));
        LinearLayout content = new LinearLayout(act);
        content.setOrientation(LinearLayout.HORIZONTAL);
        panel.addView(content, new LinearLayout.LayoutParams(-1, 0, 1f));
        ScrollView tabScroll = new ScrollView(act);
        tabScroll.setVerticalScrollBarEnabled(false);
        tabScroll.setBackgroundColor(SIDE);
        final LinearLayout tabRow = new LinearLayout(act);
        tabRow.setOrientation(LinearLayout.VERTICAL);
        tabRow.setPadding(dp(6), dp(8), dp(6), dp(8));
        tabScroll.addView(tabRow, new ViewGroup.LayoutParams(-1, -2));
        content.addView(tabScroll, new LinearLayout.LayoutParams(dp(92), -1));
        View divSide = new View(act);
        divSide.setBackgroundColor(STROKE);
        content.addView(divSide, new LinearLayout.LayoutParams(dp(1), -1));

        FrameLayout body = new FrameLayout(act);
        content.addView(body, new LinearLayout.LayoutParams(0, -1, 1f));

        buildMainPage();
        buildPresetPage();
        buildEffectPage();
        buildSettingPage();
        buildFeedbackPage();
        buildCreditPage();

        final boolean compact = compactTabs();
        android.graphics.Paint meas = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        meas.setTypeface(fBold);
        meas.setTextSize(13f * 1.1f * auto * act.getResources().getDisplayMetrics().scaledDensity);
        float maxLbl = 0;
        for (String nm : pages.keySet()) maxLbl = Math.max(maxLbl, meas.measureText(nm) * 1.08f);
        int tabW = Math.max(dp(84), Math.min(dp(136), (int) maxLbl + dp(19 + 7 + 9 + 4 + 12)));
        tabScroll.setLayoutParams(new LinearLayout.LayoutParams(compact ? dp(50) : tabW, -1));
        for (final String name : pages.keySet()) {
            TextView t = tv(compact ? "" : name, 13, SUB, true);
            t.setLetterSpacing(0.03f);
            t.setSingleLine(true);
            t.setMaxLines(1);
            if (!compact) t.setAutoSizeTextTypeUniformWithConfiguration(7, 14, 1, TypedValue.COMPLEX_UNIT_SP);
            t.setGravity(compact ? Gravity.CENTER : Gravity.CENTER_VERTICAL);
            t.setPadding(dp(compact ? 0 : 9), dp(12), dp(compact ? 0 : 4), dp(12));
            RzIcons ic = new RzIcons(tabIcon(name), dp(19), SUB);
            t.setCompoundDrawables(ic, null, null, null);
            t.setCompoundDrawablePadding(dp(compact ? 0 : 7));
            t.setTag(ic);
            t.setContentDescription(name);
            t.setOnClickListener(v -> showTab(name));
            LinearLayout.LayoutParams tp = new LinearLayout.LayoutParams(-1, -2);
            tp.bottomMargin = dp(4);
            tabRow.addView(t, tp);
            tabs.put(name, t);
            body.addView(pages.get(name), new FrameLayout.LayoutParams(-1, -1));
        }
        toast = tv("", 12, TEXT, true);
        toast.setGravity(Gravity.CENTER);
        toast.setBackground(rr(ROWHI, 14));
        toast.setPadding(dp(12), dp(7), dp(12), dp(7));
        toast.setVisibility(View.GONE);
        FrameLayout.LayoutParams tl = new FrameLayout.LayoutParams(-2, -2, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        tl.bottomMargin = dp(10);
        body.addView(toast, tl);
        showTab(curTab);
    }

    // ------------------------------------------------------------------ tab PRESET
    private void buildPresetPage() {
        LinearLayout p = page("PRESET");
        section(p, "Preset bawaan");
        if (presets.isEmpty()) {
            note(p, "Preset belum termuat dari server. Pastikan lisensi aktif dan koneksi internet tersedia, lalu buka lagi panel ini.");
        } else {
            List<String> names = new ArrayList<>();
            for (RzPresets.Preset x : presets) names.add(x.name);
            chips(p, names, i -> applyPreset(presets.get(i).name, presets.get(i).values));
        }
        section(p, "Preset tersimpan");
        note(p, store.usingPublic
            ? "Disimpan di folder RYEENZYXNZ (penyimpanan HP), tetap ada walau Roblox di-uninstall lalu dipasang lagi."
            : "Disimpan di dalam data Roblox saja — bakal ikut terhapus kalau Roblox di-uninstall. HP ini menolak akses folder publik.");
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
        nameBox.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        nameBox.setBackground(rr(ROW, 10));
        nameBox.setPadding(dp(12), dp(10), dp(12), dp(10));
        p.addView(nameBox, lp(-1, -2, 6));
        button(p, "SAVE  ·  simpan pengaturan sekarang", this::saveCurrent, true, RzIcons.SAVE);
        button(p, "IMPORT  ·  buka dari file", this::importFile, false, RzIcons.IMPORT);
        button(p, "EXPORT  ·  simpan ke file", this::exportFile, false, RzIcons.EXPORT);
        note(p, "Preset berisi semua nilai fitur di MAIN (termasuk Efek Tambahan). Berkas ekspor berakhiran .rzp dan bisa dibagikan.");

        LinearLayout adv = group(p, "Impor dari teks", null);
        button(adv, "Tempel dari clipboard", () -> {
            try {
                ClipboardManager cm = (ClipboardManager) act.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData d = cm.getPrimaryClip();
                String t = (d != null && d.getItemCount() > 0) ? d.getItemAt(0).coerceToText(act).toString() : "";
                if (t.trim().isEmpty()) notify("Clipboard kosong. Salin isi preset dulu", false);
                else importAny(t);
            } catch (Throwable e) { notify("Clipboard tidak bisa dibaca", false); }
        }, true);
        final EditText box = new EditText(act);
        box.setHint("...atau tempel isi preset di sini");
        box.setHintTextColor(SUB);
        box.setTextColor(TEXT);
        box.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        box.setTypeface(Typeface.MONOSPACE);
        box.setBackground(rr(ROW, 10));
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
        section(g, "Tampilan panel");
        fxSlider(g, "Transparansi panel", 0.5f, 1f, true, new float[] { ui.opacity }, v -> { ui.opacity = v; panel.setAlpha(v); ui.save(); });
        fxSlider(g, "Ukuran panel", 0.65f, 1.1f, true, new float[] { ui.scale }, v -> { ui.scale = v; sizePanel(); ui.save(); });
        fxSlider(g, "Ukuran tombol RZ", 40f, 80f, false, new float[] { ui.fabSize }, v -> { ui.fabSize = v; sizePanel(); ui.save(); });
        fxSlider(g, "Transparansi tombol RZ", 0.3f, 1f, true, new float[] { ui.fabOpacity }, v -> { ui.fabOpacity = v; fab.setAlpha(v); ui.save(); });
        section(g, "Font");
        List<String> fn = new ArrayList<>();
        for (int i = 0; i < RzUi.FONT_NAMES.length; i++) fn.add((i == ui.font ? "● " : "") + RzUi.FONT_NAMES[i]);
        chips(g, fn, i -> { ui.font = i; ui.save(); rebuild("SETTING"); });
        section(g, "Warna aksen");
        List<String> an = new ArrayList<>();
        for (int i = 0; i < RzUi.ACCENT_NAMES.length; i++) an.add((i == ui.accent ? "● " : "") + RzUi.ACCENT_NAMES[i]);
        chips(g, an, i -> { ui.accent = i; ui.save(); rebuild("SETTING"); });
        button(g, "Posisi tombol RZ kembali ke awal", () -> { fab.setX(dp(14)); fab.setY(Math.min(dp(110), root.getHeight() - dp(70))); notify("Posisi dikembalikan", true); }, false);
        button(g, "Reset tampilan", () -> { ui.reset(); ui.save(); rebuild("SETTING"); }, false, RzIcons.RESET);
        note(g, "Ukuran tampilan menyesuaikan layar otomatis. Tombol bulat RZ = buka/tutup panel (bisa digeser); geser panel lewat judulnya.");
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
            curPreset = "-"; refreshAll(); changed(); notify("Direset", true);
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
        note(p, "Ada bug atau saran? Tulis di sini, laporan dikirim langsung ke developer.");
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
        msg.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14 * auto);
        msg.setBackground(rr(ROW, 10));
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
        contact.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14 * auto);
        contact.setBackground(rr(ROW, 10));
        contact.setPadding(dp(12), dp(10), dp(12), dp(10));
        contact.setFilters(new android.text.InputFilter[] { new android.text.InputFilter.LengthFilter(80) });
        p.addView(contact, lp(-1, -2, 6));
        final Switch sw = new Switch(act);
        sw.setText("Sertakan info perangkat dan status engine");
        sw.setTextColor(TEXT);
        sw.setTypeface(fBody);
        sw.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14 * auto);
        sw.setBackground(rr(ROW, 10));
        sw.setPadding(dp(12), dp(10), dp(12), dp(10));
        int[][] states = { { android.R.attr.state_checked }, {} };
        sw.setThumbTintList(new ColorStateList(states, new int[] { DARK, 0xFF8E9196 }));
        sw.setTrackTintList(new ColorStateList(states, new int[] { accent, OFF }));
        sw.setChecked(fbDiag);
        sw.setOnCheckedChangeListener((b, on) -> fbDiag = on);
        p.addView(sw, lp(-1, -2, 6));
        note(p, "Yang dikirim: pesan, kontak, model HP, versi Android, dan (kalau dicentang) status engine. Tidak ada data akun Roblox.");
        final TextView[] btn = new TextView[1];
        btn[0] = button(p, "KIRIM LAPORAN", () -> {
            if (url.isEmpty()) { notify("Pengiriman belum dikonfigurasi developer", false); return; }
            final String m = msg.getText().toString().trim();
            if (m.length() < 10) { notify("Pesan terlalu pendek (minimal 10 huruf)", false); return; }
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
        if (url.isEmpty()) note(p, "Catatan: alamat penerima laporan belum diisi di APK ini.");
    }

    // ------------------------------------------------------------------ tab CREDIT
    private void buildCreditPage() {
        LinearLayout p = page("CREDIT");
        LinearLayout c = new LinearLayout(act);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setGravity(Gravity.CENTER_HORIZONTAL);
        GradientDrawable cg = rr(CARD, 14);
        cg.setStroke(dp(1), 0xFF26262A);
        c.setBackground(cg);
        c.setPadding(dp(16), dp(26), dp(16), dp(26));
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
        TextView t = tv("RYEENZYXNZ", 22, Color.WHITE, true);
        t.setTypeface(fTitle);
        t.setLetterSpacing(0.08f);
        t.setGravity(Gravity.CENTER);
        t.getPaint().setShader(new LinearGradient(0, 0, dp(230), 0, accent, accent2, Shader.TileMode.CLAMP));
        c.addView(t, lp(-2, -2, 0));
        View line = new View(act);
        line.setBackgroundColor(accent2);
        c.addView(line, lp(dp(48), dp(2), 14));
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
                notify(show ? "Menu tersembunyi dibuka" : "Menu tersembunyi ditutup", true);
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
        cg.setStroke(dp(1), 0xFF26262A);
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
            if (info.key.isEmpty()) status.setText("Mengaktifkan otomatis...");
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
        note(p, "Efek berjalan di dalam Depth Pipeline (selalu aktif). Saat satu efek dinyalakan, ON/OFF Shader ikut dinyalakan otomatis.");
        toggle(p, "ON/OFF Shader", "master");
        section(p, "Status");
        fxCount = tv("", 12, TEXT, true);
        fxCount.setPadding(dp(4), dp(2), dp(4), 0);
        p.addView(fxCount, lp(-1, -2, 0));
        fxStatus = tv("menunggu engine...", 11, SUB, false);
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
            if (!licOk) notify("Lisensi belum aktif: efek belum bisa jalan. Buka tab CREDIT.", false);
            else { st.set("master", 1); st.set("enabled", 1); ch = true; }
        }
        if (ch) { refreshAll(); notify("Depth Pipeline + Shader dinyalakan otomatis (dibutuhkan efek)", true); }
    }

    private void buildFxInto(LinearLayout p) {
        if (!fxLoaded) {
            note(p, "Daftar efek tambahan (fx_ui.json) tidak ditemukan di APK. Patch ulang dengan versi terbaru (termux/patch.sh --live) agar daftar 90+ efek muncul di sini.");
            return;
        }
        note(p, "Efek tambahan 90+ buah. Saklar = efek aktif; ketuk nama untuk membuka parameter. EKSPERIMENTAL: butuh Depth Pipeline aktif; efek warna juga jalan di luar game.");
        final EditText q = new EditText(act);
        q.setHint("cari efek...");
        q.setHintTextColor(SUB);
        q.setTextColor(TEXT);
        q.setSingleLine(true);
        q.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        q.setBackground(rr(ROW, 10));
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
        box.setBackground(rr(ROW, 10));
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
            sw.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
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
        "glossy", "glass", "glossy_amount", "gloss_clarity", "bloom", "highlight", "exposure", "contrast", "gamma", "levels_white",
        "hl_comp", "shadow_strength", "fog_on", "fog_intensity", "fog_density", "fog_start", "fog_opacity", "fog_temp",
        "fog_sat", "fog_bright", "rim_on", "rim_intensity", "rim_r", "rim_g", "rim_b", "rim_rgb", "rim_speed", "rim_width",
        "rim_sharp", "rim_power", "rim_bias", "rim_light", "rim_spread", "gloss_spec", "rim_fade", "ao", "ao_radius", "ao_detail",
        "fog_end", "fog_r", "fog_g", "fog_b", "fog_cmix", "fog_height", "fog_hfall", "fog_dfall", "fog_smooth", "fog_scatter",
        "fog_sky", "fog_adapt", "fog_cam", "rim_soft", "rim_edge", "rim_mat", "refl_rough", "refl_fade", "refl_dist",
        "perf_fps", "perf_batt", "perf_therm", "auto_perf", "fps_target", "perf_ssr", "perf_hdr", "perf_fog", "perf_rim", "perf_ao",
        "hdr_on", "quality",
        "mx_on", "mx_int", "mx_rad", "mx_samples", "mx_rays", "mx_dark", "mx_soft", "mx_fine", "mx_coarse", "mx_nbias", "mx_dbias", "mx_edge", "mx_blur", "mx_denoise", "mx_temp", "mx_res", "mx_qual", "ss_on", "ss_int", "ss_steps", "ss_dist", "ss_thick", "ss_fade", "ss_edge", "ss_floor", "ss_blur", "ss_temp", "ss_res", "ss_qual", "df_on", "df_int", "df_focus", "df_range", "df_near", "df_far", "df_rad", "df_bokeh", "df_shape", "df_samples", "df_aper", "df_focal", "df_trans", "df_fg", "df_bg", "df_auto", "df_smooth", "ol_on", "ol_str", "ol_thick", "ol_sens", "ol_soft", "ol_blend", "ol_start", "ol_end", "ol_sky", "ol_r", "ol_g", "ol_b", "ol_debug", "perf_dof"
    };

    private void qualityRow(LinearLayout p) {
        final String[] names = { "Low", "Medium", "High", "Ultra" };
        for (int i = 0; i < 4; i++) {
            final int q = i;
            button(p, "Shader Quality: " + names[i], () -> { st.set("quality", q); changed(); refreshAll(); notify("Quality " + names[q], true); }, false);
        }
    }

    private void buildMainPage() {
        LinearLayout root0 = page("MAIN");
        LinearLayout p;

        p = group(root0, "Global", "master");
        toggle(p, "ON/OFF Shader", "master");
        slider(p, "Global Shader Intensity", "strength", "%.2f");
        toggle(p, "Mode LIVE: ubah shader Roblox langsung (ON/OFF real-time)", "live");
        qualityRow(p);
        note(p, "Quality: Low = hemat berat (rim mati, HDR/AO ringan), Medium = tanpa ekstra rim/fog, High = penuh, Ultra = pantulan sedikit lebih tajam.");
        toggle(p, "Battery Saver", "perf_batt");
        toggle(p, "Thermal Performance Mode", "perf_therm");
        button(p, "Reset Main Settings", () -> {
            for (String k : MAIN_KEYS) st.set(k, RzState.BY.get(k).def);
            curPreset = "-"; refreshAll(); changed(); notify("Main direset", true);
        }, false);
        button(p, "Restore Defaults", () -> {
            boolean en = st.on("enabled");
            st.resetAll(); st.set("enabled", en ? 1 : 0);
            curPreset = "-"; refreshAll(); changed(); notify("Default dipulihkan", true);
        }, false);

        p = group(root0, "SSR", "ss_on");
        note(p, "Ray-march depth scene; memantulkan avatar/objek. Butuh Depth Pipeline aktif.");
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

        p = group(root0, "MXAO / Ambient Occlusion", "mx_on");
        note(p, "AO Intensity/Radius/Detail mengendalikan SSAO bawaan Roblox (bila map menjalankannya). MXAO memakai depth scene (Depth Pipeline).");
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

        p = group(root0, "DOF - Depth of Field", "df_on");
        note(p, "Blur berdasarkan jarak memakai depth scene (Depth Pipeline).");
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

        p = group(root0, "Outline", "ol_on");
        note(p, "Garis tepi dari lonjakan depth (siluet/lipatan). Butuh Depth Pipeline.");
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

        p = group(root0, "Adaptive Fog", "fog_on");
        note(p, "Tinggi fog memakai asumsi vektor kamera-dunia milik shader; perlu dicek di perangkat.");
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

        p = group(root0, "Rimlight", "rim_on");
        note(p, "Berlaku pada material PBR (butuh normal). Material 'flat' (mis. sebagian baseplate) belum.");
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

        p = group(root0, "HDR & Bloom", "hdr_on");
        note(p, "Threshold/radius bloom dan lens dirt belum tersedia (pass bloom milik engine Roblox).");
        toggle(p, "Enable HDR (highlight/kompresi/bayangan)", "hdr_on");
        slider(p, "Bloom Intensity (penguat bloom engine)", "bloom", "%.2f");
        slider(p, "Highlight Intensity", "highlight", "%.2f");
        slider(p, "HDR Tone Mapping / Highlight Compression", "hl_comp", "%.2f");
        slider(p, "Shadow Strength", "shadow_strength", "%+.2f");
        toggle(p, "Performance Mode (HDR)", "perf_hdr");

        buildColorInto(group(root0, "Warna & Grading", null));

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
        rules.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        rules.setTypeface(Typeface.MONOSPACE);
        rules.setBackground(rr(ROW, 10));
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
        shaderInfo = tv("menunggu engine...", 12, TEXT, false);
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
        String[][] live = {{"glossy", "Glossy"}, {"glass", "Glass"}, {"fog_on", "Fog adaptif"}, {"rim_on", "Rimlight"}, {"hdr_on", "HDR/grading"}};
        for (String[] f : live) {
            boolean on = f[0].equals("glass") ? st.get("glass") > 0.01f : st.on(f[0]);
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
                    fxStatus.setText(fxl.isEmpty() ? "Engine belum melapor. Nyalakan Depth Pipeline lalu masuk ke dalam game."
                            : "Di engine: aktif " + fxOn + " · jalan " + fm.get("fx_run") + " · frame " + fm.get("fx_frames") + " · pass " + fm.get("fx_passes") + " · gagal " + fm.get("fx_fail") + (bad ? "\nError: " + err : ""));
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
                boolean good = state.equals("hooked");
                statusTv.setTextColor(good ? OK : (state.startsWith("waiting") || state.startsWith("menunggu") ? SUB : BAD));
                statusTv.setText(good ? "engine aktif" + (fps.isEmpty() ? "" : " · " + fps + " FPS") : "engine: " + state);
            } catch (Throwable ignore) { }
            h.postDelayed(this, 700);
        }
    };
}
