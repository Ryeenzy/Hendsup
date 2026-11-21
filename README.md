# Roblox-Shader-Mod — RYEENZYXNZ

Patch **shader asli di dalam APK Roblox** (bukan overlay layar, bukan Luau), semuanya dari Termux.

```
GitHub Actions : uji + kemas tool -> artifact ryeenzyxnz-patcher.zip
Termux         : unduh artifact -> ambil APK Roblox asli -> patch -> tanda tangan -> pasang
Roblox         : target uji langsung
```

## v9 (Depth Pipeline: SSR, MXAO, DOF sungguhan, EKSPERIMENTAL)
Semua opsi Main yang tadinya abu-abu karena butuh depth kini punya implementasi: **DOF** (fokus/range/near/far/bokeh/aperture/autofocus),
**SSR ray-march** (memantulkan avatar/objek), **MXAO** (hemisphere AO + bilateral blur + temporal), plus debug view.
Cara kerja: hook menyalin depth FBO scene (`glBlitFramebuffer` tepat sebelum `glInvalidateFramebuffer`), mengambil ViewProjection dari `CB0[0..3]`
(`glUniform4fv` array 61 vec4), lalu menjalankan pass layar di antara pass akhir Roblox dan UI (UI tidak ikut kabur).
* Aktifkan: tab Main -> Depth Pipeline -> **restart Roblox** -> masuk map -> nyalakan SSR/MXAO/DOF. Status: `dp_status.txt` (juga tampil di tab Shader).
* Terbukti offline: matematika semua pass di WebGL2 dengan scene sintetis (normal, AO di dasar kotak, pantulan kotak merah di lantai, DOF mengaburkan dinding jauh,
  autofocus, mode debug); GLSL valid; kode native lolos cek sintaks.
* **BELUM terbukti di HP**: apakah depth bisa disalin (format/multisample), apakah `CB0` ditangkap, dan orientasi. Alat bantu: Debug view 1-6 dan
  "grid dunia" (5: garis merah harus menempel di lantai/dinding; jika tidak, coba "Balik sumbu Y" atau "Matriks VP kolom-mayor").
  Error GL apa pun mematikan pipeline otomatis (dicatat di `dp_status.txt`). Mode "Thermal" mematikan pass berat.

## v8 (Main lengkap yang BISA, performa, auto-quality)
Data HP Anda (Mali-G52, GLES 3.2): hook GL + trace + overlay terbukti jalan. Trace yang dikirim berasal dari **menu**, bukan dari dalam map.
Terlihat di trace: scene digambar ke FBO 1045x575 (di tekstur 1960x1080, render scale engine), dan `invalidate att=0x8d00` = **depth dibuang tiap frame**.
Karena itu SSR sungguhan, DOF (termasuk autofocus), dan MXAO kualitas tinggi tetap **tidak mungkin** tanpa depth.

Baru di v8 (semua tervalidasi: 338 shader ditulis ulang, 0 gagal glslang; fungsi fog/rim/rfade diuji numerik di WebGL2):
* **Fog:** End Distance, Height + Height Falloff, Distance Falloff, Smoothness, Atmospheric Scattering, Sky Blending, Adaptive Density,
  Camera Distance Response, Fog Color (R/G/B + campuran). Intensity/Start/Opacity kini bermakna benar (fog = 1 - visibilitas).
  Tinggi fog memakai `CB0[11].y - VARYING4.y` (asumsi, perlu dicek di map).
* **Rimlight:** Softness, Edge Brightness, Material Sensitivity.
* **Pantulan IBL:** Reflection Fade, Reflection Distance, Roughness Threshold.
* **Global:** Shader Quality (Low/Medium/High/Ultra), FPS Priority, Battery Saver, Thermal Mode, Auto Quality (turun level bila FPS < target 3 dtk;
  naik lagi setelah 15 dtk longgar), Performance Mode per bagian (SSR/HDR/Fog/Rim/AO), Enable HDR.
  Level performa mematikan ekstra lewat uniform (cabang uniform di shader), bukan mengganti shader.
