// Vercel Function: chuyển yêu cầu AI tới Claude API (khoá API giữ bí mật trên máy chủ)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pw = process.env.APP_PASSWORD;
  if (pw && req.headers['x-app-password'] !== pw) return res.status(401).json({ error: 'Sai mật khẩu' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'Chưa cài ANTHROPIC_API_KEY trong Vercel' });
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { prompt = '', images = [], tier = '' } = body;
  const model = tier === 'quick' ? (process.env.MODEL_QUICK || 'claude-haiku-5-5') : (process.env.MODEL || 'claude-sonnet-5-5');
  const content = [
    ...images.slice(0, 4).map(data => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } })),
    { type: 'text', text: String(prompt).slice(0, 80000) }
  ];
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content }] })
    });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: (j.error && j.error.message) || 'Lỗi Claude API' });
    res.status(200).json({ text: (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('') });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
