# RYEENZYXNZ relog UI lifecycle fix

## Changes
- `RzBoot.start()` no longer permanently marks initialization complete when the Android `Application` is not yet available.
- Lifecycle callback registration is idempotent.
- On every Roblox Activity resume, an existing panel is checked against the current decor view. If Roblox retained the Activity but detached/replaced the overlay view tree during a lobby/game transition, the overlay is rebuilt and reattached.
- The overlay root is explicitly non-clickable/non-focusable so its empty full-screen area does not consume Roblox touches.
- Detach clears pending Handler callbacks and view references so an old Activity cannot keep updating stale UI after relog.
- UI rebuild cancels the previous polling/save/toast callbacks before creating a new view tree, preventing duplicate polling loops.

## Validation limitation
The source archive does not include an Android SDK `android.jar` or NDK toolchain in this environment. Java compilation and native payload rebuild therefore could not be completed here. The patch is source-level only; rebuild `libryeenzyxnz_payload.so` with `native/module/build.sh` in an Android SDK + NDK environment before installing. Do not treat the pre-existing `.so` or `classes.dex` in the archive as rebuilt outputs.

## Required runtime checks
1. Patch Roblox and launch; confirm FAB and panel buttons respond.
2. Return to Roblox home/lobby without force-stopping the process; confirm FAB still responds.
3. Enter a game, return to lobby, and repeat at least three times.
4. Rotate/resize or change display mode if supported; confirm the panel is repositioned and remains touchable.
5. Check `adb logcat -s RYEENZYXNZ` for `attach gagal`, `start gagal`, or lifecycle errors.
