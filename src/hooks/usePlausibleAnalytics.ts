/**
 * Plausible Analytics React Hook
 * Provides automatic page-view tracking and custom event support for SPAs
 */

import { useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>;
        callback?: () => void;
      }
    ) => void;
  }
}

export interface PlausibleOptions {
  domain?: string;
  apiHost?: string;
  trackLocalhost?: boolean;
  enabled?: boolean;
}

export interface PlausibleEventOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
}

/**
 * Custom hook for Plausible Analytics integration
 */
export function usePlausibleAnalytics(options: PlausibleOptions = {}) {
  const { enabled = true, domain, apiHost = '/a', trackLocalhost = false } = options;
  const lastPathRef = useRef<string>('');
  const initRef = useRef<boolean>(false);

  /**
   * Track a custom event
   */
  const trackEvent = useCallback(
    (eventName: string, eventOptions?: PlausibleEventOptions) => {
      if (!enabled) return;

      // Use the plausible function if available
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, eventOptions);
      } else {
        // Fallback to direct API call
        const payload = {
          n: eventName,
          u: window.location.href,
          d: domain || window.location.hostname,
          r: document.referrer || null,
          w: window.innerWidth,
          h: 0, // Hash mode (0 = disabled)
          p: eventOptions?.props,
        };

        // Send event via sendBeacon or fetch
        const url = `${apiHost}/api/event`;
        const data = JSON.stringify(payload);

        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, data);
        } else {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
            keepalive: true,
          }).catch((error) => {
            console.error('Failed to send analytics event:', error);
          });
        }

        // Call callback if provided
        if (eventOptions?.callback) {
          eventOptions.callback();
        }
      }
    },
    [enabled, domain, apiHost]
  );

  /**
   * Track a page view
   */
  const trackPageView = useCallback(
    (url?: string) => {
      if (!enabled) return;

      const currentPath = url || window.location.pathname + window.location.search;
      
      // Avoid duplicate tracking
      if (currentPath === lastPathRef.current) {
        return;
      }
      
      lastPathRef.current = currentPath;
      trackEvent('pageview');
    },
    [enabled, trackEvent]
  );

  /**
   * Track outbound link clicks
   */
  const trackOutboundLink = useCallback(
    (url: string, callback?: () => void) => {
      trackEvent('Outbound Link: Click', {
        props: { url },
        callback,
      });
    },
    [trackEvent]
  );

  /**
   * Track file downloads
   */
  const trackFileDownload = useCallback(
    (filename: string) => {
      trackEvent('File Download', {
        props: { filename },
      });
    },
    [trackEvent]
  );

  /**
   * Track 404 errors
   */
  const track404 = useCallback(() => {
    trackEvent('404', {
      props: { path: window.location.pathname },
    });
  }, [trackEvent]);

  /**
   * Initialize Plausible and set up automatic tracking
   */
  useEffect(() => {
    if (!enabled || initRef.current) return;
    
    // Skip analytics in development unless explicitly enabled
    if (!trackLocalhost && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        console.log('Plausible Analytics: Skipping localhost tracking');
        return;
      }
    }

    initRef.current = true;

    // Load Plausible script if not already loaded
    if (typeof window !== 'undefined' && !window.plausible) {
      const script = document.createElement('script');
      script.defer = true;
      script.async = true;
      script.dataset.domain = domain || window.location.hostname;
      script.dataset.api = apiHost;
      script.src = `${apiHost}/js/plausible.js`;
      
      script.onerror = () => {
        console.error('Failed to load Plausible Analytics script');
      };

      document.head.appendChild(script);

      // Define plausible function for queueing events before script loads
      window.plausible = window.plausible || function() {
        ((window as any).plausible.q = (window as any).plausible.q || []).push(arguments);
      };
    }

    // Track initial page view
    trackPageView();

    // Set up automatic tracking for SPAs
    const handleRouteChange = () => {
      trackPageView();
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handleRouteChange);

    // Override pushState and replaceState for SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [enabled, domain, apiHost, trackLocalhost, trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackOutboundLink,
    trackFileDownload,
    track404,
  };
}

/**
 * Standalone function to track events without React
 */
export function plausibleTrackEvent(
  eventName: string,
  options?: PlausibleEventOptions
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, options);
  } else {
    // Queue the event for when Plausible loads
    if (typeof window !== 'undefined') {
      window.plausible = window.plausible || function() {
        ((window as any).plausible.q = (window as any).plausible.q || []).push(arguments);
      };
      window.plausible(eventName, options);
    }
  }
}