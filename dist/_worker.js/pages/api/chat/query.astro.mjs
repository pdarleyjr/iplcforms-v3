globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as nanoid } from '../../../chunks/index.browser_BfaZFivj.mjs';
import { c as checkRateLimit } from '../../../chunks/rateLimit_B8vzP1Fn.mjs';
export { renderers } from '../../../renderers.mjs';

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
    const { message, conversationId, documentIds } = body;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const convId = conversationId || nanoid();
    const clientId = request.headers.get("CF-Connecting-IP") || "anonymous";
    const rateLimitInfo = await checkRateLimit(clientId, env);
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter: rateLimitInfo.retryAfter || 60
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
          "X-RateLimit-Reset": rateLimitInfo.resetAt.toString()
        }
      });
    }
    const userMessageId = `${convId}:${nanoid()}`;
    const userMessageData = {
      id: userMessageId,
      conversationId: convId,
      role: "user",
      content: message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CHAT_HISTORY.put(
      `msg:${userMessageId}`,
      JSON.stringify(userMessageData)
    );
    await env.CHAT_HISTORY.put(
      `conv:${convId}`,
      JSON.stringify({
        id: convId,
        title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        lastMessage: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    );
    const history = [];
    const historyKeys = await env.CHAT_HISTORY.list({
      prefix: `msg:${convId}:`,
      limit: 10
    });
    for (const key of historyKeys.keys) {
      const msgData = await env.CHAT_HISTORY.get(key.name);
      if (msgData) {
        const msg = JSON.parse(msgData);
        history.push({
          role: msg.role,
          content: msg.content
        });
      }
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
        question: message,
        history,
        sessionId: convId,
        documentIds
      })
    });
    if (!ragResponse.ok) {
      const error = await ragResponse.text();
      console.error("IPLC_AI service error:", error);
      return new Response(JSON.stringify({
        error: "AI service error",
        details: error
      }), {
        status: ragResponse.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    const assistantMessageId = `${convId}:${nanoid()}`;
    const responseClone = ragResponse.clone();
    const responseText = await responseClone.text();
    let assistantContent = responseText;
    if (responseText.includes("data: ")) {
      const lines = responseText.split("\n");
      assistantContent = lines.filter((line) => line.startsWith("data: ")).map((line) => line.substring(6)).filter((data) => data !== "[DONE]").join("");
    }
    const assistantMessageData = {
      id: assistantMessageId,
      conversationId: convId,
      role: "assistant",
      content: assistantContent,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CHAT_HISTORY.put(
      `msg:${assistantMessageId}`,
      JSON.stringify(assistantMessageData)
    );
    return new Response(ragResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "Transfer-Encoding": "chunked",
        "X-RateLimit-Limit": "60",
        "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
        "X-RateLimit-Reset": rateLimitInfo.resetAt.toString()
      }
    });
  } catch (error) {
    console.error("Query error:", error instanceof Error ? error.message : "Unknown error");
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    return new Response(JSON.stringify({
      error: "Failed to process query",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=query.astro.mjs.map
