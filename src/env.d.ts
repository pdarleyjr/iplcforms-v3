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
