#!/data/data/com.termux/files/usr/bin/bash
# Menu sederhana: pilih preset lalu patch.
HERE="$(cd "$(dirname "$0")/.." && pwd)"
P="$HERE/shader/presets"
echo "Pilih preset RYEENZYXNZ:"
select f in "Rods_TikTok_Shaders.ini" off.json natural.json realistic.json ultra.json "(batal)"; do
  [ "$f" = "(batal)" ] && exit 0
  [ -n "$f" ] && exec bash "$HERE/termux/patch.sh" --preset "$P/$f" "$@"
done
