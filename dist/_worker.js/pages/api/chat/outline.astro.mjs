globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as nanoid } from '../../../chunks/index.browser_BfaZFivj.mjs';
export { renderers } from '../../../renderers.mjs';

const AI_MAX_RETRIES = 3;
const AI_INITIAL_RETRY_DELAY = 1e3;
const AI_MAX_RETRY_DELAY = 16e3;
const AI_RATE_LIMIT_WINDOW = 6e4;
const AI_RATE_LIMIT_MAX_REQUESTS = 20;
const AI_MAX_CONCURRENT_REQUESTS = 2;
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }
  requests = [];
  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    this.requests.push(now);
    return true;
  }
  getTimeUntilNextRequest() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    const timeUntilOldestExpires = this.windowMs - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilOldestExpires);
  }
}
class ConcurrencyLimiter {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
  }
  activeRequests = 0;
  queue = [];
  async acquire() {
    if (this.activeRequests < this.maxConcurrent) {
      this.activeRequests++;
      return;
    }
    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }
  release() {
    this.activeRequests--;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        this.activeRequests++;
        next();
      }
    }
  }
  getActiveCount() {
    return this.activeRequests;
  }
  getQueueLength() {
    return this.queue.length;
  }
}
const aiRateLimiter = new RateLimiter(AI_RATE_LIMIT_WINDOW, AI_RATE_LIMIT_MAX_REQUESTS);
const aiConcurrencyLimiter = new ConcurrencyLimiter(AI_MAX_CONCURRENT_REQUESTS);
async function callAIWithRetry(env, model, params, maxRetries = AI_MAX_RETRIES) {
  let lastError = null;
  let retryDelay = AI_INITIAL_RETRY_DELAY;
  const activeCount = aiConcurrencyLimiter.getActiveCount();
  const queueLength = aiConcurrencyLimiter.getQueueLength();
  if (activeCount >= AI_MAX_CONCURRENT_REQUESTS && queueLength > 0) {
    console.log(`Concurrency limit reached: ${activeCount} active requests, ${queueLength} queued`);
  }
  await aiConcurrencyLimiter.acquire();
  try {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const canProceed = await aiRateLimiter.checkLimit();
        if (!canProceed) {
          const waitTime = aiRateLimiter.getTimeUntilNextRequest();
          console.log(`Rate limit reached (20 req/min), waiting ${waitTime}ms before retry`);
          if (waitTime > 3e4) {
            throw new Error("Rate limit exceeded. Free tier allows 20 requests per minute. Please wait before trying again.");
          }
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          await aiRateLimiter.checkLimit();
        }
        let response;
        if (env.AI) {
          response = await env.AI.run(model, params);
        } else {
          console.error("AI Binding Configuration Error:", {
            AI: !!env.AI,
            availableBindings: Object.keys(env).filter((key) => !key.startsWith("__"))
          });
          const bindingError = new Error("workers-ai-failed: AI service binding not configured");
          bindingError.cause = {
            code: 5016,
            message: "No AI binding available. Please ensure AI binding is configured in wrangler.toml and deployed."
          };
          throw bindingError;
        }
        return response;
      } catch (error) {
        lastError = error;
        console.error(`AI call attempt ${attempt + 1} failed:`, {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          cause: error.cause,
          stack: error.stack
        });
        const isRetryable = isRetryableError(error);
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }
        const jitter = Math.random() * 0.3 * retryDelay;
        const totalDelay = Math.min(retryDelay + jitter, AI_MAX_RETRY_DELAY);
        console.log(`Retrying AI call in ${totalDelay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
        retryDelay *= 2;
      }
    }
    throw lastError || new Error("AI call failed after all retries");
  } finally {
    aiConcurrencyLimiter.release();
  }
}
function isRetryableError(error) {
  const errorMessage = error.message?.toLowerCase() || "";
  const errorStatus = error.status || 0;
  const errorCode = error.cause?.code;
  if (errorStatus === 429 || errorStatus === 503) {
    return true;
  }
  if (errorCode === 3040) {
    return true;
  }
  if (errorMessage.includes("3040") || errorMessage.includes("capacity") || errorMessage.includes("temporarily unavailable") || errorMessage.includes("timeout") || errorMessage.includes("try again") || errorMessage.includes("service unavailable")) {
    return true;
  }
  if (errorCode === 3036 || // Account limited (quota)
  errorCode === 5016 || // Binding not allowed (config issue)
  errorCode === 3041) {
    return false;
  }
  return false;
}
function getErrorType(error) {
  const errorMessage = error.message?.toLowerCase() || "";
  const errorCode = error.cause?.code || error.status || 0;
  switch (errorCode) {
    case 3040:
      return "capacity";
    case 3036:
      return "quota";
    case 5016:
    case 3041:
      return "permission";
    case 429:
      return "rate_limit";
    case 503:
      return "unavailable";
  }
  if (errorMessage.includes("capacity") || errorMessage.includes("3040")) {
    return "capacity";
  }
  if (errorMessage.includes("rate") || errorMessage.includes("429") || errorMessage.includes("too many")) {
    return "rate_limit";
  }
  if (errorMessage.includes("quota") || errorMessage.includes("limit") || errorMessage.includes("3036")) {
    return "quota";
  }
  if (errorMessage.includes("permission") || errorMessage.includes("denied") || errorMessage.includes("unauthorized")) {
    return "permission";
  }
  if (errorMessage.includes("unavailable") || errorMessage.includes("503")) {
    return "unavailable";
  }
  if (errorMessage.includes("workers-ai-failed") || errorMessage.includes("binding not configured")) {
    return "configuration";
  }
  return "unknown";
}
function formatAIError(error) {
  const errorType = getErrorType(error);
  const errorCode = error.cause?.code || error.status || "unknown";
  let message = "AI service error";
  let details = error.message || "Unknown error";
  switch (errorType) {
    case "capacity":
      message = "AI service is at capacity. Please try again in a few moments.";
      break;
    case "rate_limit":
      message = "Rate limit exceeded. Please wait a moment before trying again.";
      break;
    case "quota":
      message = "Daily quota limit reached. Please try again tomorrow.";
      break;
    case "permission":
      message = "AI service access denied. Please check your account permissions.";
      break;
    case "unavailable":
      message = "AI service is temporarily unavailable";
      break;
    case "configuration":
      message = "AI service is not properly configured. Please contact support.";
      break;
    default:
      message = "AI service error occurred";
  }
  details = `Error code: ${errorCode} - ${details}`;
  return { message, details };
}

const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { conversationId, documentIds } = body;
    if (!conversationId || !documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allChunks = [];
    for (const docId of documentIds) {
      const docMetadata = await env.CHAT_HISTORY.get(`doc:${docId}`);
      if (docMetadata) {
        const doc = JSON.parse(docMetadata);
        for (let i = 0; i < doc.chunks; i++) {
          const chunkData = await env.CHAT_HISTORY.get(`chunk:${docId}-${i}`);
          if (chunkData) {
            const chunk = JSON.parse(chunkData);
            allChunks.push(chunk.text);
          }
        }
      }
    }
    if (allChunks.length === 0) {
      return new Response(JSON.stringify({ error: "No document content found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const context = allChunks.slice(0, 10).join("\n\n");
    const prompt = `You are an expert at analyzing documents and creating comprehensive outlines.

Document Content:
${context}

Please create a detailed outline of the key topics, main ideas, and important concepts from these documents. Format it as:

1. Main Topic
   - Key point
   - Supporting detail
2. Another Main Topic
   - Key point
   - etc.

Also include a brief executive summary at the beginning.`;
    let aiResponse;
    try {
      aiResponse = await callAIWithRetry(
        env,
        "@cf/meta/llama-2-7b-chat-int8",
        {
          messages: [
            {
              role: "system",
              content: "You are an expert document analyzer. Create clear, hierarchical outlines that capture the essence of documents."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1500
        }
      );
    } catch (aiError) {
      console.error("AI service error:", aiError);
      const { message, details } = formatAIError(aiError);
      throw new Error(`${message} - ${details}`);
    }
    const outlineId = nanoid();
    const outline = {
      id: outlineId,
      conversationId,
      documentIds,
      content: aiResponse.response,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CHAT_HISTORY.put(
      `outline:${outlineId}`,
      JSON.stringify(outline)
    );
    await env.CHAT_HISTORY.put(
      `conv:${conversationId}:outline`,
      outlineId
    );
    return new Response(JSON.stringify({
      success: true,
      outline
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Outline generation error:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate outline",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.searchParams.get("conversationId");
  if (!conversationId) {
    return new Response(JSON.stringify({ error: "Missing conversationId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const outlineId = await env.CHAT_HISTORY.get(`conv:${conversationId}:outline`);
    if (!outlineId) {
      return new Response(JSON.stringify({ error: "No outline found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const outlineData = await env.CHAT_HISTORY.get(`outline:${outlineId}`);
    if (!outlineData) {
      return new Response(JSON.stringify({ error: "Outline data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(outlineData, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Outline retrieval error:", error);
    return new Response(JSON.stringify({
      error: "Failed to retrieve outline",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=outline.astro.mjs.map
