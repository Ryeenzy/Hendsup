#pragma once
#include <cmath>
#include <cstring>
#include <utility>

namespace rz {

// invers matriks 4x4 baris-mayor (eliminasi Gauss-Jordan, pivot parsial); false bila singular
inline bool dpInvert4x4(const double m[16], double out[16]) {
    double a[16], r[16];
    memcpy(a, m, sizeof a);
    for (int i = 0; i < 16; i++) r[i] = (i % 5 == 0) ? 1.0 : 0.0;
    for (int i = 0; i < 4; i++) {
        int p = i;
        for (int k = i + 1; k < 4; k++)
            if (std::fabs(a[k * 4 + i]) > std::fabs(a[p * 4 + i])) p = k;
        if (std::fabs(a[p * 4 + i]) < 1e-14) return false;
        if (p != i)
            for (int j = 0; j < 4; j++) { std::swap(a[i * 4 + j], a[p * 4 + j]); std::swap(r[i * 4 + j], r[p * 4 + j]); }
        double d = a[i * 4 + i];
        for (int j = 0; j < 4; j++) { a[i * 4 + j] /= d; r[i * 4 + j] /= d; }
        for (int k = 0; k < 4; k++) {
            if (k == i) continue;
            double f = a[k * 4 + i];
            for (int j = 0; j < 4; j++) { a[k * 4 + j] -= f * a[i * 4 + j]; r[k * 4 + j] -= f * r[i * 4 + j]; }
        }
    }
    memcpy(out, r, sizeof r);
    return true;
}

}  // namespace rz
