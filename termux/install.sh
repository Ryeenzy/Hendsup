#!/data/data/com.termux/files/usr/bin/bash
# RYEENZYXNZ - pasang tool di Termux. Jalankan sekali.
#   bash install.sh                         (dari folder hasil ekstrak artifact)
#   RZ_ZIP_URL=https://.../ryeenzyxnz-patcher.zip bash install.sh   (unduh dulu)
set -euo pipefail
DEST="${RZ_DEST:-$HOME/ryeenzyxnz}"

pkg update -y
grep -v '^#' "$(dirname "$0")/requirements.txt" | xargs pkg install -y

if [ -n "${RZ_ZIP_URL:-}" ]; then
  tmp="$(mktemp -d)"; curl -fL "$RZ_ZIP_URL" -o "$tmp/pkg.zip"
  mkdir -p "$DEST"; unzip -oq "$tmp/pkg.zip" -d "$DEST"
elif [ -f "$(dirname "$0")/../patcher/apk_patcher.py" ]; then
  SRC="$(cd "$(dirname "$0")/.." && pwd)"
  mkdir -p "$DEST"; [ "$SRC" = "$DEST" ] || cp -r "$SRC/." "$DEST/"
else
  echo "Tidak ada sumber. Set RZ_ZIP_URL atau jalankan dari folder paket."; exit 1
fi
chmod +x "$DEST"/termux/*.sh "$DEST"/patcher/signer.sh
[ -d "$HOME/storage" ] || termux-setup-storage || true
echo "Terpasang di $DEST. Lanjut: bash $DEST/termux/patch.sh --help"
