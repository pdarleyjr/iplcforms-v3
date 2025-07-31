/**
 * SSE Performance Monitoring Utility
 * Tracks streaming performance metrics and provides optimization insights
 */

interface SSEMetrics {
  connectionId: string;
  startTime: number;
  endTime?: number;
  bytesTransferred: number;
  chunksTransferred: number;
  errors: number;
  pingsSent: number;
  averageChunkSize: number;
  peakChunkSize: number;
  totalDuration?: number;
  throughput?: number; // bytes per second
}

export class SSEPerformanceMonitor {
  private metrics: Map<string, SSEMetrics> = new Map();
  private kv?: KVNamespace;

  constructor(kv?: KVNamespace) {
    this.kv = kv;
  }

  /**
   * Start monitoring a new SSE connection
   */
  startConnection(connectionId: string): void {
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
  recordChunk(connectionId: string, chunkSize: number): void {
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
  recordPing(connectionId: string): void {
    const metric = this.metrics.get(connectionId);
    if (metric) {
      metric.pingsSent++;
    }
  }

  /**
   * Record an error
   */
  recordError(connectionId: string): void {
    const metric = this.metrics.get(connectionId);
    if (metric) {
      metric.errors++;
    }
  }

  /**
   * End monitoring and calculate final metrics
   */
  async endConnection(connectionId: string): Promise<SSEMetrics | null> {
    const metric = this.metrics.get(connectionId);
    if (!metric) return null;

    metric.endTime = Date.now();
    metric.totalDuration = metric.endTime - metric.startTime;
    metric.throughput = metric.totalDuration > 0 
      ? (metric.bytesTransferred / metric.totalDuration) * 1000 
      : 0;

    // Store metrics in KV for analysis
    if (this.kv) {
      try {
        await this.kv.put(
          `sse_metrics:${connectionId}`,
          JSON.stringify(metric),
          { expirationTtl: 86400 } // Keep for 24 hours
        );

        // Update aggregate metrics
        await this.updateAggregateMetrics(metric);
      } catch (error) {
        console.error('Failed to store SSE metrics:', error);
      }
    }

    this.metrics.delete(connectionId);
    return metric;
  }

  /**
   * Update aggregate performance metrics
   */
  private async updateAggregateMetrics(metric: SSEMetrics): Promise<void> {
    if (!this.kv) return;

    try {
      const aggregateKey = 'sse_metrics:aggregate';
      const existing = await this.kv.get(aggregateKey, { type: 'json' }) as any || {
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
      existing.averageThroughput = 
        (existing.averageThroughput * (existing.totalConnections - 1) + (metric.throughput || 0)) / 
        existing.totalConnections;
      existing.averageDuration = existing.totalDuration / existing.totalConnections;
      existing.peakThroughput = Math.max(existing.peakThroughput, metric.throughput || 0);

      await this.kv.put(aggregateKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to update aggregate metrics:', error);
    }
  }

  /**
   * Get performance recommendations based on metrics
   */
  async getPerformanceRecommendations(): Promise<string[]> {
    if (!this.kv) return [];

    try {
      const aggregate = await this.kv.get('sse_metrics:aggregate', { type: 'json' }) as any;
      if (!aggregate) return [];

      const recommendations: string[] = [];

      // Check average throughput
      if (aggregate.averageThroughput < 1000) { // Less than 1KB/s
        recommendations.push('Consider increasing buffer size for better throughput');
      }

      // Check error rate
      if (aggregate.totalErrors / aggregate.totalConnections > 0.05) { // More than 5% error rate
        recommendations.push('High error rate detected. Check network stability and error handling');
      }

      // Check average duration
      if (aggregate.averageDuration > 300000) { // More than 5 minutes
        recommendations.push('Long connection durations detected. Consider implementing connection recycling');
      }

      return recommendations;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  /**
   * Get current active connections count
   */
  getActiveConnections(): number {
    return this.metrics.size;
  }

  /**
   * Get metrics for a specific connection
   */
  getConnectionMetrics(connectionId: string): SSEMetrics | undefined {
    return this.metrics.get(connectionId);
  }
}

// Singleton instance
let instance: SSEPerformanceMonitor | null = null;

export function getSSEPerformanceMonitor(kv?: KVNamespace): SSEPerformanceMonitor {
  if (!instance) {
    instance = new SSEPerformanceMonitor(kv);
  }
  return instance;
}