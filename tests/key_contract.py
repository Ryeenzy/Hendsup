#!/usr/bin/env python3
"""Kunci config Java (RzState) harus sama persis dengan parser C++ (config.hpp), selain 'disable'/'safe' (internal)."""
import os, re, sys
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "native")
j = open(os.path.join(R, "overlay/com/ryeenzyxnz/overlay/RzState.java")).read()
c = open(os.path.join(R, "module/jni/config.hpp")).read()
jk = set(re.findall(r'(?:f|b)\("([a-z_0-9]+)"', j)); ck = set(re.findall(r'k == "([a-z_0-9]+)"', c)) - {"disable", "safe"}
print("hanya Java:", sorted(jk - ck), "hanya C++:", sorted(ck - jk))
sys.exit(1 if jk != ck else 0)
