import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;
  
  try {
    // List all conversations from KV
    const conversations = [];
    
    // Use KV list to get all conversation keys
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: 'conv:',
      limit: 100
    });
    
    // Fetch conversation data for each key
    for (const key of keys) {
      const convData = await env.CHAT_HISTORY.get(key.name);
      if (convData) {
        conversations.push(JSON.parse(convData));
      }
    }
    
    // Sort by timestamp (most recent first)
    conversations.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return new Response(JSON.stringify({
      conversations
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