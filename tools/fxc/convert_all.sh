#!/bin/bash
# Konversi seluruh shader/reshade-fx/**/*.fx -> shader/fx-es/<nama>/ (GLSL ES 3.00 + manifest.json)
# uso: bash tools/fxc/convert_all.sh [WIDTH HEIGHT]
set -u
cd "$(dirname "$0")/../.."
W=${1:-1920}; H=${2:-1080}
FX=shader/reshade-fx; OUT=shader/fx-es; TMP=$(mktemp -d)
mkdir -p "$OUT" "$TMP/inc"
for f in ReShade.fxh ReShadeUI.fxh Macros.fxh Blending.fxh DrawText.fxh TriDither.fxh; do
  src=$(find $FX -name $f | head -1); [ -n "$src" ] || continue
  for n in "$f" "$(echo $f | tr 'A-Z' 'a-z')"; do ln -sf "$PWD/$src" "$TMP/inc/$n"; done
  [ "$f" = "ReShade.fxh" ] && ln -sf "$PWD/$src" "$TMP/inc/Reshade.fxh"
done
INC="-I $TMP/inc"; for d in $(find $FX -type d); do INC="$INC -I $d"; done
ok=0; bad=0
for f in $(find $FX -name '*.fx' | sort); do
  b=$(basename $f .fx)
  if tools/fxc/fxc "$f" "$TMP/$b" $INC -D BUFFER_WIDTH=$W -D BUFFER_HEIGHT=$H >/dev/null 2>"$TMP/$b.err"; then
    python3 tools/fxc/fx2es.py "$TMP/$b.glsl" "$TMP/$b.json" "$OUT/$b" >/dev/null && ok=$((ok+1))
  else bad=$((bad+1)); echo "gagal: $b"; fi
done
mkdir -p shader/fx-ui
python3 tools/fxc/make_ui_index.py "$TMP" shader/fx-ui/fx_ui.json
echo "dikonversi: $ok  gagal: $bad  -> $OUT"
