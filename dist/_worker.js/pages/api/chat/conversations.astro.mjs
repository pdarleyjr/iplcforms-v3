globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as withRBAC } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const GET = withRBAC(["clinician", "admin"], async ({ locals }) => {
  const env = locals.runtime.env;
  try {
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: "conversation:",
      limit: 1e3
    });
    const conversations = [];
    for (const key of keys) {
      const conversationData = await env.CHAT_HISTORY.get(key.name);
      if (conversationData) {
        try {
          const conversation = JSON.parse(conversationData);
          conversations.push(conversation);
        } catch (parseError) {
          console.error(`Failed to parse conversation ${key.name}:`, parseError);
        }
      }
    }
    conversations.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );
    return new Response(JSON.stringify({
      conversations,
      total: conversations.length
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to list conversations:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(JSON.stringify({
        conversations: [],
        total: 0
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      error: "Failed to list conversations",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
const POST = withRBAC(["clinician", "admin"], async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const data = await request.json();
    const { title } = data;
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const conversation = {
      id: conversationId,
      title: title || "New Conversation",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      messageCount: 0
    };
    await env.CHAT_HISTORY.put(
      `conversation:${conversationId}`,
      JSON.stringify(conversation)
    );
    return new Response(JSON.stringify(conversation), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return new Response(JSON.stringify({
      error: "Failed to create conversation",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
const DELETE = withRBAC(["clinician", "admin"], async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.pathname.split("/").pop();
  if (!conversationId) {
    return new Response(JSON.stringify({
      error: "Conversation ID is required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    await env.CHAT_HISTORY.delete(`conversation:${conversationId}`);
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: `message:${conversationId}:`,
      limit: 1e3
    });
    for (const key of keys) {
      await env.CHAT_HISTORY.delete(key.name);
    }
    return new Response(JSON.stringify({
      message: "Conversation deleted successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return new Response(JSON.stringify({
      error: "Failed to delete conversation",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=conversations.astro.mjs.map
