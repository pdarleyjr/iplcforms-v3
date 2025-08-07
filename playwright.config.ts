import { defineConfig, devices } from '@playwright/test';
// Ensure BASE_URL helper is loaded for config-time defaults if needed

/**
 * Playwright Configuration for IPLC Forms v3
 * Phase-0 minimal subset targeting /dev/phase0-smoke only.
 * Runs Wrangler dev against the compiled Cloudflare Worker and polls /health.
 */
export default defineConfig({
  // Limit to tests directory and include only Phase-0 subset
  testDir: './tests',
  testMatch: ['**/phase0/*.spec.ts'],

  // Fail fast if the Worker is not reachable at the canonical E2E_BASE_URL.
  globalSetup: './playwright.global.ts',

  timeout: 300000,

  expect: {
    timeout: 10000
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    // Route tests through wrangler dev on port 8788.
    // Send x-e2e header with ALL requests (navigations, fetches, XHRs) to ensure middleware bypass consistently.
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:8788',
    extraHTTPHeaders: {
      'x-e2e': '1'
    },
    navigationTimeout: 120000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Start wrangler dev using the test-specific config that points to the compiled worker.
  // Force local protocol to avoid remote preview/migration interference on Windows.
  webServer: {
    // Ensure Windows-friendly pathing and env. Use Node to set env var in a cross-shell-compatible way.
    command: 'node -e \"process.env.E2E_BASE_URL=\\\"http://127.0.0.1:8788\\\"; process.exit(0)\" && pnpm -s build && wrangler dev --config wrangler.test.toml --local-protocol=http --live-reload=false',
    url: 'http://127.0.0.1:8788/health',
    reuseExistingServer: !process.env.CI,
    timeout: 180000
  },

  // Keep only a single minimal project to avoid re-enabling legacy/non-essential suites
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/phase0/*.spec.ts']
    }
  ],

  outputDir: 'test-results',
});