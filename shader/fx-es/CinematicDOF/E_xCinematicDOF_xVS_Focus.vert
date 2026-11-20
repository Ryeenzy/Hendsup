#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xCinematicDOF_xVS_Focus
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
uniform bool V_xCinematicDOF_xUseAutoFocus;
uniform bool V_xCinematicDOF_xUseMouseDrivenAutoFocus;
uniform vec2 V_xCinematicDOF_xAutoFocusPoint;
uniform float V_xCinematicDOF_xAutoFocusTransitionSpeed;
uniform float V_xCinematicDOF_xManualFocusPlane;
uniform float V_xCinematicDOF_xFocalLength;
uniform float V_xCinematicDOF_xFNumber;
uniform bool V_xCinematicDOF_xShowOutOfFocusPlaneOnMouseDown;
uniform vec3 V_xCinematicDOF_xOutOfFocusPlaneColor;
uniform float V_xCinematicDOF_xOutOfFocusPlaneColorTransparency;
uniform vec3 V_xCinematicDOF_xFocusPlaneColor;
uniform vec4 V_xCinematicDOF_xFocusCrosshairColor;
uniform float V_xCinematicDOF_xFarPlaneMaxBlur;
uniform float V_xCinematicDOF_xNearPlaneMaxBlur;
uniform float V_xCinematicDOF_xBlurQuality;
uniform float V_xCinematicDOF_xBokehBusyFactor;
uniform float V_xCinematicDOF_xPostBlurSmoothing;
uniform float V_xCinematicDOF_xNearFarDistanceCompensation;
uniform float V_xCinematicDOF_xHighlightAnamorphicFactor;
uniform float V_xCinematicDOF_xHighlightAnamorphicSpreadFactor;
uniform float V_xCinematicDOF_xHighlightAnamorphicAlignmentFactor;
uniform float V_xCinematicDOF_xHighlightBoost;
uniform float V_xCinematicDOF_xHighlightGammaFactor;
uniform float V_xCinematicDOF_xHighlightSharpeningFactor;
uniform int V_xCinematicDOF_xHighlightShape;
uniform float V_xCinematicDOF_xHighlightShapeRotationAngle;
uniform float V_xCinematicDOF_xHighlightShapeGamma;
uniform bool V_xCinematicDOF_xMitigateUndersampling;
uniform bool V_xCinematicDOF_xShowCoCValues;
uniform vec2 V_xCinematicDOF_xMouseCoords;
uniform bool V_xCinematicDOF_xLeftMouseDown;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xCinematicDOF_xSamplerCDCurrentFocus;
uniform sampler2D V_xCinematicDOF_xSamplerCDPreviousFocus;
uniform sampler2D V_xCinematicDOF_xSamplerCDBuffer1;
uniform sampler2D V_xCinematicDOF_xSamplerCDBuffer2;
uniform sampler2D V_xCinematicDOF_xSamplerCDBuffer3;
uniform sampler2D V_xCinematicDOF_xSamplerCDBuffer4;
uniform sampler2D V_xCinematicDOF_xSamplerCDBuffer5;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoC;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoCTmp1;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoCBlurred;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoCTileTmp;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoCTile;
uniform sampler2D V_xCinematicDOF_xSamplerCDCoCTileNeighbor;
uniform sampler2D V_xCinematicDOF_xSamplerCDNoise;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape1;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape2;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape3;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape4;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape5;
uniform sampler2D V_xCinematicDOF_xSamplerCDBokehShape6;
struct S_xCinematicDOF_xVSFOCUSINFO
{
	vec4 vpos;
	vec2 texcoord;
	float focusDepth;
	float focusDepthInM;
	float focusDepthInMM;
	float pixelSizeLength;
	float nearPlaneInMM;
	float farPlaneInMM;
};
struct S_xCinematicDOF_xVSDISCBLURINFO
{
	vec4 vpos;
	vec2 texcoord;
	float numberOfRings;
	float farPlaneMaxBlurInPixels;
	float nearPlaneMaxBlurInPixels;
	float cocFactorPerPixel;
	float highlightBoostFactor;
};
const float _1154[18] = float[18](0.00000000e+00, 1.49537051e+00, 3.48919916e+00, 5.48303127e+00, 7.47686815e+00, 9.47071266e+00, 1.14645653e+01, 1.34584293e+01, 1.54523058e+01, 1.74461975e+01, 1.94661980e+01, 2.14627419e+01, 2.34592915e+01, 2.54558449e+01, 2.74524021e+01, 2.94489632e+01, 3.14455299e+01, 3.34421005e+01);
const float _1156[18] = float[18](3.32450010e-02, 6.59162253e-02, 6.36705831e-02, 5.98194674e-02, 5.46642579e-02, 4.85871658e-02, 4.20046002e-02, 3.53207029e-02, 2.88880989e-02, 2.29808316e-02, 1.77815519e-02, 1.33822970e-02, 9.79600009e-03, 6.97467476e-03, 4.83010057e-03, 3.25345970e-03, 2.13153102e-03, 1.35829742e-03);
const float _1203[6] = float[6](0.00000000e+00, 1.45842957e+00, 3.40398479e+00, 5.35180569e+00, 7.30294085e+00, 9.25815964e+00);
const float _1205[6] = float[6](1.32980004e-01, 2.32275754e-01, 1.35326162e-01, 5.11557423e-02, 1.25392200e-02, 1.99136441e-03);
S_xCinematicDOF_xVSFOCUSINFO _1562;
S_xCinematicDOF_xVSDISCBLURINFO _1589;
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
vec3 F_xCinematicDOF_xConeOverlap(
	in vec3 fragment)
{
	float k = 1.32000014e-01;
	float _140 = 2.00000000e+00 * k;
	float _142 = 1.00000000e+00 - _140;
	vec2 _143 = vec2(_142, k);
	vec2 f = _143;
	mat3x3 _154 = mat3x3(f.xyy.x, f.xyy.y, f.xyy.z, f.yxy.x, f.yxy.y, f.yxy.z, f.yyx.x, f.yyx.y, f.yyx.z);
	mat3x3 m = _154;
	vec3 _156 = (m * fragment);
	return _156;
}
vec3 F_xCinematicDOF_xConeOverlapInverse(
	in vec3 fragment)
{
	float k_161 = 1.32000014e-01;
	float _163 = k_161 - 1.00000000e+00;
	vec2 _164 = vec2(_163, k_161);
	float _166 = 3.00000000e+00 * k_161;
	float _168 = _166 - 1.00000000e+00;
	float _169 = 1.0 / _168;
	vec2 _171 = _164 * vec2(_169);
	vec2 f_172 = _171;
	mat3x3 _182 = mat3x3(f_172.xyy.x, f_172.xyy.y, f_172.xyy.z, f_172.yxy.x, f_172.yxy.y, f_172.yxy.z, f_172.yyx.x, f_172.yyx.y, f_172.yyx.z);
	mat3x3 m_183 = _182;
	vec3 _184 = (m_183 * fragment);
	return _184;
}
vec3 F_xCinematicDOF_xAccentuateWhites(
	in vec3 fragment)
{
	vec3 _188;
	_188 = fragment;
	vec3 _189 = F_xCinematicDOF_xConeOverlap(_188);
	vec3 _190 = abs(_189);
	vec3 _192 = pow(_190, vec3(V_xCinematicDOF_xHighlightGammaFactor));
	fragment = _192;
	vec3 _194 = vec3(V_xCinematicDOF_xHighlightBoost) * fragment;
	vec3 _196 = vec3(1.00100005e+00, 1.00100005e+00, 1.00100005e+00) - _194;
	vec3 _198 = max(_196, vec3(1.00000005e-03, 1.00000005e-03, 1.00000005e-03));
	vec3 _199 = fragment / _198;
	return _199;
}
vec3 F_xCinematicDOF_xCorrectForWhiteAccentuation(
	in vec3 fragment)
{
	vec3 _204 = vec3(V_xCinematicDOF_xHighlightBoost) * fragment;
	vec3 _206 = vec3(1.00100005e+00, 1.00100005e+00, 1.00100005e+00) + _204;
	vec3 _207 = fragment / _206;
	vec3 toReturn = _207;
	vec3 _209 = abs(toReturn);
	float _211 = 1.00000000e+00 / V_xCinematicDOF_xHighlightGammaFactor;
	vec3 _213 = pow(_209, vec3(_211));
	vec3 _214;
	_214 = _213;
	vec3 _215 = F_xCinematicDOF_xConeOverlapInverse(_214);
	return _215;
}
vec4 F_xCinematicDOF_xCalculateAnamorphicFactor(
	in vec2 pixelVector)
{
	vec2 _220 = pixelVector * vec2(2.00000000e+00, 2.00000000e+00);
	float _221 = length(_220);
	float _223 = mix(_221, 1.00000000e+00, V_xCinematicDOF_xHighlightAnamorphicSpreadFactor);
	float _225 = mix(1.00000000e+00, V_xCinematicDOF_xHighlightAnamorphicFactor, _223);
	float normalizedFactor = _225;
	float _228 = 1.00000000e+00 - normalizedFactor;
	float _230 = 1.00000000e+00 + _228;
	vec4 _233 = vec4(0.00000000e+00, _230, normalizedFactor, 0.00000000e+00);
	return _233;
}
mat2x2 F_xCinematicDOF_xCalculateAnamorphicRotationMatrix(
	in vec2 texcoord)
{
	vec2 _238 = texcoord - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _239 = normalize(_238);
	vec2 pixelVector_240 = _239;
	float _242 = 1.00000000e+00 - V_xCinematicDOF_xHighlightAnamorphicAlignmentFactor;
	float _244 = _242 / 2.00000000e+00;
	float limiter = _244;
	float _246 = -(limiter);
	float _248 = clamp(pixelVector_240.y, _246, limiter);
	pixelVector_240[1] = _248;
	vec2 _250 = normalize(vec2(-5.00000000e-01, 0.00000000e+00));
	vec2 refVector = _250;
	vec2 sincosFactor = vec2(0.00000000e+00, 0.00000000e+00);
	float _256 = atan(pixelVector_240.y, pixelVector_240.x);
	float _259 = atan(refVector.y, refVector.x);
	float _260 = _256 - _259;
	float _261;
	float _262;
	_261 = sin(_260), _262 = cos(_260);
	sincosFactor[0] = _261;
	sincosFactor[1] = _262;
	float _265 = -(sincosFactor.x);
	mat2x2 _269 = mat2x2(sincosFactor.y, sincosFactor.x, _265, sincosFactor.y);
	return _269;
}
vec2 F_xCinematicDOF_xMorphPointOffsetWithAnamorphicDeltas(
	in vec2 pointOffset,
	in vec4 anamorphicFactors,
	in mat2x2 anamorphicRotationMatrix)
{
	float _277 = pointOffset.x * anamorphicFactors.x;
	float _280 = pointOffset.x * anamorphicFactors.z;
	float _281 = _277 + _280;
	pointOffset[0] = _281;
	float _284 = pointOffset.y * anamorphicFactors.y;
	float _287 = pointOffset.y * anamorphicFactors.w;
	float _288 = _284 + _287;
	pointOffset[1] = _288;
	vec2 _289 = (anamorphicRotationMatrix * pointOffset);
	return _289;
}
float F_xCinematicDOF_xPerformTileGatherHorizontal(
	in sampler2D source,
	in vec2 texcoord)
{
	float tileSize = 1.00000000e+00;
	float minCoC = 1.00000000e+01;
	float coc = 0.00000000e+00;
	vec2 coordOffset = vec2(5.20833360e-04, 0.00000000e+00);
	float i = 0.00000000e+00;
	while (i <= tileSize)
	{
		{
			vec2 _312 = texcoord + coordOffset;
			vec4 _317 = vec4(_312.x, _312.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _318 = textureLod(source, _317.xy, _317.w);
			coc = _318.x;
			float _320 = min(minCoC, coc);
			minCoC = _320;
			vec2 _321 = texcoord - coordOffset;
			vec4 _326 = vec4(_321.x, _321.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _327 = textureLod(source, _326.xy, _326.w);
			coc = _327.x;
			float _329 = min(minCoC, coc);
			minCoC = _329;
			float _332 = coordOffset.x + 5.20833360e-04;
			coordOffset[0] = _332;
		}
		float _311 = i + 1.00000000e+00;
		i = _311;
	}
	return minCoC;
}
float F_xCinematicDOF_xPerformTileGatherVertical(
	in sampler2D source,
	in vec2 texcoord)
{
	float tileSize_338 = 8.99999976e-01;
	float minCoC_340 = 1.00000000e+01;
	float coc_342 = 0.00000000e+00;
	vec2 coordOffset_344 = vec2(0.00000000e+00, 9.25925910e-04);
	float i_346 = 0.00000000e+00;
	while (i_346 <= tileSize_338)
	{
		{
			vec2 _355 = texcoord + coordOffset_344;
			vec4 _360 = vec4(_355.x, _355.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _361 = textureLod(source, _360.xy, _360.w);
			coc_342 = _361.x;
			float _363 = min(minCoC_340, coc_342);
			minCoC_340 = _363;
			vec2 _364 = texcoord - coordOffset_344;
			vec4 _369 = vec4(_364.x, _364.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _370 = textureLod(source, _369.xy, _369.w);
			coc_342 = _370.x;
			float _372 = min(minCoC_340, coc_342);
			minCoC_340 = _372;
			float _375 = coordOffset_344.y + 9.25925910e-04;
			coordOffset_344[1] = _375;
		}
		float _354 = i_346 + 1.00000000e+00;
		i_346 = _354;
	}
	return minCoC_340;
}
float F_xCinematicDOF_xPerformNeighborTileGather(
	in sampler2D source,
	in vec2 texcoord)
{
	float minCoC_381 = 1.00000000e+01;
	float tileSizeX = 1.00000000e+00;
	float tileSizeY = 8.99999976e-01;
	float _387 = tileSizeX * 2.00000000e+00;
	float _389 = _387 + 1.00000000e+00;
	float _391 = 5.20833360e-04 * _389;
	float _393 = tileSizeY * 2.00000000e+00;
	float _395 = _393 + 1.00000000e+00;
	float _397 = 5.20833360e-04 * _395;
	vec2 _398 = vec2(_391, _397);
	vec2 baseCoordOffset = _398;
	float i_401 = -1.00000000e+00;
	while (i_401 < 2.00000000e+00)
	{
		{
			float j = -1.00000000e+00;
			while (j < 2.00000000e+00)
			{
				{
					float _425 = baseCoordOffset.x * i_401;
					float _427 = baseCoordOffset.y * j;
					vec2 _428 = vec2(_425, _427);
					vec2 coordOffset_429 = _428;
					vec2 _430 = texcoord + coordOffset_429;
					vec4 _435 = vec4(_430.x, _430.y, 0.00000000e+00, 0.00000000e+00);
					vec4 _436 = textureLod(source, _435.xy, _435.w);
					float coc_438 = _436.x;
					float _439 = min(minCoC_381, coc_438);
					minCoC_381 = _439;
				}
				float _422 = j;
				float _423 = _422 + 1.00000000e+00;
				j = _423;
			}
		}
		float _410 = i_401;
		float _411 = _410 + 1.00000000e+00;
		i_401 = _411;
	}
	return minCoC_381;
}
vec4 F_xCinematicDOF_xGetDebugFragment(
	in float radius,
	in bool showInFocus)
{
	float _445 = radius / 2.00000000e+00;
	float _447 = length(vec2(5.20833360e-04, 9.25925910e-04));
	bool _448 = _445 <= _447;
	bool _449 = _448 && showInFocus;
	vec4 _451 = vec4(radius, radius, radius, 1.00000000e+00);
	vec4 _454 = compCond(bvec4(_449), vec4(0.00000000e+00, 0.00000000e+00, 1.00000000e+00, 1.00000000e+00), _451);
	vec4 toReturn_455 = _454;
	bool _460 = radius < 0.00000000e+00;
	if (_460)
	{
		float _461 = -(radius);
		vec4 _465 = vec4(_461, 0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
		toReturn_455 = _465;
	}
	return toReturn_455;
}
vec4 F_xCinematicDOF_xGetShapeTap(
	in float angle,
	in float shapeRingDistance,
	in sampler2D shapeSampler)
{
	vec2 pointOffsetForShape = vec2(0.00000000e+00, 0.00000000e+00);
	float _474 = 6.28318548e+00 * V_xCinematicDOF_xHighlightShapeRotationAngle;
	float _475 = angle + _474;
	float _477 = _475 + 4.71238899e+00;
	float _478;
	float _479;
	_478 = sin(_477), _479 = cos(_477);
	pointOffsetForShape[0] = _478;
	pointOffsetForShape[1] = _479;
	float _483 = pointOffsetForShape.y * -1.00000000e+00;
	pointOffsetForShape[1] = _483;
	vec2 _485 = vec2(shapeRingDistance) * pointOffsetForShape;
	vec2 _487 = _485 + vec2(5.00000000e-01, 5.00000000e-01);
	vec4 _492 = vec4(_487.x, _487.y, 0.00000000e+00, 0.00000000e+00);
	vec4 shapeTapCoords = _492;
	vec4 _494 = textureLod(shapeSampler, shapeTapCoords.xy, shapeTapCoords.w);
	vec4 shapeTap = _494;
	float _498 = dot(shapeTap.xyz, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	shapeTap[3] = _498;
	return shapeTap;
}
float F_xCinematicDOF_xCalculateBlurDiscSize(
	in S_xCinematicDOF_xVSFOCUSINFO focusInfo)
{
	vec2 _502;
	_502 = focusInfo.texcoord;
	float _504 = F_xReShade_xGetLinearizedDepth(_502);
	float pixelDepth = _504;
	float _507 = pixelDepth * 1.00000000e+03;
	float pixelDepthInM = _507;
	float _509 = V_xCinematicDOF_xFocalLength * V_xCinematicDOF_xFocalLength;
	float _510 = _509 / V_xCinematicDOF_xFNumber;
	float _513 = focusInfo.focusDepthInM / 1.00000000e+03;
	float _514 = _513 - V_xCinematicDOF_xFocalLength;
	float _515 = _510 / _514;
	float _517 = pixelDepthInM - focusInfo.focusDepthInM;
	float _518 = abs(_517);
	bool _520 = pixelDepthInM == 0.00000000e+00;
	float _522 = pixelDepthInM + float(_520);
	float _523 = _518 / _522;
	float _524 = _515 * _523;
	float cocInMM = _524;
	float _526 = abs(cocInMM);
	float _528 = _526 * 2.40000002e-02;
	float _529 = clamp(_528, 0.0, 1.0);
	float _532 = clamp(_529, 0.00000000e+00, 1.00000000e+00);
	float toReturn_533 = _532;
	bool _535 = pixelDepth < focusInfo.focusDepth;
	float _536 = -(toReturn_533);
	float _537 = _535 ? _536 : toReturn_533;
	return _537;
}
float F_xCinematicDOF_xCalculateSampleWeight(
	in float sampleRadiusInCoC,
	in float ringDistanceInCoC)
{
	float _542 = ringDistanceInCoC * V_xCinematicDOF_xNearFarDistanceCompensation;
	float _543 = sampleRadiusInCoC - _542;
	float _545 = _543 + 5.00000000e-01;
	float _546 = clamp(_545, 0.0, 1.0);
	return _546;
}
vec4 F_xCinematicDOF_xPerformNearPlaneDiscBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	in sampler2D source,
	in sampler2D shapeSampler)
{
	vec4 _556 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _557 = textureLod(source, _556.xy, _556.w);
	vec4 fragment_558 = _557;
	vec4 _563 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _564 = textureLod(V_xCinematicDOF_xSamplerCDCoCBlurred, _563.xy, _563.w);
	vec2 fragmentRadii = _564.xy;
	float fragmentRadiusToUse = fragmentRadii.x;
	bool _574 = fragmentRadii.x <= 0.00000000e+00;
	if (_574)
	{
		fragment_558[3] = 0.00000000e+00;
		return fragment_558;
	}
	float _578 = max(blurInfo.numberOfRings, 1.00000000e+00);
	float _580 = _578 + 1.00000000e+00;
	float numberOfRings = _580;
	float pointsFirstRing = 7.00000000e+00;
	float _585 = 1.00000000e+00 - V_xCinematicDOF_xBokehBusyFactor;
	float _586 = clamp(_585, 0.0, 1.0);
	float bokehBusyFactorToUse = _586;
	vec3 _590 = fragment_558.xyz * vec3(fragmentRadiusToUse);
	vec3 _592 = _590 * vec3(bokehBusyFactorToUse);
	vec4 _596 = vec4(_592.x, _592.y, _592.z, bokehBusyFactorToUse);
	vec4 average = _596;
	vec2 pointOffset_599 = vec2(0.00000000e+00, 0.00000000e+00);
	float _601 = blurInfo.nearPlaneMaxBlurInPixels * fragmentRadiusToUse;
	float nearPlaneBlurInPixels = _601;
	float _604 = numberOfRings - 1.00000000e+00;
	float _605 = nearPlaneBlurInPixels / _604;
	vec2 _608 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(_605);
	vec2 ringRadiusDeltaCoords = _608;
	float pointsOnRing = pointsFirstRing;
	vec2 currentRingRadiusCoords = ringRadiusDeltaCoords;
	vec2 _614 = blurInfo.texcoord - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _615;
	_615 = _614;
	vec4 _616 = F_xCinematicDOF_xCalculateAnamorphicFactor(_615);
	vec4 anamorphicFactors_617 = _616;
	vec2 _618;
	_618 = blurInfo.texcoord;
	mat2x2 _620 = F_xCinematicDOF_xCalculateAnamorphicRotationMatrix(_618);
	mat2x2 anamorphicRotationMatrix_621 = _620;
	bool _623 = V_xCinematicDOF_xHighlightShape > 0;
	bool useShape = _623;
	vec4 shapeTap_626 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	float ringIndex = 0.00000000e+00;
	while (ringIndex < numberOfRings)
	{
		{
			float _639 = 6.28318548e+00 / pointsOnRing;
			float anglePerPoint = _639;
			float angle_641 = anglePerPoint;
			float _642 = ringIndex / numberOfRings;
			float _645 = smoothstep(0.00000000e+00, 1.00000000e+00, bokehBusyFactorToUse);
			float _647 = mix(_642, 1.00000000e+00, _645);
			float weight = _647;
			float _650 = ringIndex + 1.00000000e+00;
			float _651 = _650 / numberOfRings;
			float _653 = _651 * 5.00000000e-01;
			float shapeRingDistance_654 = _653;
			float pointNumber = 0.00000000e+00;
			while (pointNumber < pointsOnRing)
			{
				{
					float _666;
					float _667;
					_666 = sin(angle_641), _667 = cos(angle_641);
					pointOffset_599[1] = _666;
					pointOffset_599[0] = _667;
					float _669;
					float _670;
					_669 = angle_641;
					_670 = shapeRingDistance_654;
					vec4 _671 = F_xCinematicDOF_xGetShapeTap(_669, _670, shapeSampler);
					vec4 _673 = compCond(bvec4(useShape), _671, shapeTap_626);
					shapeTap_626 = _673;
					vec2 _674;
					vec4 _675;
					mat2x2 _676;
					_674 = pointOffset_599;
					_675 = anamorphicFactors_617;
					_676 = anamorphicRotationMatrix_621;
					vec2 _677 = F_xCinematicDOF_xMorphPointOffsetWithAnamorphicDeltas(_674, _675, _676);
					vec2 _679 = compCond(bvec2(useShape), pointOffset_599, _677);
					pointOffset_599 = _679;
					vec2 _680 = pointOffset_599 * currentRingRadiusCoords;
					vec2 _682 = blurInfo.texcoord + _680;
					vec4 _687 = vec4(_682.x, _682.y, 0.00000000e+00, 0.00000000e+00);
					vec4 tapCoords = _687;
					vec4 _689 = textureLod(source, tapCoords.xy, tapCoords.w);
					vec4 tap = _689;
					vec3 _693 = shapeTap_626.xyz * vec3(V_xCinematicDOF_xHighlightShapeGamma);
					vec3 _696 = compCond(bvec3(useShape), _693, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					vec3 _698 = tap.xyz * _696;
					tap.xyz = _698;
					vec4 _699 = textureLod(V_xCinematicDOF_xSamplerCDCoCBlurred, tapCoords.xy, tapCoords.w);
					vec2 sampleRadii = _699.xy;
					float blurredSampleRadius = sampleRadii.x;
					bool _706 = shapeTap_626.w > 9.99999978e-03;
					float _709 = _706 ? 1.00000000e+00 : 0.00000000e+00;
					float _710 = weight * _709;
					float sampleWeight = _710;
					vec3 _714 = tap.xyz * vec3(sampleWeight);
					vec3 _716 = average.xyz + _714;
					average.xyz = _716;
					float _718 = average.w + sampleWeight;
					average[3] = _718;
					float _719 = angle_641 + anglePerPoint;
					angle_641 = _719;
				}
				float _664 = pointNumber;
				float _665 = _664 + 1.00000000e+00;
				pointNumber = _665;
			}
			float _720 = pointsOnRing + pointsFirstRing;
			pointsOnRing = _720;
			vec2 _721 = currentRingRadiusCoords + ringRadiusDeltaCoords;
			currentRingRadiusCoords = _721;
		}
		float _636 = ringIndex;
		float _637 = _636 + 1.00000000e+00;
		ringIndex = _637;
	}
	bool _724 = average.w == 0.00000000e+00;
	float _727 = average.w + float(_724);
	vec3 _730 = average.xyz / vec3(_727);
	average.xyz = _730;
	float _732 = min(2.50000000e+00, V_xCinematicDOF_xNearPlaneMaxBlur);
	float _734 = _732 + 4.00000006e-01;
	bool _736 = fragmentRadiusToUse > 1.00000001e-01;
	bool _739 = fragmentRadii.y <= 0.00000000e+00;
	int _742 = _739 ? 2 : 1;
	float _744 = float(_742) * fragmentRadiusToUse;
	float _746 = -(fragmentRadii.y);
	float _747 = max(fragmentRadiusToUse, _746);
	float _748 = _736 ? _744 : _747;
	float _749 = _734 * _748;
	float _750 = clamp(_749, 0.0, 1.0);
	float alpha = _750;
	fragment_558.xyz = average.xyz;
	fragment_558[3] = alpha;
	return fragment_558;
}
vec4 F_xCinematicDOF_xPerformDiscBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	in sampler2D source,
	in sampler2D shapeSampler)
{
	vec4 _762 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _763 = textureLod(source, _762.xy, _762.w);
	vec4 fragment_764 = _763;
	vec4 _769 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _770 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _769.xy, _769.w);
	float fragmentRadius = _770.x;
	bool _777 = fragmentRadius < 0.00000000e+00;
	bool _780 = blurInfo.farPlaneMaxBlurInPixels <= 0.00000000e+00;
	bool _781 = _777 || _780;
	if (_781)
	{
		return fragment_764;
	}
	float _783 = 1.00000000e+00 - V_xCinematicDOF_xBokehBusyFactor;
	float _784 = clamp(_783, 0.0, 1.0);
	float bokehBusyFactorToUse_785 = _784;
	vec3 _788 = fragment_764.xyz * vec3(fragmentRadius);
	vec3 _790 = _788 * vec3(bokehBusyFactorToUse_785);
	vec4 _794 = vec4(_790.x, _790.y, _790.z, bokehBusyFactorToUse_785);
	vec4 average_795 = _794;
	vec2 pointOffset_797 = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 _800 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(blurInfo.farPlaneMaxBlurInPixels);
	vec2 _802 = _800 * vec2(fragmentRadius);
	vec2 _804 = _802 / vec2(blurInfo.numberOfRings);
	vec2 ringRadiusDeltaCoords_805 = _804;
	vec2 currentRingRadiusCoords_806 = ringRadiusDeltaCoords_805;
	float _807 = fragmentRadius * V_xCinematicDOF_xFarPlaneMaxBlur;
	float _809 = _807 / blurInfo.numberOfRings;
	float cocPerRing = _809;
	float pointsOnRing_812 = 7.00000000e+00;
	vec2 _815 = blurInfo.texcoord - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _816;
	_816 = _815;
	vec4 _817 = F_xCinematicDOF_xCalculateAnamorphicFactor(_816);
	vec4 anamorphicFactors_818 = _817;
	vec2 _819;
	_819 = blurInfo.texcoord;
	mat2x2 _821 = F_xCinematicDOF_xCalculateAnamorphicRotationMatrix(_819);
	mat2x2 anamorphicRotationMatrix_822 = _821;
	bool _824 = V_xCinematicDOF_xHighlightShape > 0;
	bool useShape_825 = _824;
	vec4 shapeTap_827 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	float ringIndex_829 = 0.00000000e+00;
	while (ringIndex_829 < blurInfo.numberOfRings)
	{
		{
			float _841 = 6.28318548e+00 / pointsOnRing_812;
			float anglePerPoint_842 = _841;
			float angle_843 = anglePerPoint_842;
			float _845 = ringIndex_829 / blurInfo.numberOfRings;
			float _847 = mix(_845, 1.00000000e+00, bokehBusyFactorToUse_785);
			float ringWeight = _847;
			float _849 = cocPerRing * ringIndex_829;
			float ringDistance = _849;
			float _852 = ringIndex_829 + 1.00000000e+00;
			float _854 = _852 / blurInfo.numberOfRings;
			float _856 = _854 * 5.00000000e-01;
			float shapeRingDistance_857 = _856;
			float pointNumber_859 = 0.00000000e+00;
			while (pointNumber_859 < pointsOnRing_812)
			{
				{
					float _869;
					float _870;
					_869 = sin(angle_843), _870 = cos(angle_843);
					pointOffset_797[1] = _869;
					pointOffset_797[0] = _870;
					float _872;
					float _873;
					_872 = angle_843;
					_873 = shapeRingDistance_857;
					vec4 _874 = F_xCinematicDOF_xGetShapeTap(_872, _873, shapeSampler);
					vec4 _876 = compCond(bvec4(useShape_825), _874, shapeTap_827);
					shapeTap_827 = _876;
					vec2 _877;
					vec4 _878;
					mat2x2 _879;
					_877 = pointOffset_797;
					_878 = anamorphicFactors_818;
					_879 = anamorphicRotationMatrix_822;
					vec2 _880 = F_xCinematicDOF_xMorphPointOffsetWithAnamorphicDeltas(_877, _878, _879);
					vec2 _882 = compCond(bvec2(useShape_825), pointOffset_797, _880);
					pointOffset_797 = _882;
					vec2 _883 = pointOffset_797 * currentRingRadiusCoords_806;
					vec2 _885 = blurInfo.texcoord + _883;
					vec4 _890 = vec4(_885.x, _885.y, 0.00000000e+00, 0.00000000e+00);
					vec4 tapCoords_891 = _890;
					vec4 _892 = textureLod(V_xCinematicDOF_xSamplerCDCoC, tapCoords_891.xy, tapCoords_891.w);
					float sampleRadius = _892.x;
					bool _896 = sampleRadius >= 0.00000000e+00;
					float _898 = float(_896) * ringWeight;
					float _899 = sampleRadius * V_xCinematicDOF_xFarPlaneMaxBlur;
					float _900;
					float _901;
					_900 = _899;
					_901 = ringDistance;
					float _902 = F_xCinematicDOF_xCalculateSampleWeight(_900, _901);
					float _903 = _898 * _902;
					bool _906 = shapeTap_827.w > 9.99999978e-03;
					float _909 = _906 ? 1.00000000e+00 : 0.00000000e+00;
					float _910 = _903 * _909;
					float weight_911 = _910;
					float _913 = min(V_xCinematicDOF_xFarPlaneMaxBlur, 3.00000000e+00);
					float _914 = fragmentRadius - sampleRadius;
					float _915 = clamp(_914, 0.0, 1.0);
					float _916 = _913 * _915;
					float _918 = 1.00000000e+00 + _916;
					float _919 = weight_911 * _918;
					weight_911 = _919;
					vec4 _920 = textureLod(source, tapCoords_891.xy, tapCoords_891.w);
					vec4 tap_921 = _920;
					vec3 _924 = shapeTap_827.xyz * vec3(V_xCinematicDOF_xHighlightShapeGamma);
					vec3 _927 = compCond(bvec3(useShape_825), _924, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
					vec3 _929 = tap_921.xyz * _927;
					tap_921.xyz = _929;
					vec3 _932 = tap_921.xyz * vec3(weight_911);
					vec3 _934 = average_795.xyz + _932;
					average_795.xyz = _934;
					float _936 = average_795.w + weight_911;
					average_795[3] = _936;
					float _937 = angle_843 + anglePerPoint_842;
					angle_843 = _937;
				}
				float _867 = pointNumber_859;
				float _868 = _867 + 1.00000000e+00;
				pointNumber_859 = _868;
			}
			float _939 = pointsOnRing_812 + 7.00000000e+00;
			pointsOnRing_812 = _939;
			vec2 _940 = currentRingRadiusCoords_806 + ringRadiusDeltaCoords_805;
			currentRingRadiusCoords_806 = _940;
		}
		float _838 = ringIndex_829;
		float _839 = _838 + 1.00000000e+00;
		ringIndex_829 = _839;
	}
	bool _943 = average_795.w == 0.00000000e+00;
	float _946 = average_795.w + float(_943);
	vec3 _949 = average_795.xyz / vec3(_946);
	fragment_764.xyz = _949;
	return fragment_764;
}
vec4 F_xCinematicDOF_xPerformPreDiscBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	in sampler2D source)
{
	float _956 = max(blurInfo.numberOfRings, 1.00000000e+00);
	float _958 = 1.00000000e+00 / _956;
	float radiusFactor = _958;
	float _962 = blurInfo.numberOfRings - 3.00000000e+00;
	float _964 = max(_962, 2.00000000e+00);
	float pointsFirstRing_965 = _964;
	vec4 _970 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _971 = textureLod(source, _970.xy, _970.w);
	vec4 fragment_972 = _971;
	vec3 _973;
	_973 = fragment_972.xyz;
	vec3 _975 = F_xCinematicDOF_xAccentuateWhites(_973);
	fragment_972.xyz = _975;
	bool _979 = !bool(V_xCinematicDOF_xMitigateUndersampling);
	if (_979)
	{
		return fragment_972;
	}
	vec4 _984 = vec4(blurInfo.texcoord.x, blurInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _985 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _984.xy, _984.w);
	float _987 = _985.x * radiusFactor;
	float signedFragmentRadius = _987;
	float _989 = abs(signedFragmentRadius);
	float absoluteFragmentRadius = _989;
	bool _992 = signedFragmentRadius < 0.00000000e+00;
	bool isNearPlaneFragment = _992;
	float _994 = isNearPlaneFragment ? V_xCinematicDOF_xNearPlaneMaxBlur : V_xCinematicDOF_xFarPlaneMaxBlur;
	float blurFactorToUse = _994;
	float _998 = blurInfo.numberOfRings - 2.00000000e+00;
	float _1000 = max(_998, 1.00000000e+00);
	float numberOfRings_1001 = _1000;
	bool _1003 = absoluteFragmentRadius == 0.00000000e+00;
	vec3 _1006 = fragment_972.xyz * vec3(absoluteFragmentRadius);
	vec4 _1010 = vec4(_1006.x, _1006.y, _1006.z, absoluteFragmentRadius);
	vec4 _1012 = compCond(bvec4(_1003), fragment_972, _1010);
	vec4 average_1013 = _1012;
	vec2 pointOffset_1015 = vec2(0.00000000e+00, 0.00000000e+00);
	float _1018 = isNearPlaneFragment ? blurInfo.nearPlaneMaxBlurInPixels : blurInfo.farPlaneMaxBlurInPixels;
	float _1019 = _1018 * absoluteFragmentRadius;
	vec2 _1022 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(_1019);
	float _1024 = numberOfRings_1001 - 1.00000000e+00;
	bool _1026 = numberOfRings_1001 == 1.00000000e+00;
	float _1028 = _1024 + float(_1026);
	float _1029 = 1.0 / _1028;
	vec2 _1031 = _1022 * vec2(_1029);
	vec2 ringRadiusDeltaCoords_1032 = _1031;
	float pointsOnRing_1033 = pointsFirstRing_965;
	vec2 currentRingRadiusCoords_1034 = ringRadiusDeltaCoords_1032;
	float _1035 = signedFragmentRadius * blurFactorToUse;
	float _1036 = _1035 / numberOfRings_1001;
	float cocPerRing_1037 = _1036;
	float ringIndex_1039 = 0.00000000e+00;
	while (ringIndex_1039 < numberOfRings_1001)
	{
		{
			float _1050 = 6.28318548e+00 / pointsOnRing_1033;
			float anglePerPoint_1051 = _1050;
			float angle_1052 = anglePerPoint_1051;
			float _1053 = cocPerRing_1037 * ringIndex_1039;
			float ringDistance_1054 = _1053;
			float pointNumber_1056 = 0.00000000e+00;
			while (pointNumber_1056 < pointsOnRing_1033)
			{
				{
					float _1066;
					float _1067;
					_1066 = sin(angle_1052), _1067 = cos(angle_1052);
					pointOffset_1015[1] = _1066;
					pointOffset_1015[0] = _1067;
					vec2 _1069 = pointOffset_1015 * currentRingRadiusCoords_1034;
					vec2 _1071 = blurInfo.texcoord + _1069;
					vec4 _1076 = vec4(_1071.x, _1071.y, 0.00000000e+00, 0.00000000e+00);
					vec4 tapCoords_1077 = _1076;
					vec4 _1078 = textureLod(V_xCinematicDOF_xSamplerCDCoC, tapCoords_1077.xy, tapCoords_1077.w);
					float _1080 = _1078.x * radiusFactor;
					float signedSampleRadius = _1080;
					float _1082 = abs(signedSampleRadius);
					float absoluteSampleRadius = _1082;
					bool _1085 = signedSampleRadius > 0.00000000e+00;
					bool _1086 = !bool(isNearPlaneFragment);
					bool _1087 = _1085 && _1086;
					bool _1089 = signedSampleRadius <= 0.00000000e+00;
					bool _1090 = _1089 && isNearPlaneFragment;
					bool _1091 = _1087 || _1090;
					float isSamePlaneAsFragment = float(_1091);
					float _1094 = absoluteSampleRadius * blurFactorToUse;
					float _1095;
					float _1096;
					_1095 = _1094;
					_1096 = ringDistance_1054;
					float _1097 = F_xCinematicDOF_xCalculateSampleWeight(_1095, _1096);
					float _1098 = _1097 * isSamePlaneAsFragment;
					float _1099 = absoluteFragmentRadius - absoluteSampleRadius;
					bool _1101 = _1099 < 1.00000005e-03;
					float _1103 = _1098 * float(_1101);
					float weight_1104 = _1103;
					vec4 _1105 = textureLod(source, tapCoords_1077.xy, tapCoords_1077.w);
					vec3 tap_1107 = _1105.xyz;
					vec3 _1108;
					_1108 = tap_1107.xyz;
					vec3 _1110 = F_xCinematicDOF_xAccentuateWhites(_1108);
					vec3 _1112 = _1110 * vec3(weight_1104);
					vec3 _1114 = average_1013.xyz + _1112;
					average_1013.xyz = _1114;
					float _1116 = average_1013.w + weight_1104;
					average_1013[3] = _1116;
					float _1117 = angle_1052 + anglePerPoint_1051;
					angle_1052 = _1117;
				}
				float _1064 = pointNumber_1056;
				float _1065 = _1064 + 1.00000000e+00;
				pointNumber_1056 = _1065;
			}
			float _1118 = pointsOnRing_1033 + pointsFirstRing_965;
			pointsOnRing_1033 = _1118;
			vec2 _1119 = currentRingRadiusCoords_1034 + ringRadiusDeltaCoords_1032;
			currentRingRadiusCoords_1034 = _1119;
		}
		float _1047 = ringIndex_1039;
		float _1048 = _1047 + 1.00000000e+00;
		ringIndex_1039 = _1048;
	}
	bool _1122 = average_1013.w == 0.00000000e+00;
	float _1125 = average_1013.w + float(_1122);
	vec3 _1128 = average_1013.xyz / vec3(_1125);
	fragment_972.xyz = _1128;
	return fragment_972;
}
float F_xCinematicDOF_xGetBlurDiscRadiusFromSource(
	in sampler2D source,
	in vec2 texcoord,
	in bool flattenToZero)
{
	vec4 _1138 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1139 = textureLod(source, _1138.xy, _1138.w);
	float coc_1141 = _1139.x;
	bool _1143 = coc_1141 >= 0.00000000e+00;
	bool _1144 = flattenToZero && _1143;
	float _1145 = abs(coc_1141);
	float _1147 = _1144 ? 0.00000000e+00 : _1145;
	return _1147;
}
float F_xCinematicDOF_xPerformSingleValueGaussianBlur(
	in sampler2D source,
	in vec2 texcoord,
	in vec2 offsetWeight,
	in bool flattenToZero)
{
	float offset[18] = _1154;
	float weight_1157[18] = _1156;
	vec2 _1158;
	bool _1159;
	_1158 = texcoord;
	_1159 = flattenToZero;
	float _1160 = F_xCinematicDOF_xGetBlurDiscRadiusFromSource(source, _1158, _1159);
	float coc_1161 = _1160;
	float _1163 = coc_1161 * weight_1157[0];
	coc_1161 = _1163;
	vec2 _1165 = offsetWeight * vec2(V_xCinematicDOF_xNearPlaneMaxBlur);
	vec2 _1167 = _1165 * vec2(8.00000012e-01, 8.00000012e-01);
	vec2 factorToUse = _1167;
	int i_1170 = 1;
	while (i_1170 < 18)
	{
		{
			vec2 _1181 = factorToUse * vec2(offset[int(i_1170)]);
			vec2 coordOffset_1182 = _1181;
			float weightSample = weight_1157[int(i_1170)];
			vec2 _1185 = texcoord + coordOffset_1182;
			vec2 _1186;
			bool _1187;
			_1186 = _1185;
			_1187 = flattenToZero;
			float _1188 = F_xCinematicDOF_xGetBlurDiscRadiusFromSource(source, _1186, _1187);
			float _1189 = _1188 * weightSample;
			float _1190 = coc_1161 + _1189;
			coc_1161 = _1190;
			vec2 _1191 = texcoord - coordOffset_1182;
			vec2 _1192;
			bool _1193;
			_1192 = _1191;
			_1193 = flattenToZero;
			float _1194 = F_xCinematicDOF_xGetBlurDiscRadiusFromSource(source, _1192, _1193);
			float _1195 = _1194 * weightSample;
			float _1196 = coc_1161 + _1195;
			coc_1161 = _1196;
		}
		int _1179 = i_1170 + 1;
		i_1170 = _1179;
	}
	float _1197 = clamp(coc_1161, 0.0, 1.0);
	return _1197;
}
vec4 F_xCinematicDOF_xPerformFullFragmentGaussianBlur(
	in sampler2D source,
	in vec2 texcoord,
	in vec2 offsetWeight)
{
	float offset_1204[6] = _1203;
	float weight_1206[6] = _1205;
	vec4 _1211 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1212 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _1211.xy, _1211.w);
	float coc_1214 = _1212.x;
	vec4 _1219 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1220 = textureLod(source, _1219.xy, _1219.w);
	vec4 fragment_1221 = _1220;
	float _1224 = dot(fragment_1221.xyz, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	float fragmentLuma = _1224;
	vec4 originalFragment = fragment_1221;
	float _1227 = abs(coc_1214);
	float absoluteCoC = _1227;
	float _1230 = length(vec2(5.20833360e-04, 9.25925910e-04));
	float lengthPixelSize = _1230;
	bool _1236 = absoluteCoC < 2.00000003e-01;
	bool _1238 = V_xCinematicDOF_xPostBlurSmoothing < 9.99999978e-03;
	bool _1239 = _1236 || _1238;
	bool _1241 = fragmentLuma < 3.00000012e-01;
	bool _1242 = _1239 || _1241;
	if (_1242)
	{
		return fragment_1221;
	}
	vec3 _1245 = fragment_1221.xyz * vec3(weight_1206[0]);
	fragment_1221.xyz = _1245;
	vec2 _1247 = offsetWeight * vec2(V_xCinematicDOF_xPostBlurSmoothing);
	vec2 factorToUse_1248 = _1247;
	int i_1250 = 1;
	while (i_1250 < 6)
	{
		{
			vec2 _1261 = factorToUse_1248 * vec2(offset_1204[int(i_1250)]);
			vec2 coordOffset_1262 = _1261;
			float weightSample_1264 = weight_1206[int(i_1250)];
			vec2 _1265 = texcoord + coordOffset_1262;
			vec4 _1270 = vec4(_1265.x, _1265.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1271 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _1270.xy, _1270.w);
			float sampleCoC = _1271.x;
			float _1274 = abs(sampleCoC);
			bool _1276 = _1274 < 2.00000003e-01;
			float maskFactor = float(_1276);
			vec3 _1281 = originalFragment.xyz * vec3(maskFactor);
			vec3 _1283 = _1281 * vec3(weightSample_1264);
			vec2 _1284 = texcoord + coordOffset_1262;
			vec4 _1289 = vec4(_1284.x, _1284.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1290 = textureLod(source, _1289.xy, _1289.w);
			float _1292 = 1.00000000e+00 - maskFactor;
			vec3 _1295 = _1290.xyz * vec3(_1292);
			vec3 _1297 = _1295 * vec3(weightSample_1264);
			vec3 _1298 = _1283 + _1297;
			vec3 _1300 = fragment_1221.xyz + _1298;
			fragment_1221.xyz = _1300;
			vec2 _1301 = texcoord - coordOffset_1262;
			vec4 _1306 = vec4(_1301.x, _1301.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1307 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _1306.xy, _1306.w);
			sampleCoC = _1307.x;
			float _1309 = abs(sampleCoC);
			bool _1311 = _1309 < 2.00000003e-01;
			maskFactor = float(_1311);
			vec3 _1315 = originalFragment.xyz * vec3(maskFactor);
			vec3 _1317 = _1315 * vec3(weightSample_1264);
			vec2 _1318 = texcoord - coordOffset_1262;
			vec4 _1323 = vec4(_1318.x, _1318.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _1324 = textureLod(source, _1323.xy, _1323.w);
			float _1326 = 1.00000000e+00 - maskFactor;
			vec3 _1329 = _1324.xyz * vec3(_1326);
			vec3 _1331 = _1329 * vec3(weightSample_1264);
			vec3 _1332 = _1317 + _1331;
			vec3 _1334 = fragment_1221.xyz + _1332;
			fragment_1221.xyz = _1334;
		}
		int _1259 = i_1250 + 1;
		i_1250 = _1259;
	}
	vec4 _1335 = clamp(fragment_1221, 0.0, 1.0);
	return _1335;
}
void F_xCinematicDOF_xFillFocusInfoData(
	inout S_xCinematicDOF_xVSFOCUSINFO toFill)
{
	vec4 _1340 = textureLod(V_xCinematicDOF_xSamplerCDCurrentFocus, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00).xy, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00).w);
	toFill.focusDepth = _1340.x;
	float _1344 = toFill.focusDepth * 1.00000000e+03;
	toFill.focusDepthInM = _1344;
	float _1347 = toFill.focusDepthInM * 1.00000000e+03;
	toFill.focusDepthInMM = _1347;
	float _1349 = length(vec2(5.20833360e-04, 9.25925910e-04));
	toFill.pixelSizeLength = _1349;
	float _1350 = V_xCinematicDOF_xFocalLength * V_xCinematicDOF_xFocalLength;
	float _1352 = V_xCinematicDOF_xFNumber * 2.40000002e-02;
	float _1353 = _1350 / _1352;
	float hyperFocal = _1353;
	float _1356 = hyperFocal * toFill.focusDepthInMM;
	float hyperFocalFocusDepthFocus = _1356;
	float _1359 = toFill.focusDepthInMM - V_xCinematicDOF_xFocalLength;
	float _1360 = hyperFocal + _1359;
	float _1361 = hyperFocalFocusDepthFocus / _1360;
	toFill.nearPlaneInMM = _1361;
	float _1363 = toFill.focusDepthInMM - V_xCinematicDOF_xFocalLength;
	float _1364 = hyperFocal - _1363;
	float _1365 = hyperFocalFocusDepthFocus / _1364;
	toFill.farPlaneInMM = _1365;
	return;
}
vec4 F_xCinematicDOF_xSharpeningPass_BlurSample(
	in sampler2D source,
	in vec2 texcoord,
	in vec2 xoff,
	in vec2 yoff,
	in float centerCoC,
	inout vec3 minv,
	inout vec3 maxv)
{
	vec2 _1375 = texcoord + xoff;
	vec4 _1376 = texture(source, _1375);
	vec3 v11 = _1376.xyz;
	vec2 _1379 = texcoord + yoff;
	vec4 _1380 = texture(source, _1379);
	vec3 v12 = _1380.xyz;
	vec2 _1383 = texcoord - xoff;
	vec4 _1384 = texture(source, _1383);
	vec3 v21 = _1384.xyz;
	vec2 _1387 = texcoord - yoff;
	vec4 _1388 = texture(source, _1387);
	vec3 v22 = _1388.xyz;
	vec4 _1391 = texture(source, texcoord);
	vec3 center = _1391.xyz;
	vec2 _1394 = texcoord + xoff;
	vec4 _1395 = texture(V_xCinematicDOF_xSamplerCDCoC, _1394);
	float v11CoC = _1395.x;
	vec2 _1398 = texcoord + yoff;
	vec4 _1399 = texture(V_xCinematicDOF_xSamplerCDCoC, _1398);
	float v12CoC = _1399.x;
	vec2 _1402 = texcoord - xoff;
	vec4 _1403 = texture(V_xCinematicDOF_xSamplerCDCoC, _1402);
	float v21CoC = _1403.x;
	vec2 _1406 = texcoord - yoff;
	vec4 _1407 = texture(V_xCinematicDOF_xSamplerCDCoC, _1406);
	float v22CoC = _1407.x;
	float _1410 = sign(centerCoC);
	float _1411 = sign(v11CoC);
	bool _1412 = _1410 == _1411;
	float _1415 = _1412 ? 1.00000000e+00 : 0.00000000e+00;
	float accepted = _1415;
	float _1417 = sign(centerCoC);
	float _1418 = sign(v12CoC);
	bool _1419 = _1417 == _1418;
	float _1422 = _1419 ? 1.00000000e+00 : 0.00000000e+00;
	float _1423 = accepted + _1422;
	accepted = _1423;
	float _1424 = sign(centerCoC);
	float _1425 = sign(v21CoC);
	bool _1426 = _1424 == _1425;
	float _1429 = _1426 ? 1.00000000e+00 : 0.00000000e+00;
	float _1430 = accepted + _1429;
	accepted = _1430;
	float _1431 = sign(centerCoC);
	float _1432 = sign(v22CoC);
	bool _1433 = _1431 == _1432;
	float _1436 = _1433 ? 1.00000000e+00 : 0.00000000e+00;
	float _1437 = accepted + _1436;
	accepted = _1437;
	vec3 _1438 = min(minv, v11);
	minv = _1438;
	vec3 _1439 = min(minv, v12);
	minv = _1439;
	vec3 _1440 = min(minv, v21);
	minv = _1440;
	vec3 _1441 = min(minv, v22);
	minv = _1441;
	vec3 _1442 = max(maxv, v11);
	maxv = _1442;
	vec3 _1443 = max(maxv, v12);
	maxv = _1443;
	vec3 _1444 = max(maxv, v21);
	maxv = _1444;
	vec3 _1445 = max(maxv, v22);
	maxv = _1445;
	vec3 _1446 = v11 + v12;
	vec3 _1447 = _1446 + v21;
	vec3 _1448 = _1447 + v22;
	vec3 _1450 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * center;
	vec3 _1451 = _1448 + _1450;
	vec3 _1453 = _1451 * vec3(1.66666999e-01, 1.66666999e-01, 1.66666999e-01);
	vec4 _1457 = vec4(_1453.x, _1453.y, _1453.z, accepted);
	return _1457;
}
vec3 F_xCinematicDOF_xSharpeningPass_EdgeStrength(
	in vec3 fragment,
	in sampler2D source,
	in vec2 texcoord,
	in float sharpeningFactor)
{
	vec2 offset_1465 = vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _1468 = vec2(0.00000000e+00, offset_1465.y);
	vec2 _1470 = _1468 * vec2(5.00000000e-01, 5.00000000e-01);
	vec2 up = _1470;
	vec2 _1474 = vec2(offset_1465.x, 0.00000000e+00);
	vec2 _1476 = _1474 * vec2(5.00000000e-01, 5.00000000e-01);
	vec2 right = _1476;
	vec3 minv_1479 = vec3(1.00000000e+09, 1.00000000e+09, 1.00000000e+09);
	vec3 maxv_1481 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _1482 = texture(V_xCinematicDOF_xSamplerCDCoC, texcoord);
	float centerCoC_1484 = _1482.x;
	vec2 _1485 = texcoord + up;
	vec2 _1486;
	vec2 _1487;
	vec2 _1488;
	float _1489;
	vec3 _1490;
	vec3 _1491;
	_1486 = _1485;
	_1487 = right;
	_1488 = up;
	_1489 = centerCoC_1484;
	_1490 = minv_1479;
	_1491 = maxv_1481;
	vec4 _1492 = F_xCinematicDOF_xSharpeningPass_BlurSample(source, _1486, _1487, _1488, _1489, _1490, _1491);
	minv_1479 = _1490;
	maxv_1481 = _1491;
	vec4 v12_1493 = _1492;
	vec2 _1494 = texcoord - right;
	vec2 _1495;
	vec2 _1496;
	vec2 _1497;
	float _1498;
	vec3 _1499;
	vec3 _1500;
	_1495 = _1494;
	_1496 = right;
	_1497 = up;
	_1498 = centerCoC_1484;
	_1499 = minv_1479;
	_1500 = maxv_1481;
	vec4 _1501 = F_xCinematicDOF_xSharpeningPass_BlurSample(source, _1495, _1496, _1497, _1498, _1499, _1500);
	minv_1479 = _1499;
	maxv_1481 = _1500;
	vec4 v21_1502 = _1501;
	vec2 _1503;
	vec2 _1504;
	vec2 _1505;
	float _1506;
	vec3 _1507;
	vec3 _1508;
	_1503 = texcoord;
	_1504 = right;
	_1505 = up;
	_1506 = centerCoC_1484;
	_1507 = minv_1479;
	_1508 = maxv_1481;
	vec4 _1509 = F_xCinematicDOF_xSharpeningPass_BlurSample(source, _1503, _1504, _1505, _1506, _1507, _1508);
	minv_1479 = _1507;
	maxv_1481 = _1508;
	vec4 v22_1510 = _1509;
	vec2 _1511 = texcoord + right;
	vec2 _1512;
	vec2 _1513;
	vec2 _1514;
	float _1515;
	vec3 _1516;
	vec3 _1517;
	_1512 = _1511;
	_1513 = right;
	_1514 = up;
	_1515 = centerCoC_1484;
	_1516 = minv_1479;
	_1517 = maxv_1481;
	vec4 _1518 = F_xCinematicDOF_xSharpeningPass_BlurSample(source, _1512, _1513, _1514, _1515, _1516, _1517);
	minv_1479 = _1516;
	maxv_1481 = _1517;
	vec4 v23 = _1518;
	vec2 _1520 = texcoord - up;
	vec2 _1521;
	vec2 _1522;
	vec2 _1523;
	float _1524;
	vec3 _1525;
	vec3 _1526;
	_1521 = _1520;
	_1522 = right;
	_1523 = up;
	_1524 = centerCoC_1484;
	_1525 = minv_1479;
	_1526 = maxv_1481;
	vec4 _1527 = F_xCinematicDOF_xSharpeningPass_BlurSample(source, _1521, _1522, _1523, _1524, _1525, _1526);
	minv_1479 = _1525;
	maxv_1481 = _1526;
	vec4 v32 = _1527;
	float _1531 = v12_1493.w + v21_1502.w;
	float _1533 = _1531 + v23.w;
	float _1535 = _1533 + v32.w;
	float accepted_1536 = _1535;
	bool _1541 = accepted_1536 < 1.55000000e+01;
	if (_1541)
	{
		return fragment;
	}
	vec3 _1544 = v12_1493.xyz + v21_1502.xyz;
	vec3 _1547 = v22_1510.xyz * vec3(-4.00000000e+00, -4.00000000e+00, -4.00000000e+00);
	vec3 _1548 = _1544 + _1547;
	vec3 _1550 = _1548 + v23.xyz;
	vec3 _1552 = _1550 + v32.xyz;
	vec3 laplacian_of_g = _1552;
	vec3 _1556 = laplacian_of_g.xyz * vec3(sharpeningFactor);
	vec3 _1557 = fragment - _1556;
	vec3 _1558 = clamp(_1557, minv_1479, maxv_1481);
	return _1558;
}
S_xCinematicDOF_xVSFOCUSINFO F_xCinematicDOF_xVS_Focus(
	in uint id)
{
	S_xCinematicDOF_xVSFOCUSINFO focusInfo_1563 = _1562;
	bool _1565 = id == 2u;
	float _1568 = _1565 ? 2.00000000e+00 : 0.00000000e+00;
	focusInfo_1563.texcoord[0] = _1568;
	bool _1570 = id == 1u;
	float _1573 = _1570 ? 2.00000000e+00 : 0.00000000e+00;
	focusInfo_1563.texcoord[1] = _1573;
	vec2 _1576 = focusInfo_1563.texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1578 = _1576 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1583 = vec4(_1578.x, _1578.y, 0.00000000e+00, 1.00000000e+00);
	focusInfo_1563.vpos = _1583;
	S_xCinematicDOF_xVSFOCUSINFO _1584;
	_1584 = focusInfo_1563;
	F_xCinematicDOF_xFillFocusInfoData(_1584);
	focusInfo_1563 = _1584;
	return focusInfo_1563;
}
S_xCinematicDOF_xVSDISCBLURINFO F_xCinematicDOF_xVS_DiscBlur(
	in uint id)
{
	S_xCinematicDOF_xVSDISCBLURINFO blurInfo_1590 = _1589;
	bool _1592 = id == 2u;
	float _1595 = _1592 ? 2.00000000e+00 : 0.00000000e+00;
	blurInfo_1590.texcoord[0] = _1595;
	bool _1597 = id == 1u;
	float _1600 = _1597 ? 2.00000000e+00 : 0.00000000e+00;
	blurInfo_1590.texcoord[1] = _1600;
	vec2 _1603 = blurInfo_1590.texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1605 = _1603 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1610 = vec4(_1605.x, _1605.y, 0.00000000e+00, 1.00000000e+00);
	blurInfo_1590.vpos = _1610;
	float _1611 = round(V_xCinematicDOF_xBlurQuality);
	blurInfo_1590.numberOfRings = _1611;
	float _1613 = length(vec2(5.20833360e-04, 9.25925910e-04));
	float pixelSizeLength = _1613;
	float _1616 = V_xCinematicDOF_xFarPlaneMaxBlur / 1.00000000e+02;
	float _1617 = _1616 / pixelSizeLength;
	blurInfo_1590.farPlaneMaxBlurInPixels = _1617;
	float _1619 = V_xCinematicDOF_xNearPlaneMaxBlur / 1.00000000e+02;
	float _1620 = _1619 / pixelSizeLength;
	blurInfo_1590.nearPlaneMaxBlurInPixels = _1620;
	float _1622 = length(vec2(5.20833360e-04, 9.25925910e-04));
	float _1624 = _1622 * blurInfo_1590.farPlaneMaxBlurInPixels;
	blurInfo_1590.cocFactorPerPixel = _1624;
	return blurInfo_1590;
}
void F_xCinematicDOF_xPS_DetermineCurrentFocus(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec2 _1631 = V_xCinematicDOF_xMouseCoords * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _1633 = compCond(bvec2(V_xCinematicDOF_xUseMouseDrivenAutoFocus), _1631, V_xCinematicDOF_xAutoFocusPoint);
	vec2 autoFocusPointToUse = _1633;
	vec4 _1636 = texture(V_xCinematicDOF_xSamplerCDPreviousFocus, vec2(0.00000000e+00, 0.00000000e+00));
	vec2 _1637;
	_1637 = autoFocusPointToUse;
	float _1638 = F_xReShade_xGetLinearizedDepth(_1637);
	float _1640 = mix(_1636.x, _1638, V_xCinematicDOF_xAutoFocusTransitionSpeed);
	float _1642 = V_xCinematicDOF_xManualFocusPlane / 1.00000000e+03;
	float _1643 = V_xCinematicDOF_xUseAutoFocus ? _1640 : _1642;
	fragment = _1643;
	return;
}
void F_xCinematicDOF_xPS_CopyCurrentFocus(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec4 _1650 = texture(V_xCinematicDOF_xSamplerCDCurrentFocus, vec2(0.00000000e+00, 0.00000000e+00));
	fragment = _1650.x;
	return;
}
void F_xCinematicDOF_xPS_CalculateCoCValues(
	in S_xCinematicDOF_xVSFOCUSINFO focusInfo,
	out float fragment)
{
	S_xCinematicDOF_xVSFOCUSINFO _1656;
	_1656 = focusInfo;
	float _1657 = F_xCinematicDOF_xCalculateBlurDiscSize(_1656);
	fragment = _1657;
	return;
}
void F_xCinematicDOF_xPS_PreBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	out vec4 fragment)
{
	S_xCinematicDOF_xVSDISCBLURINFO _1662;
	_1662 = blurInfo;
	vec4 _1663 = F_xCinematicDOF_xPerformPreDiscBlur(_1662, V_xReShade_xBackBuffer);
	fragment = _1663;
	return;
}
void F_xCinematicDOF_xPS_BokehBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	out vec4 fragment)
{
	bool _1669 = V_xCinematicDOF_xHighlightShape > 0;
	bool useShape_1670 = _1669;
	if (useShape_1670)
	{
		switch (V_xCinematicDOF_xHighlightShape)
		{
		case 1: {
			S_xCinematicDOF_xVSDISCBLURINFO _1676;
			_1676 = blurInfo;
			vec4 _1677 = F_xCinematicDOF_xPerformDiscBlur(_1676, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape1);
			fragment = _1677;
			break;
		}
		case 2: {
			S_xCinematicDOF_xVSDISCBLURINFO _1679;
			_1679 = blurInfo;
			vec4 _1680 = F_xCinematicDOF_xPerformDiscBlur(_1679, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape2);
			fragment = _1680;
			break;
		}
		case 3: {
			S_xCinematicDOF_xVSDISCBLURINFO _1682;
			_1682 = blurInfo;
			vec4 _1683 = F_xCinematicDOF_xPerformDiscBlur(_1682, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape3);
			fragment = _1683;
			break;
		}
		case 4: {
			S_xCinematicDOF_xVSDISCBLURINFO _1685;
			_1685 = blurInfo;
			vec4 _1686 = F_xCinematicDOF_xPerformDiscBlur(_1685, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape4);
			fragment = _1686;
			break;
		}
		case 5: {
			S_xCinematicDOF_xVSDISCBLURINFO _1688;
			_1688 = blurInfo;
			vec4 _1689 = F_xCinematicDOF_xPerformDiscBlur(_1688, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape5);
			fragment = _1689;
			break;
		}
		case 6: {
			S_xCinematicDOF_xVSDISCBLURINFO _1691;
			_1691 = blurInfo;
			vec4 _1692 = F_xCinematicDOF_xPerformDiscBlur(_1691, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape6);
			fragment = _1692;
			break;
		}
		}
	}
	else
	{
		S_xCinematicDOF_xVSDISCBLURINFO _1693;
		_1693 = blurInfo;
		vec4 _1694 = F_xCinematicDOF_xPerformDiscBlur(_1693, V_xCinematicDOF_xSamplerCDBuffer1, V_xCinematicDOF_xSamplerCDBokehShape1);
		fragment = _1694;
	}
	return;
}
void F_xCinematicDOF_xPS_NearBokehBlur(
	in S_xCinematicDOF_xVSDISCBLURINFO blurInfo,
	out vec4 fragment)
{
	bool _1700 = V_xCinematicDOF_xHighlightShape > 0;
	bool useShape_1701 = _1700;
	if (useShape_1701)
	{
		switch (V_xCinematicDOF_xHighlightShape)
		{
		case 1: {
			S_xCinematicDOF_xVSDISCBLURINFO _1707;
			_1707 = blurInfo;
			vec4 _1708 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1707, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape1);
			fragment = _1708;
			break;
		}
		case 2: {
			S_xCinematicDOF_xVSDISCBLURINFO _1710;
			_1710 = blurInfo;
			vec4 _1711 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1710, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape2);
			fragment = _1711;
			break;
		}
		case 3: {
			S_xCinematicDOF_xVSDISCBLURINFO _1713;
			_1713 = blurInfo;
			vec4 _1714 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1713, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape3);
			fragment = _1714;
			break;
		}
		case 4: {
			S_xCinematicDOF_xVSDISCBLURINFO _1716;
			_1716 = blurInfo;
			vec4 _1717 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1716, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape4);
			fragment = _1717;
			break;
		}
		case 5: {
			S_xCinematicDOF_xVSDISCBLURINFO _1719;
			_1719 = blurInfo;
			vec4 _1720 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1719, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape5);
			fragment = _1720;
			break;
		}
		case 6: {
			S_xCinematicDOF_xVSDISCBLURINFO _1722;
			_1722 = blurInfo;
			vec4 _1723 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1722, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape6);
			fragment = _1723;
			break;
		}
		}
	}
	else
	{
		S_xCinematicDOF_xVSDISCBLURINFO _1724;
		_1724 = blurInfo;
		vec4 _1725 = F_xCinematicDOF_xPerformNearPlaneDiscBlur(_1724, V_xCinematicDOF_xSamplerCDBuffer2, V_xCinematicDOF_xSamplerCDBokehShape1);
		fragment = _1725;
	}
	return;
}
void F_xCinematicDOF_xPS_CoCTile1(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec2 _1731;
	_1731 = texcoord;
	float _1732 = F_xCinematicDOF_xPerformTileGatherHorizontal(V_xCinematicDOF_xSamplerCDCoC, _1731);
	fragment = _1732;
	return;
}
void F_xCinematicDOF_xPS_CoCTile2(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec2 _1738;
	_1738 = texcoord;
	float _1739 = F_xCinematicDOF_xPerformTileGatherVertical(V_xCinematicDOF_xSamplerCDCoCTileTmp, _1738);
	fragment = _1739;
	return;
}
void F_xCinematicDOF_xPS_CoCTileNeighbor(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec2 _1745;
	_1745 = texcoord;
	float _1746 = F_xCinematicDOF_xPerformNeighborTileGather(V_xCinematicDOF_xSamplerCDCoCTile, _1745);
	fragment = _1746;
	return;
}
void F_xCinematicDOF_xPS_CoCGaussian1(
	in vec4 vpos,
	in vec2 texcoord,
	out float fragment)
{
	vec2 _1752;
	vec2 _1753;
	bool _1754;
	_1752 = texcoord;
	_1753 = vec2(5.20833360e-04, 0.00000000e+00);
	_1754 = true;
	float _1757 = F_xCinematicDOF_xPerformSingleValueGaussianBlur(V_xCinematicDOF_xSamplerCDCoCTileNeighbor, _1752, _1753, _1754);
	fragment = _1757;
	return;
}
void F_xCinematicDOF_xPS_CoCGaussian2(
	in vec4 vpos,
	in vec2 texcoord,
	out vec2 fragment)
{
	vec2 _1763;
	vec2 _1764;
	bool _1765;
	_1763 = texcoord;
	_1764 = vec2(0.00000000e+00, 8.33333295e-04);
	_1765 = false;
	float _1768 = F_xCinematicDOF_xPerformSingleValueGaussianBlur(V_xCinematicDOF_xSamplerCDCoCTmp1, _1763, _1764, _1765);
	vec4 _1769 = texture(V_xCinematicDOF_xSamplerCDCoCTileNeighbor, texcoord);
	vec2 _1771 = vec2(_1768, _1769.x);
	fragment = _1771;
	return;
}
void F_xCinematicDOF_xPS_Combiner(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec4 _1777 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 originalFragment_1778 = _1777;
	vec3 _1779;
	_1779 = originalFragment_1778.xyz;
	vec3 _1781 = F_xCinematicDOF_xAccentuateWhites(_1779);
	originalFragment_1778.xyz = _1781;
	vec4 _1782 = texture(V_xCinematicDOF_xSamplerCDBuffer3, texcoord);
	vec4 farFragment = _1782;
	vec4 _1784 = texture(V_xCinematicDOF_xSamplerCDBuffer1, texcoord);
	vec4 nearFragment = _1784;
	vec4 _1786 = texture(V_xCinematicDOF_xSamplerCDCoC, texcoord);
	float pixelCoC = _1786.x;
	float _1791 = clamp(0.00000000e+00, 1.00000000e+00, V_xCinematicDOF_xFarPlaneMaxBlur);
	float _1792 = pixelCoC * _1791;
	float realCoC = _1792;
	bool _1798 = V_xCinematicDOF_xHighlightSharpeningFactor > 0.00000000e+00;
	if (_1798)
	{
		float _1799 = abs(pixelCoC);
		float _1801 = _1799 * 8.00000000e+01;
		float _1802 = _1801 * V_xCinematicDOF_xHighlightSharpeningFactor;
		float sharpeningFactor_1803 = _1802;
		float _1804 = sharpeningFactor_1803 * realCoC;
		vec3 _1805;
		vec2 _1806;
		float _1807;
		_1805 = farFragment.xyz;
		_1806 = texcoord;
		_1807 = _1804;
		vec3 _1809 = F_xCinematicDOF_xSharpeningPass_EdgeStrength(_1805, V_xCinematicDOF_xSamplerCDBuffer3, _1806, _1807);
		farFragment.xyz = _1809;
		float _1810 = abs(pixelCoC);
		float _1813 = clamp(0.00000000e+00, 1.00000000e+00, V_xCinematicDOF_xNearPlaneMaxBlur);
		float _1814 = _1810 * _1813;
		float _1815 = sharpeningFactor_1803 * _1814;
		vec3 _1816;
		vec2 _1817;
		float _1818;
		_1816 = nearFragment.xyz;
		_1817 = texcoord;
		_1818 = _1815;
		vec3 _1820 = F_xCinematicDOF_xSharpeningPass_EdgeStrength(_1816, V_xCinematicDOF_xSamplerCDBuffer1, _1817, _1818);
		nearFragment.xyz = _1820;
	}
	bool _1822 = realCoC > 1.00000001e-01;
	float _1824 = realCoC / 1.00000001e-01;
	float _1827 = smoothstep(0.00000000e+00, 1.00000000e+00, _1824);
	float _1829 = _1822 ? 1.00000000e+00 : _1827;
	float blendFactor = _1829;
	vec4 _1832 = mix(originalFragment_1778, farFragment, vec4(blendFactor));
	fragment = _1832;
	bool _1834 = V_xCinematicDOF_xNearPlaneMaxBlur != 0.00000000e+00;
	float _1837 = nearFragment.w * float(_1834);
	vec3 _1841 = mix(fragment.xyz, nearFragment.xyz, vec3(_1837));
	fragment.xyz = _1841;
	vec3 _1842;
	_1842 = fragment.xyz;
	vec3 _1844 = F_xCinematicDOF_xCorrectForWhiteAccentuation(_1842);
	fragment.xyz = _1844;
	fragment[3] = 1.00000000e+00;
	return;
}
void F_xCinematicDOF_xPS_TentFilter(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec4 coord = vec4(5.20833360e-04, 9.25925910e-04, -5.20833360e-04, 0.00000000e+00);
	vec4 average_1854 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _1856 = texcoord - coord.xy;
	vec4 _1857 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1856);
	average_1854 = _1857;
	vec2 _1859 = texcoord - coord.wy;
	vec4 _1860 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1859);
	vec4 _1862 = _1860 * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _1863 = average_1854 + _1862;
	average_1854 = _1863;
	vec2 _1865 = texcoord - coord.zy;
	vec4 _1866 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1865);
	vec4 _1867 = average_1854 + _1866;
	average_1854 = _1867;
	vec2 _1869 = texcoord + coord.zw;
	vec4 _1870 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1869);
	vec4 _1872 = _1870 * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _1873 = average_1854 + _1872;
	average_1854 = _1873;
	vec4 _1874 = texture(V_xCinematicDOF_xSamplerCDBuffer2, texcoord);
	vec4 _1876 = _1874 * vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec4 _1877 = average_1854 + _1876;
	average_1854 = _1877;
	vec2 _1879 = texcoord + coord.xw;
	vec4 _1880 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1879);
	vec4 _1882 = _1880 * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _1883 = average_1854 + _1882;
	average_1854 = _1883;
	vec2 _1885 = texcoord + coord.zy;
	vec4 _1886 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1885);
	vec4 _1887 = average_1854 + _1886;
	average_1854 = _1887;
	vec2 _1889 = texcoord + coord.wy;
	vec4 _1890 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1889);
	vec4 _1892 = _1890 * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _1893 = average_1854 + _1892;
	average_1854 = _1893;
	vec2 _1895 = texcoord + coord.xy;
	vec4 _1896 = texture(V_xCinematicDOF_xSamplerCDBuffer2, _1895);
	vec4 _1897 = average_1854 + _1896;
	average_1854 = _1897;
	vec4 _1899 = average_1854 / vec4(1.60000000e+01, 1.60000000e+01, 1.60000000e+01, 1.60000000e+01);
	fragment = _1899;
	return;
}
void F_xCinematicDOF_xPS_PostSmoothing1(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec2 _1905;
	vec2 _1906;
	_1905 = texcoord;
	_1906 = vec2(5.20833360e-04, 0.00000000e+00);
	vec4 _1908 = F_xCinematicDOF_xPerformFullFragmentGaussianBlur(V_xCinematicDOF_xSamplerCDBuffer4, _1905, _1906);
	fragment = _1908;
	return;
}
void F_xCinematicDOF_xPS_PostSmoothing2AndFocusing(
	in S_xCinematicDOF_xVSFOCUSINFO focusInfo,
	out vec4 fragment)
{
	if (V_xCinematicDOF_xShowCoCValues)
	{
		vec4 _1917 = texture(V_xCinematicDOF_xSamplerCDCoC, focusInfo.texcoord);
		float _1918;
		bool _1919;
		_1918 = _1917.x;
		_1919 = true;
		vec4 _1922 = F_xCinematicDOF_xGetDebugFragment(_1918, _1919);
		fragment = _1922;
		return;
	}
	vec2 _1923;
	vec2 _1924;
	_1923 = focusInfo.texcoord;
	_1924 = vec2(0.00000000e+00, 9.25925910e-04);
	vec4 _1927 = F_xCinematicDOF_xPerformFullFragmentGaussianBlur(V_xCinematicDOF_xSamplerCDBuffer5, _1923, _1924);
	fragment = _1927;
	vec4 _1929 = texture(V_xCinematicDOF_xSamplerCDBuffer4, focusInfo.texcoord);
	vec4 originalFragment_1930 = _1929;
	vec2 uv = vec2(3.75000000e+00, 2.10937500e+00);
	vec2 _1935 = uv.xy * focusInfo.texcoord.xy;
	uv.xy = _1935;
	vec4 _1936 = texture(V_xCinematicDOF_xSamplerCDNoise, uv);
	float noise = _1936.x;
	float _1941 = mix(-1.96078443e-03, 1.96078443e-03, noise);
	vec3 _1944 = fragment.xyz + vec3(_1941);
	vec3 _1945 = clamp(_1944, 0.0, 1.0);
	fragment.xyz = _1945;
	vec4 _1950 = vec4(focusInfo.texcoord.x, focusInfo.texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1951 = textureLod(V_xCinematicDOF_xSamplerCDCoC, _1950.xy, _1950.w);
	float _1953 = abs(_1951.x);
	float coc_1954 = _1953;
	float _1956 = length(vec2(5.20833360e-04, 9.25925910e-04));
	bool _1957 = coc_1954 < _1956;
	float _1959 = 4.00000000e+00 * coc_1954;
	float _1961 = _1957 ? 0.00000000e+00 : _1959;
	float _1962 = clamp(_1961, 0.0, 1.0);
	vec3 _1966 = mix(originalFragment_1930.xyz, fragment.xyz, vec3(_1962));
	fragment.xyz = _1966;
	fragment[3] = 1.00000000e+00;
	bool _1971 = V_xCinematicDOF_xShowOutOfFocusPlaneOnMouseDown && V_xCinematicDOF_xLeftMouseDown;
	if (_1971)
	{
		vec2 _1972;
		_1972 = focusInfo.texcoord;
		float _1974 = F_xReShade_xGetLinearizedDepth(_1972);
		float _1976 = _1974 * 1.00000000e+03;
		float _1978 = _1976 * 1.00000000e+03;
		float depthPixelInMM = _1978;
		vec4 colorToBlend = fragment;
		bool _1985 = depthPixelInMM < focusInfo.nearPlaneInMM;
		bool _1988 = focusInfo.farPlaneInMM > 0.00000000e+00;
		bool _1990 = depthPixelInMM > focusInfo.farPlaneInMM;
		bool _1991 = _1988 && _1990;
		bool _1992 = _1985 || _1991;
		if (_1992)
		{
			vec4 _1997 = vec4(V_xCinematicDOF_xOutOfFocusPlaneColor.x, V_xCinematicDOF_xOutOfFocusPlaneColor.y, V_xCinematicDOF_xOutOfFocusPlaneColor.z, 1.00000000e+00);
			colorToBlend = _1997;
		}
		else
		{
			float _2001 = abs(coc_1954);
			bool _2003 = _2001 < focusInfo.pixelSizeLength;
			if (_2003)
			{
				vec4 _2008 = vec4(V_xCinematicDOF_xFocusPlaneColor.x, V_xCinematicDOF_xFocusPlaneColor.y, V_xCinematicDOF_xFocusPlaneColor.z, 1.00000000e+00);
				colorToBlend = _2008;
			}
		}
		vec4 _2010 = mix(fragment, colorToBlend, vec4(V_xCinematicDOF_xOutOfFocusPlaneColorTransparency));
		fragment = _2010;
		if (V_xCinematicDOF_xUseAutoFocus)
		{
			vec2 _2015 = V_xCinematicDOF_xMouseCoords * vec2(5.20833360e-04, 9.25925910e-04);
			vec2 _2017 = compCond(bvec2(V_xCinematicDOF_xUseMouseDrivenAutoFocus), _2015, V_xCinematicDOF_xAutoFocusPoint);
			vec2 focusPointCoords = _2017;
			vec2 _2021 = vec2(focusPointCoords.x, focusInfo.texcoord.y);
			vec2 _2023 = focusInfo.texcoord - _2021;
			float _2024 = length(_2023);
			float _2026 = -1.92000000e+03 * _2024;
			float _2027 = exp(_2026);
			float _2028 = clamp(_2027, 0.0, 1.0);
			float _2030 = V_xCinematicDOF_xFocusCrosshairColor.w * _2028;
			vec4 _2032 = mix(fragment, V_xCinematicDOF_xFocusCrosshairColor, vec4(_2030));
			fragment = _2032;
			vec2 _2035 = vec2(focusInfo.texcoord.x, focusPointCoords.y);
			vec2 _2037 = focusInfo.texcoord - _2035;
			float _2038 = length(_2037);
			float _2040 = -1.08000000e+03 * _2038;
			float _2041 = exp(_2040);
			float _2042 = clamp(_2041, 0.0, 1.0);
			float _2044 = V_xCinematicDOF_xFocusCrosshairColor.w * _2042;
			vec4 _2046 = mix(fragment, V_xCinematicDOF_xFocusCrosshairColor, vec4(_2044));
			fragment = _2046;
		}
	}
	return;
}
#ifdef E_xPostProcessVS
out vec2 vv_0;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 texcoord;
	F_xPostProcessVS(id, position, texcoord);
	gl_Position = position;
	vv_0 = texcoord;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_DetermineCurrentFocus
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_DetermineCurrentFocus(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CopyCurrentFocus
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_CopyCurrentFocus(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xVS_Focus
out vec2 vv_0;
out float vv_1;
out float vv_2;
out float vv_3;
out float vv_4;
out float vv_5;
out float vv_6;
void main()
{
	uint id = uint(gl_VertexID);
	S_xCinematicDOF_xVSFOCUSINFO _return = F_xCinematicDOF_xVS_Focus(id);
	gl_Position = _return.vpos;
	vv_0 = _return.texcoord;
	vv_1 = _return.focusDepth;
	vv_2 = _return.focusDepthInM;
	vv_3 = _return.focusDepthInMM;
	vv_4 = _return.pixelSizeLength;
	vv_5 = _return.nearPlaneInMM;
	vv_6 = _return.farPlaneInMM;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CalculateCoCValues
in vec2 vv_0;
in float vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in float vv_5;
in float vv_6;
out float vv_0;
void main()
{
	S_xCinematicDOF_xVSFOCUSINFO _in_focusInfo = S_xCinematicDOF_xVSFOCUSINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6);
	S_xCinematicDOF_xVSFOCUSINFO focusInfo = _in_focusInfo;
	float fragment;
	F_xCinematicDOF_xPS_CalculateCoCValues(focusInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CoCTile1
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_CoCTile1(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CoCTile2
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_CoCTile2(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CoCTileNeighbor
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_CoCTileNeighbor(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CoCGaussian1
in vec2 vv_0;
out float vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	float fragment;
	F_xCinematicDOF_xPS_CoCGaussian1(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_CoCGaussian2
in vec2 vv_0;
out vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec2 fragment;
	F_xCinematicDOF_xPS_CoCGaussian2(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xVS_DiscBlur
out vec2 vv_0;
out float vv_1;
out float vv_2;
out float vv_3;
out float vv_4;
out float vv_5;
void main()
{
	uint id = uint(gl_VertexID);
	S_xCinematicDOF_xVSDISCBLURINFO _return = F_xCinematicDOF_xVS_DiscBlur(id);
	gl_Position = _return.vpos;
	vv_0 = _return.texcoord;
	vv_1 = _return.numberOfRings;
	vv_2 = _return.farPlaneMaxBlurInPixels;
	vv_3 = _return.nearPlaneMaxBlurInPixels;
	vv_4 = _return.cocFactorPerPixel;
	vv_5 = _return.highlightBoostFactor;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_PreBlur
in vec2 vv_0;
in float vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in float vv_5;
out vec4 vv_0;
void main()
{
	S_xCinematicDOF_xVSDISCBLURINFO _in_blurInfo = S_xCinematicDOF_xVSDISCBLURINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5);
	S_xCinematicDOF_xVSDISCBLURINFO blurInfo = _in_blurInfo;
	vec4 fragment;
	F_xCinematicDOF_xPS_PreBlur(blurInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_BokehBlur
in vec2 vv_0;
in float vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in float vv_5;
out vec4 vv_0;
void main()
{
	S_xCinematicDOF_xVSDISCBLURINFO _in_blurInfo = S_xCinematicDOF_xVSDISCBLURINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5);
	S_xCinematicDOF_xVSDISCBLURINFO blurInfo = _in_blurInfo;
	vec4 fragment;
	F_xCinematicDOF_xPS_BokehBlur(blurInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_NearBokehBlur
in vec2 vv_0;
in float vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in float vv_5;
out vec4 vv_0;
void main()
{
	S_xCinematicDOF_xVSDISCBLURINFO _in_blurInfo = S_xCinematicDOF_xVSDISCBLURINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5);
	S_xCinematicDOF_xVSDISCBLURINFO blurInfo = _in_blurInfo;
	vec4 fragment;
	F_xCinematicDOF_xPS_NearBokehBlur(blurInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_TentFilter
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xCinematicDOF_xPS_TentFilter(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_Combiner
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xCinematicDOF_xPS_Combiner(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_PostSmoothing1
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xCinematicDOF_xPS_PostSmoothing1(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xCinematicDOF_xPS_PostSmoothing2AndFocusing
in vec2 vv_0;
in float vv_1;
in float vv_2;
in float vv_3;
in float vv_4;
in float vv_5;
in float vv_6;
out vec4 vv_0;
void main()
{
	S_xCinematicDOF_xVSFOCUSINFO _in_focusInfo = S_xCinematicDOF_xVSFOCUSINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4, vv_5, vv_6);
	S_xCinematicDOF_xVSFOCUSINFO focusInfo = _in_focusInfo;
	vec4 fragment;
	F_xCinematicDOF_xPS_PostSmoothing2AndFocusing(focusInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
