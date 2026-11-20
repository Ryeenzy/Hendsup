#!/usr/bin/env python3
"""Bangun pack RBXS SINTETIS (bukan file Roblox) dengan tata letak sama, untuk CI tanpa aset Roblox."""
import struct, sys

PBR = b"""#version 300 es
precision highp float;
uniform vec4 CB0[61];
uniform highp samplerCube PrefilteredEnvTexture;
uniform highp samplerCube PrefilteredEnvIndoorTexture;
in vec4 VARYING3;
in vec3 VARYING4;
layout(location = 0) out vec4 _entryPointOutput;
void main()
{
    float _1 = 0.5;
    vec3 _2 = reflect(-VARYING4, vec3(0.0, 1.0, 0.0));
    float _3 = CB0[31].w * clamp(1.0 - (VARYING3.w * CB0[28].y), 0.0, 1.0);
    float _4 = _1 * 5.0;
    vec3 _5 = (vec3(0.039999999105930328369140625) * _1) + vec3(_4);
    vec3 _6 = mix(textureLod(PrefilteredEnvIndoorTexture, vec4(_2, _4).xyz, _4).xyz, textureLod(PrefilteredEnvTexture, vec4(_2, _4).xyz, _4).xyz, vec3(_3)) * _5;
    _entryPointOutput = vec4(_6, 1.0);
}
"""
COMP = b"""#version 300 es
precision highp float;
uniform vec4 CB1[18];
uniform highp sampler2D Texture0Texture;
uniform highp sampler2D Texture1Texture;
in vec2 VARYING0;
layout(location = 0) out vec4 _entryPointOutput;
void main()
{
    vec3 _250 = texture(Texture0Texture, VARYING0).xyz;
    vec3 _260 = texture(Texture1Texture, min(VARYING0, CB1[12].zw)).xyz;
    vec3 _267 = mix((_250 * _250) * 4.0, (_260 * _260) * 4.0, vec3(CB1[5].x));
    vec3 _331 = _267 * CB1[7].x;
    _entryPointOutput = vec4(dot(_331, CB1[2].xyz) + CB1[2].w, dot(_331, CB1[3].xyz) + CB1[3].w, dot(_331, CB1[4].xyz) + CB1[4].w, 1.0);
}
"""
PLAIN = b"""#version 300 es
precision highp float;
layout(location = 0) out vec4 _entryPointOutput;
void main()
{
    _entryPointOutput = vec4(1.0);
}
"""

def build(shaders=(PBR, COMP, PLAIN), shared=True):
    recs = list(shaders) + ([shaders[0]] if shared else [])  # satu rekaman berbagi data (seperti pack asli)
    names = ["PbrFS", "CompFS", "PlainFS"]
    n_recs = len(recs)
    head = bytearray(64)
    head[0:4] = b"RBXS"; struct.pack_into("<HH", head, 12, len(names), n_recs)
    body = bytearray()
    for nm in names:
        body += b"\0" * 20 + nm.encode().ljust(48, b"\0")
    body += b"\0" * 20 + b"FFlagExample".ljust(48, b"\0")
    first = len(head) + len(body) + n_recs * 64
    blobs, table = bytearray(), bytearray()
    where = {}
    for i, s in enumerate(recs):
        if s not in where:
            where[s] = first + len(blobs)
            blobs += s
        table += bytes([i]) * 16 + struct.pack("<II", where[s], len(s)) + b"\0" * 40
    return bytes(head + body + table + blobs)

if __name__ == "__main__":
    open(sys.argv[1], "wb").write(build())
