import type { APIRoute } from 'astro';
import { authenticate, requireAdmin } from '@/lib/middleware/rbac-middleware';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum(['patient', 'clinician', 'admin', 'researcher']),
});

export const PUT: APIRoute = async (context) => {
  // Authenticate and check admin role
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }

  const adminCheck = await requireAdmin(context);
  if (adminCheck instanceof Response) {
    return adminCheck;
  }

  // Get user ID from URL params
  const userId = context.params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate request body
  let body: any;
  try {
    body = await context.request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validation = updateRoleSchema.safeParse(body);
  if (!validation.success) {
    return new Response(JSON.stringify({ error: 'Invalid role', details: validation.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { role } = validation.data;
  const env = (context.locals as any).runtime.env;
  const db = env.DB;

  try {
    // Check if user exists
    const userResult = await db.prepare('SELECT id FROM customers WHERE id = ?').bind(userId).first();
    if (!userResult) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update user role
    await db.prepare(
      'UPDATE customers SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(role, userId).run();

    // Clear any cached permissions for this user
    const rbac = (context.locals as any).rbac;
    if (rbac && rbac.clearUserCache) {
      rbac.clearUserCache(userId);
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Role updated successfully',
      role 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return new Response(JSON.stringify({ error: 'Failed to update role' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};