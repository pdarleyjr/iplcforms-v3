import type { APIContext } from 'astro';

/**
 * Proxy endpoint for Plausible Analytics script
 * Routes: GET /api/plausible/script.js
 * 
 * This endpoint proxies requests to Plausible's script CDN,
 * allowing us to serve analytics from our own domain to avoid
 * ad blockers and improve privacy.
 */
export async function GET(context: APIContext): Promise<Response> {
  const { locals, request } = context;
  const env = locals.runtime?.env;

  const analyticsEnabled = (env?.ANALYTICS_ENABLED === 'true');
  const respectDnt = (env?.RESPECT_DNT ?? 'true') === 'true';
  const dntHeader = request.headers.get('DNT');

  // If disabled or DNT=1, return a stable no-op stub (cacheable)
  if (!analyticsEnabled || (respectDnt && dntHeader === '1')) {
    const stub = `
/* Analytics disabled or DNT respected */
(function(){
  var noop = function(){};
  // Plausible-compatible facade
  // Using minimal surface to avoid runtime errors when called
  var p = function(eventName, payload){ if (typeof window !== 'undefined' && window.console && console.debug) { try { console.debug('[analytics:no-op]', eventName, payload || {}); } catch(_){} } };
  p.q = [];
  // Expose global
  if (typeof window !== 'undefined') { (window as any).plausible = p; }
})();
`.trim();
    return new Response(stub, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  try {
    // Fetch the Plausible script from their CDN with CF caching hints
    const upstream = 'https://plausible.io/js/script.js';
    const plausibleResponse = await fetch(upstream, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || '',
        'Accept': 'application/javascript, text/javascript, */*;q=0.1'
      }
    } as RequestInit);

    if (!plausibleResponse.ok) {
      throw new Error(`Failed to fetch Plausible script: ${plausibleResponse.status}`);
    }

    const scriptContent = await plausibleResponse.text();

    // Sanitize headers and add strong caching
    const headers = new Headers();
    headers.set('Content-Type', 'application/javascript; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800, immutable');
    headers.set('X-Content-Type-Options', 'nosniff');

    return new Response(scriptContent, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error proxying Plausible script:', error);
    // Return a minimal safe stub to avoid breaking pages
    return new Response(
      '/* analytics script error; stubbed */',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }
}