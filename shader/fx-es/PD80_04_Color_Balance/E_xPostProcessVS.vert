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
vec2 compCond(bvec2 cond, vec2 a, vec2 b) { return vec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
vec3 compCond(bvec3 cond, vec3 a, vec3 b) { return vec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
vec4 compCond(bvec4 cond, vec4 a, vec4 b) { return vec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
bvec2 compCond(bvec2 cond, bvec2 a, bvec2 b) { return bvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
bvec3 compCond(bvec3 cond, bvec3 a, bvec3 b) { return bvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
bvec4 compCond(bvec4 cond, bvec4 a, bvec4 b) { return bvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
ivec2 compCond(bvec2 cond, ivec2 a, ivec2 b) { return ivec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
ivec3 compCond(bvec3 cond, ivec3 a, ivec3 b) { return ivec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
ivec4 compCond(bvec4 cond, ivec4 a, ivec4 b) { return ivec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uvec2 compCond(bvec2 cond, uvec2 a, uvec2 b) { return uvec2(cond.x ? a.x : b.x, cond.y ? a.y : b.y); }
uvec3 compCond(bvec3 cond, uvec3 a, uvec3 b) { return uvec3(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z); }
uvec4 compCond(bvec4 cond, uvec4 a, uvec4 b) { return uvec4(cond.x ? a.x : b.x, cond.y ? a.y : b.y, cond.z ? a.z : b.z, cond.w ? a.w : b.w); }
uniform bool V_xpd80_colorbalance_xpreserve_luma;
uniform int V_xpd80_colorbalance_xseparation_mode;
uniform float V_xpd80_colorbalance_xs_RedShift;
uniform float V_xpd80_colorbalance_xs_GreenShift;
uniform float V_xpd80_colorbalance_xs_BlueShift;
uniform float V_xpd80_colorbalance_xm_RedShift;
uniform float V_xpd80_colorbalance_xm_GreenShift;
uniform float V_xpd80_colorbalance_xm_BlueShift;
uniform float V_xpd80_colorbalance_xh_RedShift;
uniform float V_xpd80_colorbalance_xh_GreenShift;
uniform float V_xpd80_colorbalance_xh_BlueShift;

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
vec3 F_xpd80_colorbalance_xcurve(
	in vec3 x)
{
	vec3 _75 = x * x;
	vec3 _77 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * x;
	vec3 _79 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) - _77;
	vec3 _80 = _75 * _79;
	return _80;
}
vec3 F_xpd80_colorbalance_xColorBalance(
	in vec3 c,
	in vec3 shadows,
	in vec3 midtones,
	in vec3 highlights)
{
	float _89 = dot(c.xyz, vec3(3.33332986e-01, 3.33333999e-01, 3.33332986e-01));
	float luma = _89;
	vec3 dist_s = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 dist_h = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	switch (V_xpd80_colorbalance_xseparation_mode)
	{
	case 0: {
		vec3 _99 = c.xyz * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec3 _101 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _99;
		vec3 _103 = max(_101, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec3 _104;
		_104 = _103;
		vec3 _105 = F_xpd80_colorbalance_xcurve(_104);
		dist_s.xyz = _105;
		vec3 _108 = c.xyz - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		vec3 _110 = _108 * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec3 _112 = max(_110, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec3 _113;
		_113 = _112;
		vec3 _114 = F_xpd80_colorbalance_xcurve(_113);
		dist_h.xyz = _114;
		break;
	}
	case 1: {
		vec3 _118 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c.xyz;
		vec3 _120 = pow(_118, vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00));
		dist_s.xyz = _120;
		vec3 _123 = pow(c.xyz, vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00));
		dist_h.xyz = _123;
		break;
	}
	}
	vec3 s_rgb = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 m_rgb = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec3 h_rgb = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	if (V_xpd80_colorbalance_xpreserve_luma)
	{
		bvec3 _134 = greaterThan(shadows, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec3 _136 = vec3(7.00999975e-01, 4.12999988e-01, 8.85999978e-01) * shadows;
		float _139 = dot(vec2(4.12999988e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _142 = dot(vec2(7.00999975e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _145 = dot(vec2(7.00999975e-01, 4.12999988e-01), vec2(5.00000000e-01, 5.00000000e-01));
		vec3 _146 = vec3(_139, _142, _145);
		vec3 _147 = abs(shadows);
		vec3 _148 = _146 * _147;
		vec3 _149 = compCond(_134, _136, _148);
		s_rgb = _149;
		bvec3 _151 = greaterThan(midtones, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec3 _153 = vec3(7.00999975e-01, 4.12999988e-01, 8.85999978e-01) * midtones;
		float _156 = dot(vec2(4.12999988e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _159 = dot(vec2(7.00999975e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _162 = dot(vec2(7.00999975e-01, 4.12999988e-01), vec2(5.00000000e-01, 5.00000000e-01));
		vec3 _163 = vec3(_156, _159, _162);
		vec3 _164 = abs(midtones);
		vec3 _165 = _163 * _164;
		vec3 _166 = compCond(_151, _153, _165);
		m_rgb = _166;
		bvec3 _168 = greaterThan(highlights, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
		vec3 _170 = vec3(7.00999975e-01, 4.12999988e-01, 8.85999978e-01) * highlights;
		float _173 = dot(vec2(4.12999988e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _176 = dot(vec2(7.00999975e-01, 8.85999978e-01), vec2(5.00000000e-01, 5.00000000e-01));
		float _179 = dot(vec2(7.00999975e-01, 4.12999988e-01), vec2(5.00000000e-01, 5.00000000e-01));
		vec3 _180 = vec3(_173, _176, _179);
		vec3 _181 = abs(highlights);
		vec3 _182 = _180 * _181;
		vec3 _183 = compCond(_168, _170, _182);
		h_rgb = _183;
	}
	vec3 _186 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - dist_s.xyz;
	vec3 _188 = _186 - dist_h.xyz;
	vec3 _189 = clamp(_188, 0.0, 1.0);
	vec3 mids = _189;
	vec3 _193 = highlights.xyz * h_rgb.xyz;
	float _195 = 1.00000000e+00 - luma;
	vec3 _197 = _193 * vec3(_195);
	vec3 _199 = dist_h.xyz * _197;
	vec3 highs = _199;
	vec3 _203 = dist_s.xyz * shadows.xyz;
	vec3 _205 = _203 * s_rgb.xyz;
	vec3 _208 = mids.xyz * midtones.xyz;
	vec3 _210 = _208 * m_rgb.xyz;
	vec3 _211 = _205 + _210;
	vec3 _213 = c.xyz * _211;
	vec3 _216 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - c.xyz;
	vec3 _217 = _213 * _216;
	vec3 _219 = _217 + highs.xyz;
	vec3 newc = _219;
	vec3 _223 = c.xyz + newc.xyz;
	vec3 _224 = clamp(_223, 0.0, 1.0);
	return _224;
}
vec4 F_xpd80_colorbalance_xPS_ColorBalance(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _229 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color = _229;
	vec3 _232 = clamp(color.xyz, 0.0, 1.0);
	color.xyz = _232;
	vec3 _233 = vec3(V_xpd80_colorbalance_xs_RedShift, V_xpd80_colorbalance_xs_GreenShift, V_xpd80_colorbalance_xs_BlueShift);
	vec3 _234 = vec3(V_xpd80_colorbalance_xm_RedShift, V_xpd80_colorbalance_xm_GreenShift, V_xpd80_colorbalance_xm_BlueShift);
	vec3 _235 = vec3(V_xpd80_colorbalance_xh_RedShift, V_xpd80_colorbalance_xh_GreenShift, V_xpd80_colorbalance_xh_BlueShift);
	vec3 _236;
	vec3 _237;
	vec3 _238;
	vec3 _239;
	_236 = color.xyz;
	_237 = _233;
	_238 = _234;
	_239 = _235;
	vec3 _241 = F_xpd80_colorbalance_xColorBalance(_236, _237, _238, _239);
	color.xyz = _241;
	vec4 _246 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _246;
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
#ifdef E_xpd80_colorbalance_xPS_ColorBalance
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_colorbalance_xPS_ColorBalance(pos, texcoord);
	return;
}
#endif
