import { CustomerService } from "@/lib/services/customer";
import { validateApiTokenResponse } from "@/lib/api";
import { CreateCustomerRequest, validateRequest, ApiResponseSchema } from "@/lib/schemas/api-validation";
import type { APIRoute } from "astro";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async ({ locals, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

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

const postHandler: APIRoute = async ({ locals, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  try {
    // Parse and validate request body with Zod
    const body = await request.json();
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
