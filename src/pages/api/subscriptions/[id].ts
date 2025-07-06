import type { APIContext, APIRoute } from "astro";
import { SubscriptionService } from "@/lib/services/subscription";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async (context: APIContext) => {
  const { id } = context.params;
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'subscriptions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  if (!id) {
    return Response.json(
      { message: "Subscription ID is required" },
      { status: 400 },
    );
  }

  const subscriptionService = new SubscriptionService(DB);

  try {
    const subscription = await subscriptionService.getById(id);

    if (!subscription) {
      return Response.json(
        { message: "Subscription not found" },
        { status: 404 },
      );
    }

    return Response.json({ subscription });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load subscription" },
      { status: 500 },
    );
  }
};

export const GET = withPerformanceMonitoring(getHandler, 'subscriptions:get');
