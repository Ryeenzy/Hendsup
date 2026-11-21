# RYEENZYXNZ Relog/UI Fix v2 — diagnosis

## Confirmed source defect: Build ID binding

The previous fixed source contained two incompatible Build ID patching schemes:

- `payload.cpp` declared `kBuildId[129]` initialized with the 40-character build ID `4a916f58386d0c329a1202bfc4df0c392e869487`.
- `patch_roblox.py` first required a different `f00d...` sentinel that was not present in `payload.cpp`.
- It then tried to replace the fixed-width `kBuildId` buffer using `b"\\0"`, which encodes the two literal bytes backslash + zero, not NUL padding.

That means the patcher and payload did not agree on the marker representation. v2 removes the unrelated sentinel path and uses one fixed-width binder with real NUL bytes (`b"\0"`). The target GNU Build ID is read from the exact `libroblox.so` in the supplied APK and inserted into the payload before packaging. The patcher fails closed if the marker is absent, duplicated, or the target has no GNU Build ID.

`core.cpp` now logs both expected and actual IDs when the guard rejects a build, so a remaining mismatch can be diagnosed rather than guessed.

## UI relog hardening

`RzBoot` now retries attaching the overlay for a bounded period after Activity resume and window-focus changes. This covers Roblox rebuilding/replacing its decor hierarchy shortly after resume. Existing panels are reattached and raised rather than duplicated. `RzPanel.ensureAttached()` reasserts the root and child elevations and brings the overlay to the front.

## Preserved behavior

- Shader source files and shader rendering/effect implementation were not modified in this v2 patch.
- Existing default-OFF state migration is preserved.
- Existing content-based config reload is preserved; it does not depend on one-second `st_mtime` resolution.
- Existing automatic Safe Mode removal is preserved; boot count no longer forces users into Safe Mode.
- Theme/font changes continue to rebuild the Java overlay immediately.

## Validation

Passed in this environment:

- Python syntax compilation for the patcher and regression test.
- New `build_id_contract.py` regression test: ELF GNU note extraction and fixed-width payload Build ID binding.
- `tests/run_tests.sh`.
- `native/module` host test suite, including hook, config parser, patch, depth-math and FX runtime tests.
- ZIP integrity and shader-file hash comparison against the prior fixed source.

Not run here:

- Android Java compilation against the Android SDK.
- Android NDK payload build.
- Installation and relog/touch testing on the user's Redmi 12 / Roblox build.

A fresh payload must be built from this v2 source via the repository's GitHub Actions/native build before patching Roblox. Do not reuse the old payload artifact.
