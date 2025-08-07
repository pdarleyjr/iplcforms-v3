/**
 * Plausible Analytics API Route
 * Handles proxying of analytics requests through Cloudflare Workers
 */

import type { APIRoute } from 'astro';
import { handlePlausibleProxy } from '../../../lib/analytics/plausible-proxy';

export const ALL: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    // Handle all Plausible proxy requests
    return await handlePlausibleProxy(request as any, env);
  } catch (error) {
    console.error('Analytics proxy error:', error);
    return new Response(JSON.stringify({ error: 'Analytics service error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// Support all HTTP methods
export const GET = ALL;
export const POST = ALL;
export const OPTIONS = ALL;