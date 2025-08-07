globalThis.process ??= {}; globalThis.process.env ??= {};
import { C as CustomerService } from '../../chunks/customer_CfmmZeU3.mjs';
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
import { a as validateRequest, b as CreateCustomerRequest } from '../../chunks/api-validation_BmEG2mSm.mjs';
import { w as withPerformanceMonitoring } from '../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const getHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "customers");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const customerService = new CustomerService(DB);
  const customers = await customerService.getAll();
  if (customers) {
    return Response.json({ customers });
  } else {
    return Response.json(
      { message: "Couldn't load customers" },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.CREATE, "customers");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  try {
    const body = await context.request.json();
    const validation = validateRequest(CreateCustomerRequest, body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors
        },
        { status: 400 }
      );
    }
    const customerService = new CustomerService(DB);
    const success = await customerService.create(validation.data);
    if (success) {
      return Response.json(
        {
          success: true,
          message: "Customer created successfully",
          data: { customer_id: success }
        },
        { status: 201 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Failed to create customer",
          errors: ["Database operation failed"]
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Customer creation error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create customer",
        errors: [error instanceof Error ? error.message : "Unknown error"]
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "customers:list");
const POST = withPerformanceMonitoring(postHandler, "customers:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=customers.astro.mjs.map
