// Contract test: Java overlay config is accepted by the native parser; defaults are fail-safe OFF.
#include <cassert>
#include <cstdio>
#include <fstream>
#include <sstream>
#include "../jni/config.hpp"
#include "../jni/liveshader.hpp"

static std::string slurp(const char* p) {
    std::ifstream f(p);
    std::stringstream s;
    s << f.rdbuf();
    return s.str();
}

int main(int argc, char** argv) {
    rz::Config defaults;
    assert(!defaults.enabled && !defaults.master && !defaults.live);
    assert(!defaults.fogOn && !defaults.rimOn && !defaults.hdrOn);
    assert(defaults.depthPipe && !defaults.mxOn && !defaults.ssOn);
    assert(!defaults.dfOn && !defaults.olOn && defaults.forceGles);

    rz::LiveParams neutral = rz::liveParams(defaults);
    assert(neutral.u[0][0] == 0.04f && neutral.u[0][1] == 5.f);
    assert(neutral.u[2][1] == 1.f && neutral.u[2][3] == 1.f);

    if (argc > 1) {
        std::string text = slurp(argv[1]);
        assert(!text.empty());
        rz::Config parsed;
        assert(rz::parseConfig(text, parsed));
        assert(!parsed.enabled && !parsed.master && !parsed.live);
        assert(!parsed.fogOn && !parsed.rimOn && !parsed.hdrOn);
        assert(parsed.depthPipe && !parsed.mxOn && !parsed.ssOn);
        assert(!parsed.dfOn && !parsed.olOn && parsed.forceGles);
        puts("Java/native config contract OK");
    }

    rz::Config keep;
    keep.bloom = 0.25f;
    assert(!rz::parseConfig("bloom=0.5\nunknown_key=1\n", keep) && keep.bloom == 0.25f);
    assert(!rz::parseConfig("bloom=9\n", keep));
    assert(!rz::parseConfig("bloom=nan\n", keep));
    assert(!rz::parseConfig("levels_white=0.1\n", keep));
    assert(!rz::parseConfig("garbage\n", keep));
    assert(rz::parseConfig("# komentar\r\nbloom=1.5\r\n", keep) && keep.bloom == 1.5f);

    rz::Config live;
    assert(rz::parseConfig("enabled=1\nmaster=1\nlive=1\nbrightness=0.3\n", live));
    rz::LiveParams active = rz::liveParams(live);
    assert(active.u[3][0] != 0.f);
    live.live = false;
    rz::LiveParams disabled = rz::liveParams(live);
    assert(disabled.u[3][0] == 0.f);

    // "Izinkan versi Roblox lain" default ON; Safe Mode/disable tidak bisa diaktifkan lewat berkas config.
    {
        rz::Config d;
        assert(d.allowAnyBuild);
        rz::Config s;
        assert(rz::parseConfig("safe=1\ndisable=1\n", s));
        assert(!s.safe && !s.disable);
        rz::Config e;
        assert(rz::parseConfig("bloom=0.5\n", e) && e.allowAnyBuild);
        rz::Config off;
        assert(rz::parseConfig("allow_any_build=0\n", off) && !off.allowAnyBuild);
    }

    puts("config_test OK");
    return 0;
}
