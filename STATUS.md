## 2026-09-23 ~19:00 IST — show waitlist on bounce landings without scroll

Track A (conversion): About/images already render; admin auth is env-based; price/Wi-Fi empty states and listing JSON-LD already ship visible fields only. GA4 still treats `/workspaces` as a 100% bounce landing (10 sessions, 24 Aug–21 Sep prior window). The sticky waitlist previously waited for 480px of scroll, so bounce sessions never saw it. Default `afterPx` is now 0, so `/workspaces` and listing-detail sticky bars appear immediately (those pages already mount `WaitlistSticky`). Copy is unchanged and does not invent urgency.

Also added live GSC 0-click city guides still earning impressions in 2026-08-24–2026-09-22: Athens (3), Barcelona (1), Buenos Aires (3) on `INTENT_PAGES`. No invented destinations.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-24–2026-09-22, query): cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/9 pos 7; ngb living 1/25 pos ~7.1; roam iq 1/34 pos ~8.3; urban place 1/2. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only; host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: not re-run this pass (prior 24 Aug–21 Sep: `/` 63 sessions / 90.5% bounce; `/workspaces` 10 / 100%).

Listings null-rates: reused prior n=10331: about empty 0; images empty 0; starting_price empty 5243 (50.7%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178; logo_url empty 895; contact_email empty 4451.

Live Vercel host nomads-travel-indol.vercel.app is currently paused (deployment paused page). Code still lands on main.

Sitemap not resubmitted (no new routes).

---
