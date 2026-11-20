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
uniform int V_xiUIPresentType;
uniform bool V_xbUIShowOffset;
uniform bool V_xbUIUseLivePreview;
uniform bool V_xiUIUpsideDown;
uniform bool V_xiUIReversed;
uniform bool V_xiUILogarithmic;
uniform vec2 V_xfUIScale;
uniform ivec2 V_xiUIOffset;
uniform float V_xfUIFarPlane;
uniform float V_xfUIDepthMultiplier;

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
float F_xGetLinearizedDepth(
	in vec2 texcoord)
{
	bool _77 = !bool(V_xbUIUseLivePreview);
	if (_77)
	{
		vec2 _78;
		_78 = texcoord;
		float _79 = F_xReShade_xGetLinearizedDepth(_78);
		return _79;
	}
	else
	{
		if (V_xiUIUpsideDown)
		{
			float _85 = 1.00000000e+00 - texcoord.y;
			texcoord[1] = _85;
		}
		float _88 = texcoord.x / V_xfUIScale.x;
		texcoord[0] = _88;
		float _91 = texcoord.y / V_xfUIScale.y;
		texcoord[1] = _91;
		float _94 = float(V_xiUIOffset.x) * 5.20833360e-04;
		float _96 = texcoord.x - _94;
		texcoord[0] = _96;
		float _99 = float(V_xiUIOffset.y) * 9.25925910e-04;
		float _101 = texcoord.y + _99;
		texcoord[1] = _101;
		vec4 _106 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _107 = textureLod(V_xReShade_xDepthBuffer, _106.xy, _106.w);
		float _109 = _107.x * V_xfUIDepthMultiplier;
		float depth_110 = _109;
		if (V_xiUILogarithmic)
		{
			float _115 = log(1.00999999e+00);
			float _116 = depth_110 * _115;
			float _117 = exp(_116);
			float _119 = _117 - 1.00000000e+00;
			float _121 = _119 / 9.99999978e-03;
			depth_110 = _121;
		}
		if (V_xiUIReversed)
		{
			float _126 = 1.00000000e+00 - depth_110;
			depth_110 = _126;
		}
		float _128 = V_xfUIFarPlane - 1.00000000e+00;
		float _129 = depth_110 * _128;
		float _130 = V_xfUIFarPlane - _129;
		float _131 = depth_110 / _130;
		depth_110 = _131;
		return depth_110;
	}
}
vec3 F_xGetScreenSpaceNormal(
	in vec2 texcoord)
{
	vec3 offset = vec3(5.20833360e-04, 9.25925910e-04, 0.00000000e+00);
	vec2 posCenter = texcoord.xy;
	vec2 _140 = posCenter - offset.zy;
	vec2 posNorth = _140;
	vec2 _143 = posCenter + offset.xz;
	vec2 posEast = _143;
	vec2 _146 = posCenter - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _150 = vec3(_146.x, _146.y, 1.00000000e+00);
	vec2 _151;
	_151 = posCenter;
	float _152 = F_xGetLinearizedDepth(_151);
	vec3 _154 = _150 * vec3(_152);
	vec3 vertCenter = _154;
	vec2 _157 = posNorth - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _161 = vec3(_157.x, _157.y, 1.00000000e+00);
	vec2 _162;
	_162 = posNorth;
	float _163 = F_xGetLinearizedDepth(_162);
	vec3 _165 = _161 * vec3(_163);
	vec3 vertNorth = _165;
	vec2 _168 = posEast - vec2(5.00000000e-01, 5.00000000e-01);
	vec3 _172 = vec3(_168.x, _168.y, 1.00000000e+00);
	vec2 _173;
	_173 = posEast;
	float _174 = F_xGetLinearizedDepth(_173);
	vec3 _176 = _172 * vec3(_174);
	vec3 vertEast = _176;
	vec3 _178 = vertCenter - vertNorth;
	vec3 _179 = vertCenter - vertEast;
	vec3 _180 = cross(_178, _179);
	vec3 _181 = normalize(_180);
	vec3 _183 = _181 * vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	vec3 _185 = _183 + vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
	return _185;
}
void F_xPS_DisplayDepth(
	in vec4 position,
	in vec2 texcoord,
	out vec3 color)
{
	vec2 _191;
	_191 = texcoord;
	float _192 = F_xGetLinearizedDepth(_191);
	vec3 depth_194 = vec3(_192);
	vec2 _195;
	_195 = texcoord;
	vec3 _196 = F_xGetScreenSpaceNormal(_195);
	vec3 normal = _196;
	float _199 = dot(texcoord, vec2(1.20250000e+02, 3.00250000e+02));
	float _200 = fract(_199);
	float grid_position = _200;
	float _204 = pow(2.00000000e+00, 8.00000000e+00);
	float _206 = _204 - 1.00000000e+00;
	float _208 = 1.00000000e+00 / _206;
	float _210 = 2.50000000e-01 * _208;
	float dither_shift = _210;
	float _212 = -(dither_shift);
	vec3 _213 = vec3(dither_shift, _212, dither_shift);
	vec3 dither_shift_RGB = _213;
	vec3 _216 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * dither_shift_RGB;
	vec3 _218 = vec3(-2.00000000e+00, -2.00000000e+00, -2.00000000e+00) * dither_shift_RGB;
	vec3 _220 = mix(_216, _218, vec3(grid_position));
	dither_shift_RGB = _220;
	vec3 _221 = depth_194 + dither_shift_RGB;
	depth_194 = _221;
	color = depth_194;
	bool _226 = V_xiUIPresentType == 1;
	if (_226)
	{
		color = normal;
	}
	bool _231 = V_xiUIPresentType == 2;
	if (_231)
	{
		float _234 = step(9.60000000e+02, position.x);
		vec3 _236 = mix(normal, depth_194, vec3(_234));
		color = _236;
	}
	if (V_xbUIShowOffset)
	{
		vec4 _240 = texture(V_xReShade_xBackBuffer, texcoord);
		vec3 color_orig = _240.xyz;
		vec3 _244 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * color;
		vec3 _245 = _244 * color_orig;
		vec3 _247 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - color;
		vec3 _249 = vec3(2.00000000e+00, 2.00000000e+00, 2.00000000e+00) * _247;
		vec3 _251 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - color_orig;
		vec3 _252 = _249 * _251;
		vec3 _254 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) - _252;
		float _257 = max(color.y, color.z);
		float _259 = max(color.x, _257);
		bool _261 = _259 < 5.00000000e-01;
		float _264 = _261 ? 0.00000000e+00 : 1.00000000e+00;
		vec3 _266 = mix(_245, _254, vec3(_264));
		color = _266;
	}
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
#ifdef E_xPS_DisplayDepth
in vec2 vv_0;
out vec3 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec3 color;
	F_xPS_DisplayDepth(position, texcoord, color);
	vv_0 = color;
	return;
}
#endif
