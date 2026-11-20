# config/

`default.json` = parameter bawaan (sama dengan preset `natural`). Salin & ubah, lalu:

    bash termux/patch.sh --preset config/punya_saya.json

Kunci yang dikenal (nilai di luar rentang ditolak/dipotong):

| kunci | rentang | arti |
|---|---|---|
| wet | 0..1 | efek basah/becek (roughness turun, highlight kuat) |
| glossy | 0..1 | kekuatan pantulan material PBR (F0, LOD, gain) |
| contrast, saturation | 0..2 | grading di shader komposit akhir |
| brightness | -0.15..0.15 | |
| warmth | -1..1 | geser merah/biru |
| vibrance | -1..1 | |
| levels_black / levels_white | 0..1 | Levels (Rods: 13/255, 207/255) |
| curves | 0..1 | S-curve |
| bloom_gain | 0.5..3 | pengali bobot bloom milik engine (0 jika dunia tanpa bloom) |

Nilai dipanggang ke shader saat patch; ganti = patch ulang dari APK asli.
