#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xBuffers_A
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
uniform float V_xBG;
uniform float V_xSSC;
uniform float V_xHMP;
uniform float V_xElevation;
uniform bool V_xI_Ice;
uniform float V_xDepth_Map_Adjust;
uniform uint V_xframecount;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xCSnowMask;
uniform sampler2D V_xN_Sampler_A;
uniform sampler2D V_xN_Sampler_B;
uniform sampler2D V_xCDBuffer;
uniform sampler2D V_xBumpMap;
const vec2 _205[12] = vec2[12](vec2(-3.26211989e-01, -4.05804992e-01), vec2(-8.40143979e-01, -7.35799968e-02), vec2(-6.95913970e-01, 4.57136989e-01), vec2(-2.03345001e-01, 6.20715976e-01), vec2(9.62339997e-01, -1.94983006e-01), vec2(4.73434001e-01, -4.80026007e-01), vec2(5.19456029e-01, 7.67022014e-01), vec2(1.85461000e-01, -8.93123984e-01), vec2(5.07430971e-01, 6.44249991e-02), vec2(8.96420002e-01, 4.12458003e-01), vec2(-3.21940005e-01, -9.32614982e-01), vec2(-7.91558981e-01, -5.97705007e-01));
const vec2 _256[8] = vec2[8](vec2(2.50000000e-01, 5.00000000e-01), vec2(5.00000000e-01, 2.50000000e-01), vec2(5.00000000e-01, 5.00000000e-01), vec2(5.00000000e-01, 7.50000000e-01), vec2(7.50000000e-01, 5.00000000e-01), vec2(2.50000000e-01, 7.50000000e-01), vec2(7.50000000e-01, 7.50000000e-01), vec2(5.00000000e-01, 1.25000000e-01));
const vec2 _516[4] = vec2[4](vec2(5.20833360e-04, 0.00000000e+00), vec2(-5.20833360e-04, 0.00000000e+00), vec2(0.00000000e+00, 9.25925910e-04), vec2(0.00000000e+00, -9.25925910e-04));
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
float F_xfmod(
	in float a,
	in float b)
{
	float _86 = a / b;
	float _87 = abs(_86);
	float _88 = fract(_87);
	float _89 = abs(b);
	float _90 = _88 * _89;
	float c = _90;
	bool _93 = a < 0.00000000e+00;
	float _94 = -(c);
	float _95 = _93 ? _94 : c;
	return _95;
}
vec2 F_xDepthM(
	in vec2 texcoord)
{
	vec2 _99;
	_99 = texcoord;
	float _100 = F_xReShade_xGetLinearizedDepth(_99);
	float zBuffer = _100;
	float _103 = smoothstep(0.00000000e+00, V_xDepth_Map_Adjust, zBuffer);
	zBuffer = _103;
	float _105 = 1.00000000e+00 - zBuffer;
	float _107 = _105 - 5.00000000e-01;
	float _109 = _107 / 5.00000000e-01;
	vec2 _110 = vec2(zBuffer, _109);
	return _110;
}
vec4 F_xBB_H(
	in vec2 TC)
{
	vec4 _114 = texture(V_xBackBuffer, TC);
	return _114;
}
vec3 F_xDepthNormals(
	in vec2 texcoord)
{
	vec3 offset = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec2 posCenter = texcoord.xy;
	vec2 _123 = posCenter - offset.zy;
	vec2 posNorth = _123;
	vec2 _126 = posCenter + offset.xz;
	vec2 posEast = _126;
	vec2 _129 = posCenter - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _133 = vec3(_129.x, _129.y, 1.00000000e+00);
	vec2 _134;
	_134 = posCenter;
	vec2 _135 = F_xDepthM(_134);
	vec3 _137 = _133 * vec3(_135.x);
	vec3 vertCenter = _137;
	vec2 _140 = posNorth - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _144 = vec3(_140.x, _140.y, 1.00000000e+00);
	vec2 _145;
	_145 = posNorth;
	vec2 _146 = F_xDepthM(_145);
	vec3 _148 = _144 * vec3(_146.x);
	vec3 vertNorth = _148;
	vec2 _151 = posEast - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _155 = vec3(_151.x, _151.y, 1.00000000e+00);
	vec2 _156;
	_156 = posEast;
	vec2 _157 = F_xDepthM(_156);
	vec3 _159 = _155 * vec3(_157.x);
	vec3 vertEast = _159;
	vec3 _161 = vertCenter - vertNorth;
	vec3 _162 = vertCenter - vertEast;
	vec3 _163 = cross(_161, _162);
	vec3 _164 = normalize(_163);
	return _164;
}
void F_xMCNoise(
	inout float Noise,
	in vec2 TC,
	in float FC,
	in float seed)
{
	float motion = FC;
	float a_173 = 1.29898005e+01;
	float b_175 = 7.82330017e+01;
	float c_177 = 4.37585469e+04;
	vec2 _180 = TC.xy * vec2(2.00000000e+00, 2.00000000e+00);
	vec2 _181 = vec2(a_173, b_175);
	float _182 = dot(_180, _181);
	float dt = _182;
	float _184;
	float _185;
	_184 = dt;
	_185 = 3.14159274e+00;
	float _187 = F_xfmod(_184, _185);
	float sn = _187;
	float _189 = seed + dt;
	float _190 = sn * _189;
	vec2 _191 = vec2(a_173, b_175);
	float _193 = distance(vec2(_190), _191);
	float _194 = tan(_193);
	float _195 = _194 * c_177;
	float _196 = fract(_195);
	float _198 = 6.18034005e-01 * motion;
	float _199 = _196 + _198;
	float _200 = fract(_199);
	Noise = _200;
	return;
}
float F_xLumaMask(
	in sampler2D Texture,
	in vec2 texcoord)
{
	vec2 samples[12] = _205;
	int MipM = 5;
	vec4 _213 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, float(MipM));
	vec4 _214 = textureLod(Texture, _213.xy, _213.w);
	vec4 sum = _214;
	int i = 0;
	while (i < 12)
	{
		{
			float Spread = 2.74999999e-02;
			vec2 _232 = vec2(Spread) * samples[int(i)];
			vec2 _233 = texcoord + _232;
			vec4 _238 = vec4(_233.x, _233.y, 0.00000000e+00, float(MipM));
			vec4 _239 = textureLod(Texture, _238.xy, _238.w);
			vec4 _240 = sum + _239;
			sum = _240;
		}
		int _226 = i;
		int _227 = _226 + 1;
		i = _227;
	}
	vec4 _242 = sum / vec4(1.30000000e+01, 1.30000000e+01, 1.30000000e+01, 1.30000000e+01);
	sum = _242;
	float _244 = dot(sum, vec4(3.33000004e-01, 3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	return _244;
}
vec4 F_xMask(
	in vec2 texcoord)
{
	vec4 _252 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _253 = textureLod(V_xN_Sampler_B, _252.xy, _252.w);
	vec3 Normals = _253.xyz;
	vec2 Location[8] = _256;
	float Best_Guess = 5.00000000e-01;
	float Center = 0.00000000e+00;
	float Above = 0.00000000e+00;
	float Below = 0.00000000e+00;
	float Left = 0.00000000e+00;
	float Right = 0.00000000e+00;
	float DL = 0.00000000e+00;
	float DR = 0.00000000e+00;
	float WAC = 0.00000000e+00;
	float WTF = 0.00000000e+00;
	vec2 _281;
	_281 = Location[2];
	vec2 _283 = F_xDepthM(_281);
	bool _285 = _283.x > V_xBG;
	if (_285)
	{
		Center = 1.00000000e+00;
	}
	vec2 _290;
	_290 = Location[1];
	vec2 _292 = F_xDepthM(_290);
	bool _294 = _292.x > V_xBG;
	if (_294)
	{
		Above = 1.00000000e+00;
	}
	vec2 _299;
	_299 = Location[3];
	vec2 _301 = F_xDepthM(_299);
	bool _303 = _301.x > V_xBG;
	if (_303)
	{
		Below = 1.00000000e+00;
	}
	vec2 _308;
	_308 = Location[0];
	vec2 _310 = F_xDepthM(_308);
	bool _312 = _310.x > V_xBG;
	if (_312)
	{
		Left = 1.00000000e+00;
	}
	vec2 _317;
	_317 = Location[4];
	vec2 _319 = F_xDepthM(_317);
	bool _321 = _319.x > V_xBG;
	if (_321)
	{
		Right = 1.00000000e+00;
	}
	vec2 _326;
	_326 = Location[5];
	vec2 _328 = F_xDepthM(_326);
	bool _330 = _328.x > V_xBG;
	if (_330)
	{
		DL = 1.00000000e+00;
	}
	vec2 _335;
	_335 = Location[6];
	vec2 _337 = F_xDepthM(_335);
	bool _339 = _337.x > V_xBG;
	if (_339)
	{
		DR = 1.00000000e+00;
	}
	vec2 _344;
	_344 = Location[7];
	vec2 _346 = F_xDepthM(_344);
	bool _348 = _346.x > V_xBG;
	if (_348)
	{
		WAC = 1.00000000e+00;
	}
	bool _354 = !bool(bool(Center));
	bool _356 = !bool(bool(Above));
	bool _357 = _354 && _356;
	bool _359 = !bool(bool(Below));
	bool _360 = _357 && _359;
	bool _362 = !bool(bool(Left));
	bool _363 = _360 && _362;
	bool _365 = !bool(bool(Right));
	bool _366 = _363 && _365;
	bool _368 = !bool(bool(DL));
	bool _369 = _366 && _368;
	bool _371 = !bool(bool(DR));
	bool _372 = _369 && _371;
	bool _374 = _372 && bool(WAC);
	if (_374)
	{
		Best_Guess = 2.50000000e-01;
	}
	bool _380 = !bool(bool(Center));
	bool _382 = _380 && bool(Above);
	bool _384 = !bool(bool(Below));
	bool _385 = _382 && _384;
	bool _387 = !bool(bool(Left));
	bool _388 = _385 && _387;
	bool _390 = !bool(bool(Right));
	bool _391 = _388 && _390;
	bool _393 = !bool(bool(DL));
	bool _394 = _391 && _393;
	bool _396 = !bool(bool(DR));
	bool _397 = _394 && _396;
	bool _399 = _397 && bool(WAC);
	if (_399)
	{
		Best_Guess = 1.25000000e-01;
	}
	bool _406 = bool(Center) && bool(Above);
	bool _408 = !bool(bool(Below));
	bool _409 = _406 && _408;
	bool _411 = !bool(bool(Left));
	bool _412 = _409 && _411;
	bool _414 = !bool(bool(Right));
	bool _415 = _412 && _414;
	bool _417 = !bool(bool(DL));
	bool _418 = _415 && _417;
	bool _420 = !bool(bool(DR));
	bool _421 = _418 && _420;
	bool _423 = _421 && bool(WAC);
	if (_423)
	{
		Best_Guess = 0.00000000e+00;
	}
	bool _429 = !bool(bool(Center));
	bool _431 = !bool(bool(Above));
	bool _432 = _429 && _431;
	bool _434 = !bool(bool(Below));
	bool _435 = _432 && _434;
	bool _437 = !bool(bool(Left));
	bool _438 = _435 && _437;
	bool _440 = !bool(bool(Right));
	bool _441 = _438 && _440;
	bool _443 = !bool(bool(DL));
	bool _444 = _441 && _443;
	bool _446 = !bool(bool(DR));
	bool _447 = _444 && _446;
	bool _449 = !bool(bool(WAC));
	bool _450 = _447 && _449;
	if (_450)
	{
		Best_Guess = 1.00000000e+00;
	}
	bool _457 = bool(Center) && bool(Above);
	bool _459 = _457 && bool(Below);
	bool _461 = _459 && bool(Left);
	bool _463 = _461 && bool(Right);
	bool _465 = !bool(bool(DL));
	bool _466 = _463 && _465;
	bool _468 = _466 && bool(DR);
	bool _470 = _468 && bool(WAC);
	if (_470)
	{
		Best_Guess = 6.25000000e-02;
	}
	bool _477 = bool(Center) && bool(Above);
	bool _479 = _477 && bool(Below);
	bool _481 = _479 && bool(Left);
	bool _483 = _481 && bool(Right);
	bool _485 = _483 && bool(DL);
	bool _487 = !bool(bool(DR));
	bool _488 = _485 && _487;
	bool _490 = _488 && bool(WAC);
	if (_490)
	{
		Best_Guess = 6.25000000e-02;
	}
	float _493 = dot(vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00), Normals);
	float Top = _493;
	float _496 = dot(vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00), Normals);
	float _497 = step(Best_Guess, _496);
	float Wall = _497;
	float _500 = 1.00000000e+00 - V_xSSC;
	float _501 = Top - Wall;
	float _503 = bool(WTF) ? Top : _501;
	float _505 = smoothstep(_500, 1.00000000e+00, _503);
	float Snow = _505;
	float Noise_508 = 0.00000000e+00;
	float _509;
	vec2 _510;
	float _511;
	float _512;
	_509 = Noise_508;
	_510 = texcoord;
	_511 = 1.00000000e+00;
	_512 = 1.00000000e+00;
	F_xMCNoise(_509, _510, _511, _512);
	Noise_508 = _509;
	vec2 Di[4] = _516;
	vec2 _518;
	_518 = texcoord;
	vec4 _519 = F_xBB_H(_518);
	vec3 _522 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _519.xyz;
	vec3 SN = _522;
	int i_525 = 0;
	while (i_525 < 4)
	{
		{
			vec2 _538 = Di[int(i_525)] * vec2(Noise_508);
			vec2 _540 = _538 * vec2(1.00000000e+01, 1.00000000e+01);
			vec2 _541 = texcoord + _540;
			vec2 _542;
			_542 = _541;
			vec4 _543 = F_xBB_H(_542);
			vec3 _546 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _543.xyz;
			vec3 _547 = SN + _546;
			SN = _547;
		}
		int _534 = i_525;
		int _535 = _534 + 1;
		i_525 = _535;
	}
	vec3 _549 = SN / vec3(5.00000000e+00, 5.00000000e+00, 5.00000000e+00);
	vec3 _550 = clamp(_549, 0.0, 1.0);
	float _552 = dot(_550, vec3(V_xHMP));
	float _553 = Top * _552;
	float HeightMap = _553;
	float _556 = 1.00000000e+00 - HeightMap;
	float _557 = V_xI_Ice ? _556 : HeightMap;
	HeightMap = _557;
	float _559 = mix(0.00000000e+00, HeightMap, Snow);
	vec4 _561 = vec4(Snow, _559, Snow, 1.00000000e+00);
	return _561;
}
float F_xBump(
	in vec2 TC)
{
	vec2 t = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 l = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 r = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 d = vec2(0.00000000e+00, 0.00000000e+00);
	vec2 MA = vec2(5.00000000e+00, 5.00000000e+00);
	vec2 UV = TC.xy;
	vec2 _578 = vec2(5.20833360e-04, 9.25925910e-04) * MA;
	vec2 SW = _578;
	vec3 NormalsFromHeightMap = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 NHM_A = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 NHM_B = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float Noise_587 = 0.00000000e+00;
	float _588;
	vec2 _589;
	float _590;
	float _591;
	_588 = Noise_587;
	_589 = TC;
	_590 = 1.00000000e+00;
	_591 = 1.00000000e+00;
	F_xMCNoise(_588, _589, _590, _591);
	Noise_587 = _588;
	float _597 = UV.y - SW.y;
	vec2 _599 = vec2(UV.x, _597);
	vec2 _600;
	_600 = _599;
	vec4 _601 = F_xMask(_600);
	t[0] = _601.y;
	float _605 = UV.y + SW.y;
	vec2 _607 = vec2(UV.x, _605);
	vec2 _608;
	_608 = _607;
	vec4 _609 = F_xMask(_608);
	d[0] = _609.y;
	float _613 = UV.x - SW.x;
	vec2 _615 = vec2(_613, UV.y);
	vec2 _616;
	_616 = _615;
	vec4 _617 = F_xMask(_616);
	l[0] = _617.y;
	float _621 = UV.x + SW.x;
	vec2 _623 = vec2(_621, UV.y);
	vec2 _624;
	_624 = _623;
	vec4 _625 = F_xMask(_624);
	r[0] = _625.y;
	vec2 _628 = SW * vec2(5.00000000e-01, 5.00000000e-01);
	SW = _628;
	float _631 = UV.y - SW.y;
	vec2 _633 = vec2(UV.x, _631);
	vec2 _634;
	_634 = _633;
	vec4 _635 = F_xMask(_634);
	t[1] = _635.y;
	float _639 = UV.y + SW.y;
	vec2 _641 = vec2(UV.x, _639);
	vec2 _642;
	_642 = _641;
	vec4 _643 = F_xMask(_642);
	d[1] = _643.y;
	float _647 = UV.x - SW.x;
	vec2 _649 = vec2(_647, UV.y);
	vec2 _650;
	_650 = _649;
	vec4 _651 = F_xMask(_650);
	l[1] = _651.y;
	float _655 = UV.x + SW.x;
	vec2 _657 = vec2(_655, UV.y);
	vec2 _658;
	_658 = _657;
	vec4 _659 = F_xMask(_658);
	r[1] = _659.y;
	float _663 = r.x - l.x;
	float _664 = -(_663);
	float _667 = t.x - d.x;
	float _668 = -(_667);
	vec2 _669 = vec2(_664, _668);
	vec2 _670 = -(_669);
	vec2 _672 = _670 * vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _674 = _672 + vec2(4.00000006e-01, 4.00000006e-01);
	vec3 _678 = vec3(_674.x, _674.y, 1.00000000e+00);
	NHM_A = _678;
	float _681 = r.y - l.y;
	float _682 = -(_681);
	float _685 = t.y - d.y;
	float _686 = -(_685);
	vec2 _687 = vec2(_682, _686);
	vec2 _688 = -(_687);
	vec2 _690 = _688 * vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _692 = _690 + vec2(4.00000006e-01, 4.00000006e-01);
	vec3 _696 = vec3(_692.x, _692.y, 1.00000000e+00);
	NHM_B = _696;
	vec3 _698 = mix(NHM_A, NHM_B, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	NormalsFromHeightMap = _698;
	float _700 = dot(vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01), NormalsFromHeightMap);
	float _701 = clamp(_700, 0.0, 1.0);
	return _701;
}
float F_xHeightMap(
	in vec2 TC)
{
	vec4 _709 = vec4(TC.x, TC.y, 0.00000000e+00, 1.00000000e+00);
	vec4 _710 = textureLod(V_xCSnowMask, _709.xy, _709.w);
	float HM1 = _710.y;
	vec4 _717 = vec4(TC.x, TC.y, 0.00000000e+00, 3.00000000e+00);
	vec4 _718 = textureLod(V_xCSnowMask, _717.xy, _717.w);
	float HM2 = _718.y;
	float _721 = HM1 + HM2;
	float _723 = _721 / 2.00000000e+00;
	float HM = _723;
	vec2 _725;
	_725 = TC;
	vec2 _726 = F_xDepthM(_725);
	float _728 = HM * _726.y;
	return _728;
}
vec2 F_xParallax(
	in vec2 Diverge,
	in vec2 Coordinates)
{
	vec2 TC_733 = Coordinates;
	float _734 = length(Diverge);
	float _735 = abs(_734);
	float D = _735;
	float _738 = D * 5.00000007e-02;
	float _739 = D + _738;
	float Cal_Steps = _739;
	float _742 = Cal_Steps * 2.00000000e+00;
	float _745 = clamp(_742, 1.00000000e+00, 2.55000000e+02);
	float Steps = _745;
	float _747 = 1.0 / Steps;
	float LayerDepth = _747;
	vec2 _750 = Diverge * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 MS = _750;
	vec2 _753 = MS * vec2(LayerDepth);
	vec2 deltaCoordinates = _753;
	vec2 ParallaxCoord = Coordinates;
	vec2 _756;
	_756 = ParallaxCoord;
	vec4 _757 = F_xMask(_756);
	float CurrentDepthMapValue = _757.x;
	float CurrentLayerDepth = 0.00000000e+00;
	int i_763 = 0;
	while (float(i_763) < Steps)
	{
		{
			bool _777 = CurrentDepthMapValue <= CurrentLayerDepth;
			if (_777)
			{
				break;
			}
			vec2 _778 = ParallaxCoord - deltaCoordinates;
			ParallaxCoord = _778;
			vec2 _779;
			_779 = ParallaxCoord;
			float _780 = F_xHeightMap(_779);
			CurrentDepthMapValue = _780;
			float _781 = CurrentLayerDepth + LayerDepth;
			CurrentLayerDepth = _781;
		}
		int _772 = i_763;
		int _773 = _772 + 1;
		i_763 = _773;
	}
	vec2 _782 = ParallaxCoord + deltaCoordinates;
	vec2 PrevParallaxCoord = _782;
	vec2 DepthDifference = vec2(0.00000000e+00, 0.00000000e+00);
	float _786 = CurrentDepthMapValue - CurrentLayerDepth;
	float afterDepthValue = _786;
	vec2 _788;
	_788 = ParallaxCoord;
	float _789 = F_xHeightMap(_788);
	float _790 = _789 - CurrentLayerDepth;
	float _791 = _790 + LayerDepth;
	float beforeDepthValue = _791;
	float _793 = afterDepthValue - beforeDepthValue;
	float _794 = afterDepthValue / _793;
	float weight = _794;
	float _797 = max(0.00000000e+00, weight);
	vec2 _799 = PrevParallaxCoord * vec2(_797);
	float _801 = 1.00000000e+00 - weight;
	float _803 = min(1.00000000e+00, _801);
	vec2 _805 = ParallaxCoord * vec2(_803);
	vec2 _806 = _799 + _805;
	ParallaxCoord = _806;
	return ParallaxCoord;
}
float F_xSSSS(
	in vec2 TC)
{
	vec2 Noise_811 = vec2(0.00000000e+00, 0.00000000e+00);
	vec4 _812 = texture(V_xBumpMap, TC);
	Noise_811[0] = _812.y;
	vec4 _814 = texture(V_xBumpMap, TC);
	Noise_811[1] = _814.z;
	float result = Noise_811.x;
	float _819 = result * Noise_811.y;
	result = _819;
	float _820 = abs(result);
	float _822 = pow(_820, 1.20000000e+01);
	result = _822;
	float _824 = 5.00000000e+00 * result;
	return _824;
}
void F_xOut(
	in vec4 position,
	in vec2 texcoord,
	out vec3 color)
{
	float _830 = -(V_xElevation);
	vec2 _831;
	_831 = texcoord;
	vec2 _832 = F_xDepthM(_831);
	float _834 = _830 * _832.y;
	vec2 _836 = vec2(0.00000000e+00, _834);
	vec2 _837;
	vec2 _838;
	_837 = _836;
	_838 = texcoord;
	vec2 _839 = F_xParallax(_837, _838);
	vec2 TC_841 = _839.xy;
	vec2 _842;
	_842 = TC_841.xy;
	vec4 _844 = F_xMask(_842);
	float Snow_846 = _844.x;
	vec4 _851 = vec4(TC_841.x, TC_841.y, 0.00000000e+00, 2.00000000e+00);
	vec4 _852 = textureLod(V_xBumpMap, _851.xy, _851.w);
	float SS = _852.w;
	vec3 Snow_Color = vec3(7.50000000e-01, 8.00000012e-01, 8.50000024e-01);
	vec2 _857;
	_857 = TC_841.xy;
	vec4 _859 = F_xMask(_857);
	float _862 = _859.x - 9.99999978e-03;
	vec3 _864 = vec3(_862) * Snow_Color;
	vec2 _867 = TC_841.xy * vec2(7.50000000e-01, 7.50000000e-01);
	vec2 _868;
	_868 = _867;
	float _869 = F_xSSSS(_868);
	vec3 _871 = _864 + vec3(_869);
	vec3 Snow_Scape = _871;
	vec2 _873;
	_873 = TC_841;
	float _874 = F_xLumaMask(V_xCDBuffer, _873);
	float _876 = _874 * 2.00000003e-01;
	vec3 _878 = Snow_Scape + vec3(_876);
	vec2 _879;
	_879 = TC_841.xy;
	vec4 _881 = F_xBB_H(_879);
	float _883 = 1.00000000e+00 - Snow_846;
	vec3 _886 = mix(_878, _881.xyz, vec3(_883));
	vec3 T_A_A = _886;
	float _889 = 1.00000000e+00 - Snow_846;
	float _891 = mix(SS, 1.00000000e+00, _889);
	vec3 _893 = T_A_A * vec3(_891);
	color = _893;
	return;
}
vec3 F_xSmoothNormals(
	in vec2 TC,
	in int NS,
	in int Dir,
	in float SNOffset)
{
	vec2 _900;
	_900 = TC;
	vec3 _901 = F_xDepthNormals(_900);
	vec4 _906 = vec4(TC.x, TC.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _907 = textureLod(V_xN_Sampler_A, _906.xy, _906.w);
	vec3 _910 = compCond(bvec3(ivec3(Dir)), _901, _907.xyz);
	vec2 _911;
	_911 = TC;
	vec2 _912 = F_xDepthM(_911);
	vec4 _917 = vec4(_910.x, _910.y, _910.z, _912.x);
	vec4 StoredNormals_Depth = _917;
	vec4 _923 = vec4(StoredNormals_Depth.xyz.x, StoredNormals_Depth.xyz.y, StoredNormals_Depth.xyz.z, 1.00000000e+00);
	vec4 SmoothedNormals = _923;
	int _925 = -(NS);
	float xy = float(_925);
	while (xy <= float(NS))
	{
		{
			float _944 = smoothstep(0.00000000e+00, 1.00000000e+00, StoredNormals_Depth.w);
			bool _946 = _944 > 9.99000013e-01;
			if (_946)
			{
				break;
			}
			vec2 _948 = vec2(xy, 0.00000000e+00);
			vec2 _950 = vec2(0.00000000e+00, xy);
			vec2 _952 = compCond(bvec2(ivec2(Dir)), _948, _950);
			vec2 XY = _952;
			vec2 _955 = XY * vec2(5.20833360e-04, 9.25925910e-04);
			vec2 _957 = _955 * vec2(SNOffset);
			vec2 _958 = TC + _957;
			vec2 offsetcoords = _958;
			vec2 _960;
			_960 = offsetcoords;
			vec3 _961 = F_xDepthNormals(_960);
			vec4 _966 = vec4(offsetcoords.x, offsetcoords.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _967 = textureLod(V_xN_Sampler_A, _966.xy, _966.w);
			vec3 _970 = compCond(bvec3(ivec3(Dir)), _961, _967.xyz);
			vec2 _971;
			_971 = offsetcoords;
			vec2 _972 = F_xDepthM(_971);
			vec4 _977 = vec4(_970.x, _970.y, _970.z, _972.x);
			vec4 Normals_Depth = _977;
			float _984 = StoredNormals_Depth.w - Normals_Depth.w;
			float _985 = abs(_984);
			bool _987 = _985 < 1.00000005e-03;
			float _990 = dot(Normals_Depth.xyz, StoredNormals_Depth.xyz);
			bool _992 = _990 > 5.00000000e-01;
			bool _993 = _987 && _992;
			if (_993)
			{
				vec3 _996 = SmoothedNormals.xyz + Normals_Depth.xyz;
				SmoothedNormals.xyz = _996;
				float _999 = SmoothedNormals.w + 1.00000000e+00;
				SmoothedNormals[3] = _999;
			}
		}
		float _936 = xy;
		float _937 = _936 + 1.00000000e+00;
		xy = _937;
	}
	vec3 _1002 = SmoothedNormals.xyz / vec3(SmoothedNormals.w);
	return _1002;
}
void F_xBuffers_A(
	in vec4 position,
	in vec2 texcoord,
	out vec4 Normals,
	out vec4 BackBuffer_Depth,
	out vec4 Snow_Info)
{
	vec2 _1010;
	int _1011;
	int _1012;
	float _1013;
	_1010 = texcoord;
	_1011 = 2;
	_1012 = 1;
	_1013 = 2.00000000e+00;
	vec3 _1017 = F_xSmoothNormals(_1010, _1011, _1012, _1013);
	Normals = _1017.xyzz;
	vec4 _1019 = texture(V_xBackBuffer, texcoord);
	vec2 _1020;
	_1020 = texcoord;
	vec2 _1021 = F_xDepthM(_1020);
	vec4 _1026 = vec4(_1019.xyz.x, _1019.xyz.y, _1019.xyz.z, _1021.x);
	BackBuffer_Depth = _1026;
	vec2 _1027;
	_1027 = texcoord;
	vec4 _1028 = F_xMask(_1027);
	vec4 _1033 = vec4(_1028.xyz.x, _1028.xyz.y, _1028.xyz.z, 0.00000000e+00);
	Snow_Info = _1033;
	return;
}
void F_xBuffers_B(
	in vec4 position,
	in vec2 texcoord,
	out vec4 Normals_LM)
{
	vec2 _1039;
	int _1040;
	int _1041;
	float _1042;
	_1039 = texcoord;
	_1040 = 2;
	_1041 = 0;
	_1042 = 2.00000000e+00;
	vec3 _1046 = F_xSmoothNormals(_1039, _1040, _1041, _1042);
	vec2 _1047;
	_1047 = texcoord;
	vec2 _1048 = F_xDepthM(_1047);
	vec4 _1053 = vec4(_1046.xyz.x, _1046.xyz.y, _1046.xyz.z, _1048.x);
	Normals_LM = _1053;
	return;
}
void F_xBuffers_C(
	in vec4 position,
	in vec2 texcoord,
	out vec4 BumpMap_Else)
{
	vec2 Noise_1060 = vec2(0.00000000e+00, 0.00000000e+00);
	float _1063 = float(V_xframecount) * -4.99999989e-03;
	float _1064;
	vec2 _1065;
	float _1066;
	float _1067;
	_1064 = Noise_1060.x;
	_1065 = texcoord;
	_1066 = _1063;
	_1067 = 1.00000000e+00;
	F_xMCNoise(_1064, _1065, _1066, _1067);
	Noise_1060[0] = _1064;
	float _1073 = float(V_xframecount) * 4.99999989e-03;
	float _1074;
	vec2 _1075;
	float _1076;
	float _1077;
	_1074 = Noise_1060.y;
	_1075 = texcoord;
	_1076 = _1073;
	_1077 = 2.00000000e+00;
	F_xMCNoise(_1074, _1075, _1076, _1077);
	Noise_1060[1] = _1074;
	vec2 _1081;
	_1081 = texcoord;
	float _1082 = F_xBump(_1081);
	vec4 _1086 = vec4(0.00000000e+00, Noise_1060.x, Noise_1060.y, _1082);
	BumpMap_Else = _1086;
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
#ifdef E_xBuffers_A
in vec2 vv_0;
layout(location = 0) out vec4 _out_Normals;
layout(location = 1) out vec4 _out_BackBuffer_Depth;
layout(location = 2) out vec4 _out_Snow_Info;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 Normals;
	vec4 BackBuffer_Depth;
	vec4 Snow_Info;
	F_xBuffers_A(position, texcoord, Normals, BackBuffer_Depth, Snow_Info);
	_out_Normals = Normals;
	_out_BackBuffer_Depth = BackBuffer_Depth;
	_out_Snow_Info = Snow_Info;
	return;
}
#endif
#ifdef E_xBuffers_B
in vec2 vv_0;
layout(location = 0) out vec4 _out_Normals_LM;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 Normals_LM;
	F_xBuffers_B(position, texcoord, Normals_LM);
	_out_Normals_LM = Normals_LM;
	return;
}
#endif
#ifdef E_xBuffers_C
in vec2 vv_0;
layout(location = 0) out vec4 _out_BumpMap_Else;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 BumpMap_Else;
	F_xBuffers_C(position, texcoord, BumpMap_Else);
	_out_BumpMap_Else = BumpMap_Else;
	return;
}
#endif
#ifdef E_xOut
in vec2 vv_0;
layout(location = 0) out vec3 _out_color;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 color;
	F_xOut(position, texcoord, color);
	_out_color = color;
	return;
}
#endif
