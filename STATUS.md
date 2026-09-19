## 2026-09-19 — render stored product_name and contact person

Track A: listing cards and `/workspaces/[id]` now show `product_name` and `contact_name` / `contact_designation` when those strings already pass a usefulness check (not a repeat of the venue name, not a placeholder). Empty rows stay empty — no invented plans or hosts. Sitemap not resubmitted (same routes).

GSC 2026-08-19 to 2026-09-18 (`https://nomads-travel-indol.vercel.app/`): 18 clicks / 6,206 impressions / CTR 0.29% / avg position 11.9. Top clicked queries remain venue names (`cafe nenom`, `cafe nook`). Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d `/` 139 sessions / bounce 82.7%; `/workspaces` 10 / 90% (property id not resolved this pass; reused last logged snapshot).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

## 2026-09-19 — workspaces listed-coordinates filter

Track A: `/workspaces?coordinated=1` keeps cards whose stored latitude/longitude already pass `usefulListingCoordinates` (the same pair rendered next to the Map chip). No invented pins. Page-1 ranking prefers those rows. Sitemap not resubmitted (same route, new query only).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

## 2026-09-19 — workspaces listed-Wi-Fi filter + continent filter declaration

Track A: `/workspaces?wified=1` keeps cards whose `wifi_speed` already passes `usefulWifiSpeed` (the same label rendered on the card). No invented speeds. Also declares `continentedOnly` from `params.continented` so the existing continent filter is a real binding, not an implicit reference. Jump chip + checkbox added. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-19 to 2026-09-18 (`https://nomads-travel-indol.vercel.app/`): 9 clicks on venue-name / branded queries (`cafe nenom`, `cafe nook`, `coliving athens`, `coliving zürich`, `durty nellys amsterdam`, `innapartment taipei`, `izzy's coffee and brunch`, `ngb living`, `roam iq` 1/34). Query `4g-travel-tool.vercel.app` FLAG only (14 impressions, position ~3.1); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d `/` 139 sessions / bounce 82.7%; `/workspaces` 10 / 90% (GA4 connector not available this pass; reused last logged snapshot).

Supabase listings snapshot: n=10331; about_null 0; images_null 0; starting_price_null 5243; wifi_speed_null 2055; phone_null 2178; logo_null 895; email_null 4451.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.
