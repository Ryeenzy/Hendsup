// Cetak fungsi GLSL helper (fog/rim/rfade) untuk diuji numerik di WebGL2 (tests/shader_math.py).
#include <cstdio>
#include "../native/module/jni/liveshader.hpp"
int main() { printf("%s\n%s\n%s", rz::liveFogFn(), rz::liveRimFn(), rz::liveRfadeFn()); }
