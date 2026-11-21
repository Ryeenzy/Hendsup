"""RYEENZYXNZ - preset ReShade (.ini/.txt) -> parameter shader pack.

Hanya efek yang punya padanan nyata di pipeline Roblox yang dipetakan:
  BloomingHDR -> bloom_gain/kontras/saturasi/gamma, qUINT_ssr -> (diabaikan; pakai SSR layar),
  Clarity -> kontras, Curves, Levels (tepat), Vibrance, Tonemap.
Sisanya (Deband, FXAA, SMAA, LumaSharpen, MXAO, ADOF) dilaporkan sebagai tidak diterapkan.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from shader_rules import DEFAULTS


def clamp(x, a, b):
    return a if x < a else b if x > b else x


def parse(text):
    ini, cur, order = {"": {}}, "", []
    cur = ini[""]
    for raw in text.lstrip("﻿").splitlines():
        line = raw.strip()
        if not line or line[0] in ";#" or line.startswith("//"):
            continue
        if line.startswith("[") and line.endswith("]"):
            name = line[1:-1].strip().lower()
            ini.setdefault(name, {})
            order.append(name)
            cur = ini[name]
        elif "=" in line:
            k, v = line.split("=", 1)
            cur[k.strip().lower()] = v.strip()
    return ini, order


def _stem(n):
    n = n.split("@", 1)[-1].strip().lower()
    return n[:-3] if n.endswith(".fx") else n


class _P:
    def __init__(self, sec):
        self.s = sec or {}

    def n(self, k, d):
        try:
            return float(self.s[k].split(",")[0])
        except (KeyError, ValueError):
            return d

    def vec(self, k):
        try:
            return [float(x) for x in self.s[k].split(",")]
        except (KeyError, ValueError):
            return []


def from_text(text):
    ini, order = parse(text)
    tech = ini[""].get("techniques")
    files = []
    for it in (tech.split(",") if tech else order):
        s = _stem(it)
        if s and s not in files:
            files.append(s)
    c = dict(DEFAULTS)
    applied, ignored = [], []
    for s in files:
        p = _P(ini.get(s + ".fx") or ini.get(s))
        if s == "bloominghdr":
            bi = p.vec("bloom_intensity") or [0.1, 0.5]
            bloom = clamp((bi[0] + bi[-1]) * 0.8, 0, 3)
            c["bloom_gain"] = 1.0 + 1.5 * clamp(bloom, 0, 1.5)
            c["brightness"] += clamp((2.2 - p.n("gamma", 2.2)) * 0.04, -0.15, 0.15)
            c["contrast"] += clamp((p.n("contrast", 1) - 1) * 0.5, -0.5, 0.5)
            c["saturation"] += clamp(p.n("saturate", 1) - 1, -1, 1)
            applied.append("BloomingHDR -> bloom_gain %.2f + koreksi warna" % c["bloom_gain"])
        elif s == "quint_ssr":
            ignored.append("qUINT_ssr: belum ada padanan di patcher (gunakan SSR di panel)")
        elif s == "clarity":
            st = p.n("claritystrength", 0)
            if st > 0:
                c["contrast"] += clamp(st * 0.15, 0, 0.3)
            applied.append("Clarity -> kontras")
        elif s == "curves":
            c["curves"] = clamp(p.n("contrast", 0) * 1.5, 0, 1)
            applied.append("Curves -> S-curve %.2f" % c["curves"])
        elif s == "levels":
            c["levels_black"] = clamp(p.n("blackpoint", 0), 0, 127) / 255
            c["levels_white"] = clamp(p.n("whitepoint", 255), 128, 255) / 255
            applied.append("Levels %.0f-%.0f (tepat)" % (c["levels_black"] * 255, c["levels_white"] * 255))
        elif s == "vibrance":
            c["vibrance"] += clamp(p.n("vibrance", 0), -1, 1)
            applied.append("Vibrance")
        elif s == "tonemap":
            c["saturation"] += clamp(p.n("saturation", 0), -1, 1)
            c["brightness"] += clamp((1 - p.n("gamma", 1)) * 0.1, -0.15, 0.15)
            applied.append("Tonemap -> saturasi/gamma")
        else:
            ignored.append(s)
    return c, applied, ignored


def load(path):
    """Terima .ini/.txt ReShade atau .json parameter langsung."""
    import json
    text = open(path, encoding="utf-8", errors="replace").read()
    if path.lower().endswith(".json"):
        c = dict(DEFAULTS)
        c.update(json.loads(text))
        return c, ["json langsung"], []
    return from_text(text)
