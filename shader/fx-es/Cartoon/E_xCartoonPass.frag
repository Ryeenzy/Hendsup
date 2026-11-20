#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xCartoonPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xPower;
uniform float V_xEdgeSlope;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _12 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _12;
	float _15 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _15;
	float _18 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _18;
	float _21 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _21;
	vec4 _26 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _27 = textureLod(V_xReShade_xDepthBuffer, _26.xy, _26.w);
	float _30 = _27.x * 1.00000000e+00;
	float depth = _30;
	float _33 = 1.00000000e+00 - depth;
	depth = _33;
	float _35 = depth * 9.99000000e+02;
	float _37 = 1.00000000e+03 - _35;
	float _38 = depth / _37;
	depth = _38;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _45 = id == 2u;
	float _48 = _45 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _48;
	bool _50 = id == 1u;
	float _53 = _50 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _53;
	vec2 _55 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _57 = _55 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _62 = vec4(_57.x, _57.y, 0.00000000e+00, 1.00000000e+00);
	position = _62;
	return;
}
vec3 F_xCartoonPass(
	in vec4 position,
	in vec2 texcoord)
{
	vec4 _67 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _67.xyz;
	vec2 _71 = texcoord + vec2(5.20833360e-04, 9.25925910e-04);
	vec4 _72 = texture(V_xReShade_xBackBuffer, _71);
	float _75 = dot(vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02), _72.xyz);
	float diff1 = _75;
	vec2 _78 = texcoord - vec2(5.20833360e-04, 9.25925910e-04);
	vec4 _79 = texture(V_xReShade_xBackBuffer, _78);
	vec4 _83 = vec4(_79.xyz.x, _79.xyz.y, _79.xyz.z, diff1);
	float _85 = dot(vec4(2.12599993e-01, 7.15200007e-01, 7.22000003e-02, -1.00000000e+00), _83);
	diff1 = _85;
	vec2 _87 = texcoord + vec2(5.20833360e-04, -9.25925910e-04);
	vec4 _88 = texture(V_xReShade_xBackBuffer, _87);
	float _91 = dot(vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02), _88.xyz);
	float diff2 = _91;
	vec2 _94 = texcoord + vec2(-5.20833360e-04, 9.25925910e-04);
	vec4 _95 = texture(V_xReShade_xBackBuffer, _94);
	vec4 _99 = vec4(_95.xyz.x, _95.xyz.y, _95.xyz.z, diff2);
	float _101 = dot(vec4(2.12599993e-01, 7.15200007e-01, 7.22000003e-02, -1.00000000e+00), _99);
	diff2 = _101;
	vec2 _102 = vec2(diff1, diff2);
	vec2 _103 = vec2(diff1, diff2);
	float _104 = dot(_102, _103);
	float edge = _104;
	float _106 = abs(edge);
	float _107 = pow(_106, V_xEdgeSlope);
	float _108 = -(V_xPower);
	float _109 = _107 * _108;
	vec3 _111 = vec3(_109) + color;
	vec3 _112 = clamp(_111, 0.0, 1.0);
	return _112;
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
#ifdef E_xCartoonPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xCartoonPass(position, texcoord);
	return;
}
#endif
