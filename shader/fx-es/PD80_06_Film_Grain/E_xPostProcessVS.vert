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
float fmodHLSL(float x, float y) { return x - y * trunc(x / y); }
vec2 fmodHLSL(vec2 x, vec2 y) { return x - y * trunc(x / y); }
vec3 fmodHLSL(vec3 x, vec3 y) { return x - y * trunc(x / y); }
vec4 fmodHLSL(vec4 x, vec4 y) { return x - y * trunc(x / y); }
mat2 fmodHLSL(mat2 x, mat2 y) { return x - matrixCompMult(y, mat2(trunc(x[0] / y[0]), trunc(x[1] / y[1]))); }
mat3 fmodHLSL(mat3 x, mat3 y) { return x - matrixCompMult(y, mat3(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]))); }
mat4 fmodHLSL(mat4 x, mat4 y) { return x - matrixCompMult(y, mat4(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]), trunc(x[3] / y[3]))); }
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
uniform bool V_xpd80_filmgrain_xenable_test;
uniform int V_xpd80_filmgrain_xgrainMotion;
uniform float V_xpd80_filmgrain_xgrainAdjust;
uniform int V_xpd80_filmgrain_xgrainSize;
uniform int V_xpd80_filmgrain_xgrainOrigColor;
uniform bool V_xpd80_filmgrain_xuse_negnoise;
uniform float V_xpd80_filmgrain_xgrainColor;
uniform float V_xpd80_filmgrain_xgrainAmount;
uniform float V_xpd80_filmgrain_xgrainIntensity;
uniform float V_xpd80_filmgrain_xgrainDensity;
uniform float V_xpd80_filmgrain_xgrainIntHigh;
uniform float V_xpd80_filmgrain_xgrainIntLow;
uniform bool V_xpd80_filmgrain_xenable_depth;
uniform bool V_xpd80_filmgrain_xdisplay_depth;
uniform float V_xpd80_filmgrain_xdepthStart;
uniform float V_xpd80_filmgrain_xdepthEnd;
uniform float V_xpd80_filmgrain_xdepthCurve;
uniform float V_xpd80_filmgrain_xTimer;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xpd80_filmgrain_xsamplerPermTex;
uniform sampler2D V_xpd80_filmgrain_xsamplerNoise;
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
vec3 F_xHUEToRGB(
	in float H)
{
	float _65 = H * 6.00000000e+00;
	float _67 = _65 - 3.00000000e+00;
	float _68 = abs(_67);
	float _70 = _68 - 1.00000000e+00;
	float _72 = H * 6.00000000e+00;
	float _74 = _72 - 2.00000000e+00;
	float _75 = abs(_74);
	float _77 = 2.00000000e+00 - _75;
	float _79 = H * 6.00000000e+00;
	float _81 = _79 - 4.00000000e+00;
	float _82 = abs(_81);
	float _84 = 2.00000000e+00 - _82;
	vec3 _85 = vec3(_70, _77, _84);
	vec3 _86 = clamp(_85, 0.0, 1.0);
	return _86;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _92 = RGB.y < RGB.z;
	vec4 _97 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _102 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _104 = compCond(bvec4(_92), _97, _102);
	vec4 P = _104;
	bool _108 = RGB.x < P.x;
	vec4 _113 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _118 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _120 = compCond(bvec4(_108), _113, _118);
	vec4 Q1 = _120;
	float _124 = min(Q1.w, Q1.y);
	float _126 = Q1.x - _124;
	float C = _126;
	float _130 = Q1.w - Q1.y;
	float _132 = 6.00000000e+00 * C;
	float _134 = _132 + 9.99999997e-07;
	float _135 = _130 / _134;
	float _137 = _135 + Q1.z;
	float _138 = abs(_137);
	float H_139 = _138;
	vec3 _141 = vec3(H_139, C, Q1.x);
	return _141;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _147 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _147;
	vec3 _148;
	_148 = RGB;
	vec3 _149 = F_xRGBToHCV(_148);
	vec3 HCV = _149;
	float _153 = HCV.y * 5.00000000e-01;
	float _155 = HCV.z - _153;
	float L = _155;
	float _158 = L * 2.00000000e+00;
	float _160 = _158 - 1.00000000e+00;
	float _161 = abs(_160);
	float _163 = 1.00000000e+00 - _161;
	float _165 = _163 + 9.99999997e-07;
	float _167 = HCV.y / _165;
	float S = _167;
	vec3 _170 = vec3(HCV.x, S, L);
	return _170;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _174;
	_174 = HSL.x;
	vec3 _176 = F_xHUEToRGB(_174);
	vec3 RGB_177 = _176;
	float _180 = 2.00000000e+00 * HSL.z;
	float _182 = _180 - 1.00000000e+00;
	float _183 = abs(_182);
	float _185 = 1.00000000e+00 - _183;
	float _187 = _185 * HSL.y;
	float C_188 = _187;
	vec3 _190 = RGB_177 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _192 = _190 * vec3(C_188);
	vec3 _194 = _192 + vec3(HSL.z);
	return _194;
}
vec3 F_xRGBToHSV(
	in vec3 c)
{
	vec4 K = vec4(0.00000000e+00, -3.33333343e-01, 6.66666687e-01, -1.00000000e+00);
	bool _202 = c.y < c.z;
	vec4 _207 = vec4(c.zy.x, c.zy.y, K.wz.x, K.wz.y);
	vec4 _212 = vec4(c.yz.x, c.yz.y, K.xy.x, K.xy.y);
	vec4 _214 = compCond(bvec4(_202), _207, _212);
	vec4 p = _214;
	bool _218 = c.x < p.x;
	vec4 _223 = vec4(p.xyw.x, p.xyw.y, p.xyw.z, c.x);
	vec4 _228 = vec4(c.x, p.yzx.x, p.yzx.y, p.yzx.z);
	vec4 _230 = compCond(bvec4(_218), _223, _228);
	vec4 q = _230;
	float _234 = min(q.w, q.y);
	float _236 = q.x - _234;
	float d = _236;
	float e = 1.00000001e-10;
	float _242 = q.w - q.y;
	float _244 = 6.00000000e+00 * d;
	float _245 = _244 + e;
	float _246 = _242 / _245;
	float _248 = q.z + _246;
	float _249 = abs(_248);
	float _251 = q.x + e;
	float _252 = d / _251;
	vec3 _254 = vec3(_249, _252, q.x);
	return _254;
}
vec3 F_xHSVToRGB(
	in vec3 c)
{
	vec4 K_259 = vec4(1.00000000e+00, 6.66666687e-01, 3.33333343e-01, 3.00000000e+00);
	vec3 _262 = c.xxx + K_259.xyz;
	vec3 _263 = fract(_262);
	vec3 _265 = _263 * vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec3 _267 = _265 - K_259.www;
	vec3 _268 = abs(_267);
	vec3 p_269 = _268;
	vec3 _271 = p_269 - K_259.xxx;
	vec3 _272 = clamp(_271, 0.0, 1.0);
	vec3 _275 = mix(K_259.xxx, _272, vec3(c.y));
	vec3 _277 = vec3(c.z) * _275;
	return _277;
}
vec3 F_xKelvinToRGB(
	in float k)
{
	vec3 ret = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _285 = clamp(k, 1.00000000e+03, 4.00000000e+04);
	float _287 = _285 / 1.00000000e+02;
	float kelvin = _287;
	bool _293 = kelvin <= 6.60000000e+01;
	if (_293)
	{
		ret[0] = 1.00000000e+00;
		float _295 = log(kelvin);
		float _297 = 3.90081584e-01 * _295;
		float _299 = _297 - 6.31841421e-01;
		float _300 = clamp(_299, 0.0, 1.0);
		ret[1] = _300;
	}
	else
	{
		float _302 = kelvin - 6.00000000e+01;
		float _304 = max(_302, 0.00000000e+00);
		float t = _304;
		float _307 = pow(t, -1.33204758e-01);
		float _309 = 1.29293621e+00 * _307;
		float _310 = clamp(_309, 0.0, 1.0);
		ret[0] = _310;
		float _312 = pow(t, -7.55148456e-02);
		float _314 = 1.12989092e+00 * _312;
		float _315 = clamp(_314, 0.0, 1.0);
		ret[1] = _315;
	}
	bool _320 = kelvin >= 6.60000000e+01;
	if (_320)
	{
		ret[2] = 1.00000000e+00;
	}
	else
	{
		bool _326 = kelvin < 1.90000000e+01;
		if (_326)
		{
			ret[2] = 0.00000000e+00;
		}
		else
		{
			float _329 = kelvin - 1.00000000e+01;
			float _330 = log(_329);
			float _332 = 5.43206811e-01 * _330;
			float _334 = _332 - 1.19625413e+00;
			float _335 = clamp(_334, 0.0, 1.0);
			ret[2] = _335;
		}
	}
	return ret;
}
vec3 F_xLinearTosRGB(
	in vec3 color)
{
	vec3 _340 = color * vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x = _340;
	vec3 _342 = clamp(color, 0.0, 1.0);
	vec3 _344 = pow(_342, vec3(4.16666657e-01, 4.16666657e-01, 4.16666657e-01));
	vec3 _346 = vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00) * _344;
	vec3 _348 = _346 - vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 y = _348;
	vec3 clr = color;
	bool _353 = color.x < 3.13080009e-03;
	float _356 = _353 ? x.x : y.x;
	clr[0] = _356;
	bool _359 = color.y < 3.13080009e-03;
	float _362 = _359 ? x.y : y.y;
	clr[1] = _362;
	bool _365 = color.z < 3.13080009e-03;
	float _368 = _365 ? x.z : y.z;
	clr[2] = _368;
	return clr;
}
vec3 F_xSRGBToLinear(
	in vec3 color)
{
	vec3 _373 = color / vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x_374 = _373;
	vec3 _376 = color + vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 _378 = _376 / vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00);
	vec3 _380 = max(_378, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _382 = pow(_380, vec3(2.40000010e+00, 2.40000010e+00, 2.40000010e+00));
	vec3 y_383 = _382;
	vec3 clr_384 = color;
	bool _387 = color.x <= 4.04499993e-02;
	float _390 = _387 ? x_374.x : y_383.x;
	clr_384[0] = _390;
	bool _393 = color.y <= 4.04499993e-02;
	float _396 = _393 ? x_374.y : y_383.y;
	clr_384[1] = _396;
	bool _399 = color.z <= 4.04499993e-02;
	float _402 = _399 ? x_374.z : y_383.z;
	clr_384[2] = _402;
	return clr_384;
}
vec3 F_xpd80_xyz_to_lab(
	in vec3 c)
{
	vec3 _407 = c / vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	vec3 _409 = max(_407, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 w = _409;
	vec3 v = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _415 = w.x > 8.85645207e-03;
	float _418 = pow(w.x, 3.33333343e-01);
	float _421 = 9.03296326e+02 * w.x;
	float _423 = _421 + 1.60000000e+01;
	float _425 = _423 / 1.16000000e+02;
	float _426 = _415 ? _418 : _425;
	v[0] = _426;
	bool _429 = w.y > 8.85645207e-03;
	float _432 = pow(w.y, 3.33333343e-01);
	float _435 = 9.03296326e+02 * w.y;
	float _437 = _435 + 1.60000000e+01;
	float _439 = _437 / 1.16000000e+02;
	float _440 = _429 ? _432 : _439;
	v[1] = _440;
	bool _443 = w.z > 8.85645207e-03;
	float _446 = pow(w.z, 3.33333343e-01);
	float _449 = 9.03296326e+02 * w.z;
	float _451 = _449 + 1.60000000e+01;
	float _453 = _451 / 1.16000000e+02;
	float _454 = _443 ? _446 : _453;
	v[2] = _454;
	float _457 = 1.16000000e+02 * v.y;
	float _459 = _457 - 1.60000000e+01;
	float _462 = v.x - v.y;
	float _464 = 5.00000000e+02 * _462;
	float _467 = v.y - v.z;
	float _469 = 2.00000000e+02 * _467;
	vec3 _470 = vec3(_459, _464, _469);
	return _470;
}
vec3 F_xpd80_lab_to_xyz(
	in vec3 c)
{
	vec3 v_475 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _478 = c.x + 1.60000000e+01;
	float _480 = _478 / 1.16000000e+02;
	v_475[1] = _480;
	float _483 = c.y / 5.00000000e+02;
	float _485 = _483 + v_475.y;
	v_475[0] = _485;
	float _488 = c.z / 2.00000000e+02;
	float _490 = v_475.y - _488;
	v_475[2] = _490;
	float _493 = v_475.x * v_475.x;
	float _495 = _493 * v_475.x;
	bool _497 = _495 > 8.85645207e-03;
	float _500 = v_475.x * v_475.x;
	float _502 = _500 * v_475.x;
	float _505 = 1.16000000e+02 * v_475.x;
	float _507 = _505 - 1.60000000e+01;
	float _509 = _507 / 9.03296326e+02;
	float _510 = _497 ? _502 : _509;
	bool _513 = c.x > 8.00000095e+00;
	float _516 = v_475.y * v_475.y;
	float _518 = _516 * v_475.y;
	float _521 = c.x / 9.03296326e+02;
	float _522 = _513 ? _518 : _521;
	float _525 = v_475.z * v_475.z;
	float _527 = _525 * v_475.z;
	bool _529 = _527 > 8.85645207e-03;
	float _532 = v_475.z * v_475.z;
	float _534 = _532 * v_475.z;
	float _537 = 1.16000000e+02 * v_475.z;
	float _539 = _537 - 1.60000000e+01;
	float _541 = _539 / 9.03296326e+02;
	float _542 = _529 ? _534 : _541;
	vec3 _543 = vec3(_510, _522, _542);
	vec3 _545 = _543 * vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	return _545;
}
vec3 F_xpd80_srgb_to_xyz(
	in vec3 c)
{
	vec3 _550 = (c * mat3x3(4.12456393e-01, 3.57576102e-01, 1.80437505e-01, 2.12672904e-01, 7.15152204e-01, 7.21750036e-02, 1.93339009e-02, 1.19191997e-01, 9.50304091e-01));
	return _550;
}
vec3 F_xpd80_xyz_to_srgb(
	in vec3 c)
{
	vec3 _555 = (c * mat3x3(3.24045420e+00, -1.53713846e+00, -4.98531401e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 5.56433983e-02, -2.04025894e-01, 1.05722523e+00));
	return _555;
}
vec3 F_xpd80_srgb_to_lab(
	in vec3 c)
{
	vec3 _559;
	_559 = c;
	vec3 _560 = F_xpd80_srgb_to_xyz(_559);
	vec3 lab = _560;
	vec3 _562;
	_562 = lab;
	vec3 _563 = F_xpd80_xyz_to_lab(_562);
	lab = _563;
	vec3 _565 = lab / vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	return _565;
}
vec3 F_xpd80_lab_to_srgb(
	in vec3 c)
{
	vec3 _570 = c * vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	vec3 _571;
	_571 = _570;
	vec3 _572 = F_xpd80_lab_to_xyz(_571);
	vec3 rgb = _572;
	vec3 _575 = min(rgb, vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00));
	vec3 _577 = max(_575, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _578;
	_578 = _577;
	vec3 _579 = F_xpd80_xyz_to_srgb(_578);
	rgb = _579;
	vec3 _580 = clamp(rgb, 0.0, 1.0);
	return _580;
}
vec4 F_xpd80_filmgrain_xrnm(
	in vec2 tc,
	in float t)
{
	float _608 = dot(tc, vec2(1.29898005e+01, 7.82330017e+01));
	float _609 = sin(_608);
	float _611 = 4.37585469e+04 + t;
	float _612 = _609 * _611;
	float noise = _612;
	float _614 = noise * V_xpd80_filmgrain_xgrainAdjust;
	float _615 = fract(_614);
	float _617 = _615 * 2.00000000e+00;
	float _619 = _617 - 1.00000000e+00;
	float noiseR = _619;
	float _622 = noise * 1.21539998e+00;
	float _623 = _622 * V_xpd80_filmgrain_xgrainAdjust;
	float _624 = fract(_623);
	float _626 = _624 * 2.00000000e+00;
	float _628 = _626 - 1.00000000e+00;
	float noiseG = _628;
	float _631 = noise * 1.34529996e+00;
	float _632 = _631 * V_xpd80_filmgrain_xgrainAdjust;
	float _633 = fract(_632);
	float _635 = _633 * 2.00000000e+00;
	float _637 = _635 - 1.00000000e+00;
	float noiseB = _637;
	float _640 = noise * 1.36469996e+00;
	float _641 = _640 * V_xpd80_filmgrain_xgrainAdjust;
	float _642 = fract(_641);
	float _644 = _642 * 2.00000000e+00;
	float _646 = _644 - 1.00000000e+00;
	float noiseA = _646;
	vec4 _648 = vec4(noiseR, noiseG, noiseB, noiseA);
	return _648;
}
float F_xpd80_filmgrain_xfade(
	in float t)
{
	float _652 = t * t;
	float _653 = _652 * t;
	float _655 = t * 6.00000000e+00;
	float _657 = _655 - 1.50000000e+01;
	float _658 = t * _657;
	float _660 = _658 + 1.00000000e+01;
	float _661 = _653 * _660;
	return _661;
}
float F_xpd80_filmgrain_xcurve(
	in float x)
{
	float _665 = x * x;
	float _667 = 2.00000000e+00 * x;
	float _669 = 3.00000000e+00 - _667;
	float _670 = _665 * _669;
	return _670;
}
float F_xpd80_filmgrain_xpnoise3D(
	in vec3 p,
	in float t)
{
	vec3 _675 = floor(p);
	vec3 _677 = vec3(3.90625000e-03, 3.90625000e-03, 3.90625000e-03) * _675;
	vec3 _679 = _677 + vec3(1.95312500e-03, 1.95312500e-03, 1.95312500e-03);
	vec3 pi = _679;
	vec2 _683 = pi.xy * vec2(2.56000000e+02, 2.56000000e+02);
	pi.xy = _683;
	vec2 _686 = pi.xy - vec2(1.95312500e-03, 1.95312500e-03);
	vec2 _688 = _686 / vec2(ivec2(V_xpd80_filmgrain_xgrainSize));
	vec2 _689 = round(_688);
	vec2 _691 = _689 * vec2(ivec2(V_xpd80_filmgrain_xgrainSize));
	pi.xy = _691;
	vec2 _694 = pi.xy / vec2(2.56000000e+02, 2.56000000e+02);
	pi.xy = _694;
	vec3 _695 = fract(p);
	vec3 pf = _695;
	vec2 _697;
	float _698;
	_697 = pi.xy;
	_698 = t;
	vec4 _700 = F_xpd80_filmgrain_xrnm(_697, _698);
	float perm00 = _700.x;
	vec2 _704 = vec2(perm00, pi.z);
	vec4 _705 = texture(V_xpd80_filmgrain_xsamplerPermTex, _704);
	vec3 _708 = _705.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _710 = _708 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad000 = _710;
	float _712 = dot(grad000, pf);
	float n000 = _712;
	float _716 = pi.z + 3.90625000e-03;
	vec2 _717 = vec2(perm00, _716);
	vec4 _718 = texture(V_xpd80_filmgrain_xsamplerPermTex, _717);
	vec3 _721 = _718.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _723 = _721 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad001 = _723;
	vec3 _726 = pf - vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
	float _727 = dot(grad001, _726);
	float n001 = _727;
	vec2 _731 = pi.xy + vec2(0.00000000e+00, 3.90625000e-03);
	vec2 _732;
	float _733;
	_732 = _731;
	_733 = t;
	vec4 _734 = F_xpd80_filmgrain_xrnm(_732, _733);
	float perm01 = _734.y;
	vec2 _738 = vec2(perm01, pi.z);
	vec4 _739 = texture(V_xpd80_filmgrain_xsamplerPermTex, _738);
	vec3 _742 = _739.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _744 = _742 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad010 = _744;
	vec3 _747 = pf - vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00);
	float _748 = dot(grad010, _747);
	float n010 = _748;
	float _752 = pi.z + 3.90625000e-03;
	vec2 _753 = vec2(perm01, _752);
	vec4 _754 = texture(V_xpd80_filmgrain_xsamplerPermTex, _753);
	vec3 _757 = _754.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _759 = _757 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad011 = _759;
	vec3 _762 = pf - vec3(0.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	float _763 = dot(grad011, _762);
	float n011 = _763;
	vec2 _767 = pi.xy + vec2(3.90625000e-03, 0.00000000e+00);
	vec2 _768;
	float _769;
	_768 = _767;
	_769 = t;
	vec4 _770 = F_xpd80_filmgrain_xrnm(_768, _769);
	float perm10 = _770.z;
	vec2 _774 = vec2(perm10, pi.z);
	vec4 _775 = texture(V_xpd80_filmgrain_xsamplerPermTex, _774);
	vec3 _778 = _775.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _780 = _778 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad100 = _780;
	vec3 _783 = pf - vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _784 = dot(grad100, _783);
	float n100 = _784;
	float _788 = pi.z + 3.90625000e-03;
	vec2 _789 = vec2(perm10, _788);
	vec4 _790 = texture(V_xpd80_filmgrain_xsamplerPermTex, _789);
	vec3 _793 = _790.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _795 = _793 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad101 = _795;
	vec3 _798 = pf - vec3(1.00000000e+00, 0.00000000e+00, 1.00000000e+00);
	float _799 = dot(grad101, _798);
	float n101 = _799;
	vec2 _803 = pi.xy + vec2(3.90625000e-03, 3.90625000e-03);
	vec2 _804;
	float _805;
	_804 = _803;
	_805 = t;
	vec4 _806 = F_xpd80_filmgrain_xrnm(_804, _805);
	float perm11 = _806.w;
	vec2 _810 = vec2(perm11, pi.z);
	vec4 _811 = texture(V_xpd80_filmgrain_xsamplerPermTex, _810);
	vec3 _814 = _811.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _816 = _814 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad110 = _816;
	vec3 _819 = pf - vec3(1.00000000e+00, 1.00000000e+00, 0.00000000e+00);
	float _820 = dot(grad110, _819);
	float n110 = _820;
	float _824 = pi.z + 3.90625000e-03;
	vec2 _825 = vec2(perm11, _824);
	vec4 _826 = texture(V_xpd80_filmgrain_xsamplerPermTex, _825);
	vec3 _829 = _826.xyz * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec3 _831 = _829 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 grad111 = _831;
	vec3 _834 = pf - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	float _835 = dot(grad111, _834);
	float n111 = _835;
	vec4 _837 = vec4(n000, n001, n010, n011);
	vec4 _838 = vec4(n100, n101, n110, n111);
	float _839;
	_839 = pf.x;
	float _841 = F_xpd80_filmgrain_xfade(_839);
	vec4 _843 = mix(_837, _838, vec4(_841));
	vec4 n_x = _843;
	float _845;
	_845 = pf.y;
	float _847 = F_xpd80_filmgrain_xfade(_845);
	vec2 _851 = mix(n_x.xy, n_x.zw, vec2(_847));
	vec2 n_xy = _851;
	float _853;
	_853 = pf.z;
	float _855 = F_xpd80_filmgrain_xfade(_853);
	float _858 = mix(n_xy.x, n_xy.y, _855);
	float n_xyz = _858;
	return n_xyz;
}
float F_xpd80_filmgrain_xgetAvgColor(
	in vec3 col)
{
	float _865 = dot(col.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	return _865;
}
vec3 F_xpd80_filmgrain_xClipColor(
	in vec3 color)
{
	vec3 _869;
	_869 = color.xyz;
	float _871 = F_xpd80_filmgrain_xgetAvgColor(_869);
	float lum = _871;
	float _875 = min(color.x, color.y);
	float _877 = min(_875, color.z);
	float mincol = _877;
	float _881 = max(color.x, color.y);
	float _883 = max(_881, color.z);
	float maxcol = _883;
	bool _886 = mincol < 0.00000000e+00;
	vec3 _889 = color.xyz - vec3(lum);
	vec3 _891 = _889 * vec3(lum);
	float _892 = lum - mincol;
	vec3 _894 = _891 / vec3(_892);
	vec3 _896 = vec3(lum) + _894;
	vec3 _899 = compCond(bvec3(_886), _896, color.xyz);
	color.xyz = _899;
	bool _901 = maxcol > 1.00000000e+00;
	vec3 _904 = color.xyz - vec3(lum);
	float _906 = 1.00000000e+00 - lum;
	vec3 _908 = _904 * vec3(_906);
	float _909 = maxcol - lum;
	vec3 _911 = _908 / vec3(_909);
	vec3 _913 = vec3(lum) + _911;
	vec3 _916 = compCond(bvec3(_901), _913, color.xyz);
	color.xyz = _916;
	return color;
}
vec3 F_xpd80_filmgrain_xblendLuma(
	in vec3 base,
	in vec3 blend)
{
	vec3 _921;
	_921 = base.xyz;
	float _923 = F_xpd80_filmgrain_xgetAvgColor(_921);
	float lumbase = _923;
	vec3 _925;
	_925 = blend.xyz;
	float _927 = F_xpd80_filmgrain_xgetAvgColor(_925);
	float lumblend = _927;
	float _929 = lumblend - lumbase;
	float ldiff = _929;
	vec3 _933 = base.xyz + vec3(ldiff);
	vec3 col_934 = _933;
	vec3 _935;
	_935 = col_934.xyz;
	vec3 _937 = F_xpd80_filmgrain_xClipColor(_935);
	return _937;
}
vec4 F_xpd80_filmgrain_xPS_FilmGrain(
	in vec4 pos,
	in vec2 texcoord)
{
	float timer = 1.00000000e+00;
	if (bool(V_xpd80_filmgrain_xgrainMotion))
	{
		float _949 = fmodHLSL(V_xpd80_filmgrain_xTimer, 1.00000000e+03);
		timer = _949;
	}
	vec2 _952 = texcoord.xy * vec2(1.92000000e+03, 1.08000000e+03);
	vec2 uv = _952;
	vec3 _957 = vec3(uv.xy.x, uv.xy.y, 1.00000000e+00);
	vec3 _958;
	float _959;
	_958 = _957;
	_959 = timer;
	float _960 = F_xpd80_filmgrain_xpnoise3D(_958, _959);
	vec3 noise_962 = vec3(_960);
	vec3 _966 = vec3(uv.xy.x, uv.xy.y, 2.00000000e+00);
	vec3 _967;
	float _968;
	_967 = _966;
	_968 = timer;
	float _969 = F_xpd80_filmgrain_xpnoise3D(_967, _968);
	noise_962[1] = _969;
	vec3 _973 = vec3(uv.xy.x, uv.xy.y, 3.00000000e+00);
	vec3 _974;
	float _975;
	_974 = _973;
	_975 = timer;
	float _976 = F_xpd80_filmgrain_xpnoise3D(_974, _975);
	noise_962[2] = _976;
	vec3 _979 = noise_962.xyz * vec3(V_xpd80_filmgrain_xgrainIntensity);
	noise_962.xyz = _979;
	vec3 _983 = mix(noise_962.xxx, noise_962.xyz, vec3(V_xpd80_filmgrain_xgrainColor));
	noise_962.xyz = _983;
	vec3 _985 = abs(noise_962.xyz);
	float _987 = 1.10000000e+01 - V_xpd80_filmgrain_xgrainDensity;
	float _989 = max(_987, 1.00000001e-01);
	vec3 _991 = pow(_985, vec3(_989));
	vec3 _993 = sign(noise_962.xyz);
	vec3 _994 = _991 * _993;
	noise_962.xyz = _994;
	vec3 _997 = noise_962.xyz + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _999 = _997 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _1000 = clamp(_999, 0.0, 1.0);
	noise_962.xyz = _1000;
	vec4 _1005 = vec4(noise_962.xyz.x, noise_962.xyz.y, noise_962.xyz.z, 1.00000000e+00);
	return _1005;
}
vec4 F_xpd80_filmgrain_xPS_MergeNoise(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1010 = texture(V_xpd80_filmgrain_xsamplerNoise, texcoord);
	vec4 noise_1011 = _1010;
	vec4 _1012 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_1013 = _1012;
	vec3 _1016 = noise_1011.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _1018 = _1016 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	noise_1011.xyz = _1018;
	vec2 _1019;
	_1019 = texcoord;
	float _1020 = F_xReShade_xGetLinearizedDepth(_1019);
	float depth_1021 = _1020;
	float _1022 = smoothstep(V_xpd80_filmgrain_xdepthStart, V_xpd80_filmgrain_xdepthEnd, depth_1021);
	depth_1021 = _1022;
	float _1023 = pow(depth_1021, V_xpd80_filmgrain_xdepthCurve);
	depth_1021 = _1023;
	float _1025 = V_xpd80_filmgrain_xenable_depth ? depth_1021 : 1.00000000e+00;
	float d_1026 = _1025;
	bool _1029 = texcoord.y < 2.50000000e-01;
	bool _1032 = texcoord.y < 5.00000000e-01;
	vec3 _1036 = vec3(texcoord.x, 0.00000000e+00, 0.00000000e+00);
	bool _1039 = texcoord.y < 7.50000000e-01;
	vec3 _1043 = vec3(0.00000000e+00, texcoord.x, 0.00000000e+00);
	vec3 _1047 = vec3(0.00000000e+00, 0.00000000e+00, texcoord.x);
	vec3 _1049 = compCond(bvec3(_1039), _1043, _1047);
	vec3 _1051 = compCond(bvec3(_1032), _1036, _1049);
	vec3 _1054 = compCond(bvec3(_1029), texcoord.xxx, _1051);
	vec3 testenv = _1054;
	vec3 _1059 = compCond(bvec3(V_xpd80_filmgrain_xenable_test), testenv.xyz, color_1013.xyz);
	color_1013.xyz = _1059;
	vec3 _1060;
	_1060 = color_1013.xyz;
	vec3 _1062 = F_xRGBToHSV(_1060);
	vec3 origHSV = _1062;
	vec3 orig = color_1013.xyz;
	float _1068 = max(color_1013.x, color_1013.y);
	float _1070 = max(_1068, color_1013.z);
	float maxc = _1070;
	float _1074 = min(color_1013.x, color_1013.y);
	float _1076 = min(_1074, color_1013.z);
	float minc = _1076;
	float lum_1078 = maxc;
	vec3 _1081 = noise_1011.xyz * vec3(V_xpd80_filmgrain_xgrainIntLow);
	vec3 _1084 = noise_1011.xyz * vec3(V_xpd80_filmgrain_xgrainIntHigh);
	float _1085;
	_1085 = lum_1078;
	float _1086 = F_xpd80_filmgrain_xfade(_1085);
	vec3 _1088 = mix(_1081, _1084, vec3(_1086));
	noise_1011.xyz = _1088;
	vec3 _1090 = abs(noise_1011.xyz);
	vec3 _1091 = -(_1090);
	vec3 negnoise = _1091;
	float _1093 = lum_1078 * lum_1078;
	lum_1078 = _1093;
	vec3 _1096 = negnoise.zxy * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _1099 = mix(noise_1011.xyz, _1096, vec3(lum_1078));
	negnoise.xyz = _1099;
	vec3 _1103 = compCond(bvec3(V_xpd80_filmgrain_xuse_negnoise), negnoise.xyz, noise_1011.xyz);
	noise_1011.xyz = _1103;
	float factor = 1.20000005e+00;
	float _1108 = origHSV.x - 1.66666999e-01;
	float _1110 = _1108 * 6.00000000e+00;
	float _1111 = abs(_1110);
	float _1113 = 1.00000000e+00 - _1111;
	float _1115 = max(_1113, 0.00000000e+00);
	float _1116 = _1115 * factor;
	float weight = _1116;
	float _1120 = origHSV.x - 3.33332986e-01;
	float _1122 = _1120 * 6.00000000e+00;
	float _1123 = abs(_1122);
	float _1125 = 1.00000000e+00 - _1123;
	float _1127 = max(_1125, 0.00000000e+00);
	float _1128 = _1127 / factor;
	float _1129 = weight + _1128;
	weight = _1129;
	float _1130 = weight / factor;
	float _1131;
	_1131 = _1130;
	float _1132 = F_xpd80_filmgrain_xcurve(_1131);
	float _1133 = clamp(_1132, 0.0, 1.0);
	weight = _1133;
	float _1135 = maxc + 1.00000001e-10;
	float _1136 = _1135 - minc;
	float _1137 = _1136 / maxc;
	float _1139 = _1137 + 1.00000001e-10;
	float _1140 = clamp(_1139, 0.0, 1.0);
	float _1141 = weight * _1140;
	weight = _1141;
	float _1143 = maxc - 2.00000003e-01;
	float _1145 = _1143 * 1.25000000e+00;
	float _1146 = clamp(_1145, 0.0, 1.0);
	float _1148 = maxc * 5.00000000e+00;
	float _1150 = 1.00000000e+00 - _1148;
	float _1151 = clamp(_1150, 0.0, 1.0);
	float _1152 = _1146 + _1151;
	float adj = _1152;
	float _1154;
	_1154 = adj;
	float _1155 = F_xpd80_filmgrain_xcurve(_1154);
	float _1157 = 1.00000000e+00 - _1155;
	adj = _1157;
	float _1158 = weight * adj;
	weight = _1158;
	float _1160 = float(V_xpd80_filmgrain_xgrainOrigColor) * weight;
	float _1163 = mix(1.00000000e+00, 5.00000000e-01, _1160);
	float adjNoise = _1163;
	vec3 _1167 = noise_1011.xyz * vec3(d_1026);
	vec3 _1169 = color_1013.xyz + _1167;
	float _1170 = V_xpd80_filmgrain_xgrainAmount * adjNoise;
	vec3 _1173 = mix(color_1013.xyz, _1169, vec3(_1170));
	color_1013.xyz = _1173;
	vec3 _1175 = clamp(color_1013.xyz, 0.0, 1.0);
	color_1013.xyz = _1175;
	vec3 _1176;
	vec3 _1177;
	_1176 = orig.xyz;
	_1177 = color_1013.xyz;
	vec3 _1180 = F_xpd80_filmgrain_xblendLuma(_1176, _1177);
	vec3 col_1181 = _1180;
	vec3 _1185 = compCond(bvec3(ivec3(V_xpd80_filmgrain_xgrainOrigColor)), col_1181.xyz, color_1013.xyz);
	color_1013.xyz = _1185;
	vec3 _1189 = compCond(bvec3(V_xpd80_filmgrain_xdisplay_depth), vec3(depth_1021), color_1013.xyz);
	color_1013.xyz = _1189;
	vec4 _1194 = vec4(color_1013.xyz.x, color_1013.xyz.y, color_1013.xyz.z, 1.00000000e+00);
	return _1194;
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
#ifdef E_xpd80_filmgrain_xPS_FilmGrain
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_filmgrain_xPS_FilmGrain(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_filmgrain_xPS_MergeNoise
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_filmgrain_xPS_MergeNoise(pos, texcoord);
	return;
}
#endif
