import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime.env;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Check if AI_WORKER binding exists
    if (!env.AI_WORKER) {
      throw new Error('AI_WORKER binding not configured');
    }

    // Forward to iplc-ai worker
    const response = await env.AI_WORKER.fetch(`https://iplc-ai.workers.dev/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to get document:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime.env;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Check if AI_WORKER binding exists
    if (!env.AI_WORKER) {
      // Fallback to direct deletion if AI worker not available
      // Get document metadata
      const docData = await env.CHAT_HISTORY.get(`doc:${documentId}`);
      if (!docData) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Delete from local KV
      await env.CHAT_HISTORY.delete(`doc:${documentId}`);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Document metadata deleted (embeddings remain in AI worker)'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Forward to iplc-ai worker for complete deletion
    const response = await env.AI_WORKER.fetch(`https://iplc-ai.workers.dev/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Also delete from local KV
    await env.CHAT_HISTORY.delete(`doc:${documentId}`);

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to delete document:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};