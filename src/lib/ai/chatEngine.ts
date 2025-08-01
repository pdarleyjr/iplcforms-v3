/**
 * Chat engine module for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Module: chatEngine.ts
 * 
 * Handles RAG response generation with streaming support
 */

import type { AIEnv, ChatMessage, RAGOptions, ConversationHistory } from './types';
import { getDocumentContext } from './vectorSearch';

// Free tier model for chat as per spec
const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

// System prompt for the IPLC Notebook Assistant
const SYSTEM_PROMPT = `You are IPLC Notebook Assistant, an AI that helps users understand and analyze their documents.

Your responses should:
- Be grounded in the provided context from user documents
- Include citations when referencing specific information
- Be clear, concise, and helpful
- Acknowledge when information is not available in the provided context

When citing sources, use the format [Source: document name, page X] where applicable.`;

/**
 * Generate a RAG response with optional streaming
 * Reference: "Single-Worker RAG Implementation.txt" - RAG Response Generation
 * 
 * @param question - The user's question
 * @param history - Previous conversation history
 * @param env - Worker environment
 * @param options - Generation options including streaming
 * @returns ReadableStream for SSE responses
 */
export async function generateRAGResponse(
  question: string,
  history: ChatMessage[] = [],
  env: AIEnv,
  options: RAGOptions = {}
): Promise<ReadableStream> {
  const {
    maxTokens = 2048,
    temperature = 0.7,
    stream = true,
    model = CHAT_MODEL,
    topK = 4,
  } = options;

  try {
    // Validate question with proper coalescing
    const cleanQuestion = String(question ?? '').trim();
    if (!cleanQuestion) {
      console.error('Empty question provided');
      return createErrorStream('Question cannot be empty');
    }

    // Get relevant document context with defensive handling
    const context = await getDocumentContext(cleanQuestion, topK, env);
    
    // Graceful handling when no relevant documents found
    if (!context || context === '(No relevant context found in documents)') {
      console.log('No relevant documents found for query:', cleanQuestion);
      // Return a graceful response instead of error
      return createErrorStream("No relevant documents found for your query. Please ensure documents are uploaded.");
    }
    
    // Ensure context is never empty for AI model
    const safeContext = context || '(No relevant context found)';
    
    // Prepare messages with context
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT || 'You are a helpful assistant.',
      },
      ...history.slice(-6), // Keep last 6 messages for context (3 exchanges)
      {
        role: 'user',
        // Ensure content is always a non-empty string
        content: safeContext.includes('No relevant context')
          ? `Question: ${cleanQuestion}\n\n${safeContext}`
          : `Context from your documents:\n\n${safeContext}\n\n---\n\nQuestion: ${cleanQuestion}`,
      },
    ];

    // Validate all messages have content
    const validatedMessages = messages.map(msg => ({
      role: msg.role,
      content: String(msg.content ?? '').trim() || 'No content',
    }));

    // Check if AI binding exists
    if (!env.AI) {
      console.error('AI binding is undefined');
      throw new Error('AI binding not available');
    }

    console.log('AI binding exists, calling AI.run with model:', model);
    console.log('Message count:', validatedMessages.length);
    console.log('Stream:', stream, 'Max tokens:', maxTokens, 'Temperature:', temperature);

    // Generate response using Workers AI
    let response;
    try {
      response = await env.AI.run(model, {
        messages: validatedMessages,
        stream,
        max_tokens: maxTokens,
        temperature,
      });
    } catch (aiError) {
      console.error('AI.run() error:', aiError);
      console.error('Error type:', typeof aiError);
      console.error('Error keys:', aiError ? Object.keys(aiError) : 'null');
      throw aiError;
    }

    console.log('AI response received:', response ? 'exists' : 'null');
    console.log('AI response type:', typeof response);
    
    // Wrap all response inspection in try-catch to isolate logging issues
    try {
      if (response) {
        try {
          // Be very careful about what we log to avoid toString errors
          const responseKeys = response && typeof response === 'object' ? Object.keys(response) : [];
          console.log('AI response keys count:', responseKeys.length);
          console.log('AI response has getReader:', typeof response.getReader === 'function');
          // Don't log constructor name as it might trigger toString
        } catch (e) {
          console.error('Error inspecting AI response:', e);
        }
      }

      // Convert to SSE stream with error handling
      return createSSEStream(response, stream);
    } catch (streamError) {
      console.error('Error creating SSE stream:', streamError);
      // Return error stream instead of throwing
      return createErrorStream('Failed to create response stream');
    }
  } catch (error) {
    console.error('RAG generation error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return createErrorStream(errorMessage);
  }
}

