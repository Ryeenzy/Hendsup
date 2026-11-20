#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_correctcolor_xPS_RemoveTint
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
uniform int V_xpd80_correctcolor_xdebug_mode;
uniform bool V_xpd80_correctcolor_xenable_fade;
uniform bool V_xpd80_correctcolor_xfreeze;
uniform float V_xpd80_correctcolor_xtransition_speed;
uniform bool V_xpd80_correctcolor_xenable_dither;
uniform float V_xpd80_correctcolor_xdither_strength;
uniform bool V_xpd80_correctcolor_xrt_enable_whitepoint_correction;
uniform bool V_xpd80_correctcolor_xrt_whitepoint_respect_luma;
uniform int V_xpd80_correctcolor_xrt_whitepoint_method;
uniform float V_xpd80_correctcolor_xrt_wp_str;
uniform float V_xpd80_correctcolor_xrt_wp_rl_str;
uniform bool V_xpd80_correctcolor_xrt_enable_blackpoint_correction;
uniform bool V_xpd80_correctcolor_xrt_blackpoint_respect_luma;
uniform int V_xpd80_correctcolor_xrt_blackpoint_method;
uniform float V_xpd80_correctcolor_xrt_bp_str;
uniform float V_xpd80_correctcolor_xrt_bp_rl_str;
uniform bool V_xpd80_correctcolor_xrt_enable_midpoint_correction;
uniform bool V_xpd80_correctcolor_xrt_midpoint_respect_luma;
uniform bool V_xpd80_correctcolor_xmid_use_alt_method;
uniform float V_xpd80_correctcolor_xmidCC_scale;
uniform float V_xpd80_correctcolor_xframetime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xpd80_correctcolor_xsamplerColor;
uniform sampler2D V_xpd80_correctcolor_xsamplerDS_1_Max;
uniform sampler2D V_xpd80_correctcolor_xsamplerDS_1_Min;
uniform sampler2D V_xpd80_correctcolor_xsamplerDS_1_Mid;
uniform sampler2D V_xpd80_correctcolor_xsamplerDS_1x1;
uniform sampler2D V_xpd80_correctcolor_xsamplerPrevious;
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
vec3 F_xpd80_correctcolor_xinterpolate(
	in vec3 o,
	in vec3 n,
	in float factor,
	in float ft)
{
	float _146 = -(factor);
	float _147 = _146 * ft;
	float _148 = exp(_147);
	float _150 = 1.00000000e+00 - _148;
	vec3 _154 = mix(o.xyz, n.xyz, vec3(_150));
	return _154;
}
vec4 F_xpd80_correctcolor_xPS_WriteColor(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _159 = texture(V_xReShade_xBackBuffer, texcoord);
	return _159;
}
void F_xpd80_correctcolor_xPS_MinMax_1(
	in vec4 pos,
	in vec2 texcoord,
	out vec4 minValue,
	out vec4 maxValue,
	out vec4 midValue)
{
	vec3 currColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 minMethod0 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 minMethod1 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 maxMethod0 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 maxMethod1 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	midValue = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float getMid = 0.00000000e+00;
	float getMid2 = 0.00000000e+00;
	float getMin = 0.00000000e+00;
	float getMin2 = 0.00000000e+00;
	float getMax = 0.00000000e+00;
	float getMax2 = 0.00000000e+00;
	float _192 = texcoord.x / 6.00000000e+00;
	vec2 _194 = vec2(_192, texcoord.y);
	vec4 _195 = texture(V_xpd80_correctcolor_xsamplerPrevious, _194);
	vec3 prevMin = _195.xyz;
	float _200 = texcoord.x + 4.00000000e+00;
	float _202 = _200 / 6.00000000e+00;
	vec2 _204 = vec2(_202, texcoord.y);
	vec4 _205 = texture(V_xpd80_correctcolor_xsamplerPrevious, _204);
	vec3 prevMax = _205.xyz;
	float _210 = dot(prevMin.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float _213 = dot(prevMax.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	vec2 _214 = vec2(_210, _213);
	float _216 = dot(_214, vec2(5.00000000e-01, 5.00000000e-01));
	float middle = _216;
	float _219 = V_xpd80_correctcolor_xmid_use_alt_method ? middle : 5.00000000e-01;
	middle = _219;
	float pst = 3.12500000e-02;
	float _223 = 5.00000000e-01 * pst;
	float hst = _223;
	vec2 stexSize = vec2(1.92000000e+03, 1.08000000e+03);
	uint OFFSET = 1u;
	vec2 _231 = texcoord.xy - vec2(hst);
	vec2 _233 = _231 * stexSize.xy;
	vec2 _234 = floor(_233);
	vec2 start = _234;
	vec2 _238 = texcoord.xy + vec2(hst);
	vec2 _240 = _238 * stexSize.xy;
	vec2 _241 = floor(_240);
	vec2 stop = _241;
	int y = int(start.y);
	bool _252 = float(y) < stop.y;
	bool _255 = float(y) < stexSize.y;
	bool _256 = _252 && _255;
	while (_256)
	{
		{
			int x = int(start.x);
			bool _268 = float(x) < stop.x;
			bool _271 = float(x) < stexSize.x;
			bool _272 = _268 && _271;
			while (_272)
			{
				{
					ivec2 _275 = ivec2(x, y);
					vec4 _277 = texelFetch(V_xpd80_correctcolor_xsamplerColor, _275, 0);
					currColor = _277.xyz;
					vec3 _281 = min(minMethod0.xyz, currColor.xyz);
					minMethod0.xyz = _281;
					float _284 = max(currColor.x, currColor.y);
					float _286 = max(_284, currColor.z);
					float _289 = dot(currColor.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					float _290 = _286 + _289;
					getMin = _290;
					float _293 = max(minMethod1.x, minMethod1.y);
					float _295 = max(_293, minMethod1.z);
					float _298 = dot(minMethod1.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					float _299 = _295 + _298;
					getMin2 = _299;
					bool _300 = getMin2 >= getMin;
					vec3 _304 = compCond(bvec3(_300), currColor.xyz, minMethod1.xyz);
					minMethod1.xyz = _304;
					vec3 _307 = currColor.xyz - vec3(middle);
					vec3 _308 = abs(_307);
					float _310 = dot(_308, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMid = _310;
					vec3 _313 = midValue.xyz - vec3(middle);
					vec3 _314 = abs(_313);
					float _316 = dot(_314, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMid2 = _316;
					bool _317 = getMid2 >= getMid;
					vec3 _321 = compCond(bvec3(_317), currColor.xyz, midValue.xyz);
					midValue.xyz = _321;
					vec3 _324 = max(currColor.xyz, maxMethod0.xyz);
					maxMethod0.xyz = _324;
					float _327 = dot(currColor.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMax = _327;
					float _330 = dot(maxMethod1.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMax2 = _330;
					bool _331 = getMax >= getMax2;
					vec3 _335 = compCond(bvec3(_331), currColor.xyz, maxMethod1.xyz);
					maxMethod1.xyz = _335;
				}
				int _274 = x + int(OFFSET);
				x = _274;
				bool _268 = float(x) < stop.x;
				bool _271 = float(x) < stexSize.x;
				_272 = _268 && _271;
			}
		}
		int _258 = y + int(OFFSET);
		y = _258;
		bool _252 = float(y) < stop.y;
		bool _255 = float(y) < stexSize.y;
		_256 = _252 && _255;
	}
	vec3 _339 = compCond(bvec3(ivec3(V_xpd80_correctcolor_xrt_blackpoint_method)), minMethod1.xyz, minMethod0.xyz);
	minValue.xyz = _339;
	vec3 _343 = compCond(bvec3(ivec3(V_xpd80_correctcolor_xrt_whitepoint_method)), maxMethod1.xyz, maxMethod0.xyz);
	maxValue.xyz = _343;
	vec4 _348 = vec4(minValue.xyz.x, minValue.xyz.y, minValue.xyz.z, 1.00000000e+00);
	minValue = _348;
	vec4 _353 = vec4(maxValue.xyz.x, maxValue.xyz.y, maxValue.xyz.z, 1.00000000e+00);
	maxValue = _353;
	vec4 _358 = vec4(midValue.xyz.x, midValue.xyz.y, midValue.xyz.z, 1.00000000e+00);
	midValue = _358;
	return;
}
vec4 F_xpd80_correctcolor_xPS_MinMax_1x1(
	in vec4 pos,
	in vec2 texcoord)
{
	vec3 minColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 maxColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 midColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 minValue_370 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 maxValue_372 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 midValue_374 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float getMin_376 = 0.00000000e+00;
	float getMin2_378 = 0.00000000e+00;
	float getMax_380 = 0.00000000e+00;
	float getMax2_382 = 0.00000000e+00;
	vec3 minMethod0_384 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 minMethod1_386 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 maxMethod0_388 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 maxMethod1_390 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	midValue_374 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	ivec2 SampleRes = ivec2(32, 32);
	float Sigma = 0.00000000e+00;
	int y_397 = 0;
	while (y_397 < SampleRes.y)
	{
		{
			int x_408 = 0;
			while (x_408 < SampleRes.x)
			{
				{
					ivec2 _418 = ivec2(x_408, y_397);
					vec4 _420 = texelFetch(V_xpd80_correctcolor_xsamplerDS_1_Min, _418, 0);
					minColor = _420.xyz;
					vec3 _424 = min(minMethod0_384.xyz, minColor.xyz);
					minMethod0_384.xyz = _424;
					float _427 = max(minColor.x, minColor.y);
					float _429 = max(_427, minColor.z);
					float _432 = dot(minColor.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					float _433 = _429 + _432;
					getMin_376 = _433;
					float _436 = max(minMethod1_386.x, minMethod1_386.y);
					float _438 = max(_436, minMethod1_386.z);
					float _441 = dot(minMethod1_386.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					float _442 = _438 + _441;
					getMin2_378 = _442;
					bool _443 = getMin2_378 >= getMin_376;
					vec3 _447 = compCond(bvec3(_443), minColor.xyz, minMethod1_386.xyz);
					minMethod1_386.xyz = _447;
					ivec2 _448 = ivec2(x_408, y_397);
					vec4 _450 = texelFetch(V_xpd80_correctcolor_xsamplerDS_1_Mid, _448, 0);
					vec3 _452 = midColor + _450.xyz;
					midColor = _452;
					float _454 = Sigma + 1.00000000e+00;
					Sigma = _454;
					ivec2 _455 = ivec2(x_408, y_397);
					vec4 _457 = texelFetch(V_xpd80_correctcolor_xsamplerDS_1_Max, _455, 0);
					maxColor = _457.xyz;
					vec3 _461 = max(maxColor.xyz, maxMethod0_388.xyz);
					maxMethod0_388.xyz = _461;
					float _464 = dot(maxColor.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMax_380 = _464;
					float _467 = dot(maxMethod1_390.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					getMax2_382 = _467;
					bool _468 = getMax_380 >= getMax2_382;
					vec3 _472 = compCond(bvec3(_468), maxColor.xyz, maxMethod1_390.xyz);
					maxMethod1_390.xyz = _472;
				}
				int _417 = x_408 + 1;
				x_408 = _417;
			}
		}
		int _406 = y_397 + 1;
		y_397 = _406;
	}
	vec3 _476 = compCond(bvec3(ivec3(V_xpd80_correctcolor_xrt_blackpoint_method)), minMethod1_386.xyz, minMethod0_384.xyz);
	minValue_370.xyz = _476;
	vec3 _480 = compCond(bvec3(ivec3(V_xpd80_correctcolor_xrt_whitepoint_method)), maxMethod1_390.xyz, maxMethod0_388.xyz);
	maxValue_372.xyz = _480;
	vec3 _483 = midColor.xyz / vec3(Sigma);
	midValue_374.xyz = _483;
	bvec3 _486 = greaterThanEqual(minValue_370.xyz, maxValue_372.xyz);
	vec3 _489 = compCond(_486, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), maxValue_372.xyz);
	maxValue_372.xyz = _489;
	float _492 = texcoord.x / 6.00000000e+00;
	vec2 _494 = vec2(_492, texcoord.y);
	vec4 _495 = texture(V_xpd80_correctcolor_xsamplerPrevious, _494);
	vec3 prevMin_497 = _495.xyz;
	float _500 = texcoord.x + 2.00000000e+00;
	float _502 = _500 / 6.00000000e+00;
	vec2 _504 = vec2(_502, texcoord.y);
	vec4 _505 = texture(V_xpd80_correctcolor_xsamplerPrevious, _504);
	vec3 prevMid = _505.xyz;
	float _510 = texcoord.x + 4.00000000e+00;
	float _512 = _510 / 6.00000000e+00;
	vec2 _514 = vec2(_512, texcoord.y);
	vec4 _515 = texture(V_xpd80_correctcolor_xsamplerPrevious, _514);
	vec3 prevMax_517 = _515.xyz;
	float _519 = V_xpd80_correctcolor_xtransition_speed * 4.00000000e+00;
	float _521 = _519 + 1.00000000e+00;
	float smoothf = _521;
	float _524 = V_xpd80_correctcolor_xframetime * 1.00000005e-03;
	float time = _524;
	vec3 _526;
	vec3 _527;
	float _528;
	float _529;
	_526 = prevMax_517.xyz;
	_527 = maxValue_372.xyz;
	_528 = smoothf;
	_529 = time;
	vec3 _532 = F_xpd80_correctcolor_xinterpolate(_526, _527, _528, _529);
	vec3 _535 = compCond(bvec3(V_xpd80_correctcolor_xenable_fade), _532, maxValue_372.xyz);
	maxValue_372.xyz = _535;
	vec3 _536;
	vec3 _537;
	float _538;
	float _539;
	_536 = prevMin_497.xyz;
	_537 = minValue_370.xyz;
	_538 = smoothf;
	_539 = time;
	vec3 _542 = F_xpd80_correctcolor_xinterpolate(_536, _537, _538, _539);
	vec3 _545 = compCond(bvec3(V_xpd80_correctcolor_xenable_fade), _542, minValue_370.xyz);
	minValue_370.xyz = _545;
	vec3 _546;
	vec3 _547;
	float _548;
	float _549;
	_546 = prevMid.xyz;
	_547 = midValue_374.xyz;
	_548 = smoothf;
	_549 = time;
	vec3 _552 = F_xpd80_correctcolor_xinterpolate(_546, _547, _548, _549);
	vec3 _555 = compCond(bvec3(V_xpd80_correctcolor_xenable_fade), _552, midValue_374.xyz);
	midValue_374.xyz = _555;
	vec3 _559 = compCond(bvec3(V_xpd80_correctcolor_xfreeze), prevMax_517.xyz, maxValue_372.xyz);
	maxValue_372.xyz = _559;
	vec3 _563 = compCond(bvec3(V_xpd80_correctcolor_xfreeze), prevMin_497.xyz, minValue_370.xyz);
	minValue_370.xyz = _563;
	vec3 _567 = compCond(bvec3(V_xpd80_correctcolor_xfreeze), prevMid.xyz, midValue_374.xyz);
	midValue_374.xyz = _567;
	bool _573 = pos.x < 2.00000000e+00;
	if (_573)
	{
		vec4 _578 = vec4(minValue_370.xyz.x, minValue_370.xyz.y, minValue_370.xyz.z, 1.00000000e+00);
		return _578;
	}
	else
	{
		bool _584 = pos.x >= 2.00000000e+00;
		bool _587 = pos.x < 4.00000000e+00;
		bool _588 = _584 && _587;
		if (_588)
		{
			vec4 _593 = vec4(midValue_374.xyz.x, midValue_374.xyz.y, midValue_374.xyz.z, 1.00000000e+00);
			return _593;
		}
		else
		{
			vec4 _598 = vec4(maxValue_372.xyz.x, maxValue_372.xyz.y, maxValue_372.xyz.z, 1.00000000e+00);
			return _598;
		}
	}
	return vec4(5.00000000e-01, 5.00000000e-01, 5.00000000e-01, 1.00000000e+00);
}
vec4 F_xpd80_correctcolor_xPS_RemoveTint(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _604 = texture(V_xpd80_correctcolor_xsamplerColor, texcoord);
	vec4 color = _604;
	vec2 _606;
	int _607;
	bool _608;
	float _609;
	bool _610;
	float _611;
	_606 = texcoord.xy;
	_607 = 0;
	_608 = V_xpd80_correctcolor_xenable_dither;
	_609 = V_xpd80_correctcolor_xdither_strength;
	_610 = true;
	_611 = 5.00000000e-01;
	vec4 _616 = F_xdither(V_xsamplerRGBNoise, _606, _607, _608, _609, _610, _611);
	vec4 dnoise = _616;
	vec3 _620 = color.xyz + dnoise.xyz;
	vec3 _621 = clamp(_620, 0.0, 1.0);
	color.xyz = _621;
	float _624 = texcoord.x / 6.00000000e+00;
	vec2 _626 = vec2(_624, texcoord.y);
	vec4 _627 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _626);
	vec3 minValue_629 = _627.xyz;
	float _632 = texcoord.x + 2.00000000e+00;
	float _634 = _632 / 6.00000000e+00;
	vec2 _636 = vec2(_634, texcoord.y);
	vec4 _637 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _636);
	vec3 midValue_639 = _637.xyz;
	float _642 = texcoord.x + 4.00000000e+00;
	float _644 = _642 / 6.00000000e+00;
	vec2 _646 = vec2(_644, texcoord.y);
	vec4 _647 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _646);
	vec3 maxValue_649 = _647.xyz;
	float _652 = dot(minValue_629.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float _655 = dot(maxValue_649.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	vec2 _656 = vec2(_652, _655);
	float _658 = dot(_656, vec2(5.00000000e-01, 5.00000000e-01));
	float middle_659 = _658;
	float _661 = V_xpd80_correctcolor_xmid_use_alt_method ? middle_659 : 5.00000000e-01;
	middle_659 = _661;
	vec3 _665 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), minValue_629.xyz, vec3(V_xpd80_correctcolor_xrt_bp_str));
	minValue_629.xyz = _665;
	vec3 _669 = compCond(bvec3(V_xpd80_correctcolor_xrt_enable_blackpoint_correction), minValue_629.xyz, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	minValue_629.xyz = _669;
	vec3 _673 = mix(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), maxValue_649.xyz, vec3(V_xpd80_correctcolor_xrt_wp_str));
	maxValue_649.xyz = _673;
	vec3 _677 = compCond(bvec3(V_xpd80_correctcolor_xrt_enable_whitepoint_correction), maxValue_649.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	maxValue_649.xyz = _677;
	vec3 _680 = midValue_639.xyz - vec3(middle_659);
	midValue_639.xyz = _680;
	vec3 _683 = midValue_639.xyz * vec3(V_xpd80_correctcolor_xmidCC_scale);
	midValue_639.xyz = _683;
	vec3 _687 = compCond(bvec3(V_xpd80_correctcolor_xrt_enable_midpoint_correction), midValue_639.xyz, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	midValue_639.xyz = _687;
	vec3 _690 = color.xyz - minValue_629.xyz;
	vec3 _691 = clamp(_690, 0.0, 1.0);
	vec3 _694 = maxValue_649.xyz - minValue_629.xyz;
	vec3 _695 = _691 / _694;
	color.xyz = _695;
	float _698 = dot(maxValue_649.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float avgMax = _698;
	vec3 _702 = color.xyz * vec3(avgMax);
	float _704 = float(V_xpd80_correctcolor_xrt_whitepoint_respect_luma) * V_xpd80_correctcolor_xrt_wp_rl_str;
	vec3 _707 = mix(color.xyz, _702, vec3(_704));
	color.xyz = _707;
	float _710 = dot(minValue_629.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float avgMin = _710;
	float _713 = 1.00000000e+00 - avgMin;
	vec3 _716 = color.xyz * vec3(_713);
	vec3 _718 = _716 + vec3(avgMin);
	float _720 = float(V_xpd80_correctcolor_xrt_blackpoint_respect_luma) * V_xpd80_correctcolor_xrt_bp_rl_str;
	vec3 _723 = mix(color.xyz, _718, vec3(_720));
	color.xyz = _723;
	float _726 = dot(color.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float avgCol = _726;
	float _730 = dot(midValue_639.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	float avgMid = _730;
	float _733 = avgCol * 2.00000000e+00;
	float _735 = _733 - 1.00000000e+00;
	float _736 = abs(_735);
	float _738 = 1.00000000e+00 - _736;
	avgCol = _738;
	vec3 _741 = midValue_639.xyz * vec3(avgCol);
	vec3 _743 = color.xyz - _741;
	float _744 = avgMid * avgCol;
	float _746 = _744 * float(V_xpd80_correctcolor_xrt_midpoint_respect_luma);
	vec3 _748 = _743 + vec3(_746);
	vec3 _749 = clamp(_748, 0.0, 1.0);
	color.xyz = _749;
	switch (V_xpd80_correctcolor_xdebug_mode)
	{
	case 0: {
		color.xyz = color.xyz;
		break;
	}
	case 1: {
		vec4 _754 = texture(V_xpd80_correctcolor_xsamplerDS_1_Min, texcoord);
		color.xyz = _754.xyz;
		break;
	}
	case 2: {
		vec4 _757 = texture(V_xpd80_correctcolor_xsamplerDS_1_Max, texcoord);
		color.xyz = _757.xyz;
		break;
	}
	case 3: {
		vec4 _760 = texture(V_xpd80_correctcolor_xsamplerDS_1_Mid, texcoord);
		color.xyz = _760.xyz;
		break;
	}
	}
	vec4 _766 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _766;
}
vec4 F_xpd80_correctcolor_xPS_StorePrev(
	in vec4 pos,
	in vec2 texcoord)
{
	float _773 = texcoord.x / 6.00000000e+00;
	vec2 _775 = vec2(_773, texcoord.y);
	vec4 _776 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _775);
	vec3 minValue_778 = _776.xyz;
	float _781 = texcoord.x + 2.00000000e+00;
	float _783 = _781 / 6.00000000e+00;
	vec2 _785 = vec2(_783, texcoord.y);
	vec4 _786 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _785);
	vec3 midValue_788 = _786.xyz;
	float _791 = texcoord.x + 4.00000000e+00;
	float _793 = _791 / 6.00000000e+00;
	vec2 _795 = vec2(_793, texcoord.y);
	vec4 _796 = texture(V_xpd80_correctcolor_xsamplerDS_1x1, _795);
	vec3 maxValue_798 = _796.xyz;
	bool _804 = pos.x < 2.00000000e+00;
	if (_804)
	{
		vec4 _809 = vec4(minValue_778.xyz.x, minValue_778.xyz.y, minValue_778.xyz.z, 1.00000000e+00);
		return _809;
	}
	else
	{
		bool _815 = pos.x >= 2.00000000e+00;
		bool _818 = pos.x < 4.00000000e+00;
		bool _819 = _815 && _818;
		if (_819)
		{
			vec4 _824 = vec4(midValue_788.xyz.x, midValue_788.xyz.y, midValue_788.xyz.z, 1.00000000e+00);
			return _824;
		}
		else
		{
			vec4 _829 = vec4(maxValue_798.xyz.x, maxValue_798.xyz.y, maxValue_798.xyz.z, 1.00000000e+00);
			return _829;
		}
	}
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
#ifdef E_xpd80_correctcolor_xPS_WriteColor
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcolor_xPS_WriteColor(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_correctcolor_xPS_MinMax_1
in vec2 vv_0;
layout(location = 0) out vec4 _out_minValue;
layout(location = 1) out vec4 _out_maxValue;
layout(location = 2) out vec4 _out_midValue;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 minValue;
	vec4 maxValue;
	vec4 midValue;
	F_xpd80_correctcolor_xPS_MinMax_1(pos, texcoord, minValue, maxValue, midValue);
	_out_minValue = minValue;
	_out_maxValue = maxValue;
	_out_midValue = midValue;
	return;
}
#endif
#ifdef E_xpd80_correctcolor_xPS_MinMax_1x1
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcolor_xPS_MinMax_1x1(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_correctcolor_xPS_RemoveTint
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcolor_xPS_RemoveTint(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_correctcolor_xPS_StorePrev
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcolor_xPS_StorePrev(pos, texcoord);
	return;
}
#endif
