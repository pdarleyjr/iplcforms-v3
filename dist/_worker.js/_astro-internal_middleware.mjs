globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_nD8cktMX.mjs';
import './chunks/astro/server_Cd9lk-7F.mjs';
import { s as sequence } from './chunks/index_2DQbn14a.mjs';
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

const RATE_LIMIT_WINDOW = 60 * 1e3;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_BURST = 10;
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' plausible.io; frame-ancestors 'none';",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
};
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
  const response = await next();
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });
  return response;
}
const onRequest$1 = async (context, next) => {
  return corsMiddleware(
    context,
    () => (
      // Then rate limiting
      rateLimitMiddleware(
        context,
        () => (
          // Then apply security headers
          securityHeadersMiddleware(context, next)
        )
      )
    )
  );
};

const onRequest = sequence(
	onRequest$2,
	onRequest$1
	
);

export { onRequest };
//# sourceMappingURL=_astro-internal_middleware.mjs.map
