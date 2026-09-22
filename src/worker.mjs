// Code gate in front of the whole site while it is being built.
// Set the secret SITE_CODE in Cloudflare to turn it on; with no SITE_CODE
// set, the site is served normally.

const COOKIE = 'mbo_access';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const sha256 = async (s) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Compares without leaking where the strings differ.
const equal = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const readCookie = (header, name) => {
  for (const part of (header || '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
};

const gatePage = (wrong) => `<!DOCTYPE html>
<html lang="fo">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>M.B. Overgaard</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 24px;
         background: #fff; color: #1a1917; font: 17px/1.6 "Helvetica Neue", Arial, sans-serif; }
  .box { width: 100%; max-width: 360px; }
  .mark { display: inline-block; border: 2px solid #1a1917; padding: 8px 12px; line-height: 1; margin-bottom: 28px; }
  .mark b { font-size: 1.1rem; letter-spacing: -0.01em; }
  .mark span { display: block; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: #6e6b65; margin-top: 4px; }
  h1 { font-size: 1.35rem; margin: 0 0 8px; letter-spacing: -0.02em; }
  p { margin: 0 0 22px; color: #3a3835; font-size: 0.97rem; }
  label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; }
  input { font: inherit; width: 100%; padding: 12px 14px; border: 1.5px solid #d8d5cf; border-radius: 6px; background: #fff; color: inherit; }
  input:focus { outline: none; border-color: #1a1917; }
  button { font: inherit; font-weight: 600; margin-top: 14px; width: 100%; padding: 14px; border: 0;
           border-radius: 6px; background: #1a1917; color: #fff; cursor: pointer; }
  button:hover { background: #9a6b3a; }
  .err { color: #9a3a3a; font-size: 0.9rem; margin: 12px 0 0; }
</style>
</head>
<body>
  <div class="box">
    <span class="mark"><b>M.B.Overgaard</b><span>bygningssnikkari</span></span>
    <h1>Heimasíðan er ikki liðug enn</h1>
    <p>Skriva kotuna fyri at síggja hana.</p>
    <form method="POST" action="/__unlock">
      <label for="code">Kota</label>
      <input id="code" name="code" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Inn</button>
    </form>
    ${wrong ? '<p class="err">Kotan er skeiv. Royn aftur.</p>' : ''}
  </div>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    const code = env.SITE_CODE;
    if (!code) return env.ASSETS.fetch(request); // gate off

    const url = new URL(request.url);
    const expected = await sha256(code);

    if (url.pathname === '/__unlock' && request.method === 'POST') {
      const form = await request.formData();
      const given = await sha256(String(form.get('code') || ''));
      if (!equal(given, expected)) {
        return new Response(gatePage(true), {
          status: 401,
          headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
        });
      }
      return new Response(null, {
        status: 303,
        headers: {
          location: '/',
          'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }

    const cookie = readCookie(request.headers.get('cookie'), COOKIE);
    if (cookie && equal(cookie, expected)) {
      const res = await env.ASSETS.fetch(request);
      const out = new Response(res.body, res);
      out.headers.set('x-robots-tag', 'noindex'); // keep it out of Google while gated
      return out;
    }

    return new Response(gatePage(false), {
      status: 401,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  },
};
