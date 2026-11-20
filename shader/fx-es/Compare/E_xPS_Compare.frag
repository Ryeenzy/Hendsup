#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Compare
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
uniform int V_xui_instructions;
uniform int V_xcompare_mode;
uniform float V_xdifference_scale;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xOriginalSampler;
uniform sampler2D V_xEffectASampler;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _13 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _13;
	float _16 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _16;
	float _19 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _19;
	float _22 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _22;
	vec4 _27 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _28 = textureLod(V_xReShade_xDepthBuffer, _27.xy, _27.w);
	float _31 = _28.x * 1.00000000e+00;
	float depth = _31;
	float _34 = 1.00000000e+00 - depth;
	depth = _34;
	float _36 = depth * 9.99000000e+02;
	float _38 = 1.00000000e+03 - _36;
	float _39 = depth / _38;
	depth = _39;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _46 = id == 2u;
	float _49 = _46 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _49;
	bool _51 = id == 1u;
	float _54 = _51 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _54;
	vec2 _56 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _58 = _56 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _63 = vec4(_58.x, _58.y, 0.00000000e+00, 1.00000000e+00);
	position = _63;
	return;
}
vec3 F_xPS_Capture(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _72 = texture(V_xReShade_xBackBuffer, texcoord);
	return _72.xyz;
}
vec3 F_xPS_Restore(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _78 = texture(V_xOriginalSampler, texcoord);
	return _78.xyz;
}
vec3 F_xPS_Compare(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _84 = texture(V_xOriginalSampler, texcoord);
	vec3 original = _84.xyz;
	vec4 _87 = texture(V_xEffectASampler, texcoord);
	vec3 effectA = _87.xyz;
	vec4 _90 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 effectB = _90.xyz;
	vec3 color = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _99 = V_xcompare_mode == 0;
	if (_99)
	{
		bool _102 = texcoord.x < 5.00000000e-01;
		vec3 _104 = compCond(bvec3(_102), effectA, effectB);
		color = _104;
	}
	bool _109 = V_xcompare_mode == 1;
	if (_109)
	{
		bool _115 = texcoord.x < 3.33000004e-01;
		if (_115)
		{
			color = effectA;
		}
		else
		{
			bool _121 = texcoord.x < 6.66000009e-01;
			if (_121)
			{
				color = original;
			}
			else
			{
				color = effectB;
			}
		}
	}
	bool _126 = V_xcompare_mode == 2;
	if (_126)
	{
		float _129 = texcoord.x - 3.75000000e-01;
		float _132 = texcoord.y * 2.50000000e-01;
		float _133 = _129 + _132;
		float dist = _133;
		float _136 = dist - 2.50000000e-01;
		float _137 = clamp(_136, 0.0, 1.0);
		dist = _137;
		vec3 _139 = compCond(bvec3(vec3(dist)), effectB, effectA);
		color = _139;
	}
	bool _144 = V_xcompare_mode == 3;
	if (_144)
	{
		float _147 = texcoord.y * 5.00000000e-01;
		float _149 = texcoord.x + _147;
		float angle = _149;
		bool _155 = angle < 5.00000000e-01;
		if (_155)
		{
			color = effectA;
		}
		else
		{
			bool _160 = angle < 1.00000000e+00;
			if (_160)
			{
				color = original;
			}
			else
			{
				color = effectB;
			}
		}
	}
	bool _165 = V_xcompare_mode == 4;
	if (_165)
	{
		bool _168 = texcoord.y < 5.00000000e-01;
		vec3 _170 = compCond(bvec3(_168), effectA, effectB);
		color = _170;
	}
	bool _175 = V_xcompare_mode == 5;
	if (_175)
	{
		bool _181 = texcoord.y < 3.33000004e-01;
		if (_181)
		{
			color = effectA;
		}
		else
		{
			bool _187 = texcoord.y < 6.66000009e-01;
			if (_187)
			{
				color = original;
			}
			else
			{
				color = effectB;
			}
		}
	}
	bool _192 = V_xcompare_mode == 6;
	if (_192)
	{
		float _195 = texcoord.x + texcoord.y;
		float dist_196 = _195;
		bool _198 = dist_196 < 1.00000000e+00;
		vec3 _200 = compCond(bvec3(_198), effectA, effectB);
		color = _200;
	}
	bool _205 = V_xcompare_mode == 7;
	if (_205)
	{
		vec3 _206 = effectB - effectA;
		vec3 _207 = abs(_206);
		vec3 difference = _207;
		vec3 _210 = difference * vec3(V_xdifference_scale);
		color = _210;
	}
	bool _215 = V_xcompare_mode == 8;
	if (_215)
	{
		vec3 _216 = effectB - effectA;
		vec3 difference_217 = _216;
		vec3 _219 = difference_217 * vec3(V_xdifference_scale);
		vec3 _221 = _219 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		color = _221;
	}
	return color;
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
#ifdef E_xPS_Capture
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Capture(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_Restore
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Restore(pos, texcoord);
	return;
}
#endif
#ifdef E_xPS_Compare
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Compare(pos, texcoord);
	return;
}
#endif
