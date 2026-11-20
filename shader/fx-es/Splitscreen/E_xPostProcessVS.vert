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
uniform int V_xsplitscreen_mode;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xBefore_sampler;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _11 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _11;
	float _14 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _14;
	float _17 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _17;
	float _20 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _20;
	vec4 _25 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _26 = textureLod(V_xReShade_xDepthBuffer, _25.xy, _25.w);
	float _29 = _26.x * 1.00000000e+00;
	float depth = _29;
	float _32 = 1.00000000e+00 - depth;
	depth = _32;
	float _34 = depth * 9.99000000e+02;
	float _36 = 1.00000000e+03 - _34;
	float _37 = depth / _36;
	depth = _37;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _44 = id == 2u;
	float _47 = _44 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _47;
	bool _49 = id == 1u;
	float _52 = _49 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _52;
	vec2 _54 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _56 = _54 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _61 = vec4(_56.x, _56.y, 0.00000000e+00, 1.00000000e+00);
	position = _61;
	return;
}
vec4 F_xPS_Before(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	return _68;
}
vec4 F_xPS_After(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 color = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _79 = V_xsplitscreen_mode == 0;
	if (_79)
	{
		bool _82 = texcoord.x < 5.00000000e-01;
		vec4 _83 = texture(V_xBefore_sampler, texcoord);
		vec4 _84 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _86 = compCond(bvec4(_82), _83, _84);
		color = _86;
	}
	bool _91 = V_xsplitscreen_mode == 1;
	if (_91)
	{
		float _94 = texcoord.x - 5.00000000e-01;
		float _95 = abs(_94);
		float dist = _95;
		float _98 = dist - 2.50000000e-01;
		float _99 = clamp(_98, 0.0, 1.0);
		dist = _99;
		vec4 _100 = texture(V_xBefore_sampler, texcoord);
		vec4 _101 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _103 = compCond(bvec4(vec4(dist)), _100, _101);
		color = _103;
	}
	bool _108 = V_xsplitscreen_mode == 2;
	if (_108)
	{
		float _111 = texcoord.x - 3.75000000e-01;
		float _114 = texcoord.y * 2.50000000e-01;
		float _115 = _111 + _114;
		float dist_116 = _115;
		float _118 = dist_116 - 2.50000000e-01;
		float _119 = clamp(_118, 0.0, 1.0);
		dist_116 = _119;
		vec4 _120 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _121 = texture(V_xBefore_sampler, texcoord);
		vec4 _123 = compCond(bvec4(vec4(dist_116)), _120, _121);
		color = _123;
	}
	bool _128 = V_xsplitscreen_mode == 3;
	if (_128)
	{
		float _131 = texcoord.x - 3.75000000e-01;
		float _134 = texcoord.y * 2.50000000e-01;
		float _135 = _131 + _134;
		float dist_136 = _135;
		float _138 = dist_136 - 2.50000000e-01;
		float _139 = abs(_138);
		dist_136 = _139;
		float _141 = dist_136 - 2.50000000e-01;
		float _142 = clamp(_141, 0.0, 1.0);
		dist_136 = _142;
		vec4 _143 = texture(V_xBefore_sampler, texcoord);
		vec4 _144 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _146 = compCond(bvec4(vec4(dist_136)), _143, _144);
		color = _146;
	}
	bool _151 = V_xsplitscreen_mode == 4;
	if (_151)
	{
		bool _154 = texcoord.y < 5.00000000e-01;
		vec4 _155 = texture(V_xBefore_sampler, texcoord);
		vec4 _156 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _158 = compCond(bvec4(_154), _155, _156);
		color = _158;
	}
	bool _163 = V_xsplitscreen_mode == 5;
	if (_163)
	{
		float _166 = texcoord.y - 5.00000000e-01;
		float _167 = abs(_166);
		float dist_168 = _167;
		float _170 = dist_168 - 2.50000000e-01;
		float _171 = clamp(_170, 0.0, 1.0);
		dist_168 = _171;
		vec4 _172 = texture(V_xBefore_sampler, texcoord);
		vec4 _173 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _175 = compCond(bvec4(vec4(dist_168)), _172, _173);
		color = _175;
	}
	bool _180 = V_xsplitscreen_mode == 6;
	if (_180)
	{
		float _183 = texcoord.x + texcoord.y;
		float dist_184 = _183;
		bool _186 = dist_184 < 1.00000000e+00;
		vec4 _187 = texture(V_xBefore_sampler, texcoord);
		vec4 _188 = texture(V_xReShade_xBackBuffer, texcoord);
		vec4 _190 = compCond(bvec4(_186), _187, _188);
		color = _190;
	}
	return color;
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
#ifdef E_xPS_Before
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xPS_Before(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_After
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xPS_After(pos, texcoord);
	return;
}
#endif
