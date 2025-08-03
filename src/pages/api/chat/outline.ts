import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { callAIWithRetry, formatAIError } from '../../../lib/utils/ai-retry';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  
  try {
    const body = await request.json() as any;
    
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { conversationId, documentIds } = body;
    
    if (!conversationId || !documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retrieve all chunks for the specified documents
    const allChunks: string[] = [];
    
    for (const docId of documentIds) {
      const docMetadata = await env.CHAT_HISTORY.get(`doc:${docId}`);
      if (docMetadata) {
        const doc = JSON.parse(docMetadata);
        
        // Retrieve all chunks for this document
        for (let i = 0; i < doc.chunks; i++) {
          const chunkData = await env.CHAT_HISTORY.get(`chunk:${docId}-${i}`);
          if (chunkData) {
            const chunk = JSON.parse(chunkData);
            allChunks.push(chunk.text);
          }
        }
      }
    }

    if (allChunks.length === 0) {
      return new Response(JSON.stringify({ error: 'No document content found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Combine chunks into a single context (limit to first 10 chunks for performance)
    const context = allChunks.slice(0, 10).join('\n\n');

    // Generate outline using AI
    const prompt = `You are an expert at analyzing documents and creating comprehensive outlines.

Document Content:
${context}

Please create a detailed outline of the key topics, main ideas, and important concepts from these documents. Format it as:

1. Main Topic
   - Key point
   - Supporting detail
2. Another Main Topic
   - Key point
   - etc.

Also include a brief executive summary at the beginning.`;

    let aiResponse;
    try {
      aiResponse = await callAIWithRetry(
        env,
        '@cf/meta/llama-2-7b-chat-int8',
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert document analyzer. Create clear, hierarchical outlines that capture the essence of documents.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500
        }
      );
    } catch (aiError: any) {
      console.error('AI service error:', aiError);
      const { message, details } = formatAIError(aiError);
      throw new Error(`${message} - ${details}`);
    }

    const outlineId = nanoid();
    const outline = {
      id: outlineId,
      conversationId,
      documentIds,
      content: aiResponse.response,
      createdAt: new Date().toISOString()
    };

    // Store outline in KV
    await env.CHAT_HISTORY.put(
      `outline:${outlineId}`,
      JSON.stringify(outline)
    );

    // Store reference in conversation
    await env.CHAT_HISTORY.put(
      `conv:${conversationId}:outline`,
      outlineId
    );

    return new Response(JSON.stringify({
      success: true,
      outline
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Outline generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate outline',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.searchParams.get('conversationId');
  
  if (!conversationId) {
    return new Response(JSON.stringify({ error: 'Missing conversationId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const outlineId = await env.CHAT_HISTORY.get(`conv:${conversationId}:outline`);
    
    if (!outlineId) {
      return new Response(JSON.stringify({ error: 'No outline found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const outlineData = await env.CHAT_HISTORY.get(`outline:${outlineId}`);
    
    if (!outlineData) {
      return new Response(JSON.stringify({ error: 'Outline data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(outlineData, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Outline retrieval error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve outline',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};