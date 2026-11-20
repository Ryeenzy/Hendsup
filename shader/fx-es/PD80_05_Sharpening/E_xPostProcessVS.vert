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
uniform bool V_xpd80_lumasharpen_xenableShowEdges;
uniform float V_xpd80_lumasharpen_xBlurSigma;
uniform float V_xpd80_lumasharpen_xSharpening;
uniform float V_xpd80_lumasharpen_xThreshold;
uniform float V_xpd80_lumasharpen_xlimiter;
uniform bool V_xpd80_lumasharpen_xenable_depth;
uniform bool V_xpd80_lumasharpen_xenable_reverse;
uniform bool V_xpd80_lumasharpen_xdisplay_depth;
uniform float V_xpd80_lumasharpen_xdepthStart;
uniform float V_xpd80_lumasharpen_xdepthEnd;
uniform float V_xpd80_lumasharpen_xdepthCurve;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xpd80_lumasharpen_xsamplerGaussianH;
uniform sampler2D V_xpd80_lumasharpen_xsamplerGaussian;
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
float F_xpd80_lumasharpen_xgetLuminance(
	in vec3 x)
{
	float _80 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _80;
}
float F_xpd80_lumasharpen_xgetAvgColor(
	in vec3 col)
{
	float _86 = dot(col.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	return _86;
}
vec3 F_xpd80_lumasharpen_xClipColor(
	in vec3 color)
{
	vec3 _90;
	_90 = color.xyz;
	float _92 = F_xpd80_lumasharpen_xgetAvgColor(_90);
	float lum = _92;
	float _96 = min(color.x, color.y);
	float _98 = min(_96, color.z);
	float mincol = _98;
	float _102 = max(color.x, color.y);
	float _104 = max(_102, color.z);
	float maxcol = _104;
	bool _107 = mincol < 0.00000000e+00;
	vec3 _110 = color.xyz - vec3(lum);
	vec3 _112 = _110 * vec3(lum);
	float _113 = lum - mincol;
	vec3 _115 = _112 / vec3(_113);
	vec3 _117 = vec3(lum) + _115;
	vec3 _120 = compCond(bvec3(_107), _117, color.xyz);
	color.xyz = _120;
	bool _122 = maxcol > 1.00000000e+00;
	vec3 _125 = color.xyz - vec3(lum);
	float _127 = 1.00000000e+00 - lum;
	vec3 _129 = _125 * vec3(_127);
	float _130 = maxcol - lum;
	vec3 _132 = _129 / vec3(_130);
	vec3 _134 = vec3(lum) + _132;
	vec3 _137 = compCond(bvec3(_122), _134, color.xyz);
	color.xyz = _137;
	return color;
}
vec3 F_xpd80_lumasharpen_xblendLuma(
	in vec3 base,
	in vec3 blend)
{
	vec3 _142;
	_142 = base.xyz;
	float _144 = F_xpd80_lumasharpen_xgetAvgColor(_142);
	float lumbase = _144;
	vec3 _146;
	_146 = blend.xyz;
	float _148 = F_xpd80_lumasharpen_xgetAvgColor(_146);
	float lumblend = _148;
	float _150 = lumblend - lumbase;
	float ldiff = _150;
	vec3 _154 = base.xyz + vec3(ldiff);
	vec3 col_155 = _154;
	vec3 _156;
	_156 = col_155.xyz;
	vec3 _158 = F_xpd80_lumasharpen_xClipColor(_156);
	return _158;
}
vec3 F_xpd80_lumasharpen_xscreen(
	in vec3 c,
	in vec3 b)
{
	vec3 _164 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c;
	vec3 _166 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 _167 = _164 * _166;
	vec3 _169 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _167;
	return _169;
}
vec4 F_xpd80_lumasharpen_xPS_GaussianH(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _174 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_175 = _174;
	float px = 5.20833360e-04;
	float SigmaSum = 0.00000000e+00;
	float pxlOffset = 1.00000000e+00;
	int _184 = max(1920, 1080);
	float _187 = float(_184) / 1.92000000e+03;
	float _189 = _187 * 4.00000000e+00;
	float loops = _189;
	vec3 Sigma = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int _195 = max(1920, 1080);
	float _198 = float(_195) / 1.92000000e+03;
	float _199 = V_xpd80_lumasharpen_xBlurSigma * _198;
	float bSigma = _199;
	float _202 = sqrt(6.28318405e+00);
	float _203 = _202 * bSigma;
	float _205 = 1.00000000e+00 / _203;
	Sigma[0] = _205;
	float _206 = bSigma * bSigma;
	float _208 = -5.00000000e-01 / _206;
	float _209 = exp(_208);
	Sigma[1] = _209;
	float _212 = Sigma.y * Sigma.y;
	Sigma[2] = _212;
	vec3 _215 = color_175.xyz * vec3(Sigma.x);
	color_175.xyz = _215;
	float _217 = SigmaSum + Sigma.x;
	SigmaSum = _217;
	vec2 _220 = Sigma.xy * Sigma.yz;
	Sigma.xy = _220;
	int i = 0;
	while (float(i) < loops)
	{
		{
			float _232 = pxlOffset * px;
			vec2 _234 = vec2(_232, 0.00000000e+00);
			vec2 _236 = texcoord.xy + _234;
			vec4 _241 = vec4(_236.x, _236.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _242 = textureLod(V_xReShade_xBackBuffer, _241.xy, _241.w);
			vec4 _244 = _242 * vec4(Sigma.x);
			vec4 _245 = color_175 + _244;
			color_175 = _245;
			float _246 = pxlOffset * px;
			vec2 _248 = vec2(_246, 0.00000000e+00);
			vec2 _250 = texcoord.xy - _248;
			vec4 _255 = vec4(_250.x, _250.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _256 = textureLod(V_xReShade_xBackBuffer, _255.xy, _255.w);
			vec4 _258 = _256 * vec4(Sigma.x);
			vec4 _259 = color_175 + _258;
			color_175 = _259;
			float _262 = 2.00000000e+00 * Sigma.x;
			float _263 = SigmaSum + _262;
			SigmaSum = _263;
			float _265 = pxlOffset + 1.00000000e+00;
			pxlOffset = _265;
			vec2 _268 = Sigma.xy * Sigma.yz;
			Sigma.xy = _268;
		}
		int _231 = i + 1;
		i = _231;
	}
	vec3 _271 = color_175.xyz / vec3(SigmaSum);
	color_175.xyz = _271;
	vec4 _276 = vec4(color_175.xyz.x, color_175.xyz.y, color_175.xyz.z, 1.00000000e+00);
	return _276;
}
vec4 F_xpd80_lumasharpen_xPS_GaussianV(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _281 = texture(V_xpd80_lumasharpen_xsamplerGaussianH, texcoord);
	vec4 color_282 = _281;
	float py = 9.25925910e-04;
	float SigmaSum_286 = 0.00000000e+00;
	float pxlOffset_288 = 1.00000000e+00;
	int _291 = max(1920, 1080);
	float _294 = float(_291) / 1.92000000e+03;
	float _296 = _294 * 4.00000000e+00;
	float loops_297 = _296;
	vec3 Sigma_299 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int _302 = max(1920, 1080);
	float _305 = float(_302) / 1.92000000e+03;
	float _306 = V_xpd80_lumasharpen_xBlurSigma * _305;
	float bSigma_307 = _306;
	float _309 = sqrt(6.28318405e+00);
	float _310 = _309 * bSigma_307;
	float _312 = 1.00000000e+00 / _310;
	Sigma_299[0] = _312;
	float _313 = bSigma_307 * bSigma_307;
	float _315 = -5.00000000e-01 / _313;
	float _316 = exp(_315);
	Sigma_299[1] = _316;
	float _319 = Sigma_299.y * Sigma_299.y;
	Sigma_299[2] = _319;
	vec3 _322 = color_282.xyz * vec3(Sigma_299.x);
	color_282.xyz = _322;
	float _324 = SigmaSum_286 + Sigma_299.x;
	SigmaSum_286 = _324;
	vec2 _327 = Sigma_299.xy * Sigma_299.yz;
	Sigma_299.xy = _327;
	int i_329 = 0;
	while (float(i_329) < loops_297)
	{
		{
			float _339 = pxlOffset_288 * py;
			vec2 _341 = vec2(0.00000000e+00, _339);
			vec2 _343 = texcoord.xy + _341;
			vec4 _348 = vec4(_343.x, _343.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _349 = textureLod(V_xpd80_lumasharpen_xsamplerGaussianH, _348.xy, _348.w);
			vec4 _351 = _349 * vec4(Sigma_299.x);
			vec4 _352 = color_282 + _351;
			color_282 = _352;
			float _353 = pxlOffset_288 * py;
			vec2 _355 = vec2(0.00000000e+00, _353);
			vec2 _357 = texcoord.xy - _355;
			vec4 _362 = vec4(_357.x, _357.y, 0.00000000e+00, 0.00000000e+00);
			vec4 _363 = textureLod(V_xpd80_lumasharpen_xsamplerGaussianH, _362.xy, _362.w);
			vec4 _365 = _363 * vec4(Sigma_299.x);
			vec4 _366 = color_282 + _365;
			color_282 = _366;
			float _369 = 2.00000000e+00 * Sigma_299.x;
			float _370 = SigmaSum_286 + _369;
			SigmaSum_286 = _370;
			float _372 = pxlOffset_288 + 1.00000000e+00;
			pxlOffset_288 = _372;
			vec2 _375 = Sigma_299.xy * Sigma_299.yz;
			Sigma_299.xy = _375;
		}
		int _338 = i_329 + 1;
		i_329 = _338;
	}
	vec3 _378 = color_282.xyz / vec3(SigmaSum_286);
	color_282.xyz = _378;
	vec4 _383 = vec4(color_282.xyz.x, color_282.xyz.y, color_282.xyz.z, 1.00000000e+00);
	return _383;
}
vec4 F_xpd80_lumasharpen_xPS_LumaSharpen(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _388 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 orig = _388;
	vec4 _390 = texture(V_xpd80_lumasharpen_xsamplerGaussian, texcoord);
	vec4 gaussian = _390;
	vec2 _392;
	_392 = texcoord;
	float _393 = F_xReShade_xGetLinearizedDepth(_392);
	float depth_394 = _393;
	float _395 = smoothstep(V_xpd80_lumasharpen_xdepthStart, V_xpd80_lumasharpen_xdepthEnd, depth_394);
	depth_394 = _395;
	float _396 = pow(depth_394, V_xpd80_lumasharpen_xdepthCurve);
	depth_394 = _396;
	float _398 = 1.00000000e+00 - depth_394;
	float _399 = V_xpd80_lumasharpen_xenable_reverse ? _398 : depth_394;
	depth_394 = _399;
	vec3 _402 = orig.xyz - gaussian.xyz;
	vec3 _403 = clamp(_402, 0.0, 1.0);
	vec3 _405 = _403 - vec3(V_xpd80_lumasharpen_xThreshold);
	vec3 _407 = max(_405, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 edges = _407;
	vec3 _411 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - gaussian.xyz;
	vec3 _412 = clamp(_411, 0.0, 1.0);
	vec3 invGauss = _412;
	vec3 _416 = orig.xyz + invGauss.xyz;
	vec3 _417 = clamp(_416, 0.0, 1.0);
	vec3 oInvGauss = _417;
	vec3 _421 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - oInvGauss.xyz;
	vec3 _422 = clamp(_421, 0.0, 1.0);
	vec3 _424 = _422 - vec3(V_xpd80_lumasharpen_xThreshold);
	vec3 _426 = max(_424, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 invOGauss = _426;
	vec3 _430 = vec3(V_xpd80_lumasharpen_xSharpening) * edges.xyz;
	vec3 _431 = clamp(_430, 0.0, 1.0);
	vec3 _434 = vec3(V_xpd80_lumasharpen_xSharpening) * invOGauss.xyz;
	vec3 _435 = clamp(_434, 0.0, 1.0);
	vec3 _436 = _431 - _435;
	vec3 _438 = max(_436, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	edges = _438;
	vec3 _441 = min(edges.xyz, vec3(V_xpd80_lumasharpen_xlimiter));
	float _443 = float(V_xpd80_lumasharpen_xenable_depth) * depth_394;
	vec3 _446 = mix(_441, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_443));
	vec3 _447;
	vec3 _448;
	_447 = orig.xyz;
	_448 = _446;
	vec3 _450 = F_xpd80_lumasharpen_xscreen(_447, _448);
	vec3 blend_451 = _450;
	vec3 _452;
	vec3 _453;
	_452 = orig.xyz;
	_453 = blend_451.xyz;
	vec3 _456 = F_xpd80_lumasharpen_xblendLuma(_452, _453);
	vec3 color_457 = _456;
	vec3 _460 = min(edges.xyz, vec3(V_xpd80_lumasharpen_xlimiter));
	vec3 _463 = min(edges.xyz, vec3(V_xpd80_lumasharpen_xlimiter));
	vec3 _465 = _463 * vec3(depth_394);
	vec3 _467 = mix(_460, _465, vec3(bvec3(V_xpd80_lumasharpen_xenable_depth)));
	vec3 _470 = compCond(bvec3(V_xpd80_lumasharpen_xenableShowEdges), _467, color_457.xyz);
	color_457.xyz = _470;
	vec3 _474 = compCond(bvec3(V_xpd80_lumasharpen_xdisplay_depth), vec3(depth_394), color_457.xyz);
	color_457.xyz = _474;
	vec4 _479 = vec4(color_457.xyz.x, color_457.xyz.y, color_457.xyz.z, 1.00000000e+00);
	return _479;
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
#ifdef E_xpd80_lumasharpen_xPS_GaussianH
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_lumasharpen_xPS_GaussianH(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumasharpen_xPS_GaussianV
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_lumasharpen_xPS_GaussianV(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_lumasharpen_xPS_LumaSharpen
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_lumasharpen_xPS_LumaSharpen(pos, texcoord);
	return;
}
#endif
