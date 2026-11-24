package com.ryeenzyxnz.overlay;

import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Region;
import android.graphics.drawable.Drawable;

/**
 * Bayangan lembut buatan sendiri di sekeliling panel (tidak bergantung pada elevation Android).
 * Beberapa lapis persegi bulat tipis ditumpuk sehingga makin pekat mendekati tepi panel; bagian di bawah panel
 * dilubangi agar permukaan kaca tidak menjadi gelap.
 */
final class RzShadow extends Drawable {
    private static final int LAYERS = 14;
    private final float margin, radius, dy;
    private final int alpha;
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF r = new RectF(), hole = new RectF();
    private final Path holePath = new Path();

    RzShadow(float marginPx, float radiusPx, int layerAlpha) {
        margin = marginPx; radius = radiusPx; alpha = layerAlpha; dy = marginPx * 0.3f;
    }

    @Override
    protected void onBoundsChange(Rect b) {
        hole.set(b.left + margin, b.top + margin, b.right - margin, b.bottom - margin);
        holePath.reset();
        holePath.addRoundRect(hole, radius, radius, Path.Direction.CW);
    }

    @Override
    public void draw(Canvas c) {
        Rect b = getBounds();
        if (b.width() <= 0) return;
        int save = c.save();
        try { c.clipPath(holePath, Region.Op.DIFFERENCE); } catch (Throwable ignored) { }
        p.setColor(alpha << 24);
        for (int k = 0; k < LAYERS; k++) {
            float e = margin * (LAYERS - k) / LAYERS;
            r.set(hole.left - e, hole.top - e + dy, hole.right + e, hole.bottom + e + dy);
            c.drawRoundRect(r, radius + e, radius + e, p);
        }
        c.restoreToCount(save);
    }

    @Override public void setAlpha(int a) { }
    @Override public void setColorFilter(ColorFilter cf) { }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
}
