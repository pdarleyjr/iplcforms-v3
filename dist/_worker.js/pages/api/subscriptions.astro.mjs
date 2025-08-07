globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SubscriptionService } from '../../chunks/subscription_Dua9-wUJ.mjs';
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
import { a as validateRequest, g as CreateSubscriptionRequest } from '../../chunks/api-validation_BmEG2mSm.mjs';
import { w as withPerformanceMonitoring } from '../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const getHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "subscriptions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const subscriptionService = new SubscriptionService(DB);
  try {
    const subscriptions = await subscriptionService.getAll();
    return Response.json({ subscriptions });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load subscriptions" },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.CREATE, "subscriptions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const subscriptionService = new SubscriptionService(DB);
  try {
    const body = await context.request.json();
    const validation = validateRequest(CreateSubscriptionRequest, body);
    if (!validation.success) {
      return Response.json(
        {
          message: "Invalid request data",
          errors: validation.errors
        },
        { status: 400 }
      );
    }
    await subscriptionService.create(validation.data);
    return Response.json(
      {
        message: "Subscription created successfully",
        success: true
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create subscription",
        success: false
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "subscriptions:list");
const POST = withPerformanceMonitoring(postHandler, "subscriptions:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=subscriptions.astro.mjs.map
