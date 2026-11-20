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
uniform float V_xIntensity;
uniform float V_xVariance;
uniform float V_xMean;
uniform int V_xSignalToNoiseRatio;
uniform float V_xTimer;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _15 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _15;
	float _18 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _18;
	float _21 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _21;
	float _24 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _24;
	vec4 _29 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _30 = textureLod(V_xReShade_xDepthBuffer, _29.xy, _29.w);
	float _33 = _30.x * 1.00000000e+00;
	float depth = _33;
	float _36 = 1.00000000e+00 - depth;
	depth = _36;
	float _38 = depth * 9.99000000e+02;
	float _40 = 1.00000000e+03 - _38;
	float _41 = depth / _40;
	depth = _41;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _48 = id == 2u;
	float _51 = _48 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _51;
	bool _53 = id == 1u;
	float _56 = _53 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _56;
	vec2 _58 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _60 = _58 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _65 = vec4(_60.x, _60.y, 0.00000000e+00, 1.00000000e+00);
	position = _65;
	return;
}
vec3 F_xFilmGrainPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _70 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _70.xyz;
	float _74 = dot(color, vec3(-3.33333343e-01, -3.33333343e-01, -3.33333343e-01));
	float _76 = _74 + 1.00000000e+00;
	float inv_luma = _76;
	float _79 = V_xTimer * 2.23369990e-03;
	float t = _79;
	float _82 = dot(texcoord, vec2(1.29898005e+01, 7.82330017e+01));
	float seed = _82;
	float _84 = sin(seed);
	float sine = _84;
	float _86 = cos(seed);
	float cosine = _86;
	float _89 = sine * 4.37585469e+04;
	float _90 = _89 + t;
	float _91 = fract(_90);
	float uniform_noise1 = _91;
	float _94 = cosine * 5.37585469e+04;
	float _95 = _94 - t;
	float _96 = fract(_95);
	float uniform_noise2 = _96;
	bool _99 = V_xSignalToNoiseRatio != 0;
	float _100 = abs(inv_luma);
	float _102 = pow(_100, float(V_xSignalToNoiseRatio));
	float _104 = _99 ? _102 : 1.00000000e+00;
	float stn = _104;
	float _106 = V_xVariance * V_xVariance;
	float _107 = _106 * stn;
	float variance = _107;
	float mean = V_xMean;
	bool _111 = uniform_noise1 < 9.99999975e-05;
	float _113 = _111 ? 9.99999975e-05 : uniform_noise1;
	uniform_noise1 = _113;
	float _114 = log(uniform_noise1);
	float _115 = -(_114);
	float _116 = sqrt(_115);
	float r = _116;
	bool _119 = uniform_noise1 < 9.99999975e-05;
	float _121 = _119 ? 3.14159274e+00 : r;
	r = _121;
	float _123 = 6.28318548e+00 * uniform_noise2;
	float theta = _123;
	float _125 = variance * r;
	float _126 = cos(theta);
	float _127 = _125 * _126;
	float _128 = _127 + mean;
	float gauss_noise1 = _128;
	float _131 = 1.00000000e+00 + V_xIntensity;
	float _133 = 1.00000000e+00 - V_xIntensity;
	float _134 = mix(_131, _133, gauss_noise1);
	float grain = _134;
	vec3 _137 = color * vec3(grain);
	color = _137;
	return color.xyz;
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
#ifdef E_xFilmGrainPass
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xFilmGrainPass(vpos, texcoord);
	return;
}
#endif
