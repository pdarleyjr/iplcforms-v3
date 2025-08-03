import type { APIRoute } from 'astro';
import { checkRateLimit } from '../../lib/ai';
import type { AIEnv, ChatMessage } from '../../lib/ai';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  
  try {
    // Parse request with defensive defaults
    const body = await request.json() as any;
    
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const question = String(body.question ?? '').trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const conversationId = body.conversationId ?? undefined;
    const options = body.options ?? {};
    
    if (!question) {
      return new Response(JSON.stringify({ error: 'No question provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check rate limit
    const clientId = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const rateLimitInfo = await checkRateLimit(clientId, env);
    
    if (!rateLimitInfo) {
      console.error('Rate limit info is undefined');
      return new Response(JSON.stringify({ error: 'Rate limit check failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: (rateLimitInfo as any).retryAfter || 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': (rateLimitInfo.remaining || 0).toString(),
          'X-RateLimit-Reset': Math.floor((rateLimitInfo.resetAt || Date.now()) / 1000).toString()
        }
      });
    }

    // Validate and sanitize each message in history
    const sanitizedHistory: ChatMessage[] = [];
    for (const msg of history) {
      if (!msg || typeof msg !== 'object') continue;
      
      const role = String(msg.role ?? '').trim();
      const content = String(msg.content ?? '').trim();
      
      if (!role || !content) {
        console.warn('Skipping invalid message:', msg);
        continue;
      }
      
      if (!['user', 'assistant', 'system'].includes(role)) {
        console.warn('Skipping message with invalid role:', role);
        continue;
      }
      
      sanitizedHistory.push({ role, content } as ChatMessage);
    }

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
    
    // Call the iplc-ai worker's /rag endpoint
    const ragResponse = await iplcAI.fetch('https://iplc-ai.worker/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        history: sanitizedHistory,
        sessionId: conversationId,
        options: {
          maxTokens: Math.min(Number(options.maxTokens) || 1000, 2048),
          temperature: Math.min(Math.max(Number(options.temperature) || 0.7, 0), 1),
          topK: Math.min(Number(options.topK) || 5, 10)
        }
      })
    });
    
    if (!ragResponse.ok) {
      const error = await ragResponse.text();
      console.error('IPLC_AI service error:', error);
      
      // Create error SSE stream
      const errorStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const errorEvent = `event: error\ndata: ${JSON.stringify({
            error: 'AI service error',
            details: error
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

    const responseHeaders: Record<string, string> = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Transfer-Encoding': 'chunked',
      'X-RateLimit-Limit': '60'
    };

    // Safely add rate limit headers
    if (rateLimitInfo && typeof rateLimitInfo.remaining !== 'undefined') {
      responseHeaders['X-RateLimit-Remaining'] = String(rateLimitInfo.remaining);
    }
    if (rateLimitInfo && typeof rateLimitInfo.resetAt !== 'undefined') {
      responseHeaders['X-RateLimit-Reset'] = String(Math.floor(rateLimitInfo.resetAt / 1000));
    }

    // Return the streaming response from iplc-ai
    return new Response(ragResponse.body, {
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Chat error:', error);
    console.error('Error type:', typeof error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
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