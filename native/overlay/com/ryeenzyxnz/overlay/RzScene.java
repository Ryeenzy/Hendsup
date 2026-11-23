package com.ryeenzyxnz.overlay;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.BlurMaskFilter;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RadialGradient;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Movie;
import android.graphics.drawable.AnimatedImageDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.SystemClock;
import android.view.View;
import android.view.animation.PathInterpolator;

/**
 * Pratinjau live: pemandangan senja yang digambar lewat Canvas dan bereaksi pada pengaturan shader
 * (fog, bloom, AO, SSR, DOF, outline, rimlight, grading). Hanya gambar contoh, bukan tangkapan layar game.
 */
final class RzScene extends View {
    /** true selama pratinjau ditahan: tampilkan gambar tanpa shader. */
    boolean raw;

    private final RzState st;
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint gp = new Paint();
    private final Path far = new Path(), mid = new Path(), refl = new Path(), fig = new Path();
    private final RectF oval = new RectF();
    private final Shader sky, lake, farG, nearG, sun, vig, fog, bloom;
    private final ColorMatrix cm = new ColorMatrix(), tm = new ColorMatrix();

    // Pratinjau GIF: dibaca dari aset APK (ryeenzyxnz/preview.gif), tidak dapat diganti pengguna dari panel.
    // Android 9+ memakai AnimatedImageDrawable; di bawahnya memakai Movie. Bila gagal dimuat, dipakai gambar senja.
    private Drawable anim;
    private Movie movie;
    private long movieT0;

    boolean gifMode() { return anim != null || movie != null; }

    private void loadGif(Context c) {
        try {
            if (Build.VERSION.SDK_INT >= 28) {
                android.graphics.ImageDecoder.Source src = android.graphics.ImageDecoder.createSource(c.getAssets(), "ryeenzyxnz/preview.gif");
                Drawable d = android.graphics.ImageDecoder.decodeDrawable(src);
                if (d instanceof AnimatedImageDrawable) ((AnimatedImageDrawable) d).setRepeatCount(AnimatedImageDrawable.REPEAT_INFINITE);
                d.setCallback(this);
                anim = d;
            } else {
                java.io.InputStream in = c.getAssets().open("ryeenzyxnz/preview.gif");
                try { movie = Movie.decodeStream(in); } finally { in.close(); }
            }
        } catch (Throwable t) { anim = null; movie = null; }
    }

    /** Jalankan GIF hanya saat panel benar-benar terlihat agar tidak membebani FPS game. */
    private void updatePlay() {
        if (!(anim instanceof AnimatedImageDrawable)) return;
        AnimatedImageDrawable a = (AnimatedImageDrawable) anim;
        boolean play = isAttachedToWindow() && isShown() && getWindowVisibility() == VISIBLE;
        if (play && !a.isRunning()) a.start();
        else if (!play && a.isRunning()) a.stop();
    }

    @Override protected boolean verifyDrawable(Drawable who) { return who == anim || super.verifyDrawable(who); }
    @Override protected void onAttachedToWindow() { super.onAttachedToWindow(); updatePlay(); }
    @Override protected void onDetachedFromWindow() { super.onDetachedFromWindow(); updatePlay(); }
    @Override protected void onVisibilityChanged(View v, int vis) { super.onVisibilityChanged(v, vis); updatePlay(); }
    @Override protected void onWindowVisibilityChanged(int vis) { super.onWindowVisibilityChanged(vis); updatePlay(); }

    private boolean drawGif(Canvas c, float w, float h) {
        if (anim != null) {
            anim.setBounds(0, 0, Math.round(w), Math.round(h));
            anim.draw(c);
            return true;
        }
        if (movie != null && movie.width() > 0 && movie.height() > 0) {
            int dur = movie.duration();
            if (dur > 0) {
                long now = SystemClock.uptimeMillis();
                if (movieT0 == 0) movieT0 = now;
                movie.setTime((int) ((now - movieT0) % dur));
            }
            c.save();
            c.scale(w / movie.width(), h / movie.height());
            movie.draw(c, 0, 0);
            c.restore();
            if (dur > 0 && isShown()) postInvalidateOnAnimation();
            return true;
        }
        return false;
    }

