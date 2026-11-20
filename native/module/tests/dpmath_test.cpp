#include <cstdio>
#include "../jni/dpmath.hpp"
int main() {
    double m[16] = {2, 0, 0, 1, 0, 3, 0, 0, 0, 0, 4, 2, 1, 0, 0, 5}, inv[16];
    if (!rz::dpInvert4x4(m, inv)) { puts("singular?"); return 1; }
    double md = 0;
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) {
            double s = 0;
            for (int k = 0; k < 4; k++) s += m[i * 4 + k] * inv[k * 4 + j];
            md = std::fmax(md, std::fabs(s - (i == j ? 1.0 : 0.0)));
        }
    double z[16] = {0};
    bool sing = !rz::dpInvert4x4(z, inv);
    if (md > 1e-12 || !sing) { printf("dpmath FAIL %g %d\n", md, sing); return 1; }
    puts("dpmath_test OK");
    return 0;
}
