#!/usr/bin/env python3
"""RYEENZYXNZ - UI pengaturan (web lokal di HP). Jalankan di Termux, buka di browser.

  python3 ui/rz_ui.py            -> http://127.0.0.1:8777
Slider/preset/impor ReShade -> tombol PATCH (patch + tanda tangan) -> tombol PASANG (adb).
Hanya mendengarkan 127.0.0.1.
"""
import glob
import json
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, os.path.join(ROOT, "patcher"))
import reshade_ini
import shader_rules

HOME = os.path.expanduser("~")
APK_DIR = os.environ.get("RZ_APKS", os.path.join(HOME, "apks"))
WORK = os.environ.get("RZ_WORK", os.path.join(HOME, "rz_work"))
PKG = os.environ.get("RZ_PKG", "com.roblox.client")
PORT = int(os.environ.get("RZ_PORT", "8777"))

SLIDERS = [  # kunci, label, min, max, step
    ("glossy", "Glossy (pantulan)", 0, 1, 0.01),
    ("wet", "Efek basah (becek)", 0, 1, 0.01),
    ("contrast", "Kontras", 0.5, 1.8, 0.01),
    ("saturation", "Saturasi", 0, 2, 0.01),
    ("brightness", "Kecerahan", -0.15, 0.15, 0.005),
    ("warmth", "Hangat/Dingin", -1, 1, 0.01),
    ("vibrance", "Vibrance", -1, 1, 0.01),
    ("levels_black", "Levels hitam", 0, 0.5, 0.005),
    ("levels_white", "Levels putih", 0.5, 1, 0.005),
    ("curves", "Curves (S-curve)", 0, 1, 0.01),
    ("bloom_gain", "Bloom (penguat)", 0.5, 3, 0.01),
]

LOG, BUSY = [], threading.Lock()


def log(s):
    LOG.append(s.rstrip("\n"))


def presets():
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "shader", "presets", "*.json"))):
        d = dict(shader_rules.DEFAULTS)
        d.update(json.load(open(f)))
        out[os.path.basename(f)[:-5]] = d
    for f in sorted(glob.glob(os.path.join(ROOT, "shader", "presets", "*.ini"))):
        out[os.path.basename(f)[:-4]] = reshade_ini.load(f)[0]
    return out


def clean(params):
    p = dict(shader_rules.DEFAULTS)
    for k, lo, hi in [(s[0], s[2], s[3]) for s in SLIDERS]:
        if k in params:
            p[k] = max(lo, min(hi, float(params[k])))
    return p


def run(cmd):
    log("$ " + " ".join(cmd))
    pr = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    for line in pr.stdout:
        log(line)
    return pr.wait()


def job_patch(params):
    try:
        apks = sorted(glob.glob(os.path.join(APK_DIR, "*.apk")))
        if not apks:
            log("TIDAK ADA APK di %s. Tarik APK Roblox lewat adb dulu (lihat README)." % APK_DIR)
            return
        os.makedirs(WORK, exist_ok=True)
        pj = os.path.join(WORK, "ui_params.json")
        json.dump(params, open(pj, "w"))
        out = os.path.join(WORK, "out")
        subprocess.call(["rm", "-rf", out])
        if run([sys.executable, "-I", os.path.join(ROOT, "patcher", "apk_patcher.py"), "--apk", *apks, "--out-dir", out, "--preset", pj]):
            return log("GAGAL patch.")
        if run(["bash", os.path.join(ROOT, "patcher", "signer.sh"), out]):
            return log("GAGAL tanda tangan.")
        log("SELESAI PATCH. Tekan PASANG untuk memasang (Roblox asli akan dihapus).")
    except Exception as e:  # noqa
        log("ERROR: %s" % e)
    finally:
        BUSY.release()


def job_install():
    try:
        signed = sorted(glob.glob(os.path.join(WORK, "out", "signed", "*.apk")))
        if not signed:
            return log("Belum ada APK hasil patch. Tekan PATCH dulu.")
        run(["adb", "devices"])
        run(["adb", "uninstall", PKG])
        if run(["adb", "install-multiple", *signed]):
            return log("GAGAL pasang. Pastikan adb connect aktif (debugging nirkabel).")
        log("TERPASANG. Buka Roblox.")
    except Exception as e:  # noqa
        log("ERROR: %s" % e)
    finally:
        BUSY.release()


