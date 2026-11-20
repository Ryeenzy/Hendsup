#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_DaltonizeFXmain
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xType;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _11 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _11;
	float _14 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _14;
	float _17 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _17;
	float _20 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _20;
	vec4 _25 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _26 = textureLod(V_xReShade_xDepthBuffer, _25.xy, _25.w);
	float _29 = _26.x * 1.00000000e+00;
	float depth = _29;
	float _32 = 1.00000000e+00 - depth;
	depth = _32;
	float _34 = depth * 9.99000000e+02;
	float _36 = 1.00000000e+03 - _34;
	float _37 = depth / _36;
	depth = _37;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _44 = id == 2u;
	float _47 = _44 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _47;
	bool _49 = id == 1u;
	float _52 = _49 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _52;
	vec2 _54 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _56 = _54 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _61 = vec4(_56.x, _56.y, 0.00000000e+00, 1.00000000e+00);
	position = _61;
	return;
}
vec3 F_xPS_DaltonizeFXmain(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _66 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 _input = _66.xyz;
	float _71 = 1.78824005e+01 * _input.x;
	float _74 = 4.35161018e+01 * _input.y;
	float _75 = _71 + _74;
	float _78 = 4.11934996e+00 * _input.z;
	float _79 = _75 + _78;
	float OnizeL = _79;
	float _83 = 3.45565009e+00 * _input.x;
	float _86 = 2.71553993e+01 * _input.y;
	float _87 = _83 + _86;
	float _90 = 3.86714005e+00 * _input.z;
	float _91 = _87 + _90;
	float OnizeM = _91;
	float _95 = 2.99565997e-02 * _input.x;
	float _98 = 1.84309006e-01 * _input.y;
	float _99 = _95 + _98;
	float _102 = 1.46709001e+00 * _input.z;
	float _103 = _99 + _102;
	float OnizeS = _103;
	float Daltl = 0.00000000e+00;
	float Daltm = 0.00000000e+00;
	float Dalts = 0.00000000e+00;
	bool _115 = V_xType == 0;
	if (_115)
	{
		float _117 = 0.00000000e+00 * OnizeL;
		float _119 = 2.02343988e+00 * OnizeM;
		float _120 = _117 + _119;
		float _122 = -2.52581000e+00 * OnizeS;
		float _123 = _120 + _122;
		Daltl = _123;
		float _125 = 0.00000000e+00 * OnizeL;
		float _127 = 1.00000000e+00 * OnizeM;
		float _128 = _125 + _127;
		float _130 = 0.00000000e+00 * OnizeS;
		float _131 = _128 + _130;
		Daltm = _131;
		float _133 = 0.00000000e+00 * OnizeL;
		float _135 = 0.00000000e+00 * OnizeM;
		float _136 = _133 + _135;
		float _138 = 1.00000000e+00 * OnizeS;
		float _139 = _136 + _138;
		Dalts = _139;
	}
	else
	{
		bool _144 = V_xType == 1;
		if (_144)
		{
			float _146 = 1.00000000e+00 * OnizeL;
			float _148 = 0.00000000e+00 * OnizeM;
			float _149 = _146 + _148;
			float _151 = 0.00000000e+00 * OnizeS;
			float _152 = _149 + _151;
			Daltl = _152;
			float _154 = 4.94206995e-01 * OnizeL;
			float _156 = 0.00000000e+00 * OnizeM;
			float _157 = _154 + _156;
			float _159 = 1.24827003e+00 * OnizeS;
			float _160 = _157 + _159;
			Daltm = _160;
			float _162 = 0.00000000e+00 * OnizeL;
			float _164 = 0.00000000e+00 * OnizeM;
			float _165 = _162 + _164;
			float _167 = 1.00000000e+00 * OnizeS;
			float _168 = _165 + _167;
			Dalts = _168;
		}
		else
		{
			bool _173 = V_xType == 2;
			if (_173)
			{
				float _175 = 1.00000000e+00 * OnizeL;
				float _177 = 0.00000000e+00 * OnizeM;
				float _178 = _175 + _177;
				float _180 = 0.00000000e+00 * OnizeS;
				float _181 = _178 + _180;
				Daltl = _181;
				float _183 = 0.00000000e+00 * OnizeL;
				float _185 = 1.00000000e+00 * OnizeM;
				float _186 = _183 + _185;
				float _188 = 0.00000000e+00 * OnizeS;
				float _189 = _186 + _188;
				Daltm = _189;
				float _191 = -3.95913005e-01 * OnizeL;
				float _193 = 8.01109016e-01 * OnizeM;
				float _194 = _191 + _193;
				float _196 = 0.00000000e+00 * OnizeS;
				float _197 = _194 + _196;
				Dalts = _197;
			}
		}
	}
	vec3 error = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _201 = 8.09444487e-02 * Daltl;
	float _203 = -1.30504414e-01 * Daltm;
	float _204 = _201 + _203;
	float _206 = 1.16721064e-01 * Dalts;
	float _207 = _204 + _206;
	error[0] = _207;
	float _209 = -1.02485335e-02 * Daltl;
	float _211 = 5.40193282e-02 * Daltm;
	float _212 = _209 + _211;
	float _214 = -1.13614708e-01 * Dalts;
	float _215 = _212 + _214;
	error[1] = _215;
	float _217 = -3.65296932e-04 * Daltl;
	float _219 = -4.12161462e-03 * Daltm;
	float _220 = _217 + _219;
	float _222 = 6.93511426e-01 * Dalts;
	float _223 = _220 + _222;
	error[2] = _223;
	vec3 _224 = _input - error;
	error = _224;
	vec3 correction = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	correction[0] = 0.00000000e+00;
	float _230 = error.x * 6.99999988e-01;
	float _233 = error.y * 1.00000000e+00;
	float _234 = _230 + _233;
	correction[1] = _234;
	float _237 = error.x * 6.99999988e-01;
	float _240 = error.z * 1.00000000e+00;
	float _241 = _237 + _240;
	correction[2] = _241;
	vec3 _242 = _input + correction;
	correction = _242;
	return correction;
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
#ifdef E_xPS_DaltonizeFXmain
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_DaltonizeFXmain(vpos, texcoord);
	return;
}
#endif
