import type { APIRoute } from 'astro';
import type { AIEnv } from '../../../../lib/ai';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Use IPLC_AI service binding
    const iplcAI = (env as any).IPLC_AI;
    if (!iplcAI || typeof iplcAI.fetch !== 'function') {
      return new Response(JSON.stringify({
        error: 'AI service not available',
        details: 'IPLC_AI service binding is not configured'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get document metadata from iplc-ai worker
    const getResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const error = await getResponse.text();
      throw new Error(error);
    }
    
    const document = await getResponse.json();

    return new Response(JSON.stringify(document), {
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
  const env = (locals as any).runtime.env as unknown as AIEnv;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Use IPLC_AI service binding
    const iplcAI = (env as any).IPLC_AI;
    if (!iplcAI || typeof iplcAI.fetch !== 'function') {
      return new Response(JSON.stringify({
        error: 'AI service not available',
        details: 'IPLC_AI service binding is not configured'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete document via iplc-ai worker
    const deleteResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!deleteResponse.ok) {
      if (deleteResponse.status === 404) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const error = await deleteResponse.text();
      throw new Error(error);
    }
    
    // Also delete from CHAT_HISTORY if it exists there
    await env.CHAT_HISTORY.delete(`doc:${documentId}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Document and metadata deleted successfully'
    }), {
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