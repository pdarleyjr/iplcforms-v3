globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as RBACManager } from './rbac_vK5lyOl9.mjs';

async function authenticate(context) {
  const { request, locals } = context;
  const env = locals?.runtime?.env;
  if (!env) {
    return new Response(
      JSON.stringify({ error: "Runtime environment not available" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const customerId = request.headers.get("X-Customer-ID");
  if (!customerId) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const rbac = new RBACManager(env.DB);
  const customerRole = await rbac.getUserRole(customerId);
  if (!customerRole) {
    return new Response(
      JSON.stringify({ error: "User not found or no role assigned" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const authenticatedContext = context;
  authenticatedContext.locals.customerId = customerId;
  authenticatedContext.locals.customerRole = customerRole;
  authenticatedContext.locals.rbac = rbac;
  return authenticatedContext;
}
function authorize(permission, resource) {
  return async function(context) {
    const authResult = await authenticate(context);
    if (authResult instanceof Response) {
      return authResult;
    }
    const { rbac, customerRole } = authResult.locals;
    const hasPermission = await rbac.hasPermission(
      customerRole,
      permission,
      resource
    );
    if (!hasPermission) {
      return new Response(
        JSON.stringify({
          error: "Insufficient permissions",
          required: { permission, resource },
          role: customerRole
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return authResult;
  };
}
async function requireAdmin(context) {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  if (authResult.locals.customerRole !== "admin") {
    return new Response(
      JSON.stringify({
        error: "Admin access required",
        role: authResult.locals.customerRole
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  return authResult;
}

export { authenticate as a, authorize as b, requireAdmin as r };
//# sourceMappingURL=rbac-middleware_C5PL4AHx.mjs.map
