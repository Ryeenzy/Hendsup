#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xOut
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
uniform float V_xClamping_Adjust;
uniform float V_xPersistence;
uniform float V_xSimilarity;
uniform int V_xDelta;
uniform float V_xDelta_Power;
uniform int V_xDebug;
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform float V_xDepth_CutOff;
uniform bool V_xDepth_Map_Flip;
uniform uint V_xframecount;
uniform float V_xtimer;

uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xCBackBuffer;
uniform sampler2D V_xCDepthBuffer;
uniform sampler2D V_xPBackBuffer;
uniform sampler2D V_xPSBackBuffer;
uniform sampler2D V_xPSDepthBuffer;
const vec2 _198[8] = vec2[8](vec2(0.00000000e+00, 9.25925910e-04), vec2(0.00000000e+00, -9.25925910e-04), vec2(5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, -9.25925910e-04), vec2(5.20833360e-04, -9.25925910e-04), vec2(-5.20833360e-04, 9.25925910e-04), vec2(5.20833360e-04, 9.25925910e-04));
vec2 F_xDepthM(
	in vec2 texcoord)
{
	if (V_xDepth_Map_Flip)
	{
		float _35 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _35;
	}
	vec4 _36 = texture(V_xDepthBuffer, texcoord);
	float zBuffer = _36.x;
	float Far = 1.00000000e+00;
	float _42 = 1.25000000e-01 / V_xDepth_Map_Adjust;
	float Near = _42;
	float _45 = 1.00000000e+00 - zBuffer;
	vec2 _46 = vec2(zBuffer, _45);
	vec2 Z = _46;
	bool _52 = V_xDepth_Map == 0;
	if (_52)
	{
		float _53 = Far * Near;
		float _54 = Near - Far;
		float _56 = Z.x * _54;
		float _57 = Far + _56;
		float _58 = _53 / _57;
		zBuffer = _58;
	}
	else
	{
		bool _63 = V_xDepth_Map == 1;
		if (_63)
		{
			float _64 = Far * Near;
			float _65 = Near - Far;
			float _67 = Z.y * _65;
			float _68 = Far + _67;
			float _69 = _64 / _68;
			zBuffer = _69;
		}
	}
	float _72 = smoothstep(0.00000000e+00, 1.00000000e+00, zBuffer);
	float _73 = abs(V_xDepth_CutOff);
	float _74 = step(_72, _73);
	vec2 _75 = vec2(_74, zBuffer);
	return _75;
}
vec4 F_xBB_H(
	in vec2 TC)
{
	vec4 _79 = texture(V_xBackBuffer, TC);
	return _79;
}
vec3 F_xencodePalYuv(
	in vec3 rgb)
{
	vec3 RGB2Y = vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01);
	vec3 RGB2Cb = vec3(-1.69000000e-01, -3.31000000e-01, 5.00000000e-01);
	vec3 RGB2Cr = vec3(5.00000000e-01, -4.19000000e-01, -8.10000002e-02);
	float _89 = dot(rgb, RGB2Y);
	float _90 = dot(rgb, RGB2Cb);
	float _91 = dot(rgb, RGB2Cr);
	vec3 _92 = vec3(_89, _90, _91);
	return _92;
}
vec3 F_xdecodePalYuv(
	in vec3 ycc)
{
	vec3 YCbCr2R = vec3(1.00000000e+00, 0.00000000e+00, 1.39999998e+00);
	vec3 YCbCr2G = vec3(1.00000000e+00, -3.42999995e-01, -7.11000025e-01);
	vec3 YCbCr2B = vec3(1.00000000e+00, 1.76499999e+00, 0.00000000e+00);
	float _102 = dot(ycc, YCbCr2R);
	float _103 = dot(ycc, YCbCr2G);
	float _104 = dot(ycc, YCbCr2B);
	vec3 _105 = vec3(_102, _103, _104);
	return _105;
}
vec4 F_xTAA(
	in vec2 texcoord)
{
	float _109 = abs(V_xSimilarity);
	float _111 = 1.00000000e+00 - _109;
	float M_Similarity = _111;
	vec2 _113;
	_113 = texcoord;
	vec2 _114 = F_xDepthM(_113);
	vec4 _115 = texture(V_xPSDepthBuffer, texcoord);
	float _118 = _114.y / _115.x;
	float _119 = abs(_118);
	float _121 = pow(_119, 1.00000000e+02);
	float _122 = _121 + M_Similarity;
	float _123 = clamp(_122, 0.0, 1.0);
	float D_Similarity = _123;
	float _127 = mix(1.00000000e+00, 8.00000000e+01, V_xDelta_Power);
	float _129 = 1.25000000e+01 * _127;
	float S_Velocity = _129;
	vec2 _131;
	_131 = texcoord;
	vec2 _132 = F_xDepthM(_131);
	vec4 _133 = texture(V_xPSDepthBuffer, texcoord);
	float _136 = distance(_132.y, _133.x);
	float _137 = _136 * S_Velocity;
	float _138 = clamp(_137, 0.0, 1.0);
	float V_Buffer = _138;
	float _141 = 1.00000000e+00 - V_xPersistence;
	float Per = _141;
	vec4 _147 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _148 = textureLod(V_xPBackBuffer, _147.xy, _147.w);
	vec4 PastColor = _148;
	float _151 = 1.00000000e+00 - Per;
	vec4 _152 = texture(V_xBackBuffer, texcoord);
	vec4 _154 = vec4(_151) * _152;
	vec4 _156 = vec4(Per) * PastColor;
	vec4 _157 = _154 + _156;
	PastColor = _157;
	vec3 antialiased = PastColor.xyz;
	float _162 = min(PastColor.w, 5.00000000e-01);
	float mixRate = _162;
	float MB = V_xClamping_Adjust;
	vec4 _165 = texture(V_xBackBuffer, texcoord);
	vec3 BB = _165.xyz;
	vec3 _168 = antialiased * antialiased;
	vec3 _169 = BB * BB;
	vec3 _171 = mix(_168, _169, vec3(mixRate));
	antialiased = _171;
	vec3 _172 = sqrt(antialiased);
	antialiased = _172;
	vec4 _173 = texture(V_xBackBuffer, texcoord);
	vec3 _174;
	_174 = _173.xyz;
	vec3 _176 = F_xencodePalYuv(_174);
	vec3 _178 = _176 - vec3(MB);
	vec3 minColor = _178;
	vec4 _180 = texture(V_xBackBuffer, texcoord);
	vec3 _181;
	_181 = _180.xyz;
	vec3 _183 = F_xencodePalYuv(_181);
	vec3 _185 = _183 + vec3(MB);
	vec3 maxColor = _185;
	int i = 1;
	while (i < 8)
	{
		{
			vec2 _200 = texcoord + _198[int(i)];
			vec4 _205 = vec4(_200.x, _200.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _206 = textureLod(V_xBackBuffer, _205.xy, _205.w);
			vec3 _207;
			_207 = _206.xyz;
			vec3 _209 = F_xencodePalYuv(_207);
			vec3 _210 = min(minColor, _209);
			vec3 _212 = _210 - vec3(MB);
			minColor = _212;
			vec2 _215 = texcoord + _198[int(i)];
			vec4 _220 = vec4(_215.x, _215.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _221 = textureLod(V_xBackBuffer, _220.xy, _220.w);
			vec3 _222;
			_222 = _221.xyz;
			vec3 _224 = F_xencodePalYuv(_222);
			vec3 _225 = max(maxColor, _224);
			vec3 _227 = _225 + vec3(MB);
			maxColor = _227;
		}
		int _197 = i + 1;
		i = _197;
	}
	vec3 _228;
	_228 = antialiased;
	vec3 _229 = F_xencodePalYuv(_228);
	vec3 _230 = clamp(_229, minColor, maxColor);
	antialiased = _230;
	float _232 = 1.00000000e+00 / mixRate;
	float _234 = _232 + 1.00000000e+00;
	float _235 = 1.0 / _234;
	mixRate = _235;
	vec4 _236 = texture(V_xPSBackBuffer, texcoord);
	vec3 _238 = BB - _236.xyz;
	float _239 = length(_238);
	float _242 = mix(1.00000000e+00, 8.00000000e+00, V_xDelta_Power);
	float _243 = _239 * _242;
	float diff = _243;
	bool _249 = V_xDelta == 1;
	if (_249)
	{
		diff = V_Buffer;
	}
	float clampAmount = diff;
	float _251 = mixRate + clampAmount;
	mixRate = _251;
	float _254 = clamp(mixRate, 5.00000007e-02, 5.00000000e-01);
	mixRate = _254;
	vec3 _255;
	_255 = antialiased;
	vec3 _256 = F_xdecodePalYuv(_255);
	antialiased = _256;
	bool _258 = V_xSimilarity > 0.00000000e+00;
	vec4 _263 = vec4(BB.x, BB.y, BB.z, 1.00000000e+00);
	vec4 _267 = vec4(antialiased.x, antialiased.y, antialiased.z, mixRate);
	vec4 _269 = mix(_263, _267, vec4(D_Similarity));
	vec3 _271 = mix(BB, antialiased, vec3(D_Similarity));
	vec4 _275 = vec4(_271.x, _271.y, _271.z, mixRate);
	vec4 _277 = compCond(bvec4(_258), _269, _275);
	vec4 Output = _277;
	bool _283 = V_xDebug == 1;
	if (_283)
	{
		Output = vec4(diff);
	}
	else
	{
		bool _289 = V_xDebug == 2;
		if (_289)
		{
			vec3 _293 = mix(vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), Output.xyz, vec3(D_Similarity));
			Output = _293.xyzz;
		}
		else
		{
			bool _299 = V_xDebug == 3;
			if (_299)
			{
				vec2 _300;
				_300 = texcoord;
				vec2 _301 = F_xDepthM(_300);
				Output = vec4(_301.y);
			}
		}
	}
	return Output;
}
void F_xOut(
	in vec4 position,
	in vec2 texcoord,
	out vec4 color)
{
	float PosX = 9.52499986e-01;
	float PosY = 9.74999964e-01;
	float Scale = 2.00000000e+00;
	vec3 D = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 E = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 P = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 T = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 H = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 Three = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 DD = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 Dot = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 I = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 N = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 F = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 O = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _338;
	_338 = texcoord;
	vec4 _339 = F_xTAA(_338);
	vec4 T_A_A = _339;
	bool _345 = V_xtimer <= 1.25000000e+04;
	if (_345)
	{
		float _347 = -3.50000001e-02 + PosX;
		float PosXD = _347;
		float offsetD = 1.00000005e-03;
		float _352 = texcoord.x - PosXD;
		float _354 = texcoord.y - PosY;
		vec2 _355 = vec2(_352, _354);
		vec2 _356 = abs(_355);
		bvec2 _358 = lessThan(_356, vec2(2.49999994e-03, 8.99999961e-03));
		bool _359 = all(_358);
		vec3 OneD = vec3(bvec3(_359));
		float _363 = texcoord.x - PosXD;
		float _364 = _363 - offsetD;
		float _366 = texcoord.y - PosY;
		vec2 _367 = vec2(_364, _366);
		vec2 _368 = abs(_367);
		bvec2 _370 = lessThan(_368, vec2(2.49999994e-03, 7.00000022e-03));
		bool _371 = all(_370);
		vec3 TwoD = vec3(bvec3(_371));
		vec3 _374 = OneD - TwoD;
		D = _374;
		float _376 = -2.80000009e-02 + PosX;
		float PosXE = _376;
		float offsetE = 5.00000024e-04;
		float _381 = texcoord.x - PosXE;
		float _383 = texcoord.y - PosY;
		vec2 _384 = vec2(_381, _383);
		vec2 _385 = abs(_384);
		bvec2 _387 = lessThan(_385, vec2(3.00000003e-03, 8.99999961e-03));
		bool _388 = all(_387);
		vec3 OneE = vec3(bvec3(_388));
		float _392 = texcoord.x - PosXE;
		float _393 = _392 - offsetE;
		float _395 = texcoord.y - PosY;
		vec2 _396 = vec2(_393, _395);
		vec2 _397 = abs(_396);
		bvec2 _399 = lessThan(_397, vec2(2.49999994e-03, 7.00000022e-03));
		bool _400 = all(_399);
		vec3 TwoE = vec3(bvec3(_400));
		float _404 = texcoord.x - PosXE;
		float _406 = texcoord.y - PosY;
		vec2 _407 = vec2(_404, _406);
		vec2 _408 = abs(_407);
		bvec2 _410 = lessThan(_408, vec2(3.00000003e-03, 1.00000005e-03));
		bool _411 = all(_410);
		vec3 ThreeE = vec3(bvec3(_411));
		vec3 _414 = OneE - TwoE;
		vec3 _415 = _414 + ThreeE;
		E = _415;
		float _417 = -2.15000007e-02 + PosX;
		float PosXP = _417;
		float _420 = -2.49999994e-03 + PosY;
		float PosYP = _420;
		float offsetP = 1.00000005e-03;
		float offsetP1 = 2.00000009e-03;
		float _427 = texcoord.x - PosXP;
		float _429 = texcoord.y - PosYP;
		vec2 _430 = vec2(_427, _429);
		vec2 _431 = abs(_430);
		bvec2 _433 = lessThan(_431, vec2(2.49999994e-03, 6.97499933e-03));
		bool _434 = all(_433);
		vec3 OneP = vec3(bvec3(_434));
		float _438 = texcoord.x - PosXP;
		float _439 = _438 - offsetP;
		float _441 = texcoord.y - PosYP;
		vec2 _442 = vec2(_439, _441);
		vec2 _443 = abs(_442);
		bvec2 _445 = lessThan(_443, vec2(2.49999994e-03, 4.76000039e-03));
		bool _446 = all(_445);
		vec3 TwoP = vec3(bvec3(_446));
		float _450 = texcoord.x - PosXP;
		float _451 = _450 + offsetP1;
		float _453 = texcoord.y - PosY;
		vec2 _454 = vec2(_451, _453);
		vec2 _455 = abs(_454);
		bvec2 _457 = lessThan(_455, vec2(5.00000024e-04, 8.99999961e-03));
		bool _458 = all(_457);
		vec3 ThreeP = vec3(bvec3(_458));
		vec3 _461 = OneP - TwoP;
		vec3 _462 = _461 + ThreeP;
		P = _462;
		float _464 = -1.40000004e-02 + PosX;
		float PosXT = _464;
		float _467 = -8.00000038e-03 + PosY;
		float PosYT = _467;
		float _470 = texcoord.x - PosXT;
		float _472 = texcoord.y - PosYT;
		vec2 _473 = vec2(_470, _472);
		vec2 _474 = abs(_473);
		bvec2 _476 = lessThan(_474, vec2(3.00000003e-03, 1.00000005e-03));
		bool _477 = all(_476);
		vec3 OneT = vec3(bvec3(_477));
		float _481 = texcoord.x - PosXT;
		float _483 = texcoord.y - PosY;
		vec2 _484 = vec2(_481, _483);
		vec2 _485 = abs(_484);
		bvec2 _487 = lessThan(_485, vec2(6.24999986e-04, 8.99999961e-03));
		bool _488 = all(_487);
		vec3 TwoT = vec3(bvec3(_488));
		vec3 _491 = OneT + TwoT;
		T = _491;
		float _493 = -7.19999988e-03 + PosX;
		float PosXH = _493;
		float _496 = texcoord.x - PosXH;
		float _498 = texcoord.y - PosY;
		vec2 _499 = vec2(_496, _498);
		vec2 _500 = abs(_499);
		bvec2 _502 = lessThan(_500, vec2(2.00000009e-03, 1.00000005e-03));
		bool _503 = all(_502);
		vec3 OneH = vec3(bvec3(_503));
		float _507 = texcoord.x - PosXH;
		float _509 = texcoord.y - PosY;
		vec2 _510 = vec2(_507, _509);
		vec2 _511 = abs(_510);
		bvec2 _513 = lessThan(_511, vec2(2.00000009e-03, 8.99999961e-03));
		bool _514 = all(_513);
		vec3 TwoH = vec3(bvec3(_514));
		float _518 = texcoord.x - PosXH;
		float _520 = texcoord.y - PosY;
		vec2 _521 = vec2(_518, _520);
		vec2 _522 = abs(_521);
		bvec2 _524 = lessThan(_522, vec2(3.25000007e-03, 8.99999961e-03));
		bool _525 = all(_524);
		vec3 ThreeH = vec3(bvec3(_525));
		vec3 _528 = OneH - TwoH;
		vec3 _529 = _528 + ThreeH;
		H = _529;
		float offsetFive = 1.00000005e-03;
		float _533 = -1.00000005e-03 + PosX;
		float PosX3 = _533;
		float _536 = texcoord.x - PosX3;
		float _538 = texcoord.y - PosY;
		vec2 _539 = vec2(_536, _538);
		vec2 _540 = abs(_539);
		bvec2 _542 = lessThan(_540, vec2(2.00000009e-03, 8.99999961e-03));
		bool _543 = all(_542);
		vec3 OneThree = vec3(bvec3(_543));
		float _547 = texcoord.x - PosX3;
		float _548 = _547 - offsetFive;
		float _550 = texcoord.y - PosY;
		vec2 _551 = vec2(_548, _550);
		vec2 _552 = abs(_551);
		bvec2 _554 = lessThan(_552, vec2(3.00000003e-03, 7.00000022e-03));
		bool _555 = all(_554);
		vec3 TwoThree = vec3(bvec3(_555));
		float _559 = texcoord.x - PosX3;
		float _561 = texcoord.y - PosY;
		vec2 _562 = vec2(_559, _561);
		vec2 _563 = abs(_562);
		bvec2 _565 = lessThan(_563, vec2(2.00000009e-03, 1.00000005e-03));
		bool _566 = all(_565);
		vec3 ThreeThree = vec3(bvec3(_566));
		vec3 _569 = OneThree - TwoThree;
		vec3 _570 = _569 + ThreeThree;
		Three = _570;
		float _572 = 6.00000005e-03 + PosX;
		float PosXDD = _572;
		float offsetDD = 1.00000005e-03;
		float _577 = texcoord.x - PosXDD;
		float _579 = texcoord.y - PosY;
		vec2 _580 = vec2(_577, _579);
		vec2 _581 = abs(_580);
		bvec2 _583 = lessThan(_581, vec2(2.49999994e-03, 8.99999961e-03));
		bool _584 = all(_583);
		vec3 OneDD = vec3(bvec3(_584));
		float _588 = texcoord.x - PosXDD;
		float _589 = _588 - offsetDD;
		float _591 = texcoord.y - PosY;
		vec2 _592 = vec2(_589, _591);
		vec2 _593 = abs(_592);
		bvec2 _595 = lessThan(_593, vec2(2.49999994e-03, 7.00000022e-03));
		bool _596 = all(_595);
		vec3 TwoDD = vec3(bvec3(_596));
		vec3 _599 = OneDD - TwoDD;
		DD = _599;
		float _601 = 1.09999999e-02 + PosX;
		float PosXDot = _601;
		float _604 = 8.00000038e-03 + PosY;
		float PosYDot = _604;
		float _607 = texcoord.x - PosXDot;
		float _609 = texcoord.y - PosYDot;
		vec2 _610 = vec2(_607, _609);
		vec2 _611 = abs(_610);
		bvec2 _613 = lessThan(_611, vec2(7.50000007e-04, 1.50000001e-03));
		bool _614 = all(_613);
		vec3 OneDot = vec3(bvec3(_614));
		Dot = OneDot;
		float _618 = 1.54999997e-02 + PosX;
		float PosXI = _618;
		float _621 = 4.00000019e-03 + PosY;
		float PosYI = _621;
		float _624 = 8.00000038e-03 + PosY;
		float PosYII = _624;
		float _627 = texcoord.x - PosXI;
		float _629 = texcoord.y - PosY;
		vec2 _630 = vec2(_627, _629);
		vec2 _631 = abs(_630);
		bvec2 _633 = lessThan(_631, vec2(3.00000003e-03, 1.00000005e-03));
		bool _634 = all(_633);
		vec3 OneI = vec3(bvec3(_634));
		float _638 = texcoord.x - PosXI;
		float _640 = texcoord.y - PosYI;
		vec2 _641 = vec2(_638, _640);
		vec2 _642 = abs(_641);
		bvec2 _644 = lessThan(_642, vec2(6.24999986e-04, 4.99999989e-03));
		bool _645 = all(_644);
		vec3 TwoI = vec3(bvec3(_645));
		float _649 = texcoord.x - PosXI;
		float _651 = texcoord.y - PosYII;
		vec2 _652 = vec2(_649, _651);
		vec2 _653 = abs(_652);
		bvec2 _655 = lessThan(_653, vec2(3.00000003e-03, 1.00000005e-03));
		bool _656 = all(_655);
		vec3 ThreeI = vec3(bvec3(_656));
		vec3 _659 = OneI + TwoI;
		vec3 _660 = _659 + ThreeI;
		I = _660;
		float _662 = 2.25000009e-02 + PosX;
		float PosXN = _662;
		float _665 = 4.99999989e-03 + PosY;
		float PosYN = _665;
		float offsetN = -1.00000005e-03;
		float _670 = texcoord.x - PosXN;
		float _672 = texcoord.y - PosYN;
		vec2 _673 = vec2(_670, _672);
		vec2 _674 = abs(_673);
		bvec2 _676 = lessThan(_674, vec2(2.00000009e-03, 4.00000019e-03));
		bool _677 = all(_676);
		vec3 OneN = vec3(bvec3(_677));
		float _681 = texcoord.x - PosXN;
		float _683 = texcoord.y - PosYN;
		float _684 = _683 - offsetN;
		vec2 _685 = vec2(_681, _684);
		vec2 _686 = abs(_685);
		bvec2 _688 = lessThan(_686, vec2(3.00000003e-03, 4.99999989e-03));
		bool _689 = all(_688);
		vec3 TwoN = vec3(bvec3(_689));
		vec3 _692 = OneN - TwoN;
		N = _692;
		float _694 = 2.89999992e-02 + PosX;
		float PosXF = _694;
		float _697 = 4.00000019e-03 + PosY;
		float PosYF = _697;
		float offsetF = 5.00000024e-04;
		float offsetF1 = 1.00000005e-03;
		float _704 = texcoord.x - PosXF;
		float _705 = _704 - offsetF;
		float _707 = texcoord.y - PosYF;
		float _708 = _707 - offsetF1;
		vec2 _709 = vec2(_705, _708);
		vec2 _710 = abs(_709);
		bvec2 _712 = lessThan(_710, vec2(2.00000009e-03, 4.00000019e-03));
		bool _713 = all(_712);
		vec3 OneF = vec3(bvec3(_713));
		float _717 = texcoord.x - PosXF;
		float _719 = texcoord.y - PosYF;
		vec2 _720 = vec2(_717, _719);
		vec2 _721 = abs(_720);
		bvec2 _723 = lessThan(_721, vec2(2.49999994e-03, 4.99999989e-03));
		bool _724 = all(_723);
		vec3 TwoF = vec3(bvec3(_724));
		float _728 = texcoord.x - PosXF;
		float _730 = texcoord.y - PosYF;
		vec2 _731 = vec2(_728, _730);
		vec2 _732 = abs(_731);
		bvec2 _734 = lessThan(_732, vec2(1.50000001e-03, 7.50000007e-04));
		bool _735 = all(_734);
		vec3 ThreeF = vec3(bvec3(_735));
		vec3 _738 = OneF - TwoF;
		vec3 _739 = _738 + ThreeF;
		F = _739;
		float _741 = 3.50000001e-02 + PosX;
		float PosXO = _741;
		float _744 = 4.00000019e-03 + PosY;
		float PosYO = _744;
		float _747 = texcoord.x - PosXO;
		float _749 = texcoord.y - PosYO;
		vec2 _750 = vec2(_747, _749);
		vec2 _751 = abs(_750);
		bvec2 _753 = lessThan(_751, vec2(3.00000003e-03, 4.99999989e-03));
		bool _754 = all(_753);
		vec3 OneO = vec3(bvec3(_754));
		float _758 = texcoord.x - PosXO;
		float _760 = texcoord.y - PosYO;
		vec2 _761 = vec2(_758, _760);
		vec2 _762 = abs(_761);
		bvec2 _764 = lessThan(_762, vec2(2.00000009e-03, 3.00000003e-03));
		bool _765 = all(_764);
		vec3 TwoO = vec3(bvec3(_765));
		vec3 _768 = OneO - TwoO;
		O = _768;
		vec3 _769 = D + E;
		vec3 _770 = _769 + P;
		vec3 _771 = _770 + T;
		vec3 _772 = _771 + H;
		vec3 _773 = _772 + Three;
		vec3 _774 = _773 + DD;
		vec3 _775 = _774 + Dot;
		vec3 _776 = _775 + I;
		vec3 _777 = _776 + N;
		vec3 _778 = _777 + F;
		vec3 _779 = _778 + O;
		vec4 _784 = vec4(_779.x, _779.y, _779.z, 1.00000000e+00);
		float _787 = texcoord.y * 5.00000000e+01;
		float _789 = 1.00000000e+00 - _787;
		float _791 = _789 + 4.83499985e+01;
		vec4 _794 = compCond(bvec4(_784), vec4(_791), T_A_A);
		color = _794;
	}
	else
	{
		color = T_A_A;
	}
	return;
}
void F_xCurrent_BackBuffer(
	in vec4 position,
	in vec2 texcoord,
	out vec4 Color,
	out float Depth)
{
	vec2 _801;
	_801 = texcoord;
	vec4 _802 = F_xBB_H(_801);
	Color = _802;
	vec2 _803;
	_803 = texcoord;
	vec2 _804 = F_xDepthM(_803);
	Depth = _804.y;
	return;
}
void F_xPast_BackBuffer(
	in vec4 position,
	in vec2 texcoord,
	out vec4 PastSingleC,
	out float PastSingleD,
	out vec4 Past)
{
	vec4 _813 = texture(V_xCBackBuffer, texcoord);
	PastSingleC = _813.xyzw;
	vec4 _815 = texture(V_xCDepthBuffer, texcoord);
	PastSingleD = _815.x;
	vec2 _817;
	_817 = texcoord;
	vec4 _818 = F_xBB_H(_817);
	Past = _818;
	return;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _825 = id == 2u;
	float _828 = _825 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _828;
	bool _830 = id == 1u;
	float _833 = _830 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _833;
	vec2 _835 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _837 = _835 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _842 = vec4(_837.x, _837.y, 0.00000000e+00, 1.00000000e+00);
	position = _842;
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
#ifdef E_xCurrent_BackBuffer
in vec2 vv_0;
layout(location = 0) out vec4 _out_Color;
layout(location = 1) out float _out_Depth;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 Color;
	float Depth;
	F_xCurrent_BackBuffer(position, texcoord, Color, Depth);
	_out_Color = Color;
	_out_Depth = Depth;
	return;
}
#endif
#ifdef E_xOut
in vec2 vv_0;
layout(location = 0) out vec4 _out_color;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 color;
	F_xOut(position, texcoord, color);
	_out_color = color;
	return;
}
#endif
#ifdef E_xPast_BackBuffer
in vec2 vv_0;
layout(location = 0) out vec4 _out_PastSingleC;
layout(location = 1) out float _out_PastSingleD;
layout(location = 2) out vec4 _out_Past;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 PastSingleC;
	float PastSingleD;
	vec4 Past;
	F_xPast_BackBuffer(position, texcoord, PastSingleC, PastSingleD, Past);
	_out_PastSingleC = PastSingleC;
	_out_PastSingleD = PastSingleD;
	_out_Past = Past;
	return;
}
#endif
