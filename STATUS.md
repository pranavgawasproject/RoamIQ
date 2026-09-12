## 2026-09-12 ~09:00 IST — daily growth/conversion (Track A)

Gap fixed: listing cards and detail already showed destination climate/cost/internet, but visa difficulty and safety score lived only on `/destinations` even though listing copy promised "cost of living & visa". Destination match now selects those live city fields and renders them on `/workspaces` cards, listing city-guide line, sidebar, and City JSON-LD additionalProperty — only when the cities table has values. No invented visa or safety figures. Sitemap not resubmitted (no new routes).

GSC 2026-08-12 to 2026-09-11 (`https://nomads-travel-indol.vercel.app/`): 15 clicks / 4,685 impressions / CTR 0.32% / avg pos ~13.2. Branded `roam iq` 1 click / 34 impressions / pos ~7.9. Top query still `4g-travel-tool.vercel.app` (2 clicks / 21 impressions / pos ~3.14) — duplicate-index FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

Supabase `listings` (n=10,331): about empty 540 (5.2%), images null 0, starting_price empty 5,243 (50.7%), wifi_speed empty 2,055 (19.9%), contact_phone empty 6,547, logo_url empty 7,395, contact_email empty 7,984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — URL Inspection on that host is a different GSC property; do not mark resolved.

Commits:
- https://github.com/pranavgawasproject/RoamIQ/commit/5986d7d06c92a2261436ae8fbb87938189ade8de
- https://github.com/pranavgawasproject/RoamIQ/commit/872b1c28605f9d5ea2084f244c42238fed22263a