    RzScene(Context c, RzState s) {
        super(c);
        st = s;
        loadGif(c);
        setLayerType(anim != null ? LAYER_TYPE_NONE : LAYER_TYPE_SOFTWARE, null);
        Shader.TileMode cl = Shader.TileMode.CLAMP;
        sky = new LinearGradient(0, 0, 0, 120, new int[] { 0xFF16224A, 0xFF8A4F6B, 0xFFE9855A, 0xFFF6C27A }, new float[] { 0f, .45f, .75f, 1f }, cl);
        lake = new LinearGradient(0, 120, 0, 200, new int[] { 0xFFE9855A, 0xFF4A3A63, 0xFF141A33 }, new float[] { 0f, .5f, 1f }, cl);
        farG = new LinearGradient(0, 58, 0, 124, 0xFF4A3A63, 0xFF2A2548, cl);
        nearG = new LinearGradient(0, 100, 0, 124, 0xFF1C1A33, 0xFF0D0D1C, cl);
        sun = new RadialGradient(200, 96, 22, new int[] { 0xFFFFF3CF, 0xFFFFD58A, 0x00FFB35C }, new float[] { 0f, .45f, 1f }, cl);
        vig = new RadialGradient(160, 100, 200, new int[] { 0x00000000, 0x00000000, 0xFF000000 }, new float[] { 0f, .45f, 1f }, cl);
        fog = new LinearGradient(0, 60, 0, 160, new int[] { 0x00E8DCCF, 0x00E8DCCF, 0xFFE8DCCF, 0x00E8DCCF }, new float[] { 0f, .3f, .62f, 1f }, cl);
        bloom = new RadialGradient(200, 96, 46, 0xFFFFD58A, 0x00FFD58A, cl);

        far.moveTo(0, 110); far.lineTo(38, 72); far.lineTo(64, 96); far.lineTo(104, 58); far.lineTo(150, 104);
        far.lineTo(196, 84); far.lineTo(240, 108); far.lineTo(280, 76); far.lineTo(320, 104); far.lineTo(320, 124); far.lineTo(0, 124); far.close();
        refl.moveTo(0, 130); refl.lineTo(38, 168); refl.lineTo(64, 144); refl.lineTo(104, 182); refl.lineTo(150, 136);
        refl.lineTo(196, 156); refl.lineTo(240, 132); refl.lineTo(280, 164); refl.lineTo(320, 136); refl.lineTo(320, 120); refl.lineTo(0, 120); refl.close();
        mid.moveTo(0, 120); mid.lineTo(30, 104); mid.lineTo(70, 118); mid.lineTo(120, 100); mid.lineTo(170, 120);
        mid.lineTo(230, 106); mid.lineTo(290, 122); mid.lineTo(320, 112); mid.lineTo(320, 124); mid.lineTo(0, 124); mid.close();
        fig.moveTo(0, 28); fig.lineTo(0, 14); fig.quadTo(0, 8, 6, 8); fig.lineTo(10, 8); fig.quadTo(16, 8, 16, 14); fig.lineTo(16, 28); fig.close();
    }

    @Override
    protected void onMeasure(int wSpec, int hSpec) {
        int w = View.MeasureSpec.getSize(wSpec);
        setMeasuredDimension(w, Math.round(w * 0.5625f));
    }

    private float n(String key) {
        RzState.Key k = RzState.BY.get(key);
        if (k == null || k.hi <= k.lo) return 0f;
        return Math.max(0f, Math.min(1f, (st.get(key) - k.lo) / (k.hi - k.lo)));
    }

    private float fx(boolean on, String onKey, String key) { return on && st.on(onKey) ? n(key) : 0f; }

