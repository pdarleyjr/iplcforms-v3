globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const GET = async ({ params, locals }) => {
  const env = locals.runtime.env;
  const documentId = params.id;
  if (!documentId) {
    return new Response(JSON.stringify({ error: "Document ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
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
    const getResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/${documentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      const error = await getResponse.text();
      throw new Error(error);
    }
    const document = await getResponse.json();
    return new Response(JSON.stringify(document), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to get document:", error);
    return new Response(JSON.stringify({
      error: "Failed to get document",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params, locals }) => {
  const env = locals.runtime.env;
  const documentId = params.id;
  if (!documentId) {
    return new Response(JSON.stringify({ error: "Document ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
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
    const deleteResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!deleteResponse.ok) {
      if (deleteResponse.status === 404) {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      const error = await deleteResponse.text();
      throw new Error(error);
    }
    await env.CHAT_HISTORY.delete(`doc:${documentId}`);
    return new Response(JSON.stringify({
      success: true,
      message: "Document and metadata deleted successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to delete document:", error);
    return new Response(JSON.stringify({
      error: "Failed to delete document",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
