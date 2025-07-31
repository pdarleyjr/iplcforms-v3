// AI service retry utilities for Cloudflare Workers AI
// Handles exponential backoff, rate limiting, and error categorization

// AI service configuration
export const AI_MAX_RETRIES = 3;
export const AI_INITIAL_RETRY_DELAY = 1000; // 1 second
export const AI_MAX_RETRY_DELAY = 16000; // 16 seconds
export const AI_RATE_LIMIT_WINDOW = 60000; // 1 minute window
export const AI_RATE_LIMIT_MAX_REQUESTS = 300; // 300 requests per minute

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

// Shared rate limiter instance
export const aiRateLimiter = new RateLimiter(AI_RATE_LIMIT_WINDOW, AI_RATE_LIMIT_MAX_REQUESTS);

// Exponential retry wrapper for AI calls
export async function callAIWithRetry(
  env: any,
  model: string,
  params: any,
  maxRetries: number = AI_MAX_RETRIES
): Promise<any> {
  let lastError: Error | null = null;
  let retryDelay = AI_INITIAL_RETRY_DELAY;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check rate limit
      const canProceed = await aiRateLimiter.checkLimit();
      if (!canProceed) {
        const waitTime = aiRateLimiter.getTimeUntilNextRequest();
        console.log(`Rate limit reached, waiting ${waitTime}ms before retry`);
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
        throw new Error('No AI service available');
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
}

// Check if error is retryable
export function isRetryableError(error: any): boolean {
  // Check for specific error codes and messages
  const errorMessage = error.message?.toLowerCase() || '';
  const errorStatus = error.status || 0;
  
  // Retryable conditions:
  // - 429 (Rate limit)
  // - 503 (Service unavailable)
  // - Capacity errors (3040)
  // - Temporary unavailability messages
  if (errorStatus === 429 || errorStatus === 503) {
    return true;
  }
  
  if (errorMessage.includes('3040') || 
      errorMessage.includes('capacity') ||
      errorMessage.includes('temporarily unavailable') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('try again')) {
    return true;
  }
  
  // Check for Cloudflare-specific error codes
  if (error.cause?.code === 3040 || // Capacity
      error.cause?.code === 3036 || // Account limited
      error.cause?.code === 5016 || // Binding not allowed
      error.cause?.code === 3041) { // Model not allowed
    // Only retry capacity errors
    return error.cause?.code === 3040;
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
    default:
      message = 'AI service error occurred';
  }
  
  // Add error code to details
  details = `Error code: ${errorCode} - ${details}`;
  
  return { message, details };
}