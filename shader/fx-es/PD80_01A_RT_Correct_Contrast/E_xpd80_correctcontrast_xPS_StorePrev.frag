#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_correctcontrast_xPS_StorePrev
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
uniform bool V_xpd80_correctcontrast_xenable_fade;
uniform bool V_xpd80_correctcontrast_xfreeze;
uniform float V_xpd80_correctcontrast_xtransition_speed;
uniform bool V_xpd80_correctcontrast_xrt_enable_whitepoint_correction;
uniform float V_xpd80_correctcontrast_xrt_wp_str;
uniform bool V_xpd80_correctcontrast_xrt_enable_blackpoint_correction;
uniform float V_xpd80_correctcontrast_xrt_bp_str;
uniform float V_xpd80_correctcontrast_xframetime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xpd80_correctcontrast_xsamplerDS_1_Max;
uniform sampler2D V_xpd80_correctcontrast_xsamplerDS_1_Min;
uniform sampler2D V_xpd80_correctcontrast_xsamplerPrevious;
uniform sampler2D V_xpd80_correctcontrast_xsamplerDS_1x1;
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
vec3 F_xpd80_correctcontrast_xinterpolate(
	in vec3 o,
	in vec3 n,
	in float factor,
	in float ft)
{
	float _83 = -(factor);
	float _84 = _83 * ft;
	float _85 = exp(_84);
	float _87 = 1.00000000e+00 - _85;
	vec3 _91 = mix(o.xyz, n.xyz, vec3(_87));
	return _91;
}
void F_xpd80_correctcontrast_xPS_MinMax_1(
	in vec4 pos,
	in vec2 texcoord,
	out vec4 minValue,
	out vec4 maxValue)
{
	vec3 currColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	minValue.xyz = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	maxValue.xyz = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float pst = 3.12500000e-02;
	float _105 = 5.00000000e-01 * pst;
	float hst = _105;
	vec2 stexSize = vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _111 = texcoord.xy - vec2(hst);
	vec2 _113 = _111 * stexSize.xy;
	vec2 _114 = floor(_113);
	vec2 start = _114;
	vec2 _118 = texcoord.xy + vec2(hst);
	vec2 _120 = _118 * stexSize.xy;
	vec2 _121 = floor(_120);
	vec2 stop = _121;
	int y = int(start.y);
	while (float(y) < stop.y)
	{
		{
			int x = int(start.x);
			while (float(x) < stop.x)
			{
				{
					ivec2 _147 = ivec2(x, y);
					vec4 _149 = texelFetch(V_xReShade_xBackBuffer, _147, 0);
					currColor = _149.xyz;
					vec3 _153 = min(minValue.xyz, currColor.xyz);
					minValue.xyz = _153;
					vec3 _156 = max(currColor.xyz, maxValue.xyz);
					maxValue.xyz = _156;
				}
				int _146 = x + 1;
				x = _146;
			}
		}
		int _134 = y + 1;
		y = _134;
	}
	vec4 _161 = vec4(minValue.xyz.x, minValue.xyz.y, minValue.xyz.z, 1.00000000e+00);
	minValue = _161;
	vec4 _166 = vec4(maxValue.xyz.x, maxValue.xyz.y, maxValue.xyz.z, 1.00000000e+00);
	maxValue = _166;
	return;
}
vec4 F_xpd80_correctcontrast_xPS_MinMax_1x1(
	in vec4 pos,
	in vec2 texcoord)
{
	vec3 minColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 maxColor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 minValue_176 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 maxValue_178 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	uint SampleRes = 32u;
	float Sigma = 0.00000000e+00;
	int y_184 = 0;
	while (uint(y_184) < SampleRes)
	{
		{
			int x_195 = 0;
			while (uint(x_195) < SampleRes)
			{
				{
					ivec2 _205 = ivec2(x_195, y_184);
					vec4 _207 = texelFetch(V_xpd80_correctcontrast_xsamplerDS_1_Min, _205, 0);
					minColor = _207.xyz;
					vec3 _211 = min(minValue_176.xyz, minColor.xyz);
					minValue_176.xyz = _211;
					ivec2 _212 = ivec2(x_195, y_184);
					vec4 _214 = texelFetch(V_xpd80_correctcontrast_xsamplerDS_1_Max, _212, 0);
					maxColor = _214.xyz;
					vec3 _218 = max(maxColor.xyz, maxValue_178.xyz);
					maxValue_178.xyz = _218;
				}
				int _204 = x_195 + 1;
				x_195 = _204;
			}
		}
		int _193 = y_184 + 1;
		y_184 = _193;
	}
	float _221 = texcoord.x / 4.00000000e+00;
	vec2 _223 = vec2(_221, texcoord.y);
	vec4 _224 = texture(V_xpd80_correctcontrast_xsamplerPrevious, _223);
	vec3 prevMin = _224.xyz;
	float _229 = texcoord.x + 2.00000000e+00;
	float _231 = _229 / 4.00000000e+00;
	vec2 _233 = vec2(_231, texcoord.y);
	vec4 _234 = texture(V_xpd80_correctcontrast_xsamplerPrevious, _233);
	vec3 prevMax = _234.xyz;
	float _238 = V_xpd80_correctcontrast_xtransition_speed * 4.00000000e+00;
	float _240 = _238 + 5.00000000e-01;
	float smoothf = _240;
	float _243 = V_xpd80_correctcontrast_xframetime * 1.00000005e-03;
	float time = _243;
	vec3 _245;
	vec3 _246;
	float _247;
	float _248;
	_245 = prevMax.xyz;
	_246 = maxValue_178.xyz;
	_247 = smoothf;
	_248 = time;
	vec3 _251 = F_xpd80_correctcontrast_xinterpolate(_245, _246, _247, _248);
	vec3 _254 = compCond(bvec3(V_xpd80_correctcontrast_xenable_fade), _251, maxValue_178.xyz);
	maxValue_178.xyz = _254;
	vec3 _255;
	vec3 _256;
	float _257;
	float _258;
	_255 = prevMin.xyz;
	_256 = minValue_176.xyz;
	_257 = smoothf;
	_258 = time;
	vec3 _261 = F_xpd80_correctcontrast_xinterpolate(_255, _256, _257, _258);
	vec3 _264 = compCond(bvec3(V_xpd80_correctcontrast_xenable_fade), _261, minValue_176.xyz);
	minValue_176.xyz = _264;
	vec3 _268 = compCond(bvec3(V_xpd80_correctcontrast_xfreeze), prevMax.xyz, maxValue_178.xyz);
	maxValue_178.xyz = _268;
	vec3 _272 = compCond(bvec3(V_xpd80_correctcontrast_xfreeze), prevMin.xyz, minValue_176.xyz);
	minValue_176.xyz = _272;
	bool _278 = pos.x < 2.00000000e+00;
	if (_278)
	{
		vec4 _283 = vec4(minValue_176.xyz.x, minValue_176.xyz.y, minValue_176.xyz.z, 1.00000000e+00);
		return _283;
	}
	else
	{
		vec4 _288 = vec4(maxValue_178.xyz.x, maxValue_178.xyz.y, maxValue_178.xyz.z, 1.00000000e+00);
		return _288;
	}
}
vec4 F_xpd80_correctcontrast_xPS_CorrectContrast(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _293 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _293;
	float _297 = texcoord.x / 4.00000000e+00;
	vec2 _299 = vec2(_297, texcoord.y);
	vec4 _300 = texture(V_xpd80_correctcontrast_xsamplerDS_1x1, _299);
	vec3 minValue_302 = _300.xyz;
	float _305 = texcoord.x + 2.00000000e+00;
	float _307 = _305 / 4.00000000e+00;
	vec2 _309 = vec2(_307, texcoord.y);
	vec4 _310 = texture(V_xpd80_correctcontrast_xsamplerDS_1x1, _309);
	vec3 maxValue_312 = _310.xyz;
	float _315 = min(minValue_302.x, minValue_302.y);
	float _317 = min(_315, minValue_302.z);
	float adjBlack = _317;
	float _321 = max(maxValue_312.x, maxValue_312.y);
	float _323 = max(_321, maxValue_312.z);
	float adjWhite = _323;
	float _326 = mix(0.00000000e+00, adjBlack, V_xpd80_correctcontrast_xrt_bp_str);
	adjBlack = _326;
	float _328 = V_xpd80_correctcontrast_xrt_enable_blackpoint_correction ? adjBlack : 0.00000000e+00;
	adjBlack = _328;
	float _330 = mix(1.00000000e+00, adjWhite, V_xpd80_correctcontrast_xrt_wp_str);
	adjWhite = _330;
	float _332 = V_xpd80_correctcontrast_xrt_enable_whitepoint_correction ? adjWhite : 1.00000000e+00;
	adjWhite = _332;
	vec3 _335 = color.xyz - vec3(adjBlack);
	vec3 _336 = clamp(_335, 0.0, 1.0);
	float _337 = adjWhite - adjBlack;
	float _338 = clamp(_337, 0.0, 1.0);
	vec3 _340 = _336 / vec3(_338);
	color.xyz = _340;
	vec4 _345 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _345;
}
vec4 F_xpd80_correctcontrast_xPS_StorePrev(
	in vec4 pos,
	in vec2 texcoord)
{
	float _352 = texcoord.x / 4.00000000e+00;
	vec2 _354 = vec2(_352, texcoord.y);
	vec4 _355 = texture(V_xpd80_correctcontrast_xsamplerDS_1x1, _354);
	vec3 minValue_357 = _355.xyz;
	float _360 = texcoord.x + 2.00000000e+00;
	float _362 = _360 / 4.00000000e+00;
	vec2 _364 = vec2(_362, texcoord.y);
	vec4 _365 = texture(V_xpd80_correctcontrast_xsamplerDS_1x1, _364);
	vec3 maxValue_367 = _365.xyz;
	bool _373 = pos.x < 2.00000000e+00;
	if (_373)
	{
		vec4 _378 = vec4(minValue_357.xyz.x, minValue_357.xyz.y, minValue_357.xyz.z, 1.00000000e+00);
		return _378;
	}
	else
	{
		vec4 _383 = vec4(maxValue_367.xyz.x, maxValue_367.xyz.y, maxValue_367.xyz.z, 1.00000000e+00);
		return _383;
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
#ifdef E_xpd80_correctcontrast_xPS_MinMax_1
in vec2 vv_0;
layout(location = 0) out vec4 _out_minValue;
layout(location = 1) out vec4 _out_maxValue;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 minValue;
	vec4 maxValue;
	F_xpd80_correctcontrast_xPS_MinMax_1(pos, texcoord, minValue, maxValue);
	_out_minValue = minValue;
	_out_maxValue = maxValue;
	return;
}
#endif
#ifdef E_xpd80_correctcontrast_xPS_MinMax_1x1
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcontrast_xPS_MinMax_1x1(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_correctcontrast_xPS_CorrectContrast
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcontrast_xPS_CorrectContrast(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_correctcontrast_xPS_StorePrev
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_correctcontrast_xPS_StorePrev(pos, texcoord);
	return;
}
#endif
