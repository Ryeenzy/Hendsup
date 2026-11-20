// Rewrite rules for Roblox's own GLSL, applied inside glShaderSource before the driver compiles it.
// Rule file (rz_shader_rules.txt), one rule per line, '#' = comment:
//     [contains:TEXT] FIND ==> REPLACE
// "[contains:..]" is optional: the rule only runs on shaders whose ORIGINAL source contains TEXT.
// FIND/REPLACE accept the escapes \n \t \\ . Every occurrence of FIND is replaced.
#pragma once
#include <cstdint>
#include <cstdio>
#include <string>
#include <vector>

namespace rz {

struct Rule { std::string cond, find, repl; };

inline std::string unescape(const std::string& s) {
    std::string o;
    for (size_t i = 0; i < s.size(); i++) {
        if (s[i] == '\\' && i + 1 < s.size()) {
            char n = s[i + 1];
            if (n == 'n') { o += '\n'; i++; continue; }
            if (n == 't') { o += '\t'; i++; continue; }
            if (n == '\\') { o += '\\'; i++; continue; }
        }
        o += s[i];
    }
    return o;
}

inline std::string trimStr(const std::string& s) {
    size_t a = s.find_first_not_of(" \t\r"), b = s.find_last_not_of(" \t\r");
    return a == std::string::npos ? std::string() : s.substr(a, b - a + 1);
}

inline std::vector<Rule> parseRules(const std::string& text) {
    std::vector<Rule> out;
    size_t pos = 0;
    while (pos <= text.size()) {
        size_t nl = text.find('\n', pos);
        if (nl == std::string::npos) nl = text.size();
        std::string line = trimStr(text.substr(pos, nl - pos));
        pos = nl + 1;
        if (line.empty() || line[0] == '#') continue;
        Rule r;
        if (line.rfind("[contains:", 0) == 0) {
            size_t e = line.find(']');
            if (e == std::string::npos) continue;
            r.cond = unescape(line.substr(10, e - 10));
            line = trimStr(line.substr(e + 1));
        }
        size_t arrow = line.find("==>");
        if (arrow == std::string::npos) continue;
        r.find = unescape(trimStr(line.substr(0, arrow)));
        r.repl = unescape(trimStr(line.substr(arrow + 3)));
        if (r.find.empty()) continue;
        out.push_back(r);
        if (out.size() >= 256) break;
    }
    return out;
}

// Returns the rewritten source; *hits = number of rules that changed something.
inline std::string applyRules(const std::string& src, const std::vector<Rule>& rules, int* hits) {
    std::string cur = src;
    int n = 0;
    for (const Rule& r : rules) {
        if (!r.cond.empty() && src.find(r.cond) == std::string::npos) continue;
        size_t p = 0;
        bool any = false;
        std::string out;
        while (true) {
            size_t q = cur.find(r.find, p);
            if (q == std::string::npos) { out.append(cur, p, std::string::npos); break; }
            out.append(cur, p, q - p);
            out += r.repl;
            p = q + r.find.size();
            any = true;
            if (out.size() > (1u << 20)) { out = cur; any = false; break; }  // runaway growth: keep previous text
        }
        if (any) { cur.swap(out); n++; }
    }
    if (hits) *hits = n;
    return cur;
}

inline std::string hashHex(const std::string& s) {  // FNV-1a 64
    uint64_t h = 1469598103934665603ull;
    for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; }
    char b[20];
    snprintf(b, sizeof b, "%016llx", static_cast<unsigned long long>(h));
    return b;
}

}  // namespace rz
