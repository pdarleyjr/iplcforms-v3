import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { generateRAGResponse, checkRateLimit } from '../../../lib/ai';
import type { AIEnv, ChatMessage } from '../../../lib/ai';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as AIEnv;
  
  try {
    const { message, conversationId, documentIds } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create or use existing conversation
    const convId = conversationId || nanoid();
    
    // Check rate limit
    const clientId = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const rateLimitInfo = await checkRateLimit(clientId, env);
    
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitInfo.retryAfter
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
        }
      });
    }

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

    // Get conversation history
    const history: ChatMessage[] = [];
    // TODO: Implement history retrieval from CHAT_HISTORY KV

    // Generate RAG response with streaming
    const stream = await generateRAGResponse(
      message,
      history,
      env,
      {
        maxTokens: 1000,
        temperature: 0.7,
        topK: 5,
        conversationId: convId
      }
    );

    // Return the streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked',
        'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
        'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
        'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
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