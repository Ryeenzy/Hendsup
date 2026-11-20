// Hooks on Roblox's own GL calls, installed next to the eglSwapBuffers hook:
//   glShaderSource       : dump every shader's source (once per hash) and/or rewrite it with rz_shader_rules.txt
//   glProgramBinary      : optionally swallowed, so Roblox falls back to compiling from source (see cfg.blockProgramBinary)
//   glFramebufferTexture2D : logs depth attachments (needed to learn where scene depth lives)
// Functions Roblox resolves through eglGetProcAddress (ES3) are caught by wrapping eglGetProcAddress itself.
#pragma once
#include <string>

#include "hook.hpp"

namespace rz {

struct GlStats {
    int seen = 0, dumped = 0, patched = 0, binaryBlocked = 0, depthEvents = 0;
};

void glhooksSetPaths(const std::string& dumpDir, const std::string& rulesPath);
bool glhooksInstall(const LoadedImage& im);  // returns true if at least one hook was placed
void glhooksRemove();
GlStats glhooksStats();
std::string glhooksSummary();  // which hooks are active, e.g. "ShaderSource=plt,ProgramBinary=egl"

}  // namespace rz
