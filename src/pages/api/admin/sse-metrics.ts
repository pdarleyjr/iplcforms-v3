import type { APIRoute } from 'astro';
import { getSSEPerformanceMonitor } from '../../../lib/utils/sse-performance';

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;
  
  try {
    // Check authentication
    const user = (locals as any).user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const monitor = getSSEPerformanceMonitor(env.CACHE_KV);
    
    // Get aggregate metrics
    const aggregateData = await env.CACHE_KV?.get('sse_metrics:aggregate', { type: 'json' }) || {
      totalConnections: 0,
      totalBytes: 0,
      totalDuration: 0,
      totalErrors: 0,
      averageThroughput: 0,
      averageDuration: 0,
      peakThroughput: 0
    };

    // Get recent connection metrics (last 24 hours)
    const recentMetrics = [];
    const metricsKeys = await env.CACHE_KV?.list({ prefix: 'sse_metrics:', limit: 100 });
    
    if (metricsKeys) {
      for (const key of metricsKeys.keys) {
        if (key.name !== 'sse_metrics:aggregate') {
          const metric = await env.CACHE_KV.get(key.name, { type: 'json' });
          if (metric) {
            recentMetrics.push(metric);
          }
        }
      }
    }

    // Sort by start time (most recent first)
    recentMetrics.sort((a: any, b: any) => b.startTime - a.startTime);

    // Get performance recommendations
    const recommendations = await monitor.getPerformanceRecommendations();

    // Calculate additional insights
    const insights = {
      activeConnections: monitor.getActiveConnections(),
      averageChunkSize: (aggregateData as any).totalBytes / Math.max(1, (aggregateData as any).totalConnections),
      errorRate: (aggregateData as any).totalConnections > 0
        ? ((aggregateData as any).totalErrors / (aggregateData as any).totalConnections * 100).toFixed(2) + '%'
        : '0%',
      uptimeHours: 24, // Metrics are kept for 24 hours
    };

    return new Response(JSON.stringify({
      aggregate: aggregateData,
      recent: recentMetrics.slice(0, 20), // Return last 20 connections
      insights,
      recommendations
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('SSE metrics error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve SSE metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};