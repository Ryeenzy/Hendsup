#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Ascii
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
uniform int V_xAscii_spacing;
uniform int V_xAscii_font;
uniform int V_xAscii_font_color_mode;
uniform vec3 V_xAscii_font_color;
uniform vec3 V_xAscii_background_color;
uniform bool V_xAscii_swap_colors;
uniform bool V_xAscii_invert_brightness;
uniform bool V_xAscii_dithering;
uniform float V_xAscii_dithering_intensity;
uniform bool V_xAscii_dithering_debug_gradient;
uniform float V_xtimer;
uniform float V_xframecount;

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
vec3 F_xAsciiPass(
	in vec2 tex)
{
	vec2 Ascii_font_size = vec2(3.00000000e+00, 5.00000000e+00);
	float num_of_chars = 1.40000000e+01;
	bool _84 = V_xAscii_font == 1;
	if (_84)
	{
		Ascii_font_size = vec2(5.00000000e+00, 5.00000000e+00);
		num_of_chars = 1.70000000e+01;
	}
	float _88 = num_of_chars - 1.00000000e+00;
	float _90 = 1.00000000e+00 / _88;
	float quant = _90;
	vec2 _93 = Ascii_font_size + vec2(float(V_xAscii_spacing));
	vec2 Ascii_block = _93;
	vec2 _96 = vec2(1.92000000e+03, 1.08000000e+03) / Ascii_block;
	vec2 _97 = _96 * tex;
	vec2 _98 = trunc(_97);
	vec2 _100 = Ascii_block / vec2(1.92000000e+03, 1.08000000e+03);
	vec2 _101 = _98 * _100;
	vec2 cursor_position = _101;
	vec2 _104 = cursor_position + vec2(7.81250070e-04, 1.38888881e-03);
	vec4 _105 = texture(V_xReShade_xBackBuffer, _104);
	vec3 color = _105.xyz;
	vec2 _109 = cursor_position + vec2(7.81250070e-04, 3.24074063e-03);
	vec4 _110 = texture(V_xReShade_xBackBuffer, _109);
	vec3 _112 = color + _110.xyz;
	color = _112;
	vec2 _114 = cursor_position + vec2(7.81250070e-04, 5.09259244e-03);
	vec4 _115 = texture(V_xReShade_xBackBuffer, _114);
	vec3 _117 = color + _115.xyz;
	color = _117;
	vec2 _119 = cursor_position + vec2(1.82291679e-03, 1.38888881e-03);
	vec4 _120 = texture(V_xReShade_xBackBuffer, _119);
	vec3 _122 = color + _120.xyz;
	color = _122;
	vec2 _124 = cursor_position + vec2(1.82291679e-03, 3.24074063e-03);
	vec4 _125 = texture(V_xReShade_xBackBuffer, _124);
	vec3 _127 = color + _125.xyz;
	color = _127;
	vec2 _129 = cursor_position + vec2(1.82291679e-03, 5.09259244e-03);
	vec4 _130 = texture(V_xReShade_xBackBuffer, _129);
	vec3 _132 = color + _130.xyz;
	color = _132;
	vec2 _134 = cursor_position + vec2(2.86458340e-03, 1.38888881e-03);
	vec4 _135 = texture(V_xReShade_xBackBuffer, _134);
	vec3 _137 = color + _135.xyz;
	color = _137;
	vec2 _139 = cursor_position + vec2(2.86458340e-03, 3.24074063e-03);
	vec4 _140 = texture(V_xReShade_xBackBuffer, _139);
	vec3 _142 = color + _140.xyz;
	color = _142;
	vec2 _144 = cursor_position + vec2(2.86458340e-03, 5.09259244e-03);
	vec4 _145 = texture(V_xReShade_xBackBuffer, _144);
	vec3 _147 = color + _145.xyz;
	color = _147;
	vec3 _149 = color / vec3(9.00000000e+00, 9.00000000e+00, 9.00000000e+00);
	color = _149;
	float _151 = dot(color, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	float luma = _151;
	float gray = luma;
	if (V_xAscii_invert_brightness)
	{
		float _158 = 1.00000000e+00 - gray;
		gray = _158;
	}
	if (V_xAscii_dithering_debug_gradient)
	{
		gray = cursor_position.x;
	}
	vec2 _164 = vec2(1.92000000e+03, 1.08000000e+03) / Ascii_block;
	vec2 _165 = _164 * tex;
	vec2 _166 = fract(_165);
	vec2 p = _166;
	vec2 _168 = p * Ascii_block;
	vec2 _169 = trunc(_168);
	p = _169;
	float _172 = Ascii_font_size.x * p.y;
	float _174 = _172 + p.x;
	float x = _174;
	bool _181 = int(V_xAscii_dithering) != 0;
	if (_181)
	{
		float _183 = dot(cursor_position, vec2(1.29898005e+01, 7.82330017e+01));
		float seed = _183;
		float _185 = sin(seed);
		float sine = _185;
		float _188 = sine * 4.37585469e+04;
		float _190 = _188 + cursor_position.y;
		float _191 = fract(_190);
		float noise = _191;
		float _193 = quant * V_xAscii_dithering_intensity;
		float dither_shift = _193;
		float _196 = dither_shift * 5.00000000e-01;
		float dither_shift_half = _196;
		float _198 = dither_shift * noise;
		float _199 = _198 - dither_shift_half;
		dither_shift = _199;
		float _200 = gray + dither_shift;
		gray = _200;
	}
	float n = 0.00000000e+00;
	bool _207 = V_xAscii_font == 1;
	if (_207)
	{
		float _209 = 2.00000000e+00 * quant;
		bool _210 = gray < _209;
		float _213 = _210 ? 4.19430400e+06 : 1.31200000e+05;
		float n12 = _213;
		float _216 = 4.00000000e+00 * quant;
		bool _217 = gray < _216;
		float _220 = _217 ? 3.24000000e+02 : 3.30000000e+02;
		float n34 = _220;
		float _223 = 6.00000000e+00 * quant;
		bool _224 = gray < _223;
		float _227 = _224 ? 2.83712000e+05 : 1.26508800e+07;
		float n56 = _227;
		float _230 = 8.00000000e+00 * quant;
		bool _231 = gray < _230;
		float _234 = _231 ? 4.53276800e+06 : 1.31915520e+07;
		float n78 = _234;
		float _237 = 1.00000000e+01 * quant;
		bool _238 = gray < _237;
		float _241 = _238 ? 1.06487040e+07 : 1.11959360e+07;
		float n910 = _241;
		float _244 = 1.20000000e+01 * quant;
		bool _245 = gray < _244;
		float _248 = _245 ? 1.52187340e+07 : 1.52550860e+07;
		float n1112 = _248;
		float _251 = 1.40000000e+01 * quant;
		bool _252 = gray < _251;
		float _255 = _252 ? 1.52520140e+07 : 3.22944460e+07;
		float n1314 = _255;
		float _258 = 1.60000000e+01 * quant;
		bool _259 = gray < _258;
		float _262 = _259 ? 1.53249740e+07 : 1.15128100e+07;
		float n1516 = _262;
		float _265 = 3.00000000e+00 * quant;
		bool _266 = gray < _265;
		float _267 = _266 ? n12 : n34;
		float n1234 = _267;
		float _270 = 7.00000000e+00 * quant;
		bool _271 = gray < _270;
		float _272 = _271 ? n56 : n78;
		float n5678 = _272;
		float _275 = 1.10000000e+01 * quant;
		bool _276 = gray < _275;
		float _277 = _276 ? n910 : n1112;
		float n9101112 = _277;
		float _280 = 1.50000000e+01 * quant;
		bool _281 = gray < _280;
		float _282 = _281 ? n1314 : n1516;
		float n13141516 = _282;
		float _285 = 5.00000000e+00 * quant;
		bool _286 = gray < _285;
		float _287 = _286 ? n1234 : n5678;
		float n12345678 = _287;
		float _290 = 1.30000000e+01 * quant;
		bool _291 = gray < _290;
		float _292 = _291 ? n9101112 : n13141516;
		float n910111213141516 = _292;
		float _295 = 9.00000000e+00 * quant;
		bool _296 = gray < _295;
		float _297 = _296 ? n12345678 : n910111213141516;
		n = _297;
	}
	else
	{
		float _299 = 2.00000000e+00 * quant;
		bool _300 = gray < _299;
		float _303 = _300 ? 4.09600000e+03 : 1.04000000e+03;
		float n12_304 = _303;
		float _306 = 4.00000000e+00 * quant;
		bool _307 = gray < _306;
		float _310 = _307 ? 5.13600000e+03 : 5.20000000e+03;
		float n34_311 = _310;
		float _313 = 6.00000000e+00 * quant;
		bool _314 = gray < _313;
		float _317 = _314 ? 2.72800000e+03 : 1.10880000e+04;
		float n56_318 = _317;
		float _320 = 8.00000000e+00 * quant;
		bool _321 = gray < _320;
		float _324 = _321 ? 1.44780000e+04 : 1.11140000e+04;
		float n78_325 = _324;
		float _327 = 1.00000000e+01 * quant;
		bool _328 = gray < _327;
		float _331 = _328 ? 2.32130000e+04 : 1.52110000e+04;
		float n910_332 = _331;
		float _334 = 1.20000000e+01 * quant;
		bool _335 = gray < _334;
		float _338 = _335 ? 2.35330000e+04 : 3.15990000e+04;
		float n1112_339 = _338;
		float n13 = 3.17270000e+04;
		float _343 = 3.00000000e+00 * quant;
		bool _344 = gray < _343;
		float _345 = _344 ? n12_304 : n34_311;
		float n1234_346 = _345;
		float _348 = 7.00000000e+00 * quant;
		bool _349 = gray < _348;
		float _350 = _349 ? n56_318 : n78_325;
		float n5678_351 = _350;
		float _353 = 1.10000000e+01 * quant;
		bool _354 = gray < _353;
		float _355 = _354 ? n910_332 : n1112_339;
		float n9101112_356 = _355;
		float _358 = 5.00000000e+00 * quant;
		bool _359 = gray < _358;
		float _360 = _359 ? n1234_346 : n5678_351;
		float n12345678_361 = _360;
		float _363 = 1.30000000e+01 * quant;
		bool _364 = gray < _363;
		float _365 = _364 ? n9101112_356 : n13;
		float n910111213 = _365;
		float _368 = 9.00000000e+00 * quant;
		bool _369 = gray < _368;
		float _370 = _369 ? n12345678_361 : n910111213;
		n = _370;
	}
	float character = 0.00000000e+00;
	float _374 = 1.00000000e+00 * quant;
	bool _375 = gray <= _374;
	float _378 = _375 ? 0.00000000e+00 : 1.00000000e+00;
	float lit = _378;
	bool _381 = n < 0.00000000e+00;
	float _383 = _381 ? lit : 0.00000000e+00;
	float signbit = _383;
	bool _386 = x > 2.35000000e+01;
	float _388 = _386 ? signbit : 0.00000000e+00;
	signbit = _388;
	float _389 = -(x);
	float _391 = _389 - 1.00000000e+00;
	float _392 = exp2(_391);
	float _393 = n * _392;
	float _394 = abs(_393);
	float _395 = fract(_394);
	bool _397 = _395 >= 5.00000000e-01;
	float _398 = _397 ? lit : signbit;
	character = _398;
	float _404 = Ascii_font_size.x - 1.00000000e+00;
	float _407 = clamp(p.x, 0.00000000e+00, _404);
	bool _409 = _407 != p.x;
	float _412 = Ascii_font_size.y - 1.00000000e+00;
	float _415 = clamp(p.y, 0.00000000e+00, _412);
	bool _417 = _415 != p.y;
	bool _418 = _409 || _417;
	if (_418)
	{
		character = 0.00000000e+00;
	}
	if (V_xAscii_swap_colors)
	{
		bool _427 = V_xAscii_font_color_mode == 2;
		if (_427)
		{
			vec3 _429 = vec3(character) * color;
			vec3 _431 = compCond(bvec3(vec3(character)), _429, V_xAscii_font_color);
			color = _431;
		}
		else
		{
			bool _436 = V_xAscii_font_color_mode == 1;
			if (_436)
			{
				vec3 _438 = V_xAscii_background_color * vec3(gray);
				vec3 _440 = compCond(bvec3(vec3(character)), _438, V_xAscii_font_color);
				color = _440;
			}
			else
			{
				vec3 _442 = compCond(bvec3(vec3(character)), V_xAscii_background_color, V_xAscii_font_color);
				color = _442;
			}
		}
	}
	else
	{
		bool _447 = V_xAscii_font_color_mode == 2;
		if (_447)
		{
			vec3 _449 = vec3(character) * color;
			vec3 _451 = compCond(bvec3(vec3(character)), _449, V_xAscii_background_color);
			color = _451;
		}
		else
		{
			bool _456 = V_xAscii_font_color_mode == 1;
			if (_456)
			{
				vec3 _458 = V_xAscii_font_color * vec3(gray);
				vec3 _460 = compCond(bvec3(vec3(character)), _458, V_xAscii_background_color);
				color = _460;
			}
			else
			{
				vec3 _462 = compCond(bvec3(vec3(character)), V_xAscii_font_color, V_xAscii_background_color);
				color = _462;
			}
		}
	}
	vec3 _463 = clamp(color, 0.0, 1.0);
	return _463;
}
vec3 F_xPS_Ascii(
	in vec4 position,
	in vec2 texcoord)
{
	vec2 _468;
	_468 = texcoord;
	vec3 _469 = F_xAsciiPass(_468);
	vec3 color_470 = _469;
	return color_470.xyz;
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
#ifdef E_xPS_Ascii
layout(location = 0) out vec3 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 texcoord = vv_0;
	_return = F_xPS_Ascii(position, texcoord);
	return;
}
#endif
