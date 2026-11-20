// Loads the embedded overlay dex into Roblox's own process (InMemoryDexClassLoader) and calls RzBoot.start(filesDir).
#pragma once
#include <string>

namespace rz {
// Returns "" on success, otherwise a short reason. Safe to call repeatedly until it succeeds.
std::string bootOverlay(const std::string& filesDir);
}  // namespace rz
