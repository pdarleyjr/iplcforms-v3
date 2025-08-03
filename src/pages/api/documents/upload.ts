import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { storeDocument, checkRateLimit } from '../../../lib/ai';
import type { AIEnv, EmbedMetadata } from '../../../lib/ai';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as unknown as AIEnv;
  
  try {
    // Check rate limit
    const clientId = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const rateLimitInfo = await checkRateLimit(clientId, env);
    
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitInfo.retryAfter
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': (rateLimitInfo.limit || 60).toString(),
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
        }
      });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadedDocuments = [];

    for (const file of files) {
      const documentId = nanoid();
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromFile(file, buffer);
      
      // Split text into chunks with overlap
      const chunks = splitTextIntoChunks(text, 600, 50);
      
      // Store document with embeddings
      const metadata: EmbedMetadata = {
        documentId,
        documentName: file.name,
        documentType: file.type,
        pageNumber: 1
      };
      
      const result = await storeDocument(chunks, metadata, env);
      
      if (!result.success) {
        // Continue with other files even if one fails
        console.error(`Failed to upload ${file.name}:`, result.error);
        uploadedDocuments.push({
          id: documentId,
          name: file.name,
          error: result.error,
          success: false
        });
        continue;
      }
      
      uploadedDocuments.push({
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        chunks: chunks.length,
        vectorIds: result.vectorIds,
        success: true
      });
    }

    return new Response(JSON.stringify({
      success: true,
      documents: uploadedDocuments,
      rateLimitInfo: {
        limit: rateLimitInfo.limit,
        remaining: rateLimitInfo.remaining,
        resetAt: rateLimitInfo.resetAt
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': (rateLimitInfo.limit || 60).toString(),
        'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
        'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function extractTextFromFile(file: File, buffer: ArrayBuffer): Promise<string> {
  const type = file.type;
  const decoder = new TextDecoder();
  
  // Handle text-based files
  if (type.includes('text') || 
      type.includes('json') || 
      type.includes('csv') ||
      type.includes('javascript') ||
      type.includes('typescript') ||
      type.includes('html') ||
      type.includes('css') ||
      type.includes('xml') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.js') ||
      file.name.endsWith('.ts') ||
      file.name.endsWith('.jsx') ||
      file.name.endsWith('.tsx') ||
      file.name.endsWith('.vue') ||
      file.name.endsWith('.svelte')) {
    return decoder.decode(buffer);
  }
  
  // For PDF and other binary formats, we'd need a proper parser
  // In production, you'd use libraries like pdf-parse
  if (type.includes('pdf')) {
    return `[PDF content from ${file.name} - parsing not implemented. Please convert to text format.]`;
  }
  
  if (type.includes('doc')) {
    return `[Document content from ${file.name} - parsing not implemented. Please convert to text format.]`;
  }
  
  return `[Binary file ${file.name} - content extraction not supported. Please use text-based formats.]`;
}

function splitTextIntoChunks(text: string, chunkSize: number, overlap: number = 50): string[] {
  const chunks: string[] = [];
  
  // If text is smaller than chunk size, return as single chunk
  if (text.length <= chunkSize) {
    return [text.trim()];
  }
  
  // Split by sentences first
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  let previousChunkEnd = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed chunk size
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      // Add the chunk with overlap from previous chunk
      const chunkWithOverlap = previousChunkEnd + currentChunk;
      chunks.push(chunkWithOverlap.trim());
      
      // Store end of current chunk for next overlap
      const words = currentChunk.split(' ');
      const overlapWords = Math.ceil(overlap / 6); // Assuming average word length of 6
      previousChunkEnd = words.slice(-overlapWords).join(' ') + ' ';
      
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  // Add the last chunk
  if (currentChunk.trim()) {
    const chunkWithOverlap = previousChunkEnd + currentChunk;
    chunks.push(chunkWithOverlap.trim());
  }
  
  return chunks;
}