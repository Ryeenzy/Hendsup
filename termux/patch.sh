#!/data/data/com.termux/files/usr/bin/bash
# RYEENZYXNZ - patch Roblox ASLI di HP: ambil APK -> patch shader -> tanda tangan -> (opsional) pasang.
#
#   bash patch.sh                          pakai Roblox terpasang (pm path) + preset Rods
#   bash patch.sh --apk base.apk split_config.arm64_v8a.apk
#   bash patch.sh --preset ../shader/presets/Rods_TikTok_Shaders.ini --set wet=0.6
#   bash patch.sh --install                lanjut pasang via adb (wireless debugging)
#   bash patch.sh --live --apk ~/apks/*.apk --install   MODE LIVE: panel mengambang di dalam Roblox (payload native)
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PKG="${RZ_PKG:-com.roblox.client}"
WORK="${RZ_WORK:-$HOME/rz_work}"
PRESET="$HERE/shader/presets/Rods_TikTok_Shaders.ini"
APKS=(); EXTRA=(); INSTALL=0; LIVE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --apk) shift; while [ $# -gt 0 ] && [[ "$1" != --* ]]; do APKS+=("$1"); shift; done; continue ;;
    --preset) PRESET="$2"; shift ;;
    --set) shift; EXTRA+=(--set); while [ $# -gt 0 ] && [[ "$1" != --* ]]; do EXTRA+=("$1"); shift; done; continue ;;
    --install) INSTALL=1 ;;
    --live) LIVE=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "opsi tidak dikenal: $1"; exit 2 ;;
  esac; shift
done

mkdir -p "$WORK"; rm -rf "$WORK/in" "$WORK/out"; mkdir -p "$WORK/in" "$WORK/out"
if [ ${#APKS[@]} -eq 0 ]; then
  echo "[1/4] Ambil APK $PKG terpasang"
  mapfile -t paths < <(pm path "$PKG" 2>/dev/null | grep '^package:' | sed 's/^package://')
  [ ${#paths[@]} -gt 0 ] || { echo "pm path ditolak Android. Tarik APK lewat adb ke ~/apks lalu: bash termux/patch.sh --apk ~/apks/*.apk (atau pakai termux/ui.sh)"; exit 1; }
  for p in "${paths[@]}"; do cp "$p" "$WORK/in/" || { echo "Tidak bisa baca $p. Tarik lewat adb (lihat README) lalu pakai --apk."; exit 1; }; done
  APKS=("$WORK"/in/*.apk)
fi

if [ "$LIVE" = 1 ]; then
  PAYLOAD="$HERE/native/libryeenzyxnz_payload.so"
  [ -f "$PAYLOAD" ] || { echo "payload belum ada: $PAYLOAD (ambil artifact terbaru dari GitHub Actions; job 'native' harus hijau)"; exit 1; }
  command -v patchelf >/dev/null || { echo "patchelf tidak ada: pkg install patchelf"; exit 1; }
  echo "[2/3] Suntik payload + panel ke Roblox (mode LIVE) dan tanda tangan"
ASSETS="$WORK/assets-stage"
rm -rf "$ASSETS"; mkdir -p "$ASSETS"
[ -f "$HERE/shader/fx-ui/fx_ui.json" ] && cp "$HERE/shader/fx-ui/fx_ui.json" "$ASSETS/fx_ui.json"
[ -d "$HERE/shader/fx-es" ] && cp -r "$HERE/shader/fx-es" "$ASSETS/fx-es"
[ -d "$HERE/assets-ui/fonts" ] && { mkdir -p "$ASSETS/fonts"; cp "$HERE"/assets-ui/fonts/*.ttf "$ASSETS/fonts/"; }
[ -f "$HERE/assets-ui/report_url.txt" ] && cp "$HERE/assets-ui/report_url.txt" "$ASSETS/report_url.txt"
[ -f "$HERE/assets-ui/license_url.txt" ] && cp "$HERE/assets-ui/license_url.txt" "$ASSETS/license_url.txt"
[ -f "$HERE/assets-ui/activate_url.txt" ] && cp "$HERE/assets-ui/activate_url.txt" "$ASSETS/activate_url.txt"
[ -f "$HERE/assets-ui/presets_url.txt" ] && cp "$HERE/assets-ui/presets_url.txt" "$ASSETS/presets_url.txt"
[ -f "$HERE/assets-ui/devices_url.txt" ] && cp "$HERE/assets-ui/devices_url.txt" "$ASSETS/devices_url.txt"
for f in logo_fab.png logo_full.png preview.gif; do [ -f "$HERE/assets-ui/$f" ] && cp "$HERE/assets-ui/$f" "$ASSETS/$f"; done
  python3 -I "$HERE/native/tools/patch_roblox.py" --apks "${APKS[@]}" --payload "$PAYLOAD" --out "$WORK/live" $( [ -d "$HERE/shader/fx-ui" ] && echo --assets-dir "$ASSETS" )
  SIGNED="$WORK/live/signed"
  if [ "$INSTALL" = 1 ]; then
    adb uninstall "$PKG" || true
    adb install-multiple "$SIGNED"/*.apk && echo "Terpasang. Buka Roblox: tombol bulat RZ muncul di layar."
  else
    echo "Hasil: $SIGNED  (pasang: adb uninstall $PKG ; adb install-multiple $SIGNED/*.apk)"
  fi
  exit 0
fi

echo "[2/4] Patch shader di dalam APK"
python3 -I "$HERE/patcher/apk_patcher.py" --apk "${APKS[@]}" --out-dir "$WORK/out" --preset "$PRESET" "${EXTRA[@]}"

echo "[3/4] Tanda tangan"
bash "$HERE/patcher/signer.sh" "$WORK/out"

SIGNED="$WORK/out/signed"
echo "[4/4] Hasil: $SIGNED"
if [ "$INSTALL" = 1 ]; then
  command -v adb >/dev/null || { echo "adb tidak ada (pkg install android-tools)"; exit 1; }
  echo "Menghapus Roblox asli (tanda tangan beda, data lokal hilang; akun tetap di server)..."
  adb uninstall "$PKG" || true
  adb install-multiple "$SIGNED"/*.apk
  echo "Terpasang. Buka Roblox."
else
  cp "$SIGNED"/*.apk "$HOME/storage/downloads/" 2>/dev/null && echo "Disalin ke Download. Pasang: hapus Roblox asli dulu, lalu install (split: gunakan --install)."
fi
