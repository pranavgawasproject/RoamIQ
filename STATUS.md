## 2026-09-19 — listed Wi-Fi filter + continent filter declaration

Track A: `/workspaces?wifiable=1` keeps cards whose `wifi_speed` already passes `usefulWifiSpeed` (same gate as the card label / pending fallback). Also restored `const continentedOnly` so `?continented=1` actually filters again (the query param and UI were live, the const was missing). Removed duplicate units/capacity lines on unpriced cards. No invented speeds. Sitemap not resubmitted (same route, new query only).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending (query still appears on nomads-travel-indol property; no GSC access to the old host; no redirect).

## 2026-09-18 — workspaces listed-price uses stored cost

Track A: `/workspaces` now selects the listings `cost` column and renders / ranks / filters priced cards through `usefulListedPrice(starting_price, cost)` — the same helper the detail page already used. `?priced=1` keeps rows whose starting_price *or* cost already holds a usable figure; placeholders still fail the helper. No invented prices. Sitemap not resubmitted (same route).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

## 2026-09-18 — workspaces listed-continent filter

Track A: `/workspaces?continented=1` keeps cards whose `continent` already passes `usefulListingContinent` (the same continent label rendered after country). No invented continents. Page-1 ranking also prefers those rows. Restores the filter after the later regioned patch dropped the query param. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-17 (`https://nomads-travel-indol.vercel.app/`): venue-name clicks (`cafe nenom`, `cafe nook`, `coliving athens`, `durty nellys amsterdam`, `innapartment taipei`, `izzy's coffee and brunch`, `ngb living`) plus `roam iq` (1 click / 34 impressions). Query `4g-travel-tool.vercel.app` remains a FLAG only (12 impressions, position ~2.8); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d `/` 139 sessions / bounce 82.7%; `/workspaces` 10 / 90% (GA4 report not re-run this pass; reused last logged snapshot).

Supabase listings snapshot: n=10331; about_null 0; images_null 0 (empty-array photos still exist in UI gates); starting_price_null 5243; wifi_speed_null 2055; phone_null 6547; logo_null 7395; email_null 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.
