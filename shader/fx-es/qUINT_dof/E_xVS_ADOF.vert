#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xVS_ADOF
#define dFdx(x) (x)
#define dFdy(x) (x)
#define fwidth(x) (x)
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
float fmodHLSL(float x, float y) { return x - y * trunc(x / y); }
vec2 fmodHLSL(vec2 x, vec2 y) { return x - y * trunc(x / y); }
vec3 fmodHLSL(vec3 x, vec3 y) { return x - y * trunc(x / y); }
vec4 fmodHLSL(vec4 x, vec4 y) { return x - y * trunc(x / y); }
mat2 fmodHLSL(mat2 x, mat2 y) { return x - matrixCompMult(y, mat2(trunc(x[0] / y[0]), trunc(x[1] / y[1]))); }
mat3 fmodHLSL(mat3 x, mat3 y) { return x - matrixCompMult(y, mat3(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]))); }
mat4 fmodHLSL(mat4 x, mat4 y) { return x - matrixCompMult(y, mat4(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]), trunc(x[3] / y[3]))); }
uniform bool V_xbADOF_AutofocusEnable;
uniform vec2 V_xfADOF_AutofocusCenter;
uniform float V_xfADOF_AutofocusRadius;
uniform float V_xfADOF_AutofocusSpeed;
uniform float V_xfADOF_ManualfocusDepth;
uniform float V_xfADOF_NearBlurCurve;
uniform float V_xfADOF_FarBlurCurve;
uniform float V_xfADOF_HyperFocus;
uniform float V_xfADOF_RenderResolutionMult;
uniform float V_xfADOF_ShapeRadius;
uniform float V_xfADOF_SmootheningAmount;
uniform float V_xfADOF_BokehIntensity;
uniform int V_xiADOF_BokehMode;
uniform int V_xiADOF_ShapeVertices;
uniform int V_xiADOF_ShapeQuality;
uniform float V_xfADOF_ShapeCurvatureAmount;
uniform float V_xfADOF_ShapeRotation;
uniform float V_xfADOF_ShapeAnamorphRatio;
uniform float V_xfADOF_ShapeChromaAmount;
uniform int V_xiADOF_ShapeChromaMode;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
uniform sampler2D V_xsADOF_FocusTex;
uniform sampler2D V_xsADOF_FocusTexPrev;
uniform sampler2D V_xsCommonTex0;
uniform sampler2D V_xsCommonTex1;
struct S_xADOF_VSOUT
{
	vec4 vpos;
	vec4 txcoord;
	vec4 offset0;
	mat2x2 offsmat;
};
S_xADOF_VSOUT _112;
const vec2 _421[4] = vec2[4](vec2(7.81250070e-04, 4.62962955e-04), vec2(2.60416680e-04, -1.38888881e-03), vec2(-7.81250070e-04, -4.62962955e-04), vec2(-2.60416680e-04, 1.38888881e-03));
const vec4 _1022[5] = vec4[5](vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
const vec4 _1097[3] = vec4[3](vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _32 = uv.x / 1.00000000e+00;
	uv[0] = _32;
	float _35 = uv.y / 1.00000000e+00;
	uv[1] = _35;
	float _38 = uv.x - 0.00000000e+00;
	uv[0] = _38;
	float _41 = uv.y + 0.00000000e+00;
	uv[1] = _41;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _45;
	_45 = uv;
	vec2 _46 = F_xqUINT_xdepthtex_uv(_45);
	vec4 _51 = vec4(_46.x, _46.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _52 = textureLod(V_xqUINT_xsDepthBufferTex, _51.xy, _51.w);
	float depth = _52.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _59 = depth * 1.00000000e+00;
	depth = _59;
	float _61 = 1.00000000e+00 - depth;
	depth = _61;
	float _63 = depth * 9.99000000e+02;
	float _65 = 1.00000000e+03 - _63;
	float _66 = depth / _65;
	depth = _66;
	float _67 = clamp(depth, 0.0, 1.0);
	return _67;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _71;
	_71 = uv;
	float _72 = F_xqUINT_xget_depth(_71);
	float depth_73 = _72;
	float _74;
	_74 = depth_73;
	float _75 = F_xqUINT_xlinearize_depth(_74);
	depth_73 = _75;
	return depth_73;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _82 = id == 2u;
	float _85 = _82 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _85;
	bool _87 = id == 1u;
	float _90 = _87 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _90;
	vec2 _92 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _94 = _92 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _99 = vec4(_94.x, _94.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _99;
	return;
}
S_xADOF_VSOUT F_xVS_ADOF(
	in uint id)
{
	S_xADOF_VSOUT OUT = _112;
	bool _115 = id == 2u;
	float _118 = _115 ? 2.00000000e+00 : 0.00000000e+00;
	OUT.txcoord[0] = _118;
	bool _120 = id == 1u;
	float _123 = _120 ? 2.00000000e+00 : 0.00000000e+00;
	OUT.txcoord[1] = _123;
	vec2 _126 = OUT.txcoord.xy / vec2(V_xfADOF_RenderResolutionMult);
	OUT.txcoord.zw = _126;
	vec2 _129 = OUT.txcoord.xy * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _131 = _129 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _136 = vec4(_131.x, _131.y, 0.00000000e+00, 1.00000000e+00);
	OUT.vpos = _136;
	float _139 = 6.28318548e+00 / float(V_xiADOF_ShapeVertices);
	float _140;
	float _141;
	_140 = sin(_139), _141 = cos(_139);
	OUT.offsmat[0][1] = _140;
	OUT.offsmat[1][1] = _141;
	OUT.offsmat[0][0] = OUT.offsmat[1][1];
	float _145 = -(OUT.offsmat[0][1]);
	OUT.offsmat[1][0] = _145;
	float _146 = radians(V_xfADOF_ShapeRotation);
	float _147;
	float _148;
	_147 = sin(_146), _148 = cos(_146);
	OUT.offset0[0] = _147;
	OUT.offset0[1] = _148;
	vec2 _152 = (OUT.offsmat * OUT.offset0.xy);
	OUT.offset0.zw = _152;
	return OUT;
}
float F_xGetLinearDepth(
	in vec2 coords)
{
	vec2 _156;
	_156 = coords;
	float _157 = F_xqUINT_xlinear_depth(_156);
	return _157;
}
float F_xCircleOfConfusion(
	in vec2 texcoord,
	in bool aggressiveLeakReduction)
{
	vec2 depthdata = vec2(0.00000000e+00, 0.00000000e+00);
	float scenecoc = 0.00000000e+00;
	vec2 _166;
	_166 = texcoord.xy;
	float _168 = F_xGetLinearDepth(_166);
	depthdata[0] = _168;
	if (aggressiveLeakReduction)
	{
		vec3 neighbourOffsets = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
		vec2 _176 = texcoord.xy - neighbourOffsets.xz;
		vec2 _177;
		_177 = _176;
		float _178 = F_xGetLinearDepth(_177);
		vec2 _181 = texcoord.xy + neighbourOffsets.xz;
		vec2 _182;
		_182 = _181;
		float _183 = F_xGetLinearDepth(_182);
		vec2 _186 = texcoord.xy - neighbourOffsets.zy;
		vec2 _187;
		_187 = _186;
		float _188 = F_xGetLinearDepth(_187);
		vec2 _191 = texcoord.xy + neighbourOffsets.zy;
		vec2 _192;
		_192 = _191;
		float _193 = F_xGetLinearDepth(_192);
		vec4 _194 = vec4(_178, _183, _188, _193);
		vec4 neighbourDepths = _194;
		float _198 = min(neighbourDepths.x, neighbourDepths.y);
		float _201 = min(neighbourDepths.z, neighbourDepths.w);
		float _202 = min(_198, _201);
		float neighbourMin = _202;
		float _205 = min(neighbourMin, depthdata.x);
		float _208 = mix(_205, depthdata.x, 1.00000005e-03);
		depthdata[0] = _208;
	}
	vec4 _210 = texture(V_xsADOF_FocusTex, texcoord.xy);
	depthdata[1] = _210.x;
	float handdepth = depthdata.x;
	vec2 _216 = depthdata.xy / vec2(V_xfADOF_HyperFocus);
	vec2 _217 = clamp(_216, 0.0, 1.0);
	depthdata.xy = _217;
	bool _223 = depthdata.x < depthdata.y;
	if (_223)
	{
		float _226 = depthdata.x / depthdata.y;
		float _228 = _226 - 1.00000000e+00;
		scenecoc = _228;
		float _230 = -5.00000000e-01 * V_xfADOF_NearBlurCurve;
		float _231 = _230 * V_xfADOF_NearBlurCurve;
		float _232 = exp2(_231);
		float _233 = scenecoc * _232;
		scenecoc = _233;
	}
	else
	{
		float _236 = depthdata.x - depthdata.y;
		float _237 = V_xfADOF_FarBlurCurve * V_xfADOF_FarBlurCurve;
		float _238 = exp2(_237);
		float _240 = depthdata.y * _238;
		float _242 = _240 - depthdata.y;
		float _243 = _236 / _242;
		scenecoc = _243;
		float _244 = clamp(scenecoc, 0.0, 1.0);
		scenecoc = _244;
	}
	bool _246 = handdepth < 3.35299992e-05;
	float _248 = _246 ? 0.00000000e+00 : scenecoc;
	scenecoc = _248;
	return scenecoc;
}
void F_xShapeRoundness(
	inout vec2 sampleOffset,
	in float roundness)
{
	float _254 = 1.00000000e+00 - roundness;
	float _255 = dot(sampleOffset, sampleOffset);
	float _256 = inversesqrt(_255);
	float _257 = _256 * roundness;
	float _258 = _254 + _257;
	vec2 _260 = sampleOffset * vec2(_258);
	sampleOffset = _260;
	return;
}
void F_xOpticalVignette(
	in vec2 sampleOffset,
	in vec2 centerVec,
	inout float sampleWeight)
{
	vec2 _266 = sampleOffset - centerVec;
	sampleOffset = _266;
	float _267 = dot(sampleOffset, sampleOffset);
	float _269 = _267 * 1.66600001e+00;
	float _271 = 3.33299994e+00 - _269;
	float _272 = clamp(_271, 0.0, 1.0);
	float _273 = sampleWeight * _272;
	sampleWeight = _273;
	return;
}
vec2 F_xCoC2BlurRadius(
	in float CoC)
{
	vec2 _278 = vec2(V_xfADOF_ShapeAnamorphRatio, 1.77777779e+00);
	vec2 _280 = _278 * vec2(CoC);
	vec2 _282 = _280 * vec2(V_xfADOF_ShapeRadius);
	vec2 _284 = _282 * vec2(6.00000028e-04, 6.00000028e-04);
	return _284;
}
void F_xPS_CopyBackBuffer(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec4 _290 = texture(V_xqUINT_xsBackBufferTex, IN.txcoord.xy);
	color = _290;
	return;
}
void F_xPS_ReadFocus(
	in S_xADOF_VSOUT IN,
	out float focus)
{
	float scenefocus = 0.00000000e+00;
	bool _301 = V_xbADOF_AutofocusEnable == true;
	if (_301)
	{
		float samples = 1.00000000e+01;
		float weightsum = 9.99999997e-07;
		float xcoord = 0.00000000e+00;
		while (xcoord < samples)
		{
			{
				float ycoord = 0.00000000e+00;
				while (ycoord < samples)
				{
					{
						vec2 _328 = vec2(xcoord, ycoord);
						vec2 _330 = _328 + vec2(5.00000000e-01, 5.00000000e-01);
						vec2 _332 = _330 / vec2(samples);
						vec2 sampleOffset_333 = _332;
						vec2 _335 = sampleOffset_333 * vec2(2.00000000e+00, 2.00000000e+00);
						vec2 _337 = _335 - vec2(1.00000000e+00, 1.00000000e+00);
						sampleOffset_333 = _337;
						vec2 _339 = sampleOffset_333 * vec2(V_xfADOF_AutofocusRadius);
						sampleOffset_333 = _339;
						vec2 _341 = V_xfADOF_AutofocusCenter - vec2(5.00000000e-01, 5.00000000e-01);
						vec2 _342 = sampleOffset_333 + _341;
						sampleOffset_333 = _342;
						float _343 = dot(sampleOffset_333, sampleOffset_333);
						float _344 = -(_343);
						float _346 = _344 * 4.00000000e+00;
						float _347 = exp2(_346);
						float _349 = 1.20000005e+00 * _347;
						float _350 = clamp(_349, 0.0, 1.0);
						float sampleWeight_351 = _350;
						vec2 _353 = sampleOffset_333 * vec2(5.00000000e-01, 5.00000000e-01);
						vec2 _355 = _353 + vec2(5.00000000e-01, 5.00000000e-01);
						vec2 _356;
						_356 = _355;
						float _357 = F_xGetLinearDepth(_356);
						float tempfocus = _357;
						float _360 = tempfocus + 1.00000005e-03;
						float _361 = 1.0 / _360;
						float _362 = sampleWeight_351 * _361;
						sampleWeight_351 = _362;
						bool _364 = tempfocus > 3.35299992e-05;
						float _366 = clamp(float(_364), 0.0, 1.0);
						float _367 = sampleWeight_351 * _366;
						sampleWeight_351 = _367;
						float _368 = tempfocus * sampleWeight_351;
						float _369 = scenefocus + _368;
						scenefocus = _369;
						float _370 = weightsum + sampleWeight_351;
						weightsum = _370;
					}
					float _326 = ycoord;
					float _327 = _326 + 1.00000000e+00;
					ycoord = _327;
				}
			}
			float _315 = xcoord;
			float _316 = _315 + 1.00000000e+00;
			xcoord = _316;
		}
		float _371 = scenefocus / weightsum;
		scenefocus = _371;
	}
	else
	{
		float _372 = V_xfADOF_ManualfocusDepth * V_xfADOF_ManualfocusDepth;
		scenefocus = _372;
	}
	vec4 _374 = texture(V_xsADOF_FocusTexPrev, vec2(5.00000000e-01, 5.00000000e-01));
	float prevscenefocus = _374.x;
	float _377 = V_xfADOF_AutofocusSpeed * V_xfADOF_AutofocusSpeed;
	float adjustmentspeed = _377;
	bool _379 = prevscenefocus > scenefocus;
	float _382 = _379 ? 2.00000000e+00 : 1.00000000e+00;
	float _383 = adjustmentspeed * _382;
	adjustmentspeed = _383;
	float _384 = clamp(adjustmentspeed, 0.0, 1.0);
	float _385 = mix(prevscenefocus, scenefocus, _384);
	focus = _385;
	return;
}
void F_xPS_CopyFocus(
	in S_xADOF_VSOUT IN,
	out float focus)
{
	vec4 _391 = texture(V_xsADOF_FocusTex, IN.txcoord.xy);
	focus = _391.x;
	return;
}
void F_xPS_CoC(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec4 _398 = texture(V_xqUINT_xsBackBufferTex, IN.txcoord.xy);
	color = _398;
	vec2 _399;
	_399 = IN.txcoord.xy;
	float _401 = F_xGetLinearDepth(_399);
	float centerDepth = _401;
	vec4 sampleCoord = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 neighbourOffsets_406 = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec4 coccolor = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int i = 0;
	while (i < 4)
	{
		{
			vec2 _424 = IN.txcoord.xy + _421[int(i)];
			sampleCoord.xy = _424;
			vec4 _425 = textureLod(V_xqUINT_xsBackBufferTex, sampleCoord.xy, sampleCoord.w);
			vec3 sampleColor = _425.xyz;
			vec2 _430 = sampleCoord.xy + neighbourOffsets_406.xz;
			vec2 _431;
			_431 = _430;
			float _432 = F_xGetLinearDepth(_431);
			vec2 _435 = sampleCoord.xy - neighbourOffsets_406.xz;
			vec2 _436;
			_436 = _435;
			float _437 = F_xGetLinearDepth(_436);
			vec2 _440 = sampleCoord.xy + neighbourOffsets_406.zy;
			vec2 _441;
			_441 = _440;
			float _442 = F_xGetLinearDepth(_441);
			vec2 _445 = sampleCoord.xy - neighbourOffsets_406.zy;
			vec2 _446;
			_446 = _445;
			float _447 = F_xGetLinearDepth(_446);
			vec4 _448 = vec4(_432, _437, _442, _447);
			vec4 sampleDepths = _448;
			float _452 = min(sampleDepths.x, sampleDepths.y);
			float _455 = min(sampleDepths.z, sampleDepths.w);
			float _456 = min(_452, _455);
			float sampleDepthMin = _456;
			float _460 = max(sampleColor.x, sampleColor.y);
			float _462 = max(_460, sampleColor.z);
			float _464 = 1.00000000e+00 + _462;
			vec3 _466 = sampleColor / vec3(_464);
			sampleColor = _466;
			float _467 = 1.0 / centerDepth;
			float _468 = sampleDepthMin * _467;
			float _470 = _468 + 1.00000005e-03;
			float _471 = clamp(_470, 0.0, 1.0);
			float sampleWeight_472 = _471;
			vec3 _475 = sampleColor.xyz * vec3(sampleWeight_472);
			vec4 _479 = vec4(_475.x, _475.y, _475.z, sampleWeight_472);
			vec4 _480 = coccolor + _479;
			coccolor = _480;
		}
		int _419 = i;
		int _420 = _419 + 1;
		i = _420;
	}
	vec3 _483 = coccolor.xyz / vec3(coccolor.w);
	coccolor.xyz = _483;
	float _486 = max(coccolor.y, coccolor.z);
	float _488 = max(coccolor.x, _486);
	float _490 = 1.00000000e+00 - _488;
	vec3 _493 = coccolor.xyz / vec3(_490);
	coccolor.xyz = _493;
	float _496 = coccolor.w * 8.00000000e+00;
	float _497 = clamp(_496, 0.0, 1.0);
	vec3 _501 = mix(color.xyz, coccolor.xyz, vec3(_497));
	color.xyz = _501;
	vec2 _502;
	bool _503;
	_502 = IN.txcoord.xy;
	_503 = true;
	float _506 = F_xCircleOfConfusion(_502, _503);
	color[3] = _506;
	float _509 = color.w * 5.00000000e-01;
	float _511 = _509 + 5.00000000e-01;
	float _512 = clamp(_511, 0.0, 1.0);
	color[3] = _512;
	return;
}
void F_xunpack_hdr(
	inout vec3 color)
{
	vec3 _516 = clamp(color, 0.0, 1.0);
	vec3 _518 = vec3(1.20000005e+00, 1.20000005e+00, 1.20000005e+00) - _516;
	vec3 _519 = 1.0 / _518;
	vec3 _520 = color * _519;
	color = _520;
	return;
}
void F_xpack_hdr(
	inout vec3 color)
{
	vec3 _525 = vec3(1.20000005e+00, 1.20000005e+00, 1.20000005e+00) * color;
	vec3 _527 = color + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _528 = 1.0 / _527;
	vec3 _529 = _525 * _528;
	color = _529;
	return;
}
vec4 F_xPS_DoF_Main(
	in S_xADOF_VSOUT IN)
{
	float _538 = max(IN.txcoord.z, IN.txcoord.w);
	bool _540 = _538 > 1.00999999e+00;
	if (_540)
	{
		
		return vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
	vec4 BokehSum = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 BokehMax = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _546 = texture(V_xsCommonTex0, IN.txcoord.zw);
	BokehMax = _546;
	BokehSum = BokehMax;
	float weightSum = 1.00000000e+00;
	float _551 = BokehSum.w * 2.00000000e+00;
	float _553 = _551 - 1.00000000e+00;
	float _554 = abs(_553);
	float CoC_555 = _554;
	float _556;
	_556 = CoC_555;
	vec2 _557 = F_xCoC2BlurRadius(_556);
	vec2 bokehRadiusScaled = _557;
	float _559 = clamp(CoC_555, 0.0, 1.0);
	float _562 = mix(1.00000000e+00, float(V_xiADOF_ShapeQuality), _559);
	float _565 = dot(IN.vpos.xy, vec2(1.00000000e+00, 1.00000000e+00));
	float _567 = fmodHLSL(_565, 2.00000000e+00);
	float _569 = _567 * 5.00000000e-01;
	float _570 = _562 + _569;
	float nRings = _570;
	bool _577 = bokehRadiusScaled.x < 1.30208340e-04;
	if (_577)
	{
		return BokehSum;
	}
	vec2 _579 = bokehRadiusScaled / vec2(nRings);
	bokehRadiusScaled = _579;
	float _580 = CoC_555 / nRings;
	CoC_555 = _580;
	int _582 = 6 - V_xiADOF_ShapeVertices;
	int _584 = max(1, _582);
	int densityScale = _584;
	int iVertices = 0;
	bool _593 = iVertices < V_xiADOF_ShapeVertices;
	bool _595 = iVertices < 10;
	bool _596 = _593 && _595;
	while (_596)
	{
		{
			float iRings = 1.00000000e+00;
			bool _607 = iRings <= nRings;
			bool _609 = iRings < 2.60000000e+01;
			bool _610 = _607 && _609;
			while (_610)
			{
				{
					float iSamplesPerRing = 0.00000000e+00;
					float _622 = iRings * float(densityScale);
					bool _623 = iSamplesPerRing < _622;
					bool _625 = iSamplesPerRing < 5.20000000e+01;
					bool _626 = _623 && _625;
					while (_626)
					{
						{
							float _631 = iRings * float(densityScale);
							float _632 = iSamplesPerRing / _631;
							float x = _632;
							float _634 = x * x;
							float _636 = 2.00000000e+00 * x;
							float _638 = 3.00000000e+00 - _636;
							float _639 = _634 * _638;
							float a = _639;
							int _641 = V_xiADOF_ShapeVertices * V_xiADOF_ShapeVertices;
							float _644 = float(_641) * 4.00000006e-01;
							float _646 = _644 - 1.00000000e+00;
							float _647 = 1.0 / _646;
							float _649 = 2.54999995e+00 * _647;
							float l = _649;
							float _652 = 1.00000000e+00 + l;
							float _653 = _652 * x;
							float _654 = a * l;
							float _655 = _653 - _654;
							float _656 = mix(x, _655, V_xfADOF_ShapeCurvatureAmount);
							x = _656;
							vec2 _660 = mix(IN.offset0.xy, IN.offset0.zw, vec2(x));
							vec2 sampleOffset_661 = _660;
							vec2 _662;
							float _663;
							_662 = sampleOffset_661;
							_663 = V_xfADOF_ShapeCurvatureAmount;
							F_xShapeRoundness(_662, _663);
							sampleOffset_661 = _662;
							vec2 _666 = bokehRadiusScaled * vec2(iRings);
							vec2 _668 = sampleOffset_661.xy * _666;
							vec2 _670 = IN.txcoord.zw + _668;
							vec4 _675 = vec4(_670.x, _670.y, 0.00000000e+00, 0.00000000e+00);
							vec4 _676 = textureLod(V_xsCommonTex0, _675.xy, _675.w);
							vec4 sampleBokeh = _676;
							float _680 = sampleBokeh.w * 2.00000000e+00;
							float _682 = _680 - 1.00000000e+00;
							float _683 = abs(_682);
							float _684 = CoC_555 * iRings;
							float _685 = _683 - _684;
							float _687 = 1.00000000e+06 * _685;
							float _689 = _687 + 1.00000000e+00;
							float _690 = clamp(_689, 0.0, 1.0);
							float sampleWeight_691 = _690;
							vec3 _694 = sampleBokeh.xyz * vec3(sampleWeight_691);
							sampleBokeh.xyz = _694;
							float _695 = weightSum + sampleWeight_691;
							weightSum = _695;
							vec4 _696 = BokehSum + sampleBokeh;
							BokehSum = _696;
							vec4 _697 = max(BokehMax, sampleBokeh);
							BokehMax = _697;
						}
						float _628 = iSamplesPerRing;
						float _629 = _628 + 1.00000000e+00;
						iSamplesPerRing = _629;
						float _622 = iRings * float(densityScale);
						bool _623 = iSamplesPerRing < _622;
						bool _625 = iSamplesPerRing < 5.20000000e+01;
						_626 = _623 && _625;
					}
				}
				float _612 = iRings;
				float _613 = _612 + 1.00000000e+00;
				iRings = _613;
				bool _607 = iRings <= nRings;
				bool _609 = iRings < 2.60000000e+01;
				_610 = _607 && _609;
			}
			IN.offset0.xy = IN.offset0.zw;
			vec2 _701 = (IN.offsmat * IN.offset0.zw);
			IN.offset0.zw = _701;
		}
		int _598 = iVertices;
		int _599 = _598 + 1;
		iVertices = _599;
		bool _593 = iVertices < V_xiADOF_ShapeVertices;
		bool _595 = iVertices < 10;
		_596 = _593 && _595;
	}
	vec4 ret = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _705 = BokehSum / vec4(weightSum);
	BokehSum = _705;
	vec3 _706;
	_706 = BokehSum.xyz;
	F_xunpack_hdr(_706);
	BokehSum.xyz = _706;
	vec3 _709;
	_709 = BokehMax.xyz;
	F_xunpack_hdr(_709);
	BokehMax.xyz = _709;
	bool _716 = V_xiADOF_BokehMode == 0;
	if (_716)
	{
		float _717 = CoC_555 * nRings;
		float _719 = _717 * 2.00000000e+00;
		float _720 = clamp(_719, 0.0, 1.0);
		float _721 = V_xfADOF_BokehIntensity * _720;
		vec4 _723 = mix(BokehSum, BokehMax, vec4(_721));
		ret = _723;
	}
	else
	{
		bool _728 = V_xiADOF_BokehMode == 1;
		if (_728)
		{
			float _731 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehMax.xyz);
			float maxlum = _731;
			float _735 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehSum.xyz);
			float avglum = _735;
			float _737 = CoC_555 * nRings;
			float _739 = _737 * 2.00000000e+00;
			float _740 = clamp(_739, 0.0, 1.0);
			float _741 = V_xfADOF_BokehIntensity * _740;
			float _742 = mix(avglum, maxlum, _741);
			vec4 _744 = BokehSum * vec4(_742);
			vec4 _746 = _744 / vec4(avglum);
			ret = _746;
		}
		else
		{
			bool _751 = V_xiADOF_BokehMode == 2;
			if (_751)
			{
				float _754 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehMax.xyz);
				float maxlum_755 = _754;
				float _758 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehSum.xyz);
				float avglum_759 = _758;
				float _760 = maxlum_755 - avglum_759;
				float _762 = max(0.00000000e+00, _760);
				float bokehweight = _762;
				float _764 = bokehweight * V_xfADOF_BokehIntensity;
				float _766 = _764 * 2.00000000e+00;
				bokehweight = _766;
				float _767 = bokehweight * bokehweight;
				bokehweight = _767;
				float _768 = bokehweight * CoC_555;
				float _769 = _768 * nRings;
				float _770 = clamp(_769, 0.0, 1.0);
				vec4 _772 = BokehMax * vec4(_770);
				vec4 _773 = BokehSum + _772;
				ret = _773;
			}
			else
			{
				bool _778 = V_xiADOF_BokehMode == 3;
				if (_778)
				{
					float _781 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehMax.xyz);
					float maxlum_782 = _781;
					float _785 = dot(vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01), BokehSum.xyz);
					float avglum_786 = _785;
					float _787 = maxlum_782 - avglum_786;
					float bokehweight_788 = _787;
					float _789 = bokehweight_788 * CoC_555;
					float _790 = _789 * nRings;
					float _791 = _790 * V_xfADOF_BokehIntensity;
					float _792 = clamp(_791, 0.0, 1.0);
					vec4 _794 = mix(BokehSum, BokehMax, vec4(_792));
					ret = _794;
				}
			}
		}
	}
	vec3 _795;
	_795 = ret.xyz;
	F_xpack_hdr(_795);
	ret.xyz = _795;
	return ret;
}
void F_xPS_DoF_Combine(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec2 _804 = IN.txcoord.xy * vec2(V_xfADOF_RenderResolutionMult);
	vec4 _805 = texture(V_xsCommonTex1, _804);
	vec4 blurredColor = _805;
	vec4 _808 = texture(V_xqUINT_xsBackBufferTex, IN.txcoord.xy);
	vec4 originalColor = _808;
	vec2 _810;
	bool _811;
	_810 = IN.txcoord.xy;
	_811 = false;
	float _814 = F_xCircleOfConfusion(_810, _811);
	float _815 = abs(_814);
	float CoC_816 = _815;
	float _817;
	_817 = CoC_816;
	vec2 _818 = F_xCoC2BlurRadius(_817);
	float _821 = _818.x * 1.92000000e+03;
	float bokehRadiusPixels = _821;
	float _824 = bokehRadiusPixels - 2.50000000e-01;
	float _826 = _824 / 1.75000000e+00;
	float _827 = clamp(_826, 0.0, 1.0);
	float blendWeight = _827;
	float _830 = pow(blendWeight, 5.00000000e-01);
	blendWeight = _830;
	vec3 _834 = mix(originalColor.xyz, blurredColor.xyz, vec3(blendWeight));
	color.xyz = _834;
	float _836 = CoC_816 * 4.00000000e+00;
	float _837 = clamp(_836, 0.0, 1.0);
	float _839 = _837 * 5.00000000e-01;
	float _841 = _839 + 5.00000000e-01;
	color[3] = _841;
	return;
}
void F_xPS_DoF_Gauss1(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec4 _847 = texture(V_xsCommonTex0, IN.txcoord.xy);
	vec4 centerTap = _847;
	float _851 = centerTap.w * 2.00000000e+00;
	float _853 = _851 - 1.00000000e+00;
	float _854 = abs(_853);
	float CoC_855 = _854;
	float _857 = V_xfADOF_SmootheningAmount + 0.00000000e+00;
	float _858 = CoC_855 * _857;
	float _859 = floor(_858);
	float nSteps = _859;
	float _861 = nSteps * nSteps;
	float _863 = _861 + 1.00000005e-03;
	float _864 = 1.0 / _863;
	float _866 = -2.00000000e+00 * _864;
	float expCoeff = _866;
	vec2 blurAxisScaled = vec2(5.20833360e-04, 0.00000000e+00);
	vec4 gaussianSum = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float gaussianSumWeight = 1.00000005e-03;
	float _874 = -(nSteps);
	float iStep = _874;
	while (iStep <= nSteps)
	{
		{
			float _885 = iStep * iStep;
			float _886 = _885 * expCoeff;
			float _887 = exp(_886);
			float currentWeight = _887;
			float _890 = 2.00000000e+00 * iStep;
			float _892 = _890 - 5.00000000e-01;
			float currentOffset = _892;
			vec2 _896 = blurAxisScaled.xy * vec2(currentOffset);
			vec2 _898 = IN.txcoord.xy + _896;
			vec4 _903 = vec4(_898.x, _898.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _904 = textureLod(V_xsCommonTex0, _903.xy, _903.w);
			vec4 currentTap = _904;
			float _908 = currentTap.w * 2.00000000e+00;
			float _910 = _908 - 1.00000000e+00;
			float _911 = abs(_910);
			float _913 = CoC_855 * 2.50000000e-01;
			float _914 = _911 - _913;
			float _915 = clamp(_914, 0.0, 1.0);
			float _916 = currentWeight * _915;
			currentWeight = _916;
			vec4 _918 = currentTap * vec4(currentWeight);
			vec4 _919 = gaussianSum + _918;
			gaussianSum = _919;
			float _920 = gaussianSumWeight + currentWeight;
			gaussianSumWeight = _920;
		}
		float _883 = iStep;
		float _884 = _883 + 1.00000000e+00;
		iStep = _884;
	}
	vec4 _922 = gaussianSum / vec4(gaussianSumWeight);
	gaussianSum = _922;
	float _923 = clamp(gaussianSumWeight, 0.0, 1.0);
	vec3 _927 = mix(centerTap.xyz, gaussianSum.xyz, vec3(_923));
	color.xyz = _927;
	color[3] = centerTap.w;
	return;
}
void F_xPS_DoF_Gauss2(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec4 _934 = texture(V_xsCommonTex1, IN.txcoord.xy);
	vec4 centerTap_935 = _934;
	float _938 = centerTap_935.w * 2.00000000e+00;
	float _940 = _938 - 1.00000000e+00;
	float _941 = abs(_940);
	float CoC_942 = _941;
	float _944 = V_xfADOF_SmootheningAmount + 0.00000000e+00;
	float _945 = CoC_942 * _944;
	float _946 = floor(_945);
	float _948 = min(5.00000000e+01, _946);
	float nSteps_949 = _948;
	float _950 = nSteps_949 * nSteps_949;
	float _952 = _950 + 1.00000005e-03;
	float _953 = 1.0 / _952;
	float _955 = -2.00000000e+00 * _953;
	float expCoeff_956 = _955;
	vec2 blurAxisScaled_958 = vec2(0.00000000e+00, 9.25925910e-04);
	vec4 gaussianSum_960 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float gaussianSumWeight_962 = 1.00000005e-03;
	float _963 = -(nSteps_949);
	float iStep_964 = _963;
	while (iStep_964 <= nSteps_949)
	{
		{
			float _974 = iStep_964 * iStep_964;
			float _975 = _974 * expCoeff_956;
			float _976 = exp(_975);
			float currentWeight_977 = _976;
			float _979 = 2.00000000e+00 * iStep_964;
			float _981 = _979 - 5.00000000e-01;
			float currentOffset_982 = _981;
			vec2 _985 = blurAxisScaled_958.xy * vec2(currentOffset_982);
			vec2 _987 = IN.txcoord.xy + _985;
			vec4 _992 = vec4(_987.x, _987.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _993 = textureLod(V_xsCommonTex1, _992.xy, _992.w);
			vec4 currentTap_994 = _993;
			float _997 = currentTap_994.w * 2.00000000e+00;
			float _999 = _997 - 1.00000000e+00;
			float _1000 = abs(_999);
			float _1002 = CoC_942 * 2.50000000e-01;
			float _1003 = _1000 - _1002;
			float _1004 = clamp(_1003, 0.0, 1.0);
			float _1005 = currentWeight_977 * _1004;
			currentWeight_977 = _1005;
			vec4 _1007 = currentTap_994 * vec4(currentWeight_977);
			vec4 _1008 = gaussianSum_960 + _1007;
			gaussianSum_960 = _1008;
			float _1009 = gaussianSumWeight_962 + currentWeight_977;
			gaussianSumWeight_962 = _1009;
		}
		float _972 = iStep_964;
		float _973 = _972 + 1.00000000e+00;
		iStep_964 = _973;
	}
	vec4 _1011 = gaussianSum_960 / vec4(gaussianSumWeight_962);
	gaussianSum_960 = _1011;
	float _1012 = clamp(gaussianSumWeight_962, 0.0, 1.0);
	vec3 _1016 = mix(centerTap_935.xyz, gaussianSum_960.xyz, vec3(_1012));
	color.xyz = _1016;
	color[3] = centerTap_935.w;
	return;
}
void F_xPS_DoF_ChromaticAberration(
	in S_xADOF_VSOUT IN,
	out vec4 color)
{
	vec4 colorVals[5] = _1022;
	vec3 neighbourOffsets_1025 = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec4 _1027 = texture(V_xsCommonTex0, IN.txcoord.xy);
	colorVals[0] = _1027;
	vec2 _1030 = IN.txcoord.xy - neighbourOffsets_1025.xz;
	vec4 _1031 = texture(V_xsCommonTex0, _1030);
	colorVals[1] = _1031;
	vec2 _1034 = IN.txcoord.xy - neighbourOffsets_1025.zy;
	vec4 _1035 = texture(V_xsCommonTex0, _1034);
	colorVals[2] = _1035;
	vec2 _1038 = IN.txcoord.xy + neighbourOffsets_1025.xz;
	vec4 _1039 = texture(V_xsCommonTex0, _1038);
	colorVals[3] = _1039;
	vec2 _1042 = IN.txcoord.xy + neighbourOffsets_1025.zy;
	vec4 _1043 = texture(V_xsCommonTex0, _1042);
	colorVals[4] = _1043;
	float _1046 = colorVals[0].w * 2.00000000e+00;
	float _1048 = _1046 - 1.00000000e+00;
	float _1049 = abs(_1048);
	float CoC_1050 = _1049;
	float _1051;
	_1051 = CoC_1050;
	vec2 _1052 = F_xCoC2BlurRadius(_1051);
	vec2 bokehRadiusScaled_1053 = _1052;
	vec3 _1056 = colorVals[0].xyz - colorVals[1].xyz;
	float _1058 = dot(_1056, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _1061 = colorVals[0].xyz - colorVals[2].xyz;
	float _1063 = dot(_1061, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _1066 = colorVals[3].xyz - colorVals[0].xyz;
	float _1068 = dot(_1066, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _1071 = colorVals[4].xyz - colorVals[0].xyz;
	float _1073 = dot(_1071, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec4 _1074 = vec4(_1058, _1063, _1068, _1073);
	vec4 vGradTwosided = _1074;
	vec2 _1078 = min(vGradTwosided.xy, vGradTwosided.zw);
	vec2 vGrad = _1078;
	float _1080 = dot(vGrad, vGrad);
	float _1081 = sqrt(_1080);
	float _1083 = _1081 + 9.99999997e-07;
	float vGradLen = _1083;
	vec2 _1086 = vGrad / vec2(vGradLen);
	float _1088 = vGradLen * 3.20000000e+01;
	float _1089 = clamp(_1088, 0.0, 1.0);
	vec2 _1091 = _1086 * vec2(_1089);
	vec2 _1092 = _1091 * bokehRadiusScaled_1053;
	vec2 _1094 = _1092 * vec2(1.25000000e-01, 1.25000000e-01);
	vec2 _1096 = _1094 * vec2(V_xfADOF_ShapeChromaAmount);
	vGrad = _1096;
	vec4 chromaVals[3] = _1097;
	chromaVals[0] = colorVals[0];
	vec2 _1101 = IN.txcoord.xy + vGrad;
	vec4 _1102 = texture(V_xsCommonTex0, _1101);
	chromaVals[1] = _1102;
	vec2 _1104 = IN.txcoord.xy - vGrad;
	vec4 _1105 = texture(V_xsCommonTex0, _1104);
	chromaVals[2] = _1105;
	float _1107 = abs(chromaVals[1].w);
	float _1109 = 4.00000000e+00 * _1107;
	float _1110 = clamp(_1109, 0.0, 1.0);
	vec3 _1114 = mix(chromaVals[0].xyz, chromaVals[1].xyz, vec3(_1110));
	chromaVals[1].xyz = _1114;
	float _1116 = abs(chromaVals[2].w);
	float _1118 = 4.00000000e+00 * _1116;
	float _1119 = clamp(_1118, 0.0, 1.0);
	vec3 _1123 = mix(chromaVals[0].xyz, chromaVals[2].xyz, vec3(_1119));
	chromaVals[2].xyz = _1123;
	uvec3 _1126 = uvec3(0u, 1u, 2u) + uvec3(ivec3(V_xiADOF_ShapeChromaMode));
	uvec3 _1128 = _1126 % uvec3(3u, 3u, 3u);
	uvec3 chromaMode = _1128;
	vec3 _1136 = vec3(chromaVals[int(chromaMode.x)].x, chromaVals[int(chromaMode.y)].y, chromaVals[int(chromaMode.z)].z);
	color.xyz = _1136;
	color[3] = 1.00000000e+00;
	return;
}
#ifdef E_xVS_ADOF
out vec4 vv_0;
out vec4 vv_1;
out mat2x2 vv_2;
void main()
{
	uint id = uint(gl_VertexID);
	S_xADOF_VSOUT vso = F_xVS_ADOF(id);   // v23: sebelumnya bernama vv_0 dan bentrok dengan varying vv_0
	gl_Position = vso.vpos;
	vv_0 = vso.txcoord;
	vv_1 = vso.offset0;
	vv_2 = vso.offsmat;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_ReadFocus
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out float vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	float focus;
	F_xPS_ReadFocus(IN, focus);
	vv_0 = focus;
	return;
}
#endif
#ifdef E_xPS_CopyFocus
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out float vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	float focus;
	F_xPS_CopyFocus(IN, focus);
	vv_0 = focus;
	return;
}
#endif
#ifdef E_xPS_CoC
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out vec4 vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vec4 color;
	F_xPS_CoC(IN, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_DoF_Main
out vec4 vv_0;
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vv_0 = F_xPS_DoF_Main(IN);
	return;
}
#endif
#ifdef E_xPS_DoF_Combine
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out vec4 vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vec4 color;
	F_xPS_DoF_Combine(IN, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_DoF_Gauss1
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out vec4 vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vec4 color;
	F_xPS_DoF_Gauss1(IN, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_DoF_Gauss2
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out vec4 vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vec4 color;
	F_xPS_DoF_Gauss2(IN, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xPS_DoF_ChromaticAberration
in vec4 vv_0;
in vec4 vv_1;
in mat2x2 vv_2;
out vec4 vv_0;
void main()
{
	S_xADOF_VSOUT _in_IN = S_xADOF_VSOUT(gl_FragCoord, vv_0, vv_1, vv_2);
	S_xADOF_VSOUT IN = _in_IN;
	vec4 color;
	F_xPS_DoF_ChromaticAberration(IN, color);
	vv_0 = color;
	return;
}
#endif