    @Override
    protected void onDraw(Canvas c) {
        float w = getWidth(), h = getHeight();
        if (w <= 0 || h <= 0) return;
        if (drawGif(c, w, h)) return;
        boolean on = !raw && st.on("enabled");
        float str = on ? Math.max(0f, Math.min(1f, st.get("strength"))) : 0f;
        float ssr = fx(on, "ss_on", "ss_int") * str, ao = fx(on, "mx_on", "mx_int") * str, dof = fx(on, "df_on", "df_int") * str;
        float ol = fx(on, "ol_on", "ol_str") * str, fg = fx(on, "fog_on", "fog_intensity") * str, rim = fx(on, "rim_on", "rim_intensity") * str;
        float bl = fx(on, "hdr_on", "bloom") * str;
        float br = on ? st.get("brightness") * str + st.get("exposure") * 0.12f * str : 0f;
        float ct = on ? st.get("contrast") * str : 0f, sa = on ? st.get("saturation") * str : 0f, wm = on ? st.get("warmth") * str : 0f;

        cm.setSaturation(1f + sa);
        float k = 1f + ct, gain = 1f + br + bl * 0.04f, off = (1f - k) * 127.5f;
        tm.set(new float[] {
                k * gain * (1f + wm * .12f), 0, 0, 0, off,
                0, k * gain, 0, 0, off,
                0, 0, k * gain * (1f - wm * .12f), 0, off,
                0, 0, 0, 1, 0 });
        cm.postConcat(tm);
        gp.setColorFilter(new ColorMatrixColorFilter(cm));

        int sc = c.saveLayer(0, 0, w, h, gp);
        c.scale(w / 320f, h / 200f);

        // langit (tidak diburamkan agar tepinya bersih)
        p.setStyle(Paint.Style.FILL);
        p.setShader(sky); c.drawRect(0, 0, 320, 120, p);
        p.setShader(null); p.setColor(0xB3FFFFFF);
        c.drawCircle(40, 22, .9f, p); c.drawCircle(120, 12, .7f, p); c.drawCircle(220, 28, .8f, p);
        c.drawCircle(270, 14, .9f, p); c.drawCircle(170, 30, .6f, p);
        // matahari dan gunung jauh: kena DOF
        p.setMaskFilter(dof > 0.02f ? new BlurMaskFilter(Math.max(0.5f, dof * 3.2f), BlurMaskFilter.Blur.NORMAL) : null);
        p.setShader(sun); c.drawCircle(200, 96, 22, p);
        p.setShader(null); p.setColor(0xFFFFF3CF); c.drawCircle(200, 96, 9, p);
        p.setShader(farG); c.drawPath(far, p);
        p.setMaskFilter(null);

        // danau dan pantulan: kuat-lemahnya ikut SSR
        int l2 = c.saveLayerAlpha(0, 0, 320, 200, (int) (255 * (0.35f + ssr * 0.65f)));
        p.setShader(lake); c.drawRect(0, 120, 320, 200, p);
        p.setShader(null); p.setColor(0x8C2A2548); c.drawPath(refl, p);
        p.setColor(0x80FFD58A); oval.set(192, 112, 208, 148); c.drawOval(oval, p);
        c.restoreToCount(l2);

        // kabut
        if (fg > 0.01f) { p.setShader(fog); p.setAlpha((int) (255 * fg * .75f)); c.drawRect(0, 60, 320, 160, p); p.setAlpha(255); }

        // punggungan depan + outline
        p.setShader(nearG); c.drawPath(mid, p);
        if (ol > 0.01f) {
            p.setShader(null); p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(1.4f);
            p.setColor(0xFFFFFFFF); p.setAlpha((int) (255 * ol)); c.drawPath(mid, p);
            p.setAlpha(255); p.setStyle(Paint.Style.FILL);
        }

        // karakter + rimlight
        c.save(); c.translate(76, 96);
        p.setShader(null); p.setColor(0xFF0D0D1C); p.setStyle(Paint.Style.FILL);
        c.drawPath(fig, p); c.drawCircle(8, 3, 5, p);
        float edge = Math.max(rim, ol * .8f);
        if (edge > 0.01f) {
            p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(1.4f); p.setColor(0xFFFFD58A); p.setAlpha((int) (255 * Math.min(1f, edge)));
            c.drawPath(fig, p); c.drawCircle(8, 3, 5, p);
            p.setAlpha(255); p.setStyle(Paint.Style.FILL);
        }
        c.restore();

        // bloom dan vignette (AO)
        if (bl > 0.01f) { p.setShader(bloom); p.setAlpha((int) (255 * Math.min(1f, bl * .9f))); c.drawCircle(200, 96, 46, p); p.setAlpha(255); }
        if (ao > 0.01f) { p.setShader(vig); p.setAlpha((int) (255 * ao * .85f)); c.drawRect(0, 0, 320, 200, p); p.setAlpha(255); }
        p.setShader(null);
        c.restoreToCount(sc);
    }
}