/**
 * Create a Server-Sent Events (SSE) stream from AI response
 * Reference: "Single-Worker RAG Implementation.txt" - Streaming Implementation
 * 
 * @param aiResponse - Response from Workers AI
 * @param isStreaming - Whether the response is streaming
 * @returns ReadableStream in SSE format
 */
function createSSEStream(aiResponse: any, isStreaming: boolean): ReadableStream {
  const encoder = new TextEncoder();
  
  try {
    const decoder = new TextDecoder();
    console.log('createSSEStream called with isStreaming:', isStreaming);
    console.log('aiResponse type:', typeof aiResponse);
    
    // Don't log the aiResponse directly to avoid toString issues
    if (aiResponse) {
      console.log('aiResponse exists: true');
      console.log('aiResponse has getReader:', typeof aiResponse.getReader === 'function');
    } else {
      console.log('aiResponse exists: false');
    }
    
    // Check if the response is actually a ReadableStream
    let isActuallyStreaming = false;
    try {
      isActuallyStreaming = aiResponse && typeof aiResponse.getReader === 'function';
      console.log('isActuallyStreaming:', isActuallyStreaming);
    } catch (e) {
      console.error('Error checking if response is streaming:', e);
      isActuallyStreaming = false;
    }
    
    if (!isStreaming || !isActuallyStreaming) {
    // Non-streaming response
    return new ReadableStream({
      start(controller) {
        try {
          let responseText = '';
          
          // Handle different response formats with defensive checks
          if (typeof aiResponse === 'string') {
            responseText = aiResponse;
          } else if (aiResponse && typeof aiResponse === 'object') {
            if ('response' in aiResponse) {
              responseText = String(aiResponse.response ?? '');
            } else if ('choices' in aiResponse && Array.isArray(aiResponse.choices) && aiResponse.choices.length > 0) {
              // Handle OpenAI-style response format
              const choice = aiResponse.choices[0];
              if (choice?.message?.content != null) {
                responseText = String(choice.message.content);
              } else if (choice?.text != null) {
                responseText = String(choice.text);
              }
            } else {
              // Try to stringify the entire response as a fallback
              console.warn('Unexpected AI response format:', aiResponse);
              try {
                responseText = JSON.stringify(aiResponse);
              } catch (e) {
                console.error('Failed to stringify response:', e);
                responseText = '';
              }
            }
          }
          
          // Ensure responseText is never undefined/null
          const safeResponseText = responseText || 'I apologize, but I was unable to generate a response.';
          
          console.log('Final responseText:', safeResponseText);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: safeResponseText })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Non-streaming SSE error:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          controller.enqueue(encoder.encode('event: end\n\n'));
        } finally {
          controller.close();
        }
      },
    });
  }

    // Streaming response
    return new ReadableStream({
    async start(controller) {
      let hasError = false;
      try {
        // Check if aiResponse has a getReader method
        if (!aiResponse || typeof aiResponse.getReader !== 'function') {
          console.error('AI response does not have getReader method');
          console.error('AI response type:', typeof aiResponse);
          // Don't log the response object or constructor to avoid toString issues
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Invalid streaming response' })}\n\n`));
          controller.enqueue(encoder.encode('event: end\n\n'));
          controller.close();
          return;
        }

        console.log('Getting reader from AI response stream');
        const reader = aiResponse.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            // Check done FIRST before processing value
            if (done) {
              console.log('Stream reading complete');
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              break;
            }
            
            // Defensive handling: value could be undefined even when done is false
            if (!value) {
              console.warn('Received undefined value in stream');
              continue;
            }
            
            // Parse the chunk and format as SSE with try/catch for JSON building
            try {
              const chunk = decoder.decode(value);
              console.log('Decoded chunk:', chunk ? `${chunk.substring(0, 50)}...` : 'empty');
              
              if (chunk) {
                // For Cloudflare Workers AI, chunks are typically plain text
                const sseMessage = `data: ${JSON.stringify({ response: chunk })}\n\n`;
                controller.enqueue(encoder.encode(sseMessage));
              }
            } catch (chunkError) {
              console.error('Error processing stream chunk:', chunkError);
              console.error('Chunk value type:', typeof value);
              console.error('Chunk value:', value);
              // Don't throw, just log and continue to next chunk
            }
          }
        } catch (error) {
          hasError = true;
          console.error('Stream reading error:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        hasError = true;
        console.error('Stream setup error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
      } finally {
        // Always send final event
        if (hasError) {
          controller.enqueue(encoder.encode('event: error\n\n'));
        }
        controller.enqueue(encoder.encode('event: end\n\n'));
        controller.close();
      }
    },
    });
  } catch (error) {
    console.error('Critical error in createSSEStream:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    // Return an error stream
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream creation failed' })}\n\n`));
        controller.enqueue(encoder.encode('event: error\n\n'));
        controller.close();
      }
    });
  }
}

