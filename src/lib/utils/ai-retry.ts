// AI service retry utilities for Cloudflare Workers AI
// Handles exponential backoff, rate limiting, and error categorization

// AI service configuration
export const AI_MAX_RETRIES = 3;
export const AI_INITIAL_RETRY_DELAY = 1000; // 1 second
export const AI_MAX_RETRY_DELAY = 16000; // 16 seconds
export const AI_RATE_LIMIT_WINDOW = 60000; // 1 minute window
export const AI_RATE_LIMIT_MAX_REQUESTS = 20; // Free tier: 20 requests per minute
export const AI_MAX_CONCURRENT_REQUESTS = 2; // Free tier: 2 concurrent GPU jobs

// Rate limiter for AI requests
export class RateLimiter {
  private requests: number[] = [];
  
  constructor(private windowMs: number, private maxRequests: number) {}
  
  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    // Remove requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = this.requests[0];
    const timeUntilOldestExpires = this.windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilOldestExpires);
  }
}

// Concurrent request tracking
export class ConcurrencyLimiter {
  private activeRequests = 0;
  private queue: Array<() => void> = [];
  
  constructor(private maxConcurrent: number) {}
  
  async acquire(): Promise<void> {
    if (this.activeRequests < this.maxConcurrent) {
      this.activeRequests++;
      return;
    }
    
    // Wait in queue
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }
  
  release(): void {
    this.activeRequests--;
    
    // Process next in queue if any
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        this.activeRequests++;
        next();
      }
    }
  }
  
  getActiveCount(): number {
    return this.activeRequests;
  }
  
  getQueueLength(): number {
    return this.queue.length;
  }
}

// Shared rate limiter instance
export const aiRateLimiter = new RateLimiter(AI_RATE_LIMIT_WINDOW, AI_RATE_LIMIT_MAX_REQUESTS);

// Shared concurrency limiter instance
export const aiConcurrencyLimiter = new ConcurrencyLimiter(AI_MAX_CONCURRENT_REQUESTS);

