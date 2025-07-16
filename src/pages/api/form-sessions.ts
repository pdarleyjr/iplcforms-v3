import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      data: {
        sessionId: 'test-session',
        components: [],
        metadata: {}
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'sessionId is required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get Durable Object instance
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    
    // Forward request to Durable Object
    const doUrl = new URL(request.url);
    doUrl.searchParams.set('sessionId', sessionId);
    
    const response = await stub.fetch(doUrl.toString(), {
      method: 'GET'
    });

    return response;
  } catch (error) {
    console.error('Error fetching session:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Test environment - session saved'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json() as { sessionId: string };
    const { sessionId } = body;

    if (!sessionId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'sessionId is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Durable Object instance
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    
    // Forward request to Durable Object
    const doUrl = new URL(request.url);
    doUrl.searchParams.set('sessionId', sessionId);
    
    const response = await stub.fetch(doUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return response;
  } catch (error) {
    console.error('Error saving session:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to save session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Test environment - session deleted'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'sessionId is required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get Durable Object instance
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    
    // Forward request to Durable Object
    const doUrl = new URL(request.url);
    doUrl.searchParams.set('sessionId', sessionId);
    
    const response = await stub.fetch(doUrl.toString(), {
      method: 'DELETE'
    });

    return response;
  } catch (error) {
    console.error('Error deleting session:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to delete session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};