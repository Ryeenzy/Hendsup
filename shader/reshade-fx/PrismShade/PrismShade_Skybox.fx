// PrismShade Skybox
//
// Replaces the game's sky with a panorama: an equirectangular image, twice as wide as it is tall,
// chosen under Settings, Sky. The sky is wherever the scene has no depth, and each of its pixels
// looks up the panorama in the direction the game's own camera sends it, so the sky turns with
// the view and stays put while the character walks. Put it first in the chain, so bloom, colour
// and the rest treat the new sky as part of the scene.
//
// The camera and the panorama come from the engine: the uniforms marked with a camera source are
// filled from the game's camera each frame, and the SKYBOX texture is the selected panorama. When
// either is missing the frame is left as it was.

#include "ReShade.fxh"

uniform float Rotation <
   ui_type = "slider";
   ui_label = "Rotation";
   ui_tooltip = "Turns the panorama around the vertical, in degrees, to put the sun or a cloud "
                "where you want it.";
   ui_min = 0.0; ui_max = 360.0; ui_step = 1.0;
> = 0.0;

uniform float HorizonShift <
   ui_type = "slider";
   ui_label = "Horizon height";
   ui_tooltip = "Raises or lowers the panorama's horizon, in degrees, so it meets the game's own "
                "horizon instead of floating above or sinking below it.";
   ui_min = -20.0; ui_max = 20.0; ui_step = 0.5;
> = 0.0;

uniform float Exposure <
   ui_type = "slider";
   ui_label = "Exposure";
   ui_tooltip = "Brightness in stops. Each step up doubles the light.";
   ui_min = -4.0; ui_max = 4.0; ui_step = 0.05;
> = 0.0;

uniform float3 Tint <
   ui_type = "color";
   ui_label = "Tint";
   ui_tooltip = "Multiplies the panorama's colour. White leaves it as it is.";
> = float3(1.0, 1.0, 1.0);

uniform float Saturation <
   ui_type = "slider";
   ui_label = "Saturation";
   ui_min = 0.0; ui_max = 2.0; ui_step = 0.01;
> = 1.1;

uniform float Contrast <
   ui_type = "slider";
   ui_label = "Contrast";
   ui_tooltip = "Panoramas made from HDR photographs are often flat; this pulls the clouds out of "
                "the haze.";
   ui_min = 0.5; ui_max = 2.0; ui_step = 0.01;
> = 1.15;

uniform float Opacity <
   ui_type = "slider";
   ui_label = "Opacity";
   ui_tooltip = "How much of the game's own sky is replaced. Lower lets it show through.";
   ui_min = 0.0; ui_max = 1.0; ui_step = 0.01;
> = 1.0;

uniform float EdgeBlend <
   ui_type = "slider";
   ui_label = "Edge blend";
   ui_tooltip = "Paints a little of the new sky into the pixels at the edge of a building or a "
                "tree, which otherwise keep a thin line of the old sky's colour.";
   ui_min = 0.0; ui_max = 1.0; ui_step = 0.01;
> = 0.6;

uniform int Debug <
   ui_type = "combo";
   ui_label = "Show";
   ui_items = "Final image\0Sky mask\0Panorama everywhere\0";
   ui_tooltip = "Sky mask draws the replaced pixels in white, and red when the game's camera is not "
                "known. Panorama everywhere ignores depth, which shows the sky following the camera.";
   ui_category = "Debug";
   ui_category_closed = true;
> = 0;

uniform bool CameraKnown < source = "camera"; >;
uniform float3 CameraRight < source = "camera_right"; >;
uniform float3 CameraUp < source = "camera_up"; >;
uniform float3 CameraForward < source = "camera_forward"; >;
uniform float2 CameraFocal < source = "camera_focal"; >;

texture SkyboxTex : SKYBOX;

sampler SkyboxSampler
{
   Texture = SkyboxTex;
   AddressU = WRAP;
   AddressV = CLAMP;
   MagFilter = LINEAR;
   MinFilter = LINEAR;
   MipFilter = LINEAR;
};

static const float kPi = 3.14159265;
static const float kSkyDepth = 0.99995;

float IsSky(float2 uv)
{
   return ReShade::GetLinearizedDepth(uv) >= kSkyDepth ? 1.0 : 0.0;
}

float3 ViewDirection(float2 uv)
{
   float2 ndc = float2(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);

   return normalize(CameraForward + ndc.x * CameraRight / CameraFocal.x
                    + ndc.y * CameraUp / CameraFocal.y);
}

// The panorama's texel under this pixel. The mip level is chosen from how wide a pixel is as an
// angle rather than from screen derivatives, which jump where the panorama wraps around and would
// draw a seam down the sky.
float4 SamplePanorama(float3 direction)
{
   float yaw = atan2(direction.x, -direction.z) + radians(Rotation);
   float pitch = asin(clamp(direction.y, -1.0, 1.0)) - radians(HorizonShift);
   float2 panorama_uv = float2(yaw / (2.0 * kPi) + 0.5, 0.5 - pitch / kPi);

   float2 size = tex2Dsize(SkyboxSampler, 0);
   float pixel_angle = 2.0 / (max(CameraFocal.y, 1e-3) * BUFFER_HEIGHT);
   float texel_angle = 2.0 * kPi / max(size.x, 1.0);
   float level = max(log2(pixel_angle / texel_angle), 0.0);

   return tex2Dlod(SkyboxSampler, float4(panorama_uv, 0.0, level));
}

float3 GradePanorama(float3 color)
{
   color *= exp2(Exposure) * Tint;

   float luma = dot(color, float3(0.2126, 0.7152, 0.0722));

   color = lerp(luma.xxx, color, Saturation);

   // Contrast around middle grey, in linear light, so the sky's brightest clouds stay bright.
   color = 0.18 * pow(max(color, 0.0) / 0.18, Contrast);

   return color;
}

float4 SkyboxPS(float4 position : SV_Position, float2 uv : TEXCOORD) : SV_Target
{
   float3 scene = tex2D(ReShade::BackBuffer, uv).rgb;
   float sky = IsSky(uv);

   if (Debug == 1) {
      return CameraKnown ? float4(sky.xxx, 1.0) : float4(sky, 0.0, 0.0, 1.0);
   }

   if (!CameraKnown) {
      return float4(scene, 1.0);
   }

   float weight = sky;

   if (sky < 0.5 && Debug == 0) {
      float2 pixel = BUFFER_PIXEL_SIZE;
      float neighbours = IsSky(uv + float2(pixel.x, 0.0)) + IsSky(uv - float2(pixel.x, 0.0))
                         + IsSky(uv + float2(0.0, pixel.y)) + IsSky(uv - float2(0.0, pixel.y));

      weight = EdgeBlend * 0.5 * neighbours * 0.25;
   }

   if (Debug == 2) {
      weight = 1.0;
   }

   if (weight <= 0.0) {
      return float4(scene, 1.0);
   }

   float4 panorama = SamplePanorama(ViewDirection(uv));
   float3 sky_color = pow(saturate(GradePanorama(panorama.rgb)), 1.0 / 2.2);

   weight *= panorama.a * (Debug == 2 ? 1.0 : Opacity);

   return float4(lerp(scene, sky_color, weight), 1.0);
}

technique Skybox < ui_label = "PrismShade Skybox"; >
{
   pass
   {
      VertexShader = PostProcessVS;
      PixelShader = SkyboxPS;
   }
}
