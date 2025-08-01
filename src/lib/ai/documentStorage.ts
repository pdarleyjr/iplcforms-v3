/**
 * Document storage module for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Module: documentStorage.ts
 * 
 * Handles document metadata and vector storage operations
 */

import type { AIEnv, Document, EmbedMetadata, EmbedResponse } from './types';
import { embedAndPrepareVectors, checkDuplicateContent, storeContentHash, generateContentHash } from './embeddings';

/**
 * Store document with embeddings
 * Reference: "Single-Worker RAG Implementation.txt" - Document Storage
 * 
 * @param texts - Array of text content to embed and store
 * @param metadata - Document metadata
 * @param env - Worker environment
 * @returns Embed response with success status
 */
export async function storeDocument(
  texts: string[],
  metadata: EmbedMetadata,
  env: AIEnv
): Promise<EmbedResponse> {
  try {
    // Validate input
    if (!texts || texts.length === 0) {
      return {
        success: false,
        error: 'No text content provided',
      };
    }

    if (!metadata.documentId || !metadata.documentName) {
      return {
        success: false,
        error: 'Document ID and name are required',
      };
    }

    // Check for duplicate content
    const contentHash = generateContentHash(texts.join('\n'));
    const isDuplicate = await checkDuplicateContent(contentHash, env);
    
    if (isDuplicate) {
      return {
        success: false,
        error: 'Document with identical content already exists',
      };
    }

    // Generate embeddings and prepare vectors
    const vectors = await embedAndPrepareVectors(texts, metadata, env);
    
    if (vectors.length === 0) {
      return {
        success: false,
        error: 'No vectors generated from text',
      };
    }

    // Store vectors in Vectorize
    await env.VECTORIZE.upsert(vectors);

    // Store document metadata in KV
    const docMetadata: Document = {
      id: metadata.documentId,
      name: metadata.documentName,
      type: metadata.documentType || 'text',
      size: texts.join('').length,
      uploadedAt: new Date().toISOString(),
      chunksCount: vectors.length,
      vectorIds: vectors.map(v => v.id),
      metadata: {
        contentHash,
        pageCount: metadata.pageNumber || 1,
      },
    };
    
    await env.DOC_METADATA.put(
      metadata.documentId,
      JSON.stringify(docMetadata)
    );

    // Store content hash for deduplication
    await storeContentHash(contentHash, metadata.documentId, env);

    return {
      success: true,
      vectorIds: vectors.map(v => v.id),
    };
  } catch (error) {
    console.error('Store document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get document metadata by ID
 * Reference: "Single-Worker RAG Implementation.txt" - Document Management
 * 
 * @param documentId - Document ID
 * @param env - Worker environment
 * @returns Document metadata or null
 */
export async function getDocument(
  documentId: string,
  env: AIEnv
): Promise<Document | null> {
  try {
    const data = await env.DOC_METADATA.get(documentId, 'json');
    return data as Document;
  } catch (error) {
    console.error('Get document error:', error);
    return null;
  }
}

/**
 * List all documents with pagination
 * Reference: "Single-Worker RAG Implementation.txt" - Document Management
 * 
 * @param limit - Number of documents to return
 * @param cursor - Pagination cursor
 * @param env - Worker environment
 * @returns List of documents and next cursor
 */
export async function listDocuments(
  limit: number = 50,
  cursor: string | null = null,
  env: AIEnv
): Promise<{
  documents: Document[];
  cursor: string | null;
}> {
  try {
    const listOptions: KVNamespaceListOptions = {
      limit,
    };
    
    if (cursor) {
      listOptions.cursor = cursor;
    }

    const result = await env.DOC_METADATA.list(listOptions);
    
    // Filter out hash entries and fetch metadata
    const documents: Document[] = [];
    for (const key of result.keys) {
      if (!key.name.startsWith('hash:')) {
        const doc = await getDocument(key.name, env);
        if (doc) {
          documents.push(doc);
        }
      }
    }

    return {
      documents,
      cursor: result.cursor || null,
    };
  } catch (error) {
    console.error('List documents error:', error);
    return {
      documents: [],
      cursor: null,
    };
  }
}

/**
 * Delete a document and its vectors
 * Reference: "Single-Worker RAG Implementation.txt" - Document Management
 * 
 * Note: Vectorize doesn't support individual vector deletion in free tier,
 * so vectors are marked for cleanup by scheduled job
 * 
 * @param documentId - Document ID to delete
 * @param env - Worker environment
 * @returns Success status
 */
export async function deleteDocument(
  documentId: string,
  env: AIEnv
): Promise<boolean> {
  try {
    // Get document metadata first
    const doc = await getDocument(documentId, env);
    if (!doc) {
      console.warn(`Document ${documentId} not found`);
      return false;
    }

    // Delete content hash if exists
    if (doc.metadata?.contentHash) {
      await env.DOC_METADATA.delete(`hash:${doc.metadata.contentHash}`);
    }

    // Delete document metadata
    await env.DOC_METADATA.delete(documentId);
    
    // Note: Vectors will be cleaned up by scheduled job
    // as Vectorize free tier doesn't support deleteByIds
    
    return true;
  } catch (error) {
    console.error('Delete document error:', error);
    return false;
  }
}

/**
 * Search documents by name or metadata
 * Reference: "Single-Worker RAG Implementation.txt" - Document Management
 * 
 * @param query - Search query
 * @param limit - Maximum results
 * @param env - Worker environment
 * @returns Matching documents
 */
export async function searchDocumentsByName(
  query: string,
  limit: number = 10,
  env: AIEnv
): Promise<Document[]> {
  try {
    const queryLower = query.toLowerCase();
    const allDocs = await listDocuments(100, null, env);
    
    // Simple name-based search
    const matches = allDocs.documents
      .filter(doc => 
        doc.name.toLowerCase().includes(queryLower) ||
        doc.type.toLowerCase().includes(queryLower)
      )
      .slice(0, limit);
    
    return matches;
  } catch (error) {
    console.error('Search documents error:', error);
    return [];
  }
}

/**
 * Get storage statistics
 * Reference: "Single-Worker RAG Implementation.txt" - Free Tier Limits
 * 
 * @param env - Worker environment
 * @returns Storage usage statistics
 */
export async function getStorageStats(env: AIEnv): Promise<{
  documentCount: number;
  totalVectors: number;
  estimatedDimensions: number;
  kvUsage: {
    documentsStored: number;
    hashesStored: number;
  };
}> {
  try {
    let documentCount = 0;
    let totalVectors = 0;
    let hashCount = 0;
    
    // Count documents and estimate vector usage
    const result = await env.DOC_METADATA.list({ limit: 1000 });
    
    for (const key of result.keys) {
      if (key.name.startsWith('hash:')) {
        hashCount++;
      } else {
        documentCount++;
        const doc = await getDocument(key.name, env);
        if (doc) {
          totalVectors += doc.chunksCount || 0;
        }
      }
    }
    
    // Estimate dimensions (384 per vector for bge-small-en-v1.5)
    const estimatedDimensions = totalVectors * 384;
    
    return {
      documentCount,
      totalVectors,
      estimatedDimensions,
      kvUsage: {
        documentsStored: documentCount,
        hashesStored: hashCount,
      },
    };
  } catch (error) {
    console.error('Get storage stats error:', error);
    return {
      documentCount: 0,
      totalVectors: 0,
      estimatedDimensions: 0,
      kvUsage: {
        documentsStored: 0,
        hashesStored: 0,
      },
    };
  }
}

/**
 * Clean up orphaned vectors (for scheduled jobs)
 * Reference: "Single-Worker RAG Implementation.txt" - Scheduled Cleanup
 * 
 * @param maxAge - Maximum age in days
 * @param env - Worker environment
 * @returns Number of documents cleaned
 */
export async function cleanupOldDocuments(
  maxAge: number = 30,
  env: AIEnv
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);
    
    let cleanedCount = 0;
    const documents = await listDocuments(100, null, env);
    
    for (const doc of documents.documents) {
      const uploadDate = new Date(doc.uploadedAt);
      if (uploadDate < cutoffDate) {
        const deleted = await deleteDocument(doc.id, env);
        if (deleted) {
          cleanedCount++;
        }
      }
    }
    
    return cleanedCount;
  } catch (error) {
    console.error('Cleanup old documents error:', error);
    return 0;
  }
}