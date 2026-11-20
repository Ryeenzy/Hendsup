#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xHDRPass
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xHDRPower;
uniform float V_xradius1;
uniform float V_xradius2;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
float F_xReShade_xGetLinearizedDepth(
	in vec2 texcoord)
{
	float _13 = texcoord.x / 1.00000000e+00;
	texcoord[0] = _13;
	float _16 = texcoord.y / 1.00000000e+00;
	texcoord[1] = _16;
	float _19 = texcoord.x - 0.00000000e+00;
	texcoord[0] = _19;
	float _22 = texcoord.y + 0.00000000e+00;
	texcoord[1] = _22;
	vec4 _27 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _28 = textureLod(V_xReShade_xDepthBuffer, _27.xy, _27.w);
	float _31 = _28.x * 1.00000000e+00;
	float depth = _31;
	float _34 = 1.00000000e+00 - depth;
	depth = _34;
	float _36 = depth * 9.99000000e+02;
	float _38 = 1.00000000e+03 - _36;
	float _39 = depth / _38;
	depth = _39;
	return depth;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 position,
	out vec2 texcoord)
{
	bool _46 = id == 2u;
	float _49 = _46 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _49;
	bool _51 = id == 1u;
	float _54 = _51 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _54;
	vec2 _56 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _58 = _56 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _63 = vec4(_58.x, _58.y, 0.00000000e+00, 1.00000000e+00);
	position = _63;
	return;
}
vec3 F_xHDRPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 color = _68.xyz;
	vec2 _73 = vec2(1.50000000e+00, -1.50000000e+00) * vec2(V_xradius1);
	vec2 _75 = _73 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _76 = texcoord + _75;
	vec4 _77 = texture(V_xReShade_xBackBuffer, _76);
	vec3 bloom_sum1 = _77.xyz;
	vec2 _82 = vec2(-1.50000000e+00, -1.50000000e+00) * vec2(V_xradius1);
	vec2 _84 = _82 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _85 = texcoord + _84;
	vec4 _86 = texture(V_xReShade_xBackBuffer, _85);
	vec3 _88 = bloom_sum1 + _86.xyz;
	bloom_sum1 = _88;
	vec2 _91 = vec2(1.50000000e+00, 1.50000000e+00) * vec2(V_xradius1);
	vec2 _93 = _91 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _94 = texcoord + _93;
	vec4 _95 = texture(V_xReShade_xBackBuffer, _94);
	vec3 _97 = bloom_sum1 + _95.xyz;
	bloom_sum1 = _97;
	vec2 _100 = vec2(-1.50000000e+00, 1.50000000e+00) * vec2(V_xradius1);
	vec2 _102 = _100 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _103 = texcoord + _102;
	vec4 _104 = texture(V_xReShade_xBackBuffer, _103);
	vec3 _106 = bloom_sum1 + _104.xyz;
	bloom_sum1 = _106;
	vec2 _109 = vec2(0.00000000e+00, -2.50000000e+00) * vec2(V_xradius1);
	vec2 _111 = _109 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _112 = texcoord + _111;
	vec4 _113 = texture(V_xReShade_xBackBuffer, _112);
	vec3 _115 = bloom_sum1 + _113.xyz;
	bloom_sum1 = _115;
	vec2 _118 = vec2(0.00000000e+00, 2.50000000e+00) * vec2(V_xradius1);
	vec2 _120 = _118 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _121 = texcoord + _120;
	vec4 _122 = texture(V_xReShade_xBackBuffer, _121);
	vec3 _124 = bloom_sum1 + _122.xyz;
	bloom_sum1 = _124;
	vec2 _127 = vec2(-2.50000000e+00, 0.00000000e+00) * vec2(V_xradius1);
	vec2 _129 = _127 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _130 = texcoord + _129;
	vec4 _131 = texture(V_xReShade_xBackBuffer, _130);
	vec3 _133 = bloom_sum1 + _131.xyz;
	bloom_sum1 = _133;
	vec2 _136 = vec2(2.50000000e+00, 0.00000000e+00) * vec2(V_xradius1);
	vec2 _138 = _136 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _139 = texcoord + _138;
	vec4 _140 = texture(V_xReShade_xBackBuffer, _139);
	vec3 _142 = bloom_sum1 + _140.xyz;
	bloom_sum1 = _142;
	vec3 _144 = bloom_sum1 * vec3(4.99999989e-03, 4.99999989e-03, 4.99999989e-03);
	bloom_sum1 = _144;
	vec2 _147 = vec2(1.50000000e+00, -1.50000000e+00) * vec2(V_xradius2);
	vec2 _149 = _147 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _150 = texcoord + _149;
	vec4 _151 = texture(V_xReShade_xBackBuffer, _150);
	vec3 bloom_sum2 = _151.xyz;
	vec2 _156 = vec2(-1.50000000e+00, -1.50000000e+00) * vec2(V_xradius2);
	vec2 _158 = _156 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _159 = texcoord + _158;
	vec4 _160 = texture(V_xReShade_xBackBuffer, _159);
	vec3 _162 = bloom_sum2 + _160.xyz;
	bloom_sum2 = _162;
	vec2 _165 = vec2(1.50000000e+00, 1.50000000e+00) * vec2(V_xradius2);
	vec2 _167 = _165 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _168 = texcoord + _167;
	vec4 _169 = texture(V_xReShade_xBackBuffer, _168);
	vec3 _171 = bloom_sum2 + _169.xyz;
	bloom_sum2 = _171;
	vec2 _174 = vec2(-1.50000000e+00, 1.50000000e+00) * vec2(V_xradius2);
	vec2 _176 = _174 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _177 = texcoord + _176;
	vec4 _178 = texture(V_xReShade_xBackBuffer, _177);
	vec3 _180 = bloom_sum2 + _178.xyz;
	bloom_sum2 = _180;
	vec2 _183 = vec2(0.00000000e+00, -2.50000000e+00) * vec2(V_xradius2);
	vec2 _185 = _183 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _186 = texcoord + _185;
	vec4 _187 = texture(V_xReShade_xBackBuffer, _186);
	vec3 _189 = bloom_sum2 + _187.xyz;
	bloom_sum2 = _189;
	vec2 _192 = vec2(0.00000000e+00, 2.50000000e+00) * vec2(V_xradius2);
	vec2 _194 = _192 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _195 = texcoord + _194;
	vec4 _196 = texture(V_xReShade_xBackBuffer, _195);
	vec3 _198 = bloom_sum2 + _196.xyz;
	bloom_sum2 = _198;
	vec2 _201 = vec2(-2.50000000e+00, 0.00000000e+00) * vec2(V_xradius2);
	vec2 _203 = _201 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _204 = texcoord + _203;
	vec4 _205 = texture(V_xReShade_xBackBuffer, _204);
	vec3 _207 = bloom_sum2 + _205.xyz;
	bloom_sum2 = _207;
	vec2 _210 = vec2(2.50000000e+00, 0.00000000e+00) * vec2(V_xradius2);
	vec2 _212 = _210 * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 _213 = texcoord + _212;
	vec4 _214 = texture(V_xReShade_xBackBuffer, _213);
	vec3 _216 = bloom_sum2 + _214.xyz;
	bloom_sum2 = _216;
	vec3 _218 = bloom_sum2 * vec3(9.99999978e-03, 9.99999978e-03, 9.99999978e-03);
	bloom_sum2 = _218;
	float _219 = V_xradius2 - V_xradius1;
	float dist = _219;
	vec3 _221 = bloom_sum2 - bloom_sum1;
	vec3 _222 = color + _221;
	vec3 _224 = _222 * vec3(dist);
	vec3 HDR = _224;
	vec3 _226 = HDR + color;
	vec3 blend = _226;
	vec3 _228 = abs(blend);
	float _229 = abs(V_xHDRPower);
	vec3 _231 = pow(_228, vec3(_229));
	vec3 _232 = _231 + HDR;
	color = _232;
	vec3 _233 = clamp(color, 0.0, 1.0);
	return _233;
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
#ifdef E_xHDRPass
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xHDRPass(vpos, texcoord);
	return;
}
#endif
