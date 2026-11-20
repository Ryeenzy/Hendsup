#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_filmicadaptation_xPS_PrevAvgLuma
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xpd80_filmicadaptation_xadj_shoulder;
uniform float V_xpd80_filmicadaptation_xadj_linear;
uniform float V_xpd80_filmicadaptation_xadj_toe;
uniform float V_xpd80_filmicadaptation_xFrametime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xpd80_filmicadaptation_xsamplerLinColor;
uniform sampler2D V_xpd80_filmicadaptation_xsamplerLuma;
uniform sampler2D V_xpd80_filmicadaptation_xsamplerAvgLuma;
uniform sampler2D V_xpd80_filmicadaptation_xsamplerPrevAvgLuma;
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
float F_xpd80_filmicadaptation_xgetLuminance(
	in vec3 x)
{
	float _76 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _76;
}
vec3 F_xpd80_filmicadaptation_xFilmic(
	in vec3 Fc,
	in float FA,
	in float FB,
	in float FC,
	in float FD,
	in float FE,
	in float FF,
	in float FWhite)
{
	vec3 _88 = vec3(FA) * Fc;
	float _89 = FC * FB;
	vec3 _91 = _88 + vec3(_89);
	vec3 _92 = Fc * _91;
	float _93 = FD * FE;
	vec3 _95 = _92 + vec3(_93);
	vec3 _97 = vec3(FA) * Fc;
	vec3 _99 = _97 + vec3(FB);
	vec3 _100 = Fc * _99;
	float _101 = FD * FF;
	vec3 _103 = _100 + vec3(_101);
	vec3 _104 = _95 / _103;
	float _105 = FE / FF;
	vec3 _107 = _104 - vec3(_105);
	vec3 num = _107;
	float _109 = FA * FWhite;
	float _110 = FC * FB;
	float _111 = _109 + _110;
	float _112 = FWhite * _111;
	float _113 = FD * FE;
	float _114 = _112 + _113;
	float _115 = FA * FWhite;
	float _116 = _115 + FB;
	float _117 = FWhite * _116;
	float _118 = FD * FF;
	float _119 = _117 + _118;
	float _120 = _114 / _119;
	float _121 = FE / FF;
	float _122 = _120 - _121;
	vec3 denom = vec3(_122);
	vec3 _125 = num / denom;
	return _125;
}
float F_xpd80_filmicadaptation_xPS_WriteLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _130 = texture(V_xpd80_filmicadaptation_xsamplerLinColor, texcoord);
	vec4 color = _130;
	vec3 _132;
	_132 = color.xyz;
	float _134 = F_xpd80_filmicadaptation_xgetLuminance(_132);
	float luma = _134;
	float _137 = max(luma, 5.99999987e-02);
	luma = _137;
	float _138 = log2(luma);
	return _138;
}
float F_xpd80_filmicadaptation_xPS_AvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _144 = textureLod(V_xpd80_filmicadaptation_xsamplerLuma, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).xy, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).w);
	float luma_146 = _144.x;
	float _147 = exp2(luma_146);
	luma_146 = _147;
	vec4 _149 = texture(V_xpd80_filmicadaptation_xsamplerPrevAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float prevluma = _149.x;
	float _153 = 1.00000000e+03 / V_xpd80_filmicadaptation_xFrametime;
	float fps = _153;
	float delay = fps;
	float _157 = 1.00000000e+00 / delay;
	float _158 = mix(prevluma, luma_146, _157);
	float avgLuma = _158;
	return avgLuma;
}
vec4 F_xpd80_filmicadaptation_xPS_Tonemap(
	in vec4 pos,
	in vec2 texcoord)
{
	float _165 = 6.49999976e-01 * V_xpd80_filmicadaptation_xadj_shoulder;
	float A = _165;
	float _168 = 8.50000009e-02 * V_xpd80_filmicadaptation_xadj_linear;
	float B = _168;
	float C = 1.83000004e+00;
	float _173 = 5.50000012e-01 * V_xpd80_filmicadaptation_xadj_toe;
	float D = _173;
	float E = 5.00000007e-02;
	float F = 5.69999993e-01;
	float W = 1.00000000e+00;
	vec4 _181 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_182 = _181;
	vec4 _184 = texture(V_xpd80_filmicadaptation_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float luma_186 = _184.x;
	float _189 = mix(1.00000000e+00, 8.00000000e+00, luma_186);
	float _exp = _189;
	float _191 = D * _exp;
	float _192 = max(_191, D);
	float toe = _192;
	vec3 _194;
	float _195;
	float _196;
	float _197;
	float _198;
	float _199;
	float _200;
	float _201;
	_194 = color_182.xyz;
	_195 = A;
	_196 = B;
	_197 = C;
	_198 = toe;
	_199 = E;
	_200 = F;
	_201 = W;
	vec3 _203 = F_xpd80_filmicadaptation_xFilmic(_194, _195, _196, _197, _198, _199, _200, _201);
	color_182.xyz = _203;
	vec4 _208 = vec4(color_182.xyz.x, color_182.xyz.y, color_182.xyz.z, 1.00000000e+00);
	return _208;
}
float F_xpd80_filmicadaptation_xPS_PrevAvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _214 = texture(V_xpd80_filmicadaptation_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float avgLuma_216 = _214.x;
	return avgLuma_216;
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
#ifdef E_xpd80_filmicadaptation_xPS_WriteLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_filmicadaptation_xPS_WriteLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_filmicadaptation_xPS_AvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_filmicadaptation_xPS_AvgLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_filmicadaptation_xPS_Tonemap
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_filmicadaptation_xPS_Tonemap(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_filmicadaptation_xPS_PrevAvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_filmicadaptation_xPS_PrevAvgLuma(pos, texcoord);
	return;
}
#endif
