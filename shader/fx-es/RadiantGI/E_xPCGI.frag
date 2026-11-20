#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPCGI
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
uniform int V_xRadiantGI;
uniform float V_xsamples;
uniform float V_xGI_Ray_Length;
uniform float V_xTarget_Lighting;
uniform vec2 V_xNCD;
uniform float V_xPCGI_Fade;
uniform vec2 V_xReflectivness;
uniform bool V_xScattering;
uniform float V_xWrap;
uniform float V_xDeep_Scattering;
uniform float V_xLuma_Map;
uniform vec3 V_xInternals;
uniform vec2 V_xDiffusion_Saturation_Power;
uniform float V_xSSS_Seek;
uniform int V_xSky_Emissive_Selection;
uniform float V_xGI_Sky_Saturation;
uniform int V_xSky_Adustment;
uniform float V_xD_Irradiance;
uniform vec2 V_xPCGI_2DTexture_Detail;
uniform float V_xTrim;
uniform int V_xBlend;
uniform float V_xGI_Power;
uniform float V_xGI_Saturation;
uniform float V_xHDR_BP;
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform float V_xOffset;
uniform bool V_xDepth_Map_Flip;
uniform int V_xDebug;
uniform int V_xSamplesXY;
uniform float V_xGI_Res;
uniform bool V_xIGN_Toggle;
uniform int V_xPP_Options;
uniform bool V_xText_Info;
uniform float V_xframetime;
uniform int V_xframecount;
uniform float V_xclock;

