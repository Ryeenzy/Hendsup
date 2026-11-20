#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_hqbloom_xPS_AvgBLuma
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
uniform bool V_xpd80_hqbloom_xdebugBloom;
uniform float V_xpd80_hqbloom_xdither_strength;
uniform float V_xpd80_hqbloom_xBloomMix;
uniform float V_xpd80_hqbloom_xBloomLimit;
uniform float V_xpd80_hqbloom_xGreyValue;
uniform float V_xpd80_hqbloom_xbExposure;
uniform float V_xpd80_hqbloom_xBlurSigma;
uniform float V_xpd80_hqbloom_xBloomSaturation;
uniform bool V_xpd80_hqbloom_xenableBKelvin;
uniform uint V_xpd80_hqbloom_xBKelvin;
uniform float V_xpd80_hqbloom_xframetime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xpd80_hqbloom_xsamplerLODColor;
uniform sampler2D V_xpd80_hqbloom_xsamplerLinColor;
uniform sampler2D V_xpd80_hqbloom_xsamplerBLuma;
uniform sampler2D V_xpd80_hqbloom_xsamplerBAvgLuma;
uniform sampler2D V_xpd80_hqbloom_xsamplerBPrevAvgLuma;
uniform sampler2D V_xpd80_hqbloom_xsamplerBloomIn;
uniform sampler2D V_xpd80_hqbloom_xsamplerBloomH;
uniform sampler2D V_xpd80_hqbloom_xsamplerBloom;
uniform sampler2D V_xpd80_hqbloom_xsamplerBloomAll;
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
vec3 F_xsl(
	in vec3 c,
	in vec3 b)
{
	bvec3 _632 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _634 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _635 = _634 * b;
	vec3 _636 = c * c;
	vec3 _638 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _640 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _638;
	vec3 _641 = _636 * _640;
	vec3 _642 = _635 + _641;
	vec3 _643 = sqrt(c);
	vec3 _645 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _647 = _645 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _648 = _643 * _647;
	vec3 _650 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _652 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _653 = _650 * _652;
	vec3 _654 = _648 + _653;
	vec3 _655 = compCond(_632, _642, _654);
	return _655;
}
float F_xgetLum(
	in vec3 x)
{
	float _660 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _660;
}
vec3 F_xexposure(
	in vec3 res,
	in float x)
{
	bool _666 = x < 0.00000000e+00;
	float _668 = x * 3.33000004e-01;
	float _669 = _666 ? _668 : x;
	x = _669;
	vec3 _672 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _674 = vec3(x) * _672;
	vec3 _676 = _674 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _678 = res.xyz * _676;
	vec3 _679 = clamp(_678, 0.0, 1.0);
	return _679;
}
vec3 F_xcon(
	in vec3 res,
	in float x)
{
	vec3 _684;
	vec3 _685;
	_684 = res.xyz;
	_685 = res.xyz;
	vec3 _688 = F_xsl(_684, _685);
	vec3 c_689 = _688;
	bool _691 = x < 0.00000000e+00;
	float _693 = x * 5.00000000e-01;
	float _694 = _691 ? _693 : x;
	x = _694;
	vec3 _698 = mix(res.xyz, c_689.xyz, vec3(x));
	vec3 _699 = clamp(_698, 0.0, 1.0);
	return _699;
}
vec3 F_xbri(
	in vec3 res,
	in float x)
{
	vec3 _706 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _709 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _710 = _706 * _709;
	vec3 _712 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _710;
	vec3 c_713 = _712;
	bool _715 = x < 0.00000000e+00;
	float _717 = x * 5.00000000e-01;
	float _718 = _715 ? _717 : x;
	x = _718;
	vec3 _722 = mix(res.xyz, c_713.xyz, vec3(x));
	vec3 _723 = clamp(_722, 0.0, 1.0);
	return _723;
}
vec3 F_xsat(
	in vec3 res,
	in float x)
{
	vec3 _728;
	_728 = res.xyz;
	float _730 = F_xgetLum(_728);
	float _732 = x + 1.00000000e+00;
	vec3 _736 = mix(vec3(_730), res.xyz, vec3(_732));
	vec3 _737 = clamp(_736, 0.0, 1.0);
	return _737;
}
vec3 F_xvib(
	in vec3 res,
	in float x)
{
	vec4 sat = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _746 = min(res.x, res.y);
	float _748 = min(_746, res.z);
	float _751 = max(res.x, res.y);
	float _753 = max(_751, res.z);
	vec2 _754 = vec2(_748, _753);
	sat.xy = _754;
	float _757 = sat.y - sat.x;
	sat[2] = _757;
	vec3 _758;
	_758 = res.xyz;
	float _760 = F_xgetLum(_758);
	sat[3] = _760;
	float _763 = 1.00000000e+00 - sat.z;
	float _764 = x * _763;
	float _766 = 1.00000000e+00 + _764;
	vec3 _770 = mix(vec3(sat.w), res.xyz, vec3(_766));
	vec3 _771 = clamp(_770, 0.0, 1.0);
	return _771;
}
float F_xpd80_hqbloom_xgetLuminance(
	in vec3 x)
{
	float _804 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _804;
}
float F_xpd80_hqbloom_xLog2Exposure(
	in float avgLuminance,
	in float GreyValue)
{
	float exposure = 0.00000000e+00;
	float _812 = max(avgLuminance, 9.99999997e-07);
	avgLuminance = _812;
	float _813 = GreyValue / avgLuminance;
	float linExp = _813;
	float _815 = log2(linExp);
	exposure = _815;
	return exposure;
}
vec3 F_xpd80_hqbloom_xCalcExposedColor(
	in vec3 color,
	in float avgLuminance,
	in float offset,
	in float GreyValue)
{
	float _822;
	float _823;
	_822 = avgLuminance;
	_823 = GreyValue;
	float _824 = F_xpd80_hqbloom_xLog2Exposure(_822, _823);
	float exposure_825 = _824;
	float _826 = exposure_825 + offset;
	exposure_825 = _826;
	float _827 = exp2(exposure_825);
	vec3 _829 = vec3(_827) * color;
	return _829;
}
vec3 F_xpd80_hqbloom_xscreen(
	in vec3 c,
	in vec3 b)
{
	vec3 _835 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _837 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _838 = _835 * _837;
	vec3 _840 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _838;
	return _840;
}
float F_xpd80_hqbloom_xPS_WriteBLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _845 = texture(V_xpd80_hqbloom_xsamplerLinColor, texcoord);
	vec4 color_846 = _845;
	vec3 _847;
	_847 = color_846.xyz;
	float _849 = F_xpd80_hqbloom_xgetLuminance(_847);
	float luma = _849;
	float _851 = max(luma, V_xpd80_hqbloom_xBloomLimit);
	luma = _851;
	float _852 = log2(luma);
	return _852;
}
float F_xpd80_hqbloom_xPS_AvgBLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _858 = textureLod(V_xpd80_hqbloom_xsamplerBLuma, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).xy, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).w);
	float luma_860 = _858.x;
	float _861 = exp2(luma_860);
	luma_860 = _861;
	vec4 _863 = texture(V_xpd80_hqbloom_xsamplerBPrevAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float prevluma = _863.x;
	float _867 = 1.00000000e+03 / V_xpd80_hqbloom_xframetime;
	float _869 = max(_867, 1.00000005e-03);
	float fps = _869;
	float _872 = fps * 5.00000000e-01;
	fps = _872;
	float _874 = 1.00000000e+00 / fps;
	float _875 = clamp(_874, 0.0, 1.0);
	float _876 = mix(prevluma, luma_860, _875);
	float avgLuma = _876;
	return avgLuma;
}
vec4 F_xpd80_hqbloom_xPS_PrepLOD(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _882 = texture(V_xReShade_xBackBuffer, texcoord);
	return _882;
}
vec4 F_xpd80_hqbloom_xPS_BloomIn(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _891 = vec4(texcoord.xy.x, texcoord.xy.y, 0.00000000e+00, 1.00000000e+00);
	vec4 _892 = textureLod(V_xpd80_hqbloom_xsamplerLODColor, _891.xy, _891.w);
	vec4 color_893 = _892;
	vec4 _895 = texture(V_xpd80_hqbloom_xsamplerBAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float luma_897 = _895.x;
	float _900 = clamp(luma_897, 9.99999997e-07, 9.99998987e-01);
	luma_897 = _900;
	vec3 _903 = color_893.xyz - vec3(luma_897);
	vec3 _904 = clamp(_903, 0.0, 1.0);
	float _906 = 1.00000000e+00 - luma_897;
	float _907 = clamp(_906, 0.0, 1.0);
	vec3 _909 = _904 / vec3(_907);
	color_893.xyz = _909;
	vec3 _910;
	float _911;
	float _912;
	float _913;
	_910 = color_893.xyz;
	_911 = luma_897;
	_912 = V_xpd80_hqbloom_xbExposure;
	_913 = V_xpd80_hqbloom_xGreyValue;
	vec3 _915 = F_xpd80_hqbloom_xCalcExposedColor(_910, _911, _912, _913);
	color_893.xyz = _915;
	vec4 _920 = vec4(color_893.xyz.x, color_893.xyz.y, color_893.xyz.z, 1.00000000e+00);
	return _920;
}
vec4 F_xpd80_hqbloom_xPS_GaussianH(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _925 = texture(V_xpd80_hqbloom_xsamplerBloomIn, texcoord);
	vec4 color_926 = _925;
	float _928 = 1.0 / 9.60000000e+02;
	float px = _928;
	float SigmaSum = 0.00000000e+00;
	float pxlOffset = 1.50000000e+00;
	vec2 buffSigma = vec2(0.00000000e+00, 0.00000000e+00);
	float _937 = V_xpd80_hqbloom_xBlurSigma * 5.00000000e-01;
	float bSigma = _937;
	vec3 Sigma = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _942 = sqrt(6.28318405e+00);
	float _943 = _942 * bSigma;
	float _945 = 1.00000000e+00 / _943;
	Sigma[0] = _945;
	float _946 = bSigma * bSigma;
	float _948 = -5.00000000e-01 / _946;
	float _949 = exp(_948);
	Sigma[1] = _949;
	float _952 = Sigma.y * Sigma.y;
	Sigma[2] = _952;
	vec3 _955 = color_926.xyz * vec3(Sigma.x);
	color_926.xyz = _955;
	float _957 = SigmaSum + Sigma.x;
	SigmaSum = _957;
	vec2 _960 = Sigma.xy * Sigma.yz;
	Sigma.xy = _960;
	int i = 0;
	bool _969 = i < 300;
	bool _972 = Sigma.x > 9.99999975e-05;
	bool _973 = _969 && _972;
	while (_973)
	{
		{
			float _978 = Sigma.x * Sigma.y;
			buffSigma[0] = _978;
			float _981 = Sigma.x + buffSigma.x;
			buffSigma[1] = _981;
			float _982 = pxlOffset * px;
			vec2 _984 = vec2(_982, 0.00000000e+00);
			vec2 _986 = texcoord.xy + _984;
			vec4 _991 = vec4(_986.x, _986.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _992 = textureLod(V_xpd80_hqbloom_xsamplerBloomIn, _991.xy, _991.w);
			vec4 _994 = _992 * vec4(buffSigma.y);
			vec4 _995 = color_926 + _994;
			color_926 = _995;
			float _996 = pxlOffset * px;
			vec2 _998 = vec2(_996, 0.00000000e+00);
			vec2 _1000 = texcoord.xy - _998;
			vec4 _1005 = vec4(_1000.x, _1000.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1006 = textureLod(V_xpd80_hqbloom_xsamplerBloomIn, _1005.xy, _1005.w);
			vec4 _1008 = _1006 * vec4(buffSigma.y);
			vec4 _1009 = color_926 + _1008;
			color_926 = _1009;
			float _1012 = 2.00000000e+00 * Sigma.x;
			float _1015 = 2.00000000e+00 * buffSigma.x;
			float _1016 = _1012 + _1015;
			float _1017 = SigmaSum + _1016;
			SigmaSum = _1017;
			float _1019 = pxlOffset + 2.00000000e+00;
			pxlOffset = _1019;
			vec2 _1022 = Sigma.xy * Sigma.yz;
			Sigma.xy = _1022;
			vec2 _1025 = Sigma.xy * Sigma.yz;
			Sigma.xy = _1025;
		}
		int _975 = i + 1;
		i = _975;
		bool _969 = i < 300;
		bool _972 = Sigma.x > 9.99999975e-05;
		_973 = _969 && _972;
	}
	vec4 _1027 = color_926 / vec4(SigmaSum);
	color_926 = _1027;
	return color_926;
}
vec4 F_xpd80_hqbloom_xPS_GaussianV(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1032 = texture(V_xpd80_hqbloom_xsamplerBloomH, texcoord);
	vec4 color_1033 = _1032;
	float _1035 = 1.0 / 5.40000000e+02;
	float py = _1035;
	float SigmaSum_1038 = 0.00000000e+00;
	float pxlOffset_1040 = 1.50000000e+00;
	vec2 buffSigma_1042 = vec2(0.00000000e+00, 0.00000000e+00);
	float _1044 = V_xpd80_hqbloom_xBlurSigma * 5.00000000e-01;
	float bSigma_1045 = _1044;
	vec3 Sigma_1047 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _1049 = sqrt(6.28318405e+00);
	float _1050 = _1049 * bSigma_1045;
	float _1052 = 1.00000000e+00 / _1050;
	Sigma_1047[0] = _1052;
	float _1053 = bSigma_1045 * bSigma_1045;
	float _1055 = -5.00000000e-01 / _1053;
	float _1056 = exp(_1055);
	Sigma_1047[1] = _1056;
	float _1059 = Sigma_1047.y * Sigma_1047.y;
	Sigma_1047[2] = _1059;
	vec3 _1062 = color_1033.xyz * vec3(Sigma_1047.x);
	color_1033.xyz = _1062;
	float _1064 = SigmaSum_1038 + Sigma_1047.x;
	SigmaSum_1038 = _1064;
	vec2 _1067 = Sigma_1047.xy * Sigma_1047.yz;
	Sigma_1047.xy = _1067;
	int i_1069 = 0;
	bool _1076 = i_1069 < 300;
	bool _1079 = Sigma_1047.x > 9.99999975e-05;
	bool _1080 = _1076 && _1079;
	while (_1080)
	{
		{
			float _1085 = Sigma_1047.x * Sigma_1047.y;
			buffSigma_1042[0] = _1085;
			float _1088 = Sigma_1047.x + buffSigma_1042.x;
			buffSigma_1042[1] = _1088;
			float _1089 = pxlOffset_1040 * py;
			vec2 _1091 = vec2(0.00000000e+00, _1089);
			vec2 _1093 = texcoord.xy + _1091;
			vec4 _1098 = vec4(_1093.x, _1093.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1099 = textureLod(V_xpd80_hqbloom_xsamplerBloomH, _1098.xy, _1098.w);
			vec4 _1101 = _1099 * vec4(buffSigma_1042.y);
			vec4 _1102 = color_1033 + _1101;
			color_1033 = _1102;
			float _1103 = pxlOffset_1040 * py;
			vec2 _1105 = vec2(0.00000000e+00, _1103);
			vec2 _1107 = texcoord.xy - _1105;
			vec4 _1112 = vec4(_1107.x, _1107.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1113 = textureLod(V_xpd80_hqbloom_xsamplerBloomH, _1112.xy, _1112.w);
			vec4 _1115 = _1113 * vec4(buffSigma_1042.y);
			vec4 _1116 = color_1033 + _1115;
			color_1033 = _1116;
			float _1119 = 2.00000000e+00 * Sigma_1047.x;
			float _1122 = 2.00000000e+00 * buffSigma_1042.x;
			float _1123 = _1119 + _1122;
			float _1124 = SigmaSum_1038 + _1123;
			SigmaSum_1038 = _1124;
			float _1126 = pxlOffset_1040 + 2.00000000e+00;
			pxlOffset_1040 = _1126;
			vec2 _1129 = Sigma_1047.xy * Sigma_1047.yz;
			Sigma_1047.xy = _1129;
			vec2 _1132 = Sigma_1047.xy * Sigma_1047.yz;
			Sigma_1047.xy = _1132;
		}
		int _1082 = i_1069 + 1;
		i_1069 = _1082;
		bool _1076 = i_1069 < 300;
		bool _1079 = Sigma_1047.x > 9.99999975e-05;
		_1080 = _1076 && _1079;
	}
	vec4 _1134 = color_1033 / vec4(SigmaSum_1038);
	color_1033 = _1134;
	return color_1033;
}
vec4 F_xpd80_hqbloom_xPS_Combine(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1139 = texture(V_xpd80_hqbloom_xsamplerBloom, texcoord);
	vec4 widebloom = _1139;
	return widebloom;
}
vec4 F_xpd80_hqbloom_xPS_Gaussian(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1145 = texture(V_xpd80_hqbloom_xsamplerBloomAll, texcoord);
	vec4 bloom = _1145;
	vec4 _1147 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_1148 = _1147;
	float _1150 = 1.00000000e+00 - V_xpd80_hqbloom_xBloomLimit;
	float _1152 = 2.00000000e+00 - _1150;
	vec2 _1153;
	int _1154;
	bool _1155;
	float _1156;
	bool _1157;
	float _1158;
	_1153 = texcoord.xy;
	_1154 = 0;
	_1155 = true;
	_1156 = V_xpd80_hqbloom_xdither_strength;
	_1157 = true;
	_1158 = _1152;
	vec4 _1163 = F_xdither(V_xsamplerRGBNoise, _1153, _1154, _1155, _1156, _1157, _1158);
	vec4 dnoise = _1163;
	vec3 _1168 = smoothstep(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.20000001e-02, 1.20000001e-02, 1.20000001e-02), bloom.xyz);
	vec3 steps = _1168;
	vec3 _1172 = dnoise.xyz * steps.xyz;
	vec3 _1174 = bloom.xyz + _1172;
	vec3 _1175 = clamp(_1174, 0.0, 1.0);
	bloom.xyz = _1175;
	if (V_xpd80_hqbloom_xenableBKelvin)
	{
		float _1179;
		_1179 = float(V_xpd80_hqbloom_xBKelvin);
		vec3 _1181 = F_xKelvinToRGB(_1179);
		vec3 K_1182 = _1181;
		vec3 _1183;
		_1183 = bloom.xyz;
		vec3 _1185 = F_xRGBToHSL(_1183);
		vec3 bLum = _1185;
		vec3 _1189 = bloom.xyz * K_1182.xyz;
		vec3 _1190;
		_1190 = _1189;
		vec3 _1191 = F_xRGBToHSL(_1190);
		vec3 retHSV = _1191;
		vec3 _1196 = vec3(retHSV.xy.x, retHSV.xy.y, bLum.z);
		vec3 _1197;
		_1197 = _1196;
		vec3 _1198 = F_xHSLToRGB(_1197);
		bloom.xyz = _1198;
	}
	vec3 _1199;
	float _1200;
	_1199 = bloom.xyz;
	_1200 = V_xpd80_hqbloom_xBloomSaturation;
	vec3 _1202 = F_xvib(_1199, _1200);
	bloom.xyz = _1202;
	vec3 _1203;
	vec3 _1204;
	_1203 = color_1148.xyz;
	_1204 = bloom.xyz;
	vec3 _1207 = F_xpd80_hqbloom_xscreen(_1203, _1204);
	vec3 bcolor = _1207;
	vec3 _1212 = mix(color_1148.xyz, bcolor.xyz, vec3(V_xpd80_hqbloom_xBloomMix));
	color_1148.xyz = _1212;
	vec3 _1216 = compCond(bvec3(V_xpd80_hqbloom_xdebugBloom), bloom.xyz, color_1148.xyz);
	color_1148.xyz = _1216;
	vec4 _1221 = vec4(color_1148.xyz.x, color_1148.xyz.y, color_1148.xyz.z, 1.00000000e+00);
	return _1221;
}
float F_xpd80_hqbloom_xPS_PrevAvgBLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1227 = texture(V_xpd80_hqbloom_xsamplerBAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float avgLuma_1229 = _1227.x;
	return avgLuma_1229;
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
#ifdef E_xpd80_hqbloom_xPS_WriteBLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_WriteBLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_AvgBLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_AvgBLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_PrepLOD
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_PrepLOD(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_BloomIn
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_BloomIn(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_GaussianH
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_GaussianH(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_GaussianV
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_GaussianV(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_Combine
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_Combine(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_Gaussian
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_Gaussian(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_hqbloom_xPS_PrevAvgBLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_hqbloom_xPS_PrevAvgBLuma(pos, texcoord);
	return;
}
#endif
