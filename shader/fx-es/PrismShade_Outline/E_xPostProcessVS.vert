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
uniform vec3 V_xOutlineColor;
uniform int V_xBlendMode;
uniform float V_xStrength;
uniform float V_xThickness;
uniform float V_xSensitivity;
uniform float V_xSoftness;
uniform float V_xFadeStart;
uniform float V_xFadeEnd;
uniform bool V_xSkyEdges;
uniform int V_xDebug;

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
float F_xInverseDepth(
	in vec2 uv)
{
	vec2 _74;
	_74 = uv;
	float _75 = F_xReShade_xGetLinearizedDepth(_74);
	float linear_depth = _75;
	bool _81 = linear_depth >= 9.99899983e-01;
	if (_81)
	{
		return 0.00000000e+00;
	}
	float _84 = linear_depth * 1.00000000e+03;
	float _86 = max(_84, 1.00000001e-01);
	float _88 = 1.00000001e-01 / _86;
	return _88;
}
float F_xBend(
	in float centre,
	in float a,
	in float b)
{
	float _94 = max(a, b);
	float _95 = max(centre, _94);
	float nearest = _95;
	float _97 = a + b;
	float _99 = 2.00000000e+00 * centre;
	float _100 = _97 - _99;
	float _101 = abs(_100);
	float _103 = max(nearest, 9.99999997e-07);
	float _104 = _101 / _103;
	return _104;
}
vec4 F_xOutlinePS(
	in vec4 position,
	in vec2 uv)
{
	vec4 _109 = texture(V_xReShade_xBackBuffer, uv);
	vec3 scene = _109.xyz;
	float _113 = V_xThickness * 1.59999996e-03;
	vec2 _116 = vec2(5.62500000e-01, 1.00000000e+00) * vec2(_113);
	vec2 step_uv = _116;
	vec2 _119 = step_uv * vec2(7.07099974e-01, 7.07099974e-01);
	vec2 diagonal = _119;
	vec2 _121;
	_121 = uv;
	float _122 = F_xInverseDepth(_121);
	float c = _122;
	vec2 _126 = vec2(step_uv.x, 0.00000000e+00);
	vec2 _127 = uv + _126;
	vec2 _128;
	_128 = _127;
	float _129 = F_xInverseDepth(_128);
	float e = _129;
	vec2 _133 = vec2(step_uv.x, 0.00000000e+00);
	vec2 _134 = uv - _133;
	vec2 _135;
	_135 = _134;
	float _136 = F_xInverseDepth(_135);
	float w = _136;
	vec2 _140 = vec2(0.00000000e+00, step_uv.y);
	vec2 _141 = uv - _140;
	vec2 _142;
	_142 = _141;
	float _143 = F_xInverseDepth(_142);
	float n = _143;
	vec2 _147 = vec2(0.00000000e+00, step_uv.y);
	vec2 _148 = uv + _147;
	vec2 _149;
	_149 = _148;
	float _150 = F_xInverseDepth(_149);
	float s = _150;
	float _153 = -(diagonal.y);
	vec2 _155 = vec2(diagonal.x, _153);
	vec2 _156 = uv + _155;
	vec2 _157;
	_157 = _156;
	float _158 = F_xInverseDepth(_157);
	float ne = _158;
	float _161 = -(diagonal.x);
	vec2 _163 = vec2(_161, diagonal.y);
	vec2 _164 = uv + _163;
	vec2 _165;
	_165 = _164;
	float _166 = F_xInverseDepth(_165);
	float sw = _166;
	vec2 _168 = uv - diagonal;
	vec2 _169;
	_169 = _168;
	float _170 = F_xInverseDepth(_169);
	float nw = _170;
	vec2 _172 = uv + diagonal;
	vec2 _173;
	_173 = _172;
	float _174 = F_xInverseDepth(_173);
	float se = _174;
	float _176;
	float _177;
	float _178;
	_176 = c;
	_177 = e;
	_178 = w;
	float _179 = F_xBend(_176, _177, _178);
	float _180;
	float _181;
	float _182;
	_180 = c;
	_181 = n;
	_182 = s;
	float _183 = F_xBend(_180, _181, _182);
	float _184 = max(_179, _183);
	float _185;
	float _186;
	float _187;
	_185 = c;
	_186 = ne;
	_187 = sw;
	float _188 = F_xBend(_185, _186, _187);
	float _189;
	float _190;
	float _191;
	_189 = c;
	_190 = nw;
	_191 = se;
	float _192 = F_xBend(_189, _190, _191);
	float _193 = max(_188, _192);
	float _194 = max(_184, _193);
	float bend = _194;
	float _196 = sqrt(V_xSensitivity);
	float _199 = mix(5.00000000e-01, 8.00000038e-03, _196);
	float threshold = _199;
	float _203 = mix(1.00000000e+00, 4.00000000e+00, V_xSoftness);
	float _204 = threshold * _203;
	float _205 = smoothstep(threshold, _204, bend);
	float edge = _205;
	float _207 = max(e, w);
	float _208 = max(n, s);
	float _209 = max(_207, _208);
	float _210 = max(c, _209);
	float nearest_211 = _210;
	float _213 = max(nearest_211, 9.99999997e-07);
	float _215 = 1.00000001e-01 / _213;
	float distance_studs = _215;
	float _218 = V_xFadeStart + 1.00000000e+00;
	float _219 = max(V_xFadeEnd, _218);
	float _220 = smoothstep(V_xFadeStart, _219, distance_studs);
	float _222 = 1.00000000e+00 - _220;
	float fade = _222;
	bool _225 = nearest_211 <= 9.99999997e-07;
	float _228 = _225 ? 1.00000000e+00 : 0.00000000e+00;
	float sky = _228;
	float _230 = min(e, w);
	float _231 = min(c, _230);
	float _232 = min(n, s);
	float _233 = min(_231, _232);
	bool _235 = _233 <= 9.99999997e-07;
	float _238 = _235 ? 1.00000000e+00 : 0.00000000e+00;
	float against_sky = _238;
	bool _243 = !bool(V_xSkyEdges);
	bool _245 = against_sky > 5.00000000e-01;
	bool _246 = _243 && _245;
	if (_246)
	{
		edge = 0.00000000e+00;
	}
	float _249 = mix(fade, 1.00000000e+00, sky);
	float _250 = _249 * V_xStrength;
	float _251 = edge * _250;
	edge = _251;
	bool _256 = V_xDebug == 1;
	if (_256)
	{
		vec4 _261 = vec4(vec3(edge).x, vec3(edge).y, vec3(edge).z, 1.00000000e+00);
		return _261;
	}
	vec3 result = scene;
	bool _267 = V_xBlendMode == 0;
	if (_267)
	{
		vec3 _269 = mix(scene, V_xOutlineColor, vec3(edge));
		result = _269;
	}
	else
	{
		bool _274 = V_xBlendMode == 1;
		if (_274)
		{
			vec3 _276 = V_xOutlineColor * vec3(edge);
			vec3 _277 = scene + _276;
			result = _277;
		}
		else
		{
			vec3 _280 = mix(vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00), V_xOutlineColor, vec3(edge));
			vec3 _281 = scene * _280;
			result = _281;
		}
	}
	vec4 _286 = vec4(result.x, result.y, result.z, 1.00000000e+00);
	return _286;
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
#ifdef E_xOutlinePS
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 uv = vv_0;
	vv_0 = F_xOutlinePS(position, uv);
	return;
}
#endif
