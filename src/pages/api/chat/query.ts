import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
// Force rebuild - correct import path
import { getSSEPerformanceMonitor } from '../../../lib/utils/sse-performance';
import { callAIWithRetry, formatAIError, getErrorType } from '../../../lib/utils/ai-retry';

// Cache configuration
const VECTORIZE_CACHE_TTL = 3600; // 1 hour cache for vector search results
const CONVERSATION_CACHE_TTL = 1800; // 30 minutes for conversation history

// Optimized SSE configuration
const SSE_PING_INTERVAL = 30000; // Send ping every 30 seconds to keep connection alive
const SSE_BUFFER_SIZE = 1024 * 16; // 16KB buffer for optimal streaming

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
    
    // Optimize conversation history retrieval with caching
    const historyCacheKey = `conv_history:${convId}`;
    let conversationHistory: any[] = [];
    
    // Try to get from cache first
    const cachedHistory = await env.CACHE_KV?.get(historyCacheKey, { type: 'json' });
    if (cachedHistory) {
      conversationHistory = cachedHistory as any[];
    } else {
      // Retrieve from KV with pagination for better performance
      const historyKeys = await env.CHAT_HISTORY.list({
        prefix: `msg:${convId}:`,
        limit: 100 // Limit to recent 100 messages
      });
      
      // Batch fetch messages
      const batchSize = 10;
      for (let i = 0; i < historyKeys.keys.length; i += batchSize) {
        const batch = historyKeys.keys.slice(i, i + batchSize);
        const promises = batch.map(key => env.CHAT_HISTORY.get(key.name));
        const results = await Promise.all(promises);
        
        results.forEach((msgData, index) => {
          if (msgData) {
            conversationHistory.push(JSON.parse(msgData));
          }
        });
      }
      
      // Sort and cache
      conversationHistory.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      if (env.CACHE_KV) {
        await env.CACHE_KV.put(
          historyCacheKey,
          JSON.stringify(conversationHistory),
          { expirationTtl: CONVERSATION_CACHE_TTL }
        );
      }
    }

    // Optimized context window management
    const MAX_CONTEXT_SIZE = 128 * 1024; // 128KB
    let contextSize = 0;
    const recentMessages = [];
    
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const msg = conversationHistory[i];
      const msgSize = new TextEncoder().encode(JSON.stringify(msg)).length;
      
      if (contextSize + msgSize > MAX_CONTEXT_SIZE && recentMessages.length > 0) {
        break;
      }
      
      contextSize += msgSize;
      recentMessages.unshift(msg);
    }
    
    // Build conversation context
    const conversationContext = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Optimized vector search with caching
    let context = '';
    let relevantChunks: any[] = [];
    
    if (documentIds && documentIds.length > 0) {
      try {
        // Generate cache key for this query + documents combination
        const queryHash = btoa(message + documentIds.join(',')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
        const vectorCacheKey = `vector_search:${queryHash}`;
        
        // Check cache first
        const cachedResults = await env.CACHE_KV?.get(vectorCacheKey, { type: 'json' });
        
        if (cachedResults) {
          relevantChunks = cachedResults as any[];
        } else {
          // Create embedding for the user's query with retry logic
          const queryEmbedding = await callAIWithRetry(
            env,
            '@cf/baai/bge-base-en-v1.5',
            {
              text: message
            }
          );
          
          // Parallel vector searches for better performance
          const searchPromises = documentIds.map(docId =>
            env.VECTORIZE.query(queryEmbedding.data[0], {
              topK: 3, // Reduced from 5 for better performance
              filter: {
                documentId: docId
              }
            })
          );
          
          const searchResults = await Promise.all(searchPromises);
          const allMatches = searchResults.flatMap(result => result.matches);
          
          // Sort by score and take top 5
          allMatches.sort((a, b) => b.score - a.score);
          const topMatches = allMatches.slice(0, 5);
          
          // Batch retrieve chunk text
          const chunkPromises = topMatches.map(match =>
            env.CHAT_HISTORY.get(`chunk:${match.id}`)
          );
          const chunkResults = await Promise.all(chunkPromises);
          
          relevantChunks = topMatches.map((match, index) => {
            if (chunkResults[index]) {
              const chunk = JSON.parse(chunkResults[index]);
              return {
                text: chunk.text,
                score: match.score,
                documentName: match.metadata?.documentName || chunk.documentName
              };
            }
            return null;
          }).filter(Boolean);
          
          // Cache the results
          if (env.CACHE_KV && relevantChunks.length > 0) {
            await env.CACHE_KV.put(
              vectorCacheKey,
              JSON.stringify(relevantChunks),
              { expirationTtl: VECTORIZE_CACHE_TTL }
            );
          }
        }
        
        // Build context from chunks
        if (relevantChunks.length > 0) {
          context = '\n\nRelevant context from uploaded documents:\n' +
            relevantChunks.map((chunk, index) =>
              `[${index + 1}] From "${chunk.documentName}" (relevance: ${(chunk.score * 100).toFixed(1)}%):\n${chunk.text}`
            ).join('\n\n');
        }
      } catch (error) {
        console.error('Vector search error:', error);
        // Don't throw here, just continue without vector search results
        // This allows the chat to work even if vector search fails
      }
    }

    // Store user message
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

    // Invalidate conversation cache
    if (env.CACHE_KV) {
      await env.CACHE_KV.delete(historyCacheKey);
    }

    // Create optimized streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Buffer for optimal streaming
    let buffer = '';
    let bufferSize = 0;
    
    const stream = new ReadableStream({
      async start(controller) {
        // Initialize performance monitoring
        const connectionId = nanoid();
        const monitor = getSSEPerformanceMonitor(env.CACHE_KV);
        monitor.startConnection(connectionId);
        
        // Helper to flush buffer
        const flushBuffer = () => {
          if (buffer) {
            const data = encoder.encode(buffer);
            controller.enqueue(data);
            monitor.recordChunk(connectionId, data.length);
            buffer = '';
            bufferSize = 0;
          }
        };
        
        // Helper to write data
        const writeData = (data: any) => {
          const chunk = `data: ${JSON.stringify(data)}\n\n`;
          buffer += chunk;
          bufferSize += chunk.length;
          
          if (bufferSize >= SSE_BUFFER_SIZE) {
            flushBuffer();
          }
        };
        
        // Set up ping interval to keep connection alive
        const pingInterval = setInterval(() => {
          writeData({ ping: true });
          flushBuffer();
          monitor.recordPing(connectionId);
        }, SSE_PING_INTERVAL);
        
        try {
          // Build the prompt
          const prompt = `You are a helpful AI assistant analyzing documents and answering questions.

IMPORTANT: When referencing information from the provided documents, you MUST include inline citations using the format ^[n] where n is the document number shown in brackets below. Place citations immediately after the relevant statement.

${context}

User Question: ${message}

Instructions:
1. Provide a helpful and accurate response based on the context provided
2. Include ^[n] citations when referencing specific information from document [n]
3. If the context doesn't contain relevant information, let the user know
4. Use multiple citations if information comes from multiple sources`;

          // Build messages array
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

          // Send initial data
          writeData({
            conversationId: convId,
            chunks: relevantChunks.map((chunk, index) => ({
              id: index + 1,
              documentName: chunk.documentName,
              text: chunk.text,
              score: chunk.score
            }))
          });

          // Call AI with streaming and retry logic
          let aiResponse;
          let fullResponse = '';
          
          try {
            // Use the retry wrapper for AI calls
            aiResponse = await callAIWithRetry(
              env,
              '@cf/meta/llama-2-7b-chat-int8',
              {
                messages,
                stream: true,
                max_tokens: 1024,
                temperature: 0.7
              }
            );
            
            // Process streaming response
            if (aiResponse instanceof Response) {
              // Handle streaming response from AI_WORKER
              const reader = aiResponse.body!.getReader();
              const textDecoder = new TextDecoder();
              
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  
                  const text = textDecoder.decode(value, { stream: true });
                  const lines = text.split('\n');
                  
                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      const data = line.slice(6).trim();
                      if (data === '[DONE]') continue;
                      
                      try {
                        const parsed = JSON.parse(data);
                        if (parsed.response) {
                          fullResponse += parsed.response;
                          writeData({ content: parsed.response });
                        } else if (parsed.content) {
                          // Alternative format
                          fullResponse += parsed.content;
                          writeData({ content: parsed.content });
                        }
                      } catch (e) {
                        // Skip invalid JSON lines
                      }
                    }
                  }
                }
              } finally {
                reader.releaseLock();
              }
            } else if (aiResponse && typeof aiResponse[Symbol.asyncIterator] === 'function') {
              // Handle native AI streaming (for development)
              for await (const chunk of aiResponse) {
                if (chunk.response) {
                  fullResponse += chunk.response;
                  writeData({ content: chunk.response });
                }
              }
            } else {
              // Non-streaming response fallback
              console.warn('AI response is not a stream, handling as regular response');
              if (aiResponse?.response) {
                fullResponse = aiResponse.response;
                writeData({ content: fullResponse });
              } else if (aiResponse?.content) {
                fullResponse = aiResponse.content;
                writeData({ content: fullResponse });
              }
            }
          } catch (aiError: any) {
            console.error('AI service error after retries:', aiError);
            
            // Format error for better user experience
            const { message, details } = formatAIError(aiError);
            throw new Error(`${message} - ${details}`);
          }
          
          // Flush any remaining buffer
          flushBuffer();

          // Store assistant message only if we have a response
          if (fullResponse) {
            const assistantMessageId = `${convId}:${nanoid()}`;
            const assistantMessageData = {
              id: assistantMessageId,
              conversationId: convId,
              role: 'assistant',
              content: fullResponse,
              timestamp: new Date().toISOString()
            };
            
            try {
              await env.CHAT_HISTORY.put(
                `msg:${assistantMessageId}`,
                JSON.stringify(assistantMessageData)
              );
            } catch (kvError) {
              console.error('Failed to store assistant message:', kvError);
              // Don't throw here, just log the error
            }

            // Update conversation metadata
            try {
              await env.CHAT_HISTORY.put(
                `conv:${convId}`,
                JSON.stringify({
                  id: convId,
                  title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                  lastMessage: fullResponse.substring(0, 100) + (fullResponse.length > 100 ? '...' : ''),
                  timestamp: new Date().toISOString(),
                  messageCount: conversationHistory.length + 2
                })
              );
            } catch (kvError) {
              console.error('Failed to update conversation metadata:', kvError);
              // Don't throw here, just log the error
            }
          }

          // Send completion signal
          writeData({ done: true });
          flushBuffer();
          
          controller.close();
          
          // End performance monitoring
          const metrics = await monitor.endConnection(connectionId);
          if (metrics) {
            console.log(`SSE Connection metrics: ${JSON.stringify({
              duration: `${(metrics.totalDuration! / 1000).toFixed(2)}s`,
              throughput: `${(metrics.throughput! / 1024).toFixed(2)}KB/s`,
              chunks: metrics.chunksTransferred,
              errors: metrics.errors
            })}`);
          }
        } catch (error) {
          console.error('Streaming error:', error);
          monitor.recordError(connectionId);
          
          // Provide more specific error messages
          let errorMessage = 'An error occurred while processing your request';
          let errorDetails = 'Unknown error';
          
          if (error instanceof Error) {
            errorDetails = error.message;
            
            // Check for specific error types
            if (error.message.includes('AI service is at capacity') ||
                error.message.includes('Rate limit exceeded') ||
                error.message.includes('Daily quota limit reached') ||
                error.message.includes('AI service access denied') ||
                error.message.includes('AI service is temporarily unavailable')) {
              // Use the formatted error message directly
              const parts = error.message.split(' - ');
              errorMessage = parts[0];
              if (parts[1]) {
                errorDetails = parts[1];
              }
            } else if (error.message.includes('Stream processing error')) {
              errorMessage = 'Failed to process AI response';
            } else if (error.message.includes('Vector search error')) {
              errorMessage = 'Document search failed';
            } else if (error.message.includes('KV')) {
              errorMessage = 'Storage service error';
            }
          }
          
          writeData({
            error: errorMessage,
            details: errorDetails
          });
          flushBuffer();
          controller.close();
          await monitor.endConnection(connectionId);
        } finally {
          clearInterval(pingInterval);
        }
      }
    });

    // Return optimized SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
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