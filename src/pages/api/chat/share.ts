import type { APIRoute } from 'astro';

export const runtime = 'edge';

interface ShareRequest {
  question: string;
  answer: string;
  citations?: Array<{
    id: number;
    documentName: string;
    text: string;
    score: number;
  }>;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const body = await request.json() as ShareRequest;
    
    // Validate request
    if (!body.question || !body.answer) {
      return new Response(JSON.stringify({ 
        error: 'Question and answer are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate unique ID for the snippet
    const snippetId = crypto.randomUUID();
    
    // Prepare snippet data
    const snippet = {
      id: snippetId,
      question: body.question,
      answer: body.answer,
      citations: body.citations || [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    
    // Store in KV with expiration
    await env.KV.put(
      `chat:snippet:${snippetId}`,
      JSON.stringify(snippet),
      {
        expirationTtl: 30 * 24 * 60 * 60 // 30 days in seconds
      }
    );
    
    // Generate shareable URL
    const origin = new URL(request.url).origin;
    const shareUrl = `${origin}/chat/shared/${snippetId}`;
    
    return new Response(JSON.stringify({ 
      success: true,
      snippetId,
      shareUrl,
      expiresAt: snippet.expiresAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating shared snippet:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create shared snippet' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const { env } = locals.runtime;
    const snippetId = url.searchParams.get('id');
    
    if (!snippetId) {
      return new Response(JSON.stringify({ 
        error: 'Snippet ID is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Retrieve snippet from KV
    const snippetData = await env.KV.get(`chat:snippet:${snippetId}`);
    
    if (!snippetData) {
      return new Response(JSON.stringify({ 
        error: 'Snippet not found or has expired' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const snippet = JSON.parse(snippetData);
    
    return new Response(JSON.stringify({ 
      success: true,
      snippet
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error retrieving shared snippet:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve shared snippet' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};