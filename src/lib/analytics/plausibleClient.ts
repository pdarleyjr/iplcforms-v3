export interface AnalyticsOptions {
  enabled: boolean;
  siteId: string;
  basePath?: string;
}

/**
 * Initialize Plausible Analytics script
 * This loads the proxied Plausible script from our own domain
 */
export function initPlausibleScript(): void {
  // Check if script is already loaded
  if (document.querySelector('script[data-plausible]')) {
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = '/api/plausible/script.js';
  script.setAttribute('data-plausible', 'true');
  script.setAttribute('data-api', '/api/plausible/api/event');
  document.head.appendChild(script);
}

/**
 * Create analytics client for manual event tracking
 * Uses the proxied endpoints to avoid ad blockers
 */
export function createAnalytics(opts: AnalyticsOptions) {
  // Use the new proxy endpoint
  const eventEndpoint = '/api/plausible/api/event';
  
  async function send(name: string, props?: Record<string, unknown>) {
    if (!opts.enabled) return;
    
    try {
      await fetch(eventEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          url: window.location.href,
          domain: opts.siteId,
          props,
          referrer: document.referrer || null,
          screen_width: window.screen.width,
        })
      });
    } catch (error) {
      // Silently fail to not break the app
      console.debug('Analytics event failed:', error);
    }
  }
  
  return {
    pageview: (url?: string) => {
      // For pageviews, use the provided URL or current location
      const pageUrl = url || window.location.pathname;
      send('pageview', { url: pageUrl });
    },
    event: (name: string, props?: Record<string, unknown>) => send(name, props),
    // Add method to track route changes for SPAs
    trackRouteChange: () => {
      send('pageview');
    }
  };
}