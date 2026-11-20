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
uniform float V_xfLUT_AmountChroma;
uniform float V_xfLUT_AmountLuma;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xSamplerLUT;
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
void F_xPS_LUT_Apply(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 res)
{
	vec4 _71 = texture(V_xReShade_xBackBuffer, texcoord.xy);
	vec4 color = _71;
	vec2 texelsize = vec2(3.12500000e-02, 3.12500000e-02);
	float _77 = texelsize.x / 3.20000000e+01;
	texelsize[0] = _77;
	vec2 _80 = color.xy * vec2(3.20000000e+01, 3.20000000e+01);
	vec2 _82 = _80 - color.xy;
	vec2 _84 = _82 + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _86 = _84 * texelsize.xy;
	float _89 = color.z * 3.20000000e+01;
	float _91 = _89 - color.z;
	vec3 _94 = vec3(_86.x, _86.y, _91);
	vec3 lutcoord = _94;
	float _97 = fract(lutcoord.z);
	float lerpfact = _97;
	float _100 = lutcoord.z - lerpfact;
	float _102 = _100 * texelsize.y;
	float _104 = lutcoord.x + _102;
	lutcoord[0] = _104;
	vec4 _106 = texture(V_xSamplerLUT, lutcoord.xy);
	float _109 = lutcoord.x + texelsize.y;
	vec2 _111 = vec2(_109, lutcoord.y);
	vec4 _112 = texture(V_xSamplerLUT, _111);
	vec3 _116 = mix(_106.xyz, _112.xyz, vec3(lerpfact));
	vec3 lutcolor = _116;
	vec3 _119 = normalize(color.xyz);
	vec3 _121 = normalize(lutcolor.xyz);
	vec3 _123 = mix(_119, _121, vec3(V_xfLUT_AmountChroma));
	float _125 = length(color.xyz);
	float _127 = length(lutcolor.xyz);
	float _128 = mix(_125, _127, V_xfLUT_AmountLuma);
	vec3 _130 = _123 * vec3(_128);
	color.xyz = _130;
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
#ifdef E_xPS_LUT_Apply
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 res;
	F_xPS_LUT_Apply(vpos, texcoord, res);
	vv_0 = res;
	return;
}
#endif
