/**
 * Rate limiting module for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Rate Limiting
 * 
 * Implements token bucket algorithm for request rate limiting
 */

import type { AIEnv, RateLimitInfo } from './types';

// Rate limit configuration as per spec
const RATE_LIMIT_CONFIG = {
  tokensPerMinute: 60,
  burstSize: 10,
  refillRate: 1, // 1 token per second
};

/**
 * Check rate limit for a given client/session
 * Reference: "Single-Worker RAG Implementation.txt" - Token Bucket Implementation
 * 
 * @param clientId - Unique identifier for the client (IP or session ID)
 * @param env - Worker environment
 * @returns Rate limit info with allowed status
 */
export async function checkRateLimit(
  clientId: string,
  env: AIEnv
): Promise<RateLimitInfo> {
  const key = `ratelimit:${clientId}`;
  const now = Date.now();
  
  try {
    // Get current bucket state
    const bucketData = await env.CHAT_HISTORY.get(key, 'json') as {
      tokens: number;
      lastRefill: number;
    } | null;
    
    let tokens = RATE_LIMIT_CONFIG.burstSize;
    let lastRefill = now;
    
    if (bucketData) {
      // Calculate tokens to add based on time elapsed
      const timePassed = (now - bucketData.lastRefill) / 1000; // seconds
      const tokensToAdd = Math.floor(timePassed * RATE_LIMIT_CONFIG.refillRate);
      
      tokens = Math.min(
        bucketData.tokens + tokensToAdd,
        RATE_LIMIT_CONFIG.burstSize
      );
      lastRefill = bucketData.lastRefill + (tokensToAdd * 1000);
    }
    
    // Check if request is allowed
    if (tokens >= 1) {
      // Consume a token
      tokens -= 1;
      
      // Update bucket state
      await env.CHAT_HISTORY.put(
        key,
        JSON.stringify({ tokens, lastRefill }),
        {
          expirationTtl: 300, // 5 minutes TTL
        }
      );
      
      return {
        allowed: true,
        remaining: tokens,
        resetAt: lastRefill + ((RATE_LIMIT_CONFIG.burstSize - tokens) * 1000),
      };
    } else {
      // Request denied
      const resetAt = lastRefill + (1000 / RATE_LIMIT_CONFIG.refillRate);
      
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request on error to avoid blocking users
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.burstSize - 1,
      resetAt: now + 60000,
    };
  }
}

/**
 * Apply rate limit headers to response
 * Reference: "Single-Worker RAG Implementation.txt" - Rate Limiting
 * 
 * @param response - Response object
 * @param rateLimitInfo - Rate limit information
 * @returns Response with rate limit headers
 */
export function applyRateLimitHeaders(
  response: Response,
  rateLimitInfo: RateLimitInfo
): Response {
  const headers = new Headers(response.headers);
  
  headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.tokensPerMinute.toString());
  headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  headers.set('X-RateLimit-Reset', Math.floor(rateLimitInfo.resetAt / 1000).toString());
  
  if (!rateLimitInfo.allowed) {
    headers.set('Retry-After', Math.ceil((rateLimitInfo.resetAt - Date.now()) / 1000).toString());
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Create rate limit exceeded response
 * Reference: "Single-Worker RAG Implementation.txt" - Error Handling
 * 
 * @param rateLimitInfo - Rate limit information
 * @returns 429 response with error details
 */
export function createRateLimitResponse(rateLimitInfo: RateLimitInfo): Response {
  const resetInSeconds = Math.ceil((rateLimitInfo.resetAt - Date.now()) / 1000);
  
  const response = new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Please retry after ${resetInSeconds} seconds.`,
      retryAfter: resetInSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  return applyRateLimitHeaders(response, rateLimitInfo);
}

/**
 * Get client identifier from request
 * Reference: "Single-Worker RAG Implementation.txt" - Rate Limiting
 * 
 * @param request - Incoming request
 * @returns Client identifier (IP or session ID)
 */
export function getClientId(request: Request): string {
  // Try to get session ID from headers or query params
  const url = new URL(request.url);
  const sessionId = request.headers.get('X-Session-ID') || 
                   url.searchParams.get('sessionId');
  
  if (sessionId) {
    return `session:${sessionId}`;
  }
  
  // Fall back to CF-Connecting-IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  return `ip:${ip}`;
}

/**
 * Rate limit middleware function
 * Reference: "Single-Worker RAG Implementation.txt" - API Integration
 * 
 * @param request - Incoming request
 * @param env - Worker environment
 * @param handler - Request handler function
 * @returns Response with rate limiting applied
 */
export async function withRateLimit(
  request: Request,
  env: AIEnv,
  handler: (request: Request) => Promise<Response>
): Promise<Response> {
  const clientId = getClientId(request);
  const rateLimitInfo = await checkRateLimit(clientId, env);
  
  if (!rateLimitInfo.allowed) {
    return createRateLimitResponse(rateLimitInfo);
  }
  
  // Execute handler and apply rate limit headers
  const response = await handler(request);
  return applyRateLimitHeaders(response, rateLimitInfo);
}

/**
 * Get rate limit status without consuming a token
 * Reference: "Single-Worker RAG Implementation.txt" - Rate Limiting
 * 
 * @param clientId - Client identifier
 * @param env - Worker environment
 * @returns Current rate limit status
 */
export async function getRateLimitStatus(
  clientId: string,
  env: AIEnv
): Promise<RateLimitInfo> {
  const key = `ratelimit:${clientId}`;
  const now = Date.now();
  
  try {
    const bucketData = await env.CHAT_HISTORY.get(key, 'json') as {
      tokens: number;
      lastRefill: number;
    } | null;
    
    if (!bucketData) {
      return {
        allowed: true,
        remaining: RATE_LIMIT_CONFIG.burstSize,
        resetAt: now + 60000,
      };
    }
    
    // Calculate current tokens without consuming
    const timePassed = (now - bucketData.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timePassed * RATE_LIMIT_CONFIG.refillRate);
    const currentTokens = Math.min(
      bucketData.tokens + tokensToAdd,
      RATE_LIMIT_CONFIG.burstSize
    );
    
    return {
      allowed: currentTokens >= 1,
      remaining: currentTokens,
      resetAt: bucketData.lastRefill + ((RATE_LIMIT_CONFIG.burstSize - currentTokens) * 1000),
    };
  } catch (error) {
    console.error('Get rate limit status error:', error);
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.burstSize,
      resetAt: now + 60000,
    };
  }
}