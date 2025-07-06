import type { APIRoute } from 'astro';
import { authenticate, requireAdmin } from '@/lib/middleware/rbac-middleware';
import { ROLES, RESOURCES, PERMISSIONS } from '@/lib/utils/rbac';

export const GET: APIRoute = async (context) => {
  // Authenticate and check admin role
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }

  const adminCheck = await requireAdmin(context);
  if (adminCheck instanceof Response) {
    return adminCheck;
  }

  const env = (context.locals as any).runtime.env;
  const db = env.DB;

  try {
    // Fetch all permissions from database
    const results = await db.prepare(
      'SELECT role, permission, resource FROM clinical_permissions ORDER BY role, resource, permission'
    ).all();

    const permissions = results.results as unknown as Array<{
      role: string;
      permission: string;
      resource: string;
    }>;

    // Return structured permission matrix data
    return new Response(JSON.stringify({
      permissions,
      roles: Object.values(ROLES),
      resources: Object.values(RESOURCES),
      actions: Object.values(PERMISSIONS),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch permissions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

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

  if (!body.permissions || !Array.isArray(body.permissions)) {
    return new Response(JSON.stringify({ error: 'Invalid permissions format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = (context.locals as any).runtime.env;
  const db = env.DB;

  try {
    // Start a transaction-like operation by batching updates
    const statements = [];

    for (const perm of body.permissions) {
      const { role, permission, resource, granted } = perm;

      // Validate inputs
      const validRoles = Object.values(ROLES);
      const validPermissions = Object.values(PERMISSIONS);
      const validResources = Object.values(RESOURCES);
      
      if (!validRoles.includes(role) || !validPermissions.includes(permission) || !validResources.includes(resource)) {
        return new Response(JSON.stringify({
          error: 'Invalid permission data',
          details: { role, permission, resource }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (granted) {
        // Insert or update permission
        statements.push(
          db.prepare(
            `INSERT INTO clinical_permissions (role, permission, resource) 
             VALUES (?, ?, ?)
             ON CONFLICT(role, permission, resource) DO NOTHING`
          ).bind(role, permission, resource)
        );
      } else {
        // Delete permission
        statements.push(
          db.prepare(
            'DELETE FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?'
          ).bind(role, permission, resource)
        );
      }
    }

    // Execute all statements
    await db.batch(statements);

    // Clear RBAC cache
    const rbac = (context.locals as any).rbac;
    if (rbac && rbac.clearCache) {
      rbac.clearCache();
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Permissions updated successfully',
      count: body.permissions.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return new Response(JSON.stringify({ error: 'Failed to update permissions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};