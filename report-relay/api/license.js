// Verifikasi key lisensi RYEENZYXNZ. Dua jenis key:
//   1. Key OTOMATIS dari activate.js, bentuk "RYNZYSHADE-<device>-<tanda tangan>" — dicek ulang pakai
//      HMAC(APP_SECRET), tidak perlu database. Dicabut per device lewat REVOKED_DEVICES, atau
//      dicabut SEMUANYA sekaligus dengan mengganti APP_SECRET di Vercel.
//   2. Key MANUAL (VIP/tester) dari env LICENSE_KEYS (JSON):
//        {"ABCD-1234-EFGH": null, "WXYZ-9999-TEST": "2027-01-01"}
//        value null = tanpa batas waktu, value "YYYY-MM-DD" = kedaluwarsa (UTC)
//
// Env: APP_SECRET, REVOKED_DEVICES, LICENSE_KEYS, LICENSE_DISABLED — lihat _lib.js

const { checkKey, rateLimiter, clientIp, checkinDevice } = require('./_lib');
const limited = rateLimiter(15, 60_000);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  if (limited(clientIp(req))) return res.status(429).json({ ok: false, error: 'too many requests' });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  const r = checkKey(b.key, b.device);
  if (r.ok) await checkinDevice(String(b.device || '').trim().toUpperCase());
  return res.status(200).json(r);
};
