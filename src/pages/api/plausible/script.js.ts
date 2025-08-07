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
  const { locals } = context;
  const env = locals.runtime?.env;

  // Check if analytics is enabled via feature flag
  const analyticsEnabled = env?.PLAUSIBLE_ENABLED === 'true';
  
  if (!analyticsEnabled) {
    // Return a no-op script if analytics is disabled
    return new Response(
      '/* Plausible Analytics disabled */',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        },
      }
    );
  }

  try {
    // Fetch the Plausible script from their CDN
    const plausibleResponse = await fetch('https://plausible.io/js/script.js', {
      headers: {
        'User-Agent': context.request.headers.get('User-Agent') || '',
      },
    });

    if (!plausibleResponse.ok) {
      throw new Error(`Failed to fetch Plausible script: ${plausibleResponse.status}`);
    }

    const scriptContent = await plausibleResponse.text();

    // Return the script with appropriate caching headers
    return new Response(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error proxying Plausible script:', error);
    
    // Return empty script on error to prevent breaking the page
    return new Response(
      '/* Error loading Plausible Analytics */',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}