// Email + password sign-in for the admin panel (Cloudflare Pages Function, /api/auth).
//
// Sveltia CMS opens this URL in a popup (backend.base_url + auth_endpoint in
// src/pages/admin/config.json.ts). After a correct login the popup hands the CMS
// a GitHub token through the same postMessage handshake an OAuth login uses.
// The token is a fine-grained token limited to this repo; editors never see GitHub.
//
// Secrets (Cloudflare Pages, synced from GitHub secrets by the deploy workflow):
//   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_GITHUB_TOKEN

interface Env {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_GITHUB_TOKEN?: string;
}

interface Context {
  request: Request;
  env: Env;
}

/** Must match backend.name in the admin config. */
const PROVIDER = 'github';
/** Slows down password guessing; Pages has no built-in login rate limit. */
const FAILED_LOGIN_DELAY_MS = 2000;

const SECURITY_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
};

const sha256 = async (value: string) =>
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));

/** Constant-time comparison (hashing first makes both inputs the same length). */
async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** JSON that is safe to place inside a <script> tag. */
const scriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin sign in</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f4f5;font:16px/1.5 system-ui,sans-serif;color:#18181b}
  .box{width:min(340px,calc(100vw - 32px));background:#fff;border-radius:12px;padding:28px 24px;box-shadow:0 4px 20px #0001}
  h1{margin:0 0 18px;font-size:20px;text-align:center}
  label{display:block;font-size:14px;font-weight:600;margin:12px 0 4px}
  input{box-sizing:border-box;width:100%;padding:10px 12px;border:1px solid #d4d4d8;border-radius:8px;font:inherit}
  input:focus{outline:2px solid #fb3737;border-color:transparent}
  button{width:100%;margin-top:20px;padding:11px;border:0;border-radius:8px;background:#fb3737;color:#fff;font:600 16px system-ui,sans-serif;cursor:pointer}
  .error{background:#fef2f2;color:#b91c1c;border-radius:8px;padding:8px 12px;font-size:14px}
  p{text-align:center}
</style></head><body><div class="box">${body}</div></body></html>`,
    { status, headers: SECURITY_HEADERS },
  );

const loginForm = (error = '', email = '') =>
  page(
    `<h1>Admin sign in</h1>
${error ? `<div class="error" role="alert">${escapeHtml(error)}</div>` : ''}
<form method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="username" required value="${escapeHtml(email)}" ${email ? '' : 'autofocus'}>
  <label for="password">Password</label>
  <input id="password" name="password" type="password" autocomplete="current-password" required ${email ? 'autofocus' : ''}>
  <button type="submit">Sign in</button>
</form>`,
    error ? 401 : 200,
  );

/** Sends the token to the CMS window that opened this popup, then the CMS closes it. */
const successPage = (token: string) => {
  const handshake = `authorizing:${PROVIDER}`;
  const message = `authorization:${PROVIDER}:success:${JSON.stringify({ provider: PROVIDER, token })}`;
  return page(
    `<p>Signed in. You can close this window.</p>
<script>
  (() => {
    const handshake = ${scriptJson(handshake)};
    const message = ${scriptJson(message)};
    const origin = location.origin;
    if (!window.opener) return;
    window.addEventListener('message', (e) => {
      if (e.source === window.opener && e.origin === origin && e.data === handshake) {
        window.opener.postMessage(message, origin);
      }
    });
    window.opener.postMessage(handshake, origin);
  })();
</script>`,
  );
};

const missingConfig = (env: Env) =>
  (['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_GITHUB_TOKEN'] as const).filter((k) => !env[k]);

const notConfigured = (missing: string[]) =>
  page(`<h1>Admin sign in</h1><div class="error" role="alert">Login is not configured. Missing secret(s): ${missing.join(', ')}</div>`, 500);

export const onRequestGet = async ({ env }: Context) => {
  const missing = missingConfig(env);
  return missing.length ? notConfigured(missing) : loginForm();
};

export const onRequestPost = async ({ request, env }: Context) => {
  const missing = missingConfig(env);
  if (missing.length) return notConfigured(missing);

  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');

  // Run both comparisons every time so timing doesn't reveal which one failed.
  const [emailOk, passwordOk] = await Promise.all([
    safeEqual(email.toLowerCase(), env.ADMIN_EMAIL!.trim().toLowerCase()),
    safeEqual(password, env.ADMIN_PASSWORD!),
  ]);

  if (!emailOk || !passwordOk) {
    await new Promise((r) => setTimeout(r, FAILED_LOGIN_DELAY_MS));
    return loginForm('Wrong email or password.', email);
  }
  return successPage(env.ADMIN_GITHUB_TOKEN!);
};
