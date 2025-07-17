/**
 * Workers Performance Utilities
 * Provides performance optimization, monitoring, and caching for Cloudflare Workers
 */

import { getD1Manager } from '../services/d1-connection-manager';

// Define global KV namespace types - using interface to avoid redeclaration
declare global {
  interface CloudflareWorkerGlobalScope {
    METRICS_KV?: KVNamespace;
    CACHE_KV?: KVNamespace;
  }
}

export interface PerformanceMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  cpuTime?: number;
  memoryUsage?: number;
  cacheHits: number;
  cacheMisses: number;
  dbQueries: number;
  dbDuration: number;
  apiCalls: number;
  apiDuration: number;
  errors: number;
  statusCode?: number;
  responseSize?: number;
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  bypassCache?: boolean;
  cacheKey?: string;
  cacheControl?: string;
}

export interface PerformanceConfig {
  enableMetrics?: boolean;
  enableCaching?: boolean;
  enableCompression?: boolean;
  enableRequestCoalescing?: boolean;
  metricsNamespace?: string;
  cacheName?: string;
}

/**
 * Workers Performance Manager
 * Singleton pattern for consistent performance optimization across the application
 */
export class WorkersPerformanceManager {
  private static instance: WorkersPerformanceManager;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private requestCoalescing: Map<string, Promise<Response>> = new Map();
  private config: PerformanceConfig;
  private cache: Cache | null = null;

