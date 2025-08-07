globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const GET = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const conversationId = url.searchParams.get("conversationId");
  try {
    const prefix = conversationId ? `doc:` : "doc:";
    const { keys } = await env.CHAT_HISTORY.list({
      prefix,
      limit: 1e3
    });
    const documents = [];
    for (const key of keys) {
      const docData = await env.CHAT_HISTORY.get(key.name);
      if (docData) {
        const doc = JSON.parse(docData);
        if (!conversationId || doc.conversationId === conversationId) {
          documents.push(doc);
        }
      }
    }
    documents.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    return new Response(JSON.stringify({
      documents,
      total: documents.length
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to list documents:", error);
    return new Response(JSON.stringify({
      error: "Failed to list documents",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=documents.astro.mjs.map
