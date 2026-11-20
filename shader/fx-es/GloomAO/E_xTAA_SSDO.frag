#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xTAA_SSDO
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
float fmodHLSL(float x, float y) { return x - y * trunc(x / y); }
vec2 fmodHLSL(vec2 x, vec2 y) { return x - y * trunc(x / y); }
vec3 fmodHLSL(vec3 x, vec3 y) { return x - y * trunc(x / y); }
vec4 fmodHLSL(vec4 x, vec4 y) { return x - y * trunc(x / y); }
mat2 fmodHLSL(mat2 x, mat2 y) { return x - matrixCompMult(y, mat2(trunc(x[0] / y[0]), trunc(x[1] / y[1]))); }
mat3 fmodHLSL(mat3 x, mat3 y) { return x - matrixCompMult(y, mat3(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]))); }
mat4 fmodHLSL(mat4 x, mat4 y) { return x - matrixCompMult(y, mat4(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]), trunc(x[3] / y[3]))); }
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
uniform int V_xGloomAO;
uniform int V_xSSDO_MipSampling;
uniform int V_xSSDO_Levels;
uniform float V_xSSDO_SampleRadius;
uniform vec2 V_xSet_2DTexture_Detail;
uniform vec2 V_xNCD;
uniform float V_xSSDO_Trimming;
uniform float V_xSSDO_Fade;
uniform int V_xSSDO_X2;
uniform float V_xSSDO_Power;
uniform float V_xSSDO_ColorPower;
uniform float V_xSSDO_Saturation;
uniform float V_xSSDO_Intensity_Masking;
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform float V_xOffset;
uniform float V_xSSDO_Max_Depth;
uniform bool V_xDepth_Map_Flip;
uniform int V_xDebug;
uniform int V_xSamplesXY;
uniform float V_xPersistence;
uniform bool V_xDither_SSDO;
uniform vec2 V_xHorizontal_and_Vertical;
uniform vec2 V_xImage_Position_Adjust;
uniform int V_xEasy_SS_Scaling;
uniform bool V_xDepth_Guide;
uniform bool V_xText_Info;
uniform int V_xframecount;
uniform float V_xclock;

