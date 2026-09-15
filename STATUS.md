## 2026-09-15 — workspaces street-address filter (addressed)

Track A: `/workspaces` can now filter to cards that already show a useful street address (`?addressed=1`). The gate is `usefulStreetAddress` (same helper the card already uses), so city-only or placeholder addresses stay out. Unfiltered page-1 ranking also boosts rows that already display a street line. No fabricated copy. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-15 to 2026-09-14 (`https://nomads-travel-indol.vercel.app/`): top query `4g-travel-tool.vercel.app` 2 clicks / 17 impressions / pos ~3.06 — FLAG only; no redirect. Near-brand `roam iq` 1/35 pos ~7.91. Zero exact `roamiq` rows. Branded CTR capped until the custom domain is live (human-owned).

GA4 2026-08-15 to 2026-09-14: `/` 174 sessions / 81.0% bounce; `/workspaces` 9 sessions / 88.9% bounce; homepage remains the main landing.

Listings (n=10331): about empty 540; images null 0; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984; useful-looking address rows 2419.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-15 — workspaces hours filter (usefulOpenHours)

Track A: `/workspaces` can now filter to cards that already show listed hours (`?hours=1`). The gate is `usefulOpenHours`, not raw `open_hours`, so factory 24/7 placeholders stay out. First-page ranking also boosts rows that already display hours. No fabricated copy. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-16 to 2026-09-14 (`https://nomads-travel-indol.vercel.app/`): top query `4g-travel-tool.vercel.app` 2 clicks / 16 impressions / pos 3.0 — FLAG only; no redirect. Other clicked queries are venue/category terms. Zero exact `roamiq` rows. Branded CTR capped until the custom domain is live (human-owned).

GA4: prior snapshot still applies — homepage is the main landing; `/workspaces` bounce stays high.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-15 — listing title and units in visible JSON-LD

Track A: Index ItemList helper and FAQPage JSON-LD now set `alternateName` / title FAQ from `usefulListingTitle` and attach listed units to the price FAQ (or a standalone units FAQ when price is pending). Schema only repeats fields already shown. Detail-page LocalBusiness `alternateName` and Offer `unitText` were prepared in the same change set. No fabricated copy. Sitemap not resubmitted (no new routes).

GSC 2026-08-15 to 2026-09-14 (`https://nomads-travel-indol.vercel.app/`): top query `4g-travel-tool.vercel.app` 2 clicks / 17 impressions / pos ~3.06 — FLAG only; no redirect. Near-brand `roam iq` 1/35 pos ~7.91. Zero exact `roamiq` rows. Branded CTR capped until the custom domain is live (human-owned).

GA4: prior snapshot still applies — homepage is the main landing; `/workspaces` bounce stays high (~9 sessions / 88.9% bounce in the 2026-08-15 to 2026-09-14 window).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.