  private constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableMetrics: true,
      enableCaching: true,
      enableCompression: true,
      enableRequestCoalescing: true,
      metricsNamespace: 'iplcforms',
      cacheName: 'performance-cache',
      ...config
    };
  }

  static getInstance(config?: PerformanceConfig): WorkersPerformanceManager {
    if (!WorkersPerformanceManager.instance) {
      WorkersPerformanceManager.instance = new WorkersPerformanceManager(config);
    }
    return WorkersPerformanceManager.instance;
  }

  /**
   * Initialize performance tracking for a request
   */
  async initializeRequest(requestId: string): Promise<void> {
    if (!this.config.enableMetrics) return;

    this.metrics.set(requestId, {
      requestId,
      startTime: Date.now(),
      cacheHits: 0,
      cacheMisses: 0,
      dbQueries: 0,
      dbDuration: 0,
      apiCalls: 0,
      apiDuration: 0,
      errors: 0
    });

    // Initialize cache if enabled
    if (this.config.enableCaching && !this.cache) {
      this.cache = await caches.open(this.config.cacheName!);
    }
  }

  /**
   * Finalize performance tracking for a request
   */
  async finalizeRequest(requestId: string): Promise<PerformanceMetrics | null> {
    if (!this.config.enableMetrics) return null;

    const metrics = this.metrics.get(requestId);
    if (!metrics) return null;

    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;

    // Store metrics in KV if available
    try {
      if ((globalThis as any).METRICS_KV) {
        await (globalThis as any).METRICS_KV.put(
          `metrics:${requestId}`,
          JSON.stringify(metrics),
          { expirationTtl: 86400 } // 24 hours
        );
      }
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }

    // Clean up
    this.metrics.delete(requestId);
    return metrics;
  }

  /**
   * Cache-aware fetch with automatic optimization
   */
  async cachedFetch(
    request: Request | string,
    options: CacheOptions = {}
  ): Promise<Response> {
    if (!this.config.enableCaching || options.bypassCache) {
      return fetch(request);
    }

    const req = typeof request === 'string' ? new Request(request) : request;
    const cacheKey = options.cacheKey || req.url;
    
    // Check cache first
    const cachedResponse = this.cache ? await this.cache.match(req) : null;
    if (cachedResponse) {
      this.recordCacheHit(req.url);
      return cachedResponse;
    }

    this.recordCacheMiss(req.url);

    // Request coalescing - prevent duplicate requests
    if (this.config.enableRequestCoalescing) {
      const existingRequest = this.requestCoalescing.get(cacheKey);
      if (existingRequest) {
        return existingRequest.then(r => r.clone());
      }
    }

    // Make the request
    const fetchPromise = fetch(req).then(async (response) => {
      // Only cache successful responses
      if (response.ok && req.method === 'GET') {
        const headers = new Headers(response.headers);
        
        // Set cache control headers
        if (options.cacheControl) {
          headers.set('Cache-Control', options.cacheControl);
        } else if (options.ttl) {
          headers.set('Cache-Control', `public, max-age=${options.ttl}`);
        }

        // Add cache tags if provided
        if (options.tags && options.tags.length > 0) {
          headers.set('Cache-Tag', options.tags.join(','));
        }

        // Clone response for caching
        const responseToCache = new Response(response.clone().body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });

        // Store in cache
        if (this.cache) {
          await this.cache.put(req, responseToCache);
        }
      }

      // Clean up request coalescing
      this.requestCoalescing.delete(cacheKey);
      
      return response;
    }).catch((error) => {
      this.requestCoalescing.delete(cacheKey);
      throw error;
    });

    // Store promise for request coalescing
    if (this.config.enableRequestCoalescing) {
      this.requestCoalescing.set(cacheKey, fetchPromise);
    }

    return fetchPromise;
  }

  /**
   * Optimize database queries with performance tracking
   */
  async optimizedQuery<T>(
    queryFn: () => Promise<T>,
    queryKey: string,
    options: CacheOptions = {}
  ): Promise<T> {
    const requestId = this.getCurrentRequestId();
    const startTime = Date.now();

    try {
      // Check if we can use cached result
      if (this.config.enableCaching && !options.bypassCache) {
        const cacheKey = `query:${queryKey}`;
        const cached = await this.getFromCache(cacheKey);
        if (cached) {
          this.recordCacheHit(cacheKey);
          return cached as T;
        }
        this.recordCacheMiss(cacheKey);
      }

      // Execute query
      const result = await queryFn();
      const duration = Date.now() - startTime;

      // Record metrics
      if (requestId) {
        const metrics = this.metrics.get(requestId);
        if (metrics) {
          metrics.dbQueries++;
          metrics.dbDuration += duration;
        }
      }

      // Cache result if enabled
      if (this.config.enableCaching && options.ttl) {
        await this.setInCache(`query:${queryKey}`, result, options.ttl);
      }

      return result;
    } catch (error) {
      this.recordError(requestId, 'database', String(error));
      throw error;
    }
  }

  /**
   * Compress response if beneficial
   */
  async compressResponse(response: Response): Promise<Response> {
    if (!this.config.enableCompression) return response;

    const contentType = response.headers.get('content-type') || '';
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

    // Only compress text-based content over 1KB
    if (
      contentLength > 1024 &&
      (contentType.includes('text/') ||
       contentType.includes('application/json') ||
       contentType.includes('application/javascript'))
    ) {
      const headers = new Headers(response.headers);
      headers.set('content-encoding', 'gzip');
      headers.delete('content-length'); // Will be recalculated

      const compressed = await this.gzipCompress(await response.arrayBuffer());
      
      return new Response(compressed, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return response;
  }

  /**
   * Performance-optimized response builder
   */
  buildOptimizedResponse(
    data: any,
    options: {
      status?: number;
      headers?: HeadersInit;
      compress?: boolean;
      cache?: CacheOptions;
    } = {}
  ): Response {
    const headers = new Headers(options.headers || {});
    
    // Set performance-related headers
    headers.set('X-Response-Time', Date.now().toString());
    headers.set('X-Cache-Status', 'MISS'); // Will be overridden if cached
    
    // Add cache control headers
    if (options.cache?.cacheControl) {
      headers.set('Cache-Control', options.cache.cacheControl);
    } else if (options.cache?.ttl) {
      headers.set('Cache-Control', `public, max-age=${options.cache.ttl}`);
    }

    // Set content type if not already set
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    const body = typeof data === 'string' ? data : JSON.stringify(data);
    
    return new Response(body, {
      status: options.status || 200,
      headers
    });
  }

  /**
   * Batch API calls for performance
   */
  async batchApiCalls<T>(
    calls: Array<() => Promise<T>>
  ): Promise<T[]> {
    const requestId = this.getCurrentRequestId();
    const startTime = Date.now();
    
    try {
      const results = await Promise.all(
        calls.map(call => 
          call().catch(error => {
            this.recordError(requestId, 'api', String(error));
            throw error;
          })
        )
      );

      const duration = Date.now() - startTime;
      if (requestId) {
        const metrics = this.metrics.get(requestId);
        if (metrics) {
          metrics.apiCalls += calls.length;
          metrics.apiDuration += duration;
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current performance metrics for a specific request
   */
  getMetrics(requestId: string): PerformanceMetrics | undefined {
    return this.metrics.get(requestId);
  }

  /**
   * Get all current performance metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  /**
   /**
    * Clear all metrics
    */
   clearMetrics(): void {
     this.metrics.clear();
   }
 
   /**
    * Record a request with performance metrics
    * This is an alias for recordMetrics to maintain backward compatibility
    */
   recordRequest(name: string, metrics: PerformanceMetrics): void {
     this.metrics.set(name, metrics);
   }
  /**
   * Clear cache by pattern or tags
   */
  async clearCache(options: {
    pattern?: string;
    tags?: string[];
  } = {}): Promise<void> {
    if (!this.config.enableCaching) return;

    // For pattern-based clearing
    if (options.pattern) {
      // This would require iterating through cache keys
      // Cloudflare Workers Cache API doesn't support listing keys
      // So we'd need to maintain a key index in KV
      console.warn('Pattern-based cache clearing not fully implemented');
    }

    // For tag-based clearing (requires Cloudflare API)
    if (options.tags && options.tags.length > 0) {
      // This would require using Cloudflare's purge by tag API
      console.warn('Tag-based cache clearing requires Cloudflare API integration');
    }
  }

  // Private helper methods
  private getCurrentRequestId(): string | null {
    // In a real implementation, this would get the request ID from context
    // For now, return the first metrics entry
    return this.metrics.keys().next().value || null;
  }

  private recordCacheHit(key: string): void {
    const requestId = this.getCurrentRequestId();
    if (requestId) {
      const metrics = this.metrics.get(requestId);
      if (metrics) metrics.cacheHits++;
    }
  }

  private recordCacheMiss(key: string): void {
    const requestId = this.getCurrentRequestId();
    if (requestId) {
      const metrics = this.metrics.get(requestId);
      if (metrics) metrics.cacheMisses++;
    }
  }

  private recordError(requestId: string | null, type: string, message: string): void {
    if (!requestId) return;
    
    const metrics = this.metrics.get(requestId);
    if (metrics) {
      metrics.errors++;
    }
  }

  private async getFromCache(key: string): Promise<any> {
    try {
      if ((globalThis as any).CACHE_KV) {
        const cached = await (globalThis as any).CACHE_KV.get(key, 'json');
        return cached;
      }
    } catch (error) {
      console.error('Cache get error:', error);
    }
    return null;
  }

  private async setInCache(key: string, value: any, ttl: number): Promise<void> {
    try {
      if ((globalThis as any).CACHE_KV) {
        await (globalThis as any).CACHE_KV.put(
          key,
          JSON.stringify(value),
          { expirationTtl: ttl }
        );
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  private async gzipCompress(data: ArrayBuffer): Promise<ArrayBuffer> {
    // Use CompressionStream if available (requires Workers compatibility flag)
    if (typeof CompressionStream !== 'undefined') {
      const cs = new CompressionStream('gzip');
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();
      
      const chunks: Uint8Array[] = [];
      const reader = cs.readable.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      return result.buffer;
    }
    
    // Fallback: return uncompressed
    return data;
  }
}

/**
 * Performance monitoring middleware for API routes
 */
export function withPerformanceMonitoring(
  handler: (request: Request, env: any, ctx: any) => Promise<Response>
) {
  return async (request: Request, env: any, ctx: any): Promise<Response> => {
    const perfManager = WorkersPerformanceManager.getInstance();
    const requestId = crypto.randomUUID();
    
    await perfManager.initializeRequest(requestId);
    
    try {
      const response = await handler(request, env, ctx);
      
      // Add performance headers
      const metrics = await perfManager.finalizeRequest(requestId);
      if (metrics) {
        response.headers.set('X-Request-ID', requestId);
        response.headers.set('X-Response-Time', metrics.duration?.toString() || '0');
        response.headers.set('X-Cache-Hits', metrics.cacheHits.toString());
        response.headers.set('X-DB-Queries', metrics.dbQueries.toString());
      }
      
      return response;
    } catch (error) {
      await perfManager.finalizeRequest(requestId);
      throw error;
    }
  };
}

/**
 * Request deduplication for identical concurrent requests
 */
export class RequestDeduplicator {
  private inFlightRequests: Map<string, Promise<any>> = new Map();
  
  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const existing = this.inFlightRequests.get(key);
    if (existing) {
      return existing as Promise<T>;
    }
    
    const promise = requestFn().finally(() => {
      this.inFlightRequests.delete(key);
    });
    
    this.inFlightRequests.set(key, promise);
    return promise;
  }
}

/**
 * Performance utilities
 */
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  async measureTime<T>(
    fn: () => Promise<T>,
    label: string
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    
    console.log(`[Performance] ${label}: ${duration}ms`);
    return { result, duration };
  },

  /**
   * Create a performance-optimized API response
   */
  createOptimizedResponse(
    data: any,
    options: {
      cacheControl?: string;
      tags?: string[];
      compress?: boolean;
    } = {}
  ): Response {
    const perfManager = WorkersPerformanceManager.getInstance();
    return perfManager.buildOptimizedResponse(data, {
      cache: {
        cacheControl: options.cacheControl,
        tags: options.tags
      },
      compress: options.compress
    });
  },

  /**
   * Batch database operations for performance
   */
  async batchDatabaseOps<T>(
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    // Execute operations in parallel for performance
    // Note: D1 doesn't support traditional transactions yet
    // This executes operations concurrently for speed
    return Promise.all(operations.map(op => op()));
  }
};

// Export singleton instance
export const performanceManager = WorkersPerformanceManager.getInstance();