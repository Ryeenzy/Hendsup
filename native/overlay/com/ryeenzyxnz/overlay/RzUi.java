package com.ryeenzyxnz.overlay;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Locale;

/** Pengaturan tampilan panel (rz_ui.cfg): transparansi, ukuran, ukuran tombol, warna aksen. */
final class RzUi {
    static final int[] ACCENTS = { 0xFFD4D4D8, 0xFF5EEAD4, 0xFFA78BFA, 0xFFF87171, 0xFFFBBF24 };
    static final int[] ACCENTS2 = { 0xFF8E9196, 0xFF14B8A6, 0xFF7C3AED, 0xFFDC2626, 0xFFD97706 };
    static final String[] FONT_NAMES = { "Rajdhani", "Chakra Petch", "Share Tech Mono" };
    static final String[] FONT_MED = { "Rajdhani-Medium.ttf", "ChakraPetch-Medium.ttf", "ShareTechMono-Regular.ttf" };
    static final String[] FONT_BOLD = { "Rajdhani-SemiBold.ttf", "ChakraPetch-SemiBold.ttf", "ShareTechMono-Regular.ttf" };
    static final String[] ACCENT_NAMES = { "Perak", "Tosca", "Ungu", "Merah", "Emas" };

    float opacity = 0.97f, scale = 1f, fabSize = 54f, fabOpacity = 1f;
    int accent = 0, font = 0;
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
                } catch (NumberFormatException ignore) { }
            }
        } catch (Throwable ignore) { }
    }

    void save() {
        try {
            FileOutputStream o = new FileOutputStream(f);
            o.write(String.format(Locale.US, "opacity=%.3f\nscale=%.3f\nfab_size=%.1f\nfab_opacity=%.3f\naccent=%d\nfont=%d\n", opacity, scale, fabSize, fabOpacity, accent, font).getBytes("UTF-8"));
            o.close();
        } catch (Throwable ignore) { }
    }

    void reset() { opacity = 0.97f; scale = 1f; fabSize = 54f; fabOpacity = 1f; accent = 0; font = 0; }
}
