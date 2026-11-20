#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xAdvancedCRTPass
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
uniform float V_xAmount;
uniform float V_xResolution;
uniform float V_xGamma;
uniform float V_xMonitorGamma;
uniform float V_xBrightness;
uniform int V_xScanlineIntensity;
uniform bool V_xScanlineGaussian;
uniform bool V_xCurvature;
uniform float V_xCurvatureRadius;
uniform float V_xCornerSize;
uniform float V_xViewerDistance;
uniform vec2 V_xAngle;
uniform float V_xOverscan;
uniform bool V_xOversample;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _24 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _24;
	float _27 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _27;
	float _30 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _30;
	float _33 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _33;
	vec4 _38 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _39 = textureLod(V_xReShade_xDepthBuffer, _38.xy, _38.w);
	float _42 = _39.x * 1.00000000e+00;
	float depth = _42;
	float _45 = 1.00000000e+00 - depth;
	depth = _45;
	float _47 = depth * 9.99000000e+02;
	float _49 = 1.00000000e+03 - _47;
	float _50 = depth / _49;
	depth = _50;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _57 = id == 2u;
	float _60 = _57 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _60;
	bool _62 = id == 1u;
	float _65 = _62 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _65;
	vec2 _67 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _69 = _67 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _74 = vec4(_69.x, _69.y, 0.00000000e+00, 1.00000000e+00);
	position = _74;
	return;
}
float F_xintersect(
	in vec2 xy)
{
	float _78 = dot(xy, xy);
	float _79 = V_xViewerDistance * V_xViewerDistance;
	float _80 = _78 + _79;
	float A = _80;
	vec2 _82 = sin(V_xAngle);
	float _83 = dot(xy, _82);
	vec2 _84 = cos(V_xAngle);
	float _86 = V_xViewerDistance * _84.x;
	vec2 _87 = cos(V_xAngle);
	float _89 = _86 * _87.y;
	float _90 = _83 - _89;
	float _91 = V_xCurvatureRadius * _90;
	float _92 = V_xViewerDistance * V_xViewerDistance;
	float _93 = _91 - _92;
	float _95 = 2.00000000e+00 * _93;
	float B = _95;
	float _97 = V_xViewerDistance * V_xViewerDistance;
	float _99 = 2.00000000e+00 * V_xCurvatureRadius;
	float _100 = _99 * V_xViewerDistance;
	vec2 _101 = cos(V_xAngle);
	float _103 = _100 * _101.x;
	vec2 _104 = cos(V_xAngle);
	float _106 = _103 * _104.y;
	float _107 = _97 + _106;
	float C = _107;
	float _109 = -(B);
	float _110 = B * B;
	float _112 = 4.00000000e+00 * A;
	float _113 = _112 * C;
	float _114 = _110 - _113;
	float _115 = sqrt(_114);
	float _116 = _109 - _115;
	float _118 = 2.00000000e+00 * A;
	float _119 = _116 / _118;
	return _119;
}
vec2 F_xbkwtrans(
	in vec2 xy)
{
	vec2 _123;
	_123 = xy;
	float _124 = F_xintersect(_123);
	float c = _124;
	vec2 _126 = vec2(c, c);
	vec2 _127 = _126 * xy;
	vec2 _128 = _127;
	float _129 = -(V_xCurvatureRadius);
	float _130 = -(V_xCurvatureRadius);
	vec2 _131 = vec2(_129, _130);
	vec2 _132 = sin(V_xAngle);
	vec2 _133 = _131 * _132;
	vec2 _134 = _128 - _133;
	_128 = _134;
	vec2 _135 = vec2(V_xCurvatureRadius, V_xCurvatureRadius);
	vec2 _136 = _128 / _135;
	_128 = _136;
	vec2 _137 = sin(V_xAngle);
	vec2 _138 = cos(V_xAngle);
	vec2 _139 = _137 / _138;
	vec2 tang = _139;
	vec2 _141 = cos(V_xAngle);
	vec2 _142 = _128 / _141;
	vec2 poc = _142;
	float _144 = dot(tang, tang);
	float _146 = _144 + 1.00000000e+00;
	float A_147 = _146;
	float _148 = dot(poc, tang);
	float _150 = -2.00000000e+00 * _148;
	float B_151 = _150;
	float _152 = dot(poc, poc);
	float _154 = _152 - 1.00000000e+00;
	float C_155 = _154;
	float _156 = -(B_151);
	float _157 = B_151 * B_151;
	float _159 = 4.00000000e+00 * A_147;
	float _160 = _159 * C_155;
	float _161 = _157 - _160;
	float _162 = sqrt(_161);
	float _163 = _156 + _162;
	float _165 = 2.00000000e+00 * A_147;
	float _166 = _163 / _165;
	float a = _166;
	vec2 _168 = sin(V_xAngle);
	vec2 _170 = vec2(a) * _168;
	vec2 _171 = _128 - _170;
	vec2 _172 = cos(V_xAngle);
	vec2 _173 = _171 / _172;
	vec2 uv = _173;
	float _175 = acos(a);
	float _176 = V_xCurvatureRadius * _175;
	float r = _176;
	vec2 _179 = uv * vec2(r);
	float _180 = r / V_xCurvatureRadius;
	float _181 = sin(_180);
	vec2 _183 = _179 / vec2(_181);
	return _183;
}
vec2 F_xfwtrans(
	in vec2 uv)
{
	float _187 = dot(uv, uv);
	float _188 = sqrt(_187);
	float _189 = abs(_188);
	float _191 = max(_189, 9.99999975e-06);
	float r_192 = _191;
	float _193 = r_192 / V_xCurvatureRadius;
	float _194 = sin(_193);
	float _195 = _194 / r_192;
	vec2 _197 = uv * vec2(_195);
	uv = _197;
	float _198 = r_192 / V_xCurvatureRadius;
	float _199 = cos(_198);
	float _201 = 1.00000000e+00 - _199;
	float x = _201;
	float _203 = V_xViewerDistance / V_xCurvatureRadius;
	vec2 _204 = cos(V_xAngle);
	float _206 = x * _204.x;
	vec2 _207 = cos(V_xAngle);
	float _209 = _206 * _207.y;
	float _210 = _203 + _209;
	vec2 _211 = sin(V_xAngle);
	float _212 = dot(uv, _211);
	float _213 = _210 + _212;
	float D = _213;
	vec2 _215 = cos(V_xAngle);
	vec2 _216 = uv * _215;
	vec2 _217 = sin(V_xAngle);
	vec2 _219 = vec2(x) * _217;
	vec2 _220 = _216 - _219;
	vec2 _222 = vec2(V_xViewerDistance) * _220;
	vec2 _224 = _222 / vec2(D);
	return _224;
}
vec3 F_xmaxscale()
{
	float _227 = -(V_xCurvatureRadius);
	vec2 _228 = sin(V_xAngle);
	vec2 _230 = vec2(_227) * _228;
	float _231 = V_xCurvatureRadius / V_xViewerDistance;
	vec2 _232 = cos(V_xAngle);
	float _234 = _231 * _232.x;
	vec2 _235 = cos(V_xAngle);
	float _237 = _234 * _235.y;
	float _239 = 1.00000000e+00 + _237;
	vec2 _241 = _230 / vec2(_239);
	vec2 _242;
	_242 = _241;
	vec2 _243 = F_xbkwtrans(_242);
	vec2 c_244 = _243;
	vec2 a_246 = vec2(5.00000000e-01, 3.75000000e-01);
	float _248 = -(a_246.x);
	vec2 _250 = vec2(_248, c_244.y);
	vec2 _251;
	_251 = _250;
	vec2 _252 = F_xfwtrans(_251);
	float _254 = -(a_246.y);
	vec2 _256 = vec2(c_244.x, _254);
	vec2 _257;
	_257 = _256;
	vec2 _258 = F_xfwtrans(_257);
	vec2 _261 = vec2(_252.x, _258.y);
	vec2 _263 = _261 / vec2(1.00000000e+00, 7.50000000e-01);
	vec2 lo = _263;
	vec2 _267 = vec2(a_246.x, c_244.y);
	vec2 _268;
	_268 = _267;
	vec2 _269 = F_xfwtrans(_268);
	vec2 _272 = vec2(c_244.x, a_246.y);
	vec2 _273;
	_273 = _272;
	vec2 _274 = F_xfwtrans(_273);
	vec2 _277 = vec2(_269.x, _274.y);
	vec2 _279 = _277 / vec2(1.00000000e+00, 7.50000000e-01);
	vec2 hi = _279;
	vec2 _281 = hi + lo;
	vec2 _283 = _281 * vec2(1.00000000e+00, 7.50000000e-01);
	vec2 _285 = _283 * vec2(5.00000000e-01, 5.00000000e-01);
	float _288 = hi.x - lo.x;
	float _291 = hi.y - lo.y;
	float _292 = max(_288, _291);
	vec3 _295 = vec3(_285.x, _285.y, _292);
	return _295;
}
vec2 F_xtransform(
	in vec2 coord,
	in vec2 textureSize,
	in vec2 inputSize)
{
	vec2 _301 = textureSize / inputSize;
	vec2 _302 = coord * _301;
	coord = _302;
	vec2 _304 = coord - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _306 = _304 * vec2(1.00000000e+00, 7.50000000e-01);
	vec3 _307 = F_xmaxscale();
	vec2 _309 = _306 * vec2(_307.z);
	vec3 _310 = F_xmaxscale();
	vec2 _312 = _309 + _310.xy;
	coord = _312;
	vec2 _313;
	_313 = coord;
	vec2 _314 = F_xbkwtrans(_313);
	vec2 _315 = vec2(V_xOverscan, V_xOverscan);
	vec2 _316 = _314 / _315;
	vec2 _318 = _316 / vec2(1.00000000e+00, 7.50000000e-01);
	vec2 _320 = _318 + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _321 = _320 * inputSize;
	vec2 _322 = _321 / textureSize;
	return _322;
}
float F_xcorner(
	in vec2 coord,
	in vec2 textureSize,
	in vec2 inputSize)
{
	vec2 _328 = textureSize / inputSize;
	vec2 _329 = coord * _328;
	coord = _329;
	vec2 _331 = coord - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _332 = vec2(V_xOverscan, V_xOverscan);
	vec2 _333 = _331 * _332;
	vec2 _335 = _333 + vec2(5.00000000e-01, 5.00000000e-01);
	coord = _335;
	vec2 _337 = vec2(1.00000000e+00, 1.00000000e+00) - coord;
	vec2 _338 = min(coord, _337);
	vec2 _340 = _338 * vec2(1.00000000e+00, 7.50000000e-01);
	coord = _340;
	vec2 _341 = vec2(V_xCornerSize, V_xCornerSize);
	vec2 cdist = _341;
	vec2 _343 = min(coord, cdist);
	vec2 _344 = cdist - _343;
	coord = _344;
	float _345 = dot(coord, coord);
	float _346 = sqrt(_345);
	float dist = _346;
	float _349 = cdist.x - dist;
	float _351 = _349 * 1.00000000e+03;
	float _354 = clamp(_351, 0.00000000e+00, 1.00000000e+00);
	return _354;
}
vec4 F_xscanlineWeights(
	in float _distance,
	in vec4 color)
{
	bool _362 = !bool(V_xScanlineGaussian);
	if (_362)
	{
		vec4 _363 = abs(color);
		vec4 _365 = pow(_363, vec4(3.00000000e+00, 3.00000000e+00, 3.00000000e+00, 3.00000000e+00));
		vec4 _367 = vec4(1.00000001e-01, 1.00000001e-01, 1.00000001e-01, 1.00000001e-01) * _365;
		vec4 _369 = vec4(3.00000012e-01, 3.00000012e-01, 3.00000012e-01, 3.00000012e-01) + _367;
		vec4 wid = _369;
		vec4 _372 = vec4(_distance) / wid;
		vec4 weights = _372;
		vec4 _374 = -(weights);
		vec4 _375 = _374 * weights;
		vec4 _376 = exp(_375);
		vec4 _378 = vec4(4.00000006e-01, 4.00000006e-01, 4.00000006e-01, 4.00000006e-01) * _376;
		vec4 _379 = _378 / wid;
		return _379;
	}
	else
	{
		vec4 _380 = abs(color);
		vec4 _382 = pow(_380, vec4(4.00000000e+00, 4.00000000e+00, 4.00000000e+00, 4.00000000e+00));
		vec4 _384 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _382;
		vec4 _386 = _384 + vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec4 wid_387 = _386;
		float _389 = _distance / 3.00000012e-01;
		vec4 weights_391 = vec4(_389);
		vec4 _393 = vec4(5.00000000e-01, 5.00000000e-01, 5.00000000e-01, 5.00000000e-01) * wid_387;
		vec4 _394 = inversesqrt(_393);
		vec4 _395 = weights_391 * _394;
		vec4 _396 = abs(_395);
		vec4 _397 = abs(wid_387);
		vec4 _398 = pow(_396, _397);
		vec4 _399 = -(_398);
		vec4 _400 = exp(_399);
		vec4 _402 = vec4(1.39999998e+00, 1.39999998e+00, 1.39999998e+00, 1.39999998e+00) * _400;
		vec4 _404 = vec4(2.00000003e-01, 2.00000003e-01, 2.00000003e-01, 2.00000003e-01) * wid_387;
		vec4 _406 = _404 + vec4(6.00000024e-01, 6.00000024e-01, 6.00000024e-01, 6.00000024e-01);
		vec4 _407 = _402 / _406;
		return _407;
	}
}
vec3 F_xAdvancedCRTPass(
	in vec4 position,
	in vec2 tex)
{
	float _413 = 2.56000000e+02 * V_xResolution;
	float _414 = ceil(_413);
	float Input_ratio = _414;
	vec2 _416 = vec2(Input_ratio, Input_ratio);
	vec2 Resolution = _416;
	vec2 rubyTextureSize = Resolution;
	vec2 rubyInputSize = Resolution;
	vec2 rubyOutputSize = vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _422;
	vec2 _423;
	vec2 _424;
	_422 = tex;
	_423 = rubyTextureSize;
	_424 = rubyInputSize;
	vec2 _425 = F_xtransform(_422, _423, _424);
	vec2 _427 = compCond(bvec2(V_xCurvature), _425, tex);
	vec2 orig_xy = _427;
	vec2 _429;
	vec2 _430;
	vec2 _431;
	_429 = orig_xy;
	_430 = rubyTextureSize;
	_431 = rubyInputSize;
	float _432 = F_xcorner(_429, _430, _431);
	float cval = _432;
	vec2 _434 = orig_xy * rubyTextureSize;
	vec2 _436 = _434 - vec2(5.00000000e-01, 5.00000000e-01);
	vec2 ratio_scale = _436;
	float _439 = fwidth(ratio_scale.y);
	float _filter = _439;
	vec2 _441 = fract(ratio_scale);
	vec2 uv_ratio = _441;
	vec2 _443 = floor(ratio_scale);
	vec2 _445 = _443 + vec2(5.00000000e-01, 5.00000000e-01);
	vec2 _446 = _445 / rubyTextureSize;
	vec2 xy_447 = _446;
	float _450 = 1.00000000e+00 + uv_ratio.x;
	float _453 = 1.00000000e+00 - uv_ratio.x;
	float _456 = 2.00000000e+00 - uv_ratio.x;
	vec4 _458 = vec4(_450, uv_ratio.x, _453, _456);
	vec4 _460 = vec4(3.14159274e+00, 3.14159274e+00, 3.14159274e+00, 3.14159274e+00) * _458;
	vec4 coeffs = _460;
	vec4 _462 = abs(coeffs);
	vec4 _464 = max(_462, vec4(9.99999975e-06, 9.99999975e-06, 9.99999975e-06, 9.99999975e-06));
	coeffs = _464;
	vec4 _465 = sin(coeffs);
	vec4 _467 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _465;
	vec4 _469 = coeffs / vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _470 = sin(_469);
	vec4 _471 = _467 * _470;
	vec4 _472 = coeffs * coeffs;
	vec4 _473 = _471 / _472;
	coeffs = _473;
	float _475 = dot(coeffs, vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec4 _477 = coeffs / vec4(_475);
	coeffs = _477;
	float _480 = -1.00000000e+00 / rubyTextureSize.x;
	vec2 _482 = vec2(_480, 0.00000000e+00);
	vec2 _483 = xy_447 + _482;
	vec4 _484 = texture(V_xReShade_xBackBuffer, _483);
	vec4 _485 = texture(V_xReShade_xBackBuffer, xy_447);
	float _488 = 1.00000000e+00 / rubyTextureSize.x;
	vec2 _490 = vec2(_488, 0.00000000e+00);
	vec2 _491 = xy_447 + _490;
	vec4 _492 = texture(V_xReShade_xBackBuffer, _491);
	float _495 = 2.00000000e+00 / rubyTextureSize.x;
	vec2 _497 = vec2(_495, 0.00000000e+00);
	vec2 _498 = xy_447 + _497;
	vec4 _499 = texture(V_xReShade_xBackBuffer, _498);
	mat4x4 _516 = mat4x4(_484.x, _484.y, _484.z, _484.w, _485.x, _485.y, _485.z, _485.w, _492.x, _492.y, _492.z, _492.w, _499.x, _499.y, _499.z, _499.w);
	vec4 _517 = (_516 * coeffs);
	vec4 _520 = clamp(_517, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec4 col = _520;
	float _524 = -1.00000000e+00 / rubyTextureSize.x;
	float _527 = 1.00000000e+00 / rubyTextureSize.y;
	vec2 _528 = vec2(_524, _527);
	vec2 _529 = xy_447 + _528;
	vec4 _530 = texture(V_xReShade_xBackBuffer, _529);
	float _533 = 1.00000000e+00 / rubyTextureSize.y;
	vec2 _535 = vec2(0.00000000e+00, _533);
	vec2 _536 = xy_447 + _535;
	vec4 _537 = texture(V_xReShade_xBackBuffer, _536);
	vec2 _539 = vec2(1.00000000e+00, 1.00000000e+00) / rubyTextureSize;
	vec2 _540 = xy_447 + _539;
	vec4 _541 = texture(V_xReShade_xBackBuffer, _540);
	float _544 = 2.00000000e+00 / rubyTextureSize.x;
	float _547 = 1.00000000e+00 / rubyTextureSize.y;
	vec2 _548 = vec2(_544, _547);
	vec2 _549 = xy_447 + _548;
	vec4 _550 = texture(V_xReShade_xBackBuffer, _549);
	mat4x4 _567 = mat4x4(_530.x, _530.y, _530.z, _530.w, _537.x, _537.y, _537.z, _537.w, _541.x, _541.y, _541.z, _541.w, _550.x, _550.y, _550.z, _550.w);
	vec4 _568 = (_567 * coeffs);
	vec4 _571 = clamp(_568, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec4 col2 = _571;
	vec4 _573 = abs(col);
	vec4 _575 = pow(_573, vec4(V_xGamma));
	col = _575;
	vec4 _576 = abs(col2);
	vec4 _578 = pow(_576, vec4(V_xGamma));
	col2 = _578;
	float _579;
	vec4 _580;
	_579 = uv_ratio.y;
	_580 = col;
	vec4 _582 = F_xscanlineWeights(_579, _580);
	vec4 weights_583 = _582;
	float _586 = 1.00000000e+00 - uv_ratio.y;
	float _587;
	vec4 _588;
	_587 = _586;
	_588 = col2;
	vec4 _589 = F_xscanlineWeights(_587, _588);
	vec4 weights2 = _589;
	if (V_xOversample)
	{
		float _595 = 3.33333343e-01 * _filter;
		float _597 = uv_ratio.y + _595;
		uv_ratio[1] = _597;
		float _598;
		vec4 _599;
		_598 = uv_ratio.y;
		_599 = col;
		vec4 _601 = F_xscanlineWeights(_598, _599);
		vec4 _602 = weights_583 + _601;
		vec4 _604 = _602 / vec4(3.00000000e+00, 3.00000000e+00, 3.00000000e+00, 3.00000000e+00);
		weights_583 = _604;
		float _607 = 1.00000000e+00 - uv_ratio.y;
		float _608 = abs(_607);
		float _609;
		vec4 _610;
		_609 = _608;
		_610 = col2;
		vec4 _611 = F_xscanlineWeights(_609, _610);
		vec4 _612 = weights2 + _611;
		vec4 _614 = _612 / vec4(3.00000000e+00, 3.00000000e+00, 3.00000000e+00, 3.00000000e+00);
		weights2 = _614;
		float _616 = 6.66666687e-01 * _filter;
		float _618 = uv_ratio.y - _616;
		uv_ratio[1] = _618;
		float _620 = abs(uv_ratio.y);
		float _621;
		vec4 _622;
		_621 = _620;
		_622 = col;
		vec4 _623 = F_xscanlineWeights(_621, _622);
		vec4 _625 = _623 / vec4(3.00000000e+00, 3.00000000e+00, 3.00000000e+00, 3.00000000e+00);
		vec4 _626 = weights_583 + _625;
		weights_583 = _626;
		float _629 = 1.00000000e+00 - uv_ratio.y;
		float _630 = abs(_629);
		float _631;
		vec4 _632;
		_631 = _630;
		_632 = col2;
		vec4 _633 = F_xscanlineWeights(_631, _632);
		vec4 _635 = _633 / vec4(3.00000000e+00, 3.00000000e+00, 3.00000000e+00, 3.00000000e+00);
		vec4 _636 = weights2 + _635;
		weights2 = _636;
	}
	vec4 _637 = col * weights_583;
	vec4 _638 = col2 * weights2;
	vec4 _639 = _637 + _638;
	vec3 _642 = _639.xyz * vec3(cval);
	vec3 mul_res = _642;
	float _646 = tex.x * rubyTextureSize.x;
	float _648 = _646 * rubyOutputSize.x;
	float _650 = _648 / rubyInputSize.x;
	float _652 = fmodHLSL(_650, float(V_xScanlineIntensity));
	float _653 = floor(_652);
	vec3 _657 = mix(vec3(1.00000000e+00, 6.99999988e-01, 1.00000000e+00), vec3(6.99999988e-01, 1.00000000e+00, 6.99999988e-01), vec3(_653));
	vec3 dotMaskWeights = _657;
	vec3 _660 = dotMaskWeights * vec3(8.29999983e-01, 8.29999983e-01, 1.00000000e+00);
	vec3 _662 = _660 * vec3(V_xBrightness);
	vec3 _663 = mul_res * _662;
	mul_res = _663;
	vec3 _664 = abs(mul_res);
	float _666 = 1.00000000e+00 / V_xMonitorGamma;
	vec3 _668 = pow(_664, vec3(_666));
	mul_res = _668;
	vec4 _669 = texture(V_xReShade_xBackBuffer, orig_xy);
	vec3 _672 = _669.xyz * vec3(cval);
	vec3 color_673 = _672;
	vec3 _675 = mix(color_673, mul_res, vec3(V_xAmount));
	color_673 = _675;
	vec3 _676 = clamp(color_673, 0.0, 1.0);
	return _676;
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
#ifdef E_xAdvancedCRTPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 tex = vv_0;
	_return = F_xAdvancedCRTPass(position, tex);
	return;
}
#endif
