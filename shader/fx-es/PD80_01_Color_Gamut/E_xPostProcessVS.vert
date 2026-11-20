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
uniform int V_xpd80_colorconversion_xcolorgamut;

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
vec3 F_xpd80_colorconversion_xLinearTosRGB(
	in vec3 color)
{
	vec3 _66 = color * vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x = _66;
	vec3 _68 = clamp(color, 0.0, 1.0);
	vec3 _70 = pow(_68, vec3(4.16666657e-01, 4.16666657e-01, 4.16666657e-01));
	vec3 _72 = vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00) * _70;
	vec3 _74 = _72 - vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 y = _74;
	vec3 clr = color;
	bool _79 = color.x < 3.13080009e-03;
	float _82 = _79 ? x.x : y.x;
	clr[0] = _82;
	bool _85 = color.y < 3.13080009e-03;
	float _88 = _85 ? x.y : y.y;
	clr[1] = _88;
	bool _91 = color.z < 3.13080009e-03;
	float _94 = _91 ? x.z : y.z;
	clr[2] = _94;
	return clr;
}
vec3 F_xpd80_colorconversion_xSRGBToLinear(
	in vec3 color)
{
	vec3 _99 = color / vec3(1.29200001e+01, 1.29200001e+01, 1.29200001e+01);
	vec3 x_100 = _99;
	vec3 _102 = color + vec3(5.49999997e-02, 5.49999997e-02, 5.49999997e-02);
	vec3 _104 = _102 / vec3(1.05499995e+00, 1.05499995e+00, 1.05499995e+00);
	vec3 _106 = max(_104, vec3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00));
	vec3 _108 = pow(_106, vec3(2.40000010e+00, 2.40000010e+00, 2.40000010e+00));
	vec3 y_109 = _108;
	vec3 clr_110 = color;
	bool _113 = color.x <= 4.04499993e-02;
	float _116 = _113 ? x_100.x : y_109.x;
	clr_110[0] = _116;
	bool _119 = color.y <= 4.04499993e-02;
	float _122 = _119 ? x_100.y : y_109.y;
	clr_110[1] = _122;
	bool _125 = color.z <= 4.04499993e-02;
	float _128 = _125 ? x_100.z : y_109.z;
	clr_110[2] = _128;
	return clr_110;
}
vec4 F_xpd80_colorconversion_xPS_ColorConversion(
	in vec4 pos,
	in vec2 texcoord)
{
	vec4 _133 = texture(V_xReShade_xBackBuffer, texcoord);
	vec4 color_134 = _133;
	vec3 _135;
	_135 = color_134.xyz;
	vec3 _137 = F_xpd80_colorconversion_xSRGBToLinear(_135);
	color_134.xyz = _137;
	vec3 _140 = (color_134.xyz * mat3x3(4.12456393e-01, 3.57576102e-01, 1.80437505e-01, 2.12672904e-01, 7.15152204e-01, 7.21750036e-02, 1.93339009e-02, 1.19191997e-01, 9.50304091e-01));
	color_134.xyz = _140;
	mat3x3 gamut = mat3x3(0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00);
	switch (V_xpd80_colorconversion_xcolorgamut)
	{
	case 0: {
		gamut = mat3x3(3.24045420e+00, -1.53713846e+00, -4.98531401e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 5.56433983e-02, -2.04025894e-01, 1.05722523e+00);
		break;
	}
	case 1: {
		gamut = mat3x3(2.04136896e+00, -5.64946413e-01, -3.44694406e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 1.34474002e-02, -1.18389703e-01, 1.01540959e+00);
		break;
	}
	case 2: {
		gamut = mat3x3(2.95153737e+00, -1.28941154e+00, -4.73844498e-01, -1.08510935e+00, 1.99085665e+00, 3.72026004e-02, 8.54934007e-02, -2.69496411e-01, 1.09129751e+00);
		break;
	}
	case 3: {
		gamut = mat3x3(1.75525987e+00, -4.83678609e-01, -2.52999991e-01, -5.44133604e-01, 1.50687885e+00, 2.15527993e-02, 6.34669978e-03, -1.75761003e-02, 1.22569585e+00);
		break;
	}
	case 4: {
		gamut = mat3x3(1.68322694e+00, -4.28236306e-01, -2.36018494e-01, -7.71022916e-01, 1.70655715e+00, 4.46900018e-02, 4.00012992e-02, -8.85376036e-02, 1.27236402e+00);
		break;
	}
	case 5: {
		gamut = mat3x3(2.74546695e+00, -1.13581359e+00, -4.35026914e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 1.12723000e-02, -1.13975398e-01, 1.01325405e+00);
		break;
	}
	case 6: {
		gamut = mat3x3(2.37067437e+00, -9.00040507e-01, -4.70633805e-01, -5.13885021e-01, 1.42530358e+00, 8.85813981e-02, 5.29820006e-03, -1.46949003e-02, 1.00939679e+00);
		break;
	}
	case 7: {
		gamut = mat3x3(2.64228749e+00, -1.22342706e+00, -3.93014312e-01, -1.11197627e+00, 2.05901837e+00, 1.59613993e-02, 8.21698979e-02, -2.80725390e-01, 1.45598769e+00);
		break;
	}
	case 8: {
		gamut = mat3x3(1.76039016e+00, -4.88119811e-01, -2.53612608e-01, -7.12628782e-01, 1.65274322e+00, 4.16714996e-02, 7.82070030e-03, -3.47410999e-02, 1.24477434e+00);
		break;
	}
	case 9: {
		gamut = mat3x3(1.78276181e+00, -4.96984690e-01, -2.69010097e-01, -9.59362328e-01, 1.94779623e+00, -2.75807008e-02, 8.59317034e-02, -1.74467400e-01, 1.32282734e+00);
		break;
	}
	case 10: {
		gamut = mat3x3(2.00438190e+00, -7.30484426e-01, -2.45005205e-01, -7.11028516e-01, 1.62021255e+00, 7.92227015e-02, 3.81263010e-02, -8.68780017e-02, 1.27254379e+00);
		break;
	}
	case 11: {
		gamut = mat3x3(1.90999615e+00, -5.32454193e-01, -2.88209110e-01, -9.84666288e-01, 1.99917102e+00, -2.83081997e-02, 5.83055988e-02, -1.18378103e-01, 8.97553504e-01);
		break;
	}
	case 12: {
		gamut = mat3x3(3.06289721e+00, -1.39317906e+00, -4.75751698e-01, -9.69265997e-01, 1.87601078e+00, 4.15560007e-02, 6.78775012e-02, -2.28854805e-01, 1.06934905e+00);
		break;
	}
	case 13: {
		gamut = mat3x3(1.34594333e+00, -2.55607486e-01, -5.11117987e-02, -5.44598877e-01, 1.50816727e+00, 2.05351003e-02, 0.00000000e+00, 0.00000000e+00, 1.21181285e+00);
		break;
	}
	case 14: {
		gamut = mat3x3(3.50539589e+00, -1.73948944e+00, -5.43964028e-01, -1.06907225e+00, 1.97782445e+00, 3.51722017e-02, 5.63200004e-02, -1.97022602e-01, 1.05020261e+00);
		break;
	}
	case 15: {
		gamut = mat3x3(1.46280670e+00, -1.84062302e-01, -2.74360597e-01, -5.21793306e-01, 1.44723809e+00, 6.77227005e-02, 3.49342003e-02, -9.68929976e-02, 1.28840995e+00);
		break;
	}
	}
	mat3x3 refwhitemat = mat3x3(1.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 1.00000000e+00, 0.00000000e+00, 0.00000000e+00, 0.00000000e+00, 1.00000000e+00);
	bool _182 = V_xpd80_colorconversion_xcolorgamut == 3;
	if (_182)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _188 = V_xpd80_colorconversion_xcolorgamut == 4;
	if (_188)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _194 = V_xpd80_colorconversion_xcolorgamut == 6;
	if (_194)
	{
		refwhitemat = mat3x3(1.05026162e+00, 2.70757005e-02, -2.32523009e-02, 3.90649997e-02, 9.72950220e-01, -9.25789960e-03, -2.40470003e-03, 2.64460011e-03, 9.18087006e-01);
	}
	bool _200 = V_xpd80_colorconversion_xcolorgamut == 7;
	if (_200)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _206 = V_xpd80_colorconversion_xcolorgamut == 8;
	if (_206)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _212 = V_xpd80_colorconversion_xcolorgamut == 9;
	if (_212)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _218 = V_xpd80_colorconversion_xcolorgamut == 10;
	if (_218)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _224 = V_xpd80_colorconversion_xcolorgamut == 11;
	if (_224)
	{
		refwhitemat = mat3x3(1.00977850e+00, 7.04189995e-03, 1.27970995e-02, 1.23113003e-02, 9.84709382e-01, 3.29619995e-03, 3.82840005e-03, -7.23310001e-03, 1.08916390e+00);
	}
	bool _230 = V_xpd80_colorconversion_xcolorgamut == 13;
	if (_230)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	bool _236 = V_xpd80_colorconversion_xcolorgamut == 15;
	if (_236)
	{
		refwhitemat = mat3x3(1.04781115e+00, 2.28866003e-02, -5.01269996e-02, 2.95423996e-02, 9.90484416e-01, -1.70491003e-02, -9.23450012e-03, 1.50436005e-02, 7.52131581e-01);
	}
	vec3 _239 = (color_134.xyz * refwhitemat);
	vec3 _240 = (_239 * gamut);
	color_134.xyz = _240;
	vec3 _241;
	_241 = color_134.xyz;
	vec3 _243 = F_xpd80_colorconversion_xLinearTosRGB(_241);
	color_134.xyz = _243;
	vec4 _248 = vec4(color_134.xyz.x, color_134.xyz.y, color_134.xyz.z, 1.00000000e+00);
	return _248;
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
#ifdef E_xpd80_colorconversion_xPS_ColorConversion
out vec4 vv_0;
in vec2 vv_0;
void main()
{
	vec4 pos = gl_FragCoord;
	vec2 texcoord = vv_0;
	vv_0 = F_xpd80_colorconversion_xPS_ColorConversion(pos, texcoord);
	return;
}
#endif
