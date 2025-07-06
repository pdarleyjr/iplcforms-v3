import { CustomerService } from "@/lib/services/customer";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import type { APIContext, APIRoute } from "astro";

const getHandler: APIRoute = async (context: APIContext) => {
  const { id } = context.params;
  const { DB } = (context.locals as any).runtime.env;

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'customers');
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

  return Response.json({ customer: customer });
}

export const GET = withPerformanceMonitoring(getHandler, 'customers:get');
