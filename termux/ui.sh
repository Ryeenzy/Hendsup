#!/data/data/com.termux/files/usr/bin/bash
# Buka UI pengaturan RYEENZYXNZ (browser HP -> http://127.0.0.1:8777)
HERE="$(cd "$(dirname "$0")/.." && pwd)"
exec python3 -I "$HERE/ui/rz_ui.py"
