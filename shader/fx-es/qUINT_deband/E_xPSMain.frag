#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xPSMain
#define fma(a, b, c) ((a) * (b) + (c))
#define ldexp(x, e) ((x) * exp2(float(e)))
uniform float V_xSEARCH_RADIUS;
uniform int V_xBIT_DEPTH;
uniform bool V_xAUTOMATE_BIT_DEPTH;
uniform int V_xDEBAND_MODE;
uniform bool V_xSKY_ONLY;
uniform float V_xqUINT_xFRAME_TIME;
uniform int V_xqUINT_xFRAME_COUNT;

uniform sampler2D V_xqUINT_xsBackBufferTex;
uniform sampler2D V_xqUINT_xsDepthBufferTex;
struct S_xVSOUT
{
	vec4 vpos;
	vec2 uv;
};
S_xVSOUT _89;
vec2 F_xqUINT_xdepthtex_uv(
	in vec2 uv)
{
	float _17 = uv.x / 1.00000000e+00;
	uv[0] = _17;
	float _20 = uv.y / 1.00000000e+00;
	uv[1] = _20;
	float _23 = uv.x - 0.00000000e+00;
	uv[0] = _23;
	float _26 = uv.y + 0.00000000e+00;
	uv[1] = _26;
	return uv;
}
float F_xqUINT_xget_depth(
	in vec2 uv)
{
	vec2 _30;
	_30 = uv;
	vec2 _31 = F_xqUINT_xdepthtex_uv(_30);
	vec4 _36 = vec4(_31.x, _31.y, 0.00000000e+00, 0.00000000e+00);
	vec4 _37 = textureLod(V_xqUINT_xsDepthBufferTex, _36.xy, _36.w);
	float depth = _37.x;
	return depth;
}
float F_xqUINT_xlinearize_depth(
	in float depth)
{
	float _44 = depth * 1.00000000e+00;
	depth = _44;
	float _46 = 1.00000000e+00 - depth;
	depth = _46;
	float _48 = depth * 9.99000000e+02;
	float _50 = 1.00000000e+03 - _48;
	float _51 = depth / _50;
	depth = _51;
	float _52 = clamp(depth, 0.0, 1.0);
	return _52;
}
float F_xqUINT_xlinear_depth(
	in vec2 uv)
{
	vec2 _56;
	_56 = uv;
	float _57 = F_xqUINT_xget_depth(_56);
	float depth_58 = _57;
	float _59;
	_59 = depth_58;
	float _60 = F_xqUINT_xlinearize_depth(_59);
	depth_58 = _60;
	return depth_58;
}
void F_xPostProcessVS(
	in uint id,
	out vec4 vpos,
	out vec2 uv)
{
	bool _67 = id == 2u;
	float _70 = _67 ? 2.00000000e+00 : 0.00000000e+00;
	uv[0] = _70;
	bool _72 = id == 1u;
	float _75 = _72 ? 2.00000000e+00 : 0.00000000e+00;
	uv[1] = _75;
	vec2 _77 = uv * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _79 = _77 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _84 = vec4(_79.x, _79.y, 0.00000000e+00, 1.00000000e+00);
	vpos = _84;
	return;
}
S_xVSOUT F_xVSMain(
	in uint id)
{
	S_xVSOUT o = _89;
	uint _91;
	vec4 _92;
	vec2 _93;
	_91 = id;
	F_xPostProcessVS(_91, _92, _93);
	o.vpos = _92;
	o.uv = _93;
	return o;
}
void F_xPSMain(
	in S_xVSOUT i,
	out vec3 o)
{
	vec4 _100 = texture(V_xqUINT_xsBackBufferTex, i.uv);
	o = _100.xyz;
	float _104 = dot(vec2(7.54877687e-01, 5.69840312e-01), vec2(1.00000000e+00, 1.00000000e+00));
	vec3 _107 = vec3(0.00000000e+00, 2.50000004e-02, 1.25000002e-02) * vec3(_104);
	vec3 magicadd = _107;
	float _111 = dot(i.vpos.xy, vec2(7.54877687e-01, 5.69840312e-01));
	vec3 _113 = vec3(_111) + magicadd;
	vec3 _114 = fract(_113);
	vec3 dither = _114;
	if (V_xSKY_ONLY)
	{
		vec2 _122;
		_122 = i.uv;
		float _124 = F_xqUINT_xlinear_depth(_122);
		bool _126 = _124 < 9.80000019e-01;
		if (_126)
		{
			return;
		}
	}
	int _128 = V_xAUTOMATE_BIT_DEPTH ? 8 : V_xBIT_DEPTH;
	float bit_depth = float(_128);
	float _131 = exp2(bit_depth);
	float _133 = _131 - 1.00000000e+00;
	float _134 = 1.0 / _133;
	float lsb = _134;
	bool _140 = V_xDEBAND_MODE == 2;
	if (_140)
	{
		vec2 shift = vec2(0.00000000e+00, 0.00000000e+00);
		float _145 = 1.92850403e+02 * dither.x;
		float _146;
		float _147;
		_146 = sin(_145), _147 = cos(_145);
		shift[0] = _146;
		shift[1] = _147;
		float _150 = sqrt(dither.y);
		vec2 _152 = shift * vec2(_150);
		shift = _152;
		vec2 _154 = shift * vec2(2.50000004e-02, 2.50000004e-02);
		vec2 _156 = _154 * vec2(V_xSEARCH_RADIUS);
		vec2 _158 = i.uv + _156;
		vec4 _163 = vec4(_158.x, _158.y, 0.00000000e+00, 0.00000000e+00);
		vec4 _164 = textureLod(V_xqUINT_xsBackBufferTex, _163.xy, _163.w);
		vec3 scatter = _164.xyz;
		vec4 diff = vec4(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
		vec3 _170 = o.xyz - scatter;
		vec3 _171 = abs(_170);
		diff.xyz = _171;
		float _174 = max(diff.x, diff.y);
		float _176 = max(_174, diff.z);
		diff[3] = _176;
		bool _178 = diff.w <= lsb;
		vec3 _180 = mix(o, scatter, vec3(bvec3(_178)));
		o = _180;
	}
	else
	{
		bool _185 = V_xDEBAND_MODE == 1;
		if (_185)
		{
			vec3 _187 = dither - vec3(5.00000000e-01, 5.00000000e-01, 5.00000000e-01);
			vec3 _189 = _187 * vec3(lsb);
			vec3 _190 = o + _189;
			o = _190;
		}
	}
	return;
}
#ifdef E_xVSMain
layout(location = 0) out vec2 _return_uv;
void main()
{
	uint id = uint(gl_VertexID);
	S_xVSOUT _return = F_xVSMain(id);
	gl_Position = _return.vpos;
	_return_uv = _return.uv;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xPSMain
in vec2 vv_0;
layout(location = 0) out vec3 _out_o;
void main()
{
	S_xVSOUT _in_i = S_xVSOUT(gl_FragCoord, vv_0);
	S_xVSOUT i = _in_i;
	vec3 o;
	F_xPSMain(i, o);
	_out_o = o;
	return;
}
#endif
