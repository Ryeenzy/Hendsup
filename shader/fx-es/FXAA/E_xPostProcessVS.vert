#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPostProcessVS
#define dFdx(x) (x)
#define dFdy(x) (x)
#define fwidth(x) (x)
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xSubpix;
uniform float V_xEdgeThreshold;
uniform float V_xEdgeThresholdMin;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xFXAATexture;
float F_xFxaaLuma(
	in vec4 rgba)
{
	return rgba.w;
}
vec4 F_xFxaaPixelShader(
	in vec2 pos,
	in vec4 fxaaConsolePosPos,
	in sampler2D tex,
	in sampler2D fxaaConsole360TexExpBiasNegOne,
	in sampler2D fxaaConsole360TexExpBiasNegTwo,
	in vec2 fxaaQualityRcpFrame,
	in vec4 fxaaConsoleRcpFrameOpt,
	in vec4 fxaaConsoleRcpFrameOpt2,
	in vec4 fxaaConsole360RcpFrameOpt2,
	in float fxaaQualitySubpix,
	in float fxaaQualityEdgeThreshold,
	in float fxaaQualityEdgeThresholdMin,
	in float fxaaConsoleEdgeSharpness,
	in float fxaaConsoleEdgeThreshold,
	in float fxaaConsoleEdgeThresholdMin,
	in vec4 fxaaConsole360ConstDir)
{
	vec2 posM = vec2(0.00000000e+00, 0.00000000e+00);
	posM[0] = pos.x;
	posM[1] = pos.y;
	vec4 _34 = vec4(posM.x, posM.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _35 = textureLod(tex, _34.xy, _34.w);
	vec4 rgbyM = _35;
	vec2 _39 = vec2(0.00000000e+00, 1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _40 = posM + _39;
	vec4 _45 = vec4(_40.x, _40.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _46 = textureLod(tex, _45.xy, _45.w);
	vec4 _47;
	_47 = _46;
	float _48 = F_xFxaaLuma(_47);
	float lumaS = _48;
	vec2 _52 = vec2(1.00000000e+00, 0.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _53 = posM + _52;
	vec4 _58 = vec4(_53.x, _53.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _59 = textureLod(tex, _58.xy, _58.w);
	vec4 _60;
	_60 = _59;
	float _61 = F_xFxaaLuma(_60);
	float lumaE = _61;
	vec2 _65 = vec2(0.00000000e+00, -1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _66 = posM + _65;
	vec4 _71 = vec4(_66.x, _66.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _72 = textureLod(tex, _71.xy, _71.w);
	vec4 _73;
	_73 = _72;
	float _74 = F_xFxaaLuma(_73);
	float lumaN = _74;
	vec2 _78 = vec2(-1.00000000e+00, 0.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _79 = posM + _78;
	vec4 _84 = vec4(_79.x, _79.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _85 = textureLod(tex, _84.xy, _84.w);
	vec4 _86;
	_86 = _85;
	float _87 = F_xFxaaLuma(_86);
	float lumaW = _87;
	float _90 = max(lumaS, rgbyM.w);
	float maxSM = _90;
	float _93 = min(lumaS, rgbyM.w);
	float minSM = _93;
	float _95 = max(lumaE, maxSM);
	float maxESM = _95;
	float _97 = min(lumaE, minSM);
	float minESM = _97;
	float _99 = max(lumaN, lumaW);
	float maxWN = _99;
	float _101 = min(lumaN, lumaW);
	float minWN = _101;
	float _103 = max(maxWN, maxESM);
	float rangeMax = _103;
	float _105 = min(minWN, minESM);
	float rangeMin = _105;
	float _107 = rangeMax * fxaaQualityEdgeThreshold;
	float rangeMaxScaled = _107;
	float _109 = rangeMax - rangeMin;
	float range = _109;
	float _111 = max(fxaaQualityEdgeThresholdMin, rangeMaxScaled);
	float rangeMaxClamped = _111;
	bool _113 = range < rangeMaxClamped;
	bool earlyExit = _113;
	if (earlyExit)
	{
		return rgbyM;
	}
	vec2 _120 = vec2(-1.00000000e+00, -1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _121 = posM + _120;
	vec4 _126 = vec4(_121.x, _121.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _127 = textureLod(tex, _126.xy, _126.w);
	vec4 _128;
	_128 = _127;
	float _129 = F_xFxaaLuma(_128);
	float lumaNW = _129;
	vec2 _133 = vec2(1.00000000e+00, 1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _134 = posM + _133;
	vec4 _139 = vec4(_134.x, _134.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _140 = textureLod(tex, _139.xy, _139.w);
	vec4 _141;
	_141 = _140;
	float _142 = F_xFxaaLuma(_141);
	float lumaSE = _142;
	vec2 _146 = vec2(1.00000000e+00, -1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _147 = posM + _146;
	vec4 _152 = vec4(_147.x, _147.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _153 = textureLod(tex, _152.xy, _152.w);
	vec4 _154;
	_154 = _153;
	float _155 = F_xFxaaLuma(_154);
	float lumaNE = _155;
	vec2 _159 = vec2(-1.00000000e+00, 1.00000000e+00) * fxaaQualityRcpFrame.xy;
	vec2 _160 = posM + _159;
	vec4 _165 = vec4(_160.x, _160.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _166 = textureLod(tex, _165.xy, _165.w);
	vec4 _167;
	_167 = _166;
	float _168 = F_xFxaaLuma(_167);
	float lumaSW = _168;
	float _170 = lumaN + lumaS;
	float lumaNS = _170;
	float _172 = lumaW + lumaE;
	float lumaWE = _172;
	float _175 = 1.00000000e+00 / range;
	float subpixRcpRange = _175;
	float _177 = lumaNS + lumaWE;
	float subpixNSWE = _177;
	float _181 = -2.00000000e+00 * rgbyM.w;
	float _182 = _181 + lumaNS;
	float edgeHorz1 = _182;
	float _186 = -2.00000000e+00 * rgbyM.w;
	float _187 = _186 + lumaWE;
	float edgeVert1 = _187;
	float _189 = lumaNE + lumaSE;
	float lumaNESE = _189;
	float _191 = lumaNW + lumaNE;
	float lumaNWNE = _191;
	float _194 = -2.00000000e+00 * lumaE;
	float _195 = _194 + lumaNESE;
	float edgeHorz2 = _195;
	float _198 = -2.00000000e+00 * lumaN;
	float _199 = _198 + lumaNWNE;
	float edgeVert2 = _199;
	float _201 = lumaNW + lumaSW;
	float lumaNWSW = _201;
	float _203 = lumaSW + lumaSE;
	float lumaSWSE = _203;
	float _205 = abs(edgeHorz1);
	float _207 = _205 * 2.00000000e+00;
	float _208 = abs(edgeHorz2);
	float _209 = _207 + _208;
	float edgeHorz4 = _209;
	float _211 = abs(edgeVert1);
	float _213 = _211 * 2.00000000e+00;
	float _214 = abs(edgeVert2);
	float _215 = _213 + _214;
	float edgeVert4 = _215;
	float _218 = -2.00000000e+00 * lumaW;
	float _219 = _218 + lumaNWSW;
	float edgeHorz3 = _219;
	float _222 = -2.00000000e+00 * lumaS;
	float _223 = _222 + lumaSWSE;
	float edgeVert3 = _223;
	float _225 = abs(edgeHorz3);
	float _226 = _225 + edgeHorz4;
	float edgeHorz = _226;
	float _228 = abs(edgeVert3);
	float _229 = _228 + edgeVert4;
	float edgeVert = _229;
	float _231 = lumaNWSW + lumaNESE;
	float subpixNWSWNESE = _231;
	float lengthSign = fxaaQualityRcpFrame.x;
	bool _235 = edgeHorz >= edgeVert;
	bool horzSpan = _235;
	float _238 = subpixNSWE * 2.00000000e+00;
	float _239 = _238 + subpixNWSWNESE;
	float subpixA = _239;
	bool _244 = !bool(horzSpan);
	if (_244)
	{
		lumaN = lumaW;
	}
	bool _248 = !bool(horzSpan);
	if (_248)
	{
		lumaS = lumaE;
	}
	if (horzSpan)
	{
		lengthSign = fxaaQualityRcpFrame.y;
	}
	float _254 = subpixA * 8.33333358e-02;
	float _256 = _254 - rgbyM.w;
	float subpixB = _256;
	float _259 = lumaN - rgbyM.w;
	float gradientN = _259;
	float _262 = lumaS - rgbyM.w;
	float gradientS = _262;
	float _265 = lumaN + rgbyM.w;
	float lumaNN = _265;
	float _268 = lumaS + rgbyM.w;
	float lumaSS = _268;
	float _270 = abs(gradientN);
	float _271 = abs(gradientS);
	bool _272 = _270 >= _271;
	bool pairN = _272;
	float _274 = abs(gradientN);
	float _275 = abs(gradientS);
	float _276 = max(_274, _275);
	float gradient = _276;
	if (pairN)
	{
		float _281 = -(lengthSign);
		lengthSign = _281;
	}
	float _282 = abs(subpixB);
	float _283 = _282 * subpixRcpRange;
	float _284 = clamp(_283, 0.0, 1.0);
	float subpixC = _284;
	vec2 posB = vec2(0.00000000e+00, 0.00000000e+00);
	posB[0] = posM.x;
	posB[1] = posM.y;
	vec2 offNP = vec2(0.00000000e+00, 0.00000000e+00);
	bool _292 = !bool(horzSpan);
	float _295 = _292 ? 0.00000000e+00 : fxaaQualityRcpFrame.x;
	offNP[0] = _295;
	float _298 = horzSpan ? 0.00000000e+00 : fxaaQualityRcpFrame.y;
	offNP[1] = _298;
	bool _302 = !bool(horzSpan);
	if (_302)
	{
		float _304 = lengthSign * 5.00000000e-01;
		float _306 = posB.x + _304;
		posB[0] = _306;
	}
	if (horzSpan)
	{
		float _311 = lengthSign * 5.00000000e-01;
		float _313 = posB.y + _311;
		posB[1] = _313;
	}
	vec2 posN = vec2(0.00000000e+00, 0.00000000e+00);
	float _318 = offNP.x * 1.00000000e+00;
	float _320 = posB.x - _318;
	posN[0] = _320;
	float _323 = offNP.y * 1.00000000e+00;
	float _325 = posB.y - _323;
	posN[1] = _325;
	vec2 posP = vec2(0.00000000e+00, 0.00000000e+00);
	float _330 = offNP.x * 1.00000000e+00;
	float _332 = posB.x + _330;
	posP[0] = _332;
	float _335 = offNP.y * 1.00000000e+00;
	float _337 = posB.y + _335;
	posP[1] = _337;
	float _339 = -2.00000000e+00 * subpixC;
	float _341 = _339 + 3.00000000e+00;
	float subpixD = _341;
	vec4 _347 = vec4(posN.x, posN.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _348 = textureLod(tex, _347.xy, _347.w);
	vec4 _349;
	_349 = _348;
	float _350 = F_xFxaaLuma(_349);
	float lumaEndN = _350;
	float _352 = subpixC * subpixC;
	float subpixE = _352;
	vec4 _358 = vec4(posP.x, posP.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _359 = textureLod(tex, _358.xy, _358.w);
	vec4 _360;
	_360 = _359;
	float _361 = F_xFxaaLuma(_360);
	float lumaEndP = _361;
	bool _366 = !bool(pairN);
	if (_366)
	{
		lumaNN = lumaSS;
	}
	float _368 = gradient * 1.00000000e+00;
	float _370 = _368 / 4.00000000e+00;
	float gradientScaled = _370;
	float _373 = lumaNN * 5.00000000e-01;
	float _375 = rgbyM.w - _373;
	float lumaMM = _375;
	float _377 = subpixD * subpixE;
	float subpixF = _377;
	bool _380 = lumaMM < 0.00000000e+00;
	bool lumaMLTZero = _380;
	float _383 = lumaNN * 5.00000000e-01;
	float _384 = lumaEndN - _383;
	lumaEndN = _384;
	float _386 = lumaNN * 5.00000000e-01;
	float _387 = lumaEndP - _386;
	lumaEndP = _387;
	float _388 = abs(lumaEndN);
	bool _389 = _388 >= gradientScaled;
	bool doneN = _389;
	float _391 = abs(lumaEndP);
	bool _392 = _391 >= gradientScaled;
	bool doneP = _392;
	bool _397 = !bool(doneN);
	if (_397)
	{
		float _400 = offNP.x * 1.50000000e+00;
		float _402 = posN.x - _400;
		posN[0] = _402;
	}
	bool _406 = !bool(doneN);
	if (_406)
	{
		float _409 = offNP.y * 1.50000000e+00;
		float _411 = posN.y - _409;
		posN[1] = _411;
	}
	bool _412 = !bool(doneN);
	bool _413 = !bool(doneP);
	bool _414 = _412 || _413;
	bool doneNP = _414;
	bool _419 = !bool(doneP);
	if (_419)
	{
		float _422 = offNP.x * 1.50000000e+00;
		float _424 = posP.x + _422;
		posP[0] = _424;
	}
	bool _428 = !bool(doneP);
	if (_428)
	{
		float _431 = offNP.y * 1.50000000e+00;
		float _433 = posP.y + _431;
		posP[1] = _433;
	}
	if (doneNP)
	{
		bool _440 = !bool(doneN);
		if (_440)
		{
			vec4 _445 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _446 = textureLod(tex, _445.xy, _445.w);
			vec4 _447;
			_447 = _446;
			float _448 = F_xFxaaLuma(_447);
			lumaEndN = _448;
		}
		bool _452 = !bool(doneP);
		if (_452)
		{
			vec4 _457 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _458 = textureLod(tex, _457.xy, _457.w);
			vec4 _459;
			_459 = _458;
			float _460 = F_xFxaaLuma(_459);
			lumaEndP = _460;
		}
		bool _464 = !bool(doneN);
		if (_464)
		{
			float _466 = lumaNN * 5.00000000e-01;
			float _467 = lumaEndN - _466;
			lumaEndN = _467;
		}
		bool _471 = !bool(doneP);
		if (_471)
		{
			float _473 = lumaNN * 5.00000000e-01;
			float _474 = lumaEndP - _473;
			lumaEndP = _474;
		}
		float _475 = abs(lumaEndN);
		bool _476 = _475 >= gradientScaled;
		doneN = _476;
		float _477 = abs(lumaEndP);
		bool _478 = _477 >= gradientScaled;
		doneP = _478;
		bool _482 = !bool(doneN);
		if (_482)
		{
			float _485 = offNP.x * 2.00000000e+00;
			float _487 = posN.x - _485;
			posN[0] = _487;
		}
		bool _491 = !bool(doneN);
		if (_491)
		{
			float _494 = offNP.y * 2.00000000e+00;
			float _496 = posN.y - _494;
			posN[1] = _496;
		}
		bool _497 = !bool(doneN);
		bool _498 = !bool(doneP);
		bool _499 = _497 || _498;
		doneNP = _499;
		bool _503 = !bool(doneP);
		if (_503)
		{
			float _506 = offNP.x * 2.00000000e+00;
			float _508 = posP.x + _506;
			posP[0] = _508;
		}
		bool _512 = !bool(doneP);
		if (_512)
		{
			float _515 = offNP.y * 2.00000000e+00;
			float _517 = posP.y + _515;
			posP[1] = _517;
		}
		if (doneNP)
		{
			bool _524 = !bool(doneN);
			if (_524)
			{
				vec4 _529 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _530 = textureLod(tex, _529.xy, _529.w);
				vec4 _531;
				_531 = _530;
				float _532 = F_xFxaaLuma(_531);
				lumaEndN = _532;
			}
			bool _536 = !bool(doneP);
			if (_536)
			{
				vec4 _541 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _542 = textureLod(tex, _541.xy, _541.w);
				vec4 _543;
				_543 = _542;
				float _544 = F_xFxaaLuma(_543);
				lumaEndP = _544;
			}
			bool _548 = !bool(doneN);
			if (_548)
			{
				float _550 = lumaNN * 5.00000000e-01;
				float _551 = lumaEndN - _550;
				lumaEndN = _551;
			}
			bool _555 = !bool(doneP);
			if (_555)
			{
				float _557 = lumaNN * 5.00000000e-01;
				float _558 = lumaEndP - _557;
				lumaEndP = _558;
			}
			float _559 = abs(lumaEndN);
			bool _560 = _559 >= gradientScaled;
			doneN = _560;
			float _561 = abs(lumaEndP);
			bool _562 = _561 >= gradientScaled;
			doneP = _562;
			bool _566 = !bool(doneN);
			if (_566)
			{
				float _569 = offNP.x * 2.00000000e+00;
				float _571 = posN.x - _569;
				posN[0] = _571;
			}
			bool _575 = !bool(doneN);
			if (_575)
			{
				float _578 = offNP.y * 2.00000000e+00;
				float _580 = posN.y - _578;
				posN[1] = _580;
			}
			bool _581 = !bool(doneN);
			bool _582 = !bool(doneP);
			bool _583 = _581 || _582;
			doneNP = _583;
			bool _587 = !bool(doneP);
			if (_587)
			{
				float _590 = offNP.x * 2.00000000e+00;
				float _592 = posP.x + _590;
				posP[0] = _592;
			}
			bool _596 = !bool(doneP);
			if (_596)
			{
				float _599 = offNP.y * 2.00000000e+00;
				float _601 = posP.y + _599;
				posP[1] = _601;
			}
			if (doneNP)
			{
				bool _608 = !bool(doneN);
				if (_608)
				{
					vec4 _613 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
					vec4 _614 = textureLod(tex, _613.xy, _613.w);
					vec4 _615;
					_615 = _614;
					float _616 = F_xFxaaLuma(_615);
					lumaEndN = _616;
				}
				bool _620 = !bool(doneP);
				if (_620)
				{
					vec4 _625 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
					vec4 _626 = textureLod(tex, _625.xy, _625.w);
					vec4 _627;
					_627 = _626;
					float _628 = F_xFxaaLuma(_627);
					lumaEndP = _628;
				}
				bool _632 = !bool(doneN);
				if (_632)
				{
					float _634 = lumaNN * 5.00000000e-01;
					float _635 = lumaEndN - _634;
					lumaEndN = _635;
				}
				bool _639 = !bool(doneP);
				if (_639)
				{
					float _641 = lumaNN * 5.00000000e-01;
					float _642 = lumaEndP - _641;
					lumaEndP = _642;
				}
				float _643 = abs(lumaEndN);
				bool _644 = _643 >= gradientScaled;
				doneN = _644;
				float _645 = abs(lumaEndP);
				bool _646 = _645 >= gradientScaled;
				doneP = _646;
				bool _650 = !bool(doneN);
				if (_650)
				{
					float _653 = offNP.x * 2.00000000e+00;
					float _655 = posN.x - _653;
					posN[0] = _655;
				}
				bool _659 = !bool(doneN);
				if (_659)
				{
					float _662 = offNP.y * 2.00000000e+00;
					float _664 = posN.y - _662;
					posN[1] = _664;
				}
				bool _665 = !bool(doneN);
				bool _666 = !bool(doneP);
				bool _667 = _665 || _666;
				doneNP = _667;
				bool _671 = !bool(doneP);
				if (_671)
				{
					float _674 = offNP.x * 2.00000000e+00;
					float _676 = posP.x + _674;
					posP[0] = _676;
				}
				bool _680 = !bool(doneP);
				if (_680)
				{
					float _683 = offNP.y * 2.00000000e+00;
					float _685 = posP.y + _683;
					posP[1] = _685;
				}
				if (doneNP)
				{
					bool _692 = !bool(doneN);
					if (_692)
					{
						vec4 _697 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
						vec4 _698 = textureLod(tex, _697.xy, _697.w);
						vec4 _699;
						_699 = _698;
						float _700 = F_xFxaaLuma(_699);
						lumaEndN = _700;
					}
					bool _704 = !bool(doneP);
					if (_704)
					{
						vec4 _709 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
						vec4 _710 = textureLod(tex, _709.xy, _709.w);
						vec4 _711;
						_711 = _710;
						float _712 = F_xFxaaLuma(_711);
						lumaEndP = _712;
					}
					bool _716 = !bool(doneN);
					if (_716)
					{
						float _718 = lumaNN * 5.00000000e-01;
						float _719 = lumaEndN - _718;
						lumaEndN = _719;
					}
					bool _723 = !bool(doneP);
					if (_723)
					{
						float _725 = lumaNN * 5.00000000e-01;
						float _726 = lumaEndP - _725;
						lumaEndP = _726;
					}
					float _727 = abs(lumaEndN);
					bool _728 = _727 >= gradientScaled;
					doneN = _728;
					float _729 = abs(lumaEndP);
					bool _730 = _729 >= gradientScaled;
					doneP = _730;
					bool _734 = !bool(doneN);
					if (_734)
					{
						float _737 = offNP.x * 2.00000000e+00;
						float _739 = posN.x - _737;
						posN[0] = _739;
					}
					bool _743 = !bool(doneN);
					if (_743)
					{
						float _746 = offNP.y * 2.00000000e+00;
						float _748 = posN.y - _746;
						posN[1] = _748;
					}
					bool _749 = !bool(doneN);
					bool _750 = !bool(doneP);
					bool _751 = _749 || _750;
					doneNP = _751;
					bool _755 = !bool(doneP);
					if (_755)
					{
						float _758 = offNP.x * 2.00000000e+00;
						float _760 = posP.x + _758;
						posP[0] = _760;
					}
					bool _764 = !bool(doneP);
					if (_764)
					{
						float _767 = offNP.y * 2.00000000e+00;
						float _769 = posP.y + _767;
						posP[1] = _769;
					}
					if (doneNP)
					{
						bool _776 = !bool(doneN);
						if (_776)
						{
							vec4 _781 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
							vec4 _782 = textureLod(tex, _781.xy, _781.w);
							vec4 _783;
							_783 = _782;
							float _784 = F_xFxaaLuma(_783);
							lumaEndN = _784;
						}
						bool _788 = !bool(doneP);
						if (_788)
						{
							vec4 _793 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
							vec4 _794 = textureLod(tex, _793.xy, _793.w);
							vec4 _795;
							_795 = _794;
							float _796 = F_xFxaaLuma(_795);
							lumaEndP = _796;
						}
						bool _800 = !bool(doneN);
						if (_800)
						{
							float _802 = lumaNN * 5.00000000e-01;
							float _803 = lumaEndN - _802;
							lumaEndN = _803;
						}
						bool _807 = !bool(doneP);
						if (_807)
						{
							float _809 = lumaNN * 5.00000000e-01;
							float _810 = lumaEndP - _809;
							lumaEndP = _810;
						}
						float _811 = abs(lumaEndN);
						bool _812 = _811 >= gradientScaled;
						doneN = _812;
						float _813 = abs(lumaEndP);
						bool _814 = _813 >= gradientScaled;
						doneP = _814;
						bool _818 = !bool(doneN);
						if (_818)
						{
							float _821 = offNP.x * 4.00000000e+00;
							float _823 = posN.x - _821;
							posN[0] = _823;
						}
						bool _827 = !bool(doneN);
						if (_827)
						{
							float _830 = offNP.y * 4.00000000e+00;
							float _832 = posN.y - _830;
							posN[1] = _832;
						}
						bool _833 = !bool(doneN);
						bool _834 = !bool(doneP);
						bool _835 = _833 || _834;
						doneNP = _835;
						bool _839 = !bool(doneP);
						if (_839)
						{
							float _842 = offNP.x * 4.00000000e+00;
							float _844 = posP.x + _842;
							posP[0] = _844;
						}
						bool _848 = !bool(doneP);
						if (_848)
						{
							float _851 = offNP.y * 4.00000000e+00;
							float _853 = posP.y + _851;
							posP[1] = _853;
						}
						if (doneNP)
						{
							bool _860 = !bool(doneN);
							if (_860)
							{
								vec4 _865 = vec4(posN.xy.x, posN.xy.y, 0.00000000e+00, 0.00000000e+00);
								vec4 _866 = textureLod(tex, _865.xy, _865.w);
								vec4 _867;
								_867 = _866;
								float _868 = F_xFxaaLuma(_867);
								lumaEndN = _868;
							}
							bool _872 = !bool(doneP);
							if (_872)
							{
								vec4 _877 = vec4(posP.xy.x, posP.xy.y, 0.00000000e+00, 0.00000000e+00);
								vec4 _878 = textureLod(tex, _877.xy, _877.w);
								vec4 _879;
								_879 = _878;
								float _880 = F_xFxaaLuma(_879);
								lumaEndP = _880;
							}
							bool _884 = !bool(doneN);
							if (_884)
							{
								float _886 = lumaNN * 5.00000000e-01;
								float _887 = lumaEndN - _886;
								lumaEndN = _887;
							}
							bool _891 = !bool(doneP);
							if (_891)
							{
								float _893 = lumaNN * 5.00000000e-01;
								float _894 = lumaEndP - _893;
								lumaEndP = _894;
							}
							float _895 = abs(lumaEndN);
							bool _896 = _895 >= gradientScaled;
							doneN = _896;
							float _897 = abs(lumaEndP);
							bool _898 = _897 >= gradientScaled;
							doneP = _898;
							bool _902 = !bool(doneN);
							if (_902)
							{
								float _905 = offNP.x * 1.20000000e+01;
								float _907 = posN.x - _905;
								posN[0] = _907;
							}
							bool _911 = !bool(doneN);
							if (_911)
							{
								float _914 = offNP.y * 1.20000000e+01;
								float _916 = posN.y - _914;
								posN[1] = _916;
							}
							bool _917 = !bool(doneN);
							bool _918 = !bool(doneP);
							bool _919 = _917 || _918;
							doneNP = _919;
							bool _923 = !bool(doneP);
							if (_923)
							{
								float _926 = offNP.x * 1.20000000e+01;
								float _928 = posP.x + _926;
								posP[0] = _928;
							}
							bool _932 = !bool(doneP);
							if (_932)
							{
								float _935 = offNP.y * 1.20000000e+01;
								float _937 = posP.y + _935;
								posP[1] = _937;
							}
						}
					}
				}
			}
		}
	}
	float _940 = posM.x - posN.x;
	float dstN = _940;
	float _944 = posP.x - posM.x;
	float dstP = _944;
	bool _949 = !bool(horzSpan);
	if (_949)
	{
		float _952 = posM.y - posN.y;
		dstN = _952;
	}
	bool _956 = !bool(horzSpan);
	if (_956)
	{
		float _959 = posP.y - posM.y;
		dstP = _959;
	}
	bool _961 = lumaEndN < 0.00000000e+00;
	bool _962 = _961 != lumaMLTZero;
	bool goodSpanN = _962;
	float _964 = dstP + dstN;
	float spanLength = _964;
	bool _967 = lumaEndP < 0.00000000e+00;
	bool _968 = _967 != lumaMLTZero;
	bool goodSpanP = _968;
	float _971 = 1.00000000e+00 / spanLength;
	float spanLengthRcp = _971;
	bool _973 = dstN < dstP;
	bool directionN = _973;
	float _975 = min(dstN, dstP);
	float dst = _975;
	bool _977 = directionN ? goodSpanN : goodSpanP;
	bool goodSpan = _977;
	float _979 = subpixF * subpixF;
	float subpixG = _979;
	float _981 = -(spanLengthRcp);
	float _982 = dst * _981;
	float _984 = _982 + 5.00000000e-01;
	float pixelOffset = _984;
	float _986 = subpixG * fxaaQualitySubpix;
	float subpixH = _986;
	float _989 = goodSpan ? pixelOffset : 0.00000000e+00;
	float pixelOffsetGood = _989;
	float _991 = max(pixelOffsetGood, subpixH);
	float pixelOffsetSubpix = _991;
	bool _996 = !bool(horzSpan);
	if (_996)
	{
		float _997 = pixelOffsetSubpix * lengthSign;
		float _999 = posM.x + _997;
		posM[0] = _999;
	}
	if (horzSpan)
	{
		float _1003 = pixelOffsetSubpix * lengthSign;
		float _1005 = posM.y + _1003;
		posM[1] = _1005;
	}
	vec4 _1010 = vec4(posM.x, posM.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1011 = textureLod(tex, _1010.xy, _1010.w);
	vec4 _1016 = vec4(_1011.xyz.x, _1011.xyz.y, _1011.xyz.z, rgbyM.w);
	return _1016;
}
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _1026 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _1026;
	float _1029 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _1029;
	float _1032 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _1032;
	float _1035 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _1035;
	vec4 _1040 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1041 = textureLod(V_xReShade_xDepthBuffer, _1040.xy, _1040.w);
	float _1044 = _1041.x * 1.00000000e+00;
	float depth = _1044;
	float _1047 = 1.00000000e+00 - depth;
	depth = _1047;
	float _1049 = depth * 9.99000000e+02;
	float _1051 = 1.00000000e+03 - _1049;
	float _1052 = depth / _1051;
	depth = _1052;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _1059 = id == 2u;
	float _1062 = _1059 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _1062;
	bool _1064 = id == 1u;
	float _1067 = _1064 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _1067;
	vec2 _1069 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1071 = _1069 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1076 = vec4(_1071.x, _1071.y, 0.00000000e+00, 1.00000000e+00);
	position = _1076;
	return;
}
vec4 F_xFXAALumaPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _1083 = texture(V_xReShade_xBackBuffer, texcoord.xy);
	vec4 color = _1083;
	vec3 _1087 = color.xyz * color.xyz;
	float _1089 = dot(_1087, vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01));
	float _1090 = sqrt(_1089);
	color[3] = _1090;
	return color;
}
vec4 F_xFXAAPixelShader(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec2 _1095;
	vec4 _1096;
	vec2 _1097;
	vec4 _1098;
	vec4 _1099;
	vec4 _1100;
	float _1101;
	float _1102;
	float _1103;
	float _1104;
	float _1105;
	float _1106;
	vec4 _1107;
	_1095 = texcoord;
	_1096 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	_1097 = vec2(5.20833360e-04, 9.25925910e-04);
	_1098 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	_1099 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	_1100 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	_1101 = V_xSubpix;
	_1102 = V_xEdgeThreshold;
	_1103 = V_xEdgeThresholdMin;
	_1104 = 0.00000000e+00;
	_1105 = 0.00000000e+00;
	_1106 = 0.00000000e+00;
	_1107 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _1117 = F_xFxaaPixelShader(_1095, _1096, V_xFXAATexture, V_xFXAATexture, V_xFXAATexture, _1097, _1098, _1099, _1100, _1101, _1102, _1103, _1104, _1105, _1106, _1107);
	return _1117;
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
#ifdef E_xFXAALumaPass
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xFXAALumaPass(vpos, texcoord);
	return;
}
#endif
#ifdef E_xFXAAPixelShader
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xFXAAPixelShader(vpos, texcoord);
	return;
}
#endif
