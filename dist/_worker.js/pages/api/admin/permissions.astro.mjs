globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as authenticate, r as requireAdmin } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { P as PERMISSIONS, a as RESOURCES, R as ROLES } from '../../../chunks/rbac_vK5lyOl9.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const GET = async (context) => {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const adminCheck = await requireAdmin(context);
  if (adminCheck instanceof Response) {
    return adminCheck;
  }
  const env = context.locals.runtime.env;
  const db = env.DB;
  try {
    const results = await db.prepare(
      "SELECT role, permission, resource FROM clinical_permissions ORDER BY role, resource, permission"
    ).all();
    const permissions = results.results;
    return new Response(JSON.stringify({
      permissions,
      roles: Object.values(ROLES),
      resources: Object.values(RESOURCES),
      actions: Object.values(PERMISSIONS)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch permissions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async (context) => {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const adminCheck = await requireAdmin(context);
  if (adminCheck instanceof Response) {
    return adminCheck;
  }
  let body;
  try {
    body = await context.request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!body.permissions || !Array.isArray(body.permissions)) {
    return new Response(JSON.stringify({ error: "Invalid permissions format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const env = context.locals.runtime.env;
  const db = env.DB;
  try {
    const statements = [];
    for (const perm of body.permissions) {
      const { role, permission, resource, granted } = perm;
      const validRoles = Object.values(ROLES);
      const validPermissions = Object.values(PERMISSIONS);
      const validResources = Object.values(RESOURCES);
      if (!validRoles.includes(role) || !validPermissions.includes(permission) || !validResources.includes(resource)) {
        return new Response(JSON.stringify({
          error: "Invalid permission data",
          details: { role, permission, resource }
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (granted) {
        statements.push(
          db.prepare(
            `INSERT INTO clinical_permissions (role, permission, resource) 
             VALUES (?, ?, ?)
             ON CONFLICT(role, permission, resource) DO NOTHING`
          ).bind(role, permission, resource)
        );
      } else {
        statements.push(
          db.prepare(
            "DELETE FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?"
          ).bind(role, permission, resource)
        );
      }
    }
    await db.batch(statements);
    const rbac = context.locals.rbac;
    if (rbac && rbac.clearCache) {
      rbac.clearCache();
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Permissions updated successfully",
      count: body.permissions.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return new Response(JSON.stringify({ error: "Failed to update permissions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=permissions.astro.mjs.map
