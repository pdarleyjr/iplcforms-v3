import type { APIRoute } from 'astro';
import { generateRAGResponse, checkRateLimit } from '../../lib/ai';
import type { AIEnv, ChatMessage } from '../../lib/ai';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as AIEnv;
  
  try {
    const { question, history = [], conversationId, options = {} } = await request.json();
    
    if (!question) {
      return new Response(JSON.stringify({ error: 'No question provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Validate history format
    if (!Array.isArray(history)) {
      return new Response(JSON.stringify({ error: 'History must be an array of chat messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each message in history
    for (const msg of history) {
      if (!msg.role || !msg.content) {
        return new Response(JSON.stringify({ error: 'Each message must have role and content' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(JSON.stringify({ error: 'Invalid message role' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Generate RAG response with streaming
    const stream = await generateRAGResponse(
      question,
      history as ChatMessage[],
      env,
      {
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        topK: options.topK || 5,
        conversationId: conversationId || undefined
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
    console.error('Chat error:', error);
    
    // Create error SSE stream
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const errorEvent = `event: error\ndata: ${JSON.stringify({
          error: 'Failed to process chat request',
          details: error instanceof Error ? error.message : 'Unknown error'
        })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
        controller.close();
      }
    });

    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }
};

// Example request body:
/*
{
  "question": "What is the capital of France?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant", 
      "content": "Hello! How can I help you today?"
    }
  ],
  "conversationId": "conv-123",
  "options": {
    "maxTokens": 1000,
    "temperature": 0.7,
    "topK": 5
  }
}
*/

// Example SSE response format:
/*
event: start
data: {"timestamp":"2024-01-01T00:00:00Z"}

event: context
data: {"documents":[{"id":"doc1","chunk":"Paris is the capital...","score":0.9}]}

event: token
data: {"token":"The"}

event: token
data: {"token":" capital"}

event: token  
data: {"token":" of"}

event: done
data: {"tokensUsed":150,"duration":1234}
*/