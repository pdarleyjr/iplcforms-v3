/**
 * Vector search module for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Module: vectorSearch.ts
 * 
 * Handles querying the Vectorize index and retrieving relevant documents
 */

import type { AIEnv, QueryResult, VectorizeMatch } from './types';
import { generateEmbeddings } from './embeddings';

// Default number of results to return
const DEFAULT_TOP_K = 10;

// Minimum score threshold for relevance
const MIN_RELEVANCE_SCORE = 0.7;

/**
 * Query documents using vector similarity search
 * Reference: "Single-Worker RAG Implementation.txt" - Vector Search
 * 
 * @param query - The search query text
 * @param limit - Maximum number of results to return (default: 10)
 * @param env - Worker environment with AI and Vectorize bindings
 * @returns Array of query results with scores and metadata
 */
export async function queryDocuments(
  query: string,
  limit: number = DEFAULT_TOP_K,
  env: AIEnv
): Promise<QueryResult[]> {
  if (!query || query.trim().length === 0) {
    console.warn('Empty query provided to queryDocuments');
    return [];
  }

  try {
    // Generate embedding for the query using the same model as documents
    const queryEmbeddings = await generateEmbeddings([query], env);
    
    if (!queryEmbeddings || queryEmbeddings.length === 0) {
      console.error('Failed to generate query embedding');
      return [];
    }

    // Query the Vectorize index
    const vectorizeResponse = await env.VECTORIZE.query(queryEmbeddings[0], {
      topK: limit,
    });

    // Defensive check for Vectorize response
    if (!vectorizeResponse) {
      console.warn('Null response from Vectorize');
      return [];
    }

    // Handle both matches array and matches property formats
    const matches = Array.isArray(vectorizeResponse)
      ? vectorizeResponse
      : (vectorizeResponse.matches || []);

    if (!Array.isArray(matches) || matches.length === 0) {
      console.warn('No matches returned from Vectorize');
      return [];
    }

    // Filter and map results with defensive checks
    const results: QueryResult[] = matches
      .filter((match: VectorizeMatch) => {
        // Defensive check for match object
        if (!match || typeof match.score !== 'number') {
          console.warn('Invalid match object:', match);
          return false;
        }
        return match.score >= MIN_RELEVANCE_SCORE;
      })
      .map((match: VectorizeMatch) => ({
        id: match.id ?? '',
        score: match.score ?? 0,
        metadata: match.metadata || {},
      }));

    console.log(`Vectorize query returned ${results.length} results above threshold`);
    return results;
  } catch (error) {
    console.error('Error querying documents:', error);
    // Return empty array instead of throwing to allow graceful degradation
    return [];
  }
}

/**
 * Get document context for RAG by querying relevant chunks
 * Reference: "Single-Worker RAG Implementation.txt" - Context Retrieval
 * 
 * @param query - The user's question or query
 * @param topK - Number of top results to include in context (default: 4)
 * @param env - Worker environment
 * @returns Formatted context string from relevant documents
 */
export async function getDocumentContext(
  query: string,
  topK: number = 4,
  env: AIEnv
): Promise<string> {
  try {
    // Query for relevant documents
    const results = await queryDocuments(query, topK, env);
    
    if (!results || results.length === 0) {
      console.log('No relevant documents found for query:', query);
      // Return a stub context to ensure AI has something to work with
      return '(No relevant context found in documents)';
    }

    // Sort by score (highest first) and extract context
    const contextChunks = results
      .sort((a, b) => b.score - a.score)
      .map(result => {
        // Defensive string extraction with fallbacks
        const chunk = String(result.metadata?.fullChunk ?? result.metadata?.chunk ?? '').trim();
        const source = String(result.metadata?.documentName ?? 'Unknown Document');
        const page = result.metadata?.pageNumber;
        
        // Skip empty chunks
        if (!chunk) {
          console.warn('Empty chunk in result:', result.id);
          return '';
        }
        
        // Format each chunk with source information
        let formattedChunk = chunk;
        if (source) {
          formattedChunk = `[Source: ${source}${page ? `, page ${page}` : ''}]\n${chunk}`;
        }
        
        return formattedChunk;
      })
      .filter(chunk => chunk.length > 0);

    // If all chunks were empty after filtering, return stub
    if (contextChunks.length === 0) {
      console.warn('All context chunks were empty after filtering');
      return '(No relevant context found in documents)';
    }

    // Join chunks with clear separation
    return contextChunks.join('\n\n---\n\n');
  } catch (error) {
    console.error('Error getting document context:', error);
    // Return stub context on error to allow graceful degradation
    return '(Error retrieving document context)';
  }
}

/**
 * Search for similar documents based on a reference document
 * Reference: "Single-Worker RAG Implementation.txt" - Free Tier Constraints
 * 
 * @param documentId - ID of the reference document
 * @param limit - Maximum number of similar documents to return
 * @param env - Worker environment
 * @returns Array of similar documents
 */
export async function findSimilarDocuments(
  documentId: string,
  limit: number = 5,
  env: AIEnv
): Promise<QueryResult[]> {
  try {
    // Get the document metadata
    const docMetadata = await env.DOC_METADATA.get(documentId, 'json') as any;
    if (!docMetadata) {
      throw new Error('Document not found');
    }

    // Get a representative chunk from the document
    const vectorIds = docMetadata.vectorIds || [];
    if (vectorIds.length === 0) {
      return [];
    }

    // Query using the first chunk's content as the query
    // Note: In a full implementation, we might average embeddings or use a different strategy
    const firstVectorId = vectorIds[0];
    const results = await queryDocuments(
      docMetadata.name || documentId,
      limit + 1, // Get one extra to filter out self
      env
    );

    // Filter out the source document itself
    return results.filter(result => !result.id.startsWith(documentId));
  } catch (error) {
    console.error('Error finding similar documents:', error);
    return [];
  }
}

/**
 * Get document statistics for monitoring
 * Reference: "Single-Worker RAG Implementation.txt" - Production Monitoring
 * 
 * @param env - Worker environment
 * @returns Statistics about stored documents and vectors
 */
export async function getDocumentStats(env: AIEnv): Promise<{
  totalDocuments: number;
  totalVectors: number;
  oldestDocument?: string;
  newestDocument?: string;
}> {
  try {
    // List all documents from metadata
    const documents = await env.DOC_METADATA.list();
    let totalVectors = 0;
    let oldestDate: Date | null = null;
    let newestDate: Date | null = null;
    let oldestDoc = '';
    let newestDoc = '';

    // Process each document
    for (const key of documents.keys) {
      if (key.name.startsWith('hash:')) {
        continue; // Skip hash entries
      }

      const metadata = await env.DOC_METADATA.get(key.name, 'json') as any;
      if (metadata) {
        totalVectors += metadata.chunksCount || 0;
        
        const uploadDate = new Date(metadata.uploadedAt);
        if (!oldestDate || uploadDate < oldestDate) {
          oldestDate = uploadDate;
          oldestDoc = metadata.name || key.name;
        }
        if (!newestDate || uploadDate > newestDate) {
          newestDate = uploadDate;
          newestDoc = metadata.name || key.name;
        }
      }
    }

    return {
      totalDocuments: documents.keys.filter(k => !k.name.startsWith('hash:')).length,
      totalVectors,
      oldestDocument: oldestDoc || undefined,
      newestDocument: newestDoc || undefined,
    };
  } catch (error) {
    console.error('Error getting document stats:', error);
    return {
      totalDocuments: 0,
      totalVectors: 0,
    };
  }
}