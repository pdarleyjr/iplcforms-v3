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

    for (const file of files) {
      const documentId = nanoid();
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromFile(file, buffer);
      
      // Split text into chunks for vectorization
      const chunks = splitTextIntoChunks(text, 1000); // 1000 chars per chunk
      
      // Store document metadata in KV
      const documentMetadata = {
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        conversationId,
        chunks: chunks.length
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

      // Store chunks and create vector embeddings
      for (let i = 0; i < chunks.length; i++) {
        const chunkId = `${documentId}-${i}`;
        const chunkText = chunks[i];
        
        // Store chunk in KV
        await env.CHAT_HISTORY.put(
          `chunk:${chunkId}`,
          JSON.stringify({
            id: chunkId,
            documentId,
            conversationId,
            text: chunkText,
            index: i
          })
        );

        // Create vector embedding using Workers AI
        try {
          const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: chunkText
          });
          
          // Store in Vectorize
          await env.VECTORIZE.insert([{
            id: chunkId,
            values: embedding.data[0],
            metadata: {
              documentId,
              conversationId,
              documentName: file.name,
              chunkIndex: i
            }
          }]);
        } catch (error) {
          console.error('Failed to create embedding for chunk:', error);
        }
      }

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