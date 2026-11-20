#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_lumafade_xPS_StorePrev
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xpd80_lumafade_xtransition_speed;
uniform float V_xpd80_lumafade_xminlevel;
uniform float V_xpd80_lumafade_xmaxlevel;
uniform float V_xpd80_lumafade_xFrametime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xpd80_lumafade_xsamplerLuma;
uniform sampler2D V_xpd80_lumafade_xsamplerAvgLuma;
uniform sampler2D V_xpd80_lumafade_xsamplerPrevAvgLuma;
uniform sampler2D V_xpd80_lumafade_xsamplerPrevColor;
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
float F_xpd80_lumafade_xinterpolate(
	in float o,
	in float n,
	in float factor,
	in float ft)
{
	float _79 = -(factor);
	float _80 = _79 * ft;
	float _81 = exp(_80);
	float _83 = 1.00000000e+00 - _81;
	float _84 = mix(o, n, _83);
	return _84;
}
float F_xpd80_lumafade_xPS_WriteLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _89 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _89;
	float _93 = dot(color.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	return _93;
}
float F_xpd80_lumafade_xPS_AvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _99 = textureLod(V_xpd80_lumafade_xsamplerLuma, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).xy, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).w);
	float luma = _99.x;
	vec4 _103 = texture(V_xpd80_lumafade_xsamplerPrevAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float prevluma = _103.x;
	float _107 = V_xpd80_lumafade_xtransition_speed * 4.00000000e+00;
	float _109 = _107 + 1.00000000e+00;
	float factor_110 = _109;
	float _112 = V_xpd80_lumafade_xFrametime * 1.00000005e-03;
	float _113;
	float _114;
	float _115;
	float _116;
	_113 = prevluma;
	_114 = luma;
	_115 = factor_110;
	_116 = _112;
	float _117 = F_xpd80_lumafade_xinterpolate(_113, _114, _115, _116);
	return _117;
}
vec4 F_xpd80_lumafade_xPS_StorePrev(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _122 = texture(V_xReShade_xBackBuffer, texcoord);
	return _122;
}
float F_xpd80_lumafade_xPS_PrevAvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _128 = texture(V_xpd80_lumafade_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	return _128.x;
}
vec4 F_xpd80_lumafade_xPS_LumaInterpolation(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _134 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 newcol = _134;
	vec4 _136 = texture(V_xpd80_lumafade_xsamplerPrevColor, texcoord);
	vec4 oldcol = _136;
	vec4 _139 = texture(V_xpd80_lumafade_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float luma_141 = _139.x;
	float _142 = smoothstep(V_xpd80_lumafade_xminlevel, V_xpd80_lumafade_xmaxlevel, luma_141);
	vec4 _144 = mix(oldcol, newcol, vec4(_142));
	return _144;
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
#ifdef E_xpd80_lumafade_xPS_WriteLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_lumafade_xPS_WriteLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumafade_xPS_AvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_lumafade_xPS_AvgLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumafade_xPS_StorePrev
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_lumafade_xPS_StorePrev(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumafade_xPS_PrevAvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_lumafade_xPS_PrevAvgLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumafade_xPS_LumaInterpolation
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_lumafade_xPS_LumaInterpolation(pos, texcoord);
	return;
}
#endif
