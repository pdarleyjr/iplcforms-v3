globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkRateLimit } from '../../chunks/rateLimit_B8vzP1Fn.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

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
    const question = String(body.question ?? "").trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const conversationId = body.conversationId ?? void 0;
    const options = body.options ?? {};
    if (!question) {
      return new Response(JSON.stringify({ error: "No question provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const clientId = request.headers.get("CF-Connecting-IP") || "anonymous";
    const rateLimitInfo = await checkRateLimit(clientId, env);
    if (!rateLimitInfo) {
      console.error("Rate limit info is undefined");
      return new Response(JSON.stringify({ error: "Rate limit check failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter: rateLimitInfo.retryAfter || 60
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": (rateLimitInfo.remaining || 0).toString(),
          "X-RateLimit-Reset": Math.floor((rateLimitInfo.resetAt || Date.now()) / 1e3).toString()
        }
      });
    }
    const sanitizedHistory = [];
    for (const msg of history) {
      if (!msg || typeof msg !== "object") continue;
      const role = String(msg.role ?? "").trim();
      const content = String(msg.content ?? "").trim();
      if (!role || !content) {
        console.warn("Skipping invalid message:", msg);
        continue;
      }
      if (!["user", "assistant", "system"].includes(role)) {
        console.warn("Skipping message with invalid role:", role);
        continue;
      }
      sanitizedHistory.push({ role, content });
    }
    const iplcAI = env.IPLC_AI;
    if (!iplcAI || typeof iplcAI.fetch !== "function") {
      return new Response(JSON.stringify({
        error: "AI service not available",
        details: "IPLC_AI service binding is not configured"
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ragResponse = await iplcAI.fetch("https://iplc-ai.worker/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        history: sanitizedHistory,
        sessionId: conversationId,
        options: {
          maxTokens: Math.min(Number(options.maxTokens) || 1e3, 2048),
          temperature: Math.min(Math.max(Number(options.temperature) || 0.7, 0), 1),
          topK: Math.min(Number(options.topK) || 5, 10)
        }
      })
    });
    if (!ragResponse.ok) {
      const error = await ragResponse.text();
      console.error("IPLC_AI service error:", error);
      const errorStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const errorEvent = `event: error
data: ${JSON.stringify({
            error: "AI service error",
            details: error
          })}

`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.close();
        }
      });
      return new Response(errorStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    }
    const responseHeaders = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      "Transfer-Encoding": "chunked",
      "X-RateLimit-Limit": "60"
    };
    if (rateLimitInfo && typeof rateLimitInfo.remaining !== "undefined") {
      responseHeaders["X-RateLimit-Remaining"] = String(rateLimitInfo.remaining);
    }
    if (rateLimitInfo && typeof rateLimitInfo.resetAt !== "undefined") {
      responseHeaders["X-RateLimit-Reset"] = String(Math.floor(rateLimitInfo.resetAt / 1e3));
    }
    return new Response(ragResponse.body, {
      headers: responseHeaders
    });
  } catch (error) {
    console.error("Chat error:", error);
    console.error("Error type:", typeof error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const errorEvent = `event: error
data: ${JSON.stringify({
          error: "Failed to process chat request",
          details: error instanceof Error ? error.message : "Unknown error"
        })}

`;
        controller.enqueue(encoder.encode(errorEvent));
        controller.close();
      }
    });
    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=chat.astro.mjs.map
