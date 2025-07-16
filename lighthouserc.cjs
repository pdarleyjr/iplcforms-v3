module.exports = {
  ci: {
    collect: {
      // Test the form builder page
      url: [
        'http://localhost:4321/forms/new',
        'http://localhost:4321/forms',
        'http://localhost:4321/'
      ],
      numberOfRuns: 3,
      settings: {
        // Mobile device emulation (iPad)
        emulatedFormFactor: 'mobile',
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        // Viewport for iPad
        screenEmulation: {
          mobile: true,
          width: 1024,
          height: 1366,
          deviceScaleFactor: 2
        },
        // Audit settings
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Skip some audits that don't apply to local dev
        skipAudits: [
          'uses-http2',
          'canonical',
          'is-crawlable',
          'robots-txt'
        ]
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance assertions for mobile
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],
        'speed-index': ['warn', { maxNumericValue: 5000 }],
        
        // Accessibility assertions
        'color-contrast': 'error',
        'tap-targets': 'error', // Important for touch devices
        'button-name': 'error',
        'label': 'error',
        'aria-*': 'warn',
        
        // Best practices for mobile
        'viewport': 'error',
        'font-size': 'error', // Ensures readable text
        'uses-responsive-images': 'warn',
        
        // PWA features
        'installable-manifest': 'off',
        'service-worker': 'off',
        'works-offline': 'off',
        
        // Security
        'is-on-https': 'off', // Local dev
        'no-vulnerable-libraries': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};