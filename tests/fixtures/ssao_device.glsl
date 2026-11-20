#version 300 es
precision highp float;
precision highp int;

struct ScreenSpaceSSAOCB
{
    vec4 TextureSize;
    vec4 ViewportScale;
    vec4 SSAOParams;
    vec4 SSAOFilterParams;
    vec4 Params3_UNUSED;
    vec4 Params4_UNUSED;
    vec3 ViewSpaceScale;
    float isPerspective;
    vec3 ViewSpaceBias;
    float swapScreenAxes;
    float DepthLinearizeScale_DEPRECATED;
    float DepthLinearizeBias_DEPRECATED;
    vec2 Params7_pad_UNUSED;
    vec2 ViewReconstructX_DEPRECATED;
    vec2 ViewReconstructY_DEPRECATED;
    vec4 screenCaptureRotation_UNUSED;
    vec4 Bloom_UNUSED;
    vec2 Texture0UVClamp;
    vec2 Texture1UVClamp_UNUSED;
    vec2 Texture2UVClamp;
    vec2 Texture3UVClamp;
    vec2 Texture4UVClamp_UNUSED;
    vec2 Texture5UVClamp_UNUSED;
    vec2 Texture6UVClamp_UNUSED;
    vec2 padding_UNUSED;
    vec4 WatermarkParams_UNUSED;
    vec4 WatermarkParams2_UNUSED;
};

layout(std140) uniform block_CB1 { vec4 CB1[18]; };
uniform highp sampler2D depthBufferTexture;
uniform highp sampler2D randMapTexture;

in vec2 VARYING0;
layout(location = 0) out vec4 _entryPointOutput;

void main()
{
    vec4 _374 = textureLod(depthBufferTexture, VARYING0, 0.0);
    float _375 = _374.x;
    vec4 _386 = texture(randMapTexture, fract((VARYING0 * CB1[0].xy) * vec2(0.25)));
    vec4 _389 = (_386 * 2.0) - vec4(1.0);
    float _391 = _389.y;
    mat2 _407 = mat2(vec2(_391, _389.x), vec2(-_389.x, _391));
    vec2 _422 = clamp(CB1[2].xy * (0.0040000001899898052215576171875 / _375), CB1[0].zw * 10.0, CB1[0].zw * 100.0);
    float _432 = log2(0.100000001490116119384765625 * length(_422 * CB1[0].xy)) - 2.0;
    float _566;
    float _567;
    vec2 _600;
    _600 = vec2(0.0);
    _567 = 2.0;
    _566 = 1.0;
    for (int _564 = 0; _564 < 8; )
    {
        float _439 = float(_564);
        float _538 = _439 + 1.0;
        float _539 = _538 * 0.100000001490116119384765625;
        float _547 = _439 * 0.78539812564849853515625;
        float _453 = _538 * 0.010000000707805156707763671875;
        vec2 _458 = ((vec2(cos(_547), sin(_547)) * _539) * _407) * _422;
        vec2 _593 = _600;
        _593.x = textureLod(depthBufferTexture, VARYING0 + _458, _432).x;
        vec2 _595 = _593;
        _595.y = textureLod(depthBufferTexture, VARYING0 - _458, _432).x;
        vec2 _487 = ((_595 - vec2(_375)) * (124.99999237060546875 / sqrt(1.0 - (_539 * _539)))) + vec2(0.5);
        float _489 = _487.x;
        float _491 = _487.y;
        float _494 = clamp(min(_489, _491) + 0.75, 0.0, 1.0);
        _600 = _595;
        _567 += (2.0 * _494);
        _566 += ((clamp(_489 + _453, 0.0, 1.0) + clamp(_491 + _453, 0.0, 1.0)) * _494);
        _564++;
        continue;
    }
    _entryPointOutput = vec4((_375 > 0.9900000095367431640625) ? 1.0 : pow(clamp((_566 / _567) * 2.0, 0.0, 1.0), 1.0), _375, 0.0, 1.0);
}

//$$depthBufferTexture=s0
//$$randMapTexture=s1
