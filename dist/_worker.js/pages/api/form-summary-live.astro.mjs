globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkRateLimit } from '../../chunks/rateLimit_B8vzP1Fn.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const body = await request.json();
    const { selectedFields, fieldData, summaryConfig } = body;
    if (!selectedFields || !Array.isArray(selectedFields) || selectedFields.length === 0) {
      return new Response(JSON.stringify({ error: "No fields selected for summary" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const aiEnv = {
      AI: env.AI,
      DOC_INDEX: env.DOC_INDEX,
      DOC_METADATA: env.DOC_METADATA,
      CHAT_HISTORY: env.CHAT_HISTORY || env.FORMS_KV,
      AI_GATE: env.AIGate
    };
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
    const clientId = `form-summary-live:${clientIp}`;
    const rateLimitResult = await checkRateLimit(clientId, aiEnv);
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1e3);
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString()
        }
      });
    }
    const {
      defaultPrompt = "",
      maxLength = 500,
      includeMedicalContext = true,
      sourceFieldLabels = true
    } = summaryConfig || {};
    const contentParts = [];
    selectedFields.forEach((fieldId) => {
      const value = fieldData[fieldId];
      if (value !== void 0 && value !== null && value !== "") {
        if (sourceFieldLabels) {
          const label = fieldId.split("_")[0].replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
          contentParts.push(`${label}: ${value}`);
        } else {
          contentParts.push(String(value));
        }
      }
    });
    if (contentParts.length === 0) {
      return new Response(JSON.stringify({ error: "No content to summarize" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const contentToSummarize = contentParts.join("\n");
    let systemPrompt = "You are a medical assistant helping to summarize form data. ";
    if (includeMedicalContext) {
      systemPrompt += "Use appropriate medical terminology and maintain clinical accuracy. ";
    }
    systemPrompt += `Create a concise summary of the provided information in no more than ${maxLength} characters.`;
    let fullPrompt = "";
    if (defaultPrompt) {
      fullPrompt = `${systemPrompt}

${defaultPrompt}

Data to summarize:
${contentToSummarize}`;
    } else {
      fullPrompt = `${systemPrompt}

Please summarize the following form data:

${contentToSummarize}`;
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
    const summaryResponse = await iplcAI.fetch("https://iplc-ai.worker/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: fullPrompt,
        maxWords: maxLength
      })
    });
    if (!summaryResponse.ok) {
      const error = await summaryResponse.text();
      console.error("IPLC_AI summary error:", error);
      throw new Error(`AI service error: ${error}`);
    }
    const { summary } = await summaryResponse.json();
    if (!summary) {
      throw new Error("Failed to generate summary");
    }
    return new Response(JSON.stringify({
      summary,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      sourceFields: selectedFields
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate summary",
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
//# sourceMappingURL=form-summary-live.astro.mjs.map
