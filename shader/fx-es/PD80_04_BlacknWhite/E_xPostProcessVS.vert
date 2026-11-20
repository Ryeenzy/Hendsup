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
uniform bool V_xpd80_blackandwhite_xenable_dither;
uniform float V_xpd80_blackandwhite_xdither_strength;
uniform float V_xpd80_blackandwhite_xcurve_str;
uniform bool V_xpd80_blackandwhite_xshow_clip;
uniform int V_xpd80_blackandwhite_xbw_mode;
uniform float V_xpd80_blackandwhite_xredchannel;
uniform float V_xpd80_blackandwhite_xyellowchannel;
uniform float V_xpd80_blackandwhite_xgreenchannel;
uniform float V_xpd80_blackandwhite_xcyanchannel;
uniform float V_xpd80_blackandwhite_xbluechannel;
uniform float V_xpd80_blackandwhite_xmagentachannel;
uniform bool V_xpd80_blackandwhite_xuse_tint;
uniform float V_xpd80_blackandwhite_xtinthue;
uniform float V_xpd80_blackandwhite_xtintsat;
uniform vec2 V_xpd80_blackandwhite_xpingpong;

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
float F_xpd80_blackandwhite_xcurve(
	in float x,
	in float k)
{
	float _647 = x - 5.00000000e-01;
	float _648 = sign(_647);
	float s = _648;
	float _651 = 1.00000000e+00 + s;
	float _653 = _651 / 2.00000000e+00;
	float o = _653;
	float _656 = 5.00000000e-01 * s;
	float _657 = s * x;
	float _658 = o - _657;
	float _660 = 2.00000000e+00 * _658;
	float _662 = max(_660, 0.00000000e+00);
	float _663 = pow(_662, k);
	float _664 = _656 * _663;
	float _665 = o - _664;
	return _665;
}
vec3 F_xpd80_blackandwhite_xProcessBW(
	in vec3 col,
	in float r,
	in float y,
	in float g,
	in float c,
	in float b,
	in float m)
{
	vec3 _675;
	_675 = col.xyz;
	vec3 _677 = F_xRGBToHSL(_675);
	vec3 hsl = _677;
	float _681 = 1.00000000e+00 - hsl.z;
	float lum = _681;
	float _685 = hsl.x * 6.00000000e+00;
	float _686 = abs(_685);
	float _688 = 1.00000000e+00 - _686;
	float _690 = max(_688, 0.00000000e+00);
	float _691;
	float _692;
	_691 = _690;
	_692 = V_xpd80_blackandwhite_xcurve_str;
	float _693 = F_xpd80_blackandwhite_xcurve(_691, _692);
	float _696 = hsl.x - 1.00000000e+00;
	float _698 = _696 * 6.00000000e+00;
	float _699 = abs(_698);
	float _701 = 1.00000000e+00 - _699;
	float _703 = max(_701, 0.00000000e+00);
	float _704;
	float _705;
	_704 = _703;
	_705 = V_xpd80_blackandwhite_xcurve_str;
	float _706 = F_xpd80_blackandwhite_xcurve(_704, _705);
	float _707 = _693 + _706;
	float weight_r = _707;
	float _711 = hsl.x - 1.66666999e-01;
	float _713 = _711 * 6.00000000e+00;
	float _714 = abs(_713);
	float _716 = 1.00000000e+00 - _714;
	float _718 = max(_716, 0.00000000e+00);
	float _719;
	float _720;
	_719 = _718;
	_720 = V_xpd80_blackandwhite_xcurve_str;
	float _721 = F_xpd80_blackandwhite_xcurve(_719, _720);
	float weight_y = _721;
	float _725 = hsl.x - 3.33332986e-01;
	float _727 = _725 * 6.00000000e+00;
	float _728 = abs(_727);
	float _730 = 1.00000000e+00 - _728;
	float _732 = max(_730, 0.00000000e+00);
	float _733;
	float _734;
	_733 = _732;
	_734 = V_xpd80_blackandwhite_xcurve_str;
	float _735 = F_xpd80_blackandwhite_xcurve(_733, _734);
	float weight_g = _735;
	float _739 = hsl.x - 5.00000000e-01;
	float _741 = _739 * 6.00000000e+00;
	float _742 = abs(_741);
	float _744 = 1.00000000e+00 - _742;
	float _746 = max(_744, 0.00000000e+00);
	float _747;
	float _748;
	_747 = _746;
	_748 = V_xpd80_blackandwhite_xcurve_str;
	float _749 = F_xpd80_blackandwhite_xcurve(_747, _748);
	float weight_c = _749;
	float _753 = hsl.x - 6.66666985e-01;
	float _755 = _753 * 6.00000000e+00;
	float _756 = abs(_755);
	float _758 = 1.00000000e+00 - _756;
	float _760 = max(_758, 0.00000000e+00);
	float _761;
	float _762;
	_761 = _760;
	_762 = V_xpd80_blackandwhite_xcurve_str;
	float _763 = F_xpd80_blackandwhite_xcurve(_761, _762);
	float weight_b = _763;
	float _767 = hsl.x - 8.33333015e-01;
	float _769 = _767 * 6.00000000e+00;
	float _770 = abs(_769);
	float _772 = 1.00000000e+00 - _770;
	float _774 = max(_772, 0.00000000e+00);
	float _775;
	float _776;
	_775 = _774;
	_776 = V_xpd80_blackandwhite_xcurve_str;
	float _777 = F_xpd80_blackandwhite_xcurve(_775, _776);
	float weight_m = _777;
	float _781 = 1.00000000e+00 - hsl.y;
	float _783 = hsl.y * _781;
	float _785 = _783 + hsl.y;
	float sat = _785;
	float ret_788 = hsl.z;
	float _789 = weight_r * r;
	float _791 = hsl.z * _789;
	float _792 = _791 * sat;
	float _793 = _792 * lum;
	float _794 = ret_788 + _793;
	ret_788 = _794;
	float _795 = weight_y * y;
	float _797 = hsl.z * _795;
	float _798 = _797 * sat;
	float _799 = _798 * lum;
	float _800 = ret_788 + _799;
	ret_788 = _800;
	float _801 = weight_g * g;
	float _803 = hsl.z * _801;
	float _804 = _803 * sat;
	float _805 = _804 * lum;
	float _806 = ret_788 + _805;
	ret_788 = _806;
	float _807 = weight_c * c;
	float _809 = hsl.z * _807;
	float _810 = _809 * sat;
	float _811 = _810 * lum;
	float _812 = ret_788 + _811;
	ret_788 = _812;
	float _813 = weight_b * b;
	float _815 = hsl.z * _813;
	float _816 = _815 * sat;
	float _817 = _816 * lum;
	float _818 = ret_788 + _817;
	ret_788 = _818;
	float _819 = weight_m * m;
	float _821 = hsl.z * _819;
	float _822 = _821 * sat;
	float _823 = _822 * lum;
	float _824 = ret_788 + _823;
	ret_788 = _824;
	float _825 = clamp(ret_788, 0.0, 1.0);
	return vec3(_825);
}
vec4 F_xpd80_blackandwhite_xPS_BlackandWhite(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _831 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_832 = _831;
	vec3 _834 = clamp(color_832.xyz, 0.0, 1.0);
	color_832.xyz = _834;
	vec2 _835;
	int _836;
	bool _837;
	float _838;
	bool _839;
	float _840;
	_835 = texcoord.xy;
	_836 = 4;
	_837 = V_xpd80_blackandwhite_xenable_dither;
	_838 = V_xpd80_blackandwhite_xdither_strength;
	_839 = true;
	_840 = 5.00000000e-01;
	vec4 _845 = F_xdither(V_xsamplerRGBNoise, _835, _836, _837, _838, _839, _840);
	vec4 dnoise = _845;
	vec3 _849 = color_832.xyz + dnoise.zyx;
	vec3 _850 = clamp(_849, 0.0, 1.0);
	color_832.xyz = _850;
	float red = 0.00000000e+00;
	float yellow = 0.00000000e+00;
	float green = 0.00000000e+00;
	float cyan = 0.00000000e+00;
	float blue = 0.00000000e+00;
	float magenta = 0.00000000e+00;
	switch (V_xpd80_blackandwhite_xbw_mode)
	{
	case 0: {
		red = 2.00000003e-01;
		yellow = 5.00000000e-01;
		green = -2.00000003e-01;
		cyan = -6.00000024e-01;
		blue = -1.00000000e+00;
		magenta = -2.00000003e-01;
		break;
	}
	case 1: {
		red = -5.00000000e-01;
		yellow = 5.00000000e-01;
		green = 1.20000005e+00;
		cyan = -2.00000003e-01;
		blue = -1.00000000e+00;
		magenta = -5.00000000e-01;
		break;
	}
	case 2: {
		red = -2.00000003e-01;
		yellow = 4.00000006e-01;
		green = -6.00000024e-01;
		cyan = 5.00000000e-01;
		blue = 1.00000000e+00;
		magenta = -2.00000003e-01;
		break;
	}
	case 3: {
		red = 5.00000000e-01;
		yellow = 1.20000005e+00;
		green = -5.00000000e-01;
		cyan = -1.00000000e+00;
		blue = -1.50000000e+00;
		magenta = -1.00000000e+00;
		break;
	}
	case 4: {
		red = -1.00000000e+00;
		yellow = 1.00000000e+00;
		green = 1.20000005e+00;
		cyan = -2.00000003e-01;
		blue = -1.50000000e+00;
		magenta = -1.00000000e+00;
		break;
	}
	case 5: {
		red = -6.99999988e-01;
		yellow = 4.00000006e-01;
		green = -1.20000005e+00;
		cyan = 6.99999988e-01;
		blue = 1.20000005e+00;
		magenta = -2.00000003e-01;
		break;
	}
	case 6: {
		red = -1.35000002e+00;
		yellow = 2.34999990e+00;
		green = 1.35000002e+00;
		cyan = -1.35000002e+00;
		blue = -1.60000002e+00;
		magenta = -1.07000005e+00;
		break;
	}
	case 7: {
		red = -1.00000000e+00;
		yellow = -1.00000000e+00;
		green = -1.00000000e+00;
		cyan = -1.00000000e+00;
		blue = -1.00000000e+00;
		magenta = -1.00000000e+00;
		break;
	}
	case 8: {
		red = 1.00000000e+00;
		yellow = 1.00000000e+00;
		green = 1.00000000e+00;
		cyan = 1.00000000e+00;
		blue = 1.00000000e+00;
		magenta = 1.00000000e+00;
		break;
	}
	case 9: {
		red = -6.99999988e-01;
		yellow = 8.99999976e-01;
		green = 6.00000024e-01;
		cyan = 1.00000001e-01;
		blue = -4.00000006e-01;
		magenta = -4.00000006e-01;
		break;
	}
	case 10: {
		red = 2.00000003e-01;
		yellow = 4.00000006e-01;
		green = 6.00000024e-01;
		cyan = 0.00000000e+00;
		blue = -6.00000024e-01;
		magenta = -2.00000003e-01;
		break;
	}
	case 11: {
		red = -3.00000012e-01;
		yellow = 1.00000000e+00;
		green = -3.00000012e-01;
		cyan = -6.00000024e-01;
		blue = -1.00000000e+00;
		magenta = -6.00000024e-01;
		break;
	}
	case 12: {
		red = -3.00000012e-01;
		yellow = 2.59999990e+00;
		green = -3.00000012e-01;
		cyan = -1.20000005e+00;
		blue = -6.00000024e-01;
		magenta = -4.00000006e-01;
		break;
	}
	case 13: {
		red = V_xpd80_blackandwhite_xredchannel;
		yellow = V_xpd80_blackandwhite_xyellowchannel;
		green = V_xpd80_blackandwhite_xgreenchannel;
		cyan = V_xpd80_blackandwhite_xcyanchannel;
		blue = V_xpd80_blackandwhite_xbluechannel;
		magenta = V_xpd80_blackandwhite_xmagentachannel;
		break;
	}
	default: {
		red = V_xpd80_blackandwhite_xredchannel;
		yellow = V_xpd80_blackandwhite_xyellowchannel;
		green = V_xpd80_blackandwhite_xgreenchannel;
		cyan = V_xpd80_blackandwhite_xcyanchannel;
		blue = V_xpd80_blackandwhite_xbluechannel;
		magenta = V_xpd80_blackandwhite_xmagentachannel;
		break;
	}
	}
	vec3 _957;
	float _958;
	float _959;
	float _960;
	float _961;
	float _962;
	float _963;
	_957 = color_832.xyz;
	_958 = red;
	_959 = yellow;
	_960 = green;
	_961 = cyan;
	_962 = blue;
	_963 = magenta;
	vec3 _965 = F_xpd80_blackandwhite_xProcessBW(_957, _958, _959, _960, _961, _962, _963);
	color_832.xyz = _965;
	vec3 _967 = vec3(V_xpd80_blackandwhite_xtinthue, V_xpd80_blackandwhite_xtintsat, color_832.x);
	vec3 _968;
	_968 = _967;
	vec3 _969 = F_xHSLToRGB(_968);
	vec3 _972 = mix(color_832.xyz, _969, vec3(bvec3(V_xpd80_blackandwhite_xuse_tint)));
	color_832.xyz = _972;
	if (V_xpd80_blackandwhite_xshow_clip)
	{
		float h = 9.80000019e-01;
		float l = 9.99999978e-03;
		float _982 = min(color_832.x, color_832.y);
		float _984 = min(_982, color_832.z);
		bool _985 = _984 >= h;
		float _988 = min(color_832.x, color_832.y);
		float _990 = min(_988, color_832.z);
		float _992 = smoothstep(h, 1.00000000e+00, _990);
		vec3 _996 = mix(color_832.xyz, vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_992));
		vec3 _999 = compCond(bvec3(_985), _996, color_832.xyz);
		color_832.xyz = _999;
		float _1002 = max(color_832.x, color_832.y);
		float _1004 = max(_1002, color_832.z);
		bool _1005 = _1004 <= l;
		float _1008 = max(color_832.x, color_832.y);
		float _1010 = max(_1008, color_832.z);
		float _1012 = smoothstep(0.00000000e+00, l, _1010);
		vec3 _1016 = mix(vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00), color_832.xyz, vec3(_1012));
		vec3 _1019 = compCond(bvec3(_1005), _1016, color_832.xyz);
		color_832.xyz = _1019;
	}
	vec3 _1022 = color_832.xyz + dnoise.xyz;
	vec3 _1023 = clamp(_1022, 0.0, 1.0);
	color_832.xyz = _1023;
	vec4 _1028 = vec4(color_832.xyz.x, color_832.xyz.y, color_832.xyz.z, 1.00000000e+00);
	return _1028;
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
#ifdef E_xpd80_blackandwhite_xPS_BlackandWhite
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_blackandwhite_xPS_BlackandWhite(pos, texcoord);
	return;
}
#endif
