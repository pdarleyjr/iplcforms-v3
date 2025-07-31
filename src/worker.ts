// Custom worker entry point using createExports pattern for Astro workerEntryPoint
// This file integrates Astro SSR with Cloudflare Workflows through the adapter's built-in system

import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Import the CustomerWorkflow class for Cloudflare Workflows binding
import { CustomerWorkflow } from './workflows/customer_workflow';

// Import FormSessionDO for autosave functionality
import { FormSessionDO } from './durable-objects/FormSessionDO';
export { FormSessionDO };

// Import WorkersPerformanceManager for performance monitoring
import { WorkersPerformanceManager } from './lib/utils/workers-performance';

// Basic Authentication utilities
function timingSafeEqual(a: string, b: string): boolean {
  const lengthA = a.length;
  let result = 0;
  if (lengthA !== b.length) {
    b = a;
    result = 1;
  }
  for (let i = 0; i < lengthA; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyBasicAuth(request: Request, env: any): Promise<boolean> {
  const authorization = request.headers.get('Authorization');
  
  if (!authorization || !authorization.startsWith('Basic ')) {
    return false;
  }
  
  const encoded = authorization.slice(6);
  const decoded = atob(encoded);
  const index = decoded.indexOf(':');
  
  if (index === -1) {
    return false;
  }
  
  const username = decoded.substring(0, index);
  const password = decoded.substring(index + 1);
  
  const expectedUsername = 'admin';
  const expectedPassword = env.ADMIN_PASS || '';
  
  return timingSafeEqual(username, expectedUsername) &&
         timingSafeEqual(password, expectedPassword);
}

// createExports function required by Astro workerEntryPoint configuration
export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  const handler = {
    async fetch(request: Request, env: any, ctx: any) {
      // Check Basic Authentication for all routes
      const url = new URL(request.url);
      
      // Skip authentication for static assets and health checks
      const skipAuth = url.pathname.startsWith('/_astro') ||
                      url.pathname.startsWith('/favicon') ||
                      url.pathname === '/health' ||
                      url.pathname.endsWith('.css') ||
                      url.pathname.endsWith('.js') ||
                      url.pathname.endsWith('.png') ||
                      url.pathname.endsWith('.jpg') ||
                      url.pathname.endsWith('.svg') ||
                      url.pathname.endsWith('.ico');
      
      if (!skipAuth) {
        const isAuthenticated = await verifyBasicAuth(request, env);
        
        if (!isAuthenticated) {
          return new Response(`<!DOCTYPE html>
<html>
<head>
    <title>IPLC Forms - Authentication Required</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .auth-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 24px;
            color: #1a1a2e;
        }
        h1 {
            margin: 0 0 10px;
            font-size: 24px;
            font-weight: 600;
        }
        p {
            margin: 0 0 20px;
            opacity: 0.8;
            font-size: 14px;
        }
        .instructions {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 16px;
            margin-top: 20px;
            font-size: 13px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="logo">IPLC</div>
        <h1>Authentication Required</h1>
        <p>Please enter your credentials to access IPLC Forms</p>
        <div class="instructions">
            <strong>Instructions:</strong><br>
            A login prompt should appear automatically.<br>
            If not, please refresh the page.<br><br>
            <strong>Username:</strong> admin<br>
            <strong>Password:</strong> [configured in system]
        </div>
    </div>
</body>
</html>`, {
            status: 401,
            headers: {
              'WWW-Authenticate': 'Basic realm="IPLC Forms"',
              'Content-Type': 'text/html',
            },
          });
        }
      }
      
      // Initialize WorkersPerformanceManager with KV namespaces
      if (env.METRICS_KV && env.CACHE_KV) {
        // Set global KV namespaces using type assertions
        (globalThis as any).METRICS_KV = env.METRICS_KV;
        (globalThis as any).CACHE_KV = env.CACHE_KV;
        // Initialize the performance manager
        WorkersPerformanceManager.getInstance();
      }

      // Check if the request is for an asset and serve it from KV
      try {
        const assetResponse = await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.ASSETS,
          }
        );
        return assetResponse;
      } catch (e) {
        // Asset not found or other error, continue to Astro SSR
      }

      // Create a properly structured environment object for Astro.locals.env
      const astroEnv = {
        // Environment variables from .dev.vars
        API_TOKEN: env.API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_D1_TOKEN: env.CLOUDFLARE_D1_TOKEN,
        CLOUDFLARE_DATABASE_ID: env.CLOUDFLARE_DATABASE_ID,
        
        // Cloudflare bindings
        DB: env.DB,
        SESSION: env.SESSION,
        FORM_SESSION: env.FORM_SESSION,
        CUSTOMER_WORKFLOW: env.CUSTOMER_WORKFLOW,
        AI_WORKER: env.AI_WORKER,
        ASSETS: env.ASSETS,
        METRICS_KV: env.METRICS_KV,
        CACHE_KV: env.CACHE_KV,
        AI: env.AI,
        VECTORIZE: env.VECTORIZE,
        CHAT_HISTORY: env.CHAT_HISTORY,
        
        // Authentication secret
        ADMIN_PASS: env.ADMIN_PASS
      };

      return app.render(request, {
        locals: {
          runtime: { env },
          ctx,
          env: astroEnv
        }
      });
    }
  };

  // Return both the default fetch handler and named exports
  return {
    default: handler,
    CustomerWorkflow: CustomerWorkflow,
    FormSessionDO: FormSessionDO,
  };
}