globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SubscriptionService } from '../../../chunks/subscription_Dua9-wUJ.mjs';
import { a as authenticate, b as authorize } from '../../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../../chunks/rbac_vK5lyOl9.mjs';
import { w as withPerformanceMonitoring } from '../../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const getHandler = async (context) => {
  const { id } = context.params;
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "subscriptions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  if (!id) {
    return Response.json(
      { message: "Subscription ID is required" },
      { status: 400 }
    );
  }
  const subscriptionService = new SubscriptionService(DB);
  try {
    const subscription = await subscriptionService.getById(id);
    if (!subscription) {
      return Response.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }
    return Response.json({ subscription });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load subscription" },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "subscriptions:get");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
