#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_depthslicer_xPS_DepthSlice
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
uniform float V_xpd80_depthslicer_xdepth_near;
uniform float V_xpd80_depthslicer_xdepthpos;
uniform float V_xpd80_depthslicer_xdepth_far;
uniform float V_xpd80_depthslicer_xdepth_smoothing;
uniform float V_xpd80_depthslicer_xintensity;
uniform float V_xpd80_depthslicer_xhue;
uniform float V_xpd80_depthslicer_xsaturation;
uniform int V_xpd80_depthslicer_xblendmode_1;
uniform float V_xpd80_depthslicer_xopacity;

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
float F_xgetAvgColor(
	in vec3 col)
{
	float _66 = dot(col.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	return _66;
}
vec3 F_xClipColor(
	in vec3 color)
{
	vec3 _70;
	_70 = color.xyz;
	float _72 = F_xgetAvgColor(_70);
	float lum = _72;
	float _76 = min(color.x, color.y);
	float _78 = min(_76, color.z);
	float mincol = _78;
	float _82 = max(color.x, color.y);
	float _84 = max(_82, color.z);
	float maxcol = _84;
	bool _87 = mincol < 0.00000000e+00;
	vec3 _90 = color.xyz - vec3(lum);
	vec3 _92 = _90 * vec3(lum);
	float _93 = lum - mincol;
	vec3 _95 = _92 / vec3(_93);
	vec3 _97 = vec3(lum) + _95;
	vec3 _100 = compCond(bvec3(_87), _97, color.xyz);
	color.xyz = _100;
	bool _102 = maxcol > 1.00000000e+00;
	vec3 _105 = color.xyz - vec3(lum);
	float _107 = 1.00000000e+00 - lum;
	vec3 _109 = _105 * vec3(_107);
	float _110 = maxcol - lum;
	vec3 _112 = _109 / vec3(_110);
	vec3 _114 = vec3(lum) + _112;
	vec3 _117 = compCond(bvec3(_102), _114, color.xyz);
	color.xyz = _117;
	return color;
}
vec3 F_xblendLuma(
	in vec3 base,
	in vec3 blend)
{
	vec3 _122;
	_122 = base.xyz;
	float _124 = F_xgetAvgColor(_122);
	float lumbase = _124;
	vec3 _126;
	_126 = blend.xyz;
	float _128 = F_xgetAvgColor(_126);
	float lumblend = _128;
	float _130 = lumblend - lumbase;
	float ldiff = _130;
	vec3 _134 = base.xyz + vec3(ldiff);
	vec3 col_135 = _134;
	vec3 _136;
	_136 = col_135.xyz;
	vec3 _138 = F_xClipColor(_136);
	return _138;
}
vec3 F_xblendColor(
	in vec3 base,
	in vec3 blend,
	in vec3 lum)
{
	float _146 = min(base.x, base.y);
	float _148 = min(_146, base.z);
	float minbase = _148;
	float _152 = max(base.x, base.y);
	float _154 = max(_152, base.z);
	float maxbase = _154;
	float _156 = maxbase - minbase;
	float satbase = _156;
	float _160 = min(blend.x, blend.y);
	float _162 = min(_160, blend.z);
	float minblend = _162;
	float _166 = max(blend.x, blend.y);
	float _168 = max(_166, blend.z);
	float maxblend = _168;
	float _170 = maxblend - minblend;
	float satblend = _170;
	bool _173 = satbase > 0.00000000e+00;
	vec3 _176 = base.xyz - vec3(minbase);
	vec3 _178 = _176 * vec3(satblend);
	vec3 _180 = _178 / vec3(satbase);
	vec3 _183 = compCond(bvec3(_173), _180, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 color_184 = _183;
	vec3 _185;
	vec3 _186;
	_185 = color_184.xyz;
	_186 = lum.xyz;
	vec3 _189 = F_xblendLuma(_185, _186);
	return _189;
}
vec3 F_xdarken(
	in vec3 c,
	in vec3 b)
{
	vec3 _194 = min(c, b);
	return _194;
}
vec3 F_xmultiply(
	in vec3 c,
	in vec3 b)
{
	vec3 _199 = c * b;
	return _199;
}
vec3 F_xlinearburn(
	in vec3 c,
	in vec3 b)
{
	vec3 _204 = c + b;
	vec3 _206 = _204 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _208 = max(_206, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _208;
}
vec3 F_xcolorburn(
	in vec3 c,
	in vec3 b)
{
	bvec3 _214 = lessThanEqual(b, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _216 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _217 = _216 / b;
	vec3 _219 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _217;
	vec3 _220 = clamp(_219, 0.0, 1.0);
	vec3 _221 = compCond(_214, b, _220);
	return _221;
}
vec3 F_xlighten(
	in vec3 c,
	in vec3 b)
{
	vec3 _226 = max(b, c);
	return _226;
}
vec3 F_xscreen(
	in vec3 c,
	in vec3 b)
{
	vec3 _232 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _234 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _235 = _232 * _234;
	vec3 _237 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _235;
	return _237;
}
vec3 F_xcolordodge(
	in vec3 c,
	in vec3 b)
{
	bvec3 _243 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _245 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _246 = c / _245;
	vec3 _247 = clamp(_246, 0.0, 1.0);
	vec3 _248 = compCond(_243, b, _247);
	return _248;
}
vec3 F_xlineardodge(
	in vec3 c,
	in vec3 b)
{
	vec3 _253 = c + b;
	vec3 _255 = min(_253, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _255;
}
vec3 F_xoverlay(
	in vec3 c,
	in vec3 b)
{
	bvec3 _261 = lessThan(c, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _263 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _264 = _263 * b;
	vec3 _266 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _268 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _266;
	vec3 _270 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _271 = _268 * _270;
	vec3 _273 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _271;
	vec3 _274 = compCond(_261, _264, _273);
	return _274;
}
vec3 F_xsoftlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _280 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _282 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _283 = _282 * b;
	vec3 _284 = c * c;
	vec3 _286 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _288 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _286;
	vec3 _289 = _284 * _288;
	vec3 _290 = _283 + _289;
	vec3 _291 = sqrt(c);
	vec3 _293 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _295 = _293 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _296 = _291 * _295;
	vec3 _298 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _300 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _301 = _298 * _300;
	vec3 _302 = _296 + _301;
	vec3 _303 = compCond(_280, _290, _302);
	return _303;
}
vec3 F_xvividlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _309 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _311 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _312;
	vec3 _313;
	_312 = c;
	_313 = _311;
	vec3 _314 = F_xcolorburn(_312, _313);
	vec3 _316 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _318 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _316;
	vec3 _319;
	vec3 _320;
	_319 = c;
	_320 = _318;
	vec3 _321 = F_xcolordodge(_319, _320);
	vec3 _322 = compCond(_309, _314, _321);
	return _322;
}
vec3 F_xlinearlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _328 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _330 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _331;
	vec3 _332;
	_331 = c;
	_332 = _330;
	vec3 _333 = F_xlinearburn(_331, _332);
	vec3 _335 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _337 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _335;
	vec3 _338;
	vec3 _339;
	_338 = c;
	_339 = _337;
	vec3 _340 = F_xlineardodge(_338, _339);
	vec3 _341 = compCond(_328, _333, _340);
	return _341;
}
vec3 F_xpinlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _347 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _349 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _350;
	vec3 _351;
	_350 = c;
	_351 = _349;
	vec3 _352 = F_xdarken(_350, _351);
	vec3 _354 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _356 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _354;
	vec3 _357;
	vec3 _358;
	_357 = c;
	_358 = _356;
	vec3 _359 = F_xlighten(_357, _358);
	vec3 _360 = compCond(_347, _352, _359);
	return _360;
}
vec3 F_xhardmix(
	in vec3 c,
	in vec3 b)
{
	vec3 _365;
	vec3 _366;
	_365 = c;
	_366 = b;
	vec3 _367 = F_xvividlight(_365, _366);
	bvec3 _369 = lessThan(_367, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _372 = compCond(_369, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _372;
}
vec3 F_xreflect(
	in vec3 c,
	in vec3 b)
{
	bvec3 _378 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _379 = c * c;
	vec3 _381 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _382 = _379 / _381;
	vec3 _383 = clamp(_382, 0.0, 1.0);
	vec3 _384 = compCond(_378, b, _383);
	return _384;
}
vec3 F_xglow(
	in vec3 c,
	in vec3 b)
{
	vec3 _389;
	vec3 _390;
	_389 = b;
	_390 = c;
	vec3 _391 = F_xreflect(_389, _390);
	return _391;
}
vec3 F_xblendhue(
	in vec3 c,
	in vec3 b)
{
	vec3 _396;
	vec3 _397;
	vec3 _398;
	_396 = b;
	_397 = c;
	_398 = c;
	vec3 _399 = F_xblendColor(_396, _397, _398);
	return _399;
}
vec3 F_xblendsaturation(
	in vec3 c,
	in vec3 b)
{
	vec3 _404;
	vec3 _405;
	vec3 _406;
	_404 = c;
	_405 = b;
	_406 = c;
	vec3 _407 = F_xblendColor(_404, _405, _406);
	return _407;
}
vec3 F_xblendcolor(
	in vec3 c,
	in vec3 b)
{
	vec3 _412;
	vec3 _413;
	_412 = b;
	_413 = c;
	vec3 _414 = F_xblendLuma(_412, _413);
	return _414;
}
vec3 F_xblendluminosity(
	in vec3 c,
	in vec3 b)
{
	vec3 _419;
	vec3 _420;
	_419 = c;
	_420 = b;
	vec3 _421 = F_xblendLuma(_419, _420);
	return _421;
}
vec3 F_xblendmode(
	in vec3 c,
	in vec3 b,
	in int mode,
	in float o)
{
	vec3 ret = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	switch (mode)
	{
	case 0: {
		ret.xyz = b.xyz;
		break;
	}
	case 1: {
		vec3 _434;
		vec3 _435;
		_434 = c;
		_435 = b;
		vec3 _436 = F_xdarken(_434, _435);
		ret.xyz = _436;
		break;
	}
	case 2: {
		vec3 _438;
		vec3 _439;
		_438 = c;
		_439 = b;
		vec3 _440 = F_xmultiply(_438, _439);
		ret.xyz = _440;
		break;
	}
	case 3: {
		vec3 _442;
		vec3 _443;
		_442 = c;
		_443 = b;
		vec3 _444 = F_xlinearburn(_442, _443);
		ret.xyz = _444;
		break;
	}
	case 4: {
		vec3 _446;
		vec3 _447;
		_446 = c;
		_447 = b;
		vec3 _448 = F_xcolorburn(_446, _447);
		ret.xyz = _448;
		break;
	}
	case 5: {
		vec3 _450;
		vec3 _451;
		_450 = c;
		_451 = b;
		vec3 _452 = F_xlighten(_450, _451);
		ret.xyz = _452;
		break;
	}
	case 6: {
		vec3 _454;
		vec3 _455;
		_454 = c;
		_455 = b;
		vec3 _456 = F_xscreen(_454, _455);
		ret.xyz = _456;
		break;
	}
	case 7: {
		vec3 _458;
		vec3 _459;
		_458 = c;
		_459 = b;
		vec3 _460 = F_xcolordodge(_458, _459);
		ret.xyz = _460;
		break;
	}
	case 8: {
		vec3 _462;
		vec3 _463;
		_462 = c;
		_463 = b;
		vec3 _464 = F_xlineardodge(_462, _463);
		ret.xyz = _464;
		break;
	}
	case 9: {
		vec3 _466;
		vec3 _467;
		_466 = c;
		_467 = b;
		vec3 _468 = F_xoverlay(_466, _467);
		ret.xyz = _468;
		break;
	}
	case 10: {
		vec3 _470;
		vec3 _471;
		_470 = c;
		_471 = b;
		vec3 _472 = F_xsoftlight(_470, _471);
		ret.xyz = _472;
		break;
	}
	case 11: {
		vec3 _474;
		vec3 _475;
		_474 = c;
		_475 = b;
		vec3 _476 = F_xvividlight(_474, _475);
		ret.xyz = _476;
		break;
	}
	case 12: {
		vec3 _478;
		vec3 _479;
		_478 = c;
		_479 = b;
		vec3 _480 = F_xlinearlight(_478, _479);
		ret.xyz = _480;
		break;
	}
	case 13: {
		vec3 _482;
		vec3 _483;
		_482 = c;
		_483 = b;
		vec3 _484 = F_xpinlight(_482, _483);
		ret.xyz = _484;
		break;
	}
	case 14: {
		vec3 _486;
		vec3 _487;
		_486 = c;
		_487 = b;
		vec3 _488 = F_xhardmix(_486, _487);
		ret.xyz = _488;
		break;
	}
	case 15: {
		vec3 _490;
		vec3 _491;
		_490 = c;
		_491 = b;
		vec3 _492 = F_xreflect(_490, _491);
		ret.xyz = _492;
		break;
	}
	case 16: {
		vec3 _494;
		vec3 _495;
		_494 = c;
		_495 = b;
		vec3 _496 = F_xglow(_494, _495);
		ret.xyz = _496;
		break;
	}
	case 17: {
		vec3 _498;
		vec3 _499;
		_498 = c;
		_499 = b;
		vec3 _500 = F_xblendhue(_498, _499);
		ret.xyz = _500;
		break;
	}
	case 18: {
		vec3 _502;
		vec3 _503;
		_502 = c;
		_503 = b;
		vec3 _504 = F_xblendsaturation(_502, _503);
		ret.xyz = _504;
		break;
	}
	case 19: {
		vec3 _506;
		vec3 _507;
		_506 = c;
		_507 = b;
		vec3 _508 = F_xblendcolor(_506, _507);
		ret.xyz = _508;
		break;
	}
	case 20: {
		vec3 _510;
		vec3 _511;
		_510 = c;
		_511 = b;
		vec3 _512 = F_xblendluminosity(_510, _511);
		ret.xyz = _512;
		break;
	}
	}
	vec3 _516 = mix(c.xyz, ret.xyz, vec3(o));
	vec3 _517 = clamp(_516, 0.0, 1.0);
	return _517;
}
vec3 F_xHUEToRGB(
	in float H)
{
	float _522 = H * 6.00000000e+00;
	float _524 = _522 - 3.00000000e+00;
	float _525 = abs(_524);
	float _527 = _525 - 1.00000000e+00;
	float _529 = H * 6.00000000e+00;
	float _531 = _529 - 2.00000000e+00;
	float _532 = abs(_531);
	float _534 = 2.00000000e+00 - _532;
	float _536 = H * 6.00000000e+00;
	float _538 = _536 - 4.00000000e+00;
	float _539 = abs(_538);
	float _541 = 2.00000000e+00 - _539;
	vec3 _542 = vec3(_527, _534, _541);
	vec3 _543 = clamp(_542, 0.0, 1.0);
	return _543;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _549 = RGB.y < RGB.z;
	vec4 _554 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _559 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _561 = compCond(bvec4(_549), _554, _559);
	vec4 P = _561;
	bool _565 = RGB.x < P.x;
	vec4 _570 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _575 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _577 = compCond(bvec4(_565), _570, _575);
	vec4 Q1 = _577;
	float _581 = min(Q1.w, Q1.y);
	float _583 = Q1.x - _581;
	float C = _583;
	float _587 = Q1.w - Q1.y;
	float _589 = 6.00000000e+00 * C;
	float _591 = _589 + 9.99999997e-07;
	float _592 = _587 / _591;
	float _594 = _592 + Q1.z;
	float _595 = abs(_594);
	float H_596 = _595;
	vec3 _598 = vec3(H_596, C, Q1.x);
	return _598;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _604 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _604;
	vec3 _605;
	_605 = RGB;
	vec3 _606 = F_xRGBToHCV(_605);
	vec3 HCV = _606;
	float _610 = HCV.y * 5.00000000e-01;
	float _612 = HCV.z - _610;
	float L = _612;
	float _615 = L * 2.00000000e+00;
	float _617 = _615 - 1.00000000e+00;
	float _618 = abs(_617);
	float _620 = 1.00000000e+00 - _618;
	float _622 = _620 + 9.99999997e-07;
	float _624 = HCV.y / _622;
	float S = _624;
	vec3 _627 = vec3(HCV.x, S, L);
	return _627;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _631;
	_631 = HSL.x;
	vec3 _633 = F_xHUEToRGB(_631);
	vec3 RGB_634 = _633;
	float _637 = 2.00000000e+00 * HSL.z;
	float _639 = _637 - 1.00000000e+00;
	float _640 = abs(_639);
	float _642 = 1.00000000e+00 - _640;
	float _644 = _642 * HSL.y;
	float C_645 = _644;
	vec3 _647 = RGB_634 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _649 = _647 * vec3(C_645);
	vec3 _651 = _649 + vec3(HSL.z);
	return _651;
}
vec3 F_xRGBToHSV(
	in vec3 c)
{
	vec4 K = vec4(0.00000000e+00, -3.33333343e-01, 6.66666687e-01, -1.00000000e+00);
	bool _659 = c.y < c.z;
	vec4 _664 = vec4(c.zy.x, c.zy.y, K.wz.x, K.wz.y);
	vec4 _669 = vec4(c.yz.x, c.yz.y, K.xy.x, K.xy.y);
	vec4 _671 = compCond(bvec4(_659), _664, _669);
	vec4 p = _671;
	bool _675 = c.x < p.x;
	vec4 _680 = vec4(p.xyw.x, p.xyw.y, p.xyw.z, c.x);
	vec4 _685 = vec4(c.x, p.yzx.x, p.yzx.y, p.yzx.z);
	vec4 _687 = compCond(bvec4(_675), _680, _685);
	vec4 q = _687;
	float _691 = min(q.w, q.y);
	float _693 = q.x - _691;
	float d = _693;
	float e = 1.00000001e-10;
	float _699 = q.w - q.y;
	float _701 = 6.00000000e+00 * d;
	float _702 = _701 + e;
	float _703 = _699 / _702;
	float _705 = q.z + _703;
	float _706 = abs(_705);
	float _708 = q.x + e;
	float _709 = d / _708;
	vec3 _711 = vec3(_706, _709, q.x);
	return _711;
}
vec3 F_xHSVToRGB(
	in vec3 c)
{
	vec4 K_716 = vec4(1.00000000e+00, 6.66666687e-01, 3.33333343e-01, 3.00000000e+00);
	vec3 _719 = c.xxx + K_716.xyz;
	vec3 _720 = fract(_719);
	vec3 _722 = _720 * vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec3 _724 = _722 - K_716.www;
	vec3 _725 = abs(_724);
	vec3 p_726 = _725;
	vec3 _728 = p_726 - K_716.xxx;
	vec3 _729 = clamp(_728, 0.0, 1.0);
	vec3 _732 = mix(K_716.xxx, _729, vec3(c.y));
	vec3 _734 = vec3(c.z) * _732;
	return _734;
}
vec3 F_xKelvinToRGB(
	in float k)
{
	vec3 ret_739 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _742 = clamp(k, 1.00000000e+03, 4.00000000e+04);
	float _744 = _742 / 1.00000000e+02;
	float kelvin = _744;
	bool _750 = kelvin <= 6.60000000e+01;
	if (_750)
	{
		ret_739[0] = 1.00000000e+00;
		float _752 = log(kelvin);
		float _754 = 3.90081584e-01 * _752;
		float _756 = _754 - 6.31841421e-01;
		float _757 = clamp(_756, 0.0, 1.0);
		ret_739[1] = _757;
	}
	else
	{
		float _759 = kelvin - 6.00000000e+01;
		float _761 = max(_759, 0.00000000e+00);
		float t = _761;
		float _764 = pow(t, -1.33204758e-01);
		float _766 = 1.29293621e+00 * _764;
		float _767 = clamp(_766, 0.0, 1.0);
		ret_739[0] = _767;
		float _769 = pow(t, -7.55148456e-02);
		float _771 = 1.12989092e+00 * _769;
		float _772 = clamp(_771, 0.0, 1.0);
		ret_739[1] = _772;
	}
	bool _777 = kelvin >= 6.60000000e+01;
	if (_777)
	{
		ret_739[2] = 1.00000000e+00;
	}
	else
	{
		bool _783 = kelvin < 1.90000000e+01;
		if (_783)
		{
			ret_739[2] = 0.00000000e+00;
		}
		else
		{
			float _786 = kelvin - 1.00000000e+01;
			float _787 = log(_786);
			float _789 = 5.43206811e-01 * _787;
			float _791 = _789 - 1.19625413e+00;
			float _792 = clamp(_791, 0.0, 1.0);
			ret_739[2] = _792;
		}
	}
	return ret_739;
}
vec3 F_xLinearTosRGB(
	in vec3 color)
{
	vec3 _797 = color * vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x = _797;
	vec3 _799 = clamp(color, 0.0, 1.0);
	vec3 _801 = pow(_799, vec3(4.16666657e-01, 4.16666657e-01, 4.16666657e-01));
	vec3 _803 = vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00) * _801;
	vec3 _805 = _803 - vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 y = _805;
	vec3 clr = color;
	bool _810 = color.x < 3.13080009e-03;
	float _813 = _810 ? x.x : y.x;
	clr[0] = _813;
	bool _816 = color.y < 3.13080009e-03;
	float _819 = _816 ? x.y : y.y;
	clr[1] = _819;
	bool _822 = color.z < 3.13080009e-03;
	float _825 = _822 ? x.z : y.z;
	clr[2] = _825;
	return clr;
}
vec3 F_xSRGBToLinear(
	in vec3 color)
{
	vec3 _830 = color / vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x_831 = _830;
	vec3 _833 = color + vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 _835 = _833 / vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00);
	vec3 _837 = max(_835, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _839 = pow(_837, vec3(2.40000010e+00, 2.40000010e+00, 2.40000010e+00));
	vec3 y_840 = _839;
	vec3 clr_841 = color;
	bool _844 = color.x <= 4.04499993e-02;
	float _847 = _844 ? x_831.x : y_840.x;
	clr_841[0] = _847;
	bool _850 = color.y <= 4.04499993e-02;
	float _853 = _850 ? x_831.y : y_840.y;
	clr_841[1] = _853;
	bool _856 = color.z <= 4.04499993e-02;
	float _859 = _856 ? x_831.z : y_840.z;
	clr_841[2] = _859;
	return clr_841;
}
vec3 F_xpd80_xyz_to_lab(
	in vec3 c)
{
	vec3 _864 = c / vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	vec3 _866 = max(_864, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 w = _866;
	vec3 v = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _872 = w.x > 8.85645207e-03;
	float _875 = pow(w.x, 3.33333343e-01);
	float _878 = 9.03296326e+02 * w.x;
	float _880 = _878 + 1.60000000e+01;
	float _882 = _880 / 1.16000000e+02;
	float _883 = _872 ? _875 : _882;
	v[0] = _883;
	bool _886 = w.y > 8.85645207e-03;
	float _889 = pow(w.y, 3.33333343e-01);
	float _892 = 9.03296326e+02 * w.y;
	float _894 = _892 + 1.60000000e+01;
	float _896 = _894 / 1.16000000e+02;
	float _897 = _886 ? _889 : _896;
	v[1] = _897;
	bool _900 = w.z > 8.85645207e-03;
	float _903 = pow(w.z, 3.33333343e-01);
	float _906 = 9.03296326e+02 * w.z;
	float _908 = _906 + 1.60000000e+01;
	float _910 = _908 / 1.16000000e+02;
	float _911 = _900 ? _903 : _910;
	v[2] = _911;
	float _914 = 1.16000000e+02 * v.y;
	float _916 = _914 - 1.60000000e+01;
	float _919 = v.x - v.y;
	float _921 = 5.00000000e+02 * _919;
	float _924 = v.y - v.z;
	float _926 = 2.00000000e+02 * _924;
	vec3 _927 = vec3(_916, _921, _926);
	return _927;
}
vec3 F_xpd80_lab_to_xyz(
	in vec3 c)
{
	vec3 v_932 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _935 = c.x + 1.60000000e+01;
	float _937 = _935 / 1.16000000e+02;
	v_932[1] = _937;
	float _940 = c.y / 5.00000000e+02;
	float _942 = _940 + v_932.y;
	v_932[0] = _942;
	float _945 = c.z / 2.00000000e+02;
	float _947 = v_932.y - _945;
	v_932[2] = _947;
	float _950 = v_932.x * v_932.x;
	float _952 = _950 * v_932.x;
	bool _954 = _952 > 8.85645207e-03;
	float _957 = v_932.x * v_932.x;
	float _959 = _957 * v_932.x;
	float _962 = 1.16000000e+02 * v_932.x;
	float _964 = _962 - 1.60000000e+01;
	float _966 = _964 / 9.03296326e+02;
	float _967 = _954 ? _959 : _966;
	bool _970 = c.x > 8.00000095e+00;
	float _973 = v_932.y * v_932.y;
	float _975 = _973 * v_932.y;
	float _978 = c.x / 9.03296326e+02;
	float _979 = _970 ? _975 : _978;
	float _982 = v_932.z * v_932.z;
	float _984 = _982 * v_932.z;
	bool _986 = _984 > 8.85645207e-03;
	float _989 = v_932.z * v_932.z;
	float _991 = _989 * v_932.z;
	float _994 = 1.16000000e+02 * v_932.z;
	float _996 = _994 - 1.60000000e+01;
	float _998 = _996 / 9.03296326e+02;
	float _999 = _986 ? _991 : _998;
	vec3 _1000 = vec3(_967, _979, _999);
	vec3 _1002 = _1000 * vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	return _1002;
}
vec3 F_xpd80_srgb_to_xyz(
	in vec3 c)
{
	vec3 _1007 = (c * mat3x3(4.12456393e-01, 3.57576102e-01, 1.80437505e-01, 2.12672904e-01, 7.15152204e-01, 7.21750036e-02, 1.93339009e-02, 1.19191997e-01, 9.50304091e-01));
	return _1007;
}
vec3 F_xpd80_xyz_to_srgb(
	in vec3 c)
{
	vec3 _1012 = (c * mat3x3(3.24045420e+00, -1.53713846e+00, -4.98531401e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 5.56433983e-02, -2.04025894e-01, 1.05722523e+00));
	return _1012;
}
vec3 F_xpd80_srgb_to_lab(
	in vec3 c)
{
	vec3 _1016;
	_1016 = c;
	vec3 _1017 = F_xpd80_srgb_to_xyz(_1016);
	vec3 lab = _1017;
	vec3 _1019;
	_1019 = lab;
	vec3 _1020 = F_xpd80_xyz_to_lab(_1019);
	lab = _1020;
	vec3 _1022 = lab / vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	return _1022;
}
vec3 F_xpd80_lab_to_srgb(
	in vec3 c)
{
	vec3 _1027 = c * vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	vec3 _1028;
	_1028 = _1027;
	vec3 _1029 = F_xpd80_lab_to_xyz(_1028);
	vec3 rgb = _1029;
	vec3 _1032 = min(rgb, vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00));
	vec3 _1034 = max(_1032, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _1035;
	_1035 = _1034;
	vec3 _1036 = F_xpd80_xyz_to_srgb(_1035);
	rgb = _1036;
	vec3 _1037 = clamp(rgb, 0.0, 1.0);
	return _1037;
}
vec4 F_xpd80_depthslicer_xPS_DepthSlice(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1051 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_1052 = _1051;
	vec2 _1053;
	_1053 = texcoord;
	float _1054 = F_xReShade_xGetLinearizedDepth(_1053);
	float depth_1055 = _1054;
	float _1056 = V_xpd80_depthslicer_xdepthpos - V_xpd80_depthslicer_xdepth_near;
	float depth_np = _1056;
	float _1058 = V_xpd80_depthslicer_xdepthpos + V_xpd80_depthslicer_xdepth_far;
	float depth_fp = _1058;
	float _1060 = depth_np - V_xpd80_depthslicer_xdepth_smoothing;
	float _1061 = smoothstep(_1060, depth_np, depth_1055);
	float dn = _1061;
	float _1063 = depth_fp + V_xpd80_depthslicer_xdepth_smoothing;
	float _1064 = smoothstep(depth_fp, _1063, depth_1055);
	float _1066 = 1.00000000e+00 - _1064;
	float df = _1066;
	float _1068 = dn * df;
	float _1070 = 1.00000000e+00 - _1068;
	float colorize = _1070;
	float a = colorize;
	float _1073 = colorize * V_xpd80_depthslicer_xintensity;
	colorize = _1073;
	vec3 _1074 = vec3(V_xpd80_depthslicer_xhue, V_xpd80_depthslicer_xsaturation, colorize);
	vec3 _1075;
	_1075 = _1074;
	vec3 _1076 = F_xHSVToRGB(_1075);
	vec3 b_1077 = _1076;
	float _1078 = V_xpd80_depthslicer_xopacity * a;
	vec3 _1079;
	vec3 _1080;
	int _1081;
	float _1082;
	_1079 = color_1052.xyz;
	_1080 = b_1077.xyz;
	_1081 = V_xpd80_depthslicer_xblendmode_1;
	_1082 = _1078;
	vec3 _1085 = F_xblendmode(_1079, _1080, _1081, _1082);
	color_1052.xyz = _1085;
	vec4 _1090 = vec4(color_1052.xyz.x, color_1052.xyz.y, color_1052.xyz.z, 1.00000000e+00);
	return _1090;
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
#ifdef E_xpd80_depthslicer_xPS_DepthSlice
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_depthslicer_xPS_DepthSlice(pos, texcoord);
	return;
}
#endif
