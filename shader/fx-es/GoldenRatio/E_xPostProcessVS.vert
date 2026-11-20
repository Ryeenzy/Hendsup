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
uniform float V_xGoldenRatio_xOpacity;
uniform bool V_xGoldenRatio_xResizeMode;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xGoldenRatio_xsamplerSpirals;
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
void F_xGoldenRatio_xPS_RenderSpirals(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 outFragment)
{
	vec4 _70 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 colFragment = _70;
	float _73 = sqrt(5.00000000e+00);
	float _75 = 1.00000000e+00 + _73;
	float _77 = _75 / 2.00000000e+00;
	float phiValue = _77;
	float _80 = 1.08000000e+03 * phiValue;
	float idealWidth = _80;
	float _83 = 1.92000000e+03 / phiValue;
	float idealHeight = _83;
	vec4 sourceCoordFactor = vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	if (V_xGoldenRatio_xResizeMode)
	{
		bool _94 = 1.77777779e+00 < phiValue;
		if (_94)
		{
			float _96 = 1.08000000e+03 / idealHeight;
			float _98 = idealHeight / 1.08000000e+03;
			vec4 _101 = vec4(1.00000000e+00, _96, 1.00000000e+00, _98);
			sourceCoordFactor = _101;
		}
		else
		{
			float _103 = 1.92000000e+03 / idealWidth;
			float _105 = idealWidth / 1.92000000e+03;
			vec4 _108 = vec4(_103, 1.00000000e+00, _105, 1.00000000e+00);
			sourceCoordFactor = _108;
		}
	}
	float _111 = texcoord.x * sourceCoordFactor.x;
	float _114 = 1.00000000e+00 - sourceCoordFactor.z;
	float _116 = _114 / 2.00000000e+00;
	float _117 = _111 - _116;
	float _120 = texcoord.y * sourceCoordFactor.y;
	float _123 = 1.00000000e+00 - sourceCoordFactor.w;
	float _125 = _123 / 2.00000000e+00;
	float _126 = _120 - _125;
	vec2 _127 = vec2(_117, _126);
	vec4 _128 = texture(V_xGoldenRatio_xsamplerSpirals, _127);
	vec4 spiralFragment = _128;
	vec4 _131 = spiralFragment * vec4(V_xGoldenRatio_xOpacity);
	vec4 _132 = colFragment + _131;
	vec4 _133 = clamp(_132, 0.0, 1.0);
	outFragment = _133;
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
#ifdef E_xGoldenRatio_xPS_RenderSpirals
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 outFragment;
	F_xGoldenRatio_xPS_RenderSpirals(vpos, texcoord, outFragment);
	vv_0 = outFragment;
	return;
}
#endif
