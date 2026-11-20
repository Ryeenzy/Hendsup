#!/bin/sh
# Builds libryeenzyxnz_payload.so: overlay (Java -> dex -> embedded) + native engine.
# Needs: JDK 17, Android SDK (platform android.jar + build-tools d8), Android NDK r26+, cmake, python3.
#   ANDROID_HOME=... ANDROID_NDK_HOME=... sh module/build.sh
set -e
: "${ANDROID_NDK_HOME:?set ANDROID_NDK_HOME}"
: "${ANDROID_HOME:?set ANDROID_HOME (Android SDK)}"
cd "$(dirname "$0")"
PLATFORM=$(ls -d "$ANDROID_HOME"/platforms/android-* | sort -V | tail -1)
D8=$(ls -d "$ANDROID_HOME"/build-tools/* | sort -V | tail -1)/d8
echo "platform: $PLATFORM   d8: $D8"
rm -rf build gen && mkdir -p build/classes build/classes-obf build/dex build/arm64/gen
javac -source 8 -target 8 -Xlint:-options -cp "$PLATFORM/android.jar" -d build/classes ../overlay/com/ryeenzyxnz/overlay/*.java

# Obfuscate nama kelas/metode/field (RzPanel, RzLicense, dst) sebelum masuk dex, supaya tidak
# gampang dibaca kalau APK dibongkar. Satu-satunya nama yang WAJIB tetap (RzBoot.start) dijaga
# lewat proguard-rules.pro karena dipanggil langsung dari native/module/jni/jvm_boot.cpp.
PROGUARD_VERSION="${PROGUARD_VERSION:-7.4.2}"
PROGUARD_JAR="build/proguard-$PROGUARD_VERSION.jar"
if [ ! -f "$PROGUARD_JAR" ]; then
  echo "unduh ProGuard $PROGUARD_VERSION..."
  curl -fsSL -o build/proguard.zip "https://github.com/Guardsquare/proguard/releases/download/v$PROGUARD_VERSION/proguard-$PROGUARD_VERSION.zip"
  unzip -q -o build/proguard.zip -d build/proguard-dist
  cp "build/proguard-dist/proguard-$PROGUARD_VERSION/lib/proguard.jar" "$PROGUARD_JAR"
fi
java -jar "$PROGUARD_JAR" \
  -injars build/classes \
  -outjars build/classes-obf \
  -libraryjars "$PLATFORM/android.jar" \
  -dontshrink -dontoptimize \
  @proguard-rules.pro

"$D8" --min-api 26 --lib "$PLATFORM/android.jar" --output build/dex $(find build/classes-obf -name '*.class')
python3 ../tools/dex2h.py build/dex/classes.dex build/arm64/gen/overlay_dex.h
cmake -S jni -B build/arm64 \
  -DCMAKE_TOOLCHAIN_FILE="$ANDROID_NDK_HOME/build/cmake/android.toolchain.cmake" \
  -DANDROID_ABI=arm64-v8a -DANDROID_PLATFORM=android-26 -DANDROID_STL=c++_static -DCMAKE_BUILD_TYPE=Release
cmake --build build/arm64 -j
cp build/arm64/payload/libryeenzyxnz.so libryeenzyxnz_payload.so
echo "Built: $(pwd)/libryeenzyxnz_payload.so"
# NEEDED check: only liblog/libEGL/libGLESv3/libc/libm/libdl (no libc++_shared.so)
(command -v "$ANDROID_NDK_HOME/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-readelf" >/dev/null && \
  "$ANDROID_NDK_HOME/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-readelf" -d libryeenzyxnz_payload.so | grep NEEDED) || true
