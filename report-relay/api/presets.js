// Mengirim ISI preset (angka-angka shader yang sudah ditata) HANYA ke key yang valid.
// Data preset TIDAK ada di APK sama sekali — disimpan di env PRESET_DATA di Vercel, jadi kalau
// APK dibongkar orang cuma nemu kerangka UI-nya, bukan isi presetnya.
//
// Format env PRESET_DATA (JSON):
//   [
//     { "name": "Preset 1", "values": { "glossy": 1, "wet": 0.9, "contrast": 0.15, ... } },
//     { "name": "Preset 2", "values": { "depth_pipe": 1, "ss_int": 2.0, ... } }
//   ]
// Nama kunci di "values" harus sama dengan kunci di module/jni/config.hpp (lihat RzState.java).

const { checkKey, rateLimiter, clientIp } = require('./_lib');
const limited = rateLimiter(20, 60_000);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  if (limited(clientIp(req))) return res.status(429).json({ ok: false, error: 'too many requests' });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  const r = checkKey(b.key, b.device);
  if (!r.ok) return res.status(200).json({ ok: false, error: r.error });

  const raw = process.env.PRESET_DATA;
  if (!raw) return res.status(200).json({ ok: false, error: 'preset belum dikonfigurasi' });
  let presets;
  try { presets = JSON.parse(raw); } catch (e) { return res.status(500).json({ ok: false, error: 'bad config' }); }

  return res.status(200).json({ ok: true, presets });
};
