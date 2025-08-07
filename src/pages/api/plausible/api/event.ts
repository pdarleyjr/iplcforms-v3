import type { APIContext } from 'astro';

type EventPayload = {
  name: string;
  url: string;
  referrer?: string | null;
  screen_width?: number;
  // Plausible accepts either domain or site_id. We'll prefer site_id via env.
  domain?: string;
  site_id?: string;
  meta?: {
    props?: Record<string, string | number | boolean | null>;
  };
};

function jsonNoStore(status: number, body?: any, extraHeaders?: HeadersInit) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      'Content-Type': body ? 'application/json' : undefined as any,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...(extraHeaders || {}),
    } as HeadersInit,
  });
}

function isDNTOn(req: Request, respectDnt: boolean): boolean {
  if (!respectDnt) return false;
  return req.headers.get('DNT') === '1';
}

function sanitizePayload(input: any): EventPayload | null {
  if (!input || typeof input !== 'object') return null;
  const out: EventPayload = {
    name: String(input.name || ''),
    url: String(input.url || ''),
  };
  if (!out.name || !out.url) return null;
  if (input.referrer != null) out.referrer = String(input.referrer);
  if (typeof input.screen_width === 'number') out.screen_width = input.screen_width;
  // Only accept meta.props as a flat record of primitives
  if (input.meta && typeof input.meta === 'object' && input.meta.props && typeof input.meta.props === 'object') {
    const props: Record<string, string | number | boolean | null> = {};
    for (const [k, v] of Object.entries(input.meta.props)) {
      if (
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean' ||
        v === null
      ) {
        props[k] = v;
      }
    }
    out.meta = { props };
  }
  return out;
}

/**
 * Proxy endpoint for Plausible Analytics event tracking
 * Routes: POST /api/plausible/api/event
 */
export async function POST(context: APIContext): Promise<Response> {
  const { request, locals } = context;
  const env = locals.runtime?.env;

  const enabled = env?.ANALYTICS_ENABLED === 'true';
  const respectDnt = (env?.RESPECT_DNT ?? 'true') === 'true';
  const siteId = env?.PLAUSIBLE_SITE_ID;
  const upstream = 'https://plausible.io/api/event';

  // Kill switch
  if (!enabled) {
    return jsonNoStore(204);
  }
  // Respect DNT
  if (isDNTOn(request, respectDnt)) {
    return jsonNoStore(204);
  }

  let data: any = null;
  try {
    data = await request.json();
  } catch {
    // allow text but will fail validation
    try {
      const txt = await request.text();
      data = JSON.parse(txt);
    } catch {
      return jsonNoStore(400, { error: 'Invalid JSON' });
    }
  }

  const payload = sanitizePayload(data);
  if (!payload) {
    return jsonNoStore(400, { error: 'Invalid payload' });
  }

  // Inject site_id (preferred) or domain fallback from env
  if (siteId) {
    payload.site_id = siteId;
    delete (payload as any).domain;
  } else if (env?.PLAUSIBLE_DOMAIN) {
    payload.domain = env.PLAUSIBLE_DOMAIN;
  }

  // Forward to Plausible
  try {
    const res = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || '',
        // Best-effort client IP/locale forwarding (no cookies)
        'X-Forwarded-For':
          request.headers.get('CF-Connecting-IP') ||
          request.headers.get('X-Forwarded-For') ||
          '',
        'Accept-Language': request.headers.get('Accept-Language') || ''
      },
      body: JSON.stringify(payload)
    });

    // Map responses: Plausible returns 202 on success
    if (res.status === 202 || res.ok) {
      return jsonNoStore(202);
    }

    // For 4xx, pass through minimal status
    if (res.status >= 400 && res.status < 500) {
      return jsonNoStore(res.status);
    }

    // For 5xx, do not block UI
    return jsonNoStore(204);
  } catch (err) {
    console.error('Error proxying Plausible event:', err);
    // Network errors should not block UI
    return jsonNoStore(204);
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(_context: APIContext): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store'
    }
  });
}

// Support all HTTP methods for compatibility
export const ALL = POST;