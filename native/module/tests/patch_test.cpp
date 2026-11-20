#include <cassert>
#include <cstdio>
#include "../jni/shaderpatch.hpp"
#include "../jni/config.hpp"

int main() {
    using namespace rz;
    const std::string src = "#version 300 es\nuniform float u_spec;\nvoid main() {\n  fragColor = vec4(c, 1.0);\n}\n";
    auto rules = parseRules(
        "# komentar\n"
        "[contains:u_spec] fragColor = vec4(c, 1.0); ==> c += vec3(0.1);\\n  fragColor = vec4(c, 1.0);\n"
        "[contains:TIDAK_ADA] void main ==> void XXX\n"
        "bukan aturan\n"
        "uniform float u_spec; ==> uniform float u_spec;\\nuniform float rz_gloss;\n");
    assert(rules.size() == 3);
    int hits = 0;
    std::string out = applyRules(src, rules, &hits);
    assert(hits == 2);                                              // rule dengan syarat yang tidak terpenuhi dilewati
    assert(out.find("c += vec3(0.1);\n  fragColor") != std::string::npos);
    assert(out.find("uniform float rz_gloss;") != std::string::npos);
    assert(out.find("XXX") == std::string::npos);
    assert(applyRules(src, parseRules("zzz ==> yyy\n"), &hits) == src && hits == 0);  // tidak ada perubahan
    // semua kemunculan diganti
    assert(applyRules("a a a", parseRules("a ==> bb\n"), &hits) == "bb bb bb" && hits == 1);
    // pertumbuhan tak terkendali ditolak (tetap teks sebelumnya)
    std::string big(600000, 'a');
    assert(applyRules(big, parseRules("a ==> aaaa\n"), &hits) == big && hits == 0);
    assert(hashHex("abc") == hashHex("abc") && hashHex("abc") != hashHex("abd") && hashHex("x").size() == 16);
    Config c;
    assert(parseConfig("shader_dump=1\nshader_rules=1\nblock_program_binary=0\nclear_shader_cache=1\n", c) && c.shaderDump && c.shaderRules && !c.blockProgramBinary && c.clearShaderCache);
    puts("patch_test OK");
    return 0;
}
