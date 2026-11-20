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
uniform float V_xDepthDarkness_xFocusPlane;
uniform float V_xDepthDarkness_xFocusRange;
uniform float V_xDepthDarkness_xFocusPlaneMaxRange;
uniform vec3 V_xDepthDarkness_xDarknessColor;
uniform float V_xDepthDarkness_xBlendFactor;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
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
void F_xDepthDarkness_xPS_ApplyDarkness(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec2 _71;
	_71 = texcoord;
	float _72 = F_xReShade_xGetLinearizedDepth(_71);
	float colorDepth = _72;
	float _74 = V_xDepthDarkness_xFocusPlane * V_xDepthDarkness_xFocusPlaneMaxRange;
	float _76 = _74 / 1.00000000e+03;
	float focusRangeStart = _76;
	float _78 = V_xDepthDarkness_xFocusRange * V_xDepthDarkness_xFocusPlaneMaxRange;
	float _80 = _78 / 1.00000000e+04;
	float focusRangeToUse = _80;
	float _82 = focusRangeStart + focusRangeToUse;
	float focusRangeEnd = _82;
	vec4 _88 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _89 = textureLod(V_xReShade_xBackBuffer, _88.xy, _88.w);
	vec4 color = _89;
	bool _91 = colorDepth < focusRangeStart;
	float _92 = focusRangeEnd - colorDepth;
	float _93 = _92 / focusRangeToUse;
	float _95 = 1.00000000e+00 - _93;
	float _96 = clamp(_95, 0.0, 1.0);
	vec3 _99 = mix(color.xyz, V_xDepthDarkness_xDarknessColor, vec3(_96));
	vec3 _102 = compCond(bvec3(_91), color.xyz, _99);
	vec3 fragmentPreBlend = _102;
	vec3 _107 = mix(color.xyz, fragmentPreBlend.xyz, vec3(V_xDepthDarkness_xBlendFactor));
	vec4 _112 = vec4(_107.x, _107.y, _107.z, 1.00000000e+00);
	fragment = _112;
	return;
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
#ifdef E_xDepthDarkness_xPS_ApplyDarkness
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xDepthDarkness_xPS_ApplyDarkness(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
