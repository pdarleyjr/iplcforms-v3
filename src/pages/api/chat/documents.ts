import type { APIRoute } from 'astro';
import { withRBAC } from '@/lib/middleware/rbac-middleware';
 
export const GET: APIRoute = withRBAC(['clinician','admin'], async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.searchParams.get('conversationId');
  
  try {
    // List all documents, optionally filtered by conversation
    const prefix = conversationId ? `doc:` : 'doc:';
    const { keys } = await env.CHAT_HISTORY.list({
      prefix,
      limit: 1000
    });
    
    // Fetch all document metadata
    const documents = [];
    for (const key of keys) {
      const docData = await env.CHAT_HISTORY.get(key.name);
      if (docData) {
        const doc = JSON.parse(docData);
        // Filter by conversationId if specified
        if (!conversationId || doc.conversationId === conversationId) {
          documents.push(doc);
        }
      }
    }
    
    // Sort by upload date, newest first
    documents.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    return new Response(JSON.stringify({
      documents,
      total: documents.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to list documents:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});