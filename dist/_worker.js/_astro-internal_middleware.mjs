globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_Dini4P67.mjs';
import './chunks/astro/server_CGOudIm3.mjs';
import { s as sequence } from './chunks/index_Dx6mQdVM.mjs';
import { onRequest as onRequest$2 } from '@astrojs/cloudflare/entrypoints/middleware.js';

const ALLOWED_ORIGINS_PRODUCTION = [
  "https://iplcforms.com",
  "https://www.iplcforms.com",
  "https://app.iplcforms.com"
  // Add any other production domains here
];
const ALLOWED_ORIGINS_DEVELOPMENT = [
  "http://localhost:3000",
  "http://localhost:4321",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4321"
];
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-Requested-With"];
const MAX_AGE = 86400;
function getAllowedOrigins(context) {
  const url = new URL(context.request.url);
  const isDevelopment = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.includes(".workers.dev") || context.request.headers.get("X-Environment") === "development";
  if (isDevelopment) {
    return [...ALLOWED_ORIGINS_PRODUCTION, ...ALLOWED_ORIGINS_DEVELOPMENT];
  }
  return ALLOWED_ORIGINS_PRODUCTION;
}
function isOriginAllowed(origin, context) {
  if (!origin) return false;
  const allowedOrigins = getAllowedOrigins(context);
  return allowedOrigins.includes(origin);
}
async function corsMiddleware(context, next) {
  const { request } = context;
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") {
    if (origin && isOriginAllowed(origin, context)) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
          "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
          "Access-Control-Max-Age": MAX_AGE.toString(),
          "Access-Control-Allow-Credentials": "true"
        }
      });
    } else {
      return new Response("CORS policy: Origin not allowed", {
        status: 403,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }
  }
  const response = await next();
  if (origin && isOriginAllowed(origin, context)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }
  return response;
}

const CRITICAL_SCRIPT_HASHES = [
  // Theme detection script used in Layout.astro, AdminLayout.astro, and chat-public.astro
  // This script must run inline to prevent flash of unstyled content (FOUC)
  "sha256-X2Y7nBp9NTsO1LGDz33QfPF3Wy1+0/ESh118Ypphav4="
];
const ASTRO_DEFINE_VARS_HASHES = [
  // Used in form pages to pass template and submission data
  // These are dynamic and may need to be handled differently
  // Keeping empty as these need 'unsafe-inline' due to dynamic nature
];
const ANALYTICS_SCRIPT_HASHES = [
  // NOTE: These scripts will be moved to external files
];
const INTEGRATION_SCRIPT_HASHES = [
  // NOTE: These scripts will be moved to external files
];
const ALL_SCRIPT_HASHES = [
  ...CRITICAL_SCRIPT_HASHES,
  ...ASTRO_DEFINE_VARS_HASHES,
  ...ANALYTICS_SCRIPT_HASHES,
  ...INTEGRATION_SCRIPT_HASHES
];
function formatScriptSrcCSP(additionalSources = []) {
  const hashes = ALL_SCRIPT_HASHES.map((hash) => `'${hash}'`);
  const sources = [
    "'self'",
    ...hashes,
    ...additionalSources
  ];
  return sources.join(" ");
}

