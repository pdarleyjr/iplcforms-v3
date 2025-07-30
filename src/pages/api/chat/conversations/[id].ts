import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime.env;
  const conversationId = params.id;
  
  if (!conversationId) {
    return new Response(JSON.stringify({ error: 'Conversation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get conversation metadata
    const convData = await env.CHAT_HISTORY.get(`conv:${conversationId}`);
    if (!convData) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const conversation = JSON.parse(convData);
    
    // Get all messages for this conversation
    const messages = [];
    const { keys: messageKeys } = await env.CHAT_HISTORY.list({
      prefix: 'msg:',
      limit: 1000
    });
    
    for (const key of messageKeys) {
      const msgData = await env.CHAT_HISTORY.get(key.name);
      if (msgData) {
        const message = JSON.parse(msgData);
        if (message.conversationId === conversationId) {
          messages.push(message);
        }
      }
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Get all documents for this conversation
    const documents = [];
    const { keys: docKeys } = await env.CHAT_HISTORY.list({
      prefix: 'doc:',
      limit: 100
    });
    
    for (const key of docKeys) {
      const docData = await env.CHAT_HISTORY.get(key.name);
      if (docData) {
        const doc = JSON.parse(docData);
        if (doc.conversationId === conversationId) {
          documents.push(doc);
        }
      }
    }
    
    return new Response(JSON.stringify({
      conversation,
      messages,
      documents
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to get conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};