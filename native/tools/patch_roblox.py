#!/usr/bin/env python3
"""
patch_roblox.py - build a patched Roblox install set (NO ROOT NEEDED) that loads the RYEENZYXNZ payload.

What it does (all on YOUR copy of the APKs; nothing is downloaded or redistributed):
  1. finds lib/arm64-v8a/libroblox.so among the APKs you give it
  2. adds a DT_NEEDED entry for libryeenzyxnz.so to that libroblox.so (patchelf)  -> payload loads with Roblox
  3. (no token / no panel app: the overlay lives inside Roblox itself and talks to the engine through a private file)
  4. rebuilds every APK without old signatures, with .so files stored uncompressed and page-aligned
  5. signs all APKs with ONE key (apksigner) and verifies them

Usage:
  python3 patch_roblox.py --apks base.apk split_config.arm64_v8a.apk [more splits...] \
      --payload libryeenzyxnz_payload.so --out out/
Then:  adb uninstall com.roblox.client ; adb install-multiple out/signed/*.apk
"""
import argparse
import glob
import os
import re
import secrets
import shutil
import struct
import subprocess
import sys
import tempfile
import zipfile

LIB_PATH = "lib/arm64-v8a/libroblox.so"
PAYLOAD_NAME = "libryeenzyxnz.so"
SIG_RE = re.compile(r"^META-INF/(MANIFEST\.MF|[^/]+\.(SF|RSA|DSA|EC))$", re.I)


def die(msg):
    print("ERROR: " + msg, file=sys.stderr)
    sys.exit(1)


def which_tool(name):
    p = shutil.which(name)
    if p:
        return p
    for root in (os.environ.get("ANDROID_HOME"), os.environ.get("ANDROID_SDK_ROOT"), os.path.expanduser("~/Android/Sdk")):
        if not root:
            continue
        for cand in sorted(glob.glob(os.path.join(root, "build-tools", "*", name)), reverse=True):
            return cand
    return None


def pad_extra(offset, name, align):
    """Extra-field padding so that the entry's data starts at a multiple of `align` (same trick as zipalign)."""
    header_len = 30 + len(name.encode("utf-8"))
    pad = (-(offset + header_len)) % align
    if pad == 0:
        return b""
    if pad < 4:
        pad += align
    return struct.pack("<HH", 0xD935, pad - 4) + b"\0" * (pad - 4)


def rebuild(src, dst, replace=None, add=None):
    """Copy src -> dst without old signatures; apply replacements/additions; align stored entries."""
    replace = replace or {}
    add = add or {}
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w") as zout:
        def put(name, data, ctype, date_time=(2009, 1, 1, 0, 0, 0), attr=0o100644 << 16):
            zi = zipfile.ZipInfo(name, date_time)
            zi.compress_type = ctype
            zi.external_attr = attr
            zi.create_system = 3
            if ctype == zipfile.ZIP_STORED:
                zi.extra = pad_extra(zout.fp.tell(), name, 16384 if name.endswith(".so") else 4)
            zout.writestr(zi, data)

        seen = set()
        for info in zin.infolist():
            if info.filename.endswith("/") or SIG_RE.match(info.filename):
                continue
            seen.add(info.filename)
            data = replace.get(info.filename)
            if data is None:
                data = zin.read(info)
            put(info.filename, data, info.compress_type, info.date_time, info.external_attr)
        for name, (data, ctype) in add.items():
            if name in seen:
                die("%s already exists in %s" % (name, os.path.basename(src)))
            put(name, data, ctype)



