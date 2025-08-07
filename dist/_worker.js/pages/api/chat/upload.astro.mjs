globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as nanoid } from '../../../chunks/index.browser_BfaZFivj.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const conversationId = formData.get("conversationId") || nanoid();
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files provided" }), {
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
    const uploadedDocuments = [];
    for (const file of files) {
      const documentId = nanoid();
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromFile(file, buffer);
      const chunks = splitTextIntoChunks(text, 600);
      const base64Content = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
      const uploadResponse = await iplcAI.fetch("https://iplc-ai.worker/documents/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentId,
          documentName: file.name,
          documentType: file.type,
          chunks,
          conversationId
        })
      });
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        console.error(`Failed to upload ${file.name}:`, error);
        continue;
      }
      const result = await uploadResponse.json();
      uploadedDocuments.push({
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        conversationId,
        chunks: chunks.length,
        vectorIds: result.vectorIds
      });
    }
    const conversation = await env.CHAT_HISTORY.get(`conv:${conversationId}`);
    if (!conversation) {
      await env.CHAT_HISTORY.put(
        `conv:${conversationId}`,
        JSON.stringify({
          id: conversationId,
          title: `Chat about ${files[0].name}`,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          lastMessage: "",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
    }
    return new Response(JSON.stringify({
      success: true,
      conversationId,
      documents: uploadedDocuments
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({
      error: "Failed to upload files",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function extractTextFromFile(file, buffer) {
  const type = file.type;
  const decoder = new TextDecoder();
  if (type.includes("text") || type.includes("json") || type.includes("csv") || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
    return decoder.decode(buffer);
  }
  if (type.includes("pdf")) {
    return `[PDF content from ${file.name} - parsing not implemented]`;
  }
  if (type.includes("doc")) {
    return `[Document content from ${file.name} - parsing not implemented]`;
  }
  return `[Binary file ${file.name} - content extraction not supported]`;
}
function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = "";
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=upload.astro.mjs.map
