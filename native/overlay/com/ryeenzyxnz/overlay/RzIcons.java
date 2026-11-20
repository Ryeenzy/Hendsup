package com.ryeenzyxnz.overlay;

import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;

/** Ikon garis sederhana yang digambar lewat Canvas (tanpa berkas gambar). */
final class RzIcons extends Drawable {
    static final int MAIN = 0, PRESET = 1, SETTING = 2, CREDIT = 3, FEEDBACK = 4, SAVE = 5, IMPORT = 6, EXPORT = 7, SEND = 8, RESET = 9, EFFECT = 10;

    private final int type;
    private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final int size;

    RzIcons(int type, int sizePx, int color) {
        this.type = type;
        this.size = sizePx;
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setStrokeJoin(Paint.Join.ROUND);
        p.setStrokeWidth(Math.max(1.5f, sizePx / 11f));
        p.setColor(color);
        setBounds(0, 0, sizePx, sizePx);
    }

    void setColor(int c) { p.setColor(c); invalidateSelf(); }

    @Override public int getIntrinsicWidth() { return size; }
    @Override public int getIntrinsicHeight() { return size; }
    @Override public void setAlpha(int a) { p.setAlpha(a); }
    @Override public void setColorFilter(ColorFilter f) { p.setColorFilter(f); }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }

    @Override
    public void draw(Canvas c) {
        float s = size, m = s * 0.14f, a = m, b = s - m, mid = s / 2f;
        Path q = new Path();
        switch (type) {
            case MAIN: {   // 4 kotak
                float g = s * 0.09f;
                c.drawRoundRect(new RectF(a, a, mid - g, mid - g), 2, 2, p);
                c.drawRoundRect(new RectF(mid + g, a, b, mid - g), 2, 2, p);
                c.drawRoundRect(new RectF(a, mid + g, mid - g, b), 2, 2, p);
                c.drawRoundRect(new RectF(mid + g, mid + g, b, b), 2, 2, p);
                break;
            }
            case PRESET: {   // tumpukan lapisan
                q.moveTo(mid, a); q.lineTo(b, s * 0.36f); q.lineTo(mid, s * 0.52f); q.lineTo(a, s * 0.36f); q.close();
                c.drawPath(q, p);
                q.reset(); q.moveTo(a, s * 0.54f); q.lineTo(mid, s * 0.70f); q.lineTo(b, s * 0.54f);
                c.drawPath(q, p);
                q.reset(); q.moveTo(a, s * 0.72f); q.lineTo(mid, s * 0.88f); q.lineTo(b, s * 0.72f);
                c.drawPath(q, p);
                break;
            }
            case SETTING: {   // tiga slider
                float[] y = { s * 0.25f, s * 0.5f, s * 0.75f }, x = { s * 0.65f, s * 0.35f, s * 0.58f };
                for (int i = 0; i < 3; i++) {
                    c.drawLine(a, y[i], b, y[i], p);
                    p.setStyle(Paint.Style.FILL);
                    c.drawCircle(x[i], y[i], s * 0.09f, p);
                    p.setStyle(Paint.Style.STROKE);
                }
                break;
            }
            case EFFECT: {   // bintang percikan (efek)
                q.moveTo(mid, a); q.lineTo(s * 0.60f, s * 0.40f); q.lineTo(b, mid); q.lineTo(s * 0.60f, s * 0.60f);
                q.lineTo(mid, b); q.lineTo(s * 0.40f, s * 0.60f); q.lineTo(a, mid); q.lineTo(s * 0.40f, s * 0.40f); q.close();
                c.drawPath(q, p);
                break;
            }
            case CREDIT: {   // lingkaran info
                c.drawCircle(mid, mid, mid - m, p);
                c.drawLine(mid, s * 0.46f, mid, s * 0.70f, p);
                p.setStyle(Paint.Style.FILL);
                c.drawCircle(mid, s * 0.31f, s * 0.05f, p);
                p.setStyle(Paint.Style.STROKE);
                break;
            }
            case FEEDBACK: {   // balon bicara
                c.drawRoundRect(new RectF(a, a, b, s * 0.68f), s * 0.12f, s * 0.12f, p);
                q.moveTo(s * 0.34f, s * 0.68f); q.lineTo(s * 0.28f, s * 0.88f); q.lineTo(s * 0.52f, s * 0.68f);
                c.drawPath(q, p);
                break;
            }
            case SAVE: {   // panah turun ke nampan
                c.drawLine(mid, a, mid, s * 0.62f, p);
                q.moveTo(s * 0.32f, s * 0.46f); q.lineTo(mid, s * 0.64f); q.lineTo(s * 0.68f, s * 0.46f);
                c.drawPath(q, p);
                q.reset(); q.moveTo(a, s * 0.70f); q.lineTo(a, b); q.lineTo(b, b); q.lineTo(b, s * 0.70f);
                c.drawPath(q, p);
                break;
            }
            case IMPORT: {   // panah masuk ke kiri-bawah
                c.drawLine(b, a, s * 0.4f, s * 0.6f, p);
                q.moveTo(s * 0.34f, s * 0.38f); q.lineTo(s * 0.34f, s * 0.66f); q.lineTo(s * 0.62f, s * 0.66f);
                c.drawPath(q, p);
                break;
            }
            case EXPORT: {   // panah keluar
                c.drawLine(a, b, s * 0.62f, s * 0.38f, p);
                q.moveTo(s * 0.4f, s * 0.3f); q.lineTo(s * 0.7f, s * 0.3f); q.lineTo(s * 0.7f, s * 0.6f);
                c.drawPath(q, p);
                break;
            }
            case SEND: {   // pesawat kertas
                q.moveTo(a, mid); q.lineTo(b, a); q.lineTo(s * 0.62f, b); q.lineTo(s * 0.46f, s * 0.58f); q.close();
                c.drawPath(q, p);
                c.drawLine(b, a, s * 0.46f, s * 0.58f, p);
                break;
            }
            case RESET: {   // panah melingkar
                c.drawArc(new RectF(a, a, b, b), 40, 280, false, p);
                q.moveTo(s * 0.66f, s * 0.12f); q.lineTo(s * 0.74f, s * 0.32f); q.lineTo(s * 0.54f, s * 0.30f);
                c.drawPath(q, p);
                break;
            }
            default: break;
        }
    }
}
