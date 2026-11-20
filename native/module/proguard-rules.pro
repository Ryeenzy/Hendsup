# Obfuscation buat overlay panel RYEENZYXNZ. Dijalankan di build.sh sebelum masuk d8.
#
# Cuma SATU hal yang wajib dijaga: native (JNI) manggil com.ryeenzyxnz.overlay.RzBoot.start(String)
# langsung by name (lihat native/module/jni/jvm_boot.cpp). Kalau nama ini ikut diacak, payload
# crash saat boot karena GetStaticMethodID gagal nemuin method-nya.
-keep class com.ryeenzyxnz.overlay.RzBoot {
    public static void start(java.lang.String);
}

# Semua kelas lain (RzPanel, RzLicense, RzPresetsRemote, dst) BEBAS diacak: nama kelas, nama
# metode, nama field semua boleh diganti jadi a/b/c. Tidak ada yang manggil mereka by-name dari
# luar dex ini (JNI atau reflection), jadi aman.
-repackageclasses ''
-allowaccessmodification
-overloadaggressively

# android.jar cuma dipakai buat referensi tipe (library), bukan yang diacak -> banyak kelas Android
# yang disebut tapi tidak lengkap (stub). Supaya build tidak gagal gara-gara warning yang tidak
# relevan:
-dontwarn **
-dontnote **
-ignorewarnings
