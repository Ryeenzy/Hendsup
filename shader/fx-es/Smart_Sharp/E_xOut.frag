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
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform bool V_xDepth_Map_Flip;
uniform bool V_xNo_Depth_Map;
uniform float V_xSharpness;
uniform float V_xB_Grounding;
uniform bool V_xCAM_IOB;
uniform bool V_xCA_Mask_Boost;
uniform bool V_xCA_Removal;
uniform int V_xDebug_View;
uniform int V_xF_DeNoise;
uniform float V_xDenoise_Power;
uniform bool V_xClampSharp;
uniform float V_xtimer;

uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
const float _71[1] = float[1](0.00000000e+00);
float F_xDepth(
	in vec2 texcoord)
{
	if (V_xDepth_Map_Flip)
	{
		float _27 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _27;
	}
	vec4 _32 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _33 = textureLod(V_xDepthBuffer, _32.xy, _32.w);
	float zBuffer = _33.x;
	float Far = 1.00000000e+00;
	float _39 = 1.25000000e-01 / V_xDepth_Map_Adjust;
	float Near = _39;
	float _42 = 1.00000000e+00 - zBuffer;
	vec2 _43 = vec2(zBuffer, _42);
	vec2 Z = _43;
	bool _49 = V_xDepth_Map == 0;
	if (_49)
	{
		float _50 = Far * Near;
		float _51 = Near - Far;
		float _53 = Z.x * _51;
		float _54 = Far + _53;
		float _55 = _50 / _54;
		zBuffer = _55;
	}
	else
	{
		bool _60 = V_xDepth_Map == 1;
		if (_60)
		{
			float _61 = Far * Near;
			float _62 = Near - Far;
			float _64 = Z.y * _62;
			float _65 = Far + _64;
			float _66 = _61 / _65;
			zBuffer = _66;
		}
	}
	float _67 = clamp(zBuffer, 0.0, 1.0);
	return _67;
}
vec3 F_xRGBtoYCbCr(
	in vec3 rgb)
{
	float C[1] = _71;
	float _75 = 2.98999995e-01 * rgb.x;
	float _78 = 5.87000012e-01 * rgb.y;
	float _79 = _75 + _78;
	float _82 = 1.14000000e-01 * rgb.z;
	float _83 = _79 + _82;
	float Y = _83;
	float _87 = -1.69000000e-01 * rgb.x;
	float _90 = 3.31000000e-01 * rgb.y;
	float _91 = _87 - _90;
	float _94 = 5.00000000e-01 * rgb.z;
	float _95 = _91 + _94;
	float Cb = _95;
	float _99 = 5.00000000e-01 * rgb.x;
	float _102 = 4.19000000e-01 * rgb.y;
	float _103 = _99 - _102;
	float _106 = 8.10000002e-02 * rgb.z;
	float _107 = _103 - _106;
	float Cr = _107;
	float _110 = Cb + 5.01960814e-01;
	float _112 = Cr + 5.01960814e-01;
	vec3 _113 = vec3(Y, _110, _112);
	return _113;
}
vec3 F_xYCbCrtoRGB(
	in vec3 ycc)
{
	vec3 _118 = ycc - vec3(0.00000000e+00, 5.01960814e-01, 5.01960814e-01);
	vec3 c = _118;
	float _122 = 1.39999998e+00 * c.z;
	float _124 = c.x + _122;
	float R = _124;
	float _128 = 3.42999995e-01 * c.y;
	float _130 = c.x - _128;
	float _133 = 7.11000025e-01 * c.z;
	float _134 = _130 - _133;
	float G = _134;
	float _138 = 1.76499999e+00 * c.y;
	float _140 = c.x + _138;
	float B = _140;
	vec3 _142 = vec3(R, G, B);
	return _142;
}
float F_xMin3(
	in float x,
	in float y,
	in float z)
{
	float _148 = min(y, z);
	float _149 = min(x, _148);
	return _149;
}
float F_xMax3(
	in float x,
	in float y,
	in float z)
{
	float _155 = max(y, z);
	float _156 = max(x, _155);
	return _156;
}
float F_xnormpdf(
	in float x,
	in float sigma)
{
	float _162 = -5.00000000e-01 * x;
	float _163 = _162 * x;
	float _164 = sigma * sigma;
	float _165 = _163 / _164;
	float _166 = exp(_165);
	float _168 = 3.98939997e-01 * _166;
	float _169 = _168 / sigma;
	return _169;
}
float F_xnormpdf3(
	in vec3 v,
	in float sigma)
{
	float _174 = dot(v, v);
	float _176 = -5.00000000e-01 * _174;
	float _177 = sigma * sigma;
	float _178 = _176 / _177;
	float _179 = exp(_178);
	float _181 = 3.98939997e-01 * _179;
	float _182 = _181 / sigma;
	return _182;
}
vec3 F_xBB(
	in vec2 texcoord,
	in vec2 AD)
{
	vec2 _187 = texcoord + AD;
	vec4 _192 = vec4(_187.x, _187.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _193 = textureLod(V_xBackBuffer, _192.xy, _192.w);
	return _193.xyz;
}
float F_xLI(
	in vec3 RGB)
{
	float _199 = dot(RGB, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	return _199;
}
float F_xGT()
{
	float _204 = mix(1.00000000e+00, 5.00000000e-01, V_xB_Grounding);
	return _204;
}
float F_xMotionSharpen(
	in vec2 texcoord)
{
	return 0.00000000e+00;
}
vec4 F_xGetBBfetch(
	in vec2 texcoord,
	in ivec2 Offset)
{
	vec2 _214 = texcoord * vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _216 = _214 + vec2(Offset);
	vec4 _218 = texelFetch(V_xBackBuffer, ivec2(_216), 0);
	return _218;
}
void F_xSmart_Sharp(
	in vec2 texcoord,
	inout float Edge,
	inout vec3 LVB,
	inout float CAM)
{
	float mnRGB = 0.00000000e+00;
	float mxRGB = 0.00000000e+00;
	float t = 0.00000000e+00;
	float l = 0.00000000e+00;
	float r = 0.00000000e+00;
	float s = 0.00000000e+00;
	vec2 _237;
	ivec2 _238;
	_237 = texcoord;
	_238 = ivec2(0, -2);
	vec4 _240 = F_xGetBBfetch(_237, _238);
	vec3 _241;
	_241 = _240.xyz;
	float _243 = F_xLI(_241);
	t = _243;
	vec2 _244;
	ivec2 _245;
	_244 = texcoord;
	_245 = ivec2(0, 2);
	vec4 _247 = F_xGetBBfetch(_244, _245);
	vec3 _248;
	_248 = _247.xyz;
	float _250 = F_xLI(_248);
	s = _250;
	vec2 _251;
	ivec2 _252;
	_251 = texcoord;
	_252 = ivec2(-2, 0);
	vec4 _254 = F_xGetBBfetch(_251, _252);
	vec3 _255;
	_255 = _254.xyz;
	float _257 = F_xLI(_255);
	l = _257;
	vec2 _258;
	ivec2 _259;
	_258 = texcoord;
	_259 = ivec2(2, 0);
	vec4 _261 = F_xGetBBfetch(_258, _259);
	vec3 _262;
	_262 = _261.xyz;
	float _264 = F_xLI(_262);
	r = _264;
	float _265 = t - s;
	float _266 = r - l;
	float _267 = -(_266);
	vec2 _268 = vec2(_265, _267);
	vec2 n = _268;
	float _270 = length(n);
	float nl = _270;
	vec3 final_color = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _274;
	vec2 _275;
	_274 = texcoord.xy;
	_275 = vec2(0.00000000e+00, 0.00000000e+00);
	vec3 _278 = F_xBB(_274, _275);
	vec3 c_279 = _278;
	vec3 cc = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 RPC_WS = vec2(5.20833360e-04, 9.25925910e-04);
	float _284;
	float _285;
	_284 = 0.00000000e+00;
	_285 = 2.50000000e-01;
	float _288 = F_xnormpdf(_284, _285);
	float _289 = 1.0 / _288;
	float bZ = _289;
	float Z_292 = 0.00000000e+00;
	float factor = 0.00000000e+00;
	int i = -2;
	while (i <= 2)
	{
		{
			int j = -2;
			while (j <= 2)
			{
				{
					vec2 _319 = vec2(float(i), float(j));
					vec2 _320 = _319 * RPC_WS;
					float _321 = F_xGT();
					float _323 = 2.00000000e+00 * _321;
					float _324 = 1.0 / _323;
					vec2 _326 = _320 * vec2(_324);
					vec2 _327;
					vec2 _328;
					_327 = texcoord.xy;
					_328 = _326;
					vec3 _330 = F_xBB(_327, _328);
					cc = _330;
					vec3 _331 = cc - c_279;
					vec3 _332;
					float _333;
					_332 = _331;
					_333 = 2.50000000e-01;
					float _335 = F_xnormpdf3(_332, _333);
					factor = _335;
					float _336 = Z_292 + factor;
					Z_292 = _336;
					vec3 _338 = vec3(factor) * cc;
					vec3 _339 = final_color + _338;
					final_color = _339;
				}
				int _316 = j + 1;
				j = _316;
			}
		}
		int _305 = i + 1;
		i = _305;
	}
	vec3 _341 = final_color / vec3(Z_292);
	vec3 _342 = clamp(_341, 0.0, 1.0);
	final_color = _342;
	vec3 _343;
	_343 = c_279;
	float _344 = F_xLI(_343);
	vec3 _345;
	_345 = final_color;
	float _346 = F_xLI(_345);
	float _347 = min(_344, _346);
	vec3 _348;
	_348 = cc;
	float _349 = F_xLI(_348);
	float _350 = min(_347, _349);
	mnRGB = _350;
	vec3 _351;
	_351 = c_279;
	float _352 = F_xLI(_351);
	vec3 _353;
	_353 = final_color;
	float _354 = F_xLI(_353);
	float _355 = max(_352, _354);
	vec3 _356;
	_356 = cc;
	float _357 = F_xLI(_356);
	float _358 = max(_355, _357);
	mxRGB = _358;
	float _359 = 1.0 / mxRGB;
	float rcpMRGB = _359;
	float _362 = 1.00000000e+00 - mxRGB;
	float _363 = min(mnRGB, _362);
	float _364 = _363 * rcpMRGB;
	float _365 = clamp(_364, 0.0, 1.0);
	float RGB_D = _365;
	if (V_xCAM_IOB)
	{
		float _371 = 2.00000000e+00 - mxRGB;
		float _372 = min(mnRGB, _371);
		float _373 = _372 * rcpMRGB;
		float _374 = clamp(_373, 0.0, 1.0);
		RGB_D = _374;
	}
	float CAS_Mask = RGB_D;
	float Sharp = V_xSharpness;
	vec2 _377;
	_377 = texcoord;
	float _378 = F_xMotionSharpen(_377);
	float MD = _378;
	if (false)
	{
		float _384 = clamp(MD, 0.0, 1.0);
		float _387 = mix(1.00000000e+00, 0.00000000e+00, _384);
		float _388 = V_xSharpness * _387;
		Sharp = _388;
	}
	if (V_xCA_Mask_Boost)
	{
		float _392 = CAS_Mask * CAS_Mask;
		float _394 = Sharp * 5.00000000e-01;
		float _395 = clamp(_394, 0.0, 1.0);
		float _396 = mix(CAS_Mask, _392, _395);
		CAS_Mask = _396;
	}
	if (V_xCA_Removal)
	{
		CAS_Mask = 1.00000000e+00;
	}
	Edge = nl;
	LVB = final_color;
	CAM = CAS_Mask;
	return;
}
vec4 F_xSharpen_Out(
	in vec2 texcoord)
{
	float Noise = 0.00000000e+00;
	float Edge_407 = 0.00000000e+00;
	float CAM_409 = 0.00000000e+00;
	float Sharpen_Power = V_xSharpness;
	vec2 _411;
	_411 = texcoord;
	float _412 = F_xMotionSharpen(_411);
	float MD_413 = _412;
	vec3 LVB_415 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _416 = texture(V_xBackBuffer, texcoord);
	vec4 color = _416;
	vec4 Done = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _420;
	float _421;
	vec3 _422;
	float _423;
	_420 = texcoord;
	_421 = Edge_407;
	_422 = LVB_415;
	_423 = CAM_409;
	F_xSmart_Sharp(_420, _421, _422, _423);
	Edge_407 = _421;
	LVB_415 = _422;
	CAM_409 = _423;
	if (false)
	{
		float _429 = clamp(MD_413, 0.0, 1.0);
		float _432 = mix(1.00000000e+00, 0.00000000e+00, _429);
		float _433 = V_xSharpness * _432;
		Sharpen_Power = _433;
	}
	if (bool(V_xF_DeNoise))
	{
		Done = color;
		vec4 _439 = Done / LVB_415.xyzz;
		Done = _439;
		float _440;
		float _441;
		float _442;
		_440 = Done.x;
		_441 = Done.y;
		_442 = Done.z;
		float _446 = F_xMin3(_440, _441, _442);
		float _447;
		float _448;
		float _449;
		_447 = Done.x;
		_448 = Done.y;
		_449 = Done.z;
		float _453 = F_xMax3(_447, _448, _449);
		float _455 = 2.00000000e+00 - _453;
		float _456 = min(_446, _455);
		Done = vec4(_456);
		bvec4 _459 = greaterThan(Done, vec4(9.49999988e-01, 9.49999988e-01, 9.49999988e-01, 9.49999988e-01));
		float _461 = length(vec4(_459));
		float _462 = clamp(_461, 0.0, 1.0);
		Noise = _462;
	}
	float _464 = Sharpen_Power * 3.09999990e+00;
	Sharpen_Power = _464;
	vec3 Sharpen = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _467 = texture(V_xBackBuffer, texcoord);
	vec3 _469 = _467.xyz - LVB_415;
	vec3 _470;
	_470 = _469;
	vec3 _471 = F_xRGBtoYCbCr(_470);
	Sharpen = _471;
	float _473 = Sharpen.x * Sharpen_Power;
	Sharpen[0] = _473;
	vec3 _474;
	_474 = Sharpen;
	vec3 _475 = F_xYCbCrtoRGB(_474);
	Sharpen = _475;
	if (V_xClampSharp)
	{
		vec3 _479 = clamp(Sharpen, 0.0, 1.0);
		Sharpen = _479;
	}
	float SNoise = Noise;
	float _482 = mix(1.00000000e+00, Noise, V_xDenoise_Power);
	float _483 = clamp(_482, 0.0, 1.0);
	Noise = _483;
	bool _485 = Edge_407 > 1.25000000e-01;
	float _487 = clamp(float(_485), 0.0, 1.0);
	Edge_407 = _487;
	vec3 _490 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), Sharpen, vec3(Noise));
	vec3 _492 = max(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), _490);
	vec3 _494 = mix(_492, Sharpen, vec3(Edge_407));
	Sharpen = _494;
	bool _499 = V_xDebug_View == 1;
	if (_499)
	{
		Sharpen = Sharpen;
	}
	else
	{
		if (bool(V_xF_DeNoise))
		{
			vec3 B_504 = LVB_415;
			bool _506 = V_xF_DeNoise == 1;
			vec3 _509 = compCond(bvec3(_506), color.xyz, B_504);
			vec3 C_510 = _509;
			vec3 _512 = color.xyz + Sharpen;
			vec3 S = _512;
			vec3 _514;
			_514 = C_510;
			vec3 _515 = F_xRGBtoYCbCr(_514);
			C_510 = _515;
			vec3 _516;
			_516 = S;
			vec3 _517 = F_xRGBtoYCbCr(_516);
			S = _517;
			vec3 _518;
			_518 = B_504;
			vec3 _519 = F_xRGBtoYCbCr(_518);
			B_504 = _519;
			float _522 = mix(C_510.x, S.x, Noise);
			C_510[0] = _522;
			bool _524 = V_xDebug_View == 4;
			vec2 _528 = compCond(bvec2(_524), vec2(1.00000000e+00, 1.00000000e+00), B_504.yz);
			vec2 _531 = mix(_528, S.yz, vec2(SNoise));
			C_510.yz = _531;
			vec3 _533 = mix(C_510, S, vec3(Edge_407));
			vec3 _534;
			_534 = _533;
			vec3 _535 = F_xYCbCrtoRGB(_534);
			Sharpen.xyz = _535;
		}
		else
		{
			vec3 _537 = color.xyz + Sharpen;
			Sharpen.xyz = _537;
		}
	}
	bool _539 = V_xDebug_View == 1;
	vec3 _543 = compCond(bvec3(_539), vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), color.xyz);
	float _544 = clamp(Sharpen_Power, 0.0, 1.0);
	float _545 = CAM_409 * _544;
	vec3 _547 = mix(_543, Sharpen, vec3(_545));
	vec4 _551 = vec4(_547.x, _547.y, _547.z, CAM_409);
	return _551;
}
vec3 F_xShaderOut(
	in vec2 texcoord)
{
	vec3 Out = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 Luma = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _559;
	_559 = texcoord;
	vec4 _560 = F_xSharpen_Out(_559);
	vec3 Sharpen_562 = _560.xyz;
	vec4 _563 = texture(V_xBackBuffer, texcoord);
	vec3 BB = _563.xyz;
	vec2 _566;
	_566 = texcoord;
	float _567 = F_xDepth(_566);
	float DB = _567;
	if (V_xNo_Depth_Map)
	{
		DB = 0.00000000e+00;
	}
	bool _577 = V_xDebug_View == 0;
	if (_577)
	{
		vec3 _579 = mix(Sharpen_562, BB, vec3(DB));
		Out.xyz = _579;
	}
	else
	{
		bool _584 = V_xDebug_View == 1;
		if (_584)
		{
			vec2 _585;
			_585 = texcoord;
			vec4 _586 = F_xSharpen_Out(_585);
			Out.xyz = _586.xyz;
		}
		else
		{
			bool _592 = V_xDebug_View == 2;
			if (_592)
			{
				vec2 _595 = vec2(texcoord.x, texcoord.y);
				vec4 _596 = texture(V_xBackBuffer, _595);
				vec3 _600 = mix(vec3(1.00000000e+00, 0.00000000e+00, 1.00000000e+00), _596.xyz, vec3(DB));
				Out.xyz = _600;
			}
			else
			{
				bool _605 = V_xDebug_View == 3;
				if (_605)
				{
					vec2 _606;
					_606 = texcoord;
					vec4 _607 = F_xSharpen_Out(_606);
					float _609 = 1.00000000e+00 - DB;
					vec3 _613 = mix(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _607.www, vec3(_609));
					Out.xyz = _613;
				}
				else
				{
					bool _618 = V_xDebug_View == 4;
					if (_618)
					{
						vec3 _620 = mix(Sharpen_562, BB, vec3(DB));
						Out.xyz = _620;
					}
				}
			}
		}
	}
	return Out;
}
vec3 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float PosX = 9.52499986e-01;
	float PosY = 9.74999964e-01;
	float Text_Timer = 1.25000000e+04;
	float _632 = V_xtimer * 3.74999992e-03;
	float _633 = sin(_632);
	float _636 = smoothstep(0.00000000e+00, 1.00000000e+00, _633);
	float BT = _636;
	float D = 0.00000000e+00;
	float E = 0.00000000e+00;
	float P = 0.00000000e+00;
	float T = 0.00000000e+00;
	float H = 0.00000000e+00;
	float Three = 0.00000000e+00;
	float DD = 0.00000000e+00;
	float Dot = 0.00000000e+00;
	float I = 0.00000000e+00;
	float N = 0.00000000e+00;
	float F = 0.00000000e+00;
	float O = 0.00000000e+00;
	float R_663 = 0.00000000e+00;
	float EE = 0.00000000e+00;
	float A = 0.00000000e+00;
	float DDD = 0.00000000e+00;
	float HH = 0.00000000e+00;
	float EEE = 0.00000000e+00;
	float L = 0.00000000e+00;
	float PP = 0.00000000e+00;
	float NN = 0.00000000e+00;
	float PPP = 0.00000000e+00;
	float C_683 = 0.00000000e+00;
	float Not = 0.00000000e+00;
	float No = 0.00000000e+00;
	vec2 _688;
	_688 = texcoord;
	vec3 _689 = F_xShaderOut(_688);
	vec3 Color = _689.xyz;
	if (false)
	{
		Text_Timer = 1.87500000e+04;
	}
	bool _700 = V_xtimer <= Text_Timer;
	if (_700)
	{
		float _702 = -3.50000001e-02 + PosX;
		float PosXD = _702;
		float offsetD = 1.00000005e-03;
		float _707 = texcoord.x - PosXD;
		float _709 = texcoord.y - PosY;
		vec2 _710 = vec2(_707, _709);
		vec2 _711 = abs(_710);
		bvec2 _713 = lessThan(_711, vec2(2.49999994e-03, 8.99999961e-03));
		bool _714 = all(_713);
		float OneD = float(_714);
		float _718 = texcoord.x - PosXD;
		float _719 = _718 - offsetD;
		float _721 = texcoord.y - PosY;
		vec2 _722 = vec2(_719, _721);
		vec2 _723 = abs(_722);
		bvec2 _725 = lessThan(_723, vec2(2.49999994e-03, 7.00000022e-03));
		bool _726 = all(_725);
		float TwoD = float(_726);
		float _729 = OneD - TwoD;
		D = _729;
		float _731 = -2.80000009e-02 + PosX;
		float PosXE = _731;
		float offsetE = 5.00000024e-04;
		float _736 = texcoord.x - PosXE;
		float _738 = texcoord.y - PosY;
		vec2 _739 = vec2(_736, _738);
		vec2 _740 = abs(_739);
		bvec2 _742 = lessThan(_740, vec2(3.00000003e-03, 8.99999961e-03));
		bool _743 = all(_742);
		float OneE = float(_743);
		float _747 = texcoord.x - PosXE;
		float _748 = _747 - offsetE;
		float _750 = texcoord.y - PosY;
		vec2 _751 = vec2(_748, _750);
		vec2 _752 = abs(_751);
		bvec2 _754 = lessThan(_752, vec2(2.49999994e-03, 7.00000022e-03));
		bool _755 = all(_754);
		float TwoE = float(_755);
		float _759 = texcoord.x - PosXE;
		float _761 = texcoord.y - PosY;
		vec2 _762 = vec2(_759, _761);
		vec2 _763 = abs(_762);
		bvec2 _765 = lessThan(_763, vec2(3.00000003e-03, 1.00000005e-03));
		bool _766 = all(_765);
		float ThreeE = float(_766);
		float _769 = OneE - TwoE;
		float _770 = _769 + ThreeE;
		E = _770;
		float _772 = -2.15000007e-02 + PosX;
		float PosXP = _772;
		float _775 = -2.49999994e-03 + PosY;
		float PosYP = _775;
		float offsetP = 1.00000005e-03;
		float offsetP1 = 2.00000009e-03;
		float _782 = texcoord.x - PosXP;
		float _784 = texcoord.y - PosYP;
		vec2 _785 = vec2(_782, _784);
		vec2 _786 = abs(_785);
		bvec2 _788 = lessThan(_786, vec2(2.49999994e-03, 6.97499933e-03));
		bool _789 = all(_788);
		float OneP = float(_789);
		float _793 = texcoord.x - PosXP;
		float _794 = _793 - offsetP;
		float _796 = texcoord.y - PosYP;
		vec2 _797 = vec2(_794, _796);
		vec2 _798 = abs(_797);
		bvec2 _800 = lessThan(_798, vec2(2.49999994e-03, 4.76000039e-03));
		bool _801 = all(_800);
		float TwoP = float(_801);
		float _805 = texcoord.x - PosXP;
		float _806 = _805 + offsetP1;
		float _808 = texcoord.y - PosY;
		vec2 _809 = vec2(_806, _808);
		vec2 _810 = abs(_809);
		bvec2 _812 = lessThan(_810, vec2(5.00000024e-04, 8.99999961e-03));
		bool _813 = all(_812);
		float ThreeP = float(_813);
		float _816 = OneP - TwoP;
		float _817 = _816 + ThreeP;
		P = _817;
		float _819 = -1.40000004e-02 + PosX;
		float PosXT = _819;
		float _822 = -8.00000038e-03 + PosY;
		float PosYT = _822;
		float _825 = texcoord.x - PosXT;
		float _827 = texcoord.y - PosYT;
		vec2 _828 = vec2(_825, _827);
		vec2 _829 = abs(_828);
		bvec2 _831 = lessThan(_829, vec2(3.00000003e-03, 1.00000005e-03));
		bool _832 = all(_831);
		float OneT = float(_832);
		float _836 = texcoord.x - PosXT;
		float _838 = texcoord.y - PosY;
		vec2 _839 = vec2(_836, _838);
		vec2 _840 = abs(_839);
		bvec2 _842 = lessThan(_840, vec2(6.24999986e-04, 8.99999961e-03));
		bool _843 = all(_842);
		float TwoT = float(_843);
		float _846 = OneT + TwoT;
		T = _846;
		float _848 = -7.19999988e-03 + PosX;
		float PosXH = _848;
		float _851 = texcoord.x - PosXH;
		float _853 = texcoord.y - PosY;
		vec2 _854 = vec2(_851, _853);
		vec2 _855 = abs(_854);
		bvec2 _857 = lessThan(_855, vec2(2.00000009e-03, 1.00000005e-03));
		bool _858 = all(_857);
		float OneH = float(_858);
		float _862 = texcoord.x - PosXH;
		float _864 = texcoord.y - PosY;
		vec2 _865 = vec2(_862, _864);
		vec2 _866 = abs(_865);
		bvec2 _868 = lessThan(_866, vec2(2.00000009e-03, 8.99999961e-03));
		bool _869 = all(_868);
		float TwoH = float(_869);
		float _873 = texcoord.x - PosXH;
		float _875 = texcoord.y - PosY;
		vec2 _876 = vec2(_873, _875);
		vec2 _877 = abs(_876);
		bvec2 _879 = lessThan(_877, vec2(3.25000007e-03, 8.99999961e-03));
		bool _880 = all(_879);
		float ThreeH = float(_880);
		float _883 = OneH - TwoH;
		float _884 = _883 + ThreeH;
		H = _884;
		float offsetFive = 1.00000005e-03;
		float _888 = -1.00000005e-03 + PosX;
		float PosX3 = _888;
		float _891 = texcoord.x - PosX3;
		float _893 = texcoord.y - PosY;
		vec2 _894 = vec2(_891, _893);
		vec2 _895 = abs(_894);
		bvec2 _897 = lessThan(_895, vec2(2.00000009e-03, 8.99999961e-03));
		bool _898 = all(_897);
		float OneThree = float(_898);
		float _902 = texcoord.x - PosX3;
		float _903 = _902 - offsetFive;
		float _905 = texcoord.y - PosY;
		vec2 _906 = vec2(_903, _905);
		vec2 _907 = abs(_906);
		bvec2 _909 = lessThan(_907, vec2(3.00000003e-03, 7.00000022e-03));
		bool _910 = all(_909);
		float TwoThree = float(_910);
		float _914 = texcoord.x - PosX3;
		float _916 = texcoord.y - PosY;
		vec2 _917 = vec2(_914, _916);
		vec2 _918 = abs(_917);
		bvec2 _920 = lessThan(_918, vec2(2.00000009e-03, 1.00000005e-03));
		bool _921 = all(_920);
		float ThreeThree = float(_921);
		float _924 = OneThree - TwoThree;
		float _925 = _924 + ThreeThree;
		Three = _925;
		float _927 = 6.00000005e-03 + PosX;
		float PosXDD = _927;
		float offsetDD = 1.00000005e-03;
		float _932 = texcoord.x - PosXDD;
		float _934 = texcoord.y - PosY;
		vec2 _935 = vec2(_932, _934);
		vec2 _936 = abs(_935);
		bvec2 _938 = lessThan(_936, vec2(2.49999994e-03, 8.99999961e-03));
		bool _939 = all(_938);
		float OneDD = float(_939);
		float _943 = texcoord.x - PosXDD;
		float _944 = _943 - offsetDD;
		float _946 = texcoord.y - PosY;
		vec2 _947 = vec2(_944, _946);
		vec2 _948 = abs(_947);
		bvec2 _950 = lessThan(_948, vec2(2.49999994e-03, 7.00000022e-03));
		bool _951 = all(_950);
		float TwoDD = float(_951);
		float _954 = OneDD - TwoDD;
		DD = _954;
		float _956 = 1.09999999e-02 + PosX;
		float PosXDot = _956;
		float _959 = 8.00000038e-03 + PosY;
		float PosYDot = _959;
		float _962 = texcoord.x - PosXDot;
		float _964 = texcoord.y - PosYDot;
		vec2 _965 = vec2(_962, _964);
		vec2 _966 = abs(_965);
		bvec2 _968 = lessThan(_966, vec2(7.50000007e-04, 1.50000001e-03));
		bool _969 = all(_968);
		float OneDot = float(_969);
		Dot = OneDot;
		float _973 = 1.54999997e-02 + PosX;
		float PosXI = _973;
		float _976 = 4.00000019e-03 + PosY;
		float PosYI = _976;
		float _979 = 8.00000038e-03 + PosY;
		float PosYII = _979;
		float _982 = texcoord.x - PosXI;
		float _984 = texcoord.y - PosY;
		vec2 _985 = vec2(_982, _984);
		vec2 _986 = abs(_985);
		bvec2 _988 = lessThan(_986, vec2(3.00000003e-03, 1.00000005e-03));
		bool _989 = all(_988);
		float OneI = float(_989);
		float _993 = texcoord.x - PosXI;
		float _995 = texcoord.y - PosYI;
		vec2 _996 = vec2(_993, _995);
		vec2 _997 = abs(_996);
		bvec2 _999 = lessThan(_997, vec2(6.24999986e-04, 4.99999989e-03));
		bool _1000 = all(_999);
		float TwoI = float(_1000);
		float _1004 = texcoord.x - PosXI;
		float _1006 = texcoord.y - PosYII;
		vec2 _1007 = vec2(_1004, _1006);
		vec2 _1008 = abs(_1007);
		bvec2 _1010 = lessThan(_1008, vec2(3.00000003e-03, 1.00000005e-03));
		bool _1011 = all(_1010);
		float ThreeI = float(_1011);
		float _1014 = OneI + TwoI;
		float _1015 = _1014 + ThreeI;
		I = _1015;
		float _1017 = 2.25000009e-02 + PosX;
		float PosXN = _1017;
		float _1020 = 4.99999989e-03 + PosY;
		float PosYN = _1020;
		float offsetN = -1.00000005e-03;
		float _1025 = texcoord.x - PosXN;
		float _1027 = texcoord.y - PosYN;
		vec2 _1028 = vec2(_1025, _1027);
		vec2 _1029 = abs(_1028);
		bvec2 _1031 = lessThan(_1029, vec2(2.00000009e-03, 4.00000019e-03));
		bool _1032 = all(_1031);
		float OneN = float(_1032);
		float _1036 = texcoord.x - PosXN;
		float _1038 = texcoord.y - PosYN;
		float _1039 = _1038 - offsetN;
		vec2 _1040 = vec2(_1036, _1039);
		vec2 _1041 = abs(_1040);
		bvec2 _1043 = lessThan(_1041, vec2(3.00000003e-03, 4.99999989e-03));
		bool _1044 = all(_1043);
		float TwoN = float(_1044);
		float _1047 = OneN - TwoN;
		N = _1047;
		float _1049 = 2.89999992e-02 + PosX;
		float PosXF = _1049;
		float _1052 = 4.00000019e-03 + PosY;
		float PosYF = _1052;
		float offsetF = 5.00000024e-04;
		float offsetF1 = 1.00000005e-03;
		float _1059 = texcoord.x - PosXF;
		float _1060 = _1059 - offsetF;
		float _1062 = texcoord.y - PosYF;
		float _1063 = _1062 - offsetF1;
		vec2 _1064 = vec2(_1060, _1063);
		vec2 _1065 = abs(_1064);
		bvec2 _1067 = lessThan(_1065, vec2(2.00000009e-03, 4.00000019e-03));
		bool _1068 = all(_1067);
		float OneF = float(_1068);
		float _1072 = texcoord.x - PosXF;
		float _1074 = texcoord.y - PosYF;
		vec2 _1075 = vec2(_1072, _1074);
		vec2 _1076 = abs(_1075);
		bvec2 _1078 = lessThan(_1076, vec2(2.49999994e-03, 4.99999989e-03));
		bool _1079 = all(_1078);
		float TwoF = float(_1079);
		float _1083 = texcoord.x - PosXF;
		float _1085 = texcoord.y - PosYF;
		vec2 _1086 = vec2(_1083, _1085);
		vec2 _1087 = abs(_1086);
		bvec2 _1089 = lessThan(_1087, vec2(1.50000001e-03, 7.50000007e-04));
		bool _1090 = all(_1089);
		float ThreeF = float(_1090);
		float _1093 = OneF - TwoF;
		float _1094 = _1093 + ThreeF;
		F = _1094;
		float _1096 = 3.50000001e-02 + PosX;
		float PosXO = _1096;
		float _1099 = 4.00000019e-03 + PosY;
		float PosYO = _1099;
		float _1102 = texcoord.x - PosXO;
		float _1104 = texcoord.y - PosYO;
		vec2 _1105 = vec2(_1102, _1104);
		vec2 _1106 = abs(_1105);
		bvec2 _1108 = lessThan(_1106, vec2(3.00000003e-03, 4.99999989e-03));
		bool _1109 = all(_1108);
		float OneO = float(_1109);
		float _1113 = texcoord.x - PosXO;
		float _1115 = texcoord.y - PosYO;
		vec2 _1116 = vec2(_1113, _1115);
		vec2 _1117 = abs(_1116);
		bvec2 _1119 = lessThan(_1117, vec2(2.00000009e-03, 3.00000003e-03));
		bool _1120 = all(_1119);
		float TwoO = float(_1120);
		float _1123 = OneO - TwoO;
		O = _1123;
		float _1125 = PosX - 4.83000010e-01;
		PosX = _1125;
		float _1127 = -4.58000004e-01 + PosX;
		float PosXNN = _1127;
		float offsetNN = 1.50000001e-03;
		float _1132 = texcoord.x - PosXNN;
		float _1134 = texcoord.y - PosY;
		vec2 _1135 = vec2(_1132, _1134);
		vec2 _1136 = abs(_1135);
		bvec2 _1138 = lessThan(_1136, vec2(3.25000007e-03, 8.99999961e-03));
		bool _1139 = all(_1138);
		float OneNN = float(_1139);
		float _1143 = texcoord.x - PosXNN;
		float _1145 = texcoord.y - PosY;
		float _1146 = _1145 - offsetNN;
		vec2 _1147 = vec2(_1143, _1146);
		vec2 _1148 = abs(_1147);
		bvec2 _1150 = lessThan(_1148, vec2(2.00000009e-03, 8.00000038e-03));
		bool _1151 = all(_1150);
		float TwoNN = float(_1151);
		float _1154 = OneNN - TwoNN;
		NN = _1154;
		float _1156 = -4.51000005e-01 + PosX;
		float PosXPPP = _1156;
		float _1159 = -2.49999994e-03 + PosY;
		float PosYPPP = _1159;
		float offsetPPP = 1.00000005e-03;
		float offsetPPP1 = 2.00000009e-03;
		float _1166 = texcoord.x - PosXPPP;
		float _1168 = texcoord.y - PosYPPP;
		vec2 _1169 = vec2(_1166, _1168);
		vec2 _1170 = abs(_1169);
		bvec2 _1172 = lessThan(_1170, vec2(2.49999994e-03, 6.97499933e-03));
		bool _1173 = all(_1172);
		float OnePPP = float(_1173);
		float _1177 = texcoord.x - PosXPPP;
		float _1178 = _1177 - offsetPPP;
		float _1180 = texcoord.y - PosYPPP;
		vec2 _1181 = vec2(_1178, _1180);
		vec2 _1182 = abs(_1181);
		bvec2 _1184 = lessThan(_1182, vec2(2.49999994e-03, 4.76000039e-03));
		bool _1185 = all(_1184);
		float TwoPPP = float(_1185);
		float _1189 = texcoord.x - PosXPPP;
		float _1190 = _1189 + offsetPPP1;
		float _1192 = texcoord.y - PosY;
		vec2 _1193 = vec2(_1190, _1192);
		vec2 _1194 = abs(_1193);
		bvec2 _1196 = lessThan(_1194, vec2(5.00000024e-04, 8.99999961e-03));
		bool _1197 = all(_1196);
		float ThreePPP = float(_1197);
		float _1200 = OnePPP - TwoPPP;
		float _1201 = _1200 + ThreePPP;
		PPP = _1201;
		float _1203 = -4.49999988e-01 + PosX;
		float PosXC = _1203;
		float offsetC = 1.00000005e-03;
		float _1208 = texcoord.x - PosXC;
		float _1210 = texcoord.y - PosY;
		vec2 _1211 = vec2(_1208, _1210);
		vec2 _1212 = abs(_1211);
		bvec2 _1214 = lessThan(_1212, vec2(3.50000011e-03, 8.99999961e-03));
		bool _1215 = all(_1214);
		float OneC = float(_1215);
		float _1219 = texcoord.x - PosXC;
		float _1220 = _1219 - offsetC;
		float _1222 = texcoord.y - PosY;
		vec2 _1223 = vec2(_1220, _1222);
		vec2 _1224 = abs(_1223);
		bvec2 _1226 = lessThan(_1224, vec2(2.49999994e-03, 7.00000022e-03));
		bool _1227 = all(_1226);
		float TwoC = float(_1227);
		float _1230 = OneC - TwoC;
		C_683 = _1230;
		if (false)
		{
			float _1235 = NN + PPP;
			float _1236 = _1235 * BT;
			No = _1236;
		}
		if (false)
		{
			float _1241 = NN + C_683;
			float _1242 = _1241 * BT;
			Not = _1242;
		}
		float _1243 = D + E;
		float _1244 = _1243 + P;
		float _1245 = _1244 + T;
		float _1246 = _1245 + H;
		float _1247 = _1246 + Three;
		float _1248 = _1247 + DD;
		float _1249 = _1248 + Dot;
		float _1250 = _1249 + I;
		float _1251 = _1250 + N;
		float _1252 = _1251 + F;
		float _1253 = _1252 + O;
		float _1254 = _1253 + No;
		float _1255 = _1254 + Not;
		float _1258 = texcoord.y * 5.00000000e+01;
		float _1260 = 1.00000000e+00 - _1258;
		float _1262 = _1260 + 4.88499985e+01;
		float _1264 = _1262 * texcoord.y;
		float _1266 = _1264 - 5.00000000e-01;
		vec3 _1269 = compCond(bvec3(vec3(_1255)), vec3(_1266), Color);
		return _1269;
	}
	else
	{
		return Color;
	}
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _1276 = id == 2u;
	float _1279 = _1276 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _1279;
	bool _1281 = id == 1u;
	float _1284 = _1281 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _1284;
	vec2 _1286 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1288 = _1286 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1293 = vec4(_1288.x, _1288.y, 0.00000000e+00, 1.00000000e+00);
	position = _1293;
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
#ifdef E_xOut
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xOut(position, texcoord);
	return;
}
#endif
