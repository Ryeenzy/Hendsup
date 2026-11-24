package com.ryeenzyxnz.overlay;

import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.LinearGradient;
import android.graphics.Outline;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.RadialGradient;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;

/**
 * Permukaan "liquid glass" yang digambar lewat Canvas: dasar tembus pandang, pantulan lensa di kiri atas,
 * cahaya kaustik berwarna aksen di kanan bawah, kilau di sisi atas, dan tepi kaca yang terang di dua sudut
 * berlawanan. Tidak memburamkan isi di belakangnya (Android tidak mengizinkan itu untuk overlay).
 */
final class RzGlass extends Drawable {
    /** level 0 = panel besar, 1 = kartu/kontainer kecil. */
    private final float radius, stroke;
    private final int accent, level;
    private final Paint base = new Paint(Paint.ANTI_ALIAS_FLAG), lens = new Paint(Paint.ANTI_ALIAS_FLAG),
            caustic = new Paint(Paint.ANTI_ALIAS_FLAG), sheen = new Paint(Paint.ANTI_ALIAS_FLAG),
            rim = new Paint(Paint.ANTI_ALIAS_FLAG), rimIn = new Paint(Paint.ANTI_ALIAS_FLAG),
            line = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF body = new RectF(), edge = new RectF(), inner = new RectF();
    private float lineY, lineX0, lineX1;

    RzGlass(float radiusPx, float strokePx, int accentColor, int lvl) {
        radius = radiusPx; stroke = Math.max(1f, strokePx); accent = accentColor; level = lvl;
        rim.setStyle(Paint.Style.STROKE); rim.setStrokeWidth(stroke);
        rimIn.setStyle(Paint.Style.STROKE); rimIn.setStrokeWidth(stroke);
        line.setStyle(Paint.Style.STROKE); line.setStrokeWidth(Math.max(1f, stroke * 0.8f)); line.setStrokeCap(Paint.Cap.ROUND);
    }

    private static int a(int color, int alpha) { return (color & 0x00FFFFFF) | (alpha << 24); }

    @Override
    protected void onBoundsChange(Rect b) {
        float w = b.width(), h = b.height();
        if (w <= 0 || h <= 0) return;
        boolean big = level == 0;
        float half = stroke / 2f;
        body.set(b.left, b.top, b.right, b.bottom);
        edge.set(b.left + half, b.top + half, b.right - half, b.bottom - half);
        inner.set(b.left + stroke * 1.6f, b.top + stroke * 1.6f, b.right - stroke * 1.6f, b.bottom - stroke * 1.6f);
        base.setShader(new LinearGradient(b.left, b.top, b.left, b.bottom,
                big ? 0x8C202436 : 0x30FFFFFF, big ? 0x9A090A12 : 0x0CFFFFFF, Shader.TileMode.CLAMP));
        float lr = Math.max(w, h) * (big ? 0.75f : 0.9f);
        lens.setShader(new RadialGradient(b.left + w * 0.18f, b.top + h * 0.06f, lr,
                new int[] { big ? 0x44FFFFFF : 0x2CFFFFFF, 0x00FFFFFF }, null, Shader.TileMode.CLAMP));
        caustic.setShader(new RadialGradient(b.left + w * 0.88f, b.top + h * 1.02f, Math.max(w, h) * 0.7f,
                new int[] { a(accent, big ? 0x3A : 0x22), a(accent, 0) }, null, Shader.TileMode.CLAMP));
        sheen.setShader(new LinearGradient(b.left, b.top, b.left, b.top + h * (big ? 0.38f : 0.55f),
                big ? 0x2CFFFFFF : 0x1AFFFFFF, 0x00FFFFFF, Shader.TileMode.CLAMP));
        rim.setShader(new LinearGradient(b.left, b.top, b.right, b.bottom,
                new int[] { 0xE0FFFFFF, 0x18FFFFFF, 0x10FFFFFF, 0x90FFFFFF }, new float[] { 0f, 0.32f, 0.7f, 1f }, Shader.TileMode.CLAMP));
        rimIn.setShader(new LinearGradient(b.left, b.top, b.right, b.bottom,
                new int[] { 0x30FFFFFF, 0x00FFFFFF, 0x00FFFFFF, 0x24FFFFFF }, new float[] { 0f, 0.35f, 0.7f, 1f }, Shader.TileMode.CLAMP));
        lineY = b.top + stroke * 2.2f;
        lineX0 = b.left + radius * 0.9f; lineX1 = b.right - radius * 0.9f;
        line.setShader(new LinearGradient(lineX0, 0, lineX1, 0,
                new int[] { 0x00FFFFFF, 0xA0FFFFFF, 0x00FFFFFF }, new float[] { 0f, 0.28f, 1f }, Shader.TileMode.CLAMP));
    }

    @Override
    public void draw(Canvas c) {
        if (body.width() <= 0) return;
        float r = radius;
        c.drawRoundRect(body, r, r, base);
        c.drawRoundRect(body, r, r, caustic);
        c.drawRoundRect(body, r, r, lens);
        c.drawRoundRect(body, r, r, sheen);
        c.drawRoundRect(inner, Math.max(0f, r - stroke * 1.6f), Math.max(0f, r - stroke * 1.6f), rimIn);
        c.drawRoundRect(edge, r - stroke / 2f, r - stroke / 2f, rim);
        if (lineX1 > lineX0) c.drawLine(lineX0, lineY, lineX1, lineY, line);
    }

    @Override public void getOutline(Outline o) { o.setRoundRect(getBounds(), radius); }
    @Override public void setAlpha(int alpha) { }
    @Override public void setColorFilter(ColorFilter cf) { }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
}
