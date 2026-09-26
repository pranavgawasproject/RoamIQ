## 2026-09-26 — conversion copy on /workspaces index exits

Track A (conversion): About, photos, JSON-LD, price/Wi-Fi empty states, and env-based admin auth already ship. Remaining gap on `/workspaces` is exit behavior. GA4 28d (property 541610896): homepage 57 sessions / 89% bounce; `/workspaces` 7 sessions / 100% bounce / 0% engagement; individual listing landings engage (e.g. `/workspaces/92952ead-…` 8 sessions / 37.5% bounce). Above-fold and footer waitlist copy now points people at opening a listing card first, then email + optional city if they still leave. No session-count hardcode in the UI (it rot). No invented prices/Wi-Fi. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25): 26 clicks / 6565 impressions / CTR 0.40% / avg pos 10.8. Branded (roamiq|roamiq price|roamiq dashboard): 0 clicks / 33 impressions. Query `4g-travel-tool.vercel.app` 0 clicks / 10 impressions / pos ~3.3 — FLAG only; different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

Listings null-rate (`davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: watch `/workspaces` bounce after this copy ships; then consider a list-page module that surfaces 1–2 already-openable listing cards above the fold (no fabricated fields).
