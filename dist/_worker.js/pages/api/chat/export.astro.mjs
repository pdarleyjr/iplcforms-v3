globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as withRBAC } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const runtime = "edge";
const POST = withRBAC(["clinician", "admin"], async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const body = await request.json();
    if (!body.conversationId) {
      return new Response(JSON.stringify({
        error: "Conversation ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const historyData = await env.KV.get(`chat:history:${body.conversationId}`);
    if (!historyData) {
      return new Response(JSON.stringify({
        error: "Conversation not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const messages = JSON.parse(historyData);
    if (body.format === "json") {
      return new Response(JSON.stringify({
        conversationId: body.conversationId,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        messages
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="conversation-${body.conversationId}.json"`
        }
      });
    }
    let markdown = `# AI Chat Conversation

`;
    markdown += `**Exported:** ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
    markdown += `**Conversation ID:** ${body.conversationId}

`;
    markdown += `---

`;
    messages.forEach((message, index) => {
      const timestamp = new Date(message.timestamp).toLocaleTimeString();
      if (message.role === "user") {
        markdown += `## 👤 User (${timestamp})

`;
        markdown += `${message.content}

`;
      } else {
        markdown += `## 🤖 AI Assistant (${timestamp})

`;
        let content = message.content;
        const footnotes = [];
        if (message.citations && message.citations.length > 0) {
          content = content.replace(/\^\[(\d+)\]/g, (match, num) => {
            const citation = message.citations?.find((c) => c.id === parseInt(num));
            if (citation) {
              footnotes.push(`[^${num}]: From "${citation.documentName}" - ${citation.text.substring(0, 200)}...`);
              return `[^${num}]`;
            }
            return match;
          });
        }
        markdown += `${content}

`;
        if (footnotes.length > 0) {
          markdown += `### Sources

`;
          footnotes.forEach((footnote) => {
            markdown += `${footnote}

`;
          });
        }
      }
      if (index < messages.length - 1) {
        markdown += `---

`;
      }
    });
    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="conversation-${body.conversationId}.md"`
      }
    });
  } catch (error) {
    console.error("Error exporting conversation:", error);
    return new Response(JSON.stringify({
      error: "Failed to export conversation"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
const GET = withRBAC(["clinician", "admin"], async () => {
  return new Response(JSON.stringify({
    formats: [
      {
        id: "markdown",
        name: "Markdown",
        extension: ".md",
        mimeType: "text/markdown"
      },
      {
        id: "json",
        name: "JSON",
        extension: ".json",
        mimeType: "application/json"
      }
    ]
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  runtime
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=export.astro.mjs.map
