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

    // Create or use existing conversation
    const convId = conversationId || nanoid();

    // Retrieve conversation history for context window management
    const conversationHistory: any[] = [];
    const historyKeys = await env.CHAT_HISTORY.list({ prefix: `msg:` });
    
    for (const key of historyKeys.keys) {
      const msgData = await env.CHAT_HISTORY.get(key.name);
      if (msgData) {
        const msg = JSON.parse(msgData);
        if (msg.conversationId === convId) {
          conversationHistory.push(msg);
        }
      }
    }

    // Sort messages by timestamp
    conversationHistory.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Context window management: prune old messages if exceeding 128KB
    const MAX_CONTEXT_SIZE = 128 * 1024; // 128KB
    let contextSize = 0;
    const recentMessages = [];
    
    // Start from the most recent messages and work backwards
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const msg = conversationHistory[i];
      const msgSize = new TextEncoder().encode(JSON.stringify(msg)).length;
      
      if (contextSize + msgSize > MAX_CONTEXT_SIZE && recentMessages.length > 0) {
        break; // Stop if we exceed the limit (but keep at least one message)
      }
      
      contextSize += msgSize;
      recentMessages.unshift(msg); // Add to beginning to maintain order
    }
    
    // Build conversation context from pruned messages for AI
    const conversationContext = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Retrieve relevant context from uploaded documents using vector search
    let context = '';
    let relevantChunks: any[] = [];
    if (documentIds && documentIds.length > 0) {
      try {
        // Create embedding for the user's query
        const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: message
        });
        
        // Search for relevant chunks
        const searchResults = await env.VECTORIZE.query(queryEmbedding.data[0], {
          topK: 5,
          filter: {
            conversationId: convId
          }
        });
        
        // Retrieve the actual chunk text from KV
        const relevantChunks = [];
        for (const result of searchResults.matches) {
          const chunkData = await env.CHAT_HISTORY.get(`chunk:${result.id}`);
          if (chunkData) {
            const chunk = JSON.parse(chunkData);
            relevantChunks.push({
              text: chunk.text,
              score: result.score,
              documentName: result.metadata?.documentName
            });
          }
        }
        
        // Build context from relevant chunks with citation markers
        if (relevantChunks.length > 0) {
          context = '\n\nRelevant context from uploaded documents:\n' +
            relevantChunks.map((chunk, index) =>
              `[${index + 1}] From "${chunk.documentName}" (relevance: ${(chunk.score * 100).toFixed(1)}%):\n${chunk.text}`
            ).join('\n\n');
        }
      } catch (error) {
        console.error('Vector search error:', error);
      }
    }

    // Store user message in conversation history
    const userMessageId = nanoid();
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

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Build the prompt with context and citation instructions
          const prompt = `You are a helpful AI assistant analyzing documents and answering questions.

IMPORTANT: When referencing information from the provided documents, you MUST include inline citations using the format ^[n] where n is the document number shown in brackets below. Place citations immediately after the relevant statement.

${context}

User Question: ${message}

Instructions:
1. Provide a helpful and accurate response based on the context provided
2. Include ^[n] citations when referencing specific information from document [n]
3. If the context doesn't contain relevant information, let the user know
4. Use multiple citations if information comes from multiple sources`;

          // Build messages array with conversation history
          const messages = [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that answers questions based on provided document context. Be concise and accurate.'
            },
            ...conversationContext,
            {
              role: 'user',
              content: prompt
            }
          ];

          // Call the AI model with streaming
          const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
            messages,
            stream: true
          });

          let fullResponse = '';
          
          // Send initial data with conversation ID and chunk metadata for citations
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            conversationId: convId,
            chunks: relevantChunks.map((chunk, index) => ({
              id: index + 1,
              documentName: chunk.documentName,
              text: chunk.text,
              score: chunk.score
            }))
          })}\n\n`));

          // Stream the response
          for await (const chunk of aiResponse) {
            if (chunk.response) {
              fullResponse += chunk.response;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.response })}\n\n`));
            }
          }

          // Store assistant message in conversation history
          const assistantMessageId = nanoid();
          const assistantMessageData = {
            id: assistantMessageId,
            conversationId: convId,
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString()
          };
          await env.CHAT_HISTORY.put(
            `msg:${assistantMessageId}`,
            JSON.stringify(assistantMessageData)
          );

          // Log context window size for monitoring
          const totalSize = contextSize +
            new TextEncoder().encode(JSON.stringify(userMessageData)).length +
            new TextEncoder().encode(JSON.stringify(assistantMessageData)).length;
          
          console.log(`Context window size: ${(totalSize / 1024).toFixed(2)}KB of 128KB`);

          // Update conversation metadata
          await env.CHAT_HISTORY.put(
            `conv:${convId}`,
            JSON.stringify({
              id: convId,
              title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
              lastMessage: fullResponse.substring(0, 100) + (fullResponse.length > 100 ? '...' : ''),
              timestamp: new Date().toISOString()
            })
          );

          // Send final message
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            error: 'An error occurred while processing your request' 
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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