def elf_gnu_build_id(data):
    """Return the GNU build-id as lowercase hex from an ELF64 little-endian image."""
    if len(data) < 64 or data[:4] != b"\x7fELF" or data[4] != 2 or data[5] != 1:
        die("libroblox.so is not a supported ELF64 little-endian image")
    phoff = struct.unpack_from("<Q", data, 32)[0]
    phentsize, phnum = struct.unpack_from("<HH", data, 54)
    if phentsize < 56 or phoff + phentsize * phnum > len(data):
        die("invalid ELF program-header table in libroblox.so")
    for i in range(phnum):
        off = phoff + i * phentsize
        p_type = struct.unpack_from("<I", data, off)[0]
        if p_type != 4:  # PT_NOTE
            continue
        note_off, note_size = struct.unpack_from("<QQ", data, off + 8)[0], struct.unpack_from("<Q", data, off + 32)[0]
        end = min(len(data), note_off + note_size)
        pos = note_off
        while pos + 12 <= end:
            namesz, descsz, n_type = struct.unpack_from("<III", data, pos)
            pos += 12
            name = data[pos:pos + namesz]
            pos = (pos + namesz + 3) & ~3
            desc = data[pos:pos + descsz]
            pos = (pos + descsz + 3) & ~3
            if n_type == 3 and name.startswith(b"GNU") and desc:
                return desc.hex()
    die("GNU build-id note not found in libroblox.so; refusing unsafe patch")



