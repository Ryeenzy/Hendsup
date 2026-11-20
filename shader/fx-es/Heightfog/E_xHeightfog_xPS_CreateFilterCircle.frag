#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xHeightfog_xPS_CreateFilterCircle
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
uniform vec3 V_xHeightfog_xFogColor;
uniform float V_xHeightfog_xFogDensity;
uniform float V_xHeightfog_xOveralFogDensityMax;
uniform float V_xHeightfog_xFogStart;
uniform float V_xHeightfog_xFogCurve;
uniform float V_xHeightfog_xFoV;
uniform vec2 V_xHeightfog_xPlaneOrientation;
uniform float V_xHeightfog_xPlaneZ;
uniform bool V_xHeightfog_xEvenlyDistributeFog;
uniform bool V_xHeightfog_xMovingFog;
uniform float V_xHeightfog_xMovementSpeed;
uniform float V_xHeightfog_xFogCloudScaleMax;
uniform float V_xHeightfog_xFogCloudScaleVertical;
uniform float V_xHeightfog_xFogCloudScaleHorizontal;
uniform float V_xHeightfog_xFogCloudFactor;
uniform vec2 V_xHeightfog_xFogCloudOffset;
uniform vec2 V_xHeightfog_xFogMaxOffset;
uniform bool V_xHeightfog_xUseFilterCircle;
uniform bool V_xHeightfog_xFocusPointViewFilterCircleOnMouseDown;
uniform vec2 V_xHeightfog_xFilterCircleCenterPoint;
uniform float V_xHeightfog_xFilterCircleRadius;
uniform vec2 V_xHeightfog_xFilterCircleDeformFactors;
uniform float V_xHeightfog_xFilterCircleRotationFactor;
uniform float V_xHeightfog_xFilterCircleFeather;
uniform float V_xHeightfog_xtimer;
uniform bool V_xHeightfog_xLeftMouseDown;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xHeightfog_xSamplerFogNoise;
uniform sampler2D V_xHeightfog_xsamplerFilterCircle;
struct S_xHeightfog_xVSPIXELINFO
{
	vec4 vpos;
	vec2 texCoords;
	mat2x2 rotationMatrix;
	vec2 centerDisplacementDelta;
	float featherRadius;
};
S_xHeightfog_xVSPIXELINFO _138;
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
vec3 F_xHeightfog_xuvToProj(
	in vec2 uv,
	in float z)
{
	float _96 = radians(V_xHeightfog_xFoV);
	float _98 = _96 * 5.00000000e-01;
	float _99 = tan(_98);
	vec2 _101 = -(vec2(_99));
	vec3 _105 = vec3(_101.x, _101.y, 1.00000000e+00);
	vec3 _107 = _105 * vec3(1.77777779e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 uvtoprojADD = _107;
	vec2 _111 = vec2(-2.00000000e+00, -2.00000000e+00) * uvtoprojADD.xy;
	vec3 _115 = vec3(_111.x, _111.y, 0.00000000e+00);
	vec3 uvtoprojMUL = _115;
	vec3 _118 = uv.xyx * uvtoprojMUL;
	vec3 _119 = _118 + uvtoprojADD;
	vec3 _121 = _119 * vec3(z);
	return _121;
}
float F_xHeightfog_xplaneIntersect(
	in vec3 ro,
	in vec3 rd,
	in vec4 p)
{
	float _128 = dot(ro, p.xyz);
	float _130 = _128 + p.w;
	float _131 = -(_130);
	float _133 = dot(rd, p.xyz);
	float _134 = _131 / _133;
	return _134;
}
S_xHeightfog_xVSPIXELINFO F_xHeightfog_xVS_PixelInfo(
	in uint id)
{
	S_xHeightfog_xVSPIXELINFO pixelInfo = _138;
	bool _141 = id == 2u;
	float _144 = _141 ? 2.00000000e+00 : 0.00000000e+00;
	pixelInfo.texCoords[0] = _144;
	bool _146 = id == 1u;
	float _149 = _146 ? 2.00000000e+00 : 0.00000000e+00;
	pixelInfo.texCoords[1] = _149;
	vec2 _152 = pixelInfo.texCoords * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _154 = _152 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _159 = vec4(_154.x, _154.y, 0.00000000e+00, 1.00000000e+00);
	pixelInfo.vpos = _159;
	vec2 sincosFactor = vec2(0.00000000e+00, 0.00000000e+00);
	float _163 = 6.28318548e+00 * V_xHeightfog_xFilterCircleRotationFactor;
	float _164;
	float _165;
	_164 = sin(_163), _165 = cos(_163);
	sincosFactor[0] = _164;
	sincosFactor[1] = _165;
	float _168 = -(sincosFactor.x);
	mat2x2 _172 = mat2x2(sincosFactor.y, sincosFactor.x, _168, sincosFactor.y);
	pixelInfo.rotationMatrix = _172;
	vec2 _174 = V_xHeightfog_xFilterCircleCenterPoint - vec2(5.00000000e-01, 5.00000000e-01);
	pixelInfo.centerDisplacementDelta = _174;
	float _175 = V_xHeightfog_xFilterCircleRadius * V_xHeightfog_xFilterCircleFeather;
	float _176 = V_xHeightfog_xFilterCircleRadius - _175;
	pixelInfo.featherRadius = _176;
	return pixelInfo;
}
void F_xHeightfog_xPS_FogIt(
	in S_xHeightfog_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	vec4 _182 = texture(V_xReShade_xBackBuffer, pixelInfo.texCoords);
	vec4 originalFragment = _182;
	vec2 _184;
	_184 = pixelInfo.texCoords;
	float _186 = F_xReShade_xGetLinearizedDepth(_184);
	float _189 = mix(1.00000000e+00, 1.00000000e+03, _186);
	float _191 = _189 / 1.00000000e+03;
	float depth_192 = _191;
	float _195 = V_xHeightfog_xPlaneOrientation.x * 6.28318501e+00;
	float phi = _195;
	float _199 = V_xHeightfog_xPlaneOrientation.y * 3.14159274e+00;
	float theta = _199;
	vec3 planeNormal = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _203 = cos(phi);
	float _204 = sin(theta);
	float _205 = _203 * _204;
	planeNormal[0] = _205;
	float _206 = sin(phi);
	float _207 = sin(theta);
	float _208 = _206 * _207;
	planeNormal[1] = _208;
	float _209 = cos(theta);
	planeNormal[2] = _209;
	vec3 _210 = normalize(planeNormal);
	planeNormal = _210;
	vec4 _214 = vec4(planeNormal.x, planeNormal.y, planeNormal.z, V_xHeightfog_xPlaneZ);
	vec4 iqplane = _214;
	vec2 _216;
	float _217;
	_216 = pixelInfo.texCoords;
	_217 = depth_192;
	vec3 _219 = F_xHeightfog_xuvToProj(_216, _217);
	vec3 scenePosition = _219;
	float _221 = length(scenePosition);
	float sceneDistance = _221;
	vec3 _224 = scenePosition / vec3(sceneDistance);
	vec3 rayDirection = _224;
	vec3 _226;
	vec3 _227;
	vec4 _228;
	_226 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	_227 = rayDirection;
	_228 = iqplane;
	float _230 = F_xHeightfog_xplaneIntersect(_226, _227, _228);
	float distanceToIntersect = _230;
	float _233 = V_xHeightfog_xMovementSpeed - 9.99999978e-03;
	float _235 = 1.00000000e+00 - _233;
	float _237 = 1.00000000e+05 * _235;
	float speedFactor = _237;
	vec2 _240 = pixelInfo.texCoords + V_xHeightfog_xFogCloudOffset;
	vec2 _242 = _240 * vec2(V_xHeightfog_xFogCloudScaleHorizontal);
	float _243 = V_xHeightfog_xtimer / speedFactor;
	float _244 = fract(_243);
	float _246 = V_xHeightfog_xMovingFog ? _244 : 0.00000000e+00;
	vec2 _248 = _242 + vec2(_246);
	vec4 _249 = texture(V_xHeightfog_xSamplerFogNoise, _248);
	float fogTextureValueHorizontally = _249.x;
	vec2 _253 = pixelInfo.texCoords + V_xHeightfog_xFogCloudOffset;
	vec2 _255 = _253 * vec2(V_xHeightfog_xFogCloudScaleVertical);
	float _256 = V_xHeightfog_xtimer / speedFactor;
	float _257 = fract(_256);
	float _259 = V_xHeightfog_xMovingFog ? _257 : 0.00000000e+00;
	vec2 _261 = _255 + vec2(_259);
	vec4 _262 = texture(V_xHeightfog_xSamplerFogNoise, _261);
	float fogTextureValueVertically = _262.x;
	vec2 _266 = pixelInfo.texCoords + V_xHeightfog_xFogMaxOffset;
	vec2 _268 = _266 * vec2(V_xHeightfog_xFogCloudScaleMax);
	float _269 = V_xHeightfog_xtimer / speedFactor;
	float _270 = fract(_269);
	float _272 = V_xHeightfog_xMovingFog ? _270 : 0.00000000e+00;
	vec2 _274 = _268 + vec2(_272);
	vec4 _275 = texture(V_xHeightfog_xSamplerFogNoise, _274);
	float fogMaxValue = _275.x;
	bool _279 = distanceToIntersect < 0.00000000e+00;
	float _281 = _279 ? 1.00000000e+07 : distanceToIntersect;
	distanceToIntersect = _281;
	float _283 = mix(1.00000000e+00, fogTextureValueVertically, V_xHeightfog_xFogCloudFactor);
	float _284 = distanceToIntersect * _283;
	distanceToIntersect = _284;
	float _285 = depth_192 - distanceToIntersect;
	float distanceTraveled = _285;
	float _287 = V_xHeightfog_xFogStart - distanceToIntersect;
	float _289 = 5.00000000e-01 * _287;
	float _290 = clamp(_289, 0.0, 1.0);
	float _291 = distanceTraveled - _290;
	float _292 = clamp(_291, 0.0, 1.0);
	distanceTraveled = _292;
	float _294 = distanceTraveled / 5.00000000e+01;
	float _295 = distanceTraveled * distanceTraveled;
	float _296 = V_xHeightfog_xEvenlyDistributeFog ? _294 : _295;
	distanceTraveled = _296;
	float _297 = distanceTraveled * fogMaxValue;
	distanceTraveled = _297;
	vec4 _302 = vec4(pixelInfo.texCoords.x, pixelInfo.texCoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _303 = textureLod(V_xHeightfog_xsamplerFilterCircle, _302.xy, _302.w);
	float _306 = V_xHeightfog_xUseFilterCircle ? _303.x : 0.00000000e+00;
	float filterCircleValue = _306;
	float _309 = distanceTraveled * 1.00000000e+01;
	float _310 = _309 * V_xHeightfog_xFogCurve;
	float _311 = _310 * V_xHeightfog_xFogDensity;
	float _313 = mix(1.00000000e+00, fogTextureValueHorizontally, V_xHeightfog_xFogCloudFactor);
	float _314 = _311 * _313;
	float _315 = clamp(_314, 0.0, 1.0);
	float _316 = _315 * V_xHeightfog_xOveralFogDensityMax;
	float _318 = 1.00000000e+00 - filterCircleValue;
	float _319 = clamp(_318, 0.0, 1.0);
	float _320 = _316 * _319;
	float lerpFactor = _320;
	bool _322 = sceneDistance < distanceToIntersect;
	vec3 _326 = mix(originalFragment.xyz, V_xHeightfog_xFogColor.xyz, vec3(lerpFactor));
	vec3 _329 = compCond(bvec3(_322), originalFragment.xyz, _326);
	fragment.xyz = _329;
	fragment[3] = 1.00000000e+00;
	bool _334 = V_xHeightfog_xFocusPointViewFilterCircleOnMouseDown && V_xHeightfog_xLeftMouseDown;
	if (_334)
	{
		float _336 = filterCircleValue * 6.99999988e-01;
		vec3 _340 = mix(fragment.xyz, vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_336));
		fragment.xyz = _340;
	}
	return;
}
void F_xHeightfog_xPS_CreateFilterCircle(
	in S_xHeightfog_xVSPIXELINFO pixelInfo,
	out vec4 fragment)
{
	fragment = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _348 = pixelInfo.texCoords - pixelInfo.centerDisplacementDelta;
	vec2 _350 = _348 - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _352 = (pixelInfo.rotationMatrix * _350);
	vec2 _353 = _352 * V_xHeightfog_xFilterCircleDeformFactors;
	vec2 texcoordCenterNormalized = _353;
	vec2 _356 = V_xHeightfog_xFilterCircleCenterPoint - pixelInfo.centerDisplacementDelta;
	vec2 _358 = _356 - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 focusPointCenterNormalized = _358;
	float _360 = distance(texcoordCenterNormalized, focusPointCenterNormalized);
	float texcoordDistance = _360;
	bool _366 = texcoordDistance < pixelInfo.featherRadius;
	if (_366)
	{
		fragment = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
	else
	{
		bool _371 = texcoordDistance > V_xHeightfog_xFilterCircleRadius;
		if (_371)
		{
			fragment = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		else
		{
			float _374 = V_xHeightfog_xFilterCircleRadius - pixelInfo.featherRadius;
			float featherbandWidth = _374;
			float _377 = texcoordDistance - pixelInfo.featherRadius;
			bool _379 = featherbandWidth == 0.00000000e+00;
			float _381 = featherbandWidth + float(_379);
			float _382 = _377 / _381;
			float _385 = mix(0.00000000e+00, 1.00000000e+00, _382);
			fragment = vec4(_385);
		}
	}
	return;
}
#ifdef E_xHeightfog_xVS_PixelInfo
layout(location = 0) out vec2 _return_texCoords;
layout(location = 6) out mat2x2 _return_rotationMatrix;
layout(location = 8) out vec2 _return_centerDisplacementDelta;
layout(location = 9) out float _return_featherRadius;
void main()
{
	uint id = uint(gl_VertexID);
	S_xHeightfog_xVSPIXELINFO _return = F_xHeightfog_xVS_PixelInfo(id);
	gl_Position = _return.vpos;
	_return_texCoords = _return.texCoords;
	_return_rotationMatrix = _return.rotationMatrix;
	_return_centerDisplacementDelta = _return.centerDisplacementDelta;
	_return_featherRadius = _return.featherRadius;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xHeightfog_xPS_CreateFilterCircle
in vec2 vv_0;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xHeightfog_xVSPIXELINFO _in_pixelInfo = S_xHeightfog_xVSPIXELINFO(gl_FragCoord, vv_0, vv_6, vv_8, vv_9);
	S_xHeightfog_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xHeightfog_xPS_CreateFilterCircle(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
#ifdef E_xHeightfog_xPS_FogIt
in vec2 vv_0;
in mat2x2 vv_6;
in vec2 vv_8;
in float vv_9;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	S_xHeightfog_xVSPIXELINFO _in_pixelInfo = S_xHeightfog_xVSPIXELINFO(gl_FragCoord, vv_0, vv_6, vv_8, vv_9);
	S_xHeightfog_xVSPIXELINFO pixelInfo = _in_pixelInfo;
	vec4 fragment;
	F_xHeightfog_xPS_FogIt(pixelInfo, fragment);
	_out_fragment = fragment;
	return;
}
#endif