// Exponential retry wrapper for AI calls
export async function callAIWithRetry(
  env: any,
  model: string,
  params: any,
  maxRetries: number = AI_MAX_RETRIES
): Promise<any> {
  let lastError: Error | null = null;
  let retryDelay = AI_INITIAL_RETRY_DELAY;
  
  // Check if we're at concurrency limit
  const activeCount = aiConcurrencyLimiter.getActiveCount();
  const queueLength = aiConcurrencyLimiter.getQueueLength();
  
  if (activeCount >= AI_MAX_CONCURRENT_REQUESTS && queueLength > 0) {
    console.log(`Concurrency limit reached: ${activeCount} active requests, ${queueLength} queued`);
  }
  
  // Acquire concurrency slot
  await aiConcurrencyLimiter.acquire();
  
  try {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Check rate limit
        const canProceed = await aiRateLimiter.checkLimit();
        if (!canProceed) {
          const waitTime = aiRateLimiter.getTimeUntilNextRequest();
          console.log(`Rate limit reached (20 req/min), waiting ${waitTime}ms before retry`);
          
          // If we're hitting rate limits, it might be due to free tier restrictions
          if (waitTime > 30000) {
            throw new Error('Rate limit exceeded. Free tier allows 20 requests per minute. Please wait before trying again.');
          }
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Recheck after waiting
          await aiRateLimiter.checkLimit();
        }
      
      // Make the AI call
      // Since native AI binding doesn't exist in production, use AI_WORKER
      let response;
      
      if (env.AI_WORKER) {
        // Use AI_WORKER service (this is what's configured in production)
        const aiRequest = new Request('https://ai-worker/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: params.messages,
            stream: params.stream || false,
            max_tokens: params.max_tokens || 1024,
            temperature: params.temperature || 0.7,
            // For embeddings
            text: params.text
          })
        });
        
        const aiResponse = await env.AI_WORKER.fetch(aiRequest);
        
        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          throw new Error(`AI service error: ${aiResponse.status} - ${errorText}`);
        }
        
        // Return the response as-is for streaming or parse JSON for non-streaming
        if (params.stream) {
          response = aiResponse;
        } else {
          response = await aiResponse.json();
        }
      } else if (env.AI) {
        // Fallback to native AI binding if available (development)
        response = await env.AI.run(model, params);
      } else {
        // More detailed error for missing AI binding
        console.error('AI Binding Configuration Error:', {
          AI_WORKER: !!env.AI_WORKER,
          AI: !!env.AI,
          availableBindings: Object.keys(env).filter(key => !key.startsWith('__'))
        });
        
        const bindingError = new Error('workers-ai-failed: AI service binding not configured');
        bindingError.cause = {
          code: 5016,
          message: 'No AI binding available. Please ensure AI binding is configured in wrangler.toml and deployed.'
        };
        throw bindingError;
      }
      
      // Success! Return the response
      return response;
      
    } catch (error: any) {
      lastError = error;
      
      // Log detailed error information
      console.error(`AI call attempt ${attempt + 1} failed:`, {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        cause: error.cause,
        stack: error.stack
      });
      
      // Check if it's a retryable error
      const isRetryable = isRetryableError(error);
      
      if (!isRetryable || attempt === maxRetries) {
        // Not retryable or out of retries
        throw error;
      }
      
      // Calculate retry delay with exponential backoff and jitter
      const jitter = Math.random() * 0.3 * retryDelay; // 30% jitter
      const totalDelay = Math.min(retryDelay + jitter, AI_MAX_RETRY_DELAY);
      
      console.log(`Retrying AI call in ${totalDelay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
      
      // Double the delay for next attempt
      retryDelay *= 2;
    }
  }
  
    // Should never reach here, but just in case
    throw lastError || new Error('AI call failed after all retries');
  } finally {
    // Always release concurrency slot
    aiConcurrencyLimiter.release();
  }
}

// Check if error is retryable
export function isRetryableError(error: any): boolean {
  // Check for specific error codes and messages
  const errorMessage = error.message?.toLowerCase() || '';
  const errorStatus = error.status || 0;
  const errorCode = error.cause?.code;
  
  // Retryable conditions:
  // - 429 (Rate limit)
  // - 503 (Service unavailable)
  // - 3040 (Capacity exceeded)
  // - Temporary unavailability messages
  
  // Check HTTP status codes
  if (errorStatus === 429 || errorStatus === 503) {
    return true;
  }
  
  // Check for capacity error code 3040
  if (errorCode === 3040) {
    return true;
  }
  
  // Check error messages for retryable patterns
  if (errorMessage.includes('3040') ||
      errorMessage.includes('capacity') ||
      errorMessage.includes('temporarily unavailable') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('try again') ||
      errorMessage.includes('service unavailable')) {
    return true;
  }
  
  // Non-retryable error codes
  if (errorCode === 3036 || // Account limited (quota)
      errorCode === 5016 || // Binding not allowed (config issue)
      errorCode === 3041) { // Model not allowed (permission)
    return false;
  }
  
  return false;
}

// Get error type for better error messages
export function getErrorType(error: any): string {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.cause?.code || error.status || 0;
  
  // Check error codes first
  switch (errorCode) {
    case 3040:
      return 'capacity';
    case 3036:
      return 'quota';
    case 5016:
    case 3041:
      return 'permission';
    case 429:
      return 'rate_limit';
    case 503:
      return 'unavailable';
  }
  
  // Check error messages
  if (errorMessage.includes('capacity') || errorMessage.includes('3040')) {
    return 'capacity';
  }
  
  if (errorMessage.includes('rate') || errorMessage.includes('429') || errorMessage.includes('too many')) {
    return 'rate_limit';
  }
  
  if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('3036')) {
    return 'quota';
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('denied') || errorMessage.includes('unauthorized')) {
    return 'permission';
  }
  
  if (errorMessage.includes('unavailable') || errorMessage.includes('503')) {
    return 'unavailable';
  }
  
  if (errorMessage.includes('workers-ai-failed') || errorMessage.includes('binding not configured')) {
    return 'configuration';
  }
  
  return 'unknown';
}

// Format AI error for user-friendly messages
export function formatAIError(error: any): { message: string; details: string } {
  const errorType = getErrorType(error);
  const errorCode = error.cause?.code || error.status || 'unknown';
  let message = 'AI service error';
  let details = error.message || 'Unknown error';
  
  switch (errorType) {
    case 'capacity':
      message = 'AI service is at capacity. Please try again in a few moments.';
      break;
    case 'rate_limit':
      message = 'Rate limit exceeded. Please wait a moment before trying again.';
      break;
    case 'quota':
      message = 'Daily quota limit reached. Please try again tomorrow.';
      break;
    case 'permission':
      message = 'AI service access denied. Please check your account permissions.';
      break;
    case 'unavailable':
      message = 'AI service is temporarily unavailable';
      break;
    case 'configuration':
      message = 'AI service is not properly configured. Please contact support.';
      break;
    default:
      message = 'AI service error occurred';
  }
  
  // Add error code to details
  details = `Error code: ${errorCode} - ${details}`;
  
  return { message, details };
}