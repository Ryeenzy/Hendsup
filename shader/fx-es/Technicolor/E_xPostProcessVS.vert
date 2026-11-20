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
uniform float V_xPower;
uniform vec3 V_xRGBNegativeAmount;
uniform float V_xStrength;

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
vec3 F_xTechnicolorPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 tcol = _68.xyz;
	float _72 = V_xRGBNegativeAmount.x * V_xPower;
	float _74 = 1.00000000e+00 / _72;
	vec2 _77 = tcol.xy * vec2(_74);
	vec2 negative_mul_r = _77;
	float _80 = V_xRGBNegativeAmount.y * V_xPower;
	float _82 = 1.00000000e+00 / _80;
	vec2 _85 = tcol.xy * vec2(_82);
	vec2 negative_mul_g = _85;
	float _88 = V_xRGBNegativeAmount.z * V_xPower;
	float _90 = 1.00000000e+00 / _88;
	vec2 _93 = tcol.xz * vec2(_90);
	vec2 negative_mul_b = _93;
	float _96 = dot(vec2(1.04999995e+00, 6.20000005e-01), negative_mul_r);
	vec3 _99 = vec3(_96) + vec3(0.00000000e+00, 1.29999995e+00, 1.00000000e+00);
	vec3 output_r = _99;
	float _102 = dot(vec2(3.00000012e-01, 1.00000000e+00), negative_mul_g);
	vec3 _105 = vec3(_102) + vec3(1.00000000e+00, 0.00000000e+00, 1.04999995e+00);
	vec3 output_g = _105;
	float _108 = dot(vec2(1.00000000e+00, 1.04999995e+00), negative_mul_b);
	vec3 _111 = vec3(_108) + vec3(1.60000002e+00, 1.60000002e+00, 5.00000007e-02);
	vec3 output_b = _111;
	vec3 _113 = output_r * output_g;
	vec3 _114 = _113 * output_b;
	vec3 _116 = mix(tcol, _114, vec3(V_xStrength));
	return _116;
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
#ifdef E_xTechnicolorPass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xTechnicolorPass(vpos, texcoord);
	return;
}
#endif
