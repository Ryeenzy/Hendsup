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
uniform vec3 V_xRGB_Lift;
uniform vec3 V_xRGB_Gamma;
uniform vec3 V_xRGB_Gain;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _13 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _13;
	float _16 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _16;
	float _19 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _19;
	float _22 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _22;
	vec4 _27 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _28 = textureLod(V_xReShade_xDepthBuffer, _27.xy, _27.w);
	float _31 = _28.x * 1.00000000e+00;
	float depth = _31;
	float _34 = 1.00000000e+00 - depth;
	depth = _34;
	float _36 = depth * 9.99000000e+02;
	float _38 = 1.00000000e+03 - _36;
	float _39 = depth / _38;
	depth = _39;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _46 = id == 2u;
	float _49 = _46 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _49;
	bool _51 = id == 1u;
	float _54 = _51 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _54;
	vec2 _56 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _58 = _56 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _63 = vec4(_58.x, _58.y, 0.00000000e+00, 1.00000000e+00);
	position = _63;
	return;
}
vec3 F_xLiftGammaGainPass(
	in vec4 position,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _68.xyz;
	vec3 _72 = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01) * V_xRGB_Lift;
	vec3 _74 = vec3(1.50000000e+00, 1.50000000e+00, 1.50000000e+00) - _72;
	vec3 _75 = color * _74;
	vec3 _77 = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01) * V_xRGB_Lift;
	vec3 _78 = _75 + _77;
	vec3 _80 = _78 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	color = _80;
	vec3 _81 = clamp(color, 0.0, 1.0);
	color = _81;
	vec3 _82 = color * V_xRGB_Gain;
	color = _82;
	vec3 _83 = abs(color);
	vec3 _85 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) / V_xRGB_Gamma;
	vec3 _86 = pow(_83, _85);
	color = _86;
	vec3 _87 = clamp(color, 0.0, 1.0);
	return _87;
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
#ifdef E_xLiftGammaGainPass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xLiftGammaGainPass(position, texcoord);
	return;
}
#endif