uniform sampler2D V_xZBuffer;
uniform sampler2D V_xBackBufferPCGI;
uniform sampler2D V_xPCGIpastFrame;
uniform sampler2D V_xPCGIaccuFrames;
uniform sampler2D V_xPCGIcurrColor;
uniform sampler2D V_xPCGIcurrNormalsDepth;
uniform sampler2D V_xPCGI_Info;
uniform sampler2D V_xPCSS_Info;
uniform sampler2D V_xPCGIReconstruction_Info;
uniform sampler2D V_xPCGI_BGUHorizontal_Sample;
uniform sampler2D V_xPCGI_BGUVertical_Sample;
const float _264[1] = float[1](0.00000000e+00);
const float _1584[7] = float[7](0.00000000e+00, 5.00000000e+00, 6.00000000e+00, 7.00000000e+00, 8.00000000e+00, 9.00000000e+00, 1.00000000e+01);
const vec2 _2293[13] = vec2[13](vec2(-3.26000005e-01, -4.05999988e-01), vec2(-8.39999974e-01, -7.40000010e-02), vec2(-6.95999980e-01, 4.56999987e-01), vec2(-2.02999994e-01, 6.20999992e-01), vec2(9.62000012e-01, -1.94999993e-01), vec2(4.72999990e-01, -4.79999989e-01), vec2(5.18999994e-01, 7.67000020e-01), vec2(1.85000002e-01, -8.93000007e-01), vec2(5.07000029e-01, 6.40000030e-02), vec2(8.96000028e-01, 4.12000000e-01), vec2(-3.21999997e-01, -9.33000028e-01), vec2(-7.91999996e-01, -5.97999990e-01), vec2(-2.54999995e-01, 4.63999987e-01));
const vec2 _2671[8] = vec2[8](vec2(0.00000000e+00, 9.25925910e-04), vec2(0.00000000e+00, -9.25925910e-04), vec2(5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, -9.25925910e-04), vec2(5.20833360e-04, -9.25925910e-04), vec2(-5.20833360e-04, 9.25925910e-04), vec2(5.20833360e-04, 9.25925910e-04));
const float _2735[21] = float[21](0.00000000e+00, 2.00000000e+00, 4.00000000e+00, 6.00000000e+00, 8.00000000e+00, 1.00000000e+01, 1.20000000e+01, 1.40000000e+01, 1.60000000e+01, 1.80000000e+01, 2.00000000e+01, 2.20000000e+01, 2.40000000e+01, 2.60000000e+01, 2.80000000e+01, 3.00000000e+01, 3.20000000e+01, 3.40000000e+01, 3.60000000e+01, 3.80000000e+01, 4.00000000e+01);
const float _2921[7] = float[7](-5.50000000e+00, -3.50000000e+00, -1.50000000e+00, 0.00000000e+00, 1.50000000e+00, 3.50000000e+00, 5.50000000e+00);
const vec3 _2973[7] = vec3[7](vec3(6.00000005e-03, 0.00000000e+00, 0.00000000e+00), vec3(6.10000007e-02, 0.00000000e+00, 0.00000000e+00), vec3(2.41999999e-01, 2.50000000e-01, 2.50000000e-01), vec3(3.82999986e-01, 5.00000000e-01, 5.00000000e-01), vec3(2.41999999e-01, 2.50000000e-01, 2.50000000e-01), vec3(6.10000007e-02, 0.00000000e+00, 0.00000000e+00), vec3(6.00000005e-03, 0.00000000e+00, 0.00000000e+00));
uint F_xVRS_Map_xShadingRate(
	in vec2 texcoord,
	in bool UseVRS,
	in uint offRate)
{
	return offRate;
}
uint F_xVRS_Map_xShadingRate(
	in vec2 texcoord,
	in float VarianceCutoff,
	in bool UseVRS,
	in uint offRate)
{
	return offRate;
}
vec3 F_xVRS_Map_xDebugImage(
	in vec3 originalImage,
	in vec2 texcoord,
	in float VarianceCutoff,
	in bool DebugView)
{
	return originalImage;
}
ivec2 F_xSky_Emissive_Bool()
{
	bool _58 = V_xSky_Emissive_Selection == 1;
	bool _60 = V_xSky_Emissive_Selection == 3;
	bool _61 = _58 || _60;
	int _64 = _61 ? 1 : 0;
	int Sky_Bool = _64;
	bool _67 = V_xSky_Emissive_Selection == 2;
	bool _69 = V_xSky_Emissive_Selection == 3;
	bool _70 = _67 || _69;
	int _73 = _70 ? 1 : 0;
	int Emissive_Bool = _73;
	ivec2 _75 = ivec2(Sky_Bool, Emissive_Bool);
	return _75;
}
float F_xScale_PCGI_Fade()
{
	float _78 = abs(V_xPCGI_Fade);
	float _79 = clamp(_78, 0.0, 1.0);
	float _82 = mix(0.00000000e+00, 2.00000000e+00, _79);
	return _82;
}
float F_xOffset_Switch()
{
	bool _86 = V_xOffset >= -1.50000001e-03;
	bool _88 = V_xOffset <= 1.50000001e-03;
	bool _89 = _86 && _88;
	float _91 = _89 ? 0.00000000e+00 : V_xOffset;
	return _91;
}
vec2 F_xSaturation()
{
	vec2 _94 = vec2(V_xGI_Saturation, V_xGI_Sky_Saturation);
	return _94;
}
float F_xReflect()
{
	bool _99 = V_xReflectivness.x == 0.00000000e+00;
	float _102 = _99 ? -1.00000005e-03 : V_xReflectivness.x;
	return _102;
}
vec2 F_xGIRL()
{
	vec2 _106 = vec2(V_xGI_Ray_Length, 2.50000000e+02);
	return _106;
}
float F_xfmod(
	in float a,
	in float b)
{
	float _111 = a / b;
	float _112 = abs(_111);
	float _113 = fract(_112);
	float _114 = abs(b);
	float _115 = _113 * _114;
	float c = _115;
	bool _118 = a < 0.00000000e+00;
	float _119 = -(c);
	float _120 = _118 ? _119 : c;
	return _120;
}
float F_xScale(
	in float val,
	in float _max,
	in float _min)
{
	float _126 = val - _min;
	float _127 = _max - _min;
	float _128 = _126 / _127;
	return _128;
}
int F_xuseVRS(
	in vec2 texcoord,
	in int UseVRS)
{
	vec2 _133;
	bool _134;
	uint _135;
	_133 = texcoord;
	_134 = bool(UseVRS);
	_135 = 0u;
	uint _138 = F_xVRS_Map_xShadingRate(_133, _134, _135);
	bool _140 = _138 == 5u;
	return int(_140);
}
float F_xMCNoise(
	in float FC,
	in vec2 TC,
	in float seed)
{
	float motion = FC;
	float a_149 = 1.29898005e+01;
	float b_151 = 7.82330017e+01;
	float c_153 = 4.37585469e+04;
	vec2 _156 = TC.xy + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _157 = vec2(a_149, b_151);
	float _158 = dot(_156, _157);
	float dt = _158;
	float _161 = 3.14159274e+00 + seed;
	float _162;
	float _163;
	_162 = dt;
	_163 = _161;
	float _164 = F_xfmod(_162, _163);
	float sn = _164;
	float _166 = sin(sn);
	float _167 = _166 * c_153;
	float _168 = fract(_167);
	float _170 = 7.18033969e-01 * motion;
	float _171 = _168 + _170;
	float _172 = fract(_171);
	return _172;
}
int F_xT_01()
{
	return 12500;
}
float F_xInterleaved_Gradient_Noise(
	in vec2 TC)
{
	vec3 MNums = vec3(6.71105608e-02, 5.83714992e-03, 5.29829178e+01);
	float _182 = dot(TC, MNums.xy);
	float _183 = fract(_182);
	float _185 = MNums.z * _183;
	float _186 = fract(_185);
	return _186;
}
float F_xgaussian(
	in float x,
	in float sigma)
{
	float _192 = pow(sigma, 2.00000000e+00);
	float _194 = 3.14159274e+00 * _192;
	float _195 = inversesqrt(_194);
	float _197 = pow(x, 2.00000000e+00);
	float _199 = pow(sigma, 2.00000000e+00);
	float _201 = 2.00000000e+00 * _199;
	float _202 = _197 / _201;
	float _203 = -(_202);
	float _204 = exp(_203);
	float _205 = _195 * _204;
	return _205;
}
vec3 F_xoverlay(
	in vec3 c,
	in vec3 b)
{
	bvec3 _211 = lessThan(c, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _213 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _214 = _213 * b;
	vec3 _216 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _218 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _216;
	vec3 _220 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _221 = _218 * _220;
	vec3 _223 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _221;
	vec3 _224 = compCond(_211, _214, _223);
	return _224;
}
vec3 F_xsoftlight(
	in vec3 c,
	in vec3 b)
{
	bvec3 _230 = lessThan(b, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _232 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _233 = _232 * b;
	vec3 _234 = c * c;
	vec3 _236 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _238 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _236;
	vec3 _239 = _234 * _238;
	vec3 _240 = _233 + _239;
	vec3 _241 = sqrt(c);
	vec3 _243 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * b;
	vec3 _245 = _243 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _246 = _241 * _245;
	vec3 _248 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _250 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _251 = _248 * _250;
	vec3 _252 = _246 + _251;
	vec3 _253 = compCond(_230, _240, _252);
	return _253;
}
vec3 F_xadd(
	in vec3 c,
	in vec3 b)
{
	vec3 _259 = b * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _260 = c + _259;
	return _260;
}
vec3 F_xRGBtoYCbCr(
	in vec3 rgb)
{
	float C[1] = _264;
	float _268 = 2.98999995e-01 * rgb.x;
	float _271 = 5.87000012e-01 * rgb.y;
	float _272 = _268 + _271;
	float _275 = 1.14000000e-01 * rgb.z;
	float _276 = _272 + _275;
	float Y = _276;
	float _280 = -1.69000000e-01 * rgb.x;
	float _283 = 3.31000000e-01 * rgb.y;
	float _284 = _280 - _283;
	float _287 = 5.00000000e-01 * rgb.z;
	float _288 = _284 + _287;
	float Cb = _288;
	float _292 = 5.00000000e-01 * rgb.x;
	float _295 = 4.19000000e-01 * rgb.y;
	float _296 = _292 - _295;
	float _299 = 8.10000002e-02 * rgb.z;
	float _300 = _296 - _299;
	float Cr = _300;
	float _303 = Cb + 5.01960814e-01;
	float _305 = Cr + 5.01960814e-01;
	vec3 _306 = vec3(Y, _303, _305);
	return _306;
}
vec3 F_xYCbCrtoRGB(
	in vec3 ycc)
{
	vec3 _311 = ycc - vec3(0.00000000e+00, 5.01960814e-01, 5.01960814e-01);
	vec3 c_312 = _311;
	float _315 = 1.39999998e+00 * c_312.z;
	float _317 = c_312.x + _315;
	float R = _317;
	float _321 = 3.42999995e-01 * c_312.y;
	float _323 = c_312.x - _321;
	float _326 = 7.11000025e-01 * c_312.z;
	float _327 = _323 - _326;
	float G = _327;
	float _331 = 1.76499999e+00 * c_312.y;
	float _333 = c_312.x + _331;
	float B = _333;
	vec3 _335 = vec3(R, G, B);
	return _335;
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
	float _347 = dot(C, Luma);
	return _347;
}
float F_xmax3(
	in float x,
	in float y,
	in float z)
{
	float _353 = max(y, z);
	float _354 = max(x, _353);
	return _354;
}
vec3 F_xinv_Tonemapper(
	in vec4 color)
{
	float _360 = max(color.w, 1.00000005e-03);
	float _362 = 1.00000000e+00 + _360;
	float _363;
	float _364;
	float _365;
	_363 = color.x;
	_364 = color.y;
	_365 = color.z;
	float _369 = F_xmax3(_363, _364, _365);
	float _370 = _362 - _369;
	float _371 = 1.0 / _370;
	vec3 _374 = color.xyz * vec3(_371);
	return _374;
}
vec3 F_xHUEToRGB(
	in float H)
{
	float _379 = H * 6.00000000e+00;
	float _381 = _379 - 3.00000000e+00;
	float _382 = abs(_381);
	float _384 = _382 - 1.00000000e+00;
	float _386 = H * 6.00000000e+00;
	float _388 = _386 - 2.00000000e+00;
	float _389 = abs(_388);
	float _391 = 2.00000000e+00 - _389;
	float _393 = H * 6.00000000e+00;
	float _395 = _393 - 4.00000000e+00;
	float _396 = abs(_395);
	float _398 = 2.00000000e+00 - _396;
	vec3 _399 = vec3(_384, _391, _398);
	vec3 _400 = clamp(_399, 0.0, 1.0);
	return _400;
}
vec3 F_xRGBToHCV(
	in vec3 RGB)
{
	bool _406 = RGB.y < RGB.z;
	vec4 _411 = vec4(RGB.zy.x, RGB.zy.y, -1.00000000e+00, 6.66666687e-01);
	vec4 _416 = vec4(RGB.yz.x, RGB.yz.y, 0.00000000e+00, -3.33333343e-01);
	vec4 _418 = compCond(bvec4(_406), _411, _416);
	vec4 P = _418;
	bool _422 = RGB.x < P.x;
	vec4 _427 = vec4(P.xyw.x, P.xyw.y, P.xyw.z, RGB.x);
	vec4 _432 = vec4(RGB.x, P.yzx.x, P.yzx.y, P.yzx.z);
	vec4 _434 = compCond(bvec4(_422), _427, _432);
	vec4 Q1 = _434;
	float _438 = min(Q1.w, Q1.y);
	float _440 = Q1.x - _438;
	float C_441 = _440;
	float _444 = Q1.w - Q1.y;
	float _446 = 6.00000000e+00 * C_441;
	float _448 = _446 + 9.99999997e-07;
	float _449 = _444 / _448;
	float _451 = _449 + Q1.z;
	float _452 = abs(_451);
	float H_453 = _452;
	vec3 _455 = vec3(H_453, C_441, Q1.x);
	return _455;
}
vec3 F_xRGBToHSL(
	in vec3 RGB)
{
	vec3 _461 = max(RGB.xyz, vec3(9.99999997e-07, 9.99999997e-07, 9.99999997e-07));
	RGB.xyz = _461;
	vec3 _462;
	_462 = RGB;
	vec3 _463 = F_xRGBToHCV(_462);
	vec3 HCV = _463;
	float _467 = HCV.y * 5.00000000e-01;
	float _469 = HCV.z - _467;
	float L = _469;
	float _472 = L * 2.00000000e+00;
	float _474 = _472 - 1.00000000e+00;
	float _475 = abs(_474);
	float _477 = 1.00000000e+00 - _475;
	float _479 = _477 + 9.99999997e-07;
	float _481 = HCV.y / _479;
	float S = _481;
	vec3 _484 = vec3(HCV.x, S, L);
	return _484;
}
vec3 F_xHSLToRGB(
	in vec3 HSL)
{
	float _488;
	_488 = HSL.x;
	vec3 _490 = F_xHUEToRGB(_488);
	vec3 RGB_491 = _490;
	float _494 = 2.00000000e+00 * HSL.z;
	float _496 = _494 - 1.00000000e+00;
	float _497 = abs(_496);
	float _499 = 1.00000000e+00 - _497;
	float _501 = _499 * HSL.y;
	float C_502 = _501;
	vec3 _504 = RGB_491 - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _506 = _504 * vec3(C_502);
	vec3 _508 = _506 + vec3(HSL.z);
	return _508;
}
vec3 F_xSaturator_A(
	in vec3 C,
	in float Depth_Mask,
	in float DD)
{
	float _515 = 1.00000000e+00 - Depth_Mask;
	float Mask = _515;
	bool _518 = V_xDebug == 2;
	vec2 _519 = F_xSaturation();
	float _522 = _518 ? 0.00000000e+00 : _519.x;
	float Sat = _522;
	float _524 = clamp(V_xD_Irradiance, 0.0, 1.0);
	float _527 = mix(5.00000000e-01, 1.00000000e+00, _524);
	float Distance_Irradiance = _527;
	float _529 = DD - Distance_Irradiance;
	float _531 = 1.00000000e+00 - Distance_Irradiance;
	float _532 = _529 / _531;
	float _533 = clamp(_532, 0.0, 1.0);
	float _535 = 1.00000000e+00 - _533;
	float _536 = DD * Depth_Mask;
	float _538 = mix(_535, 1.00000000e+00, _536);
	float DDMasked = _538;
	vec3 _542 = C.xyz * vec3(DDMasked);
	C.xyz = _542;
	float _545 = mix(1.00000000e+00, 6.00000000e+00, V_xTrim);
	float _547 = mix(1.00000000e+00, _545, Depth_Mask);
	vec3 _550 = C.xyz * vec3(_547);
	C.xyz = _550;
	vec3 _553 = C.xyz * vec3(1.25000000e+00, 1.25000000e+00, 1.25000000e+00);
	vec3 _556 = mix(C.xyz, _553, vec3(Depth_Mask));
	vec3 _557;
	_557 = _556;
	vec3 _558 = F_xRGBToHSL(_557);
	C.xyz = _558;
	float _559 = Sat * Mask;
	vec2 _560 = F_xSaturation();
	float _563 = mix(1.00000000e+00, _560.y, Depth_Mask);
	float _564 = _559 + _563;
	float _566 = C.y * _564;
	C[1] = _566;
	vec3 _567;
	_567 = C.xyz;
	vec3 _569 = F_xHSLToRGB(_567);
	return _569;
}
vec3 F_xSaturator_B(
	in vec3 C)
{
	vec3 _573;
	_573 = C.xyz;
	vec3 _575 = F_xRGBToHSL(_573);
	C.xyz = _575;
	float _577 = clamp(V_xDiffusion_Saturation_Power.y, 0.0, 1.0);
	float _579 = _577 * 2.00000000e+00;
	float _581 = C.y * _579;
	C[1] = _581;
	vec3 _582;
	_582 = C.xyz;
	vec3 _584 = F_xHSLToRGB(_582);
	return _584;
}
vec3 F_xSaturator_C(
	in vec3 C)
{
	vec3 _588;
	_588 = C.xyz;
	vec3 _590 = F_xRGBToHSL(_588);
	C.xyz = _590;
	vec3 _591;
	_591 = C.xyz;
	vec3 _593 = F_xHSLToRGB(_591);
	return _593;
}
vec3 F_xInternalFleshColor(
	in vec3 SSS,
	in float Density,
	in vec3 Internal,
	in float LumProfile)
{
	float _600 = clamp(Density, 0.0, 1.0);
	float _601 = _600 * LumProfile;
	vec3 D = vec3(_601);
	vec3 _604 = D * Internal;
	vec3 _605 = clamp(SSS, 0.0, 1.0);
	vec3 _607 = mix(_604, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), _605);
	vec3 _608 = SSS + _607;
	return _608;
}
float F_xSkinDetection(
	in vec4 color)
{
	vec3 _612;
	_612 = color.xyz;
	vec3 _614 = F_xRGBtoYCbCr(_612);
	vec3 _616 = _614 * vec3(2.55000000e+02, 2.55000000e+02, 2.55000000e+02);
	vec3 YCbCr = _616;
	bool _623 = YCbCr.y > 8.00000000e+01;
	bool _626 = YCbCr.y < 1.18000000e+02;
	bool _627 = _623 && _626;
	bool _630 = YCbCr.z > 1.33000000e+02;
	bool _631 = _627 && _630;
	bool _634 = YCbCr.z < 1.73000000e+02;
	bool _635 = _631 && _634;
	if (_635)
	{
		return 0.00000000e+00;
	}
	else
	{
		return 1.00000000e+00;
	}
}
int F_xT_02()
{
	return 25000;
}
float F_xDepth_Info(
	in vec2 texcoord)
{
	if (V_xDepth_Map_Flip)
	{
		float _671 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _671;
	}
	vec4 _676 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _677 = textureLod(V_xZBuffer, _676.xy, _676.w);
	float zBuffer = _677.x;
	float zBufferWH = zBuffer;
	float Far = 1.00000000e+00;
	float _684 = 9.99999994e-09 + V_xDepth_Map_Adjust;
	float _686 = 1.25000000e-01 / _684;
	float Near = _686;
	float _690 = 1.00000000e+01 * V_xNCD.y;
	float _693 = bool(V_xDepth_Map) ? V_xNCD.y : _690;
	float _695 = 9.99999994e-09 + _693;
	float _697 = 1.25000000e-01 / _695;
	float NearWH = _697;
	float _701 = 1.00000000e+02 * V_xNCD.y;
	float _704 = bool(V_xDepth_Map) ? V_xNCD.y : _701;
	float OtherSettings = _704;
	float _706 = Far / Near;
	float _707 = Far / Near;
	float _709 = 1.00000000e+00 - _707;
	vec2 _710 = vec2(_706, _709);
	vec2 C_711 = _710;
	float _712 = F_xOffset_Switch();
	bool _714 = _712 < 0.00000000e+00;
	float _715 = F_xOffset_Switch();
	float _716 = abs(_715);
	float _718 = 1.00000000e+00 + _716;
	float _719 = zBuffer * _718;
	float _721 = min(1.00000000e+00, _719);
	float _723 = 1.00000000e+00 - zBuffer;
	vec2 _724 = vec2(zBuffer, _723);
	vec2 _727 = compCond(bvec2(_714), vec2(_721), _724);
	vec2 Z = _727;
	float _730 = 1.00000000e+00 + OtherSettings;
	float _732 = 1.00000000e+00 - OtherSettings;
	vec2 _733 = vec2(_730, _732);
	vec2 Offsets = _733;
	float _736 = 1.00000000e+00 - zBufferWH;
	vec2 _737 = vec2(zBufferWH, _736);
	vec2 zB = _737;
	float _742 = F_xOffset_Switch();
	bool _744 = _742 > 0.00000000e+00;
	float _745 = F_xOffset_Switch();
	bool _747 = _745 < 0.00000000e+00;
	bool _748 = _744 || _747;
	if (_748)
	{
		float _749 = F_xOffset_Switch();
		bool _751 = _749 < 0.00000000e+00;
		float _754 = 1.00000000e+00 - Z.y;
		vec2 _756 = vec2(Z.x, _754);
		float _757 = F_xOffset_Switch();
		float _759 = 1.00000000e+00 + _757;
		float _761 = Z.x * _759;
		float _762 = F_xOffset_Switch();
		float _764 = 1.00000000e+00 - _762;
		float _766 = Z.y / _764;
		vec2 _767 = vec2(_761, _766);
		vec2 _769 = min(vec2(1.00000000e+00, 1.00000000e+00), _767);
		vec2 _771 = compCond(bvec2(_751), _756, _769);
		Z = _771;
	}
	bool _777 = V_xNCD.y > 0.00000000e+00;
	if (_777)
	{
		float _780 = zB.x * Offsets.x;
		float _783 = zB.y / Offsets.y;
		vec2 _784 = vec2(_780, _783);
		vec2 _786 = min(vec2(1.00000000e+00, 1.00000000e+00), _784);
		zB = _786;
	}
	bool _791 = V_xDepth_Map == 0;
	if (_791)
	{
		float _794 = Z.x * C_711.y;
		float _796 = _794 + C_711.x;
		float _797 = 1.0 / _796;
		zBuffer = _797;
		float _798 = Far * NearWH;
		float _799 = NearWH - Far;
		float _801 = zB.x * _799;
		float _802 = Far + _801;
		float _803 = _798 / _802;
		zBufferWH = _803;
	}
	else
	{
		bool _808 = V_xDepth_Map == 1;
		if (_808)
		{
			float _811 = Z.y * C_711.y;
			float _813 = _811 + C_711.x;
			float _814 = 1.0 / _813;
			zBuffer = _814;
			float _815 = Far * NearWH;
			float _816 = NearWH - Far;
			float _818 = zB.y * _816;
			float _819 = Far + _818;
			float _820 = _815 / _819;
			zBufferWH = _820;
		}
	}
	bool _823 = V_xNCD.y > 0.00000000e+00;
	float _824 = _823 ? zBufferWH : zBuffer;
	float _826 = mix(_824, zBuffer, 9.25000012e-01);
	float _827 = clamp(_826, 0.0, 1.0);
	return _827;
}
float F_xSUMTexture_lookup(
	in vec2 TC,
	in float dx,
	in float dy)
{
	vec2 _833;
	_833 = TC;
	float _834 = F_xDepth_Info(_833);
	float _836 = 1.00000000e+00 - _834;
	float Depth = _836;
	float _839 = Depth - 0.00000000e+00;
	float _842 = 1.00000000e+00 - V_xPCGI_2DTexture_Detail.x;
	float _843 = clamp(_842, 0.0, 1.0);
	float _846 = mix(1.00000000e+00, 1.00000000e+01, _843);
	float _848 = _846 - 0.00000000e+00;
	float _849 = _839 / _848;
	Depth = _849;
	vec2 _850 = vec2(dx, dy);
	vec2 _852 = _850 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _854 = TC.xy + _852;
	vec2 uv = _854;
	vec4 _860 = vec4(uv.xy.x, uv.xy.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _861 = textureLod(V_xBackBufferPCGI, _860.xy, _860.w);
	vec3 _864 = _861.xyz * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 c_865 = _864;
	float _868 = 2.12599993e-01 * c_865.x;
	float _871 = 7.15200007e-01 * c_865.y;
	float _872 = _868 + _871;
	float _875 = 7.22000003e-02 * c_865.z;
	float _876 = _872 + _875;
	float _877 = _876 * Depth;
	float _879 = _877 * 6.65999996e-03;
	return _879;
}
vec3 F_xTextureNormals(
	in vec2 UV,
	in float Depth)
{
	float _888 = clamp(V_xPCGI_2DTexture_Detail.x, 0.0, 1.0);
	bool _890 = _888 > 0.00000000e+00;
	if (_890)
	{
		float dx_892 = 0.00000000e+00;
		vec2 _893;
		float _894;
		float _895;
		_893 = UV;
		_894 = -1.50000000e+00;
		_895 = -1.50000000e+00;
		float _898 = F_xSUMTexture_lookup(_893, _894, _895);
		float _900 = -1.00000000e+00 * _898;
		float _901 = dx_892 + _900;
		dx_892 = _901;
		vec2 _902;
		float _903;
		float _904;
		_902 = UV;
		_903 = -1.50000000e+00;
		_904 = 0.00000000e+00;
		float _907 = F_xSUMTexture_lookup(_902, _903, _904);
		float _909 = -2.00000000e+00 * _907;
		float _910 = dx_892 + _909;
		dx_892 = _910;
		vec2 _911;
		float _912;
		float _913;
		_911 = UV;
		_912 = -1.50000000e+00;
		_913 = 1.50000000e+00;
		float _916 = F_xSUMTexture_lookup(_911, _912, _913);
		float _918 = -1.00000000e+00 * _916;
		float _919 = dx_892 + _918;
		dx_892 = _919;
		vec2 _920;
		float _921;
		float _922;
		_920 = UV;
		_921 = 1.50000000e+00;
		_922 = -1.50000000e+00;
		float _925 = F_xSUMTexture_lookup(_920, _921, _922);
		float _926 = dx_892 + _925;
		dx_892 = _926;
		vec2 _927;
		float _928;
		float _929;
		_927 = UV;
		_928 = 1.50000000e+00;
		_929 = 0.00000000e+00;
		float _932 = F_xSUMTexture_lookup(_927, _928, _929);
		float _934 = 2.00000000e+00 * _932;
		float _935 = dx_892 + _934;
		dx_892 = _935;
		vec2 _936;
		float _937;
		float _938;
		_936 = UV;
		_937 = 1.50000000e+00;
		_938 = 1.50000000e+00;
		float _941 = F_xSUMTexture_lookup(_936, _937, _938);
		float _942 = dx_892 + _941;
		dx_892 = _942;
		float dy_944 = 0.00000000e+00;
		vec2 _945;
		float _946;
		float _947;
		_945 = UV;
		_946 = -1.50000000e+00;
		_947 = -1.50000000e+00;
		float _950 = F_xSUMTexture_lookup(_945, _946, _947);
		float _952 = -1.00000000e+00 * _950;
		float _953 = dy_944 + _952;
		dy_944 = _953;
		vec2 _954;
		float _955;
		float _956;
		_954 = UV;
		_955 = 0.00000000e+00;
		_956 = -1.50000000e+00;
		float _959 = F_xSUMTexture_lookup(_954, _955, _956);
		float _961 = -2.00000000e+00 * _959;
		float _962 = dy_944 + _961;
		dy_944 = _962;
		vec2 _963;
		float _964;
		float _965;
		_963 = UV;
		_964 = 1.50000000e+00;
		_965 = -1.50000000e+00;
		float _968 = F_xSUMTexture_lookup(_963, _964, _965);
		float _970 = -1.00000000e+00 * _968;
		float _971 = dy_944 + _970;
		dy_944 = _971;
		vec2 _972;
		float _973;
		float _974;
		_972 = UV;
		_973 = -1.50000000e+00;
		_974 = 1.50000000e+00;
		float _977 = F_xSUMTexture_lookup(_972, _973, _974);
		float _978 = dy_944 + _977;
		dy_944 = _978;
		vec2 _979;
		float _980;
		float _981;
		_979 = UV;
		_980 = 0.00000000e+00;
		_981 = 1.50000000e+00;
		float _984 = F_xSUMTexture_lookup(_979, _980, _981);
		float _986 = 2.00000000e+00 * _984;
		float _987 = dy_944 + _986;
		dy_944 = _987;
		vec2 _988;
		float _989;
		float _990;
		_988 = UV;
		_989 = 1.50000000e+00;
		_990 = 1.50000000e+00;
		float _993 = F_xSUMTexture_lookup(_988, _989, _990);
		float _994 = dy_944 + _993;
		dy_944 = _994;
		float _995 = dx_892 * dx_892;
		float _996 = dy_944 * dy_944;
		float _997 = _995 + _996;
		float _998 = sqrt(_997);
		float edge = _998;
		float _1000 = edge * edge;
		edge = _1000;
		float _1001 = atan(dx_892, dy_944);
		float angle = _1001;
		float _1003 = sin(angle);
		float _1004 = edge * _1003;
		float X = _1004;
		float _1007 = angle + 7.85398149e+00;
		float _1008 = sin(_1007);
		float _1009 = edge * _1008;
		float Y_1010 = _1009;
		float _1011 = X - Y_1010;
		float _1012 = edge * _1011;
		float Z_1013 = _1012;
		vec3 _1014 = vec3(X, Y_1010, Z_1013);
		float _1017 = mix(1.00000000e+00, Depth, V_xPCGI_2DTexture_Detail.y);
		vec3 _1019 = _1014 * vec3(_1017);
		vec3 _1020 = vec3(X, Y_1010, Z_1013);
		bvec3 _1022 = equal(_1020, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
		vec3 _1025 = mix(_1019, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_1022));
		vec3 _1027 = min(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _1025);
		return _1027;
	}
	else
	{
		return vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
}
vec3 F_xDepthNormals(
	in vec2 texcoord)
{
	vec2 Pix_Offset = vec2(5.20833360e-04, 9.25925910e-04);
	vec2 uv0 = texcoord;
	vec2 _1037 = vec2(Pix_Offset.x, 0.00000000e+00);
	vec2 _1038 = texcoord + _1037;
	vec2 uv1 = _1038;
	float _1041 = -(Pix_Offset.x);
	vec2 _1043 = vec2(_1041, 0.00000000e+00);
	vec2 _1044 = texcoord + _1043;
	vec2 uv2 = _1044;
	vec2 _1048 = vec2(0.00000000e+00, Pix_Offset.y);
	vec2 _1049 = texcoord + _1048;
	vec2 uv3 = _1049;
	float _1052 = -(Pix_Offset.y);
	vec2 _1054 = vec2(0.00000000e+00, _1052);
	vec2 _1055 = texcoord + _1054;
	vec2 uv4 = _1055;
	vec2 _1057;
	_1057 = uv0;
	float _1058 = F_xDepth_Info(_1057);
	float depth = _1058;
	vec2 _1060;
	_1060 = uv1;
	float _1061 = F_xDepth_Info(_1060);
	float depthR = _1061;
	vec2 _1063;
	_1063 = uv2;
	float _1064 = F_xDepth_Info(_1063);
	float depthL = _1064;
	vec2 _1066;
	_1066 = uv3;
	float _1067 = F_xDepth_Info(_1066);
	float depthD = _1067;
	vec2 _1069;
	_1069 = uv4;
	float _1070 = F_xDepth_Info(_1069);
	float depthU = _1070;
	vec3 P0 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 P1 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 P2 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _1078 = depthR - depth;
	float _1079 = abs(_1078);
	float _1080 = depthL - depth;
	float _1081 = abs(_1080);
	bool _1082 = _1079 < _1081;
	int _1085 = _1082 ? 1 : 2;
	int best_Z_horizontal = _1085;
	float _1087 = depthD - depth;
	float _1088 = abs(_1087);
	float _1089 = depthU - depth;
	float _1090 = abs(_1089);
	bool _1091 = _1088 < _1090;
	int _1094 = _1091 ? 3 : 4;
	int best_Z_vertical = _1094;
	bool _1100 = best_Z_horizontal == 1;
	bool _1102 = best_Z_vertical == 4;
	bool _1103 = _1100 && _1102;
	if (_1103)
	{
		vec2 _1105 = uv1 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1109 = vec3(_1105.x, _1105.y, 1.00000000e+00);
		vec3 _1111 = _1109 * vec3(depthR);
		P1 = _1111;
		vec2 _1113 = uv4 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1117 = vec3(_1113.x, _1113.y, 1.00000000e+00);
		vec3 _1119 = _1117 * vec3(depthU);
		P2 = _1119;
	}
	bool _1124 = best_Z_horizontal == 1;
	bool _1126 = best_Z_vertical == 3;
	bool _1127 = _1124 && _1126;
	if (_1127)
	{
		vec2 _1129 = uv3 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1133 = vec3(_1129.x, _1129.y, 1.00000000e+00);
		vec3 _1135 = _1133 * vec3(depthD);
		P1 = _1135;
		vec2 _1137 = uv1 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1141 = vec3(_1137.x, _1137.y, 1.00000000e+00);
		vec3 _1143 = _1141 * vec3(depthR);
		P2 = _1143;
	}
	bool _1148 = best_Z_horizontal == 2;
	bool _1150 = best_Z_vertical == 4;
	bool _1151 = _1148 && _1150;
	if (_1151)
	{
		vec2 _1153 = uv4 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1157 = vec3(_1153.x, _1153.y, 1.00000000e+00);
		vec3 _1159 = _1157 * vec3(depthU);
		P1 = _1159;
		vec2 _1161 = uv2 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1165 = vec3(_1161.x, _1161.y, 1.00000000e+00);
		vec3 _1167 = _1165 * vec3(depthL);
		P2 = _1167;
	}
	bool _1172 = best_Z_horizontal == 2;
	bool _1174 = best_Z_vertical == 3;
	bool _1175 = _1172 && _1174;
	if (_1175)
	{
		vec2 _1177 = uv2 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1181 = vec3(_1177.x, _1177.y, 1.00000000e+00);
		vec3 _1183 = _1181 * vec3(depthL);
		P1 = _1183;
		vec2 _1185 = uv3 - vec2(5.00000000e-01, 5.00000000e-01);
		vec3 _1189 = vec3(_1185.x, _1185.y, 1.00000000e+00);
		vec3 _1191 = _1189 * vec3(depthD);
		P2 = _1191;
	}
	vec2 _1193 = uv0 - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _1197 = vec3(_1193.x, _1193.y, 1.00000000e+00);
	vec3 _1199 = _1197 * vec3(depth);
	P0 = _1199;
	vec3 _1200 = P2 - P0;
	vec3 _1201 = P1 - P0;
	vec3 _1202 = cross(_1200, _1201);
	vec3 Normals_XYZ = _1202;
	vec3 _1204 = normalize(Normals_XYZ);
	vec3 _1206 = _1204 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _1208 = _1206 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _1209 = abs(_1208);
	vec3 Norm_XYZ = _1209;
	vec3 _1211 = dFdx(Norm_XYZ);
	vec3 DX = _1211;
	vec3 _1213 = dFdy(Norm_XYZ);
	vec3 DY = _1213;
	float DDX = 0.00000000e+00;
	float DDY = 0.00000000e+00;
	float _1219 = DDX + depthD;
	DDX = _1219;
	float _1220 = DDX + depthL;
	DDX = _1220;
	float _1221 = DDX + depth;
	DDX = _1221;
	float _1222 = DDY + depth;
	DDY = _1222;
	float _1223 = DDY + depthR;
	DDY = _1223;
	float _1224 = DDY + depthU;
	DDY = _1224;
	vec3 _1225 = DX * DX;
	vec3 _1226 = DY * DY;
	float _1227 = distance(_1225, _1226);
	bool _1229 = _1227 > 6.00000005e-03;
	float _1231 = clamp(float(_1229), 0.0, 1.0);
	float _1233 = 1.00000000e+00 - _1231;
	float N_Mask = _1233;
	float _1235 = DDX * DDX;
	float _1236 = DDY * DDY;
	float _1237 = distance(_1235, _1236);
	bool _1239 = _1237 > 2.89999992e-02;
	float _1241 = clamp(float(_1239), 0.0, 1.0);
	float _1243 = 1.00000000e+00 - _1241;
	float D_Mask = _1243;
	vec2 _1245;
	float _1246;
	_1245 = texcoord;
	_1246 = depth;
	vec3 _1247 = F_xTextureNormals(_1245, _1246);
	float _1248 = D_Mask + D_Mask;
	float _1249 = clamp(_1248, 0.0, 1.0);
	vec3 _1252 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), _1247, vec3(_1249));
	vec3 _1253 = Normals_XYZ + _1252;
	vec3 _1254 = normalize(_1253);
	return _1254;
}
vec3 F_xUnpackNormals(
	in vec2 enc)
{
	vec2 _1259 = enc * vec2(4.00000000e+00, 4.00000000e+00);
	vec2 _1261 = _1259 - vec2(2.00000000e+00, 2.00000000e+00);
	vec2 fenc = _1261;
	float _1263 = dot(fenc, fenc);
	float f = _1263;
	float _1266 = f / 4.00000000e+00;
	float _1268 = 1.00000000e+00 - _1266;
	float _1269 = sqrt(_1268);
	float g = _1269;
	vec3 n = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _1274 = fenc * vec2(g);
	n.xy = _1274;
	float _1276 = f / 2.00000000e+00;
	float _1278 = 1.00000000e+00 - _1276;
	n[2] = _1278;
	return n;
}
vec4 F_xNormals_Depth(
	in vec2 texcoords,
	in float Mips)
{
	vec4 _1286 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, Mips);
	vec4 _1287 = textureLod(V_xPCGIcurrNormalsDepth, _1286.xy, _1286.w);
	float Depth_1289 = _1287.z;
	vec4 _1293 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, Mips);
	vec4 _1294 = textureLod(V_xPCGIcurrNormalsDepth, _1293.xy, _1293.w);
	vec2 _1295;
	_1295 = _1294.xy;
	vec3 _1297 = F_xUnpackNormals(_1295);
	vec3 Normals = _1297;
	vec4 _1302 = vec4(Normals.x, Normals.y, Normals.z, Depth_1289);
	return _1302;
}
float F_xDepthMDC(
	in vec2 texcoords,
	in float Mips)
{
	vec2 _1307;
	float _1308;
	_1307 = texcoords;
	_1308 = Mips;
	vec4 _1309 = F_xNormals_Depth(_1307, _1308);
	float _1313 = smoothstep(0.00000000e+00, 1.00000000e+00, _1309.w);
	bool _1315 = _1313 > 9.99000013e-01;
	return float(_1315);
}
vec2 F_xVogel2D(
	in int uIndex,
	in int nTaps,
	in float phi)
{
	float _1323 = sqrt(5.00000000e+00);
	float _1325 = 3.00000000e+00 - _1323;
	float _1327 = 3.14159274e+00 * _1325;
	float GoldenAngle = _1327;
	float _1331 = float(uIndex) + 5.00000000e-01;
	float _1332 = sqrt(_1331);
	float _1334 = sqrt(float(nTaps));
	float _1335 = _1332 / _1334;
	float r = _1335;
	float _1338 = float(uIndex) * GoldenAngle;
	float _1339 = _1338 + phi;
	float theta = _1339;
	vec2 sc = vec2(0.00000000e+00, 0.00000000e+00);
	float _1343;
	float _1344;
	_1343 = sin(theta), _1344 = cos(theta);
	sc[0] = _1343;
	sc[1] = _1344;
	vec2 _1348 = vec2(r) * sc.yx;
	return _1348;
}
vec4 F_xUblur(
	in sampler2D Tex,
	in vec2 TC,
	in int Mip,
	in float Radius)
{
	vec2 _1357 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(Radius);
	vec2 ps = _1357;
	float _1359;
	vec2 _1360;
	float _1361;
	_1359 = 1.00000000e+00;
	_1360 = TC;
	_1361 = 1.00000000e+00;
	float _1364 = F_xMCNoise(_1359, _1360, _1361);
	float _1366 = _1364 * 6.28318548e+00;
	float urand = _1366;
	vec4 uImage = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int i = 0;
	while (i < 8)
	{
		{
			int _1382;
			int _1383;
			float _1384;
			_1382 = i;
			_1383 = 8;
			_1384 = urand;
			vec2 _1386 = F_xVogel2D(_1382, _1383, _1384);
			vec2 ofs = _1386;
			vec2 _1388 = ofs * ps;
			vec2 _1389 = TC + _1388;
			vec4 _1394 = vec4(_1389.x, _1389.y, 0.00000000e+00, float(Mip));
			vec4 _1395 = textureLod(Tex, _1394.xy, _1394.w);
			vec4 uColor = _1395.xyzw;
			int _1399 = i + 1;
			float _1401 = 1.0 / float(_1399);
			vec4 _1403 = mix(uImage, uColor, vec4(_1401));
			uImage = _1403;
		}
		int _1380 = i;
		int _1381 = _1380 + 1;
		i = _1381;
	}
	return uImage;
}
vec4 F_xDenoise(
	in sampler2D Tex,
	in vec2 texcoords,
	in int SXY,
	in int Dir,
	in float R)
{
	vec2 _1411;
	float _1412;
	_1411 = texcoords;
	_1412 = 0.00000000e+00;
	vec4 _1414 = F_xNormals_Depth(_1411, _1412);
	vec4 StoredNormals_Depth = _1414;
	vec4 _1416 = texture(Tex, texcoords);
	vec4 center = _1416;
	vec4 color_1419 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float total = 0.00000000e+00;
	bool _1423 = V_xDebug == 1;
	float _1426 = _1423 ? 2.50000000e-01 : 1.00000000e+00;
	float NormalBlurFactor = _1426;
	float DepthBlurFactor = 1.09999999e-02;
	float _1433 = smoothstep(0.00000000e+00, 1.00000000e+00, StoredNormals_Depth.w);
	bool _1435 = _1433 > 9.99000013e-01;
	float DM = float(_1435);
	vec4 _1442 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _1443 = textureLod(V_xPCGIcurrNormalsDepth, _1442.xy, _1442.w);
	float _1446 = 1.00000000e+00 - _1443.w;
	float _1447 = R + _1446;
	R = _1447;
	bool _1452 = SXY > 0;
	if (_1452)
	{
		int _1453 = -(SXY);
		float _1456 = float(_1453) * 5.00000000e-01;
		int i_1458 = int(_1456);
		float _1466 = float(SXY) * 5.00000000e-01;
		bool _1468 = float(i_1458) <= _1466;
		while (_1468)
		{
			{
				vec2 _1473 = vec2(float(i_1458), 0.00000000e+00);
				vec2 _1476 = vec2(0.00000000e+00, float(i_1458));
				vec2 _1478 = compCond(bvec2(ivec2(Dir)), _1473, _1476);
				vec2 D_1479 = _1478;
				vec2 _1481 = D_1479 * vec2(R);
				vec2 _1483 = _1481 * vec2(5.20833360e-04, 9.25925910e-04);
				vec2 _1484 = texcoords + _1483;
				vec2 TC_1485 = _1484;
				vec2 _1486;
				float _1487;
				_1486 = TC_1485;
				_1487 = 2.00000000e+00;
				vec4 _1489 = F_xNormals_Depth(_1486, _1487);
				vec4 ModifiedNormals_Depth = _1489;
				vec3 _1493 = StoredNormals_Depth.xyz - ModifiedNormals_Depth.xyz;
				float _1494 = length(_1493);
				float ModN = _1494;
				float _1498 = StoredNormals_Depth.w - ModifiedNormals_Depth.w;
				float _1499 = clamp(_1498, 0.0, 1.0);
				float ModD = _1499;
				float _1502 = max(ModD, 0.00000000e+00);
				float D_Dist2 = _1502;
				float _1504 = -(D_Dist2);
				float _1505 = _1504 / DepthBlurFactor;
				float _1506 = exp(_1505);
				float _1508 = min(_1506, 1.00000000e+00);
				float d_w = _1508;
				float _1511 = max(ModN, 0.00000000e+00);
				float N_Dist2 = _1511;
				float _1513 = -(N_Dist2);
				float _1514 = _1513 / NormalBlurFactor;
				float _1515 = exp(_1514);
				float _1517 = min(_1515, 1.00000000e+00);
				float n_w = _1517;
				float _1520 = sqrt(float(SXY));
				float _1521;
				float _1522;
				_1521 = float(i_1458);
				_1522 = _1520;
				float _1524 = F_xgaussian(_1521, _1522);
				float Weight = _1524;
				float _1526 = Weight * d_w;
				Weight = _1526;
				float _1527 = Weight * n_w;
				Weight = _1527;
				vec4 _1532 = vec4(TC_1485.x, TC_1485.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _1533 = textureLod(Tex, _1532.xy, _1532.w);
				vec4 _1535 = _1533 * vec4(Weight);
				vec4 _1536 = color_1419 + _1535;
				color_1419 = _1536;
				float _1537 = total + Weight;
				total = _1537;
			}
			int _1470 = i_1458 + 1;
			i_1458 = _1470;
			float _1466 = float(SXY) * 5.00000000e-01;
			_1468 = float(i_1458) <= _1466;
		}
	}
	bool _1539 = V_xSamplesXY > 0;
	vec4 _1541 = color_1419 / vec4(total);
	vec4 _1543 = mix(_1541, center, vec4(DM));
	vec4 _1545 = compCond(bvec4(_1539), _1543, center);
	return _1545;
}
vec4 F_xBBColor(
	in vec2 texcoords,
	in int Mips)
{
	float LL_Comp = 5.00000000e-01;
	vec4 _1556 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, float(Mips));
	vec4 _1557 = textureLod(V_xPCGIcurrColor, _1556.xy, _1556.w);
	vec4 BBC = _1557.xyzw;
	ivec2 _1560 = F_xSky_Emissive_Bool();
	vec2 _1561;
	float _1562;
	_1561 = texcoords;
	_1562 = 0.00000000e+00;
	float _1564 = F_xDepthMDC(_1561, _1562);
	float _1566 = 1.00000000e+00 - _1564;
	vec3 _1569 = BBC.xyz * vec3(_1566);
	vec3 _1572 = compCond(bvec3(ivec3(_1560.x)), BBC.xyz, _1569);
	BBC.xyz = _1572;
	return BBC;
}
vec4 F_xDirectLighting(
	in vec2 texcoords,
	in int Mips)
{
	vec2 _1577;
	float _1578;
	_1577 = texcoords;
	_1578 = 0.00000000e+00;
	float _1580 = F_xDepthMDC(_1577, _1578);
	float MDC = _1580;
	int _1583 = min(6, V_xSky_Adustment);
	float _1587 = mix(float(Mips), _1584[int(_1583)], MDC);
	float Sky_Quality = _1587;
	vec2 _1589;
	int _1590;
	_1589 = texcoords;
	_1590 = int(Sky_Quality);
	vec4 _1592 = F_xBBColor(_1589, _1590);
	vec4 BC = _1592;
	bool _1598 = V_xHDR_BP > 0.00000000e+00;
	if (_1598)
	{
		float _1600 = 1.00000000e+00 - V_xHDR_BP;
		vec4 _1604 = vec4(BC.xyz.x, BC.xyz.y, BC.xyz.z, _1600);
		vec4 _1605;
		_1605 = _1604;
		vec3 _1606 = F_xinv_Tonemapper(_1605);
		BC.xyz = _1606;
	}
	vec3 _1607;
	_1607 = BC.xyz;
	float _1609 = F_xLuma(_1607);
	float GS = _1609;
	float Boost = 1.00000000e+00;
	bool _1617 = V_xTarget_Lighting >= 0.00000000e+00;
	if (_1617)
	{
		vec3 _1620 = BC.xyz / vec3(GS);
		BC.xyz = _1620;
		float _1621 = clamp(V_xTarget_Lighting, 0.0, 1.0);
		float _1624 = mix(0.00000000e+00, 5.00000000e-01, _1621);
		float _1625 = GS - _1624;
		float _1626 = clamp(_1625, 0.0, 1.0);
		vec3 _1629 = BC.xyz * vec3(_1626);
		BC.xyz = _1629;
	}
	else
	{
		float _1631 = 1.00000000e+00 - GS;
		vec3 _1634 = BC.xyz / vec3(_1631);
		BC.xyz = _1634;
		float _1635 = abs(V_xTarget_Lighting);
		float _1636 = clamp(_1635, 0.0, 1.0);
		float _1639 = mix(0.00000000e+00, 5.00000000e-01, _1636);
		float _1640 = GS + _1639;
		float _1641 = clamp(_1640, 0.0, 1.0);
		float _1643 = 1.00000000e+00 - _1641;
		vec3 _1646 = BC.xyz * vec3(_1643);
		BC.xyz = _1646;
	}
	float _1647 = abs(V_xTarget_Lighting);
	float _1648 = clamp(_1647, 0.0, 1.0);
	float _1651 = mix(1.00000000e+00, 2.50000000e+00, _1648);
	Boost = _1651;
	vec3 _1654 = BC.xyz * vec3(Boost);
	vec2 _1655;
	float _1656;
	_1655 = texcoords;
	_1656 = 0.00000000e+00;
	float _1658 = F_xDepthMDC(_1655, _1656);
	vec2 _1659;
	float _1660;
	_1659 = texcoords;
	_1660 = 0.00000000e+00;
	vec4 _1662 = F_xNormals_Depth(_1659, _1660);
	vec3 _1663;
	float _1664;
	float _1665;
	_1663 = _1654;
	_1664 = _1658;
	_1665 = _1662.w;
	vec3 _1667 = F_xSaturator_A(_1663, _1664, _1665);
	vec4 _1672 = vec4(_1667.x, _1667.y, _1667.z, BC.w);
	return _1672;
}
vec3 F_xGetPosition(
	in vec2 texcoord)
{
	vec2 _1676;
	float _1677;
	_1676 = texcoord;
	_1677 = 0.00000000e+00;
	vec4 _1679 = F_xNormals_Depth(_1676, _1677);
	vec3 _1681 = -(_1679.www);
	vec3 DM_1682 = _1681;
	vec2 _1685 = texcoord.xy * vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _1687 = _1685 - vec2(1.00000000e+00, 1.00000000e+00);
	vec3 _1691 = vec3(_1687.x, _1687.y, 1.00000000e+00);
	vec3 _1692 = _1691 * DM_1682;
	return _1692;
}
float F_xGetPos()
{
	int _1695 = F_xT_02();
	bool _1697 = _1695 == 25000;
	int _1700 = _1697 ? 0 : 1;
	float Postional_Information = float(_1700);
	return Postional_Information;
}
vec2 F_xMultiPattern(
	in vec2 TC)
{
	float _1708 = TC.x * 1.92000000e+03;
	float _1711 = TC.y * 1.08000000e+03;
	vec2 _1712 = vec2(_1708, _1711);
	vec2 _1713 = floor(_1712);
	vec2 Grid = _1713;
	float _1717 = Grid.x + Grid.y;
	float _1718;
	float _1719;
	_1718 = _1717;
	_1719 = 2.00000000e+00;
	float _1721 = F_xfmod(_1718, _1719);
	float _1722;
	float _1723;
	_1722 = Grid.x;
	_1723 = 2.00000000e+00;
	float _1726 = F_xfmod(_1722, _1723);
	vec2 _1727 = vec2(_1721, _1726);
	return _1727;
}
vec2 F_xRotate2D_A(
	in vec2 r,
	in float l,
	in vec2 TC)
{
	float _1733 = F_xReflect();
	float _1734 = abs(_1733);
	float _1735 = clamp(_1734, 0.0, 1.0);
	vec2 _1736;
	float _1737;
	_1736 = TC;
	_1737 = 0.00000000e+00;
	vec4 _1739 = F_xNormals_Depth(_1736, _1737);
	float _1742 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), _1739.xyz);
	float _1744 = 1.00000000e+00 - _1742;
	float _1747 = smoothstep(0.00000000e+00, 2.50000000e-01, _1744);
	float _1749 = mix(_1735, 1.00000000e+00, _1747);
	float Reflective_Diffusion = _1749;
	vec2 Directions = vec2(0.00000000e+00, 0.00000000e+00);
	float _1753;
	float _1754;
	_1753 = sin(l), _1754 = cos(l);
	Directions[0] = _1753;
	Directions[1] = _1754;
	float _1756 = F_xReflect();
	bool _1758 = _1756 < 0.00000000e+00;
	vec2 _1761 = TC.xy * vec2(V_xGI_Res);
	vec2 _1762;
	_1762 = _1761;
	vec2 _1763 = F_xMultiPattern(_1762);
	float _1766 = bool(_1763.y) ? 1.00000000e+00 : Reflective_Diffusion;
	float _1767 = _1758 ? Reflective_Diffusion : _1766;
	Reflective_Diffusion = _1767;
	vec2 _1769 = r * vec2(Reflective_Diffusion);
	float _1771 = -(Directions.x);
	vec2 _1773 = vec2(Directions.y, _1771);
	float _1774 = dot(_1769, _1773);
	float _1776 = dot(r, Directions.xy);
	vec2 _1777 = vec2(_1774, _1776);
	return _1777;
}
vec2 F_xRotate2D_B(
	in vec2 r,
	in float l)
{
	vec2 Directions_1783 = vec2(0.00000000e+00, 0.00000000e+00);
	float _1784;
	float _1785;
	_1784 = sin(l), _1785 = cos(l);
	Directions_1783[0] = _1784;
	Directions_1783[1] = _1785;
	float _1788 = -(Directions_1783.x);
	vec2 _1790 = vec2(Directions_1783.y, _1788);
	float _1791 = dot(r, _1790);
	float _1793 = dot(r, Directions_1783.xy);
	vec2 _1794 = vec2(_1791, _1793);
	return _1794;
}
float F_xSSSMasking(
	in vec2 TC)
{
	vec2 _1798;
	float _1799;
	_1798 = TC;
	_1799 = 0.00000000e+00;
	vec4 _1801 = F_xNormals_Depth(_1798, _1799);
	float _1804 = mix(1.00000000e+00, 1.00000000e+01, V_xSSS_Seek);
	float _1806 = _1801.w * _1804;
	float _1808 = 1.00000000e+00 - _1806;
	float _1809 = clamp(_1808, 0.0, 1.0);
	float _1812 = mix(0.00000000e+00, 1.00000000e+00, _1809);
	float SSSD = _1812;
	vec2 _1814;
	float _1815;
	_1814 = TC;
	_1815 = 0.00000000e+00;
	vec4 _1817 = F_xNormals_Depth(_1814, _1815);
	float _1820 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), _1817.xyz);
	vec2 _1821;
	float _1822;
	_1821 = TC;
	_1822 = 0.00000000e+00;
	vec4 _1824 = F_xNormals_Depth(_1821, _1822);
	float _1827 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), _1824.xyz);
	float _1828 = clamp(_1827, 0.0, 1.0);
	float _1829 = _1820 * _1828;
	float _1831 = 1.00000000e+00 - _1829;
	float _1834 = smoothstep(0.00000000e+00, 2.50000000e-01, _1831);
	float _1835 = SSSD * _1834;
	return _1835;
}
float F_xRadianceFF(
	in vec2 texcoord,
	in vec3 ddiff,
	in vec3 normals,
	in vec2 AB,
	in float STDepth)
{
	vec3 _1843 = normalize(ddiff);
	float _1844 = length(ddiff);
	vec4 _1848 = vec4(_1843.x, _1843.y, _1843.z, _1844);
	vec4 v = _1848;
	float _1850 = F_xReflect();
	float _1851 = abs(_1850);
	bool _1853 = _1851 < 1.00000000e+00;
	float _1855 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), normals);
	float _1856 = clamp(_1855, 0.0, 1.0);
	float _1859 = mix(3.00000000e+00, 0.00000000e+00, _1856);
	float _1861 = _1853 ? _1859 : 3.00000000e+00;
	float Mnormals = _1861;
	float _1863 = clamp(V_xTrim, 0.0, 1.0);
	float _1866 = mix(1.00000000e+00, 5.00000000e+03, _1863);
	float Trimming = _1866;
	ivec2 _1868 = F_xSky_Emissive_Bool();
	vec3 _1871 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - v.xyz;
	vec2 _1872 = texcoord + AB;
	vec2 _1873;
	float _1874;
	_1873 = _1872;
	_1874 = Mnormals;
	vec4 _1875 = F_xNormals_Depth(_1873, _1874);
	vec3 _1878 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _1875.xyz;
	float _1879 = dot(_1871, _1878);
	vec3 _1881 = -(v.xyz);
	vec2 _1882 = texcoord + AB;
	vec2 _1883;
	float _1884;
	_1883 = _1882;
	_1884 = Mnormals;
	vec4 _1885 = F_xNormals_Depth(_1883, _1884);
	float _1887 = dot(_1881, _1885.xyz);
	float _1889 = bool(_1868.y) ? _1879 : _1887;
	float giE_Selection = _1889;
	float _1892 = step(0.00000000e+00, giE_Selection);
	float _1894 = dot(v.xyz, normals);
	vec2 _1895 = vec2(_1892, _1894);
	vec2 _1897 = max(_1895, vec2(0.00000000e+00, 0.00000000e+00));
	vec2 giE_R = _1897;
	ivec2 _1899 = F_xSky_Emissive_Bool();
	float _1903 = bool(_1899.y) ? 6.28318558e+01 : 3.14159279e+01;
	float FF_Dampen = _1903;
	float _1907 = 1.00000000e+02 * giE_R.x;
	float _1909 = _1907 * giE_R.y;
	ivec2 _1910 = F_xSky_Emissive_Bool();
	float _1912 = STDepth * float(_1910.x);
	float _1914 = mix(Trimming, 1.00000000e+00, _1912);
	float _1917 = v.w * v.w;
	float _1918 = _1914 * _1917;
	float _1919 = _1918 + FF_Dampen;
	float _1920 = _1909 / _1919;
	float _1921 = clamp(_1920, 0.0, 1.0);
	return _1921;
}
float F_xSubsurfaceScatteringFF(
	in vec2 texcoord,
	in vec3 ddiff,
	in vec3 normals,
	in vec2 AB)
{
	vec3 _1928 = normalize(ddiff);
	float _1929 = length(ddiff);
	vec4 _1933 = vec4(_1928.x, _1928.y, _1928.z, _1929);
	vec4 v_1934 = _1933;
	float LW = V_xWrap;
	vec3 _1937 = -(v_1934.xyz);
	vec2 _1938 = texcoord + AB;
	vec2 _1939;
	float _1940;
	_1939 = _1938;
	_1940 = 0.00000000e+00;
	vec4 _1942 = F_xNormals_Depth(_1939, _1940);
	float _1944 = dot(_1937, _1942.xyz);
	float _1946 = max(0.00000000e+00, _1944);
	float _1948 = dot(v_1934.xyz, normals);
	float _1949 = _1948 + LW;
	float _1951 = max(0.00000000e+00, _1949);
	float _1953 = 1.00000000e+00 + LW;
	float _1954 = _1951 / _1953;
	vec2 _1955 = vec2(_1946, _1954);
	vec2 _1956 = clamp(_1955, 0.0, 1.0);
	vec2 ssE_R = _1956;
	float _1960 = 1.00000000e+02 * ssE_R.x;
	float _1962 = _1960 * ssE_R.y;
	float _1965 = 3.14159274e+00 * v_1934.w;
	float _1967 = _1965 * v_1934.w;
	float _1969 = _1967 + 1.00000000e+00;
	float _1970 = _1962 / _1969;
	float _1971 = clamp(_1970, 0.0, 1.0);
	float Scatter = _1971;
	return Scatter;
}
float F_xThiccnessFF(
	in vec2 texcoord,
	in vec3 ddiff,
	in vec3 normals,
	in vec2 AB)
{
	vec3 _1979 = normalize(ddiff);
	float _1980 = length(ddiff);
	vec4 _1984 = vec4(_1979.x, _1979.y, _1979.z, _1980);
	vec4 v_1985 = _1984;
	vec2 _1986 = texcoord + AB;
	vec2 _1987;
	float _1988;
	_1987 = _1986;
	_1988 = 1.00000000e+00;
	vec4 _1990 = F_xNormals_Depth(_1987, _1988);
	vec3 _1992 = -(_1990.xyz);
	float _1994 = dot(_1992, v_1985.xyz);
	float _1996 = 1.00000000e+00 - _1994;
	vec3 _1998 = -(v_1985.xyz);
	float _1999 = dot(normals, _1998);
	vec2 _2000 = vec2(_1996, _1999);
	vec2 fE_R = _2000;
	float _2004 = fE_R.x * fE_R.y;
	float _2007 = v_1985.w * v_1985.w;
	float _2008 = 1.0 / _2007;
	float _2010 = _2008 + 3.14159274e+00;
	float _2011 = sqrt(_2010);
	float _2013 = 1.00000000e+00 / _2011;
	float _2015 = 1.00000000e+00 - _2013;
	float _2016 = _2004 * _2015;
	float _2018 = min(1.00000000e+00, _2016);
	float Thicc = _2018;
	return Thicc;
}
int F_xnonplus()
{
	int _2022 = F_xT_01();
	bool _2024 = _2022 == 0;
	int _2025 = F_xT_02();
	bool _2027 = _2025 == 0;
	bool _2028 = _2024 || _2027;
	int _2031 = _2028 ? 1 : 0;
	return _2031;
}
void F_xPCGI(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 GlobalIllumination,
	out vec4 SubsurfaceScattering)
{
	vec2 stexcoords = texcoords;
	vec2 _2040 = texcoords / vec2(V_xGI_Res);
	texcoords = _2040;
	vec4 _2045 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _2046 = textureLod(V_xPCGIcurrNormalsDepth, _2045.xy, _2045.w);
	float _2049 = 1.00000000e+00 - _2046.w;
	float _2051 = mix(V_xsamples, 4.00000000e+00, _2049);
	int Samples = int(_2051);
	vec2 _2054;
	float _2055;
	_2054 = texcoords;
	_2055 = 0.00000000e+00;
	vec4 _2057 = F_xNormals_Depth(_2054, _2055);
	float depth_2059 = _2057.w;
	float D_2060 = depth_2059;
	float _2061;
	vec2 _2062;
	float _2063;
	_2061 = float(V_xframecount);
	_2062 = stexcoords;
	_2063 = 1.00000000e+00;
	float _2066 = F_xMCNoise(_2061, _2062, _2063);
	float _2067;
	vec2 _2068;
	float _2069;
	_2067 = float(V_xframecount);
	_2068 = stexcoords;
	_2069 = 2.00000000e+00;
	float _2072 = F_xMCNoise(_2067, _2068, _2069);
	float _2073;
	vec2 _2074;
	float _2075;
	_2073 = float(V_xframecount);
	_2074 = stexcoords;
	_2075 = 3.00000000e+00;
	float _2078 = F_xMCNoise(_2073, _2074, _2075);
	float _2079;
	vec2 _2080;
	float _2081;
	_2079 = float(V_xframecount);
	_2080 = stexcoords;
	_2081 = 4.00000000e+00;
	float _2084 = F_xMCNoise(_2079, _2080, _2081);
	vec4 _2085 = vec4(_2066, _2072, _2078, _2084);
	vec4 Noise = _2085;
	vec4 _2089 = Noise.xyzw * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _2091 = _2089 - vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec4 _2092 = normalize(_2091);
	vec4 random = _2092;
	vec4 GI = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 SS = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 PWH = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _2100;
	float _2101;
	_2100 = texcoords;
	_2101 = 0.00000000e+00;
	vec4 _2103 = F_xNormals_Depth(_2100, _2101);
	vec3 n_2105 = _2103.xyz;
	vec2 _2106;
	_2106 = texcoords;
	vec3 _2107 = F_xGetPosition(_2106);
	vec3 _2109 = _2107 * vec3(9.90000010e-01, 9.90000010e-01, 9.90000010e-01);
	vec3 p = _2109;
	vec3 ddiff_2112 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 ddiff_tc = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 ddiff_gi = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 ddiff_gd = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 ddiff_ss = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 II_gi = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 II_gd = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 II_ss = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _2127 = F_xGIRL();
	vec2 _2128 = F_xGIRL();
	float _2131 = mix(1.00000000e+00, 1.25000000e+02, V_xDeep_Scattering);
	vec4 _2135 = vec4(_2127.x, _2128.y, 7.50000000e+01, _2131);
	vec4 rl_gi_sss = _2135;
	vec2 _2137;
	_2137 = stexcoords.xy;
	vec2 _2139 = F_xMultiPattern(_2137);
	float CB0 = _2139.x;
	vec4 _2146 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 2.00000000e+00);
	vec4 _2147 = textureLod(V_xPCGIcurrColor, _2146.xy, _2146.w);
	vec4 _2148;
	_2148 = _2147;
	float _2149 = F_xSkinDetection(_2148);
	bool _2152 = bool(CB0) || bool(_2149);
	int _2155 = V_xScattering ? int(_2152) : 1;
	float CB1 = float(_2155);
	vec2 _2158;
	_2158 = stexcoords.xy;
	vec2 _2160 = F_xMultiPattern(_2158);
	float _2163 = fmodHLSL(float(V_xframecount), 2.00000000e+00);
	bool _2165 = _2163 == 0.00000000e+00;
	float _2168 = _2165 ? 1.00000000e+00 : 5.00000000e-01;
	float _2171 = fmodHLSL(float(V_xframecount), 2.00000000e+00);
	bool _2173 = _2171 == 0.00000000e+00;
	float _2176 = _2173 ? 5.00000007e-02 : 1.00000001e-01;
	float _2178 = bool(_2160.y) ? _2168 : _2176;
	vec2 _2181 = rl_gi_sss.xy * vec2(_2178);
	rl_gi_sss.xy = _2181;
	vec2 _2182;
	float _2183;
	_2182 = texcoords;
	_2183 = 0.00000000e+00;
	vec4 _2185 = F_xNormals_Depth(_2182, _2183);
	float _2188 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), _2185.xyz);
	float _2189 = clamp(_2188, 0.0, 1.0);
	float MaskDir = _2189;
	float _2193 = V_xReflectivness.y * 2.00000000e+00;
	float _2194 = F_xReflect();
	float _2195 = abs(_2194);
	float _2197 = mix(_2193, 1.00000000e+00, _2195);
	float _2199 = mix(1.00000000e+00, _2197, MaskDir);
	float Diffusion = _2199;
	float _2201 = F_xReflect();
	bool _2203 = _2201 < 0.00000000e+00;
	vec2 _2204;
	_2204 = stexcoords.xy;
	vec2 _2206 = F_xMultiPattern(_2204);
	float _2209 = bool(_2206.y) ? 1.00000000e+00 : Diffusion;
	float _2210 = _2203 ? Diffusion : _2209;
	vec2 _2213 = rl_gi_sss.xy * vec2(_2210);
	rl_gi_sss.xy = _2213;
	float _2215 = -(V_xNCD.x);
	float _2217 = smoothstep(_2215, 1.00000000e+00, depth_2059);
	float D0 = _2217;
	float _2221 = smoothstep(-1.00000000e+00, 1.00000000e+00, depth_2059);
	float D1 = _2221;
	bool _2224 = V_xPCGI_Fade < 0.00000000e+00;
	float _2225 = F_xScale_PCGI_Fade();
	float _2227 = _2225 * 2.00000000e+00;
	float _2229 = 1.00000000e+00 - _2227;
	float _2231 = 1.00000000e+00 - D_2060;
	float _2233 = mix(_2229, 0.00000000e+00, _2231);
	float _2234 = F_xScale_PCGI_Fade();
	float _2235 = D_2060 / _2234;
	float _2238 = smoothstep(0.00000000e+00, 2.00000000e+00, _2235);
	float _2239 = _2224 ? _2233 : _2238;
	float D_Fade = _2239;
	float _2243 = smoothstep(0.00000000e+00, 1.00000000e+00, D_2060);
	bool _2245 = _2243 > 9.99000013e-01;
	float MDCutOff = float(_2245);
	vec2 _2249 = stexcoords / vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _2251 = _2249 / vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _2252;
	_2252 = _2251;
	float _2253 = F_xInterleaved_Gradient_Noise(_2252);
	float _2255 = _2253 * 2.00000000e+00;
	float _2257 = _2255 - 1.00000000e+00;
	vec4 _2260 = compCond(bvec4(V_xIGN_Toggle), vec4(_2257), random);
	vec4 IGN = _2260;
	int i_2263 = 0;
	while (i_2263 <= Samples)
	{
		{
			bool _2277 = V_xclock == 0.00000000e+00;
			bool _2279 = bool(MDCutOff) || _2277;
			bool _2282 = texcoords.x > 1.00000000e+00;
			bool _2283 = _2279 || _2282;
			bool _2286 = texcoords.y > 1.00000000e+00;
			bool _2287 = _2283 || _2286;
			if (_2287)
			{
				break;
			}
			vec2 _2290 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(rl_gi_sss.x);
			vec2 _2292 = _2290 * vec2(IGN.x);
			vec2 _2294;
			float _2295;
			vec2 _2296;
			_2294 = _2293[int(i_2263)];
			_2295 = random.w;
			_2296 = texcoords;
			vec2 _2299 = F_xRotate2D_A(_2294, _2295, _2296);
			vec2 _2300 = _2292 * _2299;
			vec2 _2302 = _2300 / vec2(D0);
			vec2 GIWH = _2302;
			vec2 _2306 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(rl_gi_sss.z);
			vec2 _2308 = _2306 * vec2(IGN.z);
			vec2 _2310;
			float _2311;
			_2310 = _2293[int(i_2263)];
			_2311 = random.y;
			vec2 _2314 = F_xRotate2D_B(_2310, _2311);
			vec2 _2315 = _2308 * _2314;
			vec2 _2317 = _2315 / vec2(D1);
			vec2 SSWH = _2317;
			vec2 _2321 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(rl_gi_sss.w);
			vec2 _2323 = _2321 * vec2(IGN.w);
			vec2 _2325;
			float _2326;
			_2325 = _2293[int(i_2263)];
			_2326 = random.x;
			vec2 _2329 = F_xRotate2D_B(_2325, _2326);
			vec2 _2330 = _2323 * _2329;
			vec2 _2332 = _2330 / vec2(D1);
			vec2 TCWH = _2332;
			vec2 _2334 = texcoords + TCWH;
			vec2 _2335;
			_2335 = _2334;
			vec3 _2336 = F_xGetPosition(_2335);
			vec3 _2337 = _2336 - p;
			ddiff_tc = _2337;
			bool _2342 = !bool(bool(CB1));
			if (_2342)
			{
				vec2 _2343;
				vec3 _2344;
				vec3 _2345;
				vec2 _2346;
				_2343 = texcoords;
				_2344 = ddiff_tc;
				_2345 = n_2105;
				_2346 = TCWH;
				float _2347 = F_xThiccnessFF(_2343, _2344, _2345, _2346);
				vec2 _2348;
				_2348 = texcoords;
				float _2349 = F_xSSSMasking(_2348);
				float _2351 = mix(0.00000000e+00, _2347, _2349);
				float _2353 = SS.w + _2351;
				SS[3] = _2353;
			}
			if (bool(CB0))
			{
				vec2 _2358 = texcoords + GIWH;
				vec2 _2359;
				_2359 = _2358;
				vec3 _2360 = F_xGetPosition(_2359);
				vec3 _2361 = _2360 - p;
				ddiff_gi = _2361;
				vec2 _2362 = texcoords + GIWH;
				vec2 _2363;
				int _2364;
				_2363 = _2362;
				_2364 = 3;
				vec4 _2366 = F_xDirectLighting(_2363, _2364);
				vec3 _2369 = _2366.xyz * vec3(1.12500000e+00, 1.12500000e+00, 1.12500000e+00);
				II_gi = _2369;
				vec3 _2372 = mix(II_gi, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(D_Fade));
				float _2375 = smoothstep(1.00000000e+00, 0.00000000e+00, D_2060);
				vec2 _2376;
				vec3 _2377;
				vec3 _2378;
				vec2 _2379;
				float _2380;
				_2376 = texcoords;
				_2377 = ddiff_gi;
				_2378 = n_2105;
				_2379 = GIWH;
				_2380 = _2375;
				float _2381 = F_xRadianceFF(_2376, _2377, _2378, _2379, _2380);
				vec3 _2383 = _2372 * vec3(_2381);
				vec3 _2385 = GI.xyz + _2383;
				GI.xyz = _2385;
			}
			bool _2390 = !bool(bool(CB1));
			if (_2390)
			{
				vec2 _2391 = texcoords + SSWH;
				vec2 _2392;
				_2392 = _2391;
				vec3 _2393 = F_xGetPosition(_2392);
				vec3 _2394 = _2393 - p;
				ddiff_ss = _2394;
				vec2 _2395 = texcoords + SSWH;
				vec2 _2396;
				int _2397;
				_2396 = _2395;
				_2397 = 3;
				vec4 _2399 = F_xBBColor(_2396, _2397);
				II_ss = _2399.xyz;
				vec3 _2403 = mix(II_ss, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(D_Fade));
				vec2 _2404;
				_2404 = texcoords;
				float _2405 = F_xSSSMasking(_2404);
				vec3 _2408 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), _2403, vec3(_2405));
				vec2 _2409;
				vec3 _2410;
				vec3 _2411;
				vec2 _2412;
				_2409 = texcoords;
				_2410 = ddiff_ss;
				_2411 = n_2105;
				_2412 = SSWH;
				float _2413 = F_xSubsurfaceScatteringFF(_2409, _2410, _2411, _2412);
				vec3 _2415 = _2408 * vec3(_2413);
				vec3 _2417 = SS.xyz + _2415;
				SS.xyz = _2417;
			}
		}
		int _2271 = i_2263;
		int _2272 = _2271 + 1;
		i_2263 = _2272;
	}
	float _2419 = 1.0 / float(Samples);
	float Samp = _2419;
	vec4 _2422 = GI * vec4(Samp);
	GI = _2422;
	vec4 _2424 = SS * vec4(Samp);
	SS = _2424;
	vec3 _2427 = min(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), GI.xyz);
	vec4 _2432 = vec4(_2427.x, _2427.y, _2427.z, GI.w);
	GlobalIllumination = _2432;
	float _2435 = SS.w * 2.00000000e+00;
	vec4 _2439 = vec4(SS.xyz.x, SS.xyz.y, SS.xyz.z, _2435);
	vec4 _2441 = min(vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _2439);
	SubsurfaceScattering = _2441;
	return;
}
vec4 F_xGI_Adjusted(
	in vec2 TC,
	in int Mip)
{
	vec4 _2450 = vec4(TC.x, TC.y, 0.00000000e+00, float(Mip));
	vec4 _2451 = textureLod(V_xPCGI_Info, _2450.xy, _2450.w);
	vec4 ConvertGI = _2451;
	vec4 _2457 = vec4(TC.x, TC.y, 0.00000000e+00, float(Mip));
	vec4 _2458 = textureLod(V_xPCSS_Info, _2457.xy, _2457.w);
	vec4 ConvertSS = _2458;
	vec3 _2460;
	_2460 = ConvertGI.xyz;
	vec3 _2462 = F_xRGBtoYCbCr(_2460);
	ConvertGI.xyz = _2462;
	float _2465 = ConvertGI.x * 7.50000000e-01;
	ConvertGI[0] = _2465;
	vec3 _2466;
	_2466 = ConvertGI.xyz;
	vec3 _2468 = F_xYCbCrtoRGB(_2466);
	vec3 _2469;
	_2469 = _2468;
	vec3 _2470 = F_xSaturator_C(_2469);
	ConvertGI.xyz = _2470;
	vec2 _2472 = TC / vec2(V_xGI_Res);
	vec2 _2473;
	int _2474;
	_2473 = _2472;
	_2474 = 6;
	vec4 _2476 = F_xBBColor(_2473, _2474);
	float _2479 = dot(_2476.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _2482 = mix(3.00000000e+00, 5.00000000e+00, _2479);
	float DTMip = _2482;
	vec2 _2485 = TC / vec2(V_xGI_Res);
	vec2 _2486;
	int _2487;
	_2486 = _2485;
	_2487 = int(DTMip);
	vec4 _2489 = F_xBBColor(_2486, _2487);
	float _2492 = _2489.w * 2.00000000e+00;
	float DT = _2492;
	float SSL = 1.00000000e+00;
	vec3 _2498 = ConvertSS.xyz * vec3(SSL);
	float _2501 = mix(0.00000000e+00, 1.00000000e+01, V_xLuma_Map);
	vec3 _2503 = clamp(V_xInternals.xyz, 0.0, 1.0);
	vec3 _2506 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_2501), _2503);
	vec3 _2507;
	float _2508;
	vec3 _2509;
	float _2510;
	_2507 = _2498;
	_2508 = ConvertSS.w;
	_2509 = _2506;
	_2510 = DT;
	vec3 _2512 = F_xInternalFleshColor(_2507, _2508, _2509, _2510);
	vec3 SSS_2513 = _2512;
	vec2 _2514;
	_2514 = TC;
	vec2 _2515 = F_xMultiPattern(_2514);
	float _2517 = min(V_xGI_Power, 5.00000000e+00);
	vec3 _2520 = ConvertGI.xyz * vec3(_2517);
	vec3 _2521;
	_2521 = SSS_2513;
	vec3 _2522 = F_xSaturator_B(_2521);
	vec3 _2524 = compCond(bvec3(vec3(_2515.x)), _2520, _2522);
	ConvertGI.xyz = _2524;
	vec4 _2529 = vec4(ConvertGI.xyz.x, ConvertGI.xyz.y, ConvertGI.xyz.z, 0.00000000e+00);
	return _2529;
}
void F_xCBReconstruction(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 UpGI)
{
	int MipLevel = 0;
	vec2 _2537;
	int _2538;
	_2537 = texcoords;
	_2538 = MipLevel;
	vec4 _2539 = F_xGI_Adjusted(_2537, _2538);
	vec4 tl = _2539;
	vec2 _2542 = texcoords + vec2(5.20833360e-04, 0.00000000e+00);
	vec2 _2543;
	int _2544;
	_2543 = _2542;
	_2544 = MipLevel;
	vec4 _2545 = F_xGI_Adjusted(_2543, _2544);
	vec4 tr = _2545;
	vec2 _2548 = texcoords + vec2(0.00000000e+00, 9.25925910e-04);
	vec2 _2549;
	int _2550;
	_2549 = _2548;
	_2550 = MipLevel;
	vec4 _2551 = F_xGI_Adjusted(_2549, _2550);
	vec4 bl = _2551;
	vec2 _2554 = texcoords + vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _2555;
	int _2556;
	_2555 = _2554;
	_2556 = MipLevel;
	vec4 _2557 = F_xGI_Adjusted(_2555, _2556);
	vec4 br = _2557;
	vec2 _2560 = texcoords * vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _2561 = fract(_2560);
	vec2 f_2562 = _2561;
	vec4 _2564 = mix(tl, tr, vec4(f_2562.x));
	vec4 tA = _2564;
	vec4 _2567 = mix(bl, br, vec4(f_2562.x));
	vec4 tB = _2567;
	vec4 _2570 = mix(tA, tB, vec4(f_2562.y));
	vec4 _2572 = _2570 * vec4(1.25000000e+00, 1.25000000e+00, 1.25000000e+00, 1.25000000e+00);
	UpGI = _2572;
	return;
}
vec3 F_xGI(
	in vec2 TC,
	in float Mips)
{
	vec2 _2578 = TC * vec2(V_xGI_Res);
	vec4 _2582 = vec4(_2578.x, _2578.y, 0.00000000e+00, Mips);
	vec4 _2583 = textureLod(V_xPCGIReconstruction_Info, _2582.xy, _2582.w);
	vec3 GI_Out = _2583.xyz;
	float _2586 = F_xGetPos();
	vec3 _2588 = GI_Out * TC.xyx;
	vec3 _2590 = compCond(bvec3(vec3(_2586)), _2588, GI_Out);
	return _2590;
}
float F_xHelper()
{
	int _2593 = F_xT_01();
	bool _2595 = _2593 == 12500;
	int _2598 = _2595 ? 0 : 1;
	float Temp_Location = float(_2598);
	return Temp_Location;
}
vec4 F_xGI_TAA(
	in vec4 vpos,
	in vec2 texcoords)
{
	float M_Similarity = 5.00000000e-01;
	vec4 _2607 = texture(V_xPCGIpastFrame, texcoords);
	vec2 _2608;
	float _2609;
	_2608 = texcoords;
	_2609 = 0.00000000e+00;
	vec4 _2611 = F_xNormals_Depth(_2608, _2609);
	float _2614 = _2607.x / _2611.w;
	float _2615 = abs(_2614);
	float _2617 = pow(_2615, 1.00000000e+01);
	float _2618 = _2617 + M_Similarity;
	float _2619 = clamp(_2618, 0.0, 1.0);
	float D_Similarity = _2619;
	float _2621;
	float _2622;
	float _2623;
	_2621 = V_xGI_Res;
	_2622 = 1.00000000e+00;
	_2623 = 5.00000000e-01;
	float _2626 = F_xScale(_2621, _2622, _2623);
	float ReSRes = _2626;
	bool _2629 = V_xGI_Power >= 1.00000000e+00;
	float _2630;
	float _2631;
	float _2632;
	_2630 = V_xGI_Power;
	_2631 = 1.00000000e+00;
	_2632 = 2.50000000e+00;
	float _2635 = F_xScale(_2630, _2631, _2632);
	float _2637 = _2629 ? _2635 : 1.00000000e+00;
	float power = _2637;
	float _2641 = mix(1.00000000e+00, 0.00000000e+00, ReSRes);
	float Res_Scale = _2641;
	vec3 GISamples = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _2646 = V_xDebug == 1;
	float _2648 = _2646 ? 0.00000000e+00 : Res_Scale;
	vec2 _2649;
	float _2650;
	_2649 = texcoords;
	_2650 = _2648;
	vec3 _2651 = F_xGI(_2649, _2650);
	vec3 CurrAOGI = _2651.xyz;
	vec3 MB = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 _2656 = CurrAOGI - MB;
	vec3 minColor = _2656;
	vec3 _2658 = CurrAOGI + MB;
	vec3 maxColor = _2658;
	int i_2661 = 0;
	while (i_2661 < 8)
	{
		{
			vec2 _2674 = _2671[int(i_2661)] * vec2(4.00000000e+00, 4.00000000e+00);
			vec2 Offset = _2674;
			vec2 _2676 = texcoords + Offset;
			vec2 _2677;
			float _2678;
			_2677 = _2676;
			_2678 = Res_Scale;
			vec3 _2679 = F_xGI(_2677, _2678);
			GISamples = _2679.xyz;
			vec3 _2681 = min(minColor, GISamples);
			vec3 _2682 = _2681 - MB;
			minColor = _2682;
			vec3 _2683 = max(maxColor, GISamples);
			vec3 _2684 = _2683 + MB;
			maxColor = _2684;
		}
		int _2670 = i_2661 + 1;
		i_2661 = _2670;
	}
	vec2 PastTexcoords = texcoords;
	vec4 _2690 = vec4(PastTexcoords.x, PastTexcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _2691 = textureLod(V_xPCGIaccuFrames, _2690.xy, _2690.w);
	vec3 _2693 = clamp(_2691.xyz, minColor, maxColor);
	vec3 Past = _2693;
	vec3 _2695 = Past - CurrAOGI;
	vec3 _2696 = abs(_2695);
	vec3 clampAmount = _2696;
	float _2698 = dot(clampAmount, clampAmount);
	float _2699 = clamp(_2698, 0.0, 1.0);
	clampAmount[0] = _2699;
	float _2702 = mix(1.99999996e-02, 2.00000003e-01, ReSRes);
	float _2705 = mix(2.00000003e-01, 5.00000000e-01, power);
	float _2707 = mix(_2702, _2705, clampAmount.x);
	float _2708 = clamp(_2707, 0.0, 1.0);
	float Mixing = _2708;
	vec3 _2711 = mix(Past, CurrAOGI, vec3(Mixing));
	vec3 AA = _2711;
	vec3 _2715 = mix(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), AA, vec3(D_Similarity));
	AA = _2715;
	vec4 _2720 = vec4(AA.x, AA.y, AA.z, 1.00000000e+00);
	return _2720;
}
void F_xAccumulatedFramesGI(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 acc)
{
	vec4 _2726 = texture(V_xBackBufferPCGI, texcoords);
	acc = _2726.xyzw;
	return;
}
vec4 F_xBGU_Hoz(
	in vec4 position,
	in vec2 texcoords)
{
	int _2734 = clamp(V_xSamplesXY, 0, 20);
	vec2 _2736;
	int _2737;
	int _2738;
	float _2739;
	_2736 = texcoords;
	_2737 = int(_2735[int(_2734)]);
	_2738 = 0;
	_2739 = 2.50000000e+00;
	vec4 _2743 = F_xDenoise(V_xPCGIaccuFrames, _2736, _2737, _2738, _2739);
	vec4 _2748 = vec4(_2743.xyz.x, _2743.xyz.y, _2743.xyz.z, 0.00000000e+00);
	return _2748;
}
vec4 F_xBGU_Ver(
	in vec4 position,
	in vec2 texcoords)
{
	int _2755 = clamp(V_xSamplesXY, 0, 20);
	vec2 _2757;
	int _2758;
	int _2759;
	float _2760;
	_2757 = texcoords;
	_2758 = int(_2735[int(_2755)]);
	_2759 = 1;
	_2760 = 2.50000000e+00;
	vec4 _2764 = F_xDenoise(V_xPCGI_BGUHorizontal_Sample, _2757, _2758, _2759, _2760);
	vec4 _2769 = vec4(_2764.xyz.x, _2764.xyz.y, _2764.xyz.z, 0.00000000e+00);
	return _2769;
}
vec3 F_xControlledBlend(
	in vec3 Color,
	in vec3 Cloud)
{
	vec3 _2775 = Cloud + vec3(4.90000010e-01, 4.90000010e-01, 4.90000010e-01);
	vec3 FiftyGray = _2775;
	vec3 _2777;
	vec3 _2778;
	_2777 = Color;
	_2778 = FiftyGray;
	vec3 _2779 = F_xoverlay(_2777, _2778);
	vec3 _2780;
	vec3 _2781;
	_2780 = Color;
	_2781 = FiftyGray;
	vec3 _2782 = F_xsoftlight(_2780, _2781);
	vec3 _2784 = mix(_2779, _2782, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _2786 = Cloud * vec3(1.87500000e-01, 1.87500000e-01, 1.87500000e-01);
	vec3 _2787;
	vec3 _2788;
	_2787 = _2784;
	_2788 = _2786;
	vec3 _2789 = F_xadd(_2787, _2788);
	return _2789;
}
vec3 F_xComposite(
	in vec3 Color,
	in vec3 Cloud)
{
	vec3 _2795 = Cloud + vec3(4.90000010e-01, 4.90000010e-01, 4.90000010e-01);
	vec3 FiftyGray_2796 = _2795;
	bool _2801 = V_xBlend == 0;
	if (_2801)
	{
		vec3 _2802;
		vec3 _2803;
		_2802 = Color;
		_2803 = Cloud;
		vec3 _2804 = F_xControlledBlend(_2802, _2803);
		return _2804;
	}
	else
	{
		bool _2809 = V_xBlend == 1;
		if (_2809)
		{
			vec3 _2810;
			vec3 _2811;
			_2810 = Color;
			_2811 = FiftyGray_2796;
			vec3 _2812 = F_xoverlay(_2810, _2811);
			return _2812;
		}
		else
		{
			bool _2817 = V_xBlend == 2;
			if (_2817)
			{
				vec3 _2818;
				vec3 _2819;
				_2818 = Color;
				_2819 = FiftyGray_2796;
				vec3 _2820 = F_xsoftlight(_2818, _2819);
				return _2820;
			}
			else
			{
				vec3 _2821;
				vec3 _2822;
				_2821 = Color;
				_2822 = Cloud;
				vec3 _2823 = F_xadd(_2821, _2822);
				return _2823;
			}
		}
	}
}
vec3 F_xMix(
	in vec2 texcoords)
{
	vec4 _2831 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _2832 = textureLod(V_xPCGIcurrColor, _2831.xy, _2831.w);
	vec4 _2837 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _2838 = textureLod(V_xPCGI_BGUVertical_Sample, _2837.xy, _2837.w);
	vec3 _2839;
	vec3 _2840;
	_2839 = _2832.xyz;
	_2840 = _2838.xyz;
	vec3 _2843 = F_xComposite(_2839, _2840);
	return _2843;
}
float F_xText_Info_Plus()
{
	int _2846 = F_xnonplus();
	float _2849 = fmodHLSL(float(V_xframecount), 2.00000000e+00);
	bool _2851 = _2849 == 0.00000000e+00;
	bool _2853 = bool(_2846) ? _2851 : V_xText_Info;
	return float(_2853);
}
vec3 F_xDiffusionBlur(
	in vec2 texcoords)
{
	vec3 Layer = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 total_2861 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _2862;
	_2862 = texcoords;
	float _2863 = F_xSSSMasking(_2862);
	float ML = _2863;
	vec4 _2869 = vec4(texcoords.x, texcoords.y, 0.00000000e+00, 2.00000000e+00);
	vec4 _2870 = textureLod(V_xPCGIcurrColor, _2869.xy, _2869.w);
	vec4 _2871;
	_2871 = _2870;
	float _2872 = F_xSkinDetection(_2871);
	float _2874 = 1.00000000e+00 - _2872;
	float SD = _2874;
	float NormalBlurFactor_2877 = 1.00000000e+00;
	float DepthBlurFactor_2879 = 8.99999961e-03;
	vec2 _2880;
	float _2881;
	_2880 = texcoords;
	_2881 = 0.00000000e+00;
	vec4 _2883 = F_xNormals_Depth(_2880, _2881);
	vec4 StoredNormals_Depth_2884 = _2883;
	bool _2889 = bool(SD) && V_xScattering;
	bool _2891 = _2889 && bool(ML);
	bool _2894 = V_xDiffusion_Saturation_Power.x > 0.00000000e+00;
	bool _2895 = _2891 && _2894;
	if (_2895)
	{
		int i_2897 = 0;
		while (i_2897 < 7)
		{
			{
				bool _2911 = i_2897 > 7;
				vec2 _2912;
				float _2913;
				_2912 = texcoords;
				_2913 = 0.00000000e+00;
				float _2915 = F_xDepthMDC(_2912, _2913);
				float _2918 = smoothstep(0.00000000e+00, 1.00000000e+00, _2915);
				bool _2920 = _2911 || bool(_2918);
				if (_2920)
				{
					break;
				}
				vec2 _2924 = vec2(_2921[int(i_2897)], 0.00000000e+00);
				vec2 _2926 = _2924 * vec2(5.20833360e-04, 9.25925910e-04);
				float _2928 = clamp(V_xDiffusion_Saturation_Power.x, 0.0, 1.0);
				float _2931 = mix(0.00000000e+00, 2.00000000e+00, _2928);
				vec2 _2933 = _2926 * vec2(_2931);
				vec2 _2934 = texcoords + _2933;
				vec2 offsetxy = _2934;
				vec2 _2936;
				_2936 = offsetxy;
				vec3 _2937 = F_xMix(_2936);
				vec3 CMix = _2937.xyz;
				vec2 _2940;
				float _2941;
				_2940 = offsetxy;
				_2941 = 2.00000000e+00;
				vec4 _2943 = F_xNormals_Depth(_2940, _2941);
				vec4 ModifiedNormals_Depth_2944 = _2943;
				vec3 _2947 = StoredNormals_Depth_2884.xyz - ModifiedNormals_Depth_2944.xyz;
				float _2948 = length(_2947);
				float ModN_2949 = _2948;
				float _2952 = StoredNormals_Depth_2884.w - ModifiedNormals_Depth_2944.w;
				float _2953 = clamp(_2952, 0.0, 1.0);
				float ModD_2954 = _2953;
				float _2956 = max(ModD_2954, 0.00000000e+00);
				float D_Dist2_2957 = _2956;
				float _2958 = -(D_Dist2_2957);
				float _2959 = _2958 / DepthBlurFactor_2879;
				float _2960 = exp(_2959);
				float _2962 = min(_2960, 1.00000000e+00);
				float d_w_2963 = _2962;
				float _2965 = max(ModN_2949, 0.00000000e+00);
				float N_Dist2_2966 = _2965;
				float _2967 = -(N_Dist2_2966);
				float _2968 = _2967 / NormalBlurFactor_2877;
				float _2969 = exp(_2968);
				float _2971 = min(_2969, 1.00000000e+00);
				float n_w_2972 = _2971;
				vec3 Weight_2975 = _2973[int(i_2897)];
				vec3 _2977 = Weight_2975 * vec3(d_w_2963);
				Weight_2975 = _2977;
				vec3 _2979 = Weight_2975 * vec3(n_w_2972);
				Weight_2975 = _2979;
				vec3 _2980 = CMix * Weight_2975;
				vec3 _2981 = Layer + _2980;
				Layer = _2981;
				vec3 _2982 = total_2861 + Weight_2975;
				total_2861 = _2982;
			}
			int _2906 = i_2897 + 1;
			i_2897 = _2906;
		}
		vec3 _2983 = Layer / total_2861;
		return _2983;
	}
	else
	{
		vec2 _2984;
		_2984 = texcoords;
		vec3 _2985 = F_xMix(_2984);
		return _2985.xyz;
	}
}
float F_xD_Scale(
	in float Input)
{
	float _2991 = Input - -1.00000000e+00;
	float _2993 = _2991 / 2.00000000e+00;
	return _2993;
}
vec4 F_xMixOut(
	in vec2 texcoords)
{
	vec2 _2997;
	float _2998;
	_2997 = texcoords;
	_2998 = 0.00000000e+00;
	vec4 _3000 = F_xNormals_Depth(_2997, _2998);
	float _3001;
	_3001 = _3000.w;
	float _3003 = F_xD_Scale(_3001);
	float Depth_3004 = _3003;
	float AO_Scale = 5.00000000e-01;
	bool _3008 = V_xDebug == 1;
	vec2 _3009;
	float _3010;
	_3009 = texcoords;
	_3010 = 1.00000000e+00;
	vec4 _3012 = F_xNormals_Depth(_3009, _3010);
	vec2 _3013;
	float _3014;
	_3013 = texcoords;
	_3014 = 2.00000000e+00;
	vec4 _3016 = F_xNormals_Depth(_3013, _3014);
	float _3019 = _3012.w + _3016.w;
	vec2 _3020;
	float _3021;
	_3020 = texcoords;
	_3021 = 3.00000000e+00;
	vec4 _3023 = F_xNormals_Depth(_3020, _3021);
	float _3025 = _3019 + _3023.w;
	vec2 _3026;
	float _3027;
	_3026 = texcoords;
	_3027 = 4.00000000e+00;
	vec4 _3029 = F_xNormals_Depth(_3026, _3027);
	float _3031 = _3025 + _3029.w;
	vec2 _3032;
	float _3033;
	_3032 = texcoords;
	_3033 = 5.00000000e+00;
	vec4 _3035 = F_xNormals_Depth(_3032, _3033);
	float _3037 = _3031 + _3035.w;
	vec2 _3038;
	float _3039;
	_3038 = texcoords;
	_3039 = 6.00000000e+00;
	vec4 _3041 = F_xNormals_Depth(_3038, _3039);
	float _3043 = _3037 + _3041.w;
	vec2 _3044;
	float _3045;
	_3044 = texcoords;
	_3045 = 7.00000000e+00;
	vec4 _3047 = F_xNormals_Depth(_3044, _3045);
	float _3049 = _3043 + _3047.w;
	vec2 _3050;
	float _3051;
	_3050 = texcoords;
	_3051 = 8.00000000e+00;
	vec4 _3053 = F_xNormals_Depth(_3050, _3051);
	float _3055 = _3049 + _3053.w;
	vec2 _3056;
	float _3057;
	_3056 = texcoords;
	_3057 = 9.00000000e+00;
	vec4 _3059 = F_xNormals_Depth(_3056, _3057);
	float _3061 = _3055 + _3059.w;
	vec2 _3062;
	float _3063;
	_3062 = texcoords;
	_3063 = 1.00000000e+01;
	vec4 _3065 = F_xNormals_Depth(_3062, _3063);
	float _3067 = _3061 + _3065.w;
	float _3069 = _3067 * 1.00000001e-01;
	float _3071 = _3008 ? _3069 : 9.99999994e-09;
	float FakeAO = _3071;
	float _3073;
	_3073 = FakeAO;
	float _3074 = F_xD_Scale(_3073);
	float _3075 = Depth_3004 / _3074;
	float _3076 = _3075 * AO_Scale;
	float _3078 = 1.00000000e+00 - _3076;
	float _3080 = 1.00000000e+00 + AO_Scale;
	float _3081 = _3078 * _3080;
	FakeAO = _3081;
	vec2 _3083 = texcoords + vec2(1.30208337e-03, 0.00000000e+00);
	vec2 _3084;
	float _3085;
	_3084 = _3083;
	_3085 = 1.00000000e+00;
	vec4 _3087 = F_xNormals_Depth(_3084, _3085);
	float _3089 = Depth_3004 + _3087.w;
	vec2 _3091 = texcoords + vec2(-1.30208337e-03, 0.00000000e+00);
	vec2 _3092;
	float _3093;
	_3092 = _3091;
	_3093 = 2.00000000e+00;
	vec4 _3095 = F_xNormals_Depth(_3092, _3093);
	float _3097 = _3089 + _3095.w;
	vec2 _3099 = texcoords + vec2(0.00000000e+00, 2.31481483e-03);
	vec2 _3100;
	float _3101;
	_3100 = _3099;
	_3101 = 3.00000000e+00;
	vec4 _3103 = F_xNormals_Depth(_3100, _3101);
	float _3105 = _3097 + _3103.w;
	vec2 _3107 = texcoords + vec2(0.00000000e+00, -2.31481483e-03);
	vec2 _3108;
	float _3109;
	_3108 = _3107;
	_3109 = 4.00000000e+00;
	vec4 _3111 = F_xNormals_Depth(_3108, _3109);
	float _3113 = _3105 + _3111.w;
	float _3115 = _3113 * 2.00000003e-01;
	float _3118 = false ? _3115 : 9.99999994e-09;
	float Guide = _3118;
	vec4 _3120 = texture(V_xPCGI_BGUVertical_Sample, texcoords);
	vec3 Output = _3120.xyz;
	vec2 _3123;
	_3123 = texcoords;
	vec3 _3124 = F_xDiffusionBlur(_3123);
	vec3 Layer_3125 = _3124;
	vec4 _3130 = vec4(Layer_3125.x, Layer_3125.y, Layer_3125.z, 5.00000000e-01);
	vec4 Done = _3130;
	bool _3136 = V_xDebug == 0;
	if (_3136)
	{
		float _3137 = Depth_3004 / Guide;
		bool _3139 = _3137 > 9.98000026e-01;
		float _3140 = Depth_3004 / Guide;
		bool _3142 = _3140 > 9.98000026e-01;
		vec3 _3146 = vec3(float(_3139), 1.00000000e+00, float(_3142));
		vec3 _3148 = Layer_3125.xyz * _3146;
		vec3 _3151 = compCond(bvec3(false, false, false), _3148, Layer_3125.xyz);
		Done.xyz = _3151;
	}
	else
	{
		bool _3156 = V_xDebug == 1;
		if (_3156)
		{
			vec3 _3158 = Output * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			vec3 _3160 = _3158 + vec3(FakeAO);
			vec3 _3163 = smoothstep(vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01), vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _3160);
			float _3166 = smoothstep(0.00000000e+00, 1.00000000e+00, Depth_3004);
			bool _3168 = _3166 == 1.00000000e+00;
			vec3 _3171 = mix(_3163, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), vec3(bvec3(_3168)));
			vec3 _3173 = mix(_3171, Output, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
			Done.xyz = _3173;
		}
		else
		{
			bool _3178 = V_xDebug == 2;
			if (_3178)
			{
				vec2 _3179;
				int _3180;
				_3179 = texcoords;
				_3180 = 0;
				vec4 _3182 = F_xDirectLighting(_3179, _3180);
				Done.xyz = _3182.xyz;
			}
			else
			{
				float _3186 = texcoords.x + texcoords.y;
				bool _3188 = _3186 < 1.00000000e+00;
				vec2 _3189;
				float _3190;
				_3189 = texcoords;
				_3190 = 0.00000000e+00;
				vec4 _3192 = F_xNormals_Depth(_3189, _3190);
				vec2 _3193;
				float _3194;
				_3193 = texcoords;
				_3194 = 0.00000000e+00;
				vec4 _3196 = F_xNormals_Depth(_3193, _3194);
				vec3 _3199 = _3196.xyz * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
				vec3 _3201 = _3199 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
				vec3 _3204 = compCond(bvec3(_3188), vec3(_3192.w), _3201);
				Done.xyz = _3204;
			}
		}
	}
	return Done;
}
float F_xgetBit(
	in float map,
	in float index)
{
	float _3209 = -(index);
	float _3210 = exp2(_3209);
	float _3211 = map * _3210;
	float _3212 = floor(_3211);
	float _3213;
	float _3214;
	_3213 = _3212;
	_3214 = 2.00000000e+00;
	float _3216 = F_xfmod(_3213, _3214);
	return _3216;
}
float F_xDT_Information()
{
	int _3219 = F_xT_01();
	float DT_Text = float(_3219);
	bool _3222 = V_xclock <= DT_Text;
	return float(_3222);
}
float F_xdrawChar(
	in float Char,
	in vec2 pos,
	in vec2 size,
	in vec2 TC)
{
	vec2 _3230 = TC - pos;
	TC = _3230;
	vec2 _3231 = TC / size;
	TC = _3231;
	float _3234 = min(TC.x, TC.y);
	float _3236 = step(0.00000000e+00, _3234);
	float _3239 = max(TC.x, TC.y);
	float _3241 = step(1.00000000e+00, _3239);
	float _3242 = _3236 - _3241;
	float res = _3242;
	vec2 _3245 = TC * vec2(4.00000000e+00, 5.00000000e+00);
	TC = _3245;
	float _3247 = floor(TC.y);
	float _3249 = 4.00000000e+00 * _3247;
	float _3251 = floor(TC.x);
	float _3252 = _3249 + _3251;
	float _3253;
	float _3254;
	_3253 = Char;
	_3254 = _3252;
	float _3255 = F_xgetBit(_3253, _3254);
	float _3256 = res * _3255;
	res = _3256;
	float _3257 = clamp(res, 0.0, 1.0);
	return _3257;
}
vec4 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float _3264 = 1.00000000e+00 - texcoord.y;
	vec2 _3266 = vec2(texcoord.x, _3264);
	vec2 TC_3267 = _3266;
	float _3270 = texcoord.y * 5.00000000e+01;
	float _3272 = 1.00000000e+00 - _3270;
	float _3274 = _3272 + 4.88499985e+01;
	float _3276 = _3274 * texcoord.y;
	float _3278 = _3276 - 5.00000000e-01;
	float Gradient = _3278;
	float _3281 = V_xclock * 3.74999992e-03;
	float _3282 = sin(_3281);
	float _3285 = smoothstep(0.00000000e+00, 1.00000000e+00, _3282);
	float BT = _3285;
	float Size = 1.10000002e+00;
	float Depth3D = 0.00000000e+00;
	vec2 _3291;
	_3291 = texcoord;
	vec4 _3292 = F_xMixOut(_3291);
	vec4 Color_3293 = _3292;
	float _3297 = F_xText_Info_Plus();
	if (bool(_3297))
	{
		vec2 _3301 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(Size);
		vec2 charSize = _3301;
		vec2 charPos = vec2(8.99999961e-03, 9.72500026e-01);
		float D3D_Size_A = 1.37500000e+00;
		float D3D_Size_B = 7.50000000e-01;
		vec2 _3311 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_A);
		vec2 charSize_A = _3311;
		vec2 _3315 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_B);
		vec2 charSize_B = _3315;
		charPos = vec2(8.61999989e-01, 1.79999992e-02);
		float _3318;
		vec2 _3319;
		vec2 _3320;
		vec2 _3321;
		_3318 = 4.98071000e+05;
		_3319 = charPos;
		_3320 = charSize_A;
		_3321 = TC_3267;
		float _3323 = F_xdrawChar(_3318, _3319, _3320, _3321);
		float _3324 = Depth3D + _3323;
		Depth3D = _3324;
		float _3326 = 9.99999978e-03 * D3D_Size_A;
		float _3328 = charPos.x + _3326;
		charPos[0] = _3328;
		float _3329;
		vec2 _3330;
		vec2 _3331;
		vec2 _3332;
		_3329 = 9.88959000e+05;
		_3330 = charPos;
		_3331 = charSize_A;
		_3332 = TC_3267;
		float _3334 = F_xdrawChar(_3329, _3330, _3331, _3332);
		float _3335 = Depth3D + _3334;
		Depth3D = _3335;
		float _3337 = 9.99999978e-03 * D3D_Size_A;
		float _3339 = charPos.x + _3337;
		charPos[0] = _3339;
		float _3340;
		vec2 _3341;
		vec2 _3342;
		vec2 _3343;
		_3340 = 4.98033000e+05;
		_3341 = charPos;
		_3342 = charSize_A;
		_3343 = TC_3267;
		float _3345 = F_xdrawChar(_3340, _3341, _3342, _3343);
		float _3346 = Depth3D + _3345;
		Depth3D = _3346;
		float _3348 = 9.99999978e-03 * D3D_Size_A;
		float _3350 = charPos.x + _3348;
		charPos[0] = _3350;
		float _3351;
		vec2 _3352;
		vec2 _3353;
		vec2 _3354;
		_3351 = 1.00051600e+06;
		_3352 = charPos;
		_3353 = charSize_A;
		_3354 = TC_3267;
		float _3356 = F_xdrawChar(_3351, _3352, _3353, _3354);
		float _3357 = Depth3D + _3356;
		Depth3D = _3357;
		float _3359 = 9.99999978e-03 * D3D_Size_A;
		float _3361 = charPos.x + _3359;
		charPos[0] = _3361;
		float _3362;
		vec2 _3363;
		vec2 _3364;
		vec2 _3365;
		_3362 = 6.30681000e+05;
		_3363 = charPos;
		_3364 = charSize_A;
		_3365 = TC_3267;
		float _3367 = F_xdrawChar(_3362, _3363, _3364, _3365);
		float _3368 = Depth3D + _3367;
		Depth3D = _3368;
		float _3370 = 9.99999978e-03 * D3D_Size_A;
		float _3372 = charPos.x + _3370;
		charPos[0] = _3372;
		float _3373;
		vec2 _3374;
		vec2 _3375;
		vec2 _3376;
		_3373 = 4.31254000e+05;
		_3374 = charPos;
		_3375 = charSize_A;
		_3376 = TC_3267;
		float _3378 = F_xdrawChar(_3373, _3374, _3375, _3376);
		float _3379 = Depth3D + _3378;
		Depth3D = _3379;
		float _3381 = 9.99999978e-03 * D3D_Size_A;
		float _3383 = charPos.x + _3381;
		charPos[0] = _3383;
		float _3384;
		vec2 _3385;
		vec2 _3386;
		vec2 _3387;
		_3384 = 4.98071000e+05;
		_3385 = charPos;
		_3386 = charSize_A;
		_3387 = TC_3267;
		float _3389 = F_xdrawChar(_3384, _3385, _3386, _3387);
		float _3390 = Depth3D + _3389;
		Depth3D = _3390;
		float _3392 = 8.00000038e-03 * D3D_Size_A;
		float _3394 = charPos.x + _3392;
		charPos[0] = _3394;
		float _3395;
		vec2 _3396;
		vec2 _3397;
		vec2 _3398;
		_3395 = 2.00000000e+00;
		_3396 = charPos;
		_3397 = charSize_A;
		_3398 = TC_3267;
		float _3400 = F_xdrawChar(_3395, _3396, _3397, _3398);
		float _3401 = Depth3D + _3400;
		Depth3D = _3401;
		float _3403 = 9.99999978e-03 * D3D_Size_A;
		float _3405 = charPos.x + _3403;
		charPos[0] = _3405;
		charPos = vec2(9.63000000e-01, 1.79999992e-02);
		float _3407;
		vec2 _3408;
		vec2 _3409;
		vec2 _3410;
		_3407 = 1.00052700e+06;
		_3408 = charPos;
		_3409 = charSize_B;
		_3410 = TC_3267;
		float _3412 = F_xdrawChar(_3407, _3408, _3409, _3410);
		float _3413 = Depth3D + _3412;
		Depth3D = _3413;
		float _3415 = 9.99999978e-03 * D3D_Size_B;
		float _3417 = charPos.x + _3415;
		charPos[0] = _3417;
		float _3418;
		vec2 _3419;
		vec2 _3420;
		vec2 _3421;
		_3418 = 6.38361000e+05;
		_3419 = charPos;
		_3420 = charSize_B;
		_3421 = TC_3267;
		float _3423 = F_xdrawChar(_3418, _3419, _3420, _3421);
		float _3424 = Depth3D + _3423;
		Depth3D = _3424;
		float _3426 = 9.99999978e-03 * D3D_Size_B;
		float _3428 = charPos.x + _3426;
		charPos[0] = _3428;
		float _3429;
		vec2 _3430;
		vec2 _3431;
		vec2 _3432;
		_3429 = 9.88945000e+05;
		_3430 = charPos;
		_3431 = charSize_B;
		_3432 = TC_3267;
		float _3434 = F_xdrawChar(_3429, _3430, _3431, _3432);
		float _3435 = Depth3D + _3434;
		Depth3D = _3435;
		float _3437 = 9.99999978e-03 * D3D_Size_B;
		float _3439 = charPos.x + _3437;
		charPos[0] = _3439;
		float _3440;
		vec2 _3441;
		vec2 _3442;
		vec2 _3443;
		_3440 = 4.32534000e+05;
		_3441 = charPos;
		_3442 = charSize_B;
		_3443 = TC_3267;
		float _3445 = F_xdrawChar(_3440, _3441, _3442, _3443);
		float _3446 = Depth3D + _3445;
		Depth3D = _3446;
		float _3447 = Gradient + Depth3D;
		float _3449 = Depth3D * 9.80000019e-01;
		float _3450 = clamp(_3449, 0.0, 1.0);
		vec4 _3453 = mix(vec4(_3447), Color_3293, vec4(_3450));
		vec4 _3456 = compCond(bvec4(false, false, false, false), _3453, vec4(Gradient));
		vec4 _3458 = compCond(bvec4(vec4(Depth3D)), _3456, Color_3293);
		return _3458;
	}
	else
	{
		float _3459 = F_xHelper();
		vec4 _3462 = compCond(bvec4(vec4(_3459)), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), Color_3293);
		return _3462;
	}
}
vec4 F_xBackBufferCG(
	in vec2 texcoords)
{
	vec4 _3466 = texture(V_xBackBufferPCGI, texcoords);
	vec4 C_3467 = _3466;
	float _3470 = dot(C_3467.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float GS_3471 = _3470;
	vec4 _3475 = vec4(C_3467.xyz.x, C_3467.xyz.y, C_3467.xyz.z, GS_3471);
	return _3475;
}
vec2 F_xPackNormals(
	in vec3 n)
{
	float _3481 = 8.00000000e+00 * n.z;
	float _3483 = _3481 + 8.00000000e+00;
	float _3484 = inversesqrt(_3483);
	float f_3485 = _3484;
	vec2 _3488 = n.xy * vec2(f_3485);
	vec2 _3490 = _3488 + vec2(5.00000000e-01, 5.00000000e-01);
	return _3490;
}
void F_xCurrentFrame(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 Color,
	out vec4 NormalsDepth)
{
	vec2 _3497;
	_3497 = texcoords;
	vec4 _3498 = F_xBackBufferCG(_3497);
	vec4 BBCG = _3498;
	vec2 _3500;
	_3500 = texcoords;
	float _3501 = F_xDepth_Info(_3500);
	float DI = _3501;
	vec2 _3503;
	int _3504;
	float _3505;
	_3503 = texcoords;
	_3504 = 5;
	_3505 = 1.00000000e+02;
	vec4 _3508 = F_xUblur(V_xPCGIcurrColor, _3503, _3504, _3505);
	float _3510 = dot(_3508, vec4(3.33000004e-01, 3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _3511 = clamp(_3510, 0.0, 1.0);
	float LRBLM = _3511;
	float _3513 = clamp(V_xLuma_Map, 0.0, 1.0);
	float _3516 = mix(0.00000000e+00, 1.00000000e+00, _3513);
	float _3518 = BBCG.w - _3516;
	float _3520 = max(0.00000000e+00, _3518);
	vec4 _3524 = vec4(BBCG.xyz.x, BBCG.xyz.y, BBCG.xyz.z, _3520);
	Color = _3524;
	vec2 _3525;
	_3525 = texcoords;
	vec3 _3526 = F_xDepthNormals(_3525);
	vec3 _3527;
	_3527 = _3526;
	vec2 _3528 = F_xPackNormals(_3527);
	vec4 _3531 = vec4(_3528.x, _3528.y, DI, LRBLM);
	NormalsDepth = _3531;
	return;
}
void F_xPreviousFrame(
	in vec4 vpos,
	in vec2 texcoords,
	out vec4 prev)
{
	vec2 _3537;
	float _3538;
	_3537 = texcoords;
	_3538 = 0.00000000e+00;
	vec4 _3540 = F_xNormals_Depth(_3537, _3538);
	prev = vec4(_3540.w);
	return;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _3548 = id == 2u;
	float _3551 = _3548 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _3551;
	bool _3553 = id == 1u;
	float _3556 = _3553 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _3556;
	vec2 _3558 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _3560 = _3558 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _3565 = vec4(_3560.x, _3560.y, 0.00000000e+00, 1.00000000e+00);
	position = _3565;
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
#ifdef E_xPreviousFrame
in vec2 vv_0;
layout(location = 0) out vec4 _out_prev;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 prev;
	F_xPreviousFrame(vpos, texcoords, prev);
	_out_prev = prev;
	return;
}
#endif
#ifdef E_xCurrentFrame
in vec2 vv_0;
layout(location = 0) out vec4 _out_Color;
layout(location = 1) out vec4 _out_NormalsDepth;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 Color;
	vec4 NormalsDepth;
	F_xCurrentFrame(vpos, texcoords, Color, NormalsDepth);
	_out_Color = Color;
	_out_NormalsDepth = NormalsDepth;
	return;
}
#endif
#ifdef E_xPCGI
in vec2 vv_0;
layout(location = 0) out vec4 _out_GlobalIllumination;
layout(location = 1) out vec4 _out_SubsurfaceScattering;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 GlobalIllumination;
	vec4 SubsurfaceScattering;
	F_xPCGI(vpos, texcoords, GlobalIllumination, SubsurfaceScattering);
	_out_GlobalIllumination = GlobalIllumination;
	_out_SubsurfaceScattering = SubsurfaceScattering;
	return;
}
#endif
#ifdef E_xCBReconstruction
in vec2 vv_0;
layout(location = 0) out vec4 _out_UpGI;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 UpGI;
	F_xCBReconstruction(vpos, texcoords, UpGI);
	_out_UpGI = UpGI;
	return;
}
#endif
#ifdef E_xGI_TAA
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xGI_TAA(vpos, texcoords);
	return;
}
#endif
#ifdef E_xAccumulatedFramesGI
in vec2 vv_0;
layout(location = 0) out vec4 _out_acc;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoords = vv_0;
	vec4 acc;
	F_xAccumulatedFramesGI(vpos, texcoords, acc);
	_out_acc = acc;
	return;
}
#endif
#ifdef E_xBGU_Hoz
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xBGU_Hoz(position, texcoords);
	return;
}
#endif
#ifdef E_xBGU_Ver
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoords = vv_0;
	_return = F_xBGU_Ver(position, texcoords);
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
