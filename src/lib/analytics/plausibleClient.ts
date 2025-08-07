export interface AnalyticsOptions {
  enabled?: boolean;
  siteId?: string;
  basePath?: string;
}

type EventName = 'pageview' | 'form_submit' | 'field_added' | 'field_removed' | string;

const DEFAULT_EVENT_ENDPOINT = '/api/plausible/api/event';
const DEFAULT_SCRIPT_SRC = '/api/plausible/script.js';

function now() {
  return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
}

function idle(cb: () => void) {
  if (typeof (window as any).requestIdleCallback === 'function') {
    (window as any).requestIdleCallback(cb, { timeout: 1000 });
  } else {
    setTimeout(cb, 0);
  }
}

function backoffDelay(attempt: number) {
  const base = 300 * Math.pow(2, attempt); // 300ms, 600ms, 1200ms...
  const jitter = base * 0.25;
  return base + (Math.random() * 2 - 1) * jitter;
}

let lastPageviewKey = '';
let lastPageviewAt = 0;

export function initPlausibleScript(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('script[data-plausible]')) return;

  const script = document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = DEFAULT_SCRIPT_SRC;
  script.setAttribute('data-plausible', 'true');
  script.setAttribute('data-api', DEFAULT_EVENT_ENDPOINT);
  document.head.appendChild(script);
}

export function createAnalytics(opts: AnalyticsOptions = {}) {
  const enabledFlag = (typeof window !== 'undefined' && (window as any).__ANALYTICS_OVERRIDE_ENABLED === true)
    || (typeof import.meta !== 'undefined' && import.meta.env?.ANALYTICS_ENABLED === 'true')
    || !!opts.enabled;

  const endpoint = opts.basePath ? `${opts.basePath}/api/event` : DEFAULT_EVENT_ENDPOINT;

  type QueueItem = {
    body: any;
    attempt: number;
  };

  const queue: QueueItem[] = [];
  let sending = false;

  function enqueue(body: any) {
    queue.push({ body, attempt: 0 });
    drain();
  }

  function sendBeacon(body: any): boolean {
    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
        return navigator.sendBeacon(endpoint, blob);
      }
    } catch {}
    return false;
  }

  async function sendOnce(item: QueueItem): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item.body),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.status === 202 || res.status === 204 || res.ok) {
        return true;
      }
      // Drop on 4xx
      if (res.status >= 400 && res.status < 500) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  function drain() {
    if (sending) return;
    if (queue.length === 0) return;
    sending = true;
    idle(async () => {
      while (queue.length > 0) {
        const item = queue[0];
        const ok = await sendOnce(item);
        if (ok) {
          queue.shift();
          continue;
        }
        // retry with backoff up to 5 attempts
        if (item.attempt >= 4) {
          queue.shift(); // drop
          continue;
        }
        item.attempt++;
        await new Promise(r => setTimeout(r, backoffDelay(item.attempt)));
      }
      sending = false;
    });
  }

  function pageview(data?: { url?: string; referrer?: string; title?: string }) {
    if (!enabledFlag) {
      if (import.meta.env?.MODE !== 'production') {
        try { console.debug('[analytics:no-op] pageview', data || {}); } catch {}
      }
      return;
    }
    const url = data?.url || (typeof window !== 'undefined' ? window.location.href : '');
    const referrer = data?.referrer ?? (typeof document !== 'undefined' ? document.referrer || null : null);
    const title = data?.title ?? (typeof document !== 'undefined' ? document.title : undefined);

    // Dedupe identical consecutive pageviews within 250ms
    const key = `${url}|${referrer}|${title}`;
    const t = now();
    if (key === lastPageviewKey && (t - lastPageviewAt) < 250) return;
    lastPageviewKey = key;
    lastPageviewAt = t;

    enqueue({
      name: 'pageview',
      url,
      referrer,
      screen_width: typeof window !== 'undefined' ? window.screen.width : undefined,
      meta: { props: { title } }
    });
  }

  function event(name: EventName, props?: Record<string, string | number | boolean | null>) {
    if (!enabledFlag) {
      if (import.meta.env?.MODE !== 'production') {
        try { console.debug('[analytics:no-op] event', name, props || {}); } catch {}
      }
      return;
    }
    const safeProps: Record<string, string | number | boolean | null> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) {
          safeProps[k] = v;
        }
      }
    }
    enqueue({
      name,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
      screen_width: typeof window !== 'undefined' ? window.screen.width : undefined,
      meta: { props: safeProps }
    });
  }

  function flushOnUnload() {
    if (typeof window === 'undefined') return;
    const handler = () => {
      // Best-effort flush via sendBeacon
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        if (!sendBeacon(item.body)) {
          // fallback sync POST (tiny timeout)
          navigator.sendBeacon?.(endpoint, new Blob([JSON.stringify(item.body)], { type: 'application/json' }));
        }
      }
    };
    window.addEventListener('pagehide', handler);
    window.addEventListener('beforeunload', handler);
  }

  // install unload flush
  flushOnUnload();

  return {
    pageview,
    event,
    trackRouteChange: () => pageview(),
  };
}