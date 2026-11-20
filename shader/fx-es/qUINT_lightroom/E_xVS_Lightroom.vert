#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xVS_Lightroom
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
uniform bool V_xLIGHTROOM_ENABLE_LUT;
uniform int V_xLIGHTROOM_LUT_TILE_SIZE;
uniform int V_xLIGHTROOM_LUT_TILE_COUNT;
uniform int V_xLIGHTROOM_LUT_SCROLL;
uniform bool V_xLIGHTROOM_ENABLE_CURVE_DISPLAY;
uniform bool V_xLIGHTROOM_ENABLE_CLIPPING_DISPLAY;
uniform float V_xLIGHTROOM_RED_HUESHIFT;
uniform float V_xLIGHTROOM_ORANGE_HUESHIFT;
uniform float V_xLIGHTROOM_YELLOW_HUESHIFT;
uniform float V_xLIGHTROOM_GREEN_HUESHIFT;
uniform float V_xLIGHTROOM_AQUA_HUESHIFT;
uniform float V_xLIGHTROOM_BLUE_HUESHIFT;
uniform float V_xLIGHTROOM_MAGENTA_HUESHIFT;
uniform float V_xLIGHTROOM_RED_EXPOSURE;
uniform float V_xLIGHTROOM_ORANGE_EXPOSURE;
uniform float V_xLIGHTROOM_YELLOW_EXPOSURE;
uniform float V_xLIGHTROOM_GREEN_EXPOSURE;
uniform float V_xLIGHTROOM_AQUA_EXPOSURE;
uniform float V_xLIGHTROOM_BLUE_EXPOSURE;
uniform float V_xLIGHTROOM_MAGENTA_EXPOSURE;
uniform float V_xLIGHTROOM_RED_SATURATION;
uniform float V_xLIGHTROOM_ORANGE_SATURATION;
uniform float V_xLIGHTROOM_YELLOW_SATURATION;
uniform float V_xLIGHTROOM_GREEN_SATURATION;
uniform float V_xLIGHTROOM_AQUA_SATURATION;
uniform float V_xLIGHTROOM_BLUE_SATURATION;
uniform float V_xLIGHTROOM_MAGENTA_SATURATION;
uniform float V_xLIGHTROOM_GLOBAL_BLACK_LEVEL;
uniform float V_xLIGHTROOM_GLOBAL_WHITE_LEVEL;
uniform float V_xLIGHTROOM_GLOBAL_EXPOSURE;
uniform float V_xLIGHTROOM_GLOBAL_GAMMA;
uniform float V_xLIGHTROOM_GLOBAL_BLACKS_CURVE;
uniform float V_xLIGHTROOM_GLOBAL_SHADOWS_CURVE;
uniform float V_xLIGHTROOM_GLOBAL_MIDTONES_CURVE;
uniform float V_xLIGHTROOM_GLOBAL_HIGHLIGHTS_CURVE;
uniform float V_xLIGHTROOM_GLOBAL_WHITES_CURVE;
uniform float V_xLIGHTROOM_GLOBAL_CONTRAST;
uniform float V_xLIGHTROOM_GLOBAL_SATURATION;
uniform float V_xLIGHTROOM_GLOBAL_VIBRANCE;
uniform float V_xLIGHTROOM_GLOBAL_TEMPERATURE;
uniform float V_xLIGHTROOM_GLOBAL_TINT;
uniform bool V_xLIGHTROOM_ENABLE_VIGNETTE;
uniform bool V_xLIGHTROOM_VIGNETTE_SHOW_RADII;
uniform vec2 V_xLIGHTROOM_VIGNETTE_OFFS;
uniform float V_xLIGHTROOM_VIGNETTE_RADIUS_INNER;
uniform float V_xLIGHTROOM_VIGNETTE_RADIUS_OUTER;
uniform float V_xLIGHTROOM_VIGNETTE_WIDTH;
uniform float V_xLIGHTROOM_VIGNETTE_HEIGHT;
uniform float V_xLIGHTROOM_VIGNETTE_AMOUNT;
uniform float V_xLIGHTROOM_VIGNETTE_CURVE;
uniform vec3 V_xLIGHTROOM_VIGNETTE_COLOR;
uniform int V_xLIGHTROOM_VIGNETTE_BLEND_MODE;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
uniform sampler2D V_xsLutTexInternal;
struct S_xCurvesStruct
{
	vec2 levels;
	float exposure;
	float gamma;
	float contrast;
	float blacks;
	float shadows;
	float midtones;
	float highlights;
	float whites;
};
struct S_xPaletteStruct
{
	float hue[7];
	float saturation[7];
	float exposure[7];
};
struct S_xVignetteStruct
{
	vec2 ratio;
	vec2 radii;
	float amount;
	float curve;
	int blend;
	bool debug;
};
S_xCurvesStruct _234;
S_xPaletteStruct _256;
S_xVignetteStruct _260;
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _64 = uv.x / 1.00000000e+00;
	uv[0] = _64;
	float _67 = uv.y / 1.00000000e+00;
	uv[1] = _67;
	float _70 = uv.x - 0.00000000e+00;
	uv[0] = _70;
	float _73 = uv.y + 0.00000000e+00;
	uv[1] = _73;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _77;
	_77 = uv;
	vec2 _78 = F_xqUINT_xdepthtex_uv(_77);
	vec4 _83 = vec4(_78.x, _78.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _84 = textureLod(V_xqUINT_xsDepthBufferTex, _83.xy, _83.w);
	float depth = _84.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _91 = depth * 1.00000000e+00;
	depth = _91;
	float _93 = 1.00000000e+00 - depth;
	depth = _93;
	float _95 = depth * 9.99000000e+02;
	float _97 = 1.00000000e+03 - _95;
	float _98 = depth / _97;
	depth = _98;
	float _99 = clamp(depth, 0.0, 1.0);
	return _99;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _103;
	_103 = uv;
	float _104 = F_xqUINT_xget_depth(_103);
	float depth_105 = _104;
	float _106;
	_106 = depth_105;
	float _107 = F_xqUINT_xlinearize_depth(_106);
	depth_105 = _107;
	return depth_105;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _114 = id == 2u;
	float _117 = _114 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _117;
	bool _119 = id == 1u;
	float _122 = _119 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _122;
	vec2 _124 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _126 = _124 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _131 = vec4(_126.x, _126.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _131;
	return;
}
void F_xVS_Lightroom(
	in uint id,
	out vec4 position,
	out vec2 uv,
	out float huefactors[7])
{
	bool _141 = id == 2u;
	float _144 = _141 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _144;
	bool _146 = id == 1u;
	float _149 = _146 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _149;
	vec2 _151 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _153 = _151 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _158 = vec4(_153.x, _153.y, 0.00000000e+00, 1.00000000e+00);
	position = _158;
	bool _160 = V_xLIGHTROOM_RED_HUESHIFT > 0.00000000e+00;
	float _163 = mix(0.00000000e+00, 8.33333358e-02, V_xLIGHTROOM_RED_HUESHIFT);
	float _164 = -(V_xLIGHTROOM_RED_HUESHIFT);
	float _167 = mix(1.00000000e+00, 8.33333313e-01, _164);
	float _168 = _160 ? _163 : _167;
	huefactors[0] = _168;
	bool _170 = V_xLIGHTROOM_ORANGE_HUESHIFT > 0.00000000e+00;
	float _173 = mix(8.33333358e-02, 1.66666672e-01, V_xLIGHTROOM_ORANGE_HUESHIFT);
	float _174 = -(V_xLIGHTROOM_ORANGE_HUESHIFT);
	float _177 = mix(8.33333358e-02, 0.00000000e+00, _174);
	float _178 = _170 ? _173 : _177;
	huefactors[1] = _178;
	bool _180 = V_xLIGHTROOM_YELLOW_HUESHIFT > 0.00000000e+00;
	float _183 = mix(1.66666672e-01, 3.33333343e-01, V_xLIGHTROOM_YELLOW_HUESHIFT);
	float _184 = -(V_xLIGHTROOM_YELLOW_HUESHIFT);
	float _187 = mix(1.66666672e-01, 8.33333358e-02, _184);
	float _188 = _180 ? _183 : _187;
	huefactors[2] = _188;
	bool _190 = V_xLIGHTROOM_GREEN_HUESHIFT > 0.00000000e+00;
	float _193 = mix(3.33333343e-01, 5.00000000e-01, V_xLIGHTROOM_GREEN_HUESHIFT);
	float _194 = -(V_xLIGHTROOM_GREEN_HUESHIFT);
	float _197 = mix(3.33333343e-01, 1.66666672e-01, _194);
	float _198 = _190 ? _193 : _197;
	huefactors[3] = _198;
	bool _200 = V_xLIGHTROOM_AQUA_HUESHIFT > 0.00000000e+00;
	float _203 = mix(5.00000000e-01, 6.66666687e-01, V_xLIGHTROOM_AQUA_HUESHIFT);
	float _204 = -(V_xLIGHTROOM_AQUA_HUESHIFT);
	float _207 = mix(5.00000000e-01, 3.33333343e-01, _204);
	float _208 = _200 ? _203 : _207;
	huefactors[4] = _208;
	bool _210 = V_xLIGHTROOM_BLUE_HUESHIFT > 0.00000000e+00;
	float _213 = mix(6.66666687e-01, 8.33333313e-01, V_xLIGHTROOM_BLUE_HUESHIFT);
	float _214 = -(V_xLIGHTROOM_BLUE_HUESHIFT);
	float _217 = mix(6.66666687e-01, 5.00000000e-01, _214);
	float _218 = _210 ? _213 : _217;
	huefactors[5] = _218;
	bool _220 = V_xLIGHTROOM_MAGENTA_HUESHIFT > 0.00000000e+00;
	float _223 = mix(8.33333313e-01, 1.00000000e+00, V_xLIGHTROOM_MAGENTA_HUESHIFT);
	float _224 = -(V_xLIGHTROOM_MAGENTA_HUESHIFT);
	float _227 = mix(8.33333313e-01, 6.66666687e-01, _224);
	float _228 = _220 ? _223 : _227;
	huefactors[6] = _228;
	return;
}
S_xCurvesStruct F_xsetup_curves()
{
	S_xCurvesStruct Curves = _234;
	vec2 _236 = vec2(V_xLIGHTROOM_GLOBAL_BLACK_LEVEL, V_xLIGHTROOM_GLOBAL_WHITE_LEVEL);
	float _238 = 1.0 / 2.55000000e+02;
	vec2 _240 = _236 * vec2(_238);
	Curves.levels = _240;
	float _241 = exp2(V_xLIGHTROOM_GLOBAL_EXPOSURE);
	Curves.exposure = _241;
	float _242 = -(V_xLIGHTROOM_GLOBAL_GAMMA);
	float _243 = exp2(_242);
	Curves.gamma = _243;
	Curves.contrast = V_xLIGHTROOM_GLOBAL_CONTRAST;
	float _244 = -(V_xLIGHTROOM_GLOBAL_BLACKS_CURVE);
	float _245 = exp2(_244);
	Curves.blacks = _245;
	float _246 = -(V_xLIGHTROOM_GLOBAL_SHADOWS_CURVE);
	float _247 = exp2(_246);
	Curves.shadows = _247;
	float _248 = -(V_xLIGHTROOM_GLOBAL_MIDTONES_CURVE);
	float _249 = exp2(_248);
	Curves.midtones = _249;
	float _250 = -(V_xLIGHTROOM_GLOBAL_HIGHLIGHTS_CURVE);
	float _251 = exp2(_250);
	Curves.highlights = _251;
	float _252 = -(V_xLIGHTROOM_GLOBAL_WHITES_CURVE);
	float _253 = exp2(_252);
	Curves.whites = _253;
	return Curves;
}
S_xPaletteStruct F_xsetup_palette()
{
	S_xPaletteStruct Palette = _256;
	Palette.hue[0] = V_xLIGHTROOM_RED_HUESHIFT;
	Palette.hue[1] = V_xLIGHTROOM_ORANGE_HUESHIFT;
	Palette.hue[2] = V_xLIGHTROOM_YELLOW_HUESHIFT;
	Palette.hue[3] = V_xLIGHTROOM_GREEN_HUESHIFT;
	Palette.hue[4] = V_xLIGHTROOM_AQUA_HUESHIFT;
	Palette.hue[5] = V_xLIGHTROOM_BLUE_HUESHIFT;
	Palette.hue[6] = V_xLIGHTROOM_MAGENTA_HUESHIFT;
	Palette.saturation[0] = V_xLIGHTROOM_RED_SATURATION;
	Palette.saturation[1] = V_xLIGHTROOM_ORANGE_SATURATION;
	Palette.saturation[2] = V_xLIGHTROOM_YELLOW_SATURATION;
	Palette.saturation[3] = V_xLIGHTROOM_GREEN_SATURATION;
	Palette.saturation[4] = V_xLIGHTROOM_AQUA_SATURATION;
	Palette.saturation[5] = V_xLIGHTROOM_BLUE_SATURATION;
	Palette.saturation[6] = V_xLIGHTROOM_MAGENTA_SATURATION;
	Palette.exposure[0] = V_xLIGHTROOM_RED_EXPOSURE;
	Palette.exposure[1] = V_xLIGHTROOM_ORANGE_EXPOSURE;
	Palette.exposure[2] = V_xLIGHTROOM_YELLOW_EXPOSURE;
	Palette.exposure[3] = V_xLIGHTROOM_GREEN_EXPOSURE;
	Palette.exposure[4] = V_xLIGHTROOM_AQUA_EXPOSURE;
	Palette.exposure[5] = V_xLIGHTROOM_BLUE_EXPOSURE;
	Palette.exposure[6] = V_xLIGHTROOM_MAGENTA_EXPOSURE;
	return Palette;
}
S_xVignetteStruct F_xsetup_vignette()
{
	S_xVignetteStruct Vignette = _260;
	vec2 _262 = vec2(V_xLIGHTROOM_VIGNETTE_WIDTH, V_xLIGHTROOM_VIGNETTE_HEIGHT);
	Vignette.ratio = _262;
	vec2 _263 = vec2(V_xLIGHTROOM_VIGNETTE_RADIUS_INNER, V_xLIGHTROOM_VIGNETTE_RADIUS_OUTER);
	Vignette.radii = _263;
	Vignette.amount = V_xLIGHTROOM_VIGNETTE_AMOUNT;
	Vignette.curve = V_xLIGHTROOM_VIGNETTE_CURVE;
	Vignette.blend = V_xLIGHTROOM_VIGNETTE_BLEND_MODE;
	Vignette.debug = V_xLIGHTROOM_VIGNETTE_SHOW_RADII;
	return Vignette;
}
vec3 F_xrgb_to_hcv(
	in vec3 RGB)
{
	vec3 _267 = clamp(RGB, 0.0, 1.0);
	RGB = _267;
	float Epsilon = 1.00000001e-10;
	bool _272 = RGB.y < RGB.z;
	vec4 _277 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _282 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _284 = compCond(bvec4(_272), _277, _282);
	vec4 P = _284;
	bool _288 = RGB.x < P.x;
	vec4 _293 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _298 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _300 = compCond(bvec4(_288), _293, _298);
	vec4 Q = _300;
	float _304 = min(Q.w, Q.y);
	float _306 = Q.x - _304;
	float C = _306;
	float _310 = Q.w - Q.y;
	float _312 = 6.00000000e+00 * C;
	float _313 = _312 + Epsilon;
	float _314 = _310 / _313;
	float _316 = _314 + Q.z;
	float _317 = abs(_316);
	float H = _317;
	vec3 _320 = vec3(H, C, Q.x);
	return _320;
}
vec3 F_xrgb_to_hsl(
	in vec3 RGB)
{
	vec3 _324;
	_324 = RGB;
	vec3 _325 = F_xrgb_to_hcv(_324);
	vec3 HCV = _325;
	float _329 = HCV.y * 5.00000000e-01;
	float _331 = HCV.z - _329;
	float L = _331;
	float _334 = L * 2.00000000e+00;
	float _336 = _334 - 1.00000000e+00;
	float _337 = abs(_336);
	float _339 = 1.00000012e+00 - _337;
	float _341 = HCV.y / _339;
	float S = _341;
	vec3 _344 = vec3(HCV.x, S, L);
	return _344;
}
vec3 F_xhsl_to_rgb(
	in vec3 HSL)
{
	vec3 _348 = clamp(HSL, 0.0, 1.0);
	HSL = _348;
	float _351 = HSL.x * 6.00000000e+00;
	float _353 = _351 - 3.00000000e+00;
	float _354 = abs(_353);
	float _356 = _354 - 1.00000000e+00;
	float _359 = HSL.x * 6.00000000e+00;
	float _361 = _359 - 2.00000000e+00;
	float _362 = abs(_361);
	float _364 = 2.00000000e+00 - _362;
	float _367 = HSL.x * 6.00000000e+00;
	float _369 = _367 - 4.00000000e+00;
	float _370 = abs(_369);
	float _372 = 2.00000000e+00 - _370;
	vec3 _373 = vec3(_356, _364, _372);
	vec3 _374 = clamp(_373, 0.0, 1.0);
	vec3 RGB_375 = _374;
	float _378 = 2.00000000e+00 * HSL.z;
	float _380 = _378 - 1.00000000e+00;
	float _381 = abs(_380);
	float _383 = 1.00000000e+00 - _381;
	float _385 = _383 * HSL.y;
	float C_386 = _385;
	vec3 _388 = RGB_375 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _390 = _388 * vec3(C_386);
	vec3 _392 = _390 + vec3(HSL.z);
	return _392;
}
float F_xlinearstep(
	in float lower,
	in float upper,
	in float value)
{
	float _398 = value - lower;
	float _399 = upper - lower;
	float _400 = _398 / _399;
	float _401 = clamp(_400, 0.0, 1.0);
	return _401;
}
vec3 F_xget_function_graph(
	in vec2 coords,
	in float F,
	in vec3 origcolor,
	in float thickness)
{
	float _409 = F - coords.y;
	F = _409;
	float _410 = abs(F);
	float _411 = dFdx(F);
	float _413 = dFdx(coords.x);
	float _414 = _411 / _413;
	vec2 _416 = vec2(_414, -1.00000000e+00);
	float _417 = length(_416);
	float _418 = _410 / _417;
	float DistanceField = _418;
	vec3 _421 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - origcolor;
	float _423 = 9.25925910e-04 * thickness;
	float _425 = smoothstep(_423, 0.00000000e+00, DistanceField);
	vec3 _427 = mix(origcolor, _421, vec3(_425));
	return _427;
}
vec3 F_xget_vignette(
	in vec3 color,
	in vec2 uv,
	in S_xVignetteStruct v)
{
	vec2 _434 = uv * vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _436 = _434 - vec2(1.00000000e+00, 1.00000000e+00);
	vec2 vign_uv = _436;
	vec2 _438 = vign_uv + V_xLIGHTROOM_VIGNETTE_OFFS;
	vign_uv = _438;
	vec2 _440 = vign_uv * v.ratio;
	vec2 _441 = vign_uv - _440;
	vign_uv = _441;
	float _442 = length(vign_uv);
	float vign_gradient = _442;
	float _444;
	float _445;
	float _446;
	_444 = v.radii.x;
	_445 = v.radii.y;
	_446 = vign_gradient;
	float _449 = F_xlinearstep(_444, _445, _446);
	float vignette = _449;
	float _453 = v.curve + 9.99999997e-07;
	float _454 = pow(vignette, _453);
	float _456 = _454 * v.amount;
	vignette = _456;
	float _457 = clamp(vignette, 0.0, 1.0);
	vignette = _457;
	bool _460 = v.blend == 0;
	vec3 _461 = color * V_xLIGHTROOM_VIGNETTE_COLOR;
	vec3 _463 = mix(color, _461, vec3(vignette));
	vec3 _465 = compCond(bvec3(_460), _463, color);
	color = _465;
	bool _468 = v.blend == 1;
	vec3 _470 = color - vec3(vignette);
	vec3 _471 = clamp(_470, 0.0, 1.0);
	vec3 _473 = compCond(bvec3(_468), _471, color);
	color = _473;
	bool _476 = v.blend == 2;
	vec3 _478 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - color;
	float _480 = vignette + 1.00000000e+00;
	vec3 _482 = _478 * vec3(_480);
	vec3 _484 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _482;
	vec3 _486 = compCond(bvec3(_476), _484, color);
	color = _486;
	bool _489 = v.blend == 3;
	float _491 = vignette * 2.00000000e+00;
	float _493 = 1.00000000e+00 - _491;
	float _495 = dot(color, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _497 = mix(_493, 1.00000000e+00, _495);
	float _498 = clamp(_497, 0.0, 1.0);
	vec3 _500 = color * vec3(_498);
	vec3 _502 = compCond(bvec3(_489), _500, color);
	color = _502;
	bool _505 = v.blend == 4;
	vec3 _507 = mix(color, V_xLIGHTROOM_VIGNETTE_COLOR, vec3(vignette));
	vec3 _509 = compCond(bvec3(_505), _507, color);
	color = _509;
	if (v.debug)
	{
		vec2 _516 = vec2(vign_gradient) - v.radii;
		vec2 _517 = abs(_516);
		vec2 radii_sdf = _517;
		vec2 _519 = fwidth(radii_sdf);
		vec2 _521 = vec2(9.25925910e-04, 9.25925910e-04) / _519;
		vec2 _522 = radii_sdf * _521;
		radii_sdf = _522;
		vec2 _524 = vec2(2.00000000e+02, 2.00000000e+02) * radii_sdf;
		vec2 _526 = vec2(1.00000000e+00, 1.00000000e+00) - _524;
		vec2 _527 = clamp(_526, 0.0, 1.0);
		radii_sdf = _527;
		vec3 _530 = mix(color, vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), vec3(radii_sdf.x));
		color = _530;
		vec3 _533 = mix(color, vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(radii_sdf.y));
		color = _533;
	}
	return color;
}
float F_xcurves(
	in float x,
	in S_xCurvesStruct c)
{
	float _538;
	float _539;
	float _540;
	_538 = c.levels.x;
	_539 = c.levels.y;
	_540 = x;
	float _543 = F_xlinearstep(_538, _539, _540);
	x = _543;
	float _545 = x * c.exposure;
	float _547 = pow(_545, c.gamma);
	float _548 = clamp(_547, 0.0, 1.0);
	x = _548;
	float _551 = smoothstep(2.50000000e-01, 0.00000000e+00, x);
	float blacks_mult = _551;
	float _555 = smoothstep(0.00000000e+00, 2.50000000e-01, x);
	float _558 = smoothstep(5.00000000e-01, 2.50000000e-01, x);
	float _559 = _555 * _558;
	float shadows_mult = _559;
	float _563 = smoothstep(2.50000000e-01, 5.00000000e-01, x);
	float _566 = smoothstep(7.50000000e-01, 5.00000000e-01, x);
	float _567 = _563 * _566;
	float midtones_mult = _567;
	float _571 = smoothstep(5.00000000e-01, 7.50000000e-01, x);
	float _574 = smoothstep(1.00000000e+00, 7.50000000e-01, x);
	float _575 = _571 * _574;
	float highlights_mult = _575;
	float _579 = smoothstep(7.50000000e-01, 1.00000000e+00, x);
	float whites_mult = _579;
	float _582 = blacks_mult * c.blacks;
	float _584 = shadows_mult * c.shadows;
	float _585 = _582 + _584;
	float _587 = midtones_mult * c.midtones;
	float _588 = _585 + _587;
	float _590 = highlights_mult * c.highlights;
	float _591 = _588 + _590;
	float _593 = whites_mult * c.whites;
	float _594 = _591 + _593;
	float _596 = _594 - 1.00000000e+00;
	float _597 = exp2(_596);
	float _598 = pow(x, _597);
	x = _598;
	float _599 = x * x;
	float _601 = 2.00000000e+00 * x;
	float _603 = 3.00000000e+00 - _601;
	float _604 = _599 * _603;
	float _606 = mix(x, _604, c.contrast);
	x = _606;
	float _607 = clamp(x, 0.0, 1.0);
	return _607;
}
void F_xdraw_lut(
	inout vec3 color,
	in vec2 vpos,
	in float tile_size,
	in float tile_amount,
	in float scroll)
{
	vec2 pixelcoord = vpos.xy;
	float _618 = scroll * 1.92000000e+03;
	float _620 = pixelcoord.x + _618;
	pixelcoord[0] = _620;
	float _624 = tile_size * tile_amount;
	bool _626 = pixelcoord.x < _624;
	bool _628 = pixelcoord.y < tile_size;
	bool _629 = _626 && _628;
	if (_629)
	{
		vec2 _632 = pixelcoord.xy / vec2(tile_size);
		vec2 _633 = fract(_632);
		float _635 = 5.00000000e-01 / tile_size;
		vec2 _637 = _633 - vec2(_635);
		color.xy = _637;
		float _638 = 1.0 / tile_size;
		float _640 = 1.00000000e+00 - _638;
		vec2 _643 = color.xy / vec2(_640);
		color.xy = _643;
		float _645 = pixelcoord.x / tile_size;
		float _646 = floor(_645);
		float _648 = tile_amount - 1.00000000e+00;
		float _649 = _646 / _648;
		color[2] = _649;
		vec3 _652 = color.xyz * vec3(2.55000000e+02, 2.55000000e+02, 2.55000000e+02);
		vec3 _653 = floor(_652);
		vec3 _655 = _653 / vec3(2.55000000e+02, 2.55000000e+02, 2.55000000e+02);
		color.xyz = _655;
	}
	return;
}
void F_xdraw_lut_4096x64(
	inout vec3 color,
	in vec2 vpos)
{
	vec3 _662 = vpos.xyx / vec3(6.40000000e+01, 6.40000000e+01, 6.40000000e+01);
	color.xyz = _662;
	vec2 _664 = fract(color.xy);
	vec2 _666 = _664 - vec2(7.81250000e-03, 7.81250000e-03);
	color.xy = _666;
	vec2 _669 = color.xy / vec2(9.84375000e-01, 9.84375000e-01);
	color.xy = _669;
	float _671 = floor(color.z);
	float _673 = _671 / 6.30000000e+01;
	color[2] = _673;
	return;
}
void F_xread_lut_4096x64(
	inout vec3 color)
{
	vec4 lut_coord = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 _681 = color.xyz * vec3(6.30000000e+01, 6.30000000e+01, 6.30000000e+01);
	lut_coord.xyz = _681;
	vec2 _684 = lut_coord.xy + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _686 = _684 / vec2(4.09600000e+03, 6.40000000e+01);
	lut_coord.xy = _686;
	float _688 = floor(lut_coord.z);
	float _690 = _688 / 6.40000000e+01;
	float _692 = lut_coord.x + _690;
	lut_coord[0] = _692;
	float _694 = fract(lut_coord.z);
	lut_coord[2] = _694;
	float _697 = lut_coord.x + 1.56250000e-02;
	lut_coord[3] = _697;
	vec4 _699 = texture(V_xsLutTexInternal, lut_coord.xy);
	vec4 _701 = texture(V_xsLutTexInternal, lut_coord.wy);
	vec3 _705 = mix(_699.xyz, _701.xyz, vec3(lut_coord.z));
	color.xyz = _705;
	return;
}
vec3 F_xpalette(
	in vec3 hsl_color,
	in S_xPaletteStruct p,
	in float huefactors[7])
{
	float _713 = hsl_color.x - 0.00000000e+00;
	float _715 = _713 * 1.20000000e+01;
	float _716 = abs(_715);
	float _718 = 1.00000000e+00 - _716;
	float _719 = clamp(_718, 0.0, 1.0);
	float _722 = hsl_color.x - 1.00000000e+00;
	float _724 = _722 * 6.00000000e+00;
	float _725 = abs(_724);
	float _727 = 1.00000000e+00 - _725;
	float _728 = clamp(_727, 0.0, 1.0);
	float _729 = max(_719, _728);
	float _732 = hsl_color.x - 8.33333358e-02;
	float _734 = _732 * 1.20000000e+01;
	float _735 = abs(_734);
	float _737 = 1.00000000e+00 - _735;
	float _738 = clamp(_737, 0.0, 1.0);
	float _741 = hsl_color.x - 1.66666672e-01;
	float _743 = _741 * 1.20000000e+01;
	float _744 = abs(_743);
	float _746 = 1.00000000e+00 - _744;
	float _747 = clamp(_746, 0.0, 1.0);
	float _750 = step(hsl_color.x, 1.66666672e-01);
	float _751 = _747 * _750;
	float _754 = hsl_color.x - 1.66666672e-01;
	float _756 = _754 * 6.00000000e+00;
	float _757 = abs(_756);
	float _759 = 1.00000000e+00 - _757;
	float _760 = clamp(_759, 0.0, 1.0);
	float _763 = step(1.66666672e-01, hsl_color.x);
	float _764 = _760 * _763;
	float _765 = max(_751, _764);
	float _768 = hsl_color.x - 3.33333343e-01;
	float _770 = _768 * 6.00000000e+00;
	float _771 = abs(_770);
	float _773 = 1.00000000e+00 - _771;
	float _774 = clamp(_773, 0.0, 1.0);
	float _777 = hsl_color.x - 5.00000000e-01;
	float _779 = _777 * 6.00000000e+00;
	float _780 = abs(_779);
	float _782 = 1.00000000e+00 - _780;
	float _783 = clamp(_782, 0.0, 1.0);
	float _786 = hsl_color.x - 6.66666687e-01;
	float _788 = _786 * 6.00000000e+00;
	float _789 = abs(_788);
	float _791 = 1.00000000e+00 - _789;
	float _792 = clamp(_791, 0.0, 1.0);
	float _795 = hsl_color.x - 8.33333313e-01;
	float _797 = _795 * 6.00000000e+00;
	float _798 = abs(_797);
	float _800 = 1.00000000e+00 - _798;
	float _801 = clamp(_800, 0.0, 1.0);
	float _802[7] = float[7](_729, _738, _765, _774, _783, _792, _801);
	float huemults[7] = _802;
	vec3 tcolor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int i = 0;
	while (i < 7)
	{
		{
			float _820 = hsl_color.y * p.saturation[int(i)];
			float _822 = hsl_color.y + _820;
			float _823 = clamp(_822, 0.0, 1.0);
			float _825 = sqrt(hsl_color.y);
			float _827 = _825 * p.exposure[int(i)];
			float _830 = 1.00000000e+00 - hsl_color.z;
			float _831 = _827 * _830;
			float _833 = _831 * hsl_color.y;
			float _834 = exp2(_833);
			float _836 = hsl_color.z * _834;
			vec3 _838 = vec3(huefactors[int(i)], _823, _836);
			vec3 _839;
			_839 = _838;
			vec3 _840 = F_xhsl_to_rgb(_839);
			vec3 _842 = vec3(huemults[int(i)]) * _840;
			vec3 _843 = tcolor + _842;
			tcolor = _843;
		}
		int _816 = i;
		int _817 = _816 + 1;
		i = _817;
	}
	return tcolor;
}
void F_xPS_ProcessLUT(
	in vec4 vpos,
	in vec2 uv,
	in float huefactors[7],
	out vec4 color)
{
	S_xCurvesStruct _850 = F_xsetup_curves();
	S_xCurvesStruct Curves_851 = _850;
	S_xPaletteStruct _852 = F_xsetup_palette();
	S_xPaletteStruct Palette_853 = _852;
	vec3 _854;
	vec2 _855;
	_854 = color.xyz;
	_855 = vpos.xy;
	F_xdraw_lut_4096x64(_854, _855);
	color.xyz = _854;
	color[3] = 1.00000000e+00;
	float _860;
	S_xCurvesStruct _861;
	_860 = color.x;
	_861 = Curves_851;
	float _863 = F_xcurves(_860, _861);
	color[0] = _863;
	float _864;
	S_xCurvesStruct _865;
	_864 = color.y;
	_865 = Curves_851;
	float _867 = F_xcurves(_864, _865);
	color[1] = _867;
	float _868;
	S_xCurvesStruct _869;
	_868 = color.z;
	_869 = Curves_851;
	float _871 = F_xcurves(_868, _869);
	color[2] = _871;
	vec3 _872;
	_872 = color.xyz;
	vec3 _874 = F_xrgb_to_hsl(_872);
	vec3 hsl_color_875 = _874;
	bool _877 = V_xLIGHTROOM_GLOBAL_TEMPERATURE > 0.00000000e+00;
	vec3 _881 = vec3(6.11100011e-02, 1.00000000e+00, hsl_color_875.z);
	vec3 _882;
	_882 = _881;
	vec3 _883 = F_xhsl_to_rgb(_882);
	vec3 _886 = mix(color.xyz, _883, vec3(V_xLIGHTROOM_GLOBAL_TEMPERATURE));
	vec3 _890 = vec3(5.61110020e-01, 1.00000000e+00, hsl_color_875.z);
	vec3 _891;
	_891 = _890;
	vec3 _892 = F_xhsl_to_rgb(_891);
	float _893 = -(V_xLIGHTROOM_GLOBAL_TEMPERATURE);
	vec3 _896 = mix(color.xyz, _892, vec3(_893));
	vec3 _898 = compCond(bvec3(_877), _886, _896);
	color.xyz = _898;
	bool _900 = V_xLIGHTROOM_GLOBAL_TEMPERATURE > 0.00000000e+00;
	vec3 _904 = vec3(3.11109990e-01, 1.00000000e+00, hsl_color_875.z);
	vec3 _905;
	_905 = _904;
	vec3 _906 = F_xhsl_to_rgb(_905);
	vec3 _909 = mix(color.xyz, _906, vec3(V_xLIGHTROOM_GLOBAL_TINT));
	vec3 _913 = vec3(8.11110020e-01, 1.00000000e+00, hsl_color_875.z);
	vec3 _914;
	_914 = _913;
	vec3 _915 = F_xhsl_to_rgb(_914);
	float _916 = -(V_xLIGHTROOM_GLOBAL_TINT);
	vec3 _919 = mix(color.xyz, _915, vec3(_916));
	vec3 _921 = compCond(bvec3(_900), _909, _919);
	color.xyz = _921;
	vec3 _922;
	_922 = color.xyz;
	vec3 _924 = F_xrgb_to_hsl(_922);
	hsl_color_875 = _924;
	float _926 = hsl_color_875.y * V_xLIGHTROOM_GLOBAL_SATURATION;
	float _928 = hsl_color_875.y + _926;
	float _929 = clamp(_928, 0.0, 1.0);
	hsl_color_875[1] = _929;
	float _930 = -(V_xLIGHTROOM_GLOBAL_VIBRANCE);
	float _931 = exp2(_930);
	float _933 = pow(hsl_color_875.y, _931);
	hsl_color_875[1] = _933;
	vec3 _934 = clamp(hsl_color_875, 0.0, 1.0);
	hsl_color_875 = _934;
	vec3 _935;
	S_xPaletteStruct _936;
	float _937[7];
	_935 = hsl_color_875;
	_936 = Palette_853;
	_937 = huefactors;
	vec3 _938 = F_xpalette(_935, _936, _937);
	color.xyz = _938;
	return;
}
vec3 F_xdither(
	in ivec2 pos,
	in int bit_depth)
{
	float _945 = dot(vec2(7.54877687e-01, 5.69840312e-01), vec2(1.00000000e+00, 1.00000000e+00));
	vec3 _948 = vec3(0.00000000e+00, 2.50000004e-02, 1.25000002e-02) * vec3(_945);
	vec3 magicadd = _948;
	float _951 = exp2(float(bit_depth));
	float _953 = _951 - 1.00000000e+00;
	float lsb = _953;
	float _957 = dot(vec2(pos), vec2(7.54877687e-01, 5.69840312e-01));
	vec3 _959 = vec3(_957) + magicadd;
	vec3 _960 = fract(_959);
	vec3 dither = _960;
	vec3 _963 = dither - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	dither = _963;
	vec3 _965 = dither * vec3(9.90000010e-01, 9.90000010e-01, 9.90000010e-01);
	dither = _965;
	vec3 _967 = dither / vec3(lsb);
	dither = _967;
	return dither;
}
void F_xPS_ApplyLUT(
	in vec4 vpos,
	in vec2 uv,
	in float huefactors[7],
	out vec4 color)
{
	vec4 _974 = texture(V_xqUINT_xsBackBufferTex, uv);
	color = _974;
	if (V_xLIGHTROOM_ENABLE_LUT)
	{
		vec3 _978;
		vec2 _979;
		float _980;
		float _981;
		float _982;
		_978 = color.xyz;
		_979 = vpos.xy;
		_980 = float(V_xLIGHTROOM_LUT_TILE_SIZE);
		_981 = float(V_xLIGHTROOM_LUT_TILE_COUNT);
		_982 = float(V_xLIGHTROOM_LUT_SCROLL);
		F_xdraw_lut(_978, _979, _980, _981, _982);
		color.xyz = _978;
	}
	vec3 _989;
	_989 = color.xyz;
	F_xread_lut_4096x64(_989);
	color.xyz = _989;
	return;
}
void F_xPS_DisplayStatistics(
	in vec4 vpos,
	in vec2 uv,
	in float huefactors[7],
	out vec4 res)
{
	S_xCurvesStruct _998 = F_xsetup_curves();
	S_xCurvesStruct Curves_999 = _998;
	S_xVignetteStruct _1000 = F_xsetup_vignette();
	S_xVignetteStruct Vignette_1001 = _1000;
	vec4 _1002 = texture(V_xqUINT_xsBackBufferTex, uv);
	vec4 color_1003 = _1002;
	if (V_xLIGHTROOM_ENABLE_VIGNETTE)
	{
		vec3 _1007;
		vec2 _1008;
		S_xVignetteStruct _1009;
		_1007 = color_1003.xyz;
		_1008 = uv;
		_1009 = Vignette_1001;
		vec3 _1011 = F_xget_vignette(_1007, _1008, _1009);
		color_1003.xyz = _1011;
	}
	float _1014 = 1.08000000e+03 - vpos.y;
	vec2 _1016 = vec2(vpos.x, _1014);
	vec2 vposfbl = _1016;
	vec2 _1019 = vposfbl / vec2(2.55000000e+02, 2.55000000e+02);
	vec2 vposfbl_n = _1019;
	float _1023 = dot(color_1003.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	bool _1025 = _1023 >= 3.00000000e+00;
	bool _1026 = V_xLIGHTROOM_ENABLE_CLIPPING_DISPLAY && _1025;
	vec3 _1030 = compCond(bvec3(_1026), vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), color_1003.xyz);
	color_1003.xyz = _1030;
	float _1033 = dot(color_1003.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	bool _1035 = _1033 <= 0.00000000e+00;
	bool _1036 = V_xLIGHTROOM_ENABLE_CLIPPING_DISPLAY && _1035;
	vec3 _1040 = compCond(bvec3(_1036), vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00), color_1003.xyz);
	color_1003.xyz = _1040;
	if (V_xLIGHTROOM_ENABLE_CURVE_DISPLAY)
	{
		float _1044;
		S_xCurvesStruct _1045;
		_1044 = vposfbl_n.x;
		_1045 = Curves_999;
		float _1047 = F_xcurves(_1044, _1045);
		float luma_curve = _1047;
		vec2 _1052 = -(vposfbl_n);
		vec2 _1053 = _1052 * vposfbl_n;
		vec2 _1054 = _1053 + vposfbl_n;
		vec2 _1055 = clamp(_1054, 0.0, 1.0);
		bool _1057 = all(bvec2(_1055));
		if (_1057)
		{
			vec2 _1058;
			float _1059;
			vec3 _1060;
			float _1061;
			_1058 = vposfbl_n.xy;
			_1059 = luma_curve;
			_1060 = color_1003.xyz;
			_1061 = 2.00000000e+01;
			vec3 _1065 = F_xget_function_graph(_1058, _1059, _1060, _1061);
			vec3 _1068 = compCond(bvec3(V_xLIGHTROOM_ENABLE_CURVE_DISPLAY), _1065, color_1003.xyz);
			color_1003.xyz = _1068;
		}
	}
	res.xyz = color_1003.xyz;
	res[3] = 1.00000000e+00;
	return;
}
#ifdef E_xVS_Lightroom
out vec2 vv_0;
flat out float vv_1;
flat out float vv_2;
flat out float vv_3;
flat out float vv_4;
flat out float vv_5;
flat out float vv_6;
flat out float vv_7;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 uv;
	float huefactors[7];
	F_xVS_Lightroom(id, position, uv, huefactors);
	gl_Position = position;
	vv_0 = uv;
	vv_1 = huefactors[0];
	vv_2 = huefactors[1];
	vv_3 = huefactors[2];
	vv_4 = huefactors[3];
	vv_5 = huefactors[4];
	vv_6 = huefactors[5];
	vv_7 = huefactors[6];
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_ProcessLUT
in vec2 vv_0;
flat in float vv_1;
flat in float vv_2;
flat in float vv_3;
flat in float vv_4;
flat in float vv_5;
flat in float vv_6;
flat in float vv_7;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 uv = vv_0;
	float huefactors[7] = float[](vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_7);
	vec4 color;
	F_xPS_ProcessLUT(vpos, uv, huefactors, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_ApplyLUT
in vec2 vv_0;
flat in float vv_1;
flat in float vv_2;
flat in float vv_3;
flat in float vv_4;
flat in float vv_5;
flat in float vv_6;
flat in float vv_7;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 uv = vv_0;
	float huefactors[7] = float[](vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_7);
	vec4 color;
	F_xPS_ApplyLUT(vpos, uv, huefactors, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_DisplayStatistics
in vec2 vv_0;
flat in float vv_1;
flat in float vv_2;
flat in float vv_3;
flat in float vv_4;
flat in float vv_5;
flat in float vv_6;
flat in float vv_7;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 uv = vv_0;
	float huefactors[7] = float[](vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_7);
	vec4 res;
	F_xPS_DisplayStatistics(vpos, uv, huefactors, res);
	vv_0 = res;
	return;
}
#endif
