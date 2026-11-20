# Relay laporan RYEENZYXNZ

Panel mengirim laporan ke URL ini, lalu relay meneruskannya ke Discord. Dengan begitu URL webhook asli tidak ada di dalam APK
(APK bisa dibongkar siapa saja; webhook yang bocor bisa dipakai untuk spam).

## Pasang
1. Buat webhook di Discord: Server Settings -> Integrations -> Webhooks -> New Webhook -> Copy Webhook URL.
2. Buat project Vercel baru dari folder `report-relay` ini (atau taruh `api/report.js` di project Vercel milikmu).
3. Di Vercel: Settings -> Environment Variables -> `DISCORD_WEBHOOK` = URL webhook tadi. Deploy ulang.
4. Alamat relay: `https://NAMA-PROJECT.vercel.app/api/report`
5. Taruh alamat itu di berkas `assets-ui/report_url.txt` pada repo (satu baris, harus diawali `https://`), lalu patch ulang APK.

## Keamanan
- Batas 5 laporan per menit per IP, panel juga membatasi 1 laporan per 30 detik.
- Isi dipotong (pesan 1800 huruf, status 1800 huruf), mention (`@everyone`) dimatikan.
- Kalau webhook pernah bocor: hapus webhook di Discord dan buat baru, ganti env var di Vercel. APK tidak perlu diubah.