def bind_payload_build_id(payload, target_build_id):
    """Bind the fixed 128-byte kBuildId array in the freshly built payload."""
    target_id = target_build_id.encode("ascii")
    if len(target_id) > 128 or len(target_id) % 2:
        die("unsupported GNU build-id length (%d hex chars); refusing unsafe patch" % len(target_id))
    marker_text = b"4a916f58386d0c329a1202bfc4df0c392e869487"
    marker = marker_text + b"\0" * (128 - len(marker_text))
    replacement = target_id + b"\0" * (128 - len(target_id))
    count = payload.count(marker)
    if count != 1:
        die("fixed-width payload build-id marker missing/duplicated; rebuild native payload from this source")
    return payload.replace(marker, replacement, 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apks", nargs="+", required=True, help="all APK files of YOUR Roblox install (base + splits)")
    ap.add_argument("--payload", required=True, help="libryeenzyxnz_payload.so built by module/build.sh")
    ap.add_argument("--out", required=True)
    ap.add_argument("--assets-dir", help="folder whose files are added to the APK as assets/ryeenzyxnz/<file> (e.g. fx_ui.json)")
    ap.add_argument("--keystore")
    ap.add_argument("--ks-pass", default=None)
    ap.add_argument("--ks-alias", default="rz")
    a = ap.parse_args()

    patchelf = which_tool("patchelf")
    if not patchelf:
        die("patchelf not found. Install it (pip install patchelf, or your package manager).")

    target = None
    for p in a.apks:
        with zipfile.ZipFile(p) as z:
            if LIB_PATH in z.namelist():
                target = p
    if not target:
        die("%s not found in the given APKs. Include the arm64 split (e.g. split_config.arm64_v8a.apk)." % LIB_PATH)
    print("libroblox.so found in:", os.path.basename(target))

    out = os.path.abspath(a.out)
    unsigned = os.path.join(out, "unsigned")
    signed = os.path.join(out, "signed")
    shutil.rmtree(unsigned, ignore_errors=True)
    shutil.rmtree(signed, ignore_errors=True)
    os.makedirs(unsigned)
    os.makedirs(signed)

    work = tempfile.mkdtemp(prefix="rzpatch_")
    try:
        # 1) patch libroblox.so
        with zipfile.ZipFile(target) as z:
            orig_info = z.getinfo(LIB_PATH)
            lib_path = os.path.join(work, "libroblox.so")
            lib_bytes = z.read(LIB_PATH)
            target_build_id = elf_gnu_build_id(lib_bytes)
            with open(lib_path, "wb") as f:
                f.write(lib_bytes)
            already = "lib/arm64-v8a/" + PAYLOAD_NAME in z.namelist()
            if already:
                print("note: this install is already patched; the old payload will be REPLACED")
        have = subprocess.run([patchelf, "--print-needed", lib_path], capture_output=True, text=True).stdout.split()
        if PAYLOAD_NAME not in have:
            subprocess.check_call([patchelf, "--add-needed", PAYLOAD_NAME, lib_path])
        needed = subprocess.run([patchelf, "--print-needed", lib_path], capture_output=True, text=True).stdout.split()
        if PAYLOAD_NAME not in needed:
            die("patchelf did not add the dependency")
        patched_lib = open(lib_path, "rb").read()

        # 2) payload as-is (overlay dex is embedded in it)
        payload = open(a.payload, "rb").read()
        if len(payload) < 1024 or payload[:4] != b"\x7fELF":
            die("payload does not look like an ELF shared library (build it with module/build.sh)")
        # Match the native hook to the exact Roblox ELF supplied by this user.
        payload = bind_payload_build_id(payload, target_build_id)
        print("target GNU build-id:", target_build_id)

        # 3) rebuild all APKs
        for p in a.apks:
            dst = os.path.join(unsigned, os.path.basename(p))
            if p == target:
                ctype = orig_info.compress_type
                pay_path = "lib/arm64-v8a/" + PAYLOAD_NAME
                repl = {LIB_PATH: patched_lib}
                if already:
                    repl[pay_path] = payload
                add = {} if already else {pay_path: (payload, ctype)}
                if a.assets_dir:
                    with zipfile.ZipFile(p) as zq:
                        have_names = set(zq.namelist())
                    for root, _dirs, files in os.walk(a.assets_dir):
                        for fn in sorted(files):
                            full = os.path.join(root, fn)
                            rel = os.path.relpath(full, a.assets_dir).replace(os.sep, "/")
                            name = "assets/ryeenzyxnz/" + rel
                            data = open(full, "rb").read()
                            if name in have_names:
                                repl[name] = data
                            else:
                                add[name] = (data, zipfile.ZIP_DEFLATED)
                rebuild(p, dst, replace=repl, add=add)
            else:
                rebuild(p, dst)
            print("rebuilt:", os.path.basename(p))

        # 4) sign
        apksigner = which_tool("apksigner")
        if not apksigner:
            print("\napksigner not found (Android SDK build-tools). Unsigned APKs are in:", unsigned)
            print("Sign ALL of them with the same key, e.g.:")
            print("  apksigner sign --ks my.keystore --out signed/X.apk unsigned/X.apk   (for each file)")
            return
        ks, ks_pass = a.keystore, a.ks_pass
        if not ks:
            keytool = shutil.which("keytool")
            if not keytool:
                die("no --keystore given and keytool (JDK) not found")
            ks = os.path.join(out, "rz.keystore")
            ks_pass = ks_pass or secrets.token_hex(8)
            if not os.path.exists(ks):
                subprocess.check_call([keytool, "-genkeypair", "-keystore", ks, "-alias", a.ks_alias, "-keyalg", "RSA",
                                       "-keysize", "2048", "-validity", "10000", "-storepass", ks_pass, "-keypass", ks_pass,
                                       "-dname", "CN=RYEENZYXNZ"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                with open(os.path.join(out, "keystore-password.txt"), "w") as f:
                    f.write(ks_pass + "\n")
            elif not a.ks_pass:
                ks_pass = open(os.path.join(out, "keystore-password.txt")).read().strip()
        for p in a.apks:
            name = os.path.basename(p)
            subprocess.check_call([apksigner, "sign", "--ks", ks, "--ks-key-alias", a.ks_alias, "--ks-pass", "pass:" + ks_pass,
                                   "--key-pass", "pass:" + ks_pass, "--min-sdk-version", "24", "--v4-signing-enabled", "false", "--out", os.path.join(signed, name), os.path.join(unsigned, name)])
            subprocess.check_call([apksigner, "verify", "--min-sdk-version", "24", os.path.join(signed, name)])
            print("signed+verified:", name)
        print("\nDONE.")
        print("Install (this REMOVES the original Roblox and its local data):")
        print("  adb uninstall com.roblox.client")
        print("  adb install-multiple " + " ".join(os.path.join("signed", os.path.basename(p)) for p in a.apks))
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
