import type { APIRoute } from 'astro';
import { getD1Manager } from '../../../lib/services/d1-connection-manager';

export const GET: APIRoute = async ({ params, locals }) => {
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
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing annotation ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Try to get from cache first
    const cacheKey = `pdf-annotation-${id}`;
    const cached = d1Manager.getCachedData(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Query database
    const stmt = d1Manager.prepare('SELECT * FROM pdf_annotations WHERE pdf_id = ?');
    const result = await stmt.bind(id).first();
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Annotations not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse JSON data
    const annotations = {
      ...result,
      data: result.data ? d1Manager.parseJSON(result.data as string) : null
    };
    
    // Cache the result
    d1Manager.cacheData(cacheKey, annotations);
    
    return new Response(JSON.stringify({ annotations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching annotation:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
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
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing annotation ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await request.json() as { annotations?: any[] };
    const { annotations } = body;
    
    if (!annotations) {
      return new Response(JSON.stringify({ error: 'Missing annotations data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if record exists
    const checkStmt = d1Manager.prepare('SELECT id FROM pdf_annotations WHERE pdf_id = ?');
    const existing = await checkStmt.bind(id).first();
    
    if (existing) {
      // Update existing record
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
        return new Response(JSON.stringify({ error: 'Failed to update annotations' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Clear cache
      d1Manager.clearSpecificCaches([`pdf-annotation-${id}`]);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Annotations updated successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create new record
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
        return new Response(JSON.stringify({ error: 'Failed to save annotations' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        id: newId,
        message: 'Annotations created successfully' 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error updating annotations:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
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
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing annotation ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const stmt = d1Manager.prepare('DELETE FROM pdf_annotations WHERE pdf_id = ?');
    const result = await stmt.bind(id).run();
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to delete annotations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Annotations not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Clear cache
    d1Manager.clearSpecificCaches([`pdf-annotation-${id}`]);
    
    return new Response(JSON.stringify({ 
      success: true,
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