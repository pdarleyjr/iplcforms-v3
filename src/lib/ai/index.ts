/**
 * Main entry point for AI functionality
 * Reference: "Single-Worker RAG Implementation.txt" - Module Organization
 * 
 * Exports all AI modules for use in the main worker
 */

// Export all types
export * from './types';

// Import AIEnv type for functions in this file
import type { AIEnv } from './types';

// Export embeddings functionality
export {
  chunkText,
  generateEmbedding,
  generateEmbeddings,
  hashContent
} from './embeddings';

// Export vector search functionality
export {
  searchVectors,
  getRelevantDocuments,
  getDocumentStats
} from './vectorSearch';

// Export chat engine functionality
export {
  generateRAGResponse,
  generateSummary,
  generateOutline,
  getConversationHistory,
  storeConversationHistory,
  handleChatRequest
} from './chatEngine';

// Export document storage functionality
export {
  storeDocument,
  getDocument,
  deleteDocument,
  listDocuments,
  searchDocumentsByName,
  checkDuplicateDocument,
  getStorageStats,
  cleanupOldDocuments
} from './documentStorage';

// Export rate limiting functionality
export {
  checkRateLimit,
  withRateLimit,
  applyRateLimitHeaders,
  createRateLimitResponse,
  getClientId,
  getRateLimitStatus
} from './rateLimit';

// Export AIGate functionality
export {
  AIGate,
  acquireAISlot,
  releaseAISlot,
  getAIGateStatus
} from './aiGate';

/**
 * Initialize AI system
 * Sets up necessary configurations and checks
 */
export async function initializeAI(env: AIEnv): Promise<void> {
  try {
    // Check if all required bindings are present
    if (!env.AI) {
      throw new Error('AI binding not configured');
    }
    if (!env.VECTORIZE) {
      throw new Error('VECTORIZE binding not configured');
    }
    if (!env.DOC_METADATA) {
      throw new Error('DOC_METADATA KV namespace not configured');
    }
    if (!env.CHAT_HISTORY) {
      throw new Error('CHAT_HISTORY KV namespace not configured');
    }
    if (!env.AI_GATE) {
      throw new Error('AI_GATE Durable Object not configured');
    }

    // Get AIGate status to ensure it's working
    const status = await getAIGateStatus(env);
    console.log('AI system initialized. AIGate status:', status);
  } catch (error) {
    console.error('Failed to initialize AI system:', error);
    throw error;
  }
}

/**
 * Utility function to format AI errors consistently
 */
export function formatAIError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if AI services are available
 */
export async function checkAIAvailability(env: AIEnv): Promise<{
  available: boolean;
  reason?: string;
}> {
  try {
    // Check AIGate status
    const status = await getAIGateStatus(env);
    if (!status) {
      return { available: false, reason: 'AIGate not responding' };
    }

    // Check if we can accept more requests
    if (!status.canAcceptMore && status.queueLength > 5) {
      return { available: false, reason: 'AI service is currently at capacity' };
    }

    return { available: true };
  } catch (error) {
    console.error('Error checking AI availability:', error);
    return { available: false, reason: 'Failed to check AI status' };
  }
}