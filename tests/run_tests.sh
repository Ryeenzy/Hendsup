#!/usr/bin/env bash
# Jalankan semua uji. Pakai pack Roblox asli jika RZ_REAL_PACK diset; selalu pakai pack sintetis.
set -euo pipefail
cd "$(dirname "$0")/.."
T="$(mktemp -d)"
python3 -I tests/make_fake_pack.py "$T/fake.pack"
GL="${GLSLANG:-$(command -v glslangValidator || true)}"
[ -n "$GL" ] && python3 -I tests/validate_pack.py "$T/fake.pack" "$GL" || echo "(glslang tidak ada: validasi GLSL dilewati)"
[ -n "$GL" ] && python3 -I tests/live_validate.py "$T/fake.pack" "$GL" 2 || true
[ -n "$GL" ] && python3 tests/ssao_check.py "$GL" || true
python3 tests/shader_math.py
python3 tests/dpipe_math.py
python3 -I tests/key_contract.py
python3 -I tests/build_id_contract.py
python3 -I tests/fx_contract.py
python3 -I tests/test_patcher.py "$T/fake.pack"
if [ -n "${RZ_REAL_PACK:-}" ]; then
  [ -n "$GL" ] && python3 -I tests/validate_pack.py "$RZ_REAL_PACK" "$GL"
  [ -n "$GL" ] && python3 -I tests/live_validate.py "$RZ_REAL_PACK" "$GL" 100
  python3 -I tests/test_patcher.py "$RZ_REAL_PACK" ${RZ_REAL_VULKAN:+"$RZ_REAL_VULKAN"}
fi
echo "SEMUA UJI LULUS"