* Masih abu-abu (jujur): DOF semua, SSR ray-march (quality/thickness/steps/dll), pass bloom (threshold/radius/dll), AO detail engine,
  Render/Resolution Scale (diatur Roblox), Avatar vs Environment rimlight (tak bisa dibedakan dari shader).
* Untuk membuka DOF/SSR: rekam trace **di dalam map** (tab Shader -> Trace) dan kirim `trace_frame.txt`; kita lihat apakah depth ada di game.

## v7 (UI hitam-silver, SSAO bawaan, trace frame)
* **UI baru:** hitam + silver, tab di SAMPING (kiri), panel lebih lebar untuk layar landscape.
* **AO/MXAO = SSAO bawaan Roblox:** shader `ScreenSpaceSSAOCB` (membaca `depthBufferTexture`) ditulis ulang dengan uniform live `RZ14`
  (kekuatan, radius, sensitivitas depth). Terbukti pada dump shader dari HP (Mali-G52, Roblox 2.743.1136): GLSL valid. **Belum terbukti**
  SSAO benar-benar dijalankan engine di map Anda; jika slider AO tidak berefek, SSAO tidak aktif di map itu.
* **Trace frame (untuk DOF / Sun Rays / SSR sungguhan):** tab Shader -> "Trace: aktifkan hook" -> restart Roblox -> masuk map ->
  nyalakan "Trace: rekam 1 frame" lalu matikan. Hasil: `trace_frame.txt` di folder RYEENZYXNZ (texture+format, FBO, depth, urutan draw,
  program -> hash shader). Kirim file itu; dari situ pass DOF/Sun Rays/SSR disisipkan di titik pipeline yang benar.
* DOF, Sun Rays, SSR, MXAO kualitas tinggi: **belum ada**, menunggu trace (pass layar lama tetap nonaktif di LIVE).

## MODE LIVE: panel mengambang di dalam Roblox (v3)
Payload native disuntik ke `libroblox.so` (DT_NEEDED) dan memuat panel (tombol bulat **RZ**, tab Preset/Warna/Bloom/Glossy/dst.) di dalam Roblox.
Shader PBR + komposit akhir ditulis ulang saat dikompilasi dengan uniform hidup (`RZ0..RZ4`), diisi lewat hook `glUseProgram`,
jadi slider **Glossy / Basah / Kontras / Saturasi / Vibrance / Levels / Curves / Bloom** berlaku langsung.
Preset **Basah (PrismShade)** ada di tab Preset.

1. Push repo ke GitHub; job **native** (NDK) harus hijau, lalu unduh artifact `ryeenzyxnz-patcher`. Jika job native merah, kirim lognya.
2. Ekstrak, `bash termux/install.sh` (memasang patchelf juga), APK asli di `~/apks` (hasil `adb pull`).
3. `bash termux/patch.sh --live --apk ~/apks/*.apk --install`
4. Buka Roblox, tombol RZ muncul. Pertama kali: restart Roblox sekali agar "Paksa OpenGL ES" aktif.

**Kontrol glossy (v4):** Kejernihan, Ketajaman, Kekayaan warna pantulan (kurangi putih), Warna pantulan dingin/hangat, Highlight matahari, Basah,
dan **Pantulan langit di lantai** (165 shader material 'flat' seperti baseplate; asumsi permukaan datar, jadi dinding ikut sedikit memantul).
**Color grading (v4):** Brightness, Kontras, Saturasi, Vibrance, Warmth, Gamma, Hue, Levels, Curves, Exposure, split toning bayangan/highlight;
diterapkan di 254 fragment shader pada tahap output (jadi tetap jalan walau Roblox tanpa post-processing).
Batas: pantulan avatar/objek di lantai (SSR/planar) tidak mungkin lewat penulisan ulang shader; yang ada hanya pantulan langit.

