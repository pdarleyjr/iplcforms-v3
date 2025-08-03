import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { checkRateLimit } from '../../../lib/ai';
import type { AIEnv, ChatMessage } from '../../../lib/ai';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  
  try {
    const body = await request.json() as any;
    
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { message, conversationId, documentIds } = body;
    
    if (!message || typeof message !== 'string') {
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
        retryAfter: (rateLimitInfo as any).retryAfter || 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '60',
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
    const historyKeys = await env.CHAT_HISTORY.list({
      prefix: `msg:${convId}:`,
      limit: 10
    });
    
    for (const key of historyKeys.keys) {
      const msgData = await env.CHAT_HISTORY.get(key.name);
      if (msgData) {
        const msg = JSON.parse(msgData);
        history.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        });
      }
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
        question: message,
        history: history,
        sessionId: convId,
        documentIds: documentIds
      })
    });
    
    if (!ragResponse.ok) {
      const error = await ragResponse.text();
      console.error('IPLC_AI service error:', error);
      return new Response(JSON.stringify({
        error: 'AI service error',
        details: error
      }), {
        status: ragResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Store AI response in history
    const assistantMessageId = `${convId}:${nanoid()}`;
    const responseClone = ragResponse.clone();
    const responseText = await responseClone.text();
    
    // Extract the actual message from SSE stream if needed
    let assistantContent = responseText;
    if (responseText.includes('data: ')) {
      const lines = responseText.split('\n');
      assistantContent = lines
        .filter((line: string) => line.startsWith('data: '))
        .map((line: string) => line.substring(6))
        .filter((data: string) => data !== '[DONE]')
        .join('');
    }
    
    const assistantMessageData = {
      id: assistantMessageId,
      conversationId: convId,
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString()
    };
    await env.CHAT_HISTORY.put(
      `msg:${assistantMessageId}`,
      JSON.stringify(assistantMessageData)
    );
    
    // Return the streaming response from iplc-ai
    return new Response(ragResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Transfer-Encoding': 'chunked',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
        'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
      }
    });

  } catch (error) {
    console.error('Query error:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return new Response(JSON.stringify({
      error: 'Failed to process query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};