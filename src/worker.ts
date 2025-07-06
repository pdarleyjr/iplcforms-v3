// Custom worker entry point using createExports pattern for Astro workerEntryPoint
// This file integrates Astro SSR with Cloudflare Workflows through the adapter's built-in system

import type { SSRManifest } from 'astro';
import { App } from 'astro/app';

// Import the CustomerWorkflow class for Cloudflare Workflows binding
import { CustomerWorkflow } from './workflows/customer_workflow';

// createExports function required by Astro workerEntryPoint configuration
export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  const handler = {
    async fetch(request: Request, env: any, ctx: any) {
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