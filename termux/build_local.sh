#!/data/data/com.termux/files/usr/bin/sh
# Build payload langsung di Termux (tanpa GitHub Actions). BELUM DIUJI di HP: kalau error, kirim lognya.
# Hasil: native/libryeenzyxnz_payload.so  (lalu jalankan termux/patch.sh --live seperti biasa)
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)
pkg install -y clang cmake make python openjdk-17 curl unzip >/dev/null 2>&1 || true
W=$HOME/rz-build; mkdir -p "$W"

# 1) android.jar (hanya untuk kompilasi Java)
if [ ! -f "$W/android.jar" ]; then
  curl -L -o "$W/android.jar" https://github.com/Sable/android-platforms/raw/master/android-33/android.jar
fi
# 2) d8 (dari r8.jar Google); kalau gagal unduh, pakai paket Termux 'dx' sebagai cadangan
if [ ! -f "$W/r8.jar" ]; then
  curl -L -o "$W/r8.jar" https://dl.google.com/dl/android/maven2/com/android/tools/r8/8.5.35/r8-8.5.35.jar || rm -f "$W/r8.jar"
fi

cd native/module
rm -rf build && mkdir -p build/classes build/dex build/arm64/gen
javac -source 8 -target 8 -Xlint:-options -cp "$W/android.jar" -d build/classes ../overlay/com/ryeenzyxnz/overlay/*.java
java -cp "$W/r8.jar" com.android.tools.r8.D8 --min-api 26 --lib "$W/android.jar" --output build/dex $(find build/classes -name '*.class')
python3 ../tools/dex2h.py build/dex/classes.dex build/arm64/gen/overlay_dex.h

# 3) native: tanpa cmake (cmake Termux memaksa -lc++_shared). Kompilasi langsung, libc++ di-static.
pkg install -y libc++ >/dev/null 2>&1 || true
P=${PREFIX:-/data/data/com.termux/files/usr}
CXXA=$(find "$P" /system -name 'libc++_static.a' -o -name 'libc++.a' 2>/dev/null | head -1)
ABIA=$(find "$P" -name 'libc++abi.a' 2>/dev/null | head -1)
echo "libc++ static: ${CXXA:-tidak ada}  abi: ${ABIA:-tidak ada}"
OUT=build/arm64/payload; mkdir -p "$OUT"
SRC="payload.cpp jvm_boot.cpp hook.cpp glhooks.cpp trace.cpp dpipe.cpp fxrt.cpp effects.cpp core.cpp"
if [ -n "$CXXA" ]; then STL="-nostdlib++ $CXXA ${ABIA}"; else STL="-lc++_shared"; echo "PERINGATAN: libc++ static tidak ada, hasil butuh libc++_shared.so (mungkin gagal dimuat di Roblox)"; fi
cd jni
clang++ -std=c++17 -O2 -fPIC -shared -fvisibility=hidden -Wall -Wextra -I../build/arm64/gen $SRC \
  -o "../$OUT/libryeenzyxnz.so" -Wl,-z,max-page-size=16384 -Wl,--build-id -Wl,--allow-shlib-undefined \
  -L/system/lib64 -llog -lEGL -lGLESv3 -ldl $STL
cd ..
SO="$OUT/libryeenzyxnz.so"
[ -f "$SO" ] || { echo "GAGAL: libryeenzyxnz.so tidak terbentuk"; exit 1; }
cp "$SO" "$ROOT/native/libryeenzyxnz_payload.so"
echo "OK: $ROOT/native/libryeenzyxnz_payload.so"
command -v readelf >/dev/null && readelf -d "$ROOT/native/libryeenzyxnz_payload.so" | grep NEEDED || true
