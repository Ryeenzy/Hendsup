#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_curvedlevels_xPS_CurvedLevels
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
uniform bool V_xpd80_curvedlevels_xenable_dither;
uniform float V_xpd80_curvedlevels_xdither_strength;
uniform float V_xpd80_curvedlevels_xblack_in_grey;
uniform float V_xpd80_curvedlevels_xwhite_in_grey;
uniform float V_xpd80_curvedlevels_xpos0_shoulder_grey;
uniform float V_xpd80_curvedlevels_xpos1_shoulder_grey;
uniform float V_xpd80_curvedlevels_xpos0_toe_grey;
uniform float V_xpd80_curvedlevels_xpos1_toe_grey;
uniform float V_xpd80_curvedlevels_xblack_out_grey;
uniform float V_xpd80_curvedlevels_xwhite_out_grey;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
struct S_xpd80_curvedlevels_xTonemapParams
{
	vec3 mToe;
	vec2 mMid;
	vec3 mShoulder;
	vec2 mBx;
};
S_xpd80_curvedlevels_xTonemapParams _358;
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
vec3 F_xpd80_curvedlevels_xTonemap(
	in S_xpd80_curvedlevels_xTonemapParams tc,
	in vec3 x)
{
	float _123 = -(tc.mToe.x);
	vec3 _125 = x + vec3(tc.mToe.y);
	vec3 _127 = vec3(_123) / _125;
	vec3 _129 = _127 + vec3(tc.mToe.z);
	vec3 toe = _129;
	vec3 _132 = vec3(tc.mMid.x) * x;
	vec3 _134 = _132 + vec3(tc.mMid.y);
	vec3 mid = _134;
	float _137 = -(tc.mShoulder.x);
	vec3 _139 = x + vec3(tc.mShoulder.y);
	vec3 _141 = vec3(_137) / _139;
	vec3 _143 = _141 + vec3(tc.mShoulder.z);
	vec3 shoulder = _143;
	bvec3 _146 = greaterThanEqual(x, vec3(tc.mBx.x));
	vec3 _147 = compCond(_146, mid, toe);
	vec3 result = _147;
	bvec3 _150 = greaterThanEqual(x, vec3(tc.mBx.y));
	vec3 _151 = compCond(_150, shoulder, result);
	result = _151;
	return result;
}
float F_xpd80_curvedlevels_xblackwhiteIN(
	in float c,
	in float b,
	in float w)
{
	float _157 = c - b;
	float _158 = clamp(_157, 0.0, 1.0);
	float _159 = w - b;
	float _161 = max(_159, 9.99999997e-07);
	float _162 = _158 / _161;
	return _162;
}
float F_xpd80_curvedlevels_xblackwhiteOUT(
	in float c,
	in float b,
	in float w)
{
	float _168 = w - b;
	float _169 = clamp(_168, 0.0, 1.0);
	float _170 = c * _169;
	float _171 = _170 + b;
	return _171;
}
vec3 F_xpd80_curvedlevels_xblackwhiteIN(
	in vec3 c,
	in float b,
	in float w)
{
	vec3 _179 = c.xyz - vec3(b);
	vec3 _180 = clamp(_179, 0.0, 1.0);
	float _181 = w - b;
	float _183 = max(_181, 9.99999997e-07);
	vec3 _185 = _180 / vec3(_183);
	return _185;
}
vec3 F_xpd80_curvedlevels_xblackwhiteOUT(
	in vec3 c,
	in float b,
	in float w)
{
	float _191 = w - b;
	float _192 = clamp(_191, 0.0, 1.0);
	vec3 _195 = c.xyz * vec3(_192);
	vec3 _197 = _195 + vec3(b);
	return _197;
}
vec4 F_xpd80_curvedlevels_xsetBoundaries(
	in float tx,
	in float ty,
	in float sx,
	in float sy)
{
	bool _207 = tx > sx;
	if (_207)
	{
		tx = sx;
	}
	bool _211 = ty > sy;
	if (_211)
	{
		ty = sy;
	}
	vec4 _212 = vec4(tx, ty, sx, sy);
	return _212;
}
void F_xpd80_curvedlevels_xPrepareTonemapParams(
	in vec2 p1,
	in vec2 p2,
	in vec2 p3,
	out S_xpd80_curvedlevels_xTonemapParams tc)
{
	float _221 = p2.x - p1.x;
	float denom = _221;
	float _223 = abs(denom);
	bool _225 = _223 > 9.99999975e-06;
	float _227 = _225 ? denom : 9.99999975e-06;
	denom = _227;
	float _230 = p2.y - p1.y;
	float _231 = _230 / denom;
	float slope = _231;
	tc.mMid[0] = slope;
	float _234 = slope * p1.x;
	float _236 = p1.y - _234;
	tc.mMid[1] = _236;
	float _238 = slope * p1.x;
	float _240 = p1.y - _238;
	float denom_241 = _240;
	float _242 = abs(denom_241);
	bool _244 = _242 > 9.99999975e-06;
	float _246 = _244 ? denom_241 : 9.99999975e-06;
	denom_241 = _246;
	float _248 = slope * p1.x;
	float _250 = _248 * p1.x;
	float _252 = _250 * p1.y;
	float _254 = _252 * p1.y;
	float _255 = denom_241 * denom_241;
	float _256 = _254 / _255;
	tc.mToe[0] = _256;
	float _258 = slope * p1.x;
	float _260 = _258 * p1.x;
	float _261 = _260 / denom_241;
	tc.mToe[1] = _261;
	float _264 = p1.y * p1.y;
	float _265 = _264 / denom_241;
	tc.mToe[2] = _265;
	float _268 = p2.x - p3.x;
	float _269 = slope * _268;
	float _271 = _269 - p2.y;
	float _273 = _271 + p3.y;
	float denom_274 = _273;
	float _275 = abs(denom_274);
	bool _277 = _275 > 9.99999975e-06;
	float _279 = _277 ? denom_274 : 9.99999975e-06;
	denom_274 = _279;
	float _282 = p2.x - p3.x;
	float _284 = pow(_282, 2.00000000e+00);
	float _285 = slope * _284;
	float _288 = p2.y - p3.y;
	float _290 = pow(_288, 2.00000000e+00);
	float _291 = _285 * _290;
	float _292 = denom_274 * denom_274;
	float _293 = _291 / _292;
	tc.mShoulder[0] = _293;
	float _295 = slope * p2.x;
	float _298 = p3.x - p2.x;
	float _299 = _295 * _298;
	float _302 = p2.y - p3.y;
	float _304 = p3.x * _302;
	float _305 = _299 + _304;
	float _306 = _305 / denom_274;
	tc.mShoulder[1] = _306;
	float _308 = -(p2.y);
	float _310 = _308 * p2.y;
	float _313 = p2.x - p3.x;
	float _314 = slope * _313;
	float _316 = _314 + p2.y;
	float _318 = p3.y * _316;
	float _319 = _310 + _318;
	float _320 = _319 / denom_274;
	tc.mShoulder[2] = _320;
	vec2 _323 = vec2(p1.x, p2.x);
	tc.mBx = _323;
	return;
}
vec4 F_xpd80_curvedlevels_xPS_CurvedLevels(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _328 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _328;
	float _332 = texcoord.x - 7.50000000e-01;
	float _334 = _332 * 4.00000000e+00;
	float _337 = 1.00000000e+00 - texcoord.y;
	float _339 = _337 * 4.00000000e+00;
	vec2 _340 = vec2(_334, _339);
	vec2 coords_341 = _340;
	vec2 _342;
	int _343;
	bool _344;
	float _345;
	bool _346;
	float _347;
	_342 = texcoord.xy;
	_343 = 1;
	_344 = V_xpd80_curvedlevels_xenable_dither;
	_345 = V_xpd80_curvedlevels_xdither_strength;
	_346 = true;
	_347 = 5.00000000e-01;
	vec4 _352 = F_xdither(V_xsamplerRGBNoise, _342, _343, _344, _345, _346, _347);
	vec4 dnoise = _352;
	vec3 _356 = color.xyz + dnoise.yzx;
	vec3 _357 = clamp(_356, 0.0, 1.0);
	color.xyz = _357;
	S_xpd80_curvedlevels_xTonemapParams tc_359 = _358;
	float _361 = V_xpd80_curvedlevels_xblack_in_grey / 2.55000000e+02;
	float _363 = _361 + dnoise.w;
	float _364 = clamp(_363, 0.0, 1.0);
	float bigr = _364;
	float _367 = V_xpd80_curvedlevels_xwhite_in_grey / 2.55000000e+02;
	float _369 = _367 + dnoise.w;
	float _370 = clamp(_369, 0.0, 1.0);
	float wigr = _370;
	float _373 = V_xpd80_curvedlevels_xblack_out_grey / 2.55000000e+02;
	float _375 = _373 + dnoise.w;
	float _376 = clamp(_375, 0.0, 1.0);
	float bogr = _376;
	float _379 = V_xpd80_curvedlevels_xwhite_out_grey / 2.55000000e+02;
	float _381 = _379 + dnoise.w;
	float _382 = clamp(_381, 0.0, 1.0);
	float wogr = _382;
	float _384;
	float _385;
	float _386;
	float _387;
	_384 = V_xpd80_curvedlevels_xpos0_toe_grey;
	_385 = V_xpd80_curvedlevels_xpos1_toe_grey;
	_386 = V_xpd80_curvedlevels_xpos0_shoulder_grey;
	_387 = V_xpd80_curvedlevels_xpos1_shoulder_grey;
	vec4 _388 = F_xpd80_curvedlevels_xsetBoundaries(_384, _385, _386, _387);
	vec4 grey = _388;
	vec2 _390;
	vec2 _391;
	vec2 _392;
	S_xpd80_curvedlevels_xTonemapParams _393;
	_390 = grey.xy;
	_391 = grey.zw;
	_392 = vec2(1.00000000e+00, 1.00000000e+00);
	F_xpd80_curvedlevels_xPrepareTonemapParams(_390, _391, _392, _393);
	tc_359 = _393;
	vec3 _398;
	float _399;
	float _400;
	_398 = color.xyz;
	_399 = bigr;
	_400 = wigr;
	vec3 _402 = F_xpd80_curvedlevels_xblackwhiteIN(_398, _399, _400);
	color.xyz = _402;
	S_xpd80_curvedlevels_xTonemapParams _403;
	vec3 _404;
	_403 = tc_359;
	_404 = color.xyz;
	vec3 _406 = F_xpd80_curvedlevels_xTonemap(_403, _404);
	color.xyz = _406;
	vec3 _407;
	float _408;
	float _409;
	_407 = color.xyz;
	_408 = bogr;
	_409 = wogr;
	vec3 _411 = F_xpd80_curvedlevels_xblackwhiteOUT(_407, _408, _409);
	color.xyz = _411;
	vec4 _416 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _416;
}
#ifdef E_xPostProcessVS
layout(location = 0) out vec2 _out_texcoord;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 texcoord;
	F_xPostProcessVS(id, position, texcoord);
	gl_Position = position;
	_out_texcoord = texcoord;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xpd80_curvedlevels_xPS_CurvedLevels
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_curvedlevels_xPS_CurvedLevels(pos, texcoord);
	return;
}
#endif
