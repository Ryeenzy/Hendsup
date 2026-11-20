package com.ryeenzyxnz.overlay;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class RzTest {
    static int fails = 0;
    static void check(boolean ok, String what) { System.out.println((ok ? "PASS " : "FAIL ") + what); if (!ok) fails++; }
    static boolean near(float a, float b) { return Math.abs(a - b) < 0.01f; }

    public static void main(String[] a) throws Exception {
        RzIni.Result r = RzIni.fromText(RzPresets.RODS_INI);
        check(r.techniques == 9, "9 teknik terbaca: " + r.techniques);
        check(r.applied.size() == 7 && r.ignored.size() == 2, "7 diterapkan / 2 diabaikan: " + r.applied.size() + "/" + r.ignored.size());
        Map<String, Float> c = r.cfg;
        check(near(c.get("levels_black"), 13f / 255) && near(c.get("levels_white"), 207f / 255), "Levels 13/207 tepat");
        check(near(c.get("bloom"), 0.48f) && near(c.get("bloom_threshold"), 0.70f), "Bloom 0.48 / thr 0.70");
        check(near(c.get("glossy_amount"), 0.5f) && c.get("glossy") == 1f, "SSR -> glossy 0.5");
        check(near(c.get("ao"), 0.47f), "MXAO -> ao 0.47: " + c.get("ao"));
        check(c.get("dof") == 1f && near(c.get("dof_amount"), 0.49f) && near(c.get("dof_radius"), 0.31f), "DOF 0.49 / radius 0.31");
        check(near(c.get("curves"), 0.27f), "Curves 0.27: " + c.get("curves"));
        for (String l : r.applied) System.out.println("  + " + l);
        for (String l : r.ignored) System.out.println("  - " + l);

        // CRLF + BOM + komentar + section tanpa Techniques
        RzIni.Result r2 = RzIni.fromText("﻿; komentar\r\n[Levels.fx]\r\nBlackPoint=20\r\nWhitePoint=230\r\n[RYEENZYXNZ]\r\nglossy=0.4\r\ndof=1\r\nsunrays=0.2\r\n");
        check(r2.techniques == 1 && near(r2.cfg.get("levels_black"), 20f / 255), "CRLF/BOM/tanpa Techniques");
        check(near(r2.cfg.get("glossy_amount"), 0.4f) && r2.cfg.get("dof") == 1f && near(r2.cfg.get("sunrays_amount"), 0.2f), "[RYEENZYXNZ] glossy/dof/sunrays");
        RzIni.Result r3 = RzIni.fromText("sampah === \n[[[");
        check(r3.techniques == 0 && r3.applied.isEmpty(), "sampah tidak bikin crash");

        // State + format file untuk native
        File d = new File(System.getProperty("java.io.tmpdir"), "rztest"); d.mkdirs();
        RzState st = new RzState(d);
        st.set("enabled", 1);
        st.set("strength", 0.8f);
        st.applyPreset(c);
        check(st.on("enabled") && near(st.get("strength"), 0.8f), "preset tidak menimpa enabled/strength");
        check(near(st.get("levels_white"), 207f / 255), "preset diterapkan ke state");
        st.set("brightness", 99f);
        check(st.get("brightness") == 0.5f, "clamp ke rentang");
        st.save();
        String text = new String(java.nio.file.Files.readAllBytes(new File(d, "rz_config.cfg").toPath()), "UTF-8");
        System.out.println(text);
        java.nio.file.Files.write(new File("/tmp/rz_config_from_java.cfg").toPath(), text.getBytes("UTF-8"));
        check(new RzState(d).on("enabled"), "baca ulang dari file");
        // Parsing JSON preset (RzPresetsRemote) dipakai org.json, yang di jalur test CI ini
        // cuma kerangka kompilasi dari android.jar (bukan implementasi beneran) -> tidak bisa
        // dieksekusi di sini. Yang bisa dites tanpa itu: belum pernah ambil dari server = kosong.
        check(RzPresets.builtin(d).isEmpty(), "preset kosong sebelum pernah diambil dari server");
        System.exit(fails == 0 ? 0 : 1);
    }
}
