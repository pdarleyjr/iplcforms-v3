// Custom worker entry point using createExports pattern for Astro workerEntryPoint
// This file integrates Astro SSR with Cloudflare Workflows through the adapter's built-in system

import type { SSRManifest } from 'astro';
import { App } from 'astro/app';

// Import the CustomerWorkflow class for Cloudflare Workflows binding
import { CustomerWorkflow } from './workflows/customer_workflow';

// Import WorkersPerformanceManager for performance monitoring
import { WorkersPerformanceManager } from './lib/utils/workers-performance';

// createExports function required by Astro workerEntryPoint configuration
export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  const handler = {
    async fetch(request: Request, env: any, ctx: any) {
      // Initialize WorkersPerformanceManager with KV namespaces
      if (env.METRICS_KV && env.CACHE_KV) {
        // Set global KV namespaces using type assertions
        (globalThis as any).METRICS_KV = env.METRICS_KV;
        (globalThis as any).CACHE_KV = env.CACHE_KV;
        // Initialize the performance manager
        WorkersPerformanceManager.getInstance();
      }

      return app.render(request, {
        locals: { env, ctx }
      });
    }
  };

  // Return both the default fetch handler and named exports
  return {
    default: handler,
    CustomerWorkflow: CustomerWorkflow,
  };
}