# fxc — compiler ReShade FX untuk mod ini
Memakai `reshadefx` dari ReShade (crosire/reshade, BSD 3-clause) untuk membaca file `.fx` dan menghasilkan GLSL,
lalu `fx2es.py` mengubahnya ke GLSL ES 3.00 per entry point + `manifest.json` (teknik, pass, render target, sampler, uniform).
Patch kecil `glsl_es_scalar_swizzle.patch`: GLSL ES tidak mengizinkan swizzle pada skalar (`x.xxx` -> `vec3(x)`).
Hasil uji (host, glslang ES 3.00): 91 dari 97 file `.fx` terkonversi dan lolos validasi.
Belum terkonversi: CAS, SMAA (butuh makro/preset), qUINT_dof (struct varying).
Ukuran buffer (BUFFER_WIDTH/HEIGHT) tertanam saat kompilasi; jalankan ulang dengan resolusi perangkat (-D BUFFER_WIDTH=... -D BUFFER_HEIGHT=...).
Runtime (menjalankan pass/target/uniform) belum ada di native; lihat README utama.
