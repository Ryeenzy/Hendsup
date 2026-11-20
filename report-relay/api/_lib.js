// Helper bersama, dipakai oleh license.js dan presets.js. Nama diawali "_" supaya Vercel tidak
// menganggap ini endpoint sendiri.
const crypto = require('crypto');

function sign(device, secret) {
  return crypto.createHmac('sha256', secret).update(device).digest('hex').toUpperCase();
}

function revokedList() {
  return String(process.env.REVOKED_DEVICES || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
}

/** Device punya developer sendiri — diisi env DEV_DEVICES (daftar device id, dipisah koma). */
function devList() {
  return String(process.env.DEV_DEVICES || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
}

function isDevDevice(rawDevice) {
  const d = String(rawDevice || '').trim().toUpperCase();
  return d.length > 0 && devList().includes(d);
}

/** Mengembalikan {ok, error?, exp?, dev} tanpa pernah melempar. `dev` dicek dari device yang
 * benar-benar mengirim request (rawDevice), terlepas dari key-nya valid atau tidak. */
function checkKey(rawKey, rawDevice) {
  const dev = isDevDevice(rawDevice);
  if (process.env.LICENSE_DISABLED === 'true') return { ok: false, error: 'lisensi sedang dimatikan', dev };
  const key = String(rawKey || '').trim().toUpperCase();
  if (!key) return { ok: false, error: 'key kosong', dev };

  // "AUTO-" dipertahankan sebagai alias key lama (biar device yang udah kadung aktivasi sebelum
  // prefix diganti tidak mendadak invalid); device baru selalu dapat "RYNZYSHADE-".
  if (key.startsWith('RYNZYSHADE-') || key.startsWith('AUTO-')) {
    const secret = process.env.APP_SECRET;
    if (!secret) return { ok: false, error: 'server belum siap', dev };
    const parts = key.split('-');
    if (parts.length !== 3) return { ok: false, error: 'key rusak', dev };
    const device = parts[1], sig = parts[2];
    if (revokedList().includes(device)) return { ok: false, error: 'device diblokir', dev };
    if (sig !== sign(device, secret)) return { ok: false, error: 'key tidak valid', dev };
    return { ok: true, exp: 0, dev };
  }

  const raw = process.env.LICENSE_KEYS;
  if (!raw) return { ok: false, error: 'key tidak dikenal', dev };
  let table;
  try { table = JSON.parse(raw); } catch (e) { return { ok: false, error: 'bad config', dev }; }
  if (!(key in table)) return { ok: false, error: 'key tidak dikenal', dev };

  const expVal = table[key];
  let exp = 0;
  if (expVal) {
    const t = Date.parse(expVal + 'T23:59:59Z');
    if (!isNaN(t)) {
      exp = t;
      if (Date.now() > t) return { ok: false, error: 'key sudah kedaluwarsa', dev };
    }
  }
  return { ok: true, exp, dev };
}

function rateLimiter(maxPerWindow, windowMs) {
  const hits = new Map();
  return function limited(ip) {
    const now = Date.now();
    const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
    arr.push(now);
    hits.set(ip, arr);
    return arr.length > maxPerWindow;
  };
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

/**
 * Catat "device ini baru saja aktif" ke tabel Supabase rz_devices (lihat devices.js untuk SQL-nya).
 * Best-effort: gagal/SUPABASE_URL belum diisi tidak boleh bikin license/activate ikut gagal, jadi
 * semua error ditelan diam-diam di sini.
 */
async function checkinDevice(device) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key || !device) return;
  try {
    await fetch(`${url}/rest/v1/rz_devices?on_conflict=device`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify([{ device, last_seen: new Date().toISOString() }]),
    });
  } catch (e) { /* diam-diam diabaikan, ini cuma statistik */ }
}

module.exports = { checkKey, rateLimiter, clientIp, isDevDevice, sign, checkinDevice };
