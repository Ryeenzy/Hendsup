#!/usr/bin/env python3
"""
apk_analyzer.py - survei lengkap APK Roblox ANDA (untuk memetakan struktur shader). Hanya membaca; tidak mengubah apa pun.

Mode:
  python3 apk_analyzer.py --adb                 tarik APK lewat adb (pm path com.roblox.client) lalu survei
  python3 apk_analyzer.py --apks-dir DIR        survei APK yang sudah ada di DIR
Opsi: --out DIR  --pkg com.roblox.client  --max-extract-mb 300

Hasil di OUT/REPORT.md + berkas pendukung:
  apks/                       APK asli (hanya mode --adb; TIDAK ikut ZIP)
  listing_<apk>.txt           semua entri (nama, ukuran, terkompresi)
  assets_tree.txt             ringkasan folder (jumlah berkas, ukuran)
  largest.txt                 60 entri terbesar
  headers/                    16-256 byte pertama entri besar non-lib (hex + magic)
  extracted/                  entri bernama shader/glsl/pack/material/dst. (<=20 MB per berkas)
  lib_<nama>/                 analisis tiap .so arm64 (import gl/egl/vk, string kunci, GLSL tertanam)
  device.txt                  info perangkat + GL renderer + versi app
"""
import argparse
import datetime
import hashlib
import mmap
import os
import re
import shutil
import subprocess
import sys
import zipfile

SHADERISH = re.compile(r"(shader|glsl|\.pack$|\.frag$|\.vert$|\.spv$|\.sc$|material|lighting|effect|postprocess|pbr|\.glslbin$)", re.I)
KEYWORDS = [
    b"shader", b"GLSL", b"glsl", b"#version", b"precision ", b"gl_FragColor", b"gl_FragData", b"shadercache", b"ProgramBinary",
    b"programBinary", b"Vulkan", b"vkCreate", b"ShadowMap", b"Future", b"Reflectance", b"Specular", b"EnvironmentMap",
    b"SurfaceAppearance", b"Bloom", b"DepthOfField", b"SunRays", b"ColorCorrection", b"Atmosphere", b"PBR", b"uniform ",
    b".pack", b"lz4", b"LZ4", b"zstd", b"ZSTD", b"Technology",
]
MAGICS = {"zstd": b"\x28\xb5\x2f\xfd", "lz4-frame": b"\x04\x22\x4d\x18", "gzip": b"\x1f\x8b\x08", "zlib-78da": b"\x78\xda", "zlib-789c": b"\x78\x9c"}


def log(*a):
    print(*a, flush=True)


def run(cmd, timeout=120):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, errors="replace")
        return (r.stdout or "") + (r.stderr or "" if r.returncode else "")
    except Exception as e:  # noqa: BLE001
        return "ERR %s: %s" % (cmd[0], e)


def human(n):
    for u in ("B", "KB", "MB", "GB"):
        if n < 1024 or u == "GB":
            return "%.1f%s" % (n, u) if u != "B" else "%d B" % n
        n /= 1024.0


def pull_apks(pkg, dest):
    os.makedirs(dest, exist_ok=True)
    out = run(["adb", "shell", "pm", "path", pkg])
    paths = [l.strip().replace("package:", "") for l in out.replace("\r", "").splitlines() if l.strip().startswith("package:")]
    if not paths:
        sys.exit("adb tidak menemukan %s. Pastikan `adb devices` menampilkan perangkat dan Roblox terpasang.\n%s" % (pkg, out))
    got = []
    for p in paths:
        log("  adb pull", p)
        o = run(["adb", "pull", p, dest], timeout=900)
        if "ERR" in o and "pulled" not in o:
            log("   gagal:", o.strip()[:200])
    for f in sorted(os.listdir(dest)):
        if f.endswith(".apk"):
            got.append(os.path.join(dest, f))
    if not got:
        sys.exit("tidak ada APK yang berhasil ditarik")
    return got


