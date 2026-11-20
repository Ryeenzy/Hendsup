#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xDirectionalDepthBlur_xPS_Combiner
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
uniform float V_xDirectionalDepthBlur_xFocusPlane;
uniform float V_xDirectionalDepthBlur_xFocusRange;
uniform float V_xDirectionalDepthBlur_xFocusPlaneMaxRange;
uniform float V_xDirectionalDepthBlur_xBlurAngle;
uniform float V_xDirectionalDepthBlur_xBlurLength;
uniform float V_xDirectionalDepthBlur_xBlurQuality;
uniform float V_xDirectionalDepthBlur_xScaleFactor;
uniform int V_xDirectionalDepthBlur_xBlurType;
uniform vec2 V_xDirectionalDepthBlur_xFocusPoint;
uniform vec3 V_xDirectionalDepthBlur_xFocusPointBlendColor;
uniform float V_xDirectionalDepthBlur_xFocusPointBlendFactor;
uniform bool V_xDirectionalDepthBlur_xFocusPointViewFilterCircleOnMouseDown;
uniform bool V_xDirectionalDepthBlur_xFocusPointFadeBlurInFeatherBand;
uniform bool V_xDirectionalDepthBlur_xFlipFadeBlurInFeatherBand;
uniform bool V_xDirectionalDepthBlur_xFlipFocusPointTargetingBlurDirection;
uniform float V_xDirectionalDepthBlur_xFilterCircleRadius;
uniform vec2 V_xDirectionalDepthBlur_xFilterCircleDeformFactors;
uniform float V_xDirectionalDepthBlur_xFilterCircleRotationFactor;
uniform float V_xDirectionalDepthBlur_xFilterCircleFeather;
uniform float V_xDirectionalDepthBlur_xHighlightGain;
uniform float V_xDirectionalDepthBlur_xBlendFactor;
uniform vec2 V_xDirectionalDepthBlur_xMouseCoords;
uniform bool V_xDirectionalDepthBlur_xLeftMouseDown;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xDirectionalDepthBlur_xsamplerDownsampledBackBuffer;
uniform sampler2D V_xDirectionalDepthBlur_xsamplerBlurDestination;
uniform sampler2D V_xDirectionalDepthBlur_xsamplerFilterCircle;
struct S_xDirectionalDepthBlur_xVSPIXELINFO
{
	vec4 vpos;
	vec2 texCoords;
	vec2 pixelDelta;
	float blurLengthInPixels;
	float focusPlane;
	float focusRange;
	vec4 texCoordsScaled;
	mat2x2 rotationMatrix;
	vec2 centerDisplacementDelta;
	float featherRadius;
};
S_xDirectionalDepthBlur_xVSPIXELINFO _167;
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
vec2 F_xDirectionalDepthBlur_xCalculatePixelDeltas(
	in vec2 texCoords)
{
	bool _95 = V_xDirectionalDepthBlur_xBlurType == 1;
	bool _96 = V_xDirectionalDepthBlur_xFlipFocusPointTargetingBlurDirection && _95;
	float _99 = texCoords.x - V_xDirectionalDepthBlur_xFocusPoint.x;
	float _102 = texCoords.y - V_xDirectionalDepthBlur_xFocusPoint.y;
	vec2 _103 = vec2(_99, _102);
	float _106 = V_xDirectionalDepthBlur_xFocusPoint.x - texCoords.x;
	float _109 = V_xDirectionalDepthBlur_xFocusPoint.y - texCoords.y;
	vec2 _110 = vec2(_106, _109);
	vec2 _112 = compCond(bvec2(_96), _103, _110);
	vec2 newCoords = _112;
	float _115 = length(vec2(5.20833360e-04, 9.25925910e-04));
	vec2 _117 = newCoords * vec2(_115);
	return _117;
}
vec3 F_xDirectionalDepthBlur_xAccentuateWhites(
	in vec3 fragment)
{
	vec3 _123 = clamp(fragment, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.49000001e+00, 1.49000001e+00, 1.49000001e+00));
	vec3 _125 = vec3(1.50000000e+00, 1.50000000e+00, 1.50000000e+00) - _123;
	vec3 _126 = fragment / _125;
	return _126;
}
vec3 F_xDirectionalDepthBlur_xCorrectForWhiteAccentuation(
	in vec3 fragment)
{
	vec3 _132 = fragment.xyz * vec3(1.50000000e+00, 1.50000000e+00, 1.50000000e+00);
	vec3 _135 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + fragment.xyz;
	vec3 _136 = _132 / _135;
	return _136;
}
vec3 F_xDirectionalDepthBlur_xPostProcessBlurredFragment(
	in vec3 fragment,
	in float maxLuma,
	in vec3 averageGained,
	in float normalizationFactor)
{
	float _144 = dot(fragment, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	float newFragmentLuma = _144;
	vec3 _146;
	_146 = averageGained.xyz;
	vec3 _148 = F_xDirectionalDepthBlur_xCorrectForWhiteAccentuation(_146);
	averageGained.xyz = _148;
	float _149 = maxLuma - newFragmentLuma;
	float _150 = clamp(_149, 0.0, 1.0);
	float _152 = 1.00000000e+00 + _150;
	vec3 _155 = averageGained.xyz * vec3(_152);
	averageGained.xyz = _155;
	float _157 = 1.00000000e+00 - normalizationFactor;
	vec3 _159 = vec3(_157) * fragment;
	vec3 _162 = vec3(normalizationFactor) * averageGained.xyz;
	vec3 _163 = _159 + _162;
	fragment = _163;
	return fragment;
}
S_xDirectionalDepthBlur_xVSPIXELINFO F_xDirectionalDepthBlur_xVS_PixelInfo(
	in uint id)
{
	S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo = _167;
	bool _170 = id == 2u;
	float _173 = _170 ? 2.00000000e+00 : 0.00000000e+00;
	pixelInfo.texCoords[0] = _173;
	bool _175 = id == 1u;
	float _178 = _175 ? 2.00000000e+00 : 0.00000000e+00;
	pixelInfo.texCoords[1] = _178;
	vec2 _181 = pixelInfo.texCoords * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _183 = _181 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _188 = vec4(_183.x, _183.y, 0.00000000e+00, 1.00000000e+00);
	pixelInfo.vpos = _188;
	float _190 = 6.28318548e+00 * V_xDirectionalDepthBlur_xBlurAngle;
	float angleToUse = _190;
	float _192;
	float _193;
	_192 = sin(angleToUse), _193 = cos(angleToUse);
	pixelInfo.pixelDelta[1] = _192;
	pixelInfo.pixelDelta[0] = _193;
	float _196 = length(vec2(5.20833360e-04, 9.25925910e-04));
	float pixelSizeLength = _196;
	vec2 _200 = pixelInfo.pixelDelta * vec2(pixelSizeLength);
	pixelInfo.pixelDelta = _200;
	float _202 = length(vec2(1.92000000e+03, 1.08000000e+03));
	float _203 = _202 * V_xDirectionalDepthBlur_xBlurLength;
	pixelInfo.blurLengthInPixels = _203;
	float _204 = V_xDirectionalDepthBlur_xFocusPlane * V_xDirectionalDepthBlur_xFocusPlaneMaxRange;
	float _206 = _204 / 1.00000000e+03;
	pixelInfo.focusPlane = _206;
	float _207 = V_xDirectionalDepthBlur_xFocusRange * V_xDirectionalDepthBlur_xFocusPlaneMaxRange;
	float _209 = _207 / 1.00000000e+03;
	pixelInfo.focusRange = _209;
	vec2 _212 = pixelInfo.texCoords * vec2(V_xDirectionalDepthBlur_xScaleFactor);
	vec2 _215 = pixelInfo.texCoords / vec2(V_xDirectionalDepthBlur_xScaleFactor);
	vec4 _220 = vec4(_212.x, _212.y, _215.x, _215.y);
	pixelInfo.texCoordsScaled = _220;
	vec2 sincosFactor = vec2(0.00000000e+00, 0.00000000e+00);
	float _224 = 6.28318548e+00 * V_xDirectionalDepthBlur_xFilterCircleRotationFactor;
	float _225;
	float _226;
	_225 = sin(_224), _226 = cos(_224);
	sincosFactor[0] = _225;
	sincosFactor[1] = _226;
	float _229 = -(sincosFactor.x);
	mat2x2 _233 = mat2x2(sincosFactor.y, sincosFactor.x, _229, sincosFactor.y);
	pixelInfo.rotationMatrix = _233;
	vec2 _235 = V_xDirectionalDepthBlur_xFocusPoint - vec2(5.00000000e-01, 5.00000000e-01);
	pixelInfo.centerDisplacementDelta = _235;
	float _236 = V_xDirectionalDepthBlur_xFilterCircleRadius * V_xDirectionalDepthBlur_xFilterCircleFeather;
	float _237 = V_xDirectionalDepthBlur_xFilterCircleRadius - _236;
	pixelInfo.featherRadius = _237;
	return pixelInfo;
}
void F_xDirectionalDepthBlur_xPS_Blur(
	in S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	vec4 _246 = vec4(pixelInfo.texCoords.x, pixelInfo.texCoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _247 = textureLod(V_xDirectionalDepthBlur_xsamplerFilterCircle, _246.xy, _246.w);
	float filterCircleValue = _247.x;
	vec4 _254 = vec4(pixelInfo.texCoordsScaled.xy.x, pixelInfo.texCoordsScaled.xy.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _255 = textureLod(V_xDirectionalDepthBlur_xsamplerDownsampledBackBuffer, _254.xy, _254.w);
	vec3 color = _255.xyz;
	vec4 _262 = vec4(color.x, color.y, color.z, 1.00000000e+00);
	vec4 average = _262;
	vec3 _264;
	_264 = average.xyz;
	vec3 _266 = F_xDirectionalDepthBlur_xAccentuateWhites(_264);
	vec3 averageGained_267 = _266;
	bool _269 = V_xDirectionalDepthBlur_xBlurType == 0;
	vec2 _270;
	_270 = pixelInfo.texCoords;
	vec2 _272 = F_xDirectionalDepthBlur_xCalculatePixelDeltas(_270);
	vec2 _275 = compCond(bvec2(_269), pixelInfo.pixelDelta, _272);
	vec2 pixelDelta = _275;
	float _279 = dot(averageGained_267.xyz, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	float maxLuma_280 = _279;
	float blurLengthInPixels = pixelInfo.blurLengthInPixels;
	float alpha = 0.00000000e+00;
	float highlightGainToUse = V_xDirectionalDepthBlur_xHighlightGain;
	bool _290 = V_xDirectionalDepthBlur_xBlurType == 1;
	if (_290)
	{
		float _291 = blurLengthInPixels * filterCircleValue;
		blurLengthInPixels = _291;
		float _292 = highlightGainToUse * filterCircleValue;
		highlightGainToUse = _292;
	}
	float tapIndex = 0.00000000e+00;
	while (tapIndex < blurLengthInPixels)
	{
		{
			vec2 _305 = pixelDelta * vec2(tapIndex);
			vec2 _307 = pixelInfo.texCoords + _305;
			vec2 _308 = clamp(_307, 0.0, 1.0);
			vec2 tapCoords = _308;
			float _311 = V_xDirectionalDepthBlur_xScaleFactor - 1.00000005e-03;
			vec2 _313 = tapCoords * vec2(_311);
			vec4 _318 = vec4(_313.x, _313.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _319 = textureLod(V_xDirectionalDepthBlur_xsamplerDownsampledBackBuffer, _318.xy, _318.w);
			vec3 tapColor = _319.xyz;
			vec2 _322;
			_322 = tapCoords;
			float _323 = F_xReShade_xGetLinearizedDepth(_322);
			float tapDepth = _323;
			bool _326 = tapDepth <= pixelInfo.focusPlane;
			bool _328 = blurLengthInPixels == 0.00000000e+00;
			float _330 = blurLengthInPixels + float(_328);
			float _331 = tapIndex / _330;
			float _333 = 1.00000000e+00 - _331;
			float _335 = _326 ? 0.00000000e+00 : _333;
			float weight = _335;
			vec3 _338 = tapColor * vec3(weight);
			vec3 _340 = average.xyz + _338;
			average.xyz = _340;
			float _342 = average.w + weight;
			average[3] = _342;
			vec3 _343;
			_343 = tapColor.xyz;
			vec3 _345 = F_xDirectionalDepthBlur_xAccentuateWhites(_343);
			vec3 gainedTap = _345;
			vec3 _348 = gainedTap * vec3(weight);
			vec3 _349 = averageGained_267 + _348;
			averageGained_267 = _349;
			float _351 = dot(gainedTap, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
			float _352 = clamp(_351, 0.0, 1.0);
			float lumaSample = _352;
			bool _355 = weight > 0.00000000e+00;
			float _356 = max(maxLuma_280, lumaSample);
			float _357 = _355 ? _356 : maxLuma_280;
			maxLuma_280 = _357;
			alpha = 1.00000000e+00;
		}
		float _302 = 1.00000000e+00 / V_xDirectionalDepthBlur_xBlurQuality;
		float _303 = tapIndex + _302;
		tapIndex = _303;
	}
	float _360 = distance(pixelInfo.texCoords, V_xDirectionalDepthBlur_xFocusPoint);
	float distanceToFocusPoint = _360;
	bool _364 = average.w == 0.00000000e+00;
	float _367 = average.w + float(_364);
	vec3 _370 = average.xyz / vec3(_367);
	fragment.xyz = _370;
	bool _372 = V_xDirectionalDepthBlur_xBlurType == 0;
	float _375 = smoothstep(0.00000000e+00, 1.00000000e+00, distanceToFocusPoint);
	vec3 _378 = mix(V_xDirectionalDepthBlur_xFocusPointBlendColor, fragment.xyz, vec3(_375));
	vec3 _379 = clamp(_378, 0.0, 1.0);
	vec3 _382 = mix(fragment.xyz, _379, vec3(V_xDirectionalDepthBlur_xFocusPointBlendFactor));
	vec3 _385 = compCond(bvec3(_372), fragment.xyz, _382);
	fragment.xyz = _385;
	bool _387 = V_xDirectionalDepthBlur_xBlurType == 0;
	float _389 = _387 ? 1.00000000e+00 : filterCircleValue;
	float _390 = V_xDirectionalDepthBlur_xBlendFactor * _389;
	float blendFactorToUse = _390;
	float _392 = clamp(maxLuma_280, 0.0, 1.0);
	bool _395 = average.w == 0.00000000e+00;
	float _398 = average.w + float(_395);
	vec3 _400 = averageGained_267 / vec3(_398);
	vec3 _401;
	float _402;
	vec3 _403;
	float _404;
	_401 = fragment.xyz;
	_402 = _392;
	_403 = _400;
	_404 = highlightGainToUse;
	vec3 _406 = F_xDirectionalDepthBlur_xPostProcessBlurredFragment(_401, _402, _403, _404);
	vec3 _408 = mix(color, _406, vec3(blendFactorToUse));
	fragment.xyz = _408;
	fragment[3] = alpha;
	return;
}
void F_xDirectionalDepthBlur_xPS_Combiner(
	in S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	vec2 _413;
	_413 = pixelInfo.texCoords;
	float _415 = F_xReShade_xGetLinearizedDepth(_413);
	float colorDepth = _415;
	vec4 _421 = vec4(pixelInfo.texCoords.x, pixelInfo.texCoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _422 = textureLod(V_xReShade_xBackBuffer, _421.xy, _421.w);
	vec4 realColor = _422;
	vec4 _428 = vec4(pixelInfo.texCoords.x, pixelInfo.texCoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _429 = textureLod(V_xDirectionalDepthBlur_xsamplerFilterCircle, _428.xy, _428.w);
	float filterCircleValue_431 = _429.x;
	bool _436 = colorDepth <= pixelInfo.focusPlane;
	bool _438 = V_xDirectionalDepthBlur_xBlurLength <= 0.00000000e+00;
	bool _439 = _436 || _438;
	if (_439)
	{
		fragment = realColor;
		return;
	}
	vec4 _444 = vec4(pixelInfo.texCoords.x, pixelInfo.texCoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _445 = textureLod(V_xDirectionalDepthBlur_xsamplerBlurDestination, _444.xy, _444.w);
	vec4 color_446 = _445;
	float _449 = pixelInfo.focusPlane + pixelInfo.focusRange;
	float rangeEnd = _449;
	bool _451 = rangeEnd < colorDepth;
	float _452 = rangeEnd - colorDepth;
	float _454 = _452 / pixelInfo.focusRange;
	float _456 = 1.00000000e+00 - _454;
	float _459 = smoothstep(0.00000000e+00, 1.00000000e+00, _456);
	float _461 = _451 ? 1.00000000e+00 : _459;
	float blendFactor = _461;
	bool _467 = V_xDirectionalDepthBlur_xBlurType == 1;
	bool _468 = _467 && V_xDirectionalDepthBlur_xFocusPointFadeBlurInFeatherBand;
	if (_468)
	{
		float _469 = blendFactor * filterCircleValue_431;
		blendFactor = _469;
	}
	float _471 = blendFactor * color_446.w;
	vec3 _475 = mix(realColor.xyz, color_446.xyz, vec3(_471));
	fragment.xyz = _475;
	bool _479 = V_xDirectionalDepthBlur_xFocusPointViewFilterCircleOnMouseDown && V_xDirectionalDepthBlur_xLeftMouseDown;
	bool _481 = V_xDirectionalDepthBlur_xBlurType == 1;
	bool _482 = _479 && _481;
	if (_482)
	{
		float _484 = filterCircleValue_431 * 6.99999988e-01;
		vec3 _488 = mix(fragment.xyz, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), vec3(_484));
		fragment.xyz = _488;
	}
	return;
}
void F_xDirectionalDepthBlur_xPS_DownSample(
	in S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	vec2 sourceCoords = pixelInfo.texCoordsScaled.zw;
	float _500 = max(sourceCoords.x, sourceCoords.y);
	bool _502 = _500 > 1.00010002e+00;
	if (_502)
	{
		discard;
		return;
	}
	vec4 _503 = texture(V_xReShade_xBackBuffer, sourceCoords);
	fragment = _503;
	return;
}
void F_xDirectionalDepthBlur_xPS_CreateFilterCircle(
	in S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	fragment = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _513 = V_xDirectionalDepthBlur_xBlurType != 1;
	if (_513)
	{
		return;
	}
	vec2 _516 = pixelInfo.texCoords - pixelInfo.centerDisplacementDelta;
	vec2 _518 = _516 - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _520 = (pixelInfo.rotationMatrix * _518);
	vec2 _521 = _520 * V_xDirectionalDepthBlur_xFilterCircleDeformFactors;
	vec2 texcoordCenterNormalized = _521;
	vec2 _524 = V_xDirectionalDepthBlur_xFocusPoint - pixelInfo.centerDisplacementDelta;
	vec2 _526 = _524 - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 focusPointCenterNormalized = _526;
	float _528 = distance(texcoordCenterNormalized, focusPointCenterNormalized);
	float texcoordDistance = _528;
	bool _534 = texcoordDistance < pixelInfo.featherRadius;
	if (_534)
	{
		fragment = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
	else
	{
		bool _539 = texcoordDistance > V_xDirectionalDepthBlur_xFilterCircleRadius;
		if (_539)
		{
			fragment = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		else
		{
			float _542 = V_xDirectionalDepthBlur_xFilterCircleRadius - pixelInfo.featherRadius;
			float featherbandWidth = _542;
			float _545 = texcoordDistance - pixelInfo.featherRadius;
			bool _547 = featherbandWidth == 0.00000000e+00;
			float _549 = featherbandWidth + float(_547);
			float _550 = _545 / _549;
			float _553 = mix(0.00000000e+00, 1.00000000e+00, _550);
			fragment = vec4(_553);
		}
	}
	if (V_xDirectionalDepthBlur_xFlipFadeBlurInFeatherBand)
	{
		vec4 _559 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - fragment;
		fragment = _559;
	}
	return;
}
#ifdef E_xDirectionalDepthBlur_xVS_PixelInfo
layout(location = 0) out vec2 _return_texCoords;
layout(location = 1) out vec2 _return_pixelDelta;
layout(location = 2) out float _return_blurLengthInPixels;
layout(location = 3) out float _return_focusPlane;
layout(location = 4) out float _return_focusRange;
layout(location = 5) out vec4 _return_texCoordsScaled;
layout(location = 6) out mat2x2 _return_rotationMatrix;
layout(location = 8) out vec2 _return_centerDisplacementDelta;
layout(location = 9) out float _return_featherRadius;
void main()
{
	uint id = uint(gl_VertexID);
	S_xDirectionalDepthBlur_xVSPIXELINFO _return = F_xDirectionalDepthBlur_xVS_PixelInfo(id);
	gl_Position = _return.vpos;
	_return_texCoords = _return.texCoords;
	_return_pixelDelta = _return.pixelDelta;
	_return_blurLengthInPixels = _return.blurLengthInPixels;
	_return_focusPlane = _return.focusPlane;
	_return_focusRange = _return.focusRange;
	_return_texCoordsScaled = _return.texCoordsScaled;
	_return_rotationMatrix = _return.rotationMatrix;
	_return_centerDisplacementDelta = _return.centerDisplacementDelta;
	_return_featherRadius = _return.featherRadius;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xDirectionalDepthBlur_xPS_CreateFilterCircle
in vec2 vv_0;
in vec2 vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in vec4 vv_5;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xDirectionalDepthBlur_xVSPIXELINFO _in_pixelInfo = S_xDirectionalDepthBlur_xVSPIXELINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_8, vv_9);
	S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xDirectionalDepthBlur_xPS_CreateFilterCircle(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
#ifdef E_xDirectionalDepthBlur_xPS_DownSample
in vec2 vv_0;
in vec2 vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in vec4 vv_5;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xDirectionalDepthBlur_xVSPIXELINFO _in_pixelInfo = S_xDirectionalDepthBlur_xVSPIXELINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_8, vv_9);
	S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xDirectionalDepthBlur_xPS_DownSample(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
#ifdef E_xDirectionalDepthBlur_xPS_Blur
in vec2 vv_0;
in vec2 vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in vec4 vv_5;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xDirectionalDepthBlur_xVSPIXELINFO _in_pixelInfo = S_xDirectionalDepthBlur_xVSPIXELINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_8, vv_9);
	S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xDirectionalDepthBlur_xPS_Blur(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
#ifdef E_xDirectionalDepthBlur_xPS_Combiner
in vec2 vv_0;
in vec2 vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in vec4 vv_5;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xDirectionalDepthBlur_xVSPIXELINFO _in_pixelInfo = S_xDirectionalDepthBlur_xVSPIXELINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6, vv_8, vv_9);
	S_xDirectionalDepthBlur_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xDirectionalDepthBlur_xPS_Combiner(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
