"""RYEENZYXNZ - aturan ubah GLSL di dalam pack shader Roblox.

Semua perubahan konstanta dipanggang saat patch (engine Roblox tidak punya
uniform tambahan). Ganti preset = patch ulang dari APK asli.
"""
import re

F0_LITERAL = "vec3(0.039999999105930328369140625)"

DEFAULTS = {
    "wet": 0.0,             # 0..1  efek basah: roughness turun + highlight matahari tajam/kuat
    "contrast": 1.0, "saturation": 1.0, "brightness": 0.0,
    "warmth": 0.0, "vibrance": 0.0,
    "levels_black": 0.0, "levels_white": 1.0, "curves": 0.0,
    "bloom_gain": 1.0,
}


def _f(x):
    return "%.6f" % float(x)


def reflection_params(g):
    g = max(0.0, min(1.0, float(g)))
    return {
        "f0": 0.04 + 0.26 * g,          # reflektansi dasar (0.04 = bawaan Roblox)
        "lod": 5.0 * (1.0 - 0.7 * g),   # 5.0 = bawaan; kecil = pantulan lebih tajam
        "gain": 1.0 + 1.5 * g,          # penguat kekuatan pantulan
        "floor": 0.5 * g,               # pantulan minimum walau EnvSpec dunia = 0
    }


# --- REFLEKSI (dikendalikan "wet") -------------------------------------------------------------
_LOD_DECL = re.compile(rb"float (_\d+) = (_\d+) \* 5\.0;")
_STRENGTH = re.compile(
    rb"float (_\d+) = CB0\[31\]\.w \* clamp\(1\.0 - \(VARYING3\.w \* CB0\[28\]\.y\), 0\.0, 1\.0\);")


_ROUGH = re.compile(rb"float (_\d+) = (0\.08900000154972076416015625 \+ [^;]*);")
_SPEC_TAIL = re.compile(rb"\* CB0\[15\]\.xyz\) \* 1\.0\)")


def apply_wet(src, w):
    """Efek basah di shader PBR: kekasaran dikali kecil (highlight tajam) + highlight matahari diperkuat."""
    if w <= 0 or b"PrefilteredEnvTexture" not in src or b"reflect(" not in src:
        return src, 0
    n = 0
    k = 1.0 - 0.8 * w
    new = _ROUGH.sub(lambda m: b"float " + m.group(1) + b" = max((" + m.group(2) + b") * " + _f(k).encode() + b", 0.03);", src)
    if new != src:
        src, n = new, n + 1
    new = _SPEC_TAIL.sub(("* CB0[15].xyz) * %s)" % _f(1.0 + 3.0 * w)).encode(), src)
    if new != src:
        src, n = new, n + 1
    return src, n


def apply_reflection(src, g):
    """Return (src_baru, jumlah_perubahan). Hanya shader PBR yang punya reflect()+IBL."""
    if g <= 0 or b"PrefilteredEnvTexture" not in src or b"reflect(" not in src:
        return src, 0
    q = reflection_params(g)
    n = 0
    if F0_LITERAL.encode() in src:
        c = src.count(F0_LITERAL.encode())
        src = src.replace(F0_LITERAL.encode(), ("vec3(%s)" % _f(q["f0"])).encode())
        n += c

    def lod(m):
        var = m.group(1)
        # hanya LOD yang benar-benar dipakai sebagai argumen textureLod(...Env...)
        if re.search(rb"textureLod\(PrefilteredEnv(?:Indoor)?Texture,[^;]*,\s*" + re.escape(var) + rb"\)", src):
            return b"float " + var + b" = " + m.group(2) + b" * " + _f(q["lod"]).encode() + b";"
        return m.group(0)

    new = _LOD_DECL.sub(lod, src)
    if new != src:
        n += 1
        src = new

    def stren(m):
        return (b"float " + m.group(1) + b" = min(max(CB0[31].w, " + _f(q["floor"]).encode() +
                b") * clamp(1.0 - (VARYING3.w * CB0[28].y), 0.0, 1.0) * " + _f(q["gain"]).encode() +
                b", 1.0);")

    new = _STRENGTH.sub(stren, src)
    if new != src:
        n += 1
        src = new
    return src, n


# --- GRADING / COMPOSITE ------------------------------------------------
_OUT = re.compile(
    rb"( *)_entryPointOutput = vec4\(dot\((_\d+), CB1\[2\]\.xyz\) \+ CB1\[2\]\.w, "
    rb"dot\(\2, CB1\[3\]\.xyz\) \+ CB1\[3\]\.w, dot\(\2, CB1\[4\]\.xyz\) \+ CB1\[4\]\.w, 1\.0\);")
_BLOOM_MIX = re.compile(rb"vec3\(CB1\[5\]\.x\)")


def _is_identity(p):
    d = DEFAULTS
    return all(abs(float(p.get(k, d[k])) - d[k]) < 1e-6 for k in d if k != "wet")


def grade_function(p):
    P = {k: float(p.get(k, DEFAULTS[k])) for k in DEFAULTS}
    return (
        "vec3 rz_grade(vec3 lin)\n{\n"
        "    vec3 c = pow(max(lin, vec3(0.0)), vec3(0.4545455));\n"
        "    c = clamp((c - %s) / max(%s - %s, 0.001), 0.0, 1.0);\n"
        "    c = mix(c, (c * c) * (vec3(3.0) - (c * 2.0)), %s);\n"
        "    c = ((c - vec3(0.5)) * %s) + vec3(0.5 + %s);\n"
        "    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n"
        "    float s = max(c.x, max(c.y, c.z)) - min(c.x, min(c.y, c.z));\n"
        "    c = mix(vec3(l), c, max(%s + (%s * (1.0 - s)), 0.0));\n"
        "    c *= vec3(1.0 + (%s * 0.1), 1.0, 1.0 - (%s * 0.1));\n"
        "    return pow(clamp(c, vec3(0.0), vec3(1.0)), vec3(2.2));\n}\n\n"
    ) % (_f(P["levels_black"]), _f(P["levels_white"]), _f(P["levels_black"]), _f(P["curves"]),
         _f(P["contrast"]), _f(P["brightness"]), _f(P["saturation"]), _f(P["vibrance"]),
         _f(P["warmth"]), _f(P["warmth"]))


def apply_grade(src, p):
    """Sisipkan grading ke shader komposit akhir (tonemap + matriks warna CB1[2..4])."""
    m = _OUT.search(src)
    if not m or b"Texture0Texture" not in src:
        return src, 0
    n = 0
    if not _is_identity(p):
        var = m.group(2)
        call = m.group(1) + var + b" = rz_grade(" + var + b");\n"
        src = src[:m.start()] + call + src[m.start():]
        i = src.find(b"void main()")
        src = src[:i] + grade_function(p).encode() + src[i:]
        n += 1
    bg = float(p.get("bloom_gain", 1.0))
    if abs(bg - 1.0) > 1e-6 and _BLOOM_MIX.search(src):
        src = _BLOOM_MIX.sub(("vec3(clamp(CB1[5].x * %s, 0.0, 1.0))" % _f(bg)).encode(), src)
        n += 1
    return src, n


def transform(src, params):
    total = 0
    wet = float(params.get("wet", 0.0))
    src, a = apply_reflection(src, wet)
    total += a
    src, a = apply_wet(src, wet)
    total += a
    src, b = apply_grade(src, params)
    total += b
    return src, total
