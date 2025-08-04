globalThis.process ??= {}; globalThis.process.env ??= {};
import { C as CustomerService } from '../../../chunks/customer_CfmmZeU3.mjs';
import { a as authenticate, b as authorize } from '../../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../../chunks/rbac_vK5lyOl9.mjs';
import { w as withPerformanceMonitoring } from '../../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const getHandler = async (context) => {
  const { id } = context.params;
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "customers");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  if (!id) {
    return Response.json({ message: "Customer ID is required" }, { status: 400 });
  }
  const customerId = Number(id);
  if (isNaN(customerId)) {
    return Response.json({ message: "Invalid customer ID" }, { status: 400 });
  }
  const customerService = new CustomerService(DB);
  const customer = await customerService.getById(customerId);
  if (!customer) {
    return Response.json({ message: "Customer not found" }, { status: 404 });
  }
  return Response.json({ customer });
};
const GET = withPerformanceMonitoring(getHandler, "customers:get");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
