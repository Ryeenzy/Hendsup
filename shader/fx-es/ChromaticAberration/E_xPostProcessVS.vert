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
uniform vec2 V_xShift;
uniform float V_xStrength;

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
vec3 F_xChromaticAberrationPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec3 color = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _69 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 colorInput = _69.xyz;
	vec2 _73 = vec2(5.20833360e-04, 9.25925910e-04) * V_xShift;
	vec2 _74 = texcoord + _73;
	vec4 _75 = texture(V_xReShade_xBackBuffer, _74);
	color[0] = _75.x;
	color[1] = colorInput.y;
	vec2 _79 = vec2(5.20833360e-04, 9.25925910e-04) * V_xShift;
	vec2 _80 = texcoord - _79;
	vec4 _81 = texture(V_xReShade_xBackBuffer, _80);
	color[2] = _81.z;
	vec3 _84 = mix(colorInput, color, vec3(V_xStrength));
	return _84;
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
#ifdef E_xChromaticAberrationPass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xChromaticAberrationPass(vpos, texcoord);
	return;
}
#endif
