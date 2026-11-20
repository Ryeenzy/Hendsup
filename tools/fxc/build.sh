#!/bin/bash
# Membangun fxc (compiler ReShade 'reshadefx', BSD-3) untuk host atau Termux/Android.
# uso: bash tools/fxc/build.sh [CXX]   -> tools/fxc/fxc
set -e
cd "$(dirname "$0")"
CXX=${1:-g++}
RS=${RESHADE_SRC:-/tmp/reshade-src}
COMMIT=7bf9de8b33bcc76c3177007e65d73c72dd0f34c0
if [ ! -d "$RS/source" ]; then
  git clone https://github.com/crosire/reshade.git "$RS"
  (cd "$RS" && git checkout "$COMMIT" && git apply "$OLDPWD/glsl_es_scalar_swizzle.patch")
fi
S="$RS/source"
$CXX -std=c++17 -O1 -I"$S" -I"$S/../deps" -I"$S/../include" fxc.cpp "$S/effect_lexer.cpp" "$S/effect_preprocessor.cpp" \
  "$S/effect_parser_exp.cpp" "$S/effect_parser_stmt.cpp" "$S/effect_expression.cpp" "$S/effect_symbol_table.cpp" \
  "$S/effect_codegen_glsl.cpp" -o fxc
echo "ok: $(pwd)/fxc"
