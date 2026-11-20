#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_conbrisat_xPS_CBS
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
uniform bool V_xpd80_conbrisat_xenable_dither;
uniform float V_xpd80_conbrisat_xdither_strength;
uniform float V_xpd80_conbrisat_xtint;
uniform float V_xpd80_conbrisat_xexposureN;
uniform float V_xpd80_conbrisat_xcontrast;
uniform float V_xpd80_conbrisat_xbrightness;
uniform float V_xpd80_conbrisat_xsaturation;
uniform float V_xpd80_conbrisat_xvibrance;
uniform float V_xpd80_conbrisat_xhuemid;
uniform float V_xpd80_conbrisat_xhuerange;
uniform float V_xpd80_conbrisat_xsat_custom;
uniform float V_xpd80_conbrisat_xsat_r;
uniform float V_xpd80_conbrisat_xsat_y;
uniform float V_xpd80_conbrisat_xsat_g;
uniform float V_xpd80_conbrisat_xsat_a;
uniform float V_xpd80_conbrisat_xsat_b;
uniform float V_xpd80_conbrisat_xsat_p;
uniform float V_xpd80_conbrisat_xsat_m;
uniform bool V_xpd80_conbrisat_xenable_depth;
uniform bool V_xpd80_conbrisat_xdisplay_depth;
uniform float V_xpd80_conbrisat_xdepthStart;
uniform float V_xpd80_conbrisat_xdepthEnd;
uniform float V_xpd80_conbrisat_xdepthCurve;
uniform float V_xpd80_conbrisat_xexposureD;
uniform float V_xpd80_conbrisat_xcontrastD;
uniform float V_xpd80_conbrisat_xbrightnessD;
uniform float V_xpd80_conbrisat_xsaturationD;
uniform float V_xpd80_conbrisat_xvibranceD;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
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
float F_xgetAvgColor(
	in vec3 col)
{
	float _632 = dot(col.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	return _632;
}
vec3 F_xClipColor(
	in vec3 color)
{
	vec3 _636;
	_636 = color.xyz;
	float _638 = F_xgetAvgColor(_636);
	float lum = _638;
	float _642 = min(color.x, color.y);
	float _644 = min(_642, color.z);
	float mincol = _644;
	float _648 = max(color.x, color.y);
	float _650 = max(_648, color.z);
	float maxcol = _650;
	bool _653 = mincol < 0.00000000e+00;
	vec3 _656 = color.xyz - vec3(lum);
	vec3 _658 = _656 * vec3(lum);
	float _659 = lum - mincol;
	vec3 _661 = _658 / vec3(_659);
	vec3 _663 = vec3(lum) + _661;
	vec3 _666 = compCond(bvec3(_653), _663, color.xyz);
	color.xyz = _666;
	bool _668 = maxcol > 1.00000000e+00;
	vec3 _671 = color.xyz - vec3(lum);
	float _673 = 1.00000000e+00 - lum;
	vec3 _675 = _671 * vec3(_673);
	float _676 = maxcol - lum;
	vec3 _678 = _675 / vec3(_676);
	vec3 _680 = vec3(lum) + _678;
	vec3 _683 = compCond(bvec3(_668), _680, color.xyz);
	color.xyz = _683;
	return color;
}
vec3 F_xblendLuma(
	in vec3 base,
	in vec3 blend)
{
	vec3 _688;
	_688 = base.xyz;
	float _690 = F_xgetAvgColor(_688);
	float lumbase = _690;
	vec3 _692;
	_692 = blend.xyz;
	float _694 = F_xgetAvgColor(_692);
	float lumblend = _694;
	float _696 = lumblend - lumbase;
	float ldiff = _696;
	vec3 _700 = base.xyz + vec3(ldiff);
	vec3 col_701 = _700;
	vec3 _702;
	_702 = col_701.xyz;
	vec3 _704 = F_xClipColor(_702);
	return _704;
}
vec3 F_xblendColor(
	in vec3 base,
	in vec3 blend,
	in vec3 lum)
{
	float _712 = min(base.x, base.y);
	float _714 = min(_712, base.z);
	float minbase = _714;
	float _718 = max(base.x, base.y);
	float _720 = max(_718, base.z);
	float maxbase = _720;
	float _722 = maxbase - minbase;
	float satbase = _722;
	float _726 = min(blend.x, blend.y);
	float _728 = min(_726, blend.z);
	float minblend = _728;
	float _732 = max(blend.x, blend.y);
	float _734 = max(_732, blend.z);
	float maxblend = _734;
	float _736 = maxblend - minblend;
	float satblend = _736;
	bool _739 = satbase > 0.00000000e+00;
	vec3 _742 = base.xyz - vec3(minbase);
	vec3 _744 = _742 * vec3(satblend);
	vec3 _746 = _744 / vec3(satbase);
	vec3 _749 = compCond(bvec3(_739), _746, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 color_750 = _749;
	vec3 _751;
	vec3 _752;
	_751 = color_750.xyz;
	_752 = lum.xyz;
	vec3 _755 = F_xblendLuma(_751, _752);
	return _755;
}
vec3 F_xdarken(
	in vec3 c,
	in vec3 b)
{
	vec3 _760 = min(c, b);
	return _760;
}
vec3 F_xmultiply(
	in vec3 c,
	in vec3 b)
{
	vec3 _765 = c * b;
	return _765;
}
vec3 F_xlinearburn(
	in vec3 c,
	in vec3 b)
{
	vec3 _770 = c + b;
	vec3 _772 = _770 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _774 = max(_772, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _774;
}
vec3 F_xcolorburn(
	in vec3 c,
	in vec3 b)
{
	bvec3 _780 = lessThanEqual(b, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _782 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _783 = _782 / b;
	vec3 _785 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _783;
	vec3 _786 = clamp(_785, 0.0, 1.0);
	vec3 _787 = compCond(_780, b, _786);
	return _787;
}
vec3 F_xlighten(
	in vec3 c,
	in vec3 b)
{
	vec3 _792 = max(b, c);
	return _792;
}
vec3 F_xscreen(
	in vec3 c,
	in vec3 b)
{
	vec3 _798 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _800 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _801 = _798 * _800;
	vec3 _803 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _801;
	return _803;
}
vec3 F_xcolordodge(
	in vec3 c,
	in vec3 b)
{
	bvec3 _809 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _811 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _812 = c / _811;
	vec3 _813 = clamp(_812, 0.0, 1.0);
	vec3 _814 = compCond(_809, b, _813);
	return _814;
}
vec3 F_xlineardodge(
	in vec3 c,
	in vec3 b)
{
	vec3 _819 = c + b;
	vec3 _821 = min(_819, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _821;
}
vec3 F_xoverlay(
	in vec3 c,
	in vec3 b)
{
	bvec3 _827 = lessThan(c, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _829 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _830 = _829 * b;
	vec3 _832 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _834 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _832;
	vec3 _836 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _837 = _834 * _836;
	vec3 _839 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _837;
	vec3 _840 = compCond(_827, _830, _839);
	return _840;
}
vec3 F_xsoftlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _846 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _848 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _849 = _848 * b;
	vec3 _850 = c * c;
	vec3 _852 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _854 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _852;
	vec3 _855 = _850 * _854;
	vec3 _856 = _849 + _855;
	vec3 _857 = sqrt(c);
	vec3 _859 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _861 = _859 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _862 = _857 * _861;
	vec3 _864 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _866 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _867 = _864 * _866;
	vec3 _868 = _862 + _867;
	vec3 _869 = compCond(_846, _856, _868);
	return _869;
}
vec3 F_xvividlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _875 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _877 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _878;
	vec3 _879;
	_878 = c;
	_879 = _877;
	vec3 _880 = F_xcolorburn(_878, _879);
	vec3 _882 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _884 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _882;
	vec3 _885;
	vec3 _886;
	_885 = c;
	_886 = _884;
	vec3 _887 = F_xcolordodge(_885, _886);
	vec3 _888 = compCond(_875, _880, _887);
	return _888;
}
vec3 F_xlinearlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _894 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _896 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _897;
	vec3 _898;
	_897 = c;
	_898 = _896;
	vec3 _899 = F_xlinearburn(_897, _898);
	vec3 _901 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _903 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _901;
	vec3 _904;
	vec3 _905;
	_904 = c;
	_905 = _903;
	vec3 _906 = F_xlineardodge(_904, _905);
	vec3 _907 = compCond(_894, _899, _906);
	return _907;
}
vec3 F_xpinlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _913 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _915 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _916;
	vec3 _917;
	_916 = c;
	_917 = _915;
	vec3 _918 = F_xdarken(_916, _917);
	vec3 _920 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _922 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _920;
	vec3 _923;
	vec3 _924;
	_923 = c;
	_924 = _922;
	vec3 _925 = F_xlighten(_923, _924);
	vec3 _926 = compCond(_913, _918, _925);
	return _926;
}
vec3 F_xhardmix(
	in vec3 c,
	in vec3 b)
{
	vec3 _931;
	vec3 _932;
	_931 = c;
	_932 = b;
	vec3 _933 = F_xvividlight(_931, _932);
	bvec3 _935 = lessThan(_933, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _938 = compCond(_935, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _938;
}
vec3 F_xreflect(
	in vec3 c,
	in vec3 b)
{
	bvec3 _944 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _945 = c * c;
	vec3 _947 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _948 = _945 / _947;
	vec3 _949 = clamp(_948, 0.0, 1.0);
	vec3 _950 = compCond(_944, b, _949);
	return _950;
}
vec3 F_xglow(
	in vec3 c,
	in vec3 b)
{
	vec3 _955;
	vec3 _956;
	_955 = b;
	_956 = c;
	vec3 _957 = F_xreflect(_955, _956);
	return _957;
}
vec3 F_xblendhue(
	in vec3 c,
	in vec3 b)
{
	vec3 _962;
	vec3 _963;
	vec3 _964;
	_962 = b;
	_963 = c;
	_964 = c;
	vec3 _965 = F_xblendColor(_962, _963, _964);
	return _965;
}
vec3 F_xblendsaturation(
	in vec3 c,
	in vec3 b)
{
	vec3 _970;
	vec3 _971;
	vec3 _972;
	_970 = c;
	_971 = b;
	_972 = c;
	vec3 _973 = F_xblendColor(_970, _971, _972);
	return _973;
}
vec3 F_xblendcolor(
	in vec3 c,
	in vec3 b)
{
	vec3 _978;
	vec3 _979;
	_978 = b;
	_979 = c;
	vec3 _980 = F_xblendLuma(_978, _979);
	return _980;
}
vec3 F_xblendluminosity(
	in vec3 c,
	in vec3 b)
{
	vec3 _985;
	vec3 _986;
	_985 = c;
	_986 = b;
	vec3 _987 = F_xblendLuma(_985, _986);
	return _987;
}
vec3 F_xblendmode(
	in vec3 c,
	in vec3 b,
	in int mode,
	in float o)
{
	vec3 ret_995 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	switch (mode)
	{
	case 0: {
		ret_995.xyz = b.xyz;
		break;
	}
	case 1: {
		vec3 _1000;
		vec3 _1001;
		_1000 = c;
		_1001 = b;
		vec3 _1002 = F_xdarken(_1000, _1001);
		ret_995.xyz = _1002;
		break;
	}
	case 2: {
		vec3 _1004;
		vec3 _1005;
		_1004 = c;
		_1005 = b;
		vec3 _1006 = F_xmultiply(_1004, _1005);
		ret_995.xyz = _1006;
		break;
	}
	case 3: {
		vec3 _1008;
		vec3 _1009;
		_1008 = c;
		_1009 = b;
		vec3 _1010 = F_xlinearburn(_1008, _1009);
		ret_995.xyz = _1010;
		break;
	}
	case 4: {
		vec3 _1012;
		vec3 _1013;
		_1012 = c;
		_1013 = b;
		vec3 _1014 = F_xcolorburn(_1012, _1013);
		ret_995.xyz = _1014;
		break;
	}
	case 5: {
		vec3 _1016;
		vec3 _1017;
		_1016 = c;
		_1017 = b;
		vec3 _1018 = F_xlighten(_1016, _1017);
		ret_995.xyz = _1018;
		break;
	}
	case 6: {
		vec3 _1020;
		vec3 _1021;
		_1020 = c;
		_1021 = b;
		vec3 _1022 = F_xscreen(_1020, _1021);
		ret_995.xyz = _1022;
		break;
	}
	case 7: {
		vec3 _1024;
		vec3 _1025;
		_1024 = c;
		_1025 = b;
		vec3 _1026 = F_xcolordodge(_1024, _1025);
		ret_995.xyz = _1026;
		break;
	}
	case 8: {
		vec3 _1028;
		vec3 _1029;
		_1028 = c;
		_1029 = b;
		vec3 _1030 = F_xlineardodge(_1028, _1029);
		ret_995.xyz = _1030;
		break;
	}
	case 9: {
		vec3 _1032;
		vec3 _1033;
		_1032 = c;
		_1033 = b;
		vec3 _1034 = F_xoverlay(_1032, _1033);
		ret_995.xyz = _1034;
		break;
	}
	case 10: {
		vec3 _1036;
		vec3 _1037;
		_1036 = c;
		_1037 = b;
		vec3 _1038 = F_xsoftlight(_1036, _1037);
		ret_995.xyz = _1038;
		break;
	}
	case 11: {
		vec3 _1040;
		vec3 _1041;
		_1040 = c;
		_1041 = b;
		vec3 _1042 = F_xvividlight(_1040, _1041);
		ret_995.xyz = _1042;
		break;
	}
	case 12: {
		vec3 _1044;
		vec3 _1045;
		_1044 = c;
		_1045 = b;
		vec3 _1046 = F_xlinearlight(_1044, _1045);
		ret_995.xyz = _1046;
		break;
	}
	case 13: {
		vec3 _1048;
		vec3 _1049;
		_1048 = c;
		_1049 = b;
		vec3 _1050 = F_xpinlight(_1048, _1049);
		ret_995.xyz = _1050;
		break;
	}
	case 14: {
		vec3 _1052;
		vec3 _1053;
		_1052 = c;
		_1053 = b;
		vec3 _1054 = F_xhardmix(_1052, _1053);
		ret_995.xyz = _1054;
		break;
	}
	case 15: {
		vec3 _1056;
		vec3 _1057;
		_1056 = c;
		_1057 = b;
		vec3 _1058 = F_xreflect(_1056, _1057);
		ret_995.xyz = _1058;
		break;
	}
	case 16: {
		vec3 _1060;
		vec3 _1061;
		_1060 = c;
		_1061 = b;
		vec3 _1062 = F_xglow(_1060, _1061);
		ret_995.xyz = _1062;
		break;
	}
	case 17: {
		vec3 _1064;
		vec3 _1065;
		_1064 = c;
		_1065 = b;
		vec3 _1066 = F_xblendhue(_1064, _1065);
		ret_995.xyz = _1066;
		break;
	}
	case 18: {
		vec3 _1068;
		vec3 _1069;
		_1068 = c;
		_1069 = b;
		vec3 _1070 = F_xblendsaturation(_1068, _1069);
		ret_995.xyz = _1070;
		break;
	}
	case 19: {
		vec3 _1072;
		vec3 _1073;
		_1072 = c;
		_1073 = b;
		vec3 _1074 = F_xblendcolor(_1072, _1073);
		ret_995.xyz = _1074;
		break;
	}
	case 20: {
		vec3 _1076;
		vec3 _1077;
		_1076 = c;
		_1077 = b;
		vec3 _1078 = F_xblendluminosity(_1076, _1077);
		ret_995.xyz = _1078;
		break;
	}
	}
	vec3 _1082 = mix(c.xyz, ret_995.xyz, vec3(o));
	vec3 _1083 = clamp(_1082, 0.0, 1.0);
	return _1083;
}
vec3 F_xsl(
	in vec3 c,
	in vec3 b)
{
	bvec3 _1089 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _1091 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _1092 = _1091 * b;
	vec3 _1093 = c * c;
	vec3 _1095 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _1097 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1095;
	vec3 _1098 = _1093 * _1097;
	vec3 _1099 = _1092 + _1098;
	vec3 _1100 = sqrt(c);
	vec3 _1102 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _1104 = _1102 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _1105 = _1100 * _1104;
	vec3 _1107 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _1109 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _1110 = _1107 * _1109;
	vec3 _1111 = _1105 + _1110;
	vec3 _1112 = compCond(_1089, _1099, _1111);
	return _1112;
}
float F_xgetLum(
	in vec3 x)
{
	float _1117 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _1117;
}
vec3 F_xexposure(
	in vec3 res,
	in float x)
{
	bool _1123 = x < 0.00000000e+00;
	float _1125 = x * 3.33000004e-01;
	float _1126 = _1123 ? _1125 : x;
	x = _1126;
	vec3 _1129 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _1131 = vec3(x) * _1129;
	vec3 _1133 = _1131 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _1135 = res.xyz * _1133;
	vec3 _1136 = clamp(_1135, 0.0, 1.0);
	return _1136;
}
vec3 F_xcon(
	in vec3 res,
	in float x)
{
	vec3 _1141;
	vec3 _1142;
	_1141 = res.xyz;
	_1142 = res.xyz;
	vec3 _1145 = F_xsl(_1141, _1142);
	vec3 c_1146 = _1145;
	bool _1148 = x < 0.00000000e+00;
	float _1150 = x * 5.00000000e-01;
	float _1151 = _1148 ? _1150 : x;
	x = _1151;
	vec3 _1155 = mix(res.xyz, c_1146.xyz, vec3(x));
	vec3 _1156 = clamp(_1155, 0.0, 1.0);
	return _1156;
}
vec3 F_xbri(
	in vec3 res,
	in float x)
{
	vec3 _1163 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _1166 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _1167 = _1163 * _1166;
	vec3 _1169 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1167;
	vec3 c_1170 = _1169;
	bool _1172 = x < 0.00000000e+00;
	float _1174 = x * 5.00000000e-01;
	float _1175 = _1172 ? _1174 : x;
	x = _1175;
	vec3 _1179 = mix(res.xyz, c_1170.xyz, vec3(x));
	vec3 _1180 = clamp(_1179, 0.0, 1.0);
	return _1180;
}
vec3 F_xsat(
	in vec3 res,
	in float x)
{
	vec3 _1185;
	_1185 = res.xyz;
	float _1187 = F_xgetLum(_1185);
	float _1189 = x + 1.00000000e+00;
	vec3 _1193 = mix(vec3(_1187), res.xyz, vec3(_1189));
	vec3 _1194 = clamp(_1193, 0.0, 1.0);
	return _1194;
}
vec3 F_xvib(
	in vec3 res,
	in float x)
{
	vec4 sat = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _1203 = min(res.x, res.y);
	float _1205 = min(_1203, res.z);
	float _1208 = max(res.x, res.y);
	float _1210 = max(_1208, res.z);
	vec2 _1211 = vec2(_1205, _1210);
	sat.xy = _1211;
	float _1214 = sat.y - sat.x;
	sat[2] = _1214;
	vec3 _1215;
	_1215 = res.xyz;
	float _1217 = F_xgetLum(_1215);
	sat[3] = _1217;
	float _1220 = 1.00000000e+00 - sat.z;
	float _1221 = x * _1220;
	float _1223 = 1.00000000e+00 + _1221;
	vec3 _1227 = mix(vec3(sat.w), res.xyz, vec3(_1223));
	vec3 _1228 = clamp(_1227, 0.0, 1.0);
	return _1228;
}
float F_xpd80_conbrisat_xgetLuminance(
	in vec3 x)
{
	float _1261 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _1261;
}
float F_xpd80_conbrisat_xcurve(
	in float x)
{
	float _1265 = x * x;
	float _1267 = 2.00000000e+00 * x;
	float _1269 = 3.00000000e+00 - _1267;
	float _1270 = _1265 * _1269;
	return _1270;
}
vec3 F_xpd80_conbrisat_xchannelsat(
	in vec3 col,
	in float r,
	in float y,
	in float g,
	in float a,
	in float b,
	in float p,
	in float m,
	in float hue)
{
	vec3 _1282;
	_1282 = col.xyz;
	float _1284 = F_xpd80_conbrisat_xgetLuminance(_1282);
	float desat = _1284;
	float _1287 = hue * 6.00000000e+00;
	float _1288 = abs(_1287);
	float _1290 = 1.00000000e+00 - _1288;
	float _1292 = max(_1290, 0.00000000e+00);
	float _1293;
	_1293 = _1292;
	float _1294 = F_xpd80_conbrisat_xcurve(_1293);
	float _1296 = hue - 1.00000000e+00;
	float _1298 = _1296 * 6.00000000e+00;
	float _1299 = abs(_1298);
	float _1301 = 1.00000000e+00 - _1299;
	float _1303 = max(_1301, 0.00000000e+00);
	float _1304;
	_1304 = _1303;
	float _1305 = F_xpd80_conbrisat_xcurve(_1304);
	float _1306 = _1294 + _1305;
	float weight_r = _1306;
	float _1309 = hue - 1.66666999e-01;
	float _1311 = _1309 * 6.00000000e+00;
	float _1312 = abs(_1311);
	float _1314 = 1.00000000e+00 - _1312;
	float _1316 = max(_1314, 0.00000000e+00);
	float _1317;
	_1317 = _1316;
	float _1318 = F_xpd80_conbrisat_xcurve(_1317);
	float weight_y = _1318;
	float _1321 = hue - 3.33332986e-01;
	float _1323 = _1321 * 6.00000000e+00;
	float _1324 = abs(_1323);
	float _1326 = 1.00000000e+00 - _1324;
	float _1328 = max(_1326, 0.00000000e+00);
	float _1329;
	_1329 = _1328;
	float _1330 = F_xpd80_conbrisat_xcurve(_1329);
	float weight_g = _1330;
	float _1333 = hue - 5.00000000e-01;
	float _1335 = _1333 * 6.00000000e+00;
	float _1336 = abs(_1335);
	float _1338 = 1.00000000e+00 - _1336;
	float _1340 = max(_1338, 0.00000000e+00);
	float _1341;
	_1341 = _1340;
	float _1342 = F_xpd80_conbrisat_xcurve(_1341);
	float weight_a = _1342;
	float _1345 = hue - 6.66666985e-01;
	float _1347 = _1345 * 6.00000000e+00;
	float _1348 = abs(_1347);
	float _1350 = 1.00000000e+00 - _1348;
	float _1352 = max(_1350, 0.00000000e+00);
	float _1353;
	_1353 = _1352;
	float _1354 = F_xpd80_conbrisat_xcurve(_1353);
	float weight_b = _1354;
	float _1357 = hue - 7.50000000e-01;
	float _1359 = _1357 * 6.00000000e+00;
	float _1360 = abs(_1359);
	float _1362 = 1.00000000e+00 - _1360;
	float _1364 = max(_1362, 0.00000000e+00);
	float _1365;
	_1365 = _1364;
	float _1366 = F_xpd80_conbrisat_xcurve(_1365);
	float weight_p = _1366;
	float _1369 = hue - 8.33333015e-01;
	float _1371 = _1369 * 6.00000000e+00;
	float _1372 = abs(_1371);
	float _1374 = 1.00000000e+00 - _1372;
	float _1376 = max(_1374, 0.00000000e+00);
	float _1377;
	_1377 = _1376;
	float _1378 = F_xpd80_conbrisat_xcurve(_1377);
	float weight_m = _1378;
	float _1380 = r * weight_r;
	float _1382 = 1.00000000e+00 + _1380;
	float _1385 = clamp(_1382, 0.00000000e+00, 2.00000000e+00);
	vec3 _1389 = mix(vec3(desat), col.xyz, vec3(_1385));
	col.xyz = _1389;
	float _1390 = y * weight_y;
	float _1392 = 1.00000000e+00 + _1390;
	float _1395 = clamp(_1392, 0.00000000e+00, 2.00000000e+00);
	vec3 _1399 = mix(vec3(desat), col.xyz, vec3(_1395));
	col.xyz = _1399;
	float _1400 = g * weight_g;
	float _1402 = 1.00000000e+00 + _1400;
	float _1405 = clamp(_1402, 0.00000000e+00, 2.00000000e+00);
	vec3 _1409 = mix(vec3(desat), col.xyz, vec3(_1405));
	col.xyz = _1409;
	float _1410 = a * weight_a;
	float _1412 = 1.00000000e+00 + _1410;
	float _1415 = clamp(_1412, 0.00000000e+00, 2.00000000e+00);
	vec3 _1419 = mix(vec3(desat), col.xyz, vec3(_1415));
	col.xyz = _1419;
	float _1420 = b * weight_b;
	float _1422 = 1.00000000e+00 + _1420;
	float _1425 = clamp(_1422, 0.00000000e+00, 2.00000000e+00);
	vec3 _1429 = mix(vec3(desat), col.xyz, vec3(_1425));
	col.xyz = _1429;
	float _1430 = p * weight_p;
	float _1432 = 1.00000000e+00 + _1430;
	float _1435 = clamp(_1432, 0.00000000e+00, 2.00000000e+00);
	vec3 _1439 = mix(vec3(desat), col.xyz, vec3(_1435));
	col.xyz = _1439;
	float _1440 = m * weight_m;
	float _1442 = 1.00000000e+00 + _1440;
	float _1445 = clamp(_1442, 0.00000000e+00, 2.00000000e+00);
	vec3 _1449 = mix(vec3(desat), col.xyz, vec3(_1445));
	col.xyz = _1449;
	vec3 _1451 = clamp(col.xyz, 0.0, 1.0);
	return _1451;
}
vec3 F_xpd80_conbrisat_xcustomsat(
	in vec3 col,
	in float h,
	in float range,
	in float sat,
	in float hue)
{
	vec3 _1459;
	_1459 = col.xyz;
	float _1461 = F_xpd80_conbrisat_xgetLuminance(_1459);
	float desat_1462 = _1461;
	float _1463 = 1.0 / range;
	float r_1464 = _1463;
	float _1465 = hue - h;
	float _1466 = _1465 * r_1464;
	float _1467 = abs(_1466);
	float _1469 = 1.00000000e+00 - _1467;
	float _1471 = max(_1469, 0.00000000e+00);
	vec3 w_1473 = vec3(_1471);
	float _1475 = hue + 1.00000000e+00;
	float _1476 = _1475 - h;
	float _1477 = _1476 * r_1464;
	float _1478 = abs(_1477);
	float _1480 = 1.00000000e+00 - _1478;
	float _1482 = max(_1480, 0.00000000e+00);
	w_1473[1] = _1482;
	float _1484 = hue - 1.00000000e+00;
	float _1485 = _1484 - h;
	float _1486 = _1485 * r_1464;
	float _1487 = abs(_1486);
	float _1489 = 1.00000000e+00 - _1487;
	float _1491 = max(_1489, 0.00000000e+00);
	w_1473[2] = _1491;
	float _1494 = dot(w_1473.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	float _1495;
	_1495 = _1494;
	float _1496 = F_xpd80_conbrisat_xcurve(_1495);
	float _1497 = _1496 * sat;
	float weight = _1497;
	float _1500 = 1.00000000e+00 + weight;
	float _1503 = clamp(_1500, 0.00000000e+00, 2.00000000e+00);
	vec3 _1507 = mix(vec3(desat_1462), col.xyz, vec3(_1503));
	col.xyz = _1507;
	vec3 _1509 = clamp(col.xyz, 0.0, 1.0);
	return _1509;
}
vec4 F_xpd80_conbrisat_xPS_CBS(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1514 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_1515 = _1514;
	vec2 _1516;
	int _1517;
	bool _1518;
	float _1519;
	bool _1520;
	float _1521;
	_1516 = texcoord.xy;
	_1517 = 6;
	_1518 = V_xpd80_conbrisat_xenable_dither;
	_1519 = V_xpd80_conbrisat_xdither_strength;
	_1520 = true;
	_1521 = 5.00000000e-01;
	vec4 _1526 = F_xdither(V_xsamplerRGBNoise, _1516, _1517, _1518, _1519, _1520, _1521);
	vec4 dnoise = _1526;
	vec3 _1530 = color_1515.xyz + dnoise.xyz;
	vec3 _1531 = clamp(_1530, 0.0, 1.0);
	color_1515.xyz = _1531;
	vec2 _1532;
	_1532 = texcoord;
	float _1533 = F_xReShade_xGetLinearizedDepth(_1532);
	float depth_1534 = _1533;
	float _1535 = smoothstep(V_xpd80_conbrisat_xdepthStart, V_xpd80_conbrisat_xdepthEnd, depth_1534);
	depth_1534 = _1535;
	float _1536 = pow(depth_1534, V_xpd80_conbrisat_xdepthCurve);
	depth_1534 = _1536;
	vec2 _1537;
	int _1538;
	bool _1539;
	float _1540;
	bool _1541;
	float _1542;
	_1537 = texcoord.xy;
	_1538 = 0;
	_1539 = true;
	_1540 = 1.00000000e+00;
	_1541 = false;
	_1542 = 1.00000000e+00;
	vec4 _1549 = F_xdither(V_xsamplerGaussNoise, _1537, _1538, _1539, _1540, _1541, _1542);
	vec4 dnoise2 = _1549;
	float _1552 = depth_1534 + dnoise2.x;
	float _1553 = clamp(_1552, 0.0, 1.0);
	depth_1534 = _1553;
	vec3 cold = vec3(0.00000000e+00, 3.65000010e-01, 1.00000000e+00);
	vec3 warm = vec3(9.80000019e-01, 5.88000000e-01, 0.00000000e+00);
	bool _1559 = V_xpd80_conbrisat_xtint < 0.00000000e+00;
	vec3 _1560;
	vec3 _1561;
	_1560 = cold.xyz;
	_1561 = color_1515.xyz;
	vec3 _1564 = F_xblendLuma(_1560, _1561);
	float _1565 = abs(V_xpd80_conbrisat_xtint);
	vec3 _1568 = mix(color_1515.xyz, _1564, vec3(_1565));
	vec3 _1569;
	vec3 _1570;
	_1569 = warm.xyz;
	_1570 = color_1515.xyz;
	vec3 _1573 = F_xblendLuma(_1569, _1570);
	vec3 _1576 = mix(color_1515.xyz, _1573, vec3(V_xpd80_conbrisat_xtint));
	vec3 _1578 = compCond(bvec3(_1559), _1568, _1576);
	color_1515.xyz = _1578;
	vec3 dcolor = color_1515.xyz;
	vec3 _1581;
	float _1582;
	_1581 = color_1515.xyz;
	_1582 = V_xpd80_conbrisat_xexposureN;
	vec3 _1584 = F_xexposure(_1581, _1582);
	color_1515.xyz = _1584;
	vec3 _1585;
	float _1586;
	_1585 = color_1515.xyz;
	_1586 = V_xpd80_conbrisat_xcontrast;
	vec3 _1588 = F_xcon(_1585, _1586);
	color_1515.xyz = _1588;
	vec3 _1589;
	float _1590;
	_1589 = color_1515.xyz;
	_1590 = V_xpd80_conbrisat_xbrightness;
	vec3 _1592 = F_xbri(_1589, _1590);
	color_1515.xyz = _1592;
	vec3 _1593;
	float _1594;
	_1593 = color_1515.xyz;
	_1594 = V_xpd80_conbrisat_xsaturation;
	vec3 _1596 = F_xsat(_1593, _1594);
	color_1515.xyz = _1596;
	vec3 _1597;
	float _1598;
	_1597 = color_1515.xyz;
	_1598 = V_xpd80_conbrisat_xvibrance;
	vec3 _1600 = F_xvib(_1597, _1598);
	color_1515.xyz = _1600;
	vec3 _1601;
	float _1602;
	_1601 = dcolor.xyz;
	_1602 = V_xpd80_conbrisat_xexposureD;
	vec3 _1604 = F_xexposure(_1601, _1602);
	dcolor.xyz = _1604;
	vec3 _1605;
	float _1606;
	_1605 = dcolor.xyz;
	_1606 = V_xpd80_conbrisat_xcontrastD;
	vec3 _1608 = F_xcon(_1605, _1606);
	dcolor.xyz = _1608;
	vec3 _1609;
	float _1610;
	_1609 = dcolor.xyz;
	_1610 = V_xpd80_conbrisat_xbrightnessD;
	vec3 _1612 = F_xbri(_1609, _1610);
	dcolor.xyz = _1612;
	vec3 _1613;
	float _1614;
	_1613 = dcolor.xyz;
	_1614 = V_xpd80_conbrisat_xsaturationD;
	vec3 _1616 = F_xsat(_1613, _1614);
	dcolor.xyz = _1616;
	vec3 _1617;
	float _1618;
	_1617 = dcolor.xyz;
	_1618 = V_xpd80_conbrisat_xvibranceD;
	vec3 _1620 = F_xvib(_1617, _1618);
	dcolor.xyz = _1620;
	float _1622 = float(V_xpd80_conbrisat_xenable_depth) * depth_1534;
	vec3 _1626 = mix(color_1515.xyz, dcolor.xyz, vec3(_1622));
	color_1515.xyz = _1626;
	vec3 _1627;
	_1627 = color_1515.xyz;
	vec3 _1629 = F_xRGBToHSL(_1627);
	float chue = _1629.x;
	vec3 _1632;
	float _1633;
	float _1634;
	float _1635;
	float _1636;
	float _1637;
	float _1638;
	float _1639;
	float _1640;
	_1632 = color_1515.xyz;
	_1633 = V_xpd80_conbrisat_xsat_r;
	_1634 = V_xpd80_conbrisat_xsat_y;
	_1635 = V_xpd80_conbrisat_xsat_g;
	_1636 = V_xpd80_conbrisat_xsat_a;
	_1637 = V_xpd80_conbrisat_xsat_b;
	_1638 = V_xpd80_conbrisat_xsat_p;
	_1639 = V_xpd80_conbrisat_xsat_m;
	_1640 = chue;
	vec3 _1642 = F_xpd80_conbrisat_xchannelsat(_1632, _1633, _1634, _1635, _1636, _1637, _1638, _1639, _1640);
	color_1515.xyz = _1642;
	vec3 _1643;
	float _1644;
	float _1645;
	float _1646;
	float _1647;
	_1643 = color_1515.xyz;
	_1644 = V_xpd80_conbrisat_xhuemid;
	_1645 = V_xpd80_conbrisat_xhuerange;
	_1646 = V_xpd80_conbrisat_xsat_custom;
	_1647 = chue;
	vec3 _1649 = F_xpd80_conbrisat_xcustomsat(_1643, _1644, _1645, _1646, _1647);
	color_1515.xyz = _1649;
	vec3 _1653 = compCond(bvec3(V_xpd80_conbrisat_xdisplay_depth), vec3(depth_1534), color_1515.xyz);
	color_1515.xyz = _1653;
	vec4 _1658 = vec4(color_1515.xyz.x, color_1515.xyz.y, color_1515.xyz.z, 1.00000000e+00);
	return _1658;
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
#ifdef E_xpd80_conbrisat_xPS_CBS
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_conbrisat_xPS_CBS(pos, texcoord);
	return;
}
#endif
