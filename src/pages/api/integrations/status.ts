import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    // Check each integration's configuration status
    const [nextcloud, slack, email, webhook] = await Promise.all([
      env.CACHE_KV.get('integration:nextcloud:config'),
      env.CACHE_KV.get('integration:slack:config'),
      env.CACHE_KV.get('integration:email:config'),
      env.CACHE_KV.get('integration:webhook:config')
    ]);
    
    const status = {
      nextcloud: !!nextcloud,
      slack: !!slack,
      email: !!email,
      webhook: !!webhook
    };
    
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching integration status:', error);
    return new Response(JSON.stringify({
      nextcloud: false,
      slack: false,
      email: false,
      webhook: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};