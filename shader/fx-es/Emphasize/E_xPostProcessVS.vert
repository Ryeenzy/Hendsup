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
uniform float V_xFocusDepth;
uniform float V_xFocusRangeDepth;
uniform float V_xFocusEdgeDepth;
uniform bool V_xSpherical;
uniform int V_xSphere_FieldOfView;
uniform float V_xSphere_FocusHorizontal;
uniform float V_xSphere_FocusVertical;
uniform vec3 V_xBlendColor;
uniform float V_xBlendFactor;
uniform float V_xEffectFactor;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _20 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _20;
	float _23 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _23;
	float _26 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _26;
	float _29 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _29;
	vec4 _34 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _35 = textureLod(V_xReShade_xDepthBuffer, _34.xy, _34.w);
	float _38 = _35.x * 1.00000000e+00;
	float depth = _38;
	float _41 = 1.00000000e+00 - depth;
	depth = _41;
	float _43 = depth * 9.99000000e+02;
	float _45 = 1.00000000e+03 - _43;
	float _46 = depth / _45;
	depth = _46;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _53 = id == 2u;
	float _56 = _53 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _56;
	bool _58 = id == 1u;
	float _61 = _58 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _61;
	vec2 _63 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _65 = _63 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _70 = vec4(_65.x, _65.y, 0.00000000e+00, 1.00000000e+00);
	position = _70;
	return;
}
float F_xCalculateDepthDiffCoC(
	in vec2 texcoord)
{
	vec2 _74;
	_74 = texcoord;
	float _75 = F_xReShade_xGetLinearizedDepth(_74);
	float scenedepth = _75;
	float scenefocus = V_xFocusDepth;
	float _78 = V_xFocusRangeDepth + V_xFocusEdgeDepth;
	float desaturateFullRange = _78;
	float depthdiff = 0.00000000e+00;
	bool _86 = V_xSpherical == true;
	if (_86)
	{
		float _88 = texcoord.x - V_xSphere_FocusHorizontal;
		float _90 = _88 * 1.92000000e+03;
		texcoord[0] = _90;
		float _92 = texcoord.y - V_xSphere_FocusVertical;
		float _94 = _92 * 1.08000000e+03;
		texcoord[1] = _94;
		float _97 = float(V_xSphere_FieldOfView) / 1.92000000e+03;
		float degreePerPixel = _97;
		float _101 = texcoord.x * texcoord.x;
		float _104 = texcoord.y * texcoord.y;
		float _105 = _101 + _104;
		float _106 = sqrt(_105);
		float _107 = _106 * degreePerPixel;
		float fovDifference = _107;
		float _109 = scenedepth * scenedepth;
		float _110 = scenefocus * scenefocus;
		float _111 = _109 + _110;
		float _113 = 2.00000000e+00 * scenedepth;
		float _114 = _113 * scenefocus;
		float _116 = fovDifference * 1.74532924e-02;
		float _117 = cos(_116);
		float _118 = _114 * _117;
		float _119 = _111 - _118;
		float _120 = sqrt(_119);
		depthdiff = _120;
	}
	else
	{
		float _121 = scenedepth - scenefocus;
		float _122 = abs(_121);
		depthdiff = _122;
	}
	bool _123 = depthdiff > desaturateFullRange;
	float _124 = smoothstep(V_xFocusRangeDepth, desaturateFullRange, depthdiff);
	float _126 = _123 ? 1.00000000e+00 : _124;
	float _127 = clamp(_126, 0.0, 1.0);
	return _127;
}
void F_xPS_Otis_EMZ_Desaturate(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 outFragment)
{
	vec2 _133;
	_133 = texcoord.xy;
	float _135 = F_xCalculateDepthDiffCoC(_133);
	float depthDiffCoC = _135;
	vec4 _137 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 colFragment = _137;
	float _141 = colFragment.x + colFragment.y;
	float _143 = _141 + colFragment.z;
	float _145 = _143 / 3.00000000e+00;
	float greyscaleAverage = _145;
	vec4 _147 = vec4(greyscaleAverage, greyscaleAverage, greyscaleAverage, depthDiffCoC);
	vec4 desColor = _147;
	vec4 _152 = vec4(V_xBlendColor.x, V_xBlendColor.y, V_xBlendColor.z, depthDiffCoC);
	vec4 _154 = mix(desColor, _152, vec4(V_xBlendFactor));
	desColor = _154;
	float _155 = depthDiffCoC * V_xEffectFactor;
	float _156 = clamp(_155, 0.0, 1.0);
	vec4 _158 = mix(colFragment, desColor, vec4(_156));
	outFragment = _158;
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
#ifdef E_xPS_Otis_EMZ_Desaturate
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 outFragment;
	F_xPS_Otis_EMZ_Desaturate(vpos, texcoord, outFragment);
	vv_0 = outFragment;
	return;
}
#endif
