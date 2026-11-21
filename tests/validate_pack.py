#!/usr/bin/env python3
"""Validasi: setiap shader yang diubah harus tetap GLSL ES 3.00 valid (glslangValidator)."""
import os, subprocess, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "patcher"))
import rbxs, shader_rules as R

def main(pack_path, glslang, params):
    pack = rbxs.Pack(open(pack_path, "rb").read())
    replace, bad, changed = {}, 0, 0
    for off, size in pack.blobs():
        src = pack.raw[off:off + size]
        new, n = R.transform(src, params)
        if n:
            replace[(off, size)] = new
    new_pack = rbxs.Pack(pack.rebuild(replace))
    tmp = tempfile.mkdtemp()
    for (off, size), new in replace.items():
        is_vs = b"gl_Position" in new or b"layout(location = 0) in" in new
        f = os.path.join(tmp, "s.vert" if is_vs else "s.frag")
        open(f, "wb").write(new)
        r = subprocess.run([glslang, f], capture_output=True, text=True)
        changed += 1
        if r.returncode:
            bad += 1
            print("GAGAL off=%d:\n%s" % (off, r.stdout[:600]))
    print("diubah: %d shader, gagal validasi: %d, rekaman pack utuh: %s" % (
        changed, bad, all(new_pack.source(i) for i in range(new_pack.n_recs))))
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2], {
        "wet": 0.8, "contrast": 1.1, "saturation": 1.1, "brightness": 0.01, "warmth": 0.2,
        "vibrance": 0.2, "levels_black": 13 / 255, "levels_white": 207 / 255, "curves": 0.27, "bloom_gain": 1.4}))
