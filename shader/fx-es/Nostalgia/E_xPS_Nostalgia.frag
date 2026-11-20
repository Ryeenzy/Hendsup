#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Nostalgia
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
uniform int V_xNostalgia_scanlines;
uniform int V_xNostalgia_color_reduction;
uniform bool V_xNostalgia_dither;
uniform int V_xNostalgia_palette;
uniform vec3 V_xNostalgia_color_0;
uniform vec3 V_xNostalgia_color_1;
uniform vec3 V_xNostalgia_color_2;
uniform vec3 V_xNostalgia_color_3;
uniform vec3 V_xNostalgia_color_4;
uniform vec3 V_xNostalgia_color_5;
uniform vec3 V_xNostalgia_color_6;
uniform vec3 V_xNostalgia_color_7;
uniform vec3 V_xNostalgia_color_8;
uniform vec3 V_xNostalgia_color_9;
uniform vec3 V_xNostalgia_color_10;
uniform vec3 V_xNostalgia_color_11;
uniform vec3 V_xNostalgia_color_12;
uniform vec3 V_xNostalgia_color_13;
uniform vec3 V_xNostalgia_color_14;
uniform vec3 V_xNostalgia_color_15;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xLinear;
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
vec3 F_xPS_Nostalgia(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec3 color = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int colorCount = 16;
	vec4 _91 = texture(V_xLinear, texcoord.xy);
	color = _91.xyz;
	if (bool(V_xNostalgia_color_reduction))
	{
		vec3 _97[16] = vec3[16](V_xNostalgia_color_0, V_xNostalgia_color_1, V_xNostalgia_color_2, V_xNostalgia_color_3, V_xNostalgia_color_4, V_xNostalgia_color_5, V_xNostalgia_color_6, V_xNostalgia_color_7, V_xNostalgia_color_8, V_xNostalgia_color_9, V_xNostalgia_color_10, V_xNostalgia_color_11, V_xNostalgia_color_12, V_xNostalgia_color_13, V_xNostalgia_color_14, V_xNostalgia_color_15);
		vec3 palette[16] = _97;
		bool _103 = V_xNostalgia_palette == 1;
		if (_103)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(5.33333361e-01, 0.00000000e+00, 0.00000000e+00);
			palette[3] = vec3(6.66666687e-01, 1.00000000e+00, 9.33333337e-01);
			palette[4] = vec3(8.00000012e-01, 2.66666681e-01, 8.00000012e-01);
			palette[5] = vec3(0.00000000e+00, 8.00000012e-01, 3.33333343e-01);
			palette[6] = vec3(0.00000000e+00, 0.00000000e+00, 6.66666687e-01);
			palette[7] = vec3(9.33333337e-01, 9.33333337e-01, 4.66666669e-01);
			palette[8] = vec3(8.66666675e-01, 5.33333361e-01, 3.33333343e-01);
			palette[9] = vec3(4.00000006e-01, 2.66666681e-01, 0.00000000e+00);
			palette[10] = vec3(1.00000000e+00, 4.66666669e-01, 4.66666669e-01);
			palette[11] = vec3(2.00000003e-01, 2.00000003e-01, 2.00000003e-01);
			palette[12] = vec3(4.66666669e-01, 4.66666669e-01, 4.66666669e-01);
			palette[13] = vec3(6.66666687e-01, 1.00000000e+00, 4.00000006e-01);
			palette[14] = vec3(0.00000000e+00, 5.33333361e-01, 1.00000000e+00);
			palette[15] = vec3(7.33333349e-01, 7.33333349e-01, 7.33333349e-01);
		}
		bool _124 = V_xNostalgia_palette == 2;
		if (_124)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(0.00000000e+00, 0.00000000e+00, 6.66666985e-01);
			palette[2] = vec3(0.00000000e+00, 6.66666985e-01, 0.00000000e+00);
			palette[3] = vec3(0.00000000e+00, 6.66666985e-01, 6.66666985e-01);
			palette[4] = vec3(6.66666985e-01, 0.00000000e+00, 0.00000000e+00);
			palette[5] = vec3(6.66666985e-01, 0.00000000e+00, 6.66666985e-01);
			palette[6] = vec3(6.66666985e-01, 3.33332986e-01, 0.00000000e+00);
			palette[7] = vec3(6.66666985e-01, 6.66666985e-01, 6.66666985e-01);
			palette[8] = vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01);
			palette[9] = vec3(3.33332986e-01, 3.33332986e-01, 1.00000000e+00);
			palette[10] = vec3(3.33332986e-01, 1.00000000e+00, 3.33332986e-01);
			palette[11] = vec3(3.33332986e-01, 1.00000000e+00, 1.00000000e+00);
			palette[12] = vec3(1.00000000e+00, 3.33332986e-01, 3.33332986e-01);
			palette[13] = vec3(1.00000000e+00, 3.33332986e-01, 1.00000000e+00);
			palette[14] = vec3(1.00000000e+00, 1.00000000e+00, 3.33332986e-01);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		bool _145 = V_xNostalgia_palette == 3;
		if (_145)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(0.00000000e+00, 0.00000000e+00, 8.00000012e-01);
			palette[2] = vec3(0.00000000e+00, 6.00000024e-01, 0.00000000e+00);
			palette[3] = vec3(0.00000000e+00, 6.00000024e-01, 8.00000012e-01);
			palette[4] = vec3(8.00000012e-01, 0.00000000e+00, 0.00000000e+00);
			palette[5] = vec3(8.00000012e-01, 0.00000000e+00, 8.00000012e-01);
			palette[6] = vec3(8.00000012e-01, 6.00000024e-01, 0.00000000e+00);
			palette[7] = vec3(8.00000012e-01, 8.00000012e-01, 8.00000012e-01);
			palette[8] = vec3(4.00000006e-01, 4.00000006e-01, 4.00000006e-01);
			palette[9] = vec3(4.00000006e-01, 4.00000006e-01, 1.00000000e+00);
			palette[10] = vec3(4.00000006e-01, 1.00000000e+00, 4.00000006e-01);
			palette[11] = vec3(4.00000006e-01, 1.00000000e+00, 1.00000000e+00);
			palette[12] = vec3(9.90000010e-01, 4.00000006e-01, 4.00000006e-01);
			palette[13] = vec3(1.00000000e+00, 4.00000006e-01, 1.00000000e+00);
			palette[14] = vec3(1.00000000e+00, 1.00000000e+00, 4.00000006e-01);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		bool _166 = V_xNostalgia_palette == 4;
		if (_166)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(0.00000000e+00, 0.00000000e+00, 8.11764717e-01);
			palette[2] = vec3(0.00000000e+00, 8.11764717e-01, 0.00000000e+00);
			palette[3] = vec3(0.00000000e+00, 8.11764717e-01, 8.11764717e-01);
			palette[4] = vec3(8.11764717e-01, 0.00000000e+00, 0.00000000e+00);
			palette[5] = vec3(8.11764717e-01, 0.00000000e+00, 7.52941191e-01);
			palette[6] = vec3(8.11764717e-01, 8.11764717e-01, 0.00000000e+00);
			palette[7] = vec3(8.11764717e-01, 8.11764717e-01, 8.11764717e-01);
			palette[8] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[9] = vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
			palette[10] = vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00);
			palette[11] = vec3(0.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[12] = vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[13] = vec3(1.00000000e+00, 0.00000000e+00, 1.00000000e+00);
			palette[14] = vec3(1.00000000e+00, 1.00000000e+00, 0.00000000e+00);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		bool _187 = V_xNostalgia_palette == 5;
		if (_187)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(8.90196085e-01, 1.17647059e-01, 3.76470596e-01);
			palette[2] = vec3(3.76470596e-01, 3.05882365e-01, 7.41176486e-01);
			palette[3] = vec3(1.00000000e+00, 2.66666681e-01, 9.92156863e-01);
			palette[4] = vec3(0.00000000e+00, 6.39215708e-01, 3.76470596e-01);
			palette[5] = vec3(6.11764729e-01, 6.11764729e-01, 6.11764729e-01);
			palette[6] = vec3(7.84313753e-02, 8.11764717e-01, 9.92156863e-01);
			palette[7] = vec3(8.15686285e-01, 7.64705896e-01, 1.00000000e+00);
			palette[8] = vec3(3.76470596e-01, 4.47058827e-01, 1.17647061e-02);
			palette[9] = vec3(1.00000000e+00, 4.15686280e-01, 2.35294119e-01);
			palette[10] = vec3(6.11764729e-01, 6.11764729e-01, 6.11764729e-01);
			palette[11] = vec3(1.00000000e+00, 6.27451003e-01, 8.15686285e-01);
			palette[12] = vec3(7.84313753e-02, 9.60784316e-01, 2.35294119e-01);
			palette[13] = vec3(8.15686285e-01, 8.66666675e-01, 5.52941203e-01);
			palette[14] = vec3(4.47058827e-01, 1.00000000e+00, 8.15686285e-01);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		}
		bool _208 = V_xNostalgia_palette == 6;
		if (_208)
		{
			palette[0] = vec3(8.31372559e-01, 8.31372559e-01, 8.31372559e-01);
			palette[1] = vec3(8.66666675e-01, 7.76470602e-01, 4.74509805e-01);
			palette[2] = vec3(3.92156877e-02, 9.60784316e-01, 7.76470602e-01);
			palette[3] = vec3(4.70588244e-02, 9.17647064e-01, 3.80392164e-01);
			palette[4] = vec3(1.00000000e+00, 1.56862751e-01, 7.09803939e-01);
			palette[5] = vec3(1.00000000e+00, 1.09803922e-01, 2.98039228e-01);
			palette[6] = vec3(1.49019614e-01, 2.54901975e-01, 6.07843161e-01);
			palette[7] = vec3(0.00000000e+00, 8.78431380e-01, 9.05882359e-01);
			palette[8] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[9] = vec3(1.00000000e+00, 3.17647070e-01, 1.00000000e+00);
			palette[10] = vec3(1.60784319e-01, 1.60784319e-01, 1.60784319e-01);
			palette[11] = vec3(1.60784319e-01, 1.60784319e-01, 1.60784319e-01);
			palette[12] = vec3(1.60784319e-01, 1.60784319e-01, 1.60784319e-01);
			palette[13] = vec3(8.31372559e-01, 8.31372559e-01, 8.31372559e-01);
			palette[14] = vec3(8.66666675e-01, 7.76470602e-01, 4.74509805e-01);
			palette[15] = vec3(3.92156877e-02, 9.60784316e-01, 7.76470602e-01);
		}
		bool _229 = V_xNostalgia_palette == 7;
		if (_229)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(4.70588237e-01, 1.60784319e-01, 1.33333340e-01);
			palette[3] = vec3(5.29411793e-01, 8.39215696e-01, 8.66666675e-01);
			palette[4] = vec3(6.66666687e-01, 3.72549027e-01, 7.13725507e-01);
			palette[5] = vec3(1.01960786e-01, 5.09803951e-01, 1.49019614e-01);
			palette[6] = vec3(2.50980407e-01, 1.92156866e-01, 5.52941203e-01);
			palette[7] = vec3(7.49019623e-01, 8.07843149e-01, 4.47058827e-01);
			palette[8] = vec3(6.66666687e-01, 4.54901963e-01, 2.86274523e-01);
			palette[9] = vec3(9.17647064e-01, 7.05882370e-01, 5.37254930e-01);
			palette[10] = vec3(7.21568644e-01, 4.11764711e-01, 3.84313732e-01);
			palette[11] = vec3(7.80392170e-01, 1.00000000e+00, 1.00000000e+00);
			palette[12] = vec3(9.17647064e-01, 6.23529434e-01, 9.64705884e-01);
			palette[13] = vec3(5.80392182e-01, 8.78431380e-01, 5.37254930e-01);
			palette[14] = vec3(5.01960814e-01, 4.43137258e-01, 8.00000012e-01);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 6.98039234e-01);
		}
		bool _250 = V_xNostalgia_palette == 8;
		if (_250)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(2.43137255e-01, 7.21568644e-01, 2.86274523e-01);
			palette[3] = vec3(4.54901963e-01, 8.15686285e-01, 4.90196079e-01);
			palette[4] = vec3(3.49019617e-01, 3.33333343e-01, 8.78431380e-01);
			palette[5] = vec3(5.01960814e-01, 4.62745100e-01, 9.45098042e-01);
			palette[6] = vec3(7.25490212e-01, 3.68627459e-01, 3.17647070e-01);
			palette[7] = vec3(3.96078438e-01, 8.58823538e-01, 9.37254906e-01);
			palette[8] = vec3(8.58823538e-01, 3.96078438e-01, 3.49019617e-01);
			palette[9] = vec3(1.00000000e+00, 5.37254930e-01, 4.90196079e-01);
			palette[10] = vec3(8.00000012e-01, 7.64705896e-01, 3.68627459e-01);
			palette[11] = vec3(8.70588243e-01, 8.15686285e-01, 5.29411793e-01);
			palette[12] = vec3(2.27450982e-01, 6.35294139e-01, 2.54901975e-01);
			palette[13] = vec3(7.17647076e-01, 4.00000006e-01, 7.09803939e-01);
			palette[14] = vec3(8.00000012e-01, 8.00000012e-01, 8.00000012e-01);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 6.98039234e-01);
		}
		bool _271 = V_xNostalgia_palette == 9;
		if (_271)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[3] = vec3(0.00000000e+00, 1.00000000e+00, 0.00000000e+00);
			palette[4] = vec3(1.00000000e+00, 1.00000000e+00, 0.00000000e+00);
			palette[5] = vec3(0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
			palette[6] = vec3(1.00000000e+00, 0.00000000e+00, 1.00000000e+00);
			palette[7] = vec3(0.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[8] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[9] = vec3(7.33333349e-01, 7.33333349e-01, 7.33333349e-01);
			palette[10] = vec3(8.66666675e-01, 4.66666669e-01, 4.66666669e-01);
			palette[11] = vec3(4.66666669e-01, 8.66666675e-01, 4.66666669e-01);
			palette[12] = vec3(8.66666675e-01, 8.66666675e-01, 4.66666669e-01);
			palette[13] = vec3(4.66666669e-01, 4.66666669e-01, 8.66666675e-01);
			palette[14] = vec3(8.66666675e-01, 4.66666669e-01, 9.33333337e-01);
			palette[15] = vec3(7.33333349e-01, 1.00000000e+00, 1.00000000e+00);
		}
		bool _292 = V_xNostalgia_palette == 10;
		if (_292)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(0.00000000e+00, 0.00000000e+00, 4.98039216e-01);
			palette[3] = vec3(4.98039216e-01, 0.00000000e+00, 0.00000000e+00);
			palette[4] = vec3(4.98039216e-01, 0.00000000e+00, 4.98039216e-01);
			palette[5] = vec3(0.00000000e+00, 4.98039216e-01, 0.00000000e+00);
			palette[6] = vec3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[7] = vec3(0.00000000e+00, 4.98039216e-01, 4.98039216e-01);
			palette[8] = vec3(4.98039216e-01, 4.98039216e-01, 0.00000000e+00);
			palette[9] = vec3(4.98039216e-01, 4.98039216e-01, 4.98039216e-01);
			palette[10] = vec3(4.98039216e-01, 4.98039216e-01, 1.00000000e+00);
			palette[11] = vec3(1.00000000e+00, 4.98039216e-01, 0.00000000e+00);
			palette[12] = vec3(1.00000000e+00, 4.98039216e-01, 4.98039216e-01);
			palette[13] = vec3(4.98039216e-01, 1.00000000e+00, 4.98039216e-01);
			palette[14] = vec3(4.98039216e-01, 1.00000000e+00, 1.00000000e+00);
			palette[15] = vec3(1.00000000e+00, 1.00000000e+00, 4.98039216e-01);
		}
		bool _313 = V_xNostalgia_palette == 11;
		if (_313)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 8.86274517e-01, 8.82352948e-01);
			palette[2] = vec3(3.76470596e-01, 3.92156877e-02, 1.17647061e-02);
			palette[3] = vec3(8.11764717e-01, 1.33333340e-01, 5.49019612e-02);
			palette[4] = vec3(1.60784319e-01, 3.45098048e-01, 3.52941193e-02);
			palette[5] = vec3(9.37254906e-01, 1.60784319e-01, 7.05882385e-02);
			palette[6] = vec3(3.56862754e-01, 3.49019617e-01, 4.31372561e-02);
			palette[7] = vec3(3.52941185e-01, 3.52941185e-01, 3.52941185e-01);
			palette[8] = vec3(8.03921580e-01, 3.72549027e-01, 2.07843140e-01);
			palette[9] = vec3(4.94117647e-01, 5.09803951e-01, 7.56862760e-01);
			palette[10] = vec3(3.05882365e-01, 6.23529434e-01, 9.80392173e-02);
			palette[11] = vec3(7.92156875e-01, 5.09803951e-01, 3.64705890e-01);
			palette[12] = vec3(1.00000000e+00, 3.92156869e-01, 2.15686277e-01);
			palette[13] = vec3(1.00000000e+00, 5.25490224e-01, 3.68627459e-01);
			palette[14] = vec3(6.31372571e-01, 6.39215708e-01, 7.60784328e-01);
			palette[15] = vec3(1.00000000e+00, 7.68627465e-01, 5.17647088e-01);
		}
		bool _334 = V_xNostalgia_palette == 12;
		if (_334)
		{
			palette[0] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[1] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[2] = vec3(4.94117647e-01, 9.80392173e-02, 1.64705887e-01);
			palette[3] = vec3(7.64705896e-01, 0.00000000e+00, 1.05882354e-01);
			palette[4] = vec3(7.25490212e-01, 6.94117665e-01, 3.37254912e-01);
			palette[5] = vec3(7.84313738e-01, 7.25490212e-01, 2.74509806e-02);
			palette[6] = vec3(2.31372550e-01, 5.92156887e-01, 1.80392161e-01);
			palette[7] = vec3(2.74509806e-02, 7.49019623e-01, 0.00000000e+00);
			palette[8] = vec3(2.50980407e-01, 6.50980413e-01, 5.84313750e-01);
			palette[9] = vec3(0.00000000e+00, 7.76470602e-01, 6.43137276e-01);
			palette[10] = vec3(7.49019623e-01, 7.49019623e-01, 7.49019623e-01);
			palette[11] = vec3(5.13725519e-01, 1.52941182e-01, 5.64705908e-01);
			palette[12] = vec3(7.17647076e-01, 0.00000000e+00, 8.19607854e-01);
			palette[13] = vec3(1.96078438e-02, 5.09803928e-02, 4.07843143e-01);
			colorCount = 14;
		}
		bool _354 = V_xNostalgia_palette == 13;
		if (_354)
		{
			palette[0] = vec3(5.88235296e-02, 2.19607845e-01, 5.88235296e-02);
			palette[1] = vec3(6.07843161e-01, 7.37254918e-01, 5.88235296e-02);
			palette[2] = vec3(1.88235298e-01, 3.84313732e-01, 1.88235298e-01);
			palette[3] = vec3(5.45098066e-01, 6.74509823e-01, 5.88235296e-02);
			colorCount = 4;
		}
		bool _364 = V_xNostalgia_palette == 14;
		if (_364)
		{
			palette[0] = vec3(2.47059003e-01, 1.96078002e-01, 6.82353020e-01);
			palette[1] = vec3(8.90196025e-01, 5.49019985e-02, 7.60783970e-01);
			palette[2] = vec3(7.29412019e-01, 6.66666985e-01, 1.00000000e+00);
			palette[3] = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			palette[4] = vec3(1.00000000e+00, 5.80392003e-01, 6.15685999e-01);
			palette[5] = vec3(9.09803987e-01, 7.84299988e-03, 0.00000000e+00);
			palette[6] = vec3(4.78430986e-01, 1.41176000e-01, 2.39216000e-01);
			palette[7] = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			palette[8] = vec3(9.80390012e-02, 3.37255001e-01, 2.82353014e-01);
			palette[9] = vec3(4.15686011e-01, 5.37254989e-01, 1.52941003e-01);
			palette[10] = vec3(8.62749964e-02, 9.29412007e-01, 4.58824009e-01);
			palette[11] = vec3(1.96078002e-01, 7.56862998e-01, 7.64706016e-01);
			palette[12] = vec3(1.96080003e-02, 4.98039007e-01, 7.56862998e-01);
			palette[13] = vec3(4.31373000e-01, 3.05882007e-01, 1.37254998e-01);
			palette[14] = vec3(9.37255025e-01, 8.90196025e-01, 1.96080003e-02);
			palette[15] = vec3(7.88235009e-01, 5.60783982e-01, 2.98038989e-01);
		}
		bool _386 = int(V_xNostalgia_dither) == 1;
		if (_386)
		{
			float _388 = dot(texcoord, vec2(9.60000000e+02, 5.40000000e+02));
			float _390 = _388 + 2.50000000e-01;
			float _391 = fract(_390);
			float grid_position = _391;
			float _395 = pow(2.00000000e+00, 2.00000000e+00);
			float _397 = _395 - 1.00000000e+00;
			float _399 = 1.00000000e+00 / _397;
			float _401 = 2.50000000e-01 * _399;
			float dither_shift = _401;
			vec3 _403 = vec3(dither_shift, dither_shift, dither_shift);
			vec3 dither_shift_RGB = _403;
			vec3 _406 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * dither_shift_RGB;
			vec3 _408 = vec3(-2.00000000e+00, -2.00000000e+00, -2.00000000e+00) * dither_shift_RGB;
			vec3 _410 = mix(_406, _408, vec3(grid_position));
			dither_shift_RGB = _410;
			vec3 _412 = color.xyz + dither_shift_RGB;
			color.xyz = _412;
		}
		vec3 _414 = color - palette[0];
		vec3 diff = _414;
		float _416 = dot(diff, diff);
		float dist = _416;
		float closest_dist = dist;
		vec3 closest_color = palette[0];
		int i = 1;
		while (i < colorCount)
		{
			{
				vec3 _433 = color - palette[int(i)];
				diff = _433;
				float _434 = dot(diff, diff);
				dist = _434;
				bool _438 = dist < closest_dist;
				if (_438)
				{
					closest_dist = dist;
					closest_color = palette[int(i)];
				}
			}
			int _430 = i;
			int _431 = _430 + 1;
			i = _431;
		}
		color = closest_color;
	}
	bool _444 = V_xNostalgia_scanlines == 1;
	if (_444)
	{
		float _447 = texcoord.y * 5.40000000e+02;
		float _448 = fract(_447);
		float _450 = _448 + 5.00000000e-01;
		vec3 _452 = color * vec3(_450);
		color = _452;
	}
	bool _457 = V_xNostalgia_scanlines == 2;
	if (_457)
	{
		float _459 = dot(color, vec3(3.33333343e-01, 3.33333343e-01, 3.33333343e-01));
		float grey = _459;
		float _463 = texcoord.y * 5.40000000e+02;
		float _464 = fract(_463);
		bool _466 = _464 < 2.50000000e-01;
		float _467 = -(grey);
		float _468 = _467 * grey;
		float _469 = _468 + grey;
		float _470 = _469 + grey;
		float _472 = _470 * 5.00000000e-01;
		float _474 = _472 + 5.00000000e-01;
		vec3 _476 = color * vec3(_474);
		vec3 _478 = compCond(bvec3(_466), color, _476);
		color = _478;
	}
	return color;
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
#ifdef E_xPS_Nostalgia
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Nostalgia(vpos, texcoord);
	return;
}
#endif
