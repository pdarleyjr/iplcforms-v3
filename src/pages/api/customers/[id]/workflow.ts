import { validateApiTokenResponse } from "@/lib/api";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import type { APIRoute } from "astro";

type Params = {
  id: string;
};

const postHandler: APIRoute = async ({ locals, request, params }) => {
  const { API_TOKEN, CUSTOMER_WORKFLOW } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const { id } = params;
  await CUSTOMER_WORKFLOW.create({ params: { id } });
  return new Response(null, { status: 202 });
};

export const POST = withPerformanceMonitoring(postHandler, 'customers-workflow:create');
