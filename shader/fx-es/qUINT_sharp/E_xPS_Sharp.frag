#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Sharp
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
uniform float V_xSHARP_STRENGTH;
uniform bool V_xDEPTH_MASK_ENABLE;
uniform bool V_xRMS_MASK_ENABLE;
uniform int V_xSHARPEN_MODE;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
struct S_xVSOUT
{
	vec4 vpos;
	vec2 uv;
};
S_xVSOUT _88;
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _16 = uv.x / 1.00000000e+00;
	uv[0] = _16;
	float _19 = uv.y / 1.00000000e+00;
	uv[1] = _19;
	float _22 = uv.x - 0.00000000e+00;
	uv[0] = _22;
	float _25 = uv.y + 0.00000000e+00;
	uv[1] = _25;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _29;
	_29 = uv;
	vec2 _30 = F_xqUINT_xdepthtex_uv(_29);
	vec4 _35 = vec4(_30.x, _30.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _36 = textureLod(V_xqUINT_xsDepthBufferTex, _35.xy, _35.w);
	float depth = _36.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _43 = depth * 1.00000000e+00;
	depth = _43;
	float _45 = 1.00000000e+00 - depth;
	depth = _45;
	float _47 = depth * 9.99000000e+02;
	float _49 = 1.00000000e+03 - _47;
	float _50 = depth / _49;
	depth = _50;
	float _51 = clamp(depth, 0.0, 1.0);
	return _51;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _55;
	_55 = uv;
	float _56 = F_xqUINT_xget_depth(_55);
	float depth_57 = _56;
	float _58;
	_58 = depth_57;
	float _59 = F_xqUINT_xlinearize_depth(_58);
	depth_57 = _59;
	return depth_57;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _66 = id == 2u;
	float _69 = _66 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _69;
	bool _71 = id == 1u;
	float _74 = _71 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _74;
	vec2 _76 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _78 = _76 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _83 = vec4(_78.x, _78.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _83;
	return;
}
S_xVSOUT F_xVS_Sharp(
	in uint id)
{
	S_xVSOUT o = _88;
	bool _91 = id == 2u;
	float _94 = _91 ? 2.00000000e+00 : 0.00000000e+00;
	o.uv[0] = _94;
	bool _96 = id == 1u;
	float _99 = _96 ? 2.00000000e+00 : 0.00000000e+00;
	o.uv[1] = _99;
	vec2 _102 = o.uv.xy * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _104 = _102 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _109 = vec4(_104.x, _104.y, 0.00000000e+00, 1.00000000e+00);
	o.vpos = _109;
	return o;
}
float F_xcolor_to_lum(
	in vec3 color)
{
	float _114 = dot(color, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	return _114;
}
vec3 F_xblend_overlay(
	in vec3 a,
	in vec3 b)
{
	vec3 _120 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - a;
	vec3 c = _120;
	vec3 _123 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - b;
	vec3 d = _123;
	bvec3 _126 = lessThan(a, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
	vec3 _128 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * a;
	vec3 _129 = _128 * b;
	vec3 _131 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * c;
	vec3 _132 = _131 * d;
	vec3 _134 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _132;
	vec3 _135 = compCond(_126, _129, _134);
	return _135;
}
vec4 F_xfetch_color_and_depth(
	in vec2 uv)
{
	vec4 _139 = texture(V_xqUINT_xsBackBufferTex, uv);
	vec2 _140;
	_140 = uv;
	float _141 = F_xqUINT_xlinear_depth(_140);
	vec4 _145 = vec4(_139.xyz.x, _139.xyz.y, _139.xyz.z, _141);
	return _145;
}
void F_xPS_Sharp(
	in S_xVSOUT i,
	out vec3 o)
{
	vec4 A = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 B = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 C = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 D = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 E = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 F = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 G = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 H = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 I = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 offsets = vec3(1.00000000e+00, 0.00000000e+00, -1.00000000e+00);
	vec2 _172 = offsets.zz * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _174 = i.uv + _172;
	vec2 _175;
	_175 = _174;
	vec4 _176 = F_xfetch_color_and_depth(_175);
	A = _176;
	vec2 _179 = offsets.yz * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _181 = i.uv + _179;
	vec2 _182;
	_182 = _181;
	vec4 _183 = F_xfetch_color_and_depth(_182);
	B = _183;
	vec2 _186 = offsets.xz * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _188 = i.uv + _186;
	vec2 _189;
	_189 = _188;
	vec4 _190 = F_xfetch_color_and_depth(_189);
	C = _190;
	vec2 _193 = offsets.zy * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _195 = i.uv + _193;
	vec2 _196;
	_196 = _195;
	vec4 _197 = F_xfetch_color_and_depth(_196);
	D = _197;
	vec2 _200 = offsets.yy * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _202 = i.uv + _200;
	vec2 _203;
	_203 = _202;
	vec4 _204 = F_xfetch_color_and_depth(_203);
	E = _204;
	vec2 _207 = offsets.xy * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _209 = i.uv + _207;
	vec2 _210;
	_210 = _209;
	vec4 _211 = F_xfetch_color_and_depth(_210);
	F = _211;
	vec2 _214 = offsets.zx * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _216 = i.uv + _214;
	vec2 _217;
	_217 = _216;
	vec4 _218 = F_xfetch_color_and_depth(_217);
	G = _218;
	vec2 _221 = offsets.yx * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _223 = i.uv + _221;
	vec2 _224;
	_224 = _223;
	vec4 _225 = F_xfetch_color_and_depth(_224);
	H = _225;
	vec2 _228 = offsets.xx * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _230 = i.uv + _228;
	vec2 _231;
	_231 = _230;
	vec4 _232 = F_xfetch_color_and_depth(_231);
	I = _232;
	vec4 _233 = A + C;
	vec4 _234 = G + I;
	vec4 _235 = _233 + _234;
	vec4 corners = _235;
	vec4 _237 = B + D;
	vec4 _238 = F + H;
	vec4 _239 = _237 + _238;
	vec4 neighbours = _239;
	vec4 center = E;
	vec4 _243 = vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * neighbours;
	vec4 _244 = corners + _243;
	vec4 _246 = vec4(1.20000000e+01, 1.20000000e+01, 1.20000000e+01, 1.20000000e+01) * center;
	vec4 _247 = _244 - _246;
	vec4 edge = _247;
	vec3 sharpen = edge.xyz;
	if (V_xRMS_MASK_ENABLE)
	{
		vec3 _256 = corners.xyz + neighbours.xyz;
		vec3 _258 = _256 + center.xyz;
		vec3 _260 = _258 / vec3(9.00000000e+00, 9.00000000e+00, 9.00000000e+00);
		vec3 mean = _260;
		vec3 _263 = mean - A.xyz;
		vec3 _265 = mean - A.xyz;
		vec3 _266 = _263 * _265;
		vec3 RMS = _266;
		vec3 _269 = mean - B.xyz;
		vec3 _271 = mean - B.xyz;
		vec3 _272 = _269 * _271;
		vec3 _273 = RMS + _272;
		RMS = _273;
		vec3 _275 = mean - C.xyz;
		vec3 _277 = mean - C.xyz;
		vec3 _278 = _275 * _277;
		vec3 _279 = RMS + _278;
		RMS = _279;
		vec3 _281 = mean - D.xyz;
		vec3 _283 = mean - D.xyz;
		vec3 _284 = _281 * _283;
		vec3 _285 = RMS + _284;
		RMS = _285;
		vec3 _287 = mean - E.xyz;
		vec3 _289 = mean - E.xyz;
		vec3 _290 = _287 * _289;
		vec3 _291 = RMS + _290;
		RMS = _291;
		vec3 _293 = mean - F.xyz;
		vec3 _295 = mean - F.xyz;
		vec3 _296 = _293 * _295;
		vec3 _297 = RMS + _296;
		RMS = _297;
		vec3 _299 = mean - G.xyz;
		vec3 _301 = mean - G.xyz;
		vec3 _302 = _299 * _301;
		vec3 _303 = RMS + _302;
		RMS = _303;
		vec3 _305 = mean - H.xyz;
		vec3 _307 = mean - H.xyz;
		vec3 _308 = _305 * _307;
		vec3 _309 = RMS + _308;
		RMS = _309;
		vec3 _311 = mean - I.xyz;
		vec3 _313 = mean - I.xyz;
		vec3 _314 = _311 * _313;
		vec3 _315 = RMS + _314;
		RMS = _315;
		vec3 _317 = RMS + vec3(1.00000005e-03, 1.00000005e-03, 1.00000005e-03);
		vec3 _318 = inversesqrt(_317);
		vec3 _320 = _318 * vec3(1.00000001e-01, 1.00000001e-01, 1.00000001e-01);
		vec3 _321 = sharpen * _320;
		sharpen = _321;
	}
	float _323 = abs(edge.w);
	float _325 = _323 * 4.00000000e+03;
	float _327 = 1.00000000e+00 - _325;
	float _328 = clamp(_327, 0.0, 1.0);
	float _330 = V_xDEPTH_MASK_ENABLE ? _328 : 1.00000000e+00;
	vec3 _332 = sharpen * vec3(_330);
	sharpen = _332;
	bool _337 = V_xSHARPEN_MODE == 1;
	if (_337)
	{
		vec3 _338;
		_338 = sharpen;
		float _339 = F_xcolor_to_lum(_338);
		sharpen = vec3(_339);
	}
	vec3 _341 = -(sharpen);
	vec3 _343 = _341 * vec3(V_xSHARP_STRENGTH);
	vec3 _345 = _343 * vec3(1.00000001e-01, 1.00000001e-01, 1.00000001e-01);
	sharpen = _345;
	vec3 _346 = sign(sharpen);
	vec3 _347 = abs(sharpen);
	vec3 _349 = _347 * vec3(1.00000000e+01, 1.00000000e+01, 1.00000000e+01);
	vec3 _351 = _349 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _352 = log(_351);
	vec3 _353 = _346 * _352;
	vec3 _355 = _353 * vec3(3.00000012e-01, 3.00000012e-01, 3.00000012e-01);
	sharpen = _355;
	vec3 _357 = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01) + sharpen;
	vec3 _358;
	vec3 _359;
	_358 = center.xyz;
	_359 = _357;
	vec3 _361 = F_xblend_overlay(_358, _359);
	o = _361;
	return;
}
#ifdef E_xVS_Sharp
layout(location = 0) out vec2 _return_uv;
void main()
{
	uint id = uint(gl_VertexID);
	S_xVSOUT _return = F_xVS_Sharp(id);
	gl_Position = _return.vpos;
	_return_uv = _return.uv;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_Sharp
in vec2 vv_0;
layout(location = 0) out vec3 _out_o;
void main()
{
	S_xVSOUT _in_i = S_xVSOUT(gl_FragCoord, vv_0);
	S_xVSOUT i = _in_i;
	vec3 o;
	F_xPS_Sharp(i, o);
	_out_o = o;
	return;
}
#endif
