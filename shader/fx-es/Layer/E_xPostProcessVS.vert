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
uniform vec2 V_xLayer_Pos;
uniform float V_xLayer_Scale;
uniform float V_xLayer_Blend;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xLayer_Sampler;
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
void F_xPS_Layer(
	in vec4 pos,
	in vec2 texCoord,
	out vec4 passColor)
{
	vec4 _71 = texture(V_xReShade_xBackBuffer, texCoord);
	vec4 backColor = _71;
	vec2 _75 = vec2(1.28000000e+03, 7.20000000e+02) * vec2(V_xLayer_Scale);
	vec2 _77 = _75 / vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _79 = vec2(1.00000000e+00, 1.00000000e+00) / _77;
	vec2 pixelSize = _79;
	vec2 _81 = texCoord * pixelSize;
	vec2 _83 = vec2(1.00000000e+00, 1.00000000e+00) - pixelSize;
	vec2 _84 = V_xLayer_Pos * _83;
	vec2 _85 = _81 + _84;
	vec4 _86 = texture(V_xLayer_Sampler, _85);
	vec4 layer = _86;
	float _89 = layer.w * V_xLayer_Blend;
	vec4 _91 = mix(backColor, layer, vec4(_89));
	passColor = _91;
	passColor[3] = backColor.w;
	return;
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
#ifdef E_xPS_Layer
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texCoord = vv_0;
	vec4 passColor;
	F_xPS_Layer(pos, texCoord, passColor);
	vv_0 = passColor;
	return;
}
#endif
