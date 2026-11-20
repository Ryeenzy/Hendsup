// Aktivasi key otomatis RYEENZYXNZ: APK kirim ID device, server balas key yang ditandatangani (HMAC).
// Tidak perlu database — key = "RYNZYSHADE-<device>-<tanda tangan>", dan tanda tangan dicek ulang tiap saat
// pakai APP_SECRET yang sama (lihat license.js). Keuntungan: 1 device = 1 key otomatis, tapi tetap
// bisa dicabut kapan saja lewat REVOKED_DEVICES, dan bisa dicabut SEMUA sekaligus dengan mengganti
// APP_SECRET (semua key lama langsung tidak valid).
//
// Env yang dipakai (sama dengan license.js):
//   APP_SECRET          wajib, string rahasia untuk tanda tangan (jangan taruh di APK)
//   ACTIVATION_ENABLED  opsional, set "false" untuk menghentikan aktivasi device BARU (device lama
//                        yang sudah punya key tetap jalan kecuali ditambah ke REVOKED_DEVICES)
//   REVOKED_DEVICES     opsional, daftar device id (huruf besar) dipisah koma yang diblokir

const { isDevDevice, sign, checkinDevice } = require('./_lib');

const WINDOW_MS = 60_000, MAX_PER_WINDOW = 8;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const secret = process.env.APP_SECRET;
  if (!secret) return res.status(500).json({ ok: false, error: 'not configured' });
  if (process.env.ACTIVATION_ENABLED === 'false') return res.status(200).json({ ok: false, error: 'aktivasi baru sedang ditutup' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'too many requests' });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  const device = String(b.device || '').trim().toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 32);
  if (device.length < 8) return res.status(400).json({ ok: false, error: 'device id tidak valid' });

  const revoked = String(process.env.REVOKED_DEVICES || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  if (revoked.includes(device)) return res.status(200).json({ ok: false, error: 'device diblokir' });

  await checkinDevice(device);
  const key = `RYNZYSHADE-${device}-${sign(device, secret)}`;
  return res.status(200).json({ ok: true, key, exp: 0, dev: isDevDevice(device) });
};
