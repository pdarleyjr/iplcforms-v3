globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from '../../../chunks/d1-connection-manager_oVL7uFVJ.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing annotation ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cacheKey = `pdf-annotation-${id}`;
    const cached = d1Manager.getCachedData(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = d1Manager.prepare("SELECT * FROM pdf_annotations WHERE pdf_id = ?");
    const result = await stmt.bind(id).first();
    if (!result) {
      return new Response(JSON.stringify({ error: "Annotations not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const annotations = {
      ...result,
      data: result.data ? d1Manager.parseJSON(result.data) : null
    };
    d1Manager.cacheData(cacheKey, annotations);
    return new Response(JSON.stringify({ annotations }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching annotation:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ params, request, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing annotation ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { annotations } = body;
    if (!annotations) {
      return new Response(JSON.stringify({ error: "Missing annotations data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const checkStmt = d1Manager.prepare("SELECT id FROM pdf_annotations WHERE pdf_id = ?");
    const existing = await checkStmt.bind(id).first();
    if (existing) {
      const updateStmt = d1Manager.prepare(`
        UPDATE pdf_annotations 
        SET data = ?, updated_at = datetime('now')
        WHERE pdf_id = ?
      `);
      const result = await updateStmt.bind(
        JSON.stringify(annotations),
        id
      ).run();
      if (!result.success) {
        return new Response(JSON.stringify({ error: "Failed to update annotations" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      d1Manager.clearSpecificCaches([`pdf-annotation-${id}`]);
      return new Response(JSON.stringify({
        success: true,
        message: "Annotations updated successfully"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const insertStmt = d1Manager.prepare(`
        INSERT INTO pdf_annotations (id, pdf_id, data, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `);
      const newId = `pdf-ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const result = await insertStmt.bind(
        newId,
        id,
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
        id: newId,
        message: "Annotations created successfully"
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error updating annotations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params, locals }) => {
  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const d1Manager = getD1Manager(db);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing annotation ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = d1Manager.prepare("DELETE FROM pdf_annotations WHERE pdf_id = ?");
    const result = await stmt.bind(id).run();
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Failed to delete annotations" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: "Annotations not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    d1Manager.clearSpecificCaches([`pdf-annotation-${id}`]);
    return new Response(JSON.stringify({
      success: true,
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
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
