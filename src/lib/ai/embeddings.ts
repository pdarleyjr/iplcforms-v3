/**
 * Embeddings module for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Module: embeddings.ts
 * 
 * Handles text chunking, embedding generation, and content deduplication
 */

import { createHash } from 'crypto';
import type { AIEnv, EmbedMetadata, VectorizeVector } from './types';

// Free tier model for embeddings as per spec
const EMBED_MODEL = '@cf/baai/bge-small-en-v1.5';

// Chunking parameters as per spec (500-750 chars with 50 char overlap)
const CHUNK_SIZE = 600; // Middle of the range
const CHUNK_OVERLAP = 50;

/**
 * Generate a hash of content for deduplication
 * Reference: "Single-Worker RAG Implementation.txt" - Document Deduplication
 */
export function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Chunk text into smaller pieces for embedding
 * Reference: "Single-Worker RAG Implementation.txt" - Document Processing Pipeline
 * 
 * @param text - The text to chunk
 * @param maxChunkSize - Maximum size of each chunk (default: 600)
 * @param overlap - Number of characters to overlap between chunks (default: 50)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string, 
  maxChunkSize: number = CHUNK_SIZE,
  overlap: number = CHUNK_OVERLAP
): string[] {
  if (!text || text.length === 0) {
    return [];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + maxChunkSize;
    
    // If this isn't the last chunk, try to break at a sentence or word boundary
    if (endIndex < text.length) {
      // First try to find a sentence boundary (. ! ?)
      const sentenceEnd = text.lastIndexOf('.', endIndex);
      const exclamationEnd = text.lastIndexOf('!', endIndex);
      const questionEnd = text.lastIndexOf('?', endIndex);
      
      const sentenceBoundary = Math.max(
        sentenceEnd,
        exclamationEnd,
        questionEnd
      );
      
      if (sentenceBoundary > startIndex + maxChunkSize * 0.5) {
        endIndex = sentenceBoundary + 1;
      } else {
        // Fall back to word boundary
        const wordBoundary = text.lastIndexOf(' ', endIndex);
        if (wordBoundary > startIndex + maxChunkSize * 0.5) {
          endIndex = wordBoundary;
        }
      }
    }
    
    // Extract chunk and add to array
    const chunk = text.substring(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    
    // Move start index, accounting for overlap
    startIndex = endIndex - overlap;
    
    // Ensure we don't go backwards
    if (startIndex <= chunks.length * overlap) {
      startIndex = endIndex;
    }
  }
  
  return chunks;
}

/**
 * Generate embeddings for multiple text chunks
 * Reference: "Single-Worker RAG Implementation.txt" - Embedding Generation
 * 
 * @param texts - Array of text chunks to embed
 * @param env - Worker environment with AI binding
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
  texts: string[],
  env: AIEnv
): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  try {
    // Call Workers AI with the free tier model
    const response = await env.AI.run(EMBED_MODEL, {
      text: texts,
    });

    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid embedding response from Workers AI');
    }

    return response.data;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate embeddings: ${errorMessage}`);
  }
}

/**
 * Embed and prepare vectors for storage
 * Reference: "Single-Worker RAG Implementation.txt" - Document Storage
 * 
 * @param texts - Array of texts to embed
 * @param metadata - Metadata for the document
 * @param env - Worker environment
 * @returns Array of vectors ready for Vectorize
 */
export async function embedAndPrepareVectors(
  texts: string[],
  metadata: EmbedMetadata,
  env: AIEnv
): Promise<VectorizeVector[]> {
  const allChunks: string[] = [];
  const chunkMetadata: EmbedMetadata[] = [];
  
  // Process each text and create chunks
  texts.forEach((text, textIndex) => {
    const chunks = chunkText(text);
    
    chunks.forEach((chunk, chunkIndex) => {
      const contentHash = generateContentHash(chunk);
      
      allChunks.push(chunk);
      chunkMetadata.push({
        ...metadata,
        chunkIndex,
        chunk: chunk.slice(0, 200), // Store preview
        fullChunk: chunk,
        contentHash,
        timestamp: new Date().toISOString(),
        // Add textIndex as additional metadata if needed
        ...(textIndex > 0 ? { pageNumber: textIndex + 1 } : {}),
      } as EmbedMetadata);
    });
  });

  // Generate embeddings for all chunks
  const embeddings = await generateEmbeddings(allChunks, env);
  
  // Create vectors with metadata
  const vectors: VectorizeVector[] = embeddings.map((embedding, idx) => ({
    id: `${metadata.documentId}-${Date.now()}-${idx}`,
    values: embedding,
    metadata: chunkMetadata[idx],
  }));
  
  return vectors;
}

/**
 * Check if content already exists in the vector store
 * Reference: "Single-Worker RAG Implementation.txt" - Deduplication
 * 
 * @param contentHash - Hash of the content to check
 * @param env - Worker environment
 * @returns True if content exists, false otherwise
 */
export async function checkDuplicateContent(
  contentHash: string,
  env: AIEnv
): Promise<boolean> {
  try {
    // Check if we have metadata for this content hash
    const existingDoc = await env.DOC_METADATA.get(`hash:${contentHash}`);
    return existingDoc !== null;
  } catch (error) {
    console.error('Error checking duplicate content:', error);
    return false;
  }
}

/**
 * Store content hash for deduplication
 * Reference: "Single-Worker RAG Implementation.txt" - Document Deduplication
 * 
 * @param contentHash - Hash of the content
 * @param documentId - ID of the document
 * @param env - Worker environment
 */
export async function storeContentHash(
  contentHash: string,
  documentId: string,
  env: AIEnv
): Promise<void> {
  await env.DOC_METADATA.put(
    `hash:${contentHash}`,
    documentId,
    {
      expirationTtl: 86400 * 30, // 30 days
    }
  );
}