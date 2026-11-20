#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_FilterH
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
float fmodHLSL(float x, float y) { return x - y * trunc(x / y); }
vec2 fmodHLSL(vec2 x, vec2 y) { return x - y * trunc(x / y); }
vec3 fmodHLSL(vec3 x, vec3 y) { return x - y * trunc(x / y); }
vec4 fmodHLSL(vec4 x, vec4 y) { return x - y * trunc(x / y); }
mat2 fmodHLSL(mat2 x, mat2 y) { return x - matrixCompMult(y, mat2(trunc(x[0] / y[0]), trunc(x[1] / y[1]))); }
mat3 fmodHLSL(mat3 x, mat3 y) { return x - matrixCompMult(y, mat3(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]))); }
mat4 fmodHLSL(mat4 x, mat4 y) { return x - matrixCompMult(y, mat4(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]), trunc(x[3] / y[3]))); }
uniform float V_xSSR_FIELD_OF_VIEW;
uniform float V_xSSR_REFLECTION_INTENSITY;
uniform float V_xSSR_FRESNEL_EXP;
uniform float V_xSSR_FADE_DIST;
uniform float V_xSSR_RAY_INC;
uniform float V_xSSR_ACCEPT_RANGE;
uniform float V_xSSR_JITTER_AMOUNT;
uniform float V_xSSR_FILTER_SIZE;
uniform float V_xSSR_RELIEF_AMOUNT;
uniform float V_xSSR_RELIEF_SCALE;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
uniform sampler2D V_xsSSR_ColorTex;
uniform sampler2D V_xsCommonTex0;
uniform sampler2D V_xsCommonTex1;
struct S_xSSR_VSOUT
{
	vec4 vpos;
	vec2 uv;
	vec3 uvtoviewADD;
	vec3 uvtoviewMUL;
};
S_xSSR_VSOUT _100;
struct S_xRay
{
	vec3 origin;
	vec3 dir;
	float _step;
	vec3 pos;
};
struct S_xSceneData
{
	vec3 eyedir;
	vec3 normal;
	vec3 position;
	float depth;
};
struct S_xTraceData
{
	int num_steps;
	int num_refines;
	vec2 uv;
	vec3 error;
	bool hit;
};
struct S_xBlurData
{
	vec4 key;
	vec4 mask;
};
S_xSceneData _444;
S_xRay _473;
S_xTraceData _502;
S_xBlurData _680;
S_xBlurData _682;
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _22 = uv.x / 1.00000000e+00;
	uv[0] = _22;
	float _25 = uv.y / 1.00000000e+00;
	uv[1] = _25;
	float _28 = uv.x - 0.00000000e+00;
	uv[0] = _28;
	float _31 = uv.y + 0.00000000e+00;
	uv[1] = _31;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _35;
	_35 = uv;
	vec2 _36 = F_xqUINT_xdepthtex_uv(_35);
	vec4 _41 = vec4(_36.x, _36.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _42 = textureLod(V_xqUINT_xsDepthBufferTex, _41.xy, _41.w);
	float depth = _42.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _49 = depth * 1.00000000e+00;
	depth = _49;
	float _51 = 1.00000000e+00 - depth;
	depth = _51;
	float _53 = depth * 9.99000000e+02;
	float _55 = 1.00000000e+03 - _53;
	float _56 = depth / _55;
	depth = _56;
	float _57 = clamp(depth, 0.0, 1.0);
	return _57;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _61;
	_61 = uv;
	float _62 = F_xqUINT_xget_depth(_61);
	float depth_63 = _62;
	float _64;
	_64 = depth_63;
	float _65 = F_xqUINT_xlinearize_depth(_64);
	depth_63 = _65;
	return depth_63;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _72 = id == 2u;
	float _75 = _72 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _75;
	bool _77 = id == 1u;
	float _80 = _77 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _80;
	vec2 _82 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _84 = _82 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _89 = vec4(_84.x, _84.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _89;
	return;
}
S_xSSR_VSOUT F_xVS_SSR(
	in uint id)
{
	S_xSSR_VSOUT o = _100;
	bool _103 = id == 2u;
	float _106 = _103 ? 2.00000000e+00 : 0.00000000e+00;
	o.uv[0] = _106;
	bool _108 = id == 1u;
	float _111 = _108 ? 2.00000000e+00 : 0.00000000e+00;
	o.uv[1] = _111;
	vec2 _114 = o.uv.xy * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _116 = _114 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _121 = vec4(_116.x, _116.y, 0.00000000e+00, 1.00000000e+00);
	o.vpos = _121;
	float _123 = V_xSSR_FIELD_OF_VIEW * 5.00000000e-01;
	float _124 = radians(_123);
	float _125 = tan(_124);
	vec2 _127 = -(vec2(_125));
	vec3 _131 = vec3(_127.x, _127.y, 1.00000000e+00);
	vec3 _133 = _131 * vec3(1.77777779e+00, 1.00000000e+00, 1.00000000e+00);
	o.uvtoviewADD = _133;
	vec2 _136 = vec2(-2.00000000e+00, -2.00000000e+00) * o.uvtoviewADD.xy;
	vec3 _140 = vec3(_136.x, _136.y, 0.00000000e+00);
	o.uvtoviewMUL = _140;
	return o;
}
vec3 F_xget_position_from_uv(
	in vec2 uv,
	in S_xSSR_VSOUT i)
{
	vec3 _147 = uv.xyx * i.uvtoviewMUL;
	vec3 _149 = _147 + i.uvtoviewADD;
	vec2 _150;
	_150 = uv;
	float _151 = F_xqUINT_xlinear_depth(_150);
	vec3 _153 = _149 * vec3(_151);
	vec3 _155 = _153 * vec3(1.00000000e+03, 1.00000000e+03, 1.00000000e+03);
	return _155;
}
vec2 F_xget_uv_from_position(
	in vec3 pos,
	in S_xSSR_VSOUT i)
{
	vec2 _162 = i.uvtoviewMUL.xy * vec2(pos.z);
	vec2 _164 = pos.xy / _162;
	vec2 _167 = i.uvtoviewADD.xy / i.uvtoviewMUL.xy;
	vec2 _168 = _164 - _167;
	return _168;
}
vec4 F_xget_normal_and_edges_from_depth(
	in S_xSSR_VSOUT i)
{
	vec3 single_pixel_offset = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec2 _174;
	S_xSSR_VSOUT _175;
	_174 = i.uv;
	_175 = i;
	vec3 _177 = F_xget_position_from_uv(_174, _175);
	vec3 position = _177;
	vec3 _179 = -(position);
	vec2 _182 = i.uv + single_pixel_offset.xz;
	vec2 _183;
	S_xSSR_VSOUT _184;
	_183 = _182;
	_184 = i;
	vec3 _185 = F_xget_position_from_uv(_183, _184);
	vec3 _186 = _179 + _185;
	vec3 position_delta_x1 = _186;
	vec2 _190 = i.uv - single_pixel_offset.xz;
	vec2 _191;
	S_xSSR_VSOUT _192;
	_191 = _190;
	_192 = i;
	vec3 _193 = F_xget_position_from_uv(_191, _192);
	vec3 _194 = position - _193;
	vec3 position_delta_x2 = _194;
	vec3 _196 = -(position);
	vec2 _199 = i.uv + single_pixel_offset.zy;
	vec2 _200;
	S_xSSR_VSOUT _201;
	_200 = _199;
	_201 = i;
	vec3 _202 = F_xget_position_from_uv(_200, _201);
	vec3 _203 = _196 + _202;
	vec3 position_delta_y1 = _203;
	vec2 _207 = i.uv - single_pixel_offset.zy;
	vec2 _208;
	S_xSSR_VSOUT _209;
	_208 = _207;
	_209 = i;
	vec3 _210 = F_xget_position_from_uv(_208, _209);
	vec3 _211 = position - _210;
	vec3 position_delta_y2 = _211;
	float _214 = abs(position_delta_x1.z);
	float _216 = abs(position_delta_x2.z);
	bool _217 = _214 > _216;
	vec3 _219 = mix(position_delta_x1, position_delta_x2, vec3(bvec3(_217)));
	position_delta_x1 = _219;
	float _221 = abs(position_delta_y1.z);
	float _223 = abs(position_delta_y2.z);
	bool _224 = _221 > _223;
	vec3 _226 = mix(position_delta_y1, position_delta_y2, vec3(bvec3(_224)));
	position_delta_y1 = _226;
	float _229 = position_delta_x1.z * position_delta_x1.z;
	float _232 = position_delta_x2.z * position_delta_x2.z;
	float _233 = _229 - _232;
	float _234 = abs(_233);
	float _237 = position_delta_y1.z * position_delta_y1.z;
	float _240 = position_delta_y2.z * position_delta_y2.z;
	float _241 = _237 - _240;
	float _242 = abs(_241);
	float _243 = _234 + _242;
	float deltaz = _243;
	vec3 _245 = cross(position_delta_y1, position_delta_x1);
	vec3 _246 = normalize(_245);
	vec4 _250 = vec4(_246.x, _246.y, _246.z, deltaz);
	return _250;
}
vec3 F_xget_normal_from_color(
	in vec2 uv,
	in vec2 offset,
	in float scale,
	in float sharpness)
{
	vec3 _260 = vec3(offset.xy.x, offset.xy.y, 0.00000000e+00);
	vec3 offset_swiz = _260;
	vec2 _263 = uv + offset_swiz.xz;
	vec4 _268 = vec4(_263.x, _263.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _269 = textureLod(V_xqUINT_xsBackBufferTex, _268.xy, _268.w);
	float _272 = dot(_269.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _273 = _272 * scale;
	float hpx = _273;
	vec2 _276 = uv - offset_swiz.xz;
	vec4 _281 = vec4(_276.x, _276.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _282 = textureLod(V_xqUINT_xsBackBufferTex, _281.xy, _281.w);
	float _285 = dot(_282.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _286 = _285 * scale;
	float hmx = _286;
	vec2 _289 = uv + offset_swiz.zy;
	vec4 _294 = vec4(_289.x, _289.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _295 = textureLod(V_xqUINT_xsBackBufferTex, _294.xy, _294.w);
	float _298 = dot(_295.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _299 = _298 * scale;
	float hpy = _299;
	vec2 _302 = uv - offset_swiz.zy;
	vec4 _307 = vec4(_302.x, _302.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _308 = textureLod(V_xqUINT_xsBackBufferTex, _307.xy, _307.w);
	float _311 = dot(_308.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _312 = _311 * scale;
	float hmy = _312;
	vec2 _315 = uv + offset_swiz.xz;
	vec2 _316;
	_316 = _315;
	float _317 = F_xqUINT_xlinear_depth(_316);
	float dpx = _317;
	vec2 _320 = uv - offset_swiz.xz;
	vec2 _321;
	_321 = _320;
	float _322 = F_xqUINT_xlinear_depth(_321);
	float dmx = _322;
	vec2 _325 = uv + offset_swiz.zy;
	vec2 _326;
	_326 = _325;
	float _327 = F_xqUINT_xlinear_depth(_326);
	float dpy = _327;
	vec2 _330 = uv - offset_swiz.zy;
	vec2 _331;
	_331 = _330;
	float _332 = F_xqUINT_xlinear_depth(_331);
	float dmy = _332;
	float _334 = dmx - dpx;
	float _335 = abs(_334);
	float _336 = dmy - dpy;
	float _337 = abs(_336);
	vec2 _338 = vec2(_335, _337);
	vec2 _340 = _338 * vec2(sharpness);
	vec2 xymult = _340;
	vec2 _343 = vec2(1.00000000e+00, 1.00000000e+00) - xymult;
	vec2 _344 = clamp(_343, 0.0, 1.0);
	xymult = _344;
	vec3 normal = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _347 = hmx - hpx;
	float _348 = hmy - hpy;
	vec2 _349 = vec2(_347, _348);
	vec2 _350 = _349 * xymult;
	vec2 _352 = _350 / offset.xy;
	vec2 _354 = _352 * vec2(5.00000000e-01, 5.00000000e-01);
	normal.xy = _354;
	normal[2] = 1.00000000e+00;
	vec3 _356 = normalize(normal);
	return _356;
}
vec3 F_xblend_normals(
	in vec3 n1,
	in vec3 n2)
{
	vec3 _362 = n1 + vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
	n1 = _362;
	vec3 _364 = n2 * vec3(-1.00000000e+00, -1.00000000e+00, 1.00000000e+00);
	n2 = _364;
	float _365 = dot(n1, n2);
	vec3 _367 = n1 * vec3(_365);
	vec3 _369 = _367 / vec3(n1.z);
	vec3 _370 = _369 - n2;
	return _370;
}
float F_xbayer(
	in vec2 vpos,
	in int max_level)
{
	float finalBayer = 0.00000000e+00;
	float finalDivisor = 0.00000000e+00;
	float layerMult = 1.00000000e+00;
	float bayerLevel = float(max_level);
	while (bayerLevel >= 1.00000000e+00)
	{
		{
			float _394 = layerMult * 4.00000000e+00;
			layerMult = _394;
			float _396 = 1.00000000e+00 - bayerLevel;
			float _397 = exp2(_396);
			vec2 _400 = vpos.xy * vec2(_397);
			vec2 _401 = floor(_400);
			vec2 _403 = fmodHLSL(_401, vec2(2.00000000e+00, 2.00000000e+00));
			vec2 bayercoord = _403;
			float _407 = bayercoord.x * 2.00000000e+00;
			float line0202 = _407;
			float _410 = 3.00000000e+00 - line0202;
			float _412 = mix(line0202, _410, bayercoord.y);
			float _414 = _412 / 3.00000000e+00;
			float _415 = _414 * layerMult;
			float _416 = finalBayer + _415;
			finalBayer = _416;
			float _417 = finalDivisor + layerMult;
			finalDivisor = _417;
		}
		float _391 = bayerLevel;
		float _392 = _391 - 1.00000000e+00;
		bayerLevel = _392;
	}
	float _418 = finalBayer / finalDivisor;
	return _418;
}
void F_xPS_PrepareColor(
	in S_xSSR_VSOUT i,
	out vec4 o)
{
	vec4 _428 = texture(V_xqUINT_xsBackBufferTex, i.uv);
	o = _428;
	return;
}
void F_xPS_SSR(
	in S_xSSR_VSOUT i,
	out vec4 reflection,
	out vec4 blurbuffer)
{
	S_xSSR_VSOUT _434;
	_434 = i;
	vec4 _435 = F_xget_normal_and_edges_from_depth(_434);
	blurbuffer = _435;
	vec2 _436;
	int _437;
	_436 = i.vpos.xy;
	_437 = 3;
	float _440 = F_xbayer(_436, _437);
	float _442 = _440 - 5.00000000e-01;
	float jitter = _442;
	S_xSceneData scene = _444;
	vec2 _446;
	S_xSSR_VSOUT _447;
	_446 = i.uv;
	_447 = i;
	vec3 _449 = F_xget_position_from_uv(_446, _447);
	scene.position = _449;
	vec3 _451 = normalize(scene.position);
	scene.eyedir = _451;
	vec2 _454 = vec2(2.08333340e-02, 3.70370373e-02) / vec2(scene.position.z);
	vec2 _456 = _454 * vec2(V_xSSR_RELIEF_SCALE);
	float _458 = 4.99999989e-03 * V_xSSR_RELIEF_AMOUNT;
	vec2 _459;
	vec2 _460;
	float _461;
	float _462;
	_459 = i.uv;
	_460 = _456;
	_461 = _458;
	_462 = 1.00000000e+03;
	vec3 _465 = F_xget_normal_from_color(_459, _460, _461, _462);
	vec3 _466;
	vec3 _467;
	_466 = blurbuffer.xyz;
	_467 = _465;
	vec3 _469 = F_xblend_normals(_466, _467);
	scene.normal = _469;
	float _472 = scene.position.z / 1.00000000e+03;
	scene.depth = _472;
	S_xRay ray = _473;
	ray.origin = scene.position;
	vec3 _478 = reflect(scene.eyedir, scene.normal);
	ray.dir = _478;
	float _480 = 5.00000007e-02 * jitter;
	float _481 = _480 * V_xSSR_JITTER_AMOUNT;
	float _483 = 2.00000003e-01 + _481;
	float _485 = sqrt(scene.depth);
	float _486 = _483 * _485;
	float _489 = dot(ray.dir, scene.eyedir);
	float _491 = 1.00000000e+00 - _489;
	float _492 = clamp(_491, 0.0, 1.0);
	float _494 = 1.00000005e-03 + _492;
	float _495 = 1.0 / _494;
	float _496 = _486 * _495;
	ray._step = _496;
	vec3 _499 = ray.dir * vec3(ray._step);
	vec3 _501 = ray.origin + _499;
	ray.pos = _501;
	S_xTraceData trace = _502;
	trace.uv = i.uv;
	trace.hit = false;
	trace.num_steps = 20;
	trace.num_refines = 3;
	int j = 0;
	int k = 0;
	bool uv_inside_screen = false;
	int _520 = j;
	int _521 = _520 + 1;
	j = _521;
	bool _523 = _520 < trace.num_steps;
	while (_523)
	{
		{
			vec3 _524;
			S_xSSR_VSOUT _525;
			_524 = ray.pos;
			_525 = i;
			vec2 _527 = F_xget_uv_from_position(_524, _525);
			trace.uv = _527;
			vec2 _528;
			S_xSSR_VSOUT _529;
			_528 = trace.uv;
			_529 = i;
			vec3 _531 = F_xget_position_from_uv(_528, _529);
			vec3 _533 = _531 - ray.pos;
			trace.error = _533;
			bool _539 = trace.error.z < 0.00000000e+00;
			float _540 = -(V_xSSR_ACCEPT_RANGE);
			float _542 = _540 * ray._step;
			bool _544 = trace.error.z > _542;
			bool _545 = _539 && _544;
			if (_545)
			{
				j = 0;
				bool _551 = k < trace.num_refines;
				if (_551)
				{
					float _553 = ray._step / V_xSSR_RAY_INC;
					ray._step = _553;
					vec3 _556 = ray.dir * vec3(ray._step);
					vec3 _558 = ray.pos - _556;
					ray.pos = _558;
					float _560 = 1.0 / float(trace.num_steps);
					float _561 = V_xSSR_RAY_INC * _560;
					float _563 = ray._step * _561;
					ray._step = _563;
				}
				else
				{
					int _565 = j + trace.num_steps;
					j = _565;
				}
				int _567 = k;
				int _568 = _567 + 1;
				k = _568;
			}
			vec3 _571 = ray.dir * vec3(ray._step);
			vec3 _573 = ray.pos + _571;
			ray.pos = _573;
			float _575 = ray._step * V_xSSR_RAY_INC;
			ray._step = _575;
			float _577 = -(trace.uv.y);
			float _579 = _577 * trace.uv.y;
			float _581 = _579 + trace.uv.y;
			float _582 = clamp(_581, 0.0, 1.0);
			bool _584 = bool(_582);
			uv_inside_screen = _584;
			bool _585 = !bool(uv_inside_screen);
			int _588 = trace.num_steps * int(_585);
			int _589 = j + _588;
			j = _589;
		}
		int _520 = j;
		int _521 = _520 + 1;
		j = _521;
		_523 = _520 < trace.num_steps;
	}
	bool _591 = k != 0;
	trace.hit = _591;
	float SSR_FRESNEL_K = 3.99999991e-02;
	vec3 _595 = -(scene.eyedir);
	float _597 = dot(_595, scene.normal);
	float _599 = 1.00000000e+00 - _597;
	float _600 = clamp(_599, 0.0, 1.0);
	float _601 = pow(_600, V_xSSR_FRESNEL_EXP);
	float _603 = mix(SSR_FRESNEL_K, 1.00000000e+00, _601);
	float _604 = _603 * V_xSSR_REFLECTION_INTENSITY;
	float schlick = _604;
	float _608 = dot(scene.eyedir, ray.dir);
	float _609 = clamp(_608, 0.0, 1.0);
	vec3 _611 = -(scene.eyedir);
	float _613 = dot(_611, scene.normal);
	float _615 = 1.00000000e+00 - _613;
	float _616 = clamp(_615, 0.0, 1.0);
	float _617 = _609 * _616;
	float fade = _617;
	float _620 = float(trace.hit) * schlick;
	float _621 = _620 * fade;
	reflection[3] = _621;
	vec4 _623 = texture(V_xsSSR_ColorTex, trace.uv);
	vec3 _626 = _623.xyz * vec3(reflection.w);
	reflection.xyz = _626;
	vec3 _629 = blurbuffer.xyz * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _631 = _629 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	blurbuffer.xyz = _631;
	return;
}
void F_xspatial_blur_data(
	inout S_xBlurData o,
	in sampler2D inputsampler,
	in vec4 uv)
{
	vec4 _637 = textureLod(inputsampler, uv.xy, uv.w);
	o.key = _637;
	vec4 _638 = textureLod(V_xsCommonTex1, uv.xy, uv.w);
	o.mask = _638;
	vec3 _641 = o.mask.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _643 = _641 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	o.mask.xyz = _643;
	return;
}
float F_xcompute_spatial_tap_weight(
	in S_xBlurData center,
	in S_xBlurData tap)
{
	float _650 = tap.mask.w - center.mask.w;
	float _651 = abs(_650);
	float _653 = _651 * 5.00000000e+01;
	float _655 = 1.00000000e+00 - _653;
	float _656 = clamp(_655, 0.0, 1.0);
	float depth_term = _656;
	float _660 = dot(tap.mask.xyz, center.mask.xyz);
	float _662 = _660 * 5.00000000e+01;
	float _664 = _662 - 4.90000000e+01;
	float _665 = clamp(_664, 0.0, 1.0);
	float normal_term = _665;
	float _667 = depth_term * normal_term;
	return _667;
}
vec4 F_xblur_filter(
	in S_xSSR_VSOUT i,
	in sampler2D inputsampler,
	in float radius,
	in vec2 axis)
{
	vec4 _678 = vec4(i.uv.xy.x, i.uv.xy.y, 0.00000000e+00, 0.00000000e+00);
	vec4 blur_uv = _678;
	S_xBlurData center_681 = _680;
	S_xBlurData tap_683 = _682;
	S_xBlurData _684;
	vec4 _685;
	_684 = center_681;
	_685 = blur_uv;
	F_xspatial_blur_data(_684, inputsampler, _685);
	center_681 = _684;
	bool _691 = V_xSSR_FILTER_SIZE == 0.00000000e+00;
	if (_691)
	{
		return center_681.key;
	}
	float kernel_size = radius;
	float _694 = kernel_size * kernel_size;
	float _696 = _694 + 1.00000005e-03;
	float _697 = 1.0 / _696;
	float _699 = -2.00000000e+00 * _697;
	float k_700 = _699;
	vec4 blursum = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 blursum_noweight = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float blursum_weight = 1.00000005e-03;
	float blursum_noweight_weight = 1.00000005e-03;
	float _709 = floor(kernel_size);
	float _710 = -(_709);
	float j_711 = _710;
	float _717 = floor(kernel_size);
	bool _718 = j_711 <= _717;
	while (_718)
	{
		{
			float _723 = 2.00000000e+00 * j_711;
			float _725 = _723 - 5.00000000e-01;
			vec2 _727 = axis * vec2(_725);
			vec2 _729 = i.uv + _727;
			vec4 _734 = vec4(_729.x, _729.y, 0.00000000e+00, 0.00000000e+00);
			S_xBlurData _735;
			vec4 _736;
			_735 = tap_683;
			_736 = _734;
			F_xspatial_blur_data(_735, inputsampler, _736);
			tap_683 = _735;
			S_xBlurData _738;
			S_xBlurData _739;
			_738 = center_681;
			_739 = tap_683;
			float _740 = F_xcompute_spatial_tap_weight(_738, _739);
			float tap_weight = _740;
			vec4 _744 = tap_683.key * vec4(tap_weight);
			float _745 = j_711 * j_711;
			float _746 = _745 * k_700;
			float _747 = exp(_746);
			vec4 _749 = _744 * vec4(_747);
			vec4 _751 = _749 * vec4(tap_683.key.w);
			vec4 _752 = blursum + _751;
			blursum = _752;
			float _753 = j_711 * j_711;
			float _754 = _753 * k_700;
			float _755 = exp(_754);
			float _756 = tap_weight * _755;
			float _758 = _756 * tap_683.key.w;
			float _759 = blursum_weight + _758;
			blursum_weight = _759;
			float _760 = j_711 * j_711;
			float _761 = _760 * k_700;
			float _762 = exp(_761);
			vec4 _765 = tap_683.key * vec4(_762);
			vec4 _767 = _765 * vec4(tap_683.key.w);
			vec4 _768 = blursum_noweight + _767;
			blursum_noweight = _768;
			float _769 = j_711 * j_711;
			float _770 = _769 * k_700;
			float _771 = exp(_770);
			float _773 = _771 * tap_683.key.w;
			float _774 = blursum_noweight_weight + _773;
			blursum_noweight_weight = _774;
		}
		float _720 = j_711;
		float _721 = _720 + 1.00000000e+00;
		j_711 = _721;
		float _717 = floor(kernel_size);
		_718 = j_711 <= _717;
	}
	vec4 _776 = blursum / vec4(blursum_weight);
	blursum = _776;
	vec4 _778 = blursum_noweight / vec4(blursum_noweight_weight);
	blursum_noweight = _778;
	float _780 = blursum_weight * 2.00000000e+00;
	float _781 = clamp(_780, 0.0, 1.0);
	vec4 _784 = mix(center_681.key, blursum, vec4(_781));
	return _784;
}
void F_xPS_FilterH(
	in S_xSSR_VSOUT i,
	out vec4 o)
{
	S_xSSR_VSOUT _789;
	float _790;
	vec2 _791;
	_789 = i;
	_790 = V_xSSR_FILTER_SIZE;
	_791 = vec2(0.00000000e+00, 9.25925910e-04);
	vec4 _793 = F_xblur_filter(_789, V_xsCommonTex0, _790, _791);
	o = _793;
	return;
}
void F_xPS_FilterV(
	in S_xSSR_VSOUT i,
	out vec4 o)
{
	S_xSSR_VSOUT _798;
	float _799;
	vec2 _800;
	_798 = i;
	_799 = V_xSSR_FILTER_SIZE;
	_800 = vec2(5.20833360e-04, 0.00000000e+00);
	vec4 _802 = F_xblur_filter(_798, V_xsSSR_ColorTex, _799, _800);
	vec4 reflection_803 = _802;
	float alpha = reflection_803.w;
	vec2 _806;
	_806 = i.uv;
	float _808 = F_xqUINT_xlinear_depth(_806);
	float _809 = _808 / V_xSSR_FADE_DIST;
	float _811 = 1.00000000e+00 - _809;
	float _812 = clamp(_811, 0.0, 1.0);
	float fade_813 = _812;
	vec4 _815 = texture(V_xqUINT_xsBackBufferTex, i.uv);
	o = _815;
	float _816 = alpha * fade_813;
	vec3 _820 = mix(o.xyz, reflection_803.xyz, vec3(_816));
	o.xyz = _820;
	return;
}
#ifdef E_xVS_SSR
layout(location = 0) out vec2 _return_uv;
layout(location = 4) out vec3 _return_uvtoviewADD;
layout(location = 5) out vec3 _return_uvtoviewMUL;
void main()
{
	uint id = uint(gl_VertexID);
	S_xSSR_VSOUT _return = F_xVS_SSR(id);
	gl_Position = _return.vpos;
	_return_uv = _return.uv;
	_return_uvtoviewADD = _return.uvtoviewADD;
	_return_uvtoviewMUL = _return.uvtoviewMUL;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_PrepareColor
in vec2 vv_0;
in vec3 vv_4;
in vec3 vv_5;
layout(location = 0) out vec4 _out_o;
void main()
{
	S_xSSR_VSOUT _in_i = S_xSSR_VSOUT(gl_FragCoord, vv_0, vv_4, vv_5);
	S_xSSR_VSOUT i = _in_i;
	vec4 o;
	F_xPS_PrepareColor(i, o);
	_out_o = o;
	return;
}
#endif
#ifdef E_xPS_SSR
in vec2 vv_0;
in vec3 vv_4;
in vec3 vv_5;
layout(location = 0) out vec4 _out_reflection;
layout(location = 1) out vec4 _out_blurbuffer;
void main()
{
	S_xSSR_VSOUT _in_i = S_xSSR_VSOUT(gl_FragCoord, vv_0, vv_4, vv_5);
	S_xSSR_VSOUT i = _in_i;
	vec4 reflection;
	vec4 blurbuffer;
	F_xPS_SSR(i, reflection, blurbuffer);
	_out_reflection = reflection;
	_out_blurbuffer = blurbuffer;
	return;
}
#endif
#ifdef E_xPS_FilterH
in vec2 vv_0;
in vec3 vv_4;
in vec3 vv_5;
layout(location = 0) out vec4 _out_o;
void main()
{
	S_xSSR_VSOUT _in_i = S_xSSR_VSOUT(gl_FragCoord, vv_0, vv_4, vv_5);
	S_xSSR_VSOUT i = _in_i;
	vec4 o;
	F_xPS_FilterH(i, o);
	_out_o = o;
	return;
}
#endif
#ifdef E_xPS_FilterV
in vec2 vv_0;
in vec3 vv_4;
in vec3 vv_5;
layout(location = 0) out vec4 _out_o;
void main()
{
	S_xSSR_VSOUT _in_i = S_xSSR_VSOUT(gl_FragCoord, vv_0, vv_4, vv_5);
	S_xSSR_VSOUT i = _in_i;
	vec4 o;
	F_xPS_FilterV(i, o);
	_out_o = o;
	return;
}
#endif
