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
    const { slackWebhook, slackChannel } = data;
    if (!slackWebhook) {
      return new Response(JSON.stringify({ error: "Webhook URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!slackWebhook.startsWith("https://hooks.slack.com/services/")) {
      return new Response(JSON.stringify({ error: "Invalid Slack webhook URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = {
      channel: slackChannel || null,
      configured: true,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CACHE_KV.put("integration:slack:config", JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    await env.CACHE_KV.put("integration:slack:webhook", slackWebhook, {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    try {
      const testPayload = {
        text: "✅ IPLC Forms Slack integration configured successfully!",
        channel: slackChannel || void 0
      };
      const testResponse = await fetch(slackWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testPayload)
      });
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        throw new Error(`Webhook test failed: ${errorText}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Failed to send test message. Please check your webhook URL."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      message: "Slack configuration saved and test message sent!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving Slack configuration:", error);
    return new Response(JSON.stringify({
      error: "Failed to save configuration"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function sendSlackNotification(env, formTitle, submissionId, formData) {
  const webhookUrl = await env.get("integration:slack:webhook");
  if (!webhookUrl) {
    return null;
  }
  const message = {
    text: `New form submission: ${formTitle}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📋 ${formTitle}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Submission ID:*
${submissionId}`
          },
          {
            type: "mrkdwn",
            text: `*Submitted:*
${(/* @__PURE__ */ new Date()).toLocaleString()}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Form Data Summary:*"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: Object.entries(formData).slice(0, 10).map(([key, value]) => `• *${key}:* ${value}`).join("\n")
        }
      }
    ]
  };
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.status}`);
  }
  return { success: true };
}
const GET = async ({ locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const config = await env.CACHE_KV.get("integration:slack:config");
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
    console.error("Error fetching Slack configuration:", error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  sendSlackNotification
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, sendSlackNotification as s };
//# sourceMappingURL=slack_C2T7VPPC.mjs.map
