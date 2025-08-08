globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from '../../chunks/d1-connection-manager_oVL7uFVJ.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const url = new URL(request.url);
    const pdfId = url.searchParams.get("pdf_id");
    let query = "SELECT * FROM pdf_annotations";
    const params = [];
    if (pdfId) {
      query += " WHERE pdf_id = ?";
      params.push(pdfId);
    }
    query += " ORDER BY created_at DESC";
    const stmt = d1Manager.prepare(query);
    const result = await stmt.bind(...params).all();
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Failed to fetch annotations" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const annotations = result.results.map((row) => ({
      ...row,
      data: row.data ? d1Manager.parseJSON(row.data) : null
    }));
    return new Response(JSON.stringify({ annotations }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching annotations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const body = await request.json();
    const { pdf_id, annotations } = body;
    if (!pdf_id || !annotations) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const id = `pdf-ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stmt = d1Manager.prepare(`
      INSERT INTO pdf_annotations (id, pdf_id, data, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `);
    const result = await stmt.bind(
      id,
      pdf_id,
      JSON.stringify(annotations)
    ).run();
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Failed to save annotations" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      id,
      message: "Annotations saved successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving annotations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const pdfId = url.searchParams.get("pdf_id");
    if (!id && !pdfId) {
      return new Response(JSON.stringify({ error: "Missing id or pdf_id parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let query = "DELETE FROM pdf_annotations WHERE ";
    const params = [];
    if (id) {
      query += "id = ?";
      params.push(id);
    } else if (pdfId) {
      query += "pdf_id = ?";
      params.push(pdfId);
    }
    const stmt = d1Manager.prepare(query);
    const result = await stmt.bind(...params).run();
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Failed to delete annotations" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      deleted: result.meta.changes,
      message: "Annotations deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting annotations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=pdf-annotations.astro.mjs.map
