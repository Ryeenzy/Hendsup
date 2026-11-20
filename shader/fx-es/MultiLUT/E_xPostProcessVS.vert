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
uniform int V_xfLUT_LutSelector;
uniform float V_xfLUT_AmountChroma;
uniform float V_xfLUT_AmountLuma;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xSamplerMultiLUT;
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
void F_xPS_MultiLUT_Apply(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 res)
{
	vec4 _72 = texture(V_xReShade_xBackBuffer, texcoord.xy);
	vec4 color = _72;
	vec2 texelsize = vec2(3.12500000e-02, 3.12500000e-02);
	float _78 = texelsize.x / 3.20000000e+01;
	texelsize[0] = _78;
	vec2 _81 = color.xy * vec2(3.20000000e+01, 3.20000000e+01);
	vec2 _83 = _81 - color.xy;
	vec2 _85 = _83 + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _87 = _85 * texelsize.xy;
	float _90 = color.z * 3.20000000e+01;
	float _92 = _90 - color.z;
	vec3 _95 = vec3(_87.x, _87.y, _92);
	vec3 lutcoord = _95;
	float _99 = lutcoord.y / 1.80000000e+01;
	lutcoord[1] = _99;
	float _102 = float(V_xfLUT_LutSelector) / 1.80000000e+01;
	float _104 = lutcoord.y + _102;
	lutcoord[1] = _104;
	float _106 = fract(lutcoord.z);
	float lerpfact = _106;
	float _109 = lutcoord.z - lerpfact;
	float _111 = _109 * texelsize.y;
	float _113 = lutcoord.x + _111;
	lutcoord[0] = _113;
	vec4 _115 = texture(V_xSamplerMultiLUT, lutcoord.xy);
	float _118 = lutcoord.x + texelsize.y;
	vec2 _120 = vec2(_118, lutcoord.y);
	vec4 _121 = texture(V_xSamplerMultiLUT, _120);
	vec3 _125 = mix(_115.xyz, _121.xyz, vec3(lerpfact));
	vec3 lutcolor = _125;
	vec3 _128 = normalize(color.xyz);
	vec3 _130 = normalize(lutcolor.xyz);
	vec3 _132 = mix(_128, _130, vec3(V_xfLUT_AmountChroma));
	float _134 = length(color.xyz);
	float _136 = length(lutcolor.xyz);
	float _137 = mix(_134, _136, V_xfLUT_AmountLuma);
	vec3 _139 = _132 * vec3(_137);
	color.xyz = _139;
	res.xyz = color.xyz;
	res[3] = 1.00000000e+00;
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
#ifdef E_xPS_MultiLUT_Apply
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 res;
	F_xPS_MultiLUT_Apply(vpos, texcoord, res);
	vv_0 = res;
	return;
}
#endif