/**
 * Create an error stream in SSE format
 * 
 * @param errorMessage - Error message to send
 * @returns ReadableStream with error message
 */
function createErrorStream(errorMessage: string): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      try {
        const safeErrorMessage = String(errorMessage ?? 'An unknown error occurred');
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: safeErrorMessage })}\n\n`));
        controller.enqueue(encoder.encode('event: error\n\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.enqueue(encoder.encode('event: end\n\n'));
      } catch (error) {
        console.error('Error creating error stream:', error);
        controller.enqueue(encoder.encode('data: {"error": "Failed to create error stream"}\n\n'));
        controller.enqueue(encoder.encode('event: end\n\n'));
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Store conversation history in KV
 * Reference: "Single-Worker RAG Implementation.txt" - Conversation History Management
 * 
 * @param sessionId - Unique session identifier
 * @param messages - Conversation messages to store
 * @param env - Worker environment
 */
export async function storeConversationHistory(
  sessionId: string,
  messages: ChatMessage[],
  env: AIEnv
): Promise<void> {
  const history: ConversationHistory = {
    sessionId,
    messages,
    lastUpdated: new Date().toISOString(),
  };

  // Store with 30-minute TTL as per spec
  await env.CHAT_HISTORY.put(
    `session:${sessionId}`,
    JSON.stringify(history),
    {
      expirationTtl: 1800, // 30 minutes in seconds
    }
  );
}

/**
 * Retrieve conversation history from KV
 * Reference: "Single-Worker RAG Implementation.txt" - Conversation History Management
 * 
 * @param sessionId - Unique session identifier
 * @param env - Worker environment
 * @returns Conversation history or null if not found
 */
export async function getConversationHistory(
  sessionId: string,
  env: AIEnv
): Promise<ConversationHistory | null> {
  try {
    const data = await env.CHAT_HISTORY.get(`session:${sessionId}`, 'json');
    return data as ConversationHistory;
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    return null;
  }
}

/**
 * Generate a summary of text
 * Reference: "Single-Worker RAG Implementation.txt" - Additional Features
 * 
 * @param text - Text to summarize
 * @param env - Worker environment
 * @param maxLength - Maximum length of summary in words
 * @returns Generated summary
 */
export async function generateSummary(
  text: string,
  env: AIEnv,
  maxLength: number = 200
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert at creating concise summaries. Summarize the following text in no more than ${maxLength} words.`,
      },
      {
        role: 'user',
        content: text,
      },
    ];

    const response = await env.AI.run(CHAT_MODEL, {
      messages,
      stream: false,
      max_tokens: Math.floor(maxLength * 1.5), // Allow some buffer
      temperature: 0.3, // Lower temperature for more focused summaries
    });

    return response.response || 'Failed to generate summary';
  } catch (error) {
    console.error('Summary generation error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate summary: ${errorMessage}`);
  }
}

/**
 * Generate an outline from multiple documents
 * Reference: "Single-Worker RAG Implementation.txt" - Additional Features
 * 
 * @param documents - Array of document texts
 * @param env - Worker environment
 * @returns Generated outline
 */
export async function generateOutline(
  documents: string[],
  env: AIEnv
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at creating comprehensive outlines from documents. Create a structured outline that captures the main topics, key points, and relationships between ideas.',
      },
      {
        role: 'user',
        content: `Create a comprehensive outline from these documents:\n\n${documents.join('\n\n---\n\n')}`,
      },
    ];

    const response = await env.AI.run(CHAT_MODEL, {
      messages,
      stream: false,
      max_tokens: 2048,
      temperature: 0.5,
    });

    return response.response || 'Failed to generate outline';
  } catch (error) {
    console.error('Outline generation error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate outline: ${errorMessage}`);
  }
}

/**
 * Process a chat message with RAG and return SSE stream
 * Reference: "Single-Worker RAG Implementation.txt" - API Integration
 * 
 * This is the main entry point for chat requests
 * 
 * @param request - The incoming request with question and optional session
 * @param env - Worker environment
 * @returns Response with SSE stream
 */
export async function handleChatRequest(
  request: Request,
  env: AIEnv
): Promise<Response> {
  try {
    const { question, sessionId, history = [] } = await request.json();
    
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get conversation history if session ID provided
    let conversationHistory: ChatMessage[] = history;
    if (sessionId) {
      const stored = await getConversationHistory(sessionId, env);
      if (stored) {
        conversationHistory = [...stored.messages, ...history];
      }
    }

    // Generate RAG response
    const stream = await generateRAGResponse(question, conversationHistory, env);

    // Store updated history if session ID provided
    if (sessionId) {
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: question } as ChatMessage,
      ];
      await storeConversationHistory(sessionId, updatedHistory, env);
    }

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat request error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}