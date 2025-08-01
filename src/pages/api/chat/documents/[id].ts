import type { APIRoute } from 'astro';
import { getDocument, deleteDocument } from '../../../../lib/ai';
import type { AIEnv } from '../../../../lib/ai';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime.env as AIEnv;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get document metadata from DOC_METADATA KV
    const document = await getDocument(documentId, env);
    
    if (!document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
  const env = locals.runtime.env as AIEnv;
  const documentId = params.id;
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Delete document and its metadata
    const success = await deleteDocument(documentId, env);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
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