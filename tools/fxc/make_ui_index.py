#!/usr/bin/env python3
"""Gabungkan manifest hasil fxc (anotasi ui_*) menjadi satu indeks UI ringkas: shader/fx-ui/fx_ui.json
uso: make_ui_index.py <dir_json_fxc> <out.json>   (dir berisi <efek>.json dari fxc)"""
import json, os, sys

def first(v, d=0.0):
    if isinstance(v, list): return v[0] if v else d
    return v

def main():
    src, out = sys.argv[1], sys.argv[2]
    effects = []
    for fn in sorted(os.listdir(src)):
        if not fn.endswith(".json"): continue
        m = json.load(open(os.path.join(src, fn)))
        name = fn[:-5]
        techs = []
        for i, t in enumerate(m["techniques"]):
            ann = m.get("tech_ann", [{}] * len(m["techniques"]))[i] if i < len(m.get("tech_ann", [])) else {}
            techs.append({"name": t["name"], "label": ann.get("ui_label", t["name"]), "tip": ann.get("ui_tooltip", "")})
        unis = []
        for u in m["uniforms"]:
            a = u.get("ann", {})
            if "source" in a: continue          # frametime, timer, dll: diisi engine
            ty = a.get("ui_type", "")
            if not ty:
                ty = "checkbox" if u["bool"] else ("drag" if u["float"] else "drag")
            n = u["rows"] * u["cols"]
            e = {"name": u["name"], "label": a.get("ui_label", u["name"]), "type": ty, "n": n,
                 "float": u["float"], "bool": u["bool"], "def": u["def"][:n]}
            for k in ("ui_min", "ui_max", "ui_step"):
                if k in a: e[k[3:]] = first(a[k])
            if "ui_items" in a: e["items"] = [x for x in a["ui_items"].split("\n") if x]
            if "ui_category" in a: e["cat"] = a["ui_category"]
            if "ui_tooltip" in a: e["tip"] = a["ui_tooltip"]
            unis.append(e)
        if techs:
            effects.append({"id": name, "techs": techs, "uniforms": unis})
    json.dump({"effects": effects}, open(out, "w"), separators=(",", ":"), ensure_ascii=False)
    print("efek:", len(effects), "uniform:", sum(len(e["uniforms"]) for e in effects), "->", out, os.path.getsize(out), "byte")

main()
