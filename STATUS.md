## 2026-09-14 — listing state/region on destination workspace cards

Track A: Destination city pages now select listing `state` and render it via `usefulListingRegion` on workspace cards (city, region, country · continent) when the helper accepts the stored value. Duplicate city-as-state rows stay hidden. No invented geography. Sitemap not resubmitted (no new routes).

## 2026-09-14 — listing capacity + continent on destination workspace cards

Track A: Destination city pages now select listing `capacity` and `continent` and render them on workspace cards (continent after city/country; capacity under price/units) when helpers accept the stored value. Placeholders stay hidden. ItemList JSON-LD already emits those fields when present on the listing object. No invented sizes or geography. Sitemap not resubmitted (no new routes).

GSC 2026-08-14 to 2026-09-13 (`https://nomads-travel-indol.vercel.app/`): top query sample led by `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded `roam iq` 1 click / 36 impressions / pos ~7.89. Branded CTR capped until the custom domain is live (human-owned).

GA4: connector not available this run; prior 28d note stands — homepage is the main landing; `/workspaces` is a small, high-bounce sample.

Listings table (n=10,331): about non-empty 9,791; images_null 0 (column present on all rows); starting_price null 5,243; wifi_speed null 2,055; contact_phone null 6,547; logo_url null 7,395; contact_email null 7,984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-14 — listing capacity on workspaces cards

Track A: `/workspaces` cards and listing detail now select `capacity` and show it under price/units when `usefulListingCapacity` accepts the stored value (real seat/size text; placeholders stay hidden). ItemList/LocalBusiness JSON-LD adds `maximumAttendeeCapacity` only when that visible text contains a parseable positive integer. No invented sizes. Sitemap not resubmitted (no new routes).

GSC 2026-08-15 to 2026-09-13 (`https://nomads-travel-indol.vercel.app/`): query sample still led by `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded `roam iq` 1 click / 35 impressions / pos ~7.9. Branded CTR capped until the custom domain is live (human-owned).

GA4 last 28d (property 541610896 from prior run): homepage remains the main landing; `/workspaces` is a small, high-bounce sample. Branded CTR capped until the custom domain is live (human-owned).

Listings table (n=10,331 from 2026-09-13 status): about 9,791; images nonempty 8,268; starting_price 5,088; wifi_speed 8,276; contact_phone 3,784; logo_url 2,936; contact_email 2,347; continent named (excl. Other/null) 9,344.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-13 — listing continent on workspaces cards

Track A: `/workspaces` cards and listing detail now select `continent` and show it after country when it is a named continent (Africa, Asia, Europe, North/South America, Oceania, Australia). Placeholder `Other` stays hidden. ItemList JSON-LD adds `containedInPlace` only for that visible continent. No invented geography. Sitemap not resubmitted (no new routes).

GSC 2026-08-14 to 2026-09-12 (`https://nomads-travel-indol.vercel.app/`): query sample still led by `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded `roam iq` 1 click / 34 impressions / pos ~7.9. Branded CTR capped until the custom domain is live (human-owned).

GA4 last 28d (property 541610896): homepage remains the main landing; `/workspaces` is a small, high-bounce sample. Branded CTR capped until the custom domain is live (human-owned).

Listings table (n=10,331): about 9,791; images nonempty 8,268; starting_price 5,088; wifi_speed 8,276; contact_phone 3,784; logo_url 2,936; contact_email 2,347; continent named (excl. Other/null) 9,344.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-13 — listing region on workspaces cards

Track A: `/workspaces` cards now show `state` between city and country when it is a real region (not a placeholder and not a repeat of the city name). Listing detail uses the same helper. ItemList/LocalBusiness `addressRegion` only emits that visible region. No invented locations. Sitemap not resubmitted (no new routes).

GSC 2026-08-14 to 2026-09-13 (`https://nomads-travel-indol.vercel.app/`): 15 clicks / 4,887 impressions / CTR 0.31% / avg position 13.0. Top query still `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded `roam iq` 1 click / 34 impressions / pos ~7.9. Branded CTR capped until the custom domain is live (human-owned).

GA4 2026-08-14 to 2026-09-13 (property 541610896): `/` 180 sessions bounce 80.6%; `/workspaces` 9 sessions bounce 88.9% (1 engaged). Several listing-detail landings bounced at 100% on tiny samples.

Listings table (n=10,331): about 9,791; images nonempty 8,268; starting_price 5,088; wifi_speed 8,276; contact_phone 3,785; logo_url 2,936; contact_email 2,359.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — inspecting that host is a different GSC property; do not mark resolved.
