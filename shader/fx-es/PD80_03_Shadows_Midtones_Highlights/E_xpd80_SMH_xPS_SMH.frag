#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_SMH_xPS_SMH
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
uniform int V_xpd80_SMH_xluma_mode;
uniform int V_xpd80_SMH_xseparation_mode;
uniform bool V_xpd80_SMH_xenable_dither;
uniform float V_xpd80_SMH_xdither_strength;
uniform float V_xpd80_SMH_xexposure_s;
uniform float V_xpd80_SMH_xcontrast_s;
uniform float V_xpd80_SMH_xbrightness_s;
uniform vec3 V_xpd80_SMH_xblendcolor_s;
uniform int V_xpd80_SMH_xblendmode_s;
uniform float V_xpd80_SMH_xopacity_s;
uniform float V_xpd80_SMH_xtint_s;
uniform float V_xpd80_SMH_xsaturation_s;
uniform float V_xpd80_SMH_xvibrance_s;
uniform float V_xpd80_SMH_xexposure_m;
uniform float V_xpd80_SMH_xcontrast_m;
uniform float V_xpd80_SMH_xbrightness_m;
uniform vec3 V_xpd80_SMH_xblendcolor_m;
uniform int V_xpd80_SMH_xblendmode_m;
uniform float V_xpd80_SMH_xopacity_m;
uniform float V_xpd80_SMH_xtint_m;
uniform float V_xpd80_SMH_xsaturation_m;
uniform float V_xpd80_SMH_xvibrance_m;
uniform float V_xpd80_SMH_xexposure_h;
uniform float V_xpd80_SMH_xcontrast_h;
uniform float V_xpd80_SMH_xbrightness_h;
uniform vec3 V_xpd80_SMH_xblendcolor_h;
uniform int V_xpd80_SMH_xblendmode_h;
uniform float V_xpd80_SMH_xopacity_h;
uniform float V_xpd80_SMH_xtint_h;
uniform float V_xpd80_SMH_xsaturation_h;
uniform float V_xpd80_SMH_xvibrance_h;
uniform vec2 V_xpd80_SMH_xpingpong;

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
float F_xgetAvgColor(
	in vec3 col)
{
	float _112 = dot(col.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	return _112;
}
vec3 F_xClipColor(
	in vec3 color)
{
	vec3 _116;
	_116 = color.xyz;
	float _118 = F_xgetAvgColor(_116);
	float lum = _118;
	float _122 = min(color.x, color.y);
	float _124 = min(_122, color.z);
	float mincol = _124;
	float _128 = max(color.x, color.y);
	float _130 = max(_128, color.z);
	float maxcol = _130;
	bool _133 = mincol < 0.00000000e+00;
	vec3 _136 = color.xyz - vec3(lum);
	vec3 _138 = _136 * vec3(lum);
	float _139 = lum - mincol;
	vec3 _141 = _138 / vec3(_139);
	vec3 _143 = vec3(lum) + _141;
	vec3 _146 = compCond(bvec3(_133), _143, color.xyz);
	color.xyz = _146;
	bool _148 = maxcol > 1.00000000e+00;
	vec3 _151 = color.xyz - vec3(lum);
	float _153 = 1.00000000e+00 - lum;
	vec3 _155 = _151 * vec3(_153);
	float _156 = maxcol - lum;
	vec3 _158 = _155 / vec3(_156);
	vec3 _160 = vec3(lum) + _158;
	vec3 _163 = compCond(bvec3(_148), _160, color.xyz);
	color.xyz = _163;
	return color;
}
vec3 F_xblendLuma(
	in vec3 base,
	in vec3 blend)
{
	vec3 _168;
	_168 = base.xyz;
	float _170 = F_xgetAvgColor(_168);
	float lumbase = _170;
	vec3 _172;
	_172 = blend.xyz;
	float _174 = F_xgetAvgColor(_172);
	float lumblend = _174;
	float _176 = lumblend - lumbase;
	float ldiff = _176;
	vec3 _180 = base.xyz + vec3(ldiff);
	vec3 col_181 = _180;
	vec3 _182;
	_182 = col_181.xyz;
	vec3 _184 = F_xClipColor(_182);
	return _184;
}
vec3 F_xblendColor(
	in vec3 base,
	in vec3 blend,
	in vec3 lum)
{
	float _192 = min(base.x, base.y);
	float _194 = min(_192, base.z);
	float minbase = _194;
	float _198 = max(base.x, base.y);
	float _200 = max(_198, base.z);
	float maxbase = _200;
	float _202 = maxbase - minbase;
	float satbase = _202;
	float _206 = min(blend.x, blend.y);
	float _208 = min(_206, blend.z);
	float minblend = _208;
	float _212 = max(blend.x, blend.y);
	float _214 = max(_212, blend.z);
	float maxblend = _214;
	float _216 = maxblend - minblend;
	float satblend = _216;
	bool _219 = satbase > 0.00000000e+00;
	vec3 _222 = base.xyz - vec3(minbase);
	vec3 _224 = _222 * vec3(satblend);
	vec3 _226 = _224 / vec3(satbase);
	vec3 _229 = compCond(bvec3(_219), _226, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 color_230 = _229;
	vec3 _231;
	vec3 _232;
	_231 = color_230.xyz;
	_232 = lum.xyz;
	vec3 _235 = F_xblendLuma(_231, _232);
	return _235;
}
vec3 F_xdarken(
	in vec3 c,
	in vec3 b)
{
	vec3 _240 = min(c, b);
	return _240;
}
vec3 F_xmultiply(
	in vec3 c,
	in vec3 b)
{
	vec3 _245 = c * b;
	return _245;
}
vec3 F_xlinearburn(
	in vec3 c,
	in vec3 b)
{
	vec3 _250 = c + b;
	vec3 _252 = _250 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _254 = max(_252, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _254;
}
vec3 F_xcolorburn(
	in vec3 c,
	in vec3 b)
{
	bvec3 _260 = lessThanEqual(b, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _262 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _263 = _262 / b;
	vec3 _265 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _263;
	vec3 _266 = clamp(_265, 0.0, 1.0);
	vec3 _267 = compCond(_260, b, _266);
	return _267;
}
vec3 F_xlighten(
	in vec3 c,
	in vec3 b)
{
	vec3 _272 = max(b, c);
	return _272;
}
vec3 F_xscreen(
	in vec3 c,
	in vec3 b)
{
	vec3 _278 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _280 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _281 = _278 * _280;
	vec3 _283 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _281;
	return _283;
}
vec3 F_xcolordodge(
	in vec3 c,
	in vec3 b)
{
	bvec3 _289 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _291 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _292 = c / _291;
	vec3 _293 = clamp(_292, 0.0, 1.0);
	vec3 _294 = compCond(_289, b, _293);
	return _294;
}
vec3 F_xlineardodge(
	in vec3 c,
	in vec3 b)
{
	vec3 _299 = c + b;
	vec3 _301 = min(_299, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _301;
}
vec3 F_xoverlay(
	in vec3 c,
	in vec3 b)
{
	bvec3 _307 = lessThan(c, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _309 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _310 = _309 * b;
	vec3 _312 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _314 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _312;
	vec3 _316 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _317 = _314 * _316;
	vec3 _319 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _317;
	vec3 _320 = compCond(_307, _310, _319);
	return _320;
}
vec3 F_xsoftlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _326 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _328 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _329 = _328 * b;
	vec3 _330 = c * c;
	vec3 _332 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _334 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _332;
	vec3 _335 = _330 * _334;
	vec3 _336 = _329 + _335;
	vec3 _337 = sqrt(c);
	vec3 _339 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _341 = _339 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _342 = _337 * _341;
	vec3 _344 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _346 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _347 = _344 * _346;
	vec3 _348 = _342 + _347;
	vec3 _349 = compCond(_326, _336, _348);
	return _349;
}
vec3 F_xvividlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _355 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _357 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _358;
	vec3 _359;
	_358 = c;
	_359 = _357;
	vec3 _360 = F_xcolorburn(_358, _359);
	vec3 _362 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _364 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _362;
	vec3 _365;
	vec3 _366;
	_365 = c;
	_366 = _364;
	vec3 _367 = F_xcolordodge(_365, _366);
	vec3 _368 = compCond(_355, _360, _367);
	return _368;
}
vec3 F_xlinearlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _374 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _376 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _377;
	vec3 _378;
	_377 = c;
	_378 = _376;
	vec3 _379 = F_xlinearburn(_377, _378);
	vec3 _381 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _383 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _381;
	vec3 _384;
	vec3 _385;
	_384 = c;
	_385 = _383;
	vec3 _386 = F_xlineardodge(_384, _385);
	vec3 _387 = compCond(_374, _379, _386);
	return _387;
}
vec3 F_xpinlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _393 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _395 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _396;
	vec3 _397;
	_396 = c;
	_397 = _395;
	vec3 _398 = F_xdarken(_396, _397);
	vec3 _400 = b - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _402 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _400;
	vec3 _403;
	vec3 _404;
	_403 = c;
	_404 = _402;
	vec3 _405 = F_xlighten(_403, _404);
	vec3 _406 = compCond(_393, _398, _405);
	return _406;
}
vec3 F_xhardmix(
	in vec3 c,
	in vec3 b)
{
	vec3 _411;
	vec3 _412;
	_411 = c;
	_412 = b;
	vec3 _413 = F_xvividlight(_411, _412);
	bvec3 _415 = lessThan(_413, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _418 = compCond(_415, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	return _418;
}
vec3 F_xreflect(
	in vec3 c,
	in vec3 b)
{
	bvec3 _424 = greaterThanEqual(b, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _425 = c * c;
	vec3 _427 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _428 = _425 / _427;
	vec3 _429 = clamp(_428, 0.0, 1.0);
	vec3 _430 = compCond(_424, b, _429);
	return _430;
}
vec3 F_xglow(
	in vec3 c,
	in vec3 b)
{
	vec3 _435;
	vec3 _436;
	_435 = b;
	_436 = c;
	vec3 _437 = F_xreflect(_435, _436);
	return _437;
}
vec3 F_xblendhue(
	in vec3 c,
	in vec3 b)
{
	vec3 _442;
	vec3 _443;
	vec3 _444;
	_442 = b;
	_443 = c;
	_444 = c;
	vec3 _445 = F_xblendColor(_442, _443, _444);
	return _445;
}
vec3 F_xblendsaturation(
	in vec3 c,
	in vec3 b)
{
	vec3 _450;
	vec3 _451;
	vec3 _452;
	_450 = c;
	_451 = b;
	_452 = c;
	vec3 _453 = F_xblendColor(_450, _451, _452);
	return _453;
}
vec3 F_xblendcolor(
	in vec3 c,
	in vec3 b)
{
	vec3 _458;
	vec3 _459;
	_458 = b;
	_459 = c;
	vec3 _460 = F_xblendLuma(_458, _459);
	return _460;
}
vec3 F_xblendluminosity(
	in vec3 c,
	in vec3 b)
{
	vec3 _465;
	vec3 _466;
	_465 = c;
	_466 = b;
	vec3 _467 = F_xblendLuma(_465, _466);
	return _467;
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
		vec3 _480;
		vec3 _481;
		_480 = c;
		_481 = b;
		vec3 _482 = F_xdarken(_480, _481);
		ret.xyz = _482;
		break;
	}
	case 2: {
		vec3 _484;
		vec3 _485;
		_484 = c;
		_485 = b;
		vec3 _486 = F_xmultiply(_484, _485);
		ret.xyz = _486;
		break;
	}
	case 3: {
		vec3 _488;
		vec3 _489;
		_488 = c;
		_489 = b;
		vec3 _490 = F_xlinearburn(_488, _489);
		ret.xyz = _490;
		break;
	}
	case 4: {
		vec3 _492;
		vec3 _493;
		_492 = c;
		_493 = b;
		vec3 _494 = F_xcolorburn(_492, _493);
		ret.xyz = _494;
		break;
	}
	case 5: {
		vec3 _496;
		vec3 _497;
		_496 = c;
		_497 = b;
		vec3 _498 = F_xlighten(_496, _497);
		ret.xyz = _498;
		break;
	}
	case 6: {
		vec3 _500;
		vec3 _501;
		_500 = c;
		_501 = b;
		vec3 _502 = F_xscreen(_500, _501);
		ret.xyz = _502;
		break;
	}
	case 7: {
		vec3 _504;
		vec3 _505;
		_504 = c;
		_505 = b;
		vec3 _506 = F_xcolordodge(_504, _505);
		ret.xyz = _506;
		break;
	}
	case 8: {
		vec3 _508;
		vec3 _509;
		_508 = c;
		_509 = b;
		vec3 _510 = F_xlineardodge(_508, _509);
		ret.xyz = _510;
		break;
	}
	case 9: {
		vec3 _512;
		vec3 _513;
		_512 = c;
		_513 = b;
		vec3 _514 = F_xoverlay(_512, _513);
		ret.xyz = _514;
		break;
	}
	case 10: {
		vec3 _516;
		vec3 _517;
		_516 = c;
		_517 = b;
		vec3 _518 = F_xsoftlight(_516, _517);
		ret.xyz = _518;
		break;
	}
	case 11: {
		vec3 _520;
		vec3 _521;
		_520 = c;
		_521 = b;
		vec3 _522 = F_xvividlight(_520, _521);
		ret.xyz = _522;
		break;
	}
	case 12: {
		vec3 _524;
		vec3 _525;
		_524 = c;
		_525 = b;
		vec3 _526 = F_xlinearlight(_524, _525);
		ret.xyz = _526;
		break;
	}
	case 13: {
		vec3 _528;
		vec3 _529;
		_528 = c;
		_529 = b;
		vec3 _530 = F_xpinlight(_528, _529);
		ret.xyz = _530;
		break;
	}
	case 14: {
		vec3 _532;
		vec3 _533;
		_532 = c;
		_533 = b;
		vec3 _534 = F_xhardmix(_532, _533);
		ret.xyz = _534;
		break;
	}
	case 15: {
		vec3 _536;
		vec3 _537;
		_536 = c;
		_537 = b;
		vec3 _538 = F_xreflect(_536, _537);
		ret.xyz = _538;
		break;
	}
	case 16: {
		vec3 _540;
		vec3 _541;
		_540 = c;
		_541 = b;
		vec3 _542 = F_xglow(_540, _541);
		ret.xyz = _542;
		break;
	}
	case 17: {
		vec3 _544;
		vec3 _545;
		_544 = c;
		_545 = b;
		vec3 _546 = F_xblendhue(_544, _545);
		ret.xyz = _546;
		break;
	}
	case 18: {
		vec3 _548;
		vec3 _549;
		_548 = c;
		_549 = b;
		vec3 _550 = F_xblendsaturation(_548, _549);
		ret.xyz = _550;
		break;
	}
	case 19: {
		vec3 _552;
		vec3 _553;
		_552 = c;
		_553 = b;
		vec3 _554 = F_xblendcolor(_552, _553);
		ret.xyz = _554;
		break;
	}
	case 20: {
		vec3 _556;
		vec3 _557;
		_556 = c;
		_557 = b;
		vec3 _558 = F_xblendluminosity(_556, _557);
		ret.xyz = _558;
		break;
	}
	}
	vec3 _562 = mix(c.xyz, ret.xyz, vec3(o));
	vec3 _563 = clamp(_562, 0.0, 1.0);
	return _563;
}
vec3 F_xsl(
	in vec3 c,
	in vec3 b)
{
	bvec3 _569 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _571 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _572 = _571 * b;
	vec3 _573 = c * c;
	vec3 _575 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _577 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _575;
	vec3 _578 = _573 * _577;
	vec3 _579 = _572 + _578;
	vec3 _580 = sqrt(c);
	vec3 _582 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _584 = _582 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _585 = _580 * _584;
	vec3 _587 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _589 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _590 = _587 * _589;
	vec3 _591 = _585 + _590;
	vec3 _592 = compCond(_569, _579, _591);
	return _592;
}
float F_xgetLum(
	in vec3 x)
{
	float _597 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _597;
}
vec3 F_xexposure(
	in vec3 res,
	in float x)
{
	bool _603 = x < 0.00000000e+00;
	float _605 = x * 3.33000004e-01;
	float _606 = _603 ? _605 : x;
	x = _606;
	vec3 _609 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _611 = vec3(x) * _609;
	vec3 _613 = _611 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _615 = res.xyz * _613;
	vec3 _616 = clamp(_615, 0.0, 1.0);
	return _616;
}
vec3 F_xcon(
	in vec3 res,
	in float x)
{
	vec3 _621;
	vec3 _622;
	_621 = res.xyz;
	_622 = res.xyz;
	vec3 _625 = F_xsl(_621, _622);
	vec3 c_626 = _625;
	bool _628 = x < 0.00000000e+00;
	float _630 = x * 5.00000000e-01;
	float _631 = _628 ? _630 : x;
	x = _631;
	vec3 _635 = mix(res.xyz, c_626.xyz, vec3(x));
	vec3 _636 = clamp(_635, 0.0, 1.0);
	return _636;
}
vec3 F_xbri(
	in vec3 res,
	in float x)
{
	vec3 _643 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _646 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - res.xyz;
	vec3 _647 = _643 * _646;
	vec3 _649 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _647;
	vec3 c_650 = _649;
	bool _652 = x < 0.00000000e+00;
	float _654 = x * 5.00000000e-01;
	float _655 = _652 ? _654 : x;
	x = _655;
	vec3 _659 = mix(res.xyz, c_650.xyz, vec3(x));
	vec3 _660 = clamp(_659, 0.0, 1.0);
	return _660;
}
vec3 F_xsat(
	in vec3 res,
	in float x)
{
	vec3 _665;
	_665 = res.xyz;
	float _667 = F_xgetLum(_665);
	float _669 = x + 1.00000000e+00;
	vec3 _673 = mix(vec3(_667), res.xyz, vec3(_669));
	vec3 _674 = clamp(_673, 0.0, 1.0);
	return _674;
}
vec3 F_xvib(
	in vec3 res,
	in float x)
{
	vec4 sat = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _683 = min(res.x, res.y);
	float _685 = min(_683, res.z);
	float _688 = max(res.x, res.y);
	float _690 = max(_688, res.z);
	vec2 _691 = vec2(_685, _690);
	sat.xy = _691;
	float _694 = sat.y - sat.x;
	sat[2] = _694;
	vec3 _695;
	_695 = res.xyz;
	float _697 = F_xgetLum(_695);
	sat[3] = _697;
	float _700 = 1.00000000e+00 - sat.z;
	float _701 = x * _700;
	float _703 = 1.00000000e+00 + _701;
	vec3 _707 = mix(vec3(sat.w), res.xyz, vec3(_703));
	vec3 _708 = clamp(_707, 0.0, 1.0);
	return _708;
}
float F_xpd80_SMH_xgetLuminance(
	in vec3 x)
{
	float _745 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _745;
}
float F_xpd80_SMH_xcurve(
	in float x)
{
	float _749 = x * x;
	float _750 = _749 * x;
	float _752 = x * 6.00000000e+00;
	float _754 = _752 - 1.50000000e+01;
	float _755 = x * _754;
	float _757 = _755 + 1.00000000e+01;
	float _758 = _750 * _757;
	return _758;
}
vec4 F_xpd80_SMH_xPS_SMH(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _763 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_764 = _763;
	vec3 _766 = clamp(color_764.xyz, 0.0, 1.0);
	color_764.xyz = _766;
	vec2 _767;
	int _768;
	bool _769;
	float _770;
	bool _771;
	float _772;
	_767 = texcoord.xy;
	_768 = 3;
	_769 = V_xpd80_SMH_xenable_dither;
	_770 = V_xpd80_SMH_xdither_strength;
	_771 = true;
	_772 = 5.00000000e-01;
	vec4 _777 = F_xdither(V_xsamplerRGBNoise, _767, _768, _769, _770, _771, _772);
	vec4 dnoise = _777;
	vec3 _781 = color_764.xyz + dnoise.xyz;
	vec3 _782 = clamp(_781, 0.0, 1.0);
	color_764.xyz = _782;
	float pLuma = 0.00000000e+00;
	switch (V_xpd80_SMH_xluma_mode)
	{
	case 0: {
		float _789 = dot(color_764.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
		pLuma = _789;
		break;
	}
	case 1: {
		vec3 _791;
		_791 = color_764.xyz;
		float _793 = F_xpd80_SMH_xgetLuminance(_791);
		pLuma = _793;
		break;
	}
	case 2: {
		float _797 = max(color_764.x, color_764.y);
		float _799 = max(_797, color_764.z);
		pLuma = _799;
		break;
	}
	}
	float weight_s = 0.00000000e+00;
	float weight_h = 0.00000000e+00;
	float weight_m = 0.00000000e+00;
	switch (V_xpd80_SMH_xseparation_mode)
	{
	case 0: {
		float _809 = pLuma * 2.00000000e+00;
		float _811 = 1.00000000e+00 - _809;
		float _813 = max(_811, 0.00000000e+00);
		float _814;
		_814 = _813;
		float _815 = F_xpd80_SMH_xcurve(_814);
		weight_s = _815;
		float _817 = pLuma - 5.00000000e-01;
		float _819 = _817 * 2.00000000e+00;
		float _821 = max(_819, 0.00000000e+00);
		float _822;
		_822 = _821;
		float _823 = F_xpd80_SMH_xcurve(_822);
		weight_h = _823;
		float _825 = 1.00000000e+00 - weight_s;
		float _826 = _825 - weight_h;
		float _827 = clamp(_826, 0.0, 1.0);
		weight_m = _827;
		break;
	}
	case 1: {
		float _830 = 1.00000000e+00 - pLuma;
		float _832 = pow(_830, 4.00000000e+00);
		weight_s = _832;
		float _834 = pow(pLuma, 4.00000000e+00);
		weight_h = _834;
		float _836 = 1.00000000e+00 - weight_s;
		float _837 = _836 - weight_h;
		float _838 = clamp(_837, 0.0, 1.0);
		weight_m = _838;
		break;
	}
	}
	vec3 cold = vec3(0.00000000e+00, 3.65000010e-01, 1.00000000e+00);
	vec3 warm = vec3(9.80000019e-01, 5.88000000e-01, 0.00000000e+00);
	float _843 = V_xpd80_SMH_xexposure_s * weight_s;
	vec3 _844;
	float _845;
	_844 = color_764.xyz;
	_845 = _843;
	vec3 _847 = F_xexposure(_844, _845);
	color_764.xyz = _847;
	float _848 = V_xpd80_SMH_xcontrast_s * weight_s;
	vec3 _849;
	float _850;
	_849 = color_764.xyz;
	_850 = _848;
	vec3 _852 = F_xcon(_849, _850);
	color_764.xyz = _852;
	float _853 = V_xpd80_SMH_xbrightness_s * weight_s;
	vec3 _854;
	float _855;
	_854 = color_764.xyz;
	_855 = _853;
	vec3 _857 = F_xbri(_854, _855);
	color_764.xyz = _857;
	float _858 = V_xpd80_SMH_xopacity_s * weight_s;
	vec3 _859;
	vec3 _860;
	int _861;
	float _862;
	_859 = color_764.xyz;
	_860 = V_xpd80_SMH_xblendcolor_s.xyz;
	_861 = V_xpd80_SMH_xblendmode_s;
	_862 = _858;
	vec3 _865 = F_xblendmode(_859, _860, _861, _862);
	color_764.xyz = _865;
	bool _870 = V_xpd80_SMH_xtint_s < 0.00000000e+00;
	if (_870)
	{
		vec3 _871;
		vec3 _872;
		_871 = color_764.xyz;
		_872 = cold.xyz;
		vec3 _875 = F_xsoftlight(_871, _872);
		float _876 = V_xpd80_SMH_xtint_s * weight_s;
		float _877 = abs(_876);
		vec3 _880 = mix(color_764.xyz, _875, vec3(_877));
		color_764.xyz = _880;
	}
	else
	{
		vec3 _881;
		vec3 _882;
		_881 = color_764.xyz;
		_882 = warm.xyz;
		vec3 _885 = F_xsoftlight(_881, _882);
		float _886 = V_xpd80_SMH_xtint_s * weight_s;
		vec3 _889 = mix(color_764.xyz, _885, vec3(_886));
		color_764.xyz = _889;
	}
	float _890 = V_xpd80_SMH_xsaturation_s * weight_s;
	vec3 _891;
	float _892;
	_891 = color_764.xyz;
	_892 = _890;
	vec3 _894 = F_xsat(_891, _892);
	color_764.xyz = _894;
	float _895 = V_xpd80_SMH_xvibrance_s * weight_s;
	vec3 _896;
	float _897;
	_896 = color_764.xyz;
	_897 = _895;
	vec3 _899 = F_xvib(_896, _897);
	color_764.xyz = _899;
	float _900 = V_xpd80_SMH_xexposure_m * weight_m;
	vec3 _901;
	float _902;
	_901 = color_764.xyz;
	_902 = _900;
	vec3 _904 = F_xexposure(_901, _902);
	color_764.xyz = _904;
	float _905 = V_xpd80_SMH_xcontrast_m * weight_m;
	vec3 _906;
	float _907;
	_906 = color_764.xyz;
	_907 = _905;
	vec3 _909 = F_xcon(_906, _907);
	color_764.xyz = _909;
	float _910 = V_xpd80_SMH_xbrightness_m * weight_m;
	vec3 _911;
	float _912;
	_911 = color_764.xyz;
	_912 = _910;
	vec3 _914 = F_xbri(_911, _912);
	color_764.xyz = _914;
	float _915 = V_xpd80_SMH_xopacity_m * weight_m;
	vec3 _916;
	vec3 _917;
	int _918;
	float _919;
	_916 = color_764.xyz;
	_917 = V_xpd80_SMH_xblendcolor_m.xyz;
	_918 = V_xpd80_SMH_xblendmode_m;
	_919 = _915;
	vec3 _922 = F_xblendmode(_916, _917, _918, _919);
	color_764.xyz = _922;
	bool _927 = V_xpd80_SMH_xtint_m < 0.00000000e+00;
	if (_927)
	{
		vec3 _928;
		vec3 _929;
		_928 = color_764.xyz;
		_929 = cold.xyz;
		vec3 _932 = F_xsoftlight(_928, _929);
		float _933 = V_xpd80_SMH_xtint_m * weight_m;
		float _934 = abs(_933);
		vec3 _937 = mix(color_764.xyz, _932, vec3(_934));
		color_764.xyz = _937;
	}
	else
	{
		vec3 _938;
		vec3 _939;
		_938 = color_764.xyz;
		_939 = warm.xyz;
		vec3 _942 = F_xsoftlight(_938, _939);
		float _943 = V_xpd80_SMH_xtint_m * weight_m;
		vec3 _946 = mix(color_764.xyz, _942, vec3(_943));
		color_764.xyz = _946;
	}
	float _947 = V_xpd80_SMH_xsaturation_m * weight_m;
	vec3 _948;
	float _949;
	_948 = color_764.xyz;
	_949 = _947;
	vec3 _951 = F_xsat(_948, _949);
	color_764.xyz = _951;
	float _952 = V_xpd80_SMH_xvibrance_m * weight_m;
	vec3 _953;
	float _954;
	_953 = color_764.xyz;
	_954 = _952;
	vec3 _956 = F_xvib(_953, _954);
	color_764.xyz = _956;
	float _957 = V_xpd80_SMH_xexposure_h * weight_h;
	vec3 _958;
	float _959;
	_958 = color_764.xyz;
	_959 = _957;
	vec3 _961 = F_xexposure(_958, _959);
	color_764.xyz = _961;
	float _962 = V_xpd80_SMH_xcontrast_h * weight_h;
	vec3 _963;
	float _964;
	_963 = color_764.xyz;
	_964 = _962;
	vec3 _966 = F_xcon(_963, _964);
	color_764.xyz = _966;
	float _967 = V_xpd80_SMH_xbrightness_h * weight_h;
	vec3 _968;
	float _969;
	_968 = color_764.xyz;
	_969 = _967;
	vec3 _971 = F_xbri(_968, _969);
	color_764.xyz = _971;
	float _972 = V_xpd80_SMH_xopacity_h * weight_h;
	vec3 _973;
	vec3 _974;
	int _975;
	float _976;
	_973 = color_764.xyz;
	_974 = V_xpd80_SMH_xblendcolor_h.xyz;
	_975 = V_xpd80_SMH_xblendmode_h;
	_976 = _972;
	vec3 _979 = F_xblendmode(_973, _974, _975, _976);
	color_764.xyz = _979;
	bool _984 = V_xpd80_SMH_xtint_h < 0.00000000e+00;
	if (_984)
	{
		vec3 _985;
		vec3 _986;
		_985 = color_764.xyz;
		_986 = cold.xyz;
		vec3 _989 = F_xsoftlight(_985, _986);
		float _990 = V_xpd80_SMH_xtint_h * weight_h;
		float _991 = abs(_990);
		vec3 _994 = mix(color_764.xyz, _989, vec3(_991));
		color_764.xyz = _994;
	}
	else
	{
		vec3 _995;
		vec3 _996;
		_995 = color_764.xyz;
		_996 = warm.xyz;
		vec3 _999 = F_xsoftlight(_995, _996);
		float _1000 = V_xpd80_SMH_xtint_h * weight_h;
		vec3 _1003 = mix(color_764.xyz, _999, vec3(_1000));
		color_764.xyz = _1003;
	}
	float _1004 = V_xpd80_SMH_xsaturation_h * weight_h;
	vec3 _1005;
	float _1006;
	_1005 = color_764.xyz;
	_1006 = _1004;
	vec3 _1008 = F_xsat(_1005, _1006);
	color_764.xyz = _1008;
	float _1009 = V_xpd80_SMH_xvibrance_h * weight_h;
	vec3 _1010;
	float _1011;
	_1010 = color_764.xyz;
	_1011 = _1009;
	vec3 _1013 = F_xvib(_1010, _1011);
	color_764.xyz = _1013;
	vec4 _1018 = vec4(color_764.xyz.x, color_764.xyz.y, color_764.xyz.z, 1.00000000e+00);
	return _1018;
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
#ifdef E_xpd80_SMH_xPS_SMH
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_SMH_xPS_SMH(pos, texcoord);
	return;
}
#endif
