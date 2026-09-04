/**
 * Primary public host for canonical URLs, sitemap, and metadataBase.
 * Secondary host https://roamiq-app.vercel.app/ may also serve the app.
 * Prefer this URL in canonical tags only; do NOT hard-301 between hosts.
 */
export const SITE_URL = "https://nomads-travel-indol.vercel.app";

type GtagFn = (
  command: "event" | "config" | "js" | "set",
  targetOrName: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event when gtag is already loaded (layout.tsx). No-ops safely if absent. */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      cleaned[key] = value;
    }
  }
  gtag("event", name, cleaned);
}
