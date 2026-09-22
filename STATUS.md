## 2026-09-22 — Pin GSC-clicked listing pages into intent links + sitemap

Track A: `/workspaces` still 100% bounce on the index. Added the listing *pages* that already earned a GSC click (page dimension, 2026-08-22–2026-09-21) to `IntentListingLinks` — Tomodomo Zurich, Athens Art Apartments, RezG Hub, Space2Work, Facts Coworking, PARKLAND Colombo, IRIE Montreal, Home & Co Berlin Yard — IDs resolved from the listings table. Sitemap now always includes those intent IDs so crawl budget is not limited to the ratings-capped 80-row slice. Refreshed index chips (dropped Izzy's; 0 clicks in this window). Sitemap routes unchanged except extra listing URLs already live.

GSC 2026-08-22 to 2026-09-21: venue queries with 1 click each include cafe nenom, cafe nook, coliving zürich, durty nellys amsterdam, innapartment taipei, ngb living, urban place; branded `roam iq` 1 click / 35 impressions / pos ~8.2. Query `4g-travel-tool.vercel.app` FLAG only — no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4 (prior same-day snapshot): `/` 67 sessions / 89.6% bounce; `/workspaces` 10 sessions / 100% bounce.

Listings null-rates (n=10331): about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Live site note: nomads-travel-indol.vercel.app still returns Vercel deployment paused — not changed this run.

---
