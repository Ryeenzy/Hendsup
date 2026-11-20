#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_BloomH_A
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
uniform int V_xAuto_Bloom;
uniform float V_xCBT_Adjust;
uniform vec2 V_xBloom_Intensity;
uniform float V_xBloomSensitivity;
uniform float V_xBloomCurve;
uniform vec2 V_xSaturation;
uniform float V_xBloom_Spread;
uniform float V_xDither_Bloom;
uniform int V_xTonemappers;
uniform float V_xWP;
uniform float V_xExp;
uniform float V_xGreyValue;
uniform float V_xGamma;
uniform float V_xContrast;
uniform float V_xSaturate;
uniform int V_xInv_Tonemappers;
uniform float V_xHDR_BP;
uniform bool V_xBloom_BA_iToneMapper;
uniform int V_xAuto_Exposure;
uniform float V_xAdapt_Adjust;
uniform float V_xAdapt_Seek;
uniform int V_xDebug_View;
uniform float V_xtimer;
uniform float V_xframetime;

uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xSamplerCurrBB;
uniform sampler2D V_xTextureBloomH_A;
uniform sampler2D V_xTextureBloomV_A;
uniform sampler2D V_xTextureBloomH_B;
uniform sampler2D V_xTextureBloomV_B;
uniform sampler2D V_xTextureBloomH_C;
uniform sampler2D V_xTextureBloomV_C;
uniform sampler2D V_xTextureBloom;
uniform sampler2D V_xSamplerFlare;
uniform sampler2D V_xSamplerDS;
uniform sampler2D V_xSamplerTA;
uniform sampler2D V_xSamplerStored;
const vec2 _499[4] = vec2[4](vec2(1.00000000e+00, 1.00000000e+00), vec2(1.00000000e+00, -1.00000000e+00), vec2(-1.00000000e+00, 1.00000000e+00), vec2(-1.00000000e+00, -1.00000000e+00));
struct S_xBloomData
{
	vec4 Blur;
	vec2 Pixelsize;
	vec2 Coord;
	float Offset;
	float Weight;
	float WeightSum;
};
S_xBloomData _622;
float F_xLuma(
	in vec3 C)
{
	vec3 Luma = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	if (true)
	{
		Luma = vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02);
	}
	else
	{
		Luma = vec3(2.62699991e-01, 6.77999973e-01, 5.93000017e-02);
	}
	float _58 = dot(C, Luma);
	return _58;
}
vec3 F_xApplyPQ(
	in vec3 color)
{
	float m1 = 1.59301758e-01;
	float m2 = 7.88437500e+01;
	float c1 = 8.35937500e-01;
	float c2 = 1.88515625e+01;
	float c3 = 1.86875000e+01;
	vec3 _73 = abs(color.xyz);
	vec3 _75 = pow(_73, vec3(m1));
	vec3 cp = _75;
	vec3 _78 = vec3(c2) * cp;
	vec3 _80 = vec3(c1) + _78;
	vec3 _82 = vec3(c3) * cp;
	vec3 _84 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + _82;
	vec3 _85 = _80 / _84;
	vec3 _87 = pow(_85, vec3(m2));
	color.xyz = _87;
	return color;
}
float F_xLog2Exposure(
	in float avgLuminance,
	in float GreyValue)
{
	float exposure = 0.00000000e+00;
	float _95 = max(avgLuminance, 9.99999997e-07);
	avgLuminance = _95;
	float _96 = GreyValue / avgLuminance;
	float linExp = _96;
	float _98 = log2(linExp);
	exposure = _98;
	return exposure;
}
float F_xCalcExposedColor(
	in float avgLuminance,
	in float offset,
	in float GreyValue)
{
	float _105 = GreyValue * 2.20000005e+00;
	float _106;
	float _107;
	_106 = avgLuminance;
	_107 = _105;
	float _108 = F_xLog2Exposure(_106, _107);
	float exposure_109 = _108;
	float _110 = exposure_109 + offset;
	exposure_109 = _110;
	float _111 = exp2(exposure_109);
	return _111;
}
vec3 F_xDownsample(
	in vec4 pos,
	in vec2 texcoord)
{
	vec2 texXY = texcoord;
	float _124 = V_xAdapt_Seek - 1.00000000e+00;
	vec2 _127 = vec2(_124) * vec2(9.60000000e+02, 5.40000000e+02);
	vec2 _129 = _127 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 midHV = _129;
	float _132 = texXY.x * V_xAdapt_Seek;
	float _134 = _132 - midHV.x;
	float _136 = texXY.y * V_xAdapt_Seek;
	float _138 = _136 - midHV.y;
	vec2 _139 = vec2(_134, _138);
	vec2 TC = _139;
	vec4 _141 = texture(V_xBackBuffer, TC);
	vec3 _142;
	_142 = _141.xyz;
	float _144 = F_xLuma(_142);
	vec3 _147 = vec3(_144, 0.00000000e+00, 0.00000000e+00);
	return _147;
}
float F_xPS_Temporal_Adaptation(
	in vec4 pos,
	in vec2 texcoord)
{
	float TT = 3.25000000e+04;
	float _155 = 1.00000000e+00 - V_xAdapt_Adjust;
	float _157 = _155 * 1.25000000e+03;
	float EA = _157;
	vec4 _163 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 1.10000000e+01);
	vec4 _164 = textureLod(V_xSamplerDS, _163.xy, _163.w);
	float L = _164.x;
	vec4 _168 = texture(V_xSamplerStored, vec2(2.50000000e-01, 2.50000000e-01));
	float PL_A = _168.x;
	vec4 _172 = texture(V_xSamplerStored, vec2(2.50000000e-01, 7.50000000e-01));
	float PL_B = _172.x;
	bool _176 = V_xAuto_Exposure >= 1;
	float _177 = L - PL_A;
	float _178 = -(V_xframetime);
	float _179 = _178 / EA;
	float _180 = exp(_179);
	float _182 = 1.00000000e+00 - _180;
	float _183 = _177 * _182;
	float _184 = PL_A + _183;
	float _185 = _176 ? _184 : L;
	EA = _185;
	bool _187 = V_xAuto_Exposure >= 1;
	float _188 = L - PL_B;
	float _189 = -(V_xframetime);
	float _190 = _189 / TT;
	float _191 = exp(_190);
	float _193 = 1.00000000e+00 - _191;
	float _194 = _188 * _193;
	float _195 = PL_B + _194;
	float _196 = _187 ? _195 : L;
	TT = _196;
	float _199 = smoothstep(1.00000000e+00, 0.00000000e+00, TT);
	bool _201 = _199 < 8.50000024e-01;
	int _204 = 1 - int(_201);
	float ITF = float(_204);
	float FT = 2.50000000e+03;
	vec4 _210 = texture(V_xSamplerStored, vec2(7.50000000e-01, 2.50000000e-01));
	float PStoredfade = _210.x;
	float _213 = ITF - PStoredfade;
	float _214 = -(V_xframetime);
	float _215 = _214 / FT;
	float _216 = exp2(_215);
	float _218 = 1.00000000e+00 - _216;
	float _219 = _213 * _218;
	float _220 = PStoredfade + _219;
	float TF = _220;
	bool _224 = texcoord.x > 5.00000000e-01;
	bool _227 = texcoord.y > 5.00000000e-01;
	float _229 = _227 ? 0.00000000e+00 : TF;
	bool _232 = texcoord.y > 5.00000000e-01;
	float _233 = _232 ? TT : EA;
	float _234 = _224 ? _229 : _233;
	return _234;
}
float F_xmax3(
	in float x,
	in float y,
	in float z)
{
	float _240 = max(y, z);
	float _241 = max(x, _240);
	return _241;
}
vec3 F_xinv_Tonemapper(
	in vec4 color,
	in int TM)
{
	bool _250 = TM == 1;
	if (_250)
	{
		float _253 = max(color.w, 1.00000005e-03);
		float _255 = 1.00000000e+00 + _253;
		float _256;
		float _257;
		float _258;
		_256 = color.x;
		_257 = color.y;
		_258 = color.z;
		float _262 = F_xmax3(_256, _257, _258);
		float _263 = _255 - _262;
		float _264 = 1.0 / _263;
		vec3 _267 = color.xyz * vec3(_264);
		return _267;
	}
	else
	{
		bool _272 = TM == 2;
		if (_272)
		{
			float _275 = 1.00000000e+00 + color.w;
			vec3 _278 = vec3(_275) - color.xyz;
			vec3 _280 = max(_278, vec3(1.00000005e-03, 1.00000005e-03, 1.00000005e-03));
			vec3 _281 = 1.0 / _280;
			vec3 _283 = color.xyz * _281;
			return _283;
		}
		else
		{
			float _287 = mix(-5.00000000e-01, 0.00000000e+00, color.w);
			float _289 = 1.00000000e+00 + _287;
			vec3 _290;
			_290 = color.xyz;
			float _292 = F_xLuma(_290);
			float _293 = _289 - _292;
			float _295 = max(_293, 1.00000005e-03);
			float _296 = 1.0 / _295;
			vec3 _299 = color.xyz * vec3(_296);
			return _299;
		}
	}
}
float F_xColToneB(
	in float hdrMax,
	in float contrast,
	in float shoulder,
	in float midIn,
	in float midOut)
{
	float _307 = pow(midIn, contrast);
	float _308 = -(_307);
	float _309 = contrast * shoulder;
	float _310 = pow(hdrMax, _309);
	float _311 = pow(midIn, contrast);
	float _312 = _310 * _311;
	float _313 = pow(hdrMax, contrast);
	float _314 = contrast * shoulder;
	float _315 = pow(midIn, _314);
	float _316 = _313 * _315;
	float _317 = _316 * midOut;
	float _318 = _312 - _317;
	float _319 = midOut * _318;
	float _320 = contrast * shoulder;
	float _321 = pow(hdrMax, _320);
	float _322 = _321 * midOut;
	float _323 = contrast * shoulder;
	float _324 = pow(midIn, _323);
	float _325 = _324 * midOut;
	float _326 = _322 - _325;
	float _327 = _319 / _326;
	float _328 = _308 + _327;
	float _329 = contrast * shoulder;
	float _330 = pow(midIn, _329);
	float _331 = _330 * midOut;
	float _332 = _328 / _331;
	float _333 = -(_332);
	return _333;
}
float F_xColToneC(
	in float hdrMax,
	in float contrast,
	in float shoulder,
	in float midIn,
	in float midOut)
{
	float _341 = contrast * shoulder;
	float _342 = pow(hdrMax, _341);
	float _343 = pow(midIn, contrast);
	float _344 = _342 * _343;
	float _345 = pow(hdrMax, contrast);
	float _346 = contrast * shoulder;
	float _347 = pow(midIn, _346);
	float _348 = _345 * _347;
	float _349 = _348 * midOut;
	float _350 = _344 - _349;
	float _351 = contrast * shoulder;
	float _352 = pow(hdrMax, _351);
	float _353 = _352 * midOut;
	float _354 = contrast * shoulder;
	float _355 = pow(midIn, _354);
	float _356 = _355 * midOut;
	float _357 = _353 - _356;
	float _358 = _350 / _357;
	return _358;
}
float F_xColTone(
	in float x,
	in vec4 p)
{
	float _364 = pow(x, p.x);
	float z_365 = _364;
	float _367 = pow(z_365, p.y);
	float _369 = _367 * p.z;
	float _371 = _369 + p.w;
	float _372 = z_365 / _371;
	return _372;
}
vec3 F_xTimothyTonemapper(
	in vec3 color,
	in float EX)
{
	float _380 = false ? 2.50000000e+01 : 1.60000000e+01;
	float hdrMax_381 = _380;
	float _383 = V_xContrast + 2.50000000e-01;
	float contrast_384 = _383;
	float shoulder_386 = 1.00000000e+00;
	float midIn_388 = 1.09999999e-01;
	float _392 = false ? 7.20000034e-03 : 1.80000007e-01;
	float midOut_393 = _392;
	float _394;
	float _395;
	float _396;
	float _397;
	float _398;
	_394 = hdrMax_381;
	_395 = contrast_384;
	_396 = shoulder_386;
	_397 = midIn_388;
	_398 = midOut_393;
	float _399 = F_xColToneB(_394, _395, _396, _397, _398);
	float b = _399;
	float _401;
	float _402;
	float _403;
	float _404;
	float _405;
	_401 = hdrMax_381;
	_402 = contrast_384;
	_403 = shoulder_386;
	_404 = midIn_388;
	_405 = midOut_393;
	float _406 = F_xColToneC(_401, _402, _403, _404, _405);
	float c = _406;
	vec3 _409 = color * vec3(EX);
	color = _409;
	float _412 = max(color.y, color.z);
	float _414 = max(color.x, _412);
	float peak = _414;
	float _417 = max(9.99999997e-07, peak);
	peak = _417;
	vec3 _419 = color / vec3(peak);
	vec3 ratio = _419;
	vec4 _421 = vec4(contrast_384, shoulder_386, b, c);
	float _422;
	vec4 _423;
	_422 = peak;
	_423 = _421;
	float _424 = F_xColTone(_422, _423);
	peak = _424;
	float crosstalk = 4.00000000e+00;
	float _427 = contrast_384 * V_xSaturate;
	float saturation = _427;
	float _430 = contrast_384 * 1.60000000e+01;
	float crossSaturation = _430;
	float white = V_xWP;
	vec3 _433 = abs(ratio);
	float _434 = saturation / crossSaturation;
	vec3 _436 = pow(_433, vec3(_434));
	ratio = _436;
	float _437 = pow(peak, crosstalk);
	vec3 _440 = mix(ratio, vec3(white), vec3(_437));
	ratio = _440;
	vec3 _441 = abs(ratio);
	vec3 _443 = pow(_441, vec3(crossSaturation));
	ratio = _443;
	vec3 _445 = vec3(peak) * ratio;
	color = _445;
	return color;
}
vec3 F_xRRTAndODTFit(
	in vec3 v)
{
	vec3 _450 = v + vec3(2.45785993e-02, 2.45785993e-02, 2.45785993e-02);
	vec3 _451 = v * _450;
	vec3 _453 = _451 - vec3(9.05370034e-05, 9.05370034e-05, 9.05370034e-05);
	vec3 a = _453;
	vec3 _456 = vec3(9.83729005e-01, 9.83729005e-01, 9.83729005e-01) * v;
	vec3 _458 = _456 + vec3(4.32951003e-01, 4.32951003e-01, 4.32951003e-01);
	vec3 _459 = v * _458;
	vec3 _461 = _459 + vec3(2.38080993e-01, 2.38080993e-01, 2.38080993e-01);
	vec3 b_462 = _461;
	vec3 _463 = a / b_462;
	return _463;
}
vec3 F_xACESFitted(
	in vec3 color,
	in float EX)
{
	float _469 = EX + 5.00000000e-01;
	vec3 _471 = color * vec3(_469);
	color = _471;
	vec3 _473 = (color * mat3x3(5.97190022e-01, 3.54579985e-01, 4.82299998e-02, 7.59999976e-02, 9.08339977e-01, 1.56599991e-02, 2.84000002e-02, 1.33829996e-01, 8.37769985e-01));
	color = _473;
	vec3 _474;
	_474 = color;
	vec3 _475 = F_xRRTAndODTFit(_474);
	color = _475;
	vec3 _477 = (color * mat3x3(1.60475004e+00, -5.31080008e-01, -7.36699998e-02, -1.02080002e-01, 1.10812998e+00, -6.04999997e-03, -3.26999999e-03, -7.27600008e-02, 1.07602000e+00));
	color = _477;
	vec3 _479 = color / vec3(V_xWP);
	return _479;
}
vec4 F_xSimpleBlur(
	in sampler2D InputTex,
	in vec2 Coord,
	in vec2 pixelsize)
{
	vec4 Blur = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int i = 0;
	while (i < 4)
	{
		{
			vec2 _501 = _499[int(i)] * pixelsize;
			vec2 _502 = Coord + _501;
			vec4 _503 = texture(InputTex, _502);
			vec4 _504 = Blur + _503;
			Blur = _504;
		}
		int _497 = i;
		int _498 = _497 + 1;
		i = _498;
	}
	vec4 _506 = Blur * vec4(2.50000000e-01, 2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
	return _506;
}
vec2 F_xGetPixelSize(
	in float texsize)
{
	vec2 _513 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(texsize);
	return _513;
}
vec3 F_xAuto_Luma()
{
	vec4 _517 = texture(V_xSamplerTA, vec2(2.50000000e-01, 2.50000000e-01));
	float _520 = 1.00000000e+00 - _517.x;
	float _523 = smoothstep(0.00000000e+00, 1.00000000e+00, _520);
	float _524 = clamp(_523, 0.0, 1.0);
	vec4 _526 = texture(V_xSamplerTA, vec2(2.50000000e-01, 2.50000000e-01));
	vec4 _528 = texture(V_xSamplerTA, vec2(7.50000000e-01, 2.50000000e-01));
	float _532 = smoothstep(0.00000000e+00, 1.00000000e+00, _528.x);
	float _533 = clamp(_532, 0.0, 1.0);
	vec3 _535 = vec3(_524, _526.x, _533);
	return _535;
}
vec3 F_xColor_GS(
	in vec4 BC)
{
	vec3 _539;
	_539 = BC.xyz;
	float _541 = F_xLuma(_539);
	float GS = _541;
	float _546 = mix(0.00000000e+00, 1.00000000e+01, V_xSaturation.x);
	float Saturate_A = _546;
	float _549 = clamp(V_xSaturation.y, 0.0, 1.0);
	float Saturate_B = _549;
	vec3 _551 = F_xAuto_Luma();
	float AL = _551.x;
	vec3 _555 = abs(BC.xyz);
	vec3 _557 = pow(_555, vec3(V_xBloomSensitivity));
	BC.xyz = _557;
	float _559 = max(GS, 1.00000005e-03);
	vec3 _562 = BC.xyz / vec3(_559);
	BC.xyz = _562;
	float _563 = GS - V_xCBT_Adjust;
	float _565 = max(0.00000000e+00, _563);
	BC[3] = _565;
	vec3 _568 = BC.xyz * vec3(BC.w);
	BC.xyz = _568;
	bool _573 = V_xAuto_Bloom == 2;
	bool _575 = V_xAuto_Bloom == 4;
	bool _576 = _573 || _575;
	if (_576)
	{
		float _578 = 0.00000000e+00 + Saturate_B;
		float _580 = mix(_578, 1.00000000e+00, AL);
		float _581 = Saturate_A * _580;
		Saturate_A = _581;
	}
	bool _586 = V_xAuto_Bloom == 3;
	bool _588 = V_xAuto_Bloom == 5;
	bool _589 = _586 || _588;
	if (_589)
	{
		float _591 = 2.00000000e+00 - Saturate_B;
		float _593 = mix(_591, 1.00000000e+00, AL);
		float _594 = Saturate_A * _593;
		Saturate_A = _594;
	}
	float _596 = min(1.00000000e+01, Saturate_A);
	vec3 _600 = mix(vec3(BC.w), BC.xyz, vec3(_596));
	BC.xyz = _600;
	vec3 _602 = clamp(BC.xyz, 0.0, 1.0);
	return _602;
}
void F_xPS_CurrentInfo(
	in vec4 pos,
	in vec2 texcoords,
	out vec4 Color)
{
	vec4 _608 = texture(V_xBackBuffer, texcoords);
	vec4 _609;
	_609 = _608;
	vec3 _610 = F_xColor_GS(_609);
	vec4 _615 = vec4(_610.x, _610.y, _610.z, 0.00000000e+00);
	Color = _615;
	return;
}
vec4 F_xBloom(
	in vec2 Coord,
	in float texsize,
	in sampler2D InputTex,
	in int Dir)
{
	S_xBloomData Bloom = _622;
	float _624;
	_624 = texsize;
	vec2 _625 = F_xGetPixelSize(_624);
	Bloom.Pixelsize = _625;
	float _627 = V_xBloom_Spread * 5.00000000e-01;
	Bloom.Offset = _627;
	int i_629 = 1;
	while (i_629 < 8)
	{
		{
			float _642 = Bloom.Offset * Bloom.Pixelsize.x;
			vec2 _644 = vec2(_642, 0.00000000e+00);
			float _647 = Bloom.Offset * Bloom.Pixelsize.y;
			vec2 _649 = vec2(0.00000000e+00, _647);
			vec2 _651 = compCond(bvec2(ivec2(Dir)), _644, _649);
			vec2 D = _651;
			int _654 = 8 - i_629;
			int _655 = abs(_654);
			float _657 = pow(float(_655), V_xBloomCurve);
			Bloom.Weight = _657;
			vec2 _658 = Coord + D;
			vec4 _663 = vec4(_658.x, _658.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _664 = textureLod(InputTex, _663.xy, _663.w);
			vec4 _666 = _664 * vec4(Bloom.Weight);
			vec4 _668 = Bloom.Blur + _666;
			Bloom.Blur = _668;
			vec2 _669 = Coord - D;
			vec4 _674 = vec4(_669.x, _669.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _675 = textureLod(InputTex, _674.xy, _674.w);
			vec4 _677 = _675 * vec4(Bloom.Weight);
			vec4 _679 = Bloom.Blur + _677;
			Bloom.Blur = _679;
			float _681 = Bloom.Offset + V_xBloom_Spread;
			Bloom.Offset = _681;
			float _684 = Bloom.WeightSum + Bloom.Weight;
			Bloom.WeightSum = _684;
		}
		int _638 = i_629;
		int _639 = _638 + 1;
		i_629 = _639;
	}
	float _687 = Bloom.WeightSum * 2.00000000e+00;
	vec4 _690 = Bloom.Blur / vec4(_687);
	Bloom.Blur = _690;
	return _690;
}
vec4 F_xPS_BloomH_A(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _695;
	float _696;
	int _697;
	_695 = Coord;
	_696 = 2.00000000e+00;
	_697 = 1;
	vec4 _700 = F_xBloom(_695, _696, V_xSamplerCurrBB, _697);
	return _700;
}
vec4 F_xPS_BloomV_A(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _705;
	float _706;
	int _707;
	_705 = Coord;
	_706 = 2.00000000e+00;
	_707 = 0;
	vec4 _710 = F_xBloom(_705, _706, V_xTextureBloomH_A, _707);
	return _710;
}
vec4 F_xPS_BloomH_B(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _715;
	float _716;
	int _717;
	_715 = Coord;
	_716 = 8.00000000e+00;
	_717 = 1;
	vec4 _720 = F_xBloom(_715, _716, V_xTextureBloomV_A, _717);
	return _720;
}
vec4 F_xPS_BloomV_B(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _725;
	float _726;
	int _727;
	_725 = Coord;
	_726 = 8.00000000e+00;
	_727 = 0;
	vec4 _730 = F_xBloom(_725, _726, V_xTextureBloomH_B, _727);
	return _730;
}
vec4 F_xPS_BloomH_C(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _735;
	float _736;
	int _737;
	_735 = Coord;
	_736 = 1.60000000e+01;
	_737 = 1;
	vec4 _740 = F_xBloom(_735, _736, V_xTextureBloomV_B, _737);
	return _740;
}
vec4 F_xPS_BloomV_C(
	in vec4 pos,
	in vec2 Coord)
{
	vec2 _745;
	float _746;
	int _747;
	_745 = Coord;
	_746 = 1.60000000e+01;
	_747 = 0;
	vec4 _750 = F_xBloom(_745, _746, V_xTextureBloomH_C, _747);
	return _750;
}
vec4 F_xFinal_Bloom(
	in vec4 pos,
	in vec2 texcoords)
{
	vec4 _755 = texture(V_xBackBuffer, texcoords);
	vec3 LP = _755.xyz;
	float _758;
	_758 = 2.00000000e+00;
	vec2 _760 = F_xGetPixelSize(_758);
	vec2 _761;
	vec2 _762;
	_761 = texcoords;
	_762 = _760;
	vec4 _763 = F_xSimpleBlur(V_xTextureBloomH_A, _761, _762);
	vec4 Bloom_765 = _763.xyzw;
	float _766;
	_766 = 2.00000000e+00;
	vec2 _768 = F_xGetPixelSize(_766);
	vec2 _769;
	vec2 _770;
	_769 = texcoords;
	_770 = _768;
	vec4 _771 = F_xSimpleBlur(V_xTextureBloomV_A, _769, _770);
	vec4 _773 = Bloom_765 + _771.xyzw;
	Bloom_765 = _773;
	float _774;
	_774 = 4.00000000e+00;
	vec2 _776 = F_xGetPixelSize(_774);
	vec2 _777;
	vec2 _778;
	_777 = texcoords;
	_778 = _776;
	vec4 _779 = F_xSimpleBlur(V_xTextureBloomH_B, _777, _778);
	vec4 _781 = Bloom_765 + _779.xyzw;
	Bloom_765 = _781;
	float _782;
	_782 = 4.00000000e+00;
	vec2 _784 = F_xGetPixelSize(_782);
	vec2 _785;
	vec2 _786;
	_785 = texcoords;
	_786 = _784;
	vec4 _787 = F_xSimpleBlur(V_xTextureBloomV_B, _785, _786);
	vec4 _789 = Bloom_765 + _787.xyzw;
	Bloom_765 = _789;
	float _790;
	_790 = 8.00000000e+00;
	vec2 _792 = F_xGetPixelSize(_790);
	vec2 _793;
	vec2 _794;
	_793 = texcoords;
	_794 = _792;
	vec4 _795 = F_xSimpleBlur(V_xTextureBloomH_C, _793, _794);
	vec4 _797 = Bloom_765 + _795.xyzw;
	Bloom_765 = _797;
	float _798;
	_798 = 8.00000000e+00;
	vec2 _800 = F_xGetPixelSize(_798);
	vec2 _801;
	vec2 _802;
	_801 = texcoords;
	_802 = _800;
	vec4 _803 = F_xSimpleBlur(V_xTextureBloomV_C, _801, _802);
	vec4 _805 = Bloom_765 + _803.xyzw;
	Bloom_765 = _805;
	float _809 = mix(0.00000000e+00, 1.00000000e+01, V_xBloom_Intensity.x);
	float _811 = _809 / 6.00000000e+00;
	vec4 _813 = Bloom_765 * vec4(_811);
	Bloom_765 = _813;
	vec3 _815 = Bloom_765.xyz - LP;
	vec3 _817 = max(_815, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _820 = mix(Bloom_765.xyz, _817, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec4 _825 = vec4(_820.x, _820.y, _820.z, 0.00000000e+00);
	return _825;
}
vec3 F_xGreen_Blue(
	in float interpolant)
{
	bool _833 = interpolant < 5.00000000e-01;
	if (_833)
	{
		float _835 = 2.00000000e+00 * interpolant;
		vec3 _838 = vec3(0.00000000e+00, 1.00000000e+00, _835);
		return _838;
	}
	else
	{
		float _840 = 2.00000000e+00 * interpolant;
		float _842 = 2.00000000e+00 - _840;
		vec3 _845 = vec3(0.00000000e+00, _842, 1.00000000e+00);
		return _845;
	}
}
vec3 F_xRed_Green(
	in float interpolant)
{
	bool _853 = interpolant < 5.00000000e-01;
	if (_853)
	{
		float _855 = 2.00000000e+00 * interpolant;
		vec3 _858 = vec3(1.00000000e+00, _855, 0.00000000e+00);
		return _858;
	}
	else
	{
		float _860 = 2.00000000e+00 * interpolant;
		float _862 = 2.00000000e+00 - _860;
		vec3 _865 = vec3(_862, 1.00000000e+00, 0.00000000e+00);
		return _865;
	}
}
vec3 F_xFHeat(
	in float interpolant)
{
	float invertedInterpolant = interpolant;
	bool _874 = invertedInterpolant < 5.00000000e-01;
	if (_874)
	{
		float _876 = 2.00000000e+00 * invertedInterpolant;
		float _878 = 1.00000000e+00 - _876;
		float remappedFirstHalf = _878;
		float _880;
		_880 = remappedFirstHalf;
		vec3 _881 = F_xGreen_Blue(_880);
		return _881;
	}
	else
	{
		float _883 = 2.00000000e+00 * invertedInterpolant;
		float _885 = 2.00000000e+00 - _883;
		float remappedSecondHalf = _885;
		float _887;
		_887 = remappedSecondHalf;
		vec3 _888 = F_xRed_Green(_887);
		return _888;
	}
}
vec3 F_xHeatMap(
	in float interpolant)
{
	bool _896 = interpolant < 1.66666672e-01;
	if (_896)
	{
		float _898 = 6.00000000e+00 * interpolant;
		float firstSegmentInterpolant = _898;
		float _901 = 1.00000000e+00 - firstSegmentInterpolant;
		vec3 _904 = vec3(_901) * vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		vec3 _907 = vec3(firstSegmentInterpolant) * vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
		vec3 _908 = _904 + _907;
		return _908;
	}
	else
	{
		bool _913 = interpolant < 8.33333313e-01;
		if (_913)
		{
			float _915 = 6.00000000e+00 * interpolant;
			float _917 = _915 - 1.00000000e+00;
			float _919 = 2.50000000e-01 * _917;
			float midInterpolant = _919;
			float _921;
			_921 = midInterpolant;
			vec3 _922 = F_xFHeat(_921);
			return _922;
		}
		else
		{
			float _924 = 6.00000000e+00 * interpolant;
			float _926 = _924 - 5.00000000e+00;
			float lastSegmentInterpolant = _926;
			float _929 = 1.00000000e+00 - lastSegmentInterpolant;
			vec3 _932 = vec3(_929) * vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			vec3 _935 = vec3(lastSegmentInterpolant) * vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			vec3 _936 = _932 + _935;
			return _936;
		}
	}
}
float F_xScale(
	in float val,
	in float _max,
	in float _min)
{
	float _942 = val - _min;
	float _943 = _max - _min;
	float _944 = _942 / _943;
	return _944;
}
void F_xGN(
	inout float Noise,
	in vec2 TC,
	in float seed)
{
	float _951 = seed + 1.00000000e+01;
	float _953 = _951 + 1.61803409e-01;
	vec2 _955 = TC * vec2(_953);
	float _957 = distance(_955, vec2(1.61803409e-01, 3.14159274e-01));
	float _958 = tan(_957);
	float _960 = _958 * 1.41421354e+00;
	float _962 = _960 * 1.00000000e+04;
	float _963 = fract(_962);
	Noise = _963;
	return;
}
vec4 F_xHDROut(
	in vec2 texcoords)
{
	vec4 Out = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _969;
	_969 = 1.00000000e+00;
	vec2 _971 = F_xGetPixelSize(_969);
	vec2 _972;
	vec2 _973;
	_972 = texcoords;
	_973 = _971;
	vec4 _974 = F_xSimpleBlur(V_xTextureBloom, _972, _973);
	vec4 Bloom_976 = _974.xyzw;
	vec2 _979 = vec2(1.00000000e+01, 1.00000000e+01) * texcoords.xy;
	vec2 _981 = _979 - vec2(5.00000000e+00, 5.00000000e+00);
	vec2 TC_982 = _981;
	vec3 _983 = F_xAuto_Luma();
	float AL_985 = _983.y;
	float Ex = 0.00000000e+00;
	bool _992 = V_xAuto_Exposure >= 1;
	if (_992)
	{
		Ex = V_xExp;
	}
	else
	{
		float _993;
		float _994;
		float _995;
		_993 = V_xExp;
		_994 = 4.00000000e+00;
		_995 = -4.00000000e+00;
		float _998 = F_xScale(_993, _994, _995);
		float _1001 = mix(0.00000000e+00, 2.50000000e+00, _998);
		Ex = _1001;
	}
	float NC = V_xBloom_Intensity.y;
	bool _1008 = V_xAuto_Bloom == 1;
	bool _1010 = V_xAuto_Bloom == 4;
	bool _1011 = _1008 || _1010;
	bool _1013 = V_xAuto_Bloom == 5;
	bool _1014 = _1011 || _1013;
	if (_1014)
	{
		vec3 _1015 = F_xAuto_Luma();
		float _1018 = max(2.50000000e-01, _1015.x);
		float _1019 = NC * _1018;
		NC = _1019;
	}
	vec3 Noise_1021 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 iFast = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 iReinhard = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 iReinhardLuma = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _1028 = texture(V_xBackBuffer, texcoords);
	vec3 Color_1030 = _1028.xyz;
	float _1031;
	vec2 _1032;
	float _1033;
	_1031 = Noise_1021.x;
	_1032 = TC_982;
	_1033 = 1.00000000e+00;
	F_xGN(_1031, _1032, _1033);
	Noise_1021[0] = _1031;
	float _1037;
	vec2 _1038;
	float _1039;
	_1037 = Noise_1021.y;
	_1038 = TC_982;
	_1039 = 2.00000000e+00;
	F_xGN(_1037, _1038, _1039);
	Noise_1021[1] = _1037;
	float _1043;
	vec2 _1044;
	float _1045;
	_1043 = Noise_1021.z;
	_1044 = TC_982;
	_1045 = 3.00000000e+00;
	F_xGN(_1043, _1044, _1045);
	Noise_1021[2] = _1043;
	vec3 _1052 = smoothstep(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.00000001e-01, 1.00000001e-01, 1.00000001e-01), Bloom_976.xyz);
	vec3 SS = _1052;
	float _1054 = clamp(V_xDither_Bloom, 0.0, 1.0);
	float _1057 = mix(0.00000000e+00, 1.00000001e-01, _1054);
	vec3 _1059 = SS * vec3(_1057);
	SS = _1059;
	vec3 _1060 = Noise_1021 * SS;
	vec3 _1062 = Bloom_976.xyz + _1060;
	vec3 _1063 = clamp(_1062, 0.0, 1.0);
	Bloom_976.xyz = _1063;
	float _1064 = clamp(NC, 0.0, 1.0);
	vec3 _1068 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), Bloom_976.xyz, vec3(_1064));
	Bloom_976.xyz = _1068;
	bool _1073 = V_xTonemappers >= 1;
	if (_1073)
	{
		vec3 _1074;
		_1074 = Color_1030;
		float _1075 = F_xLuma(_1074);
		vec3 _1078 = mix(vec3(_1075), Color_1030, vec3(V_xSaturate));
		Color_1030 = _1078;
	}
	bool _1083 = V_xGamma > 1.00000000e+00;
	if (_1083)
	{
		vec3 _1084 = abs(Color_1030);
		vec3 _1086 = pow(_1084, vec3(V_xGamma));
		Color_1030 = _1086;
	}
	bool _1090 = !bool(V_xBloom_BA_iToneMapper);
	if (_1090)
	{
		vec3 _1092 = Color_1030 + Bloom_976.xyz;
		Color_1030 = _1092;
	}
	vec3 _1094 = max(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), Color_1030);
	Color_1030 = _1094;
	bool _1099 = V_xInv_Tonemappers == 1;
	if (_1099)
	{
		float _1101 = 1.00000000e+00 - V_xHDR_BP;
		vec4 _1105 = vec4(Color_1030.x, Color_1030.y, Color_1030.z, _1101);
		vec4 _1106;
		int _1107;
		_1106 = _1105;
		_1107 = 0;
		vec3 _1109 = F_xinv_Tonemapper(_1106, _1107);
		Color_1030 = _1109;
	}
	else
	{
		bool _1114 = V_xInv_Tonemappers == 2;
		if (_1114)
		{
			float _1116 = 1.00000000e+00 - V_xHDR_BP;
			vec4 _1120 = vec4(Color_1030.x, Color_1030.y, Color_1030.z, _1116);
			vec4 _1121;
			int _1122;
			_1121 = _1120;
			_1122 = 2;
			vec3 _1124 = F_xinv_Tonemapper(_1121, _1122);
			Color_1030 = _1124;
		}
		else
		{
			bool _1129 = V_xInv_Tonemappers == 3;
			if (_1129)
			{
				float _1131 = 1.00000000e+00 - V_xHDR_BP;
				vec4 _1135 = vec4(Color_1030.x, Color_1030.y, Color_1030.z, _1131);
				vec4 _1136;
				int _1137;
				_1136 = _1135;
				_1137 = 1;
				vec3 _1139 = F_xinv_Tonemapper(_1136, _1137);
				Color_1030 = _1139;
			}
		}
	}
	if (V_xBloom_BA_iToneMapper)
	{
		vec3 _1144 = Color_1030 + Bloom_976.xyz;
		Color_1030 = _1144;
	}
	bool _1149 = V_xAuto_Exposure >= 1;
	if (_1149)
	{
		float _1150;
		float _1151;
		float _1152;
		_1150 = AL_985;
		_1151 = Ex;
		_1152 = V_xGreyValue;
		float _1153 = F_xCalcExposedColor(_1150, _1151, _1152);
		Ex = _1153;
	}
	else
	{
		Ex = Ex;
	}
	bool _1158 = V_xTonemappers == 0;
	if (_1158)
	{
		vec3 _1159;
		float _1160;
		_1159 = Color_1030;
		_1160 = Ex;
		vec3 _1161 = F_xTimothyTonemapper(_1159, _1160);
		Color_1030 = _1161;
	}
	else
	{
		bool _1166 = V_xTonemappers == 1;
		if (_1166)
		{
			vec3 _1167;
			float _1168;
			_1167 = Color_1030;
			_1168 = Ex;
			vec3 _1169 = F_xACESFitted(_1167, _1168);
			Color_1030 = _1169;
		}
	}
	bool _1174 = V_xGamma > 1.00000000e+00;
	if (_1174)
	{
		vec3 _1175 = abs(Color_1030);
		float _1177 = 1.0 / 2.20000005e+00;
		vec3 _1179 = pow(_1175, vec3(_1177));
		Color_1030 = _1179;
	}
	float MD = 0.00000000e+00;
	bool _1186 = V_xTonemappers >= 1;
	if (_1186)
	{
		vec3 _1188 = Color_1030 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		vec3 _1190 = _1188 * vec3(V_xContrast);
		vec3 _1192 = _1190 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		Color_1030 = _1192;
	}
	bool _1197 = V_xDebug_View == 0;
	if (_1197)
	{
		vec4 _1202 = vec4(Color_1030.x, Color_1030.y, Color_1030.z, 1.00000000e+00);
		Out = _1202;
	}
	else
	{
		bool _1207 = V_xDebug_View == 1;
		if (_1207)
		{
			Out = Bloom_976;
		}
		else
		{
			bool _1212 = V_xDebug_View == 2;
			if (_1212)
			{
				bool _1215 = texcoords.y < 9.75000024e-01;
				vec3 _1216;
				_1216 = Color_1030;
				float _1217 = F_xLuma(_1216);
				float _1218;
				_1218 = _1217;
				vec3 _1219 = F_xHeatMap(_1218);
				float _1220;
				_1220 = texcoords.x;
				vec3 _1222 = F_xHeatMap(_1220);
				vec3 _1224 = compCond(bvec3(_1215), _1219, _1222);
				Out = _1224.xyzz;
			}
		}
	}
	float _1228 = texcoords.x * 7.50000000e-01;
	float _1230 = _1228 + 1.25000000e-01;
	texcoords[0] = _1230;
	vec2 _1233 = vec2(texcoords.x, texcoords.y);
	vec2 _1235 = vec2(1.00000000e+00, 1.00000000e+00) - _1233;
	vec2 _1236 = texcoords * _1235;
	texcoords = _1236;
	float _1239 = texcoords.x * texcoords.y;
	float _1241 = _1239 * 1.50000000e+01;
	float vignette = _1241;
	float _1245 = smoothstep(0.00000000e+00, 1.00000000e+00, vignette);
	vec3 _1246 = F_xAuto_Luma();
	float _1249 = _1246.y * 2.00000000e+00;
	float _1250 = pow(_1245, _1249);
	float Mfactor = _1250;
	bool _1256 = V_xAuto_Exposure > 1;
	if (_1256)
	{
		float _1257 = clamp(Mfactor, 0.0, 1.0);
		float _1260 = mix(0.00000000e+00, 1.00000000e+00, _1257);
		vec3 _1261 = F_xAuto_Luma();
		float _1264 = mix(1.00000000e+00, _1260, _1261.z);
		vignette = _1264;
	}
	else
	{
		vignette = 1.00000000e+00;
	}
	vec3 _1268 = Out.xyz * vec3(vignette);
	vec4 _1273 = vec4(_1268.x, _1268.y, _1268.z, 1.00000000e+00);
	return _1273;
}
float F_xPS_StoreInfo(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1278 = texture(V_xSamplerTA, texcoord);
	return _1278.x;
}
vec4 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float PosX = 9.52499986e-01;
	float PosY = 9.74999964e-01;
	vec2 _1288;
	_1288 = texcoord;
	vec4 _1289 = F_xHDROut(_1288);
	vec3 Color_1291 = _1289.xyz;
	vec4 _1296 = vec4(Color_1291.x, Color_1291.y, Color_1291.z, 1.00000000e+00);
	return _1296;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _1303 = id == 2u;
	float _1306 = _1303 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _1306;
	bool _1308 = id == 1u;
	float _1311 = _1308 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _1311;
	vec2 _1313 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1315 = _1313 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1320 = vec4(_1315.x, _1315.y, 0.00000000e+00, 1.00000000e+00);
	position = _1320;
	return;
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
#ifdef E_xPS_StoreInfo
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_StoreInfo(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_CurrentInfo
in vec2 vv_0;
layout(location = 0) out vec4 _out_Color;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 Color;
	F_xPS_CurrentInfo(pos, texcoords, Color);
	_out_Color = Color;
	return;
}
#endif
#ifdef E_xPS_BloomH_A
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomH_A(pos, Coord);
	return;
}
#endif
#ifdef E_xPS_BloomV_A
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomV_A(pos, Coord);
	return;
}
#endif
#ifdef E_xPS_BloomH_B
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomH_B(pos, Coord);
	return;
}
#endif
#ifdef E_xPS_BloomV_B
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomV_B(pos, Coord);
	return;
}
#endif
#ifdef E_xPS_BloomH_C
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomH_C(pos, Coord);
	return;
}
#endif
#ifdef E_xPS_BloomV_C
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 Coord = vv_0;
	_return = F_xPS_BloomV_C(pos, Coord);
	return;
}
#endif
#ifdef E_xFinal_Bloom
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xFinal_Bloom(pos, texcoords);
	return;
}
#endif
#ifdef E_xDownsample
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xDownsample(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_Temporal_Adaptation
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Temporal_Adaptation(pos, texcoord);
	return;
}
#endif
#ifdef E_xOut
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xOut(position, texcoord);
	return;
}
#endif
