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
      configPath: "wrangler.toml",
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
      exclude: ["@astrojs/cloudflare", "survey-react-ui", "pdfjs-dist"]
    },
    // Build performance optimizations
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: true,
      rollupOptions: {
        external: ["openai"],
        output: {
          manualChunks: (id) => {
            // Keep SurveyJS in its own chunk for client-side only loading
            if (id.includes('survey-react-ui') || id.includes('survey-core')) {
              return 'survey-vendor';
            }
            // Keep PDF.js and related libraries in their own chunk
            if (id.includes('pdfjs-dist') || id.includes('react-pdf-highlighter')) {
              return 'pdf-vendor';
            }
            // Keep dnd-kit in its own chunk
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
            // Existing vendor chunks
            if (id.includes('react') && !id.includes('react-hook-form')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('@tanstack/react-table')) {
              return 'table-vendor';
            }
          }
        }
      }
    },
    // Enhanced SSR optimization
    ssr: {
      external: ["@astrojs/cloudflare", "openai", "crypto", "survey-react-ui", "pdfjs-dist"],
      noExternal: ["react-hook-form", "lucide-react", "@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities", "@dnd-kit/modifiers"]
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
