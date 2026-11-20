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
uniform vec3 V_xFogColor;
uniform float V_xMaxFogFactor;
uniform float V_xFogCurve;
uniform float V_xFogStart;
uniform float V_xBloomThreshold;
uniform float V_xBloomPower;
uniform float V_xBloomWidth;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xOtis_BloomSampler;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _17 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _17;
	float _20 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _20;
	float _23 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _23;
	float _26 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _26;
	vec4 _31 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _32 = textureLod(V_xReShade_xDepthBuffer, _31.xy, _31.w);
	float _35 = _32.x * 1.00000000e+00;
	float depth = _35;
	float _38 = 1.00000000e+00 - depth;
	depth = _38;
	float _40 = depth * 9.99000000e+02;
	float _42 = 1.00000000e+03 - _40;
	float _43 = depth / _42;
	depth = _43;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _50 = id == 2u;
	float _53 = _50 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _53;
	bool _55 = id == 1u;
	float _58 = _55 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _58;
	vec2 _60 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _62 = _60 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _67 = vec4(_62.x, _62.y, 0.00000000e+00, 1.00000000e+00);
	position = _67;
	return;
}
void F_xPS_Otis_AFG_PerformBloom(
	in vec4 position,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec4 _75 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _75;
	vec3 BlurColor2 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 Blurtemp = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _82 = 8.00000000e+00 * V_xBloomWidth;
	float MaxDistance = _82;
	float CurDistance = 0.00000000e+00;
	float Samplecount = 2.50000000e+01;
	vec2 _89 = texcoord * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _91 = _89 * vec2(V_xBloomWidth);
	vec2 blurtempvalue = _91;
	vec2 BloomSample = vec2(2.50000000e+00, -2.50000000e+00);
	vec2 BloomSampleValue = vec2(0.00000000e+00, 0.00000000e+00);
	BloomSample[0] = 2.50000000e+00;
	while (BloomSample.x > -2.00000000e+00)
	{
		{
			float _111 = BloomSample.x * blurtempvalue.x;
			BloomSampleValue[0] = _111;
			float _114 = BloomSample.x * BloomSample.x;
			float _115 = _114 * V_xBloomWidth;
			vec2 distancetemp = vec2(_115);
			BloomSample[1] = -2.50000000e+00;
			while (BloomSample.y < 2.00000000e+00)
			{
				{
					float _132 = BloomSample.y * BloomSample.y;
					distancetemp[1] = _132;
					float _134 = distancetemp.y * V_xBloomWidth;
					float _136 = _134 + distancetemp.x;
					CurDistance = _136;
					float _139 = BloomSample.y * blurtempvalue.y;
					BloomSampleValue[1] = _139;
					vec2 _140 = texcoord + BloomSampleValue;
					vec4 _141 = texture(V_xReShade_xBackBuffer, _140);
					Blurtemp.xyz = _141.xyz;
					float _143 = CurDistance / MaxDistance;
					float _144 = sqrt(_143);
					vec3 _148 = mix(Blurtemp.xyz, color.xyz, vec3(_144));
					vec3 _150 = BlurColor2.xyz + _148;
					BlurColor2.xyz = _150;
				}
				float _129 = BloomSample.y + 1.00000000e+00;
				BloomSample[1] = _129;
			}
		}
		float _108 = BloomSample.x - 1.00000000e+00;
		BloomSample[0] = _108;
	}
	float _152 = V_xBloomThreshold * 5.00000000e+00;
	float _153 = V_xBloomPower - _152;
	float _154 = Samplecount - _153;
	vec3 _157 = BlurColor2.xyz / vec3(_154);
	BlurColor2.xyz = _157;
	float _160 = dot(color.xyz, vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01));
	float Bloomamount = _160;
	float _163 = V_xBloomPower + 4.00000000e+00;
	vec3 _166 = BlurColor2.xyz * vec3(_163);
	vec3 BlurColor = _166;
	vec3 _171 = mix(color.xyz, BlurColor.xyz, vec3(Bloomamount));
	color.xyz = _171;
	vec4 _172 = clamp(color, 0.0, 1.0);
	fragment = _172;
	return;
}
void F_xPS_Otis_AFG_BlendFogWithNormalBuffer(
	in vec4 vpos,
	in vec2 texcoord,
	out vec4 fragment)
{
	vec2 _178;
	_178 = texcoord;
	float _179 = F_xReShade_xGetLinearizedDepth(_178);
	float depth_180 = _179;
	float _181 = depth_180 - V_xFogStart;
	float _182 = clamp(_181, 0.0, 1.0);
	float _183 = _182 * V_xFogCurve;
	float _185 = clamp(_183, 0.00000000e+00, V_xMaxFogFactor);
	float fogFactor = _185;
	vec4 _187 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 _188 = texture(V_xOtis_BloomSampler, texcoord);
	vec4 _193 = vec4(V_xFogColor.x, V_xFogColor.y, V_xFogColor.z, 1.00000000e+00);
	vec4 _195 = mix(_188, _193, vec4(fogFactor));
	vec4 _197 = mix(_187, _195, vec4(fogFactor));
	fragment = _197;
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
#ifdef E_xPS_Otis_AFG_PerformBloom
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xPS_Otis_AFG_PerformBloom(position, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
#ifdef E_xPS_Otis_AFG_BlendFogWithNormalBuffer
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 fragment;
	F_xPS_Otis_AFG_BlendFogWithNormalBuffer(vpos, texcoord, fragment);
	vv_0 = fragment;
	return;
}
#endif
