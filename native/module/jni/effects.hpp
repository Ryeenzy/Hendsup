#pragma once
#include "config.hpp"

namespace rz {

// One fullscreen post pass run just before eglSwapBuffers, inside Roblox's GL context.
// All touched GL state is saved and restored. Any GL error or unsupported condition
// permanently disables the pass for this process (fail closed).
class Effects {
public:
    // Must be called on the render thread with Roblox's context current.
    // Returns false once the pass has failed and will no longer run.
    bool render(const Config& cfg, int width, int height);
    bool failed() const { return failed_; }
    const char* reason() const { return reason_; }

private:
    bool createProgram();
    bool ensureTexture(int w, int h);
    bool fail(const char* why);

    bool failed_ = false;
    const char* reason_ = "";
    void* ctx_ = nullptr;
    unsigned prog_ = 0, vao_ = 0, tex_ = 0;
    int tw_ = 0, th_ = 0;
    int uTex_ = -1, uTexel_ = -1, uA_ = -1, uB_ = -1, uC_ = -1, uD_ = -1, uE_ = -1, uSun_ = -1;
    bool checkedVersion_ = false;
};

}  // namespace rz
