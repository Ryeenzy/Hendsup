package com.ryeenzyxnz.overlay;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Locale;

/** Pengaturan tampilan panel (rz_ui.cfg): transparansi, ukuran, ukuran tombol, warna aksen. */
final class RzUi {
    static final int[] ACCENTS = { 0xFF8BD13F, 0xFFD4D4D8, 0xFF5EEAD4, 0xFF7AA7FF, 0xFFE8B84A, 0xFFFF6B6B, 0xFFFF9F43, 0xFFFF7EB6, 0xFFB388FF, 0xFF4DD0FF };
    static final int[] ACCENTS2 = { 0xFF6FB02A, 0xFF9B9DA2, 0xFF2FBFA8, 0xFF4F7FE0, 0xFFC99A2A, 0xFFD94848, 0xFFDB7E22, 0xFFD9558F, 0xFF8E5FE0, 0xFF22A8D9 };
    static final String[] FONT_NAMES = { "Chakra Petch", "Rajdhani", "Share Tech Mono" };
    static final String[] FONT_MED = { "ChakraPetch-Medium.ttf", "Rajdhani-Medium.ttf", "ShareTechMono-Regular.ttf" };
    static final String[] FONT_BOLD = { "ChakraPetch-SemiBold.ttf", "Rajdhani-SemiBold.ttf", "ShareTechMono-Regular.ttf" };
    static final String[] THEME_NAMES = { "Liquid Glass", "Solid" };
    static final String[] ACCENT_NAMES = { "Hijau", "Perak", "Tosca", "Biru", "Emas", "Merah", "Oranye", "Pink", "Ungu", "Cyan" };

    float opacity = 0.97f, scale = 1f, fabSize = 54f, fabOpacity = 1f;
    int accent = 0, font = 0, theme = 0;
    private final File f;

    RzUi(File dir) {
        f = new File(dir, "rz_ui.cfg");
        try {
            if (!f.exists()) return;
            for (String line : RzFx.readAll(new FileInputStream(f)).split("\n")) {
                int eq = line.indexOf('=');
                if (eq <= 0) continue;
                String k = line.substring(0, eq).trim(), v = line.substring(eq + 1).trim();
                try {
                    float x = Float.parseFloat(v);
                    if (k.equals("opacity")) opacity = Math.max(0.5f, Math.min(1f, x));
                    else if (k.equals("scale")) scale = Math.max(0.7f, Math.min(1.25f, x));
                    else if (k.equals("fab_size")) fabSize = Math.max(40f, Math.min(80f, x));
                    else if (k.equals("fab_opacity")) fabOpacity = Math.max(0.3f, Math.min(1f, x));
                    else if (k.equals("accent")) accent = Math.max(0, Math.min(ACCENTS.length - 1, (int) x));
                    else if (k.equals("font")) font = Math.max(0, Math.min(FONT_NAMES.length - 1, (int) x));
                    else if (k.equals("theme")) theme = Math.max(0, Math.min(THEME_NAMES.length - 1, (int) x));
                } catch (NumberFormatException ignore) { }
            }
        } catch (Throwable ignore) { }
    }

    void save() {
        try {
            FileOutputStream o = new FileOutputStream(f);
            o.write(String.format(Locale.US, "opacity=%.3f\nscale=%.3f\nfab_size=%.1f\nfab_opacity=%.3f\naccent=%d\nfont=%d\ntheme=%d\n", opacity, scale, fabSize, fabOpacity, accent, font, theme).getBytes("UTF-8"));
            o.close();
        } catch (Throwable ignore) { }
    }

    void reset() { opacity = 0.97f; scale = 1f; fabSize = 54f; fabOpacity = 1f; accent = 0; font = 0; theme = 0; }
}
