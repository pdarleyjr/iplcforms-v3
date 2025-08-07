/// <reference types="astro/client" />
/// <reference path="../worker-configuration.d.ts" />

// Cloudflare Workers KV Namespace declarations
declare global {
  const METRICS_KV: KVNamespace;
  const CACHE_KV: KVNamespace;
  const CHAT_HISTORY: KVNamespace;
}

// Environment variable types
interface ImportMetaEnv {
  readonly CLOUDFLARE_D1_TOKEN: string;
  readonly CLOUDFLARE_ACCOUNT_ID: string;
  readonly CLOUDFLARE_DATABASE_ID: string;

  // Analytics feature flags and config
  readonly ANALYTICS_ENABLED?: 'true' | 'false';
  readonly PLAUSIBLE_DOMAIN?: string; // e.g., plausible.io
  readonly PLAUSIBLE_SITE_ID?: string; // e.g., your-site.example
  readonly RESPECT_DNT?: 'true' | 'false';
  readonly MODE?: string; // astro/vite mode
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Workers environment types - extending the generated types
interface WorkerEnv extends Cloudflare.Env {
  // Additional environment bindings not in the generated types
  DB: D1Database;
  CUSTOMER_WORKFLOW: DurableObjectNamespace;
  FORM_SESSION: DurableObjectNamespace; // Form session Durable Object
  METRICS_KV: KVNamespace;
  CACHE_KV: KVNamespace;
  CHAT_HISTORY: KVNamespace;
  FORMS_KV: KVNamespace; // Forms KV namespace
  RATELIMIT_KV: KVNamespace; // Rate limiting KV namespace
  DOC_METADATA: KVNamespace; // Document metadata KV namespace
  KV: KVNamespace; // Generic KV namespace for backward compatibility
  // Note: AI, AI_GATE, and DOC_INDEX are already defined in Cloudflare.Env

  // Analytics feature flags and config available at runtime (Workers bindings)
  ANALYTICS_ENABLED?: 'true' | 'false';
  PLAUSIBLE_DOMAIN?: string;
  PLAUSIBLE_SITE_ID?: string;
  RESPECT_DNT?: 'true' | 'false';
}

// Extend Astro's Locals interface to include runtime
declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: WorkerEnv;
      };
    }
  }
}

// Export to ensure this is treated as a module
export {};
