## 2026-09-20 — workspaces listed-services filter

Track A: `/workspaces?serviced=1` keeps cards whose stored `services` already pass `usefulListingServices` (the same chips already shown under price). Empty / pending strings stay out — no invented services. Sitemap not resubmitted (same route, new query only).

About, images, price/wifi fallbacks, LocalBusiness JSON-LD, waitlist CTAs, and server-side admin auth were already live from prior runs.

GSC 2026-08-20 to 2026-09-18 (top queries sample): branded `roamiq` 0 clicks / 6 impressions / pos ~9.7; `roamiq price` 0/23 / pos ~8.9. Non-branded clicks are venue names (cafe nenom, cafe nook, coliving athens). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, position ~3.1); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d home 139 sessions / bounce 82.7%; /workspaces 10 / 90% (property id not resolved this pass).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

Supabase listings null-rate: Management API timed out this run — not treated as a schema change.
