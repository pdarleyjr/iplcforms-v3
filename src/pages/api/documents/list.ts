import type { APIRoute } from 'astro';
import { listDocuments, searchDocumentsByName, getStorageStats } from '../../../lib/ai';
import type { AIEnv } from '../../../lib/ai';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = locals.runtime.env as unknown as AIEnv;
  
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

    let result: any;
    
    if (search) {
      // Use search functionality
      const documents = await searchDocumentsByName(search, limit, env);
      result = {
        documents,
        cursor: null, // Search doesn't support pagination
        hasMore: false
      };
    } else {
      // Use regular listing with pagination
      const { documents, cursor: nextCursor } = await listDocuments(limit, cursor, env);
      result = {
        documents,
        cursor: nextCursor,
        hasMore: !!nextCursor
      };
    }

    // Include storage statistics if requested
    if (includeStats) {
      const stats = await getStorageStats(env);
      result.stats = stats;
    }

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