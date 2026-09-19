## 2026-09-19 — workspaces listed-host filter

Track A: /workspaces?hosted=1 keeps cards whose contact_name / contact_designation already pass usefulListingContactPerson (same host chip on the card). No invented hosts. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-19 to 2026-09-18: 18 clicks / 6206 impressions / CTR 0.29% / avg position 11.9. Query 4g-travel-tool.vercel.app FLAG only (14 impressions, position ~3.1); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d home 139 sessions / bounce 82.7%; /workspaces 10 / 90% (property id not resolved this pass).

4g-travel-tool.vercel.app duplicate-index status: FLAG / pending.

## 2026-09-19 — workspaces listed-plan (product_name) filter

Track A: `/workspaces?producted=1` keeps cards whose stored `product_name` already passes `usefulListingProductName` (the same plan label under the venue name). Related-city cards now select `product_name` / `contact_name` / `contact_designation` so those rows can render when present. No invented plans. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-19 to 2026-09-18 (`https://nomads-travel-indol.vercel.app/`): ~18 clicks / ~6.2k impressions / CTR ~0.29% / avg position ~12. Venue-name clicks continue (`cafe nenom`, `cafe nook`, `coliving athens`); query `4g-travel-tool.vercel.app` FLAG only (14 impressions, position ~3.1); inspect of that host against this property is 403 (not part of property). Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d `/` 139 sessions / bounce 82.7%; `/workspaces` 10 / 90% (GA4 connector not available this pass; reused last logged snapshot).

Supabase listings snapshot: n=10331; about_null 0; images_null 0; starting_price_null 5243; wifi_speed_null 2055; phone_null 2178; logo_null 895; email_null 4451; product_name populated 0 (filter is honest-empty until enrichment lands).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

## 2026-09-19 — render stored product_name and contact person

Track A: listing cards and `/workspaces/[id]` now show `product_name` and `contact_name` / `contact_designation` when those strings already pass a usefulness check (not a repeat of the venue name, not a placeholder). Empty rows stay empty — no invented plans or hosts. Sitemap not resubmitted (same routes).

GSC 2026-08-19 to 2026-09-18 (`https://nomads-travel-indol.vercel.app/`): 18 clicks / 6,206 impressions / CTR 0.29% / avg position 11.9. Top clicked queries remain venue names (`cafe nenom`, `cafe nook`). Branded CTR capped until the custom domain is live (human-owned).

GA4: last logged 30d `/` 139 sessions / bounce 82.7%; `/workspaces` 10 / 90% (property id not resolved this pass; reused last logged snapshot).

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.
