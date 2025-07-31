import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  
  try {
    const { message, conversationId, documentIds } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if AI_WORKER binding exists
    if (!env.AI_WORKER) {
      throw new Error('AI_WORKER binding not configured');
    }

    // Create or use existing conversation
    const convId = conversationId || nanoid();
    

    // Store user message locally
    const userMessageId = `${convId}:${nanoid()}`;
    const userMessageData = {
      id: userMessageId,
      conversationId: convId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    await env.CHAT_HISTORY.put(
      `msg:${userMessageId}`,
      JSON.stringify(userMessageData)
    );

    // Update conversation metadata
    await env.CHAT_HISTORY.put(
      `conv:${convId}`,
      JSON.stringify({
        id: convId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        lastMessage: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        timestamp: new Date().toISOString()
      })
    );

    // Forward to iplc-ai worker for RAG processing
    const ragResponse = await env.AI_WORKER.fetch('https://iplc-ai.workers.dev/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        conversationId: convId,
        documentIds: documentIds || []
      })
    });

    if (!ragResponse.ok) {
      const errorData = await ragResponse.json();
      throw new Error(errorData.error || 'Failed to process query');
    }

    // Return the streaming response from iplc-ai worker
    return new Response(ragResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked'
      }
    });

  } catch (error) {
    console.error('Query error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};