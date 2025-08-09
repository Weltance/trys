// /api/subscribe.js
// Vercel Serverless Function — stores newsletter emails in Vercel KV
// Requires env vars set by Vercel KV integration:
//   KV_REST_API_URL, KV_REST_API_TOKEN
// Optional: KV_NAMESPACE or KV_REST_API_READ_ONLY_TOKEN (not required here)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }
    const e = email.trim().toLowerCase();
    // Basic validation
    const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!reEmail.test(e)) {
      return res.status(422).json({ ok: false, error: 'Invalid email' });
    }

    // Prepare KV request
    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;
    if (!KV_URL || !KV_TOKEN) {
      console.error('Missing KV env vars');
      return res.status(500).json({ ok: false, error: 'Storage not configured' });
    }

    // Use a sorted-set like structure via JSON list (append-only pattern)
    // We'll use SADD semantics with a hash key for dedupe
    const keyList = 'weltance:subscribers:list';     // JSON array of objects
    const keySet  = 'weltance:subscribers:set';      // Redis set for fast dedupe

    // 1) Try to add to set (SADD). If already exists, skip append.
    const addReq = await fetch(`${KV_URL}/sadd/${encodeURIComponent(keySet)}/${encodeURIComponent(e)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const addRes = await addReq.json().catch(()=>({}));
    const added = addRes && (addRes.result === 1 || addRes.result === '1');

    // 2) If newly added, append to list (LPUSH-like via JSON array fetch & set)
    if (added) {
      const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
      const ua = req.headers['user-agent'] || null;
      const record = { email: e, ts: new Date().toISOString(), ip, ua };

      // Get current JSON (GET)
      const getReq = await fetch(`${KV_URL}/get/${encodeURIComponent(keyList)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      });
      let current = [];
      if (getReq.ok) {
        const data = await getReq.json().catch(()=>null);
        if (data && typeof data.result === 'string' && data.result) {
          try { current = JSON.parse(data.result); } catch {}
        }
      }
      if (!Array.isArray(current)) current = [];

      current.unshift(record); // prepend newest
      // Set back
      const setReq = await fetch(`${KV_URL}/set/${encodeURIComponent(keyList)}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: JSON.stringify(current) })
      });
      if (!setReq.ok) {
        console.error('KV set failed', await setReq.text());
      }
    }

    return res.status(200).json({ ok: true, added: !!added });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}