**Tab Main (v5)** mengikuti daftar Anda: SSR, HDR/Bloom, DOF, Adaptive Fog, MXAO, Rimlight, Global.
Yang hidup: pantulan IBL (SSR-lite), exposure/contrast/gamma/white point/highlight/shadow, penguat bloom engine, **fog adaptif**
(308 shader), **rimlight** (133 shader PBR, termasuk mode RGB), master enable, intensitas global, Save/Load/Reset/Restore.
Yang tampil abu-abu "belum tersedia": SSR sungguhan, MXAO, DOF (butuh depth buffer layar), Render/Resolution Scale, Quality, dll.
Rimlight memakai arah cahaya dan waktu (`CB0[16]`, `CB0[19].w`) dengan asumsi; Light Direction dan mode RGB perlu dicek di perangkat.

**Belum terverifikasi di perangkat** (semua tes di sini offline): kompilasi NDK/d8 terjadi di Actions; apakah hook GL kena di Roblox,
apakah shader Roblox lewat `glShaderSource` (bukan program binary), apakah panel tampil di atas Roblox, dan apakah Roblox menerima APK
ter-resign. Safe Mode sudah DIHAPUS (tidak ada boot-counter, kunci `safe`/`disable` di config diabaikan). Pass layar lama (AO/DOF/sun rays) nonaktif saat LIVE.
Jalur lama (patch pack, UI web `termux/ui.sh`) tetap ada sebagai cadangan.

## UI pengaturan web (cadangan, di luar game)
`bash termux/ui.sh` -> browser HP terbuka di `http://127.0.0.1:8777`: preset (termasuk **basah_prismshade**, efek becek),
slider glossy/basah/kontras/saturasi/levels/curves/bloom, impor ReShade INI, tombol **PATCH** dan **PASANG**.
APK Roblox asli harus ada di `~/apks` (hasil `adb pull`). Ini UI di luar game: nilai dipanggang saat PATCH,
bukan slider live di dalam Roblox (shader Roblox tidak bisa menerima uniform baru dari luar).

## Pakai (Termux)
1. Unduh artifact dari tab Actions (atau Release bila tag `v*`), ekstrak.
2. `bash termux/install.sh`
3. `bash ~/ryeenzyxnz/termux/patch.sh --preset shader/presets/Rods_TikTok_Shaders.ini --install`
   - tanpa `--install`: hasil ke `~/storage/downloads` (APK split harus dipasang via `adb install-multiple`).
   - `--set wet=0.6 contrast=1.1 saturation=1.2` untuk menimpa nilai (opsi `--glossy` sudah dihapus).
   - Menu: `bash ui/pilih_preset.sh`
4. Roblox asli harus di-uninstall dulu (tanda tangan berbeda). Akun tetap aman di server.

Analisis APK (struktur): `python3 patcher/apk_analyzer.py --adb`. Daftar pack: `python3 patcher/apk_patcher.py --apk base.apk --list`.

## Yang dikerjakan
| Fitur | Cara | Status |
|---|---|---|
| Efek basah (`wet`) | roughness diperkecil + highlight matahari x(1..4) di 131 shader PBR | GLSL valid; mirip tampilan PrismShade tapi bukan identik (outline/rim avatar tidak ada) |
| Glossy | F0 + LOD roughness + gain pantulan di 128 shader PBR | diuji: GLSL valid (glslang), pack utuh. **Belum diuji di Roblox** |
| Warna/Levels/Curves/Vibrance/Bloom | disisipkan di 14 shader komposit akhir | idem |
| Preset Rods ReShade | dipetakan otomatis (SSR→glossy, Levels 13–207 tepat, Curves, Bloom, Clarity) | idem |
| DOF | pipeline native ada di pack, belum dipatch | **belum** (lihat shader/dof) |
| MXAO, Deband, FXAA, ADOF ReShade | tidak ada padanan | dilaporkan "diabaikan" |

