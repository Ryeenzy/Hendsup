#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPostProcessVS
#define dFdx(x) (x)
#define dFdy(x) (x)
#define fwidth(x) (x)
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
vec2 compCond(bvec2 cond, vec2 a, vec2 b) { return vec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
vec3 compCond(bvec3 cond, vec3 a, vec3 b) { return vec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
vec4 compCond(bvec4 cond, vec4 a, vec4 b) { return vec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
bvec2 compCond(bvec2 cond, bvec2 a, bvec2 b) { return bvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
bvec3 compCond(bvec3 cond, bvec3 a, bvec3 b) { return bvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
bvec4 compCond(bvec4 cond, bvec4 a, bvec4 b) { return bvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
ivec2 compCond(bvec2 cond, ivec2 a, ivec2 b) { return ivec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
ivec3 compCond(bvec3 cond, ivec3 a, ivec3 b) { return ivec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
ivec4 compCond(bvec4 cond, ivec4 a, ivec4 b) { return ivec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uvec2 compCond(bvec2 cond, uvec2 a, uvec2 b) { return uvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
uvec3 compCond(bvec3 cond, uvec3 a, uvec3 b) { return uvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
uvec4 compCond(bvec4 cond, uvec4 a, uvec4 b) { return uvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uniform vec2 V_xpp;
uniform bool V_xpd80_levels_xenable_dither;
uniform float V_xpd80_levels_xdither_strength;
uniform vec3 V_xpd80_levels_xib;
uniform vec3 V_xpd80_levels_xiw;
uniform vec3 V_xpd80_levels_xob;
uniform vec3 V_xpd80_levels_xow;
uniform float V_xpd80_levels_xig;
uniform vec2 V_xpd80_levels_xpingpong;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _10 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _10;
	float _13 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _13;
	float _16 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _16;
	float _19 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _19;
	vec4 _24 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _25 = textureLod(V_xReShade_xDepthBuffer, _24.xy, _24.w);
	float _28 = _25.x * 1.00000000e+00;
	float depth = _28;
	float _31 = 1.00000000e+00 - depth;
	depth = _31;
	float _33 = depth * 9.99000000e+02;
	float _35 = 1.00000000e+03 - _33;
	float _36 = depth / _35;
	depth = _36;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _43 = id == 2u;
	float _46 = _43 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _46;
	bool _48 = id == 1u;
	float _51 = _48 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _51;
	vec2 _53 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _55 = _53 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _60 = vec4(_55.x, _55.y, 0.00000000e+00, 1.00000000e+00);
	position = _60;
	return;
}
vec4 F_xdither(
	in sampler2D tex,
	in vec2 coords,
	in int var,
	in bool enabler,
	in float str,
	in bool motion,
	in float swing)
{
	vec2 _79 = coords.xy * vec2(3.75000000e+00, 2.10937500e+00);
	coords.xy = _79;
	vec4 _81 = texture(tex, coords.xy);
	vec4 noise = _81;
	float _85 = V_xpp.x + float(var);
	float _87 = motion ? _85 : 0.00000000e+00;
	float mot = _87;
	float _90 = 6.18034005e-01 * mot;
	vec4 _92 = noise + vec4(_90);
	vec4 _93 = fract(_92);
	noise = _93;
	vec4 _95 = noise * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _97 = _95 - vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec4 _99 = _97 * vec4(swing);
	noise = _99;
	float _101 = str / 2.55000000e+02;
	vec4 _103 = noise * vec4(_101);
	vec4 _106 = compCond(bvec4(enabler), _103, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _106;
}
vec3 F_xpd80_levels_xlevels(
	in vec3 color,
	in vec3 blackin,
	in vec3 whitein,
	in float gamma,
	in vec3 outblack,
	in vec3 outwhite)
{
	vec3 _125 = color.xyz - blackin.xyz;
	vec3 _126 = clamp(_125, 0.0, 1.0);
	vec3 _129 = whitein.xyz - blackin.xyz;
	vec3 _131 = max(_129, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	vec3 _132 = _126 / _131;
	vec3 ret = _132;
	vec3 _136 = pow(ret.xyz, vec3(gamma));
	ret.xyz = _136;
	vec3 _139 = outwhite.xyz - outblack.xyz;
	vec3 _140 = clamp(_139, 0.0, 1.0);
	vec3 _142 = ret.xyz * _140;
	vec3 _144 = _142 + outblack.xyz;
	ret.xyz = _144;
	return ret;
}
vec4 F_xpd80_levels_xPS_Levels(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _149 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_150 = _149;
	vec2 _151;
	int _152;
	bool _153;
	float _154;
	bool _155;
	float _156;
	_151 = texcoord.xy;
	_152 = 2;
	_153 = V_xpd80_levels_xenable_dither;
	_154 = V_xpd80_levels_xdither_strength;
	_155 = true;
	_156 = 5.00000000e-01;
	vec4 _161 = F_xdither(V_xsamplerRGBNoise, _151, _152, _153, _154, _155, _156);
	vec4 dnoise = _161;
	vec3 _165 = color_150.xyz + vec3(dnoise.w);
	vec3 _166 = clamp(_165, 0.0, 1.0);
	color_150.xyz = _166;
	vec3 dcolor = color_150.xyz;
	vec3 _171 = V_xpd80_levels_xib.xyz + dnoise.xyz;
	vec3 _172 = clamp(_171, 0.0, 1.0);
	vec3 _175 = V_xpd80_levels_xiw.xyz + dnoise.yzx;
	vec3 _176 = clamp(_175, 0.0, 1.0);
	vec3 _179 = V_xpd80_levels_xob.xyz + dnoise.zxy;
	vec3 _180 = clamp(_179, 0.0, 1.0);
	vec3 _183 = V_xpd80_levels_xow.xyz + dnoise.wxz;
	vec3 _184 = clamp(_183, 0.0, 1.0);
	vec3 _185;
	vec3 _186;
	vec3 _187;
	float _188;
	vec3 _189;
	vec3 _190;
	_185 = color_150.xyz;
	_186 = _172;
	_187 = _176;
	_188 = V_xpd80_levels_xig;
	_189 = _180;
	_190 = _184;
	vec3 _192 = F_xpd80_levels_xlevels(_185, _186, _187, _188, _189, _190);
	color_150.xyz = _192;
	vec4 _197 = vec4(color_150.xyz.x, color_150.xyz.y, color_150.xyz.z, 1.00000000e+00);
	return _197;
}
#ifdef E_xPostProcessVS
out vec2 vv_0;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 texcoord;
	F_xPostProcessVS(id, position, texcoord);
	gl_Position = position;
	vv_0 = texcoord;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xpd80_levels_xPS_Levels
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_levels_xPS_Levels(pos, texcoord);
	return;
}
#endif
