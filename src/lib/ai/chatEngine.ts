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
    // Get relevant document context
    const context = await getDocumentContext(question, topK, env);
    
    // Prepare messages with context
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...history.slice(-6), // Keep last 6 messages for context (3 exchanges)
      {
        role: 'user',
        content: context.length > 0 
          ? `Context from your documents:\n\n${context}\n\n---\n\nQuestion: ${question}`
          : `Question: ${question}\n\n(No relevant documents found in your notebook)`,
      },
    ];

    // Generate response using Workers AI
    const response = await env.AI.run(model, {
      messages,
      stream,
      max_tokens: maxTokens,
      temperature,
    });

    // Convert to SSE stream
    return createSSEStream(response, stream);
  } catch (error) {
    console.error('RAG generation error:', error);
    return createErrorStream(error.message);
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
  const decoder = new TextDecoder();

  if (!isStreaming) {
    // Non-streaming response
    return new ReadableStream({
      start(controller) {
        const responseText = aiResponse.response || '';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: responseText })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
  }

  // Streaming response
  return new ReadableStream({
    async start(controller) {
      const reader = aiResponse.getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            break;
          }
          
          // Parse the chunk and format as SSE
          const chunk = decoder.decode(value);
          const sseMessage = `data: ${JSON.stringify({ response: chunk })}\n\n`;
          controller.enqueue(encoder.encode(sseMessage));
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
  });
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
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
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
    throw new Error(`Failed to generate summary: ${error.message}`);
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
    throw new Error(`Failed to generate outline: ${error.message}`);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}