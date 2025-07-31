/// <reference types="astro/client" />

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

// Cloudflare Workers environment types
interface WorkerEnv {
  DB: D1Database;
  CUSTOMER_WORKFLOW: DurableObjectNamespace;
  FORM_SESSION: DurableObjectNamespace; // Form session Durable Object
  METRICS_KV: KVNamespace;
  CACHE_KV: KVNamespace;
  CHAT_HISTORY: KVNamespace;
  AI: any; // Cloudflare AI binding
  AI_WORKER: Fetcher; // AI Worker service binding
  VECTORIZE: any; // Vectorize index binding
}

// Export to ensure this is treated as a module
export {};
