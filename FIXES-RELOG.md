# RYEENZYXNZ — Relog / Real-time Fixes

This source update addresses the requested runtime and relog issues.

## Changes

- **Default OFF:** all boolean settings in `RzState` default to `false`; native `Config` defaults now match. First launch after this update runs one-time migration `.ui_v22` which turns off saved boolean switches and saved ReShade techniques. Numeric controls retain neutral/default values.
- **Relog touch recovery:** the overlay reattaches on Activity resume and window-focus changes, brings the overlay to the front, and gives the FAB/panel explicit touch/focus/elevation.
- **Live shader switches:** GLSL rewrite support is prepared at shader compile time regardless of the LIVE switch. `glUseProgram` uploads neutral uniforms while LIVE/master is OFF and current uniforms while ON, so LIVE and grading/gloss/fog/rim changes can switch without relog after the hooks are installed.
- **Depth/trace switches:** depth/trace GL hooks are installed at engine startup regardless of their current switch state. The depth pipeline itself remains gated by the current config.
- **Fast config reload:** native config reload compares file contents rather than second-resolution `st_mtime`, avoiding missed quick changes. ReShade FX config is checked each frame and also compares file contents, avoiding same-second updates being ignored.
- **No forced Save/Safe Mode:** the boot-count threshold that forced safe mode after repeated launches is removed; the legacy counter is reset.
- **Build ID matching:** `patch_roblox.py` reads the GNU build-id from the exact `libroblox.so` in the supplied APK set and writes it into the fixed-width marker in the newly built payload. The patcher refuses missing/unsupported build-id data rather than silently bypassing the guard.

## Important runtime boundaries

- The payload must be **rebuilt from this source** before patching. The old prebuilt payload has the old build-id marker and old runtime behavior, so it has intentionally been removed from this source bundle. Use the GitHub Actions `native` build artifact from the updated source, then place the new `libryeenzyxnz_payload.so` at `native/libryeenzyxnz_payload.so` before running `termux/patch.sh --live`.
- A build-id match only confirms the exact ELF build identity. It does not guarantee every internal Roblox shader or GL behavior is compatible; the engine still reports actual hook status.
- **Force OpenGL ES** is a renderer-loader setting. It can intercept a future `dlopen("libvulkan")`, but it cannot safely unload Vulkan if Roblox has already loaded it. Changing renderer backend may still require a fresh Roblox process.
- Runtime validation against a live Roblox session/device was not possible in this source-only environment. Host native tests and source checks are listed below; perform a device smoke test before distributing the APK.

## Validation performed

- `make test` in `native/module`: PASS (PLT hook, config parser/defaults, patch math, depth math, FX runtime; 94 effects / 238 passes / 444 samplers checked).
- `bash tests/run_tests.sh`: PASS. GLSL/WebGL checks were skipped because `glslangValidator` and Chromium were not installed in this environment.
- `python3 -m py_compile native/tools/patch_roblox.py`: PASS.
- Android Java/Dex and Android NDK payload build: not run here because Android SDK/NDK toolchains were not available.

## v23
- Tab **EFFECT** (ReShade FX) ditambahkan; sebelumnya `buildFxInto()` ada tetapi tidak pernah dipanggil sehingga 94 efek tidak dapat dinyalakan.
- `allow_any_build` default **ON** di `RzState` dan `Config` (native); migrasi `.ui_v23` menyalakannya sekali untuk instalasi lama. Migrasi v22 tidak lagi mematikannya.
- Safe Mode: `coreSetConfig`/`coreStart` selalu memaksa `safe=false`/`disable=false`; parser menerima kunci lama tetapi mengabaikan nilainya; tombol reset safe mode dihapus.
- Perlu dibangun ulang lewat GitHub Actions (job `native`) — Java/NDK belum dikompilasi di lingkungan ini (tanpa Android SDK/NDK).

## v24 — perbaikan tab EFFECT (ReShade FX)
- Akar masalah utama: 43 efek tidak pernah menerima nilai uniform karena nama uniform di UI (`Strength`) tidak sama dengan nama di shader hasil kompilasi (`V_Namespace_Strength`). Sekarang `fxrt` me-resolve nama asli dari deklarasi shader (`resolveUniformName`).
- Efek LUT sebelumnya hitam: tekstur LUT/noise yang aset gambarnya tidak ada kini diisi LUT identitas / noise acak (`imageKind`/`fillImage`).
- Sampler POINT (filter=0) kini dihormati; depth & tekstur int dipaksa POINT; noise memakai REPEAT.
- qUINT_dof: variabel lokal `vv_0` bentrok dengan varying -> shader gagal compile; diganti `vso`.
- Uniform int/uint vektor (`ivec2/3/4`) kini memakai `glUniform*i/ui` (sebelumnya INVALID_OPERATION, mis. DisplayDepth).
- Feedback-loop (tekstur dibaca sekaligus jadi render target) dijaga: RadiantGI, SnowScape tidak lagi error.
- 10 efek disembunyikan karena butuh aset gambar/teknik khusus yang tidak ikut paket: Compare, UIMask, Template, Splitscreen, Layer, GoldenRatio, LUT, MultiLUT, PD80_02_Bonus_LUT_pack, PD80_02_Cinetools_LUT (daftar `RzFx.UNSUPPORTED`). Sisa: 84 efek.
- Catatan: efek hanya jalan bila Depth Pipeline menangkap frame valid. GloomAO efeknya halus; PrismShade_Skybox butuh langit. Payload native harus di-build ulang lewat GitHub Actions.
- Tab MAIN tidak diubah.

## v24b — MXAO/SSR "ngejejak" saat avatar bergerak
- Histori temporal di-reproyeksi dengan asumsi dunia statis, jadi objek bergerak meninggalkan jejak (ghosting).
- MXAO: histori ditolak bila kedalaman beda >1% (sebelumnya 4%) atau AO histori beda jauh dari frame sekarang; clamp ±0.1 (sebelumnya ±0.3); bobot maks 0.8.
- SSR: sebelumnya tanpa validasi sama sekali; kini histori ditolak bila warna/alpha beda jauh, clamp ±0.12, bobot maks 0.7.
- Bila masih terasa, turunkan slider "mx_temp" ke 0 (tanpa temporal sama sekali).
