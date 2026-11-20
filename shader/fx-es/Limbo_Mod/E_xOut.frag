#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xOut
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
uniform float V_xG_Radius;
uniform float V_xTarget_Lighting;
uniform vec2 V_xDepth_Map_Adjust;
uniform float V_xDither_Bit;
uniform float V_xframetime;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xDepthBuffer;
uniform sampler2D V_xBackBuffer;
uniform sampler2D V_xMipMaps_A;
uniform sampler2D V_xMipMaps_B;
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
float F_xDepthM(
	in vec2 texcoord)
{
	vec2 _77;
	_77 = texcoord;
	float _78 = F_xReShade_xGetLinearizedDepth(_77);
	float zBuffer = _78;
	float _81 = zBuffer - V_xDepth_Map_Adjust.x;
	float _84 = V_xDepth_Map_Adjust.y - V_xDepth_Map_Adjust.x;
	float _85 = _81 / _84;
	zBuffer = _85;
	float DB = V_xDither_Bit;
	vec2 _88 = texcoord * vec2(V_xframetime);
	float _90 = dot(_88, vec2(1.29898005e+01, 7.82330017e+01));
	float _91 = sin(_90);
	float _93 = _91 * 4.37585469e+04;
	float _94 = fract(_93);
	float noise = _94;
	float _97 = pow(2.00000000e+00, DB);
	float _99 = _97 - 1.00000000e+00;
	float _101 = 1.00000000e+00 / _99;
	float dither_shift = _101;
	float _104 = dither_shift * 5.00000000e-01;
	float dither_shift_half = _104;
	float _106 = dither_shift * noise;
	float _107 = _106 - dither_shift_half;
	dither_shift = _107;
	float _108 = -(dither_shift);
	float _109 = zBuffer + _108;
	zBuffer = _109;
	float _110 = zBuffer + dither_shift;
	zBuffer = _110;
	float _111 = -(dither_shift);
	float _112 = zBuffer + _111;
	zBuffer = _112;
	return zBuffer;
}
vec4 F_xBB_M(
	in vec2 TC)
{
	vec4 _116 = texture(V_xBackBuffer, TC);
	return _116;
}
vec4 F_xDirectLighting(
	in vec2 texcoords)
{
	vec2 _120;
	_120 = texcoords;
	vec4 _121 = F_xBB_M(_120);
	vec4 BC = _121;
	float _125 = dot(BC.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float GS = _125;
	float Boost = 1.00000000e+00;
	vec3 _131 = BC.xyz / vec3(GS);
	BC.xyz = _131;
	float _132 = clamp(V_xTarget_Lighting, 0.0, 1.0);
	float _135 = mix(0.00000000e+00, 5.00000000e-01, _132);
	float _136 = GS - _135;
	float _137 = clamp(_136, 0.0, 1.0);
	vec3 _140 = BC.xyz * vec3(_137);
	BC.xyz = _140;
	float _141 = clamp(V_xTarget_Lighting, 0.0, 1.0);
	float _144 = mix(1.00000000e+00, 2.50000000e+00, _141);
	Boost = _144;
	vec3 _147 = BC.xyz * vec3(Boost);
	vec4 _152 = vec4(_147.x, _147.y, _147.z, BC.w);
	return _152;
}
vec4 F_xGussBlur(
	in sampler2D image,
	in vec2 TC,
	in int dir,
	in float Mips)
{
	bool _160 = V_xG_Radius > 0.00000000e+00;
	float _163 = _160 ? 1.96482554e-01 : 1.00000000e+00;
	float W0 = _163;
	float W1 = 2.96906978e-01;
	float W2 = 9.44703966e-02;
	float W3 = 1.03813624e-02;
	float _173 = mix(0.00000000e+00, 5.00000000e+00, V_xG_Radius);
	vec2 _176 = vec2(5.20833360e-04, 9.25925910e-04) * vec2(_173);
	vec2 off0 = _176;
	vec2 _179 = vec2(0.00000000e+00, 1.41176474e+00) * off0;
	vec2 _181 = vec2(1.41176474e+00, 0.00000000e+00) * off0;
	vec2 _183 = compCond(bvec2(ivec2(dir)), _179, _181);
	vec2 off1 = _183;
	vec2 _186 = vec2(0.00000000e+00, 3.29411769e+00) * off0;
	vec2 _188 = vec2(3.29411769e+00, 0.00000000e+00) * off0;
	vec2 _190 = compCond(bvec2(ivec2(dir)), _186, _188);
	vec2 off2 = _190;
	vec2 _193 = vec2(0.00000000e+00, 5.17647076e+00) * off0;
	vec2 _195 = vec2(5.17647076e+00, 0.00000000e+00) * off0;
	vec2 _197 = compCond(bvec2(ivec2(dir)), _193, _195);
	vec2 off3 = _197;
	vec4 _202 = vec4(TC.x, TC.y, 0.00000000e+00, Mips);
	vec4 _203 = textureLod(image, _202.xy, _202.w);
	vec4 _205 = _203 * vec4(W0);
	vec4 color = _205;
	bool _211 = V_xG_Radius > 0.00000000e+00;
	if (_211)
	{
		vec2 _212 = TC + off1;
		vec4 _216 = vec4(_212.x, _212.y, 0.00000000e+00, Mips);
		vec4 _217 = textureLod(image, _216.xy, _216.w);
		vec4 _219 = _217 * vec4(W1);
		vec4 _220 = color + _219;
		color = _220;
		vec2 _221 = TC - off1;
		vec4 _225 = vec4(_221.x, _221.y, 0.00000000e+00, Mips);
		vec4 _226 = textureLod(image, _225.xy, _225.w);
		vec4 _228 = _226 * vec4(W1);
		vec4 _229 = color + _228;
		color = _229;
		vec2 _230 = TC + off2;
		vec4 _234 = vec4(_230.x, _230.y, 0.00000000e+00, Mips);
		vec4 _235 = textureLod(image, _234.xy, _234.w);
		vec4 _237 = _235 * vec4(W2);
		vec4 _238 = color + _237;
		color = _238;
		vec2 _239 = TC - off2;
		vec4 _243 = vec4(_239.x, _239.y, 0.00000000e+00, Mips);
		vec4 _244 = textureLod(image, _243.xy, _243.w);
		vec4 _246 = _244 * vec4(W2);
		vec4 _247 = color + _246;
		color = _247;
		vec2 _248 = TC + off2;
		vec4 _252 = vec4(_248.x, _248.y, 0.00000000e+00, Mips);
		vec4 _253 = textureLod(image, _252.xy, _252.w);
		vec4 _255 = _253 * vec4(W3);
		vec4 _256 = color + _255;
		color = _256;
		vec2 _257 = TC - off2;
		vec4 _261 = vec4(_257.x, _257.y, 0.00000000e+00, Mips);
		vec4 _262 = textureLod(image, _261.xy, _261.w);
		vec4 _264 = _262 * vec4(W3);
		vec4 _265 = color + _264;
		color = _265;
	}
	return color;
}
void F_xBuffers_Mip_A(
	in vec4 position,
	in vec2 texcoord,
	out vec4 MipMapper_A)
{
	vec2 _271;
	_271 = texcoord;
	vec4 _272 = F_xDirectLighting(_271);
	MipMapper_A = _272;
	return;
}
void F_xBuffers_Mip_B(
	in vec4 position,
	in vec2 texcoord,
	out vec4 MipMapper_B)
{
	float _280 = mix(0.00000000e+00, 4.00000000e+00, V_xG_Radius);
	vec2 _281;
	int _282;
	float _283;
	_281 = texcoord;
	_282 = 0;
	_283 = _280;
	vec4 _285 = F_xGussBlur(V_xMipMaps_A, _281, _282, _283);
	MipMapper_B = _285;
	return;
}
vec4 F_xOut(
	in vec4 position,
	in vec2 texcoord)
{
	float _292 = mix(0.00000000e+00, 4.00000000e+00, V_xG_Radius);
	vec2 _293;
	int _294;
	float _295;
	_293 = texcoord;
	_294 = 1;
	_295 = _292;
	vec4 _297 = F_xGussBlur(V_xMipMaps_B, _293, _294, _295);
	float _299 = dot(_297, vec4(3.33000004e-01, 3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	vec4 BWorColor = vec4(_299);
	vec2 _302;
	_302 = texcoord;
	float _303 = F_xDepthM(_302);
	vec4 _308 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _309 = textureLod(V_xMipMaps_A, _308.xy, _308.w);
	float _311 = dot(_309, vec4(3.33000004e-01, 3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	vec4 _313 = vec4(_311) * BWorColor;
	vec4 _315 = vec4(_303) + _313;
	return _315;
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
#ifdef E_xBuffers_Mip_A
in vec2 vv_0;
layout(location = 0) out vec4 _out_MipMapper_A;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 MipMapper_A;
	F_xBuffers_Mip_A(position, texcoord, MipMapper_A);
	_out_MipMapper_A = MipMapper_A;
	return;
}
#endif
#ifdef E_xBuffers_Mip_B
in vec2 vv_0;
layout(location = 0) out vec4 _out_MipMapper_B;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 MipMapper_B;
	F_xBuffers_Mip_B(position, texcoord, MipMapper_B);
	_out_MipMapper_B = MipMapper_B;
	return;
}
#endif
#ifdef E_xOut
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xOut(position, texcoord);
	return;
}
#endif
