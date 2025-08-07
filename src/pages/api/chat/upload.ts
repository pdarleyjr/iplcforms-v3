import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import type { AIEnv } from '../../../lib/ai';

import { withRBAC } from '@/lib/middleware/rbac-middleware';
export const POST: APIRoute = withRBAC(['clinician','admin'], async ({ request, locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  
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

    const uploadedDocuments = [];

    for (const file of files) {
      const documentId = nanoid();
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromFile(file, buffer);
      
      // Split text into chunks for better retrieval
      const chunks = splitTextIntoChunks(text, 600);
      
      // Convert file to base64 for transmission
      const base64Content = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
      
      // Call the iplc-ai worker's /documents/upload endpoint
      const uploadResponse = await iplcAI.fetch('https://iplc-ai.worker/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          documentName: file.name,
          documentType: file.type,
          chunks: chunks,
          conversationId
        })
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        console.error(`Failed to upload ${file.name}:`, error);
        continue;
      }
      
      const result = await uploadResponse.json();
      
      uploadedDocuments.push({
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        conversationId,
        chunks: chunks.length,
        vectorIds: result.vectorIds
      });
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
});

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