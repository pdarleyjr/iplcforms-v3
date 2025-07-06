import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import { PERMISSIONS } from "@/lib/utils/rbac";
import type { APIContext, APIRoute } from "astro";

type Params = {
  id: string;
};

const postHandler: APIRoute = async (context: APIContext) => {
  const { CUSTOMER_WORKFLOW } = (context.locals as any).runtime.env;
  
  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request - workflow creation requires MANAGE permission
  const authzMiddleware = authorize(PERMISSIONS.MANAGE, 'workflows');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  // Validate customer ID
  if (!context.params.id) {
    return new Response(JSON.stringify({ error: "Customer ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { id } = context.params;
  await CUSTOMER_WORKFLOW.create({ params: { id } });
  return new Response(null, { status: 202 });
};

export const POST = withPerformanceMonitoring(postHandler, 'customers-workflow:create');
