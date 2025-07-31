import type { APIContext, MiddlewareHandler } from 'astro';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute
const RATE_LIMIT_BURST = 10; // Allow burst of 10 requests

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Helper to get client IP
function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0] || 
         'unknown';
}

// Rate limiting middleware
async function rateLimitMiddleware(context: APIContext, next: () => Promise<Response>): Promise<Response> {
  const { request, locals } = context;
  const env = locals.runtime?.env;
  
  // Skip rate limiting for static assets
  const url = new URL(request.url);
  if (url.pathname.startsWith('/_astro') || 
      url.pathname.startsWith('/favicon') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico')) {
    return next();
  }

  // Check if KV namespace is available
  if (!env?.CACHE_KV) {
    console.warn('Rate limiting disabled: CACHE_KV namespace not available');
    return next();
  }

  const clientIP = getClientIP(request);
  const rateLimitKey = `rate_limit:${clientIP}`;
  
  try {
    // Get current rate limit data
    const rateLimitData = await env.CACHE_KV.get(rateLimitKey, { type: 'json' }) as {
      count: number;
      resetAt: number;
      tokens: number;
    } | null;

    const now = Date.now();
    let count = 0;
    let resetAt = now + RATE_LIMIT_WINDOW;
    let tokens = RATE_LIMIT_BURST;

    if (rateLimitData) {
      // Check if window has expired
      if (rateLimitData.resetAt <= now) {
        // Reset the window
        count = 0;
        resetAt = now + RATE_LIMIT_WINDOW;
        tokens = RATE_LIMIT_BURST;
      } else {
        count = rateLimitData.count;
        resetAt = rateLimitData.resetAt;
        tokens = rateLimitData.tokens;
        
        // Regenerate tokens over time
        const elapsed = now - (resetAt - RATE_LIMIT_WINDOW);
        const tokensToAdd = Math.floor(elapsed / (RATE_LIMIT_WINDOW / RATE_LIMIT_BURST));
        tokens = Math.min(RATE_LIMIT_BURST, tokens + tokensToAdd);
      }
    }

    // Check rate limit
    if (count >= RATE_LIMIT_MAX_REQUESTS && tokens <= 0) {
      const retryAfter = Math.ceil((resetAt - now) / 1000);
      return new Response(JSON.stringify({ 
        error: 'Too many requests', 
        retryAfter 
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetAt).toISOString()
        }
      });
    }

    // Use a token if available, otherwise increment count
    if (tokens > 0) {
      tokens--;
    } else {
      count++;
    }

    // Update rate limit data
    await env.CACHE_KV.put(rateLimitKey, JSON.stringify({
      count,
      resetAt,
      tokens
    }), {
      expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1000) + 60 // Add buffer
    });

    // Add rate limit headers to response
    const response = await next();
    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - count);
    
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());
    response.headers.set('X-RateLimit-Burst', tokens.toString());

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting on error
    return next();
  }
}

// Security headers middleware
async function securityHeadersMiddleware(context: APIContext, next: () => Promise<Response>): Promise<Response> {
  const response = await next();
  
  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  return response;
}

// Combine all middleware
export const onRequest: MiddlewareHandler = async (context, next) => {
  // Apply rate limiting first
  return rateLimitMiddleware(context, () => 
    // Then apply security headers
    securityHeadersMiddleware(context, next)
  );
};