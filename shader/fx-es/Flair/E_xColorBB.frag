#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xColorBB
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
uniform int V_xFlare_Type;
uniform bool V_xAuto_Flare_Intensity;
uniform float V_xFlare_Clamp_A;
uniform float V_xFlare_Clamp_B;
uniform float V_xFlare_Spread;
uniform float V_xFlare_Power;
uniform float V_xFlare_Saturation;
uniform int V_xFlare_Color_Map;
uniform vec3 V_xUser_Flare_Color;
uniform float V_xFlare_Localization;
uniform int V_xCA_Type;
uniform vec3 V_xFlare_PBD;
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform bool V_xDepth_Map_Flip;
uniform bool V_xMask_Sky;
uniform bool V_xFlair_Falloff;
uniform float V_xtimer;
uniform uint V_xframecount;
uniform float V_xframetime;

uniform sampler2D V_xDepthBufferF;
uniform sampler2D V_xBackBufferF;
uniform sampler2D V_xSamplerGlammor;
uniform sampler2D V_xSamplerBC;
uniform sampler2D V_xSamplerMBB;
uniform sampler2D V_xSamplerPastFlare;
uniform sampler2D V_xSamplerLumG;
uniform sampler2D V_xSamplerAvgLumG;
uniform sampler2D V_xSamplerAvgLumaLastG;
const float _630[25] = float[25](0.00000000e+00, 1.00000000e+00, 3.00000000e+00, 5.00000000e+00, 7.00000000e+00, 9.00000000e+00, 1.10000000e+01, 1.30000000e+01, 1.50000000e+01, 1.70000000e+01, 1.90000000e+01, 2.10000000e+01, 2.30000000e+01, 2.50000000e+01, 2.70000000e+01, 2.90000000e+01, 3.10000000e+01, 3.30000000e+01, 3.50000000e+01, 3.70000000e+01, 3.90000000e+01, 4.10000000e+01, 4.30000000e+01, 4.50000000e+01, 4.70000000e+01);
const float _634[25] = float[25](0.00000000e+00, 2.00000000e+00, 4.00000000e+00, 6.00000000e+00, 8.00000000e+00, 1.00000000e+01, 1.20000000e+01, 1.40000000e+01, 1.60000000e+01, 1.80000000e+01, 2.00000000e+01, 2.20000000e+01, 2.40000000e+01, 2.60000000e+01, 2.80000000e+01, 3.00000000e+01, 3.20000000e+01, 3.40000000e+01, 3.60000000e+01, 3.80000000e+01, 4.00000000e+01, 4.20000000e+01, 4.40000000e+01, 4.60000000e+01, 4.80000000e+01);
const float _651[25] = float[25](5.00000000e-01, 1.50000000e+00, 3.50000000e+00, 5.50000000e+00, 7.50000000e+00, 9.50000000e+00, 1.15000000e+01, 1.35000000e+01, 1.55000000e+01, 1.75000000e+01, 1.95000000e+01, 2.15000000e+01, 2.35000000e+01, 2.55000000e+01, 2.75000000e+01, 2.95000000e+01, 3.15000000e+01, 3.35000000e+01, 3.55000000e+01, 3.75000000e+01, 3.95000000e+01, 4.15000000e+01, 4.35000000e+01, 4.55000000e+01, 4.75000000e+01);
const float _655[25] = float[25](5.00000000e-01, 2.50000000e+00, 4.50000000e+00, 6.50000000e+00, 8.50000000e+00, 1.05000000e+01, 1.25000000e+01, 1.45000000e+01, 1.65000000e+01, 1.85000000e+01, 2.05000000e+01, 2.25000000e+01, 2.45000000e+01, 2.65000000e+01, 2.85000000e+01, 3.05000000e+01, 3.25000000e+01, 3.45000000e+01, 3.65000000e+01, 3.85000000e+01, 4.05000000e+01, 4.25000000e+01, 4.45000000e+01, 4.65000000e+01, 4.85000000e+01);
const float _676[25] = float[25](1.07610002e-01, 1.03060000e-01, 9.74999964e-02, 9.10999998e-02, 8.40900019e-02, 7.66599998e-02, 6.90300018e-02, 6.13900013e-02, 5.39399981e-02, 4.67999987e-02, 4.01000008e-02, 3.39000002e-02, 2.84000002e-02, 2.33999994e-02, 1.90999992e-02, 1.53999999e-02, 1.21999998e-02, 9.60000046e-03, 7.40000000e-03, 5.70000010e-03, 4.30000015e-03, 3.19999992e-03, 2.40000011e-03, 1.70000002e-03, 1.20000006e-03);
float F_xlum(
	in vec3 RGB)
{
	float _26 = dot(RGB, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	return _26;
}
void F_xA0(
	in vec2 texcoord,
	in float PosX,
	in float PosY,
	inout float D,
	inout float E,
	inout float P,
	inout float T,
	inout float H,
	inout float III,
	inout float DD)
{
	float _52 = -3.50000001e-02 + PosX;
	float PosXD = _52;
	float offsetD = 1.00000005e-03;
	float _57 = texcoord.x - PosXD;
	float _59 = texcoord.y - PosY;
	vec2 _60 = vec2(_57, _59);
	vec2 _61 = abs(_60);
	bvec2 _63 = lessThan(_61, vec2(2.49999994e-03, 8.99999961e-03));
	bool _64 = all(_63);
	D = float(_64);
	float _67 = texcoord.x - PosXD;
	float _68 = _67 - offsetD;
	float _70 = texcoord.y - PosY;
	vec2 _71 = vec2(_68, _70);
	vec2 _72 = abs(_71);
	bvec2 _74 = lessThan(_72, vec2(2.49999994e-03, 7.00000022e-03));
	bool _75 = all(_74);
	float _77 = D - float(_75);
	D = _77;
	float _79 = -2.80000009e-02 + PosX;
	float PosXE = _79;
	float offsetE = 5.00000024e-04;
	float _84 = texcoord.x - PosXE;
	float _86 = texcoord.y - PosY;
	vec2 _87 = vec2(_84, _86);
	vec2 _88 = abs(_87);
	bvec2 _90 = lessThan(_88, vec2(3.00000003e-03, 8.99999961e-03));
	bool _91 = all(_90);
	E = float(_91);
	float _94 = texcoord.x - PosXE;
	float _95 = _94 - offsetE;
	float _97 = texcoord.y - PosY;
	vec2 _98 = vec2(_95, _97);
	vec2 _99 = abs(_98);
	bvec2 _101 = lessThan(_99, vec2(2.49999994e-03, 7.00000022e-03));
	bool _102 = all(_101);
	float _104 = E - float(_102);
	E = _104;
	float _106 = texcoord.x - PosXE;
	float _108 = texcoord.y - PosY;
	vec2 _109 = vec2(_106, _108);
	vec2 _110 = abs(_109);
	bvec2 _112 = lessThan(_110, vec2(3.00000003e-03, 1.00000005e-03));
	bool _113 = all(_112);
	float _115 = E + float(_113);
	E = _115;
	float _117 = -2.15000007e-02 + PosX;
	float PosXP = _117;
	float _120 = -2.49999994e-03 + PosY;
	float PosYP = _120;
	float offsetP = 1.00000005e-03;
	float offsetP1 = 2.00000009e-03;
	float _127 = texcoord.x - PosXP;
	float _129 = texcoord.y - PosYP;
	vec2 _130 = vec2(_127, _129);
	vec2 _131 = abs(_130);
	bvec2 _133 = lessThan(_131, vec2(2.49999994e-03, 6.97499933e-03));
	bool _134 = all(_133);
	P = float(_134);
	float _137 = texcoord.x - PosXP;
	float _138 = _137 - offsetP;
	float _140 = texcoord.y - PosYP;
	vec2 _141 = vec2(_138, _140);
	vec2 _142 = abs(_141);
	bvec2 _144 = lessThan(_142, vec2(2.49999994e-03, 4.76000039e-03));
	bool _145 = all(_144);
	float _147 = P - float(_145);
	P = _147;
	float _149 = texcoord.x - PosXP;
	float _150 = _149 + offsetP1;
	float _152 = texcoord.y - PosY;
	vec2 _153 = vec2(_150, _152);
	vec2 _154 = abs(_153);
	bvec2 _156 = lessThan(_154, vec2(5.00000024e-04, 8.99999961e-03));
	bool _157 = all(_156);
	float _159 = P + float(_157);
	P = _159;
	float _161 = -1.40000004e-02 + PosX;
	float PosXT = _161;
	float _164 = -8.00000038e-03 + PosY;
	float PosYT = _164;
	float _167 = texcoord.x - PosXT;
	float _169 = texcoord.y - PosYT;
	vec2 _170 = vec2(_167, _169);
	vec2 _171 = abs(_170);
	bvec2 _173 = lessThan(_171, vec2(3.00000003e-03, 1.00000005e-03));
	bool _174 = all(_173);
	T = float(_174);
	float _177 = texcoord.x - PosXT;
	float _179 = texcoord.y - PosY;
	vec2 _180 = vec2(_177, _179);
	vec2 _181 = abs(_180);
	bvec2 _183 = lessThan(_181, vec2(6.24999986e-04, 8.99999961e-03));
	bool _184 = all(_183);
	float _186 = T + float(_184);
	T = _186;
	float _188 = -7.19999988e-03 + PosX;
	float PosXH = _188;
	float _191 = texcoord.x - PosXH;
	float _193 = texcoord.y - PosY;
	vec2 _194 = vec2(_191, _193);
	vec2 _195 = abs(_194);
	bvec2 _197 = lessThan(_195, vec2(2.00000009e-03, 1.00000005e-03));
	bool _198 = all(_197);
	H = float(_198);
	float _201 = texcoord.x - PosXH;
	float _203 = texcoord.y - PosY;
	vec2 _204 = vec2(_201, _203);
	vec2 _205 = abs(_204);
	bvec2 _207 = lessThan(_205, vec2(2.00000009e-03, 8.99999961e-03));
	bool _208 = all(_207);
	float _210 = H - float(_208);
	H = _210;
	float _212 = texcoord.x - PosXH;
	float _214 = texcoord.y - PosY;
	vec2 _215 = vec2(_212, _214);
	vec2 _216 = abs(_215);
	bvec2 _218 = lessThan(_216, vec2(3.25000007e-03, 8.99999961e-03));
	bool _219 = all(_218);
	float _221 = H + float(_219);
	H = _221;
	float offsetFive = 1.00000005e-03;
	float _225 = -1.00000005e-03 + PosX;
	float PosX3 = _225;
	float _228 = texcoord.x - PosX3;
	float _230 = texcoord.y - PosY;
	vec2 _231 = vec2(_228, _230);
	vec2 _232 = abs(_231);
	bvec2 _234 = lessThan(_232, vec2(2.00000009e-03, 8.99999961e-03));
	bool _235 = all(_234);
	III = float(_235);
	float _238 = texcoord.x - PosX3;
	float _239 = _238 - offsetFive;
	float _241 = texcoord.y - PosY;
	vec2 _242 = vec2(_239, _241);
	vec2 _243 = abs(_242);
	bvec2 _245 = lessThan(_243, vec2(3.00000003e-03, 7.00000022e-03));
	bool _246 = all(_245);
	float _248 = III - float(_246);
	III = _248;
	float _250 = texcoord.x - PosX3;
	float _252 = texcoord.y - PosY;
	vec2 _253 = vec2(_250, _252);
	vec2 _254 = abs(_253);
	bvec2 _256 = lessThan(_254, vec2(2.00000009e-03, 1.00000005e-03));
	bool _257 = all(_256);
	float _259 = III + float(_257);
	III = _259;
	float _261 = 6.00000005e-03 + PosX;
	float PosXDD = _261;
	float offsetDD = 1.00000005e-03;
	float _266 = texcoord.x - PosXDD;
	float _268 = texcoord.y - PosY;
	vec2 _269 = vec2(_266, _268);
	vec2 _270 = abs(_269);
	bvec2 _272 = lessThan(_270, vec2(2.49999994e-03, 8.99999961e-03));
	bool _273 = all(_272);
	DD = float(_273);
	float _276 = texcoord.x - PosXDD;
	float _277 = _276 - offsetDD;
	float _279 = texcoord.y - PosY;
	vec2 _280 = vec2(_277, _279);
	vec2 _281 = abs(_280);
	bvec2 _283 = lessThan(_281, vec2(2.49999994e-03, 7.00000022e-03));
	bool _284 = all(_283);
	float _286 = DD - float(_284);
	DD = _286;
	return;
}
float F_xLuminanceG(
	in vec4 pos,
	in vec2 texcoord)
{
	vec2 texXY = texcoord;
	vec2 midHV = vec2(-2.50000000e-01, -2.50000000e-01);
	float _298 = texXY.x * 5.00000000e-01;
	float _300 = _298 - midHV.x;
	float _303 = texXY.y * 5.00000000e-01;
	float _305 = _303 - midHV.y;
	vec2 _306 = vec2(_300, _305);
	texcoord = _306;
	vec4 _307 = texture(V_xBackBufferF, texcoord);
	vec3 _308;
	_308 = _307.xyz;
	float _310 = F_xlum(_308);
	return _310;
}
float F_xAverage_LuminanceF(
	in vec4 pos,
	in vec2 texcoord)
{
	float AA = 5.00000000e+02;
	vec4 _325 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 1.10000000e+01);
	vec4 _326 = textureLod(V_xSamplerLumG, _325.xy, _325.w);
	float L = _326.x;
	vec4 _329 = texture(V_xSamplerAvgLumaLastG, texcoord);
	float PL = _329.x;
	float _332 = L - PL;
	float _333 = -(V_xframetime);
	float _334 = _333 / AA;
	float _335 = exp(_334);
	float _337 = 1.00000000e+00 - _335;
	float _338 = _332 * _337;
	float _339 = PL + _338;
	return _339;
}
vec2 F_xDepthMap(
	in vec2 texcoord)
{
	if (V_xDepth_Map_Flip)
	{
		float _348 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _348;
	}
	vec4 _353 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _354 = textureLod(V_xDepthBufferF, _353.xy, _353.w);
	float zBuffer = _354.x;
	float Raw = 0.00000000e+00;
	float Far = 1.00000000e+00;
	float _362 = 1.25000000e-01 / V_xDepth_Map_Adjust;
	float Near = _362;
	float _365 = V_xDepth_Map_Adjust * 2.00000000e+00;
	float DA = _365;
	float _368 = 1.00000000e+00 - zBuffer;
	vec2 _369 = vec2(zBuffer, _368);
	vec2 Z = _369;
	bool _375 = V_xDepth_Map == 0;
	if (_375)
	{
		float _376 = Far * Near;
		float _377 = Near - Far;
		float _379 = Z.x * _377;
		float _380 = Far + _379;
		float _381 = _376 / _380;
		zBuffer = _381;
		float _383 = abs(Z.x);
		float _384 = pow(_383, DA);
		Raw = _384;
	}
	else
	{
		bool _389 = V_xDepth_Map == 1;
		if (_389)
		{
			float _390 = Far * Near;
			float _391 = Near - Far;
			float _393 = Z.y * _391;
			float _394 = Far + _393;
			float _395 = _390 / _394;
			zBuffer = _395;
			float _397 = abs(Z.y);
			float _398 = pow(_397, DA);
			Raw = _398;
		}
	}
	vec2 _399 = vec2(zBuffer, Raw);
	vec2 _400 = clamp(_399, 0.0, 1.0);
	return _400;
}
vec4 F_xBB(
	in vec2 texcoord)
{
	vec4 _408 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _409 = textureLod(V_xBackBufferF, _408.xy, _408.w);
	return _409.xyzw;
}
void F_xColorBB(
	in vec4 position,
	in vec2 texcoord,
	out vec3 MBB)
{
	vec2 _416;
	_416 = texcoord;
	vec4 _417 = F_xBB(_416);
	MBB = _417.xyz;
	return;
}
vec4 F_xGBightColors(
	in vec2 texcoord)
{
	vec2 _422;
	_422 = texcoord;
	vec2 _423 = F_xDepthMap(_422);
	float _427 = smoothstep(0.00000000e+00, 1.00000000e+00, _423.x);
	float DM = _427;
	bool _433 = DM == 1.00000000e+00;
	if (_433)
	{
		DM = 1.00000000e+00;
	}
	else
	{
		DM = 0.00000000e+00;
	}
	bool _439 = !bool(V_xMask_Sky);
	if (_439)
	{
		DM = 0.00000000e+00;
	}
	int _443 = clamp(V_xFlare_Color_Map, 0, 8);
	vec4 _448 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, float(_443));
	vec4 _449 = textureLod(V_xSamplerMBB, _448.xy, _448.w);
	vec4 _453 = mix(_449.xyzw, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(DM));
	vec4 CM = _453;
	vec2 _455;
	_455 = texcoord;
	vec4 _456 = F_xBB(_455);
	vec4 _459 = mix(_456, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(DM));
	vec4 BC = _459;
	vec3 _461;
	_461 = BC.xyz;
	float _463 = F_xlum(_461);
	float I_A = _463;
	float _466 = 1.00000000e+00 - I_A;
	float I_B = _466;
	float _469 = 1.00000000e+00 - V_xFlare_Clamp_B;
	bool _470 = I_B >= _469;
	float _472 = I_A * float(_470);
	I_A = _472;
	float _475 = mix(8.99999976e-01, 9.99000013e-01, V_xFlare_Clamp_A);
	bool _476 = I_A > _475;
	BC[3] = float(_476);
	vec3 _480 = BC.xyz * vec3(BC.w);
	BC.xyz = _480;
	bool _485 = V_xFlare_Color_Map > 0;
	if (_485)
	{
		vec3 _488 = CM.xyz * vec3(BC.w);
		BC.xyz = _488;
	}
	else
	{
		bool _493 = V_xFlare_Color_Map == -1;
		if (_493)
		{
			vec3 _495 = BC.xyz * V_xUser_Flare_Color;
			BC.xyz = _495;
		}
	}
	if (V_xFlair_Falloff)
	{
		vec2 _499;
		_499 = texcoord;
		vec2 _500 = F_xDepthMap(_499);
		vec3 _504 = mix(BC.xyz, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_500.y));
		BC.xyz = _504;
	}
	vec3 _505;
	_505 = BC.xyz;
	float _507 = F_xlum(_505);
	vec3 _511 = mix(vec3(_507), BC.xyz, vec3(V_xFlare_Saturation));
	BC.xyz = _511;
	vec2 Stored_TC = texcoord;
	vec2 FL = vec2(0.00000000e+00, 0.00000000e+00);
	bool _519 = V_xFlare_Localization != 0.00000000e+00;
	if (_519)
	{
		vec2 _521 = vec2(1.00000000e+00, 1.00000000e+00) - Stored_TC;
		vec2 _522 = Stored_TC * _521;
		Stored_TC = _522;
		float _525 = Stored_TC.x * Stored_TC.y;
		float _527 = _525 * 1.25000000e+01;
		float vignette = _527;
		bool _533 = V_xFlare_Localization < 0.00000000e+00;
		if (_533)
		{
			float _534 = abs(V_xFlare_Localization);
			vec2 _536 = vec2(0.00000000e+00, _534);
			FL = _536;
		}
		else
		{
			float _537 = abs(V_xFlare_Localization);
			vec2 _539 = vec2(_537, 1.00000000e+00);
			FL = _539;
		}
		float _542 = smoothstep(FL.x, FL.y, vignette);
		float _544 = 1.00000000e+00 - _542;
		vignette = _544;
		bool _549 = V_xFlare_Localization < 0.00000000e+00;
		if (_549)
		{
			float _551 = 1.00000000e+00 - vignette;
			vignette = _551;
		}
		vec3 _555 = mix(BC.xyz, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(vignette));
		BC.xyz = _555;
	}
	vec3 _557 = clamp(BC.xyz, 0.0, 1.0);
	vec4 _562 = vec4(_557.x, _557.y, _557.z, BC.w);
	return _562;
}
void F_xStoredBB(
	in vec4 position,
	in vec2 texcoord,
	out vec3 BC)
{
	vec2 _568;
	_568 = texcoord;
	vec4 _569 = F_xGBightColors(_568);
	BC = _569.xyz;
	return;
}
vec3 F_xGlammorA(
	in vec2 texcoord)
{
	vec4 _574 = texture(V_xSamplerBC, texcoord);
	vec3 GBloom = _574.xyz;
	float N = 0.00000000e+00;
	bool _580 = V_xFlare_Spread < 0.00000000e+00;
	float _582 = V_xFlare_Spread * 4.00000000e+00;
	float _584 = V_xFlare_Spread * 2.20000005e+00;
	float _585 = _580 ? _582 : _584;
	float BBS = _585;
	vec3 _588 = GBloom * vec3(1.07610002e-01, 1.07610002e-01, 1.07610002e-01);
	GBloom = _588;
	bool _593 = V_xFlare_Type == 0;
	bool _595 = V_xFlare_Type == 1;
	bool _596 = _593 || _595;
	bool _598 = V_xFlare_Type == 2;
	bool _599 = _596 || _598;
	bool _601 = V_xFlare_Type == 6;
	bool _602 = _599 || _601;
	bool _604 = V_xFlare_Type == 7;
	bool _605 = _602 || _604;
	if (_605)
	{
		N = 2.50000000e+01;
	}
	else
	{
		bool _611 = V_xFlare_Type == 3;
		bool _613 = V_xFlare_Type == 4;
		bool _614 = _611 || _613;
		bool _616 = V_xFlare_Type == 5;
		bool _617 = _614 || _616;
		if (_617)
		{
			N = 1.00000000e+00;
		}
	}
	int i = 1;
	while (float(i) < N)
	{
		{
			vec2 _633 = vec2(_630[int(i)]) * vec2(5.20833360e-04, 9.25925910e-04);
			vec2 _637 = vec2(_634[int(i)]) * vec2(5.20833360e-04, 9.25925910e-04);
			vec4 _642 = vec4(_633.x, _633.y, _637.x, _637.y);
			vec4 offset = _642;
			uint _648 = V_xframecount % 2u;
			bool _650 = _648 == 0u;
			if (_650)
			{
				vec2 _654 = vec2(_651[int(i)]) * vec2(5.20833360e-04, 9.25925910e-04);
				vec2 _658 = vec2(_655[int(i)]) * vec2(5.20833360e-04, 9.25925910e-04);
				vec4 _663 = vec4(_654.x, _654.y, _658.x, _658.y);
				offset = _663;
			}
			bool _668 = V_xFlare_Type == 6;
			if (_668)
			{
				vec2 _671 = vec2(offset.x, 0.00000000e+00);
				vec2 _673 = _671 * vec2(BBS);
				vec2 _674 = texcoord + _673;
				vec4 _675 = texture(V_xSamplerBC, _674);
				vec3 _679 = _675.xyz * vec3(_676[int(i)]);
				vec3 _680 = GBloom + _679;
				GBloom = _680;
				float _682 = -(offset.x);
				vec2 _684 = vec2(_682, 0.00000000e+00);
				vec2 _686 = _684 * vec2(BBS);
				vec2 _687 = texcoord + _686;
				vec4 _688 = texture(V_xSamplerBC, _687);
				vec3 _692 = _688.xyz * vec3(_676[int(i)]);
				vec3 _693 = GBloom + _692;
				GBloom = _693;
				vec2 _696 = vec2(offset.z, 0.00000000e+00);
				vec2 _698 = _696 * vec2(BBS);
				vec2 _699 = texcoord + _698;
				vec4 _700 = texture(V_xSamplerBC, _699);
				vec3 _704 = _700.xyz * vec3(_676[int(i)]);
				vec3 _705 = GBloom + _704;
				GBloom = _705;
				float _707 = -(offset.z);
				vec2 _709 = vec2(_707, 0.00000000e+00);
				vec2 _711 = _709 * vec2(BBS);
				vec2 _712 = texcoord + _711;
				vec4 _713 = texture(V_xSamplerBC, _712);
				vec3 _717 = _713.xyz * vec3(_676[int(i)]);
				vec3 _718 = GBloom + _717;
				GBloom = _718;
			}
			else
			{
				bool _723 = V_xFlare_Type == 7;
				if (_723)
				{
					vec2 _726 = vec2(0.00000000e+00, offset.y);
					vec2 _728 = _726 * vec2(BBS);
					vec2 _729 = texcoord + _728;
					vec4 _730 = texture(V_xSamplerBC, _729);
					vec3 _734 = _730.xyz * vec3(_676[int(i)]);
					vec3 _735 = GBloom + _734;
					GBloom = _735;
					float _737 = -(offset.y);
					vec2 _739 = vec2(0.00000000e+00, _737);
					vec2 _741 = _739 * vec2(BBS);
					vec2 _742 = texcoord + _741;
					vec4 _743 = texture(V_xSamplerBC, _742);
					vec3 _747 = _743.xyz * vec3(_676[int(i)]);
					vec3 _748 = GBloom + _747;
					GBloom = _748;
					vec2 _751 = vec2(0.00000000e+00, offset.w);
					vec2 _753 = _751 * vec2(BBS);
					vec2 _754 = texcoord + _753;
					vec4 _755 = texture(V_xSamplerBC, _754);
					vec3 _759 = _755.xyz * vec3(_676[int(i)]);
					vec3 _760 = GBloom + _759;
					GBloom = _760;
					float _762 = -(offset.w);
					vec2 _764 = vec2(0.00000000e+00, _762);
					vec2 _766 = _764 * vec2(BBS);
					vec2 _767 = texcoord + _766;
					vec4 _768 = texture(V_xSamplerBC, _767);
					vec3 _772 = _768.xyz * vec3(_676[int(i)]);
					vec3 _773 = GBloom + _772;
					GBloom = _773;
				}
				else
				{
					vec2 _776 = vec2(offset.x, 0.00000000e+00);
					vec2 _778 = _776 * vec2(BBS);
					vec2 _779 = texcoord + _778;
					vec4 _780 = texture(V_xSamplerBC, _779);
					vec3 _784 = _780.xyz * vec3(_676[int(i)]);
					vec3 _785 = GBloom + _784;
					GBloom = _785;
					float _787 = -(offset.x);
					vec2 _789 = vec2(_787, 0.00000000e+00);
					vec2 _791 = _789 * vec2(BBS);
					vec2 _792 = texcoord + _791;
					vec4 _793 = texture(V_xSamplerBC, _792);
					vec3 _797 = _793.xyz * vec3(_676[int(i)]);
					vec3 _798 = GBloom + _797;
					GBloom = _798;
					vec2 _801 = vec2(0.00000000e+00, offset.y);
					vec2 _803 = _801 * vec2(BBS);
					vec2 _804 = texcoord + _803;
					vec4 _805 = texture(V_xSamplerBC, _804);
					vec3 _809 = _805.xyz * vec3(_676[int(i)]);
					vec3 _810 = GBloom + _809;
					GBloom = _810;
					float _812 = -(offset.y);
					vec2 _814 = vec2(0.00000000e+00, _812);
					vec2 _816 = _814 * vec2(BBS);
					vec2 _817 = texcoord + _816;
					vec4 _818 = texture(V_xSamplerBC, _817);
					vec3 _822 = _818.xyz * vec3(_676[int(i)]);
					vec3 _823 = GBloom + _822;
					GBloom = _823;
					vec2 _826 = vec2(offset.z, 0.00000000e+00);
					vec2 _828 = _826 * vec2(BBS);
					vec2 _829 = texcoord + _828;
					vec4 _830 = texture(V_xSamplerBC, _829);
					vec3 _834 = _830.xyz * vec3(_676[int(i)]);
					vec3 _835 = GBloom + _834;
					GBloom = _835;
					float _837 = -(offset.z);
					vec2 _839 = vec2(_837, 0.00000000e+00);
					vec2 _841 = _839 * vec2(BBS);
					vec2 _842 = texcoord + _841;
					vec4 _843 = texture(V_xSamplerBC, _842);
					vec3 _847 = _843.xyz * vec3(_676[int(i)]);
					vec3 _848 = GBloom + _847;
					GBloom = _848;
					vec2 _851 = vec2(0.00000000e+00, offset.w);
					vec2 _853 = _851 * vec2(BBS);
					vec2 _854 = texcoord + _853;
					vec4 _855 = texture(V_xSamplerBC, _854);
					vec3 _859 = _855.xyz * vec3(_676[int(i)]);
					vec3 _860 = GBloom + _859;
					GBloom = _860;
					float _862 = -(offset.w);
					vec2 _864 = vec2(0.00000000e+00, _862);
					vec2 _866 = _864 * vec2(BBS);
					vec2 _867 = texcoord + _866;
					vec4 _868 = texture(V_xSamplerBC, _867);
					vec3 _872 = _868.xyz * vec3(_676[int(i)]);
					vec3 _873 = GBloom + _872;
					GBloom = _873;
				}
			}
		}
		int _629 = i + 1;
		i = _629;
	}
	vec3 _875 = GBloom * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	GBloom = _875;
	return GBloom;
}
vec3 F_xGlammorB(
	in vec2 texcoord)
{
	vec2 _879;
	_879 = texcoord;
	vec4 _880 = F_xGBightColors(_879);
	vec3 GBloom_882 = _880.xyz;
	float N_884 = 0.00000000e+00;
	bool _886 = V_xFlare_Spread < 0.00000000e+00;
	float _888 = V_xFlare_Spread * 4.00000000e+00;
	float _890 = V_xFlare_Spread * 2.20000005e+00;
	float _891 = _886 ? _888 : _890;
	float BBS_892 = _891;
	vec3 _894 = GBloom_882 * vec3(1.07610002e-01, 1.07610002e-01, 1.07610002e-01);
	GBloom_882 = _894;
	bool _899 = V_xFlare_Type == 0;
	bool _901 = V_xFlare_Type == 1;
	bool _902 = _899 || _901;
	bool _904 = V_xFlare_Type == 3;
	bool _905 = _902 || _904;
	bool _907 = V_xFlare_Type == 4;
	bool _908 = _905 || _907;
	bool _910 = V_xFlare_Type == 5;
	bool _911 = _908 || _910;
	if (_911)
	{
		N_884 = 2.50000000e+01;
	}
	else
	{
		bool _917 = V_xFlare_Type == 2;
		bool _919 = V_xFlare_Type == 6;
		bool _920 = _917 || _919;
		bool _922 = V_xFlare_Type == 7;
		bool _923 = _920 || _922;
		if (_923)
		{
			N_884 = 1.00000000e+00;
		}
	}
	bool _929 = V_xFlare_Type == 1;
	if (_929)
	{
		float _931 = BBS_892 * 5.00000000e-01;
		BBS_892 = _931;
	}
	int i_933 = 1;
	while (float(i_933) < N_884)
	{
		{
			vec2 _946 = vec2(_630[int(i_933)]) * vec2(5.20833360e-04, 9.25925910e-04);
			vec2 _950 = vec2(_634[int(i_933)]) * vec2(5.20833360e-04, 9.25925910e-04);
			vec4 _955 = vec4(_946.x, _946.y, _950.x, _950.y);
			vec4 offset_956 = _955;
			uint _961 = V_xframecount % 2u;
			bool _963 = _961 == 0u;
			if (_963)
			{
				vec2 _967 = vec2(_651[int(i_933)]) * vec2(5.20833360e-04, 9.25925910e-04);
				vec2 _971 = vec2(_655[int(i_933)]) * vec2(5.20833360e-04, 9.25925910e-04);
				vec4 _976 = vec4(_967.x, _967.y, _971.x, _971.y);
				offset_956 = _976;
			}
			bool _981 = V_xFlare_Type == 4;
			if (_981)
			{
				vec2 _984 = vec2(offset_956.x, offset_956.y);
				vec2 _986 = _984 * vec2(BBS_892);
				vec2 _987 = texcoord + _986;
				vec4 _988 = texture(V_xSamplerBC, _987);
				vec3 _992 = _988.xyz * vec3(_676[int(i_933)]);
				vec3 _993 = GBloom_882 + _992;
				GBloom_882 = _993;
				float _995 = -(offset_956.x);
				float _997 = -(offset_956.y);
				vec2 _998 = vec2(_995, _997);
				vec2 _1000 = _998 * vec2(BBS_892);
				vec2 _1001 = texcoord + _1000;
				vec4 _1002 = texture(V_xSamplerBC, _1001);
				vec3 _1006 = _1002.xyz * vec3(_676[int(i_933)]);
				vec3 _1007 = GBloom_882 + _1006;
				GBloom_882 = _1007;
				vec2 _1010 = vec2(offset_956.z, offset_956.w);
				vec2 _1012 = _1010 * vec2(BBS_892);
				vec2 _1013 = texcoord + _1012;
				vec4 _1014 = texture(V_xSamplerBC, _1013);
				vec3 _1018 = _1014.xyz * vec3(_676[int(i_933)]);
				vec3 _1019 = GBloom_882 + _1018;
				GBloom_882 = _1019;
				float _1021 = -(offset_956.z);
				float _1023 = -(offset_956.w);
				vec2 _1024 = vec2(_1021, _1023);
				vec2 _1026 = _1024 * vec2(BBS_892);
				vec2 _1027 = texcoord + _1026;
				vec4 _1028 = texture(V_xSamplerBC, _1027);
				vec3 _1032 = _1028.xyz * vec3(_676[int(i_933)]);
				vec3 _1033 = GBloom_882 + _1032;
				GBloom_882 = _1033;
			}
			else
			{
				bool _1038 = V_xFlare_Type == 5;
				if (_1038)
				{
					float _1040 = -(offset_956.x);
					vec2 _1042 = vec2(_1040, offset_956.y);
					vec2 _1044 = _1042 * vec2(BBS_892);
					vec2 _1045 = texcoord + _1044;
					vec4 _1046 = texture(V_xSamplerBC, _1045);
					vec3 _1050 = _1046.xyz * vec3(_676[int(i_933)]);
					vec3 _1051 = GBloom_882 + _1050;
					GBloom_882 = _1051;
					float _1053 = -(offset_956.y);
					vec2 _1055 = vec2(offset_956.x, _1053);
					vec2 _1057 = _1055 * vec2(BBS_892);
					vec2 _1058 = texcoord + _1057;
					vec4 _1059 = texture(V_xSamplerBC, _1058);
					vec3 _1063 = _1059.xyz * vec3(_676[int(i_933)]);
					vec3 _1064 = GBloom_882 + _1063;
					GBloom_882 = _1064;
					float _1066 = -(offset_956.z);
					vec2 _1068 = vec2(_1066, offset_956.w);
					vec2 _1070 = _1068 * vec2(BBS_892);
					vec2 _1071 = texcoord + _1070;
					vec4 _1072 = texture(V_xSamplerBC, _1071);
					vec3 _1076 = _1072.xyz * vec3(_676[int(i_933)]);
					vec3 _1077 = GBloom_882 + _1076;
					GBloom_882 = _1077;
					float _1079 = -(offset_956.w);
					vec2 _1081 = vec2(offset_956.z, _1079);
					vec2 _1083 = _1081 * vec2(BBS_892);
					vec2 _1084 = texcoord + _1083;
					vec4 _1085 = texture(V_xSamplerBC, _1084);
					vec3 _1089 = _1085.xyz * vec3(_676[int(i_933)]);
					vec3 _1090 = GBloom_882 + _1089;
					GBloom_882 = _1090;
				}
				else
				{
					vec2 _1093 = vec2(offset_956.x, offset_956.y);
					vec2 _1095 = _1093 * vec2(BBS_892);
					vec2 _1096 = texcoord + _1095;
					vec4 _1097 = texture(V_xSamplerBC, _1096);
					vec3 _1101 = _1097.xyz * vec3(_676[int(i_933)]);
					vec3 _1102 = GBloom_882 + _1101;
					GBloom_882 = _1102;
					float _1104 = -(offset_956.x);
					float _1106 = -(offset_956.y);
					vec2 _1107 = vec2(_1104, _1106);
					vec2 _1109 = _1107 * vec2(BBS_892);
					vec2 _1110 = texcoord + _1109;
					vec4 _1111 = texture(V_xSamplerBC, _1110);
					vec3 _1115 = _1111.xyz * vec3(_676[int(i_933)]);
					vec3 _1116 = GBloom_882 + _1115;
					GBloom_882 = _1116;
					float _1118 = -(offset_956.x);
					vec2 _1120 = vec2(_1118, offset_956.y);
					vec2 _1122 = _1120 * vec2(BBS_892);
					vec2 _1123 = texcoord + _1122;
					vec4 _1124 = texture(V_xSamplerBC, _1123);
					vec3 _1128 = _1124.xyz * vec3(_676[int(i_933)]);
					vec3 _1129 = GBloom_882 + _1128;
					GBloom_882 = _1129;
					float _1131 = -(offset_956.y);
					vec2 _1133 = vec2(offset_956.x, _1131);
					vec2 _1135 = _1133 * vec2(BBS_892);
					vec2 _1136 = texcoord + _1135;
					vec4 _1137 = texture(V_xSamplerBC, _1136);
					vec3 _1141 = _1137.xyz * vec3(_676[int(i_933)]);
					vec3 _1142 = GBloom_882 + _1141;
					GBloom_882 = _1142;
					vec2 _1145 = vec2(offset_956.z, offset_956.w);
					vec2 _1147 = _1145 * vec2(BBS_892);
					vec2 _1148 = texcoord + _1147;
					vec4 _1149 = texture(V_xSamplerBC, _1148);
					vec3 _1153 = _1149.xyz * vec3(_676[int(i_933)]);
					vec3 _1154 = GBloom_882 + _1153;
					GBloom_882 = _1154;
					float _1156 = -(offset_956.z);
					float _1158 = -(offset_956.w);
					vec2 _1159 = vec2(_1156, _1158);
					vec2 _1161 = _1159 * vec2(BBS_892);
					vec2 _1162 = texcoord + _1161;
					vec4 _1163 = texture(V_xSamplerBC, _1162);
					vec3 _1167 = _1163.xyz * vec3(_676[int(i_933)]);
					vec3 _1168 = GBloom_882 + _1167;
					GBloom_882 = _1168;
					float _1170 = -(offset_956.z);
					vec2 _1172 = vec2(_1170, offset_956.w);
					vec2 _1174 = _1172 * vec2(BBS_892);
					vec2 _1175 = texcoord + _1174;
					vec4 _1176 = texture(V_xSamplerBC, _1175);
					vec3 _1180 = _1176.xyz * vec3(_676[int(i_933)]);
					vec3 _1181 = GBloom_882 + _1180;
					GBloom_882 = _1181;
					float _1183 = -(offset_956.w);
					vec2 _1185 = vec2(offset_956.z, _1183);
					vec2 _1187 = _1185 * vec2(BBS_892);
					vec2 _1188 = texcoord + _1187;
					vec4 _1189 = texture(V_xSamplerBC, _1188);
					vec3 _1193 = _1189.xyz * vec3(_676[int(i_933)]);
					vec3 _1194 = GBloom_882 + _1193;
					GBloom_882 = _1194;
				}
			}
		}
		int _942 = i_933 + 1;
		i_933 = _942;
	}
	vec3 _1196 = GBloom_882 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	GBloom_882 = _1196;
	return GBloom_882;
}
void F_xGlammor_Out(
	in vec4 position,
	in vec2 texcoord,
	out vec3 GBloom)
{
	GBloom = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float GI = V_xFlare_Power;
	vec4 _1205 = texture(V_xSamplerAvgLumG, vec2(0.00000000e+00, 0.00000000e+00));
	float _1208 = 1.00000000e+00 - _1205.x;
	float _1211 = smoothstep(0.00000000e+00, 1.00000000e+00, _1208);
	float AL = _1211;
	if (V_xAuto_Flare_Intensity)
	{
		float _1216 = GI * AL;
		GI = _1216;
	}
	vec2 _1217;
	_1217 = texcoord;
	vec3 _1218 = F_xGlammorA(_1217);
	vec2 _1219;
	_1219 = texcoord;
	vec3 _1220 = F_xGlammorB(_1219);
	vec3 _1221 = _1218 + _1220;
	vec3 _1223 = _1221 * vec3(GI);
	GBloom = _1223;
	return;
}
vec2 F_xBD(
	in vec2 p,
	in float k1)
{
	bool _1232 = !bool(bool(V_xCA_Type));
	bool _1235 = int(_1232) == 1;
	if (_1235)
	{
		discard;
		return vec2(0.00000000e+00, 0.00000000e+00);
	}
	vec2 _1237 = p * vec2(1.00000000e+00, 1.00000000e+00);
	p = _1237;
	vec2 _1239 = vec2(2.00000000e+00, 2.00000000e+00) * p;
	vec2 _1241 = _1239 - vec2(1.00000000e+00, 1.00000000e+00);
	vec2 _1243 = _1241 / vec2(1.00000000e+00, 1.00000000e+00);
	p = _1243;
	float _1246 = p.x * p.x;
	float _1249 = p.y * p.y;
	float _1250 = _1246 + _1249;
	float r2 = _1250;
	float _1253 = pow(r2, 2.00000000e+00);
	float r4 = _1253;
	float _1255 = k1 * r2;
	float _1257 = 1.00000000e+00 + _1255;
	float _1259 = p.x * _1257;
	float x2 = _1259;
	float _1261 = k1 * r2;
	float _1263 = 1.00000000e+00 + _1261;
	float _1265 = p.y * _1263;
	float y2 = _1265;
	float _1268 = x2 + 1.00000000e+00;
	float _1270 = _1268 * 1.00000000e+00;
	float _1272 = _1270 / 2.00000000e+00;
	p[0] = _1272;
	float _1274 = y2 + 1.00000000e+00;
	float _1276 = _1274 * 1.00000000e+00;
	float _1278 = _1276 / 2.00000000e+00;
	p[1] = _1278;
	return p;
}
vec2 F_xHVP(
	in vec2 texcoord,
	in float k1)
{
	bool _1287 = !bool(bool(V_xCA_Type));
	bool _1290 = int(_1287) == 2;
	if (_1290)
	{
		discard;
		return vec2(0.00000000e+00, 0.00000000e+00);
	}
	float X = k1;
	float Y = k1;
	float _1294 = X - 1.00000000e+00;
	float _1296 = _1294 * 9.60000000e+02;
	float _1298 = _1296 * 5.20833360e-04;
	float midW = _1298;
	float _1301 = Y - 1.00000000e+00;
	float _1303 = _1301 * 5.40000000e+02;
	float _1305 = _1303 * 9.25925910e-04;
	float midH = _1305;
	float _1308 = texcoord.x * X;
	float _1309 = _1308 - midW;
	float _1311 = texcoord.y * Y;
	float _1312 = _1311 - midH;
	vec2 _1313 = vec2(_1309, _1312);
	return _1313;
}
vec2 F_xHP(
	in vec2 texcoord,
	in float k1)
{
	bool _1322 = !bool(bool(V_xCA_Type));
	bool _1325 = int(_1322) == 3;
	if (_1325)
	{
		discard;
		return vec2(0.00000000e+00, 0.00000000e+00);
	}
	float X_1326 = k1;
	float Y_1328 = 1.00000000e+00;
	float _1330 = X_1326 - 1.00000000e+00;
	float _1332 = _1330 * 9.60000000e+02;
	float _1334 = _1332 * 5.20833360e-04;
	float midW_1335 = _1334;
	float _1337 = Y_1328 - 1.00000000e+00;
	float _1339 = _1337 * 5.40000000e+02;
	float _1341 = _1339 * 9.25925910e-04;
	float midH_1342 = _1341;
	float _1344 = texcoord.x * X_1326;
	float _1345 = _1344 - midW_1335;
	float _1347 = texcoord.y * Y_1328;
	float _1348 = _1347 - midH_1342;
	vec2 _1349 = vec2(_1345, _1348);
	return _1349;
}
vec2 F_xVP(
	in vec2 texcoord,
	in float k1)
{
	bool _1358 = !bool(bool(V_xCA_Type));
	bool _1361 = int(_1358) == 4;
	if (_1361)
	{
		discard;
		return vec2(0.00000000e+00, 0.00000000e+00);
	}
	float X_1363 = 1.00000000e+00;
	float Y_1364 = k1;
	float _1366 = X_1363 - 1.00000000e+00;
	float _1368 = _1366 * 9.60000000e+02;
	float _1370 = _1368 * 5.20833360e-04;
	float midW_1371 = _1370;
	float _1373 = Y_1364 - 1.00000000e+00;
	float _1375 = _1373 * 5.40000000e+02;
	float _1377 = _1375 * 9.25925910e-04;
	float midH_1378 = _1377;
	float _1380 = texcoord.x * X_1363;
	float _1381 = _1380 - midW_1371;
	float _1383 = texcoord.y * Y_1364;
	float _1384 = _1383 - midH_1378;
	vec2 _1385 = vec2(_1381, _1384);
	return _1385;
}
vec3 F_xCAFlare(
	in vec2 texcoord)
{
	vec2 uv_red = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 uv_green = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 uv_blue = vec2(0.00000000e+00, 0.00000000e+00);
	float DM_1396 = 0.00000000e+00;
	float color_red = 0.00000000e+00;
	float color_green = 0.00000000e+00;
	float color_blue = 0.00000000e+00;
	float K1_Red = V_xFlare_PBD.x;
	float K1_Green = V_xFlare_PBD.y;
	float K1_Blue = V_xFlare_PBD.z;
	bool _1413 = V_xCA_Type == 1;
	if (_1413)
	{
		float _1415 = K1_Red * 2.99999993e-02;
		vec2 _1416;
		float _1417;
		_1416 = texcoord.xy;
		_1417 = _1415;
		vec2 _1419 = F_xBD(_1416, _1417);
		uv_red = _1419;
		float _1421 = K1_Green * 2.99999993e-02;
		vec2 _1422;
		float _1423;
		_1422 = texcoord.xy;
		_1423 = _1421;
		vec2 _1425 = F_xBD(_1422, _1423);
		uv_green = _1425;
		float _1427 = K1_Blue * 2.99999993e-02;
		vec2 _1428;
		float _1429;
		_1428 = texcoord.xy;
		_1429 = _1427;
		vec2 _1431 = F_xBD(_1428, _1429);
		uv_blue = _1431;
	}
	else
	{
		bool _1436 = V_xCA_Type == 2;
		if (_1436)
		{
			float _1438 = K1_Red * 2.50000004e-02;
			float _1440 = 1.00000000e+00 - _1438;
			vec2 _1441;
			float _1442;
			_1441 = texcoord.xy;
			_1442 = _1440;
			vec2 _1444 = F_xHVP(_1441, _1442);
			uv_red = _1444;
			float _1446 = K1_Green * 2.50000004e-02;
			float _1448 = 1.00000000e+00 - _1446;
			vec2 _1449;
			float _1450;
			_1449 = texcoord.xy;
			_1450 = _1448;
			vec2 _1452 = F_xHVP(_1449, _1450);
			uv_green = _1452;
			float _1454 = K1_Blue * 2.50000004e-02;
			float _1456 = 1.00000000e+00 - _1454;
			vec2 _1457;
			float _1458;
			_1457 = texcoord.xy;
			_1458 = _1456;
			vec2 _1460 = F_xHVP(_1457, _1458);
			uv_blue = _1460;
		}
		else
		{
			bool _1465 = V_xCA_Type == 3;
			if (_1465)
			{
				float _1467 = K1_Red * 2.50000004e-02;
				float _1469 = 1.00000000e+00 - _1467;
				vec2 _1470;
				float _1471;
				_1470 = texcoord.xy;
				_1471 = _1469;
				vec2 _1473 = F_xHP(_1470, _1471);
				uv_red = _1473;
				float _1475 = K1_Green * 2.50000004e-02;
				float _1477 = 1.00000000e+00 - _1475;
				vec2 _1478;
				float _1479;
				_1478 = texcoord.xy;
				_1479 = _1477;
				vec2 _1481 = F_xHP(_1478, _1479);
				uv_green = _1481;
				float _1483 = K1_Blue * 2.50000004e-02;
				float _1485 = 1.00000000e+00 - _1483;
				vec2 _1486;
				float _1487;
				_1486 = texcoord.xy;
				_1487 = _1485;
				vec2 _1489 = F_xHP(_1486, _1487);
				uv_blue = _1489;
			}
			else
			{
				bool _1494 = V_xCA_Type == 4;
				if (_1494)
				{
					float _1496 = K1_Red * 2.50000004e-02;
					float _1498 = 1.00000000e+00 - _1496;
					vec2 _1499;
					float _1500;
					_1499 = texcoord.xy;
					_1500 = _1498;
					vec2 _1502 = F_xVP(_1499, _1500);
					uv_red = _1502;
					float _1504 = K1_Green * 2.50000004e-02;
					float _1506 = 1.00000000e+00 - _1504;
					vec2 _1507;
					float _1508;
					_1507 = texcoord.xy;
					_1508 = _1506;
					vec2 _1510 = F_xVP(_1507, _1508);
					uv_green = _1510;
					float _1512 = K1_Blue * 2.50000004e-02;
					float _1514 = 1.00000000e+00 - _1512;
					vec2 _1515;
					float _1516;
					_1515 = texcoord.xy;
					_1516 = _1514;
					vec2 _1518 = F_xVP(_1515, _1516);
					uv_blue = _1518;
				}
			}
		}
	}
	bool _1523 = V_xCA_Type > 0;
	if (_1523)
	{
		vec4 _1528 = vec4(uv_red.x, uv_red.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1529 = textureLod(V_xSamplerGlammor, _1528.xy, _1528.w);
		color_red = _1529.x;
		vec4 _1535 = vec4(uv_green.x, uv_green.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1536 = textureLod(V_xSamplerGlammor, _1535.xy, _1535.w);
		color_green = _1536.y;
		vec4 _1542 = vec4(uv_blue.x, uv_blue.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1543 = textureLod(V_xSamplerGlammor, _1542.xy, _1542.w);
		color_blue = _1543.z;
	}
	else
	{
		vec4 _1549 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1550 = textureLod(V_xSamplerGlammor, _1549.xy, _1549.w);
		color_red = _1550.x;
		vec4 _1556 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1557 = textureLod(V_xSamplerGlammor, _1556.xy, _1556.w);
		color_green = _1557.y;
		vec4 _1563 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _1564 = textureLod(V_xSamplerGlammor, _1563.xy, _1563.w);
		color_blue = _1564.z;
	}
	vec3 _1566 = vec3(color_red, color_green, color_blue);
	return _1566;
}
void F_xPS_StoreAvgLumaF(
	in vec4 position,
	in vec2 texcoord,
	out float Stored,
	out vec3 Shared)
{
	vec4 _1573 = texture(V_xSamplerAvgLumG, texcoord);
	Stored = _1573.x;
	vec2 _1575;
	_1575 = texcoord;
	vec3 _1576 = F_xCAFlare(_1575);
	vec4 _1577 = texture(V_xSamplerPastFlare, texcoord);
	vec3 _1579 = _1576 + _1577.xyz;
	Shared = _1579;
	return;
}
vec3 F_xShaderGlammor(
	in vec2 texcoord)
{
	float DM_1584 = 0.00000000e+00;
	vec2 _1585;
	_1585 = texcoord;
	vec4 _1586 = F_xBB(_1585);
	vec3 Color = _1586.xyz;
	vec2 _1589;
	_1589 = texcoord;
	vec3 _1590 = F_xCAFlare(_1589);
	vec4 _1591 = texture(V_xSamplerPastFlare, texcoord);
	vec3 _1593 = _1590 + _1591.xyz;
	vec3 FBloom = _1593;
	vec3 _1595 = abs(Color);
	vec3 _1597 = pow(_1595, vec3(2.20000005e+00, 2.20000005e+00, 2.20000005e+00));
	Color = _1597;
	vec3 _1598 = Color + FBloom;
	Color = _1598;
	vec3 _1599 = abs(Color);
	float _1601 = 1.0 / 2.20000005e+00;
	vec3 _1603 = pow(_1599, vec3(_1601));
	Color = _1603;
	return Color;
}
void F_xPast_Flare(
	in vec4 position,
	in vec2 texcoord,
	out vec3 Stored)
{
	vec2 _1609;
	_1609 = texcoord;
	vec3 _1610 = F_xCAFlare(_1609);
	Stored = _1610;
	return;
}
void F_xA1(
	in vec2 texcoord,
	in float PosX,
	in float PosY,
	inout float I,
	inout float N,
	inout float F,
	inout float O)
{
	float _1621 = 1.54999997e-02 + PosX;
	float PosXI = _1621;
	float _1624 = 4.00000019e-03 + PosY;
	float PosYI = _1624;
	float _1627 = 8.00000038e-03 + PosY;
	float PosYII = _1627;
	float _1630 = texcoord.x - PosXI;
	float _1632 = texcoord.y - PosY;
	vec2 _1633 = vec2(_1630, _1632);
	vec2 _1634 = abs(_1633);
	bvec2 _1636 = lessThan(_1634, vec2(3.00000003e-03, 1.00000005e-03));
	bool _1637 = all(_1636);
	I = float(_1637);
	float _1640 = texcoord.x - PosXI;
	float _1642 = texcoord.y - PosYI;
	vec2 _1643 = vec2(_1640, _1642);
	vec2 _1644 = abs(_1643);
	bvec2 _1646 = lessThan(_1644, vec2(6.24999986e-04, 4.99999989e-03));
	bool _1647 = all(_1646);
	float _1649 = I + float(_1647);
	I = _1649;
	float _1651 = texcoord.x - PosXI;
	float _1653 = texcoord.y - PosYII;
	vec2 _1654 = vec2(_1651, _1653);
	vec2 _1655 = abs(_1654);
	bvec2 _1657 = lessThan(_1655, vec2(3.00000003e-03, 1.00000005e-03));
	bool _1658 = all(_1657);
	float _1660 = I + float(_1658);
	I = _1660;
	float _1662 = 2.25000009e-02 + PosX;
	float PosXN = _1662;
	float _1665 = 4.99999989e-03 + PosY;
	float PosYN = _1665;
	float offsetN = -1.00000005e-03;
	float _1670 = texcoord.x - PosXN;
	float _1672 = texcoord.y - PosYN;
	vec2 _1673 = vec2(_1670, _1672);
	vec2 _1674 = abs(_1673);
	bvec2 _1676 = lessThan(_1674, vec2(2.00000009e-03, 4.00000019e-03));
	bool _1677 = all(_1676);
	N = float(_1677);
	float _1680 = texcoord.x - PosXN;
	float _1682 = texcoord.y - PosYN;
	float _1683 = _1682 - offsetN;
	vec2 _1684 = vec2(_1680, _1683);
	vec2 _1685 = abs(_1684);
	bvec2 _1687 = lessThan(_1685, vec2(3.00000003e-03, 4.99999989e-03));
	bool _1688 = all(_1687);
	float _1690 = N - float(_1688);
	N = _1690;
	float _1692 = 2.89999992e-02 + PosX;
	float PosXF = _1692;
	float _1695 = 4.00000019e-03 + PosY;
	float PosYF = _1695;
	float offsetF = 5.00000024e-04;
	float offsetF1 = 1.00000005e-03;
	float _1702 = texcoord.x - PosXF;
	float _1703 = _1702 - offsetF;
	float _1705 = texcoord.y - PosYF;
	float _1706 = _1705 - offsetF1;
	vec2 _1707 = vec2(_1703, _1706);
	vec2 _1708 = abs(_1707);
	bvec2 _1710 = lessThan(_1708, vec2(2.00000009e-03, 4.00000019e-03));
	bool _1711 = all(_1710);
	F = float(_1711);
	float _1714 = texcoord.x - PosXF;
	float _1716 = texcoord.y - PosYF;
	vec2 _1717 = vec2(_1714, _1716);
	vec2 _1718 = abs(_1717);
	bvec2 _1720 = lessThan(_1718, vec2(2.49999994e-03, 4.99999989e-03));
	bool _1721 = all(_1720);
	float _1723 = F - float(_1721);
	F = _1723;
	float _1725 = texcoord.x - PosXF;
	float _1727 = texcoord.y - PosYF;
	vec2 _1728 = vec2(_1725, _1727);
	vec2 _1729 = abs(_1728);
	bvec2 _1731 = lessThan(_1729, vec2(1.50000001e-03, 7.50000007e-04));
	bool _1732 = all(_1731);
	float _1734 = F + float(_1732);
	F = _1734;
	float _1736 = 3.50000001e-02 + PosX;
	float PosXO = _1736;
	float _1739 = 4.00000019e-03 + PosY;
	float PosYO = _1739;
	float _1742 = texcoord.x - PosXO;
	float _1744 = texcoord.y - PosYO;
	vec2 _1745 = vec2(_1742, _1744);
	vec2 _1746 = abs(_1745);
	bvec2 _1748 = lessThan(_1746, vec2(3.00000003e-03, 4.99999989e-03));
	bool _1749 = all(_1748);
	O = float(_1749);
	float _1752 = texcoord.x - PosXO;
	float _1754 = texcoord.y - PosYO;
	vec2 _1755 = vec2(_1752, _1754);
	vec2 _1756 = abs(_1755);
	bvec2 _1758 = lessThan(_1756, vec2(2.00000009e-03, 3.00000003e-03));
	bool _1759 = all(_1758);
	float _1761 = O - float(_1759);
	O = _1761;
	return;
}
vec4 F_xOutF(
	in vec4 position,
	in vec2 texcoord)
{
	vec2 _1766;
	_1766 = texcoord;
	vec3 _1767 = F_xShaderGlammor(_1766);
	vec3 Color_1769 = _1767.xyz;
	float PosX_1771 = 9.52499986e-01;
	float PosY_1773 = 9.74999964e-01;
	float A = 0.00000000e+00;
	float B = 0.00000000e+00;
	float C = 0.00000000e+00;
	float D_1781 = 0.00000000e+00;
	float E_1783 = 0.00000000e+00;
	float F_1785 = 0.00000000e+00;
	float G = 0.00000000e+00;
	float H_1789 = 0.00000000e+00;
	float I_1791 = 0.00000000e+00;
	float J = 0.00000000e+00;
	float K = 0.00000000e+00;
	float L_1797 = 0.00000000e+00;
	float _1799 = 1.09999999e-02 + PosX_1771;
	float PosXDot = _1799;
	float _1802 = 8.00000038e-03 + PosY_1773;
	float PosYDot = _1802;
	float _1805 = texcoord.x - PosXDot;
	float _1807 = texcoord.y - PosYDot;
	vec2 _1808 = vec2(_1805, _1807);
	vec2 _1809 = abs(_1808);
	bvec2 _1811 = lessThan(_1809, vec2(7.50000007e-04, 1.50000001e-03));
	bool _1812 = all(_1811);
	L_1797 = float(_1812);
	vec2 _1814;
	float _1815;
	float _1816;
	float _1817;
	float _1818;
	float _1819;
	float _1820;
	float _1821;
	float _1822;
	float _1823;
	_1814 = texcoord;
	_1815 = PosX_1771;
	_1816 = PosY_1773;
	_1817 = A;
	_1818 = B;
	_1819 = C;
	_1820 = D_1781;
	_1821 = E_1783;
	_1822 = F_1785;
	_1823 = G;
	F_xA0(_1814, _1815, _1816, _1817, _1818, _1819, _1820, _1821, _1822, _1823);
	A = _1817;
	B = _1818;
	C = _1819;
	D_1781 = _1820;
	E_1783 = _1821;
	F_1785 = _1822;
	G = _1823;
	vec2 _1825;
	float _1826;
	float _1827;
	float _1828;
	float _1829;
	float _1830;
	float _1831;
	_1825 = texcoord;
	_1826 = PosX_1771;
	_1827 = PosY_1773;
	_1828 = H_1789;
	_1829 = I_1791;
	_1830 = J;
	_1831 = K;
	F_xA1(_1825, _1826, _1827, _1828, _1829, _1830, _1831);
	H_1789 = _1828;
	I_1791 = _1829;
	J = _1830;
	K = _1831;
	bool _1834 = V_xtimer <= 1.25000000e+04;
	float _1835 = A + B;
	float _1836 = _1835 + C;
	float _1837 = _1836 + D_1781;
	float _1838 = _1837 + E_1783;
	float _1839 = _1838 + F_1785;
	float _1840 = _1839 + G;
	float _1841 = _1840 + H_1789;
	float _1842 = _1841 + I_1791;
	float _1843 = _1842 + J;
	float _1844 = _1843 + K;
	float _1845 = _1844 + L_1797;
	vec4 _1850 = vec4(Color_1769.x, Color_1769.y, Color_1769.z, 1.00000000e+00);
	vec4 _1853 = compCond(bvec4(vec4(_1845)), vec4(1.99999996e-02, 1.99999996e-02, 1.99999996e-02, 1.99999996e-02), _1850);
	vec4 _1858 = vec4(Color_1769.x, Color_1769.y, Color_1769.z, 1.00000000e+00);
	vec4 _1860 = compCond(bvec4(_1834), _1853, _1858);
	return _1860;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _1867 = id == 2u;
	float _1870 = _1867 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _1870;
	bool _1872 = id == 1u;
	float _1875 = _1872 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _1875;
	vec2 _1877 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _1879 = _1877 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _1884 = vec4(_1879.x, _1879.y, 0.00000000e+00, 1.00000000e+00);
	position = _1884;
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
#ifdef E_xColorBB
in vec2 vv_0;
layout(location = 0) out vec3 _out_MBB;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 MBB;
	F_xColorBB(position, texcoord, MBB);
	_out_MBB = MBB;
	return;
}
#endif
#ifdef E_xPast_Flare
in vec2 vv_0;
layout(location = 0) out vec3 _out_Stored;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 Stored;
	F_xPast_Flare(position, texcoord, Stored);
	_out_Stored = Stored;
	return;
}
#endif
#ifdef E_xStoredBB
in vec2 vv_0;
layout(location = 0) out vec3 _out_BC;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 BC;
	F_xStoredBB(position, texcoord, BC);
	_out_BC = BC;
	return;
}
#endif
#ifdef E_xGlammor_Out
in vec2 vv_0;
layout(location = 0) out vec3 _out_GBloom;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 GBloom;
	F_xGlammor_Out(position, texcoord, GBloom);
	_out_GBloom = GBloom;
	return;
}
#endif
#ifdef E_xLuminanceG
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xLuminanceG(pos, texcoord);
	return;
}
#endif
#ifdef E_xAverage_LuminanceF
layout(location = 0) out float _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xAverage_LuminanceF(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_StoreAvgLumaF
in vec2 vv_0;
layout(location = 0) out float _out_Stored;
layout(location = 1) out vec3 _out_Shared;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	float Stored;
	vec3 Shared;
	F_xPS_StoreAvgLumaF(position, texcoord, Stored, Shared);
	_out_Stored = Stored;
	_out_Shared = Shared;
	return;
}
#endif
#ifdef E_xOutF
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xOutF(position, texcoord);
	return;
}
#endif
