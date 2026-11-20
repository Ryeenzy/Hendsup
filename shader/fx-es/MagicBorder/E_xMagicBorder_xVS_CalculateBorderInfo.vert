#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
#define E_xMagicBorder_xVS_CalculateBorderInfo
#define dFdx(x) (x)
#define dFdy(x) (x)
#define fwidth(x) (x)
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
uniform float V_xMagicBorder_xLeftTopCornerDepth;
uniform float V_xMagicBorder_xRightTopCornerDepth;
uniform float V_xMagicBorder_xRightBottomCornerDepth;
uniform float V_xMagicBorder_xLeftBottomCornerDepth;
uniform bool V_xMagicBorder_xShowDepths;
uniform vec2 V_xMagicBorder_xPictureFrameLeftTop;
uniform vec2 V_xMagicBorder_xPictureFrameRightTop;
uniform vec2 V_xMagicBorder_xPictureFrameRightBottom;
uniform vec2 V_xMagicBorder_xPictureFrameLeftBottom;
uniform vec4 V_xMagicBorder_xBorderColor;
uniform vec4 V_xMagicBorder_xPictureFrameColor;

uniform sampler2D V_xReShade_xBackBuffer;
uniform sampler2D V_xReShade_xDepthBuffer;
struct S_xMagicBorder_xVSBORDERINFO
{
	vec4 vpos;
	vec2 Texcoord;
	vec2 LeftTop;
	vec2 RightTop;
	vec2 RightBottom;
	vec2 LeftBottom;
};
const vec2 _130[4] = vec2[4](vec2(0.00000000e+00, 0.00000000e+00), vec2(0.00000000e+00, 0.00000000e+00), vec2(0.00000000e+00, 0.00000000e+00), vec2(0.00000000e+00, 0.00000000e+00));
S_xMagicBorder_xVSBORDERINFO _200;
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
float F_xMagicBorder_xCalculateDepthOfFrameAtCoord(
	in S_xMagicBorder_xVSBORDERINFO info)
{
	vec2 coord = info.Texcoord;
	float _79 = distance(vec2(0.00000000e+00, 0.00000000e+00), coord);
	float _81 = 1.00000000e+00 - _79;
	float distanceToCorner = _81;
	float _84 = V_xMagicBorder_xLeftTopCornerDepth / 1.00000000e+03;
	float _85 = _84 * distanceToCorner;
	vec2 _86 = vec2(_85, distanceToCorner);
	vec2 average = _86;
	float _89 = distance(vec2(1.00000000e+00, 0.00000000e+00), coord);
	float _91 = 1.00000000e+00 - _89;
	distanceToCorner = _91;
	float _93 = V_xMagicBorder_xRightTopCornerDepth / 1.00000000e+03;
	float _94 = _93 * distanceToCorner;
	float _96 = average.x + _94;
	average[0] = _96;
	float _98 = average.y + distanceToCorner;
	average[1] = _98;
	float _100 = distance(vec2(1.00000000e+00, 1.00000000e+00), coord);
	float _102 = 1.00000000e+00 - _100;
	distanceToCorner = _102;
	float _104 = V_xMagicBorder_xRightBottomCornerDepth / 1.00000000e+03;
	float _105 = _104 * distanceToCorner;
	float _107 = average.x + _105;
	average[0] = _107;
	float _109 = average.y + distanceToCorner;
	average[1] = _109;
	float _111 = distance(vec2(0.00000000e+00, 1.00000000e+00), coord);
	float _113 = 1.00000000e+00 - _111;
	distanceToCorner = _113;
	float _115 = V_xMagicBorder_xLeftBottomCornerDepth / 1.00000000e+03;
	float _116 = _115 * distanceToCorner;
	float _118 = average.x + _116;
	average[0] = _118;
	float _120 = average.y + distanceToCorner;
	average[1] = _120;
	float _123 = average.x / average.y;
	float _124 = clamp(_123, 0.0, 1.0);
	return _124;
}
bool F_xMagicBorder_xIsCoordInPictureArea(
	in S_xMagicBorder_xVSBORDERINFO info)
{
	bool isInPictureArea = false;
	vec2 vertices[4] = _130;
	vertices[0] = info.LeftTop;
	vertices[1] = info.RightTop;
	vertices[2] = info.RightBottom;
	vertices[3] = info.LeftBottom;
	int next = 0;
	int current = 0;
	while (current < 4)
	{
		{
			int _151 = current + 1;
			next = _151;
			bool _156 = next == 4;
			if (_156)
			{
				next = 0;
			}
			vec2 vc = vertices[int(current)];
			vec2 vn = vertices[int(next)];
			bool _167 = vc.y >= info.Texcoord.y;
			bool _170 = vn.y < info.Texcoord.y;
			bool _171 = _167 && _170;
			bool _174 = vc.y < info.Texcoord.y;
			bool _177 = vn.y >= info.Texcoord.y;
			bool _178 = _174 && _177;
			bool _179 = _171 || _178;
			float _182 = vn.x - vc.x;
			float _185 = info.Texcoord.y - vc.y;
			float _186 = _182 * _185;
			float _189 = vn.y - vc.y;
			float _190 = _186 / _189;
			float _192 = _190 + vc.x;
			bool _194 = info.Texcoord.x < _192;
			bool _195 = _179 && _194;
			if (_195)
			{
				bool _196 = !bool(isInPictureArea);
				isInPictureArea = _196;
			}
		}
		int _148 = current;
		int _149 = _148 + 1;
		current = _149;
	}
	return isInPictureArea;
}
S_xMagicBorder_xVSBORDERINFO F_xMagicBorder_xVS_CalculateBorderInfo(
	in uint id)
{
	S_xMagicBorder_xVSBORDERINFO borderInfo = _200;
	bool _203 = id == 2u;
	float _206 = _203 ? 2.00000000e+00 : 0.00000000e+00;
	borderInfo.Texcoord[0] = _206;
	bool _208 = id == 1u;
	float _211 = _208 ? 2.00000000e+00 : 0.00000000e+00;
	borderInfo.Texcoord[1] = _211;
	vec2 _214 = borderInfo.Texcoord * vec2(2.00000000e+00, -2.00000000e+00);
	vec2 _216 = _214 + vec2(-1.00000000e+00, 1.00000000e+00);
	vec4 _221 = vec4(_216.x, _216.y, 0.00000000e+00, 1.00000000e+00);
	borderInfo.vpos = _221;
	borderInfo.LeftTop = V_xMagicBorder_xPictureFrameLeftTop;
	borderInfo.RightTop = V_xMagicBorder_xPictureFrameRightTop;
	borderInfo.LeftBottom = V_xMagicBorder_xPictureFrameLeftBottom;
	borderInfo.RightBottom = V_xMagicBorder_xPictureFrameRightBottom;
	return borderInfo;
}
void F_xMagicBorder_xPS_DrawBorder(
	in S_xMagicBorder_xVSBORDERINFO borderInfo,
	out vec4 fragment)
{
	vec4 _227 = texture(V_xReShade_xBackBuffer, borderInfo.Texcoord);
	vec4 originalFragment = _227;
	vec2 _229;
	_229 = borderInfo.Texcoord;
	float _231 = F_xReShade_xGetLinearizedDepth(_229);
	float depthFragment = _231;
	S_xMagicBorder_xVSBORDERINFO _233;
	_233 = borderInfo;
	bool _234 = F_xMagicBorder_xIsCoordInPictureArea(_233);
	bool isInPictureArea_235 = _234;
	S_xMagicBorder_xVSBORDERINFO _236;
	_236 = borderInfo;
	float _237 = F_xMagicBorder_xCalculateDepthOfFrameAtCoord(_236);
	float depthOfFrameAtCoord = _237;
	vec4 _240 = compCond(bvec4(isInPictureArea_235), V_xMagicBorder_xPictureFrameColor, V_xMagicBorder_xBorderColor);
	fragment = _240;
	bool _241 = depthFragment > depthOfFrameAtCoord;
	vec4 _243 = mix(originalFragment, fragment, vec4(fragment.w));
	vec4 _245 = compCond(bvec4(_241), _243, originalFragment);
	fragment = _245;
	vec4 _247 = vec4(depthOfFrameAtCoord, depthOfFrameAtCoord, depthOfFrameAtCoord, 1.00000000e+00);
	vec4 _249 = compCond(bvec4(V_xMagicBorder_xShowDepths), _247, fragment);
	fragment = _249;
	return;
}
#ifdef E_xMagicBorder_xVS_CalculateBorderInfo
out vec2 vv_0;
out vec2 vv_1;
out vec2 vv_2;
out vec2 vv_3;
out vec2 vv_4;
void main()
{
	uint id = uint(gl_VertexID);
	S_xMagicBorder_xVSBORDERINFO _return = F_xMagicBorder_xVS_CalculateBorderInfo(id);
	gl_Position = _return.vpos;
	vv_0 = _return.Texcoord;
	vv_1 = _return.LeftTop;
	vv_2 = _return.RightTop;
	vv_3 = _return.RightBottom;
	vv_4 = _return.LeftBottom;
	gl_Position.y = -gl_Position.y;
	return;
}
#endif
#ifdef E_xMagicBorder_xPS_DrawBorder
in vec2 vv_0;
in vec2 vv_1;
in vec2 vv_2;
in vec2 vv_3;
in vec2 vv_4;
out vec4 vv_0;
void main()
{
	S_xMagicBorder_xVSBORDERINFO _in_borderInfo = S_xMagicBorder_xVSBORDERINFO(gl_FragCoord, vv_0, vv_1, vv_2, vv_3, vv_4);
	S_xMagicBorder_xVSBORDERINFO borderInfo = _in_borderInfo;
	vec4 fragment;
	F_xMagicBorder_xPS_DrawBorder(borderInfo, fragment);
	vv_0 = fragment;
	return;
}
#endif
