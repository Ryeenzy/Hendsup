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
uniform float V_xpd80_satlimit_xsaturation_limit;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
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
vec4 F_xpd80_satlimit_xPS_Satlimit(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _586 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color_588 = _586.xyz;
	vec3 _589;
	_589 = color_588.xyz;
	vec3 _591 = F_xRGBToHSL(_589);
	color_588.xyz = _591;
	float _593 = min(color_588.y, V_xpd80_satlimit_xsaturation_limit);
	color_588[1] = _593;
	vec3 _594;
	_594 = color_588.xyz;
	vec3 _596 = F_xHSLToRGB(_594);
	color_588.xyz = _596;
	vec4 _601 = vec4(color_588.xyz.x, color_588.xyz.y, color_588.xyz.z, 1.00000000e+00);
	return _601;
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
#ifdef E_xpd80_satlimit_xPS_Satlimit
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_satlimit_xPS_Satlimit(pos, texcoord);
	return;
}
#endif
