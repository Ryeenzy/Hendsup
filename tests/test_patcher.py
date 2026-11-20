#!/usr/bin/env python3
"""Uji end-to-end APK palsu: pack asli -> patch -> APK baru valid, entri lain utuh, tanda tangan terhapus."""
import hashlib, os, subprocess, sys, tempfile, zipfile
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.join(ROOT, "patcher"))
import rbxs

def main(pack, vulkan=None):
    tmp = tempfile.mkdtemp()
    apk = os.path.join(tmp, "base.apk")
    so = os.urandom(300000)
    with zipfile.ZipFile(apk, "w") as z:
        z.writestr("AndroidManifest.xml", b"<m/>" * 100)
        z.writestr("classes.dex", os.urandom(5000), zipfile.ZIP_DEFLATED)
        z.writestr(zipfile.ZipInfo("lib/arm64-v8a/libroblox.so"), so)  # stored
        z.writestr("assets/shaders/glsles3.pack", open(pack, "rb").read(), zipfile.ZIP_DEFLATED)
        if vulkan:
            z.writestr(zipfile.ZipInfo("assets/shaders/vulkan.pack"), open(vulkan, "rb").read())
        z.writestr("META-INF/MANIFEST.MF", b"x"); z.writestr("META-INF/CERT.SF", b"x"); z.writestr("META-INF/CERT.RSA", b"x")
    out = os.path.join(tmp, "out")
    ini = os.path.join(ROOT, "shader", "presets", "Rods_TikTok_Shaders.ini")
    r = subprocess.run([sys.executable, "-I", os.path.join(ROOT, "patcher", "apk_patcher.py"), "--apk", apk,
                        "--out-dir", out, "--preset", ini], capture_output=True, text=True)
    print(r.stdout, r.stderr)
    assert r.returncode == 0, "patcher gagal"
    new = os.path.join(out, "base.apk")
    with zipfile.ZipFile(new) as z, zipfile.ZipFile(apk) as o:
        assert z.testzip() is None
        names = z.namelist()
        assert not any(n.startswith("META-INF/") for n in names), "tanda tangan lama masih ada"
        for n in ("AndroidManifest.xml", "classes.dex", "lib/arm64-v8a/libroblox.so") + (("assets/shaders/vulkan.pack",) if vulkan else ()):
            assert z.read(n) == o.read(n), n
        zi = z.getinfo("lib/arm64-v8a/libroblox.so")
        assert zi.compress_type == 0
        # data .so harus sejajar 4096
        off = zi.header_offset + 30 + len(zi.filename.encode()) + int.from_bytes(open(new, "rb").read()[zi.header_offset + 28:zi.header_offset + 30], "little")
        assert off % 4096 == 0, "libroblox.so tidak sejajar 4096 (offset %d)" % off
        a, b = o.read("assets/shaders/glsles3.pack"), z.read("assets/shaders/glsles3.pack")
        assert a != b
        pa, pb = rbxs.Pack(a), rbxs.Pack(b)
        assert pa.n_recs == pb.n_recs
        diff = sum(1 for i in range(pa.n_recs) if pa.source(i) != pb.source(i))
        print("rekaman berubah:", diff, "dari", pa.n_recs)
        assert diff > 0
    print("OK")

if __name__ == "__main__":
    main(*sys.argv[1:])
