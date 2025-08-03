import type { APIContext } from 'astro';

// CORS Configuration
const ALLOWED_ORIGINS_PRODUCTION = [
  'https://iplcforms.com',
  'https://www.iplcforms.com',
  'https://app.iplcforms.com',
  // Add any other production domains here
];

const ALLOWED_ORIGINS_DEVELOPMENT = [
  'http://localhost:3000',
  'http://localhost:4321',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4321',
];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With'];
const MAX_AGE = 86400; // 24 hours

/**
 * Get allowed origins based on environment
 */
function getAllowedOrigins(context: APIContext): string[] {
  // Check for development mode through various means
  const url = new URL(context.request.url);
  const isDevelopment =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.includes('.workers.dev') ||
    context.request.headers.get('X-Environment') === 'development';
  
  if (isDevelopment) {
    return [...ALLOWED_ORIGINS_PRODUCTION, ...ALLOWED_ORIGINS_DEVELOPMENT];
  }
  
  return ALLOWED_ORIGINS_PRODUCTION;
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, context: APIContext): boolean {
  if (!origin) return false;
  
  const allowedOrigins = getAllowedOrigins(context);
  return allowedOrigins.includes(origin);
}

/**
 * CORS middleware handler
 */
export async function corsMiddleware(
  context: APIContext,
  next: () => Promise<Response>
): Promise<Response> {
  const { request } = context;
  const origin = request.headers.get('origin');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    if (origin && isOriginAllowed(origin, context)) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
          'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
          'Access-Control-Max-Age': MAX_AGE.toString(),
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    } else {
      // Reject preflight from unauthorized origins
      return new Response('CORS policy: Origin not allowed', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  }
  
  // Process the request
  const response = await next();
  
  // Add CORS headers to response if origin is allowed
  if (origin && isOriginAllowed(origin, context)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }
  
  return response;
}

/**
 * Get CORS headers for a specific origin
 * Used for manual CORS handling in specific endpoints if needed
 */
export function getCorsHeaders(origin: string | null, context: APIContext): Record<string, string> {
  if (!origin || !isOriginAllowed(origin, context)) {
    return {};
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}