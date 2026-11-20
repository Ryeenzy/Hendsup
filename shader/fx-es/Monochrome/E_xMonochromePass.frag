#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xMonochromePass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xMonochrome_preset;
uniform vec3 V_xMonochrome_conversion_values;
uniform float V_xMonochrome_color_saturation;

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
vec3 F_xMonochromePass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _68.xyz;
	vec3 Coefficients = vec3(2.09999993e-01, 7.20000029e-01, 7.00000003e-02);
	vec3 _90[18] = vec3[18](V_xMonochrome_conversion_values, vec3(2.09999993e-01, 7.20000029e-01, 7.00000003e-02), vec3(3.33333313e-01, 3.33333403e-01, 3.33333313e-01), vec3(1.80000007e-01, 4.09999996e-01, 4.09999996e-01), vec3(2.50000000e-01, 3.89999986e-01, 3.60000014e-01), vec3(2.09999993e-01, 4.00000006e-01, 3.89999986e-01), vec3(2.00000003e-01, 4.09999996e-01, 3.89999986e-01), vec3(2.09999993e-01, 4.19999987e-01, 3.70000005e-01), vec3(2.19999999e-01, 4.19999987e-01, 3.60000014e-01), vec3(3.10000002e-01, 3.60000014e-01, 3.30000013e-01), vec3(2.80000001e-01, 4.09999996e-01, 3.10000002e-01), vec3(2.30000004e-01, 3.70000005e-01, 4.00000006e-01), vec3(3.30000013e-01, 3.60000014e-01, 3.10000002e-01), vec3(3.60000014e-01, 3.10000002e-01, 3.30000013e-01), vec3(2.09999993e-01, 4.19999987e-01, 3.70000005e-01), vec3(2.39999995e-01, 3.70000005e-01, 3.89999986e-01), vec3(2.70000011e-01, 3.60000014e-01, 3.70000005e-01), vec3(2.50000000e-01, 3.49999994e-01, 4.00000006e-01));
	vec3 Coefficients_array[18] = _90;
	Coefficients = Coefficients_array[int(V_xMonochrome_preset)];
	float _93 = dot(Coefficients, color);
	vec3 grey = vec3(_93);
	vec3 _97 = mix(grey, color, vec3(V_xMonochrome_color_saturation));
	color = _97;
	vec3 _98 = clamp(color, 0.0, 1.0);
	return _98;
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
#ifdef E_xMonochromePass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xMonochromePass(vpos, texcoord);
	return;
}
#endif
