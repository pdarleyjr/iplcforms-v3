globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as authenticate, r as requireAdmin } from '../../../../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { o as object, _ as _enum } from '../../../../../chunks/schemas_RvMANBrn.mjs';
export { r as renderers } from '../../../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const updateRoleSchema = object({
  role: _enum(["patient", "clinician", "admin", "researcher"])
});
const PUT = async (context) => {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const adminCheck = await requireAdmin(context);
  if (adminCheck instanceof Response) {
    return adminCheck;
  }
  const userId = context.params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
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
  const validation = updateRoleSchema.safeParse(body);
  if (!validation.success) {
    return new Response(JSON.stringify({ error: "Invalid role", details: validation.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { role } = validation.data;
  const env = context.locals.runtime.env;
  const db = env.DB;
  try {
    const userResult = await db.prepare("SELECT id FROM customers WHERE id = ?").bind(userId).first();
    if (!userResult) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await db.prepare(
      "UPDATE customers SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(role, userId).run();
    const rbac = context.locals.rbac;
    if (rbac && rbac.clearUserCache) {
      rbac.clearUserCache(userId);
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Role updated successfully",
      role
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new Response(JSON.stringify({ error: "Failed to update role" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=role.astro.mjs.map
