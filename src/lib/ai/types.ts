/**
 * Type definitions for the single-worker RAG implementation
 * Reference: "Single-Worker RAG Implementation.txt" - Common Type Definitions
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface EmbedResponse {
  success: boolean;
  vectorIds?: string[];
  error?: string;
}

export interface QueryResult {
  id: string;
  score: number;
  metadata: {
    chunk: string;
    fullChunk?: string;
    documentId?: string;
    documentName?: string;
    pageNumber?: number;
    timestamp?: string;
    [key: string]: any;
  };
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  chunksCount: number;
  metadata?: Record<string, any>;
  vectorIds?: string[];
}

export interface VectorizeVector {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
}

export interface VectorizeMatch {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface EmbedMetadata {
  documentId: string;
  documentName: string;
  documentType: string;
  pageNumber?: number;
  chunkIndex?: number;
  timestamp?: string;
  contentHash?: string;
  chunk?: string;
  fullChunk?: string;
}

export interface RAGOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  model?: string;
  topK?: number;
}

export interface ConversationHistory {
  messages: ChatMessage[];
  lastUpdated: string;
  sessionId: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
  limit?: number;
}

// Worker environment interface
export interface AIEnv {
  AI: any;
  DOC_INDEX: VectorizeIndex;
  DOC_METADATA: KVNamespace;
  CHAT_HISTORY: KVNamespace;
  AI_GATE: DurableObjectNamespace;
}

// Vectorize index interface (minimal definition for free tier)
export interface VectorizeIndex {
  upsert(vectors: VectorizeVector[]): Promise<VectorizeVectorMutation>;
  query(vector: number[], options?: { topK?: number }): Promise<VectorizeMatch[]>;
}

export interface VectorizeVectorMutation {
  mutationId: string;
  vectorIds: string[];
}