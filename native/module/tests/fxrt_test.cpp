// Uji bagian murni runtime FX terhadap manifest asli hasil konversi (shader/fx-es).
#include <dirent.h>
#include <cstdio>
#include <fstream>
#include <sstream>
#include "../jni/fxrt_util.hpp"
using namespace rz::fxu;
static int fails = 0;
#define CK(c, m) do { if (!(c)) { printf("GAGAL: %s\n", m); fails++; } } while (0)
static std::string rd(const std::string& p) { std::ifstream f(p, std::ios::binary); std::stringstream ss; ss << f.rdbuf(); return ss.str(); }
int main(int argc, char** argv) {
    std::string root = argc > 1 ? argv[1] : "../../../shader/fx-es";
    DIR* d = opendir(root.c_str());
    if (!d) { printf("tidak ada %s\n", root.c_str()); return 1; }
    int n = 0, passes = 0, samplersChecked = 0, uniformsChecked = 0;
    while (dirent* e = readdir(d)) {
        if (e->d_name[0] == '.') continue;
        std::string man = root + "/" + e->d_name + "/manifest.json";
        std::string txt = rd(man);
        if (txt.empty()) continue;
        JV m;
        CK(parseJson(txt, m), "parse manifest");
        const JV* tq = m.get("techniques");
        CK(tq && tq->t == JV::Arr && !tq->a.empty(), "techniques");
        const JV* sm = m.get("samplers");
        {   // semua uniform manifest harus ketemu di deklarasi shader (nama bernamespace)
            std::vector<std::string> declared;
            for (const JV& t : tq->a) for (const JV& p : t.get("passes")->a) {
                for (const char* k : {"ps_file", "vs_file"}) for (const std::string& dn : declaredUniforms(rd(root + "/" + e->d_name + "/" + p.str(k)))) declared.push_back(dn);
            }
            if (const JV* us = m.get("uniforms"))
                for (const JV& u : us->a) {
                    const std::string g = resolveUniformName(declared, u.str("name"));
                    bool found = false;
                    for (const std::string& dn : declared) if (dn == g) found = true;
                    CK(found, (std::string("uniform tak ter-resolusi: ") + e->d_name + "." + u.str("name")).c_str());
                    uniformsChecked++;
                }
        }
        for (const JV& t : tq->a) for (const JV& p : t.get("passes")->a) {
            passes++;
            std::string ps = rd(root + "/" + e->d_name + "/" + p.str("ps_file"));
            CK(!ps.empty(), "ps_file ada");
            for (const JV& s : p.get("samplers")->a) {
                int idx = static_cast<int>(s.num("index"));
                CK(idx >= 0 && idx < static_cast<int>(sm->a.size()), "indeks sampler");
                std::string g = glNameSampler(sm->a[static_cast<size_t>(idx)].str("name"));
                CK(ps.find("uniform sampler2D " + g + ";") != std::string::npos, ("sampler tak ada di shader: " + g).c_str());
                samplersChecked++;
            }
        }
        n++;
    }
    closedir(d);
    CK(scaleDim(1920, 1920, 1960) == 1960 || scaleDim(1920, 1920, 1960) == 1920, "scale basis");
    CK(scaleDim(960, 1920, 1960) == 980, "scale 960->980");
    CK(scaleDim(256, 1920, 1960) == 256, "LUT 256 tidak diskalakan");
    CK(scaleDim(1, 1920, 1960) == 1, "1x1");
    CK(scaleDim(67, 1080, 1080) == 67, "sama");
    CK(glNameUniform("qUINT__FRAME_TIME") == "V_xqUINT_xFRAME_TIME", "nama uniform");
    CK(glNameSampler("V__qUINT__sBackBufferTex") == "V_xqUINT_xsBackBufferTex", "nama sampler");
    FxCfg c = parseFxCfg("# x\non=A,B\nv.A.Strength=0.5\nv.B.Color=1,0.2,0.1\n");
    CK(c.on.size() == 2 && c.on[1] == "B", "cfg on");
    CK(c.val.size() == 2 && c.val["B.Color"].size() == 3 && c.val["A.Strength"][0] == 0.5f, "cfg val");
    CK(resolveUniformName({"V_xpd80_conbrisat_xcontrast", "V_xAmount"}, "contrast") == "V_xpd80_conbrisat_xcontrast", "resolusi namespace");
    CK(resolveUniformName({"V_xpd80_conbrisat_xcontrast", "V_xAmount"}, "Amount") == "V_xAmount", "resolusi polos");
    CK(declaredUniforms("uniform highp float V_xa;\nuniform vec2 V_xns_xb;\n  uniform sampler2D s;\nfloat x;\n").size() == 3, "declaredUniforms");
    CK(imageKind("V__texMultiLUT", 1024, 576, true) == 1 && imageKind("V__texNoise", 512, 512, true) == 2 && imageKind("V__x__texPicture", 512, 512, true) == 0, "imageKind");
    {   // LUT identitas: sudut (0,0)=hitam, sudut akhir strip = putih, tile ke-2 (b) naik
        std::vector<unsigned char> px; fillImage(1, 1024, 32, px);
        CK(px[0] == 0 && px[1] == 0 && px[2] == 0, "LUT (0,0)");
        const size_t last = (static_cast<size_t>(31) * 1024 + 1023) * 4;
        CK(px[last] == 255 && px[last + 1] == 255 && px[last + 2] == 255, "LUT sudut akhir");
        const size_t t2 = (0 * 1024 + 32) * 4;
        CK(px[t2] == 0 && px[t2 + 2] == 255 / 31, "LUT tile biru ke-2");
    }
    {   // bentrok nama: VS tidak boleh menimpa varying vv_N dengan variabel struct lokal bernama sama
        const std::string vs = rd(root + "/qUINT_dof/E_xVS_ADOF.vert");
        CK(vs.find("S_xADOF_VSOUT vv_0") == std::string::npos, "qUINT_dof VS: nama lokal bentrok varying");
    }
    printf("fxrt_test: %d efek, %d pass, %d sampler, %d uniform diperiksa, gagal=%d\n", n, passes, samplersChecked, uniformsChecked, fails);
    return fails ? 1 : 0;
}