def device_info(pkg, out):
    lines = []
    for k in ("ro.product.model", "ro.product.manufacturer", "ro.build.version.release", "ro.build.version.sdk", "ro.hardware", "ro.hardware.egl", "ro.hardware.vulkan", "ro.board.platform", "ro.product.cpu.abi"):
        lines.append("%s=%s" % (k, run(["adb", "shell", "getprop", k]).strip()))
    pk = run(["adb", "shell", "dumpsys", "package", pkg], timeout=60)
    for l in pk.splitlines():
        if re.search(r"(versionName|versionCode|targetSdk|minSdk|codePath|primaryCpuAbi|signatures|flags=)", l):
            lines.append(l.strip())
    sf = run(["adb", "shell", "dumpsys", "SurfaceFlinger"], timeout=60)
    for l in sf.splitlines():
        if re.search(r"(GLES|OpenGL|Vulkan|renderer|Mali|Adreno|PowerVR)", l, re.I):
            lines.append("SF: " + l.strip())
            if len(lines) > 80:
                break
    lines.append("--- file milik app di penyimpanan eksternal ---")
    lines.append(run(["adb", "shell", "ls", "-laR", "/sdcard/Android/data/%s" % pkg], timeout=60)[:6000])
    lines.append("--- cache shader di mana saja (find) ---")
    lines.append(run(["adb", "shell", "find", "/sdcard/Android/data/%s" % pkg, "-iname", "*shader*"], timeout=60)[:3000])
    open(os.path.join(out, "device.txt"), "w").write("\n".join(lines) + "\n")


def survey_apk(path, out, state, max_extract):
    name = os.path.basename(path)
    base = os.path.splitext(name)[0]
    z = zipfile.ZipFile(path)
    infos = z.infolist()
    with open(os.path.join(out, "listing_%s.txt" % base), "w") as f:
        for i in infos:
            f.write("%12d %12d  %s\n" % (i.file_size, i.compress_size, i.filename))
    for i in infos:
        state["entries"].append((i.file_size, name, i.filename))
        d = "/".join(i.filename.split("/")[:3]) if "/" in i.filename else "."
        c = state["tree"].setdefault((name, d), [0, 0])
        c[0] += 1
        c[1] += i.file_size
    # manifest mentah
    if "AndroidManifest.xml" in z.namelist():
        os.makedirs(os.path.join(out, "manifest"), exist_ok=True)
        open(os.path.join(out, "manifest", base + "_AndroidManifest.xml"), "wb").write(z.read("AndroidManifest.xml"))
    # header entri besar non-lib
    big = sorted([i for i in infos if not i.filename.startswith("lib/") and i.file_size > 4096], key=lambda i: -i.file_size)[:25]
    hdir = os.path.join(out, "headers")
    os.makedirs(hdir, exist_ok=True)
    for i in big:
        with z.open(i) as fh:
            head = fh.read(256)
        hx = " ".join("%02x" % b for b in head[:64])
        asc = "".join(chr(b) if 32 <= b < 127 else "." for b in head)
        open(os.path.join(hdir, "%s__%s.txt" % (base, i.filename.replace("/", "_")[-80:])), "w").write(
            "%s  (%s)\nhex: %s\nascii: %s\n" % (i.filename, human(i.file_size), hx, asc))
    # ekstrak entri bernuansa shader
    edir = os.path.join(out, "extracted", base)
    for i in infos:
        if i.filename.endswith("/") or i.filename.startswith("lib/") or re.match(r"classes\d*\.dex$", i.filename):
            continue
        if not SHADERISH.search(i.filename):
            continue
        if i.file_size > 20 * 1024 * 1024 or state["extracted"] + i.file_size > max_extract:
            state["skipped"].append((i.filename, i.file_size))
            continue
        dst = os.path.join(edir, i.filename)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with z.open(i) as src, open(dst, "wb") as o:
            shutil.copyfileobj(src, o)
        state["extracted"] += i.file_size
        state["extracted_names"].append(i.filename)
    # analisis tiap .so arm64
    for i in infos:
        if i.filename.startswith("lib/arm64-v8a/") and i.filename.endswith(".so"):
            tmp = os.path.join(out, "_tmp_" + os.path.basename(i.filename))
            with z.open(i) as src, open(tmp, "wb") as o:
                shutil.copyfileobj(src, o)
            try:
                analyze_so(tmp, os.path.join(out, "lib_" + os.path.basename(i.filename)[:-3]), state)
            finally:
                os.remove(tmp)


