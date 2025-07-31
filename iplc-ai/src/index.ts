import { Env, ChatMessage, EmbedResponse, QueryResult } from './types';
import { embedAndStore, queryDocuments } from './vectorize';
import { generateRAGResponse } from './rag';
import { SessionDO } from './durable-objects/session';
import { handleScheduledCleanup } from './cleanup';

export { SessionDO };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (url.pathname) {
        case '/health':
          return new Response(JSON.stringify({ status: 'ok', service: 'iplc-ai' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        case '/embed':
          if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
          }
          return await handleEmbed(request, env, corsHeaders);

        case '/rag':
          if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
          }
          return await handleRAG(request, env, corsHeaders);

        case '/query':
          if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405, headers: corsHeaders });
          }
          return await handleQuery(request, env, corsHeaders);

        case '/documents':
          if (request.method === 'GET') {
            return await handleListDocuments(env, corsHeaders);
          } else if (request.method === 'DELETE') {
            return await handleDeleteDocument(request, env, corsHeaders);
          }
          return new Response('Method not allowed', { status: 405, headers: corsHeaders });

        default:
          return new Response('Not found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        try {
          console.log(`Scheduled cleanup triggered at ${new Date().toISOString()}`);
          const results = await handleScheduledCleanup(env);
          console.log('Cleanup results:', results);
        } catch (error) {
          console.error('Scheduled cleanup error:', error);
        }
      })()
    );
  },
};

async function handleEmbed(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const { texts, metadata } = await request.json();
  
  if (!texts || !Array.isArray(texts)) {
    return new Response(JSON.stringify({ error: 'Invalid input: texts array required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await embedAndStore(texts, metadata, env);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Embed error:', error);
    return new Response(JSON.stringify({ error: 'Failed to embed documents' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleRAG(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const { question, history = [], sessionId } = await request.json();
  
  if (!question) {
    return new Response(JSON.stringify({ error: 'Question is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Use Durable Object for session management if sessionId provided
    if (sessionId) {
      const id = env.SESSION_DO.idFromName(sessionId);
      const session = env.SESSION_DO.get(id);
      const sessionResponse = await session.fetch(request);
      return new Response(sessionResponse.body, {
        headers: { ...corsHeaders, ...Object.fromEntries(sessionResponse.headers) },
      });
    }

    // Direct RAG response without session
    const stream = await generateRAGResponse(question, history, env);
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('RAG error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleQuery(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const { query, limit = 10 } = await request.json();
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const results = await queryDocuments(query, limit, env);
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Query error:', error);
    return new Response(JSON.stringify({ error: 'Failed to query documents' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleListDocuments(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const documents = await env.DOC_METADATA.list();
    const docList = await Promise.all(
      documents.keys.map(async (key) => {
        const metadata = await env.DOC_METADATA.get(key.name, 'json');
        return { id: key.name, ...metadata };
      })
    );
    
    return new Response(JSON.stringify({ documents: docList }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List documents error:', error);
    return new Response(JSON.stringify({ error: 'Failed to list documents' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleDeleteDocument(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const { documentId } = await request.json();
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Delete from metadata
    await env.DOC_METADATA.delete(documentId);
    
    // Note: Vectorize doesn't support individual vector deletion in free tier
    // Vectors will be cleaned up by the cron job
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete document' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}