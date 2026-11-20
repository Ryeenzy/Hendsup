// Trace frame: merekam satu frame render Roblox (FBO, texture, depth, urutan draw, program->hash shader)
// ke <dump>/trace_frame.txt. Hook dipasang hanya bila cfg.trace aktif saat start (butuh restart Roblox).
// Rekaman dipicu di dalam game: nyalakan "trace_now" lalu matikan lagi (edge naik = rekam 1 frame).
#pragma once
#include <string>

namespace rz {

struct TraceHook {
    const char* name;
    void* hook;
    void** orig;
};

const TraceHook* traceHooks(int* count);          // tabel hook GL tambahan
void traceSetDir(const std::string& dir);
void traceOnSwap(bool traceNow);                  // dipanggil dari eglSwapBuffers
void traceShaderHash(unsigned shader, const std::string& hash);  // dari glShaderSource
void traceOnUseProgram(unsigned program);         // dari glUseProgram
void traceOnFbTex(unsigned target, unsigned attachment, unsigned tex, int level);
bool traceInstalled();
void traceSetInstalled(bool v);

}  // namespace rz
