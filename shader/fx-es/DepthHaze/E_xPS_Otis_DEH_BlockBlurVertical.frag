#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Otis_DEH_BlockBlurVertical
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xEffectStrength;
uniform vec3 V_xFogColor;
uniform float V_xFogStart;
uniform float V_xFogFactor;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xOtis_SamplerFragmentBuffer2;
uniform sampler2D V_xOtis_SamplerFragmentBuffer1;
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
float F_xCalculateWeight(
	in float distanceFromSource,
	in float sourceDepth,
	in float neighborDepth)
{
	float _74 = sourceDepth - neighborDepth;
	float _75 = abs(_74);
	float _77 = 1.00000000e+00 - _75;
	float _79 = 1.00000000e+00 / distanceFromSource;
	float _80 = _77 * _79;
	float _81 = _80 * neighborDepth;
	return _81;
}
void F_xPS_Otis_DEH_BlockBlurHorizontal(
	in vec4 pos,
	in vec2 texcoord,
	out vec4 outFragment)
{
	vec4 _87 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _87;
	vec2 _89;
	_89 = texcoord;
	float _90 = F_xReShade_xGetLinearizedDepth(_89);
	float colorDepth = _90;
	float n = 1.00000000e+00;
	float i = 1.00000000e+00;
	while (i < 5.00000000e+00)
	{
		{
			float _106 = i * 5.20833360e-04;
			vec2 _108 = vec2(_106, 0.00000000e+00);
			vec2 _109 = texcoord + _108;
			vec2 sourceCoords = _109;
			vec2 _111;
			_111 = sourceCoords;
			float _112 = F_xReShade_xGetLinearizedDepth(_111);
			float _113;
			float _114;
			float _115;
			_113 = i;
			_114 = colorDepth;
			_115 = _112;
			float _116 = F_xCalculateWeight(_113, _114, _115);
			float weight = _116;
			vec4 _118 = texture(V_xReShade_xBackBuffer, sourceCoords);
			vec4 _120 = _118 * vec4(weight);
			vec4 _121 = color + _120;
			color = _121;
			float _122 = n + weight;
			n = _122;
			float _124 = i * 5.20833360e-04;
			vec2 _126 = vec2(_124, 0.00000000e+00);
			vec2 _127 = texcoord - _126;
			sourceCoords = _127;
			vec2 _128;
			_128 = sourceCoords;
			float _129 = F_xReShade_xGetLinearizedDepth(_128);
			float _130;
			float _131;
			float _132;
			_130 = i;
			_131 = colorDepth;
			_132 = _129;
			float _133 = F_xCalculateWeight(_130, _131, _132);
			weight = _133;
			vec4 _134 = texture(V_xReShade_xBackBuffer, sourceCoords);
			vec4 _136 = _134 * vec4(weight);
			vec4 _137 = color + _136;
			color = _137;
			float _138 = n + weight;
			n = _138;
		}
		float _104 = i + 1.00000000e+00;
		i = _104;
	}
	vec4 _140 = color / vec4(n);
	outFragment = _140;
	return;
}
void F_xPS_Otis_DEH_BlockBlurVertical(
	in vec4 pos,
	in vec2 texcoord,
	out vec4 outFragment)
{
	vec4 _146 = texture(V_xOtis_SamplerFragmentBuffer1, texcoord);
	vec4 color_147 = _146;
	vec2 _148;
	_148 = texcoord;
	float _149 = F_xReShade_xGetLinearizedDepth(_148);
	float colorDepth_150 = _149;
	float n_152 = 1.00000000e+00;
	float j = 1.00000000e+00;
	while (j < 5.00000000e+00)
	{
		{
			float _165 = j * 9.25925910e-04;
			vec2 _167 = vec2(0.00000000e+00, _165);
			vec2 _168 = texcoord + _167;
			vec2 sourceCoords_169 = _168;
			vec2 _170;
			_170 = sourceCoords_169;
			float _171 = F_xReShade_xGetLinearizedDepth(_170);
			float _172;
			float _173;
			float _174;
			_172 = j;
			_173 = colorDepth_150;
			_174 = _171;
			float _175 = F_xCalculateWeight(_172, _173, _174);
			float weight_176 = _175;
			vec4 _177 = texture(V_xOtis_SamplerFragmentBuffer1, sourceCoords_169);
			vec4 _179 = _177 * vec4(weight_176);
			vec4 _180 = color_147 + _179;
			color_147 = _180;
			float _181 = n_152 + weight_176;
			n_152 = _181;
			float _183 = j * 9.25925910e-04;
			vec2 _185 = vec2(0.00000000e+00, _183);
			vec2 _186 = texcoord - _185;
			sourceCoords_169 = _186;
			vec2 _187;
			_187 = sourceCoords_169;
			float _188 = F_xReShade_xGetLinearizedDepth(_187);
			float _189;
			float _190;
			float _191;
			_189 = j;
			_190 = colorDepth_150;
			_191 = _188;
			float _192 = F_xCalculateWeight(_189, _190, _191);
			weight_176 = _192;
			vec4 _193 = texture(V_xOtis_SamplerFragmentBuffer1, sourceCoords_169);
			vec4 _195 = _193 * vec4(weight_176);
			vec4 _196 = color_147 + _195;
			color_147 = _196;
			float _197 = n_152 + weight_176;
			n_152 = _197;
		}
		float _163 = j + 1.00000000e+00;
		j = _163;
	}
	vec4 _199 = color_147 / vec4(n_152);
	outFragment = _199;
	return;
}
void F_xPS_Otis_DEH_BlendBlurWithNormalBuffer(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec2 _205;
	_205 = texcoord;
	float _206 = F_xReShade_xGetLinearizedDepth(_205);
	float depth_207 = _206;
	vec4 _208 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 _209 = texture(V_xOtis_SamplerFragmentBuffer2, texcoord);
	float _210 = depth_207 * V_xEffectStrength;
	float _213 = clamp(_210, 0.00000000e+00, 1.00000000e+00);
	vec4 _215 = mix(_208, _209, vec4(_213));
	vec4 blendedFragment = _215;
	bool _219 = texcoord.y > 5.00000000e-01;
	float _222 = texcoord.y - 5.00000000e-01;
	float _224 = _222 * 2.00000000e+00;
	float _226 = 1.00000000e+00 - _224;
	float _229 = texcoord.y * 2.00000000e+00;
	float _230 = _219 ? _226 : _229;
	float _233 = clamp(_230, 0.00000000e+00, 1.00000000e+00);
	float yFactor = _233;
	vec4 _239 = vec4(V_xFogColor.x, V_xFogColor.y, V_xFogColor.z, blendedFragment.x);
	float _240 = depth_207 - V_xFogStart;
	float _241 = _240 * yFactor;
	float _242 = _241 * V_xFogFactor;
	float _245 = clamp(_242, 0.00000000e+00, 1.00000000e+00);
	vec4 _247 = mix(blendedFragment, _239, vec4(_245));
	fragment = _247;
	return;
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
#ifdef E_xPS_Otis_DEH_BlockBlurHorizontal
in vec2 vv_0;
layout(location = 0) out vec4 _out_outFragment;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 outFragment;
	F_xPS_Otis_DEH_BlockBlurHorizontal(pos, texcoord, outFragment);
	_out_outFragment = outFragment;
	return;
}
#endif
#ifdef E_xPS_Otis_DEH_BlockBlurVertical
in vec2 vv_0;
layout(location = 0) out vec4 _out_outFragment;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 outFragment;
	F_xPS_Otis_DEH_BlockBlurVertical(pos, texcoord, outFragment);
	_out_outFragment = outFragment;
	return;
}
#endif
#ifdef E_xPS_Otis_DEH_BlendBlurWithNormalBuffer
in vec2 vv_0;
layout(location = 0) out vec4 _out_fragment;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xPS_Otis_DEH_BlendBlurWithNormalBuffer(vpos, texcoord, fragment);
	_out_fragment = fragment;
	return;
}
#endif
