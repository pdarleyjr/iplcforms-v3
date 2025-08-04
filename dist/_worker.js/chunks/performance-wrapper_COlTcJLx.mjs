globalThis.process ??= {}; globalThis.process.env ??= {};
import { W as WorkersPerformanceManager } from './workers-performance_DPmskpeQ.mjs';

function withPerformanceMonitoring(route, routeName) {
  return async (context) => {
    const performanceManager = WorkersPerformanceManager.getInstance();
    const startTime = Date.now();
    const method = context.request.method;
    const url = new URL(context.request.url);
    const pathname = url.pathname;
    const metricsKey = routeName || `${method} ${pathname}`;
    try {
      const response = await route(context);
      const duration = Date.now() - startTime;
      performanceManager.recordRequest(metricsKey, {
        requestId: crypto.randomUUID(),
        startTime,
        endTime: startTime + duration,
        duration,
        statusCode: response.status,
        responseSize: parseInt(response.headers.get("content-length") || "0", 10),
        cacheHits: response.headers.has("x-cache-hit") ? 1 : 0,
        cacheMisses: response.headers.has("x-cache-hit") ? 0 : 1,
        dbQueries: 0,
        dbDuration: 0,
        apiCalls: 0,
        apiDuration: 0,
        errors: 0
      });
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      performanceManager.recordRequest(metricsKey, {
        requestId: crypto.randomUUID(),
        startTime,
        endTime: startTime + duration,
        duration,
        statusCode: 500,
        responseSize: 0,
        cacheHits: 0,
        cacheMisses: 1,
        dbQueries: 0,
        dbDuration: 0,
        apiCalls: 0,
        apiDuration: 0,
        errors: 1
      });
      throw error;
    }
  };
}

export { withPerformanceMonitoring as w };
//# sourceMappingURL=performance-wrapper_COlTcJLx.mjs.map
