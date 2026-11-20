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
uniform float V_xShort_Edge_Mask;
uniform float V_xLong_Edge_Mask;
uniform float V_xText_Preservation;
uniform float V_xBlack_Preservation;
uniform int V_xView_Mode;
uniform uint V_xframecount;
uniform float V_xDelta;

uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xSamplerLoadedPixel;
float F_xfmod(
	in float a,
	in float b)
{
	float _12 = a / b;
	float _13 = abs(_12);
	float _14 = fract(_13);
	float _15 = abs(b);
	float _16 = _14 * _15;
	float c = _16;
	bool _19 = a < 0.00000000e+00;
	float _20 = -(c);
	float _21 = _19 ? _20 : c;
	return _21;
}
float F_xCB_Pattern(
	in vec2 TC)
{
	float _31 = TC.x * 1.92000000e+03;
	float _34 = TC.y * 1.08000000e+03;
	vec2 _35 = vec2(_31, _34);
	vec2 _36 = floor(_35);
	vec2 gridxy = _36;
	float _40 = gridxy.x + gridxy.y;
	float _41;
	float _42;
	_41 = _40;
	_42 = 2.00000000e+00;
	float _44 = F_xfmod(_41, _42);
	return _44;
}
float F_xLI(
	in vec3 value)
{
	float _50 = max(value.y, value.z);
	float _52 = max(value.x, _50);
	return _52;
}
vec4 F_xLP(
	in vec2 tc,
	in float dx,
	in float dy)
{
	vec2 _58 = vec2(dx, dy);
	vec2 _60 = _58 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _61 = tc + _60;
	vec4 _62 = texture(V_xBackBuffer, _61);
	vec4 BB = _62;
	return BB;
}
vec3 F_xSetInfo()
{
	bool _67 = V_xDelta == 0.00000000e+00;
	float _69 = _67 ? 0.00000000e+00 : V_xDelta;
	int _73 = false ? 1 : 25000;
	bool _75 = V_xDelta == 0.00000000e+00;
	bool _77 = _75 || false;
	int _80 = _77 ? -1 : 0;
	vec3 _83 = vec3(_69, float(_73), float(_80));
	return _83;
}
vec4 F_xPreFilter(
	in vec4 position,
	in vec2 texcoord)
{
	vec2 _88;
	float _89;
	float _90;
	_88 = texcoord;
	_89 = 0.00000000e+00;
	_90 = 0.00000000e+00;
	vec4 _93 = F_xLP(_88, _89, _90);
	vec4 Center = _93;
	vec2 _95;
	float _96;
	float _97;
	_95 = texcoord;
	_96 = -1.00000000e+00;
	_97 = 0.00000000e+00;
	vec4 _100 = F_xLP(_95, _96, _97);
	vec4 Left = _100;
	vec2 _102;
	float _103;
	float _104;
	_102 = texcoord;
	_103 = 1.00000000e+00;
	_104 = 0.00000000e+00;
	vec4 _107 = F_xLP(_102, _103, _104);
	vec4 Right = _107;
	vec2 _109;
	float _110;
	float _111;
	_109 = texcoord;
	_110 = 0.00000000e+00;
	_111 = -1.00000000e+00;
	vec4 _114 = F_xLP(_109, _110, _111);
	vec4 Up = _114;
	vec2 _116;
	float _117;
	float _118;
	_116 = texcoord;
	_117 = 0.00000000e+00;
	_118 = 1.00000000e+00;
	vec4 _121 = F_xLP(_116, _117, _118);
	vec4 Down = _121;
	vec4 _123 = Left + Right;
	vec4 _124 = _123 + Up;
	vec4 _125 = _124 + Down;
	vec4 _127 = vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00) * Center;
	vec4 _128 = _125 - _127;
	vec4 _129 = abs(_128);
	vec4 _131 = vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00) * _129;
	vec4 edges = _131;
	vec3 _133;
	_133 = edges.xyz;
	float _135 = F_xLI(_133);
	float edgesLum = _135;
	vec4 _140 = vec4(Center.xyz.x, Center.xyz.y, Center.xyz.z, edgesLum);
	return _140;
}
vec4 F_xSLP(
	in vec2 tc,
	in float dx,
	in float dy,
	in float MIPS)
{
	vec2 _147 = vec2(dx, dy);
	vec2 _149 = _147 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _150 = tc + _149;
	vec4 _154 = vec4(_150.x, _150.y, 0.00000000e+00, MIPS);
	vec4 _155 = textureLod(V_xSamplerLoadedPixel, _154.xy, _154.w);
	return _155;
}
float F_xText_Detection(
	in vec2 texcoord)
{
	vec2 _159;
	float _160;
	float _161;
	float _162;
	_159 = texcoord;
	_160 = 0.00000000e+00;
	_161 = 0.00000000e+00;
	_162 = 1.00000000e+00;
	vec4 _166 = F_xSLP(_159, _160, _161, _162);
	vec4 BC = _166;
	vec3 _168;
	_168 = BC.xyz;
	float _170 = F_xLI(_168);
	BC[3] = _170;
	float _173 = max(BC.w, 1.00000005e-03);
	vec3 _176 = BC.xyz / vec3(_173);
	BC.xyz = _176;
	float _179 = max(0.00000000e+00, BC.w);
	bool _181 = _179 > 9.94000018e-01;
	BC[3] = float(_181);
	float _185 = 1.00000000e+00 - BC.w;
	float _187 = mix(1.00000000e+00, _185, V_xText_Preservation);
	float _189 = 1.00000000e+00 - _187;
	return _189;
}
float F_xBlacks_Detection(
	in vec2 texcoord)
{
	vec2 _193;
	float _194;
	float _195;
	float _196;
	_193 = texcoord;
	_194 = 0.00000000e+00;
	_195 = 0.00000000e+00;
	_196 = 1.00000000e+00;
	vec4 _200 = F_xSLP(_193, _194, _195, _196);
	vec4 BC_201 = _200;
	vec3 _202;
	_202 = BC_201.xyz;
	float _204 = F_xLI(_202);
	BC_201[3] = _204;
	float _207 = max(BC_201.w, 1.00000005e-03);
	vec3 _210 = BC_201.xyz / vec3(_207);
	BC_201.xyz = _210;
	float _213 = max(0.00000000e+00, BC_201.w);
	BC_201[3] = _213;
	float _216 = mix(1.00000000e+00, BC_201.w, V_xBlack_Preservation);
	float _218 = 1.00000000e+00 - _216;
	return _218;
}
vec4 F_xDLAA(
	in vec2 texcoord)
{
	vec4 DLAA = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 H = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 V = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 UDLR = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _232 = texcoord.x * 1.92000000e+03;
	float _235 = texcoord.y * 1.08000000e+03;
	vec2 _236 = vec2(_232, _235);
	vec2 _237 = floor(_236);
	vec2 CBxy = _237;
	vec2 _239;
	float _240;
	float _241;
	_239 = texcoord;
	_240 = 0.00000000e+00;
	_241 = 0.00000000e+00;
	vec4 _244 = F_xLP(_239, _240, _241);
	vec4 Center_245 = _244;
	vec2 _246;
	float _247;
	float _248;
	_246 = texcoord;
	_247 = -1.00000000e+00;
	_248 = 0.00000000e+00;
	vec4 _251 = F_xLP(_246, _247, _248);
	vec4 Left_252 = _251;
	vec2 _253;
	float _254;
	float _255;
	_253 = texcoord;
	_254 = 1.00000000e+00;
	_255 = 0.00000000e+00;
	vec4 _258 = F_xLP(_253, _254, _255);
	vec4 Right_259 = _258;
	vec2 _260;
	float _261;
	float _262;
	_260 = texcoord;
	_261 = 0.00000000e+00;
	_262 = -1.00000000e+00;
	vec4 _265 = F_xLP(_260, _261, _262);
	vec4 Up_266 = _265;
	vec2 _267;
	float _268;
	float _269;
	_267 = texcoord;
	_268 = 0.00000000e+00;
	_269 = 1.00000000e+00;
	vec4 _272 = F_xLP(_267, _268, _269);
	vec4 Down_273 = _272;
	vec4 _274 = Up_266 + Down_273;
	vec4 _276 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _274;
	vec4 combH = _276;
	vec4 _278 = Left_252 + Right_259;
	vec4 _280 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _278;
	vec4 combV = _280;
	vec4 _283 = vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00) * Center_245;
	vec4 _284 = combH - _283;
	vec4 _285 = abs(_284);
	vec4 _287 = _285 / vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec4 CenterDiffH = _287;
	vec4 _290 = vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00) * Center_245;
	vec4 _291 = combV - _290;
	vec4 _292 = abs(_291);
	vec4 _294 = _292 / vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
	vec4 CenterDiffV = _294;
	vec4 _297 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * Center_245;
	vec4 _298 = combH + _297;
	vec4 _300 = _298 / vec4(6.00000000e+00, 6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec4 blurredH = _300;
	vec4 _303 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * Center_245;
	vec4 _304 = combV + _303;
	vec4 _306 = _304 / vec4(6.00000000e+00, 6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
	vec4 blurredV = _306;
	vec3 _308;
	_308 = CenterDiffH.xyz;
	float _310 = F_xLI(_308);
	float LumH = _310;
	vec3 _312;
	_312 = CenterDiffV.xyz;
	float _314 = F_xLI(_312);
	float LumV = _314;
	vec3 _316;
	_316 = blurredH.xyz;
	float _318 = F_xLI(_316);
	float LumHB = _318;
	vec3 _320;
	_320 = blurredV.xyz;
	float _322 = F_xLI(_320);
	float LumVB = _322;
	float _326 = mix(0.00000000e+00, 5.00000000e+00, V_xShort_Edge_Mask);
	float _327 = _326 * LumH;
	float _329 = _327 - 1.00000001e-01;
	float _330 = _329 / LumVB;
	float _331 = clamp(_330, 0.0, 1.0);
	bool _333 = _331 > 5.00000000e-01;
	float satAmountH = float(_333);
	float _338 = mix(0.00000000e+00, 5.00000000e+00, V_xShort_Edge_Mask);
	float _339 = _338 * LumV;
	float _341 = _339 - 1.00000001e-01;
	float _342 = _341 / LumHB;
	float _343 = clamp(_342, 0.0, 1.0);
	bool _345 = _343 > 5.00000000e-01;
	float satAmountV = float(_345);
	vec4 _349 = mix(Center_245, blurredH, vec4(satAmountV));
	DLAA = _349;
	vec4 _351 = mix(DLAA, blurredV, vec4(satAmountH));
	DLAA = _351;
	vec2 _352;
	_352 = texcoord;
	float _353 = F_xText_Detection(_352);
	vec4 _355 = mix(DLAA, Center_245, vec4(_353));
	DLAA = _355;
	vec2 _356;
	_356 = texcoord;
	float _357 = F_xBlacks_Detection(_356);
	vec4 _359 = mix(DLAA, Center_245, vec4(_357));
	DLAA = _359;
	vec4 HNeg = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HNegA = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HNegB = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HNegC = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HNegD = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HNegE = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPos = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPosA = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPosB = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPosC = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPosD = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 HPosE = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VNeg = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VNegA = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VNegB = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VNegC = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VPos = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VPosA = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VPosB = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 VPosC = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _400;
	float _401;
	float _402;
	float _403;
	_400 = texcoord;
	_401 = -1.50000000e+00;
	_402 = 0.00000000e+00;
	_403 = 0.00000000e+00;
	vec4 _407 = F_xSLP(_400, _401, _402, _403);
	HNeg = _407;
	vec2 _408;
	float _409;
	float _410;
	float _411;
	_408 = texcoord;
	_409 = -3.50000000e+00;
	_410 = 0.00000000e+00;
	_411 = 0.00000000e+00;
	vec4 _415 = F_xSLP(_408, _409, _410, _411);
	HNegA = _415;
	vec2 _416;
	float _417;
	float _418;
	float _419;
	_416 = texcoord;
	_417 = -5.50000000e+00;
	_418 = 0.00000000e+00;
	_419 = 0.00000000e+00;
	vec4 _423 = F_xSLP(_416, _417, _418, _419);
	HNegB = _423;
	vec2 _424;
	float _425;
	float _426;
	float _427;
	_424 = texcoord;
	_425 = -7.50000000e+00;
	_426 = 0.00000000e+00;
	_427 = 0.00000000e+00;
	vec4 _431 = F_xSLP(_424, _425, _426, _427);
	HNegC = _431;
	vec2 _432;
	float _433;
	float _434;
	float _435;
	_432 = texcoord;
	_433 = 1.50000000e+00;
	_434 = 0.00000000e+00;
	_435 = 0.00000000e+00;
	vec4 _439 = F_xSLP(_432, _433, _434, _435);
	HPos = _439;
	vec2 _440;
	float _441;
	float _442;
	float _443;
	_440 = texcoord;
	_441 = 3.50000000e+00;
	_442 = 0.00000000e+00;
	_443 = 0.00000000e+00;
	vec4 _447 = F_xSLP(_440, _441, _442, _443);
	HPosA = _447;
	vec2 _448;
	float _449;
	float _450;
	float _451;
	_448 = texcoord;
	_449 = 5.50000000e+00;
	_450 = 0.00000000e+00;
	_451 = 0.00000000e+00;
	vec4 _455 = F_xSLP(_448, _449, _450, _451);
	HPosB = _455;
	vec2 _456;
	float _457;
	float _458;
	float _459;
	_456 = texcoord;
	_457 = 7.50000000e+00;
	_458 = 0.00000000e+00;
	_459 = 0.00000000e+00;
	vec4 _463 = F_xSLP(_456, _457, _458, _459);
	HPosC = _463;
	vec2 _464;
	float _465;
	float _466;
	float _467;
	_464 = texcoord;
	_465 = 0.00000000e+00;
	_466 = -1.50000000e+00;
	_467 = 0.00000000e+00;
	vec4 _471 = F_xSLP(_464, _465, _466, _467);
	VNeg = _471;
	vec2 _472;
	float _473;
	float _474;
	float _475;
	_472 = texcoord;
	_473 = 0.00000000e+00;
	_474 = -3.50000000e+00;
	_475 = 0.00000000e+00;
	vec4 _479 = F_xSLP(_472, _473, _474, _475);
	VNegA = _479;
	vec2 _480;
	float _481;
	float _482;
	float _483;
	_480 = texcoord;
	_481 = 0.00000000e+00;
	_482 = -5.50000000e+00;
	_483 = 0.00000000e+00;
	vec4 _487 = F_xSLP(_480, _481, _482, _483);
	VNegB = _487;
	vec2 _488;
	float _489;
	float _490;
	float _491;
	_488 = texcoord;
	_489 = 0.00000000e+00;
	_490 = -7.50000000e+00;
	_491 = 0.00000000e+00;
	vec4 _495 = F_xSLP(_488, _489, _490, _491);
	VNegC = _495;
	vec2 _496;
	float _497;
	float _498;
	float _499;
	_496 = texcoord;
	_497 = 0.00000000e+00;
	_498 = 1.50000000e+00;
	_499 = 0.00000000e+00;
	vec4 _503 = F_xSLP(_496, _497, _498, _499);
	VPos = _503;
	vec2 _504;
	float _505;
	float _506;
	float _507;
	_504 = texcoord;
	_505 = 0.00000000e+00;
	_506 = 3.50000000e+00;
	_507 = 0.00000000e+00;
	vec4 _511 = F_xSLP(_504, _505, _506, _507);
	VPosA = _511;
	vec2 _512;
	float _513;
	float _514;
	float _515;
	_512 = texcoord;
	_513 = 0.00000000e+00;
	_514 = 5.50000000e+00;
	_515 = 0.00000000e+00;
	vec4 _519 = F_xSLP(_512, _513, _514, _515);
	VPosB = _519;
	vec2 _520;
	float _521;
	float _522;
	float _523;
	_520 = texcoord;
	_521 = 0.00000000e+00;
	_522 = 7.50000000e+00;
	_523 = 0.00000000e+00;
	vec4 _527 = F_xSLP(_520, _521, _522, _523);
	VPosC = _527;
	vec4 _528 = HNeg + HNegA;
	vec4 _529 = _528 + HNegB;
	vec4 _530 = _529 + HNegC;
	vec4 _531 = _530 + HPos;
	vec4 _532 = _531 + HPosA;
	vec4 _533 = _532 + HPosB;
	vec4 _534 = _533 + HPosC;
	vec4 _536 = _534 / vec4(8.00000000e+00, 8.00000000e+00, 8.00000000e+00, 8.00000000e+00);
	vec4 AvgBlurH = _536;
	vec4 _538 = VNeg + VNegA;
	vec4 _539 = _538 + VNegB;
	vec4 _540 = _539 + VNegC;
	vec4 _541 = _540 + VPos;
	vec4 _542 = _541 + VPosA;
	vec4 _543 = _542 + VPosB;
	vec4 _544 = _543 + VPosC;
	vec4 _546 = _544 / vec4(8.00000000e+00, 8.00000000e+00, 8.00000000e+00, 8.00000000e+00);
	vec4 AvgBlurV = _546;
	float _550 = mix(0.00000000e+00, 2.50000000e+00, V_xLong_Edge_Mask);
	float _552 = AvgBlurH.w * _550;
	float _554 = _552 - 1.00000000e+00;
	float _555 = clamp(_554, 0.0, 1.0);
	float EAH = _555;
	float _559 = mix(0.00000000e+00, 2.50000000e+00, V_xLong_Edge_Mask);
	float _561 = AvgBlurV.w * _559;
	float _563 = _561 - 1.00000000e+00;
	float _564 = clamp(_563, 0.0, 1.0);
	float EAV = _564;
	float _566 = EAH - EAV;
	float _567 = abs(_566);
	bool _569 = _567 > 2.50000000e-01;
	float longEdge = float(_569);
	if (bool(longEdge))
	{
		vec3 _576;
		_576 = AvgBlurH.xyz;
		float _578 = F_xLI(_576);
		float LongBlurLumH = _578;
		vec3 _580;
		_580 = AvgBlurV.xyz;
		float _582 = F_xLI(_580);
		float LongBlurLumV = _582;
		vec3 _584;
		_584 = Center_245.xyz;
		float _586 = F_xLI(_584);
		float centerLI = _586;
		vec3 _588;
		_588 = Up_266.xyz;
		float _590 = F_xLI(_588);
		float upLI = _590;
		vec3 _592;
		_592 = Down_273.xyz;
		float _594 = F_xLI(_592);
		float downLI = _594;
		vec3 _596;
		_596 = Left_252.xyz;
		float _598 = F_xLI(_596);
		float leftLI = _598;
		vec3 _600;
		_600 = Right_259.xyz;
		float _602 = F_xLI(_600);
		float rightLI = _602;
		float _604 = LongBlurLumH - upLI;
		float _605 = centerLI - upLI;
		float _606 = _604 / _605;
		float _608 = 0.00000000e+00 + _606;
		float _609 = clamp(_608, 0.0, 1.0);
		float blurUp = _609;
		float _611 = LongBlurLumH - centerLI;
		float _612 = centerLI - downLI;
		float _613 = _611 / _612;
		float _615 = 1.00000000e+00 + _613;
		float _616 = clamp(_615, 0.0, 1.0);
		float blurDown = _616;
		float _618 = LongBlurLumV - leftLI;
		float _619 = centerLI - leftLI;
		float _620 = _618 / _619;
		float _622 = 0.00000000e+00 + _620;
		float _623 = clamp(_622, 0.0, 1.0);
		float blurLeft = _623;
		float _625 = LongBlurLumV - centerLI;
		float _626 = centerLI - rightLI;
		float _627 = _625 / _626;
		float _629 = 1.00000000e+00 + _627;
		float _630 = clamp(_629, 0.0, 1.0);
		float blurRight = _630;
		vec4 _632 = vec4(blurLeft, blurRight, blurUp, blurDown);
		UDLR = _632;
		bvec4 _634 = equal(UDLR, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec4 _636 = compCond(_634, vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00), UDLR);
		UDLR = _636;
		vec4 _638 = mix(Left_252, Center_245, vec4(UDLR.x));
		V = _638;
		vec4 _640 = mix(Right_259, V, vec4(UDLR.y));
		V = _640;
		vec4 _642 = mix(Up_266, Center_245, vec4(UDLR.z));
		H = _642;
		vec4 _644 = mix(Down_273, H, vec4(UDLR.w));
		H = _644;
		vec4 StoreDLAA = DLAA;
		vec4 _647 = mix(DLAA, V, vec4(EAV));
		DLAA = _647;
		vec4 _649 = mix(DLAA, H, vec4(EAH));
		DLAA = _649;
		vec2 _650;
		_650 = texcoord;
		float _651 = F_xText_Detection(_650);
		vec4 _653 = mix(DLAA, StoreDLAA, vec4(_651));
		DLAA = _653;
		vec2 _654;
		_654 = texcoord;
		float _655 = F_xBlacks_Detection(_654);
		vec4 _657 = mix(DLAA, StoreDLAA, vec4(_655));
		DLAA = _657;
	}
	float _659 = mix(0.00000000e+00, EAV, longEdge);
	EAV = _659;
	float _661 = mix(0.00000000e+00, EAH, longEdge);
	EAH = _661;
	vec2 _662;
	_662 = texcoord;
	float _663 = F_xCB_Pattern(_662);
	bool _665 = V_xView_Mode == 1;
	float _666 = _665 ? satAmountV : EAV;
	bool _668 = V_xView_Mode == 1;
	float _669 = _668 ? satAmountH : EAH;
	float _671 = bool(_663) ? _666 : _669;
	vec4 _675 = vec4(DLAA.xyz.x, DLAA.xyz.y, DLAA.xyz.z, _671);
	return _675;
}
vec4 F_xAA_Out(
	in vec2 texcoord)
{
	vec2 _679;
	_679 = texcoord;
	vec4 _680 = F_xDLAA(_679);
	vec4 DLAA_681 = _680;
	bool _686 = V_xView_Mode == 1;
	bool _688 = V_xView_Mode == 2;
	bool _689 = _686 || _688;
	if (_689)
	{
		vec2 _690;
		_690 = texcoord;
		float _691 = F_xCB_Pattern(_690);
		float _695 = bool(_691) ? 0.00000000e+00 : DLAA_681.w;
		vec2 _696;
		_696 = texcoord;
		float _697 = F_xCB_Pattern(_696);
		float _701 = bool(_697) ? DLAA_681.w : 0.00000000e+00;
		vec4 _704 = vec4(_695, _701, 0.00000000e+00, 1.00000000e+00);
		vec4 _706 = mix(DLAA_681, vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00), _704);
		DLAA_681 = _706;
	}
	bool _711 = V_xView_Mode == 3;
	if (_711)
	{
		vec2 _712;
		_712 = texcoord;
		float _713 = F_xText_Detection(_712);
		vec4 _716 = mix(DLAA_681, vec4(1.00000000e+00, 1.00000000e+00, 0.00000000e+00, 1.00000000e+00), vec4(_713));
		DLAA_681 = _716;
	}
	return DLAA_681;
}
float F_xgetBit(
	in float map,
	in float index)
{
	float _721 = -(index);
	float _722 = exp2(_721);
	float _723 = map * _722;
	float _724 = floor(_723);
	float _725;
	float _726;
	_725 = _724;
	_726 = 2.00000000e+00;
	float _728 = F_xfmod(_725, _726);
	return _728;
}
float F_xdrawChar(
	in float Char,
	in vec2 pos,
	in vec2 size,
	in vec2 TC)
{
	vec2 _735 = TC - pos;
	TC = _735;
	vec2 _736 = TC / size;
	TC = _736;
	float _739 = min(TC.x, TC.y);
	float _741 = step(0.00000000e+00, _739);
	float _744 = max(TC.x, TC.y);
	float _746 = step(1.00000000e+00, _744);
	float _747 = _741 - _746;
	float res = _747;
	vec2 _750 = TC * vec2(4.00000000e+00, 5.00000000e+00);
	TC = _750;
	float _752 = floor(TC.y);
	float _754 = 4.00000000e+00 * _752;
	float _756 = floor(TC.x);
	float _757 = _754 + _756;
	float _758;
	float _759;
	_758 = Char;
	_759 = _757;
	float _760 = F_xgetBit(_758, _759);
	float _761 = res * _760;
	res = _761;
	float _762 = clamp(res, 0.0, 1.0);
	return _762;
}
float F_xInformation(
	in vec2 TC)
{
	float D3D_Size_A = 1.37500000e+00;
	float D3D_Size_B = 7.50000000e-01;
	float Out = 0.00000000e+00;
	vec2 _774 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_A);
	vec2 charSize_A = _774;
	vec2 _778 = vec2(8.75000004e-03, 1.25000002e-02) * vec2(D3D_Size_B);
	vec2 charSize_B = _778;
	vec2 WebCharPos = vec2(8.61999989e-01, 1.79999992e-02);
	vec3 _785 = F_xSetInfo();
	vec3 _786 = F_xSetInfo();
	bool _789 = _785.x <= _786.y;
	if (_789)
	{
		float _790;
		vec2 _791;
		vec2 _792;
		vec2 _793;
		_790 = 4.98071000e+05;
		_791 = WebCharPos;
		_792 = charSize_A;
		_793 = TC;
		float _795 = F_xdrawChar(_790, _791, _792, _793);
		float _796 = Out + _795;
		Out = _796;
		float _798 = 9.99999978e-03 * D3D_Size_A;
		float _800 = WebCharPos.x + _798;
		WebCharPos[0] = _800;
		float _801;
		vec2 _802;
		vec2 _803;
		vec2 _804;
		_801 = 9.88959000e+05;
		_802 = WebCharPos;
		_803 = charSize_A;
		_804 = TC;
		float _806 = F_xdrawChar(_801, _802, _803, _804);
		float _807 = Out + _806;
		Out = _807;
		float _809 = 9.99999978e-03 * D3D_Size_A;
		float _811 = WebCharPos.x + _809;
		WebCharPos[0] = _811;
		float _812;
		vec2 _813;
		vec2 _814;
		vec2 _815;
		_812 = 4.98033000e+05;
		_813 = WebCharPos;
		_814 = charSize_A;
		_815 = TC;
		float _817 = F_xdrawChar(_812, _813, _814, _815);
		float _818 = Out + _817;
		Out = _818;
		float _820 = 9.99999978e-03 * D3D_Size_A;
		float _822 = WebCharPos.x + _820;
		WebCharPos[0] = _822;
		float _823;
		vec2 _824;
		vec2 _825;
		vec2 _826;
		_823 = 1.00051600e+06;
		_824 = WebCharPos;
		_825 = charSize_A;
		_826 = TC;
		float _828 = F_xdrawChar(_823, _824, _825, _826);
		float _829 = Out + _828;
		Out = _829;
		float _831 = 9.99999978e-03 * D3D_Size_A;
		float _833 = WebCharPos.x + _831;
		WebCharPos[0] = _833;
		float _834;
		vec2 _835;
		vec2 _836;
		vec2 _837;
		_834 = 6.30681000e+05;
		_835 = WebCharPos;
		_836 = charSize_A;
		_837 = TC;
		float _839 = F_xdrawChar(_834, _835, _836, _837);
		float _840 = Out + _839;
		Out = _840;
		float _842 = 9.99999978e-03 * D3D_Size_A;
		float _844 = WebCharPos.x + _842;
		WebCharPos[0] = _844;
		float _845;
		vec2 _846;
		vec2 _847;
		vec2 _848;
		_845 = 4.31254000e+05;
		_846 = WebCharPos;
		_847 = charSize_A;
		_848 = TC;
		float _850 = F_xdrawChar(_845, _846, _847, _848);
		float _851 = Out + _850;
		Out = _851;
		float _853 = 9.99999978e-03 * D3D_Size_A;
		float _855 = WebCharPos.x + _853;
		WebCharPos[0] = _855;
		float _856;
		vec2 _857;
		vec2 _858;
		vec2 _859;
		_856 = 4.98071000e+05;
		_857 = WebCharPos;
		_858 = charSize_A;
		_859 = TC;
		float _861 = F_xdrawChar(_856, _857, _858, _859);
		float _862 = Out + _861;
		Out = _862;
		float _864 = 8.00000038e-03 * D3D_Size_A;
		float _866 = WebCharPos.x + _864;
		WebCharPos[0] = _866;
		float _867;
		vec2 _868;
		vec2 _869;
		vec2 _870;
		_867 = 2.00000000e+00;
		_868 = WebCharPos;
		_869 = charSize_A;
		_870 = TC;
		float _872 = F_xdrawChar(_867, _868, _869, _870);
		float _873 = Out + _872;
		Out = _873;
		float _875 = 9.99999978e-03 * D3D_Size_A;
		float _877 = WebCharPos.x + _875;
		WebCharPos[0] = _877;
		WebCharPos = vec2(9.63000000e-01, 1.79999992e-02);
		float _879;
		vec2 _880;
		vec2 _881;
		vec2 _882;
		_879 = 1.00052700e+06;
		_880 = WebCharPos;
		_881 = charSize_B;
		_882 = TC;
		float _884 = F_xdrawChar(_879, _880, _881, _882);
		float _885 = Out + _884;
		Out = _885;
		float _887 = 9.99999978e-03 * D3D_Size_B;
		float _889 = WebCharPos.x + _887;
		WebCharPos[0] = _889;
		float _890;
		vec2 _891;
		vec2 _892;
		vec2 _893;
		_890 = 6.38361000e+05;
		_891 = WebCharPos;
		_892 = charSize_B;
		_893 = TC;
		float _895 = F_xdrawChar(_890, _891, _892, _893);
		float _896 = Out + _895;
		Out = _896;
		float _898 = 9.99999978e-03 * D3D_Size_B;
		float _900 = WebCharPos.x + _898;
		WebCharPos[0] = _900;
		float _901;
		vec2 _902;
		vec2 _903;
		vec2 _904;
		_901 = 9.88945000e+05;
		_902 = WebCharPos;
		_903 = charSize_B;
		_904 = TC;
		float _906 = F_xdrawChar(_901, _902, _903, _904);
		float _907 = Out + _906;
		Out = _907;
		float _909 = 9.99999978e-03 * D3D_Size_B;
		float _911 = WebCharPos.x + _909;
		WebCharPos[0] = _911;
		float _912;
		vec2 _913;
		vec2 _914;
		vec2 _915;
		_912 = 4.32534000e+05;
		_913 = WebCharPos;
		_914 = charSize_B;
		_915 = TC;
		float _917 = F_xdrawChar(_912, _913, _914, _915);
		float _918 = Out + _917;
		Out = _918;
	}
	return Out;
}
vec4 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float PosX = 9.52499986e-01;
	float PosY = 9.74999964e-01;
	float _929 = texcoord.y * 5.00000000e+01;
	float _931 = 1.00000000e+00 - _929;
	float _933 = _931 + 4.88499985e+01;
	float _935 = _933 * texcoord.y;
	float _937 = _935 - 5.00000000e-01;
	float DBlending = _937;
	float _941 = 1.00000000e+00 - texcoord.y;
	vec2 _943 = vec2(texcoord.x, _941);
	vec2 TC_944 = _943;
	vec2 _945;
	_945 = texcoord;
	vec4 _946 = F_xAA_Out(_945);
	vec3 Color = _946.xyz;
	vec2 _949;
	_949 = TC_944;
	float _950 = F_xInformation(_949);
	vec3 _951 = F_xSetInfo();
	bool _953 = _950 > _951.z;
	vec3 _956 = compCond(bvec3(_953), vec3(DBlending), Color);
	vec4 _961 = vec4(_956.x, _956.y, _956.z, 1.00000000e+00);
	return _961;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _968 = id == 2u;
	float _971 = _968 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _971;
	bool _973 = id == 1u;
	float _976 = _973 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _976;
	vec2 _978 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _980 = _978 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _985 = vec4(_980.x, _980.y, 0.00000000e+00, 1.00000000e+00);
	position = _985;
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
#ifdef E_xPreFilter
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPreFilter(position, texcoord);
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