PAGE = r"""<!doctype html><html lang=id><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>RYEENZYXNZ</title><style>
:root{--bg:#0f1117;--card:#181b24;--ink:#e8eaf0;--mut:#8a90a2;--acc:#7c5cff;--ok:#2fd18b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px system-ui,sans-serif;padding:16px 16px 90px;max-width:560px;margin:auto}
h1{font-size:20px;margin:6px 0 2px}.sub{color:var(--mut);font-size:13px;margin-bottom:14px}
.card{background:var(--card);border-radius:14px;padding:14px;margin-bottom:12px}
.pre{display:flex;flex-wrap:wrap;gap:8px}.pre button{background:#232738;color:var(--ink);border:0;border-radius:20px;padding:8px 14px;font-size:14px}
.pre button.on{background:var(--acc)}.row{margin:10px 0}.row label{display:flex;justify-content:space-between;font-size:14px}
.row b{color:var(--acc);font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--acc)}
textarea{width:100%;height:90px;background:#0f1117;color:var(--ink);border:1px solid #2a2f42;border-radius:10px;padding:8px;font:12px monospace}
.bar{position:fixed;left:0;right:0;bottom:0;background:#0f1117ee;padding:10px 16px;display:flex;gap:10px;max-width:560px;margin:auto}
.bar button{flex:1;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:600;color:#fff;background:var(--acc)}.bar .b2{background:var(--ok);color:#06281a}
pre{background:#0b0d12;border-radius:10px;padding:10px;font-size:12px;white-space:pre-wrap;max-height:260px;overflow:auto;margin:0}
.note{color:var(--mut);font-size:12px;margin-top:8px}
</style><body>
<h1>RYEENZYXNZ</h1><div class=sub>Pengaturan shader — dipanggang ke APK saat PATCH</div>
<div class=card><div class=pre id=pre></div></div>
<div class=card id=sl></div>
<div class=card><b>Impor preset ReShade</b><div class=note>Tempel isi .ini/.txt</div>
<textarea id=ini placeholder="Techniques=...&#10;[BloomingHDR.fx]..."></textarea>
<div class=pre style="margin-top:8px"><button onclick=imp()>Terapkan INI</button></div><div class=note id=impmsg></div></div>
<div class=card><b>Log</b><pre id=log>siap.</pre><div class=note>Ganti nilai = PATCH ulang dari APK asli di ~/apks.</div></div>
<div class=bar><button onclick=go('patch')>PATCH</button><button class=b2 onclick=go('install')>PASANG</button></div>
<script>
let S=[],P={},cur={};const $=id=>document.getElementById(id);
function draw(){$('sl').innerHTML=S.map(s=>`<div class=row><label>${s[1]}<b id=v_${s[0]}>${(+cur[s[0]]).toFixed(2)}</b></label><input type=range min=${s[2]} max=${s[3]} step=${s[4]} value=${cur[s[0]]} oninput="cur['${s[0]}']=+this.value;$('v_${s[0]}').textContent=(+this.value).toFixed(2)"></div>`).join('')}
function pre(n){cur={...P[n]};document.querySelectorAll('.pre button[data-n]').forEach(b=>b.classList.toggle('on',b.dataset.n==n));draw()}
async function init(){const r=await (await fetch('/api/init')).json();S=r.sliders;P=r.presets;$('pre').innerHTML=Object.keys(P).map(n=>`<button data-n="${n}" onclick="pre('${n}')">${n.replace(/_/g,' ')}</button>`).join('');pre(P.basah_prismshade?'basah_prismshade':Object.keys(P)[0])}
async function imp(){const r=await (await fetch('/api/ini',{method:'POST',body:$('ini').value})).json();cur={...cur,...r.params};draw();$('impmsg').textContent='Diterapkan: '+r.applied.join('; ')+(r.ignored.length?' | Diabaikan: '+r.ignored.join(', '):'')}
async function go(a){const r=await fetch('/api/'+a,{method:'POST',body:JSON.stringify(cur)});if(r.status!=200)$('log').textContent=await r.text()}
setInterval(async()=>{try{const t=await (await fetch('/api/log')).text();if(t){$('log').textContent=t;$('log').scrollTop=1e9}}catch(e){}},1000);init()
</script></body></html>"""


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype="application/json"):
        b = body.encode() if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def _guard(self):  # tolak permintaan lintas-situs (DNS rebinding / CSRF)
        host = (self.headers.get("Host") or "").split(":")[0]
        return host in ("127.0.0.1", "localhost")

    def do_GET(self):
        if not self._guard():
            return self._send(403, "host")
        if self.path == "/":
            return self._send(200, PAGE, "text/html")
        if self.path == "/api/init":
            return self._send(200, json.dumps({"sliders": SLIDERS, "presets": presets()}))
        if self.path == "/api/log":
            return self._send(200, "\n".join(LOG[-300:]), "text/plain")
        self._send(404, "")

    def do_POST(self):
        if not self._guard() or self.headers.get("Origin", "http://127.0.0.1").split("//")[-1].split(":")[0] not in ("127.0.0.1", "localhost"):
            return self._send(403, "asal ditolak")
        body = self.rfile.read(int(self.headers.get("Content-Length") or 0)).decode("utf-8", "replace")
        if self.path == "/api/ini":
            c, a, i = reshade_ini.from_text(body)
            return self._send(200, json.dumps({"params": clean(c), "applied": a, "ignored": i}))
        if self.path in ("/api/patch", "/api/install"):
            if not BUSY.acquire(blocking=False):
                return self._send(409, "masih berjalan, tunggu selesai")
            del LOG[:]
            if self.path == "/api/patch":
                threading.Thread(target=job_patch, args=(clean(json.loads(body or "{}")),), daemon=True).start()
            else:
                threading.Thread(target=job_install, daemon=True).start()
            return self._send(200, "{}")
        self._send(404, "")


if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    url = "http://127.0.0.1:%d" % PORT
    print("RYEENZYXNZ UI: " + url + "  (Ctrl+C untuk berhenti)")
    try:
        subprocess.Popen(["termux-open-url", url], stderr=subprocess.DEVNULL)
    except OSError:
        pass
    srv.serve_forever()
