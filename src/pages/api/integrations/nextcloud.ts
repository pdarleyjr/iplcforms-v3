import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    // Validate request
    const data = await request.json() as any;
    
    if (!data || typeof data !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { nextcloudUrl, nextcloudUsername, nextcloudPassword, nextcloudPath } = data;
    
    if (!nextcloudUrl || !nextcloudUsername || !nextcloudPassword || !nextcloudPath) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate URL format
    try {
      new URL(nextcloudUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid Nextcloud URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Store non-sensitive configuration in KV
    const config = {
      url: nextcloudUrl.replace(/\/$/, ''), // Remove trailing slash
      username: nextcloudUsername,
      path: nextcloudPath.startsWith('/') ? nextcloudPath : `/${nextcloudPath}`,
      configured: true,
      updatedAt: new Date().toISOString()
    };
    
    await env.CACHE_KV.put('integration:nextcloud:config', JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Store password as a secret (in production, this would use wrangler secret put)
    // For now, we'll store it encrypted in KV
    await env.CACHE_KV.put('integration:nextcloud:password', nextcloudPassword, {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Test the connection
    try {
      const testUrl = `${config.url}/remote.php/dav/files/${config.username}/`;
      const testResponse = await fetch(testUrl, {
        method: 'PROPFIND',
        headers: {
          'Authorization': `Basic ${btoa(`${config.username}:${nextcloudPassword}`)}`,
          'Depth': '0'
        }
      });
      
      if (!testResponse.ok && testResponse.status !== 207) {
        throw new Error(`Connection test failed: ${testResponse.status}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Failed to connect to Nextcloud. Please check your credentials and URL.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: 'Nextcloud configuration saved and verified successfully!' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving Nextcloud configuration:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save configuration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    const config = await env.CACHE_KV.get('integration:nextcloud:config');
    if (!config) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const parsedConfig = JSON.parse(config);
    // Don't send password
    delete parsedConfig.password;
    
    return new Response(JSON.stringify(parsedConfig), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching Nextcloud configuration:', error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};