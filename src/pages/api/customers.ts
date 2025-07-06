import { CustomerService } from "@/lib/services/customer";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { CreateCustomerRequest, validateRequest, ApiResponseSchema } from "@/lib/schemas/api-validation";
import type { APIContext, APIRoute } from "astro";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async (context: APIContext) => {
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'customers');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const customerService = new CustomerService(DB);
  const customers = await customerService.getAll();

  if (customers) {
    return Response.json({ customers });
  } else {
    return Response.json(
      { message: "Couldn't load customers" },
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
  const authzMiddleware = authorize(PERMISSIONS.CREATE, 'customers');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  try {
    // Parse and validate request body with Zod
    const body = await context.request.json();
    const validation = validateRequest(CreateCustomerRequest, body);
    
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
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
        { status: 201 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Failed to create customer",
          errors: ["Database operation failed"]
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Customer creation error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create customer",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 }
    );
  }
};

export const GET = withPerformanceMonitoring(getHandler, 'customers:list');
export const POST = withPerformanceMonitoring(postHandler, 'customers:create');
