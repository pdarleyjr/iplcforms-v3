globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as authenticate, r as requireAdmin } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
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
  const { locals } = context;
  const env = locals.runtime.env;
  const db = env.DB;
  try {
    const url = new URL(context.request.url);
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        id,
        email,
        stripe_customer_id,
        role,
        license_number,
        organization,
        status,
        subscription_status,
        last_login_at,
        created_at,
        updated_at
      FROM customers
      WHERE 1=1
    `;
    const params = [];
    if (search) {
      query += ` AND (email LIKE ? OR organization LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      query += ` AND role = ?`;
      params.push(role);
    }
    const countQuery = query.replace(
      "SELECT id, email, stripe_customer_id, role, license_number, organization, status, subscription_status, last_login_at, created_at, updated_at",
      "SELECT COUNT(*) as total"
    );
    const countResult = await db.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    const results = await db.prepare(query).bind(...params).all();
    const users = results.results || [];
    return new Response(JSON.stringify({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=users.astro.mjs.map
