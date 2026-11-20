#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xGaussianBlur1
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xGaussianBlurRadius;
uniform float V_xGaussianBlurOffset;
uniform float V_xGaussianBlurStrength;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xGaussianBlurSampler;
const float _78[4] = float[4](0.00000000e+00, 1.18242550e+00, 3.02931213e+00, 5.00407028e+00);
const float _80[4] = float[4](3.98939997e-01, 2.95960009e-01, 4.56565246e-03, 1.49278685e-06);
const float _126[6] = float[6](0.00000000e+00, 1.45842957e+00, 3.40398479e+00, 5.35180569e+00, 7.30294085e+00, 9.25815964e+00);
const float _128[6] = float[6](1.32980004e-01, 2.32275754e-01, 1.35326162e-01, 5.11557423e-02, 1.25392200e-02, 1.99136441e-03);
const float _174[11] = float[11](0.00000000e+00, 1.48958480e+00, 3.47571349e+00, 5.46187973e+00, 7.44810438e+00, 9.43440819e+00, 1.14208107e+01, 1.34073334e+01, 1.53939934e+01, 1.73808098e+01, 1.93677998e+01);
const float _176[11] = float[11](6.64900020e-02, 1.28469750e-01, 1.11918248e-01, 8.73132646e-02, 6.10011108e-02, 3.81655693e-02, 2.13835668e-02, 1.07290242e-02, 4.82068677e-03, 1.93964690e-03, 6.98871794e-04);
const float _222[15] = float[15](0.00000000e+00, 1.49537051e+00, 3.48919916e+00, 5.48303127e+00, 7.47686815e+00, 9.47071266e+00, 1.14645653e+01, 1.34584293e+01, 1.54523058e+01, 1.74461975e+01, 1.94401035e+01, 2.14340286e+01, 2.34279728e+01, 2.54219398e+01, 2.74159298e+01);
const float _224[15] = float[15](4.43266667e-02, 8.72994736e-02, 8.20892006e-02, 7.34818354e-02, 6.26171678e-02, 5.07956184e-02, 3.92263979e-02, 2.88369805e-02, 2.01808885e-02, 1.34446556e-02, 8.52663908e-03, 5.14783571e-03, 2.95862486e-03, 1.61872571e-03, 8.43091286e-04);
const float _270[18] = float[18](0.00000000e+00, 1.49537051e+00, 3.48919916e+00, 5.48303127e+00, 7.47686815e+00, 9.47071266e+00, 1.14645653e+01, 1.34584293e+01, 1.54523058e+01, 1.74461975e+01, 1.94661980e+01, 2.14627419e+01, 2.34592915e+01, 2.54558449e+01, 2.74524021e+01, 2.94489632e+01, 3.14455299e+01, 3.34421005e+01);
const float _272[18] = float[18](3.32450010e-02, 6.59162253e-02, 6.36705831e-02, 5.98194674e-02, 5.46642579e-02, 4.85871658e-02, 4.20046002e-02, 3.53207029e-02, 2.88880989e-02, 2.29808316e-02, 1.77815519e-02, 1.33822970e-02, 9.79600009e-03, 6.97467476e-03, 4.83010057e-03, 3.25345970e-03, 2.13153102e-03, 1.35829742e-03);
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _13 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _13;
	float _16 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _16;
	float _19 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _19;
	float _22 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _22;
	vec4 _27 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _28 = textureLod(V_xReShade_xDepthBuffer, _27.xy, _27.w);
	float _31 = _28.x * 1.00000000e+00;
	float depth = _31;
	float _34 = 1.00000000e+00 - depth;
	depth = _34;
	float _36 = depth * 9.99000000e+02;
	float _38 = 1.00000000e+03 - _36;
	float _39 = depth / _38;
	depth = _39;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _46 = id == 2u;
	float _49 = _46 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _49;
	bool _51 = id == 1u;
	float _54 = _51 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _54;
	vec2 _56 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _58 = _56 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _63 = vec4(_58.x, _58.y, 0.00000000e+00, 1.00000000e+00);
	position = _63;
	return;
}
vec3 F_xGaussianBlurFinal(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _70 = texture(V_xGaussianBlurSampler, texcoord);
	vec3 color = _70.xyz;
	bool _77 = V_xGaussianBlurRadius == 0;
	if (_77)
	{
		float offset[4] = _78;
		float weight[4] = _80;
		vec3 _83 = color * vec3(weight[0]);
		color = _83;
		int i = 1;
		while (i < 4)
		{
			{
				float _97 = offset[int(i)] * 9.25925910e-04;
				vec2 _99 = vec2(0.00000000e+00, _97);
				vec2 _101 = _99 * vec2(V_xGaussianBlurOffset);
				vec2 _102 = texcoord + _101;
				vec4 _103 = texture(V_xGaussianBlurSampler, _102);
				vec3 _106 = _103.xyz * vec3(weight[int(i)]);
				vec3 _107 = color + _106;
				color = _107;
				float _110 = offset[int(i)] * 9.25925910e-04;
				vec2 _112 = vec2(0.00000000e+00, _110);
				vec2 _114 = _112 * vec2(V_xGaussianBlurOffset);
				vec2 _115 = texcoord - _114;
				vec4 _116 = texture(V_xGaussianBlurSampler, _115);
				vec3 _119 = _116.xyz * vec3(weight[int(i)]);
				vec3 _120 = color + _119;
				color = _120;
			}
			int _94 = i + 1;
			i = _94;
		}
	}
	bool _125 = V_xGaussianBlurRadius == 1;
	if (_125)
	{
		float offset_127[6] = _126;
		float weight_129[6] = _128;
		vec3 _131 = color * vec3(weight_129[0]);
		color = _131;
		int i_133 = 1;
		while (i_133 < 6)
		{
			{
				float _145 = offset_127[int(i_133)] * 9.25925910e-04;
				vec2 _147 = vec2(0.00000000e+00, _145);
				vec2 _149 = _147 * vec2(V_xGaussianBlurOffset);
				vec2 _150 = texcoord + _149;
				vec4 _151 = texture(V_xGaussianBlurSampler, _150);
				vec3 _154 = _151.xyz * vec3(weight_129[int(i_133)]);
				vec3 _155 = color + _154;
				color = _155;
				float _158 = offset_127[int(i_133)] * 9.25925910e-04;
				vec2 _160 = vec2(0.00000000e+00, _158);
				vec2 _162 = _160 * vec2(V_xGaussianBlurOffset);
				vec2 _163 = texcoord - _162;
				vec4 _164 = texture(V_xGaussianBlurSampler, _163);
				vec3 _167 = _164.xyz * vec3(weight_129[int(i_133)]);
				vec3 _168 = color + _167;
				color = _168;
			}
			int _142 = i_133 + 1;
			i_133 = _142;
		}
	}
	bool _173 = V_xGaussianBlurRadius == 2;
	if (_173)
	{
		float offset_175[11] = _174;
		float weight_177[11] = _176;
		vec3 _179 = color * vec3(weight_177[0]);
		color = _179;
		int i_181 = 1;
		while (i_181 < 11)
		{
			{
				float _193 = offset_175[int(i_181)] * 9.25925910e-04;
				vec2 _195 = vec2(0.00000000e+00, _193);
				vec2 _197 = _195 * vec2(V_xGaussianBlurOffset);
				vec2 _198 = texcoord + _197;
				vec4 _199 = texture(V_xGaussianBlurSampler, _198);
				vec3 _202 = _199.xyz * vec3(weight_177[int(i_181)]);
				vec3 _203 = color + _202;
				color = _203;
				float _206 = offset_175[int(i_181)] * 9.25925910e-04;
				vec2 _208 = vec2(0.00000000e+00, _206);
				vec2 _210 = _208 * vec2(V_xGaussianBlurOffset);
				vec2 _211 = texcoord - _210;
				vec4 _212 = texture(V_xGaussianBlurSampler, _211);
				vec3 _215 = _212.xyz * vec3(weight_177[int(i_181)]);
				vec3 _216 = color + _215;
				color = _216;
			}
			int _190 = i_181 + 1;
			i_181 = _190;
		}
	}
	bool _221 = V_xGaussianBlurRadius == 3;
	if (_221)
	{
		float offset_223[15] = _222;
		float weight_225[15] = _224;
		vec3 _227 = color * vec3(weight_225[0]);
		color = _227;
		int i_229 = 1;
		while (i_229 < 15)
		{
			{
				float _241 = offset_223[int(i_229)] * 9.25925910e-04;
				vec2 _243 = vec2(0.00000000e+00, _241);
				vec2 _245 = _243 * vec2(V_xGaussianBlurOffset);
				vec2 _246 = texcoord + _245;
				vec4 _247 = texture(V_xGaussianBlurSampler, _246);
				vec3 _250 = _247.xyz * vec3(weight_225[int(i_229)]);
				vec3 _251 = color + _250;
				color = _251;
				float _254 = offset_223[int(i_229)] * 9.25925910e-04;
				vec2 _256 = vec2(0.00000000e+00, _254);
				vec2 _258 = _256 * vec2(V_xGaussianBlurOffset);
				vec2 _259 = texcoord - _258;
				vec4 _260 = texture(V_xGaussianBlurSampler, _259);
				vec3 _263 = _260.xyz * vec3(weight_225[int(i_229)]);
				vec3 _264 = color + _263;
				color = _264;
			}
			int _238 = i_229 + 1;
			i_229 = _238;
		}
	}
	bool _269 = V_xGaussianBlurRadius == 4;
	if (_269)
	{
		float offset_271[18] = _270;
		float weight_273[18] = _272;
		vec3 _275 = color * vec3(weight_273[0]);
		color = _275;
		int i_277 = 1;
		while (i_277 < 18)
		{
			{
				float _289 = offset_271[int(i_277)] * 9.25925910e-04;
				vec2 _291 = vec2(0.00000000e+00, _289);
				vec2 _293 = _291 * vec2(V_xGaussianBlurOffset);
				vec2 _294 = texcoord + _293;
				vec4 _295 = texture(V_xGaussianBlurSampler, _294);
				vec3 _298 = _295.xyz * vec3(weight_273[int(i_277)]);
				vec3 _299 = color + _298;
				color = _299;
				float _302 = offset_271[int(i_277)] * 9.25925910e-04;
				vec2 _304 = vec2(0.00000000e+00, _302);
				vec2 _306 = _304 * vec2(V_xGaussianBlurOffset);
				vec2 _307 = texcoord - _306;
				vec4 _308 = texture(V_xGaussianBlurSampler, _307);
				vec3 _311 = _308.xyz * vec3(weight_273[int(i_277)]);
				vec3 _312 = color + _311;
				color = _312;
			}
			int _286 = i_277 + 1;
			i_277 = _286;
		}
	}
	vec4 _313 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 orig = _313.xyz;
	vec3 _317 = mix(orig, color, vec3(V_xGaussianBlurStrength));
	orig = _317;
	vec3 _318 = clamp(orig, 0.0, 1.0);
	return _318;
}
vec3 F_xGaussianBlur1(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _323 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color_325 = _323.xyz;
	bool _330 = V_xGaussianBlurRadius == 0;
	if (_330)
	{
		float offset_332[4] = _78;
		float weight_334[4] = _80;
		vec3 _336 = color_325 * vec3(weight_334[0]);
		color_325 = _336;
		int i_338 = 1;
		while (i_338 < 4)
		{
			{
				float _350 = offset_332[int(i_338)] * 5.20833360e-04;
				vec2 _352 = vec2(_350, 0.00000000e+00);
				vec2 _354 = _352 * vec2(V_xGaussianBlurOffset);
				vec2 _355 = texcoord + _354;
				vec4 _356 = texture(V_xReShade_xBackBuffer, _355);
				vec3 _359 = _356.xyz * vec3(weight_334[int(i_338)]);
				vec3 _360 = color_325 + _359;
				color_325 = _360;
				float _363 = offset_332[int(i_338)] * 5.20833360e-04;
				vec2 _365 = vec2(_363, 0.00000000e+00);
				vec2 _367 = _365 * vec2(V_xGaussianBlurOffset);
				vec2 _368 = texcoord - _367;
				vec4 _369 = texture(V_xReShade_xBackBuffer, _368);
				vec3 _372 = _369.xyz * vec3(weight_334[int(i_338)]);
				vec3 _373 = color_325 + _372;
				color_325 = _373;
			}
			int _347 = i_338 + 1;
			i_338 = _347;
		}
	}
	bool _378 = V_xGaussianBlurRadius == 1;
	if (_378)
	{
		float offset_380[6] = _126;
		float weight_382[6] = _128;
		vec3 _384 = color_325 * vec3(weight_382[0]);
		color_325 = _384;
		int i_386 = 1;
		while (i_386 < 6)
		{
			{
				float _398 = offset_380[int(i_386)] * 5.20833360e-04;
				vec2 _400 = vec2(_398, 0.00000000e+00);
				vec2 _402 = _400 * vec2(V_xGaussianBlurOffset);
				vec2 _403 = texcoord + _402;
				vec4 _404 = texture(V_xReShade_xBackBuffer, _403);
				vec3 _407 = _404.xyz * vec3(weight_382[int(i_386)]);
				vec3 _408 = color_325 + _407;
				color_325 = _408;
				float _411 = offset_380[int(i_386)] * 5.20833360e-04;
				vec2 _413 = vec2(_411, 0.00000000e+00);
				vec2 _415 = _413 * vec2(V_xGaussianBlurOffset);
				vec2 _416 = texcoord - _415;
				vec4 _417 = texture(V_xReShade_xBackBuffer, _416);
				vec3 _420 = _417.xyz * vec3(weight_382[int(i_386)]);
				vec3 _421 = color_325 + _420;
				color_325 = _421;
			}
			int _395 = i_386 + 1;
			i_386 = _395;
		}
	}
	bool _426 = V_xGaussianBlurRadius == 2;
	if (_426)
	{
		float offset_428[11] = _174;
		float weight_430[11] = _176;
		vec3 _432 = color_325 * vec3(weight_430[0]);
		color_325 = _432;
		int i_434 = 1;
		while (i_434 < 11)
		{
			{
				float _446 = offset_428[int(i_434)] * 5.20833360e-04;
				vec2 _448 = vec2(_446, 0.00000000e+00);
				vec2 _450 = _448 * vec2(V_xGaussianBlurOffset);
				vec2 _451 = texcoord + _450;
				vec4 _452 = texture(V_xReShade_xBackBuffer, _451);
				vec3 _455 = _452.xyz * vec3(weight_430[int(i_434)]);
				vec3 _456 = color_325 + _455;
				color_325 = _456;
				float _459 = offset_428[int(i_434)] * 5.20833360e-04;
				vec2 _461 = vec2(_459, 0.00000000e+00);
				vec2 _463 = _461 * vec2(V_xGaussianBlurOffset);
				vec2 _464 = texcoord - _463;
				vec4 _465 = texture(V_xReShade_xBackBuffer, _464);
				vec3 _468 = _465.xyz * vec3(weight_430[int(i_434)]);
				vec3 _469 = color_325 + _468;
				color_325 = _469;
			}
			int _443 = i_434 + 1;
			i_434 = _443;
		}
	}
	bool _474 = V_xGaussianBlurRadius == 3;
	if (_474)
	{
		float offset_476[15] = _222;
		float weight_478[15] = _224;
		vec3 _480 = color_325 * vec3(weight_478[0]);
		color_325 = _480;
		int i_482 = 1;
		while (i_482 < 15)
		{
			{
				float _494 = offset_476[int(i_482)] * 5.20833360e-04;
				vec2 _496 = vec2(_494, 0.00000000e+00);
				vec2 _498 = _496 * vec2(V_xGaussianBlurOffset);
				vec2 _499 = texcoord + _498;
				vec4 _500 = texture(V_xReShade_xBackBuffer, _499);
				vec3 _503 = _500.xyz * vec3(weight_478[int(i_482)]);
				vec3 _504 = color_325 + _503;
				color_325 = _504;
				float _507 = offset_476[int(i_482)] * 5.20833360e-04;
				vec2 _509 = vec2(_507, 0.00000000e+00);
				vec2 _511 = _509 * vec2(V_xGaussianBlurOffset);
				vec2 _512 = texcoord - _511;
				vec4 _513 = texture(V_xReShade_xBackBuffer, _512);
				vec3 _516 = _513.xyz * vec3(weight_478[int(i_482)]);
				vec3 _517 = color_325 + _516;
				color_325 = _517;
			}
			int _491 = i_482 + 1;
			i_482 = _491;
		}
	}
	bool _522 = V_xGaussianBlurRadius == 4;
	if (_522)
	{
		float offset_524[18] = _270;
		float weight_526[18] = _272;
		vec3 _528 = color_325 * vec3(weight_526[0]);
		color_325 = _528;
		int i_530 = 1;
		while (i_530 < 18)
		{
			{
				float _542 = offset_524[int(i_530)] * 5.20833360e-04;
				vec2 _544 = vec2(_542, 0.00000000e+00);
				vec2 _546 = _544 * vec2(V_xGaussianBlurOffset);
				vec2 _547 = texcoord + _546;
				vec4 _548 = texture(V_xReShade_xBackBuffer, _547);
				vec3 _551 = _548.xyz * vec3(weight_526[int(i_530)]);
				vec3 _552 = color_325 + _551;
				color_325 = _552;
				float _555 = offset_524[int(i_530)] * 5.20833360e-04;
				vec2 _557 = vec2(_555, 0.00000000e+00);
				vec2 _559 = _557 * vec2(V_xGaussianBlurOffset);
				vec2 _560 = texcoord - _559;
				vec4 _561 = texture(V_xReShade_xBackBuffer, _560);
				vec3 _564 = _561.xyz * vec3(weight_526[int(i_530)]);
				vec3 _565 = color_325 + _564;
				color_325 = _565;
			}
			int _539 = i_530 + 1;
			i_530 = _539;
		}
	}
	vec3 _566 = clamp(color_325, 0.0, 1.0);
	return _566;
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
#ifdef E_xGaussianBlur1
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xGaussianBlur1(pos, texcoord);
	return;
}
#endif
#ifdef E_xGaussianBlurFinal
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xGaussianBlurFinal(pos, texcoord);
	return;
}
#endif
