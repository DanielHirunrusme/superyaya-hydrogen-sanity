/**
 * Maintenance mode.
 *
 * Controlled entirely by environment variables so the storefront can be taken
 * offline (and brought back) from the Hydrogen channel without a code change:
 *
 * - `MAINTENANCE_MODE="true"` — every request gets a self-contained
 *   "We'll be back soon" page with HTTP 503 + `Retry-After`.
 * - `MAINTENANCE_BYPASS_TOKEN` (optional) — visiting any URL with
 *   `?preview=<token>` sets a signed cookie that lets the owner browse the real
 *   site while maintenance is on.
 *
 * This runs in `server.ts` before the session, Storefront API client, Sanity
 * client and the Remix request handler are created, so no route loaders or
 * layout code run while the site is offline.
 */

const BYPASS_QUERY_PARAM = 'preview';
const BYPASS_COOKIE_NAME = 'maintenance_bypass';
/** How long an owner's bypass cookie stays valid (24 hours). */
const BYPASS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;
/** Hint to clients/crawlers for when to retry (1 hour). */
const RETRY_AFTER_SECONDS = 60 * 60;

type MaintenanceEnv = Pick<
  Env,
  'MAINTENANCE_MODE' | 'MAINTENANCE_BYPASS_TOKEN' | 'SESSION_SECRET'
>;

export function isMaintenanceModeEnabled(env: MaintenanceEnv): boolean {
  const value = env.MAINTENANCE_MODE?.trim().toLowerCase();
  return value === 'true' || value === '1' || value === 'on';
}

/**
 * Returns a `Response` when the request should be intercepted by maintenance
 * mode (either the 503 page, or a redirect that sets the bypass cookie), or
 * `null` when the request should continue to the normal app.
 */
export async function handleMaintenanceMode(
  request: Request,
  env: MaintenanceEnv,
): Promise<Response | null> {
  if (!isMaintenanceModeEnabled(env)) {
    return null;
  }

  const bypassToken = env.MAINTENANCE_BYPASS_TOKEN?.trim();

  if (bypassToken) {
    const url = new URL(request.url);
    const expectedCookieValue = await signBypassToken(bypassToken, env);

    // 1. `?preview=<token>` — set the cookie and redirect to the same URL
    //    without the token so it doesn't linger in the address bar/referrers.
    const providedToken = url.searchParams.get(BYPASS_QUERY_PARAM);
    if (
      providedToken !== null &&
      (await safeEqual(providedToken, bypassToken))
    ) {
      url.searchParams.delete(BYPASS_QUERY_PARAM);

      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
          'Cache-Control': 'no-store',
          'Set-Cookie': serializeBypassCookie(expectedCookieValue, url),
        },
      });
    }

    // 2. Existing signed cookie — let the owner through to the real site.
    const cookieValue = getCookie(request, BYPASS_COOKIE_NAME);
    if (cookieValue && (await safeEqual(cookieValue, expectedCookieValue))) {
      return null;
    }
  }

  return maintenanceResponse();
}

export function maintenanceResponse(): Response {
  return new Response(MAINTENANCE_PAGE_HTML, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': String(RETRY_AFTER_SECONDS),
      'Cache-Control': 'no-store',
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Bypass cookie helpers                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The cookie never contains the raw token. It holds an HMAC of a fixed message
 * keyed with the session secret + token, so it can't be forged without knowing
 * both, and rotating either value invalidates every issued cookie.
 */
async function signBypassToken(
  token: string,
  env: MaintenanceEnv,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`${env.SESSION_SECRET ?? ''}:${token}`),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode('maintenance-bypass'),
  );

  return toHex(signature);
}

function serializeBypassCookie(value: string, url: URL): string {
  const parts = [
    `${BYPASS_COOKIE_NAME}=${value}`,
    'Path=/',
    `Max-Age=${BYPASS_COOKIE_MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (url.protocol === 'https:') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function getCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('Cookie');
  if (!header) return undefined;

  for (const part of header.split(';')) {
    const [rawKey, ...rest] = part.split('=');
    if (rawKey.trim() === name) {
      return rest.join('=').trim();
    }
  }

  return undefined;
}

/**
 * Constant-time string comparison. Both inputs are hashed first so the
 * comparison doesn't leak length information either.
 */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);

  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }

  return diff === 0;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Fully self-contained: inline CSS and no scripts, so it renders even if the
 * asset CDN is unavailable. The favicon is served by Oxygen's static asset
 * layer, which sits in front of this worker.
 */
const MAINTENANCE_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>We'll be back soon</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1.5rem;
        background: #ffffff;
        color: #111111;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-align: center;
      }
      main { max-width: 32rem; }
      h1 {
        margin: 0 0 1rem;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        font-weight: 500;
        letter-spacing: -0.01em;
        line-height: 1.15;
      }
      p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: #555555;
      }
      hr {
        width: 2.5rem;
        margin: 2rem auto 0;
        border: 0;
        border-top: 1px solid #dddddd;
      }
      @media (prefers-color-scheme: dark) {
        body { background: #111111; color: #f5f5f5; }
        p { color: #a3a3a3; }
        hr { border-top-color: #333333; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>We&rsquo;ll be back soon</h1>
      <p>
        Our store is temporarily offline for maintenance.
        Thank you for your patience &mdash; please check back shortly.
      </p>
      <hr />
    </main>
  </body>
</html>
`;
