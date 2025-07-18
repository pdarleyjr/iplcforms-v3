import { CustomerSubscriptionService } from "@/lib/services/customer_subscription";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import {
  CreateCustomerSubscriptionRequest,
  PaginationSchema,
  validateRequest,
  validateQueryParams
} from "@/lib/schemas/api-validation";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import type { APIContext, APIRoute } from "astro";

const getHandler: APIRoute = async (context: APIContext) => {
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'customer_subscriptions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  // Validate query parameters
  const url = new URL(context.request.url);
  const queryValidation = validateQueryParams(url, PaginationSchema.partial());
  if (!queryValidation.success) {
    return Response.json(
      {
        message: "Invalid query parameters",
        errors: queryValidation.errors
      },
      { status: 400 }
    );
  }

  try {
    const customerSubscriptionService = new CustomerSubscriptionService(DB);
    const customerSubscriptions = await customerSubscriptionService.getAll();

    return Response.json({
      customer_subscriptions: customerSubscriptions,
    });
  } catch (error) {
    console.error('Error loading customer subscriptions:', error);
    return Response.json(
      { message: "Couldn't load customer subscriptions" },
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
  const authzMiddleware = authorize(PERMISSIONS.CREATE, 'customer_subscriptions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  try {
    // Parse and validate request body with Zod
    const body = await context.request.json();
    const bodyValidation = validateRequest(CreateCustomerSubscriptionRequest, body);
    
    if (!bodyValidation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: bodyValidation.errors,
        },
        { status: 400 }
      );
    }

    const customerSubscriptionService = new CustomerSubscriptionService(DB);
    // Transform validated data to match service interface
    const serviceData = {
      customer_id: bodyValidation.data.customer_id,
      subscription_id: bodyValidation.data.subscription_id,
      status: bodyValidation.data.status,
      start_date: bodyValidation.data.subscription_starts_at,
      end_date: bodyValidation.data.subscription_ends_at
    };

    const response = await customerSubscriptionService.create(serviceData);

    if (response.success) {
      return Response.json(
        { message: "Customer subscription created successfully", success: true },
        { status: 201 },
      );
    } else {
      return Response.json(
        { message: "Couldn't create customer subscription", success: false },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error creating customer subscription:', error);
    return Response.json(
      { message: "Couldn't create customer subscription", success: false },
      { status: 500 },
    );
  }
}

export const GET = withPerformanceMonitoring(getHandler, 'customer-subscriptions:list');
export const POST = withPerformanceMonitoring(postHandler, 'customer-subscriptions:create');
