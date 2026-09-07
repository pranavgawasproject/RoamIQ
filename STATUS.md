## 2026-09-07 ~04:00 UTC — daily growth/conversion (Track A)

Gap fixed: about/images, price/Wi-Fi pending UI, JSON-LD, admin env auth, sticky waitlist, contact chips, and listing-destination helper already exist. Remaining conversion hole: `/workspaces` cards still filtered city names to `?city=` only, and listing detail used `/destinations?search=` even when a live `cities` row exists. Index cards now resolve `getDestinationForListingCity` per unique city/country on the page and link the city (plus a City guide line) to `/destinations/[id]` when that row exists; workspace-city filter remains as a secondary link. Detail Explore city uses the same destination id when matched, otherwise keeps the search fallback. No invented slugs or city pages. Sitemap not resubmitted (no new routes).

GSC 2026-08-08 to 2026-09-06 (`https://nomads-travel-indol.vercel.app/`): 12 clicks / 3,512 impressions / CTR 0.34% / avg pos ~13.6. Top query `4g-travel-tool.vercel.app` 2 clicks / 22 impressions / pos ~3.0 — FLAG only; host is not this GSC property; no redirect. Other clicks: cafe nenom, coliving athens, izzy's coffee and brunch, ngb living. Branded CTR capped until the custom domain is live.

GA4 `541610896` 30d landings: `/` 166 sessions bounce 81.3%; `/destinations` 11 / 81.8%; `/workspaces` 10 / 90.0%; `/destinations/chiang-mai` 5 / 100%.

