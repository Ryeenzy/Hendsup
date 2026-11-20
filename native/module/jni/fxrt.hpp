// RYEENZYXNZ runtime efek ReShade: menjalankan manifest hasil tools/fxc (shader/fx-es) di atas backbuffer + depth yang ditangkap dpipe.
// Dipanggil dari dpipe::runPass (thread render, state GL sudah disimpan oleh pemanggil).
#pragma once
#include <string>

namespace rz {

void fxrtSetDirs(const std::string& cfgDir, const std::string& fxDir);  // cfgDir berisi rz_fx.cfg; fxDir berisi <Efek>/manifest.json
int fxrtEnabled();                                                       // jumlah efek menyala (cfg dibaca ulang tiap ~1 detik)
// colorFbo: FBO berisi salinan backbuffer (RGBA8, W x H). depthTex: depth yang sudah disandikan ala ReShade (R32F).
// VAO kosong harus terikat. Hasil: FBO berisi gambar akhir (0 bila tidak ada pass yang jalan).
unsigned fxrtRun(unsigned colorFbo, unsigned depthTex, int W, int H, long frame);
void fxrtReset();                                                        // konteks GL baru: buang semua objek GL
std::string fxrtStatus();

}  // namespace rz
