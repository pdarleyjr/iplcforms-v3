import type { APIRoute } from 'astro';

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
    // Get document metadata
    const docData = await env.CHAT_HISTORY.get(`doc:${documentId}`);
    if (!docData) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const document = JSON.parse(docData);
    
    // Delete all chunks for this document
    const { keys: chunkKeys } = await env.CHAT_HISTORY.list({
      prefix: `chunk:${documentId}-`,
      limit: 1000
    });
    
    // Delete chunks from KV
    for (const key of chunkKeys) {
      await env.CHAT_HISTORY.delete(key.name);
    }
    
    // Delete vectors from Vectorize
    const vectorIds = chunkKeys.map(key => key.name.replace('chunk:', ''));
    if (vectorIds.length > 0) {
      try {
        await env.VECTORIZE.deleteByIds(vectorIds);
      } catch (error) {
        console.error('Failed to delete vectors:', error);
      }
    }
    
    // Delete document metadata
    await env.CHAT_HISTORY.delete(`doc:${documentId}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Document deleted successfully'
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