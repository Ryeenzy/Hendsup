#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPandaFX_xPS_HorizontalPassLoRes
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
uniform bool V_xPandaFX_xEnable_Diffusion;
uniform bool V_xPandaFX_xEnable_Bleach_Bypass;
uniform bool V_xPandaFX_xEnable_Static_Dither;
uniform bool V_xPandaFX_xEnable_Dither;
uniform float V_xPandaFX_xBlend_Amount;
uniform float V_xPandaFX_xBleach_Bypass_Amount;
uniform float V_xPandaFX_xContrast_R;
uniform float V_xPandaFX_xContrast_G;
uniform float V_xPandaFX_xContrast_B;
uniform float V_xPandaFX_xGamma_R;
uniform float V_xPandaFX_xGamma_G;
uniform float V_xPandaFX_xGamma_B;
uniform float V_xPandaFX_xDiffusion_1_Amount;
uniform float V_xPandaFX_xDiffusion_1_Radius;
uniform float V_xPandaFX_xDiffusion_1_Gamma;
uniform float V_xPandaFX_xDiffusion_1_Quality;
uniform float V_xPandaFX_xDiffusion_2_Amount;
uniform float V_xPandaFX_xDiffusion_2_Radius;
uniform float V_xPandaFX_xDiffusion_2_Gamma;
uniform float V_xPandaFX_xDiffusion_2_Quality;
uniform float V_xPandaFX_xDiffusion_3_Amount;
uniform float V_xPandaFX_xDiffusion_3_Radius;
uniform float V_xPandaFX_xDiffusion_3_Gamma;
uniform float V_xPandaFX_xDiffusion_3_Quality;
uniform int V_xPandaFX_xframecount;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xPandaFX_xNoiseSampler;
uniform sampler2D V_xPandaFX_xPFX_PrePassLayer;
uniform sampler2D V_xPandaFX_xPFX_blurHorizontalLayer;
uniform sampler2D V_xPandaFX_xPFX_blurVerticalLayer;
uniform sampler2D V_xPandaFX_xPFX_blurHorizontalLayerMedRes;
uniform sampler2D V_xPandaFX_xPFX_blurVerticalLayerMedRes;
uniform sampler2D V_xPandaFX_xPFX_blurHorizontalLayerLoRes;
uniform sampler2D V_xPandaFX_xPFX_blurVerticalLayerLoRes;
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
float F_xPandaFX_xAdjustableSigmoidCurve(
	in float value,
	in float amount)
{
	bool _107 = value < 5.00000000e-01;
	float _108 = pow(value, amount);
	float _110 = pow(2.00000000e+00, amount);
	float _111 = _108 * _110;
	float _113 = _111 * 5.00000000e-01;
	float _115 = 1.00000000e+00 - value;
	float _116 = pow(_115, amount);
	float _118 = pow(2.00000000e+00, amount);
	float _119 = _116 * _118;
	float _121 = _119 * 5.00000000e-01;
	float _123 = 1.00000000e+00 - _121;
	float _124 = _107 ? _113 : _123;
	return _124;
}
float F_xPandaFX_xRandomize(
	in vec2 coord)
{
	float _129 = dot(coord, vec2(1.29898005e+01, 7.82330017e+01));
	float _130 = sin(_129);
	float _132 = _130 * 4.37585469e+04;
	float _133 = fract(_132);
	float _136 = clamp(_133, 0.00000000e+00, 1.00000000e+00);
	return _136;
}
float F_xPandaFX_xSigmoidCurve(
	in float value)
{
	float _141 = value * 2.00000000e+00;
	float _143 = _141 - 1.00000000e+00;
	value = _143;
	float _144 = -(value);
	float _145 = abs(value);
	float _146 = _144 * _145;
	float _148 = _146 * 5.00000000e-01;
	float _149 = _148 + value;
	float _151 = _149 + 5.00000000e-01;
	return _151;
}
vec4 F_xPandaFX_xBlurH(
	in sampler2D _input,
	in vec2 uv,
	in float radius,
	in float sampling)
{
	vec4 avgColor = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _161 = sampling == 0.00000000e+00;
	float _163 = sampling + float(_161);
	float _165 = 5.20833360e-04 * _163;
	float width = _165;
	vec4 tapCoord = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _169 = -(radius);
	float x = _169;
	while (x <= radius)
	{
		{
			float _180 = x * width;
			vec2 _182 = vec2(_180, 0.00000000e+00);
			vec2 _183 = uv + _182;
			vec2 coordinate = _183;
			vec2 _187 = clamp(coordinate, vec2(0.00000000e+00, 0.00000000e+00), vec2(1.00000000e+00, 1.00000000e+00));
			tapCoord.xy = _187;
			float _188 = abs(x);
			bool _190 = radius == 0.00000000e+00;
			float _192 = radius + float(_190);
			float _193 = _188 / _192;
			float _195 = 1.00000000e+00 - _193;
			float _196;
			_196 = _195;
			float _197 = F_xPandaFX_xSigmoidCurve(_196);
			float weight = _197;
			vec4 _199 = textureLod(_input, tapCoord.xy, tapCoord.w);
			vec3 _202 = _199.xyz * vec3(weight);
			vec3 _204 = avgColor.xyz + _202;
			avgColor.xyz = _204;
			float _206 = avgColor.w + weight;
			avgColor[3] = _206;
		}
		float _178 = x;
		float _179 = _178 + 1.00000000e+00;
		x = _179;
	}
	bool _209 = avgColor.w == 0.00000000e+00;
	float _212 = avgColor.w + float(_209);
	vec3 _215 = avgColor.xyz / vec3(_212);
	avgColor.xyz = _215;
	avgColor[3] = 1.00000000e+00;
	return avgColor;
}
vec4 F_xPandaFX_xBlurV(
	in sampler2D _input,
	in vec2 uv,
	in float radius,
	in float sampling)
{
	vec4 avgColor_224 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _226 = 9.25925910e-04 * sampling;
	float height = _226;
	vec4 tapCoord_229 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _230 = -(radius);
	float y = _230;
	while (y <= radius)
	{
		{
			float _241 = y * height;
			vec2 _243 = vec2(0.00000000e+00, _241);
			vec2 _244 = uv + _243;
			vec2 coordinate_245 = _244;
			vec2 _248 = clamp(coordinate_245, vec2(0.00000000e+00, 0.00000000e+00), vec2(1.00000000e+00, 1.00000000e+00));
			tapCoord_229.xy = _248;
			float _249 = abs(y);
			bool _251 = radius == 0.00000000e+00;
			float _253 = radius + float(_251);
			float _254 = _249 / _253;
			float _256 = 1.00000000e+00 - _254;
			float _257;
			_257 = _256;
			float _258 = F_xPandaFX_xSigmoidCurve(_257);
			float weight_259 = _258;
			vec4 _260 = textureLod(_input, tapCoord_229.xy, tapCoord_229.w);
			vec3 _263 = _260.xyz * vec3(weight_259);
			vec3 _265 = avgColor_224.xyz + _263;
			avgColor_224.xyz = _265;
			float _267 = avgColor_224.w + weight_259;
			avgColor_224[3] = _267;
		}
		float _239 = y;
		float _240 = _239 + 1.00000000e+00;
		y = _240;
	}
	bool _270 = avgColor_224.w == 0.00000000e+00;
	float _273 = avgColor_224.w + float(_270);
	vec3 _276 = avgColor_224.xyz / vec3(_273);
	avgColor_224.xyz = _276;
	avgColor_224[3] = 1.00000000e+00;
	return avgColor_224;
}
void F_xPandaFX_xPS_PrePass(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec4 _283 = texture(V_xReShade_xBackBuffer, uv);
	vec4 A = _283;
	float _286 = pow(A.x, V_xPandaFX_xGamma_R);
	A[0] = _286;
	float _288 = pow(A.y, V_xPandaFX_xGamma_G);
	A[1] = _288;
	float _290 = pow(A.z, V_xPandaFX_xGamma_B);
	A[2] = _290;
	float _291;
	float _292;
	_291 = A.x;
	_292 = V_xPandaFX_xContrast_R;
	float _294 = F_xPandaFX_xAdjustableSigmoidCurve(_291, _292);
	A[0] = _294;
	float _295;
	float _296;
	_295 = A.y;
	_296 = V_xPandaFX_xContrast_G;
	float _298 = F_xPandaFX_xAdjustableSigmoidCurve(_295, _296);
	A[1] = _298;
	float _299;
	float _300;
	_299 = A.z;
	_300 = V_xPandaFX_xContrast_B;
	float _302 = F_xPandaFX_xAdjustableSigmoidCurve(_299, _300);
	A[2] = _302;
	float _305 = A.y * 8.00000012e-01;
	float _308 = A.z * 2.00000003e-01;
	float _309 = _305 + _308;
	A[1] = _309;
	float _312 = A.x - A.y;
	float _314 = _312 - A.z;
	float _317 = clamp(_314, 0.00000000e+00, 1.00000000e+00);
	float red = _317;
	float _321 = A.y - A.x;
	float _323 = _321 - A.z;
	float _326 = clamp(_323, 0.00000000e+00, 1.00000000e+00);
	float green = _326;
	float _330 = A.z - A.x;
	float _332 = _330 - A.y;
	float _335 = clamp(_332, 0.00000000e+00, 1.00000000e+00);
	float blue = _335;
	float _338 = red * 6.00000024e-01;
	float _340 = 1.00000000e+00 - _338;
	vec4 _342 = A * vec4(_340);
	A = _342;
	float _344 = green * 8.00000012e-01;
	float _346 = 1.00000000e+00 - _344;
	vec4 _348 = A * vec4(_346);
	A = _348;
	float _350 = blue * 3.00000012e-01;
	float _352 = 1.00000000e+00 - _350;
	vec4 _354 = A * vec4(_352);
	A = _354;
	result = A;
	return;
}
void F_xPandaFX_xPS_HorizontalPass(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _360;
	float _361;
	float _362;
	_360 = uv;
	_361 = V_xPandaFX_xDiffusion_1_Radius;
	_362 = V_xPandaFX_xDiffusion_1_Quality;
	vec4 _363 = F_xPandaFX_xBlurH(V_xPandaFX_xPFX_PrePassLayer, _360, _361, _362);
	result = _363;
	return;
}
void F_xPandaFX_xPS_VerticalPass(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _369;
	float _370;
	float _371;
	_369 = uv;
	_370 = V_xPandaFX_xDiffusion_1_Radius;
	_371 = V_xPandaFX_xDiffusion_1_Quality;
	vec4 _372 = F_xPandaFX_xBlurV(V_xPandaFX_xPFX_blurHorizontalLayer, _369, _370, _371);
	result = _372;
	return;
}
void F_xPandaFX_xPS_HorizontalPassMedRes(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _378;
	float _379;
	float _380;
	_378 = uv;
	_379 = V_xPandaFX_xDiffusion_2_Radius;
	_380 = V_xPandaFX_xDiffusion_2_Quality;
	vec4 _381 = F_xPandaFX_xBlurH(V_xPandaFX_xPFX_blurVerticalLayer, _378, _379, _380);
	result = _381;
	return;
}
void F_xPandaFX_xPS_VerticalPassMedRes(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _387;
	float _388;
	float _389;
	_387 = uv;
	_388 = V_xPandaFX_xDiffusion_2_Radius;
	_389 = V_xPandaFX_xDiffusion_2_Quality;
	vec4 _390 = F_xPandaFX_xBlurV(V_xPandaFX_xPFX_blurHorizontalLayerMedRes, _387, _388, _389);
	result = _390;
	return;
}
void F_xPandaFX_xPS_HorizontalPassLoRes(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _396;
	float _397;
	float _398;
	_396 = uv;
	_397 = V_xPandaFX_xDiffusion_3_Radius;
	_398 = V_xPandaFX_xDiffusion_3_Quality;
	vec4 _399 = F_xPandaFX_xBlurH(V_xPandaFX_xPFX_blurVerticalLayerMedRes, _396, _397, _398);
	result = _399;
	return;
}
void F_xPandaFX_xPS_VerticalPassLoRes(
	in vec4 pos,
	in vec2 uv,
	out vec4 result)
{
	vec2 _405;
	float _406;
	float _407;
	_405 = uv;
	_406 = V_xPandaFX_xDiffusion_3_Radius;
	_407 = V_xPandaFX_xDiffusion_3_Quality;
	vec4 _408 = F_xPandaFX_xBlurV(V_xPandaFX_xPFX_blurHorizontalLayerLoRes, _405, _406, _407);
	result = _408;
	return;
}
vec4 F_xPandaFX_xPS_Composition(
	in vec4 vpos,
	in vec2 uv)
{
	vec4 blurLayer = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 blurLayerMedRes = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 blurLayerLoRes = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _419 = texture(V_xPandaFX_xPFX_PrePassLayer, uv);
	vec4 A_420 = _419;
	vec4 _421 = texture(V_xReShade_xBackBuffer, uv);
	vec4 O = _421;
	vec4 _423 = texture(V_xPandaFX_xNoiseSampler, uv);
	vec3 rndSample = _423.xyz;
	if (V_xPandaFX_xEnable_Diffusion)
	{
		vec4 _429 = texture(V_xPandaFX_xPFX_blurVerticalLayer, uv);
		blurLayer = _429;
		vec4 _430 = texture(V_xPandaFX_xPFX_blurVerticalLayerMedRes, uv);
		blurLayerMedRes = _430;
		vec4 _431 = texture(V_xPandaFX_xPFX_blurVerticalLayerLoRes, uv);
		blurLayerLoRes = _431;
		float _434 = dot(vec3(3.33299994e-01, 3.33299994e-01, 3.33299994e-01), blurLayerMedRes.xyz);
		vec4 _437 = mix(blurLayerMedRes, vec4(_434), vec4(7.50000000e-01, 7.50000000e-01, 7.50000000e-01, 7.50000000e-01));
		blurLayerMedRes = _437;
		float _440 = dot(vec3(3.33299994e-01, 3.33299994e-01, 3.33299994e-01), blurLayerLoRes.xyz);
		vec4 _443 = mix(blurLayerLoRes, vec4(_440), vec4(7.50000000e-01, 7.50000000e-01, 7.50000000e-01, 7.50000000e-01));
		blurLayerLoRes = _443;
		vec4 _445 = blurLayer * vec4(V_xPandaFX_xDiffusion_1_Amount);
		blurLayer = _445;
		vec4 _447 = blurLayerMedRes * vec4(V_xPandaFX_xDiffusion_2_Amount);
		blurLayerMedRes = _447;
		vec4 _449 = blurLayerLoRes * vec4(V_xPandaFX_xDiffusion_3_Amount);
		blurLayerLoRes = _449;
		vec4 _451 = pow(blurLayer, vec4(V_xPandaFX_xDiffusion_1_Gamma));
		blurLayer = _451;
		vec4 _453 = pow(blurLayerMedRes, vec4(V_xPandaFX_xDiffusion_2_Gamma));
		blurLayerMedRes = _453;
		vec4 _455 = pow(blurLayerLoRes, vec4(V_xPandaFX_xDiffusion_3_Gamma));
		blurLayerLoRes = _455;
		if (V_xPandaFX_xEnable_Static_Dither)
		{
			vec3 _460 = rndSample * vec3(9.99999978e-03, 9.99999978e-03, 9.99999978e-03);
			vec3 _462 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _460;
			vec3 hd_noise = _462;
			vec3 _466 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayer.xyz;
			vec3 _467 = hd_noise * _466;
			vec3 _469 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _467;
			blurLayer.xyz = _469;
			vec3 _472 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayerMedRes.xyz;
			vec3 _473 = hd_noise * _472;
			vec3 _475 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _473;
			blurLayerMedRes.xyz = _475;
			vec3 _478 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayerLoRes.xyz;
			vec3 _479 = hd_noise * _478;
			vec3 _481 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _479;
			blurLayerLoRes.xyz = _481;
		}
		vec4 _484 = clamp(blurLayer, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
		blurLayer = _484;
		vec4 _487 = clamp(blurLayerMedRes, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
		blurLayerMedRes = _487;
		vec4 _490 = clamp(blurLayerLoRes, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
		blurLayerLoRes = _490;
		vec3 _493 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayer.xyz;
		vec3 _496 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - A_420.xyz;
		vec3 _497 = _493 * _496;
		vec3 _499 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _497;
		A_420.xyz = _499;
		vec3 _502 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayerMedRes.xyz;
		vec3 _505 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - A_420.xyz;
		vec3 _506 = _502 * _505;
		vec3 _508 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _506;
		A_420.xyz = _508;
		vec3 _511 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - blurLayerLoRes.xyz;
		vec3 _514 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - A_420.xyz;
		vec3 _515 = _511 * _514;
		vec3 _517 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _515;
		A_420.xyz = _517;
	}
	float _520 = dot(vec3(3.33299994e-01, 3.33299994e-01, 3.33299994e-01), A_420.xyz);
	float Ag = _520;
	bool _523 = Ag > 5.00000000e-01;
	float _525 = 1.00000000e+00 - Ag;
	float _527 = 2.00000000e+00 * _525;
	vec4 _529 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - A_420;
	vec4 _531 = vec4(_527) * _529;
	vec4 _533 = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _531;
	float _535 = 2.00000000e+00 * Ag;
	vec4 _537 = vec4(_535) * A_420;
	vec4 _539 = compCond(bvec4(_523), _533, _537);
	vec4 C = _539;
	vec4 _542 = pow(C, vec4(6.00000024e-01, 6.00000024e-01, 6.00000024e-01, 6.00000024e-01));
	C = _542;
	float _544 = V_xPandaFX_xEnable_Bleach_Bypass ? V_xPandaFX_xBleach_Bypass_Amount : 0.00000000e+00;
	vec4 _546 = mix(A_420, C, vec4(_544));
	A_420 = _546;
	if (V_xPandaFX_xEnable_Dither)
	{
		vec2 _552 = rndSample.xy * vec2(ivec2(V_xPandaFX_xframecount));
		vec2 _553;
		_553 = _552;
		float _554 = F_xPandaFX_xRandomize(_553);
		float uvRnd = _554;
		vec2 _558 = rndSample.xy * vec2(ivec2(V_xPandaFX_xframecount));
		vec2 _560 = _558 + vec2(1.00000000e+00, 1.00000000e+00);
		vec2 _561;
		_561 = _560;
		float _562 = F_xPandaFX_xRandomize(_561);
		float uvRnd2 = _562;
		vec2 _565 = uv * vec2(uvRnd2);
		vec4 _566 = texture(V_xPandaFX_xNoiseSampler, _565);
		float _569 = _566.x * 3.99999991e-02;
		vec4 _571 = A_420 - vec4(_569);
		A_420 = _571;
		vec2 _573 = uv * vec2(uvRnd);
		vec4 _574 = texture(V_xPandaFX_xNoiseSampler, _573);
		float _577 = _574.x * 3.99999991e-02;
		vec4 _579 = A_420 + vec4(_577);
		A_420 = _579;
	}
	vec4 _581 = mix(O, A_420, vec4(V_xPandaFX_xBlend_Amount));
	return _581;
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
#ifdef E_xPandaFX_xPS_PrePass
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_PrePass(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_HorizontalPass
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_HorizontalPass(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_VerticalPass
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_VerticalPass(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_HorizontalPassMedRes
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_HorizontalPassMedRes(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_VerticalPassMedRes
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_VerticalPassMedRes(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_HorizontalPassLoRes
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_HorizontalPassLoRes(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_VerticalPassLoRes
in vec2 vv_0;
layout(location = 0) out vec4 _out_result;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 result;
	F_xPandaFX_xPS_VerticalPassLoRes(pos, uv, result);
	_out_result = result;
	return;
}
#endif
#ifdef E_xPandaFX_xPS_Composition
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 uv = vv_0;
	_return = F_xPandaFX_xPS_Composition(vpos, uv);
	return;
}
#endif
