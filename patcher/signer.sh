#!/usr/bin/env bash
# RYEENZYXNZ - tanda tangani APK hasil patch (semua APK dalam satu folder pakai kunci yang SAMA).
# Pakai:  patcher/signer.sh <folder_atau_file.apk ...>   -> hasil di <folder>/signed/
set -euo pipefail
[ $# -ge 1 ] || { echo "pakai: $0 <folder|apk...>"; exit 2; }

KS_DIR="${RZ_HOME:-$HOME/.ryeenzyxnz}"
KS="$KS_DIR/rz.keystore"
PASS_FILE="$KS_DIR/rz.pass"
ALIAS="ryeenzyxnz"
APKSIGNER="${APKSIGNER:-apksigner}"
mkdir -p "$KS_DIR"; chmod 700 "$KS_DIR"

command -v "$APKSIGNER" >/dev/null || { echo "apksigner tidak ada. Termux: pkg install apksigner"; exit 1; }

if [ ! -f "$KS" ]; then
  command -v keytool >/dev/null || { echo "keytool tidak ada. Termux: pkg install openjdk-17"; exit 1; }
  head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 20 > "$PASS_FILE"; chmod 600 "$PASS_FILE"
  keytool -genkeypair -keystore "$KS" -storepass "$(cat "$PASS_FILE")" -keypass "$(cat "$PASS_FILE")" \
    -alias "$ALIAS" -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=RYEENZYXNZ" >/dev/null
  echo "Keystore baru dibuat di $KS (SIMPAN: kunci sama dibutuhkan untuk update berikutnya)"
fi
PASS="$(cat "$PASS_FILE")"

files=()
for a in "$@"; do
  if [ -d "$a" ]; then for f in "$a"/*.apk; do [ -e "$f" ] && files+=("$f"); done
  else files+=("$a"); fi
done
[ ${#files[@]} -gt 0 ] || { echo "tidak ada APK"; exit 1; }

outdir="$(dirname "${files[0]}")/signed"; mkdir -p "$outdir"
for f in "${files[@]}"; do
  out="$outdir/$(basename "$f")"
  "$APKSIGNER" sign --ks "$KS" --ks-key-alias "$ALIAS" --ks-pass "pass:$PASS" --key-pass "pass:$PASS" \
    --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "$out" "$f"
  "$APKSIGNER" verify "$out" >/dev/null && echo "TERTANDA TANGAN: $out"
done