def printable_around(mm, pos, limit=300):
    a = pos
    while a > 0 and pos - a < limit and 32 <= mm[a - 1] < 127:
        a -= 1
    b = pos
    while b < len(mm) and b - pos < limit and 32 <= mm[b] < 127:
        b += 1
    return mm[a:b].decode("ascii", "replace")


def nul_bounded(mm, pos, maxlen=262144):
    a = pos
    while a > 0 and pos - a < maxlen and mm[a - 1] != 0:
        a -= 1
    b = pos
    while b < len(mm) and b - pos < maxlen and mm[b] != 0:
        b += 1
    return a, b


def analyze_so(path, odir, state):
    os.makedirs(odir, exist_ok=True)
    size = os.path.getsize(path)
    rep = ["# %s  (%s)" % (os.path.basename(path), human(size))]
    sha = hashlib.sha256(open(path, "rb").read()).hexdigest() if size < 300 * 1024 * 1024 else "(besar, dilewati)"
    rep.append("sha256: %s" % sha)
    if shutil.which("readelf"):
        rep.append(run(["readelf", "-n", path]).strip()[:600])
        open(os.path.join(odir, "dynamic.txt"), "w").write(run(["readelf", "-d", "-W", path]))
        syms = run(["readelf", "--dyn-syms", "-W", path], timeout=300)
        imp = [l for l in syms.splitlines() if " UND " in l and re.search(r"\b(gl[A-Z]|egl[A-Z]|vk[A-Z]|AHardware|ANativeWindow)", l)]
        open(os.path.join(odir, "imports_gl_egl_vk.txt"), "w").write("\n".join(imp) + "\n")
        exp = [l for l in syms.splitlines() if " UND " not in l and re.search(r"(Shader|Render|Effect|Lighting|Material|Bloom|DepthOfField)", l, re.I)]
        open(os.path.join(odir, "exports_interesting.txt"), "w").write("\n".join(exp[:500]) + "\n")
        rel = run(["readelf", "-r", "-W", path], timeout=300)
        slots = [l for l in rel.splitlines() if "JUMP_SLO" in l and re.search(r"\b(gl[A-Z]|egl[A-Z])", l)]
        open(os.path.join(odir, "plt_gl_slots.txt"), "w").write("\n".join(slots) + "\n")
        rep.append("import gl/egl/vk: %d, slot PLT gl/egl: %d" % (len(imp), len(slots)))
    else:
        rep.append("(readelf tidak ada: pkg install binutils untuk daftar import)")
    with open(path, "rb") as fh:
        mm = mmap.mmap(fh.fileno(), 0, access=mmap.ACCESS_READ)
        # string kunci
        kdir = os.path.join(odir, "keyword_strings")
        os.makedirs(kdir, exist_ok=True)
        counts = {}
        for kw in KEYWORDS:
            seen, hits, pos = set(), 0, 0
            while hits < 4000:
                p = mm.find(kw, pos)
                if p < 0:
                    break
                hits += 1
                pos = p + len(kw)
                if len(seen) < 60:
                    seen.add(printable_around(mm, p, 200))
            counts[kw.decode()] = hits
            if seen:
                open(os.path.join(kdir, re.sub(r"\W+", "_", kw.decode()) + ".txt"), "w").write("\n".join(sorted(seen)) + "\n")
        rep.append("hitungan kata kunci: " + ", ".join("%s=%d" % kv for kv in counts.items() if kv[1]))
        # magic kompresi
        mg = {}
        for n, m in MAGICS.items():
            c, pos = 0, 0
            while c < 20000:
                p = mm.find(m, pos)
                if p < 0:
                    break
                c += 1
                pos = p + 1
            mg[n] = c
        rep.append("magic kompresi (indikasi saja): " + ", ".join("%s=%d" % kv for kv in mg.items()))
        # GLSL tertanam (terbatas NUL)
        gdir = os.path.join(odir, "embedded_glsl")
        os.makedirs(gdir, exist_ok=True)
        saved, seen = 0, set()
        for pat in (b"#version", b"void main"):
            pos = 0
            while saved < 400:
                p = mm.find(pat, pos)
                if p < 0:
                    break
                a, b = nul_bounded(mm, p)
                pos = max(b, p + len(pat))
                blob = mm[a:b]
                if len(blob) < 40:
                    continue
                h = hashlib.sha1(blob).hexdigest()[:16]
                if h in seen:
                    continue
                seen.add(h)
                open(os.path.join(gdir, "%s_%08x.txt" % (h, a)), "wb").write(blob)
                saved += 1
        rep.append("potongan GLSL tertanam tersimpan: %d" % saved)
        state["glsl"][os.path.basename(path)] = saved
        mm.close()
    open(os.path.join(odir, "SUMMARY.txt"), "w").write("\n".join(rep) + "\n")
    state["so_summaries"].append("\n".join(rep))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--adb", action="store_true")
    ap.add_argument("--apks-dir")
    ap.add_argument("--out", default=os.path.expanduser("~/rz_dump_apk"))
    ap.add_argument("--pkg", default="com.roblox.client")
    ap.add_argument("--max-extract-mb", type=int, default=300)
    a = ap.parse_args()
    if not a.adb and not a.apks_dir:
        ap.error("pilih --adb atau --apks-dir DIR")
    out = os.path.abspath(a.out)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    if a.adb:
        log("== 1/4 info perangkat")
        device_info(a.pkg, out)
        log("== 2/4 tarik APK")
        apks = pull_apks(a.pkg, os.path.join(out, "apks"))
    else:
        apks = sorted(os.path.join(a.apks_dir, f) for f in os.listdir(a.apks_dir) if f.endswith(".apk"))
        if not apks:
            sys.exit("tidak ada .apk di %s" % a.apks_dir)
    state = {"entries": [], "tree": {}, "extracted": 0, "extracted_names": [], "skipped": [], "glsl": {}, "so_summaries": []}
    log("== 3/4 survei %d APK" % len(apks))
    for p in apks:
        log("  ", os.path.basename(p), human(os.path.getsize(p)))
        survey_apk(p, out, state, a.max_extract_mb * 1024 * 1024)
    with open(os.path.join(out, "assets_tree.txt"), "w") as f:
        for (apk, d), (n, sz) in sorted(state["tree"].items(), key=lambda kv: -kv[1][1]):
            f.write("%-34s %-44s %7d berkas %12s\n" % (apk, d, n, human(sz)))
    with open(os.path.join(out, "largest.txt"), "w") as f:
        for sz, apk, nm in sorted(state["entries"], reverse=True)[:60]:
            f.write("%12s  %-30s %s\n" % (human(sz), apk, nm))
    log("== 4/4 laporan")
    r = ["# Laporan survei APK", "", "dibuat: %s" % datetime.datetime.now().isoformat(timespec="seconds"), "paket: %s" % a.pkg,
         "APK: %s" % ", ".join(os.path.basename(p) for p in apks), "total entri: %d" % len(state["entries"]), "",
         "## Entri bernuansa shader yang diekstrak (%d, %s)" % (len(state["extracted_names"]), human(state["extracted"]))]
    r += ["- " + n for n in state["extracted_names"][:80]]
    if len(state["extracted_names"]) > 80:
        r.append("- ... (lihat extracted/)")
    if state["skipped"]:
        r += ["", "Dilewati (terlalu besar):"] + ["- %s (%s)" % (n, human(s)) for n, s in state["skipped"][:30]]
    r += ["", "## Library arm64"] + state["so_summaries"]
    r += ["", "## 15 entri terbesar"]
    for sz, apk, nm in sorted(state["entries"], reverse=True)[:15]:
        r.append("- %s  %s : %s" % (human(sz), apk, nm))
    open(os.path.join(out, "REPORT.md"), "w").write("\n".join(r) + "\n")
    log("\nSelesai. Laporan: %s/REPORT.md" % out)
    return out


if __name__ == "__main__":
    main()
