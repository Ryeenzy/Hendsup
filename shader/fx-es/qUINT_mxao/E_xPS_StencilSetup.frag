#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_StencilSetup
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
uniform int V_xMXAO_GLOBAL_SAMPLE_QUALITY_PRESET;
uniform float V_xMXAO_SAMPLE_RADIUS;
uniform float V_xMXAO_SAMPLE_NORMAL_BIAS;
uniform float V_xMXAO_GLOBAL_RENDER_SCALE;
uniform float V_xMXAO_SSAO_AMOUNT;
uniform int V_xMXAO_BLEND_TYPE;
uniform float V_xMXAO_FADE_DEPTH_START;
uniform float V_xMXAO_FADE_DEPTH_END;
uniform int V_xMXAO_DEBUG_VIEW_ENABLE;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
uniform sampler2D V_xsMXAO_ColorTex;
uniform sampler2D V_xsMXAO_DepthTex;
uniform sampler2D V_xsMXAO_NormalTex;
uniform sampler2D V_xsCommonTex0;
uniform sampler2D V_xsCommonTex1;
struct S_xMXAO_VSOUT
{
	vec4 vpos;
	vec4 uv;
	float samples;
	vec3 uvtoviewADD;
	vec3 uvtoviewMUL;
};
struct S_xBlurData
{
	vec4 key;
	vec4 mask;
};
S_xMXAO_VSOUT _104;
const int _129[8] = int[8](4, 8, 16, 24, 32, 64, 255, 8);
S_xBlurData _216;
S_xBlurData _218;
const vec2 _247[8] = vec2[8](vec2(1.50000000e+00, 5.00000000e-01), vec2(-1.50000000e+00, -5.00000000e-01), vec2(-5.00000000e-01, 1.50000000e+00), vec2(5.00000000e-01, -1.50000000e+00), vec2(1.50000000e+00, 2.50000000e+00), vec2(-1.50000000e+00, -2.50000000e+00), vec2(-2.50000000e+00, 1.50000000e+00), vec2(2.50000000e+00, -1.50000000e+00));
const vec3 _827[2] = vec3[2](vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _21 = uv.x / 1.00000000e+00;
	uv[0] = _21;
	float _24 = uv.y / 1.00000000e+00;
	uv[1] = _24;
	float _27 = uv.x - 0.00000000e+00;
	uv[0] = _27;
	float _30 = uv.y + 0.00000000e+00;
	uv[1] = _30;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _34;
	_34 = uv;
	vec2 _35 = F_xqUINT_xdepthtex_uv(_34);
	vec4 _40 = vec4(_35.x, _35.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _41 = textureLod(V_xqUINT_xsDepthBufferTex, _40.xy, _40.w);
	float depth = _41.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _48 = depth * 1.00000000e+00;
	depth = _48;
	float _50 = 1.00000000e+00 - depth;
	depth = _50;
	float _52 = depth * 9.99000000e+02;
	float _54 = 1.00000000e+03 - _52;
	float _55 = depth / _54;
	depth = _55;
	float _56 = clamp(depth, 0.0, 1.0);
	return _56;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _60;
	_60 = uv;
	float _61 = F_xqUINT_xget_depth(_60);
	float depth_62 = _61;
	float _63;
	_63 = depth_62;
	float _64 = F_xqUINT_xlinearize_depth(_63);
	depth_62 = _64;
	return depth_62;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _71 = id == 2u;
	float _74 = _71 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _74;
	bool _76 = id == 1u;
	float _79 = _76 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _79;
	vec2 _81 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _83 = _81 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _88 = vec4(_83.x, _83.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _88;
	return;
}
S_xMXAO_VSOUT F_xVS_MXAO(
	in uint id)
{
	S_xMXAO_VSOUT MXAO = _104;
	bool _107 = id == 2u;
	float _110 = _107 ? 2.00000000e+00 : 0.00000000e+00;
	MXAO.uv[0] = _110;
	bool _112 = id == 1u;
	float _115 = _112 ? 2.00000000e+00 : 0.00000000e+00;
	MXAO.uv[1] = _115;
	vec2 _118 = MXAO.uv.xy / vec2(V_xMXAO_GLOBAL_RENDER_SCALE);
	MXAO.uv.zw = _118;
	vec2 _121 = MXAO.uv.xy * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _123 = _121 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _128 = vec4(_123.x, _123.y, 0.00000000e+00, 1.00000000e+00);
	MXAO.vpos = _128;
	MXAO.samples = float(_129[int(V_xMXAO_GLOBAL_SAMPLE_QUALITY_PRESET)]);
	MXAO.uvtoviewADD = vec3(-1.00000000e+00, -1.00000000e+00, 1.00000000e+00);
	MXAO.uvtoviewMUL = vec3(2.00000000e+00, 2.00000000e+00, 0.00000000e+00);
	return MXAO;
}
vec3 F_xget_position_from_uv(
	in vec2 uv,
	in S_xMXAO_VSOUT MXAO)
{
	vec3 _139 = uv.xyx * MXAO.uvtoviewMUL;
	vec3 _141 = _139 + MXAO.uvtoviewADD;
	vec2 _142;
	_142 = uv;
	float _143 = F_xqUINT_xlinear_depth(_142);
	vec3 _145 = _141 * vec3(_143);
	vec3 _147 = _145 * vec3(1.00000000e+03, 1.00000000e+03, 1.00000000e+03);
	return _147;
}
vec3 F_xget_position_from_uv_mipmapped(
	in vec2 uv,
	in S_xMXAO_VSOUT MXAO,
	in int miplevel)
{
	vec3 _155 = uv.xyx * MXAO.uvtoviewMUL;
	vec3 _157 = _155 + MXAO.uvtoviewADD;
	vec4 _162 = vec4(uv.xyx.x, uv.xyx.y, uv.xyx.z, float(miplevel));
	vec4 _163 = textureLod(V_xsMXAO_DepthTex, _162.xy, _162.w);
	vec3 _165 = _157 * vec3(_163.x);
	return _165;
}
void F_xspatial_blur_data(
	inout S_xBlurData o,
	in sampler2D inputsampler,
	in float inputscale,
	in vec4 uv)
{
	vec4 _173 = uv * vec4(inputscale);
	vec4 _174 = textureLod(inputsampler, _173.xy, _173.w);
	o.key = _174;
	vec4 _175 = textureLod(V_xsMXAO_NormalTex, uv.xy, uv.w);
	o.mask = _175;
	vec3 _178 = o.mask.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _180 = _178 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	o.mask.xyz = _180;
	return;
}
float F_xcompute_spatial_tap_weight(
	in S_xBlurData center,
	in S_xBlurData tap)
{
	float _187 = tap.mask.w - center.mask.w;
	float _188 = abs(_187);
	float _190 = 1.00000000e+00 - _188;
	float _191 = clamp(_190, 0.0, 1.0);
	float depth_term = _191;
	float _195 = dot(tap.mask.xyz, center.mask.xyz);
	float _197 = _195 * 1.60000000e+01;
	float _199 = _197 - 1.50000000e+01;
	float _200 = clamp(_199, 0.0, 1.0);
	float normal_term = _200;
	float _202 = depth_term * normal_term;
	return _202;
}
vec4 F_xblur_filter(
	in S_xMXAO_VSOUT MXAO,
	in sampler2D inputsampler,
	in float inputscale,
	in float radius,
	in int blursteps)
{
	vec4 _214 = vec4(MXAO.uv.xy.x, MXAO.uv.xy.y, 0.00000000e+00, 0.00000000e+00);
	vec4 blur_uv = _214;
	S_xBlurData center_217 = _216;
	S_xBlurData tap_219 = _218;
	S_xBlurData _220;
	float _221;
	vec4 _222;
	_220 = center_217;
	_221 = inputscale;
	_222 = blur_uv;
	F_xspatial_blur_data(_220, inputsampler, _221, _222);
	center_217 = _220;
	vec4 blursum = center_217.key;
	vec4 blursum_noweight = center_217.key;
	float blurweight = 1.00000000e+00;
	vec2 _232 = vec2(5.20833360e-04, 9.25925910e-04) / vec2(inputscale);
	vec2 _234 = _232 * vec2(radius);
	vec2 blur_offsetscale = _234;
	int i = 0;
	while (i < blursteps)
	{
		{
			vec2 _249 = _247[int(i)] * blur_offsetscale;
			vec2 _251 = MXAO.uv.xy + _249;
			blur_uv.xy = _251;
			S_xBlurData _252;
			float _253;
			vec4 _254;
			_252 = tap_219;
			_253 = inputscale;
			_254 = blur_uv;
			F_xspatial_blur_data(_252, inputsampler, _253, _254);
			tap_219 = _252;
			S_xBlurData _256;
			S_xBlurData _257;
			_256 = center_217;
			_257 = tap_219;
			float _258 = F_xcompute_spatial_tap_weight(_256, _257);
			float tap_weight = _258;
			float _260 = blurweight + tap_weight;
			blurweight = _260;
			float _262 = tap_219.key.w * tap_weight;
			float _264 = blursum.w + _262;
			blursum[3] = _264;
			float _267 = blursum_noweight.w + tap_219.key.w;
			blursum_noweight[3] = _267;
		}
		int _245 = i;
		int _246 = _245 + 1;
		i = _246;
	}
	float _269 = blursum.w / blurweight;
	blursum[3] = _269;
	int _271 = 1 + blursteps;
	float _274 = blursum_noweight.w / float(_271);
	blursum_noweight[3] = _274;
	bool _276 = blurweight < 2.00000000e+00;
	float _280 = mix(blursum.w, blursum_noweight.w, float(_276));
	return vec4(_280);
}
void F_xsample_parameter_setup(
	in S_xMXAO_VSOUT MXAO,
	in float scaled_depth,
	in float layer_id,
	out float scaled_radius,
	out float falloff_factor)
{
	float _290 = 2.50000000e-01 * V_xMXAO_SAMPLE_RADIUS;
	float _292 = scaled_depth + 2.00000000e+00;
	float _294 = MXAO.samples * _292;
	float _295 = _290 / _294;
	scaled_radius = _295;
	float _296 = V_xMXAO_SAMPLE_RADIUS * V_xMXAO_SAMPLE_RADIUS;
	float _298 = -1.00000000e+00 / _296;
	falloff_factor = _298;
	return;
}
void F_xsmooth_normals(
	inout vec3 normal,
	in vec3 position,
	in S_xMXAO_VSOUT MXAO)
{
	float _306 = 1.79999992e-02 / position.z;
	vec2 _309 = vec2(_306) * vec2(1.00000000e+00, 1.77777779e+00);
	vec2 scaled_radius_310 = _309;
	vec3 _311[4] = vec3[4](normal, normal, normal, normal);
	vec3 neighbour_normal[4] = _311;
	int i_314 = 0;
	while (i_314 < 4)
	{
		{
			vec2 direction = vec2(0.00000000e+00, 0.00000000e+00);
			float _329 = 1.57079637e+00 * float(i_314);
			float _330;
			float _331;
			_330 = sin(_329), _331 = cos(_329);
			direction[1] = _330;
			direction[0] = _331;
			int direction_step = 1;
			while (direction_step <= 5)
			{
				{
					float _346 = exp2(float(direction_step));
					float search_radius = _346;
					vec2 _349 = direction * vec2(search_radius);
					vec2 _350 = _349 * scaled_radius_310;
					vec2 _352 = MXAO.uv.zw + _350;
					vec2 tap_uv = _352;
					vec4 _358 = vec4(tap_uv.x, tap_uv.y, 0.00000000e+00, 0.00000000e+00);
					vec4 _359 = textureLod(V_xsMXAO_NormalTex, _358.xy, _358.w);
					vec3 _362 = _359.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
					vec3 _364 = _362 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
					vec3 temp_normal = _364;
					vec2 _366;
					S_xMXAO_VSOUT _367;
					int _368;
					_366 = tap_uv;
					_367 = MXAO;
					_368 = 0;
					vec3 _370 = F_xget_position_from_uv_mipmapped(_366, _367, _368);
					vec3 temp_position = _370;
					vec3 _372 = temp_position - position;
					vec3 position_delta = _372;
					float _374 = dot(position_delta, position_delta);
					float _376 = _374 * 2.00000000e+01;
					float _377 = _376 / search_radius;
					float _379 = 1.00000000e+00 - _377;
					float _380 = clamp(_379, 0.0, 1.0);
					float distance_weight = _380;
					float _382 = dot(normal, temp_normal);
					float normal_angle = _382;
					float _386 = smoothstep(3.00000012e-01, 9.80000019e-01, normal_angle);
					float _389 = smoothstep(1.00000000e+00, 9.80000019e-01, normal_angle);
					float _390 = _386 * _389;
					float angle_weight = _390;
					float _393 = 3.00000000e+00 * distance_weight;
					float _394 = _393 * angle_weight;
					float _395 = _394 / search_radius;
					float _396 = clamp(_395, 0.0, 1.0);
					float total_weight = _396;
					vec3 _400 = mix(neighbour_normal[int(i_314)], temp_normal, vec3(total_weight));
					neighbour_normal[int(i_314)] = _400;
				}
				int _343 = direction_step;
				int _344 = _343 + 1;
				direction_step = _344;
			}
		}
		int _323 = i_314;
		int _324 = _323 + 1;
		i_314 = _324;
	}
	vec3 _403 = neighbour_normal[0] + neighbour_normal[1];
	vec3 _405 = _403 + neighbour_normal[2];
	vec3 _407 = _405 + neighbour_normal[3];
	vec3 _408 = normalize(_407);
	normal = _408;
	return;
}
void F_xPS_InputBufferSetup(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color,
	out vec4 depth,
	out vec4 normal)
{
	vec3 single_pixel_offset = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec2 _417;
	S_xMXAO_VSOUT _418;
	_417 = MXAO.uv.xy;
	_418 = MXAO;
	vec3 _420 = F_xget_position_from_uv(_417, _418);
	vec3 position_421 = _420;
	vec3 _422 = -(position_421);
	vec2 _425 = MXAO.uv.xy + single_pixel_offset.xz;
	vec2 _426;
	S_xMXAO_VSOUT _427;
	_426 = _425;
	_427 = MXAO;
	vec3 _428 = F_xget_position_from_uv(_426, _427);
	vec3 _429 = _422 + _428;
	vec3 position_delta_x1 = _429;
	vec2 _433 = MXAO.uv.xy - single_pixel_offset.xz;
	vec2 _434;
	S_xMXAO_VSOUT _435;
	_434 = _433;
	_435 = MXAO;
	vec3 _436 = F_xget_position_from_uv(_434, _435);
	vec3 _437 = position_421 - _436;
	vec3 position_delta_x2 = _437;
	vec3 _439 = -(position_421);
	vec2 _442 = MXAO.uv.xy + single_pixel_offset.zy;
	vec2 _443;
	S_xMXAO_VSOUT _444;
	_443 = _442;
	_444 = MXAO;
	vec3 _445 = F_xget_position_from_uv(_443, _444);
	vec3 _446 = _439 + _445;
	vec3 position_delta_y1 = _446;
	vec2 _450 = MXAO.uv.xy - single_pixel_offset.zy;
	vec2 _451;
	S_xMXAO_VSOUT _452;
	_451 = _450;
	_452 = MXAO;
	vec3 _453 = F_xget_position_from_uv(_451, _452);
	vec3 _454 = position_421 - _453;
	vec3 position_delta_y2 = _454;
	float _457 = abs(position_delta_x1.z);
	float _459 = abs(position_delta_x2.z);
	bool _460 = _457 > _459;
	vec3 _462 = mix(position_delta_x1, position_delta_x2, vec3(bvec3(_460)));
	position_delta_x1 = _462;
	float _464 = abs(position_delta_y1.z);
	float _466 = abs(position_delta_y2.z);
	bool _467 = _464 > _466;
	vec3 _469 = mix(position_delta_y1, position_delta_y2, vec3(bvec3(_467)));
	position_delta_y1 = _469;
	float _472 = position_delta_x1.z * position_delta_x1.z;
	float _475 = position_delta_x2.z * position_delta_x2.z;
	float _476 = _472 - _475;
	float _477 = abs(_476);
	float _480 = position_delta_y1.z * position_delta_y1.z;
	float _483 = position_delta_y2.z * position_delta_y2.z;
	float _484 = _480 - _483;
	float _485 = abs(_484);
	float _486 = _477 + _485;
	float deltaz = _486;
	vec3 _488 = cross(position_delta_y1, position_delta_x1);
	vec3 _489 = normalize(_488);
	vec3 _491 = _489 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _493 = _491 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec4 _497 = vec4(_493.x, _493.y, _493.z, deltaz);
	normal = _497;
	vec4 _499 = texture(V_xqUINT_xsBackBufferTex, MXAO.uv.xy);
	color = _499;
	vec2 _500;
	_500 = MXAO.uv.xy;
	float _502 = F_xqUINT_xlinear_depth(_500);
	float _504 = _502 * 1.00000000e+03;
	depth = vec4(_504);
	return;
}
void F_xPS_StencilSetup(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color)
{
	vec2 _513;
	_513 = MXAO.uv.zw;
	float _515 = F_xqUINT_xlinear_depth(_513);
	bool _516 = _515 >= V_xMXAO_FADE_DEPTH_END;
	float _518 = 1.25000000e-01 * V_xMXAO_SAMPLE_RADIUS;
	vec4 _520 = texture(V_xsMXAO_DepthTex, MXAO.uv.zw);
	float _523 = _520.x + 2.00000000e+00;
	float _524 = _518 / _523;
	float _526 = _524 * 1.08000000e+03;
	bool _528 = _526 < 1.00000000e+00;
	bool _529 = _516 || _528;
	bool _532 = MXAO.uv.z > 1.00000000e+00;
	bool _533 = _529 || _532;
	bool _536 = MXAO.uv.w > 1.00000000e+00;
	bool _537 = _533 || _536;
	if (_537)
	{
		discard;
		return;
	}
	color = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	return;
}
void F_xPS_AmbientObscurance(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color)
{
	vec2 _543;
	S_xMXAO_VSOUT _544;
	int _545;
	_543 = MXAO.uv.zw;
	_544 = MXAO;
	_545 = 0;
	vec3 _548 = F_xget_position_from_uv_mipmapped(_543, _544, _545);
	vec3 position_549 = _548;
	vec4 _551 = texture(V_xsMXAO_NormalTex, MXAO.uv.zw);
	vec3 _554 = _551.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _556 = _554 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 normal_557 = _556;
	vec2 _560 = fmodHLSL(MXAO.vpos.xy, vec2(4.00000000e+00, 4.00000000e+00));
	vec2 _562 = _560 + vec2(1.00000001e-01, 1.00000001e-01);
	vec2 _563 = floor(_562);
	float _565 = dot(_563, vec2(6.25000000e-02, 2.50000000e-01));
	float _567 = _565 + 6.25000000e-02;
	float sample_jitter = _567;
	float _571 = MXAO.vpos.x + MXAO.vpos.y;
	float _573 = fmodHLSL(_571, 2.00000000e+00);
	float layer_id_574 = _573;
	float _577 = position_549.z / 1.00000000e+03;
	float linear_depth = _577;
	vec3 _580 = normal_557 * vec3(linear_depth);
	vec3 _581 = position_549 + _580;
	position_549 = _581;
	bool _586 = V_xMXAO_GLOBAL_SAMPLE_QUALITY_PRESET == 7;
	if (_586)
	{
		float _588 = 5.00000007e-02 * V_xMXAO_SAMPLE_RADIUS;
		float _589 = _588 / linear_depth;
		float _590 = floor(_589);
		float _592 = 2.00000000e+00 + _590;
		MXAO.samples = _592;
	}
	float scaled_radius_594 = 0.00000000e+00;
	float falloff_factor_596 = 0.00000000e+00;
	S_xMXAO_VSOUT _597;
	float _598;
	float _599;
	float _600;
	float _601;
	_597 = MXAO;
	_598 = position_549.z;
	_599 = layer_id_574;
	F_xsample_parameter_setup(_597, _598, _599, _600, _601);
	scaled_radius_594 = _600;
	falloff_factor_596 = _601;
	vec2 tap_uv_605 = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 sample_dir = vec2(0.00000000e+00, 0.00000000e+00);
	float _609 = 3.83994102e+01 * sample_jitter;
	float _610;
	float _611;
	_610 = sin(_609), _611 = cos(_609);
	sample_dir[0] = _610;
	sample_dir[1] = _611;
	vec2 _614 = sample_dir * vec2(scaled_radius_594);
	sample_dir = _614;
	color = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int i_617 = 0;
	while (float(i_617) < MXAO.samples)
	{
		{
			vec2 _631 = sample_dir.xy * vec2(1.00000000e+00, 1.77777779e+00);
			float _633 = float(i_617) + sample_jitter;
			vec2 _635 = _631 * vec2(_633);
			vec2 _637 = MXAO.uv.zw + _635;
			tap_uv_605 = _637;
			vec2 _640 = (mat2x2(7.64649987e-01, -6.44439995e-01, 6.44439995e-01, 7.64649987e-01) * sample_dir.xy);
			sample_dir.xy = _640;
			float _642 = scaled_radius_594 * float(i_617);
			float _644 = _642 * 2.00000000e+01;
			float _645 = clamp(_644, 0.0, 1.0);
			float _647 = _645 * 3.00000000e+00;
			float sample_mip = _647;
			vec3 _649 = -(position_549);
			float _651 = sample_mip + 0.00000000e+00;
			vec2 _652;
			S_xMXAO_VSOUT _653;
			int _654;
			_652 = tap_uv_605;
			_653 = MXAO;
			_654 = int(_651);
			vec3 _656 = F_xget_position_from_uv_mipmapped(_652, _653, _654);
			vec3 _657 = _649 + _656;
			vec3 delta_v = _657;
			float _659 = dot(delta_v, delta_v);
			float v2 = _659;
			float _661 = dot(delta_v, normal_557);
			float _662 = inversesqrt(v2);
			float _663 = _661 * _662;
			float vn = _663;
			float _665 = falloff_factor_596 * v2;
			float _667 = 1.00000000e+00 + _665;
			float _668 = clamp(_667, 0.0, 1.0);
			float _669 = vn - V_xMXAO_SAMPLE_NORMAL_BIAS;
			float _670 = clamp(_669, 0.0, 1.0);
			float _671 = _668 * _670;
			float sample_ao = _671;
			float _674 = color.w + sample_ao;
			color[3] = _674;
		}
		int _627 = i_617;
		int _628 = _627 + 1;
		i_617 = _628;
	}
	float _676 = 1.00000000e+00 - V_xMXAO_SAMPLE_NORMAL_BIAS;
	float _678 = _676 * MXAO.samples;
	vec4 _680 = color / vec4(_678);
	vec4 _682 = _680 * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _683 = clamp(_682, 0.0, 1.0);
	color = _683;
	color = vec4(color.w);
	vec4 _685 = sqrt(color);
	color = _685;
	return;
}
void F_xPS_AmbientObscuranceHQ(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color)
{
	vec2 _690;
	S_xMXAO_VSOUT _691;
	int _692;
	_690 = MXAO.uv.zw;
	_691 = MXAO;
	_692 = 0;
	vec3 _695 = F_xget_position_from_uv_mipmapped(_690, _691, _692);
	vec3 position_696 = _695;
	vec4 _698 = texture(V_xsMXAO_NormalTex, MXAO.uv.zw);
	vec3 _701 = _698.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _703 = _701 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _704 = normalize(_703);
	vec3 normal_705 = _704;
	vec3 _706 = -(position_696);
	vec3 _707 = normalize(_706);
	vec3 viewdir = _707;
	float _711 = MXAO.samples / 3.20000000e+01;
	float _712 = floor(_711);
	float _714 = _712 * 2.00000000e+00;
	float _716 = 2.00000000e+00 + _714;
	int directions = int(_716);
	int _720 = directions * 2;
	float _723 = MXAO.samples / float(_720);
	int stepshalf = int(_723);
	float _728 = viewdir.z * viewdir.z;
	float _730 = 1.00000000e+00 - _728;
	float angle_correct = _730;
	float _733 = V_xMXAO_SAMPLE_RADIUS / position_696.z;
	float _735 = _733 / float(stepshalf);
	float _737 = _735 * 1.00000000e+03;
	float scaled_radius_738 = _737;
	float _739 = V_xMXAO_SAMPLE_RADIUS * V_xMXAO_SAMPLE_RADIUS;
	float _740 = 1.0 / _739;
	float _742 = 2.50000000e-01 * _740;
	float falloff_factor_743 = _742;
	vec2 _746 = fmodHLSL(MXAO.vpos.xy, vec2(4.00000000e+00, 4.00000000e+00));
	vec2 _748 = _746 + vec2(1.00000001e-01, 1.00000001e-01);
	vec2 _749 = floor(_748);
	float _751 = dot(_749, vec2(6.25000000e-02, 2.50000000e-01));
	float _753 = _751 + 6.25000000e-02;
	float sample_jitter_754 = _753;
	float _757 = 3.14159274e+00 / float(directions);
	float dir_phi = _757;
	vec2 sample_dir_760 = vec2(0.00000000e+00, 0.00000000e+00);
	float _761 = dir_phi * sample_jitter_754;
	float _763 = _761 * 6.00000000e+00;
	float _764;
	float _765;
	_764 = sin(_763), _765 = cos(_763);
	sample_dir_760[1] = _764;
	sample_dir_760[0] = _765;
	float _767 = cos(dir_phi);
	float _768 = sin(dir_phi);
	float _769 = -(_768);
	float _770 = sin(dir_phi);
	float _771 = cos(dir_phi);
	mat2x2 _772 = mat2x2(_767, _769, _770, _771);
	mat2x2 rot_dir = _772;
	color = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float i_776 = 0.00000000e+00;
	while (i_776 < float(directions))
	{
		{
			vec2 _787 = (rot_dir * sample_dir_760);
			sample_dir_760 = _787;
			vec2 _789 = sample_dir_760 * vec2(sample_jitter_754);
			vec2 start = _789;
			vec3 _794 = vec3(sample_dir_760.x, sample_dir_760.y, 0.00000000e+00);
			vec3 sliceDir = _794;
			vec2 h = vec2(-1.00000000e+00, -1.00000000e+00);
			int j = 0;
			while (j < stepshalf)
			{
				{
					vec4 _811 = vec4(scaled_radius_738) * vec4(5.20833360e-04, 9.25925910e-04, 5.20833360e-04, 9.25925910e-04);
					vec4 _813 = _811 * start.xyxy;
					vec4 _815 = _813 * vec4(1.00000000e+00, 1.00000000e+00, -1.00000000e+00, -1.00000000e+00);
					vec4 _817 = MXAO.uv.zwzw + _815;
					vec4 tap_uv_818 = _817;
					float _820 = scaled_radius_738 * float(j);
					float _822 = _820 * 9.99999978e-03;
					float _823 = clamp(_822, 0.0, 1.0);
					float _825 = _823 * 3.00000000e+00;
					float sample_mip_826 = _825;
					vec3 delta_v_828[2] = _827;
					vec3 _829 = -(position_696);
					float _831 = sample_mip_826 + 0.00000000e+00;
					vec2 _832;
					S_xMXAO_VSOUT _833;
					int _834;
					_832 = tap_uv_818.xy;
					_833 = MXAO;
					_834 = int(_831);
					vec3 _837 = F_xget_position_from_uv_mipmapped(_832, _833, _834);
					vec3 _838 = _829 + _837;
					delta_v_828[0] = _838;
					vec3 _839 = -(position_696);
					float _841 = sample_mip_826 + 0.00000000e+00;
					vec2 _842;
					S_xMXAO_VSOUT _843;
					int _844;
					_842 = tap_uv_818.zw;
					_843 = MXAO;
					_844 = int(_841);
					vec3 _847 = F_xget_position_from_uv_mipmapped(_842, _843, _844);
					vec3 _848 = _839 + _847;
					delta_v_828[1] = _848;
					float _851 = dot(delta_v_828[0], delta_v_828[0]);
					float _854 = dot(delta_v_828[1], delta_v_828[1]);
					vec2 _855 = vec2(_851, _854);
					vec2 v2_856 = _855;
					vec2 _857 = inversesqrt(v2_856);
					vec2 inv_distance = _857;
					float _860 = dot(delta_v_828[0], viewdir);
					float _862 = dot(delta_v_828[1], viewdir);
					vec2 _863 = vec2(_860, _862);
					vec2 _864 = _863 * inv_distance;
					vec2 sample_h = _864;
					vec2 _867 = v2_856 * vec2(falloff_factor_743);
					vec2 _868 = clamp(_867, 0.0, 1.0);
					vec2 falloff = _868;
					vec2 _870 = mix(sample_h, h, falloff);
					sample_h = _870;
					bvec2 _871 = greaterThan(sample_h, h);
					vec2 _873 = mix(sample_h, h, vec2(7.50000000e-01, 7.50000000e-01));
					vec2 _874 = compCond(_871, sample_h, _873);
					h.xy = _874;
					vec2 _875 = start + sample_dir_760;
					start = _875;
				}
				int _807 = j;
				int _808 = _807 + 1;
				j = _808;
			}
			vec3 _876 = cross(sliceDir, viewdir);
			vec3 _877 = normalize(_876);
			vec3 normal_slice_plane = _877;
			vec3 _879 = cross(viewdir, normal_slice_plane);
			vec3 tangent = _879;
			float _881 = dot(normal_705, normal_slice_plane);
			vec3 _883 = normal_slice_plane * vec3(_881);
			vec3 _884 = normal_705 - _883;
			vec3 proj_normal = _884;
			float _886 = length(proj_normal);
			float proj_length = _886;
			float _888 = dot(proj_normal, viewdir);
			float _889 = 1.0 / proj_length;
			float _890 = _888 * _889;
			float _893 = clamp(_890, -1.00000000e+00, 1.00000000e+00);
			float cos_gamma = _893;
			float _895 = dot(proj_normal, tangent);
			float _896 = sign(_895);
			float _897 = -(_896);
			float _898 = acos(cos_gamma);
			float _899 = _897 * _898;
			float gamma = _899;
			vec2 _902 = min(h, vec2(1.00000000e+00, 1.00000000e+00));
			vec2 _903 = acos(_902);
			h = _903;
			float _905 = -(h.x);
			float _906 = _905 - gamma;
			float _908 = max(_906, -1.57079625e+00);
			float _909 = gamma + _908;
			h[0] = _909;
			float _911 = h.y - gamma;
			float _913 = min(_911, 1.57079625e+00);
			float _914 = gamma + _913;
			h[1] = _914;
			vec2 _916 = h * vec2(2.00000000e+00, 2.00000000e+00);
			h = _916;
			float _917 = sin(gamma);
			vec2 _919 = h * vec2(_917);
			vec2 _921 = vec2(cos_gamma) + _919;
			vec2 _923 = h - vec2(gamma);
			vec2 _924 = cos(_923);
			vec2 _925 = _921 - _924;
			vec2 sample_ao_926 = _925;
			float _928 = dot(sample_ao_926, vec2(2.50000000e-01, 2.50000000e-01));
			float _929 = proj_length * _928;
			float _931 = color.w + _929;
			color[3] = _931;
		}
		float _785 = i_776;
		float _786 = _785 + 1.00000000e+00;
		i_776 = _786;
	}
	vec4 _933 = color / vec4(ivec4(directions));
	color = _933;
	float _936 = 1.00000000e+00 - color.w;
	color[3] = _936;
	color = vec4(color.w);
	vec4 _938 = sqrt(color);
	color = _938;
	return;
}
void F_xPS_SpatialFilter1(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color)
{
	S_xMXAO_VSOUT _943;
	float _944;
	float _945;
	int _946;
	_943 = MXAO;
	_944 = V_xMXAO_GLOBAL_RENDER_SCALE;
	_945 = 7.50000000e-01;
	_946 = 4;
	vec4 _949 = F_xblur_filter(_943, V_xsCommonTex0, _944, _945, _946);
	color = _949;
	return;
}
void F_xPS_SpatialFilter2(
	in S_xMXAO_VSOUT MXAO,
	out vec4 color)
{
	float _955 = 1.00000000e+00 / V_xMXAO_GLOBAL_RENDER_SCALE;
	S_xMXAO_VSOUT _956;
	float _957;
	float _958;
	int _959;
	_956 = MXAO;
	_957 = 1.00000000e+00;
	_958 = _955;
	_959 = 8;
	vec4 _962 = F_xblur_filter(_956, V_xsCommonTex1, _957, _958, _959);
	vec4 ssil_ssao = _962;
	vec4 _964 = ssil_ssao * ssil_ssao;
	ssil_ssao = _964;
	vec4 _966 = texture(V_xsMXAO_ColorTex, MXAO.uv.xy);
	color = _966;
	vec2 _967;
	_967 = MXAO.uv.xy;
	float _969 = F_xqUINT_xlinear_depth(_967);
	float scenedepth = _969;
	float _973 = dot(color.xyz, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	float colorgray = _973;
	float _976 = 1.00000000e+00 - colorgray;
	float blendfact = _976;
	ssil_ssao.xyz = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _981 = 1.00000000e+00 - ssil_ssao.w;
	float _982 = clamp(_981, 0.0, 1.0);
	float _984 = V_xMXAO_SSAO_AMOUNT * 2.00000000e+00;
	float _985 = pow(_982, _984);
	float _987 = 1.00000000e+00 - _985;
	ssil_ssao[3] = _987;
	vec4 _990 = vec4(scenedepth) * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 1.00000000e+00);
	vec4 _993 = smoothstep(vec4(V_xMXAO_FADE_DEPTH_START), vec4(V_xMXAO_FADE_DEPTH_END), _990);
	vec4 _995 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _993;
	vec4 _996 = ssil_ssao * _995;
	ssil_ssao = _996;
	bool _1001 = V_xMXAO_BLEND_TYPE == 0;
	if (_1001)
	{
		vec3 _1004 = ssil_ssao.www - ssil_ssao.xyz;
		vec3 _1006 = _1004 * vec3(blendfact);
		vec3 _1008 = _1006 * color.xyz;
		vec3 _1010 = color.xyz - _1008;
		color.xyz = _1010;
	}
	else
	{
		bool _1015 = V_xMXAO_BLEND_TYPE == 1;
		if (_1015)
		{
			vec3 _1018 = ssil_ssao.www * vec3(blendfact);
			vec3 _1020 = _1018 * vec3(1.20000005e+00, 1.20000005e+00, 1.20000005e+00);
			vec3 _1022 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1020;
			vec3 _1023 = clamp(_1022, 0.0, 1.0);
			vec3 _1025 = color.xyz * _1023;
			vec3 _1028 = ssil_ssao.xyz * vec3(blendfact);
			vec3 _1030 = _1028 * vec3(colorgray);
			vec3 _1032 = _1030 * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
			vec3 _1033 = _1025 + _1032;
			color.xyz = _1033;
		}
		else
		{
			bool _1038 = V_xMXAO_BLEND_TYPE == 2;
			if (_1038)
			{
				vec3 _1041 = color.xyz + vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07);
				vec3 _1042 = normalize(_1041);
				vec3 _1045 = ssil_ssao.xyz + vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07);
				vec3 _1046 = normalize(_1045);
				float _1047 = distance(_1042, _1046);
				float _1049 = 2.00000000e+00 * _1047;
				float _1050 = clamp(_1049, 0.0, 1.0);
				float colordiff = _1050;
				float _1054 = dot(color.xyz, vec3(3.33299994e-01, 3.33299994e-01, 3.33299994e-01));
				vec3 _1058 = mix(color.xyz, vec3(_1054), vec3(colordiff));
				vec3 _1060 = ssil_ssao.xyz * _1058;
				vec3 _1062 = _1060 * vec3(blendfact);
				vec3 _1064 = _1062 * vec3(blendfact);
				vec3 _1066 = _1064 * vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
				vec3 _1068 = color.xyz + _1066;
				color.xyz = _1068;
				float _1071 = dot(color.xyz, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
				float _1073 = 1.00000000e+00 - _1071;
				vec3 _1076 = ssil_ssao.www * vec3(_1073);
				vec3 _1078 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1076;
				vec3 _1080 = color.xyz * _1078;
				color.xyz = _1080;
			}
			else
			{
				bool _1085 = V_xMXAO_BLEND_TYPE == 3;
				if (_1085)
				{
					vec3 _1088 = color.xyz * color.xyz;
					color.xyz = _1088;
					vec3 _1091 = ssil_ssao.www - ssil_ssao.xyz;
					vec3 _1093 = _1091 * color.xyz;
					vec3 _1095 = color.xyz - _1093;
					color.xyz = _1095;
					vec3 _1097 = sqrt(color.xyz);
					color.xyz = _1097;
				}
			}
		}
	}
	bool _1102 = V_xMXAO_DEBUG_VIEW_ENABLE == 1;
	if (_1102)
	{
		vec3 _1105 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - ssil_ssao.www;
		vec3 _1107 = _1105 + ssil_ssao.xyz;
		vec3 _1109 = max(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), _1107);
		color.xyz = _1109;
		float _1113 = false ? 5.00000000e-01 : 1.00000000e+00;
		vec3 _1116 = color.xyz * vec3(_1113);
		color.xyz = _1116;
	}
	else
	{
		bool _1121 = V_xMXAO_DEBUG_VIEW_ENABLE == 2;
		if (_1121)
		{
			vec4 _1123 = texture(V_xsMXAO_NormalTex, MXAO.uv.xy);
			color.xyz = _1123.xyz;
			float _1127 = 1.00000000e+00 - color.z;
			color[2] = _1127;
		}
	}
	color[3] = 1.00000000e+00;
	return;
}
#ifdef E_xVS_MXAO
layout(location = 0) out vec4 _return_uv;
layout(location = 1) out float _return_samples;
layout(location = 4) out vec3 _return_uvtoviewADD;
layout(location = 5) out vec3 _return_uvtoviewMUL;
void main()
{
	uint id = uint(gl_VertexID);
	S_xMXAO_VSOUT _return = F_xVS_MXAO(id);
	gl_Position = _return.vpos;
	_return_uv = _return.uv;
	_return_samples = _return.samples;
	_return_uvtoviewADD = _return.uvtoviewADD;
	_return_uvtoviewMUL = _return.uvtoviewMUL;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_InputBufferSetup
in vec4 vv_0;
flat in float vv_1;
flat in vec3 vv_4;
flat in vec3 vv_5;
layout(location = 0) out vec4 _out_color;
layout(location = 1) out vec4 _out_depth;
layout(location = 2) out vec4 _out_normal;
void main()
{
	S_xMXAO_VSOUT _in_MXAO = S_xMXAO_VSOUT(gl_FragCoord, vv_0, vv_1, vv_4, vv_5);
	S_xMXAO_VSOUT MXAO = _in_MXAO;
	vec4 color;
	vec4 depth;
	vec4 normal;
	F_xPS_InputBufferSetup(MXAO, color, depth, normal);
	_out_color = color;
	_out_depth = depth;
	_out_normal = normal;
	return;
}
#endif
#ifdef E_xPS_StencilSetup
in vec4 vv_0;
flat in float vv_1;
flat in vec3 vv_4;
flat in vec3 vv_5;
layout(location = 0) out vec4 _out_color;
void main()
{
	S_xMXAO_VSOUT _in_MXAO = S_xMXAO_VSOUT(gl_FragCoord, vv_0, vv_1, vv_4, vv_5);
	S_xMXAO_VSOUT MXAO = _in_MXAO;
	vec4 color;
	F_xPS_StencilSetup(MXAO, color);
	_out_color = color;
	return;
}
#endif
#ifdef E_xPS_AmbientObscurance
in vec4 vv_0;
flat in float vv_1;
flat in vec3 vv_4;
flat in vec3 vv_5;
layout(location = 0) out vec4 _out_color;
void main()
{
	S_xMXAO_VSOUT _in_MXAO = S_xMXAO_VSOUT(gl_FragCoord, vv_0, vv_1, vv_4, vv_5);
	S_xMXAO_VSOUT MXAO = _in_MXAO;
	vec4 color;
	F_xPS_AmbientObscurance(MXAO, color);
	_out_color = color;
	return;
}
#endif
#ifdef E_xPS_SpatialFilter1
in vec4 vv_0;
flat in float vv_1;
flat in vec3 vv_4;
flat in vec3 vv_5;
layout(location = 0) out vec4 _out_color;
void main()
{
	S_xMXAO_VSOUT _in_MXAO = S_xMXAO_VSOUT(gl_FragCoord, vv_0, vv_1, vv_4, vv_5);
	S_xMXAO_VSOUT MXAO = _in_MXAO;
	vec4 color;
	F_xPS_SpatialFilter1(MXAO, color);
	_out_color = color;
	return;
}
#endif
#ifdef E_xPS_SpatialFilter2
in vec4 vv_0;
flat in float vv_1;
flat in vec3 vv_4;
flat in vec3 vv_5;
layout(location = 0) out vec4 _out_color;
void main()
{
	S_xMXAO_VSOUT _in_MXAO = S_xMXAO_VSOUT(gl_FragCoord, vv_0, vv_1, vv_4, vv_5);
	S_xMXAO_VSOUT MXAO = _in_MXAO;
	vec4 color;
	F_xPS_SpatialFilter2(MXAO, color);
	_out_color = color;
	return;
}
#endif
