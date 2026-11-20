#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xCurvesPass
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
uniform int V_xMode;
uniform int V_xFormula;
uniform float V_xContrast;

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
vec4 F_xCurvesPass(
	in vec4 vpos,
	in vec2 texcoord)
{
	vec4 _68 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 colorInput = _68;
	vec3 lumCoeff = vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02);
	float Contrast_blend = V_xContrast;
	float _74 = dot(lumCoeff, colorInput.xyz);
	float luma = _74;
	vec3 _78 = colorInput.xyz - vec3(luma);
	vec3 chroma = _78;
	vec3 x = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	bool _86 = V_xMode == 0;
	if (_86)
	{
		x = vec3(luma);
	}
	else
	{
		bool _92 = V_xMode == 1;
		if (_92)
		{
			x = chroma;
			vec3 _94 = x * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			vec3 _96 = _94 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			x = _96;
		}
		else
		{
			x = colorInput.xyz;
		}
	}
	bool _102 = V_xFormula == 0;
	if (_102)
	{
		vec3 _104 = vec3(1.57079637e+00, 1.57079637e+00, 1.57079637e+00) * x;
		vec3 _105 = sin(_104);
		x = _105;
		vec3 _106 = x * x;
		x = _106;
	}
	bool _111 = V_xFormula == 1;
	if (_111)
	{
		vec3 _113 = x - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		x = _113;
		vec3 _114 = abs(x);
		vec3 _116 = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01) + _114;
		vec3 _117 = x / _116;
		vec3 _119 = _117 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		x = _119;
	}
	bool _124 = V_xFormula == 2;
	if (_124)
	{
		vec3 _125 = x * x;
		vec3 _127 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * x;
		vec3 _129 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) - _127;
		vec3 _130 = _125 * _129;
		x = _130;
	}
	bool _135 = V_xFormula == 3;
	if (_135)
	{
		vec3 _137 = vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00) * x;
		vec3 _138 = exp(_137);
		vec3 _140 = vec3(1.05239999e+00, 1.05239999e+00, 1.05239999e+00) * _138;
		vec3 _142 = _140 - vec3(1.05247998e+00, 1.05247998e+00, 1.05247998e+00);
		vec3 _144 = vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00) * x;
		vec3 _145 = exp(_144);
		vec3 _147 = _145 + vec3(2.00855007e+01, 2.00855007e+01, 2.00855007e+01);
		vec3 _148 = _142 / _147;
		x = _148;
	}
	bool _153 = V_xFormula == 4;
	if (_153)
	{
		vec3 _155 = vec3(1.50000000e+00, 1.50000000e+00, 1.50000000e+00) - x;
		vec3 _156 = x * _155;
		vec3 _158 = _156 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		vec3 _159 = x * _158;
		x = _159;
		float _161 = V_xContrast * 2.00000000e+00;
		Contrast_blend = _161;
	}
	bool _166 = V_xFormula == 5;
	if (_166)
	{
		vec3 _167 = x * x;
		vec3 _168 = _167 * x;
		vec3 _170 = x * vec3(6.00000000e+00, 6.00000000e+00, 6.00000000e+00);
		vec3 _172 = _170 - vec3(1.50000000e+01, 1.50000000e+01, 1.50000000e+01);
		vec3 _173 = x * _172;
		vec3 _175 = _173 + vec3(1.00000000e+01, 1.00000000e+01, 1.00000000e+01);
		vec3 _176 = _168 * _175;
		x = _176;
	}
	bool _181 = V_xFormula == 6;
	if (_181)
	{
		vec3 _183 = x - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		x = _183;
		vec3 _184 = abs(x);
		vec3 _186 = _184 * vec3(1.25000000e+00, 1.25000000e+00, 1.25000000e+00);
		vec3 _188 = _186 + vec3(3.75000000e-01, 3.75000000e-01, 3.75000000e-01);
		vec3 _189 = x / _188;
		vec3 _191 = _189 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		x = _191;
	}
	bool _196 = V_xFormula == 7;
	if (_196)
	{
		vec3 _198 = vec3(1.60000002e+00, 1.60000002e+00, 1.60000002e+00) * x;
		vec3 _200 = _198 - vec3(7.19999981e+00, 7.19999981e+00, 7.19999981e+00);
		vec3 _201 = x * _200;
		vec3 _203 = _201 + vec3(1.08000002e+01, 1.08000002e+01, 1.08000002e+01);
		vec3 _204 = x * _203;
		vec3 _206 = _204 - vec3(4.19999981e+00, 4.19999981e+00, 4.19999981e+00);
		vec3 _207 = x * _206;
		vec3 _209 = _207 - vec3(3.59999990e+00, 3.59999990e+00, 3.59999990e+00);
		vec3 _210 = x * _209;
		vec3 _212 = _210 + vec3(2.70000005e+00, 2.70000005e+00, 2.70000005e+00);
		vec3 _213 = x * _212;
		vec3 _215 = _213 - vec3(1.79999995e+00, 1.79999995e+00, 1.79999995e+00);
		vec3 _216 = x * _215;
		vec3 _218 = _216 + vec3(2.70000005e+00, 2.70000005e+00, 2.70000005e+00);
		vec3 _219 = _218 * x;
		vec3 _220 = _219 * x;
		x = _220;
	}
	bool _225 = V_xFormula == 8;
	if (_225)
	{
		vec3 _227 = x * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec3 _229 = _227 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		vec3 _231 = vec3(-5.00000000e-01, -5.00000000e-01, -5.00000000e-01) * _229;
		vec3 _233 = x * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec3 _235 = _233 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		vec3 _236 = abs(_235);
		vec3 _238 = _236 - vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		vec3 _239 = _231 * _238;
		vec3 _241 = _239 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		x = _241;
	}
	bool _246 = V_xFormula == 9;
	if (_246)
	{
		vec3 _248 = step(x, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
		vec3 xstep = _248;
		vec3 _251 = xstep - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
		vec3 xstep_shift = _251;
		vec3 _253 = x + xstep_shift;
		vec3 shifted_x = _253;
		vec3 _255 = -(shifted_x);
		vec3 _256 = _255 * shifted_x;
		vec3 _257 = _256 + shifted_x;
		vec3 _258 = sqrt(_257);
		vec3 _259 = xstep - _258;
		vec3 _260 = abs(_259);
		vec3 _261 = _260 - xstep_shift;
		x = _261;
		float _263 = V_xContrast * 5.00000000e-01;
		Contrast_blend = _263;
	}
	bool _268 = V_xFormula == 10;
	if (_268)
	{
		vec3 a = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		vec3 b = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		vec3 _273 = x * x;
		vec3 _275 = _273 * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
		a = _275;
		vec3 _276 = -(x);
		vec3 _278 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _276;
		vec3 _280 = _278 + vec3(4.00000000e+00, 4.00000000e+00, 4.00000000e+00);
		vec3 _281 = _280 * x;
		vec3 _283 = _281 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
		b = _283;
		bvec3 _285 = lessThan(x, vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01));
		vec3 _286 = compCond(_285, a, b);
		x = _286;
	}
	bool _291 = V_xMode == 0;
	if (_291)
	{
		vec3 _294 = mix(vec3(luma), x, vec3(Contrast_blend));
		x = _294;
		vec3 _295 = x + chroma;
		colorInput.xyz = _295;
	}
	else
	{
		bool _300 = V_xMode == 1;
		if (_300)
		{
			vec3 _302 = x * vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00);
			vec3 _304 = _302 - vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00);
			x = _304;
			vec3 _306 = vec3(luma) + x;
			vec3 color = _306;
			vec3 _310 = mix(colorInput.xyz, color, vec3(Contrast_blend));
			colorInput.xyz = _310;
		}
		else
		{
			vec3 color_311 = x;
			vec3 _314 = mix(colorInput.xyz, color_311, vec3(Contrast_blend));
			colorInput.xyz = _314;
		}
	}
	return colorInput;
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
#ifdef E_xCurvesPass
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 vpos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xCurvesPass(vpos, texcoord);
	return;
}
#endif
