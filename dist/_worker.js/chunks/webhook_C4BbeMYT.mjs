globalThis.process ??= {}; globalThis.process.env ??= {};
const POST = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const data = await request.json();
    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { webhookUrl, webhookMethod, webhookHeaders } = data;
    if (!webhookUrl || !webhookMethod) {
      return new Response(JSON.stringify({ error: "URL and method are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      new URL(webhookUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid webhook URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedMethods = ["POST", "PUT", "PATCH"];
    if (!allowedMethods.includes(webhookMethod.toUpperCase())) {
      return new Response(JSON.stringify({ error: "Invalid HTTP method" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let parsedHeaders = {};
    if (webhookHeaders) {
      try {
        parsedHeaders = JSON.parse(webhookHeaders);
        if (typeof parsedHeaders !== "object" || Array.isArray(parsedHeaders)) {
          throw new Error("Headers must be a JSON object");
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid headers JSON format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const config = {
      url: webhookUrl,
      method: webhookMethod.toUpperCase(),
      headers: parsedHeaders,
      configured: true,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CACHE_KV.put("integration:webhook:config", JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    try {
      const testPayload = {
        test: true,
        message: "IPLC Forms webhook integration test",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        formTitle: "Test Form",
        submissionId: "test-" + Date.now()
      };
      const testResponse = await fetch(webhookUrl, {
        method: webhookMethod.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...parsedHeaders
        },
        body: JSON.stringify(testPayload)
      });
      if (!testResponse.ok) {
        throw new Error(`Webhook test failed with status: ${testResponse.status}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Failed to test webhook. Please check your URL and try again."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      message: "Webhook configuration saved and tested successfully!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving webhook configuration:", error);
    return new Response(JSON.stringify({
      error: "Failed to save configuration"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const config = await env.CACHE_KV.get("integration:webhook:config");
    if (!config) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(config, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching webhook configuration:", error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function sendWebhook(env, formTitle, submissionId, formData) {
  const configStr = await env.get("integration:webhook:config");
  if (!configStr) {
    return null;
  }
  const config = JSON.parse(configStr);
  const payload = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event: "form_submission",
    formTitle,
    submissionId,
    data: formData
  };
  const response = await fetch(config.url, {
    method: config.method,
    headers: {
      "Content-Type": "application/json",
      ...config.headers
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
  return { success: true };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  sendWebhook
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, sendWebhook as s };
//# sourceMappingURL=webhook_C4BbeMYT.mjs.map
