## 2026-09-22 ~13:58 UTC — waitlist on thin /workspaces cards

Track A (conversion): `/workspaces` remains a 100% bounce landing page (GA4 2026-08-24–2026-09-20, 10 sessions). About and images already render on cards. Listings that still have no listed price *and* no listed Wi-Fi *and* no venue email/phone now show an on-card waitlist (`source=workspaces-card-thin`) instead of a dead footer. Copy states we only write when a stored price or Wi-Fi figure exists — no invented numbers. Top-of-page waitlist description updated to the current bounce window.

GSC 2026-08-24 to 2026-09-20 (query dimension, top rows): cafe nenom 1/22 pos ~9.1; cafe nook 1/12; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/8; ngb living 1/25; roam iq 1/34 pos ~8.3; urban place 1/2. Branded `roamiq` 0 clicks / 6 impressions pos ~9.5; `roamiq price` 0/21 pos ~8.8. Query `4g-travel-tool.vercel.app` FLAG only — inspect of that host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property `541610896` (2026-08-24 to 2026-09-20): `/` 63 sessions / 90.5% bounce; `/workspaces` 10 / 100%; individual listing landings lower bounce (e.g. `/workspaces/92952ead-...` 8 / 37.5%).

Listings null-rates: Composio SQL 403 / PostgREST 401 this run — reused prior snapshot n=10331: about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Sitemap not resubmitted (no new routes).

---

## 2026-09-22 — Pin GSC-clicked listing pages into intent links + sitemap

Track A: `/workspaces` still 100% bounce on the index. Added the listing *pages* that already earned a GSC click (page dimension, 2026-08-22–2026-09-21) to `IntentListingLinks` — Tomodomo Zurich, Athens Art Apartments, RezG Hub, Space2Work, Facts Coworking, PARKLAND Colombo, IRIE Montreal, Home & Co Berlin Yard — IDs resolved from the listings table. Sitemap now always includes those intent IDs so crawl budget is not limited to the ratings-capped 80-row slice. Refreshed index chips (dropped Izzy's; 0 clicks in this window). Sitemap routes unchanged except extra listing URLs already live.

GSC 2026-08-22 to 2026-09-21: venue queries with 1 click each include cafe nenom, cafe nook, coliving zürich, durty nellys amsterdam, innapartment taipei, ngb living, urban place; branded `roam iq` 1 click / 35 impressions / pos ~8.2. Query `4g-travel-tool.vercel.app` FLAG only — no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4 (prior same-day snapshot): `/` 67 sessions / 89.6% bounce; `/workspaces` 10 sessions / 100% bounce.

Listings null-rates (n=10331): about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Live site note: nomads-travel-indol.vercel.app still returns Vercel deployment paused — not changed this run.

---
