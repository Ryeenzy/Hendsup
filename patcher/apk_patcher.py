#!/usr/bin/env python3
"""RYEENZYXNZ - patch shader pack langsung di dalam APK Roblox (tanpa root, tanpa PC).

Alur: baca APK asli -> temukan pack shader RBXS (GLES, GLSL teks) -> ubah shader
sesuai preset -> tulis APK baru (entri lain disalin mentah, tanpa rekompresi)
-> TANPA tanda tangan; jalankan signer.sh sesudahnya.

Contoh:
  python3 apk_patcher.py --apk base.apk split_*.apk --out-dir out --preset ../shader/presets/Rods_TikTok_Shaders.ini
  python3 apk_patcher.py --apk base.apk --list
"""
import argparse
import json
import os
import struct
import sys
import zipfile
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rbxs
import reshade_ini
import shader_rules

SIG_SUFFIX = (".SF", ".RSA", ".DSA", ".EC")


def is_signature(name):
    u = name.upper()
    return u.startswith("META-INF/") and (u.endswith(SIG_SUFFIX) or u == "META-INF/MANIFEST.MF")


class RawZipWriter:
    """Tulis ZIP dengan menyalin data terkompresi apa adanya + perataan stored (zipalign)."""

    def __init__(self, path):
        self.f = open(path, "wb")
        self.entries = []

    def add(self, info, raw, method, crc, usize, align_pad=True):
        name = info.filename.encode("utf-8")
        flags = 0x0800 if any(b > 127 for b in name) else 0
        align = 0
        if method == 0 and align_pad:
            align = 4096 if info.filename.endswith(".so") else 4
        pos = self.f.tell()
        extra = b""
        if align > 1:
            need = (-(pos + 30 + len(name))) % align
            if need:
                while need < 4:
                    need += align
                extra = struct.pack("<HH", 0xD935, need - 4) + b"\0" * (need - 4)
        if pos >= 0xFFFFFFFF or len(raw) >= 0xFFFFFFFF:
            raise SystemExit("APK > 4GB belum didukung")
        dt = info.date_time
        dos_time = (dt[3] << 11) | (dt[4] << 5) | (dt[5] // 2)
        dos_date = ((dt[0] - 1980) << 9) | (dt[1] << 5) | dt[2]
        self.f.write(struct.pack("<IHHHHHIIIHH", 0x04034B50, 20, flags, method, dos_time, dos_date,
                                 crc, len(raw), usize, len(name), len(extra)))
        self.f.write(name)
        self.f.write(extra)
        self.f.write(raw)
        self.entries.append((name, flags, method, dos_time, dos_date, crc, len(raw), usize,
                             info.external_attr, pos))

    def close(self):
        cd_start = self.f.tell()
        for (name, flags, method, t, d, crc, cs, us, ext, pos) in self.entries:
            self.f.write(struct.pack("<IHHHHHHIIIHHHHHII", 0x02014B50, 0x031E, 20, flags, method, t, d,
                                     crc, cs, us, len(name), 0, 0, 0, 0, ext, pos))
            self.f.write(name)
        cd_size = self.f.tell() - cd_start
        n = len(self.entries)
        self.f.write(struct.pack("<IHHHHIIH", 0x06054B50, 0, 0, n, n, cd_size, cd_start, 0))
        self.f.close()


def read_raw(zf_file, info):
    zf_file.seek(info.header_offset)
    h = zf_file.read(30)
    if h[:4] != b"PK\x03\x04":
        raise SystemExit("header lokal rusak: %s" % info.filename)
    nlen, elen = struct.unpack_from("<HH", h, 26)
    zf_file.seek(info.header_offset + 30 + nlen + elen)
    return zf_file.read(info.compress_size)


def find_packs(zf):
    out = []
    for zi in zf.infolist():
        if zi.is_dir() or zi.file_size < 1024:
            continue
        with zf.open(zi) as fh:
            if fh.read(4) == rbxs.MAGIC:
                out.append(zi)
    return out


def patch_pack(data, params):
    try:
        pack = rbxs.Pack(data)
    except rbxs.PackError as e:
        return None, "dilewati (%s) - bukan pack GLSL teks (mis. Vulkan/SPIR-V)" % e, 0
    replace, edited = {}, 0
    for off, size in pack.blobs():
        new, n = shader_rules.transform(pack.raw[off:off + size], params)
        if n:
            replace[(off, size)] = new
            edited += 1
    if not replace:
        return None, "tidak ada shader yang cocok untuk diubah", 0
    out = pack.rebuild(replace)
    rbxs.Pack(out)  # parse ulang sebagai pemeriksaan
    return out, "ok", edited


def process(apk, out_path, params, dry):
    rep = {"apk": os.path.basename(apk), "packs": []}
    with zipfile.ZipFile(apk) as zf, open(apk, "rb") as raw_f:
        packs = {zi.filename: zi for zi in find_packs(zf)}
        for name, zi in packs.items():
            rep["packs"].append({"entry": name, "bytes": zi.file_size})
        patched = {}
        for name, zi in packs.items():
            res, msg, n = patch_pack(zf.read(zi), params)
            for r in rep["packs"]:
                if r["entry"] == name:
                    r.update(status=msg, shaders_edited=n)
            if res is not None:
                patched[name] = res
        if dry:
            return rep, bool(patched)
        w = RawZipWriter(out_path)
        for zi in zf.infolist():
            if zi.is_dir():
                continue
            if is_signature(zi.filename):
                continue
            if zi.filename in patched:
                data = patched[zi.filename]
                if zi.compress_type == zipfile.ZIP_STORED:
                    w.add(zi, data, 0, zlib.crc32(data) & 0xFFFFFFFF, len(data))
                else:
                    c = zlib.compressobj(9, zlib.DEFLATED, -15)
                    comp = c.compress(data) + c.flush()
                    w.add(zi, comp, 8, zlib.crc32(data) & 0xFFFFFFFF, len(data))
            else:
                if zi.flag_bits & 0x1:
                    raise SystemExit("entri terenkripsi: %s" % zi.filename)
                w.add(zi, read_raw(raw_f, zi), zi.compress_type, zi.CRC, zi.file_size)
        w.close()
    return rep, bool(patched)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apk", nargs="+", required=True, help="base.apk + split (jika ada)")
    ap.add_argument("--out-dir", default="out")
    ap.add_argument("--preset", help=".ini/.txt ReShade atau .json parameter")
    ap.add_argument("--set", nargs="*", default=[], metavar="KUNCI=NILAI",
                    help="timpa parameter, mis. contrast=1.1 saturation=1.2")
    ap.add_argument("--list", action="store_true", help="hanya tampilkan pack yang ditemukan")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)

    params, applied, ignored = dict(shader_rules.DEFAULTS), [], []
    if a.preset:
        params, applied, ignored = reshade_ini.load(a.preset)
    for kv in a.set:
        k, v = kv.split("=", 1)
        if k not in shader_rules.DEFAULTS:
            raise SystemExit("kunci tidak dikenal: %s (ada: %s)" % (k, ", ".join(shader_rules.DEFAULTS)))
        params[k] = float(v)

    os.makedirs(a.out_dir, exist_ok=True)
    reports, any_patched = [], False
    for apk in a.apk:
        out = os.path.join(a.out_dir, os.path.basename(apk))
        if os.path.abspath(out) == os.path.abspath(apk):
            raise SystemExit("--out-dir tidak boleh sama dengan folder APK asli")
        if a.list:
            with zipfile.ZipFile(apk) as zf:
                for zi in find_packs(zf):
                    print("%s: %s (%d bytes)" % (os.path.basename(apk), zi.filename, zi.file_size))
            continue
        rep, ok = process(apk, out, params, a.dry_run)
        any_patched |= ok
        reports.append(rep)
        for p in rep["packs"]:
            print("%s: %s -> %s (%s shader diubah)" % (rep["apk"], p["entry"], p.get("status"), p.get("shaders_edited", 0)))
        if not rep["packs"]:
            print("%s: tidak ada pack shader (disalin tanpa perubahan)" % rep["apk"])
    if a.list:
        return 0
    json.dump({"params": params, "applied": applied, "ignored": ignored, "apks": reports},
              open(os.path.join(a.out_dir, "patch_report.json"), "w"), indent=2)
    if not any_patched:
        print("PERINGATAN: tidak ada pack yang berhasil dipatch. APK dengan nama sama tetap ditulis tanpa tanda tangan.", file=sys.stderr)
        return 3
    print("Selesai. Sekarang tanda tangani: termux/patch.sh atau patcher/signer.sh %s" % a.out_dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
