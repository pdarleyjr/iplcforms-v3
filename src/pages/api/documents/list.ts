import type { APIRoute } from 'astro';
import type { AIEnv } from '../../../lib/ai';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  
  try {
    const params = url.searchParams;
    const limit = parseInt(params.get('limit') || '50', 10);
    const cursor = params.get('cursor') || null;
    const search = params.get('search') || null;
    const includeStats = params.get('includeStats') === 'true';

    // Validate limit
    if (limit < 1 || limit > 100) {
      return new Response(JSON.stringify({ 
        error: 'Limit must be between 1 and 100' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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

    // Build query parameters
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      ...(cursor && { cursor }),
      ...(search && { search }),
      ...(includeStats && { includeStats: 'true' })
    });

    // Call the iplc-ai worker's /documents/list endpoint
    const listResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/list?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!listResponse.ok) {
      const error = await listResponse.text();
      throw new Error(error);
    }

    const result = await listResponse.json();

    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=30' // Cache for 30 seconds
      }
    });

  } catch (error) {
    console.error('List documents error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Example request:
// GET /api/documents/list?limit=10&cursor=abc123&search=report&includeStats=true

// Example response:
/*
{
  "documents": [
    {
      "id": "doc-123",
      "name": "Annual Report 2024.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "uploadedAt": "2024-01-01T00:00:00Z",
      "chunksCount": 25,
      "vectorIds": ["vec-1", "vec-2", ...],
      "metadata": {
        "contentHash": "sha256:...",
        "pageCount": 10
      }
    },
    ...
  ],
  "cursor": "next-page-cursor",
  "hasMore": true,
  "stats": {
    "documentCount": 150,
    "totalVectors": 3750,
    "estimatedDimensions": 1440000,
    "kvUsage": {
      "documentsStored": 150,
      "hashesStored": 150
    }
  }
}
*/