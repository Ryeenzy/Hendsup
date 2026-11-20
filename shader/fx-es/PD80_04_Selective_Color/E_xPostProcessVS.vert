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
uniform int V_xpd80_selectivecolor_xcorr_method;
uniform int V_xpd80_selectivecolor_xcorr_method2;
uniform float V_xpd80_selectivecolor_xr_adj_cya;
uniform float V_xpd80_selectivecolor_xr_adj_mag;
uniform float V_xpd80_selectivecolor_xr_adj_yel;
uniform float V_xpd80_selectivecolor_xr_adj_bla;
uniform float V_xpd80_selectivecolor_xr_adj_sat;
uniform float V_xpd80_selectivecolor_xr_adj_vib;
uniform float V_xpd80_selectivecolor_xy_adj_cya;
uniform float V_xpd80_selectivecolor_xy_adj_mag;
uniform float V_xpd80_selectivecolor_xy_adj_yel;
uniform float V_xpd80_selectivecolor_xy_adj_bla;
uniform float V_xpd80_selectivecolor_xy_adj_sat;
uniform float V_xpd80_selectivecolor_xy_adj_vib;
uniform float V_xpd80_selectivecolor_xg_adj_cya;
uniform float V_xpd80_selectivecolor_xg_adj_mag;
uniform float V_xpd80_selectivecolor_xg_adj_yel;
uniform float V_xpd80_selectivecolor_xg_adj_bla;
uniform float V_xpd80_selectivecolor_xg_adj_sat;
uniform float V_xpd80_selectivecolor_xg_adj_vib;
uniform float V_xpd80_selectivecolor_xc_adj_cya;
uniform float V_xpd80_selectivecolor_xc_adj_mag;
uniform float V_xpd80_selectivecolor_xc_adj_yel;
uniform float V_xpd80_selectivecolor_xc_adj_bla;
uniform float V_xpd80_selectivecolor_xc_adj_sat;
uniform float V_xpd80_selectivecolor_xc_adj_vib;
uniform float V_xpd80_selectivecolor_xb_adj_cya;
uniform float V_xpd80_selectivecolor_xb_adj_mag;
uniform float V_xpd80_selectivecolor_xb_adj_yel;
uniform float V_xpd80_selectivecolor_xb_adj_bla;
uniform float V_xpd80_selectivecolor_xb_adj_sat;
uniform float V_xpd80_selectivecolor_xb_adj_vib;
uniform float V_xpd80_selectivecolor_xm_adj_cya;
uniform float V_xpd80_selectivecolor_xm_adj_mag;
uniform float V_xpd80_selectivecolor_xm_adj_yel;
uniform float V_xpd80_selectivecolor_xm_adj_bla;
uniform float V_xpd80_selectivecolor_xm_adj_sat;
uniform float V_xpd80_selectivecolor_xm_adj_vib;
uniform float V_xpd80_selectivecolor_xw_adj_cya;
uniform float V_xpd80_selectivecolor_xw_adj_mag;
uniform float V_xpd80_selectivecolor_xw_adj_yel;
uniform float V_xpd80_selectivecolor_xw_adj_bla;
uniform float V_xpd80_selectivecolor_xw_adj_sat;
uniform float V_xpd80_selectivecolor_xw_adj_vib;
uniform float V_xpd80_selectivecolor_xn_adj_cya;
uniform float V_xpd80_selectivecolor_xn_adj_mag;
uniform float V_xpd80_selectivecolor_xn_adj_yel;
uniform float V_xpd80_selectivecolor_xn_adj_bla;
uniform float V_xpd80_selectivecolor_xn_adj_sat;
uniform float V_xpd80_selectivecolor_xn_adj_vib;
uniform float V_xpd80_selectivecolor_xbk_adj_cya;
uniform float V_xpd80_selectivecolor_xbk_adj_mag;
uniform float V_xpd80_selectivecolor_xbk_adj_yel;
uniform float V_xpd80_selectivecolor_xbk_adj_bla;
uniform float V_xpd80_selectivecolor_xbk_adj_sat;
uniform float V_xpd80_selectivecolor_xbk_adj_vib;

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
vec3 F_xsl(
	in vec3 c,
	in vec3 b)
{
	bvec3 _66 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _68 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _69 = _68 * b;
	vec3 _70 = c * c;
	vec3 _72 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _74 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _72;
	vec3 _75 = _70 * _74;
	vec3 _76 = _69 + _75;
	vec3 _77 = sqrt(c);
	vec3 _79 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _81 = _79 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _82 = _77 * _81;
	vec3 _84 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _86 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _87 = _84 * _86;
	vec3 _88 = _82 + _87;
	vec3 _89 = compCond(_66, _76, _88);
	return _89;
}
float F_xgetLum(
	in vec3 x)
{
	float _94 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _94;
}
vec3 F_xexposure(
	in vec3 res,
	in float x)
{
	bool _100 = x < 0.00000000e+00;
	float _102 = x * 3.33000004e-01;
	float _103 = _100 ? _102 : x;
	x = _103;
	vec3 _106 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _108 = vec3(x) * _106;
	vec3 _110 = _108 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _112 = res.xyz * _110;
	vec3 _113 = clamp(_112, 0.0, 1.0);
	return _113;
}
vec3 F_xcon(
	in vec3 res,
	in float x)
{
	vec3 _118;
	vec3 _119;
	_118 = res.xyz;
	_119 = res.xyz;
	vec3 _122 = F_xsl(_118, _119);
	vec3 c_123 = _122;
	bool _125 = x < 0.00000000e+00;
	float _127 = x * 5.00000000e-01;
	float _128 = _125 ? _127 : x;
	x = _128;
	vec3 _132 = mix(res.xyz, c_123.xyz, vec3(x));
	vec3 _133 = clamp(_132, 0.0, 1.0);
	return _133;
}
vec3 F_xbri(
	in vec3 res,
	in float x)
{
	vec3 _140 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _143 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _144 = _140 * _143;
	vec3 _146 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _144;
	vec3 c_147 = _146;
	bool _149 = x < 0.00000000e+00;
	float _151 = x * 5.00000000e-01;
	float _152 = _149 ? _151 : x;
	x = _152;
	vec3 _156 = mix(res.xyz, c_147.xyz, vec3(x));
	vec3 _157 = clamp(_156, 0.0, 1.0);
	return _157;
}
vec3 F_xsat(
	in vec3 res,
	in float x)
{
	vec3 _162;
	_162 = res.xyz;
	float _164 = F_xgetLum(_162);
	float _166 = x + 1.00000000e+00;
	vec3 _170 = mix(vec3(_164), res.xyz, vec3(_166));
	vec3 _171 = clamp(_170, 0.0, 1.0);
	return _171;
}
vec3 F_xvib(
	in vec3 res,
	in float x)
{
	vec4 sat = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _180 = min(res.x, res.y);
	float _182 = min(_180, res.z);
	float _185 = max(res.x, res.y);
	float _187 = max(_185, res.z);
	vec2 _188 = vec2(_182, _187);
	sat.xy = _188;
	float _191 = sat.y - sat.x;
	sat[2] = _191;
	vec3 _192;
	_192 = res.xyz;
	float _194 = F_xgetLum(_192);
	sat[3] = _194;
	float _197 = 1.00000000e+00 - sat.z;
	float _198 = x * _197;
	float _200 = 1.00000000e+00 + _198;
	vec3 _204 = mix(vec3(sat.w), res.xyz, vec3(_200));
	vec3 _205 = clamp(_204, 0.0, 1.0);
	return _205;
}
float F_xpd80_selectivecolor_xmid(
	in vec3 c)
{
	float _267 = c.x + c.y;
	float _269 = _267 + c.z;
	float sum = _269;
	float _273 = min(c.x, c.y);
	float _275 = min(_273, c.z);
	float mn = _275;
	float _279 = max(c.x, c.y);
	float _281 = max(_279, c.z);
	float mx = _281;
	float _283 = sum - mn;
	float _284 = _283 - mx;
	return _284;
}
float F_xpd80_selectivecolor_xadjustcolor(
	in float scale,
	in float colorvalue,
	in float adjust,
	in float bk,
	in int method)
{
	float _293 = -1.00000000e+00 - adjust;
	float _294 = _293 * bk;
	float _295 = _294 - adjust;
	float _297 = colorvalue * float(method);
	float _299 = 1.00000000e+00 - _297;
	float _300 = _295 * _299;
	float _301 = -(colorvalue);
	float _303 = 1.00000000e+00 - colorvalue;
	float _304 = clamp(_300, _301, _303);
	float _305 = _304 * scale;
	return _305;
}
vec4 F_xpd80_selectivecolor_xPS_SelectiveColor(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _310 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _310;
	vec3 _313 = clamp(color.xyz, 0.0, 1.0);
	color.xyz = _313;
	float _316 = min(color.x, color.y);
	float _318 = min(_316, color.z);
	float min_value = _318;
	float _322 = max(color.x, color.y);
	float _324 = max(_322, color.z);
	float max_value = _324;
	vec3 _326;
	_326 = color.xyz;
	float _328 = F_xpd80_selectivecolor_xmid(_326);
	float mid_value = _328;
	vec3 orig = color.xyz;
	float _332 = max_value - mid_value;
	float sRGB = _332;
	float _334 = mid_value - min_value;
	float sCMY = _334;
	float _337 = max_value - 5.00000000e-01;
	float _338 = abs(_337);
	float _340 = min_value - 5.00000000e-01;
	float _341 = abs(_340);
	float _342 = _338 + _341;
	float _344 = 1.00000000e+00 - _342;
	float sNeutrals = _344;
	float _347 = min_value - 5.00000000e-01;
	float _349 = _347 * 2.00000000e+00;
	float sWhites = _349;
	float _352 = 5.00000000e-01 - max_value;
	float _354 = _352 * 2.00000000e+00;
	float sBlacks = _354;
	float _358 = orig.x - orig.z;
	float r_d_m = _358;
	float _362 = orig.x - orig.y;
	float r_d_y = _362;
	float _365 = mid_value - orig.z;
	float y_d = _365;
	float _369 = orig.y - orig.x;
	float g_d_y = _369;
	float _373 = orig.y - orig.z;
	float g_d_c = _373;
	float _376 = mid_value - orig.x;
	float c_d = _376;
	float _380 = orig.z - orig.y;
	float b_d_c = _380;
	float _384 = orig.z - orig.x;
	float b_d_m = _384;
	float _387 = mid_value - orig.y;
	float m_d = _387;
	float r_delta = 1.00000000e+00;
	float y_delta = 1.00000000e+00;
	float g_delta = 1.00000000e+00;
	float c_delta = 1.00000000e+00;
	float b_delta = 1.00000000e+00;
	float m_delta = 1.00000000e+00;
	if (bool(V_xpd80_selectivecolor_xcorr_method2))
	{
		float _405 = min(r_d_m, r_d_y);
		r_delta = _405;
		y_delta = y_d;
		float _406 = min(g_d_y, g_d_c);
		g_delta = _406;
		c_delta = c_d;
		float _407 = min(b_d_c, b_d_m);
		b_delta = _407;
		m_delta = m_d;
	}
	bool _412 = max_value == orig.x;
	if (_412)
	{
		float _413;
		float _414;
		float _415;
		float _416;
		int _417;
		_413 = sRGB;
		_414 = color.x;
		_415 = V_xpd80_selectivecolor_xr_adj_cya;
		_416 = V_xpd80_selectivecolor_xr_adj_bla;
		_417 = V_xpd80_selectivecolor_xcorr_method;
		float _419 = F_xpd80_selectivecolor_xadjustcolor(_413, _414, _415, _416, _417);
		float _421 = color.x + _419;
		color[0] = _421;
		float _422;
		float _423;
		float _424;
		float _425;
		int _426;
		_422 = sRGB;
		_423 = color.y;
		_424 = V_xpd80_selectivecolor_xr_adj_mag;
		_425 = V_xpd80_selectivecolor_xr_adj_bla;
		_426 = V_xpd80_selectivecolor_xcorr_method;
		float _428 = F_xpd80_selectivecolor_xadjustcolor(_422, _423, _424, _425, _426);
		float _430 = color.y + _428;
		color[1] = _430;
		float _431;
		float _432;
		float _433;
		float _434;
		int _435;
		_431 = sRGB;
		_432 = color.z;
		_433 = V_xpd80_selectivecolor_xr_adj_yel;
		_434 = V_xpd80_selectivecolor_xr_adj_bla;
		_435 = V_xpd80_selectivecolor_xcorr_method;
		float _437 = F_xpd80_selectivecolor_xadjustcolor(_431, _432, _433, _434, _435);
		float _439 = color.z + _437;
		color[2] = _439;
		float _440 = V_xpd80_selectivecolor_xr_adj_sat * r_delta;
		vec3 _441;
		float _442;
		_441 = color.xyz;
		_442 = _440;
		vec3 _444 = F_xsat(_441, _442);
		color.xyz = _444;
		float _445 = V_xpd80_selectivecolor_xr_adj_vib * r_delta;
		vec3 _446;
		float _447;
		_446 = color.xyz;
		_447 = _445;
		vec3 _449 = F_xvib(_446, _447);
		color.xyz = _449;
	}
	bool _454 = min_value == orig.z;
	if (_454)
	{
		float _455;
		float _456;
		float _457;
		float _458;
		int _459;
		_455 = sCMY;
		_456 = color.x;
		_457 = V_xpd80_selectivecolor_xy_adj_cya;
		_458 = V_xpd80_selectivecolor_xy_adj_bla;
		_459 = V_xpd80_selectivecolor_xcorr_method;
		float _461 = F_xpd80_selectivecolor_xadjustcolor(_455, _456, _457, _458, _459);
		float _463 = color.x + _461;
		color[0] = _463;
		float _464;
		float _465;
		float _466;
		float _467;
		int _468;
		_464 = sCMY;
		_465 = color.y;
		_466 = V_xpd80_selectivecolor_xy_adj_mag;
		_467 = V_xpd80_selectivecolor_xy_adj_bla;
		_468 = V_xpd80_selectivecolor_xcorr_method;
		float _470 = F_xpd80_selectivecolor_xadjustcolor(_464, _465, _466, _467, _468);
		float _472 = color.y + _470;
		color[1] = _472;
		float _473;
		float _474;
		float _475;
		float _476;
		int _477;
		_473 = sCMY;
		_474 = color.z;
		_475 = V_xpd80_selectivecolor_xy_adj_yel;
		_476 = V_xpd80_selectivecolor_xy_adj_bla;
		_477 = V_xpd80_selectivecolor_xcorr_method;
		float _479 = F_xpd80_selectivecolor_xadjustcolor(_473, _474, _475, _476, _477);
		float _481 = color.z + _479;
		color[2] = _481;
		float _482 = V_xpd80_selectivecolor_xy_adj_sat * y_delta;
		vec3 _483;
		float _484;
		_483 = color.xyz;
		_484 = _482;
		vec3 _486 = F_xsat(_483, _484);
		color.xyz = _486;
		float _487 = V_xpd80_selectivecolor_xy_adj_vib * y_delta;
		vec3 _488;
		float _489;
		_488 = color.xyz;
		_489 = _487;
		vec3 _491 = F_xvib(_488, _489);
		color.xyz = _491;
	}
	bool _496 = max_value == orig.y;
	if (_496)
	{
		float _497;
		float _498;
		float _499;
		float _500;
		int _501;
		_497 = sRGB;
		_498 = color.x;
		_499 = V_xpd80_selectivecolor_xg_adj_cya;
		_500 = V_xpd80_selectivecolor_xg_adj_bla;
		_501 = V_xpd80_selectivecolor_xcorr_method;
		float _503 = F_xpd80_selectivecolor_xadjustcolor(_497, _498, _499, _500, _501);
		float _505 = color.x + _503;
		color[0] = _505;
		float _506;
		float _507;
		float _508;
		float _509;
		int _510;
		_506 = sRGB;
		_507 = color.y;
		_508 = V_xpd80_selectivecolor_xg_adj_mag;
		_509 = V_xpd80_selectivecolor_xg_adj_bla;
		_510 = V_xpd80_selectivecolor_xcorr_method;
		float _512 = F_xpd80_selectivecolor_xadjustcolor(_506, _507, _508, _509, _510);
		float _514 = color.y + _512;
		color[1] = _514;
		float _515;
		float _516;
		float _517;
		float _518;
		int _519;
		_515 = sRGB;
		_516 = color.z;
		_517 = V_xpd80_selectivecolor_xg_adj_yel;
		_518 = V_xpd80_selectivecolor_xg_adj_bla;
		_519 = V_xpd80_selectivecolor_xcorr_method;
		float _521 = F_xpd80_selectivecolor_xadjustcolor(_515, _516, _517, _518, _519);
		float _523 = color.z + _521;
		color[2] = _523;
		float _524 = V_xpd80_selectivecolor_xg_adj_sat * g_delta;
		vec3 _525;
		float _526;
		_525 = color.xyz;
		_526 = _524;
		vec3 _528 = F_xsat(_525, _526);
		color.xyz = _528;
		float _529 = V_xpd80_selectivecolor_xg_adj_vib * g_delta;
		vec3 _530;
		float _531;
		_530 = color.xyz;
		_531 = _529;
		vec3 _533 = F_xvib(_530, _531);
		color.xyz = _533;
	}
	bool _538 = min_value == orig.x;
	if (_538)
	{
		float _539;
		float _540;
		float _541;
		float _542;
		int _543;
		_539 = sCMY;
		_540 = color.x;
		_541 = V_xpd80_selectivecolor_xc_adj_cya;
		_542 = V_xpd80_selectivecolor_xc_adj_bla;
		_543 = V_xpd80_selectivecolor_xcorr_method;
		float _545 = F_xpd80_selectivecolor_xadjustcolor(_539, _540, _541, _542, _543);
		float _547 = color.x + _545;
		color[0] = _547;
		float _548;
		float _549;
		float _550;
		float _551;
		int _552;
		_548 = sCMY;
		_549 = color.y;
		_550 = V_xpd80_selectivecolor_xc_adj_mag;
		_551 = V_xpd80_selectivecolor_xc_adj_bla;
		_552 = V_xpd80_selectivecolor_xcorr_method;
		float _554 = F_xpd80_selectivecolor_xadjustcolor(_548, _549, _550, _551, _552);
		float _556 = color.y + _554;
		color[1] = _556;
		float _557;
		float _558;
		float _559;
		float _560;
		int _561;
		_557 = sCMY;
		_558 = color.z;
		_559 = V_xpd80_selectivecolor_xc_adj_yel;
		_560 = V_xpd80_selectivecolor_xc_adj_bla;
		_561 = V_xpd80_selectivecolor_xcorr_method;
		float _563 = F_xpd80_selectivecolor_xadjustcolor(_557, _558, _559, _560, _561);
		float _565 = color.z + _563;
		color[2] = _565;
		float _566 = V_xpd80_selectivecolor_xc_adj_sat * c_delta;
		vec3 _567;
		float _568;
		_567 = color.xyz;
		_568 = _566;
		vec3 _570 = F_xsat(_567, _568);
		color.xyz = _570;
		float _571 = V_xpd80_selectivecolor_xc_adj_vib * c_delta;
		vec3 _572;
		float _573;
		_572 = color.xyz;
		_573 = _571;
		vec3 _575 = F_xvib(_572, _573);
		color.xyz = _575;
	}
	bool _580 = max_value == orig.z;
	if (_580)
	{
		float _581;
		float _582;
		float _583;
		float _584;
		int _585;
		_581 = sRGB;
		_582 = color.x;
		_583 = V_xpd80_selectivecolor_xb_adj_cya;
		_584 = V_xpd80_selectivecolor_xb_adj_bla;
		_585 = V_xpd80_selectivecolor_xcorr_method;
		float _587 = F_xpd80_selectivecolor_xadjustcolor(_581, _582, _583, _584, _585);
		float _589 = color.x + _587;
		color[0] = _589;
		float _590;
		float _591;
		float _592;
		float _593;
		int _594;
		_590 = sRGB;
		_591 = color.y;
		_592 = V_xpd80_selectivecolor_xb_adj_mag;
		_593 = V_xpd80_selectivecolor_xb_adj_bla;
		_594 = V_xpd80_selectivecolor_xcorr_method;
		float _596 = F_xpd80_selectivecolor_xadjustcolor(_590, _591, _592, _593, _594);
		float _598 = color.y + _596;
		color[1] = _598;
		float _599;
		float _600;
		float _601;
		float _602;
		int _603;
		_599 = sRGB;
		_600 = color.z;
		_601 = V_xpd80_selectivecolor_xb_adj_yel;
		_602 = V_xpd80_selectivecolor_xb_adj_bla;
		_603 = V_xpd80_selectivecolor_xcorr_method;
		float _605 = F_xpd80_selectivecolor_xadjustcolor(_599, _600, _601, _602, _603);
		float _607 = color.z + _605;
		color[2] = _607;
		float _608 = V_xpd80_selectivecolor_xb_adj_sat * b_delta;
		vec3 _609;
		float _610;
		_609 = color.xyz;
		_610 = _608;
		vec3 _612 = F_xsat(_609, _610);
		color.xyz = _612;
		float _613 = V_xpd80_selectivecolor_xb_adj_vib * b_delta;
		vec3 _614;
		float _615;
		_614 = color.xyz;
		_615 = _613;
		vec3 _617 = F_xvib(_614, _615);
		color.xyz = _617;
	}
	bool _622 = min_value == orig.y;
	if (_622)
	{
		float _623;
		float _624;
		float _625;
		float _626;
		int _627;
		_623 = sCMY;
		_624 = color.x;
		_625 = V_xpd80_selectivecolor_xm_adj_cya;
		_626 = V_xpd80_selectivecolor_xm_adj_bla;
		_627 = V_xpd80_selectivecolor_xcorr_method;
		float _629 = F_xpd80_selectivecolor_xadjustcolor(_623, _624, _625, _626, _627);
		float _631 = color.x + _629;
		color[0] = _631;
		float _632;
		float _633;
		float _634;
		float _635;
		int _636;
		_632 = sCMY;
		_633 = color.y;
		_634 = V_xpd80_selectivecolor_xm_adj_mag;
		_635 = V_xpd80_selectivecolor_xm_adj_bla;
		_636 = V_xpd80_selectivecolor_xcorr_method;
		float _638 = F_xpd80_selectivecolor_xadjustcolor(_632, _633, _634, _635, _636);
		float _640 = color.y + _638;
		color[1] = _640;
		float _641;
		float _642;
		float _643;
		float _644;
		int _645;
		_641 = sCMY;
		_642 = color.z;
		_643 = V_xpd80_selectivecolor_xm_adj_yel;
		_644 = V_xpd80_selectivecolor_xm_adj_bla;
		_645 = V_xpd80_selectivecolor_xcorr_method;
		float _647 = F_xpd80_selectivecolor_xadjustcolor(_641, _642, _643, _644, _645);
		float _649 = color.z + _647;
		color[2] = _649;
		float _650 = V_xpd80_selectivecolor_xm_adj_sat * m_delta;
		vec3 _651;
		float _652;
		_651 = color.xyz;
		_652 = _650;
		vec3 _654 = F_xsat(_651, _652);
		color.xyz = _654;
		float _655 = V_xpd80_selectivecolor_xm_adj_vib * m_delta;
		vec3 _656;
		float _657;
		_656 = color.xyz;
		_657 = _655;
		vec3 _659 = F_xvib(_656, _657);
		color.xyz = _659;
	}
	bool _664 = min_value >= 5.00000000e-01;
	if (_664)
	{
		float _665;
		float _666;
		float _667;
		float _668;
		int _669;
		_665 = sWhites;
		_666 = color.x;
		_667 = V_xpd80_selectivecolor_xw_adj_cya;
		_668 = V_xpd80_selectivecolor_xw_adj_bla;
		_669 = V_xpd80_selectivecolor_xcorr_method;
		float _671 = F_xpd80_selectivecolor_xadjustcolor(_665, _666, _667, _668, _669);
		float _673 = color.x + _671;
		color[0] = _673;
		float _674;
		float _675;
		float _676;
		float _677;
		int _678;
		_674 = sWhites;
		_675 = color.y;
		_676 = V_xpd80_selectivecolor_xw_adj_mag;
		_677 = V_xpd80_selectivecolor_xw_adj_bla;
		_678 = V_xpd80_selectivecolor_xcorr_method;
		float _680 = F_xpd80_selectivecolor_xadjustcolor(_674, _675, _676, _677, _678);
		float _682 = color.y + _680;
		color[1] = _682;
		float _683;
		float _684;
		float _685;
		float _686;
		int _687;
		_683 = sWhites;
		_684 = color.z;
		_685 = V_xpd80_selectivecolor_xw_adj_yel;
		_686 = V_xpd80_selectivecolor_xw_adj_bla;
		_687 = V_xpd80_selectivecolor_xcorr_method;
		float _689 = F_xpd80_selectivecolor_xadjustcolor(_683, _684, _685, _686, _687);
		float _691 = color.z + _689;
		color[2] = _691;
		float _694 = smoothstep(5.00000000e-01, 1.00000000e+00, min_value);
		float _695 = V_xpd80_selectivecolor_xw_adj_sat * _694;
		vec3 _696;
		float _697;
		_696 = color.xyz;
		_697 = _695;
		vec3 _699 = F_xsat(_696, _697);
		color.xyz = _699;
		float _702 = smoothstep(5.00000000e-01, 1.00000000e+00, min_value);
		float _703 = V_xpd80_selectivecolor_xw_adj_vib * _702;
		vec3 _704;
		float _705;
		_704 = color.xyz;
		_705 = _703;
		vec3 _707 = F_xvib(_704, _705);
		color.xyz = _707;
	}
	bool _712 = max_value > 0.00000000e+00;
	bool _714 = min_value < 1.00000000e+00;
	bool _715 = _712 && _714;
	if (_715)
	{
		float _716;
		float _717;
		float _718;
		float _719;
		int _720;
		_716 = sNeutrals;
		_717 = color.x;
		_718 = V_xpd80_selectivecolor_xn_adj_cya;
		_719 = V_xpd80_selectivecolor_xn_adj_bla;
		_720 = V_xpd80_selectivecolor_xcorr_method;
		float _722 = F_xpd80_selectivecolor_xadjustcolor(_716, _717, _718, _719, _720);
		float _724 = color.x + _722;
		color[0] = _724;
		float _725;
		float _726;
		float _727;
		float _728;
		int _729;
		_725 = sNeutrals;
		_726 = color.y;
		_727 = V_xpd80_selectivecolor_xn_adj_mag;
		_728 = V_xpd80_selectivecolor_xn_adj_bla;
		_729 = V_xpd80_selectivecolor_xcorr_method;
		float _731 = F_xpd80_selectivecolor_xadjustcolor(_725, _726, _727, _728, _729);
		float _733 = color.y + _731;
		color[1] = _733;
		float _734;
		float _735;
		float _736;
		float _737;
		int _738;
		_734 = sNeutrals;
		_735 = color.z;
		_736 = V_xpd80_selectivecolor_xn_adj_yel;
		_737 = V_xpd80_selectivecolor_xn_adj_bla;
		_738 = V_xpd80_selectivecolor_xcorr_method;
		float _740 = F_xpd80_selectivecolor_xadjustcolor(_734, _735, _736, _737, _738);
		float _742 = color.z + _740;
		color[2] = _742;
		vec3 _743;
		float _744;
		_743 = color.xyz;
		_744 = V_xpd80_selectivecolor_xn_adj_sat;
		vec3 _746 = F_xsat(_743, _744);
		color.xyz = _746;
		vec3 _747;
		float _748;
		_747 = color.xyz;
		_748 = V_xpd80_selectivecolor_xn_adj_vib;
		vec3 _750 = F_xvib(_747, _748);
		color.xyz = _750;
	}
	bool _755 = max_value < 5.00000000e-01;
	if (_755)
	{
		float _756;
		float _757;
		float _758;
		float _759;
		int _760;
		_756 = sBlacks;
		_757 = color.x;
		_758 = V_xpd80_selectivecolor_xbk_adj_cya;
		_759 = V_xpd80_selectivecolor_xbk_adj_bla;
		_760 = V_xpd80_selectivecolor_xcorr_method;
		float _762 = F_xpd80_selectivecolor_xadjustcolor(_756, _757, _758, _759, _760);
		float _764 = color.x + _762;
		color[0] = _764;
		float _765;
		float _766;
		float _767;
		float _768;
		int _769;
		_765 = sBlacks;
		_766 = color.y;
		_767 = V_xpd80_selectivecolor_xbk_adj_mag;
		_768 = V_xpd80_selectivecolor_xbk_adj_bla;
		_769 = V_xpd80_selectivecolor_xcorr_method;
		float _771 = F_xpd80_selectivecolor_xadjustcolor(_765, _766, _767, _768, _769);
		float _773 = color.y + _771;
		color[1] = _773;
		float _774;
		float _775;
		float _776;
		float _777;
		int _778;
		_774 = sBlacks;
		_775 = color.z;
		_776 = V_xpd80_selectivecolor_xbk_adj_yel;
		_777 = V_xpd80_selectivecolor_xbk_adj_bla;
		_778 = V_xpd80_selectivecolor_xcorr_method;
		float _780 = F_xpd80_selectivecolor_xadjustcolor(_774, _775, _776, _777, _778);
		float _782 = color.z + _780;
		color[2] = _782;
		float _785 = smoothstep(5.00000000e-01, 0.00000000e+00, max_value);
		float _786 = V_xpd80_selectivecolor_xbk_adj_sat * _785;
		vec3 _787;
		float _788;
		_787 = color.xyz;
		_788 = _786;
		vec3 _790 = F_xsat(_787, _788);
		color.xyz = _790;
		float _793 = smoothstep(5.00000000e-01, 0.00000000e+00, max_value);
		float _794 = V_xpd80_selectivecolor_xbk_adj_vib * _793;
		vec3 _795;
		float _796;
		_795 = color.xyz;
		_796 = _794;
		vec3 _798 = F_xvib(_795, _796);
		color.xyz = _798;
	}
	vec4 _803 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _803;
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
#ifdef E_xpd80_selectivecolor_xPS_SelectiveColor
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_selectivecolor_xPS_SelectiveColor(pos, texcoord);
	return;
}
#endif
