#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xTonemapPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xGamma;
uniform float V_xExposure;
uniform float V_xSaturation;
uniform float V_xBleach;
uniform float V_xDefog;
uniform vec3 V_xFogColor;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _16 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _16;
	float _19 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _19;
	float _22 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _22;
	float _25 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _25;
	vec4 _30 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _31 = textureLod(V_xReShade_xDepthBuffer, _30.xy, _30.w);
	float _34 = _31.x * 1.00000000e+00;
	float depth = _34;
	float _37 = 1.00000000e+00 - depth;
	depth = _37;
	float _39 = depth * 9.99000000e+02;
	float _41 = 1.00000000e+03 - _39;
	float _42 = depth / _41;
	depth = _42;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _49 = id == 2u;
	float _52 = _49 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _52;
	bool _54 = id == 1u;
	float _57 = _54 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _57;
	vec2 _59 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _61 = _59 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _66 = vec4(_61.x, _61.y, 0.00000000e+00, 1.00000000e+00);
	position = _66;
	return;
}
vec3 F_xTonemapPass(
	in vec4 position,
	in vec2 texcoord)
{
	vec4 _71 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _71.xyz;
	vec3 _75 = vec3(V_xDefog) * V_xFogColor;
	vec3 _77 = _75 * vec3(2.54999995e+00, 2.54999995e+00, 2.54999995e+00);
	vec3 _78 = color - _77;
	vec3 _79 = clamp(_78, 0.0, 1.0);
	color = _79;
	float _81 = pow(2.00000000e+00, V_xExposure);
	vec3 _83 = color * vec3(_81);
	color = _83;
	vec3 _85 = pow(color, vec3(V_xGamma));
	color = _85;
	float _87 = dot(vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02), color);
	float lum = _87;
	float _90 = lum - 4.49999988e-01;
	float _92 = 1.00000000e+01 * _90;
	float _93 = clamp(_92, 0.0, 1.0);
	float L = _93;
	vec3 _96 = vec3(V_xBleach) * color;
	vec3 A2 = _96;
	vec3 _99 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * color;
	vec3 _101 = _99 * vec3(lum);
	vec3 result1 = _101;
	float _104 = 1.00000000e+00 - lum;
	float _106 = 2.00000000e+00 * _104;
	vec3 _108 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - color;
	vec3 _110 = vec3(_106) * _108;
	vec3 _112 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _110;
	vec3 result2 = _112;
	vec3 _115 = mix(result1, result2, vec3(L));
	vec3 newColor = _115;
	vec3 _117 = A2 * newColor;
	vec3 mixRGB = _117;
	vec3 _120 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - A2;
	vec3 _121 = _120 * mixRGB;
	vec3 _122 = color + _121;
	color = _122;
	float _124 = dot(color, vec3(3.33333343e-01, 3.33333343e-01, 3.33333343e-01));
	vec3 middlegray = vec3(_124);
	vec3 _127 = color - middlegray;
	vec3 diffcolor = _127;
	vec3 _130 = diffcolor * vec3(V_xSaturation);
	vec3 _131 = color + _130;
	vec3 _133 = diffcolor * vec3(V_xSaturation);
	vec3 _135 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + _133;
	vec3 _136 = _131 / _135;
	color = _136;
	return color;
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
#ifdef E_xTonemapPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xTonemapPass(position, texcoord);
	return;
}
#endif
