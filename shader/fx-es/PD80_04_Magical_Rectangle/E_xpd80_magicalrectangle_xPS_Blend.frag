#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_magicalrectangle_xPS_Blend
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
uniform int V_xpd80_magicalrectangle_xshape;
uniform bool V_xpd80_magicalrectangle_xinvert_shape;
uniform uint V_xpd80_magicalrectangle_xrotation;
uniform vec2 V_xpd80_magicalrectangle_xcenter;
uniform float V_xpd80_magicalrectangle_xret_size_x;
uniform float V_xpd80_magicalrectangle_xret_size_y;
uniform float V_xpd80_magicalrectangle_xdepthpos;
uniform float V_xpd80_magicalrectangle_xsmoothing;
uniform float V_xpd80_magicalrectangle_xdepth_smoothing;
uniform float V_xpd80_magicalrectangle_xdither_strength;
uniform vec3 V_xpd80_magicalrectangle_xreccolor;
uniform float V_xpd80_magicalrectangle_xmr_exposure;
uniform float V_xpd80_magicalrectangle_xmr_contrast;
uniform float V_xpd80_magicalrectangle_xmr_brightness;
uniform float V_xpd80_magicalrectangle_xmr_hue;
uniform float V_xpd80_magicalrectangle_xmr_saturation;
uniform float V_xpd80_magicalrectangle_xmr_vibrance;
uniform bool V_xpd80_magicalrectangle_xenable_gradient;
uniform bool V_xpd80_magicalrectangle_xgradient_type;
uniform float V_xpd80_magicalrectangle_xgradient_curve;
uniform float V_xpd80_magicalrectangle_xintensity_boost;
uniform int V_xpd80_magicalrectangle_xblendmode_1;
uniform float V_xpd80_magicalrectangle_xopacity;
uniform bool V_xpd80_magicalrectangle_xhasdepth;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xpd80_magicalrectangle_xsamplerMagicRectangle;
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
vec3 F_xHUEToRGB(
	in float H)
{
	float _568 = H * 6.00000000e+00;
	float _570 = _568 - 3.00000000e+00;
	float _571 = abs(_570);
	float _573 = _571 - 1.00000000e+00;
	float _575 = H * 6.00000000e+00;
	float _577 = _575 - 2.00000000e+00;
	float _578 = abs(_577);
	float _580 = 2.00000000e+00 - _578;
	float _582 = H * 6.00000000e+00;
	float _584 = _582 - 4.00000000e+00;
	float _585 = abs(_584);
	float _587 = 2.00000000e+00 - _585;
	vec3 _588 = vec3(_573, _580, _587);
	vec3 _589 = clamp(_588, 0.0, 1.0);
	return _589;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _595 = RGB.y < RGB.z;
	vec4 _600 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _605 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _607 = compCond(bvec4(_595), _600, _605);
	vec4 P = _607;
	bool _611 = RGB.x < P.x;
	vec4 _616 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _621 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _623 = compCond(bvec4(_611), _616, _621);
	vec4 Q1 = _623;
	float _627 = min(Q1.w, Q1.y);
	float _629 = Q1.x - _627;
	float C = _629;
	float _633 = Q1.w - Q1.y;
	float _635 = 6.00000000e+00 * C;
	float _637 = _635 + 9.99999997e-07;
	float _638 = _633 / _637;
	float _640 = _638 + Q1.z;
	float _641 = abs(_640);
	float H_642 = _641;
	vec3 _644 = vec3(H_642, C, Q1.x);
	return _644;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _650 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _650;
	vec3 _651;
	_651 = RGB;
	vec3 _652 = F_xRGBToHCV(_651);
	vec3 HCV = _652;
	float _656 = HCV.y * 5.00000000e-01;
	float _658 = HCV.z - _656;
	float L = _658;
	float _661 = L * 2.00000000e+00;
	float _663 = _661 - 1.00000000e+00;
	float _664 = abs(_663);
	float _666 = 1.00000000e+00 - _664;
	float _668 = _666 + 9.99999997e-07;
	float _670 = HCV.y / _668;
	float S = _670;
	vec3 _673 = vec3(HCV.x, S, L);
	return _673;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _677;
	_677 = HSL.x;
	vec3 _679 = F_xHUEToRGB(_677);
	vec3 RGB_680 = _679;
	float _683 = 2.00000000e+00 * HSL.z;
	float _685 = _683 - 1.00000000e+00;
	float _686 = abs(_685);
	float _688 = 1.00000000e+00 - _686;
	float _690 = _688 * HSL.y;
	float C_691 = _690;
	vec3 _693 = RGB_680 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _695 = _693 * vec3(C_691);
	vec3 _697 = _695 + vec3(HSL.z);
	return _697;
}
vec3 F_xRGBToHSV(
	in vec3 c)
{
	vec4 K = vec4(0.00000000e+00, -3.33333343e-01, 6.66666687e-01, -1.00000000e+00);
	bool _705 = c.y < c.z;
	vec4 _710 = vec4(c.zy.x, c.zy.y, K.wz.x, K.wz.y);
	vec4 _715 = vec4(c.yz.x, c.yz.y, K.xy.x, K.xy.y);
	vec4 _717 = compCond(bvec4(_705), _710, _715);
	vec4 p = _717;
	bool _721 = c.x < p.x;
	vec4 _726 = vec4(p.xyw.x, p.xyw.y, p.xyw.z, c.x);
	vec4 _731 = vec4(c.x, p.yzx.x, p.yzx.y, p.yzx.z);
	vec4 _733 = compCond(bvec4(_721), _726, _731);
	vec4 q = _733;
	float _737 = min(q.w, q.y);
	float _739 = q.x - _737;
	float d = _739;
	float e = 1.00000001e-10;
	float _745 = q.w - q.y;
	float _747 = 6.00000000e+00 * d;
	float _748 = _747 + e;
	float _749 = _745 / _748;
	float _751 = q.z + _749;
	float _752 = abs(_751);
	float _754 = q.x + e;
	float _755 = d / _754;
	vec3 _757 = vec3(_752, _755, q.x);
	return _757;
}
vec3 F_xHSVToRGB(
	in vec3 c)
{
	vec4 K_762 = vec4(1.00000000e+00, 6.66666687e-01, 3.33333343e-01, 3.00000000e+00);
	vec3 _765 = c.xxx + K_762.xyz;
	vec3 _766 = fract(_765);
	vec3 _768 = _766 * vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec3 _770 = _768 - K_762.www;
	vec3 _771 = abs(_770);
	vec3 p_772 = _771;
	vec3 _774 = p_772 - K_762.xxx;
	vec3 _775 = clamp(_774, 0.0, 1.0);
	vec3 _778 = mix(K_762.xxx, _775, vec3(c.y));
	vec3 _780 = vec3(c.z) * _778;
	return _780;
}
vec3 F_xKelvinToRGB(
	in float k)
{
	vec3 ret_785 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _788 = clamp(k, 1.00000000e+03, 4.00000000e+04);
	float _790 = _788 / 1.00000000e+02;
	float kelvin = _790;
	bool _796 = kelvin <= 6.60000000e+01;
	if (_796)
	{
		ret_785[0] = 1.00000000e+00;
		float _798 = log(kelvin);
		float _800 = 3.90081584e-01 * _798;
		float _802 = _800 - 6.31841421e-01;
		float _803 = clamp(_802, 0.0, 1.0);
		ret_785[1] = _803;
	}
	else
	{
		float _805 = kelvin - 6.00000000e+01;
		float _807 = max(_805, 0.00000000e+00);
		float t = _807;
		float _810 = pow(t, -1.33204758e-01);
		float _812 = 1.29293621e+00 * _810;
		float _813 = clamp(_812, 0.0, 1.0);
		ret_785[0] = _813;
		float _815 = pow(t, -7.55148456e-02);
		float _817 = 1.12989092e+00 * _815;
		float _818 = clamp(_817, 0.0, 1.0);
		ret_785[1] = _818;
	}
	bool _823 = kelvin >= 6.60000000e+01;
	if (_823)
	{
		ret_785[2] = 1.00000000e+00;
	}
	else
	{
		bool _829 = kelvin < 1.90000000e+01;
		if (_829)
		{
			ret_785[2] = 0.00000000e+00;
		}
		else
		{
			float _832 = kelvin - 1.00000000e+01;
			float _833 = log(_832);
			float _835 = 5.43206811e-01 * _833;
			float _837 = _835 - 1.19625413e+00;
			float _838 = clamp(_837, 0.0, 1.0);
			ret_785[2] = _838;
		}
	}
	return ret_785;
}
vec3 F_xLinearTosRGB(
	in vec3 color)
{
	vec3 _843 = color * vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x = _843;
	vec3 _845 = clamp(color, 0.0, 1.0);
	vec3 _847 = pow(_845, vec3(4.16666657e-01, 4.16666657e-01, 4.16666657e-01));
	vec3 _849 = vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00) * _847;
	vec3 _851 = _849 - vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 y = _851;
	vec3 clr = color;
	bool _856 = color.x < 3.13080009e-03;
	float _859 = _856 ? x.x : y.x;
	clr[0] = _859;
	bool _862 = color.y < 3.13080009e-03;
	float _865 = _862 ? x.y : y.y;
	clr[1] = _865;
	bool _868 = color.z < 3.13080009e-03;
	float _871 = _868 ? x.z : y.z;
	clr[2] = _871;
	return clr;
}
vec3 F_xSRGBToLinear(
	in vec3 color)
{
	vec3 _876 = color / vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x_877 = _876;
	vec3 _879 = color + vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 _881 = _879 / vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00);
	vec3 _883 = max(_881, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _885 = pow(_883, vec3(2.40000010e+00, 2.40000010e+00, 2.40000010e+00));
	vec3 y_886 = _885;
	vec3 clr_887 = color;
	bool _890 = color.x <= 4.04499993e-02;
	float _893 = _890 ? x_877.x : y_886.x;
	clr_887[0] = _893;
	bool _896 = color.y <= 4.04499993e-02;
	float _899 = _896 ? x_877.y : y_886.y;
	clr_887[1] = _899;
	bool _902 = color.z <= 4.04499993e-02;
	float _905 = _902 ? x_877.z : y_886.z;
	clr_887[2] = _905;
	return clr_887;
}
vec3 F_xpd80_xyz_to_lab(
	in vec3 c)
{
	vec3 _910 = c / vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	vec3 _912 = max(_910, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 w = _912;
	vec3 v = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _918 = w.x > 8.85645207e-03;
	float _921 = pow(w.x, 3.33333343e-01);
	float _924 = 9.03296326e+02 * w.x;
	float _926 = _924 + 1.60000000e+01;
	float _928 = _926 / 1.16000000e+02;
	float _929 = _918 ? _921 : _928;
	v[0] = _929;
	bool _932 = w.y > 8.85645207e-03;
	float _935 = pow(w.y, 3.33333343e-01);
	float _938 = 9.03296326e+02 * w.y;
	float _940 = _938 + 1.60000000e+01;
	float _942 = _940 / 1.16000000e+02;
	float _943 = _932 ? _935 : _942;
	v[1] = _943;
	bool _946 = w.z > 8.85645207e-03;
	float _949 = pow(w.z, 3.33333343e-01);
	float _952 = 9.03296326e+02 * w.z;
	float _954 = _952 + 1.60000000e+01;
	float _956 = _954 / 1.16000000e+02;
	float _957 = _946 ? _949 : _956;
	v[2] = _957;
	float _960 = 1.16000000e+02 * v.y;
	float _962 = _960 - 1.60000000e+01;
	float _965 = v.x - v.y;
	float _967 = 5.00000000e+02 * _965;
	float _970 = v.y - v.z;
	float _972 = 2.00000000e+02 * _970;
	vec3 _973 = vec3(_962, _967, _972);
	return _973;
}
vec3 F_xpd80_lab_to_xyz(
	in vec3 c)
{
	vec3 v_978 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _981 = c.x + 1.60000000e+01;
	float _983 = _981 / 1.16000000e+02;
	v_978[1] = _983;
	float _986 = c.y / 5.00000000e+02;
	float _988 = _986 + v_978.y;
	v_978[0] = _988;
	float _991 = c.z / 2.00000000e+02;
	float _993 = v_978.y - _991;
	v_978[2] = _993;
	float _996 = v_978.x * v_978.x;
	float _998 = _996 * v_978.x;
	bool _1000 = _998 > 8.85645207e-03;
	float _1003 = v_978.x * v_978.x;
	float _1005 = _1003 * v_978.x;
	float _1008 = 1.16000000e+02 * v_978.x;
	float _1010 = _1008 - 1.60000000e+01;
	float _1012 = _1010 / 9.03296326e+02;
	float _1013 = _1000 ? _1005 : _1012;
	bool _1016 = c.x > 8.00000095e+00;
	float _1019 = v_978.y * v_978.y;
	float _1021 = _1019 * v_978.y;
	float _1024 = c.x / 9.03296326e+02;
	float _1025 = _1016 ? _1021 : _1024;
	float _1028 = v_978.z * v_978.z;
	float _1030 = _1028 * v_978.z;
	bool _1032 = _1030 > 8.85645207e-03;
	float _1035 = v_978.z * v_978.z;
	float _1037 = _1035 * v_978.z;
	float _1040 = 1.16000000e+02 * v_978.z;
	float _1042 = _1040 - 1.60000000e+01;
	float _1044 = _1042 / 9.03296326e+02;
	float _1045 = _1032 ? _1037 : _1044;
	vec3 _1046 = vec3(_1013, _1025, _1045);
	vec3 _1048 = _1046 * vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00);
	return _1048;
}
vec3 F_xpd80_srgb_to_xyz(
	in vec3 c)
{
	vec3 _1053 = (c * mat3x3(4.12456393e-01, 3.57576102e-01, 1.80437505e-01, 2.12672904e-01, 7.15152204e-01, 7.21750036e-02, 1.93339009e-02, 1.19191997e-01, 9.50304091e-01));
	return _1053;
}
vec3 F_xpd80_xyz_to_srgb(
	in vec3 c)
{
	vec3 _1058 = (c * mat3x3(3.24045420e+00, -1.53713846e+00, -4.98531401e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 5.56433983e-02, -2.04025894e-01, 1.05722523e+00));
	return _1058;
}
vec3 F_xpd80_srgb_to_lab(
	in vec3 c)
{
	vec3 _1062;
	_1062 = c;
	vec3 _1063 = F_xpd80_srgb_to_xyz(_1062);
	vec3 lab = _1063;
	vec3 _1065;
	_1065 = lab;
	vec3 _1066 = F_xpd80_xyz_to_lab(_1065);
	lab = _1066;
	vec3 _1068 = lab / vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	return _1068;
}
vec3 F_xpd80_lab_to_srgb(
	in vec3 c)
{
	vec3 _1073 = c * vec3(1.00000000e+02, 1.08000000e+02, 1.08000000e+02);
	vec3 _1074;
	_1074 = _1073;
	vec3 _1075 = F_xpd80_lab_to_xyz(_1074);
	vec3 rgb = _1075;
	vec3 _1078 = min(rgb, vec3(9.50469971e-01, 1.00000000e+00, 1.08882999e+00));
	vec3 _1080 = max(_1078, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _1081;
	_1081 = _1080;
	vec3 _1082 = F_xpd80_xyz_to_srgb(_1081);
	rgb = _1082;
	vec3 _1083 = clamp(rgb, 0.0, 1.0);
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
vec3 F_xpd80_magicalrectangle_xhue(
	in vec3 res,
	in float shift,
	in float x)
{
	vec3 _1260;
	_1260 = res.xyz;
	vec3 _1262 = F_xRGBToHSL(_1260);
	vec3 hsl = _1262;
	float _1265 = shift + 1.00000000e+00;
	float _1267 = _1265 / 2.00000000e+00;
	float _1269 = hsl.x + _1267;
	float _1271 = _1269 - 5.00000000e-01;
	float _1272 = fract(_1271);
	hsl[0] = _1272;
	vec3 _1273;
	_1273 = hsl.xyz;
	vec3 _1275 = F_xHSLToRGB(_1273);
	hsl.xyz = _1275;
	vec3 _1279 = mix(res.xyz, hsl.xyz, vec3(x));
	return _1279;
}
float F_xpd80_magicalrectangle_xcurve(
	in float x)
{
	float _1283 = x * x;
	float _1284 = _1283 * x;
	float _1286 = x * 6.00000000e+00;
	float _1288 = _1286 - 1.50000000e+01;
	float _1289 = x * _1288;
	float _1291 = _1289 + 1.00000000e+01;
	float _1292 = _1284 * _1291;
	return _1292;
}
void F_xpd80_magicalrectangle_xPPVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord,
	out vec2 texcoord2)
{
	uint _1299;
	vec4 _1300;
	vec2 _1301;
	_1299 = id;
	F_xPostProcessVS(_1299, _1300, _1301);
	position = _1300;
	texcoord = _1301;
	vec2 uv = vec2(0.00000000e+00, 0.00000000e+00);
	bool _1306 = id == 2u;
	float _1309 = _1306 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _1309;
	bool _1311 = id == 1u;
	float _1314 = _1311 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _1314;
	vec2 _1317 = uv.xy - V_xpd80_magicalrectangle_xcenter.xy;
	uv.xy = _1317;
	float _1320 = uv.y / 1.77777779e+00;
	uv[1] = _1320;
	float _1322 = sqrt(4.85280000e+06);
	float _1323 = ceil(_1322);
	float dim = _1323;
	int _1327 = min(1920, 1080);
	float maxlen = float(_1327);
	float _1330 = dim / maxlen;
	dim = _1330;
	vec2 _1333 = uv.xy / vec2(dim);
	uv.xy = _1333;
	float _1335 = radians(float(V_xpd80_magicalrectangle_xrotation));
	float _1336 = sin(_1335);
	float _sin = _1336;
	float _1339 = radians(float(V_xpd80_magicalrectangle_xrotation));
	float _1340 = cos(_1339);
	float _cos = _1340;
	float _1343 = uv.x * _cos;
	float _1344 = -(_sin);
	float _1346 = uv.y * _1344;
	float _1347 = _1343 + _1346;
	texcoord2[0] = _1347;
	float _1349 = uv.x * _sin;
	float _1351 = uv.y * _cos;
	float _1352 = _1349 + _1351;
	texcoord2[1] = _1352;
	vec2 _1355 = texcoord2.xy + vec2(5.00000000e-01, 5.00000000e-01);
	texcoord2.xy = _1355;
	return;
}
vec4 F_xpd80_magicalrectangle_xPS_Layer_1(
	in vec4 pos,
	in vec2 texcoord,
	in vec2 texcoord2)
{
	vec4 _1361 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_1362 = _1361;
	vec2 _1363;
	_1363 = texcoord;
	float _1364 = F_xReShade_xGetLinearizedDepth(_1363);
	float depth_1365 = _1364;
	float _1367 = sqrt(4.85280000e+06);
	float _1368 = ceil(_1367);
	float dim_1369 = _1368;
	int _1372 = max(1920, 1080);
	float maxlen_1374 = float(_1372);
	float _1375 = dim_1369 / maxlen_1374;
	dim_1369 = _1375;
	vec2 uv_1377 = texcoord2.xy;
	vec2 _1380 = uv_1377.xy * vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _1382 = _1380 - vec2(1.00000000e+00, 1.00000000e+00);
	uv_1377.xy = _1382;
	float _1383 = V_xpd80_magicalrectangle_xret_size_x * V_xpd80_magicalrectangle_xsmoothing;
	float _1384 = V_xpd80_magicalrectangle_xret_size_x + _1383;
	float _1385 = V_xpd80_magicalrectangle_xret_size_y * V_xpd80_magicalrectangle_xsmoothing;
	float _1386 = V_xpd80_magicalrectangle_xret_size_y + _1385;
	vec2 _1387 = vec2(_1384, _1386);
	vec2 _1389 = _1387 * vec2(dim_1369);
	vec2 _1391 = uv_1377.xy / _1389;
	uv_1377.xy = _1391;
	switch (V_xpd80_magicalrectangle_xshape)
	{
	case 0: {
		uv_1377.xy = uv_1377.xy;
		break;
	}
	case 1: {
		float _1398 = dot(uv_1377.xy, uv_1377.xy);
		vec2 _1400 = -(uv_1377.xy);
		float _1402 = dot(uv_1377.xy, _1400);
		float _1404 = mix(_1398, _1402, float(V_xpd80_magicalrectangle_xgradient_type));
		uv_1377.xy = vec2(_1404);
		break;
	}
	}
	vec2 _1408 = uv_1377.xy + vec2(1.00000000e+00, 1.00000000e+00);
	vec2 _1410 = _1408 / vec2(2.00000000e+00, 2.00000000e+00);
	uv_1377.xy = _1410;
	float _1412 = 0.00000000e+00 + V_xpd80_magicalrectangle_xsmoothing;
	vec2 _1416 = smoothstep(vec2(0.00000000e+00, 0.00000000e+00), vec2(_1412), uv_1377.xy);
	vec2 bl = _1416;
	float _1419 = 0.00000000e+00 + V_xpd80_magicalrectangle_xsmoothing;
	vec2 _1422 = vec2(1.00000000e+00, 1.00000000e+00) - uv_1377.xy;
	vec2 _1425 = smoothstep(vec2(0.00000000e+00, 0.00000000e+00), vec2(_1419), _1422);
	vec2 tr = _1425;
	if (V_xpd80_magicalrectangle_xenable_gradient)
	{
		if (V_xpd80_magicalrectangle_xgradient_type)
		{
			float _1434 = 0.00000000e+00 + V_xpd80_magicalrectangle_xsmoothing;
			vec2 _1438 = smoothstep(vec2(0.00000000e+00, 0.00000000e+00), vec2(_1434), uv_1377.xy);
			float _1440 = abs(uv_1377.y);
			float _1441 = pow(_1440, V_xpd80_magicalrectangle_xgradient_curve);
			vec2 _1443 = _1438 * vec2(_1441);
			bl = _1443;
		}
		float _1445 = 0.00000000e+00 + V_xpd80_magicalrectangle_xsmoothing;
		vec2 _1448 = vec2(1.00000000e+00, 1.00000000e+00) - uv_1377.xy;
		vec2 _1451 = smoothstep(vec2(0.00000000e+00, 0.00000000e+00), vec2(_1445), _1448);
		float _1453 = abs(uv_1377.x);
		float _1454 = pow(_1453, V_xpd80_magicalrectangle_xgradient_curve);
		vec2 _1456 = _1451 * vec2(_1454);
		tr = _1456;
	}
	float _1457 = V_xpd80_magicalrectangle_xdepthpos - V_xpd80_magicalrectangle_xdepth_smoothing;
	float _1458 = V_xpd80_magicalrectangle_xdepthpos + V_xpd80_magicalrectangle_xdepth_smoothing;
	float _1459 = smoothstep(_1457, _1458, depth_1365);
	float depthfade = _1459;
	float _1463 = mix(1.00000000e+00, depthfade, float(V_xpd80_magicalrectangle_xhasdepth));
	depthfade = _1463;
	float _1466 = bl.x * bl.y;
	float _1468 = _1466 * tr.x;
	float _1470 = _1468 * tr.y;
	float _1471 = _1470 * depthfade;
	float R = _1471;
	float _1474 = 1.00000000e+00 - R;
	float _1475 = V_xpd80_magicalrectangle_xinvert_shape ? _1474 : R;
	R = _1475;
	vec3 _1476;
	_1476 = V_xpd80_magicalrectangle_xreccolor.xyz;
	vec3 _1478 = F_xRGBToHSV(_1476);
	float intensity = _1478.z;
	float _1482 = 1.00000000e+00 - R;
	float _1483 = clamp(_1482, 0.0, 1.0);
	vec3 _1486 = color_1362.xyz * vec3(_1483);
	float _1487 = R * intensity;
	vec3 _1489 = _1486 + vec3(_1487);
	vec3 _1490 = clamp(_1489, 0.0, 1.0);
	vec3 _1493 = mix(color_1362.xyz, _1490, vec3(R));
	color_1362.xyz = _1493;
	vec4 _1497 = vec4(color_1362.xyz.x, color_1362.xyz.y, color_1362.xyz.z, R);
	return _1497;
}
vec4 F_xpd80_magicalrectangle_xPS_Blend(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1502 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 orig = _1502;
	vec3 color_1505 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _1506 = texture(V_xpd80_magicalrectangle_xsamplerMagicRectangle, texcoord);
	vec4 _1507 = clamp(_1506, 0.0, 1.0);
	vec4 layer_1 = _1507;
	vec2 _1509;
	int _1510;
	bool _1511;
	float _1512;
	bool _1513;
	float _1514;
	_1509 = texcoord.xy;
	_1510 = 7;
	_1511 = true;
	_1512 = V_xpd80_magicalrectangle_xdither_strength;
	_1513 = true;
	_1514 = 5.00000000e-01;
	vec4 _1520 = F_xdither(V_xsamplerRGBNoise, _1509, _1510, _1511, _1512, _1513, _1514);
	vec4 dnoise = _1520;
	vec3 _1524 = layer_1.xyz + dnoise.xyz;
	vec3 _1525 = clamp(_1524, 0.0, 1.0);
	layer_1.xyz = _1525;
	float _1527 = V_xpd80_magicalrectangle_xmr_exposure * layer_1.w;
	vec3 _1528;
	float _1529;
	_1528 = orig.xyz;
	_1529 = _1527;
	vec3 _1531 = F_xexposure(_1528, _1529);
	orig.xyz = _1531;
	float _1533 = V_xpd80_magicalrectangle_xmr_contrast * layer_1.w;
	vec3 _1534;
	float _1535;
	_1534 = orig.xyz;
	_1535 = _1533;
	vec3 _1537 = F_xcon(_1534, _1535);
	orig.xyz = _1537;
	float _1539 = V_xpd80_magicalrectangle_xmr_brightness * layer_1.w;
	vec3 _1540;
	float _1541;
	_1540 = orig.xyz;
	_1541 = _1539;
	vec3 _1543 = F_xbri(_1540, _1541);
	orig.xyz = _1543;
	vec3 _1544;
	float _1545;
	float _1546;
	_1544 = orig.xyz;
	_1545 = V_xpd80_magicalrectangle_xmr_hue;
	_1546 = layer_1.w;
	vec3 _1549 = F_xpd80_magicalrectangle_xhue(_1544, _1545, _1546);
	orig.xyz = _1549;
	float _1551 = V_xpd80_magicalrectangle_xmr_saturation * layer_1.w;
	vec3 _1552;
	float _1553;
	_1552 = orig.xyz;
	_1553 = _1551;
	vec3 _1555 = F_xsat(_1552, _1553);
	orig.xyz = _1555;
	float _1557 = V_xpd80_magicalrectangle_xmr_vibrance * layer_1.w;
	vec3 _1558;
	float _1559;
	_1558 = orig.xyz;
	_1559 = _1557;
	vec3 _1561 = F_xvib(_1558, _1559);
	orig.xyz = _1561;
	vec3 _1563 = clamp(orig.xyz, 0.0, 1.0);
	orig.xyz = _1563;
	vec3 _1566 = layer_1.xyz * vec3(V_xpd80_magicalrectangle_xintensity_boost);
	vec3 _1567 = clamp(_1566, 0.0, 1.0);
	layer_1.xyz = _1567;
	vec3 _1568;
	_1568 = layer_1.xyz;
	vec3 _1570 = F_xRGBToHSV(_1568);
	layer_1.xyz = _1570;
	vec3 _1571;
	_1571 = V_xpd80_magicalrectangle_xreccolor.xyz;
	vec3 _1573 = F_xRGBToHSV(_1571);
	vec2 huesat = _1573.xy;
	vec3 _1579 = vec3(huesat.xy.x, huesat.xy.y, layer_1.z);
	vec3 _1580;
	_1580 = _1579;
	vec3 _1581 = F_xHSVToRGB(_1580);
	layer_1.xyz = _1581;
	vec3 _1583 = clamp(layer_1.xyz, 0.0, 1.0);
	layer_1.xyz = _1583;
	float _1585 = clamp(layer_1.w, 0.0, 1.0);
	float _1586 = _1585 * V_xpd80_magicalrectangle_xopacity;
	vec3 _1587;
	vec3 _1588;
	int _1589;
	float _1590;
	_1587 = orig.xyz;
	_1588 = layer_1.xyz;
	_1589 = V_xpd80_magicalrectangle_xblendmode_1;
	_1590 = _1586;
	vec3 _1593 = F_xblendmode(_1587, _1588, _1589, _1590);
	color_1505.xyz = _1593;
	vec4 _1598 = vec4(color_1505.xyz.x, color_1505.xyz.y, color_1505.xyz.z, 1.00000000e+00);
	return _1598;
}
#ifdef E_xpd80_magicalrectangle_xPPVS
layout(location = 0) out vec2 _out_texcoord;
layout(location = 2) out vec2 _out_texcoord2;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 texcoord;
	vec2 texcoord2;
	F_xpd80_magicalrectangle_xPPVS(id, position, texcoord, texcoord2);
	gl_Position = position;
	_out_texcoord = texcoord;
	_out_texcoord2 = texcoord2;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xpd80_magicalrectangle_xPS_Layer_1
layout(location = 0) out vec4 _return;
in vec2 vv_0;
in vec2 vv_2;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec2 texcoord2 = vv_2;
	_return = F_xpd80_magicalrectangle_xPS_Layer_1(pos, texcoord, texcoord2);
	return;
}
#endif
#ifdef E_xpd80_magicalrectangle_xPS_Blend
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_magicalrectangle_xPS_Blend(pos, texcoord);
	return;
}
#endif
