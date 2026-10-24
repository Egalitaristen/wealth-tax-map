// The site's Worker: static assets for everything, plus POST /api/suggest, which stores a supporter suggestion in
// D1 (database wts-suggestions, schema in infra/d1/suggestions.sql) for the maintainers to review.
// No accounts and no contact details: a suggestion is a public figure, a country and links to where they said it.

const LIMITS = {name: 200, country: 80, place: 200, links: 2000, said: 3000, page: 300};
const PER_DAY = 20;  // suggestions one sender can make in a day

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'}});

async function ipHash(env, ip) {
  // A keyed hash of the IP and the day: enough to count a sender's suggestions today, useless for anything else.
  const day = new Date().toISOString().slice(0, 10);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.HASH_KEY || 'unset'),
    {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${day}|${ip}`));
  return [...new Uint8Array(sig)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function suggest(req, env) {
  if (req.method !== 'POST') return json({error: 'Use POST.'}, 405);
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) return json({error: 'Wrong origin.'}, 403);
  let f;
  try { f = await req.json(); } catch { return json({error: 'Send the form as JSON.'}, 400); }
  if (f.website) return json({ok: true});  // the hidden honeypot field: only bots fill it in
  const v = {};
  for (const [k, max] of Object.entries(LIMITS)) v[k] = String(f[k] || '').trim().slice(0, max);
  const links = v.links.split(/\s+/).filter(Boolean);
  if (!v.name || !v.country) return json({error: 'Please give a name and a country.'}, 400);
  if (!links.length || links.some(l => !/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(l)))
    return json({error: 'Please give at least one link (starting with https://) to where they said it.'}, 400);
  if (links.length > 10) return json({error: 'Ten links at most, please.'}, 400);
  const hash = await ipHash(env, req.headers.get('cf-connecting-ip') || '');
  const today = new Date().toISOString().slice(0, 10);
  const {n} = await env.DB.prepare('SELECT COUNT(*) AS n FROM suggestions WHERE ip_hash = ? AND created_at >= ?')
    .bind(hash, today).first();
  if (n >= PER_DAY) return json({error: 'That is a lot of suggestions for one day. Thank you! Please send the rest tomorrow, or post them on Discord.'}, 429);
  await env.DB.prepare(`INSERT INTO suggestions (id, created_at, name, country, place, links, said, page, ip_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), new Date().toISOString(), v.name, v.country, v.place || null, links.join('\n'),
      v.said || null, v.page || null, hash).run();
  return json({ok: true});
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/api/suggest') {
      try { return await suggest(req, env); } catch (e) { return json({error: 'Something went wrong on our side. Please try again later, or use Discord.'}, 500); }
    }
    return env.ASSETS.fetch(req);
  },
};