## Batasan jujur
* Yang diubah hanya `glsles3.pack` (jalur **GLES**). `vulkan.pack` (SPIR-V) dilewati; jika Roblox memakai Vulkan di HP Anda, tidak ada perubahan terlihat.
* Pack punya 2383 varian / 922 shader unik; hash/kunci rekaman tidak diubah dan bukan checksum isi (md5/sha/crc isi tidak cocok), tapi **apakah Roblox memvalidasi pack atau APK** belum terbukti. Jika Roblox menolak APK modifikasi, itu batas di luar tool ini.
* Perubahan ukuran shader aman secara format (offset diperbarui, round-trip diuji).
* Nilai dipanggang saat patch: tidak ada slider live.
* Temuan: patch `* 5.0` di TESTKIT lama mengubah blur fog, bukan glossy permukaan.
* Pack Roblox tidak disertakan di repo (aset Roblox); CI memakai pack sintetis.

## Uji
`bash tests/run_tests.sh` (opsional `RZ_REAL_PACK=glsles3.pack GLSLANG=glslangValidator`).

## v10 — perbaikan Depth Pipeline (CB0)
- Di HP kamu `dp_status.txt` menunjukkan `cb0_seen=0` → matriks kamera tidak pernah tertangkap, jadi pass tidak jalan.
- Sekarang `CB0[0..3]` dibaca langsung dari program scene yang aktif (`glGetUniformfv`), tidak tergantung pola `glUniform4fv`.
- Posisi kamera diturunkan dari inverse ViewProjection.
- `dp_status.txt` menambah `cb0_reads`, `cb0_prog`, `u4fv_calls`, `u4fv_maxcount` untuk diagnosa.

## v11 — Mode Glass
- Slider baru **Glass** (Main → "Mode kaca", default 0.70): semua material memantul seperti kaca/basah. Hanya suku pantulan yang diubah; tekstur/albedo asli tidak disentuh.
- Glass menaikkan F0, menurunkan kekasaran, menajamkan pantulan, dan menyalakan pantulan lantai/flat di semua permukaan.
- Set 0 untuk mematikan.

## v12 — MSAA + deteksi CB0 lebih tahan banting
- Dari log HP: depth scene ternyata MSAA (DEPTH16). Sekarang disalin dengan blit resolve (ukuran & format sama), tidak lagi ditolak.
- Lokasi `CB0[0..3]` dicari bertahap: nama per elemen → `CB0[0]`/`CB0` + offset. Bila gagal, `dp_status.txt` mencatat `probe=` (nama uniform CB* & jumlah uniform block) untuk diagnosa.
- Status baru: `msaa`, `probe_ok`, `probe_fail`, `probe`.

## v13 — preset dari PrismShade iOS
- ZIP "PrismShade-Android-Assets-Complete" hanya berisi aset ReShade (.fx/.ini) + demo app; BUKAN port yang jalan di Roblox.
- Preset aslinya hanya memakai MXAO + Outline (iPad) dan SSR + MXAO (Vanilbean). Nilainya dipetakan ke preset "PrismShade iPad", "PrismShade iPad Quality", "Vanilbean" di panel (membutuhkan Depth Pipeline).
- Efek Outline belum ada di mod ini.

## v14 — aset ReShade disertakan
- `shader/reshade-fx/` berisi seluruh aset PrismShade iOS (belum ada runtime FX; lihat README_RZ.md di sana).

## v15 — semua dinyalakan + laporan fitur
- Default ON: Depth Pipeline, MXAO, SSR, DOF (+autofokus), Fog, Rimlight, Glossy, Auto-performa, Glass 0.70.
- Panel (Info/status) dan "salin status" kini memuat "--- laporan fitur ---": [OK] / [GAGAL] + alasan per fitur, dan fitur yang belum ada (Outline, bloom lanjutan).

## v16 — Outline PrismShade
- Efek **Outline** asli PrismShade (`PrismShade_Outline.fx`) diterjemahkan 1:1 ke GLSL ES di pass akhir Depth Pipeline: tepi dari "bend" depth terbalik, threshold `lerp(0.5, 0.008, sqrt(sens))`, fade jarak, tepi langit, blend replace/add/multiply, warna.
- Slider di Main → "Outline (PrismShade)"; default ON; ikut preset PrismShade iPad / iPad Quality.
- Uji WebGL: ada garis di siluet kotak, lantai datar bersih.
- MXAO/SSR qUINT asli belum diterjemahkan (Depth Pipeline masih memakai versi sendiri untuk keduanya).

