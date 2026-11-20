// Tulis tiap pass depth pipeline ke file (dipakai tests/dpipe_math.py dan glslang).
#include <cstdio>
#include <string>
#include "../native/module/jni/dpipe_shaders.hpp"
int main(int argc, char** argv) {
    const char* n[] = {"ao", "ssr", "comp", "final", "focus"};
    for (int i = 0; i < 5; i++) {
        std::string path = std::string(argv[1]) + "/" + n[i] + ".frag";
        FILE* f = fopen(path.c_str(), "w");
        std::string s = rz::dpFragment(static_cast<rz::DpPass>(i));
        fwrite(s.data(), 1, s.size(), f);
        fclose(f);
    }
    FILE* f = fopen((std::string(argv[1]) + "/v.vert").c_str(), "w");
    fputs(rz::dpVertex(), f);
    fclose(f);
}
