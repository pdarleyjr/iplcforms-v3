import type { APIRoute, APIContext } from 'astro';
import { WorkersPerformanceManager } from '../../lib/utils/workers-performance';
import { authenticate, authorize } from '../../lib/middleware/rbac-middleware';
import { PERMISSIONS } from '../../lib/utils/rbac';

export const GET: APIRoute = async (context: APIContext) => {
  try {
    // Authenticate request
    const authResult = await authenticate(context);
    if (authResult instanceof Response) return authResult;

    // Authorize request - only admin role can view performance metrics
    const authzMiddleware = authorize(PERMISSIONS.READ, 'performance_metrics');
    const authzResult = await authzMiddleware(authResult);
    if (authzResult instanceof Response) return authzResult;

    // Get metrics from performance manager
    const performanceManager = WorkersPerformanceManager.getInstance();
    const metrics = performanceManager.getAllMetrics();

    // Convert Map to array for JSON serialization
    const metricsArray = Array.from(metrics.values());

    return new Response(JSON.stringify({
      success: true,
      metrics: metricsArray,
      count: metricsArray.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch performance metrics'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async (context: APIContext) => {
  try {
    // Authenticate request
    const authResult = await authenticate(context);
    if (authResult instanceof Response) return authResult;

    // Authorize request - only admin role can manage performance metrics
    const authzMiddleware = authorize(PERMISSIONS.MANAGE, 'performance_metrics');
    const authzResult = await authzMiddleware(authResult);
    if (authzResult instanceof Response) return authzResult;

    const body = await context.request.json() as { action: string };
    const { action } = body;

    const performanceManager = WorkersPerformanceManager.getInstance();

    switch (action) {
      case 'clear':
        // Clear all metrics
        performanceManager.clearMetrics();
        return new Response(JSON.stringify({
          success: true,
          message: 'Performance metrics cleared'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'export':
        // Export metrics to KV storage if available
        if ((context.locals as any).runtime?.env?.METRICS_KV) {
          const metrics = performanceManager.getAllMetrics();
          const timestamp = new Date().toISOString();
          // Type assertion for KV namespace
          const kv = (context.locals as any).runtime.env.METRICS_KV as any;
          await kv.put(
            `metrics-export-${timestamp}`,
            JSON.stringify(Array.from(metrics.entries())),
            { expirationTtl: 86400 * 7 } // Keep for 7 days
          );
          return new Response(JSON.stringify({
            success: true,
            message: 'Metrics exported to KV storage',
            key: `metrics-export-${timestamp}`
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: 'KV storage not available'
          }), {
            status: 501,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error processing performance metrics action:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process action'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};