## v17 — compiler ReShade (reshadefx) + 95 shader PrismShade terkonversi
- `tools/fxc/`: fxc (memakai `reshadefx` dari ReShade, BSD-3) + `fx2es.py` + patch GLSL ES. `bash tools/fxc/build.sh` lalu `bash tools/fxc/convert_all.sh 1920 1080`.
- `shader/fx-es/`: hasil konversi 95 dari 97 file .fx (GLSL ES 3.00 per entry point + manifest teknik/pass/target/uniform). 93 lolos glslang ES; gagal: qUINT_dof (varying struct), CAS/SMAA (butuh makro).
- Belum ada: runtime native yang menjalankan manifest (render target, sampler, uniform, depth/backbuffer ReShade) — langkah berikutnya, dan tetap bergantung pada Depth Pipeline.

## v18 — Tab "ReShade" (UI dari anotasi .fx)
- `shader/fx-ui/fx_ui.json` (94 efek, 1044 parameter) dibuat `tools/fxc/make_ui_index.py` dari anotasi `ui_*` di file `.fx` asli.
- `patch_roblox.py --assets-dir` memasukkan `assets/ryeenzyxnz/fx_ui.json` ke APK; `termux/patch.sh` memakainya otomatis. Wajib patch ulang: `bash termux/patch.sh --live --apk ~/apks/*.apk --install`.
- Panel RZ punya tab **ReShade**: cari efek, filter "hanya ON", saklar per efek, slider/combo/saklar/warna per parameter, reset. Impor preset `.ini` ReShade (Techniques= dan `[file.fx]`) lewat tombol impor yang sudah ada.
- Nilai disimpan di `rz_fx.cfg`: `on=A,B` dan `v.Efek.Uniform=a,b,c`.
- Catatan: runtime native yang menjalankan efek itu BELUM ada; tab ini baru menyimpan pilihan. Menunggu Depth Pipeline di perangkat (`passes_run>0`).
- Tes host: `tests/java/RzFxTest.java` (pakai shim org.json karena Maven diblokir sandbox).

## v19 — Runtime ReShade native + Depth Pipeline jalan di HP
- Depth Pipeline sekarang jalan di perangkat (`passes_run>0`): CB0 dibaca dari uniform block (UBO) lewat salinan buffer, backbuffer disalin dengan `glBlitFramebuffer`.
- `native/module/jni/fxrt.cpp`: runtime efek ReShade. Membaca `rz_fx.cfg` (efek menyala + nilai parameter dari tab ReShade) dan manifest `shader/fx-es/<Efek>/manifest.json`; membuat render target (format DXGI -> GL), mip, uniform (frametime/framecount/timer/pingpong/random), lalu menjalankan semua pass di atas backbuffer + depth.
- Depth disandikan ulang oleh pass `kDpDepthLin` ke R32F (terbalik, far 1000) agar cocok dengan asumsi default ReShade.
- Shader ES diekstrak dari APK (`assets/ryeenzyxnz/fx-es`) ke `<files>/fx-es` saat Roblox mulai (`RzBoot.extractFx`, stamp `fx1`). `patch.sh` memasukkan `fx_ui.json` + `fx-es` ke APK -> **patch ulang wajib**.
- Pertama kali (tanpa `rz_fx.cfg`) efek `qUINT_mxao` + `PrismShade_Outline` menyala.
- Batasan v1: tekstur gambar (LUT, langit/Skybox) belum dimuat; pass stencil-only (MXAO StencilSetup) dilewati; BUFFER 1920x1080 tertanam di shader (tekstur diskalakan ke ukuran layar); sRGB/address mode diabaikan.
- Status di `dp_status.txt`: `fx_on fx_run fx_frames fx_passes fx_fail fx_err`.
- v19b: efek ReShade juga jalan di semua layar (menu/lobby) lewat `runGlobal()` di dpipe: backbuffer penuh (termasuk UI) -> rantai FX dengan depth "tak terhingga" -> layar. Di dalam game, jalur lama (sebelum UI) tetap dipakai. Status: `fx_global_runs`, `fx_global_off` (mati otomatis setelah 5 error berturut-turut).