/** Garis grafik FPS kecil. */
final class RzSpark extends View {
    private final float[] v = new float[24];
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Path path = new Path();
    private boolean any;

    RzSpark(Context c, int color, float strokePx) {
        super(c);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeWidth(strokePx);
        p.setStrokeJoin(Paint.Join.ROUND);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setColor(color);
    }

    void push(float x) {
        System.arraycopy(v, 1, v, 0, v.length - 1);
        v[v.length - 1] = x;
        any = true;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas c) {
        float w = getWidth(), h = getHeight(), pad = p.getStrokeWidth();
        path.reset();
        for (int i = 0; i < v.length; i++) {
            float t = any ? Math.max(0f, Math.min(1f, (v[i] - 40f) / 22f)) : 0.5f;
            float x = pad + i * (w - 2 * pad) / (v.length - 1), y = h - pad - t * (h - 2 * pad);
            if (i == 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
        c.drawPath(path, p);
    }
}

/** Saklar kecil dengan geser halus. */
final class RzSwitch extends View {
    private static final int OFF = 0xFF2A2A2D, KNOB_OFF = 0xFF65676C, KNOB_ON = 0xFFEDEDEE;
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF r = new RectF();
    private final float u;
    private final int accent;
    private float f;
    private boolean on;
    private ValueAnimator an;

    RzSwitch(Context c, float unit, int accentColor) {
        super(c);
        u = unit;
        accent = accentColor;
    }

    boolean isOn() { return on; }

    void setOn(boolean o, boolean animate) {
        if (o == on) return;
        on = o;
        if (an != null) an.cancel();
        if (!animate || !isAttachedToWindow()) { f = o ? 1f : 0f; invalidate(); return; }
        an = ValueAnimator.ofFloat(f, o ? 1f : 0f);
        an.setDuration(260);
        an.setInterpolator(new PathInterpolator(.22f, 1f, .36f, 1f));
        an.addUpdateListener(a -> { f = (Float) a.getAnimatedValue(); invalidate(); });
        an.start();
    }

    private static int mix(int a, int b, float t) {
        int ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
        return 0xFF000000 | ((int) (ar + (br - ar) * t) << 16) | ((int) (ag + (bg - ag) * t) << 8) | (int) (ab + (bb - ab) * t);
    }

    @Override
    protected void onMeasure(int w, int h) { setMeasuredDimension(Math.round(34 * u), Math.round(20 * u)); }

    @Override
    protected void onDraw(Canvas c) {
        float w = getWidth(), h = getHeight();
        p.setColor(mix(OFF, accent, f));
        r.set(0, 0, w, h);
        c.drawRoundRect(r, h / 2f, h / 2f, p);
        p.setColor(mix(KNOB_OFF, KNOB_ON, f));
        c.drawCircle(h / 2f + f * (w - h), h / 2f, 7f * u, p);
    }
}
