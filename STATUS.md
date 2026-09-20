## 2026-09-20 — workspaces destination-city directory

Track A: `/workspaces` now lists destination cities from the `cities` table (ranked by `overall_score`) as filter links. Empty-filter states also offer those city shortcuts. No invented listings — chips only use stored city names.

About, images, price/wifi fallbacks, LocalBusiness JSON-LD, waitlist CTAs, listed-services filter, and server-side admin auth were already live from prior runs.

GSC 2026-08-20 to 2026-09-18 (top queries sample): branded `roam iq` 1 click / 35 impressions / pos ~8.1. Non-branded clicks are venue names (cafe nenom, cafe nook, coliving athens, ngb living). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, position ~3.1); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d home 139 sessions / bounce 82.7%; /workspaces 10 / 90% (property id not resolved this pass).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

Live Vercel URL returned paused during this run — flagged, domain config not touched.

Supabase listings null-rate: not re-queried this pass.
