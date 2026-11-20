package com.ryeenzyxnz.overlay;
import java.io.*;
public class RzFxTest {
    static void ck(boolean c, String m) { if (!c) { System.out.println("GAGAL: " + m); System.exit(1); } }
    public static void main(String[] a) throws Exception {
        File d = new File(a[1]); d.mkdirs();
        RzFx fx = new RzFx(d);
        ck(fx.loadIndex(RzFx.readAll(new FileInputStream(a[0]))), "loadIndex");
        ck(fx.effects.size() > 80, "jumlah efek " + fx.effects.size());
        RzFx.Fx o = fx.find("PrismShade_Outline");
        ck(o != null && o.uniforms.size() == 10, "outline uniform");
        RzFx.U col = null, blend = null, str = null;
        for (RzFx.U u : o.uniforms) { if (u.name.equals("OutlineColor")) col = u; if (u.name.equals("BlendMode")) blend = u; if (u.name.equals("Strength")) str = u; }
        ck(col != null && col.isColor() && col.n == 3, "warna");
        ck(blend != null && blend.isCombo() && blend.items.size() == 3, "combo");
        ck(str != null && str.hasMin && str.hasMax && str.max == 1f && Math.abs(str.def[0] - 0.8f) < 1e-6, "slider");
        String ini = "Techniques=MXAO@qUINT_mxao.fx,Outline@PrismShade_Outline.fx\n[qUINT_mxao.fx]\nMXAO_SSAO_AMOUNT=3.000000\nMXAO_SAMPLE_RADIUS=2.000000\n[PrismShade_Outline.fx]\nStrength=0.5\nOutlineColor=1.0,0.2,0.1\nSkyEdges=0\n";
        int used = fx.applyIni(ini);
        ck(used == 7, "applyIni used=" + used);
        ck(fx.isOn(fx.find("qUINT_mxao")) && fx.isOn(o) && fx.enabledCount() == 2, "techniques");
        ck(Math.abs(fx.get(o, str)[0] - 0.5f) < 1e-6, "strength diset");
        ck(Math.abs(fx.get(o, col)[1] - 0.2f) < 1e-6, "warna diset");
        fx.save();
        RzFx f2 = new RzFx(d);
        f2.loadIndex(RzFx.readAll(new FileInputStream(a[0])));
        f2.load();
        RzFx.Fx o2 = f2.find("PrismShade_Outline");
        RzFx.U s2 = null; for (RzFx.U u : o2.uniforms) if (u.name.equals("Strength")) s2 = u;
        ck(Math.abs(f2.get(o2, s2)[0] - 0.5f) < 1e-5 && f2.isOn(o2), "round-trip");
        f2.reset(o2);
        ck(Math.abs(f2.get(o2, s2)[0] - 0.8f) < 1e-6, "reset");
        int sl = 0, cb = 0, ch = 0, co = 0;
        for (RzFx.Fx f : fx.effects) for (RzFx.U u : f.uniforms) { if (u.isCombo()) cb++; else if (u.isBool) ch++; else if (u.isColor()) co++; else sl++; ck(u.hi() >= u.lo(), "rentang " + f.id + "." + u.name); }
        System.out.println("RzFx OK efek=" + fx.effects.size() + " slider=" + sl + " combo=" + cb + " saklar=" + ch + " warna=" + co);
    }
}
