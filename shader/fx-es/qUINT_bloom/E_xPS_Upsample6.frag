#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPS_Upsample6
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xBLOOM_INTENSITY;
uniform float V_xBLOOM_CURVE;
uniform float V_xBLOOM_SAT;
uniform float V_xBLOOM_LAYER_MULT_1;
uniform float V_xBLOOM_LAYER_MULT_2;
uniform float V_xBLOOM_LAYER_MULT_3;
uniform float V_xBLOOM_LAYER_MULT_4;
uniform float V_xBLOOM_LAYER_MULT_5;
uniform float V_xBLOOM_LAYER_MULT_6;
uniform float V_xBLOOM_LAYER_MULT_7;
uniform float V_xBLOOM_ADAPT_STRENGTH;
uniform float V_xBLOOM_ADAPT_EXPOSURE;
uniform float V_xBLOOM_ADAPT_SPEED;
uniform bool V_xBLOOM_ADAPT_MODE;
uniform float V_xBLOOM_TONEMAP_COMPRESSION;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
uniform sampler2D V_xsMXBLOOM_BloomTexSource;
uniform sampler2D V_xsMXBLOOM_BloomTex1;
uniform sampler2D V_xsMXBLOOM_BloomTex2;
uniform sampler2D V_xsMXBLOOM_BloomTex3;
uniform sampler2D V_xsMXBLOOM_BloomTex4;
uniform sampler2D V_xsMXBLOOM_BloomTex5;
uniform sampler2D V_xsMXBLOOM_BloomTex6;
uniform sampler2D V_xsMXBLOOM_BloomTex7;
uniform sampler2D V_xsMXBLOOM_BloomTexAdapt;
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _27 = uv.x / 1.00000000e+00;
	uv[0] = _27;
	float _30 = uv.y / 1.00000000e+00;
	uv[1] = _30;
	float _33 = uv.x - 0.00000000e+00;
	uv[0] = _33;
	float _36 = uv.y + 0.00000000e+00;
	uv[1] = _36;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _40;
	_40 = uv;
	vec2 _41 = F_xqUINT_xdepthtex_uv(_40);
	vec4 _46 = vec4(_41.x, _41.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _47 = textureLod(V_xqUINT_xsDepthBufferTex, _46.xy, _46.w);
	float depth = _47.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _54 = depth * 1.00000000e+00;
	depth = _54;
	float _56 = 1.00000000e+00 - depth;
	depth = _56;
	float _58 = depth * 9.99000000e+02;
	float _60 = 1.00000000e+03 - _58;
	float _61 = depth / _60;
	depth = _61;
	float _62 = clamp(depth, 0.0, 1.0);
	return _62;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _66;
	_66 = uv;
	float _67 = F_xqUINT_xget_depth(_66);
	float depth_68 = _67;
	float _69;
	_69 = depth_68;
	float _70 = F_xqUINT_xlinearize_depth(_69);
	depth_68 = _70;
	return depth_68;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _77 = id == 2u;
	float _80 = _77 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _80;
	bool _82 = id == 1u;
	float _85 = _82 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _85;
	vec2 _87 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _89 = _87 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _94 = vec4(_89.x, _89.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _94;
	return;
}
vec4 F_xdownsample(
	in sampler2D tex,
	in vec2 tex_size,
	in vec2 uv)
{
	vec4 offset_uv = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _121 = vec2(2.00000000e+00, 2.00000000e+00) / tex_size;
	vec2 kernel_small_offsets = _121;
	vec2 _124 = vec2(4.00000000e+00, 4.00000000e+00) / tex_size;
	vec2 kernel_large_offsets = _124;
	vec4 _126 = texture(tex, uv);
	vec4 kernel_center = _126;
	vec4 kernel_small = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _130 = uv + kernel_small_offsets;
	offset_uv.xy = _130;
	vec4 _131 = textureLod(tex, offset_uv.xy, offset_uv.w);
	vec4 _132 = kernel_small + _131;
	kernel_small = _132;
	float _135 = uv.x - kernel_small_offsets.x;
	offset_uv[0] = _135;
	vec4 _136 = textureLod(tex, offset_uv.xy, offset_uv.w);
	vec4 _137 = kernel_small + _136;
	kernel_small = _137;
	float _140 = uv.y - kernel_small_offsets.y;
	offset_uv[1] = _140;
	vec4 _141 = textureLod(tex, offset_uv.xy, offset_uv.w);
	vec4 _142 = kernel_small + _141;
	kernel_small = _142;
	float _145 = uv.x + kernel_small_offsets.x;
	offset_uv[0] = _145;
	vec4 _146 = textureLod(tex, offset_uv.xy, offset_uv.w);
	vec4 _147 = kernel_small + _146;
	kernel_small = _147;
	vec4 _149 = kernel_center / vec4(5.00000000e+00, 5.00000000e+00, 5.00000000e+00, 5.00000000e+00);
	vec4 _151 = kernel_small / vec4(5.00000000e+00, 5.00000000e+00, 5.00000000e+00, 5.00000000e+00);
	vec4 _152 = _149 + _151;
	return _152;
}
vec3 F_xUpsample(
	in sampler2D tex,
	in vec2 texel_size,
	in vec2 uv)
{
	vec4 offset_uv_159 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec4 kernel_small_offsets_161 = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _163 = vec2(1.50000000e+00, 1.50000000e+00) * texel_size;
	kernel_small_offsets_161.xy = _163;
	vec2 _166 = kernel_small_offsets_161.xy * vec2(2.00000000e+00, 2.00000000e+00);
	kernel_small_offsets_161.zw = _166;
	vec4 _167 = texture(tex, uv);
	vec3 kernel_center_169 = _167.xyz;
	vec3 kernel_small_1 = vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	vec2 _174 = uv.xy - kernel_small_offsets_161.xy;
	offset_uv_159.xy = _174;
	vec4 _175 = textureLod(tex, offset_uv_159.xy, offset_uv_159.w);
	vec3 _177 = kernel_small_1 + _175.xyz;
	kernel_small_1 = _177;
	float _180 = offset_uv_159.x + kernel_small_offsets_161.z;
	offset_uv_159[0] = _180;
	vec4 _181 = textureLod(tex, offset_uv_159.xy, offset_uv_159.w);
	vec3 _183 = kernel_small_1 + _181.xyz;
	kernel_small_1 = _183;
	float _186 = offset_uv_159.y + kernel_small_offsets_161.w;
	offset_uv_159[1] = _186;
	vec4 _187 = textureLod(tex, offset_uv_159.xy, offset_uv_159.w);
	vec3 _189 = kernel_small_1 + _187.xyz;
	kernel_small_1 = _189;
	float _192 = offset_uv_159.x - kernel_small_offsets_161.z;
	offset_uv_159[0] = _192;
	vec4 _193 = textureLod(tex, offset_uv_159.xy, offset_uv_159.w);
	vec3 _195 = kernel_small_1 + _193.xyz;
	kernel_small_1 = _195;
	vec3 _197 = kernel_center_169 / vec3(5.00000000e+00, 5.00000000e+00, 5.00000000e+00);
	vec3 _199 = kernel_small_1 / vec3(5.00000000e+00, 5.00000000e+00, 5.00000000e+00);
	vec3 _200 = _197 + _199;
	return _200;
}
void F_xPS_BloomPrepass(
	in vec4 pos,
	in vec2 uv,
	out vec4 color)
{
	vec2 _206;
	vec2 _207;
	_206 = vec2(1.92000000e+03, 1.08000000e+03);
	_207 = uv;
	vec4 _209 = F_xdownsample(V_xqUINT_xsBackBufferTex, _206, _207);
	color = _209;
	float _212 = dot(color.xyz, vec3(3.33000004e-01, 3.33000004e-01, 3.33000004e-01));
	float _213 = clamp(_212, 0.0, 1.0);
	color[3] = _213;
	vec3 _217 = mix(vec3(color.w), color.xyz, vec3(V_xBLOOM_SAT));
	color.xyz = _217;
	float _219 = pow(color.w, V_xBLOOM_CURVE);
	float _220 = _219 * V_xBLOOM_INTENSITY;
	float _221 = _220 * V_xBLOOM_INTENSITY;
	float _222 = _221 * V_xBLOOM_INTENSITY;
	float _225 = color.w + 1.00000005e-03;
	float _226 = _222 / _225;
	vec3 _229 = color.xyz * vec3(_226);
	color.xyz = _229;
	return;
}
void F_xPS_Downsample1(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _237 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-1, -1));
	vec2 _238;
	vec2 _239;
	_238 = _237;
	_239 = uv;
	vec4 _240 = F_xdownsample(V_xsMXBLOOM_BloomTexSource, _238, _239);
	bloom = _240;
	return;
}
void F_xPS_Downsample2(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _248 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-2, -2));
	vec2 _249;
	vec2 _250;
	_249 = _248;
	_250 = uv;
	vec4 _251 = F_xdownsample(V_xsMXBLOOM_BloomTex1, _249, _250);
	bloom = _251;
	return;
}
void F_xPS_Downsample3(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _259 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-3, -3));
	vec2 _260;
	vec2 _261;
	_260 = _259;
	_261 = uv;
	vec4 _262 = F_xdownsample(V_xsMXBLOOM_BloomTex2, _260, _261);
	bloom = _262;
	return;
}
void F_xPS_Downsample4(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _270 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-4, -4));
	vec2 _271;
	vec2 _272;
	_271 = _270;
	_272 = uv;
	vec4 _273 = F_xdownsample(V_xsMXBLOOM_BloomTex3, _271, _272);
	bloom = _273;
	return;
}
void F_xPS_Downsample5(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _281 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-5, -5));
	vec2 _282;
	vec2 _283;
	_282 = _281;
	_283 = uv;
	vec4 _284 = F_xdownsample(V_xsMXBLOOM_BloomTex4, _282, _283);
	bloom = _284;
	return;
}
void F_xPS_Downsample6(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _292 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-6, -6));
	vec2 _293;
	vec2 _294;
	_293 = _292;
	_294 = uv;
	vec4 _295 = F_xdownsample(V_xsMXBLOOM_BloomTex5, _293, _294);
	bloom = _295;
	return;
}
void F_xPS_Downsample7(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _303 = ldexp(vec2(1.92000000e+03, 1.08000000e+03), ivec2(-7, -7));
	vec2 _304;
	vec2 _305;
	_304 = _303;
	_305 = uv;
	vec4 _306 = F_xdownsample(V_xsMXBLOOM_BloomTex6, _304, _305);
	bloom = _306;
	vec4 _308 = texture(V_xsMXBLOOM_BloomTexAdapt, vec2(0.00000000e+00, 0.00000000e+00));
	float _310 = V_xqUINT_xFRAME_TIME * 1.00000005e-03;
	float _311 = _310 * V_xBLOOM_ADAPT_SPEED;
	float _312 = clamp(_311, 0.0, 1.0);
	float _315 = mix(_308.x, bloom.w, _312);
	bloom[3] = _315;
	return;
}
void F_xPS_AdaptStoreLast(
	in vec4 pos,
	in vec2 uv,
	out float adapt)
{
	vec4 _325 = vec4(uv.xy.x, uv.xy.y, 0.00000000e+00, 3.00000000e+00);
	vec4 _326 = textureLod(V_xsMXBLOOM_BloomTex7, _325.xy, _325.w);
	adapt = _326.w;
	return;
}
void F_xPS_Upsample1(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _335 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(7, 7));
	vec2 _336;
	vec2 _337;
	_336 = _335;
	_337 = uv;
	vec3 _338 = F_xUpsample(V_xsMXBLOOM_BloomTex7, _336, _337);
	vec3 _340 = _338 * vec3(V_xBLOOM_LAYER_MULT_7);
	vec4 _344 = vec4(_340.x, _340.y, _340.z, V_xBLOOM_LAYER_MULT_6);
	bloom = _344;
	return;
}
void F_xPS_Upsample2(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _352 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(6, 6));
	vec2 _353;
	vec2 _354;
	_353 = _352;
	_354 = uv;
	vec3 _355 = F_xUpsample(V_xsMXBLOOM_BloomTex6, _353, _354);
	vec4 _359 = vec4(_355.x, _355.y, _355.z, V_xBLOOM_LAYER_MULT_5);
	bloom = _359;
	return;
}
void F_xPS_Upsample3(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _367 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(5, 5));
	vec2 _368;
	vec2 _369;
	_368 = _367;
	_369 = uv;
	vec3 _370 = F_xUpsample(V_xsMXBLOOM_BloomTex5, _368, _369);
	vec4 _374 = vec4(_370.x, _370.y, _370.z, V_xBLOOM_LAYER_MULT_4);
	bloom = _374;
	return;
}
void F_xPS_Upsample4(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _382 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(4, 4));
	vec2 _383;
	vec2 _384;
	_383 = _382;
	_384 = uv;
	vec3 _385 = F_xUpsample(V_xsMXBLOOM_BloomTex4, _383, _384);
	vec4 _389 = vec4(_385.x, _385.y, _385.z, V_xBLOOM_LAYER_MULT_3);
	bloom = _389;
	return;
}
void F_xPS_Upsample5(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _397 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(3, 3));
	vec2 _398;
	vec2 _399;
	_398 = _397;
	_399 = uv;
	vec3 _400 = F_xUpsample(V_xsMXBLOOM_BloomTex3, _398, _399);
	vec4 _404 = vec4(_400.x, _400.y, _400.z, V_xBLOOM_LAYER_MULT_2);
	bloom = _404;
	return;
}
void F_xPS_Upsample6(
	in vec4 pos,
	in vec2 uv,
	out vec4 bloom)
{
	vec2 _412 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(2, 2));
	vec2 _413;
	vec2 _414;
	_413 = _412;
	_414 = uv;
	vec3 _415 = F_xUpsample(V_xsMXBLOOM_BloomTex2, _413, _414);
	vec4 _419 = vec4(_415.x, _415.y, _415.z, V_xBLOOM_LAYER_MULT_1);
	bloom = _419;
	return;
}
void F_xPS_Combine(
	in vec4 pos,
	in vec2 uv,
	out vec4 color)
{
	vec2 _427 = ldexp(vec2(5.20833360e-04, 9.25925910e-04), ivec2(1, 1));
	vec2 _428;
	vec2 _429;
	_428 = _427;
	_429 = uv;
	vec3 _430 = F_xUpsample(V_xsMXBLOOM_BloomTex1, _428, _429);
	vec3 bloom_431 = _430;
	vec4 _432 = vec4(V_xBLOOM_LAYER_MULT_1, V_xBLOOM_LAYER_MULT_2, V_xBLOOM_LAYER_MULT_3, V_xBLOOM_LAYER_MULT_4);
	float _434 = dot(_432, vec4(1.00000000e+00, 1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	vec3 _435 = vec3(V_xBLOOM_LAYER_MULT_5, V_xBLOOM_LAYER_MULT_6, V_xBLOOM_LAYER_MULT_7);
	float _437 = dot(_435, vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00));
	float _438 = _434 + _437;
	vec3 _440 = bloom_431 / vec3(_438);
	bloom_431 = _440;
	vec4 _441 = texture(V_xqUINT_xsBackBufferTex, uv);
	color = _441;
	vec4 _443 = texture(V_xsMXBLOOM_BloomTexAdapt, vec2(0.00000000e+00, 0.00000000e+00));
	float _446 = _443.x + 1.00000005e-03;
	float adapt_447 = _446;
	float _449 = adapt_447 * 8.00000000e+00;
	adapt_447 = _449;
	if (V_xBLOOM_ADAPT_MODE)
	{
		float _453 = 1.0 / adapt_447;
		float _455 = mix(1.00000000e+00, _453, V_xBLOOM_ADAPT_STRENGTH);
		vec3 _457 = bloom_431 * vec3(_455);
		bloom_431 = _457;
		float _458 = exp2(V_xBLOOM_ADAPT_EXPOSURE);
		vec3 _460 = bloom_431 * vec3(_458);
		bloom_431 = _460;
		vec3 _462 = color.xyz + bloom_431;
		color.xyz = _462;
	}
	else
	{
		vec3 _464 = color.xyz + bloom_431;
		color.xyz = _464;
		float _465 = 1.0 / adapt_447;
		float _467 = mix(1.00000000e+00, _465, V_xBLOOM_ADAPT_STRENGTH);
		vec3 _470 = color.xyz * vec3(_467);
		color.xyz = _470;
		float _471 = exp2(V_xBLOOM_ADAPT_EXPOSURE);
		vec3 _474 = color.xyz * vec3(_471);
		color.xyz = _474;
	}
	vec3 _477 = max(vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00), color.xyz);
	vec3 _479 = pow(_477, vec3(V_xBLOOM_TONEMAP_COMPRESSION));
	color.xyz = _479;
	vec3 _482 = vec3(1.00000000e+00, 1.00000000e+00, 1.00000000e+00) + color.xyz;
	vec3 _484 = color.xyz / _482;
	color.xyz = _484;
	float _486 = 1.00000000e+00 / V_xBLOOM_TONEMAP_COMPRESSION;
	vec3 _489 = pow(color.xyz, vec3(_486));
	color.xyz = _489;
	return;
}
#ifdef E_xPostProcessVS
layout(location = 0) out vec2 _out_uv;
void main()
{
	uint id = uint(gl_VertexID);
	vec4 vpos;
	vec2 uv;
	F_xPostProcessVS(id, vpos, uv);
	gl_Position = vpos;
	_out_uv = uv;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPS_BloomPrepass
in vec2 vv_0;
layout(location = 0) out vec4 _out_color;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 color;
	F_xPS_BloomPrepass(pos, uv, color);
	_out_color = color;
	return;
}
#endif
#ifdef E_xPS_Downsample1
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample1(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample2
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample2(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample3
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample3(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample4
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample4(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample5
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample5(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample6
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample6(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Downsample7
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Downsample7(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_AdaptStoreLast
in vec2 vv_0;
layout(location = 0) out float _out_adapt;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	float adapt;
	F_xPS_AdaptStoreLast(pos, uv, adapt);
	_out_adapt = adapt;
	return;
}
#endif
#ifdef E_xPS_Upsample1
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample1(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Upsample2
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample2(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Upsample3
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample3(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Upsample4
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample4(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Upsample5
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample5(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Upsample6
in vec2 vv_0;
layout(location = 0) out vec4 _out_bloom;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 bloom;
	F_xPS_Upsample6(pos, uv, bloom);
	_out_bloom = bloom;
	return;
}
#endif
#ifdef E_xPS_Combine
in vec2 vv_0;
layout(location = 0) out vec4 _out_color;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 uv = vv_0;
	vec4 color;
	F_xPS_Combine(pos, uv, color);
	_out_color = color;
	return;
}
#endif