uniform sampler2D V_xZBufferSSDO;
uniform sampler2D V_xBackBufferSSDO;
uniform sampler2D V_xSSDOaccuFrames;
uniform sampler2D V_xSamplerNormalsSSDO;
uniform sampler2D V_xSamplerColorsSSDO;
uniform sampler2D V_xSamplerDepthSSDO;
uniform sampler2D V_xSamplerSSDO;
uniform sampler2D V_xSamplerSSDOH;
uniform sampler2D V_xSamplerSSDOV;
const vec2 _1221[64] = vec2[64](vec2(5.27349591e-01, 3.28432113e-01), vec2(-9.20430839e-01, -7.98364356e-02), vec2(6.64333522e-01, -6.89697146e-01), vec2(-4.48505521e-01, -8.02670479e-01), vec2(-5.08904636e-01, 6.45888746e-01), vec2(8.89725015e-02, -2.80648917e-01), vec2(-2.98380941e-01, 1.02784380e-01), vec2(-8.62115324e-01, -4.83563095e-01), vec2(5.99943101e-01, -1.45615682e-01), vec2(8.78527984e-02, -9.46268260e-01), vec2(7.08761439e-02, 8.60208273e-01), vec2(-8.53472590e-01, 2.96811521e-01), vec2(9.53938067e-01, 3.00979000e-02), vec2(1.00879371e-01, 3.45735848e-01), vec2(-2.01591820e-01, -4.49094087e-01), vec2(6.78224266e-01, 6.65856302e-01), vec2(-1.03947423e-01, -7.22120464e-01), vec2(3.19809943e-01, -6.79001927e-01), vec2(3.83940190e-01, -3.69024783e-01), vec2(-2.22077250e-01, 8.49453270e-01), vec2(-4.75295424e-01, 3.76841635e-01), vec2(-5.36729813e-01, -1.96425527e-01), vec2(-1.35222748e-01, 5.60514331e-01), vec2(3.87039721e-01, -1.48412615e-01), vec2(3.70496541e-01, 5.15492260e-01), vec2(6.67272449e-01, -5.21372855e-01), vec2(7.82612383e-01, 4.63993460e-01), vec2(-1.54119311e-02, 1.42505597e-02), vec2(-4.76092130e-01, 2.27301661e-02), vec2(-6.08436763e-01, -5.18733740e-01), vec2(2.79539585e-01, 1.62240252e-01), vec2(3.73600632e-01, 9.11723435e-01), vec2(-6.91941798e-01, -7.76023641e-02), vec2(7.44476691e-02, 2.03110710e-01), vec2(-2.22294316e-01, -9.47865129e-01), vec2(-1.00339420e-01, 3.96007895e-01), vec2(4.56802905e-01, -8.79162788e-01), vec2(-8.78538251e-01, 1.01805493e-01), vec2(8.53768229e-01, -3.86588216e-01), vec2(6.09609187e-02, -5.42000890e-01), vec2(-2.36693546e-01, -2.69998878e-01), vec2(-7.15148389e-01, 4.48328018e-01), vec2(-4.76106226e-01, -4.03038949e-01), vec2(-6.12668991e-01, -7.49050617e-01), vec2(-2.55018085e-01, -1.26638845e-01), vec2(1.20778978e-01, -7.58046091e-01), vec2(2.57768244e-01, -2.73887485e-01), vec2(3.68003547e-01, 3.61508653e-02), vec2(9.08699483e-02, 5.59277773e-01), vec2(3.47533524e-01, 7.24068105e-01), vec2(-3.39013547e-01, 4.39258099e-01), vec2(2.02956781e-01, 9.66335893e-01), vec2(-4.53280896e-01, 8.08961570e-01), vec2(-9.81301218e-02, -1.76610366e-01), vec2(9.22251582e-01, 2.83088863e-01), vec2(-7.57213712e-01, 5.92440128e-01), vec2(2.72511125e-01, 3.90873909e-01), vec2(-7.29271173e-01, -3.39729458e-01), vec2(-1.18184656e-01, 1.64628312e-01), vec2(-4.12616760e-01, -6.38951540e-01), vec2(7.14848161e-01, 1.98251113e-01), vec2(1.31814405e-01, -1.34626180e-01), vec2(6.56446576e-01, -3.05320740e-01), vec2(-6.66762352e-01, 1.88668981e-01));
const float _1540[21] = float[21](0.00000000e+00, 2.00000000e+00, 4.00000000e+00, 6.00000000e+00, 8.00000000e+00, 1.00000000e+01, 1.20000000e+01, 1.40000000e+01, 1.60000000e+01, 1.80000000e+01, 2.00000000e+01, 2.20000000e+01, 2.40000000e+01, 2.60000000e+01, 2.80000000e+01, 3.00000000e+01, 3.20000000e+01, 3.40000000e+01, 3.60000000e+01, 3.80000000e+01, 4.00000000e+01);
const vec2 _1653[8] = vec2[8](vec2(0.00000000e+00, 9.25925910e-04), vec2(0.00000000e+00, -9.25925910e-04), vec2(5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, -9.25925910e-04), vec2(5.20833360e-04, -9.25925910e-04), vec2(-5.20833360e-04, 9.25925910e-04), vec2(5.20833360e-04, 9.25925910e-04));
float F_xScale_SSDO_Fade()
{
	float _50 = abs(V_xSSDO_Fade);
	float _51 = clamp(_50, 0.0, 1.0);
	float _54 = mix(0.00000000e+00, 2.00000000e+00, _51);
	return _54;
}
float F_xOffset_Switch()
{
	bool _58 = V_xOffset >= -1.50000001e-03;
	bool _60 = V_xOffset <= 1.50000001e-03;
	bool _61 = _58 && _60;
	float _63 = _61 ? 0.00000000e+00 : V_xOffset;
	return _63;
}
vec3 F_xencodePalYuv(
	in vec3 rgb)
{
	vec3 RGB2Y = vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01);
	vec3 RGB2Cb = vec3(-1.69000000e-01, -3.31000000e-01, 5.00000000e-01);
	vec3 RGB2Cr = vec3(5.00000000e-01, -4.19000000e-01, -8.10000002e-02);
	float _73 = dot(rgb, RGB2Y);
	float _74 = dot(rgb, RGB2Cb);
	float _75 = dot(rgb, RGB2Cr);
	vec3 _76 = vec3(_73, _74, _75);
	return _76;
}
vec3 F_xdecodePalYuv(
	in vec3 ycc)
{
	vec3 YCbCr2R = vec3(1.00000000e+00, 0.00000000e+00, 1.39999998e+00);
	vec3 YCbCr2G = vec3(1.00000000e+00, -3.42999995e-01, -7.11000025e-01);
	vec3 YCbCr2B = vec3(1.00000000e+00, 1.76499999e+00, 0.00000000e+00);
	float _86 = dot(ycc, YCbCr2R);
	float _87 = dot(ycc, YCbCr2G);
	float _88 = dot(ycc, YCbCr2B);
	vec3 _89 = vec3(_86, _87, _88);
	return _89;
}
vec3 F_xHUEToRGB(
	in float H)
{
	float _94 = H * 6.00000000e+00;
	float _96 = _94 - 3.00000000e+00;
	float _97 = abs(_96);
	float _99 = _97 - 1.00000000e+00;
	float _101 = H * 6.00000000e+00;
	float _103 = _101 - 2.00000000e+00;
	float _104 = abs(_103);
	float _106 = 2.00000000e+00 - _104;
	float _108 = H * 6.00000000e+00;
	float _110 = _108 - 4.00000000e+00;
	float _111 = abs(_110);
	float _113 = 2.00000000e+00 - _111;
	vec3 _114 = vec3(_99, _106, _113);
	vec3 _115 = clamp(_114, 0.0, 1.0);
	return _115;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _121 = RGB.y < RGB.z;
	vec4 _126 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _131 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _133 = compCond(bvec4(_121), _126, _131);
	vec4 P = _133;
	bool _137 = RGB.x < P.x;
	vec4 _142 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _147 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _149 = compCond(bvec4(_137), _142, _147);
	vec4 Q1 = _149;
	float _153 = min(Q1.w, Q1.y);
	float _155 = Q1.x - _153;
	float C = _155;
	float _159 = Q1.w - Q1.y;
	float _161 = 6.00000000e+00 * C;
	float _163 = _161 + 9.99999997e-07;
	float _164 = _159 / _163;
	float _166 = _164 + Q1.z;
	float _167 = abs(_166);
	float H_168 = _167;
	vec3 _170 = vec3(H_168, C, Q1.x);
	return _170;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _176 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _176;
	vec3 _177;
	_177 = RGB;
	vec3 _178 = F_xRGBToHCV(_177);
	vec3 HCV = _178;
	float _182 = HCV.y * 5.00000000e-01;
	float _184 = HCV.z - _182;
	float L = _184;
	float _187 = L * 2.00000000e+00;
	float _189 = _187 - 1.00000000e+00;
	float _190 = abs(_189);
	float _192 = 1.00000000e+00 - _190;
	float _194 = _192 + 9.99999997e-07;
	float _196 = HCV.y / _194;
	float S = _196;
	vec3 _199 = vec3(HCV.x, S, L);
	return _199;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _203;
	_203 = HSL.x;
	vec3 _205 = F_xHUEToRGB(_203);
	vec3 RGB_206 = _205;
	float _209 = 2.00000000e+00 * HSL.z;
	float _211 = _209 - 1.00000000e+00;
	float _212 = abs(_211);
	float _214 = 1.00000000e+00 - _212;
	float _216 = _214 * HSL.y;
	float C_217 = _216;
	vec3 _219 = RGB_206 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _221 = _219 * vec3(C_217);
	vec3 _223 = _221 + vec3(HSL.z);
	return _223;
}
vec3 F_xSaturator(
	in vec3 C)
{
	vec3 _227;
	_227 = C.xyz;
	vec3 _229 = F_xRGBToHSL(_227);
	C.xyz = _229;
	float _231 = C.y * V_xSSDO_Saturation;
	C[1] = _231;
	vec3 _232;
	_232 = C.xyz;
	vec3 _234 = F_xHSLToRGB(_232);
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
	in vec4 color)
{
	float _247 = max(color.w, 1.00000005e-03);
	float _249 = 1.00000000e+00 + _247;
	float _250;
	float _251;
	float _252;
	_250 = color.x;
	_251 = color.y;
	_252 = color.z;
	float _256 = F_xmax3(_250, _251, _252);
	float _257 = _249 - _256;
	float _258 = 1.0 / _257;
	vec3 _261 = color.xyz * vec3(_258);
	return _261;
}
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
	float _273 = dot(C, Luma);
	return _273;
}
float F_xfmod(
	in float a,
	in float b)
{
	float _278 = a / b;
	float _279 = abs(_278);
	float _280 = fract(_279);
	float _281 = abs(b);
	float _282 = _280 * _281;
	float c = _282;
	bool _285 = a < 0.00000000e+00;
	float _286 = -(c);
	float _287 = _285 ? _286 : c;
	return _287;
}
float F_xMCNoise(
	in vec2 TC,
	in float FC,
	in float seed)
{
	float motion = FC;
	float a_295 = 1.29898005e+01;
	float b_297 = 7.82330017e+01;
	float c_299 = 4.37585469e+04;
	vec2 _302 = TC.xy + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _303 = vec2(a_295, b_297);
	float _304 = dot(_302, _303);
	float dt = _304;
	float _307 = 3.14159274e+00 + seed;
	float _308;
	float _309;
	_308 = dt;
	_309 = _307;
	float _310 = F_xfmod(_308, _309);
	float _311 = _310 * motion;
	float sn = _311;
	float _313 = sin(sn);
	float _314 = _313 * c_299;
	float _315 = fract(_314);
	return _315;
}
int F_xT_01()
{
	return 12500;
}
float F_xInterleaved_Gradient_Noise(
	in vec2 TC)
{
	vec3 MNums = vec3(6.71105608e-02, 5.83714992e-03, 5.29829178e+01);
	float _325 = dot(TC, MNums.xy);
	float _326 = fract(_325);
	float _328 = MNums.z * _326;
	float _329 = fract(_328);
	return _329;
}
float F_xDepth_Info(
	in vec2 texcoord)
{
	float _334 = -(V_xImage_Position_Adjust.x);
	vec2 _336 = vec2(_334, V_xImage_Position_Adjust.y);
	vec2 _338 = _336 * vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _340 = texcoord.xy + _338;
	texcoord.xy = _340;
	vec2 H_V = V_xHorizontal_and_Vertical;
	vec2 _343 = H_V - vec2(1.00000000e+00, 1.00000000e+00);
	vec2 _345 = _343 * vec2(9.60000000e+02, 5.40000000e+02);
	vec2 _347 = _345 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 midHV = _347;
	float _351 = texcoord.x * H_V.x;
	float _353 = _351 - midHV.x;
	float _356 = texcoord.y * H_V.y;
	float _358 = _356 - midHV.y;
	vec2 _359 = vec2(_353, _358);
	texcoord = _359;
	if (V_xDepth_Map_Flip)
	{
		float _365 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _365;
	}
	float SS_Scaling = 1.00000000e+00;
	bool _372 = V_xEasy_SS_Scaling == 1;
	if (_372)
	{
		SS_Scaling = 1.50000000e+00;
	}
	bool _378 = V_xEasy_SS_Scaling == 2;
	if (_378)
	{
		SS_Scaling = 1.73000002e+00;
	}
	bool _384 = V_xEasy_SS_Scaling == 3;
	if (_384)
	{
		SS_Scaling = 2.00000000e+00;
	}
	bool _390 = V_xEasy_SS_Scaling == 4;
	if (_390)
	{
		SS_Scaling = 3.00000000e+00;
	}
	vec2 _394 = texcoord.xy / vec2(SS_Scaling);
	texcoord.xy = _394;
	vec4 _399 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _400 = textureLod(V_xZBufferSSDO, _399.xy, _399.w);
	float zBuffer = _400.x;
	float zBufferWH = zBuffer;
	float Far = 1.00000000e+00;
	float _407 = 9.99999994e-09 + V_xDepth_Map_Adjust;
	float _409 = 1.25000000e-01 / _407;
	float Near = _409;
	float _413 = 1.00000000e+01 * V_xNCD.y;
	float _416 = bool(V_xDepth_Map) ? V_xNCD.y : _413;
	float _418 = 1.25000000e-01 / _416;
	float NearWH = _418;
	float _422 = 1.00000000e+02 * V_xNCD.y;
	float _425 = bool(V_xDepth_Map) ? V_xNCD.y : _422;
	float OtherSettings = _425;
	float _427 = Far / Near;
	float _428 = Far / Near;
	float _430 = 1.00000000e+00 - _428;
	vec2 _431 = vec2(_427, _430);
	vec2 C_432 = _431;
	float _433 = F_xOffset_Switch();
	bool _435 = _433 < 0.00000000e+00;
	float _436 = F_xOffset_Switch();
	float _437 = abs(_436);
	float _439 = 1.00000000e+00 + _437;
	float _440 = zBuffer * _439;
	float _442 = min(1.00000000e+00, _440);
	float _444 = 1.00000000e+00 - zBuffer;
	vec2 _445 = vec2(zBuffer, _444);
	vec2 _448 = compCond(bvec2(_435), vec2(_442), _445);
	vec2 Z = _448;
	float _451 = 1.00000000e+00 + OtherSettings;
	float _453 = 1.00000000e+00 - OtherSettings;
	vec2 _454 = vec2(_451, _453);
	vec2 Offsets = _454;
	float _457 = 1.00000000e+00 - zBufferWH;
	vec2 _458 = vec2(zBufferWH, _457);
	vec2 zB = _458;
	float _463 = F_xOffset_Switch();
	bool _465 = _463 > 0.00000000e+00;
	float _466 = F_xOffset_Switch();
	bool _468 = _466 < 0.00000000e+00;
	bool _469 = _465 || _468;
	if (_469)
	{
		float _470 = F_xOffset_Switch();
		bool _472 = _470 < 0.00000000e+00;
		float _475 = 1.00000000e+00 - Z.y;
		vec2 _477 = vec2(Z.x, _475);
		float _478 = F_xOffset_Switch();
		float _480 = 1.00000000e+00 + _478;
		float _482 = Z.x * _480;
		float _483 = F_xOffset_Switch();
		float _485 = 1.00000000e+00 - _483;
		float _487 = Z.y / _485;
		vec2 _488 = vec2(_482, _487);
		vec2 _490 = min(vec2(1.00000000e+00, 1.00000000e+00), _488);
		vec2 _492 = compCond(bvec2(_472), _477, _490);
		Z = _492;
	}
	bool _498 = V_xNCD.y > 0.00000000e+00;
	if (_498)
	{
		float _501 = zB.x * Offsets.x;
		float _504 = zB.y / Offsets.y;
		vec2 _505 = vec2(_501, _504);
		vec2 _507 = min(vec2(1.00000000e+00, 1.00000000e+00), _505);
		zB = _507;
	}
	bool _512 = V_xDepth_Map == 0;
	if (_512)
	{
		float _515 = Z.x * C_432.y;
		float _517 = _515 + C_432.x;
		float _518 = 1.0 / _517;
		zBuffer = _518;
		float _519 = Far * NearWH;
		float _520 = NearWH - Far;
		float _522 = zB.x * _520;
		float _523 = Far + _522;
		float _524 = _519 / _523;
		zBufferWH = _524;
	}
	else
	{
		bool _529 = V_xDepth_Map == 1;
		if (_529)
		{
			float _532 = Z.y * C_432.y;
			float _534 = _532 + C_432.x;
			float _535 = 1.0 / _534;
			zBuffer = _535;
			float _536 = Far * NearWH;
			float _537 = NearWH - Far;
			float _539 = zB.y * _537;
			float _540 = Far + _539;
			float _541 = _536 / _540;
			zBufferWH = _541;
		}
	}
	bool _544 = V_xNCD.y > 0.00000000e+00;
	float _545 = _544 ? zBufferWH : zBuffer;
	float _547 = mix(_545, zBuffer, 9.25000012e-01);
	float _548 = clamp(_547, 0.0, 1.0);
	return _548;
}
int F_xT_02()
{
	return 25000;
}
void F_xSSDOColors(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 Colors)
{
	vec4 _561 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _562 = textureLod(V_xBackBufferSSDO, _561.xy, _561.w);
	float _565 = dot(vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01), _562.xyz);
	float _567 = 1.00000000e+00 - _565;
	float _570 = mix(0.00000000e+00, 5.00000000e-01, V_xSSDO_Intensity_Masking);
	bool _571 = _567 > _570;
	float Intensity = float(_571);
	vec4 _574 = texture(V_xBackBufferSSDO, texcoords);
	vec4 _578 = vec4(_574.xyz.x, _574.xyz.y, _574.xyz.z, Intensity);
	Colors = _578;
	return;
}
vec2 F_xPackNormals(
	in vec3 n)
{
	float _584 = 8.00000000e+00 * n.z;
	float _586 = _584 + 8.00000000e+00;
	float _587 = inversesqrt(_586);
	float f = _587;
	vec2 _591 = n.xy * vec2(f);
	vec2 _593 = _591 + vec2(5.00000000e-01, 5.00000000e-01);
	return _593;
}
float F_xSUMTexture_lookup(
	in vec2 TC,
	in float dx,
	in float dy)
{
	vec2 _599;
	_599 = TC;
	float _600 = F_xDepth_Info(_599);
	float _602 = 1.00000000e+00 - _600;
	float Depth = _602;
	float _605 = Depth - 0.00000000e+00;
	float _608 = 1.00000000e+00 - V_xSet_2DTexture_Detail.x;
	float _609 = clamp(_608, 0.0, 1.0);
	float _612 = mix(1.00000000e+00, 1.00000000e+01, _609);
	float _614 = _612 - 0.00000000e+00;
	float _615 = _605 / _614;
	Depth = _615;
	vec2 _616 = vec2(dx, dy);
	vec2 _618 = _616 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _620 = TC.xy + _618;
	vec2 uv = _620;
	vec4 _626 = vec4(uv.xy.x, uv.xy.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _627 = textureLod(V_xSamplerColorsSSDO, _626.xy, _626.w);
	vec3 _630 = _627.xyz * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 c_631 = _630;
	float _634 = 2.12599993e-01 * c_631.x;
	float _637 = 7.15200007e-01 * c_631.y;
	float _638 = _634 + _637;
	float _641 = 7.22000003e-02 * c_631.z;
	float _642 = _638 + _641;
	float _643 = _642 * Depth;
	float _645 = _643 * 6.65999996e-03;
	return _645;
}
vec3 F_xTextureNormals(
	in vec2 UV,
	in float Depth)
{
	float _654 = clamp(V_xSet_2DTexture_Detail.x, 0.0, 1.0);
	bool _656 = _654 > 0.00000000e+00;
	if (_656)
	{
		float dx_658 = 0.00000000e+00;
		vec2 _659;
		float _660;
		float _661;
		_659 = UV;
		_660 = -1.50000000e+00;
		_661 = -1.50000000e+00;
		float _664 = F_xSUMTexture_lookup(_659, _660, _661);
		float _666 = -1.00000000e+00 * _664;
		float _667 = dx_658 + _666;
		dx_658 = _667;
		vec2 _668;
		float _669;
		float _670;
		_668 = UV;
		_669 = -1.50000000e+00;
		_670 = 0.00000000e+00;
		float _673 = F_xSUMTexture_lookup(_668, _669, _670);
		float _675 = -2.00000000e+00 * _673;
		float _676 = dx_658 + _675;
		dx_658 = _676;
		vec2 _677;
		float _678;
		float _679;
		_677 = UV;
		_678 = -1.50000000e+00;
		_679 = 1.50000000e+00;
		float _682 = F_xSUMTexture_lookup(_677, _678, _679);
		float _684 = -1.00000000e+00 * _682;
		float _685 = dx_658 + _684;
		dx_658 = _685;
		vec2 _686;
		float _687;
		float _688;
		_686 = UV;
		_687 = 1.50000000e+00;
		_688 = -1.50000000e+00;
		float _691 = F_xSUMTexture_lookup(_686, _687, _688);
		float _693 = 1.00000000e+00 * _691;
		float _694 = dx_658 + _693;
		dx_658 = _694;
		vec2 _695;
		float _696;
		float _697;
		_695 = UV;
		_696 = 1.50000000e+00;
		_697 = 0.00000000e+00;
		float _700 = F_xSUMTexture_lookup(_695, _696, _697);
		float _702 = 2.00000000e+00 * _700;
		float _703 = dx_658 + _702;
		dx_658 = _703;
		vec2 _704;
		float _705;
		float _706;
		_704 = UV;
		_705 = 1.50000000e+00;
		_706 = 1.50000000e+00;
		float _709 = F_xSUMTexture_lookup(_704, _705, _706);
		float _711 = 1.00000000e+00 * _709;
		float _712 = dx_658 + _711;
		dx_658 = _712;
		float dy_714 = 0.00000000e+00;
		vec2 _715;
		float _716;
		float _717;
		_715 = UV;
		_716 = -1.50000000e+00;
		_717 = -1.50000000e+00;
		float _720 = F_xSUMTexture_lookup(_715, _716, _717);
		float _722 = -1.00000000e+00 * _720;
		float _723 = dy_714 + _722;
		dy_714 = _723;
		vec2 _724;
		float _725;
		float _726;
		_724 = UV;
		_725 = 0.00000000e+00;
		_726 = -1.50000000e+00;
		float _729 = F_xSUMTexture_lookup(_724, _725, _726);
		float _731 = -2.00000000e+00 * _729;
		float _732 = dy_714 + _731;
		dy_714 = _732;
		vec2 _733;
		float _734;
		float _735;
		_733 = UV;
		_734 = 1.50000000e+00;
		_735 = -1.50000000e+00;
		float _738 = F_xSUMTexture_lookup(_733, _734, _735);
		float _740 = -1.00000000e+00 * _738;
		float _741 = dy_714 + _740;
		dy_714 = _741;
		vec2 _742;
		float _743;
		float _744;
		_742 = UV;
		_743 = -1.50000000e+00;
		_744 = 1.50000000e+00;
		float _747 = F_xSUMTexture_lookup(_742, _743, _744);
		float _749 = 1.00000000e+00 * _747;
		float _750 = dy_714 + _749;
		dy_714 = _750;
		vec2 _751;
		float _752;
		float _753;
		_751 = UV;
		_752 = 0.00000000e+00;
		_753 = 1.50000000e+00;
		float _756 = F_xSUMTexture_lookup(_751, _752, _753);
		float _758 = 2.00000000e+00 * _756;
		float _759 = dy_714 + _758;
		dy_714 = _759;
		vec2 _760;
		float _761;
		float _762;
		_760 = UV;
		_761 = 1.50000000e+00;
		_762 = 1.50000000e+00;
		float _765 = F_xSUMTexture_lookup(_760, _761, _762);
		float _767 = 1.00000000e+00 * _765;
		float _768 = dy_714 + _767;
		dy_714 = _768;
		float _769 = dx_658 * dx_658;
		float _770 = dy_714 * dy_714;
		float _771 = _769 + _770;
		float _772 = sqrt(_771);
		float edge = _772;
		float _774 = edge * edge;
		edge = _774;
		float _775 = atan(dx_658, dy_714);
		float angle = _775;
		float _777 = sin(angle);
		float _778 = edge * _777;
		float X = _778;
		float _780 = -(X);
		X = _780;
		float _782 = angle + 7.85398149e+00;
		float _783 = sin(_782);
		float _784 = edge * _783;
		float Y = _784;
		float _786 = X - Y;
		float _787 = edge * _786;
		float Z_788 = _787;
		vec3 _789 = vec3(X, Y, Z_788);
		float _792 = mix(1.00000000e+00, Depth, V_xSet_2DTexture_Detail.y);
		vec3 _794 = _789 * vec3(_792);
		vec3 _795 = vec3(X, Y, Z_788);
		bvec3 _797 = equal(_795, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
		vec3 _800 = mix(_794, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_797));
		vec3 _802 = min(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _800);
		return _802;
	}
	else
	{
		return vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
}
void F_xNormalsDepth(
	in vec4 vpos,
	in vec2 texcoords,
	out vec2 Normals,
	out float Depth)
{
	vec2 off1 = vec2(5.20833360e-04, 0.00000000e+00);
	vec2 off4 = vec2(0.00000000e+00, -9.25925910e-04);
	vec2 uv0 = texcoords;
	vec2 _815 = texcoords + off1;
	vec2 uv1 = _815;
	vec2 _818 = texcoords + vec2(-5.20833360e-04, 0.00000000e+00);
	vec2 uv2 = _818;
	vec2 _821 = texcoords + vec2(0.00000000e+00, 9.25925910e-04);
	vec2 uv3 = _821;
	vec2 _823 = texcoords + off4;
	vec2 uv4 = _823;
	vec2 _825;
	_825 = uv0;
	float _826 = F_xDepth_Info(_825);
	float depth = _826;
	vec2 _828;
	_828 = uv1;
	float _829 = F_xDepth_Info(_828);
	float depthR = _829;
	vec2 _831;
	_831 = uv2;
	float _832 = F_xDepth_Info(_831);
	float depthL = _832;
	vec2 _834;
	_834 = uv3;
	float _835 = F_xDepth_Info(_834);
	float depthD = _835;
	vec2 _837;
	_837 = uv4;
	float _838 = F_xDepth_Info(_837);
	float depthU = _838;
	vec2 _841 = off1 * vec2(depth);
	float _842 = depth - depthR;
	vec3 _845 = vec3(_841.x, _841.y, _842);
	vec3 P1 = _845;
	vec2 _848 = off4 * vec2(depth);
	float _849 = depth - depthD;
	vec3 _852 = vec3(_848.x, _848.y, _849);
	vec3 P2 = _852;
	vec3 _854 = cross(P2, P1);
	vec3 normal = _854;
	vec3 P0 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _858 = depthR - depth;
	float _859 = abs(_858);
	float _860 = depthL - depth;
	float _861 = abs(_860);
	bool _862 = _859 < _861;
	int _865 = _862 ? 1 : 2;
	int best_Z_horizontal = _865;
	float _867 = depthD - depth;
	float _868 = abs(_867);
	float _869 = depthU - depth;
	float _870 = abs(_869);
	bool _871 = _868 < _870;
	int _874 = _871 ? 3 : 4;
	int best_Z_vertical = _874;
	bool _880 = best_Z_horizontal == 1;
	bool _882 = best_Z_vertical == 4;
	bool _883 = _880 && _882;
	if (_883)
	{
		vec2 _885 = uv1 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _889 = vec3(_885.x, _885.y, 1.00000000e+00);
		vec3 _891 = _889 * vec3(depthR);
		P1 = _891;
		vec2 _893 = uv4 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _897 = vec3(_893.x, _893.y, 1.00000000e+00);
		vec3 _899 = _897 * vec3(depthU);
		P2 = _899;
	}
	bool _904 = best_Z_horizontal == 1;
	bool _906 = best_Z_vertical == 3;
	bool _907 = _904 && _906;
	if (_907)
	{
		vec2 _909 = uv3 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _913 = vec3(_909.x, _909.y, 1.00000000e+00);
		vec3 _915 = _913 * vec3(depthD);
		P1 = _915;
		vec2 _917 = uv1 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _921 = vec3(_917.x, _917.y, 1.00000000e+00);
		vec3 _923 = _921 * vec3(depthR);
		P2 = _923;
	}
	bool _928 = best_Z_horizontal == 2;
	bool _930 = best_Z_vertical == 4;
	bool _931 = _928 && _930;
	if (_931)
	{
		vec2 _933 = uv4 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _937 = vec3(_933.x, _933.y, 1.00000000e+00);
		vec3 _939 = _937 * vec3(depthU);
		P1 = _939;
		vec2 _941 = uv2 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _945 = vec3(_941.x, _941.y, 1.00000000e+00);
		vec3 _947 = _945 * vec3(depthL);
		P2 = _947;
	}
	bool _952 = best_Z_horizontal == 2;
	bool _954 = best_Z_vertical == 3;
	bool _955 = _952 && _954;
	if (_955)
	{
		vec2 _957 = uv2 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _961 = vec3(_957.x, _957.y, 1.00000000e+00);
		vec3 _963 = _961 * vec3(depthL);
		P1 = _963;
		vec2 _965 = uv3 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _969 = vec3(_965.x, _965.y, 1.00000000e+00);
		vec3 _971 = _969 * vec3(depthD);
		P2 = _971;
	}
	vec2 _973 = uv0 - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _977 = vec3(_973.x, _973.y, 1.00000000e+00);
	vec3 _979 = _977 * vec3(depth);
	P0 = _979;
	vec3 _980 = P2 - P0;
	vec3 _981 = P1 - P0;
	vec3 _982 = cross(_980, _981);
	vec3 Enormal = _982;
	float _985 = -(Enormal.x);
	Enormal[0] = _985;
	vec2 _986;
	float _987;
	_986 = texcoords;
	_987 = depth;
	vec3 _988 = F_xTextureNormals(_986, _987);
	vec3 _989 = normal + _988;
	vec3 _990 = normalize(normal);
	vec3 _991 = normalize(Enormal);
	float _992 = distance(_990, _991);
	bool _994 = _992 >= 6.99999988e-01;
	vec3 _996 = mix(_989, Enormal, vec3(bvec3(_994)));
	Enormal = _996;
	vec3 _997 = normalize(Enormal);
	vec3 _998;
	_998 = _997;
	vec2 _999 = F_xPackNormals(_998);
	Normals = _999;
	Depth = depth;
	return;
}
vec3 F_xUnpackNormals(
	in vec2 enc)
{
	vec2 _1004 = enc * vec2(4.00000000e+00, 4.00000000e+00);
	vec2 _1006 = _1004 - vec2(2.00000000e+00, 2.00000000e+00);
	vec2 fenc = _1006;
	float _1008 = dot(fenc, fenc);
	float f_1009 = _1008;
	float _1011 = f_1009 / 4.00000000e+00;
	float _1013 = 1.00000000e+00 - _1011;
	float _1014 = sqrt(_1013);
	float g = _1014;
	vec3 n_1017 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _1019 = fenc * vec2(g);
	n_1017.xy = _1019;
	float _1021 = f_1009 / 2.00000000e+00;
	float _1023 = 1.00000000e+00 - _1021;
	n_1017[2] = _1023;
	return n_1017;
}
vec4 F_xNDSampler(
	in vec2 TC,
	in float Mip)
{
	vec4 _1031 = vec4(TC.x, TC.y, 0.00000000e+00, Mip);
	vec4 _1032 = textureLod(V_xSamplerNormalsSSDO, _1031.xy, _1031.w);
	vec2 _1033;
	_1033 = _1032.xy;
	vec3 _1035 = F_xUnpackNormals(_1033);
	vec3 Norm = _1035;
	vec4 _1040 = vec4(TC.x, TC.y, 0.00000000e+00, Mip);
	vec4 _1041 = textureLod(V_xSamplerDepthSSDO, _1040.xy, _1040.w);
	float Depth_1043 = _1041.x;
	vec4 _1047 = vec4(Norm.x, Norm.y, Norm.z, Depth_1043);
	return _1047;
}
vec2 F_xRotate2D(
	in vec2 r,
	in float l)
{
	vec2 Directions = vec2(0.00000000e+00, 0.00000000e+00);
	float _1054;
	float _1055;
	_1054 = sin(l), _1055 = cos(l);
	Directions[0] = _1054;
	Directions[1] = _1055;
	float _1058 = -(Directions.x);
	vec2 _1060 = vec2(Directions.y, _1058);
	float _1061 = dot(r, _1060);
	float _1063 = dot(r, Directions.xy);
	vec2 _1064 = vec2(_1061, _1063);
	return _1064;
}
vec3 F_xGetPosition(
	in vec2 texcoords,
	in vec2 raycoords,
	in float Depth,
	in float FDepth)
{
	float _1073 = raycoords.x - texcoords.x;
	float _1076 = texcoords.y - raycoords.y;
	vec2 _1077 = vec2(_1073, _1076);
	vec2 _1079 = _1077 * vec2(Depth);
	float _1080 = Depth - FDepth;
	vec3 _1083 = vec3(_1079.x, _1079.y, _1080);
	return _1083;
}
int F_xnonplus()
{
	int _1086 = F_xT_01();
	bool _1088 = _1086 == 0;
	int _1089 = F_xT_02();
	bool _1091 = _1089 == 0;
	bool _1092 = _1088 || _1091;
	int _1095 = _1092 ? 1 : 0;
	return _1095;
}
vec4 F_xSSDO(
	in vec4 vpos,
	in vec2 texcoords)
{
	int _1102 = clamp(V_xSSDO_Levels, 1, 64);
	int SSDO_Samples = _1102;
	float SSDO_SRM = V_xSSDO_SampleRadius;
	float SSDO_AngleThreshold = 1.00000000e+00;
	float _1108 = SSDO_SRM * 5.20833360e-04;
	float _1110 = max(V_xSSDO_Trimming, 1.00000005e-03);
	float _1111 = _1108 * _1110;
	float SSDO_Contribution_Range = _1111;
	vec2 _1113;
	float _1114;
	float _1115;
	_1113 = texcoords;
	_1114 = 1.00000000e+00;
	_1115 = 1.00000000e+00;
	float _1118 = F_xMCNoise(_1113, _1114, _1115);
	float _1120 = _1118 * 2.00000000e+00;
	float _1122 = _1120 - 1.00000000e+00;
	float random = _1122;
	vec2 _1126 = texcoords.xy / vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _1128 = _1126 / vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _1129 = floor(_1128);
	vec2 _1130;
	_1130 = _1129;
	float _1131 = F_xInterleaved_Gradient_Noise(_1130);
	float IGN = _1131;
	vec4 SSDO = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _1135;
	float _1136;
	_1135 = texcoords;
	_1136 = 0.00000000e+00;
	vec4 _1138 = F_xNDSampler(_1135, _1136);
	vec4 Normals_Depth = _1138;
	float _1141 = -(V_xNCD.x);
	float _1144 = smoothstep(_1141, 1.00000000e+00, Normals_Depth.w);
	float D0 = _1144;
	bool _1147 = V_xSSDO_Fade < 0.00000000e+00;
	float _1148 = F_xScale_SSDO_Fade();
	float _1150 = _1148 * 2.00000000e+00;
	float _1152 = 1.00000000e+00 - _1150;
	float _1155 = 1.00000000e+00 - Normals_Depth.w;
	float _1157 = mix(_1152, 0.00000000e+00, _1155);
	float _1158 = F_xScale_SSDO_Fade();
	float _1160 = Normals_Depth.w / _1158;
	float _1163 = smoothstep(0.00000000e+00, 2.00000000e+00, _1160);
	float _1164 = _1147 ? _1157 : _1163;
	float D_Fade = _1164;
	bool _1167 = V_xSSDO_MipSampling == 4;
	bool _1169 = V_xSSDO_MipSampling == 5;
	bool _1170 = _1167 || _1169;
	int _1173 = _1170 ? 1 : 0;
	int Mip_Switch = _1173;
	int i = 1;
	while (i <= SSDO_Samples)
	{
		{
			bool _1191 = texcoords.x >= 1.00000000e+00;
			bool _1194 = texcoords.y >= 1.00000000e+00;
			bool _1195 = _1191 || _1194;
			if (_1195)
			{
				discard;
				return vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			}
			bool _1200 = Normals_Depth.w > V_xSSDO_Max_Depth;
			if (_1200)
			{
					int _1184 = i;
		int _1185 = _1184 + 1;
		i = _1185;
	continue;
			}
			vec4 _1208 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 2.00000000e+00);
			vec4 _1209 = textureLod(V_xSamplerColorsSSDO, _1208.xy, _1208.w);
			float _1212 = 1.00000000e+00 - _1209.w;
			if (bool(_1212))
			{
					int _1184 = i;
		int _1185 = _1184 + 1;
		i = _1185;
	continue;
			}
			float _1215 = SSDO_SRM / float(SSDO_Samples);
			vec2 _1218 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(_1215);
			vec2 _1220 = _1218 * vec2(IGN);
			vec2 _1222;
			float _1223;
			_1222 = _1221[int(i)];
			_1223 = IGN;
			vec2 _1225 = F_xRotate2D(_1222, _1223);
			vec2 _1226 = _1220 * _1225;
			vec2 _1228 = _1226 / vec2(D0);
			vec2 RayDir = _1228;
			float _1231 = -(RayDir.y);
			vec3 _1234 = vec3(RayDir.x, _1231, 1.00000000e+00);
			vec3 _1235 = normalize(_1234);
			float _1237 = dot(_1235, Normals_Depth.xyz);
			float _1238 = sign(_1237);
			vec2 _1240 = RayDir * vec2(_1238);
			RayDir = _1240;
			vec2 _1242 = texcoords + RayDir.xy;
			vec2 RayCoords = _1242;
			bool _1245 = V_xSSDO_MipSampling <= 2;
			bool _1247 = V_xSSDO_MipSampling == 5;
			int _1250 = _1247 ? 3 : 2;
			int _1254 = bool(Mip_Switch) ? 1 : 0;
			float _1258 = mix(float(_1250), float(_1254), Normals_Depth.w);
			float _1260 = _1245 ? float(V_xSSDO_MipSampling) : _1258;
			int Adaptive_Mipping = int(_1260);
			vec2 _1263;
			float _1264;
			_1263 = RayCoords;
			_1264 = float(Adaptive_Mipping);
			vec4 _1266 = F_xNDSampler(_1263, _1264);
			vec4 vsFetch = _1266;
			vec4 _1272 = vec4(RayCoords.x, RayCoords.y, 0.00000000e+00, 3.00000000e+00);
			vec4 _1273 = textureLod(V_xSamplerColorsSSDO, _1272.xy, _1272.w);
			vec3 LocalGI = _1273.xyz;
			vec3 _1277 = LocalGI * vec3(V_xSSDO_ColorPower);
			LocalGI = _1277;
			float _1280 = Normals_Depth.w - 9.99999975e-06;
			float _1283 = vsFetch.w + 9.99999975e-06;
			vec2 _1284;
			vec2 _1285;
			float _1286;
			float _1287;
			_1284 = texcoords;
			_1285 = RayCoords;
			_1286 = _1280;
			_1287 = _1283;
			vec3 _1288 = F_xGetPosition(_1284, _1285, _1286, _1287);
			vec3 Pos = _1288;
			vec3 _1290 = normalize(Pos);
			vec3 normalizedPos = _1290;
			float _1293 = dot(normalizedPos, Normals_Depth.xyz);
			float _1295 = max(0.00000000e+00, _1293);
			float AO = _1295;
			vec3 _1299 = Normals_Depth.xyz - vsFetch.xyz;
			float _1300 = length(_1299);
			float _1301 = sign(_1300);
			float _1302 = AO * _1301;
			AO = _1302;
			float _1303 = length(Pos);
			float _1304 = SSDO_Contribution_Range - _1303;
			float _1306 = max(0.00000000e+00, _1304);
			float _1307 = _1306 / SSDO_Contribution_Range;
			float SSDO_RangeCheck = _1307;
			vec3 _1310 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - LocalGI;
			vec3 _1311 = clamp(_1310, 0.0, 1.0);
			vec3 _1313 = _1311 * vec3(AO);
			vec3 _1315 = _1313 * vec3(SSDO_RangeCheck);
			vec3 _1317 = _1315 * vec3(SSDO_RangeCheck);
			vec3 _1320 = mix(_1317, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(D_Fade));
			vec4 _1322 = SSDO + _1320.xyzz;
			SSDO = _1322;
		}
		int _1184 = i;
		int _1185 = _1184 + 1;
		i = _1185;
	}
	vec4 _1324 = SSDO / vec4(ivec4(SSDO_Samples));
	SSDO = _1324;
	vec3 _1327 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - SSDO.xyz;
	vec3 _1328 = clamp(_1327, 0.0, 1.0);
	vec4 _1333 = vec4(_1328.x, _1328.y, _1328.z, 1.00000000e+00);
	return _1333;
}
float F_xNormalMask(
	in vec2 texcoords,
	in float Mip)
{
	vec2 _1338;
	float _1339;
	_1338 = texcoords;
	_1339 = 0.00000000e+00;
	vec4 _1341 = F_xNDSampler(_1338, _1339);
	vec2 _1342;
	float _1343;
	_1342 = texcoords;
	_1343 = Mip;
	vec4 _1344 = F_xNDSampler(_1342, _1343);
	float _1345 = distance(_1341, _1344);
	float Mask = _1345;
	bool _1348 = Mask > 4.99999989e-03;
	return float(_1348);
}
vec3 F_xSSDO_MipBLur(
	in sampler2D Tex,
	in vec2 texcoords,
	in float Mip)
{
	vec4 _1358 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, Mip);
	vec4 _1359 = textureLod(Tex, _1358.xy, _1358.w);
	return _1359.xyz;
}
float F_xgaussian(
	in float x,
	in float sigma)
{
	float _1366 = pow(sigma, 2.00000000e+00);
	float _1368 = 3.14159274e+00 * _1366;
	float _1369 = inversesqrt(_1368);
	float _1371 = pow(x, 2.00000000e+00);
	float _1373 = pow(sigma, 2.00000000e+00);
	float _1375 = 2.00000000e+00 * _1373;
	float _1376 = _1371 / _1375;
	float _1377 = -(_1376);
	float _1378 = exp(_1377);
	float _1379 = _1369 * _1378;
	return _1379;
}
float F_xHelper()
{
	int _1382 = F_xT_01();
	bool _1384 = _1382 == 12500;
	int _1387 = _1384 ? 0 : 1;
	float Temp_Location = float(_1387);
	return Temp_Location;
}
vec4 F_xDenoise(
	in sampler2D Tex,
	in vec2 texcoords,
	in int SXY,
	in int Dir,
	in float R)
{
	vec2 _1397;
	float _1398;
	_1397 = texcoords;
	_1398 = 0.00000000e+00;
	vec4 _1400 = F_xNDSampler(_1397, _1398);
	vec4 StoredNormals_Depth = _1400;
	vec4 _1406 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1407 = textureLod(Tex, _1406.xy, _1406.w);
	vec4 center = _1407;
	vec4 color_1410 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float total = 0.00000000e+00;
	bool _1414 = V_xDebug == 1;
	float _1417 = _1414 ? 1.25000000e-01 : 5.00000000e-01;
	float NormalBlurFactor = _1417;
	float DepthBlurFactor = 1.25000002e-02;
	float _1424 = smoothstep(0.00000000e+00, 1.00000000e+00, StoredNormals_Depth.w);
	bool _1426 = _1424 > 9.99000013e-01;
	float DM = float(_1426);
	bool _1433 = SXY > 0;
	if (_1433)
	{
		int _1434 = -(SXY);
		float _1437 = float(_1434) * 5.00000000e-01;
		int i_1439 = int(_1437);
		float _1447 = float(SXY) * 5.00000000e-01;
		bool _1449 = float(i_1439) <= _1447;
		while (_1449)
		{
			{
				vec2 _1454 = vec2(float(i_1439), 0.00000000e+00);
				vec2 _1457 = vec2(0.00000000e+00, float(i_1439));
				vec2 _1459 = compCond(bvec2(ivec2(Dir)), _1454, _1457);
				vec2 D = _1459;
				vec2 _1462 = D * vec2(R);
				vec2 _1464 = _1462 * vec2(5.20833360e-04, 9.25925910e-04);
				vec2 _1465 = texcoords + _1464;
				vec2 TC_1466 = _1465;
				bool _1468 = V_xDebug == 1;
				float _1471 = _1468 ? 1.00000000e+00 : 0.00000000e+00;
				vec2 _1472;
				float _1473;
				_1472 = TC_1466;
				_1473 = _1471;
				vec4 _1474 = F_xNDSampler(_1472, _1473);
				vec4 ModifiedNormals_Depth = _1474;
				vec3 _1478 = StoredNormals_Depth.xyz - ModifiedNormals_Depth.xyz;
				float _1479 = length(_1478);
				float ModN = _1479;
				float _1483 = StoredNormals_Depth.w - ModifiedNormals_Depth.w;
				float _1484 = clamp(_1483, 0.0, 1.0);
				float ModD = _1484;
				float _1487 = max(ModD, 0.00000000e+00);
				float D_Dist2 = _1487;
				float _1489 = -(D_Dist2);
				float _1490 = _1489 / DepthBlurFactor;
				float _1491 = exp(_1490);
				float _1493 = min(_1491, 1.00000000e+00);
				float _1495 = _1493 - 1.00000001e-10;
				float d_w = _1495;
				float _1498 = max(ModN, 0.00000000e+00);
				float N_Dist2 = _1498;
				float _1500 = -(N_Dist2);
				float _1501 = _1500 / NormalBlurFactor;
				float _1502 = exp(_1501);
				float _1504 = min(_1502, 1.00000000e+00);
				float n_w = _1504;
				float _1507 = sqrt(float(SXY));
				float _1508;
				float _1509;
				_1508 = float(i_1439);
				_1509 = _1507;
				float _1511 = F_xgaussian(_1508, _1509);
				float Weight = _1511;
				float _1513 = Weight * d_w;
				Weight = _1513;
				float _1514 = Weight * n_w;
				Weight = _1514;
				vec4 _1519 = vec4(TC_1466.x, TC_1466.y, 0.00000000e+00, 5.00000000e-01);
				vec4 _1520 = textureLod(Tex, _1519.xy, _1519.w);
				vec4 _1522 = _1520 * vec4(Weight);
				vec4 _1523 = color_1410 + _1522;
				color_1410 = _1523;
				float _1524 = total + Weight;
				total = _1524;
			}
			int _1451 = i_1439 + 1;
			i_1439 = _1451;
			float _1447 = float(SXY) * 5.00000000e-01;
			_1449 = float(i_1439) <= _1447;
		}
	}
	bool _1526 = V_xSamplesXY > 0;
	vec4 _1528 = color_1410 / vec4(total);
	vec4 _1530 = mix(_1528, center, vec4(DM));
	vec4 _1532 = compCond(bvec4(_1526), _1530, center);
	return _1532;
}
vec4 F_xCEAGD_H_SSDO(
	in vec4 vpos,
	in vec2 texcoords)
{
	int _1539 = clamp(V_xSamplesXY, 0, 20);
	vec2 _1541;
	int _1542;
	int _1543;
	float _1544;
	_1541 = texcoords;
	_1542 = int(_1540[int(_1539)]);
	_1543 = 0;
	_1544 = 2.50000000e+00;
	vec4 _1548 = F_xDenoise(V_xSamplerSSDO, _1541, _1542, _1543, _1544);
	vec4 _1549 = abs(_1548);
	vec4 _1551 = pow(_1549, vec4(V_xSSDO_Power));
	return _1551;
}
vec4 F_xCEAGD_V_SSDO(
	in vec4 vpos,
	in vec2 texcoords)
{
	int _1558 = clamp(V_xSamplesXY, 0, 20);
	vec2 _1560;
	int _1561;
	int _1562;
	float _1563;
	_1560 = texcoords;
	_1561 = int(_1540[int(_1558)]);
	_1562 = 1;
	_1563 = 2.50000000e+00;
	vec4 _1567 = F_xDenoise(V_xSamplerSSDOH, _1560, _1561, _1562, _1563);
	return _1567;
}
vec4 F_xTAA_SSDO_Helper(
	in vec2 texcoords,
	in float Mip)
{
	vec4 _1575 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, Mip);
	vec4 _1576 = textureLod(V_xSamplerSSDOV, _1575.xy, _1575.w);
	return _1576.xyzw;
}
vec4 F_xTAA_SSDO(
	in vec4 vpos,
	in vec2 texcoords)
{
	float _1583 = 1.00000000e+00 - V_xPersistence;
	float Per = _1583;
	vec4 _1589 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1590 = textureLod(V_xSSDOaccuFrames, _1589.xy, _1589.w);
	vec4 PastColor = _1590;
	float _1593 = 1.00000000e+00 - Per;
	vec2 _1594;
	float _1595;
	_1594 = texcoords;
	_1595 = 0.00000000e+00;
	vec4 _1597 = F_xTAA_SSDO_Helper(_1594, _1595);
	vec4 _1599 = vec4(_1593) * _1597;
	vec4 _1601 = vec4(Per) * PastColor;
	vec4 _1602 = _1599 + _1601;
	PastColor = _1602;
	vec3 antialiased = PastColor.xyz;
	float _1607 = min(PastColor.w, 5.00000000e-01);
	float mixRate = _1607;
	float MB = 0.00000000e+00;
	vec2 _1611;
	float _1612;
	_1611 = texcoords;
	_1612 = 0.00000000e+00;
	vec4 _1614 = F_xTAA_SSDO_Helper(_1611, _1612);
	vec3 BB = _1614.xyz;
	vec3 _1617 = antialiased * antialiased;
	vec3 _1618 = BB * BB;
	vec3 _1620 = mix(_1617, _1618, vec3(mixRate));
	antialiased = _1620;
	vec3 _1621 = sqrt(antialiased);
	antialiased = _1621;
	vec2 _1622;
	float _1623;
	_1622 = texcoords;
	_1623 = 0.00000000e+00;
	vec4 _1625 = F_xTAA_SSDO_Helper(_1622, _1623);
	vec3 _1626;
	_1626 = _1625.xyz;
	vec3 _1628 = F_xencodePalYuv(_1626);
	vec3 _1630 = _1628 - vec3(MB);
	vec3 minColor = _1630;
	vec2 _1632;
	float _1633;
	_1632 = texcoords;
	_1633 = 0.00000000e+00;
	vec4 _1635 = F_xTAA_SSDO_Helper(_1632, _1633);
	vec3 _1636;
	_1636 = _1635.xyz;
	vec3 _1638 = F_xencodePalYuv(_1636);
	vec3 _1640 = _1638 + vec3(MB);
	vec3 maxColor = _1640;
	int i_1643 = 1;
	while (i_1643 < 8)
	{
		{
			vec2 _1655 = texcoords + _1653[int(i_1643)];
			vec2 _1656;
			float _1657;
			_1656 = _1655;
			_1657 = 0.00000000e+00;
			vec4 _1659 = F_xTAA_SSDO_Helper(_1656, _1657);
			vec3 _1660;
			_1660 = _1659.xyz;
			vec3 _1662 = F_xencodePalYuv(_1660);
			vec3 _1663 = min(minColor, _1662);
			vec3 _1665 = _1663 - vec3(MB);
			minColor = _1665;
			vec2 _1668 = texcoords + _1653[int(i_1643)];
			vec2 _1669;
			float _1670;
			_1669 = _1668;
			_1670 = 0.00000000e+00;
			vec4 _1672 = F_xTAA_SSDO_Helper(_1669, _1670);
			vec3 _1673;
			_1673 = _1672.xyz;
			vec3 _1675 = F_xencodePalYuv(_1673);
			vec3 _1676 = max(maxColor, _1675);
			vec3 _1678 = _1676 + vec3(MB);
			maxColor = _1678;
		}
		int _1652 = i_1643 + 1;
		i_1643 = _1652;
	}
	vec3 _1679;
	_1679 = antialiased;
	vec3 _1680 = F_xencodePalYuv(_1679);
	antialiased = _1680;
	vec3 preclamping = antialiased;
	vec3 _1682 = clamp(antialiased, minColor, maxColor);
	antialiased = _1682;
	float _1684 = 1.00000000e+00 / mixRate;
	float _1686 = _1684 + 1.00000000e+00;
	float _1687 = 1.0 / _1686;
	mixRate = _1687;
	vec3 _1688 = antialiased - preclamping;
	vec3 diff = _1688;
	float _1690 = dot(diff, diff);
	diff[0] = _1690;
	float clampAmount = diff.x;
	float _1693 = mixRate + clampAmount;
	mixRate = _1693;
	float _1696 = clamp(mixRate, 5.00000007e-02, 5.00000000e-01);
	mixRate = _1696;
	vec3 _1697;
	_1697 = antialiased;
	vec3 _1698 = F_xdecodePalYuv(_1697);
	antialiased = _1698;
	vec4 _1702 = vec4(antialiased.x, antialiased.y, antialiased.z, mixRate);
	return _1702;
}
void F_xAccumulatedFramesSSDO(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 acc)
{
	vec4 _1708 = texture(V_xBackBufferSSDO, texcoords);
	acc = _1708.xyzw;
	return;
}
float F_xText_Info_Plus()
{
	int _1712 = F_xnonplus();
	float _1715 = fmodHLSL(float(V_xframecount), 2.00000000e+00);
	bool _1717 = _1715 == 0.00000000e+00;
	bool _1719 = bool(_1712) ? _1717 : V_xText_Info;
	return float(_1719);
}
vec3 F_xoverlay(
	in vec3 c,
	in vec3 b)
{
	bvec3 _1726 = lessThan(c, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _1728 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _1729 = _1728 * b;
	vec3 _1731 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _1733 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _1731;
	vec3 _1735 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _1736 = _1733 * _1735;
	vec3 _1738 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1736;
	vec3 _1739 = compCond(_1726, _1729, _1738);
	return _1739;
}
vec3 F_xsoftlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _1745 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _1747 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _1748 = _1747 * b;
	vec3 _1749 = c * c;
	vec3 _1751 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _1753 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1751;
	vec3 _1754 = _1749 * _1753;
	vec3 _1755 = _1748 + _1754;
	vec3 _1756 = sqrt(c);
	vec3 _1758 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _1760 = _1758 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _1761 = _1756 * _1760;
	vec3 _1763 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _1765 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _1766 = _1763 * _1765;
	vec3 _1767 = _1761 + _1766;
	vec3 _1768 = compCond(_1745, _1755, _1767);
	return _1768;
}
vec3 F_xmult(
	in vec3 c,
	in vec3 b)
{
	vec3 _1773 = c * b;
	return _1773;
}
vec3 F_xComposite(
	in vec3 Color,
	in vec3 Cloud)
{
	vec3 Output = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 _1781 = Cloud - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 FiftyGray = _1781;
	if (false)
	{
		vec3 _1787;
		vec3 _1788;
		_1787 = Color;
		_1788 = FiftyGray;
		vec3 _1789 = F_xoverlay(_1787, _1788);
		vec3 _1790;
		vec3 _1791;
		_1790 = Color;
		_1791 = FiftyGray;
		vec3 _1792 = F_xsoftlight(_1790, _1791);
		vec3 _1793 = _1789 + _1792;
		vec3 _1795 = _1793 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		vec3 _1796;
		vec3 _1797;
		_1796 = Color;
		_1797 = Cloud;
		vec3 _1798 = F_xmult(_1796, _1797);
		vec3 _1800 = mix(_1795, _1798, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
		Output = _1800;
	}
	else
	{
		if (false)
		{
			vec3 _1805;
			vec3 _1806;
			_1805 = Color;
			_1806 = FiftyGray;
			vec3 _1807 = F_xoverlay(_1805, _1806);
			Output = _1807;
		}
		else
		{
			if (false)
			{
				vec3 _1812;
				vec3 _1813;
				_1812 = Color;
				_1813 = FiftyGray;
				vec3 _1814 = F_xsoftlight(_1812, _1813);
				Output = _1814;
			}
			else
			{
				vec3 _1815;
				vec3 _1816;
				_1815 = Color;
				_1816 = Cloud;
				vec3 _1817 = F_xmult(_1815, _1816);
				Output = _1817;
			}
		}
	}
	return Output;
}
vec4 F_xSSDOMixing(
	in vec2 texcoords)
{
	vec2 _1821;
	float _1822;
	_1821 = texcoords;
	_1822 = 0.00000000e+00;
	vec4 _1824 = F_xNDSampler(_1821, _1822);
	float Depth_1826 = _1824.w;
	vec2 _1828 = texcoords + vec2(1.04166672e-03, 0.00000000e+00);
	vec2 _1829;
	float _1830;
	_1829 = _1828;
	_1830 = 1.00000000e+00;
	vec4 _1832 = F_xNDSampler(_1829, _1830);
	float _1834 = Depth_1826 + _1832.w;
	vec2 _1836 = texcoords + vec2(-1.04166672e-03, 0.00000000e+00);
	vec2 _1837;
	float _1838;
	_1837 = _1836;
	_1838 = 2.00000000e+00;
	vec4 _1840 = F_xNDSampler(_1837, _1838);
	float _1842 = _1834 + _1840.w;
	vec2 _1844 = texcoords + vec2(0.00000000e+00, 1.85185182e-03);
	vec2 _1845;
	float _1846;
	_1845 = _1844;
	_1846 = 3.00000000e+00;
	vec4 _1848 = F_xNDSampler(_1845, _1846);
	float _1850 = _1842 + _1848.w;
	vec2 _1852 = texcoords + vec2(0.00000000e+00, -1.85185182e-03);
	vec2 _1853;
	float _1854;
	_1853 = _1852;
	_1854 = 4.00000000e+00;
	vec4 _1856 = F_xNDSampler(_1853, _1854);
	float _1858 = _1850 + _1856.w;
	float _1860 = _1858 * 2.00000003e-01;
	float _1862 = V_xDepth_Guide ? _1860 : 9.99999994e-09;
	float Guide = _1862;
	vec2 _1864;
	float _1865;
	_1864 = texcoords;
	_1865 = 0.00000000e+00;
	vec3 _1867 = F_xSSDO_MipBLur(V_xSSDOaccuFrames, _1864, _1865);
	vec3 ssdo = _1867;
	vec4 _1873 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 2.50000000e+00);
	vec4 _1874 = textureLod(V_xSamplerColorsSSDO, _1873.xy, _1873.w);
	float Intencity_Mask = _1874.w;
	vec4 _1881 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 4.50000000e+00);
	vec4 _1882 = textureLod(V_xSamplerColorsSSDO, _1881.xy, _1881.w);
	vec3 _1883;
	_1883 = _1882.xyz;
	float _1885 = F_xLuma(_1883);
	float _1887 = _1885 * 2.00000000e+00;
	float ILuma = _1887;
	float _1894 = smoothstep(0.00000000e+00, 1.00000000e+00, Depth_1826);
	bool _1895 = _1894 > V_xSSDO_Max_Depth;
	if (_1895)
	{
		ssdo = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	}
	vec2 _1897;
	float _1898;
	float _1899;
	_1897 = texcoords;
	_1898 = 1.00000000e+00;
	_1899 = 1.00000000e+00;
	float _1902 = F_xMCNoise(_1897, _1898, _1899);
	vec2 _1903;
	float _1904;
	float _1905;
	_1903 = texcoords;
	_1904 = 1.00000000e+00;
	_1905 = 2.00000000e+00;
	float _1908 = F_xMCNoise(_1903, _1904, _1905);
	vec2 _1909;
	float _1910;
	float _1911;
	_1909 = texcoords;
	_1910 = 1.00000000e+00;
	_1911 = 3.00000000e+00;
	float _1914 = F_xMCNoise(_1909, _1910, _1911);
	vec3 _1915 = vec3(_1902, _1908, _1914);
	vec3 Noise = _1915;
	vec3 _1917;
	_1917 = ssdo;
	vec3 _1918 = F_xSaturator(_1917);
	vec3 _1922 = smoothstep(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(1.00000001e-01, 1.00000001e-01, 1.00000001e-01), _1918.xyz);
	vec3 SS = _1922;
	vec3 _1925 = SS * vec3(2.25000009e-02, 2.25000009e-02, 2.25000009e-02);
	SS = _1925;
	bool _1930 = V_xSSDO_X2 == 1;
	if (_1930)
	{
		vec3 _1931 = ssdo * ssdo;
		ssdo = _1931;
	}
	bool _1936 = V_xSSDO_X2 == 2;
	if (_1936)
	{
		vec3 _1939 = mix(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), ssdo, vec3(ILuma));
		vec3 _1940 = ssdo * _1939;
		ssdo = _1940;
	}
	bool _1945 = V_xSSDO_X2 == 3;
	if (_1945)
	{
		float _1947 = 1.00000000e+00 - ILuma;
		vec3 _1950 = mix(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), ssdo, vec3(_1947));
		vec3 _1951 = ssdo * _1950;
		ssdo = _1951;
	}
	if (V_xDither_SSDO)
	{
		vec3 _1955;
		_1955 = ssdo;
		vec3 _1956 = F_xSaturator(_1955);
		vec3 _1957 = Noise * SS;
		vec3 _1958 = _1956 + _1957;
		vec3 _1959 = clamp(_1958, 0.0, 1.0);
		ssdo = _1959;
	}
	else
	{
		vec3 _1960;
		_1960 = ssdo;
		vec3 _1961 = F_xSaturator(_1960);
		vec3 _1962 = clamp(_1961, 0.0, 1.0);
		ssdo = _1962;
	}
	vec4 _1963 = texture(V_xSamplerColorsSSDO, texcoords);
	vec3 _1964;
	vec3 _1965;
	_1964 = _1963.xyz;
	_1965 = ssdo;
	vec3 _1967 = F_xComposite(_1964, _1965);
	vec4 _1968 = texture(V_xSamplerColorsSSDO, texcoords);
	float _1970 = 1.00000000e+00 - Intencity_Mask;
	vec3 _1973 = mix(_1967, _1968.xyz, vec3(_1970));
	vec3 Layer = _1973;
	bool _1979 = V_xDebug == 1;
	if (_1979)
	{
		vec4 _1980 = texture(V_xSamplerColorsSSDO, texcoords);
		float _1982 = 1.00000000e+00 - Intencity_Mask;
		vec3 _1985 = mix(ssdo, _1980.xyz, vec3(_1982));
		vec4 _1990 = vec4(_1985.x, _1985.y, _1985.z, 1.00000000e+00);
		return _1990;
	}
	else
	{
		bool _1995 = V_xDebug == 2;
		if (_1995)
		{
			float _1998 = texcoords.x + texcoords.y;
			bool _2000 = _1998 < 1.00000000e+00;
			vec2 _2001;
			float _2002;
			_2001 = texcoords;
			_2002 = 0.00000000e+00;
			vec4 _2004 = F_xNDSampler(_2001, _2002);
			vec2 _2005;
			float _2006;
			_2005 = texcoords;
			_2006 = 0.00000000e+00;
			vec4 _2008 = F_xNDSampler(_2005, _2006);
			vec3 _2011 = _2008.xyz * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			vec3 _2013 = _2011 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			vec3 _2016 = compCond(bvec3(_2000), vec3(_2004.w), _2013);
			vec4 _2021 = vec4(_2016.x, _2016.y, _2016.z, 1.00000000e+00);
			return _2021;
		}
		else
		{
			float _2022 = Depth_1826 / Guide;
			bool _2024 = _2022 > 9.98000026e-01;
			float _2025 = Depth_1826 / Guide;
			bool _2027 = _2025 > 9.98000026e-01;
			vec3 _2031 = vec3(float(_2024), 1.00000000e+00, float(_2027));
			vec3 _2033 = Layer.xyz * _2031;
			vec3 _2036 = compCond(bvec3(V_xDepth_Guide), _2033, Layer.xyz);
			vec4 _2041 = vec4(_2036.x, _2036.y, _2036.z, 1.00000000e+00);
			return _2041;
		}
	}
}
float F_xgetBit(
	in float map,
	in float index)
{
	float _2046 = -(index);
	float _2047 = exp2(_2046);
	float _2048 = map * _2047;
	float _2049 = floor(_2048);
	float _2050;
	float _2051;
	_2050 = _2049;
	_2051 = 2.00000000e+00;
	float _2053 = F_xfmod(_2050, _2051);
	return _2053;
}
float F_xDT_Information()
{
	int _2056 = F_xT_01();
	float DT_Text = float(_2056);
	bool _2059 = V_xclock <= DT_Text;
	return float(_2059);
}
float F_xdrawChar(
	in float Char,
	in vec2 pos,
	in vec2 size,
	in vec2 TC)
{
	vec2 _2067 = TC - pos;
	TC = _2067;
	vec2 _2068 = TC / size;
	TC = _2068;
	float _2071 = min(TC.x, TC.y);
	float _2073 = step(0.00000000e+00, _2071);
	float _2076 = max(TC.x, TC.y);
	float _2078 = step(1.00000000e+00, _2076);
	float _2079 = _2073 - _2078;
	float res = _2079;
	vec2 _2082 = TC * vec2(4.00000000e+00, 5.00000000e+00);
	TC = _2082;
	float _2084 = floor(TC.y);
	float _2086 = 4.00000000e+00 * _2084;
	float _2088 = floor(TC.x);
	float _2089 = _2086 + _2088;
	float _2090;
	float _2091;
	_2090 = Char;
	_2091 = _2089;
	float _2092 = F_xgetBit(_2090, _2091);
	float _2093 = res * _2092;
	res = _2093;
	float _2094 = clamp(res, 0.0, 1.0);
	return _2094;
}
vec4 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float _2101 = 1.00000000e+00 - texcoord.y;
	vec2 _2103 = vec2(texcoord.x, _2101);
	vec2 TC_2104 = _2103;
	float _2107 = texcoord.y * 5.00000000e+01;
	float _2109 = 1.00000000e+00 - _2107;
	float _2111 = _2109 + 4.88499985e+01;
	float _2113 = _2111 * texcoord.y;
	float _2115 = _2113 - 5.00000000e-01;
	float Gradient = _2115;
	float _2118 = V_xclock * 3.74999992e-03;
	float _2119 = sin(_2118);
	float _2122 = smoothstep(0.00000000e+00, 1.00000000e+00, _2119);
	float BT = _2122;
	float Size = 1.10000002e+00;
	float Depth3D = 0.00000000e+00;
	vec2 _2128;
	_2128 = texcoord;
	vec4 _2129 = F_xSSDOMixing(_2128);
	vec4 Color_2130 = _2129;
	float _2134 = F_xText_Info_Plus();
	if (bool(_2134))
	{
		vec2 _2138 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(Size);
		vec2 charSize = _2138;
		vec2 charPos = vec2(8.99999961e-03, 9.72500026e-01);
		float D3D_Size_A = 1.37500000e+00;
		float D3D_Size_B = 7.50000000e-01;
		vec2 _2148 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_A);
		vec2 charSize_A = _2148;
		vec2 _2152 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_B);
		vec2 charSize_B = _2152;
		charPos = vec2(8.61999989e-01, 1.79999992e-02);
		float _2155;
		vec2 _2156;
		vec2 _2157;
		vec2 _2158;
		_2155 = 4.98071000e+05;
		_2156 = charPos;
		_2157 = charSize_A;
		_2158 = TC_2104;
		float _2160 = F_xdrawChar(_2155, _2156, _2157, _2158);
		float _2161 = Depth3D + _2160;
		Depth3D = _2161;
		float _2163 = 9.99999978e-03 * D3D_Size_A;
		float _2165 = charPos.x + _2163;
		charPos[0] = _2165;
		float _2166;
		vec2 _2167;
		vec2 _2168;
		vec2 _2169;
		_2166 = 9.88959000e+05;
		_2167 = charPos;
		_2168 = charSize_A;
		_2169 = TC_2104;
		float _2171 = F_xdrawChar(_2166, _2167, _2168, _2169);
		float _2172 = Depth3D + _2171;
		Depth3D = _2172;
		float _2174 = 9.99999978e-03 * D3D_Size_A;
		float _2176 = charPos.x + _2174;
		charPos[0] = _2176;
		float _2177;
		vec2 _2178;
		vec2 _2179;
		vec2 _2180;
		_2177 = 4.98033000e+05;
		_2178 = charPos;
		_2179 = charSize_A;
		_2180 = TC_2104;
		float _2182 = F_xdrawChar(_2177, _2178, _2179, _2180);
		float _2183 = Depth3D + _2182;
		Depth3D = _2183;
		float _2185 = 9.99999978e-03 * D3D_Size_A;
		float _2187 = charPos.x + _2185;
		charPos[0] = _2187;
		float _2188;
		vec2 _2189;
		vec2 _2190;
		vec2 _2191;
		_2188 = 1.00051600e+06;
		_2189 = charPos;
		_2190 = charSize_A;
		_2191 = TC_2104;
		float _2193 = F_xdrawChar(_2188, _2189, _2190, _2191);
		float _2194 = Depth3D + _2193;
		Depth3D = _2194;
		float _2196 = 9.99999978e-03 * D3D_Size_A;
		float _2198 = charPos.x + _2196;
		charPos[0] = _2198;
		float _2199;
		vec2 _2200;
		vec2 _2201;
		vec2 _2202;
		_2199 = 6.30681000e+05;
		_2200 = charPos;
		_2201 = charSize_A;
		_2202 = TC_2104;
		float _2204 = F_xdrawChar(_2199, _2200, _2201, _2202);
		float _2205 = Depth3D + _2204;
		Depth3D = _2205;
		float _2207 = 9.99999978e-03 * D3D_Size_A;
		float _2209 = charPos.x + _2207;
		charPos[0] = _2209;
		float _2210;
		vec2 _2211;
		vec2 _2212;
		vec2 _2213;
		_2210 = 4.31254000e+05;
		_2211 = charPos;
		_2212 = charSize_A;
		_2213 = TC_2104;
		float _2215 = F_xdrawChar(_2210, _2211, _2212, _2213);
		float _2216 = Depth3D + _2215;
		Depth3D = _2216;
		float _2218 = 9.99999978e-03 * D3D_Size_A;
		float _2220 = charPos.x + _2218;
		charPos[0] = _2220;
		float _2221;
		vec2 _2222;
		vec2 _2223;
		vec2 _2224;
		_2221 = 4.98071000e+05;
		_2222 = charPos;
		_2223 = charSize_A;
		_2224 = TC_2104;
		float _2226 = F_xdrawChar(_2221, _2222, _2223, _2224);
		float _2227 = Depth3D + _2226;
		Depth3D = _2227;
		float _2229 = 8.00000038e-03 * D3D_Size_A;
		float _2231 = charPos.x + _2229;
		charPos[0] = _2231;
		float _2232;
		vec2 _2233;
		vec2 _2234;
		vec2 _2235;
		_2232 = 2.00000000e+00;
		_2233 = charPos;
		_2234 = charSize_A;
		_2235 = TC_2104;
		float _2237 = F_xdrawChar(_2232, _2233, _2234, _2235);
		float _2238 = Depth3D + _2237;
		Depth3D = _2238;
		float _2240 = 9.99999978e-03 * D3D_Size_A;
		float _2242 = charPos.x + _2240;
		charPos[0] = _2242;
		charPos = vec2(9.63000000e-01, 1.79999992e-02);
		float _2244;
		vec2 _2245;
		vec2 _2246;
		vec2 _2247;
		_2244 = 1.00052700e+06;
		_2245 = charPos;
		_2246 = charSize_B;
		_2247 = TC_2104;
		float _2249 = F_xdrawChar(_2244, _2245, _2246, _2247);
		float _2250 = Depth3D + _2249;
		Depth3D = _2250;
		float _2252 = 9.99999978e-03 * D3D_Size_B;
		float _2254 = charPos.x + _2252;
		charPos[0] = _2254;
		float _2255;
		vec2 _2256;
		vec2 _2257;
		vec2 _2258;
		_2255 = 6.38361000e+05;
		_2256 = charPos;
		_2257 = charSize_B;
		_2258 = TC_2104;
		float _2260 = F_xdrawChar(_2255, _2256, _2257, _2258);
		float _2261 = Depth3D + _2260;
		Depth3D = _2261;
		float _2263 = 9.99999978e-03 * D3D_Size_B;
		float _2265 = charPos.x + _2263;
		charPos[0] = _2265;
		float _2266;
		vec2 _2267;
		vec2 _2268;
		vec2 _2269;
		_2266 = 9.88945000e+05;
		_2267 = charPos;
		_2268 = charSize_B;
		_2269 = TC_2104;
		float _2271 = F_xdrawChar(_2266, _2267, _2268, _2269);
		float _2272 = Depth3D + _2271;
		Depth3D = _2272;
		float _2274 = 9.99999978e-03 * D3D_Size_B;
		float _2276 = charPos.x + _2274;
		charPos[0] = _2276;
		float _2277;
		vec2 _2278;
		vec2 _2279;
		vec2 _2280;
		_2277 = 4.32534000e+05;
		_2278 = charPos;
		_2279 = charSize_B;
		_2280 = TC_2104;
		float _2282 = F_xdrawChar(_2277, _2278, _2279, _2280);
		float _2283 = Depth3D + _2282;
		Depth3D = _2283;
		float _2284 = Gradient + Depth3D;
		float _2286 = Depth3D * 9.80000019e-01;
		float _2287 = clamp(_2286, 0.0, 1.0);
		vec4 _2290 = mix(vec4(_2284), Color_2130, vec4(_2287));
		vec4 _2293 = compCond(bvec4(false, false, false, false), _2290, vec4(Gradient));
		vec4 _2295 = compCond(bvec4(vec4(Depth3D)), _2293, Color_2130);
		return _2295;
	}
	else
	{
		float _2296 = F_xHelper();
		vec4 _2299 = compCond(bvec4(vec4(_2296)), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), Color_2130);
		return _2299;
	}
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _2306 = id == 2u;
	float _2309 = _2306 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _2309;
	bool _2311 = id == 1u;
	float _2314 = _2311 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _2314;
	vec2 _2316 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _2318 = _2316 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _2323 = vec4(_2318.x, _2318.y, 0.00000000e+00, 1.00000000e+00);
	position = _2323;
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
#ifdef E_xSSDOColors
in vec2 vv_0;
layout(location = 0) out vec4 _out_Colors;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 Colors;
	F_xSSDOColors(vpos, texcoords, Colors);
	_out_Colors = Colors;
	return;
}
#endif
#ifdef E_xNormalsDepth
in vec2 vv_0;
layout(location = 0) out vec2 _out_Normals;
layout(location = 1) out float _out_Depth;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec2 Normals;
	float Depth;
	F_xNormalsDepth(vpos, texcoords, Normals, Depth);
	_out_Normals = Normals;
	_out_Depth = Depth;
	return;
}
#endif
#ifdef E_xSSDO
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xSSDO(vpos, texcoords);
	return;
}
#endif
#ifdef E_xCEAGD_H_SSDO
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xCEAGD_H_SSDO(vpos, texcoords);
	return;
}
#endif
#ifdef E_xCEAGD_V_SSDO
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xCEAGD_V_SSDO(vpos, texcoords);
	return;
}
#endif
#ifdef E_xTAA_SSDO
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xTAA_SSDO(vpos, texcoords);
	return;
}
#endif
#ifdef E_xAccumulatedFramesSSDO
in vec2 vv_0;
layout(location = 0) out vec4 _out_acc;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 acc;
	F_xAccumulatedFramesSSDO(vpos, texcoords, acc);
	_out_acc = acc;
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
