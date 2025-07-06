import type { APIContext, APIRoute } from "astro";
import { SubscriptionService } from "@/lib/services/subscription";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { validateRequest, CreateSubscriptionRequest } from "@/lib/schemas/api-validation";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async (context: APIContext) => {
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'subscriptions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const subscriptionService = new SubscriptionService(DB);

  try {
    const subscriptions = await subscriptionService.getAll();
    return Response.json({ subscriptions });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load subscriptions" },
      { status: 500 },
    );
  }
}

const postHandler: APIRoute = async (context: APIContext) => {
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.CREATE, 'subscriptions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const subscriptionService = new SubscriptionService(DB);

  try {
    const body = await context.request.json();
    
    // Validate request body using Zod schema
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
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create subscription",
        success: false,
      },
      { status: 500 },
    );
  }
}

export const GET = withPerformanceMonitoring(getHandler, 'subscriptions:list');
export const POST = withPerformanceMonitoring(postHandler, 'subscriptions:create');
