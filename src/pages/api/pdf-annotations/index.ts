import type { APIRoute } from 'astro';
import { getD1Manager } from '../../../lib/services/d1-connection-manager';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore - Cloudflare runtime types
    const db = (locals as any).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const d1Manager = getD1Manager(db);
    
    // Get query parameters
    const url = new URL(request.url);
    const pdfId = url.searchParams.get('pdf_id');
    
    let query = 'SELECT * FROM pdf_annotations';
    const params: any[] = [];
    
    if (pdfId) {
      query += ' WHERE pdf_id = ?';
      params.push(pdfId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const stmt = d1Manager.prepare(query);
    const result = await stmt.bind(...params).all();
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to fetch annotations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse JSON data for each annotation
    const annotations = result.results.map((row: any) => ({
      ...row,
      data: row.data ? d1Manager.parseJSON(row.data) : null
    }));
    
    return new Response(JSON.stringify({ annotations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore - Cloudflare runtime types
    const db = (locals as any).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const d1Manager = getD1Manager(db);
    
    const body = await request.json() as { pdf_id?: string; annotations?: any[] };
    const { pdf_id, annotations } = body;
    
    if (!pdf_id || !annotations) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate unique ID
    const id = `pdf-ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert new annotation record
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
      return new Response(JSON.stringify({ error: 'Failed to save annotations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      id,
      message: 'Annotations saved successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving annotations:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore - Cloudflare runtime types
    const db = (locals as any).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const d1Manager = getD1Manager(db);
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const pdfId = url.searchParams.get('pdf_id');
    
    if (!id && !pdfId) {
      return new Response(JSON.stringify({ error: 'Missing id or pdf_id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let query = 'DELETE FROM pdf_annotations WHERE ';
    const params: any[] = [];
    
    if (id) {
      query += 'id = ?';
      params.push(id);
    } else if (pdfId) {
      query += 'pdf_id = ?';
      params.push(pdfId);
    }
    
    const stmt = d1Manager.prepare(query);
    const result = await stmt.bind(...params).run();
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to delete annotations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      deleted: result.meta.changes,
      message: 'Annotations deleted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting annotations:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};