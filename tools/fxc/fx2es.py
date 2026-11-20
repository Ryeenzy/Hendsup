#!/usr/bin/env python3
"""fx2es: converte saída do fxc (GLSL 4.30 de reshadefx) para GLSL ES 3.00 por entry point.
uso: fx2es.py base.glsl base.json outdir  -> outdir/<EntryPoint>.vert|frag e outdir/manifest.json"""
import re, sys, json, os

def convert(src, entry, stage):
    s = "#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\nprecision highp sampler3D;\n#define %s\n" % entry
    body = src.split("\n", 1)[1]  # tira "#version 430"
    # UBO -> uniforms individuais
    def unwrap(m):
        inner = m.group(1)
        out = []
        for line in inner.split(";"):
            line = line.strip()
            if line:
                out.append("uniform " + line + ";")
        return "\n".join(out) + "\n"
    body = re.sub(r"layout\([^)]*\)\s*uniform\s+_Globals\s*\{(.*?)\};", unwrap, body, flags=re.S)
    body = re.sub(r"layout\(binding\s*=\s*\d+\)\s*uniform", "uniform", body)
    # varyings por location -> nomes vv_N ; saidas do fragment ficam layout(location)
    ren = {}
    def rep(m):
        flat, loc, io, ty, name = (m.group(1) or ""), m.group(2), m.group(3), m.group(4), m.group(5)
        if stage == "frag" and io == "out":
            return "layout(location = %s) out %s %s;" % (loc, ty, name)
        ren[name] = "vv_" + loc
        return "%s%s %s vv_%s;" % (("flat " if flat else ""), io, ty, loc)
    body = re.sub(r"layout\(location\s*=\s*(\d+)\)\s*(flat\s+)?(in|out)\s+(\w+)\s+(\w+);",
                  lambda m: rep(type("M", (), {"group": lambda self, i: {1: m.group(2), 2: m.group(1), 3: m.group(3), 4: m.group(4), 5: m.group(5)}[i]})()), body)
    for k, v in ren.items():
        body = re.sub(r"\b%s\b" % re.escape(k), v, body)
    if stage == "vert":
        body = body.replace("discard;", "")
    body = "#define ldexp(x, e) ((x) * exp2(float(e)))\n" + body
    body = "#define fma(a, b, c) ((a) * (b) + (c))\n" + body
    if stage == "vert":
        body = "#define dFdx(x) (x)\n#define dFdy(x) (x)\n#define fwidth(x) (x)\n" + body
    body = re.sub(r"#extension\s+GL_EXT_control_flow_attributes[^\n]*\n", "", body)
    body = re.sub(r"#if GL_EXT_control_flow_attributes\n\s*\[\[\w+\]\]\n#endif\n", "", body)
    body = body.replace("uint id = gl_VertexID;", "uint id = uint(gl_VertexID);")
    body = body.replace("gl_InstanceID", "gl_InstanceID")
    return s + body

def main():
    glsl = open(sys.argv[1]).read()
    meta = json.load(open(sys.argv[2]))
    od = sys.argv[3]
    os.makedirs(od, exist_ok=True)
    man = {"techniques": []}
    seen = {}
    for t in meta["techniques"]:
        tt = {"name": t["name"], "passes": []}
        for p in t["passes"]:
            pp = dict(p)
            for key, stage, ext in (("vs", "vert", "vert"), ("ps", "frag", "frag")):
                e = p[key]
                if not e: continue
                fn = "%s.%s" % (e, ext)
                if fn not in seen:
                    open(os.path.join(od, fn), "w").write(convert(glsl, e, stage))
                    seen[fn] = 1
                pp[key + "_file"] = fn
            tt["passes"].append(pp)
        man["techniques"].append(tt)
    for k in ("textures", "samplers", "uniforms", "total_uniform_size"):
        man[k] = meta[k]
    json.dump(man, open(os.path.join(od, "manifest.json"), "w"), indent=1)
    print("ok", od, len(seen), "shaders")

main()
