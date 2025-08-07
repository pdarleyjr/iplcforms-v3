globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

class SSEPerformanceMonitor {
  metrics = /* @__PURE__ */ new Map();
  kv;
  constructor(kv) {
    this.kv = kv;
  }
  /**
   * Start monitoring a new SSE connection
   */
  startConnection(connectionId) {
    this.metrics.set(connectionId, {
      connectionId,
      startTime: Date.now(),
      bytesTransferred: 0,
      chunksTransferred: 0,
      errors: 0,
      pingsSent: 0,
      averageChunkSize: 0,
      peakChunkSize: 0
    });
  }
  /**
   * Record a data chunk being sent
   */
  recordChunk(connectionId, chunkSize) {
    const metric = this.metrics.get(connectionId);
    if (!metric) return;
    metric.bytesTransferred += chunkSize;
    metric.chunksTransferred++;
    metric.peakChunkSize = Math.max(metric.peakChunkSize, chunkSize);
    metric.averageChunkSize = metric.bytesTransferred / metric.chunksTransferred;
  }
  /**
   * Record a ping being sent
   */
  recordPing(connectionId) {
    const metric = this.metrics.get(connectionId);
    if (metric) {
      metric.pingsSent++;
    }
  }
  /**
   * Record an error
   */
  recordError(connectionId) {
    const metric = this.metrics.get(connectionId);
    if (metric) {
      metric.errors++;
    }
  }
  /**
   * End monitoring and calculate final metrics
   */
  async endConnection(connectionId) {
    const metric = this.metrics.get(connectionId);
    if (!metric) return null;
    metric.endTime = Date.now();
    metric.totalDuration = metric.endTime - metric.startTime;
    metric.throughput = metric.totalDuration > 0 ? metric.bytesTransferred / metric.totalDuration * 1e3 : 0;
    if (this.kv) {
      try {
        await this.kv.put(
          `sse_metrics:${connectionId}`,
          JSON.stringify(metric),
          { expirationTtl: 86400 }
          // Keep for 24 hours
        );
        await this.updateAggregateMetrics(metric);
      } catch (error) {
        console.error("Failed to store SSE metrics:", error);
      }
    }
    this.metrics.delete(connectionId);
    return metric;
  }
  /**
   * Update aggregate performance metrics
   */
  async updateAggregateMetrics(metric) {
    if (!this.kv) return;
    try {
      const aggregateKey = "sse_metrics:aggregate";
      const existing = await this.kv.get(aggregateKey, { type: "json" }) || {
        totalConnections: 0,
        totalBytes: 0,
        totalDuration: 0,
        totalErrors: 0,
        averageThroughput: 0,
        averageDuration: 0,
        peakThroughput: 0
      };
      existing.totalConnections++;
      existing.totalBytes += metric.bytesTransferred;
      existing.totalDuration += metric.totalDuration || 0;
      existing.totalErrors += metric.errors;
      existing.averageThroughput = (existing.averageThroughput * (existing.totalConnections - 1) + (metric.throughput || 0)) / existing.totalConnections;
      existing.averageDuration = existing.totalDuration / existing.totalConnections;
      existing.peakThroughput = Math.max(existing.peakThroughput, metric.throughput || 0);
      await this.kv.put(aggregateKey, JSON.stringify(existing));
    } catch (error) {
      console.error("Failed to update aggregate metrics:", error);
    }
  }
  /**
   * Get performance recommendations based on metrics
   */
  async getPerformanceRecommendations() {
    if (!this.kv) return [];
    try {
      const aggregate = await this.kv.get("sse_metrics:aggregate", { type: "json" });
      if (!aggregate) return [];
      const recommendations = [];
      if (aggregate.averageThroughput < 1e3) {
        recommendations.push("Consider increasing buffer size for better throughput");
      }
      if (aggregate.totalErrors / aggregate.totalConnections > 0.05) {
        recommendations.push("High error rate detected. Check network stability and error handling");
      }
      if (aggregate.averageDuration > 3e5) {
        recommendations.push("Long connection durations detected. Consider implementing connection recycling");
      }
      return recommendations;
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      return [];
    }
  }
  /**
   * Get current active connections count
   */
  getActiveConnections() {
    return this.metrics.size;
  }
  /**
   * Get metrics for a specific connection
   */
  getConnectionMetrics(connectionId) {
    return this.metrics.get(connectionId);
  }
}
let instance = null;
function getSSEPerformanceMonitor(kv) {
  if (!instance) {
    instance = new SSEPerformanceMonitor(kv);
  }
  return instance;
}

const GET = async ({ locals }) => {
  const env = locals.runtime.env;
  try {
    const user = locals.user;
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const monitor = getSSEPerformanceMonitor(env.CACHE_KV);
    const aggregateData = await env.CACHE_KV?.get("sse_metrics:aggregate", { type: "json" }) || {
      totalConnections: 0,
      totalBytes: 0,
      totalDuration: 0,
      totalErrors: 0,
      averageThroughput: 0,
      averageDuration: 0,
      peakThroughput: 0
    };
    const recentMetrics = [];
    const metricsKeys = await env.CACHE_KV?.list({ prefix: "sse_metrics:", limit: 100 });
    if (metricsKeys) {
      for (const key of metricsKeys.keys) {
        if (key.name !== "sse_metrics:aggregate") {
          const metric = await env.CACHE_KV.get(key.name, { type: "json" });
          if (metric) {
            recentMetrics.push(metric);
          }
        }
      }
    }
    recentMetrics.sort((a, b) => b.startTime - a.startTime);
    const recommendations = await monitor.getPerformanceRecommendations();
    const insights = {
      activeConnections: monitor.getActiveConnections(),
      averageChunkSize: aggregateData.totalBytes / Math.max(1, aggregateData.totalConnections),
      errorRate: aggregateData.totalConnections > 0 ? (aggregateData.totalErrors / aggregateData.totalConnections * 100).toFixed(2) + "%" : "0%",
      uptimeHours: 24
      // Metrics are kept for 24 hours
    };
    return new Response(JSON.stringify({
      aggregate: aggregateData,
      recent: recentMetrics.slice(0, 20),
      // Return last 20 connections
      insights,
      recommendations
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("SSE metrics error:", error);
    return new Response(JSON.stringify({
      error: "Failed to retrieve SSE metrics",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=sse-metrics.astro.mjs.map
