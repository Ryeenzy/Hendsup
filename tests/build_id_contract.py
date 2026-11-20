#!/usr/bin/env python3
"""Regression tests for APK-specific GNU Build ID binding."""
import os, struct, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "native", "tools"))
import patch_roblox

# Build a minimal ELF64 LE image containing one GNU PT_NOTE.
build_id = bytes.fromhex("0123456789abcdef0123456789abcdef01234567")
note = struct.pack("<III", 4, len(build_id), 3) + b"GNU\0" + build_id
note += b"\0" * ((-len(note)) % 4)
phoff, noteoff = 64, 120
elf = bytearray(noteoff + len(note))
elf[:16] = b"\x7fELF" + bytes([2, 1, 1]) + b"\0" * 9
struct.pack_into("<Q", elf, 32, phoff)
struct.pack_into("<HH", elf, 54, 56, 1)
struct.pack_into("<IIQQQQQQ", elf, phoff, 4, 0, noteoff, 0, 0, len(note), len(note), 4)
elf[noteoff:] = note
assert patch_roblox.elf_gnu_build_id(bytes(elf)) == build_id.hex()

original_id = "4a916f58386d0c329a1202bfc4df0c392e869487"
marker = original_id.encode("ascii") + b"\0" * (128 - len(original_id))
payload = b"prefix" + marker + b"suffix"
bound = patch_roblox.bind_payload_build_id(payload, build_id.hex())
expected = build_id.hex().encode("ascii") + b"\0" * (128 - len(build_id.hex()))
assert expected in bound and marker not in bound
print("BUILD-ID CONTRACT PASS")
