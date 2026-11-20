// PrismShade Outline
//
// An outline drawn where the scene's depth jumps (silhouettes) or bends (creases between
// faces), in a colour of your choosing. It reads only depth, so it follows geometry and
// ignores texture detail. It is a ReShade effect like any other: add it to the chain, move it
// in the order, and tune it from the settings under the list.
//
// Depth is read as distance through ReShade.fxh. Its reciprocal is a straight ramp across a
// flat surface, so a second difference of it is zero on flat ground however steep the view, and
// it jumps only at an edge. That is what lets the threshold be one number that holds from a
// wall beside you to a hill far away.

#include "ReShade.fxh"

uniform float3 OutlineColor <
	ui_type = "color";
	ui_label = "Outline colour";
	ui_tooltip = "The colour of the line. Any colour works; white reads as a rim of light and "
	             "black as ink.";
> = float3(1.0, 1.0, 1.0);

uniform int BlendMode <
	ui_type = "combo";
	ui_label = "Blend";
	ui_items = "Replace\0Add (glow)\0Multiply (ink)\0";
	ui_tooltip = "Replace paints the colour over the scene. Add brightens it, which gives a rim "
	             "of light. Multiply darkens it, which gives ink.";
> = 1;

uniform float Strength <
	ui_type = "slider";
	ui_label = "Strength";
	ui_min = 0.0; ui_max = 1.0; ui_step = 0.01;
> = 0.8;

uniform float Thickness <
	ui_type = "slider";
	ui_label = "Thickness";
	ui_tooltip = "Line width as a share of the screen's height, so it stays the same size whatever "
	             "resolution the chain runs at.";
	ui_min = 0.25; ui_max = 4.0; ui_step = 0.05;
> = 1.0;

uniform float Sensitivity <
	ui_type = "slider";
	ui_label = "Sensitivity";
	ui_tooltip = "How small a step in depth draws a line. Higher finds fainter edges, and at the "
	             "very top starts to draw lines across flat ground.";
	ui_min = 0.0; ui_max = 1.0; ui_step = 0.01;
> = 0.75;

uniform float Softness <
	ui_type = "slider";
	ui_label = "Softness";
	ui_tooltip = "Fades a line in over a range instead of cutting it hard.";
	ui_min = 0.0; ui_max = 1.0; ui_step = 0.01;
> = 0.5;

uniform float FadeStart <
	ui_type = "slider";
	ui_label = "Fade start";
	ui_tooltip = "Distance in studs where lines start to fade. Assumes Roblox's near plane of 0.1 studs.";
	ui_category = "Distance";
	ui_min = 1.0; ui_max = 1000.0; ui_step = 1.0;
> = 120.0;

uniform float FadeEnd <
	ui_type = "slider";
	ui_label = "Fade end";
	ui_tooltip = "Distance in studs where lines are gone.";
	ui_category = "Distance";
	ui_min = 1.0; ui_max = 2000.0; ui_step = 1.0;
> = 450.0;

uniform bool SkyEdges <
	ui_label = "Outline against the sky";
	ui_category = "Distance";
> = true;

uniform int Debug <
	ui_type = "combo";
	ui_label = "Show";
	ui_items = "Final image\0Edge mask\0";
	ui_category = "Debug";
	ui_category_closed = true;
> = 0;

// The near plane over the distance in studs, so a plane is a ramp and the nearest surface is
// close to one. The sky, which has no depth, reads zero.
float InverseDepth(float2 uv)
{
	float linear_depth = ReShade::GetLinearizedDepth(uv);

	if (linear_depth >= 0.9999) {
		return 0.0;
	}

	return 0.1 / max(linear_depth * RESHADE_DEPTH_LINEARIZATION_FAR_PLANE, 0.1);
}

// How far a pair of opposite taps is from lying on one line with the centre, relative to the
// nearest thing in the pair. Zero on a plane, about one across a silhouette.
float Bend(float centre, float a, float b)
{
	float nearest = max(centre, max(a, b));

	return abs(a + b - 2.0 * centre) / max(nearest, 1e-6);
}

float4 OutlinePS(float4 position : SV_Position, float2 uv : TEXCOORD) : SV_Target
{
	float3 scene = tex2D(ReShade::BackBuffer, uv).rgb;

	float2 step_uv = float2(BUFFER_HEIGHT * BUFFER_RCP_WIDTH, 1.0) * (Thickness * 0.0016);
	float2 diagonal = step_uv * 0.7071;

	float c = InverseDepth(uv);
	float e = InverseDepth(uv + float2(step_uv.x, 0.0));
	float w = InverseDepth(uv - float2(step_uv.x, 0.0));
	float n = InverseDepth(uv - float2(0.0, step_uv.y));
	float s = InverseDepth(uv + float2(0.0, step_uv.y));
	float ne = InverseDepth(uv + float2(diagonal.x, -diagonal.y));
	float sw = InverseDepth(uv + float2(-diagonal.x, diagonal.y));
	float nw = InverseDepth(uv - diagonal);
	float se = InverseDepth(uv + diagonal);

	float bend = max(max(Bend(c, e, w), Bend(c, n, s)), max(Bend(c, ne, sw), Bend(c, nw, se)));

	// A higher sensitivity lowers the bend that counts as an edge.
	float threshold = lerp(0.5, 0.008, sqrt(Sensitivity));
	float edge = smoothstep(threshold, threshold * lerp(1.0, 4.0, Softness), bend);

	// Distance in studs, from a near plane of 0.1.
	float nearest = max(c, max(max(e, w), max(n, s)));
	float distance_studs = 0.1 / max(nearest, 1e-6);
	float fade = 1.0 - smoothstep(FadeStart, max(FadeEnd, FadeStart + 1.0), distance_studs);

	// The sky has no depth at all, so a line against it is the silhouette of what stands in front.
	float sky = (nearest <= 1e-6) ? 1.0 : 0.0;
	float against_sky = (min(min(c, min(e, w)), min(n, s)) <= 1e-6) ? 1.0 : 0.0;

	if (!SkyEdges && against_sky > 0.5) {
		edge = 0.0;
	}

	edge *= lerp(fade, 1.0, sky) * Strength;

	if (Debug == 1) {
		return float4(edge.xxx, 1.0);
	}

	float3 result = scene;

	if (BlendMode == 0) {
		result = lerp(scene, OutlineColor, edge);
	} else if (BlendMode == 1) {
		result = scene + OutlineColor * edge;
	} else {
		result = scene * lerp(1.0.xxx, OutlineColor, edge);
	}

	return float4(result, 1.0);
}

technique Outline < ui_label = "PrismShade Outline"; >
{
	pass
	{
		VertexShader = PostProcessVS;
		PixelShader = OutlinePS;
	}
}
