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
uniform float V_xPersistence;
uniform float V_xTQ;
uniform bool V_xPS2;

uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xCBackBuffer;
uniform sampler2D V_xPBackBuffer;
uniform sampler2D V_xPSBackBuffer;
const vec2 _138[12] = vec2[12](vec2(-3.26211989e-01, -4.05804992e-01), vec2(-8.40143979e-01, -7.35799968e-02), vec2(-6.95913970e-01, 4.57136989e-01), vec2(-2.03345001e-01, 6.20715976e-01), vec2(9.62339997e-01, -1.94983006e-01), vec2(4.73434001e-01, -4.80026007e-01), vec2(5.19456029e-01, 7.67022014e-01), vec2(1.85461000e-01, -8.93123984e-01), vec2(5.07430971e-01, 6.44249991e-02), vec2(8.96420002e-01, 4.12458003e-01), vec2(-3.21940005e-01, -9.32614982e-01), vec2(-7.91558981e-01, -5.97705007e-01));
float F_xDepth(
	in vec2 texcoord)
{
	if (false)
	{
		float _23 = 1.00000000e+00 - texcoord.y;
		texcoord[1] = _23;
	}
	vec4 _24 = texture(V_xDepthBuffer, texcoord);
	float zBuffer = _24.x;
	float Far = 1.00000000e+00;
	float Near = 5.00000024e-04;
	float _32 = 1.00000000e+00 - zBuffer;
	vec2 _33 = vec2(zBuffer, _32);
	vec2 Z = _33;
	if (true)
	{
		float _39 = Far * Near;
		float _40 = Near - Far;
		float _42 = Z.x * _40;
		float _43 = Far + _42;
		float _44 = _39 / _43;
		zBuffer = _44;
	}
	else
	{
		if (false)
		{
			float _49 = Far * Near;
			float _50 = Near - Far;
			float _52 = Z.y * _50;
			float _53 = Far + _52;
			float _54 = _49 / _53;
			zBuffer = _54;
		}
	}
	float _55 = clamp(zBuffer, 0.0, 1.0);
	return _55;
}
vec3 F_xT_Out(
	in vec4 position,
	in vec2 texcoord)
{
	float TQA = V_xTQ;
	vec2 _61;
	_61 = texcoord;
	float _62 = F_xDepth(_61);
	float D = _62;
	if (V_xPS2)
	{
		TQA = 0.00000000e+00;
	}
	vec4 _68 = texture(V_xBackBuffer, texcoord);
	vec3 C = _68.xyz;
	vec4 _74 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, TQA);
	vec4 _75 = textureLod(V_xPBackBuffer, _74.xy, _74.w);
	vec3 P = _75.xyz;
	float _79 = 1.00000000e+00 - V_xPersistence;
	float Per = _79;
	float _83 = smoothstep(0.00000000e+00, 2.50000000e+02, D);
	D = _83;
	if (false)
	{
		float _89 = step(5.00000000e-01, D);
		D = _89;
	}
	if (false)
	{
		float _95 = 1.00000000e+00 - D;
		D = _95;
	}
	bool _99 = !bool(V_xPS2);
	if (_99)
	{
		vec3 _101 = P * vec3(Per);
		P = _101;
		vec4 _102 = texture(V_xBackBuffer, texcoord);
		vec3 _104 = max(_102.xyz, P);
		C = _104;
	}
	else
	{
		float _106 = 1.00000000e+00 - Per;
		vec3 _108 = vec3(_106) * C;
		vec3 _110 = vec3(Per) * P;
		vec3 _111 = _108 + _110;
		C = _111;
	}
	if (false)
	{
		vec4 _116 = texture(V_xBackBuffer, texcoord);
		float _117 = clamp(D, 0.0, 1.0);
		vec3 _120 = mix(C, _116.xyz, vec3(_117));
		C = _120;
	}
	if (false)
	{
		C = vec3(D);
	}
	return C;
}
void F_xCurrent_BackBuffer_T(
	in vec4 position,
	in vec2 texcoord,
	out vec4 color)
{
	vec4 _131 = texture(V_xBackBuffer, texcoord);
	color = _131;
	return;
}
void F_xPast_BB(
	in vec4 position,
	in vec2 texcoord,
	out vec4 Past,
	out vec4 PastSingle)
{
	vec2 samples[12] = _138;
	vec4 _140 = texture(V_xBackBuffer, texcoord);
	vec4 sum_A = _140;
	vec4 sum_B = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _147 = !bool(V_xPS2);
	if (_147)
	{
		float _149 = V_xTQ * 5.20833360e-04;
		float Adjust = _149;
		int i = 0;
		while (i < 12)
		{
			{
				vec2 _165 = vec2(Adjust) * samples[int(i)];
				vec2 _166 = texcoord + _165;
				vec4 _171 = vec4(_166.x, _166.y, 0.00000000e+00, 0.00000000e+00);
				vec4 _172 = textureLod(V_xBackBuffer, _171.xy, _171.w);
				vec4 _173 = sum_A + _172;
				sum_A = _173;
			}
			int _161 = i;
			int _162 = _161 + 1;
			i = _162;
		}
		vec4 _175 = sum_A * vec4(7.69230723e-02, 7.69230723e-02, 7.69230723e-02, 7.69230723e-02);
		Past = _175;
		PastSingle = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
	else
	{
		Past = sum_A;
		PastSingle = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	}
	return;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _184 = id == 2u;
	float _187 = _184 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _187;
	bool _189 = id == 1u;
	float _192 = _189 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _192;
	vec2 _194 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _196 = _194 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _201 = vec4(_196.x, _196.y, 0.00000000e+00, 1.00000000e+00);
	position = _201;
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
#ifdef E_xCurrent_BackBuffer_T
in vec2 vv_0;
out vec4 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 color;
	F_xCurrent_BackBuffer_T(position, texcoord, color);
	vv_0 = color;
	return;
}
#endif
#ifdef E_xT_Out
out vec3 vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xT_Out(position, texcoord);
	return;
}
#endif
#ifdef E_xPast_BB
in vec2 vv_0;
out vec4 vv_0;
out vec4 vv_1;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 Past;
	vec4 PastSingle;
	F_xPast_BB(position, texcoord, Past, PastSingle);
	vv_0 = Past;
	vv_1 = PastSingle;
	return;
}
#endif
