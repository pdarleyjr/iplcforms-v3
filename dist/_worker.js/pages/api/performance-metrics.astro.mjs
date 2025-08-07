globalThis.process ??= {}; globalThis.process.env ??= {};
import { W as WorkersPerformanceManager } from '../../chunks/workers-performance_DPmskpeQ.mjs';
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    const authResult = await authenticate(context);
    if (authResult instanceof Response) return authResult;
    const authzMiddleware = authorize(PERMISSIONS.READ, "performance_metrics");
    const authzResult = await authzMiddleware(authResult);
    if (authzResult instanceof Response) return authzResult;
    const performanceManager = WorkersPerformanceManager.getInstance();
    const metrics = performanceManager.getAllMetrics();
    const metricsArray = Array.from(metrics.values());
    return new Response(JSON.stringify({
      success: true,
      metrics: metricsArray,
      count: metricsArray.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch performance metrics"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async (context) => {
  try {
    const authResult = await authenticate(context);
    if (authResult instanceof Response) return authResult;
    const authzMiddleware = authorize(PERMISSIONS.MANAGE, "performance_metrics");
    const authzResult = await authzMiddleware(authResult);
    if (authzResult instanceof Response) return authzResult;
    const body = await context.request.json();
    const { action } = body;
    const performanceManager = WorkersPerformanceManager.getInstance();
    switch (action) {
      case "clear":
        performanceManager.clearMetrics();
        return new Response(JSON.stringify({
          success: true,
          message: "Performance metrics cleared"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      case "export":
        if (context.locals.runtime?.env?.METRICS_KV) {
          const metrics = performanceManager.getAllMetrics();
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const kv = context.locals.runtime.env.METRICS_KV;
          await kv.put(
            `metrics-export-${timestamp}`,
            JSON.stringify(Array.from(metrics.entries())),
            { expirationTtl: 86400 * 7 }
            // Keep for 7 days
          );
          return new Response(JSON.stringify({
            success: true,
            message: "Metrics exported to KV storage",
            key: `metrics-export-${timestamp}`
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: "KV storage not available"
          }), {
            status: 501,
            headers: { "Content-Type": "application/json" }
          });
        }
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid action"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Error processing performance metrics action:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to process action"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=performance-metrics.astro.mjs.map
