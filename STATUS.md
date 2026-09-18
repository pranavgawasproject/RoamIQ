## 2026-09-18 — workspaces listed-tags filter

Track A: `/workspaces?tagged=1` keeps cards whose `tags` already pass `usefulListingTags` (the same chips rendered on the card). Factory type labels and 24/7 / standing-desk templates stay excluded. No invented amenities. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-16 (`https://nomads-travel-indol.vercel.app/`): venue-name clicks (`cafe nenom`, `coliving athens`, `ngb living`) plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

Supabase listings (n=10331): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984; tags present 8704.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

## 2026-09-18 — workspaces complete-card filter

Track A: `/workspaces` can filter to cards that already render a usable photo, a visible about/description, and a listed starting price (`?complete=1`). Same three gates as the card UI (`firstVenueListingImage`, `usefulListingAbout`, `usefulStartingPrice`). Page-1 ranking also prefers those complete cards. No invented copy, prices, or photos. Sitemap not resubmitted (same route, new query only).

GSC 2026-08-18 to 2026-09-17 (`https://nomads-travel-indol.vercel.app/`): clicks on long-tail venue names (`cafe nenom`, `coliving athens`, `ngb living`) plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: toolkit not connected this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984. contact_name/product_name are ~100% empty — not used as a filter.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.
