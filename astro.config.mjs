// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: "wrangler.jsonc",
      persist: {
        path: "./.cache/wrangler/v3",
      },
    },
    workerEntryPoint: {
      path: "src/worker.ts",
      namedExports: ["CustomerWorkflow", "FormSessionDO", "AIGate"]
    },
    // Enhanced Cloudflare-specific optimizations
    routes: {
      extend: {
        include: [{ pattern: "/api/*" }, { pattern: "/admin/*" }, { pattern: "/forms/*" }],
        exclude: [{ pattern: "/assets/*" }, { pattern: "/_astro/*" }]
      }
    },
    sessionKVBindingName: 'SESSION'
  }),
  integrations: [
    react({
      include: ["**/*.tsx", "**/*.jsx"]
    })
  ],
  output: "server",
  // Enhanced SSR Performance Configuration
  server: {
    port: 4321,
    host: true
  },
  // Build optimizations for production
  build: {
    inlineStylesheets: "auto",
    assets: "_astro"
  },
  // Enhanced prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },
  vite: {
    resolve: {
      alias: {
        // Path alias for cleaner imports
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
        // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
        ...(import.meta.env.PROD && {
          "react-dom/server": "react-dom/server.edge",
        }),
      },
    },
    // Enhanced development server optimizations
    optimizeDeps: {
      include: ["react", "react-dom", "lucide-react", "@tanstack/react-table"],
      exclude: ["@astrojs/cloudflare"]
    },
    // Build performance optimizations
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: true,
      rollupOptions: {
        external: ["openai"],
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', '@radix-ui/react-slot'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'table-vendor': ['@tanstack/react-table']
          }
        }
      }
    },
    // Enhanced SSR optimization
    ssr: {
      external: ["@astrojs/cloudflare", "openai"],
      noExternal: ["react-hook-form", "lucide-react"]
    }
  },
  // Image optimization
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net"
      }
    ]
  }
});
