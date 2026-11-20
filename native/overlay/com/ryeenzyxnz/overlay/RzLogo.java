package com.ryeenzyxnz.overlay;

import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;

/** Gambar bitmap yang dipotong bulat (untuk tombol RZ). */
final class RzLogo extends Drawable {
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
    private final Paint ring = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final BitmapShader shader;
    private final Bitmap bmp;

    RzLogo(Bitmap b, int ringColor, float ringPx) {
        bmp = b;
        shader = new BitmapShader(b, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        paint.setShader(shader);
        ring.setStyle(Paint.Style.STROKE);
        ring.setStrokeWidth(ringPx);
        ring.setColor(ringColor);
    }

    @Override
    public void draw(Canvas c) {
        float w = getBounds().width(), h = getBounds().height();
        if (w <= 0 || h <= 0) return;
        Matrix m = new Matrix();
        m.setScale(w / bmp.getWidth(), h / bmp.getHeight());
        shader.setLocalMatrix(m);
        float r = Math.min(w, h) / 2f;
        c.drawCircle(w / 2f, h / 2f, r, paint);
        c.drawCircle(w / 2f, h / 2f, r - ring.getStrokeWidth() / 2f, ring);
    }

    @Override public void setAlpha(int a) { paint.setAlpha(a); ring.setAlpha(a); }
    @Override public void setColorFilter(ColorFilter f) { paint.setColorFilter(f); }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
}
