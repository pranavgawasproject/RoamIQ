## 2026-09-18 — restore listed-cost price fallback

Track A: `/workspaces` cards, page-1 ranking, `?priced=1`, and `?complete=1` again treat the stored `cost` column as a listed-price fallback (`usefulListedPrice(starting_price, cost)`). The complete-card commit had dropped that gate, so venues with a figure only in `cost` looked like "Price not listed yet" even though the value exists. No invented prices. Sitemap not resubmitted (same routes).

GSC 2026-08-18 to 2026-09-16 (`https://nomads-travel-indol.vercel.app/`): clicks on long-tail venue names (`cafe nenom`, `coliving athens`, `ngb living`) plus near-brand `roam iq` 1/34 pos ~7.91. Query `4g-travel-tool.vercel.app` 0/12 pos ~2.83 — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: toolkit not connected this run; last logged 28d `/` 138 sessions / bounce 82.6%; `/workspaces` 8 / 87.5%.

Supabase listings (n=10331): about empty 0; images empty 2063; starting_price empty 5243; wifi_speed empty 2055; contact_phone empty 6547; logo_url empty 7395; contact_email empty 7984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account (URL inspect 403); do not mark resolved.