## v20 — UI baru
- Tab di samping: MAIN, PRESET, SETTING, CREDIT. Semua fitur shader ada di MAIN sebagai dropdown (Global, Depth Pipeline, Glossy & Glass, SSR, MXAO, DOF, Outline, Fog, Rimlight, HDR & Bloom, Warna, Efek Tambahan).
- PRESET: daftar bawaan + tersimpan (`<files>/presets/*.rzp`), nama preset, SAVE, IMPORT dari file, EXPORT ke file (Storage Access Framework lewat `RzFilePick`).
- SETTING: transparansi/ukuran panel, ukuran/transparansi tombol RZ, warna aksen (`rz_ui.cfg`), mesin, data, developer.
- Font Rajdhani + Orbitron (OFL) dari `assets-ui/fonts`, dipasang ke APK oleh `termux/patch.sh`.

## v21
- Efek Tambahan, Glossy & Glass disembunyikan (dimatikan sekali saat pertama dibuka); Auto Quality & FPS Priority dimatikan; Depth Pipeline hanya saklar.
- Preset bawaan: Preset 1 (Basah/PrismShade) dan Preset 2 (Vanilbean). "ON/OFF Shader" menggantikan Master Enable.
- SETTING berisi pengaturan tampilan (tanpa dropdown); Mesin/Data/Developer tersembunyi (ketuk judul CREDIT 7x).
- UI auto-scale mengikuti layar; panel tidak terbuka otomatis saat Roblox dibuka.

## v22
- Tab FEEDBACK (laporan bug/saran) -> relay Vercel (`report-relay/`) -> Discord. Alamat relay: `assets-ui/report_url.txt`.
- Ikon tab/tombol (RzIcons), pilihan font (Rajdhani / Chakra Petch / Share Tech Mono), tab jadi ikon saja di layar sempit.
- Logo RYNZYDEVS sebagai tombol buka (`assets-ui/logo_fab.png`) dan di tab CREDIT (`logo_full.png`).


## Relog / real-time patch update

See [`FIXES-RELOG.md`](FIXES-RELOG.md) for the default-OFF migration, relog touch recovery, live shader/depth hooks, fast config reload, Safe Mode removal, build-id matching, and validation notes.

## v23 — tab EFFECT, versi Roblox lain default ON, tanpa Safe Mode
- Tab baru **EFFECT** di panel: 94 efek ReShade (cari, filter "hanya yang aktif", parameter per efek). Menyalakan satu efek otomatis menyalakan
  Depth Pipeline + ON/OFF Shader (prasyarat runtime). Status runtime (`fx_on/fx_run/fx_fail/fx_err`) tampil di tab itu.
  Efek berjalan di dalam Depth Pipeline (butuh masuk ke game); belum terbukti di HP.
- **Izinkan versi Roblox lain** (`allow_any_build`) kini default **ON** (Java + native), termasuk migrasi sekali untuk instalasi lama (`.ui_v23`).
- **Safe Mode dihapus total**: `safe`/`disable` di rz_config.cfg diterima tapi dipaksa false; tombol "Reset safe mode" dihapus.
- Uji baru: `tests/fx_contract.py` (UI == runtime, panel memuat tab, default, tanpa safe mode) dan asersi tambahan di `config_test.cpp`.

## v25
- Glossy dan Glass dihapus (panel, engine, patcher, preset). Kunci lama di config/preset tetap diterima dan diabaikan. Pantulan permukaan kini hanya dikendalikan oleh "Basah".
- Tab EFFECT hanya tampil untuk perangkat developer; untuk pengguna biasa semua efek FX dimatikan.
- Depth Pipeline dan Paksa OpenGL ES default ON; saklarnya ada di menu Developer.
- Seluruh keterangan di panel dirapikan agar singkat dan profesional.
