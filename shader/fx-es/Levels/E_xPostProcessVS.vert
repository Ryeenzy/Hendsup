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
uniform int V_xBlackPoint;
uniform int V_xWhitePoint;
uniform bool V_xHighlightClipping;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
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
vec3 F_xLevelsPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	float _70 = float(V_xBlackPoint) / 2.55000000e+02;
	float black_point_float = _70;
	bool _72 = V_xWhitePoint == V_xBlackPoint;
	int _73 = V_xWhitePoint - V_xBlackPoint;
	float _76 = 2.55000000e+02 / float(_73);
	float _78 = _72 ? 1.01999994e+06 : _76;
	float white_point_float = _78;
	vec4 _80 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _80.xyz;
	vec3 _84 = color * vec3(white_point_float);
	float _85 = black_point_float * white_point_float;
	vec3 _87 = _84 - vec3(_85);
	color = _87;
	if (V_xHighlightClipping)
	{
		vec3 clipped_colors = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		vec3 _93 = clamp(color, 0.0, 1.0);
		bvec3 _94 = greaterThan(color, _93);
		bool _95 = any(_94);
		vec3 _98 = compCond(bvec3(_95), vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00), color);
		clipped_colors = _98;
		vec3 _99 = clamp(color, 0.0, 1.0);
		bvec3 _100 = greaterThan(color, _99);
		bool _101 = all(_100);
		vec3 _104 = compCond(bvec3(_101), vec3(1.00000000e+00, 1.00000000e+00, 0.00000000e+00), clipped_colors);
		clipped_colors = _104;
		vec3 _105 = clamp(color, 0.0, 1.0);
		bvec3 _106 = lessThan(color, _105);
		bool _107 = any(_106);
		vec3 _110 = compCond(bvec3(_107), vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00), clipped_colors);
		clipped_colors = _110;
		vec3 _111 = clamp(color, 0.0, 1.0);
		bvec3 _112 = lessThan(color, _111);
		bool _113 = all(_112);
		vec3 _116 = compCond(bvec3(_113), vec3(0.00000000e+00, 1.00000000e+00, 1.00000000e+00), clipped_colors);
		clipped_colors = _116;
		color = clipped_colors;
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
#ifdef E_xLevelsPass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xLevelsPass(vpos, texcoord);
	return;
}
#endif
