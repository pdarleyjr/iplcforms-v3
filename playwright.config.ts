import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for IPLC Forms v3
 * Focus on iPad testing and form builder functionality
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/form-builder-desktop.spec.ts', '**/duplicate-palette.spec.ts']
    },

    {
      name: 'webkit-ipad',
      use: {
        ...devices['iPad Pro'],
        // Override with iPad Air 5 specs for testing
        viewport: { width: 1180, height: 820 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      },
      testMatch: ['**/form-builder-ipad.spec.ts', '**/touch-interactions.spec.ts']
    },

    {
      name: 'webkit-iphone',
      use: { ...devices['iPhone 14 Pro'] },
      testMatch: ['**/mobile-responsive.spec.ts']
    },

    /* Test against mobile viewports. */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['**/mobile-responsive.spec.ts']
    },

    /* Accessibility testing */
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // Force reduced motion for consistent accessibility testing
        reducedMotion: 'reduce'
      },
      testMatch: ['**/accessibility.spec.ts']
    }
  ],

  /* Global test configuration */
  timeout: 60000, // 60 seconds for form builder operations
  expect: {
    timeout: 10000 // 10 seconds for assertions
  },

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for dev server startup
  },

  /* Test output directories */
  outputDir: 'test-results',
});