## 2026-09-18 — workspaces complete-card filter

Track A: `/workspaces` can filter to cards that already render a usable photo, a visible about/description, and a listed starting price (`?complete=1`). Same three gates as the card UI (`firstVenueListingImage`, `usefulListingAbout`, `usefulStartingPrice`). Page-1 ranking also prefers those complete cards. No invented copy, prices, or photos. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-17 (`https://nomads-travel-indol.vercel.app/`): clicks on long-tail venue names (`cafe nenom`, `coliving athens`, `ngb living`) plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: toolkit not connected this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984. contact_name/product_name are ~100% empty — not used as a filter.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

## 2026-09-17 — workspaces listed-units filter

Track A: `/workspaces` can filter to cards that already render usable unit inventory (`?united=1`, same `usefulListingUnits` gate as the card). Page-1 ranking also prefers listings with visible units. No invented unit counts. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-16 (`https://nomads-travel-indol.vercel.app/`): long-tail listing queries plus near-brand `roam iq` 1/34 pos ~7.91; exact `roamiq` 0/8 pos ~9. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: property ID not resolved this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331, last measured): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

## 2026-09-17 — restore workspaces listed-capacity filter

Track A: `?sized=1` was documented earlier today but dropped from `workspaces/page.tsx` when the listed-email filter landed. Restored the capacity filter (same `usefulListingCapacity` gate as the card), typed `emailed` on `getListings`, and added capacity to page-1 ranking. No invented sizes. Sitemap not resubmitted (same route, new query only).

GSC: toolkit schema mismatch this run; last logged 2026-08-18 to 2026-09-17 — long-tail listing queries plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: property ID not resolved this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331, last measured): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

## 2026-09-17 — workspaces listed-email filter

Track A: `/workspaces` can filter to cards that already render a usable contact email (`?emailed=1`, same `usefulContactEmail` gate as the card/detail mailto link). Distinct from `?phoned=1` and from `?contactable=1` (site OR phone OR email). Page-1 ranking also prefers listings with a visible email. No invented addresses. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-17 (`https://nomads-travel-indol.vercel.app/`): long-tail listing queries plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: property ID not resolved this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331, last measured): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

## 2026-09-17 — workspaces listed-capacity filter

Track A: `/workspaces` can filter to cards that already render a usable capacity value (`?sized=1`, same `usefulListingCapacity` gate as the card). Page-1 ranking also prefers listings with visible capacity. No invented sizes. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-17 to 2026-09-16 (`https://nomads-travel-indol.vercel.app/`): top query `4g-travel-tool.vercel.app` 1 click / 15 impressions / pos 3.0 — FLAG only; no redirect. Near-brand `roam iq` 1/35 pos ~7.91. Branded CTR capped until the custom domain is live (human-owned).

GA4: toolkit not connected this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.
