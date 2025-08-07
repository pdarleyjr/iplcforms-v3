globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as nanoid } from '../../../chunks/index.browser_BfaZFivj.mjs';
import { c as checkRateLimit } from '../../../chunks/rateLimit_B8vzP1Fn.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    const clientId = request.headers.get("CF-Connecting-IP") || "anonymous";
    const rateLimitInfo = await checkRateLimit(clientId, env);
    if (!rateLimitInfo.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter: rateLimitInfo.retryAfter
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": (rateLimitInfo.limit || 60).toString(),
          "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
          "X-RateLimit-Reset": rateLimitInfo.resetAt.toString()
        }
      });
    }
    const formData = await request.formData();
    const files = formData.getAll("files");
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
      const chunks = splitTextIntoChunks(text, 600, 50);
      const uploadResponse = await iplcAI.fetch("https://iplc-ai.worker/documents/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentId,
          documentName: file.name,
          documentType: file.type,
          chunks
        })
      });
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        console.error(`Failed to upload ${file.name}:`, error);
        uploadedDocuments.push({
          id: documentId,
          name: file.name,
          error,
          success: false
        });
        continue;
      }
      const result = await uploadResponse.json();
      uploadedDocuments.push({
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        chunks: chunks.length,
        vectorIds: result.vectorIds,
        success: true
      });
    }
    return new Response(JSON.stringify({
      success: true,
      documents: uploadedDocuments,
      rateLimitInfo: {
        limit: rateLimitInfo.limit,
        remaining: rateLimitInfo.remaining,
        resetAt: rateLimitInfo.resetAt
      }
    }), {
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": (rateLimitInfo.limit || 60).toString(),
        "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
        "X-RateLimit-Reset": rateLimitInfo.resetAt.toString()
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({
      error: "Failed to upload documents",
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
  if (type.includes("text") || type.includes("json") || type.includes("csv") || type.includes("javascript") || type.includes("typescript") || type.includes("html") || type.includes("css") || type.includes("xml") || file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".js") || file.name.endsWith(".ts") || file.name.endsWith(".jsx") || file.name.endsWith(".tsx") || file.name.endsWith(".vue") || file.name.endsWith(".svelte")) {
    return decoder.decode(buffer);
  }
  if (type.includes("pdf")) {
    return `[PDF content from ${file.name} - parsing not implemented. Please convert to text format.]`;
  }
  if (type.includes("doc")) {
    return `[Document content from ${file.name} - parsing not implemented. Please convert to text format.]`;
  }
  return `[Binary file ${file.name} - content extraction not supported. Please use text-based formats.]`;
}
function splitTextIntoChunks(text, chunkSize, overlap = 50) {
  const chunks = [];
  if (text.length <= chunkSize) {
    return [text.trim()];
  }
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = "";
  let previousChunkEnd = "";
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      const chunkWithOverlap = previousChunkEnd + currentChunk;
      chunks.push(chunkWithOverlap.trim());
      const words = currentChunk.split(" ");
      const overlapWords = Math.ceil(overlap / 6);
      previousChunkEnd = words.slice(-overlapWords).join(" ") + " ";
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }
  if (currentChunk.trim()) {
    const chunkWithOverlap = previousChunkEnd + currentChunk;
    chunks.push(chunkWithOverlap.trim());
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
