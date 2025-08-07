/**
 * Plausible Analytics Proxy Handler for Cloudflare Workers
 * Provides privacy-preserving analytics by proxying requests through our domain
 */

import type { Request as CFRequest } from '@cloudflare/workers-types';

export interface PlausibleProxyConfig {
  analyticsEnabled: boolean;
  plausibleDomain?: string;
  dataDomain?: string;
}

/**
 * Proxy handler for Plausible script
 */
export async function handlePlausibleScript(
  request: CFRequest,
  config: PlausibleProxyConfig
): Promise<Response> {
  // Return empty script if analytics disabled
  if (!config.analyticsEnabled) {
    return new Response('// Analytics disabled', {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const plausibleDomain = config.plausibleDomain || 'plausible.io';
  
  try {
    // Fetch the Plausible script
    const scriptResponse = await fetch(`https://${plausibleDomain}/js/script.js`, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || '',
      },
    });

    if (!scriptResponse.ok) {
      throw new Error(`Failed to fetch Plausible script: ${scriptResponse.status}`);
    }

    const scriptContent = await scriptResponse.text();

    // Return the script with proper caching headers
    return new Response(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error proxying Plausible script:', error);
    return new Response('// Error loading analytics script', {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300', // Cache error for 5 minutes
      },
    });
  }
}

/**
 * Proxy handler for Plausible event API
 */
export async function handlePlausibleEvent(
  request: CFRequest,
  config: PlausibleProxyConfig
): Promise<Response> {
  // Return success if analytics disabled
  if (!config.analyticsEnabled) {
    return new Response(JSON.stringify({ status: 'disabled' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const plausibleDomain = config.plausibleDomain || 'plausible.io';

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Forwarded-For',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Get the request body
    const body = await request.text();
    
    // Get client IP for proper geo-location (Cloudflare provides this)
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                     '';

    // Forward the event to Plausible
    const eventResponse = await fetch(`https://${plausibleDomain}/api/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || '',
        'X-Forwarded-For': clientIP,
        'Referer': request.headers.get('Referer') || '',
      },
      body: body,
    });

    // Return Plausible's response
    return new Response(await eventResponse.text(), {
      status: eventResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error proxying Plausible event:', error);
    return new Response(JSON.stringify({ error: 'Failed to send event' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Main proxy handler that routes requests
 */
export async function handlePlausibleProxy(
  request: CFRequest,
  env: any
): Promise<Response> {
  const url = new URL(request.url);
  const config: PlausibleProxyConfig = {
    analyticsEnabled: env.ANALYTICS_ENABLED === 'true' || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN,
  };

  // Route based on path
  if (url.pathname === '/a/js/plausible.js' || url.pathname === '/a/js/script.js') {
    return handlePlausibleScript(request, config);
  }

  if (url.pathname === '/a/api/event') {
    return handlePlausibleEvent(request, config);
  }

  // Return 404 for unknown analytics paths
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}