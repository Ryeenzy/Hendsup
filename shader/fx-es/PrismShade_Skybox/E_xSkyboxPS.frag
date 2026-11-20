#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xSkyboxPS
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
uniform float V_xRotation;
uniform float V_xHorizonShift;
uniform float V_xExposure;
uniform vec3 V_xTint;
uniform float V_xSaturation;
uniform float V_xContrast;
uniform float V_xOpacity;
uniform float V_xEdgeBlend;
uniform int V_xDebug;
uniform bool V_xCameraKnown;
uniform vec3 V_xCameraRight;
uniform vec3 V_xCameraUp;
uniform vec3 V_xCameraForward;
uniform vec2 V_xCameraFocal;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
uniform sampler2D V_xSkyboxSampler;
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
float F_xIsSky(
	in vec2 uv)
{
	vec2 _80;
	_80 = uv;
	float _81 = F_xReShade_xGetLinearizedDepth(_80);
	bool _83 = _81 >= 9.99949992e-01;
	float _86 = _83 ? 1.00000000e+00 : 0.00000000e+00;
	return _86;
}
vec3 F_xViewDirection(
	in vec2 uv)
{
	float _92 = uv.x * 2.00000000e+00;
	float _94 = _92 - 1.00000000e+00;
	float _97 = uv.y * 2.00000000e+00;
	float _99 = 1.00000000e+00 - _97;
	vec2 _100 = vec2(_94, _99);
	vec2 ndc = _100;
	vec3 _103 = vec3(ndc.x) * V_xCameraRight;
	vec3 _105 = _103 / vec3(V_xCameraFocal.x);
	vec3 _106 = V_xCameraForward + _105;
	vec3 _108 = vec3(ndc.y) * V_xCameraUp;
	vec3 _110 = _108 / vec3(V_xCameraFocal.y);
	vec3 _111 = _106 + _110;
	vec3 _112 = normalize(_111);
	return _112;
}
vec4 F_xSamplePanorama(
	in vec3 direction)
{
	float _117 = -(direction.z);
	float _119 = atan(direction.x, _117);
	float _120 = radians(V_xRotation);
	float _121 = _119 + _120;
	float yaw = _121;
	float _126 = clamp(direction.y, -1.00000000e+00, 1.00000000e+00);
	float _127 = asin(_126);
	float _128 = radians(V_xHorizonShift);
	float _129 = _127 - _128;
	float pitch = _129;
	float _132 = yaw / 6.28318548e+00;
	float _134 = _132 + 5.00000000e-01;
	float _136 = pitch / 3.14159274e+00;
	float _138 = 5.00000000e-01 - _136;
	vec2 _139 = vec2(_134, _138);
	vec2 panorama_uv = _139;
	ivec2 _142 = textureSize(V_xSkyboxSampler, 0);
	vec2 size = vec2(_142);
	float _147 = max(V_xCameraFocal.y, 1.00000005e-03);
	float _149 = _147 * 1.08000000e+03;
	float _151 = 2.00000000e+00 / _149;
	float pixel_angle = _151;
	float _155 = max(size.x, 1.00000000e+00);
	float _157 = 6.28318548e+00 / _155;
	float texel_angle = _157;
	float _159 = pixel_angle / texel_angle;
	float _160 = log2(_159);
	float _162 = max(_160, 0.00000000e+00);
	float level = _162;
	vec4 _167 = vec4(panorama_uv.x, panorama_uv.y, 0.00000000e+00, level);
	vec4 _168 = textureLod(V_xSkyboxSampler, _167.xy, _167.w);
	return _168;
}
vec3 F_xGradePanorama(
	in vec3 color)
{
	float _172 = exp2(V_xExposure);
	vec3 _174 = vec3(_172) * V_xTint;
	vec3 _175 = color * _174;
	color = _175;
	float _177 = dot(color, vec3(2.12599993e-01, 7.15200007e-01, 7.22000003e-02));
	float luma = _177;
	vec3 _181 = mix(vec3(luma), color, vec3(V_xSaturation));
	color = _181;
	vec3 _183 = max(color, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _185 = _183 / vec3(1.80000007e-01, 1.80000007e-01, 1.80000007e-01);
	vec3 _187 = pow(_185, vec3(V_xContrast));
	vec3 _189 = vec3(1.80000007e-01, 1.80000007e-01, 1.80000007e-01) * _187;
	color = _189;
	return color;
}
vec4 F_xSkyboxPS(
	in vec4 position,
	in vec2 uv)
{
	vec4 _194 = texture(V_xReShade_xBackBuffer, uv);
	vec3 scene = _194.xyz;
	vec2 _197;
	_197 = uv;
	float _198 = F_xIsSky(_197);
	float sky = _198;
	bool _204 = V_xDebug == 1;
	if (_204)
	{
		vec4 _209 = vec4(vec3(sky).x, vec3(sky).y, vec3(sky).z, 1.00000000e+00);
		vec4 _213 = vec4(sky, 0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
		vec4 _215 = compCond(bvec4(V_xCameraKnown), _209, _213);
		return _215;
	}
	bool _219 = !bool(V_xCameraKnown);
	if (_219)
	{
		vec4 _224 = vec4(scene.x, scene.y, scene.z, 1.00000000e+00);
		return _224;
	}
	float weight = sky;
	bool _230 = sky < 5.00000000e-01;
	bool _232 = V_xDebug == 0;
	bool _233 = _230 && _232;
	if (_233)
	{
		vec2 pixel = vec2(5.20833360e-04, 9.25925910e-04);
		vec2 _238 = vec2(pixel.x, 0.00000000e+00);
		vec2 _239 = uv + _238;
		vec2 _240;
		_240 = _239;
		float _241 = F_xIsSky(_240);
		vec2 _244 = vec2(pixel.x, 0.00000000e+00);
		vec2 _245 = uv - _244;
		vec2 _246;
		_246 = _245;
		float _247 = F_xIsSky(_246);
		float _248 = _241 + _247;
		vec2 _251 = vec2(0.00000000e+00, pixel.y);
		vec2 _252 = uv + _251;
		vec2 _253;
		_253 = _252;
		float _254 = F_xIsSky(_253);
		float _255 = _248 + _254;
		vec2 _258 = vec2(0.00000000e+00, pixel.y);
		vec2 _259 = uv - _258;
		vec2 _260;
		_260 = _259;
		float _261 = F_xIsSky(_260);
		float _262 = _255 + _261;
		float neighbours = _262;
		float _265 = V_xEdgeBlend * 5.00000000e-01;
		float _266 = _265 * neighbours;
		float _268 = _266 * 2.50000000e-01;
		weight = _268;
	}
	bool _273 = V_xDebug == 2;
	if (_273)
	{
		weight = 1.00000000e+00;
	}
	bool _279 = weight <= 0.00000000e+00;
	if (_279)
	{
		vec4 _284 = vec4(scene.x, scene.y, scene.z, 1.00000000e+00);
		return _284;
	}
	vec2 _285;
	_285 = uv;
	vec3 _286 = F_xViewDirection(_285);
	vec3 _287;
	_287 = _286;
	vec4 _288 = F_xSamplePanorama(_287);
	vec4 panorama = _288;
	vec3 _290;
	_290 = panorama.xyz;
	vec3 _292 = F_xGradePanorama(_290);
	vec3 _293 = clamp(_292, 0.0, 1.0);
	vec3 _295 = pow(_293, vec3(4.54545438e-01, 4.54545438e-01, 4.54545438e-01));
	vec3 sky_color = _295;
	bool _298 = V_xDebug == 2;
	float _300 = _298 ? 1.00000000e+00 : V_xOpacity;
	float _302 = panorama.w * _300;
	float _303 = weight * _302;
	weight = _303;
	vec3 _305 = mix(scene, sky_color, vec3(weight));
	vec4 _310 = vec4(_305.x, _305.y, _305.z, 1.00000000e+00);
	return _310;
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
#ifdef E_xSkyboxPS
layout(location = 0) out vec4 _return;
in vec2 vv_0;
void main()
{
	vec4 position = gl_FragCoord;
	vec2 uv = vv_0;
	_return = F_xSkyboxPS(position, uv);
	return;
}
#endif
