#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xprod80_02_Bonus_LUT_packName_xPS_MultiLUT_v2
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
vec2 compCond(bvec2 cond, vec2 a, vec2 b) { return vec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
vec3 compCond(bvec3 cond, vec3 a, vec3 b) { return vec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
vec4 compCond(bvec4 cond, vec4 a, vec4 b) { return vec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
bvec2 compCond(bvec2 cond, bvec2 a, bvec2 b) { return bvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
bvec3 compCond(bvec3 cond, bvec3 a, bvec3 b) { return bvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
bvec4 compCond(bvec4 cond, bvec4 a, bvec4 b) { return bvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
ivec2 compCond(bvec2 cond, ivec2 a, ivec2 b) { return ivec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
ivec3 compCond(bvec3 cond, ivec3 a, ivec3 b) { return ivec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
ivec4 compCond(bvec4 cond, ivec4 a, ivec4 b) { return ivec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uvec2 compCond(bvec2 cond, uvec2 a, uvec2 b) { return uvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
uvec3 compCond(bvec3 cond, uvec3 a, uvec3 b) { return uvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
uvec4 compCond(bvec4 cond, uvec4 a, uvec4 b) { return uvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uniform vec2 V_xpp;
uniform bool V_xprod80_02_Bonus_LUT_packName_xenable_dither;
uniform float V_xprod80_02_Bonus_LUT_packName_xdither_strength;
uniform int V_xprod80_02_Bonus_LUT_packName_xPD80_LutSelector;
uniform float V_xprod80_02_Bonus_LUT_packName_xPD80_MixChroma;
uniform float V_xprod80_02_Bonus_LUT_packName_xPD80_MixLuma;
uniform float V_xprod80_02_Bonus_LUT_packName_xPD80_Intensity;
uniform vec3 V_xprod80_02_Bonus_LUT_packName_xib;
uniform vec3 V_xprod80_02_Bonus_LUT_packName_xiw;
uniform vec3 V_xprod80_02_Bonus_LUT_packName_xob;
uniform vec3 V_xprod80_02_Bonus_LUT_packName_xow;
uniform float V_xprod80_02_Bonus_LUT_packName_xig;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xprod80_02_Bonus_LUT_packName_xprod80_02_Bonus_LUT_packSamp;
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
vec4 F_xdither(
	in sampler2D tex,
	in vec2 coords,
	in int var,
	in bool enabler,
	in float str,
	in bool motion,
	in float swing)
{
	vec2 _79 = coords.xy * vec2(3.75000000e+00, 2.10937500e+00);
	coords.xy = _79;
	vec4 _81 = texture(tex, coords.xy);
	vec4 noise = _81;
	float _85 = V_xpp.x + float(var);
	float _87 = motion ? _85 : 0.00000000e+00;
	float mot = _87;
	float _90 = 6.18034005e-01 * mot;
	vec4 _92 = noise + vec4(_90);
	vec4 _93 = fract(_92);
	noise = _93;
	vec4 _95 = noise * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _97 = _95 - vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec4 _99 = _97 * vec4(swing);
	noise = _99;
	float _101 = str / 2.55000000e+02;
	vec4 _103 = noise * vec4(_101);
	vec4 _106 = compCond(bvec4(enabler), _103, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _106;
}
vec3 F_xHUEToRGB(
	in float H)
{
	float _111 = H * 6.00000000e+00;
	float _113 = _111 - 3.00000000e+00;
	float _114 = abs(_113);
	float _116 = _114 - 1.00000000e+00;
	float _118 = H * 6.00000000e+00;
	float _120 = _118 - 2.00000000e+00;
	float _121 = abs(_120);
	float _123 = 2.00000000e+00 - _121;
	float _125 = H * 6.00000000e+00;
	float _127 = _125 - 4.00000000e+00;
	float _128 = abs(_127);
	float _130 = 2.00000000e+00 - _128;
	vec3 _131 = vec3(_116, _123, _130);
	vec3 _132 = clamp(_131, 0.0, 1.0);
	return _132;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _138 = RGB.y < RGB.z;
	vec4 _143 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _148 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _150 = compCond(bvec4(_138), _143, _148);
	vec4 P = _150;
	bool _154 = RGB.x < P.x;
	vec4 _159 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _164 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _166 = compCond(bvec4(_154), _159, _164);
	vec4 Q1 = _166;
	float _170 = min(Q1.w, Q1.y);
	float _172 = Q1.x - _170;
	float C = _172;
	float _176 = Q1.w - Q1.y;
	float _178 = 6.00000000e+00 * C;
	float _180 = _178 + 9.99999997e-07;
	float _181 = _176 / _180;
	float _183 = _181 + Q1.z;
	float _184 = abs(_183);
	float H_185 = _184;
	vec3 _187 = vec3(H_185, C, Q1.x);
	return _187;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _193 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _193;
	vec3 _194;
	_194 = RGB;
	vec3 _195 = F_xRGBToHCV(_194);
	vec3 HCV = _195;
	float _199 = HCV.y * 5.00000000e-01;
	float _201 = HCV.z - _199;
	float L = _201;
	float _204 = L * 2.00000000e+00;
	float _206 = _204 - 1.00000000e+00;
	float _207 = abs(_206);
	float _209 = 1.00000000e+00 - _207;
	float _211 = _209 + 9.99999997e-07;
	float _213 = HCV.y / _211;
	float S = _213;
	vec3 _216 = vec3(HCV.x, S, L);
	return _216;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _220;
	_220 = HSL.x;
	vec3 _222 = F_xHUEToRGB(_220);
	vec3 RGB_223 = _222;
	float _226 = 2.00000000e+00 * HSL.z;
	float _228 = _226 - 1.00000000e+00;
	float _229 = abs(_228);
	float _231 = 1.00000000e+00 - _229;
	float _233 = _231 * HSL.y;
	float C_234 = _233;
	vec3 _236 = RGB_223 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _238 = _236 * vec3(C_234);
	vec3 _240 = _238 + vec3(HSL.z);
	return _240;
}
vec3 F_xRGBToHSV(
	in vec3 c)
{
	vec4 K = vec4(0.00000000e+00, -3.33333343e-01, 6.66666687e-01, -1.00000000e+00);
	bool _248 = c.y < c.z;
	vec4 _253 = vec4(c.zy.x, c.zy.y, K.wz.x, K.wz.y);
	vec4 _258 = vec4(c.yz.x, c.yz.y, K.xy.x, K.xy.y);
	vec4 _260 = compCond(bvec4(_248), _253, _258);
	vec4 p = _260;
	bool _264 = c.x < p.x;
	vec4 _269 = vec4(p.xyw.x, p.xyw.y, p.xyw.z, c.x);
	vec4 _274 = vec4(c.x, p.yzx.x, p.yzx.y, p.yzx.z);
	vec4 _276 = compCond(bvec4(_264), _269, _274);
	vec4 q = _276;
	float _280 = min(q.w, q.y);
	float _282 = q.x - _280;
	float d = _282;
	float e = 1.00000001e-10;
	float _288 = q.w - q.y;
	float _290 = 6.00000000e+00 * d;
	float _291 = _290 + e;
	float _292 = _288 / _291;
	float _294 = q.z + _292;
	float _295 = abs(_294);
	float _297 = q.x + e;
	float _298 = d / _297;
	vec3 _300 = vec3(_295, _298, q.x);
	return _300;
}
vec3 F_xHSVToRGB(
	in vec3 c)
{
	vec4 K_305 = vec4(1.00000000e+00, 6.66666687e-01, 3.33333343e-01, 3.00000000e+00);
	vec3 _308 = c.xxx + K_305.xyz;
	vec3 _309 = fract(_308);
	vec3 _311 = _309 * vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec3 _313 = _311 - K_305.www;
	vec3 _314 = abs(_313);
	vec3 p_315 = _314;
	vec3 _317 = p_315 - K_305.xxx;
	vec3 _318 = clamp(_317, 0.0, 1.0);
	vec3 _321 = mix(K_305.xxx, _318, vec3(c.y));
	vec3 _323 = vec3(c.z) * _321;
	return _323;
}
vec3 F_xKelvinToRGB(
	in float k)
{
	vec3 ret = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _331 = clamp(k, 1.00000000e+03, 4.00000000e+04);
	float _333 = _331 / 1.00000000e+02;
	float kelvin = _333;
	bool _339 = kelvin <= 6.60000000e+01;
	if (_339)
	{
		ret[0] = 1.00000000e+00;
		float _341 = log(kelvin);
		float _343 = 3.90081584e-01 * _341;
		float _345 = _343 - 6.31841421e-01;
		float _346 = clamp(_345, 0.0, 1.0);
		ret[1] = _346;
	}
	else
	{
		float _348 = kelvin - 6.00000000e+01;
		float _350 = max(_348, 0.00000000e+00);
		float t = _350;
		float _353 = pow(t, -1.33204758e-01);
		float _355 = 1.29293621e+00 * _353;
		float _356 = clamp(_355, 0.0, 1.0);
		ret[0] = _356;
		float _358 = pow(t, -7.55148456e-02);
		float _360 = 1.12989092e+00 * _358;
		float _361 = clamp(_360, 0.0, 1.0);
		ret[1] = _361;
	}
	bool _366 = kelvin >= 6.60000000e+01;
	if (_366)
	{
		ret[2] = 1.00000000e+00;
	}
	else
	{
		bool _372 = kelvin < 1.90000000e+01;
		if (_372)
		{
			ret[2] = 0.00000000e+00;
		}
		else
		{
			float _375 = kelvin - 1.00000000e+01;
			float _376 = log(_375);
			float _378 = 5.43206811e-01 * _376;
			float _380 = _378 - 1.19625413e+00;
			float _381 = clamp(_380, 0.0, 1.0);
			ret[2] = _381;
		}
	}
	return ret;
}
vec3 F_xLinearTosRGB(
	in vec3 color)
{
	vec3 _386 = color * vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x = _386;
	vec3 _388 = clamp(color, 0.0, 1.0);
	vec3 _390 = pow(_388, vec3(4.16666657e-01, 4.16666657e-01, 4.16666657e-01));
	vec3 _392 = vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00) * _390;
	vec3 _394 = _392 - vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 y = _394;
	vec3 clr = color;
	bool _399 = color.x < 3.13080009e-03;
	float _402 = _399 ? x.x : y.x;
	clr[0] = _402;
	bool _405 = color.y < 3.13080009e-03;
	float _408 = _405 ? x.y : y.y;
	clr[1] = _408;
	bool _411 = color.z < 3.13080009e-03;
	float _414 = _411 ? x.z : y.z;
	clr[2] = _414;
	return clr;
}
vec3 F_xSRGBToLinear(
	in vec3 color)
{
	vec3 _419 = color / vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x_420 = _419;
	vec3 _422 = color + vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 _424 = _422 / vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00);
	vec3 _426 = max(_424, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _428 = pow(_426, vec3(2.40000010e+00, 2.40000010e+00, 2.40000010e+00));
	vec3 y_429 = _428;
	vec3 clr_430 = color;
	bool _433 = color.x <= 4.04499993e-02;
	float _436 = _433 ? x_420.x : y_429.x;
	clr_430[0] = _436;
	bool _439 = color.y <= 4.04499993e-02;
	float _442 = _439 ? x_420.y : y_429.y;
	clr_430[1] = _442;
	bool _445 = color.z <= 4.04499993e-02;
	float _448 = _445 ? x_420.z : y_429.z;
	clr_430[2] = _448;
	return clr_430;
}
vec3 F_xpd80_xyz_to_lab(
	in vec3 c)
{
	vec3 _453 = c / vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	vec3 _455 = max(_453, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 w = _455;
	vec3 v = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _461 = w.x > 8.85645207e-03;
	float _464 = pow(w.x, 3.33333343e-01);
	float _467 = 9.03296326e+02 * w.x;
	float _469 = _467 + 1.60000000e+01;
	float _471 = _469 / 1.16000000e+02;
	float _472 = _461 ? _464 : _471;
	v[0] = _472;
	bool _475 = w.y > 8.85645207e-03;
	float _478 = pow(w.y, 3.33333343e-01);
	float _481 = 9.03296326e+02 * w.y;
	float _483 = _481 + 1.60000000e+01;
	float _485 = _483 / 1.16000000e+02;
	float _486 = _475 ? _478 : _485;
	v[1] = _486;
	bool _489 = w.z > 8.85645207e-03;
	float _492 = pow(w.z, 3.33333343e-01);
	float _495 = 9.03296326e+02 * w.z;
	float _497 = _495 + 1.60000000e+01;
	float _499 = _497 / 1.16000000e+02;
	float _500 = _489 ? _492 : _499;
	v[2] = _500;
	float _503 = 1.16000000e+02 * v.y;
	float _505 = _503 - 1.60000000e+01;
	float _508 = v.x - v.y;
	float _510 = 5.00000000e+02 * _508;
	float _513 = v.y - v.z;
	float _515 = 2.00000000e+02 * _513;
	vec3 _516 = vec3(_505, _510, _515);
	return _516;
}
vec3 F_xpd80_lab_to_xyz(
	in vec3 c)
{
	vec3 v_521 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _524 = c.x + 1.60000000e+01;
	float _526 = _524 / 1.16000000e+02;
	v_521[1] = _526;
	float _529 = c.y / 5.00000000e+02;
	float _531 = _529 + v_521.y;
	v_521[0] = _531;
	float _534 = c.z / 2.00000000e+02;
	float _536 = v_521.y - _534;
	v_521[2] = _536;
	float _539 = v_521.x * v_521.x;
	float _541 = _539 * v_521.x;
	bool _543 = _541 > 8.85645207e-03;
	float _546 = v_521.x * v_521.x;
	float _548 = _546 * v_521.x;
	float _551 = 1.16000000e+02 * v_521.x;
	float _553 = _551 - 1.60000000e+01;
	float _555 = _553 / 9.03296326e+02;
	float _556 = _543 ? _548 : _555;
	bool _559 = c.x > 8.00000095e+00;
	float _562 = v_521.y * v_521.y;
	float _564 = _562 * v_521.y;
	float _567 = c.x / 9.03296326e+02;
	float _568 = _559 ? _564 : _567;
	float _571 = v_521.z * v_521.z;
	float _573 = _571 * v_521.z;
	bool _575 = _573 > 8.85645207e-03;
	float _578 = v_521.z * v_521.z;
	float _580 = _578 * v_521.z;
	float _583 = 1.16000000e+02 * v_521.z;
	float _585 = _583 - 1.60000000e+01;
	float _587 = _585 / 9.03296326e+02;
	float _588 = _575 ? _580 : _587;
	vec3 _589 = vec3(_556, _568, _588);
	vec3 _591 = _589 * vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	return _591;
}
vec3 F_xpd80_srgb_to_xyz(
	in vec3 c)
{
	vec3 _596 = (c * mat3x3(4.12456393e-01, 3.57576102e-01, 1.80437505e-01, 2.12672904e-01, 7.15152204e-01, 7.21750036e-02, 1.93339009e-02, 1.19191997e-01, 9.50304091e-01));
	return _596;
}
vec3 F_xpd80_xyz_to_srgb(
	in vec3 c)
{
	vec3 _601 = (c * mat3x3(3.24045420e+00, -1.53713846e+00, -4.98531401e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 5.56433983e-02, -2.04025894e-01, 1.05722523e+00));
	return _601;
}
vec3 F_xpd80_srgb_to_lab(
	in vec3 c)
{
	vec3 _605;
	_605 = c;
	vec3 _606 = F_xpd80_srgb_to_xyz(_605);
	vec3 lab = _606;
	vec3 _608;
	_608 = lab;
	vec3 _609 = F_xpd80_xyz_to_lab(_608);
	lab = _609;
	vec3 _611 = lab / vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	return _611;
}
vec3 F_xpd80_lab_to_srgb(
	in vec3 c)
{
	vec3 _616 = c * vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	vec3 _617;
	_617 = _616;
	vec3 _618 = F_xpd80_lab_to_xyz(_617);
	vec3 rgb = _618;
	vec3 _621 = min(rgb, vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00));
	vec3 _623 = max(_621, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _624;
	_624 = _623;
	vec3 _625 = F_xpd80_xyz_to_srgb(_624);
	rgb = _625;
	vec3 _626 = clamp(rgb, 0.0, 1.0);
	return _626;
}
vec3 F_xprod80_02_Bonus_LUT_packName_xlevels(
	in vec3 color,
	in vec3 blackin,
	in vec3 whitein,
	in float gamma,
	in vec3 outblack,
	in vec3 outwhite)
{
	vec3 _650 = color.xyz - blackin.xyz;
	vec3 _651 = clamp(_650, 0.0, 1.0);
	vec3 _654 = whitein.xyz - blackin.xyz;
	vec3 _656 = max(_654, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	vec3 _657 = _651 / _656;
	vec3 ret_658 = _657;
	vec3 _661 = pow(ret_658.xyz, vec3(gamma));
	ret_658.xyz = _661;
	vec3 _664 = outwhite.xyz - outblack.xyz;
	vec3 _665 = clamp(_664, 0.0, 1.0);
	vec3 _667 = ret_658.xyz * _665;
	vec3 _669 = _667 + outblack.xyz;
	ret_658.xyz = _669;
	return ret_658;
}
void F_xprod80_02_Bonus_LUT_packName_xPS_MultiLUT_v2(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 color)
{
	vec4 _676 = texture(V_xReShade_xBackBuffer, texcoord.xy);
	color = _676;
	vec2 _677;
	int _678;
	bool _679;
	float _680;
	bool _681;
	float _682;
	_677 = texcoord.xy;
	_678 = 10;
	_679 = V_xprod80_02_Bonus_LUT_packName_xenable_dither;
	_680 = V_xprod80_02_Bonus_LUT_packName_xdither_strength;
	_681 = true;
	_682 = 5.00000000e-01;
	vec4 _687 = F_xdither(V_xsamplerRGBNoise, _677, _678, _679, _680, _681, _682);
	vec4 dnoise = _687;
	float _690 = 1.0 / 6.40000000e+01;
	vec2 texelsize = vec2(_690);
	float _695 = texelsize.x / 6.40000000e+01;
	texelsize[0] = _695;
	vec2 _698 = color.xy * vec2(6.40000000e+01, 6.40000000e+01);
	vec2 _700 = _698 - color.xy;
	vec2 _702 = _700 + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _704 = _702 * texelsize.xy;
	float _707 = color.z * 6.40000000e+01;
	float _709 = _707 - color.z;
	vec3 _712 = vec3(_704.x, _704.y, _709);
	vec3 lutcoord = _712;
	float _716 = lutcoord.y / 5.00000000e+01;
	lutcoord[1] = _716;
	float _719 = float(V_xprod80_02_Bonus_LUT_packName_xPD80_LutSelector) / 5.00000000e+01;
	float _721 = lutcoord.y + _719;
	lutcoord[1] = _721;
	float _723 = fract(lutcoord.z);
	float lerpfact = _723;
	float _726 = lutcoord.z - lerpfact;
	float _728 = _726 * texelsize.y;
	float _730 = lutcoord.x + _728;
	lutcoord[0] = _730;
	vec4 _732 = texture(V_xprod80_02_Bonus_LUT_packName_xprod80_02_Bonus_LUT_packSamp, lutcoord.xy);
	float _735 = lutcoord.x + texelsize.y;
	vec2 _737 = vec2(_735, lutcoord.y);
	vec4 _738 = texture(V_xprod80_02_Bonus_LUT_packName_xprod80_02_Bonus_LUT_packSamp, _737);
	vec3 _742 = mix(_732.xyz, _738.xyz, vec3(lerpfact));
	vec3 lutcolor = _742;
	vec3 _746 = V_xprod80_02_Bonus_LUT_packName_xib.xyz + dnoise.xyz;
	vec3 _747 = clamp(_746, 0.0, 1.0);
	vec3 _750 = V_xprod80_02_Bonus_LUT_packName_xiw.xyz + dnoise.yzx;
	vec3 _751 = clamp(_750, 0.0, 1.0);
	vec3 _754 = V_xprod80_02_Bonus_LUT_packName_xob.xyz + dnoise.zxy;
	vec3 _755 = clamp(_754, 0.0, 1.0);
	vec3 _758 = V_xprod80_02_Bonus_LUT_packName_xow.xyz + dnoise.wxz;
	vec3 _759 = clamp(_758, 0.0, 1.0);
	vec3 _760;
	vec3 _761;
	vec3 _762;
	float _763;
	vec3 _764;
	vec3 _765;
	_760 = lutcolor.xyz;
	_761 = _747;
	_762 = _751;
	_763 = V_xprod80_02_Bonus_LUT_packName_xig;
	_764 = _755;
	_765 = _759;
	vec3 _767 = F_xprod80_02_Bonus_LUT_packName_xlevels(_760, _761, _762, _763, _764, _765);
	lutcolor.xyz = _767;
	vec3 _768;
	_768 = lutcolor.xyz;
	vec3 _770 = F_xpd80_srgb_to_lab(_768);
	vec3 lablut = _770;
	vec3 _772;
	_772 = color.xyz;
	vec3 _774 = F_xpd80_srgb_to_lab(_772);
	vec3 labcol = _774;
	float _778 = mix(labcol.x, lablut.x, V_xprod80_02_Bonus_LUT_packName_xPD80_MixLuma);
	float newluma = _778;
	vec2 _783 = mix(labcol.yz, lablut.yz, vec2(V_xprod80_02_Bonus_LUT_packName_xPD80_MixChroma));
	vec2 newAB = _783;
	vec3 _787 = vec3(newluma, newAB.x, newAB.y);
	vec3 _788;
	_788 = _787;
	vec3 _789 = F_xpd80_lab_to_srgb(_788);
	lutcolor.xyz = _789;
	vec3 _792 = lutcolor.xyz + dnoise.wzx;
	vec3 _793 = clamp(_792, 0.0, 1.0);
	vec3 _796 = mix(color.xyz, _793, vec3(V_xprod80_02_Bonus_LUT_packName_xPD80_Intensity));
	color.xyz = _796;
	return;
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
#ifdef E_xprod80_02_Bonus_LUT_packName_xPS_MultiLUT_v2
in vec2 vv_0;
layout(location = 0) out vec4 _out_color;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 color;
	F_xprod80_02_Bonus_LUT_packName_xPS_MultiLUT_v2(vpos, texcoord, color);
	_out_color = color;
	return;
}
#endif
