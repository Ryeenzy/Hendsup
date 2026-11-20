#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_cscurves_xPS_CSCurves
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
uniform bool V_xpd80_cscurves_xenable_dither;
uniform float V_xpd80_cscurves_xdither_strength;
uniform int V_xpd80_cscurves_xcolor_space;
uniform float V_xpd80_cscurves_xpos0_shoulder_grey;
uniform float V_xpd80_cscurves_xpos1_shoulder_grey;
uniform float V_xpd80_cscurves_xpos0_toe_grey;
uniform float V_xpd80_cscurves_xpos1_toe_grey;
uniform float V_xpd80_cscurves_xcolorsat;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
struct S_xpd80_cscurves_xTonemapParams
{
	vec3 mToe;
	vec2 mMid;
	vec3 mShoulder;
	vec2 mBx;
};
S_xpd80_cscurves_xTonemapParams _824;
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
vec3 F_xpd80_cscurves_xTonemap(
	in S_xpd80_cscurves_xTonemapParams tc,
	in vec3 x)
{
	float _641 = -(tc.mToe.x);
	vec3 _643 = x + vec3(tc.mToe.y);
	vec3 _645 = vec3(_641) / _643;
	vec3 _647 = _645 + vec3(tc.mToe.z);
	vec3 toe = _647;
	vec3 _650 = vec3(tc.mMid.x) * x;
	vec3 _652 = _650 + vec3(tc.mMid.y);
	vec3 mid = _652;
	float _655 = -(tc.mShoulder.x);
	vec3 _657 = x + vec3(tc.mShoulder.y);
	vec3 _659 = vec3(_655) / _657;
	vec3 _661 = _659 + vec3(tc.mShoulder.z);
	vec3 shoulder = _661;
	bvec3 _664 = greaterThanEqual(x, vec3(tc.mBx.x));
	vec3 _665 = compCond(_664, mid, toe);
	vec3 result = _665;
	bvec3 _668 = greaterThanEqual(x, vec3(tc.mBx.y));
	vec3 _669 = compCond(_668, shoulder, result);
	result = _669;
	return result;
}
vec4 F_xpd80_cscurves_xsetBoundaries(
	in float tx,
	in float ty,
	in float sx,
	in float sy)
{
	bool _679 = tx > sx;
	if (_679)
	{
		tx = sx;
	}
	bool _683 = ty > sy;
	if (_683)
	{
		ty = sy;
	}
	vec4 _684 = vec4(tx, ty, sx, sy);
	return _684;
}
void F_xpd80_cscurves_xPrepareTonemapParams(
	in vec2 p1,
	in vec2 p2,
	in vec2 p3,
	out S_xpd80_cscurves_xTonemapParams tc)
{
	float _693 = p2.x - p1.x;
	float denom = _693;
	float _695 = abs(denom);
	bool _697 = _695 > 9.99999975e-06;
	float _699 = _697 ? denom : 9.99999975e-06;
	denom = _699;
	float _702 = p2.y - p1.y;
	float _703 = _702 / denom;
	float slope = _703;
	tc.mMid[0] = slope;
	float _706 = slope * p1.x;
	float _708 = p1.y - _706;
	tc.mMid[1] = _708;
	float _710 = slope * p1.x;
	float _712 = p1.y - _710;
	float denom_713 = _712;
	float _714 = abs(denom_713);
	bool _716 = _714 > 9.99999975e-06;
	float _718 = _716 ? denom_713 : 9.99999975e-06;
	denom_713 = _718;
	float _720 = slope * p1.x;
	float _722 = _720 * p1.x;
	float _724 = _722 * p1.y;
	float _726 = _724 * p1.y;
	float _727 = denom_713 * denom_713;
	float _728 = _726 / _727;
	tc.mToe[0] = _728;
	float _730 = slope * p1.x;
	float _732 = _730 * p1.x;
	float _733 = _732 / denom_713;
	tc.mToe[1] = _733;
	float _736 = p1.y * p1.y;
	float _737 = _736 / denom_713;
	tc.mToe[2] = _737;
	float _740 = p2.x - p3.x;
	float _741 = slope * _740;
	float _743 = _741 - p2.y;
	float _745 = _743 + p3.y;
	float denom_746 = _745;
	float _747 = abs(denom_746);
	bool _749 = _747 > 9.99999975e-06;
	float _751 = _749 ? denom_746 : 9.99999975e-06;
	denom_746 = _751;
	float _754 = p2.x - p3.x;
	float _756 = pow(_754, 2.00000000e+00);
	float _757 = slope * _756;
	float _760 = p2.y - p3.y;
	float _762 = pow(_760, 2.00000000e+00);
	float _763 = _757 * _762;
	float _764 = denom_746 * denom_746;
	float _765 = _763 / _764;
	tc.mShoulder[0] = _765;
	float _767 = slope * p2.x;
	float _770 = p3.x - p2.x;
	float _771 = _767 * _770;
	float _774 = p2.y - p3.y;
	float _776 = p3.x * _774;
	float _777 = _771 + _776;
	float _778 = _777 / denom_746;
	tc.mShoulder[1] = _778;
	float _780 = -(p2.y);
	float _782 = _780 * p2.y;
	float _785 = p2.x - p3.x;
	float _786 = slope * _785;
	float _788 = _786 + p2.y;
	float _790 = p3.y * _788;
	float _791 = _782 + _790;
	float _792 = _791 / denom_746;
	tc.mShoulder[2] = _792;
	vec2 _795 = vec2(p1.x, p2.x);
	tc.mBx = _795;
	return;
}
vec4 F_xpd80_cscurves_xPS_CSCurves(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _800 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_801 = _800;
	vec2 _802;
	int _803;
	bool _804;
	float _805;
	bool _806;
	float _807;
	_802 = texcoord.xy;
	_803 = 1;
	_804 = V_xpd80_cscurves_xenable_dither;
	_805 = V_xpd80_cscurves_xdither_strength;
	_806 = true;
	_807 = 5.00000000e-01;
	vec4 _812 = F_xdither(V_xsamplerRGBNoise, _802, _803, _804, _805, _806, _807);
	vec4 dnoise = _812;
	vec3 _816 = color_801.xyz + dnoise.xyz;
	vec3 _817 = clamp(_816, 0.0, 1.0);
	color_801.xyz = _817;
	float _818;
	float _819;
	float _820;
	float _821;
	_818 = V_xpd80_cscurves_xpos0_toe_grey;
	_819 = V_xpd80_cscurves_xpos1_toe_grey;
	_820 = V_xpd80_cscurves_xpos0_shoulder_grey;
	_821 = V_xpd80_cscurves_xpos1_shoulder_grey;
	vec4 _822 = F_xpd80_cscurves_xsetBoundaries(_818, _819, _820, _821);
	vec4 grey = _822;
	S_xpd80_cscurves_xTonemapParams tc_825 = _824;
	vec2 _826;
	vec2 _827;
	vec2 _828;
	S_xpd80_cscurves_xTonemapParams _829;
	_826 = grey.xy;
	_827 = grey.zw;
	_828 = vec2(1.00000000e+00, 1.00000000e+00);
	F_xpd80_cscurves_xPrepareTonemapParams(_826, _827, _828, _829);
	tc_825 = _829;
	float _836 = min(color_801.x, color_801.y);
	float _838 = min(_836, color_801.z);
	float rgb_luma = _838;
	float temp_luma = rgb_luma;
	vec3 _843 = color_801.xyz - vec3(rgb_luma);
	vec3 rgb_chroma = _843;
	S_xpd80_cscurves_xTonemapParams _845;
	vec3 _846;
	_845 = tc_825;
	_846 = vec3(rgb_luma);
	vec3 _848 = F_xpd80_cscurves_xTonemap(_845, _846);
	rgb_luma = _848.x;
	float _851 = V_xpd80_cscurves_xcolorsat + 1.00000000e+00;
	vec3 _853 = rgb_chroma * vec3(_851);
	rgb_chroma = _853;
	vec3 _854;
	_854 = color_801.xyz;
	vec3 _856 = F_xpd80_srgb_to_lab(_854);
	vec3 lab_color = _856;
	S_xpd80_cscurves_xTonemapParams _858;
	vec3 _859;
	_858 = tc_825;
	_859 = lab_color.xxx;
	vec3 _861 = F_xpd80_cscurves_xTonemap(_858, _859);
	lab_color[0] = _861.x;
	float _864 = V_xpd80_cscurves_xcolorsat + 1.00000000e+00;
	vec2 _867 = lab_color.yz * vec2(_864);
	lab_color.yz = _867;
	vec3 _868;
	_868 = color_801.xyz;
	vec3 _870 = F_xRGBToHSL(_868);
	vec3 hsl_color = _870;
	S_xpd80_cscurves_xTonemapParams _872;
	vec3 _873;
	_872 = tc_825;
	_873 = hsl_color.zzz;
	vec3 _875 = F_xpd80_cscurves_xTonemap(_872, _873);
	hsl_color[2] = _875.z;
	float _878 = V_xpd80_cscurves_xcolorsat + 1.00000000e+00;
	float _880 = hsl_color.y * _878;
	hsl_color[1] = _880;
	vec3 _881;
	_881 = color_801.xyz;
	vec3 _883 = F_xRGBToHSV(_881);
	vec3 hsv_color = _883;
	S_xpd80_cscurves_xTonemapParams _885;
	vec3 _886;
	_885 = tc_825;
	_886 = hsv_color.zzz;
	vec3 _888 = F_xpd80_cscurves_xTonemap(_885, _886);
	hsv_color[2] = _888.z;
	float _891 = V_xpd80_cscurves_xcolorsat + 1.00000000e+00;
	float _893 = hsv_color.y * _891;
	hsv_color[1] = _893;
	switch (V_xpd80_cscurves_xcolor_space)
	{
	case 0: {
		vec3 _898 = rgb_chroma.xyz + vec3(rgb_luma);
		vec3 _899 = clamp(_898, 0.0, 1.0);
		color_801.xyz = _899;
		break;
	}
	case 1: {
		vec3 _901;
		_901 = lab_color.xyz;
		vec3 _903 = F_xpd80_lab_to_srgb(_901);
		color_801.xyz = _903;
		break;
	}
	case 2: {
		vec3 _906 = clamp(hsl_color.xyz, 0.0, 1.0);
		vec3 _907;
		_907 = _906;
		vec3 _908 = F_xHSLToRGB(_907);
		color_801.xyz = _908;
		break;
	}
	case 3: {
		vec3 _911 = clamp(hsv_color.xyz, 0.0, 1.0);
		vec3 _912;
		_912 = _911;
		vec3 _913 = F_xHSVToRGB(_912);
		color_801.xyz = _913;
		break;
	}
	}
	vec3 _916 = color_801.xyz + dnoise.wxy;
	vec3 _917 = clamp(_916, 0.0, 1.0);
	color_801.xyz = _917;
	vec4 _922 = vec4(color_801.xyz.x, color_801.xyz.y, color_801.xyz.z, 1.00000000e+00);
	return _922;
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
#ifdef E_xpd80_cscurves_xPS_CSCurves
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_cscurves_xPS_CSCurves(pos, texcoord);
	return;
}
#endif
