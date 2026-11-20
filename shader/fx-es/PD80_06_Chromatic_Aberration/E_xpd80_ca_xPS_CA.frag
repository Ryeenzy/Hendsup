#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xpd80_ca_xPS_CA
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
uniform int V_xpd80_ca_xCA_type;
uniform int V_xpd80_ca_xdegrees;
uniform float V_xpd80_ca_xCA;
uniform int V_xpd80_ca_xsampleSTEPS;
uniform float V_xpd80_ca_xCA_strength;
uniform bool V_xpd80_ca_xshow_CA;
uniform vec3 V_xpd80_ca_xvignetteColor;
uniform float V_xpd80_ca_xCA_width;
uniform float V_xpd80_ca_xCA_curve;
uniform float V_xpd80_ca_xoX;
uniform float V_xpd80_ca_xoY;
uniform float V_xpd80_ca_xCA_shapeX;
uniform float V_xpd80_ca_xCA_shapeY;
uniform bool V_xpd80_ca_xenable_depth_int;
uniform bool V_xpd80_ca_xenable_depth_width;
uniform bool V_xpd80_ca_xdisplay_depth;
uniform float V_xpd80_ca_xdepthStart;
uniform float V_xpd80_ca_xdepthEnd;
uniform float V_xpd80_ca_xdepthCurve;

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
vec3 F_xpd80_ca_xHUEToRGB(
	in float H)
{
	float _84 = H * 6.00000000e+00;
	float _86 = _84 - 3.00000000e+00;
	float _87 = abs(_86);
	float _89 = _87 - 1.00000000e+00;
	float _91 = H * 6.00000000e+00;
	float _93 = _91 - 2.00000000e+00;
	float _94 = abs(_93);
	float _96 = 2.00000000e+00 - _94;
	float _98 = H * 6.00000000e+00;
	float _100 = _98 - 4.00000000e+00;
	float _101 = abs(_100);
	float _103 = 2.00000000e+00 - _101;
	vec3 _104 = vec3(_89, _96, _103);
	vec3 _105 = clamp(_104, 0.0, 1.0);
	return _105;
}
vec4 F_xpd80_ca_xPS_CA(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 color = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float px = 5.20833360e-04;
	float py = 9.25925910e-04;
	float aspect = 1.77777779e+00;
	vec4 _118 = texture(V_xReShade_xBackBuffer, texcoord);
	vec3 orig = _118.xyz;
	vec2 _121;
	_121 = texcoord;
	float _122 = F_xReShade_xGetLinearizedDepth(_121);
	float depth_123 = _122;
	float _124 = smoothstep(V_xpd80_ca_xdepthStart, V_xpd80_ca_xdepthEnd, depth_123);
	depth_123 = _124;
	float _125 = pow(depth_123, V_xpd80_ca_xdepthCurve);
	depth_123 = _125;
	float CA_width_n = V_xpd80_ca_xCA_width;
	if (V_xpd80_ca_xenable_depth_width)
	{
		float _130 = CA_width_n * depth_123;
		CA_width_n = _130;
	}
	vec2 _133 = texcoord.xy * vec2(2.00000000e+00, 2.00000000e+00);
	float _135 = V_xpd80_ca_xoX + 1.00000000e+00;
	float _137 = V_xpd80_ca_xoY + 1.00000000e+00;
	vec2 _138 = vec2(_135, _137);
	vec2 _139 = _133 - _138;
	vec2 coords = _139;
	vec2 uv = coords.xy;
	float _143 = V_xpd80_ca_xCA_shapeX / aspect;
	vec2 _144 = vec2(_143, V_xpd80_ca_xCA_shapeY);
	vec2 _146 = coords.xy / _144;
	coords.xy = _146;
	float _148 = length(coords.xy);
	float _149 = _148 * CA_width_n;
	vec2 caintensity = vec2(_149);
	float _154 = caintensity.x * caintensity.x;
	float _156 = _154 + 1.00000000e+00;
	caintensity[1] = _156;
	float _159 = caintensity.y * caintensity.y;
	float _161 = 1.00000000e+00 / _159;
	float _163 = 1.00000000e+00 - _161;
	caintensity[0] = _163;
	float _165 = pow(caintensity.x, V_xpd80_ca_xCA_curve);
	caintensity[0] = _165;
	int degreesY = V_xpd80_ca_xdegrees;
	float c = 0.00000000e+00;
	float s = 0.00000000e+00;
	switch (V_xpd80_ca_xCA_type)
	{
	case 0: {
		int _174 = V_xpd80_ca_xdegrees + 90;
		bool _176 = _174 > 360;
		int _178 = V_xpd80_ca_xdegrees + 90;
		int _180 = _178 - 360;
		degreesY = _180;
		int _182 = V_xpd80_ca_xdegrees + 90;
		int _183 = _176 ? _180 : _182;
		degreesY = _183;
		float _185 = radians(float(V_xpd80_ca_xdegrees));
		float _186 = cos(_185);
		float _188 = _186 * uv.x;
		c = _188;
		float _190 = radians(float(degreesY));
		float _191 = sin(_190);
		float _193 = _191 * uv.y;
		s = _193;
		break;
	}
	case 1: {
		float _196 = radians(float(V_xpd80_ca_xdegrees));
		float _197 = cos(_196);
		c = _197;
		float _199 = radians(float(degreesY));
		float _200 = sin(_199);
		s = _200;
		break;
	}
	case 2: {
		int _203 = V_xpd80_ca_xdegrees + 90;
		bool _205 = _203 > 360;
		int _207 = V_xpd80_ca_xdegrees + 90;
		int _209 = _207 - 360;
		degreesY = _209;
		int _211 = V_xpd80_ca_xdegrees + 90;
		int _212 = _205 ? _209 : _211;
		degreesY = _212;
		caintensity[0] = 1.00000000e+00;
		float _215 = radians(float(V_xpd80_ca_xdegrees));
		float _216 = cos(_215);
		float _218 = _216 * uv.x;
		c = _218;
		float _220 = radians(float(degreesY));
		float _221 = sin(_220);
		float _223 = _221 * uv.y;
		s = _223;
		break;
	}
	case 3: {
		caintensity[0] = 1.00000000e+00;
		float _227 = radians(float(V_xpd80_ca_xdegrees));
		float _228 = cos(_227);
		c = _228;
		float _230 = radians(float(degreesY));
		float _231 = sin(_230);
		s = _231;
		break;
	}
	}
	if (V_xpd80_ca_xenable_depth_int)
	{
		float _236 = caintensity.x * depth_123;
		caintensity[0] = _236;
	}
	vec3 huecolor = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec3 temp = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	float _243 = float(V_xpd80_ca_xsampleSTEPS) - 1.00000000e+00;
	float o1 = _243;
	float o2 = 0.00000000e+00;
	vec3 d = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	int _251 = max(1920, 1080);
	float _254 = float(_251) / 1.92000000e+03;
	float _255 = V_xpd80_ca_xCA * _254;
	float caWidth = _255;
	float _257 = px * c;
	float _259 = _257 * caintensity.x;
	float offsetX = _259;
	float _261 = py * s;
	float _263 = _261 * caintensity.x;
	float offsetY = _263;
	float sampst = float(V_xpd80_ca_xsampleSTEPS);
	float i = 0.00000000e+00;
	while (i < float(V_xpd80_ca_xsampleSTEPS))
	{
		{
			float _279 = i / sampst;
			float _280;
			_280 = _279;
			vec3 _281 = F_xpd80_ca_xHUEToRGB(_280);
			huecolor.xyz = _281;
			float _282 = -(caWidth);
			float _283 = i / o1;
			float _284 = mix(_282, caWidth, _283);
			o2 = _284;
			float _285 = o2 * offsetX;
			float _286 = o2 * offsetY;
			vec2 _287 = vec2(_285, _286);
			vec2 _289 = texcoord.xy + _287;
			vec4 _290 = texture(V_xReShade_xBackBuffer, _289);
			temp.xyz = _290.xyz;
			vec3 _294 = temp.xyz * huecolor.xyz;
			vec3 _296 = color.xyz + _294;
			color.xyz = _296;
			vec3 _299 = d.xyz + huecolor.xyz;
			d.xyz = _299;
		}
		float _277 = i;
		float _278 = _277 + 1.00000000e+00;
		i = _278;
	}
	float _302 = dot(d.xyz, vec3(3.33332986e-01, 3.33332986e-01, 3.33332986e-01));
	vec3 _305 = color.xyz / vec3(_302);
	color.xyz = _305;
	vec3 _309 = mix(orig.xyz, color.xyz, vec3(V_xpd80_ca_xCA_strength));
	color.xyz = _309;
	vec3 _312 = V_xpd80_ca_xvignetteColor.xyz * vec3(caintensity.x);
	float _315 = 1.00000000e+00 - caintensity.x;
	vec3 _318 = vec3(_315) * color.xyz;
	vec3 _319 = _312 + _318;
	vec3 _322 = mix(color.xyz, _319, vec3(bvec3(V_xpd80_ca_xshow_CA)));
	color.xyz = _322;
	vec3 _326 = compCond(bvec3(V_xpd80_ca_xdisplay_depth), vec3(depth_123), color.xyz);
	color.xyz = _326;
	vec4 _331 = vec4(color.xyz.x, color.xyz.y, color.xyz.z, 1.00000000e+00);
	return _331;
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
#ifdef E_xpd80_ca_xPS_CA
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xpd80_ca_xPS_CA(pos, texcoord);
	return;
}
#endif
