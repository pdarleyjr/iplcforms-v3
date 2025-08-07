globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ locals }) => {
  const env = locals.runtime.env;
  try {
    const results = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      bindings: {
        // Check if IPLC_AI service binding exists
        hasIPLC_AI: !!env.IPLC_AI,
        IPLC_AI_type: typeof env.IPLC_AI,
        IPLC_AI_hasFetch: typeof env.IPLC_AI?.fetch === "function",
        // Check local bindings
        hasAI: !!env.AI,
        hasDOC_INDEX: !!env.DOC_INDEX,
        hasCHAT_HISTORY: !!env.CHAT_HISTORY,
        hasAI_GATE: !!env.AI_GATE,
        // List all env keys
        envKeys: Object.keys(env || {})
      },
      serviceTest: null
    };
    if (env.IPLC_AI && typeof env.IPLC_AI.fetch === "function") {
      try {
        const testResponse = await env.IPLC_AI.fetch("https://iplc-ai.worker/health", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        results.serviceTest = {
          success: true,
          status: testResponse.status,
          statusText: testResponse.statusText,
          headers: Object.fromEntries(testResponse.headers.entries()),
          body: await testResponse.text()
        };
      } catch (error) {
        results.serviceTest = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    } else {
      results.serviceTest = {
        success: false,
        error: "IPLC_AI service binding not available"
      };
    }
    return new Response(JSON.stringify(results, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Test AI binding error:", error);
    return new Response(JSON.stringify({
      error: "Failed to test AI binding",
      details: error instanceof Error ? error.message : "Unknown error"
    }, null, 2), {
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
//# sourceMappingURL=test-ai-binding.astro.mjs.map
