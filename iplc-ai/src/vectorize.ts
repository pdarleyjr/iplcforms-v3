import { Env, EmbedResponse, QueryResult, VectorizeVector, EmbedMetadata } from './types';

// Free tier model for embeddings
const EMBED_MODEL = '@cf/baai/bge-small-en-v1.5';

// Chunk text into smaller pieces for embedding
export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function embedAndStore(
  texts: string[], 
  metadata: EmbedMetadata,
  env: Env
): Promise<EmbedResponse> {
  try {
    // Chunk texts if they're too large
    const allChunks: string[] = [];
    const chunkMetadata: Array<any> = [];
    
    texts.forEach((text, textIndex) => {
      const chunks = chunkText(text);
      chunks.forEach((chunk, chunkIndex) => {
        allChunks.push(chunk);
        chunkMetadata.push({
          ...metadata,
          chunkIndex,
          textIndex,
          chunk: chunk.slice(0, 200), // Store first 200 chars for preview
          fullChunk: chunk,
          timestamp: new Date().toISOString(),
        });
      });
    });

    // Generate embeddings using Workers AI
    const embedResponse = await env.AI.run(EMBED_MODEL, {
      text: allChunks,
    });

    if (!embedResponse || !embedResponse.data || !Array.isArray(embedResponse.data)) {
      throw new Error('Invalid embedding response');
    }

    // Prepare vectors for insertion
    const vectors: VectorizeVector[] = embedResponse.data.map((embedding: number[], idx: number) => ({
      id: `${metadata.documentId}-${Date.now()}-${idx}`,
      values: embedding,
      metadata: chunkMetadata[idx],
    }));

    // Insert vectors into Vectorize
    await env.DOC_INDEX.upsert(vectors);

    // Store document metadata in KV
    const docMetadata = {
      name: metadata.documentName,
      type: metadata.documentType,
      chunksCount: vectors.length,
      uploadedAt: new Date().toISOString(),
      vectorIds: vectors.map(v => v.id),
    };
    
    await env.DOC_METADATA.put(metadata.documentId, JSON.stringify(docMetadata));

    return {
      success: true,
      vectorIds: vectors.map(v => v.id),
    };
  } catch (error) {
    console.error('Embed and store error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function queryDocuments(
  query: string,
  limit: number,
  env: Env
): Promise<QueryResult[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await env.AI.run(EMBED_MODEL, {
      text: [query],
    });

    if (!queryEmbedding || !queryEmbedding.data || !Array.isArray(queryEmbedding.data[0])) {
      throw new Error('Invalid query embedding response');
    }

    // Query the vector index
    const results = await env.DOC_INDEX.query(queryEmbedding.data[0], {
      topK: limit,
    });

    // Map results to QueryResult format
    return results.map(match => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata || {},
    }));
  } catch (error) {
    console.error('Query documents error:', error);
    return [];
  }
}

export async function getDocumentContext(
  query: string,
  topK: number = 4,
  env: Env
): Promise<string> {
  const results = await queryDocuments(query, topK, env);
  
  if (results.length === 0) {
    return '';
  }
  
  // Extract the full chunks from results
  const contextChunks = results
    .map(result => result.metadata.fullChunk || result.metadata.chunk || '')
    .filter(chunk => chunk.length > 0);
  
  return contextChunks.join('\n\n---\n\n');
}