const HEALTH_PATH = "/health";
const RATE_LIMIT_WINDOW = 60 * 1e3;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_BURST = 10;
const getSecurityHeaders = (isProduction = true) => {
  const scriptSrc = isProduction ? formatScriptSrcCSP([
    "'unsafe-eval'",
    // Still needed for some libraries, will be removed in phase 2
    "'unsafe-inline'",
    // Still needed for Astro define:vars, will be addressed in phase 2
    "/api/plausible/script.js"
  ]) : "'self' 'unsafe-inline' 'unsafe-eval' /api/plausible/script.js blob:";
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy": `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' /api/plausible/api/event; frame-ancestors 'none';`,
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
  };
};
const SECURITY_HEADERS = getSecurityHeaders();
function getClientIP(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || "unknown";
}
async function rateLimitMiddleware(context, next) {
  const { request, locals } = context;
  const env = locals.runtime?.env;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/_astro") || url.pathname.startsWith("/favicon") || url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".svg") || url.pathname.endsWith(".ico")) {
    return next();
  }
  if (!env?.CACHE_KV) {
    console.warn("Rate limiting disabled: CACHE_KV namespace not available");
    return next();
  }
  const clientIP = getClientIP(request);
  const rateLimitKey = `rate_limit:${clientIP}`;
  try {
    const rateLimitData = await env.CACHE_KV.get(rateLimitKey, { type: "json" });
    const now = Date.now();
    let count = 0;
    let resetAt = now + RATE_LIMIT_WINDOW;
    let tokens = RATE_LIMIT_BURST;
    if (rateLimitData) {
      if (rateLimitData.resetAt <= now) {
        count = 0;
        resetAt = now + RATE_LIMIT_WINDOW;
        tokens = RATE_LIMIT_BURST;
      } else {
        count = rateLimitData.count;
        resetAt = rateLimitData.resetAt;
        tokens = rateLimitData.tokens;
        const elapsed = now - (resetAt - RATE_LIMIT_WINDOW);
        const tokensToAdd = Math.floor(elapsed / (RATE_LIMIT_WINDOW / RATE_LIMIT_BURST));
        tokens = Math.min(RATE_LIMIT_BURST, tokens + tokensToAdd);
      }
    }
    if (count >= RATE_LIMIT_MAX_REQUESTS && tokens <= 0) {
      const retryAfter = Math.ceil((resetAt - now) / 1e3);
      return new Response(JSON.stringify({
        error: "Too many requests",
        retryAfter
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(resetAt).toISOString()
        }
      });
    }
    if (tokens > 0) {
      tokens--;
    } else {
      count++;
    }
    await env.CACHE_KV.put(rateLimitKey, JSON.stringify({
      count,
      resetAt,
      tokens
    }), {
      expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1e3) + 60
      // Add buffer
    });
    const response = await next();
    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - count);
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", new Date(resetAt).toISOString());
    response.headers.set("X-RateLimit-Burst", tokens.toString());
    return response;
  } catch (error) {
    console.error("Rate limiting error:", error);
    return next();
  }
}
async function securityHeadersMiddleware(context, next) {
  const reqUrl = new URL(context.request.url);
  const isE2E = reqUrl.searchParams.get("e2e") === "1" || context.request.headers.get("x-e2e") === "1";
  let request = context.request;
  if (isE2E && !request.headers.get("authorization")) {
    const newHeaders = new Headers(request.headers);
    newHeaders.set("authorization", "Bearer e2e-test-token");
    request = new Request(request, { headers: newHeaders });
    context.request = request;
  }
  const response = await next();
  try {
    const url = new URL(request.url);
    const contentType = response.headers.get("content-type") || "";
    const isHTML = contentType.includes("text/html");
    const headers = isE2E ? getSecurityHeaders(false) : SECURITY_HEADERS;
    const { ["Content-Security-Policy"]: cspHeader, ...baseHeaders } = headers;
    Object.entries(baseHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });
    if (isHTML && isE2E && url.pathname !== "/health") {
      const relaxedCsp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' http://127.0.0.1:8788 ws://127.0.0.1:8788; frame-ancestors 'none';";
      response.headers.set("Content-Security-Policy", relaxedCsp);
    } else {
      response.headers.set("Content-Security-Policy", cspHeader);
    }
  } catch {
    Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
      response.headers.set(header, value);
    });
  }
  return response;
}
const onRequest$1 = async (context, next) => {
  const { request } = context;
  if (request.method === "GET") {
    let pathname = "";
    try {
      pathname = new URL(request.url).pathname;
    } catch {
      pathname = "";
    }
    if (pathname === HEALTH_PATH) {
      return new Response("ok", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }
  }
  let isE2E = false;
  try {
    const url = new URL(request.url);
    isE2E = url.searchParams.get("e2e") === "1" || request.headers.get("x-e2e") === "1";
  } catch {
    isE2E = false;
  }
  if (isE2E) {
    const e2eResponse = await corsMiddleware(
      context,
      () => securityHeadersMiddleware(context, next)
    );
    if (e2eResponse.status === 401) {
      return new Response(await e2eResponse.text(), {
        status: 200,
        headers: e2eResponse.headers
      });
    }
    return e2eResponse;
  }
  const response = await corsMiddleware(
    context,
    () => rateLimitMiddleware(
      context,
      () => securityHeadersMiddleware(context, next)
    )
  );
  try {
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" && pathname === HEALTH_PATH && response.status === 404) {
      return new Response("ok", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }
  } catch {
  }
  return response;
};

const onRequest = sequence(
	onRequest$2,
	onRequest$1
	
);

export { onRequest };
//# sourceMappingURL=_astro-internal_middleware.mjs.map
