#!/usr/bin/env python3
"""Kontrak tab EFFECT: daftar UI (fx_ui.json) == shader runtime (fx-es), dan panel benar-benar memuatnya.
Juga: allow_any_build default ON di Java+C++, Safe Mode tidak punya jalur masuk."""
import json, os, re, sys
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ui = json.load(open(os.path.join(R, "shader/fx-ui/fx_ui.json")))["effects"]
fxdir = os.path.join(R, "shader/fx-es")
bad = []
ids = set()
for e in ui:
    ids.add(e["id"])
    mp = os.path.join(fxdir, e["id"], "manifest.json")
    if not os.path.isfile(mp):
        bad.append("tidak ada manifest untuk %s" % e["id"]); continue
    man = json.load(open(mp))
    mu = {u["name"]: u for u in man["uniforms"]}
    for u in e.get("uniforms", []):
        m = mu.get(u["name"])
        if m is None: bad.append("%s.%s ada di UI tapi tidak di manifest" % (e["id"], u["name"])); continue
        if u["n"] != m["rows"] * m["cols"]: bad.append("%s.%s komponen UI=%d manifest=%d" % (e["id"], u["name"], u["n"], m["rows"] * m["cols"]))
dirs = {d for d in os.listdir(fxdir) if os.path.isfile(os.path.join(fxdir, d, "manifest.json"))}
for d in sorted(dirs - ids): bad.append("efek %s ada di runtime tapi tidak di UI (tak terjangkau)" % d)
print("efek UI=%d runtime=%d" % (len(ids), len(dirs)))

panel = open(os.path.join(R, "native/overlay/com/ryeenzyxnz/overlay/RzPanel.java")).read()
if 'page("EFFECT")' not in panel: bad.append("tab EFFECT tidak dibuat")
if not re.search(r"buildEffectPage\(\);", panel): bad.append("buildEffectPage() tidak dipanggil")
if len(re.findall(r"buildFxInto\(p\)", panel)) < 1: bad.append("buildFxInto tidak dipanggil")
if "fxEnsureRunning();" not in panel: bad.append("saklar efek tidak menyalakan Depth Pipeline")
if 'case "EFFECT"' not in panel: bad.append("ikon tab EFFECT tidak ada")

st = open(os.path.join(R, "native/overlay/com/ryeenzyxnz/overlay/RzState.java")).read()
cf = open(os.path.join(R, "native/module/jni/config.hpp")).read()
if 'b("allow_any_build", true)' not in st: bad.append("Java: allow_any_build bukan default ON")
if not re.search(r"bool allowAnyBuild = true;", cf): bad.append("C++: allow_any_build bukan default ON")
if "Reset safe mode" in panel: bad.append("tombol safe mode masih ada")
core = open(os.path.join(R, "native/module/jni/core.cpp")).read()
if core.count("c.safe = false;") < 1 or "g_cfg.safe = false;" not in core: bad.append("core tidak memaksa safe=false")

if bad:
    print("GAGAL:"); [print(" -", b) for b in bad]; sys.exit(1)
print("FX CONTRACT PASS")
