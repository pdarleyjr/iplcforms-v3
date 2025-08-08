globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkRateLimit } from '../../chunks/rateLimit_B8vzP1Fn.mjs';
import { o as object, s as string, r as record, a as array, d as any } from '../../chunks/form-vendor_rc_Y5fZa.mjs';
export { renderers } from '../../renderers.mjs';

const SummaryRequestSchema = object({
  formId: string(),
  formData: object({
    name: string(),
    description: string().optional(),
    components: array(any()),
    responses: record(string(), any()).optional()
  })
});
const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const body = await request.json();
    const validation = SummaryRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Invalid request data",
        details: validation.error.issues
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { formId, formData } = validation.data;
    if (!formData.components || formData.components.length === 0) {
      return new Response(JSON.stringify({
        error: "No form components selected",
        message: "Please select at least one form component to generate a summary"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const aiEnv = {
      AI: env.AI,
      DOC_INDEX: env.DOC_INDEX,
      DOC_METADATA: env.DOC_METADATA,
      CHAT_HISTORY: env.CHAT_HISTORY || env.FORMS_KV,
      // Use FORMS_KV if CHAT_HISTORY not available
      AI_GATE: env.AIGate
    };
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
    const clientId = `form-summary:${clientIp}`;
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
    const contentToSummarize = `Form Analysis Request

Form Name: ${formData.name}
${formData.description ? `Form Description: ${formData.description}` : ""}

Form Components:
${formData.components.map((comp, index) => {
      return `${index + 1}. Field Type: ${comp.type}
   Label: ${comp.label || "Unlabeled"}
   ${comp.props?.required ? "(Required)" : "(Optional)"}
   ${comp.props?.placeholder ? `Placeholder: ${comp.props.placeholder}` : ""}
   ${comp.props?.helpText ? `Help Text: ${comp.props.helpText}` : ""}`;
    }).join("\n\n")}

Please provide a structured summary that includes:
- Overview of the form's purpose
- Total number of fields and breakdown by type
- Required vs optional fields
- Key features or special components
- Any clinical or domain-specific elements (if applicable)
- Accessibility considerations
- Suggestions for improvement (if any)

Format the summary using markdown with clear sections.`;
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
        content: contentToSummarize,
        maxWords: 500
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
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await env.DB.prepare(
      "UPDATE form_templates SET summary = ?, updated_at = ? WHERE id = ?"
    ).bind(summary, now, formId).run();
    return new Response(JSON.stringify({
      success: true,
      summary,
      generatedAt: now
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating form summary:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate form summary",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const url = new URL(request.url);
    const formId = url.searchParams.get("formId");
    if (!formId) {
      return new Response(JSON.stringify({
        error: "formId parameter is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(
      "SELECT summary, updated_at FROM form_templates WHERE id = ?"
    ).bind(formId).first();
    if (!result || !result.summary) {
      return new Response(JSON.stringify({
        summary: null,
        message: "No summary available"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      summary: result.summary,
      updatedAt: result.updated_at
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching form summary:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch form summary",
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
//# sourceMappingURL=form-summary.astro.mjs.map
