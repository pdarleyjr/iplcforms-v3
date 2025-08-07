import type { APIContext } from 'astro';

/**
 * Proxy endpoint for Plausible Analytics event tracking
 * Routes: POST /api/plausible/api/event
 * 
 * This endpoint proxies event tracking requests to Plausible's API,
 * allowing us to track events from our own domain.
 */
export async function POST(context: APIContext): Promise<Response> {
  const { request, locals } = context;
  const env = locals.runtime?.env;

  // Check if analytics is enabled - use PLAUSIBLE_DOMAIN as the flag
  const plausibleDomain = env?.PLAUSIBLE_DOMAIN;
  
  if (!plausibleDomain) {
    // Return success even if disabled to avoid client errors
    return new Response(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    // Get the request body
    const body = await request.text();
    
    // Parse the body to modify the domain if needed
    let eventData;
    try {
      eventData = JSON.parse(body);
      // Ensure the domain matches our configured domain
      eventData.domain = plausibleDomain;
    } catch {
      // If parsing fails, forward as-is
      eventData = body;
    }

    // Forward the request to Plausible's API
    const plausibleResponse = await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || '',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || 
                          request.headers.get('X-Forwarded-For') || 
                          '',
      },
      body: typeof eventData === 'string' ? eventData : JSON.stringify(eventData),
    });

    // Return Plausible's response
    return new Response(null, {
      status: plausibleResponse.ok ? 204 : 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error proxying Plausible event:', error);
    
    // Return success to avoid breaking the client
    return new Response(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(context: APIContext): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    }
  });
}

// Support all HTTP methods for compatibility
export const ALL = POST;