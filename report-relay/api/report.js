// Relay laporan RYEENZYXNZ -> Discord webhook. URL webhook disimpan sebagai env var di Vercel, bukan di APK.
const WINDOW_MS = 60_000, MAX_PER_WINDOW = 5;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

const clip = (s, n) => String(s == null ? '' : s).slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const hook = process.env.DISCORD_WEBHOOK;
  if (!hook) return res.status(500).json({ ok: false, error: 'not configured' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'too many requests' });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  if (b.app !== 'RYEENZYXNZ') return res.status(400).json({ ok: false });
  const category = ['Bug', 'Saran', 'Lainnya'].includes(b.category) ? b.category : 'Lainnya';
  const message = clip(b.message, 1800).trim();
  if (message.length < 10) return res.status(400).json({ ok: false, error: 'message too short' });

  const embeds = [{
    title: `[${category}] RYEENZYXNZ ${clip(b.ver, 12)}`,
    description: message,
    color: category === 'Bug' ? 0xE07070 : 0x5EEAD4,
    fields: [
      { name: 'Perangkat', value: clip(b.device, 200) || '-' },
      { name: 'Kontak', value: clip(b.contact, 200) || '-' },
    ],
  }];
  const diag = clip(b.diag, 1800);
  if (diag) embeds.push({ title: 'Status engine', description: '```\n' + diag.replace(/```/g, "'''") + '\n```' });

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'RYEENZYXNZ Report', allowed_mentions: { parse: [] }, embeds }),
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
