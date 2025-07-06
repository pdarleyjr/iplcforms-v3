import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress.tsx';
import {
  Activity,
  Database,
  Globe,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import type {
  PerformanceMetrics
} from '../../lib/utils/workers-performance';

interface AggregatedMetrics {
  totalRequests: number;
  totalDuration: number;
  totalSize: number;
  cacheHits: number;
  cacheMisses: number;
  dbQueries: number;
  dbDuration: number;
  apiCalls: number;
  apiErrors: number;
  avgResponseTime: number;
  cacheHitRate: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/performance-metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const data: PerformanceMetrics[] = await response.json();
      
      // Aggregate metrics from individual requests
      const aggregated: AggregatedMetrics = {
        totalRequests: data.length,
        totalDuration: 0,
        totalSize: 0,
        cacheHits: 0,
        cacheMisses: 0,
        dbQueries: 0,
        dbDuration: 0,
        apiCalls: 0,
        apiErrors: 0,
        avgResponseTime: 0,
        cacheHitRate: 0
      };
      
      data.forEach((metric: PerformanceMetrics) => {
        aggregated.totalDuration += metric.duration || 0;
        aggregated.cacheHits += metric.cacheHits;
        aggregated.cacheMisses += metric.cacheMisses;
        aggregated.dbQueries += metric.dbQueries;
        aggregated.dbDuration += metric.dbDuration;
        aggregated.apiCalls += metric.apiCalls;
        aggregated.apiErrors += metric.errors;
      });
      
      // Calculate averages
      if (aggregated.totalRequests > 0) {
        aggregated.avgResponseTime = aggregated.totalDuration / aggregated.totalRequests;
      }
      
      const totalCacheRequests = aggregated.cacheHits + aggregated.cacheMisses;
      if (totalCacheRequests > 0) {
        aggregated.cacheHitRate = (aggregated.cacheHits / totalCacheRequests) * 100;
      }
      
      setMetrics(aggregated);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No performance metrics available yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh info */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Badge>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              Avg response: {formatDuration(metrics.avgResponseTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cache Hit Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.cacheHits} hits / {metrics.cacheMisses} misses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Database Queries
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dbQueries}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatDuration(metrics.dbQueries > 0 
                ? metrics.dbDuration / metrics.dbQueries 
                : 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.apiCalls}</div>
            <p className="text-xs text-muted-foreground">
              Errors: {metrics.apiErrors}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Request Performance</CardTitle>
            <CardDescription>Request handling statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Requests</span>
                <span className="font-medium">
                  {metrics.totalRequests}
                </span>
              </div>
              <Progress value={Math.min((metrics.totalRequests / 1000) * 100, 100)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Duration</span>
                <span className="font-medium">
                  {formatDuration(metrics.totalDuration)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Response Time</span>
                <span className="font-medium">
                  {formatDuration(metrics.avgResponseTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cache Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Cache Performance</CardTitle>
            <CardDescription>Cache effectiveness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cache Hits</span>
                <span className="font-medium">
                  {metrics.cacheHits}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cache Misses</span>
                <span className="font-medium">
                  {metrics.cacheMisses}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hit Rate</span>
                <span className="font-medium">
                  {metrics.cacheHitRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={metrics.cacheHitRate} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Health</CardTitle>
          <CardDescription>System performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Load</span>
                <Badge variant={metrics.dbQueries > 500 ? 'destructive' : 'default'}>
                  {metrics.dbQueries} queries
                </Badge>
              </div>
              <Progress 
                value={Math.min((metrics.dbQueries / 1000) * 100, 100)} 
                className={metrics.dbQueries > 500 ? 'bg-red-100' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Health</span>
                <Badge variant={metrics.apiErrors > 0 ? 'destructive' : 'default'}>
                  {metrics.apiCalls > 0 
                    ? `${((1 - metrics.apiErrors / metrics.apiCalls) * 100).toFixed(1)}% success`
                    : 'No API calls'
                  }
                </Badge>
              </div>
              <Progress 
                value={metrics.apiCalls > 0 
                  ? (1 - metrics.apiErrors / metrics.apiCalls) * 100
                  : 100
                }
                className={metrics.apiErrors > 0 ? 'bg-red-100' : ''}
              />
            </div>
          </div>
          
          {/* Performance Recommendations */}
          {(metrics.cacheHitRate < 80 || metrics.avgResponseTime > 1000 || metrics.apiErrors > 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Performance Recommendations</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  {metrics.cacheHitRate < 80 && (
                    <li>• Cache hit rate is below 80%. Consider reviewing cache policies.</li>
                  )}
                  {metrics.avgResponseTime > 1000 && (
                    <li>• Average response time exceeds 1s. Review slow queries and API calls.</li>
                  )}
                  {metrics.apiErrors > 0 && (
                    <li>• API errors detected. Check external service connectivity.</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}