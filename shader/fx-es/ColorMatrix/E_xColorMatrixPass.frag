#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xColorMatrixPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform vec3 V_xColorMatrix_Red;
uniform vec3 V_xColorMatrix_Green;
uniform vec3 V_xColorMatrix_Blue;
uniform float V_xStrength;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _14 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _14;
	float _17 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _17;
	float _20 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _20;
	float _23 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _23;
	vec4 _28 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _29 = textureLod(V_xReShade_xDepthBuffer, _28.xy, _28.w);
	float _32 = _29.x * 1.00000000e+00;
	float depth = _32;
	float _35 = 1.00000000e+00 - depth;
	depth = _35;
	float _37 = depth * 9.99000000e+02;
	float _39 = 1.00000000e+03 - _37;
	float _40 = depth / _39;
	depth = _40;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _47 = id == 2u;
	float _50 = _47 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _50;
	bool _52 = id == 1u;
	float _55 = _52 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _55;
	vec2 _57 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _59 = _57 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _64 = vec4(_59.x, _59.y, 0.00000000e+00, 1.00000000e+00);
	position = _64;
	return;
}
vec3 F_xColorMatrixPass(
	in vec4 position,
	in vec2 texcoord)
{
	vec4 _69 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _69.xyz;
	mat3x3 _81 = mat3x3(V_xColorMatrix_Red.x, V_xColorMatrix_Red.y, V_xColorMatrix_Red.z, V_xColorMatrix_Green.x, V_xColorMatrix_Green.y, V_xColorMatrix_Green.z, V_xColorMatrix_Blue.x, V_xColorMatrix_Blue.y, V_xColorMatrix_Blue.z);
	mat3x3 ColorMatrix = _81;
	vec3 _83 = (color * ColorMatrix);
	vec3 _85 = mix(color, _83, vec3(V_xStrength));
	color = _85;
	vec3 _86 = clamp(color, 0.0, 1.0);
	return _86;
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
#ifdef E_xColorMatrixPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xColorMatrixPass(position, texcoord);
	return;
}
#endif
