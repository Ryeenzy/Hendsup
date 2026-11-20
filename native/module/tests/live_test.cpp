// uji: liveRewrite pada shader-shader asli (dump dari pack) -> tulis hasil; validasi GLSL dilakukan skrip luar.
#include <cstdio>
#include <fstream>
#include <sstream>
#include <string>
#include "../jni/liveshader.hpp"
int main(int argc, char** argv) {
    if (argc < 3) return 2;
    int touched = 0, total = 0;
    for (int i = 2; i < argc; i++) {
        std::ifstream f(argv[i], std::ios::binary);
        std::stringstream ss; ss << f.rdbuf();
        total++;
        int e = 0;
        std::string out = rz::liveRewrite(ss.str(), &e);
        if (out.empty()) continue;
        touched++;
        std::ofstream o(std::string(argv[1]) + "/" + std::to_string(i) + ".out", std::ios::binary);
        o << out;
    }
    rz::Config c;  // netral -> parameter identitas
    rz::LiveParams p = rz::liveParams(c);
    bool ok = p.u[0][0] == 0.04f && p.u[0][1] == 5.f && p.u[0][3] == 1.f && p.u[1][0] == 1.f && p.u[1][1] == 1.f &&
              p.u[2][1] == 1.f && p.u[2][3] == 1.f && p.u[3][1] == 1.f && p.u[4][0] == 1.f && p.u[4][1] == 1.f && p.u[4][2] == 0.f &&
              p.u[4][3] == 1.f && p.u[6][0] == 1.f && p.u[6][2] == 1.f && p.u[6][3] == 0.f && p.u[5][0] == 0.f &&
              p.u[8][0] == 1.f && p.u[8][1] == 1.f && p.u[8][2] == 0.f && p.u[8][3] == 1.f && p.u[9][3] == 0.f &&
              p.u[15][0] == 0.f && p.u[15][2] == 0.f && p.u[15][3] == 1.f && p.u[16][0] == 0.f && p.u[16][3] == 0.f && p.u[17][0] == 0.f &&
              p.u[18][0] == 0.f && p.u[18][1] == 0.f && p.u[18][2] == 0.f && p.u[19][0] == 1.f && p.u[19][1] == 0.f;
    printf("total=%d disentuh=%d identitas=%s\n", total, touched, ok ? "OK" : "SALAH");
    return ok ? 0 : 1;
}
