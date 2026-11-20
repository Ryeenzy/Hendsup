#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Deband
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
float fmodHLSL(float x, float y) { return x - y * trunc(x / y); }
vec2 fmodHLSL(vec2 x, vec2 y) { return x - y * trunc(x / y); }
vec3 fmodHLSL(vec3 x, vec3 y) { return x - y * trunc(x / y); }
vec4 fmodHLSL(vec4 x, vec4 y) { return x - y * trunc(x / y); }
mat2 fmodHLSL(mat2 x, mat2 y) { return x - matrixCompMult(y, mat2(trunc(x[0] / y[0]), trunc(x[1] / y[1]))); }
mat3 fmodHLSL(mat3 x, mat3 y) { return x - matrixCompMult(y, mat3(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]))); }
mat4 fmodHLSL(mat4 x, mat4 y) { return x - matrixCompMult(y, mat4(trunc(x[0] / y[0]), trunc(x[1] / y[1]), trunc(x[2] / y[2]), trunc(x[3] / y[3]))); }
bvec2 compAnd(bvec2 a, bvec2 b) { return bvec2(a.x && b.x, a.y && b.y); }
bvec3 compAnd(bvec3 a, bvec3 b) { return bvec3(a.x && b.x, a.y && b.y, a.z && b.z); }
bvec4 compAnd(bvec4 a, bvec4 b) { return bvec4(a.x && b.x, a.y && b.y, a.z && b.z, a.w && b.w); }
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
uniform bool V_xenable_weber;
uniform bool V_xenable_sdeviation;
uniform bool V_xenable_depthbuffer;
uniform float V_xt1;
uniform float V_xt2;
uniform float V_xbanding_depth;
uniform float V_xrange;
uniform int V_xiterations;
uniform int V_xdebug_output;
uniform int V_xdrandom;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
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
float F_xrand(
	in float x)
{
	float _75 = x / 4.10000000e+01;
	float _76 = fract(_75);
	return _76;
}
float F_xpermute(
	in float x)
{
	float _81 = 3.40000000e+01 * x;
	float _83 = _81 + 1.00000000e+00;
	float _84 = _83 * x;
	float _86 = fmodHLSL(_84, 2.89000000e+02);
	return _86;
}
vec3 F_xPS_Deband(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _95 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _96 = textureLod(V_xReShade_xBackBuffer, _95.xy, _95.w);
	vec3 ori = _96.xyz;
	vec2 _102;
	_102 = texcoord;
	float _103 = F_xReShade_xGetLinearizedDepth(_102);
	bool _104 = _103 < V_xbanding_depth;
	bool _105 = V_xenable_depthbuffer && _104;
	if (_105)
	{
		return ori;
	}
	vec2 _107 = texcoord + vec2(1.00000000e+00, 1.00000000e+00);
	float _110 = float(V_xdrandom) / 3.27670000e+04;
	float _112 = _110 + 1.00000000e+00;
	vec3 _115 = vec3(_107.x, _107.y, _112);
	vec3 m = _115;
	float _117;
	_117 = m.x;
	float _119 = F_xpermute(_117);
	float _121 = _119 + m.y;
	float _122;
	_122 = _121;
	float _123 = F_xpermute(_122);
	float _125 = _123 + m.z;
	float _126;
	_126 = _125;
	float _127 = F_xpermute(_126);
	float h = _127;
	float _129;
	_129 = h;
	float _130 = F_xpermute(_129);
	float _131;
	_131 = _130;
	float _132 = F_xrand(_131);
	float _134 = _132 * 6.28318548e+00;
	float dir = _134;
	vec2 o = vec2(0.00000000e+00, 0.00000000e+00);
	float _138;
	float _139;
	_138 = sin(dir), _139 = cos(dir);
	o[1] = _138;
	o[0] = _139;
	vec2 pt = vec2(0.00000000e+00, 0.00000000e+00);
	float dist = 0.00000000e+00;
	int i = 1;
	while (i <= V_xiterations)
	{
		{
			float _155;
			_155 = h;
			float _156 = F_xrand(_155);
			float _157 = _156 * V_xrange;
			float _159 = _157 * float(i);
			dist = _159;
			vec2 _162 = vec2(dist) * vec2(5.20833360e-04, 9.25925910e-04);
			pt = _162;
			float _163;
			_163 = h;
			float _164 = F_xpermute(_163);
			h = _164;
		}
		int _154 = i + 1;
		i = _154;
	}
	vec2 _165 = fma(pt, o, texcoord);
	vec4 _170 = vec4(_165.x, _165.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _171 = textureLod(V_xReShade_xBackBuffer, _170.xy, _170.w);
	vec2 _172 = -(o);
	vec2 _173 = fma(pt, _172, texcoord);
	vec4 _178 = vec4(_173.x, _173.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _179 = textureLod(V_xReShade_xBackBuffer, _178.xy, _178.w);
	float _181 = -(o.y);
	vec2 _183 = vec2(_181, o.x);
	vec2 _184 = fma(pt, _183, texcoord);
	vec4 _189 = vec4(_184.x, _184.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _190 = textureLod(V_xReShade_xBackBuffer, _189.xy, _189.w);
	float _192 = -(o.x);
	vec2 _194 = vec2(o.y, _192);
	vec2 _195 = fma(pt, _194, texcoord);
	vec4 _200 = vec4(_195.x, _195.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _201 = textureLod(V_xReShade_xBackBuffer, _200.xy, _200.w);
	vec3 _206[4] = vec3[4](_171.xyz, _179.xyz, _190.xyz, _201.xyz);
	vec3 ref[4] = _206;
	vec3 _209 = ori + ref[0];
	vec3 _211 = _209 + ref[1];
	vec3 _213 = _211 + ref[2];
	vec3 _215 = _213 + ref[3];
	vec3 _217 = _215 * vec3(2.00000003e-01, 2.00000003e-01, 2.00000003e-01);
	vec3 mean = _217;
	vec3 _219 = ori - mean;
	vec3 _220 = abs(_219);
	vec3 k = _220;
	int j = 0;
	while (j < 4)
	{
		{
			vec3 _234 = ref[int(j)] - mean;
			vec3 _235 = abs(_234);
			vec3 _236 = k + _235;
			k = _236;
		}
		int _232 = j + 1;
		j = _232;
	}
	vec3 _238 = k * vec3(2.00000003e-01, 2.00000003e-01, 2.00000003e-01);
	vec3 _239 = _238 / mean;
	k = _239;
	vec3 sd = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int j_243 = 0;
	while (j_243 < 4)
	{
		{
			vec3 _254 = ref[int(j_243)] - ori;
			vec3 _256 = pow(_254, vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00));
			vec3 _257 = sd + _256;
			sd = _257;
		}
		int _252 = j_243 + 1;
		j_243 = _252;
	}
	vec3 _259 = sd * vec3(2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
	vec3 _260 = sqrt(_259);
	sd = _260;
	vec3 _output = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _267 = V_xdebug_output == 2;
	if (_267)
	{
		_output = vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00);
	}
	else
	{
		vec3 _271 = ref[0] + ref[1];
		vec3 _273 = _271 + ref[2];
		vec3 _275 = _273 + ref[3];
		vec3 _277 = _275 * vec3(2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
		_output = _277;
	}
	bvec3 banding_map = bvec3(true, true, true);
	bool _284 = V_xdebug_output != 1;
	if (_284)
	{
		if (V_xenable_weber)
		{
			float _289 = V_xt2 * float(V_xiterations);
			bvec3 _291 = lessThanEqual(k, vec3(_289));
			bvec3 _292 = compAnd(banding_map, _291);
			banding_map = _292;
		}
		if (V_xenable_sdeviation)
		{
			float _297 = V_xt1 * float(V_xiterations);
			bvec3 _299 = lessThanEqual(sd, vec3(_297));
			bvec3 _300 = compAnd(banding_map, _299);
			banding_map = _300;
		}
	}
	float _302 = dot(texcoord, vec2(1.20250000e+02, 3.00250000e+02));
	float _303 = fract(_302);
	float grid_position = _303;
	float _307 = pow(2.00000000e+00, 8.00000000e+00);
	float _309 = _307 - 1.00000000e+00;
	float _311 = 1.00000000e+00 / _309;
	float _313 = 2.50000000e-01 * _311;
	float dither_shift = _313;
	float _315 = -(dither_shift);
	vec3 _316 = vec3(dither_shift, _315, dither_shift);
	vec3 dither_shift_RGB = _316;
	vec3 _319 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * dither_shift_RGB;
	vec3 _321 = vec3(-2.00000000e+00, -2.00000000e+00, -2.00000000e+00) * dither_shift_RGB;
	vec3 _323 = mix(_319, _321, vec3(grid_position));
	dither_shift_RGB = _323;
	vec3 _324 = _output + dither_shift_RGB;
	vec3 _325 = compCond(banding_map, _324, ori);
	return _325;
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
#ifdef E_xPS_Deband
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Deband(vpos, texcoord);
	return;
}
#endif
