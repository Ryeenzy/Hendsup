#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xDPXPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform vec3 V_xRGB_Curve;
uniform vec3 V_xRGB_C;
uniform float V_xContrast;
uniform float V_xSaturation;
uniform float V_xColorfulness;
uniform float V_xStrength;

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
vec3 F_xDPXPass(
	in vec4 vois,
	in vec2 texcoord)
{
	vec4 _71 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 _input = _71.xyz;
	vec3 B = _input;
	float _76 = 1.00000000e+00 - V_xContrast;
	vec3 _78 = B * vec3(_76);
	float _80 = 5.00000000e-01 * V_xContrast;
	vec3 _82 = _78 + vec3(_80);
	B = _82;
	vec3 _84 = V_xRGB_Curve / vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _85 = exp(_84);
	vec3 _87 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + _85;
	vec3 _89 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) / _87;
	vec3 Btemp = _89;
	vec3 _91 = -(V_xRGB_Curve);
	vec3 _92 = B - V_xRGB_C;
	vec3 _93 = _91 * _92;
	vec3 _94 = exp(_93);
	vec3 _96 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + _94;
	vec3 _98 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) / _96;
	vec3 _100 = vec3(-2.00000000e+00, -2.00000000e+00, -2.00000000e+00) * Btemp;
	vec3 _102 = _100 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _103 = _98 / _102;
	vec3 _104 = -(Btemp);
	vec3 _106 = vec3(-2.00000000e+00, -2.00000000e+00, -2.00000000e+00) * Btemp;
	vec3 _108 = _106 + vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 _109 = _104 / _108;
	vec3 _110 = _103 + _109;
	B = _110;
	float _113 = max(B.x, B.y);
	float _115 = max(_113, B.z);
	float value = _115;
	vec3 _118 = B / vec3(value);
	vec3 color = _118;
	vec3 _120 = abs(color);
	float _122 = 1.00000000e+00 / V_xColorfulness;
	vec3 _124 = pow(_120, vec3(_122));
	color = _124;
	vec3 _126 = color * vec3(value);
	vec3 c0 = _126;
	vec3 _129 = (c0 * mat3x3(5.00303388e-01, 3.38097572e-01, 1.64589778e-01, 2.57968903e-01, 6.76195264e-01, 6.58358485e-02, 2.34517884e-02, 1.12699270e-01, 8.66839647e-01));
	c0 = _129;
	float _131 = dot(c0, vec3(3.00000012e-01, 5.89999974e-01, 1.09999999e-01));
	float luma = _131;
	float _134 = 1.00000000e+00 - V_xSaturation;
	float _135 = _134 * luma;
	vec3 _137 = vec3(V_xSaturation) * c0;
	vec3 _139 = vec3(_135) + _137;
	c0 = _139;
	vec3 _141 = (c0 * mat3x3(2.67147112e+00, -1.26723611e+00, -4.10995603e-01, -1.02510703e+00, 1.98409116e+00, 4.39502485e-02, 6.10009469e-02, -2.23670751e-01, 1.15902102e+00));
	c0 = _141;
	vec3 _143 = mix(_input, c0, vec3(V_xStrength));
	return _143;
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
#ifdef E_xDPXPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vois = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xDPXPass(vois, texcoord);
	return;
}
#endif
