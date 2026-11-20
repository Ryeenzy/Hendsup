#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xClarity2
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xClarityRadius;
uniform float V_xClarityOffset;
uniform int V_xClarityBlendMode;
uniform int V_xClarityBlendIfDark;
uniform int V_xClarityBlendIfLight;
uniform bool V_xClarityViewBlendIfMask;
uniform float V_xClarityStrength;
uniform float V_xClarityDarkIntensity;
uniform float V_xClarityLightIntensity;
uniform bool V_xClarityViewMask;

uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xClaritySampler;
uniform sampler2D V_xClaritySampler2;
uniform sampler2D V_xClaritySampler3;
const float _36[4] = float[4](0.00000000e+00, 1.18242550e+00, 3.02931213e+00, 5.00407028e+00);
const float _38[4] = float[4](3.98939997e-01, 2.95960009e-01, 4.56565246e-03, 1.49278685e-06);
const float _94[6] = float[6](0.00000000e+00, 1.45842957e+00, 3.40398479e+00, 5.35180569e+00, 7.30294085e+00, 9.25815964e+00);
const float _96[6] = float[6](1.32980004e-01, 2.32275754e-01, 1.35326162e-01, 5.11557423e-02, 1.25392200e-02, 1.99136441e-03);
const float _152[11] = float[11](0.00000000e+00, 1.48958480e+00, 3.47571349e+00, 5.46187973e+00, 7.44810438e+00, 9.43440819e+00, 1.14208107e+01, 1.34073334e+01, 1.53939934e+01, 1.73808098e+01, 1.93677998e+01);
const float _154[11] = float[11](6.64900020e-02, 1.28469750e-01, 1.11918248e-01, 8.73132646e-02, 6.10011108e-02, 3.81655693e-02, 2.13835668e-02, 1.07290242e-02, 4.82068677e-03, 1.93964690e-03, 6.98871794e-04);
const float _210[15] = float[15](0.00000000e+00, 1.49537051e+00, 3.48919916e+00, 5.48303127e+00, 7.47686815e+00, 9.47071266e+00, 1.14645653e+01, 1.34584293e+01, 1.54523058e+01, 1.74461975e+01, 1.94401035e+01, 2.14340286e+01, 2.34279728e+01, 2.54219398e+01, 2.74159298e+01);
const float _212[15] = float[15](4.43266667e-02, 8.72994736e-02, 8.20892006e-02, 7.34818354e-02, 6.26171678e-02, 5.07956184e-02, 3.92263979e-02, 2.88369805e-02, 2.01808885e-02, 1.34446556e-02, 8.52663908e-03, 5.14783571e-03, 2.95862486e-03, 1.61872571e-03, 8.43091286e-04);
const float _268[18] = float[18](0.00000000e+00, 1.49537051e+00, 3.48919916e+00, 5.48303127e+00, 7.47686815e+00, 9.47071266e+00, 1.14645653e+01, 1.34584293e+01, 1.54523058e+01, 1.74461975e+01, 1.94661980e+01, 2.14627419e+01, 2.34592915e+01, 2.54558449e+01, 2.74524021e+01, 2.94489632e+01, 3.14455299e+01, 3.34421005e+01);
const float _270[18] = float[18](3.32450010e-02, 6.59162253e-02, 6.36705831e-02, 5.98194674e-02, 5.46642579e-02, 4.85871658e-02, 4.20046002e-02, 3.53207029e-02, 2.88880989e-02, 2.29808316e-02, 1.77815519e-02, 1.33822970e-02, 9.79600009e-03, 6.97467476e-03, 4.83010057e-03, 3.25345970e-03, 2.13153102e-03, 1.35829742e-03);
vec3 F_xClarityFinal(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _27 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 1.00000000e+00);
	vec4 _28 = textureLod(V_xClaritySampler3, _27.xy, _27.w);
	float color = _28.x;
	bool _35 = V_xClarityRadius == 0;
	if (_35)
	{
		float offset[4] = _36;
		float weight[4] = _38;
		float _41 = color * weight[0];
		color = _41;
		int i = 1;
		while (i < 4)
		{
			{
				float _55 = offset[int(i)] * 9.25925910e-04;
				vec2 _57 = vec2(0.00000000e+00, _55);
				vec2 _59 = _57 * vec2(V_xClarityOffset);
				vec2 _60 = texcoord + _59;
				vec4 _65 = vec4(_60.x, _60.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _66 = textureLod(V_xClaritySampler3, _65.xy, _65.w);
				float _69 = _66.x * weight[int(i)];
				float _70 = color + _69;
				color = _70;
				float _73 = offset[int(i)] * 9.25925910e-04;
				vec2 _75 = vec2(0.00000000e+00, _73);
				vec2 _77 = _75 * vec2(V_xClarityOffset);
				vec2 _78 = texcoord - _77;
				vec4 _83 = vec4(_78.x, _78.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _84 = textureLod(V_xClaritySampler3, _83.xy, _83.w);
				float _87 = _84.x * weight[int(i)];
				float _88 = color + _87;
				color = _88;
			}
			int _52 = i + 1;
			i = _52;
		}
	}
	bool _93 = V_xClarityRadius == 1;
	if (_93)
	{
		float offset_95[6] = _94;
		float weight_97[6] = _96;
		float _99 = color * weight_97[0];
		color = _99;
		int i_101 = 1;
		while (i_101 < 6)
		{
			{
				float _113 = offset_95[int(i_101)] * 9.25925910e-04;
				vec2 _115 = vec2(0.00000000e+00, _113);
				vec2 _117 = _115 * vec2(V_xClarityOffset);
				vec2 _118 = texcoord + _117;
				vec4 _123 = vec4(_118.x, _118.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _124 = textureLod(V_xClaritySampler3, _123.xy, _123.w);
				float _127 = _124.x * weight_97[int(i_101)];
				float _128 = color + _127;
				color = _128;
				float _131 = offset_95[int(i_101)] * 9.25925910e-04;
				vec2 _133 = vec2(0.00000000e+00, _131);
				vec2 _135 = _133 * vec2(V_xClarityOffset);
				vec2 _136 = texcoord - _135;
				vec4 _141 = vec4(_136.x, _136.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _142 = textureLod(V_xClaritySampler3, _141.xy, _141.w);
				float _145 = _142.x * weight_97[int(i_101)];
				float _146 = color + _145;
				color = _146;
			}
			int _110 = i_101 + 1;
			i_101 = _110;
		}
	}
	bool _151 = V_xClarityRadius == 2;
	if (_151)
	{
		float offset_153[11] = _152;
		float weight_155[11] = _154;
		float _157 = color * weight_155[0];
		color = _157;
		int i_159 = 1;
		while (i_159 < 11)
		{
			{
				float _171 = offset_153[int(i_159)] * 9.25925910e-04;
				vec2 _173 = vec2(0.00000000e+00, _171);
				vec2 _175 = _173 * vec2(V_xClarityOffset);
				vec2 _176 = texcoord + _175;
				vec4 _181 = vec4(_176.x, _176.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _182 = textureLod(V_xClaritySampler3, _181.xy, _181.w);
				float _185 = _182.x * weight_155[int(i_159)];
				float _186 = color + _185;
				color = _186;
				float _189 = offset_153[int(i_159)] * 9.25925910e-04;
				vec2 _191 = vec2(0.00000000e+00, _189);
				vec2 _193 = _191 * vec2(V_xClarityOffset);
				vec2 _194 = texcoord - _193;
				vec4 _199 = vec4(_194.x, _194.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _200 = textureLod(V_xClaritySampler3, _199.xy, _199.w);
				float _203 = _200.x * weight_155[int(i_159)];
				float _204 = color + _203;
				color = _204;
			}
			int _168 = i_159 + 1;
			i_159 = _168;
		}
	}
	bool _209 = V_xClarityRadius == 3;
	if (_209)
	{
		float offset_211[15] = _210;
		float weight_213[15] = _212;
		float _215 = color * weight_213[0];
		color = _215;
		int i_217 = 1;
		while (i_217 < 15)
		{
			{
				float _229 = offset_211[int(i_217)] * 9.25925910e-04;
				vec2 _231 = vec2(0.00000000e+00, _229);
				vec2 _233 = _231 * vec2(V_xClarityOffset);
				vec2 _234 = texcoord + _233;
				vec4 _239 = vec4(_234.x, _234.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _240 = textureLod(V_xClaritySampler3, _239.xy, _239.w);
				float _243 = _240.x * weight_213[int(i_217)];
				float _244 = color + _243;
				color = _244;
				float _247 = offset_211[int(i_217)] * 9.25925910e-04;
				vec2 _249 = vec2(0.00000000e+00, _247);
				vec2 _251 = _249 * vec2(V_xClarityOffset);
				vec2 _252 = texcoord - _251;
				vec4 _257 = vec4(_252.x, _252.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _258 = textureLod(V_xClaritySampler3, _257.xy, _257.w);
				float _261 = _258.x * weight_213[int(i_217)];
				float _262 = color + _261;
				color = _262;
			}
			int _226 = i_217 + 1;
			i_217 = _226;
		}
	}
	bool _267 = V_xClarityRadius == 4;
	if (_267)
	{
		float offset_269[18] = _268;
		float weight_271[18] = _270;
		float _273 = color * weight_271[0];
		color = _273;
		int i_275 = 1;
		while (i_275 < 18)
		{
			{
				float _287 = offset_269[int(i_275)] * 9.25925910e-04;
				vec2 _289 = vec2(0.00000000e+00, _287);
				vec2 _291 = _289 * vec2(V_xClarityOffset);
				vec2 _292 = texcoord + _291;
				vec4 _297 = vec4(_292.x, _292.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _298 = textureLod(V_xClaritySampler3, _297.xy, _297.w);
				float _301 = _298.x * weight_271[int(i_275)];
				float _302 = color + _301;
				color = _302;
				float _305 = offset_269[int(i_275)] * 9.25925910e-04;
				vec2 _307 = vec2(0.00000000e+00, _305);
				vec2 _309 = _307 * vec2(V_xClarityOffset);
				vec2 _310 = texcoord - _309;
				vec4 _315 = vec4(_310.x, _310.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _316 = textureLod(V_xClaritySampler3, _315.xy, _315.w);
				float _319 = _316.x * weight_271[int(i_275)];
				float _320 = color + _319;
				color = _320;
			}
			int _284 = i_275 + 1;
			i_275 = _284;
		}
	}
	vec4 _325 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _326 = textureLod(V_xBackBuffer, _325.xy, _325.w);
	vec3 orig = _326.xyz;
	float _331 = dot(orig.xyz, vec3(3.27868849e-01, 6.55737698e-01, 1.63934436e-02));
	float luma = _331;
	vec3 _335 = orig.xyz / vec3(luma);
	vec3 chroma = _335;
	float _338 = 1.00000000e+00 - color;
	float sharp = _338;
	float _340 = luma + sharp;
	float _342 = _340 * 5.00000000e-01;
	sharp = _342;
	float _345 = smoothstep(0.00000000e+00, 1.00000000e+00, sharp);
	float _348 = mix(0.00000000e+00, 1.00000000e+00, _345);
	float sharpMin = _348;
	float sharpMax = sharpMin;
	float _351 = mix(sharp, sharpMin, V_xClarityDarkIntensity);
	sharpMin = _351;
	float _352 = mix(sharp, sharpMax, V_xClarityLightIntensity);
	sharpMax = _352;
	float _354 = step(5.00000000e-01, sharp);
	float _355 = mix(sharpMin, sharpMax, _354);
	sharp = _355;
	if (V_xClarityViewMask)
	{
		orig.xyz = vec3(sharp);
		luma = sharp;
		chroma = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	}
	else
	{
		bool _365 = V_xClarityBlendMode == 0;
		if (_365)
		{
			float _367 = 2.00000000e+00 * luma;
			float _368 = _367 * sharp;
			float _369 = luma * luma;
			float _371 = 2.00000000e+00 * sharp;
			float _373 = 1.00000000e+00 - _371;
			float _374 = _369 * _373;
			float _375 = _368 + _374;
			float _377 = 2.00000000e+00 * luma;
			float _379 = 1.00000000e+00 - sharp;
			float _380 = _377 * _379;
			float _382 = pow(luma, 5.00000000e-01);
			float _384 = 2.00000000e+00 * sharp;
			float _386 = _384 - 1.00000000e+00;
			float _387 = _382 * _386;
			float _388 = _380 + _387;
			float _390 = step(4.90000010e-01, sharp);
			float _391 = mix(_375, _388, _390);
			sharp = _391;
		}
		bool _396 = V_xClarityBlendMode == 1;
		if (_396)
		{
			float _398 = 2.00000000e+00 * luma;
			float _399 = _398 * sharp;
			float _401 = 1.00000000e+00 - luma;
			float _403 = 2.00000000e+00 * _401;
			float _405 = 1.00000000e+00 - sharp;
			float _406 = _403 * _405;
			float _408 = 1.00000000e+00 - _406;
			float _410 = step(5.00000000e-01, luma);
			float _411 = mix(_399, _408, _410);
			sharp = _411;
		}
		bool _416 = V_xClarityBlendMode == 2;
		if (_416)
		{
			float _418 = 2.00000000e+00 * luma;
			float _419 = _418 * sharp;
			float _421 = 1.00000000e+00 - luma;
			float _423 = 2.00000000e+00 * _421;
			float _425 = 1.00000000e+00 - sharp;
			float _426 = _423 * _425;
			float _428 = 1.00000000e+00 - _426;
			float _430 = step(5.00000000e-01, sharp);
			float _431 = mix(_419, _428, _430);
			sharp = _431;
		}
		bool _436 = V_xClarityBlendMode == 3;
		if (_436)
		{
			float _438 = 2.00000000e+00 * luma;
			float _439 = _438 * sharp;
			float _440 = clamp(_439, 0.0, 1.0);
			sharp = _440;
		}
		bool _445 = V_xClarityBlendMode == 4;
		if (_445)
		{
			float _447 = 2.00000000e+00 * luma;
			float _448 = _447 * sharp;
			float _450 = 1.00000000e+00 - sharp;
			float _452 = 2.00000000e+00 * _450;
			float _453 = luma / _452;
			float _455 = step(5.00000000e-01, sharp);
			float _456 = mix(_448, _453, _455);
			sharp = _456;
		}
		bool _461 = V_xClarityBlendMode == 5;
		if (_461)
		{
			float _463 = 2.00000000e+00 * sharp;
			float _464 = luma + _463;
			float _466 = _464 - 1.00000000e+00;
			sharp = _466;
		}
		bool _471 = V_xClarityBlendMode == 6;
		if (_471)
		{
			float _473 = sharp - 5.00000000e-01;
			float _474 = luma + _473;
			float _475 = clamp(_474, 0.0, 1.0);
			sharp = _475;
		}
	}
	bool _480 = V_xClarityBlendIfDark > 0;
	bool _482 = V_xClarityBlendIfLight < 255;
	bool _483 = _480 || _482;
	bool _484 = _483 || V_xClarityViewBlendIfMask;
	if (_484)
	{
		float _487 = float(V_xClarityBlendIfDark) / 2.55000000e+02;
		float _489 = _487 + 9.99999975e-05;
		float ClarityBlendIfD = _489;
		float _493 = float(V_xClarityBlendIfLight) / 2.55000000e+02;
		float _495 = _493 - 9.99999975e-05;
		float ClarityBlendIfL = _495;
		float _499 = dot(orig.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
		float _mix = _499;
		float mask = 1.00000000e+00;
		bool _507 = V_xClarityBlendIfDark > 0;
		if (_507)
		{
			float _509 = ClarityBlendIfD * 2.00000003e-01;
			float _510 = ClarityBlendIfD - _509;
			float _512 = ClarityBlendIfD * 2.00000003e-01;
			float _513 = ClarityBlendIfD + _512;
			float _514 = smoothstep(_510, _513, _mix);
			float _517 = mix(0.00000000e+00, 1.00000000e+00, _514);
			mask = _517;
		}
		bool _522 = V_xClarityBlendIfLight < 255;
		if (_522)
		{
			float _524 = ClarityBlendIfL * 2.00000003e-01;
			float _525 = ClarityBlendIfL - _524;
			float _527 = ClarityBlendIfL * 2.00000003e-01;
			float _528 = ClarityBlendIfL + _527;
			float _529 = smoothstep(_525, _528, _mix);
			float _531 = mix(mask, 0.00000000e+00, _529);
			mask = _531;
		}
		float _532 = mix(luma, sharp, mask);
		sharp = _532;
		if (V_xClarityViewBlendIfMask)
		{
			sharp = mask;
			luma = mask;
			chroma = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
	}
	float _537 = mix(luma, sharp, V_xClarityStrength);
	orig.xyz = vec3(_537);
	vec3 _540 = orig.xyz * chroma;
	orig.xyz = _540;
	vec3 _541 = clamp(orig, 0.0, 1.0);
	return _541;
}
float F_xClarity1(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _550 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _551 = textureLod(V_xBackBuffer, _550.xy, _550.w);
	vec3 color_553 = _551.xyz;
	bool _558 = V_xClarityRadius == 0;
	if (_558)
	{
		float offset_560[4] = _36;
		float weight_562[4] = _38;
		vec3 _564 = color_553 * vec3(weight_562[0]);
		color_553 = _564;
		int i_566 = 1;
		while (i_566 < 4)
		{
			{
				float _578 = offset_560[int(i_566)] * 5.20833360e-04;
				vec2 _580 = vec2(_578, 0.00000000e+00);
				vec2 _582 = _580 * vec2(V_xClarityOffset);
				vec2 _583 = texcoord + _582;
				vec4 _588 = vec4(_583.x, _583.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _589 = textureLod(V_xBackBuffer, _588.xy, _588.w);
				vec3 _592 = _589.xyz * vec3(weight_562[int(i_566)]);
				vec3 _593 = color_553 + _592;
				color_553 = _593;
				float _596 = offset_560[int(i_566)] * 5.20833360e-04;
				vec2 _598 = vec2(_596, 0.00000000e+00);
				vec2 _600 = _598 * vec2(V_xClarityOffset);
				vec2 _601 = texcoord - _600;
				vec4 _606 = vec4(_601.x, _601.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _607 = textureLod(V_xBackBuffer, _606.xy, _606.w);
				vec3 _610 = _607.xyz * vec3(weight_562[int(i_566)]);
				vec3 _611 = color_553 + _610;
				color_553 = _611;
			}
			int _575 = i_566 + 1;
			i_566 = _575;
		}
	}
	bool _616 = V_xClarityRadius == 1;
	if (_616)
	{
		float offset_618[6] = _94;
		float weight_620[6] = _96;
		vec3 _622 = color_553 * vec3(weight_620[0]);
		color_553 = _622;
		int i_624 = 1;
		while (i_624 < 6)
		{
			{
				float _636 = offset_618[int(i_624)] * 5.20833360e-04;
				vec2 _638 = vec2(_636, 0.00000000e+00);
				vec2 _640 = _638 * vec2(V_xClarityOffset);
				vec2 _641 = texcoord + _640;
				vec4 _646 = vec4(_641.x, _641.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _647 = textureLod(V_xBackBuffer, _646.xy, _646.w);
				vec3 _650 = _647.xyz * vec3(weight_620[int(i_624)]);
				vec3 _651 = color_553 + _650;
				color_553 = _651;
				float _654 = offset_618[int(i_624)] * 5.20833360e-04;
				vec2 _656 = vec2(_654, 0.00000000e+00);
				vec2 _658 = _656 * vec2(V_xClarityOffset);
				vec2 _659 = texcoord - _658;
				vec4 _664 = vec4(_659.x, _659.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _665 = textureLod(V_xBackBuffer, _664.xy, _664.w);
				vec3 _668 = _665.xyz * vec3(weight_620[int(i_624)]);
				vec3 _669 = color_553 + _668;
				color_553 = _669;
			}
			int _633 = i_624 + 1;
			i_624 = _633;
		}
	}
	bool _674 = V_xClarityRadius == 2;
	if (_674)
	{
		float offset_676[11] = _152;
		float weight_678[11] = _154;
		vec3 _680 = color_553 * vec3(weight_678[0]);
		color_553 = _680;
		int i_682 = 1;
		while (i_682 < 11)
		{
			{
				float _694 = offset_676[int(i_682)] * 5.20833360e-04;
				vec2 _696 = vec2(_694, 0.00000000e+00);
				vec2 _698 = _696 * vec2(V_xClarityOffset);
				vec2 _699 = texcoord + _698;
				vec4 _704 = vec4(_699.x, _699.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _705 = textureLod(V_xBackBuffer, _704.xy, _704.w);
				vec3 _708 = _705.xyz * vec3(weight_678[int(i_682)]);
				vec3 _709 = color_553 + _708;
				color_553 = _709;
				float _712 = offset_676[int(i_682)] * 5.20833360e-04;
				vec2 _714 = vec2(_712, 0.00000000e+00);
				vec2 _716 = _714 * vec2(V_xClarityOffset);
				vec2 _717 = texcoord - _716;
				vec4 _722 = vec4(_717.x, _717.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _723 = textureLod(V_xBackBuffer, _722.xy, _722.w);
				vec3 _726 = _723.xyz * vec3(weight_678[int(i_682)]);
				vec3 _727 = color_553 + _726;
				color_553 = _727;
			}
			int _691 = i_682 + 1;
			i_682 = _691;
		}
	}
	bool _732 = V_xClarityRadius == 3;
	if (_732)
	{
		float offset_734[15] = _210;
		float weight_736[15] = _212;
		vec3 _738 = color_553 * vec3(weight_736[0]);
		color_553 = _738;
		int i_740 = 1;
		while (i_740 < 15)
		{
			{
				float _752 = offset_734[int(i_740)] * 5.20833360e-04;
				vec2 _754 = vec2(_752, 0.00000000e+00);
				vec2 _756 = _754 * vec2(V_xClarityOffset);
				vec2 _757 = texcoord + _756;
				vec4 _762 = vec4(_757.x, _757.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _763 = textureLod(V_xBackBuffer, _762.xy, _762.w);
				vec3 _766 = _763.xyz * vec3(weight_736[int(i_740)]);
				vec3 _767 = color_553 + _766;
				color_553 = _767;
				float _770 = offset_734[int(i_740)] * 5.20833360e-04;
				vec2 _772 = vec2(_770, 0.00000000e+00);
				vec2 _774 = _772 * vec2(V_xClarityOffset);
				vec2 _775 = texcoord - _774;
				vec4 _780 = vec4(_775.x, _775.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _781 = textureLod(V_xBackBuffer, _780.xy, _780.w);
				vec3 _784 = _781.xyz * vec3(weight_736[int(i_740)]);
				vec3 _785 = color_553 + _784;
				color_553 = _785;
			}
			int _749 = i_740 + 1;
			i_740 = _749;
		}
	}
	bool _790 = V_xClarityRadius == 4;
	if (_790)
	{
		float offset_792[18] = _268;
		float weight_794[18] = _270;
		vec3 _796 = color_553 * vec3(weight_794[0]);
		color_553 = _796;
		int i_798 = 1;
		while (i_798 < 18)
		{
			{
				float _810 = offset_792[int(i_798)] * 5.20833360e-04;
				vec2 _812 = vec2(_810, 0.00000000e+00);
				vec2 _814 = _812 * vec2(V_xClarityOffset);
				vec2 _815 = texcoord + _814;
				vec4 _820 = vec4(_815.x, _815.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _821 = textureLod(V_xBackBuffer, _820.xy, _820.w);
				vec3 _824 = _821.xyz * vec3(weight_794[int(i_798)]);
				vec3 _825 = color_553 + _824;
				color_553 = _825;
				float _828 = offset_792[int(i_798)] * 5.20833360e-04;
				vec2 _830 = vec2(_828, 0.00000000e+00);
				vec2 _832 = _830 * vec2(V_xClarityOffset);
				vec2 _833 = texcoord - _832;
				vec4 _838 = vec4(_833.x, _833.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _839 = textureLod(V_xBackBuffer, _838.xy, _838.w);
				vec3 _842 = _839.xyz * vec3(weight_794[int(i_798)]);
				vec3 _843 = color_553 + _842;
				color_553 = _843;
			}
			int _807 = i_798 + 1;
			i_798 = _807;
		}
	}
	float _846 = dot(color_553.xyz, vec3(3.27868849e-01, 6.55737698e-01, 1.63934436e-02));
	return _846;
}
float F_xClarity2(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _855 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _856 = textureLod(V_xClaritySampler, _855.xy, _855.w);
	float color_858 = _856.x;
	bool _863 = V_xClarityRadius == 0;
	if (_863)
	{
		float offset_865[4] = _36;
		float weight_867[4] = _38;
		float _869 = color_858 * weight_867[0];
		color_858 = _869;
		int i_871 = 1;
		while (i_871 < 4)
		{
			{
				float _883 = offset_865[int(i_871)] * 9.25925910e-04;
				vec2 _885 = vec2(0.00000000e+00, _883);
				vec2 _887 = _885 * vec2(V_xClarityOffset);
				vec2 _888 = texcoord + _887;
				vec4 _893 = vec4(_888.x, _888.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _894 = textureLod(V_xClaritySampler, _893.xy, _893.w);
				float _897 = _894.x * weight_867[int(i_871)];
				float _898 = color_858 + _897;
				color_858 = _898;
				float _901 = offset_865[int(i_871)] * 9.25925910e-04;
				vec2 _903 = vec2(0.00000000e+00, _901);
				vec2 _905 = _903 * vec2(V_xClarityOffset);
				vec2 _906 = texcoord - _905;
				vec4 _911 = vec4(_906.x, _906.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _912 = textureLod(V_xClaritySampler, _911.xy, _911.w);
				float _915 = _912.x * weight_867[int(i_871)];
				float _916 = color_858 + _915;
				color_858 = _916;
			}
			int _880 = i_871 + 1;
			i_871 = _880;
		}
	}
	bool _921 = V_xClarityRadius == 1;
	if (_921)
	{
		float offset_923[6] = _94;
		float weight_925[6] = _96;
		float _927 = color_858 * weight_925[0];
		color_858 = _927;
		int i_929 = 1;
		while (i_929 < 6)
		{
			{
				float _941 = offset_923[int(i_929)] * 9.25925910e-04;
				vec2 _943 = vec2(0.00000000e+00, _941);
				vec2 _945 = _943 * vec2(V_xClarityOffset);
				vec2 _946 = texcoord + _945;
				vec4 _951 = vec4(_946.x, _946.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _952 = textureLod(V_xClaritySampler, _951.xy, _951.w);
				float _955 = _952.x * weight_925[int(i_929)];
				float _956 = color_858 + _955;
				color_858 = _956;
				float _959 = offset_923[int(i_929)] * 9.25925910e-04;
				vec2 _961 = vec2(0.00000000e+00, _959);
				vec2 _963 = _961 * vec2(V_xClarityOffset);
				vec2 _964 = texcoord - _963;
				vec4 _969 = vec4(_964.x, _964.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _970 = textureLod(V_xClaritySampler, _969.xy, _969.w);
				float _973 = _970.x * weight_925[int(i_929)];
				float _974 = color_858 + _973;
				color_858 = _974;
			}
			int _938 = i_929 + 1;
			i_929 = _938;
		}
	}
	bool _979 = V_xClarityRadius == 2;
	if (_979)
	{
		float offset_981[11] = _152;
		float weight_983[11] = _154;
		float _985 = color_858 * weight_983[0];
		color_858 = _985;
		int i_987 = 1;
		while (i_987 < 11)
		{
			{
				float _999 = offset_981[int(i_987)] * 9.25925910e-04;
				vec2 _1001 = vec2(0.00000000e+00, _999);
				vec2 _1003 = _1001 * vec2(V_xClarityOffset);
				vec2 _1004 = texcoord + _1003;
				vec4 _1009 = vec4(_1004.x, _1004.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1010 = textureLod(V_xClaritySampler, _1009.xy, _1009.w);
				float _1013 = _1010.x * weight_983[int(i_987)];
				float _1014 = color_858 + _1013;
				color_858 = _1014;
				float _1017 = offset_981[int(i_987)] * 9.25925910e-04;
				vec2 _1019 = vec2(0.00000000e+00, _1017);
				vec2 _1021 = _1019 * vec2(V_xClarityOffset);
				vec2 _1022 = texcoord - _1021;
				vec4 _1027 = vec4(_1022.x, _1022.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1028 = textureLod(V_xClaritySampler, _1027.xy, _1027.w);
				float _1031 = _1028.x * weight_983[int(i_987)];
				float _1032 = color_858 + _1031;
				color_858 = _1032;
			}
			int _996 = i_987 + 1;
			i_987 = _996;
		}
	}
	bool _1037 = V_xClarityRadius == 3;
	if (_1037)
	{
		float offset_1039[15] = _210;
		float weight_1041[15] = _212;
		float _1043 = color_858 * weight_1041[0];
		color_858 = _1043;
		int i_1045 = 1;
		while (i_1045 < 15)
		{
			{
				float _1057 = offset_1039[int(i_1045)] * 9.25925910e-04;
				vec2 _1059 = vec2(0.00000000e+00, _1057);
				vec2 _1061 = _1059 * vec2(V_xClarityOffset);
				vec2 _1062 = texcoord + _1061;
				vec4 _1067 = vec4(_1062.x, _1062.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1068 = textureLod(V_xClaritySampler, _1067.xy, _1067.w);
				float _1071 = _1068.x * weight_1041[int(i_1045)];
				float _1072 = color_858 + _1071;
				color_858 = _1072;
				float _1075 = offset_1039[int(i_1045)] * 9.25925910e-04;
				vec2 _1077 = vec2(0.00000000e+00, _1075);
				vec2 _1079 = _1077 * vec2(V_xClarityOffset);
				vec2 _1080 = texcoord - _1079;
				vec4 _1085 = vec4(_1080.x, _1080.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1086 = textureLod(V_xClaritySampler, _1085.xy, _1085.w);
				float _1089 = _1086.x * weight_1041[int(i_1045)];
				float _1090 = color_858 + _1089;
				color_858 = _1090;
			}
			int _1054 = i_1045 + 1;
			i_1045 = _1054;
		}
	}
	bool _1095 = V_xClarityRadius == 4;
	if (_1095)
	{
		float offset_1097[18] = _268;
		float weight_1099[18] = _270;
		float _1101 = color_858 * weight_1099[0];
		color_858 = _1101;
		int i_1103 = 1;
		while (i_1103 < 18)
		{
			{
				float _1115 = offset_1097[int(i_1103)] * 9.25925910e-04;
				vec2 _1117 = vec2(0.00000000e+00, _1115);
				vec2 _1119 = _1117 * vec2(V_xClarityOffset);
				vec2 _1120 = texcoord + _1119;
				vec4 _1125 = vec4(_1120.x, _1120.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1126 = textureLod(V_xClaritySampler, _1125.xy, _1125.w);
				float _1129 = _1126.x * weight_1099[int(i_1103)];
				float _1130 = color_858 + _1129;
				color_858 = _1130;
				float _1133 = offset_1097[int(i_1103)] * 9.25925910e-04;
				vec2 _1135 = vec2(0.00000000e+00, _1133);
				vec2 _1137 = _1135 * vec2(V_xClarityOffset);
				vec2 _1138 = texcoord - _1137;
				vec4 _1143 = vec4(_1138.x, _1138.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1144 = textureLod(V_xClaritySampler, _1143.xy, _1143.w);
				float _1147 = _1144.x * weight_1099[int(i_1103)];
				float _1148 = color_858 + _1147;
				color_858 = _1148;
			}
			int _1112 = i_1103 + 1;
			i_1103 = _1112;
		}
	}
	return color_858;
}
float F_xClarity3(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _1157 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1158 = textureLod(V_xClaritySampler2, _1157.xy, _1157.w);
	float color_1160 = _1158.x;
	bool _1165 = V_xClarityRadius == 0;
	if (_1165)
	{
		float offset_1167[4] = _36;
		float weight_1169[4] = _38;
		float _1171 = color_1160 * weight_1169[0];
		color_1160 = _1171;
		int i_1173 = 1;
		while (i_1173 < 4)
		{
			{
				float _1185 = offset_1167[int(i_1173)] * 5.20833360e-04;
				vec2 _1187 = vec2(_1185, 0.00000000e+00);
				vec2 _1189 = _1187 * vec2(V_xClarityOffset);
				vec2 _1190 = texcoord + _1189;
				vec4 _1195 = vec4(_1190.x, _1190.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1196 = textureLod(V_xClaritySampler2, _1195.xy, _1195.w);
				float _1199 = _1196.x * weight_1169[int(i_1173)];
				float _1200 = color_1160 + _1199;
				color_1160 = _1200;
				float _1203 = offset_1167[int(i_1173)] * 5.20833360e-04;
				vec2 _1205 = vec2(_1203, 0.00000000e+00);
				vec2 _1207 = _1205 * vec2(V_xClarityOffset);
				vec2 _1208 = texcoord - _1207;
				vec4 _1213 = vec4(_1208.x, _1208.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1214 = textureLod(V_xClaritySampler2, _1213.xy, _1213.w);
				float _1217 = _1214.x * weight_1169[int(i_1173)];
				float _1218 = color_1160 + _1217;
				color_1160 = _1218;
			}
			int _1182 = i_1173 + 1;
			i_1173 = _1182;
		}
	}
	bool _1223 = V_xClarityRadius == 1;
	if (_1223)
	{
		float offset_1225[6] = _94;
		float weight_1227[6] = _96;
		float _1229 = color_1160 * weight_1227[0];
		color_1160 = _1229;
		int i_1231 = 1;
		while (i_1231 < 6)
		{
			{
				float _1243 = offset_1225[int(i_1231)] * 5.20833360e-04;
				vec2 _1245 = vec2(_1243, 0.00000000e+00);
				vec2 _1247 = _1245 * vec2(V_xClarityOffset);
				vec2 _1248 = texcoord + _1247;
				vec4 _1253 = vec4(_1248.x, _1248.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1254 = textureLod(V_xClaritySampler2, _1253.xy, _1253.w);
				float _1257 = _1254.x * weight_1227[int(i_1231)];
				float _1258 = color_1160 + _1257;
				color_1160 = _1258;
				float _1261 = offset_1225[int(i_1231)] * 5.20833360e-04;
				vec2 _1263 = vec2(_1261, 0.00000000e+00);
				vec2 _1265 = _1263 * vec2(V_xClarityOffset);
				vec2 _1266 = texcoord - _1265;
				vec4 _1271 = vec4(_1266.x, _1266.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1272 = textureLod(V_xClaritySampler2, _1271.xy, _1271.w);
				float _1275 = _1272.x * weight_1227[int(i_1231)];
				float _1276 = color_1160 + _1275;
				color_1160 = _1276;
			}
			int _1240 = i_1231 + 1;
			i_1231 = _1240;
		}
	}
	bool _1281 = V_xClarityRadius == 2;
	if (_1281)
	{
		float offset_1283[11] = _152;
		float weight_1285[11] = _154;
		float _1287 = color_1160 * weight_1285[0];
		color_1160 = _1287;
		int i_1289 = 1;
		while (i_1289 < 11)
		{
			{
				float _1301 = offset_1283[int(i_1289)] * 5.20833360e-04;
				vec2 _1303 = vec2(_1301, 0.00000000e+00);
				vec2 _1305 = _1303 * vec2(V_xClarityOffset);
				vec2 _1306 = texcoord + _1305;
				vec4 _1311 = vec4(_1306.x, _1306.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1312 = textureLod(V_xClaritySampler2, _1311.xy, _1311.w);
				float _1315 = _1312.x * weight_1285[int(i_1289)];
				float _1316 = color_1160 + _1315;
				color_1160 = _1316;
				float _1319 = offset_1283[int(i_1289)] * 5.20833360e-04;
				vec2 _1321 = vec2(_1319, 0.00000000e+00);
				vec2 _1323 = _1321 * vec2(V_xClarityOffset);
				vec2 _1324 = texcoord - _1323;
				vec4 _1329 = vec4(_1324.x, _1324.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1330 = textureLod(V_xClaritySampler2, _1329.xy, _1329.w);
				float _1333 = _1330.x * weight_1285[int(i_1289)];
				float _1334 = color_1160 + _1333;
				color_1160 = _1334;
			}
			int _1298 = i_1289 + 1;
			i_1289 = _1298;
		}
	}
	bool _1339 = V_xClarityRadius == 3;
	if (_1339)
	{
		float offset_1341[15] = _210;
		float weight_1343[15] = _212;
		float _1345 = color_1160 * weight_1343[0];
		color_1160 = _1345;
		int i_1347 = 1;
		while (i_1347 < 15)
		{
			{
				float _1359 = offset_1341[int(i_1347)] * 5.20833360e-04;
				vec2 _1361 = vec2(_1359, 0.00000000e+00);
				vec2 _1363 = _1361 * vec2(V_xClarityOffset);
				vec2 _1364 = texcoord + _1363;
				vec4 _1369 = vec4(_1364.x, _1364.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1370 = textureLod(V_xClaritySampler2, _1369.xy, _1369.w);
				float _1373 = _1370.x * weight_1343[int(i_1347)];
				float _1374 = color_1160 + _1373;
				color_1160 = _1374;
				float _1377 = offset_1341[int(i_1347)] * 5.20833360e-04;
				vec2 _1379 = vec2(_1377, 0.00000000e+00);
				vec2 _1381 = _1379 * vec2(V_xClarityOffset);
				vec2 _1382 = texcoord - _1381;
				vec4 _1387 = vec4(_1382.x, _1382.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1388 = textureLod(V_xClaritySampler2, _1387.xy, _1387.w);
				float _1391 = _1388.x * weight_1343[int(i_1347)];
				float _1392 = color_1160 + _1391;
				color_1160 = _1392;
			}
			int _1356 = i_1347 + 1;
			i_1347 = _1356;
		}
	}
	bool _1397 = V_xClarityRadius == 4;
	if (_1397)
	{
		float offset_1399[18] = _268;
		float weight_1401[18] = _270;
		float _1403 = color_1160 * weight_1401[0];
		color_1160 = _1403;
		int i_1405 = 1;
		while (i_1405 < 18)
		{
			{
				float _1417 = offset_1399[int(i_1405)] * 5.20833360e-04;
				vec2 _1419 = vec2(_1417, 0.00000000e+00);
				vec2 _1421 = _1419 * vec2(V_xClarityOffset);
				vec2 _1422 = texcoord + _1421;
				vec4 _1427 = vec4(_1422.x, _1422.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1428 = textureLod(V_xClaritySampler2, _1427.xy, _1427.w);
				float _1431 = _1428.x * weight_1401[int(i_1405)];
				float _1432 = color_1160 + _1431;
				color_1160 = _1432;
				float _1435 = offset_1399[int(i_1405)] * 5.20833360e-04;
				vec2 _1437 = vec2(_1435, 0.00000000e+00);
				vec2 _1439 = _1437 * vec2(V_xClarityOffset);
				vec2 _1440 = texcoord - _1439;
				vec4 _1445 = vec4(_1440.x, _1440.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1446 = textureLod(V_xClaritySampler2, _1445.xy, _1445.w);
				float _1449 = _1446.x * weight_1401[int(i_1405)];
				float _1450 = color_1160 + _1449;
				color_1160 = _1450;
			}
			int _1414 = i_1405 + 1;
			i_1405 = _1414;
		}
	}
	return color_1160;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _1457 = id == 2u;
	float _1460 = _1457 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _1460;
	bool _1462 = id == 1u;
	float _1465 = _1462 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _1465;
	vec2 _1467 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1469 = _1467 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1474 = vec4(_1469.x, _1469.y, 0.00000000e+00, 1.00000000e+00);
	position = _1474;
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
#ifdef E_xClarity1
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xClarity1(pos, texcoord);
	return;
}
#endif
#ifdef E_xClarity2
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xClarity2(pos, texcoord);
	return;
}
#endif
#ifdef E_xClarity3
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xClarity3(pos, texcoord);
	return;
}
#endif
#ifdef E_xClarityFinal
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xClarityFinal(pos, texcoord);
	return;
}
#endif
