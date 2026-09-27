declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: {
        path?: string;
        title?: string;
        referrer?: string;
        event?: boolean;
      }) => void;
    };
  }
}

export const GOATCOUNTER_ENDPOINT = 'https://alcoceba.goatcounter.com/count';
export const GOATCOUNTER_SCRIPT_URL = '//gc.zgo.at/count.js';

export function trackPageView(path?: string, title?: string): void {
  if (typeof window !== 'undefined' && window.goatcounter?.count) {
    try {
      window.goatcounter.count({
        path,
        title,
      });
    } catch {
      // Gracefully ignore tracking errors (e.g. adblocker, offline, blocked network)
    }
  }
}
