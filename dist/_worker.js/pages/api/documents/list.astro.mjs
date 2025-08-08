globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const GET = async ({ url, locals }) => {
  const env = locals.runtime.env;
  try {
    const params = url.searchParams;
    const limit = parseInt(params.get("limit") || "50", 10);
    const cursor = params.get("cursor") || null;
    const search = params.get("search") || null;
    const includeStats = params.get("includeStats") === "true";
    if (limit < 1 || limit > 100) {
      return new Response(JSON.stringify({
        error: "Limit must be between 1 and 100"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
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
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      ...cursor && { cursor },
      ...search && { search },
      ...includeStats && { includeStats: "true" }
    });
    const listResponse = await iplcAI.fetch(`https://iplc-ai.worker/documents/list?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!listResponse.ok) {
      const error = await listResponse.text();
      throw new Error(error);
    }
    const result = await listResponse.json();
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=30"
        // Cache for 30 seconds
      }
    });
  } catch (error) {
    console.error("List documents error:", error);
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
//# sourceMappingURL=list.astro.mjs.map
