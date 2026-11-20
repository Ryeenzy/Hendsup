#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_technicolor_xPS_Technicolor
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform vec3 V_xpd80_technicolor_xRed2strip;
uniform vec3 V_xpd80_technicolor_xCyan2strip;
uniform vec3 V_xpd80_technicolor_xcolorKey;
uniform float V_xpd80_technicolor_xSaturation2;
uniform bool V_xpd80_technicolor_xenable3strip;
uniform vec3 V_xpd80_technicolor_xColorStrength;
uniform float V_xpd80_technicolor_xBrightness;
uniform float V_xpd80_technicolor_xSaturation;
uniform float V_xpd80_technicolor_xStrength;

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
float F_xpd80_technicolor_xgetLuminance(
	in vec3 x)
{
	float _74 = dot(x, vec3(2.12656006e-01, 7.15157986e-01, 7.21860006e-02));
	return _74;
}
mat3x3 F_xpd80_technicolor_xQuaternionToMatrix(
	in vec4 quat)
{
	vec3 _80 = quat.yzx * quat.zxy;
	vec3 _cross = _80;
	vec3 _84 = quat.xyz * quat.xyz;
	vec3 square = _84;
	vec3 _88 = vec3(quat.w) * quat.xyz;
	vec3 wimag = _88;
	vec3 _92 = square.xyz + square.yzx;
	square = _92;
	vec3 _94 = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01) - square;
	vec3 diag = _94;
	vec3 _96 = _cross + wimag;
	vec3 a = _96;
	vec3 _98 = _cross - wimag;
	vec3 b = _98;
	vec3 _103 = vec3(diag.x, b.z, a.y);
	vec3 _105 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _103;
	vec3 _109 = vec3(a.z, diag.y, b.x);
	vec3 _111 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _109;
	vec3 _115 = vec3(b.y, a.x, diag.z);
	vec3 _117 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _115;
	mat3x3 _127 = mat3x3(_105.x, _105.y, _105.z, _111.x, _111.y, _111.z, _117.x, _117.y, _117.z);
	return _127;
}
vec4 F_xpd80_technicolor_xPS_Technicolor(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _132 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _132;
	vec3 _135 = clamp(color.xyz, 0.0, 1.0);
	color.xyz = _135;
	vec3 root3 = vec3(5.77350020e-01, 5.77350020e-01, 5.77350020e-01);
	vec3 keyC = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float half_angle = 0.00000000e+00;
	vec4 rot_quat = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	mat3x3 rot_Mat = mat3x3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float HueAdj = 5.19999981e-01;
	vec3 orig = color.xyz;
	float _152 = 1.00000000e+00 - color.x;
	float negR = _152;
	float _156 = 1.00000000e+00 - color.y;
	float negG = _156;
	vec3 _159 = vec3(negR) * V_xpd80_technicolor_xCyan2strip;
	vec3 _161 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _159;
	vec3 newR = _161;
	vec3 _164 = vec3(negG) * V_xpd80_technicolor_xRed2strip;
	vec3 _166 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _164;
	vec3 newC = _166;
	float _169 = radians(1.80000000e+02);
	float _171 = 5.00000000e-01 * _169;
	half_angle = _171;
	float _172 = sin(half_angle);
	vec3 _174 = root3 * vec3(_172);
	float _175 = cos(half_angle);
	vec4 _179 = vec4(_174.x, _174.y, _174.z, _175);
	rot_quat = _179;
	vec4 _180;
	_180 = rot_quat;
	mat3x3 _181 = F_xpd80_technicolor_xQuaternionToMatrix(_180);
	rot_Mat = _181;
	vec3 key = V_xpd80_technicolor_xcolorKey.xyz;
	vec3 _185 = (key.xyz * rot_Mat);
	key.xyz = _185;
	vec3 _188 = max(color.yyy, key.xyz);
	key.xyz = _188;
	vec3 _191 = newR.xyz * newC.xyz;
	vec3 _193 = _191 * key.xyz;
	color.xyz = _193;
	float _195 = HueAdj * 3.60000000e+02;
	float _196 = radians(_195);
	float _198 = 5.00000000e-01 * _196;
	half_angle = _198;
	float _199 = sin(half_angle);
	vec3 _201 = root3 * vec3(_199);
	float _202 = cos(half_angle);
	vec4 _206 = vec4(_201.x, _201.y, _201.z, _202);
	rot_quat = _206;
	vec4 _207;
	_207 = rot_quat;
	mat3x3 _208 = F_xpd80_technicolor_xQuaternionToMatrix(_207);
	rot_Mat = _208;
	vec3 _210 = (color.xyz * rot_Mat);
	color.xyz = _210;
	vec3 _211;
	_211 = color.xyz;
	float _213 = F_xpd80_technicolor_xgetLuminance(_211);
	vec3 _217 = mix(vec3(_213), color.xyz, vec3(V_xpd80_technicolor_xSaturation2));
	color.xyz = _217;
	if (V_xpd80_technicolor_xenable3strip)
	{
		vec3 _223 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - orig.xyz;
		vec3 temp = _223;
		vec3 target = temp.yxy;
		vec3 target2 = temp.zzx;
		vec3 _231 = orig.xyz * target.xyz;
		vec3 temp2 = _231;
		vec3 _235 = temp2.xyz * target2.xyz;
		temp2.xyz = _235;
		vec3 _237 = temp2.xyz * V_xpd80_technicolor_xColorStrength;
		temp.xyz = _237;
		vec3 _240 = temp2.xyz * vec3(V_xpd80_technicolor_xBrightness);
		temp2.xyz = _240;
		target.xyz = temp.yxy;
		target2.xyz = temp.zzx;
		vec3 _245 = orig.xyz - target.xyz;
		temp.xyz = _245;
		vec3 _248 = temp.xyz + temp2.xyz;
		temp.xyz = _248;
		vec3 _251 = temp.xyz - target2.xyz;
		temp2.xyz = _251;
		vec3 _255 = mix(orig.xyz, temp2.xyz, vec3(V_xpd80_technicolor_xStrength));
		color.xyz = _255;
		vec3 _256;
		_256 = color.xyz;
		float _258 = F_xpd80_technicolor_xgetLuminance(_256);
		vec3 _262 = mix(vec3(_258), color.xyz, vec3(V_xpd80_technicolor_xSaturation));
		color.xyz = _262;
	}
	vec4 _267 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _267;
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
#ifdef E_xpd80_technicolor_xPS_Technicolor
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_technicolor_xPS_Technicolor(pos, texcoord);
	return;
}
#endif
