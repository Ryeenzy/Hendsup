#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xVignettePass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xType;
uniform float V_xRatio;
uniform float V_xRadius;
uniform float V_xAmount;
uniform int V_xSlope;
uniform vec2 V_xCenter;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _16 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _16;
	float _19 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _19;
	float _22 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _22;
	float _25 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _25;
	vec4 _30 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _31 = textureLod(V_xReShade_xDepthBuffer, _30.xy, _30.w);
	float _34 = _31.x * 1.00000000e+00;
	float depth = _34;
	float _37 = 1.00000000e+00 - depth;
	depth = _37;
	float _39 = depth * 9.99000000e+02;
	float _41 = 1.00000000e+03 - _39;
	float _42 = depth / _41;
	depth = _42;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _49 = id == 2u;
	float _52 = _49 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _52;
	bool _54 = id == 1u;
	float _57 = _54 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _57;
	vec2 _59 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _61 = _59 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _66 = vec4(_61.x, _61.y, 0.00000000e+00, 1.00000000e+00);
	position = _66;
	return;
}
vec4 F_xVignettePass(
	in vec4 vpos,
	in vec2 tex)
{
	vec4 _71 = texture(V_xReShade_xBackBuffer, tex);
	vec4 color = _71;
	bool _77 = V_xType == 0;
	if (_77)
	{
		vec2 _78 = tex - V_xCenter;
		vec2 distance_xy = _78;
		vec2 _81 = vec2(1.77777767e+00, V_xRatio);
		vec2 _82 = distance_xy * _81;
		distance_xy = _82;
		vec2 _84 = distance_xy / vec2(V_xRadius);
		distance_xy = _84;
		float _85 = dot(distance_xy, distance_xy);
		float _distance = _85;
		float _89 = float(V_xSlope) * 5.00000000e-01;
		float _90 = pow(_distance, _89);
		float _91 = _90 * V_xAmount;
		float _93 = 1.00000000e+00 + _91;
		vec3 _96 = color.xyz * vec3(_93);
		color.xyz = _96;
	}
	bool _101 = V_xType == 1;
	if (_101)
	{
		vec2 _102 = -(tex);
		vec2 _103 = _102 * tex;
		vec2 _104 = _103 + tex;
		tex = _104;
		float _106 = 3.16049337e+00 * V_xRatio;
		float _108 = _106 * tex.x;
		float _110 = _108 + tex.y;
		float _112 = _110 * 4.00000000e+00;
		float _113 = clamp(_112, 0.0, 1.0);
		vec3 _116 = vec3(_113) * color.xyz;
		color.xyz = _116;
	}
	bool _121 = V_xType == 2;
	if (_121)
	{
		vec2 _122 = -(tex);
		vec2 _123 = _122 * tex;
		vec2 _124 = _123 + tex;
		tex = _124;
		float _127 = tex.x * tex.y;
		float _129 = _127 * 1.00000000e+02;
		float _130 = clamp(_129, 0.0, 1.0);
		vec3 _133 = vec3(_130) * color.xyz;
		color.xyz = _133;
	}
	bool _138 = V_xType == 3;
	if (_138)
	{
		vec2 _140 = tex - vec2(5.00000000e-01, 5.00000000e-01);
		vec2 _141 = abs(_140);
		tex = _141;
		float _143 = -(tex.x);
		float _145 = -(tex.x);
		vec4 _148 = vec4(_143, _145, tex.x, tex.y);
		vec4 _153 = vec4(tex.y, tex.y, 1.00000000e+00, 1.00000000e+00);
		float _154 = dot(_148, _153);
		float tc = _154;
		float _157 = tc - 4.95000005e-01;
		float _158 = clamp(_157, 0.0, 1.0);
		tc = _158;
		float _160 = tc * 2.00000000e+02;
		float _162 = 1.00000000e+00 - _160;
		float _164 = pow(_162, 4.00000000e+00);
		float _166 = _164 + 2.50000000e-01;
		vec3 _169 = color.xyz * vec3(_166);
		color.xyz = _169;
	}
	bool _174 = V_xType == 4;
	if (_174)
	{
		vec2 _176 = tex - vec2(5.00000000e-01, 5.00000000e-01);
		vec2 _177 = abs(_176);
		tex = _177;
		float _179 = -(tex.x);
		float _181 = -(tex.x);
		vec4 _184 = vec4(_179, _181, tex.x, tex.y);
		vec4 _189 = vec4(tex.y, tex.y, 1.00000000e+00, 1.00000000e+00);
		float _190 = dot(_184, _189);
		float tc_191 = _190;
		float _193 = tc_191 - 4.95000005e-01;
		float _194 = clamp(_193, 0.0, 1.0);
		float _196 = _194 - 1.99999995e-04;
		tc_191 = _196;
		float _198 = tc_191 * 2.00000000e+02;
		float _200 = 1.00000000e+00 - _198;
		float _202 = pow(_200, 4.00000000e+00);
		float _204 = _202 + 0.00000000e+00;
		vec3 _207 = color.xyz * vec3(_204);
		color.xyz = _207;
	}
	bool _212 = V_xType == 5;
	if (_212)
	{
		vec2 _214 = tex - vec2(5.00000000e-01, 5.00000000e-01);
		vec2 _215 = abs(_214);
		tex = _215;
		float _218 = -2.00000000e+00 * tex.y;
		float _220 = _218 + 1.00000000e+00;
		float _222 = tex.x * _220;
		float _224 = _222 + tex.y;
		float tc_225 = _224;
		float _227 = tc_225 - 4.95000005e-01;
		float _228 = clamp(_227, 0.0, 1.0);
		tc_225 = _228;
		float _229 = -(tc_225);
		float _231 = _229 * 2.00000000e+02;
		float _233 = _231 + 1.00000000e+00;
		float _235 = pow(_233, 4.00000000e+00);
		float _237 = _235 + 2.50000000e-01;
		vec3 _240 = color.xyz * vec3(_237);
		color.xyz = _240;
	}
	bool _245 = V_xType == 6;
	if (_245)
	{
		vec4 _250 = vec4(tex.x, tex.y, tex.x, tex.y);
		vec2 _251 = -(tex);
		vec4 _256 = vec4(_251.x, _251.y, 1.00000000e+00, 1.00000000e+00);
		float _257 = dot(_250, _256);
		float tex_xy = _257;
		float _260 = tex_xy * 4.00000000e+00;
		float _261 = clamp(_260, 0.0, 1.0);
		vec3 _264 = vec3(_261) * color.xyz;
		color.xyz = _264;
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
#ifdef E_xVignettePass
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 tex = vv_0;
	_return = F_xVignettePass(vpos, tex);
	return;
}
#endif
