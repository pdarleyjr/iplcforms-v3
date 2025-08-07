globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as authenticate, b as authorize } from '../../../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { w as withPerformanceMonitoring } from '../../../../chunks/performance-wrapper_COlTcJLx.mjs';
import { P as PERMISSIONS } from '../../../../chunks/rbac_vK5lyOl9.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const postHandler = async (context) => {
  const { CUSTOMER_WORKFLOW } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.MANAGE, "workflows");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  if (!context.params.id) {
    return new Response(JSON.stringify({ error: "Customer ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { id } = context.params;
  await CUSTOMER_WORKFLOW.create({ params: { id } });
  return new Response(null, { status: 202 });
};
const POST = withPerformanceMonitoring(postHandler, "customers-workflow:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=workflow.astro.mjs.map
