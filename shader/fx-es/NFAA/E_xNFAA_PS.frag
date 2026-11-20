#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xNFAA_PS
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform int V_xEdgeDetectionType;
uniform float V_xEdgeDetectionThreshold;
uniform float V_xEdgeSearchRadius;
uniform float V_xUnblurFilterStrength;
uniform float V_xBlurStrength;
uniform vec2 V_xBlurSize;
uniform int V_xDebugOutput;

uniform sampler2D V_xBackBuffer;
const vec3 _14[4] = vec3[4](vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02), vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01), vec3(3.33333313e-01, 3.33333313e-01, 3.33333313e-01), vec3(2.98999995e-01, 5.87000012e-01, 1.14000000e-01));
float F_xLinearDifference(
	in vec3 A,
	in vec3 B)
{
	float _16 = dot(A, _14[int(V_xEdgeDetectionType)]);
	float _19 = dot(B, _14[int(V_xEdgeDetectionType)]);
	float _20 = _16 - _19;
	float lumDiff = _20;
	bool _26 = V_xEdgeDetectionType < 2;
	if (_26)
	{
		return lumDiff;
	}
	vec3 _27 = A - B;
	vec3 _28 = abs(_27);
	vec3 C = _28;
	float _32 = max(C.x, C.y);
	float _34 = max(_32, C.z);
	bool _36 = lumDiff < 0.00000000e+00;
	float _39 = _36 ? -1.00000000e+00 : 1.00000000e+00;
	float _40 = _34 * _39;
	return _40;
}
vec2 F_xRotate45(
	in vec2 p)
{
	float _45 = -(p.y);
	float _47 = _45 * 7.07106769e-01;
	float _50 = fma(p.x, 7.07106769e-01, _47);
	float _53 = p.y * 7.07106769e-01;
	float _56 = fma(p.x, 7.07106769e-01, _53);
	vec2 _57 = vec2(_50, _56);
	return _57;
}
vec4 F_xNFAA(
	in vec2 texcoord,
	in vec4 offsets[4])
{
	vec4 _66 = vec4(texcoord.x, texcoord.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _67 = textureLod(V_xBackBuffer, _66.xy, _66.w);
	vec4 color = _67;
	vec4 _70 = textureLod(V_xBackBuffer, offsets[0].xy, offsets[0].w);
	vec3 a = _70.xyz;
	vec4 _74 = textureLod(V_xBackBuffer, offsets[1].xy, offsets[1].w);
	vec3 b = _74.xyz;
	vec4 _78 = textureLod(V_xBackBuffer, offsets[2].xy, offsets[2].w);
	vec3 c = _78.xyz;
	vec4 _82 = textureLod(V_xBackBuffer, offsets[3].xy, offsets[3].w);
	vec3 d = _82.xyz;
	vec3 _85 = b + d;
	vec3 _86 = a + c;
	vec3 _87;
	vec3 _88;
	_87 = _85;
	_88 = _86;
	float _89 = F_xLinearDifference(_87, _88);
	vec3 _90 = c + d;
	vec3 _91 = a + b;
	vec3 _92;
	vec3 _93;
	_92 = _90;
	_93 = _91;
	float _94 = F_xLinearDifference(_92, _93);
	vec2 _95 = vec2(_89, _94);
	vec2 normal = _95;
	float _97 = length(normal);
	float edge = _97;
	float edgeMask = 1.00000000e+00;
	float cornerMask = 1.00000000e+00;
	bool _106 = edge > V_xEdgeDetectionThreshold;
	if (_106)
	{
		float _107 = edge / V_xEdgeDetectionThreshold;
		float _108 = log2(_107);
		float edgeConfidence = _108;
		float _111 = V_xUnblurFilterStrength - 2.00000000e+00;
		float _113 = fma(edgeConfidence, _111, 1.00000000e+00);
		float _114 = clamp(_113, 0.0, 1.0);
		edgeMask = _114;
		vec3 _115 = a + b;
		vec3 _116 = _115 + c;
		vec3 _118 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) * d;
		vec3 _119;
		vec3 _120;
		_119 = _116;
		_120 = _118;
		float _121 = F_xLinearDifference(_119, _120);
		vec3 _122 = a + b;
		vec3 _123 = _122 + d;
		vec3 _125 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) * c;
		vec3 _126;
		vec3 _127;
		_126 = _123;
		_127 = _125;
		float _128 = F_xLinearDifference(_126, _127);
		vec3 _129 = a + c;
		vec3 _130 = _129 + d;
		vec3 _132 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) * b;
		vec3 _133;
		vec3 _134;
		_133 = _130;
		_134 = _132;
		float _135 = F_xLinearDifference(_133, _134);
		vec3 _136 = c + d;
		vec3 _137 = _136 + b;
		vec3 _139 = vec3(3.00000000e+00, 3.00000000e+00, 3.00000000e+00) * a;
		vec3 _140;
		vec3 _141;
		_140 = _137;
		_141 = _139;
		float _142 = F_xLinearDifference(_140, _141);
		vec4 _143 = vec4(_121, _128, _135, _142);
		vec4 corners = _143;
		vec4 _145 = abs(corners);
		float _147 = dot(_145, vec4(2.50000000e-01, 2.50000000e-01, 2.50000000e-01, 2.50000000e-01));
		float corner = _147;
		float _149 = edgeMask + corner;
		float _150 = clamp(_149, 0.0, 1.0);
		cornerMask = _150;
		vec4 offset = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		bool _155 = normal.y != 0.00000000e+00;
		float _158 = normal.x / normal.y;
		float _160 = _155 ? _158 : 1.02400000e+03;
		float m = _160;
		float _164 = 5.00000000e-01 * V_xBlurSize.x;
		float d_165 = _164;
		float _166 = d_165 * d_165;
		float _167 = m * m;
		float _169 = 1.00000000e+00 + _167;
		float _170 = _166 / _169;
		float _171 = sqrt(_170);
		offset[0] = _171;
		float _173 = m * offset.x;
		offset[1] = _173;
		bool _176 = normal.x != 0.00000000e+00;
		float _178 = -(normal.y);
		float _180 = _178 / normal.x;
		float _182 = _176 ? _180 : 1.02400000e+03;
		m = _182;
		float _185 = 5.00000000e-01 * V_xBlurSize.y;
		d_165 = _185;
		float _186 = d_165 * d_165;
		float _187 = m * m;
		float _189 = 1.00000000e+00 + _187;
		float _190 = _186 / _189;
		float _191 = sqrt(_190);
		offset[2] = _191;
		float _193 = m * offset.z;
		offset[3] = _193;
		vec2 _196 = offset.xy + offset.zw;
		vec2 _198 = fma(_196, vec2(5.20833360e-04, 9.25925910e-04), texcoord);
		vec4 _203 = vec4(_198.x, _198.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _204 = textureLod(V_xBackBuffer, _203.xy, _203.w);
		vec3 e = _204.xyz;
		vec2 _209 = offset.xy - offset.zw;
		vec2 _211 = fma(_209, vec2(5.20833360e-04, 9.25925910e-04), texcoord);
		vec4 _216 = vec4(_211.x, _211.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _217 = textureLod(V_xBackBuffer, _216.xy, _216.w);
		vec3 f = _217.xyz;
		vec2 _221 = -(offset.xy);
		vec2 _223 = _221 - offset.zw;
		vec2 _225 = fma(_223, vec2(5.20833360e-04, 9.25925910e-04), texcoord);
		vec4 _230 = vec4(_225.x, _225.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _231 = textureLod(V_xBackBuffer, _230.xy, _230.w);
		vec3 g = _231.xyz;
		vec2 _235 = -(offset.xy);
		vec2 _237 = _235 + offset.zw;
		vec2 _239 = fma(_237, vec2(5.20833360e-04, 9.25925910e-04), texcoord);
		vec4 _244 = vec4(_239.x, _239.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _245 = textureLod(V_xBackBuffer, _244.xy, _244.w);
		vec3 h = _245.xyz;
		bool _252 = V_xDebugOutput != 4;
		if (_252)
		{
			vec3 _253 = e + f;
			vec3 _254 = _253 + g;
			vec3 _255 = _254 + h;
			vec3 _257 = _255 * vec3(2.50000000e-01, 2.50000000e-01, 2.50000000e-01);
			float _259 = V_xBlurStrength * 5.00000000e-01;
			float _261 = 1.00000000e+00 - cornerMask;
			float _262 = _259 * _261;
			vec3 _265 = mix(color.xyz, _257, vec3(_262));
			color.xyz = _265;
		}
		bool _270 = V_xDebugOutput > 3;
		if (_270)
		{
			color[3] = cornerMask;
		}
	}
	else
	{
		color[3] = 0.00000000e+00;
	}
	bool _276 = V_xDebugOutput == 1;
	if (_276)
	{
		color.xyz = vec3(edgeMask);
	}
	bool _282 = V_xDebugOutput == 2;
	if (_282)
	{
		color.xyz = vec3(cornerMask);
	}
	else
	{
		bool _288 = V_xDebugOutput == 3;
		if (_288)
		{
			vec3 normalMap = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
			normalMap[2] = 1.00000000e+00;
			float _293 = -(normal.x);
			vec2 _295 = vec2(_293, normal.y);
			vec2 _297 = _295 * vec2(V_xBlurSize.x);
			vec2 _299 = _297 * vec2(V_xBlurStrength);
			vec2 _302 = fma(_299, vec2(2.50000000e-01, 2.50000000e-01), vec2(5.00000000e-01, 5.00000000e-01));
			normalMap.xy = _302;
			vec2 _304 = clamp(normalMap.xy, 0.0, 1.0);
			float _306 = 1.00000000e+00 - edgeMask;
			float _308 = _306 * V_xBlurSize.y;
			vec2 _311 = mix(vec2(5.00000000e-01, 5.00000000e-01), _304, vec2(_308));
			normalMap.xy = _311;
			color.xyz = normalMap;
		}
		else
		{
			bool _316 = V_xDebugOutput > 3;
			if (_316)
			{
				float _319 = texcoord.y / 1.00000001e-01;
				float _320 = floor(_319);
				uint row = uint(_320);
				float _325 = texcoord.x * 1.77777779e+00;
				float _327 = _325 / 1.00000001e-01;
				float _328 = floor(_327);
				uint col = uint(_328);
				vec3 lightGray = vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
				vec3 darkGray = vec3(1.66700006e-01, 1.66700006e-01, 1.66700006e-01);
				vec3 _337 = mix(lightGray, color.xyz, vec3(color.w));
				lightGray = _337;
				vec3 _340 = mix(darkGray, color.xyz, vec3(color.w));
				darkGray = _340;
				uint _345 = row % 2u;
				bool _347 = _345 == 0u;
				if (_347)
				{
					uint _352 = col % 2u;
					bool _354 = _352 == 0u;
					if (_354)
					{
						color.xyz = lightGray;
					}
					else
					{
						color.xyz = darkGray;
					}
				}
				else
				{
					uint _359 = col % 2u;
					bool _361 = _359 == 0u;
					if (_361)
					{
						color.xyz = darkGray;
					}
					else
					{
						color.xyz = lightGray;
					}
				}
			}
		}
	}
	color[3] = 1.00000000e+00;
	return color;
}
void F_xNFAA_VS(
	in uint id,
	out vec4 position,
	out vec2 texcoord,
	out vec4 offsets[4])
{
	bool _370 = id == 2u;
	float _373 = _370 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[0] = _373;
	bool _375 = id == 1u;
	float _378 = _375 ? 2.00000000e+00 : 0.00000000e+00;
	texcoord[1] = _378;
	vec2 _380 = texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _382 = _380 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _387 = vec4(_382.x, _382.y, 0.00000000e+00, 1.00000000e+00);
	position = _387;
	float _389 = 7.07106769e-01 * V_xEdgeSearchRadius;
	vec2 _392 = vec2(_389) * vec2(5.20833360e-04, 9.25925910e-04);
	vec2 offset_393 = _392;
	vec2 _395 = fma(vec2(-1.00000000e+00, -1.00000000e+00), offset_393, texcoord);
	vec4 _400 = vec4(_395.x, _395.y, 0.00000000e+00, 0.00000000e+00);
	offsets[0] = _400;
	vec2 _402 = fma(vec2(1.00000000e+00, -1.00000000e+00), offset_393, texcoord);
	vec4 _407 = vec4(_402.x, _402.y, 0.00000000e+00, 0.00000000e+00);
	offsets[1] = _407;
	vec2 _409 = fma(vec2(-1.00000000e+00, 1.00000000e+00), offset_393, texcoord);
	vec4 _414 = vec4(_409.x, _409.y, 0.00000000e+00, 0.00000000e+00);
	offsets[2] = _414;
	vec2 _416 = fma(vec2(1.00000000e+00, 1.00000000e+00), offset_393, texcoord);
	vec4 _421 = vec4(_416.x, _416.y, 0.00000000e+00, 0.00000000e+00);
	offsets[3] = _421;
	return;
}
vec4 F_xNFAA_PS(
	in vec4 position,
	in vec2 texcoord,
	in vec4 offsets[4])
{
	vec2 _427;
	vec4 _428[4];
	_427 = texcoord;
	_428 = offsets;
	vec4 _429 = F_xNFAA(_427, _428);
	return _429;
}
#ifdef E_xNFAA_VS
layout(location = 0) out vec2 _out_texcoord;
layout(location = 1) out vec4 _out_offsets_0;
layout(location = 2) out vec4 _out_offsets_1;
layout(location = 3) out vec4 _out_offsets_2;
layout(location = 4) out vec4 _out_offsets_3;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 position;
	vec2 texcoord;
	vec4 offsets[4];
	F_xNFAA_VS(id, position, texcoord, offsets);
	gl_Position = position;
	_out_texcoord = texcoord;
	_out_offsets_0 = offsets[0];
	_out_offsets_1 = offsets[1];
	_out_offsets_2 = offsets[2];
	_out_offsets_3 = offsets[3];
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xNFAA_PS
layout(location = 0) out vec4 _return;
in vec2 vv_0;
in vec4 vv_1;
in vec4 vv_2;
in vec4 vv_3;
in vec4 vv_4;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	vec4 offsets[4] = vec4[](vv_1, vv_2, vv_3, vv_4);
	_return = F_xNFAA_PS(position, texcoord, offsets);
	return;
}
#endif
