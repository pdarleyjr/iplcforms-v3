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
    const { emailTo, emailFrom, emailSubject } = data;
    if (!emailTo || !emailFrom || !emailSubject) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = emailTo.split(",").map((email) => email.trim());
    for (const email of recipients) {
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: `Invalid email address: ${email}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (!emailRegex.test(emailFrom)) {
      return new Response(JSON.stringify({ error: "Invalid from email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!emailSubject.trim()) {
      return new Response(JSON.stringify({ error: "Subject template cannot be empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = {
      recipients,
      from: emailFrom,
      subjectTemplate: emailSubject,
      configured: true,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CACHE_KV.put("integration:email:config", JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    try {
      const testSubject = emailSubject.replace("{formTitle}", "Test Form").replace("{submissionId}", "test-123");
      const testEmail = {
        personalizations: [
          {
            to: recipients.map((email) => ({ email }))
          }
        ],
        from: {
          email: emailFrom,
          name: "IPLC Forms"
        },
        subject: testSubject,
        content: [
          {
            type: "text/html",
            value: `
              <h2>Email Integration Test</h2>
              <p>This is a test email from IPLC Forms to verify your email configuration.</p>
              <p>If you received this email, your integration is working correctly!</p>
              <hr>
              <p><small>Configuration saved at ${(/* @__PURE__ */ new Date()).toLocaleString()}</small></p>
            `
          }
        ]
      };
      console.log("Test email would be sent:", testEmail);
    } catch (error) {
      console.error("Error sending test email:", error);
    }
    return new Response(JSON.stringify({
      message: "Email configuration saved successfully!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving email configuration:", error);
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
    const config = await env.CACHE_KV.get("integration:email:config");
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
    console.error("Error fetching email configuration:", error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function sendEmail(env, formTitle, submissionId, formData) {
  const configStr = await env.CACHE_KV.get("integration:email:config");
  if (!configStr) {
    return null;
  }
  const config = JSON.parse(configStr);
  const subject = config.subjectTemplate.replace("{formTitle}", formTitle).replace("{submissionId}", submissionId.toString());
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">📋 ${formTitle}</h2>
      <p style="color: #666;">A new form submission has been received.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Submitted:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
      </div>
      
      <h3 style="color: #333;">Form Data:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${Object.entries(formData).map(([key, value]) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold;">${key}:</td>
              <td style="padding: 10px;">${value}</td>
            </tr>
          `).join("")}
      </table>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This email was sent from IPLC Forms v3
      </p>
    </div>
  `;
  const emailPayload = {
    personalizations: [
      {
        to: config.recipients.map((email) => ({ email: email.trim() }))
      }
    ],
    from: {
      email: config.from,
      name: "IPLC Forms"
    },
    subject,
    content: [
      {
        type: "text/html",
        value: htmlContent
      }
    ]
  };
  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailPayload)
  });
  if (!response.ok) {
    throw new Error(`Email notification failed: ${response.status}`);
  }
  return { success: true };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  sendEmail
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, sendEmail as s };
//# sourceMappingURL=email_DRCgJDbp.mjs.map
