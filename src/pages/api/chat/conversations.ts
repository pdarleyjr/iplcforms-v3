import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;
  
  try {
    // List all conversations
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: 'conv:',
      limit: 100
    });
    
    // Fetch all conversation metadata
    const conversations = [];
    for (const key of keys) {
      const convData = await env.CHAT_HISTORY.get(key.name);
      if (convData) {
        conversations.push(JSON.parse(convData));
      }
    }
    
    // Sort by timestamp, newest first
    conversations.sort((a, b) => 
      new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime()
    );
    
    return new Response(JSON.stringify({
      conversations,
      total: conversations.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to list conversations:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.searchParams.get('id');
  
  if (!conversationId) {
    return new Response(JSON.stringify({ error: 'Conversation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Delete conversation metadata
    await env.CHAT_HISTORY.delete(`conv:${conversationId}`);
    
    // Delete all messages in the conversation
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: `msg:${conversationId}:`,
      limit: 1000
    });
    
    for (const key of keys) {
      await env.CHAT_HISTORY.delete(key.name);
    }
    
    // Delete all documents associated with the conversation
    const { keys: docKeys } = await env.CHAT_HISTORY.list({
      prefix: 'doc:',
      limit: 1000
    });
    
    for (const key of docKeys) {
      const docData = await env.CHAT_HISTORY.get(key.name);
      if (docData) {
        const doc = JSON.parse(docData);
        if (doc.conversationId === conversationId) {
          await env.CHAT_HISTORY.delete(key.name);
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};