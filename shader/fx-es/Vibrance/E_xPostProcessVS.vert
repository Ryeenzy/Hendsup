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
uniform float V_xVibrance;
uniform vec3 V_xVibranceRGBBalance;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _12 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _12;
	float _15 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _15;
	float _18 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _18;
	float _21 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _21;
	vec4 _26 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _27 = textureLod(V_xReShade_xDepthBuffer, _26.xy, _26.w);
	float _30 = _27.x * 1.00000000e+00;
	float depth = _30;
	float _33 = 1.00000000e+00 - depth;
	depth = _33;
	float _35 = depth * 9.99000000e+02;
	float _37 = 1.00000000e+03 - _35;
	float _38 = depth / _37;
	depth = _38;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _45 = id == 2u;
	float _48 = _45 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _48;
	bool _50 = id == 1u;
	float _53 = _50 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _53;
	vec2 _55 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _57 = _55 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _62 = vec4(_57.x, _57.y, 0.00000000e+00, 1.00000000e+00);
	position = _62;
	return;
}
vec3 F_xVibrancePass(
	in vec4 position,
	in vec2 texcoord)
{
	vec4 _67 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _67.xyz;
	vec3 coefLuma = vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02);
	float _72 = dot(coefLuma, color);
	float luma = _72;
	float _76 = max(color.y, color.z);
	float _78 = max(color.x, _76);
	float max_color = _78;
	float _82 = min(color.y, color.z);
	float _84 = min(color.x, _82);
	float min_color = _84;
	float _86 = max_color - min_color;
	float color_saturation = _86;
	vec3 _89 = V_xVibranceRGBBalance * vec3(V_xVibrance);
	vec3 coeffVibrance = _89;
	vec3 _91 = sign(coeffVibrance);
	vec3 _93 = _91 * vec3(color_saturation);
	vec3 _95 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _93;
	vec3 _96 = coeffVibrance * _95;
	vec3 _98 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + _96;
	vec3 _100 = mix(vec3(luma), color, _98);
	color = _100;
	return color;
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
#ifdef E_xVibrancePass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xVibrancePass(position, texcoord);
	return;
}
#endif
