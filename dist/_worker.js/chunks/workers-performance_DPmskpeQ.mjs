globalThis.process ??= {}; globalThis.process.env ??= {};
class WorkersPerformanceManager {
  static instance;
  metrics = /* @__PURE__ */ new Map();
  requestCoalescing = /* @__PURE__ */ new Map();
  config;
  cache = null;
  constructor(config = {}) {
    this.config = {
      enableMetrics: true,
      enableCaching: true,
      enableCompression: true,
      enableRequestCoalescing: true,
      metricsNamespace: "iplcforms",
      cacheName: "performance-cache",
      ...config
    };
  }
  static getInstance(config) {
    if (!WorkersPerformanceManager.instance) {
      WorkersPerformanceManager.instance = new WorkersPerformanceManager(config);
    }
    return WorkersPerformanceManager.instance;
  }
  /**
   * Initialize performance tracking for a request
   */
  async initializeRequest(requestId) {
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
    if (this.config.enableCaching && !this.cache) {
      this.cache = await caches.open(this.config.cacheName);
    }
  }
  /**
   * Finalize performance tracking for a request
   */
  async finalizeRequest(requestId) {
    if (!this.config.enableMetrics) return null;
    const metrics = this.metrics.get(requestId);
    if (!metrics) return null;
    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    try {
      if (globalThis.METRICS_KV) {
        await globalThis.METRICS_KV.put(
          `metrics:${requestId}`,
          JSON.stringify(metrics),
          { expirationTtl: 86400 }
          // 24 hours
        );
      }
    } catch (error) {
      console.error("Failed to store metrics:", error);
    }
    this.metrics.delete(requestId);
    return metrics;
  }
  /**
   * Cache-aware fetch with automatic optimization
   */
  async cachedFetch(request, options = {}) {
    if (!this.config.enableCaching || options.bypassCache) {
      return fetch(request);
    }
    const req = typeof request === "string" ? new Request(request) : request;
    const cacheKey = options.cacheKey || req.url;
    const cachedResponse = this.cache ? await this.cache.match(req) : null;
    if (cachedResponse) {
      this.recordCacheHit(req.url);
      return cachedResponse;
    }
    this.recordCacheMiss(req.url);
    if (this.config.enableRequestCoalescing) {
      const existingRequest = this.requestCoalescing.get(cacheKey);
      if (existingRequest) {
        return existingRequest.then((r) => r.clone());
      }
    }
    const fetchPromise = fetch(req).then(async (response) => {
      if (response.ok && req.method === "GET") {
        const headers = new Headers(response.headers);
        if (options.cacheControl) {
          headers.set("Cache-Control", options.cacheControl);
        } else if (options.ttl) {
          headers.set("Cache-Control", `public, max-age=${options.ttl}`);
        }
        if (options.tags && options.tags.length > 0) {
          headers.set("Cache-Tag", options.tags.join(","));
        }
        const responseToCache = new Response(response.clone().body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
        if (this.cache) {
          await this.cache.put(req, responseToCache);
        }
      }
      this.requestCoalescing.delete(cacheKey);
      return response;
    }).catch((error) => {
      this.requestCoalescing.delete(cacheKey);
      throw error;
    });
    if (this.config.enableRequestCoalescing) {
      this.requestCoalescing.set(cacheKey, fetchPromise);
    }
    return fetchPromise;
  }
  /**
   * Optimize database queries with performance tracking
   */
  async optimizedQuery(queryFn, queryKey, options = {}) {
    const requestId = this.getCurrentRequestId();
    const startTime = Date.now();
    try {
      if (this.config.enableCaching && !options.bypassCache) {
        const cacheKey = `query:${queryKey}`;
        const cached = await this.getFromCache(cacheKey);
        if (cached) {
          this.recordCacheHit(cacheKey);
          return cached;
        }
        this.recordCacheMiss(cacheKey);
      }
      const result = await queryFn();
      const duration = Date.now() - startTime;
      if (requestId) {
        const metrics = this.metrics.get(requestId);
        if (metrics) {
          metrics.dbQueries++;
          metrics.dbDuration += duration;
        }
      }
      if (this.config.enableCaching && options.ttl) {
        await this.setInCache(`query:${queryKey}`, result, options.ttl);
      }
      return result;
    } catch (error) {
      this.recordError(requestId, "database", String(error));
      throw error;
    }
  }
  /**
   * Compress response if beneficial
   */
  async compressResponse(response) {
    if (!this.config.enableCompression) return response;
    const contentType = response.headers.get("content-type") || "";
    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > 1024 && (contentType.includes("text/") || contentType.includes("application/json") || contentType.includes("application/javascript"))) {
      const headers = new Headers(response.headers);
      headers.set("content-encoding", "gzip");
      headers.delete("content-length");
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
  buildOptimizedResponse(data, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("X-Response-Time", Date.now().toString());
    headers.set("X-Cache-Status", "MISS");
    if (options.cache?.cacheControl) {
      headers.set("Cache-Control", options.cache.cacheControl);
    } else if (options.cache?.ttl) {
      headers.set("Cache-Control", `public, max-age=${options.cache.ttl}`);
    }
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    const body = typeof data === "string" ? data : JSON.stringify(data);
    return new Response(body, {
      status: options.status || 200,
      headers
    });
  }
  /**
   * Batch API calls for performance
   */
  async batchApiCalls(calls) {
    const requestId = this.getCurrentRequestId();
    const startTime = Date.now();
    try {
      const results = await Promise.all(
        calls.map(
          (call) => call().catch((error) => {
            this.recordError(requestId, "api", String(error));
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
  getMetrics(requestId) {
    return this.metrics.get(requestId);
  }
  /**
   * Get all current performance metrics
   */
  getAllMetrics() {
    return new Map(this.metrics);
  }
  /**
   /**
    * Clear all metrics
    */
  clearMetrics() {
    this.metrics.clear();
  }
  /**
   * Record a request with performance metrics
   * This is an alias for recordMetrics to maintain backward compatibility
   */
  recordRequest(name, metrics) {
    this.metrics.set(name, metrics);
  }
  /**
   * Clear cache by pattern or tags
   */
  async clearCache(options = {}) {
    if (!this.config.enableCaching) return;
    if (options.pattern) {
      console.warn("Pattern-based cache clearing not fully implemented");
    }
    if (options.tags && options.tags.length > 0) {
      console.warn("Tag-based cache clearing requires Cloudflare API integration");
    }
  }
  // Private helper methods
  getCurrentRequestId() {
    return this.metrics.keys().next().value || null;
  }
  recordCacheHit(key) {
    const requestId = this.getCurrentRequestId();
    if (requestId) {
      const metrics = this.metrics.get(requestId);
      if (metrics) metrics.cacheHits++;
    }
  }
  recordCacheMiss(key) {
    const requestId = this.getCurrentRequestId();
    if (requestId) {
      const metrics = this.metrics.get(requestId);
      if (metrics) metrics.cacheMisses++;
    }
  }
  recordError(requestId, type, message) {
    if (!requestId) return;
    const metrics = this.metrics.get(requestId);
    if (metrics) {
      metrics.errors++;
    }
  }
  async getFromCache(key) {
    try {
      if (globalThis.CACHE_KV) {
        const cached = await globalThis.CACHE_KV.get(key, "json");
        return cached;
      }
    } catch (error) {
      console.error("Cache get error:", error);
    }
    return null;
  }
  async setInCache(key, value, ttl) {
    try {
      if (globalThis.CACHE_KV) {
        await globalThis.CACHE_KV.put(
          key,
          JSON.stringify(value),
          { expirationTtl: ttl }
        );
      }
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }
  async gzipCompress(data) {
    if (typeof CompressionStream !== "undefined") {
      const cs = new CompressionStream("gzip");
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();
      const chunks = [];
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
    return data;
  }
}
WorkersPerformanceManager.getInstance();

export { WorkersPerformanceManager as W };
//# sourceMappingURL=workers-performance_DPmskpeQ.mjs.map
