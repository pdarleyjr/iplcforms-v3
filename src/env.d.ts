/// <reference types="astro/client" />

// Cloudflare Workers KV Namespace declarations
declare global {
  const METRICS_KV: KVNamespace;
  const CACHE_KV: KVNamespace;
}

// Environment variable types
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly CLOUDFLARE_D1_TOKEN: string;
  readonly CLOUDFLARE_ACCOUNT_ID: string;
  readonly CLOUDFLARE_DATABASE_ID: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Workers environment types
interface WorkerEnv {
  DB: D1Database;
  CUSTOMER_WORKFLOW: DurableObjectNamespace;
  METRICS_KV: KVNamespace;
  CACHE_KV: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// Export to ensure this is treated as a module
export {};
