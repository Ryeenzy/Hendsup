// Lihat jumlah device yang pernah/lagi aktif. HANYA bisa diakses device yang ada di DEV_DEVICES
// (lihat _lib.js) — bukan fitur buat user biasa.
//
// Butuh tabel Supabase "rz_devices", bikin sekali lewat SQL Editor di dashboard Supabase:
//
//   create table if not exists rz_devices (
//     device text primary key,
//     first_seen timestamptz not null default now(),
//     last_seen timestamptz not null default now()
//   );
//
// Env yang dipakai:
//   SUPABASE_URL           URL project Supabase, contoh https://xxxxx.supabase.co
//   SUPABASE_SERVICE_KEY   service_role key (Project Settings -> API) — JANGAN pakai anon key,
//                          dan JANGAN taruh di APK, cuma di env Vercel ini
//   DEV_DEVICES            lihat _lib.js

const { isDevDevice } = require('./_lib');

async function countSince(url, key, sinceIso) {
  const qs = sinceIso ? `&last_seen=gte.${encodeURIComponent(sinceIso)}` : '';
  const r = await fetch(`${url}/rest/v1/rz_devices?select=device${qs}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact', Range: '0-0' },
  });
  const range = r.headers.get('content-range') || '';
  const total = parseInt(range.split('/')[1] || '0', 10);
  return isNaN(total) ? 0 : total;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  const device = String(b.device || '').trim().toUpperCase();
  if (!isDevDevice(device)) return res.status(200).json({ ok: false, error: 'bukan device developer' });

  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return res.status(200).json({ ok: false, error: 'supabase belum dikonfigurasi' });

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [active24h, total] = await Promise.all([
      countSince(url, key, since24h),
      countSince(url, key, null),
    ]);
    return res.status(200).json({ ok: true, active_24h: active24h, total });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'gagal query supabase' });
  }
};
