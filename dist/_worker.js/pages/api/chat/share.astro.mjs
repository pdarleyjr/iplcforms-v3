globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const runtime = "edge";
const POST = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const body = await request.json();
    if (!body.question || !body.answer) {
      return new Response(JSON.stringify({
        error: "Question and answer are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const snippetId = crypto.randomUUID();
    const snippet = {
      id: snippetId,
      question: body.question,
      answer: body.answer,
      citations: body.citations || [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString()
      // 30 days
    };
    await env.KV.put(
      `chat:snippet:${snippetId}`,
      JSON.stringify(snippet),
      {
        expirationTtl: 30 * 24 * 60 * 60
        // 30 days in seconds
      }
    );
    const origin = new URL(request.url).origin;
    const shareUrl = `${origin}/chat/shared/${snippetId}`;
    return new Response(JSON.stringify({
      success: true,
      snippetId,
      shareUrl,
      expiresAt: snippet.expiresAt
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating shared snippet:", error);
    return new Response(JSON.stringify({
      error: "Failed to create shared snippet"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ url, locals }) => {
  try {
    const { env } = locals.runtime;
    const snippetId = url.searchParams.get("id");
    if (!snippetId) {
      return new Response(JSON.stringify({
        error: "Snippet ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const snippetData = await env.KV.get(`chat:snippet:${snippetId}`);
    if (!snippetData) {
      return new Response(JSON.stringify({
        error: "Snippet not found or has expired"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const snippet = JSON.parse(snippetData);
    return new Response(JSON.stringify({
      success: true,
      snippet
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error retrieving shared snippet:", error);
    return new Response(JSON.stringify({
      error: "Failed to retrieve shared snippet"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  runtime
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=share.astro.mjs.map
