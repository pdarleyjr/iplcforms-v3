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
  formId?: string; // Add formId support
}

export interface PlausibleEventOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  formId?: string; // Add formId support for custom events
}

/**
 * Custom hook for Plausible Analytics integration
 * Enhanced with SPA navigation tracking and formId support
 */
export function usePlausibleAnalytics(options: PlausibleOptions = {}) {
  const { enabled = true, domain, apiHost = '/a', trackLocalhost = false, formId } = options;
  const lastPathRef = useRef<string>('');
  const initRef = useRef<boolean>(false);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  /**
   * Track a custom event with optional formId
   */
  const trackEvent = useCallback(
    (eventName: string, eventOptions?: PlausibleEventOptions) => {
      if (!enabled) return;

      // Merge formId into props if available
      const enhancedOptions = { ...eventOptions };
      const effectiveFormId = eventOptions?.formId || formId;
      if (effectiveFormId) {
        enhancedOptions.props = {
          ...enhancedOptions.props,
          formId: effectiveFormId,
        };
      }

      // Use the plausible function if available
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, enhancedOptions);
      } else {
        // Fallback to direct API call
        const payload = {
          n: eventName,
          u: window.location.href,
          d: domain || window.location.hostname,
          r: document.referrer || null,
          w: window.innerWidth,
          h: 0, // Hash mode (0 = disabled)
          p: enhancedOptions.props,
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
        if (enhancedOptions.callback) {
          enhancedOptions.callback();
        }
      }
    },
    [enabled, domain, apiHost, formId]
  );

  /**
   * Track a page view with enhanced SPA support
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
      
      // Include formId in pageview if available
      const pageViewOptions: PlausibleEventOptions = {};
      if (formId) {
        pageViewOptions.props = { formId };
      }
      
      trackEvent('pageview', pageViewOptions);
    },
    [enabled, trackEvent, formId]
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
   * Initialize Plausible and set up enhanced automatic tracking
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

    // Set up enhanced automatic tracking for SPAs
    const handleRouteChange = () => {
      trackPageView();
    };

    // Listen for browser navigation events (back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // Override pushState for programmatic navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    // Override replaceState for programmatic navigation
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    // Listen for Astro page load events (if available)
    // Astro fires this event when navigating between pages in View Transitions
    const handleAstroPageLoad = () => {
      // Small delay to ensure the URL has been updated
      setTimeout(() => {
        trackPageView();
      }, 0);
    };

    // Check if Astro is available and has onPageLoad
    if (typeof window !== 'undefined' && (window as any).Astro?.onPageLoad) {
      (window as any).Astro.onPageLoad(handleAstroPageLoad);
      cleanupFunctionsRef.current.push(() => {
        // Astro doesn't provide an off method, so we track this for cleanup awareness
        console.log('Note: Astro.onPageLoad listener cannot be removed');
      });
    }

    // Also listen for astro:page-load event (Astro View Transitions)
    document.addEventListener('astro:page-load', handleAstroPageLoad);

    // Store cleanup functions
    cleanupFunctionsRef.current = [
      () => window.removeEventListener('popstate', handleRouteChange),
      () => { history.pushState = originalPushState; },
      () => { history.replaceState = originalReplaceState; },
      () => document.removeEventListener('astro:page-load', handleAstroPageLoad),
    ];

    // Cleanup
    return () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
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
 * Enhanced with formId support
 */
export function plausibleTrackEvent(
  eventName: string,
  options?: PlausibleEventOptions
) {
  // Enhance options with formId if provided
  const enhancedOptions = { ...options };
  if (options?.formId) {
    enhancedOptions.props = {
      ...enhancedOptions.props,
      formId: options.formId,
    };
  }

  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, enhancedOptions);
  } else {
    // Queue the event for when Plausible loads
    if (typeof window !== 'undefined') {
      window.plausible = window.plausible || function() {
        ((window as any).plausible.q = (window as any).plausible.q || []).push(arguments);
      };
      window.plausible(eventName, enhancedOptions);
    }
  }
}

/**
 * Initialize SPA tracking without React
 * Can be used in vanilla JS or other frameworks
 */
export function initPlausibleSPATracking(options: PlausibleOptions = {}) {
  const { enabled = true, domain, apiHost = '/a', trackLocalhost = false, formId } = options;
  let lastPath = '';

  if (!enabled) return () => {};

  // Skip analytics in development unless explicitly enabled
  if (!trackLocalhost && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      console.log('Plausible Analytics: Skipping localhost tracking');
      return () => {};
    }
  }

  const trackPageView = (url?: string) => {
    const currentPath = url || window.location.pathname + window.location.search;
    
    // Avoid duplicate tracking
    if (currentPath === lastPath) {
      return;
    }
    
    lastPath = currentPath;
    
    const options: PlausibleEventOptions = {};
    if (formId) {
      options.props = { formId };
    }
    
    plausibleTrackEvent('pageview', options);
  };

  // Track initial page view
  trackPageView();

  // Set up automatic tracking for SPAs
  const handleRouteChange = () => {
    trackPageView();
  };

  // Listen for browser navigation events (back/forward)
  window.addEventListener('popstate', handleRouteChange);

  // Override pushState for programmatic navigation
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    handleRouteChange();
  };

  // Override replaceState for programmatic navigation
  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    handleRouteChange();
  };

  // Listen for Astro page load events (if available)
  const handleAstroPageLoad = () => {
    setTimeout(() => {
      trackPageView();
    }, 0);
  };

  // Check if Astro is available and has onPageLoad
  if (typeof window !== 'undefined' && (window as any).Astro?.onPageLoad) {
    (window as any).Astro.onPageLoad(handleAstroPageLoad);
  }

  // Also listen for astro:page-load event (Astro View Transitions)
  document.addEventListener('astro:page-load', handleAstroPageLoad);

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    document.removeEventListener('astro:page-load', handleAstroPageLoad);
  };
}