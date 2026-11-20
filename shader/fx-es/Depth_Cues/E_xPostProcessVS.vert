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
uniform int V_xDepth_Map;
uniform float V_xDepth_Map_Adjust;
uniform bool V_xDepth_Map_Flip;
uniform bool V_xDEPTH_DEBUG;
uniform bool V_xNo_Depth_Map;
uniform float V_xShade_Power;
uniform float V_xBlur_Cues;
uniform float V_xSpread;
uniform bool V_xDebug_View;
uniform float V_xtimer;

uniform sampler2D V_xDepthBuffer_DC;
uniform sampler2D V_xBackBuffer_DC;
uniform sampler2D V_xSamplerHB_DC;
uniform sampler2D V_xSamplerDC;
float F_xDepth_DC(
	in vec2 texcoord)
{
	if (V_xDepth_Map_Flip)
	{
		float _27 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _27;
	}
	vec4 _28 = texture(V_xDepthBuffer_DC, texcoord);
	float zBuffer = _28.x;
	float Far = 1.00000000e+00;
	float _34 = 1.25000000e-01 / V_xDepth_Map_Adjust;
	float Near = _34;
	float _37 = 1.00000000e+00 - zBuffer;
	vec2 _38 = vec2(zBuffer, _37);
	vec2 Z = _38;
	bool _44 = V_xDepth_Map == 0;
	if (_44)
	{
		float _45 = Far * Near;
		float _46 = Near - Far;
		float _48 = Z.x * _46;
		float _49 = Far + _48;
		float _50 = _45 / _49;
		zBuffer = _50;
	}
	else
	{
		bool _55 = V_xDepth_Map == 1;
		if (_55)
		{
			float _56 = Far * Near;
			float _57 = Near - Far;
			float _59 = Z.y * _57;
			float _60 = Far + _59;
			float _61 = _56 / _60;
			zBuffer = _61;
		}
	}
	float _62 = clamp(zBuffer, 0.0, 1.0);
	return _62;
}
float F_xlum(
	in vec3 RGB)
{
	float _67 = dot(RGB, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	return _67;
}
float F_xBB(
	in vec2 texcoord,
	in vec2 AD)
{
	vec2 _72 = texcoord + AD;
	vec4 _77 = vec4(_72.x, _72.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _78 = textureLod(V_xBackBuffer_DC, _77.xy, _77.w);
	vec3 _79;
	_79 = _78.xyz;
	float _81 = F_xlum(_79);
	return _81;
}
float F_xH_Blur_DC(
	in vec4 position,
	in vec2 texcoord)
{
	float _87 = V_xSpread * 1.00000000e+00;
	float _89 = _87 * 1.25000000e-01;
	float S = _89;
	vec2 _91;
	vec2 _92;
	_91 = texcoord;
	_92 = vec2(0.00000000e+00, 0.00000000e+00);
	float _94 = F_xBB(_91, _92);
	float _96 = _94 * 1.00000000e+01;
	float sum = _96;
	float total = 1.00000000e+01;
	int j = -10;
	while (j <= 10)
	{
		{
			float W = 1.00000000e+01;
			float _114 = 5.20833360e-04 * S;
			vec2 _116 = vec2(_114, 0.00000000e+00);
			vec2 _118 = _116 * vec2(ivec2(j));
			vec2 _119;
			vec2 _120;
			_119 = texcoord;
			_120 = _118;
			float _121 = F_xBB(_119, _120);
			float _122 = _121 * W;
			float _123 = sum + _122;
			sum = _123;
			float _124 = total + W;
			total = _124;
		}
		int _110 = j + 1;
		j = _110;
	}
	float _125 = sum / total;
	float _126 = clamp(_125, 0.0, 1.0);
	return _126;
}
float F_xDepthCues(
	in vec4 position,
	in vec2 texcoord)
{
	float _132 = V_xSpread * 1.00000000e+00;
	float _134 = _132 * 7.50000000e-01;
	vec2 _137 = vec2(_134) * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 S_138 = _137;
	float M_Cues = 1.00000000e+00;
	vec4 _144 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, M_Cues);
	vec4 _145 = textureLod(V_xSamplerHB_DC, _144.xy, _144.w);
	float result = _145.x;
	vec2 _149 = vec2(1.00000000e+00, 0.00000000e+00) * S_138;
	vec2 _150 = texcoord + _149;
	vec4 _154 = vec4(_150.x, _150.y, 0.00000000e+00, M_Cues);
	vec4 _155 = textureLod(V_xSamplerHB_DC, _154.xy, _154.w);
	float _157 = result + _155.x;
	result = _157;
	vec2 _159 = vec2(0.00000000e+00, 1.00000000e+00) * S_138;
	vec2 _160 = texcoord + _159;
	vec4 _164 = vec4(_160.x, _160.y, 0.00000000e+00, M_Cues);
	vec4 _165 = textureLod(V_xSamplerHB_DC, _164.xy, _164.w);
	float _167 = result + _165.x;
	result = _167;
	vec2 _169 = vec2(-1.00000000e+00, 0.00000000e+00) * S_138;
	vec2 _170 = texcoord + _169;
	vec4 _174 = vec4(_170.x, _170.y, 0.00000000e+00, M_Cues);
	vec4 _175 = textureLod(V_xSamplerHB_DC, _174.xy, _174.w);
	float _177 = result + _175.x;
	result = _177;
	vec2 _179 = vec2(0.00000000e+00, -1.00000000e+00) * S_138;
	vec2 _180 = texcoord + _179;
	vec4 _184 = vec4(_180.x, _180.y, 0.00000000e+00, M_Cues);
	vec4 _185 = textureLod(V_xSamplerHB_DC, _184.xy, _184.w);
	float _187 = result + _185.x;
	result = _187;
	vec2 _189 = S_138 * vec2(5.00000000e-01, 5.00000000e-01);
	S_138 = _189;
	vec2 _191 = vec2(1.00000000e+00, 0.00000000e+00) * S_138;
	vec2 _192 = texcoord + _191;
	vec4 _196 = vec4(_192.x, _192.y, 0.00000000e+00, M_Cues);
	vec4 _197 = textureLod(V_xSamplerHB_DC, _196.xy, _196.w);
	float _199 = result + _197.x;
	result = _199;
	vec2 _201 = vec2(0.00000000e+00, 1.00000000e+00) * S_138;
	vec2 _202 = texcoord + _201;
	vec4 _206 = vec4(_202.x, _202.y, 0.00000000e+00, M_Cues);
	vec4 _207 = textureLod(V_xSamplerHB_DC, _206.xy, _206.w);
	float _209 = result + _207.x;
	result = _209;
	vec2 _211 = vec2(-1.00000000e+00, 0.00000000e+00) * S_138;
	vec2 _212 = texcoord + _211;
	vec4 _216 = vec4(_212.x, _212.y, 0.00000000e+00, M_Cues);
	vec4 _217 = textureLod(V_xSamplerHB_DC, _216.xy, _216.w);
	float _219 = result + _217.x;
	result = _219;
	vec2 _221 = vec2(0.00000000e+00, -1.00000000e+00) * S_138;
	vec2 _222 = texcoord + _221;
	vec4 _226 = vec4(_222.x, _222.y, 0.00000000e+00, M_Cues);
	vec4 _227 = textureLod(V_xSamplerHB_DC, _226.xy, _226.w);
	float _229 = result + _227.x;
	result = _229;
	float _231 = 1.0 / 9.00000000e+00;
	float _232 = result * _231;
	result = _232;
	vec2 _233;
	vec2 _234;
	_233 = texcoord;
	_234 = vec2(0.00000000e+00, 0.00000000e+00);
	float _236 = F_xBB(_233, _234);
	float _237 = _236 / result;
	float _239 = mix(1.00000000e+00, _237, V_xShade_Power);
	float _240 = clamp(_239, 0.0, 1.0);
	return _240;
}
vec3 F_xShaderOut_DC(
	in vec2 texcoord)
{
	float _245 = V_xBlur_Cues * 1.00000000e+00;
	vec4 _249 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, _245);
	vec4 _250 = textureLod(V_xSamplerDC, _249.xy, _249.w);
	float DCB = _250.x;
	vec2 _253;
	_253 = texcoord;
	float _254 = F_xDepth_DC(_253);
	float DB = _254;
	vec3 Out = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 _258 = texture(V_xBackBuffer_DC, texcoord);
	vec3 BBN = _258.xyz;
	if (V_xNo_Depth_Map)
	{
		DB = 0.00000000e+00;
	}
	float _266 = mix(DCB, 1.00000000e+00, DB);
	vec3 _268 = BBN * vec3(_266);
	Out.xyz = _268;
	if (V_xDebug_View)
	{
		float _273 = mix(DCB, 1.00000000e+00, DB);
		Out = vec3(_273);
	}
	if (V_xDEPTH_DEBUG)
	{
		Out = vec3(DB);
	}
	return Out;
}
vec3 F_xOut_DC(
	in vec4 position,
	in vec2 texcoord)
{
	vec2 _283;
	_283 = texcoord;
	vec3 _284 = F_xShaderOut_DC(_283);
	vec3 Color = _284.xyz;
	return Color;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _293 = id == 2u;
	float _296 = _293 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _296;
	bool _298 = id == 1u;
	float _301 = _298 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _301;
	vec2 _303 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _305 = _303 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _310 = vec4(_305.x, _305.y, 0.00000000e+00, 1.00000000e+00);
	position = _310;
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
#ifdef E_xH_Blur_DC
out float vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xH_Blur_DC(position, texcoord);
	return;
}
#endif
#ifdef E_xDepthCues
out float vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xDepthCues(position, texcoord);
	return;
}
#endif
#ifdef E_xOut_DC
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xOut_DC(position, texcoord);
	return;
}
#endif
