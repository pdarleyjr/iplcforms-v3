import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const conversationId = formData.get('conversationId') as string || nanoid();
    
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadedDocuments = [];

    // Check if AI_WORKER binding exists
    if (!env.AI_WORKER) {
      throw new Error('AI_WORKER binding not configured');
    }

    for (const file of files) {
      const documentId = nanoid();
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromFile(file, buffer);
      
      // Forward to iplc-ai worker for embedding
      const embedResponse = await env.AI_WORKER.fetch('https://iplc-ai.workers.dev/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: [text], // The iplc-ai worker expects a texts array
          metadata: {
            documentId,
            conversationId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }
        })
      });

      if (!embedResponse.ok) {
        const errorData = await embedResponse.json();
        throw new Error(errorData.error || 'Failed to embed document');
      }

      const result = await embedResponse.json();
      
      // Store document metadata locally for listing
      const documentMetadata = {
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        conversationId,
        chunks: result.chunks
      };
      
      await env.CHAT_HISTORY.put(
        `doc:${documentId}`,
        JSON.stringify(documentMetadata),
        {
          metadata: {
            conversationId,
            type: 'document'
          }
        }
      );

      uploadedDocuments.push(documentMetadata);
    }

    // Create or update conversation
    const conversation = await env.CHAT_HISTORY.get(`conv:${conversationId}`);
    if (!conversation) {
      await env.CHAT_HISTORY.put(
        `conv:${conversationId}`,
        JSON.stringify({
          id: conversationId,
          title: `Chat about ${files[0].name}`,
          createdAt: new Date().toISOString(),
          lastMessage: '',
          timestamp: new Date().toISOString()
        })
      );
    }

    return new Response(JSON.stringify({
      success: true,
      conversationId,
      documents: uploadedDocuments
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload files',
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
      file.name.endsWith('.md') ||
      file.name.endsWith('.txt')) {
    return decoder.decode(buffer);
  }
  
  // For PDF and other binary formats, we'd need a proper parser
  // For now, we'll just return a placeholder
  // In production, you'd use libraries like pdf-parse
  if (type.includes('pdf')) {
    return `[PDF content from ${file.name} - parsing not implemented]`;
  }
  
  if (type.includes('doc')) {
    return `[Document content from ${file.name} - parsing not implemented]`;
  }
  
  return `[Binary file ${file.name} - content extraction not supported]`;
}

function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}