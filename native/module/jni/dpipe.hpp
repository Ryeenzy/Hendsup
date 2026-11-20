// RYEENZYXNZ depth pipeline: menangkap depth scene Roblox dan menjalankan pass layar AO/SSR/DOF di titik pipeline yang benar.
//  * depth: disalin (glBlitFramebuffer) dari FBO scene tepat sebelum engine membuangnya (glInvalidateFramebuffer) atau sebelum FBO dilepas
//  * matriks: ViewProjection dari CB0[0..3] yang ditangkap di glUniform4fv (array 61 vec4 milik Roblox)
//  * titik sisip: setelah pass layar-penuh terakhir ke framebuffer 0 dan sebelum draw UI pertama (UI tidak ikut kabur/teredam)
// Semua hook dipanggil di thread render. Error GL apa pun mematikan pipeline (fail closed) dan dicatat di dp_status.txt.
#pragma once
#include <string>

namespace rz {

void dpSetDir(const std::string& dir);
bool dpEnabled();                                   // cfg.depthPipe && !safe && !disable && belum gagal
void dpOnUseProgram(unsigned prog);                // setelah glUseProgram asli
void dpOnProgramGone(unsigned prog);               // program dihapus / di-link ulang
void dpOnBindFbo(unsigned target, unsigned fbo);    // sebelum glBindFramebuffer asli
void dpOnViewport(int x, int y, int w, int h);
void dpOnDepthFunc(unsigned func);
void dpOnUniform4fv(int count, const float* v);
void dpOnInvalidate(unsigned target, int n, const unsigned* att);  // sebelum glInvalidateFramebuffer asli
void dpBeforeDraw(unsigned mode, int count);        // sebelum draw asli
void dpAfterDraw(unsigned mode, int count);         // sesudah draw asli
void dpAfterBlit();                                 // sesudah glBlitFramebuffer Roblox
void dpOnSwap(int width, int height);               // sebelum eglSwapBuffers asli
std::string dpStatus();


}  // namespace rz
