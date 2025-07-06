import { CustomerService } from "@/lib/services/customer";
import { validateApiTokenResponse } from "@/lib/api";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import type { APIRoute } from "astro";

const getHandler: APIRoute = async ({ locals, params, request }) => {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const customerService = new CustomerService(DB);
  const customer = await customerService.getById(id);

  if (!customer) {
    return Response.json({ message: "Customer not found" }, { status: 404 });
  }

  return Response.json({ customer: customer });
}

export const GET = withPerformanceMonitoring(getHandler, 'customers:get');
