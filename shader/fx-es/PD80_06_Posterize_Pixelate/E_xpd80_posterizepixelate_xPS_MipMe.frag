#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_posterizepixelate_xPS_MipMe
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
uniform vec2 V_xpp;
uniform int V_xpd80_posterizepixelate_xnumber_of_levels;
uniform int V_xpd80_posterizepixelate_xpixel_size;
uniform float V_xpd80_posterizepixelate_xeffect_strength;
uniform float V_xpd80_posterizepixelate_xborder_str;
uniform bool V_xpd80_posterizepixelate_xenable_dither;
uniform bool V_xpd80_posterizepixelate_xdither_motion;
uniform float V_xpd80_posterizepixelate_xdither_strength;
uniform vec2 V_xpd80_posterizepixelate_xpingpong;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xsamplerNoise;
uniform sampler2D V_xsamplerRGBNoise;
uniform sampler2D V_xsamplerGaussNoise;
uniform sampler2D V_xpd80_posterizepixelate_xsamplerMipMe;
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
vec4 F_xdither(
	in sampler2D tex,
	in vec2 coords,
	in int var,
	in bool enabler,
	in float str,
	in bool motion,
	in float swing)
{
	vec2 _79 = coords.xy * vec2(3.75000000e+00, 2.10937500e+00);
	coords.xy = _79;
	vec4 _81 = texture(tex, coords.xy);
	vec4 noise = _81;
	float _85 = V_xpp.x + float(var);
	float _87 = motion ? _85 : 0.00000000e+00;
	float mot = _87;
	float _90 = 6.18034005e-01 * mot;
	vec4 _92 = noise + vec4(_90);
	vec4 _93 = fract(_92);
	noise = _93;
	vec4 _95 = noise * vec4(2.00000000e+00, 2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec4 _97 = _95 - vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	vec4 _99 = _97 * vec4(swing);
	noise = _99;
	float _101 = str / 2.55000000e+02;
	vec4 _103 = noise * vec4(_101);
	vec4 _106 = compCond(bvec4(enabler), _103, vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	return _106;
}
vec4 F_xpd80_posterizepixelate_xPS_MipMe(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _121 = texture(V_xReShade_xBackBuffer, texcoord);
	return _121;
}
vec4 F_xpd80_posterizepixelate_xPS_Posterize(
	in vec4 pos,
	in vec2 texcoord)
{
	int _127 = V_xpd80_posterizepixelate_xpixel_size - 1;
	vec4 _132 = vec4(texcoord.xy.x, texcoord.xy.y, 0.00000000e+00, float(_127));
	vec4 _133 = textureLod(V_xpd80_posterizepixelate_xsamplerMipMe, _132.xy, _132.w);
	vec3 color = _133.xyz;
	int _137 = V_xpd80_posterizepixelate_xpixel_size - 1;
	float _139 = exp2(float(_137));
	float _exp = _139;
	float _141 = 1.0 / _exp;
	float _143 = _141 - 9.99999975e-06;
	float _145 = max(_143, 0.00000000e+00);
	float rcp_exp = _145;
	float _148 = 1.92000000e+03 / _exp;
	float _149 = floor(_148);
	float _151 = 1.08000000e+03 / _exp;
	float _152 = floor(_151);
	vec2 _153 = vec2(_149, _152);
	vec2 bwbh = _153;
	vec2 _157 = bwbh.xy / vec2(5.12000000e+02, 5.12000000e+02);
	vec2 tx = _157;
	vec2 _161 = tx.xy * texcoord.xy;
	tx.xy = _161;
	vec4 _162 = texture(V_xsamplerRGBNoise, tx);
	vec3 dnoise = _162.xyz;
	float _167 = V_xpd80_posterizepixelate_xpingpong.x + 9.00000000e+00;
	float _169 = V_xpd80_posterizepixelate_xdither_motion ? _167 : 1.00000000e+00;
	float mot_170 = _169;
	float _172 = 6.18034005e-01 * mot_170;
	vec3 _174 = dnoise + vec3(_172);
	vec3 _175 = fract(_174);
	dnoise.xyz = _175;
	vec3 _177 = dnoise * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
	vec3 _179 = _177 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
	dnoise.xyz = _179;
	float _181 = V_xpd80_posterizepixelate_xdither_strength / float(V_xpd80_posterizepixelate_xnumber_of_levels);
	vec3 _184 = dnoise.xyz * vec3(_181);
	vec3 _186 = color.xyz + _184;
	vec3 _187 = clamp(_186, 0.0, 1.0);
	vec3 _190 = compCond(bvec3(V_xpd80_posterizepixelate_xenable_dither), _187, color.xyz);
	color.xyz = _190;
	vec3 orig = color.xyz;
	vec3 _195 = color.xyz * vec3(ivec3(V_xpd80_posterizepixelate_xnumber_of_levels));
	vec3 _196 = floor(_195);
	int _198 = V_xpd80_posterizepixelate_xnumber_of_levels - 1;
	vec3 _200 = _196 / vec3(ivec3(_198));
	color.xyz = _200;
	vec2 _203 = texcoord.xy * bwbh.xy;
	vec2 _204 = fract(_203);
	vec2 uv = _204;
	bool _207 = uv.x <= rcp_exp;
	float _210 = _207 ? 1.00000000e+00 : 0.00000000e+00;
	float grade = _210;
	bool _213 = uv.y <= rcp_exp;
	float _216 = _213 ? 1.00000000e+00 : 0.00000000e+00;
	float _217 = grade + _216;
	grade = _217;
	int _219 = V_xpd80_posterizepixelate_xpixel_size - 1;
	float _221 = clamp(float(_219), 0.0, 1.0);
	float _222 = V_xpd80_posterizepixelate_xborder_str * _221;
	vec3 _226 = mix(color.xyz, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), vec3(_222));
	float _227 = clamp(grade, 0.0, 1.0);
	vec3 _230 = mix(color.xyz, _226, vec3(_227));
	color.xyz = _230;
	vec3 _234 = mix(orig.xyz, color.xyz, vec3(V_xpd80_posterizepixelate_xeffect_strength));
	color.xyz = _234;
	vec4 _239 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _239;
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
#ifdef E_xpd80_posterizepixelate_xPS_MipMe
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_posterizepixelate_xPS_MipMe(pos, texcoord);
	return;
}
#endif
#ifdef E_xpd80_posterizepixelate_xPS_Posterize
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_posterizepixelate_xPS_Posterize(pos, texcoord);
	return;
}
#endif
