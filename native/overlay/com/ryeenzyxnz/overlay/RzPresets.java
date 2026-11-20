package com.ryeenzyxnz.overlay;

import java.io.File;
import java.util.List;
import java.util.Map;

/** Preset bawaan. "Rods TikTok Shaders" adalah isi file INI Anda, dibaca lewat RzIni (bukan nilai tulis-tangan). */
final class RzPresets {
    static final class Preset {
        final String name; final Map<String, Float> values;
        Preset(String n, Map<String, Float> v) { name = n; values = v; }
    }

    static final String RODS_INI =
        "Techniques=Blooming_HDR@BloomingHDR.fx,SSR@qUINT_ssr.fx,MXAO@qUINT_mxao.fx,Clarity@Clarity.fx,Deband@Deband.fx,ADOF@qUINT_dof.fx,FXAA@FXAA.fx,Curves@Curves.fx,Levels@Levels.fx\n" +
        "TechniqueSorting=Blooming_HDR@BloomingHDR.fx,SSR@qUINT_ssr.fx,MXAO@qUINT_mxao.fx,Clarity@Clarity.fx,Deband@Deband.fx,ADOF@qUINT_dof.fx,FXAA@FXAA.fx,Curves@Curves.fx,Levels@Levels.fx\n" +
        "PrismShadeFrameHeight=1024\n" +
        "PrismShadeUnits=linear\n" +
        "\n" +
        "[BloomingHDR.fx]\n" +
        "Auto_Bloom=0\n" +
        "CBT_Adjust=0.500000\n" +
        "Bloom_Intensity=0.100000,0.500000\n" +
        "BloomSensitivity=1.000000\n" +
        "BloomCurve=2.000000\n" +
        "Saturation=0.250000,0.250000\n" +
        "Bloom_Spread=1.000000\n" +
        "Dither_Bloom=0.125000\n" +
        "Tonemappers=0\n" +
        "WP=1.000000\n" +
        "Exp=0.177000\n" +
        "GreyValue=0.128000\n" +
        "Gamma=2.200000\n" +
        "Contrast=1.000000\n" +
        "Saturate=1.000000\n" +
        "Inv_Tonemappers=2\n" +
        "HDR_BP=0.500000\n" +
        "Bloom_BA_iToneMapper=0\n" +
        "Auto_Exposure=1\n" +
        "Adapt_Adjust=0.500000\n" +
        "Adapt_Seek=0.500000\n" +
        "Debug_View=0\n" +
        "\n" +
        "[qUINT_ssr.fx]\n" +
        "SSR_FIELD_OF_VIEW=31.919001\n" +
        "SSR_REFLECTION_INTENSITY=1.000000\n" +
        "SSR_FRESNEL_EXP=5.000000\n" +
        "SSR_FADE_DIST=0.800000\n" +
        "SSR_RAY_INC=2.642000\n" +
        "SSR_ACCEPT_RANGE=2.500000\n" +
        "SSR_JITTER_AMOUNT=0.250000\n" +
        "SSR_FILTER_SIZE=0.500000\n" +
        "SSR_RELIEF_AMOUNT=0.050000\n" +
        "SSR_RELIEF_SCALE=0.350000\n" +
        "\n" +
        "[qUINT_mxao.fx]\n" +
        "MXAO_GLOBAL_SAMPLE_QUALITY_PRESET=2\n" +
        "MXAO_SAMPLE_RADIUS=1.440000\n" +
        "MXAO_SAMPLE_NORMAL_BIAS=0.098000\n" +
        "MXAO_GLOBAL_RENDER_SCALE=1.000000\n" +
        "MXAO_SSAO_AMOUNT=1.312000\n" +
        "MXAO_BLEND_TYPE=1\n" +
        "MXAO_FADE_DEPTH_START=0.349000\n" +
        "MXAO_FADE_DEPTH_END=0.400000\n" +
        "MXAO_DEBUG_VIEW_ENABLE=0\n" +
        "\n" +
        "[Clarity.fx]\n" +
        "ClarityRadius=0\n" +
        "ClarityOffset=2.000000\n" +
        "ClarityBlendMode=2\n" +
        "ClarityBlendIfDark=50\n" +
        "ClarityBlendIfLight=205\n" +
        "ClarityViewBlendIfMask=0\n" +
        "ClarityStrength=0.000000\n" +
        "ClarityDarkIntensity=0.400000\n" +
        "ClarityLightIntensity=0.000000\n" +
        "ClarityViewMask=0\n" +
        "\n" +
        "[Deband.fx]\n" +
        "enable_weber=1\n" +
        "enable_sdeviation=1\n" +
        "enable_depthbuffer=0\n" +
        "t1=0.007000\n" +
        "t2=0.040000\n" +
        "banding_depth=1.000000\n" +
        "range=24.000000\n" +
        "iterations=2\n" +
        "debug_output=0\n" +
        "\n" +
        "[qUINT_dof.fx]\n" +
        "bADOF_AutofocusEnable=1\n" +
        "fADOF_AutofocusCenter=0.500000,0.500000\n" +
        "fADOF_AutofocusRadius=0.600000\n" +
        "fADOF_AutofocusSpeed=0.100000\n" +
        "fADOF_ManualfocusDepth=0.001000\n" +
        "fADOF_NearBlurCurve=6.000000\n" +
        "fADOF_FarBlurCurve=1.500000\n" +
        "fADOF_HyperFocus=0.100000\n" +
        "fADOF_RenderResolutionMult=0.500000\n" +
        "fADOF_ShapeRadius=20.500000\n" +
        "fADOF_SmootheningAmount=4.000000\n" +
        "fADOF_BokehIntensity=0.300000\n" +
        "iADOF_BokehMode=2\n" +
        "iADOF_ShapeVertices=6\n" +
        "iADOF_ShapeQuality=5\n" +
        "fADOF_ShapeCurvatureAmount=1.000000\n" +
        "fADOF_ShapeRotation=0.000000\n" +
        "fADOF_ShapeAnamorphRatio=1.000000\n" +
        "fADOF_ShapeChromaAmount=-0.100000\n" +
        "iADOF_ShapeChromaMode=2\n" +
        "\n" +
        "[FXAA.fx]\n" +
        "Subpix=0.250000\n" +
        "EdgeThreshold=0.125000\n" +
        "EdgeThresholdMin=0.000000\n" +
        "\n" +
        "[Curves.fx]\n" +
        "Mode=1\n" +
        "Formula=2\n" +
        "Contrast=0.179000\n" +
        "\n" +
        "[Levels.fx]\n" +
        "BlackPoint=13\n" +
        "WhitePoint=207\n" +
        "HighlightClipping=0\n";

    /**
     * Isi preset NYATA tidak ditulis di sini sama sekali — sengaja, supaya tidak ikut kebawa kalau
     * APK dibongkar orang. Diambil dari server (lihat RzPresetsRemote) setelah lisensi device
     * tervalidasi, lalu di-cache lokal. Kalau belum pernah berhasil diambil, daftar ini kosong.
     */
    static List<Preset> builtin(File dir) {
        return RzPresetsRemote.read(dir);
    }
}
