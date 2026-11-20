// RYEENZYXNZ runtime FX: bagian murni (tanpa GL) agar bisa diuji di host: JSON mini, parser rz_fx.cfg, penamaan uniform, ukuran tekstur.
#pragma once
#include <cmath>
#include <cstdlib>
#include <cstring>
#include <map>
#include <string>
#include <utility>
#include <vector>

namespace rz {
namespace fxu {

struct JV {
    enum T { Null, Num, Str, Arr, Obj, Bool } t = Null;
    double n = 0;
    std::string s;
    std::vector<JV> a;
    std::vector<std::pair<std::string, JV>> o;
    const JV* get(const char* k) const {
        for (const auto& kv : o) if (kv.first == k) return &kv.second;
        return nullptr;
    }
    double num(const char* k, double d = 0) const { const JV* v = get(k); return v && (v->t == Num || v->t == Bool) ? v->n : d; }
    std::string str(const char* k, const std::string& d = "") const { const JV* v = get(k); return v && v->t == Str ? v->s : d; }
};

struct JP {
    const std::string& s;
    size_t i = 0;
    bool bad = false;
    explicit JP(const std::string& src) : s(src) {}
    void ws() { while (i < s.size() && (s[i] == ' ' || s[i] == '\n' || s[i] == '\t' || s[i] == '\r')) i++; }
    bool lit(const char* w) { size_t n = strlen(w); if (s.compare(i, n, w) == 0) { i += n; return true; } return false; }
    JV val(int depth = 0) {
        JV v;
        ws();
        if (i >= s.size() || depth > 64) { bad = true; return v; }
        char c = s[i];
        if (c == '{') {
            i++; v.t = JV::Obj; ws();
            if (i < s.size() && s[i] == '}') { i++; return v; }
            while (!bad) {
                ws();
                JV k = val(depth + 1);
                if (k.t != JV::Str) { bad = true; break; }
                ws();
                if (i >= s.size() || s[i] != ':') { bad = true; break; }
                i++;
                JV x = val(depth + 1);
                v.o.emplace_back(k.s, std::move(x));
                ws();
                if (i < s.size() && s[i] == ',') { i++; continue; }
                if (i < s.size() && s[i] == '}') { i++; break; }
                bad = true;
            }
        } else if (c == '[') {
            i++; v.t = JV::Arr; ws();
            if (i < s.size() && s[i] == ']') { i++; return v; }
            while (!bad) {
                v.a.push_back(val(depth + 1));
                ws();
                if (i < s.size() && s[i] == ',') { i++; continue; }
                if (i < s.size() && s[i] == ']') { i++; break; }
                bad = true;
            }
        } else if (c == '"') {
            i++; v.t = JV::Str;
            while (i < s.size() && s[i] != '"') {
                if (s[i] == '\\' && i + 1 < s.size()) {
                    char e = s[++i];
                    if (e == 'n') v.s += '\n'; else if (e == 't') v.s += '\t'; else if (e == 'r') v.s += '\r';
                    else if (e == 'u' && i + 4 < s.size()) { v.s += static_cast<char>(strtol(s.substr(i + 1, 4).c_str(), nullptr, 16) & 0x7f); i += 4; }
                    else v.s += e;
                } else v.s += s[i];
                i++;
            }
            if (i >= s.size()) bad = true; else i++;
        } else if (lit("true")) { v.t = JV::Bool; v.n = 1; }
        else if (lit("false")) { v.t = JV::Bool; v.n = 0; }
        else if (lit("null")) { v.t = JV::Null; }
        else {
            const char* b = s.c_str() + i;
            char* e = nullptr;
            v.n = strtod(b, &e);
            if (e == b) { bad = true; return v; }
            v.t = JV::Num;
            i += static_cast<size_t>(e - b);
        }
        return v;
    }
};

inline bool parseJson(const std::string& src, JV& out) {
    JP p(src);
    out = p.val();
    return !p.bad;
}

// nama GL dari nama manifest: "__" -> "_x" (sampler/tekstur), uniform: "V_x" + nama (dengan penggantian yang sama)
inline std::string glNameSampler(const std::string& n) {
    std::string r;
    for (size_t i = 0; i < n.size(); i++) {
        if (n[i] == '_' && i + 1 < n.size() && n[i + 1] == '_') { r += "_x"; i++; } else r += n[i];
    }
    return r;
}
inline std::string glNameUniform(const std::string& n) { return "V_x" + glNameSampler(n); }

// ukuran tekstur efek: dikompilasi di BUFFER 1920x1080; skalakan bila ukuran = buffer / 2^k
inline int scaleDim(int v, int baked, int actual) {
    if (actual == baked || v <= 1) return v;
    for (int k = 0; k < 9; k++) {
        double e = baked / std::pow(2.0, k);
        if (std::fabs(v - e) <= 1.0) { int r = static_cast<int>(std::lround(actual / std::pow(2.0, k))); return r < 1 ? 1 : r; }
    }
    return v;
}

// rz_fx.cfg: on=A,B ; v.Efek.Uniform=a,b,c
struct FxCfg {
    std::vector<std::string> on;
    std::map<std::string, std::vector<float>> val;   // kunci "Efek.Uniform"
};
inline FxCfg parseFxCfg(const std::string& text) {
    FxCfg c;
    size_t pos = 0;
    while (pos <= text.size()) {
        size_t nl = text.find('\n', pos);
        std::string line = text.substr(pos, nl == std::string::npos ? std::string::npos : nl - pos);
        pos = nl == std::string::npos ? text.size() + 1 : nl + 1;
        size_t eq = line.find('=');
        if (eq == std::string::npos || eq == 0 || line[0] == '#') continue;
        std::string k = line.substr(0, eq), v = line.substr(eq + 1);
        while (!k.empty() && k.back() == ' ') k.pop_back();
        while (!v.empty() && (v.back() == '\r' || v.back() == ' ')) v.pop_back();
        if (k == "on") {
            size_t p = 0;
            while (p <= v.size()) {
                size_t cm = v.find(',', p);
                std::string t = v.substr(p, cm == std::string::npos ? std::string::npos : cm - p);
                p = cm == std::string::npos ? v.size() + 1 : cm + 1;
                if (!t.empty()) c.on.push_back(t);
            }
        } else if (k.compare(0, 2, "v.") == 0) {
            std::vector<float> f;
            size_t p = 0;
            while (p <= v.size()) {
                size_t cm = v.find(',', p);
                std::string t = v.substr(p, cm == std::string::npos ? std::string::npos : cm - p);
                p = cm == std::string::npos ? v.size() + 1 : cm + 1;
                f.push_back(static_cast<float>(atof(t.c_str())));
            }
            c.val[k.substr(2)] = f;
        }
    }
    return c;
}

}  // namespace fxu
}  // namespace rz
