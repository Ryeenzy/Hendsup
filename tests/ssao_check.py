#!/usr/bin/env python3
"""SSAO bawaan Roblox (dump dari HP): liveRewrite harus memasukkan RZ14 (radius, detail, kekuatan) dan GLSL tetap valid."""
import os, subprocess, sys, tempfile
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
gl = sys.argv[1]
t = tempfile.mkdtemp()
exe = os.path.join(t, "lt")
subprocess.check_call(["g++", "-std=c++17", "-O1", os.path.join(ROOT, "native/module/tests/live_test.cpp"), "-o", exe])
fx = os.path.join(ROOT, "tests/fixtures/ssao_device.glsl")
r = subprocess.run([exe, t, fx], capture_output=True, text=True); print(r.stdout.strip())
out = os.path.join(t, "2.out"); s = open(out).read()
assert s.count("RZ14") >= 5, "RZ14 kurang dipakai: %d" % s.count("RZ14")
assert "RZ14.x)" in s and "RZ14.y" in s and "RZ14.z" in s
v = os.path.join(t, "v.frag"); open(v, "w").write(s)
assert subprocess.run([gl, v], capture_output=True, text=True).returncode == 0, "SSAO hasil tulis-ulang tidak valid GLSL"
print("SSAO: OK (RZ14 x%d, GLSL valid)" % s.count("RZ14"))
