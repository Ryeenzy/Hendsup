#!/usr/bin/env python3
"""Uji penulisan-ulang LIVE (native/module/jni/liveshader.hpp): shader dari pack -> liveRewrite (C++) -> validasi glslang."""
import os, subprocess, sys, tempfile, glob
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.join(ROOT, "patcher"))
import rbxs

def main(pack, glslang, min_touched):
    p = rbxs.Pack(open(pack, "rb").read())
    t = tempfile.mkdtemp(); d = os.path.join(t, "in"); o = os.path.join(t, "out"); os.mkdir(d); os.mkdir(o)
    for i, (off, size) in enumerate(p.blobs()):
        open(os.path.join(d, "%04d.frag" % i), "wb").write(p.raw[off:off + size])
    exe = os.path.join(t, "live_test")
    subprocess.check_call(["g++", "-std=c++17", "-Wall", "-Wextra", "-O1", os.path.join(ROOT, "native", "module", "tests", "live_test.cpp"), "-o", exe])
    r = subprocess.run([exe, o] + sorted(glob.glob(d + "/*.frag")), capture_output=True, text=True)
    print(r.stdout.strip()); assert r.returncode == 0, "live_test gagal"
    outs = sorted(glob.glob(o + "/*.out")); bad = 0
    for f in outs:
        v = os.path.join(t, "v.frag"); open(v, "wb").write(open(f, "rb").read())
        if subprocess.run([glslang, v], capture_output=True, text=True).returncode:
            bad += 1; print("GAGAL", f)
    print("LIVE: ditulis ulang %d shader, gagal validasi %d" % (len(outs), bad))
    assert bad == 0 and len(outs) >= int(min_touched), "kurang shader tersentuh / ada yang invalid"

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 1)
