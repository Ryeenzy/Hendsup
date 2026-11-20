# glossy

Dikerjakan `patcher/shader_rules.py::apply_glossy` pada shader PBR (yang punya `reflect(` + `PrefilteredEnvTexture`):

1. `vec3(0.04)` (F0 / reflektansi dasar) -> `0.04 + 0.26*g`
2. `float L = roughness * 5.0` (LOD mip cubemap) -> `* 5*(1-0.7g)` (pantulan lebih tajam)
3. kekuatan pantulan `CB0[31].w * clamp(...)` -> `min(max(CB0[31].w, 0.5g) * clamp(...) * (1+1.5g), 1)`

Catatan penting (hasil bedah pack asli):
* `* 5.0` pada `max(CB0[18].y, fog) * 5.0` adalah blur FOG/langit, BUKAN pantulan permukaan. TESTKIT lama
  menyasar yang itu, jadi tidak membuat part glossy. Di sini yang disasar LOD roughness yang dipakai `textureLod(PrefilteredEnv...)`.
* Hanya varian shader PBR yang diubah (128 dari 922 shader unik di pack Roblox 2.743). Varian "flat/low quality"
  tidak punya normal/pantulan, jadi tidak bisa dibuat glossy tanpa menulis ulang shader.
* Perubahan hanya terlihat bila Roblox memakai jalur GLES dan grafis cukup tinggi untuk memilih varian PBR.
