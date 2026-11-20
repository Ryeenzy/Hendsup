#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_ColorGradients_xPS_ColorGradients
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
uniform int V_xpd80_ColorGradients_xluma_mode;
uniform int V_xpd80_ColorGradients_xseparation_mode;
uniform bool V_xpd80_ColorGradients_xenable_dither;
uniform float V_xpd80_ColorGradients_xdither_strength;
uniform float V_xpd80_ColorGradients_xCGdesat;
uniform float V_xpd80_ColorGradients_xfinalmix;
uniform vec3 V_xpd80_ColorGradients_xblendcolor_ls_m;
uniform int V_xpd80_ColorGradients_xblendmode_ls_m;
uniform float V_xpd80_ColorGradients_xopacity_ls_m;
uniform vec3 V_xpd80_ColorGradients_xblendcolor_ls_s;
uniform int V_xpd80_ColorGradients_xblendmode_ls_s;
uniform float V_xpd80_ColorGradients_xopacity_ls_s;
uniform bool V_xpd80_ColorGradients_xenable_ds;
uniform vec3 V_xpd80_ColorGradients_xblendcolor_ds_m;
uniform int V_xpd80_ColorGradients_xblendmode_ds_m;
uniform float V_xpd80_ColorGradients_xopacity_ds_m;
uniform vec3 V_xpd80_ColorGradients_xblendcolor_ds_s;
uniform int V_xpd80_ColorGradients_xblendmode_ds_s;
uniform float V_xpd80_ColorGradients_xopacity_ds_s;
uniform float V_xpd80_ColorGradients_xminlevel;
uniform float V_xpd80_ColorGradients_xmaxlevel;
uniform float V_xpd80_ColorGradients_xFrametime;
uniform vec2 V_xpd80_ColorGradients_xpingpong;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xpd80_ColorGradients_xsamplerLuma;
uniform sampler2D V_xpd80_ColorGradients_xsamplerAvgLuma;
uniform sampler2D V_xpd80_ColorGradients_xsamplerPrevAvgLuma;
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
float F_xpd80_ColorGradients_xgetLuminance(
	in vec3 x)
{
	float _597 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _597;
}
float F_xpd80_ColorGradients_xcurve(
	in float x)
{
	float _601 = x * x;
	float _603 = 2.00000000e+00 * x;
	float _605 = 3.00000000e+00 - _603;
	float _606 = _601 * _605;
	return _606;
}
float F_xpd80_ColorGradients_xPS_WriteLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _611 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_612 = _611;
	float _615 = max(color_612.x, color_612.y);
	float _617 = max(_615, color_612.z);
	float luma = _617;
	return luma;
}
float F_xpd80_ColorGradients_xPS_AvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _624 = textureLod(V_xpd80_ColorGradients_xsamplerLuma, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).xy, vec4(5.00000000e-01, 5.00000000e-01, 0.00000000e+00, 8.00000000e+00).w);
	float luma_626 = _624.x;
	vec4 _628 = texture(V_xpd80_ColorGradients_xsamplerPrevAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float prevluma = _628.x;
	float _632 = V_xpd80_ColorGradients_xFrametime * 3.00000003e-03;
	float _633 = clamp(_632, 0.0, 1.0);
	float _634 = mix(prevluma, luma_626, _633);
	float avgLuma = _634;
	return avgLuma;
}
vec4 F_xpd80_ColorGradients_xPS_ColorGradients(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _640 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_641 = _640;
	vec4 _643 = texture(V_xpd80_ColorGradients_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float sceneluma = _643.x;
	bool _646 = V_xpd80_ColorGradients_xminlevel >= V_xpd80_ColorGradients_xmaxlevel;
	float _648 = V_xpd80_ColorGradients_xmaxlevel - 9.99999978e-03;
	float _649 = _646 ? _648 : V_xpd80_ColorGradients_xminlevel;
	float ml = _649;
	float _651 = smoothstep(ml, V_xpd80_ColorGradients_xmaxlevel, sceneluma);
	sceneluma = _651;
	vec3 _653 = clamp(color_641.xyz, 0.0, 1.0);
	color_641.xyz = _653;
	vec2 _654;
	int _655;
	bool _656;
	float _657;
	bool _658;
	float _659;
	_654 = texcoord.xy;
	_655 = 5;
	_656 = V_xpd80_ColorGradients_xenable_dither;
	_657 = V_xpd80_ColorGradients_xdither_strength;
	_658 = true;
	_659 = 5.00000000e-01;
	vec4 _664 = F_xdither(V_xsamplerRGBNoise, _654, _655, _656, _657, _658, _659);
	vec4 dnoise = _664;
	vec3 _668 = color_641.xyz + dnoise.xyz;
	vec3 _669 = clamp(_668, 0.0, 1.0);
	color_641.xyz = _669;
	float cWeight = 0.00000000e+00;
	switch (V_xpd80_ColorGradients_xluma_mode)
	{
	case 0: {
		float _676 = dot(color_641.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
		cWeight = _676;
		break;
	}
	case 1: {
		float _680 = dot(color_641.xyz, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
		cWeight = _680;
		break;
	}
	case 2: {
		float _684 = max(color_641.x, color_641.y);
		float _686 = max(_684, color_641.z);
		cWeight = _686;
		break;
	}
	}
	float w_s = 0.00000000e+00;
	float w_h = 0.00000000e+00;
	float w_m = 0.00000000e+00;
	switch (V_xpd80_ColorGradients_xseparation_mode)
	{
	case 0: {
		float _696 = cWeight * 2.00000000e+00;
		float _698 = 1.00000000e+00 - _696;
		float _700 = max(_698, 0.00000000e+00);
		float _701;
		_701 = _700;
		float _702 = F_xpd80_ColorGradients_xcurve(_701);
		w_s = _702;
		float _704 = cWeight - 5.00000000e-01;
		float _706 = _704 * 2.00000000e+00;
		float _708 = max(_706, 0.00000000e+00);
		float _709;
		_709 = _708;
		float _710 = F_xpd80_ColorGradients_xcurve(_709);
		w_h = _710;
		float _712 = 1.00000000e+00 - w_s;
		float _713 = _712 - w_h;
		float _714 = clamp(_713, 0.0, 1.0);
		w_m = _714;
		break;
	}
	case 1: {
		float _717 = 1.00000000e+00 - cWeight;
		float _719 = pow(_717, 4.00000000e+00);
		w_s = _719;
		float _721 = pow(cWeight, 4.00000000e+00);
		w_h = _721;
		float _723 = 1.00000000e+00 - w_s;
		float _724 = _723 - w_h;
		float _725 = clamp(_724, 0.0, 1.0);
		w_m = _725;
		break;
	}
	}
	vec3 _729 = mix(color_641.xyz, vec3(cWeight), vec3(V_xpd80_ColorGradients_xCGdesat));
	color_641.xyz = _729;
	vec3 LS_col = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 DS_col = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 _734;
	vec3 _735;
	int _736;
	float _737;
	_734 = color_641.xyz;
	_735 = V_xpd80_ColorGradients_xblendcolor_ls_s.xyz;
	_736 = V_xpd80_ColorGradients_xblendmode_ls_s;
	_737 = V_xpd80_ColorGradients_xopacity_ls_s;
	vec3 _740 = F_xblendmode(_734, _735, _736, _737);
	vec3 LS_b_s = _740;
	vec3 _742;
	vec3 _743;
	int _744;
	float _745;
	_742 = color_641.xyz;
	_743 = V_xpd80_ColorGradients_xblendcolor_ls_m.xyz;
	_744 = V_xpd80_ColorGradients_xblendmode_ls_m;
	_745 = V_xpd80_ColorGradients_xopacity_ls_m;
	vec3 _748 = F_xblendmode(_742, _743, _744, _745);
	vec3 LS_b_m = _748;
	vec3 _752 = LS_b_s.xyz * vec3(w_s);
	vec3 _755 = LS_b_m.xyz * vec3(w_m);
	vec3 _756 = _752 + _755;
	vec3 _758 = _756 + vec3(w_h);
	LS_col.xyz = _758;
	vec3 _759;
	vec3 _760;
	int _761;
	float _762;
	_759 = color_641.xyz;
	_760 = V_xpd80_ColorGradients_xblendcolor_ds_s.xyz;
	_761 = V_xpd80_ColorGradients_xblendmode_ds_s;
	_762 = V_xpd80_ColorGradients_xopacity_ds_s;
	vec3 _765 = F_xblendmode(_759, _760, _761, _762);
	vec3 DS_b_s = _765;
	vec3 _767;
	vec3 _768;
	int _769;
	float _770;
	_767 = color_641.xyz;
	_768 = V_xpd80_ColorGradients_xblendcolor_ds_m.xyz;
	_769 = V_xpd80_ColorGradients_xblendmode_ds_m;
	_770 = V_xpd80_ColorGradients_xopacity_ds_m;
	vec3 _773 = F_xblendmode(_767, _768, _769, _770);
	vec3 DS_b_m = _773;
	vec3 _777 = DS_b_s.xyz * vec3(w_s);
	vec3 _780 = DS_b_m.xyz * vec3(w_m);
	vec3 _781 = _777 + _780;
	vec3 _783 = _781 + vec3(w_h);
	DS_col.xyz = _783;
	vec3 _787 = mix(DS_col.xyz, LS_col.xyz, vec3(sceneluma));
	vec3 new_c = _787;
	vec3 _792 = compCond(bvec3(V_xpd80_ColorGradients_xenable_ds), new_c.xyz, LS_col.xyz);
	new_c.xyz = _792;
	vec3 _796 = mix(color_641.xyz, new_c.xyz, vec3(V_xpd80_ColorGradients_xfinalmix));
	color_641.xyz = _796;
	vec4 _801 = vec4(color_641.xyz.x, color_641.xyz.y, color_641.xyz.z, 1.00000000e+00);
	return _801;
}
float F_xpd80_ColorGradients_xPS_PrevAvgLuma(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _807 = texture(V_xpd80_ColorGradients_xsamplerAvgLuma, vec2(5.00000000e-01, 5.00000000e-01));
	float avgLuma_809 = _807.x;
	return avgLuma_809;
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
#ifdef E_xpd80_ColorGradients_xPS_WriteLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_ColorGradients_xPS_WriteLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_ColorGradients_xPS_AvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_ColorGradients_xPS_AvgLuma(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_ColorGradients_xPS_ColorGradients
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_ColorGradients_xPS_ColorGradients(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_ColorGradients_xPS_PrevAvgLuma
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_ColorGradients_xPS_PrevAvgLuma(pos, texcoord);
	return;
}
#endif
