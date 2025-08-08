globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const pdfUrl = url.searchParams.get("pdfUrl");
    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: "PDF URL is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const db = locals.runtime.env.DB;
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS pdf_annotations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pdf_url TEXT NOT NULL,
          user_id TEXT,
          annotations TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    } catch (error) {
      console.error("Error creating table:", error);
    }
    const result = await db.prepare(`
      SELECT * FROM pdf_annotations 
      WHERE pdf_url = ? 
      ORDER BY updated_at DESC 
      LIMIT 1
    `).bind(pdfUrl).first();
    if (result) {
      return new Response(JSON.stringify({
        annotations: JSON.parse(result.annotations),
        updatedAt: result.updated_at
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({ annotations: [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching annotations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch annotations" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { pdfUrl, annotations } = body;
    if (!pdfUrl || !annotations) {
      return new Response(JSON.stringify({ error: "PDF URL and annotations are required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const db = locals.runtime.env.DB;
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS pdf_annotations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pdf_url TEXT NOT NULL,
          user_id TEXT,
          annotations TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    } catch (error) {
      console.error("Error creating table:", error);
    }
    const existing = await db.prepare(`
      SELECT id FROM pdf_annotations 
      WHERE pdf_url = ? 
      LIMIT 1
    `).bind(pdfUrl).first();
    if (existing) {
      await db.prepare(`
        UPDATE pdf_annotations 
        SET annotations = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE pdf_url = ?
      `).bind(JSON.stringify(annotations), pdfUrl).run();
    } else {
      await db.prepare(`
        INSERT INTO pdf_annotations (pdf_url, annotations) 
        VALUES (?, ?)
      `).bind(pdfUrl, JSON.stringify(annotations)).run();
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Annotations saved successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error saving annotations:", error);
    return new Response(JSON.stringify({ error: "Failed to save annotations" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const DELETE = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const pdfUrl = url.searchParams.get("pdfUrl");
    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: "PDF URL is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const db = locals.runtime.env.DB;
    await db.prepare(`
      DELETE FROM pdf_annotations 
      WHERE pdf_url = ?
    `).bind(pdfUrl).run();
    return new Response(JSON.stringify({
      success: true,
      message: "Annotations deleted successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error deleting annotations:", error);
    return new Response(JSON.stringify({ error: "Failed to delete annotations" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
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
//# sourceMappingURL=pdf-annotations.astro2.mjs.map
