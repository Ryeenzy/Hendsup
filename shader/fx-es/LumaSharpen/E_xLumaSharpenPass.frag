#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xLumaSharpenPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xsharp_strength;
uniform float V_xsharp_clamp;
uniform int V_xpattern;
uniform float V_xoffset_bias;
uniform bool V_xshow_sharpen;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _15 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _15;
	float _18 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _18;
	float _21 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _21;
	float _24 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _24;
	vec4 _29 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _30 = textureLod(V_xReShade_xDepthBuffer, _29.xy, _29.w);
	float _33 = _30.x * 1.00000000e+00;
	float depth = _33;
	float _36 = 1.00000000e+00 - depth;
	depth = _36;
	float _38 = depth * 9.99000000e+02;
	float _40 = 1.00000000e+03 - _38;
	float _41 = depth / _40;
	depth = _41;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _48 = id == 2u;
	float _51 = _48 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _51;
	bool _53 = id == 1u;
	float _56 = _53 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _56;
	vec2 _58 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _60 = _58 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _65 = vec4(_60.x, _60.y, 0.00000000e+00, 1.00000000e+00);
	position = _65;
	return;
}
vec3 F_xLumaSharpenPass(
	in vec4 position,
	in vec2 tex)
{
	vec4 _70 = texture(V_xReShade_xBackBuffer, tex);
	vec3 ori = _70.xyz;
	vec3 _75 = vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02) * vec3(V_xsharp_strength);
	vec3 sharp_strength_luma = _75;
	vec3 blur_ori = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _83 = V_xpattern == 0;
	if (_83)
	{
		vec2 _86 = vec2(1.73611115e-04, 3.08641960e-04) * vec2(V_xoffset_bias);
		vec2 _87 = tex + _86;
		vec4 _88 = texture(V_xReShade_xBackBuffer, _87);
		blur_ori = _88.xyz;
		vec2 _92 = vec2(-1.73611115e-04, -3.08641960e-04) * vec2(V_xoffset_bias);
		vec2 _93 = tex + _92;
		vec4 _94 = texture(V_xReShade_xBackBuffer, _93);
		vec3 _96 = blur_ori + _94.xyz;
		blur_ori = _96;
		vec3 _98 = blur_ori / vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		blur_ori = _98;
		vec3 _100 = sharp_strength_luma * vec3(1.50000000e+00, 1.50000000e+00, 1.50000000e+00);
		sharp_strength_luma = _100;
	}
	bool _105 = V_xpattern == 1;
	if (_105)
	{
		vec2 _108 = vec2(2.60416680e-04, -4.62962955e-04) * vec2(V_xoffset_bias);
		vec2 _109 = tex + _108;
		vec4 _110 = texture(V_xReShade_xBackBuffer, _109);
		blur_ori = _110.xyz;
		vec2 _114 = vec2(2.60416680e-04, 4.62962955e-04) * vec2(V_xoffset_bias);
		vec2 _115 = tex - _114;
		vec4 _116 = texture(V_xReShade_xBackBuffer, _115);
		vec3 _118 = blur_ori + _116.xyz;
		blur_ori = _118;
		vec2 _121 = vec2(2.60416680e-04, 4.62962955e-04) * vec2(V_xoffset_bias);
		vec2 _122 = tex + _121;
		vec4 _123 = texture(V_xReShade_xBackBuffer, _122);
		vec3 _125 = blur_ori + _123.xyz;
		blur_ori = _125;
		vec2 _128 = vec2(2.60416680e-04, -4.62962955e-04) * vec2(V_xoffset_bias);
		vec2 _129 = tex - _128;
		vec4 _130 = texture(V_xReShade_xBackBuffer, _129);
		vec3 _132 = blur_ori + _130.xyz;
		blur_ori = _132;
		vec3 _134 = blur_ori * vec3(2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
		blur_ori = _134;
	}
	bool _139 = V_xpattern == 2;
	if (_139)
	{
		vec2 _142 = vec2(2.08333353e-04, -1.11111114e-03) * vec2(V_xoffset_bias);
		vec2 _143 = tex + _142;
		vec4 _144 = texture(V_xReShade_xBackBuffer, _143);
		blur_ori = _144.xyz;
		vec2 _148 = vec2(6.25000044e-04, 3.70370370e-04) * vec2(V_xoffset_bias);
		vec2 _149 = tex - _148;
		vec4 _150 = texture(V_xReShade_xBackBuffer, _149);
		vec3 _152 = blur_ori + _150.xyz;
		blur_ori = _152;
		vec2 _155 = vec2(6.25000044e-04, 3.70370370e-04) * vec2(V_xoffset_bias);
		vec2 _156 = tex + _155;
		vec4 _157 = texture(V_xReShade_xBackBuffer, _156);
		vec3 _159 = blur_ori + _157.xyz;
		blur_ori = _159;
		vec2 _162 = vec2(2.08333353e-04, -1.11111114e-03) * vec2(V_xoffset_bias);
		vec2 _163 = tex - _162;
		vec4 _164 = texture(V_xReShade_xBackBuffer, _163);
		vec3 _166 = blur_ori + _164.xyz;
		blur_ori = _166;
		vec3 _168 = blur_ori * vec3(2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
		blur_ori = _168;
		vec3 _170 = sharp_strength_luma * vec3(5.09999990e-01, 5.09999990e-01, 5.09999990e-01);
		sharp_strength_luma = _170;
	}
	bool _175 = V_xpattern == 3;
	if (_175)
	{
		float _177 = -9.25925910e-04 * V_xoffset_bias;
		vec2 _179 = vec2(2.60416680e-04, _177);
		vec2 _180 = tex + _179;
		vec4 _181 = texture(V_xReShade_xBackBuffer, _180);
		blur_ori = _181.xyz;
		float _184 = V_xoffset_bias * -5.20833360e-04;
		vec2 _186 = vec2(_184, -4.62962955e-04);
		vec2 _187 = tex + _186;
		vec4 _188 = texture(V_xReShade_xBackBuffer, _187);
		vec3 _190 = blur_ori + _188.xyz;
		blur_ori = _190;
		float _192 = V_xoffset_bias * 5.20833360e-04;
		vec2 _194 = vec2(_192, 4.62962955e-04);
		vec2 _195 = tex + _194;
		vec4 _196 = texture(V_xReShade_xBackBuffer, _195);
		vec3 _198 = blur_ori + _196.xyz;
		blur_ori = _198;
		float _200 = 9.25925910e-04 * V_xoffset_bias;
		vec2 _202 = vec2(-2.60416680e-04, _200);
		vec2 _203 = tex + _202;
		vec4 _204 = texture(V_xReShade_xBackBuffer, _203);
		vec3 _206 = blur_ori + _204.xyz;
		blur_ori = _206;
		vec3 _208 = blur_ori / vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
		blur_ori = _208;
		vec3 _210 = sharp_strength_luma * vec3(6.66000009e-01, 6.66000009e-01, 6.66000009e-01);
		sharp_strength_luma = _210;
	}
	vec3 _211 = ori - blur_ori;
	vec3 sharp = _211;
	float _214 = 5.00000000e-01 / V_xsharp_clamp;
	vec3 _216 = sharp_strength_luma * vec3(_214);
	vec4 _221 = vec4(_216.x, _216.y, _216.z, 5.00000000e-01);
	vec4 sharp_strength_luma_clamp = _221;
	vec4 _227 = vec4(sharp.x, sharp.y, sharp.z, 1.00000000e+00);
	float _228 = dot(_227, sharp_strength_luma_clamp);
	float _229 = clamp(_228, 0.0, 1.0);
	float sharp_luma = _229;
	float _232 = V_xsharp_clamp * 2.00000000e+00;
	float _233 = _232 * sharp_luma;
	float _234 = _233 - V_xsharp_clamp;
	sharp_luma = _234;
	vec3 _236 = ori + vec3(sharp_luma);
	vec3 outputcolor = _236;
	if (V_xshow_sharpen)
	{
		float _242 = sharp_luma * 4.00000000e+00;
		float _244 = 5.00000000e-01 + _242;
		float _245 = clamp(_244, 0.0, 1.0);
		outputcolor = vec3(_245);
	}
	vec3 _247 = clamp(outputcolor, 0.0, 1.0);
	return _247;
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
#ifdef E_xLumaSharpenPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 tex = vv_0;
	_return = F_xLumaSharpenPass(position, tex);
	return;
}
#endif
