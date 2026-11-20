#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xTechnicolorPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform vec3 V_xColorStrength;
uniform float V_xBrightness;
uniform float V_xSaturation;
uniform float V_xStrength;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _14 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _14;
	float _17 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _17;
	float _20 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _20;
	float _23 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _23;
	vec4 _28 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _29 = textureLod(V_xReShade_xDepthBuffer, _28.xy, _28.w);
	float _32 = _29.x * 1.00000000e+00;
	float depth = _32;
	float _35 = 1.00000000e+00 - depth;
	depth = _35;
	float _37 = depth * 9.99000000e+02;
	float _39 = 1.00000000e+03 - _37;
	float _40 = depth / _39;
	depth = _40;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _47 = id == 2u;
	float _50 = _47 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _50;
	bool _52 = id == 1u;
	float _55 = _52 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _55;
	vec2 _57 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _59 = _57 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _64 = vec4(_59.x, _59.y, 0.00000000e+00, 1.00000000e+00);
	position = _64;
	return;
}
vec3 F_xTechnicolorPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _69 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 _71 = clamp(_69.xyz, 0.0, 1.0);
	vec3 color = _71;
	vec3 _74 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - color;
	vec3 temp = _74;
	vec3 target = temp.yxy;
	vec3 target2 = temp.zzx;
	vec3 _80 = color * target;
	vec3 temp2 = _80;
	vec3 _82 = temp2 * target2;
	temp2 = _82;
	vec3 _83 = temp2 * V_xColorStrength;
	temp = _83;
	vec3 _85 = temp2 * vec3(V_xBrightness);
	temp2 = _85;
	target = temp.yxy;
	target2 = temp.zzx;
	vec3 _88 = color - target;
	temp = _88;
	vec3 _89 = temp + temp2;
	temp = _89;
	vec3 _90 = temp - target2;
	temp2 = _90;
	vec3 _92 = mix(color, temp2, vec3(V_xStrength));
	color = _92;
	float _94 = dot(color, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	vec3 _97 = mix(vec3(_94), color, vec3(V_xSaturation));
	color = _97;
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
#ifdef E_xTechnicolorPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xTechnicolorPass(vpos, texcoord);
	return;
}
#endif
