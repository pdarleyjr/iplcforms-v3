import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const pdfUrl = url.searchParams.get('pdfUrl');
    
    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: 'PDF URL is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the D1 database from locals
    const db = locals.runtime.env.DB;
    
    // Check if we have a pdf_annotations table, if not create it
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
      console.error('Error creating table:', error);
    }

    // Fetch annotations for the PDF
    const result = await db.prepare(`
      SELECT * FROM pdf_annotations 
      WHERE pdf_url = ? 
      ORDER BY updated_at DESC 
      LIMIT 1
    `).bind(pdfUrl).first();

    if (result) {
      return new Response(JSON.stringify({
        annotations: JSON.parse(result.annotations as string),
        updatedAt: result.updated_at,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ annotations: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch annotations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as { pdfUrl: string; annotations: any[] };
    const { pdfUrl, annotations } = body;

    if (!pdfUrl || !annotations) {
      return new Response(JSON.stringify({ error: 'PDF URL and annotations are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the D1 database from locals
    const db = locals.runtime.env.DB;

    // Check if we have a pdf_annotations table, if not create it
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
      console.error('Error creating table:', error);
    }

    // Check if annotations already exist for this PDF
    const existing = await db.prepare(`
      SELECT id FROM pdf_annotations 
      WHERE pdf_url = ? 
      LIMIT 1
    `).bind(pdfUrl).first();

    if (existing) {
      // Update existing annotations
      await db.prepare(`
        UPDATE pdf_annotations 
        SET annotations = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE pdf_url = ?
      `).bind(JSON.stringify(annotations), pdfUrl).run();
    } else {
      // Insert new annotations
      await db.prepare(`
        INSERT INTO pdf_annotations (pdf_url, annotations) 
        VALUES (?, ?)
      `).bind(pdfUrl, JSON.stringify(annotations)).run();
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Annotations saved successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving annotations:', error);
    return new Response(JSON.stringify({ error: 'Failed to save annotations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const pdfUrl = url.searchParams.get('pdfUrl');
    
    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: 'PDF URL is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the D1 database from locals
    const db = locals.runtime.env.DB;

    // Delete annotations for the PDF
    await db.prepare(`
      DELETE FROM pdf_annotations 
      WHERE pdf_url = ?
    `).bind(pdfUrl).run();

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Annotations deleted successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting annotations:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete annotations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};