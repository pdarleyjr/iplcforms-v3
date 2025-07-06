import type { APIRoute } from 'astro';
import { WorkersPerformanceManager } from './workers-performance';

/**
 * Higher-order function to wrap API routes with performance monitoring
 * @param route The API route handler to wrap
 * @param routeName Optional name for the route (defaults to route function name)
 * @returns Wrapped API route with performance monitoring
 */
export function withPerformanceMonitoring(
  route: APIRoute,
  routeName?: string
): APIRoute {
  return async (context) => {
    const performanceManager = WorkersPerformanceManager.getInstance();
    const startTime = Date.now();
    const method = context.request.method;
    const url = new URL(context.request.url);
    const pathname = url.pathname;
    
    // Generate a unique key for this route
    const metricsKey = routeName || `${method} ${pathname}`;
    
    try {
      // Call the original route handler
      const response = await route(context);
      
      // Record performance metrics
      const duration = Date.now() - startTime;
      performanceManager.recordRequest(metricsKey, {
        requestId: crypto.randomUUID(),
        startTime,
        endTime: startTime + duration,
        duration,
        statusCode: response.status,
        responseSize: parseInt(response.headers.get('content-length') || '0', 10),
        cacheHits: response.headers.has('x-cache-hit') ? 1 : 0,
        cacheMisses: response.headers.has('x-cache-hit') ? 0 : 1,
        dbQueries: 0,
        dbDuration: 0,
        apiCalls: 0,
        apiDuration: 0,
        errors: 0
      });
      
      return response;
    } catch (error) {
      // Record error metrics
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
      
      // Re-throw the error to maintain original error handling
      throw error;
    }
  };
}

/**
 * Batch wrap multiple API routes with performance monitoring
 * @param routes Object containing route handlers
 * @param prefix Optional prefix for route names
 * @returns Object with wrapped route handlers
 */
export function withPerformanceMonitoringBatch<T extends Record<string, APIRoute>>(
  routes: T,
  prefix?: string
): T {
  const wrappedRoutes = {} as T;
  
  for (const [key, route] of Object.entries(routes)) {
    const routeName = prefix ? `${prefix}:${key}` : key;
    wrappedRoutes[key as keyof T] = withPerformanceMonitoring(route, routeName) as T[keyof T];
  }
  
  return wrappedRoutes;
}

/**
 * Middleware to add performance headers to responses
 * @param response The response object
 * @param metrics Performance metrics for the request
 * @returns Response with performance headers
 */
export function addPerformanceHeaders(
  response: Response,
  metrics: {
    duration: number;
    cacheHit: boolean;
    edgeLocation: string;
  }
): Response {
  const headers = new Headers(response.headers);
  
  // Add Server-Timing header for performance insights
  headers.set('Server-Timing', `total;dur=${metrics.duration}`);
  
  // Add custom performance headers
  headers.set('X-Response-Time', `${metrics.duration}ms`);
  if (metrics.cacheHit) {
    headers.set('X-Cache-Hit', 'true');
  }
  headers.set('X-Edge-Location', metrics.edgeLocation);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Utility to measure async operation performance
 * @param operation The async operation to measure
 * @param operationName Name for logging/metrics
 * @returns Result of the operation
 */
export async function measureAsyncOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const performanceManager = WorkersPerformanceManager.getInstance();
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    
    // Record as a sub-operation
    performanceManager.recordRequest(`async:${operationName}`, {
      requestId: crypto.randomUUID(),
      startTime,
      endTime: startTime + duration,
      duration,
      statusCode: 200,
      responseSize: 0,
      cacheHits: 0,
      cacheMisses: 0,
      dbQueries: 0,
      dbDuration: 0,
      apiCalls: 0,
      apiDuration: 0,
      errors: 0
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Record error
    performanceManager.recordRequest(`async:${operationName}`, {
      requestId: crypto.randomUUID(),
      startTime,
      endTime: startTime + duration,
      duration,
      statusCode: 500,
      responseSize: 0,
      cacheHits: 0,
      cacheMisses: 0,
      dbQueries: 0,
      dbDuration: 0,
      apiCalls: 0,
      apiDuration: 0,
      errors: 1
    });
    
    throw error;
  }
}