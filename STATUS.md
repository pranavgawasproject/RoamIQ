## 2026-09-17 — workspaces listed-email filter

Track A: `/workspaces` can filter to cards that already render a usable contact email (`?emailed=1`, same `usefulContactEmail` gate as the card/detail mailto link). Distinct from `?phoned=1` and from `?contactable=1` (site OR phone OR email). Page-1 ranking also prefers listings with a visible email. No invented addresses. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-17 (`https://nomads-travel-indol.vercel.app/`): query-level sample shows long-tail listing names (cafe nenom, cafe nook, coliving athens, ngb living) plus near-brand `roam iq` 1 click / 34 impressions / pos ~7.91. Query `4g-travel-tool.vercel.app` 0 clicks / 12 impressions / pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: property ID not resolved this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331, last measured): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

