## 2026-09-24 ~13:20 UTC — homepage waitlist in hero

Track A (conversion): About/images already render; admin auth is env-based; price/Wi-Fi empty states and listing JSON-LD already ship; `/workspaces` sticky already shows on first paint. GA4 still has `/` as the largest landing (61 sessions / 90.2% bounce last 30d). The first waitlist sat *below* a tall hero, so bounce sessions never reached it. Hero now accepts a children slot; `WaitlistInline` (`source=homepage_hero`) renders in a card under the destination/workspace/visa chips. No new routes; sitemap not resubmitted. Vercel live remains `DEPLOYMENT_DISABLED` — code is on main only until deploy is unpaused (human-owned).

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-24–2026-09-23, query): apartment 1/1 pos 1; atzomx 1/20 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/34 pos ~8.3; tomodomo coliving 1/62 pos ~8.6. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only. That host is a *different* live product (Chinese trip planner), not a RoamIQ property (403 in GSC). No redirect, no sameAs. Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 last 30 days (prior STATUS): `/` 61 sessions / 90.2% bounce; `/workspaces` 10 / 100%; top listing landings `/workspaces/92952ead-…` 8 / 37.5% bounce. Fresh GA4 not re-queried this run.

Listings null-rate: prior STATUS on `davvpymbybvniexmkgcu` n=10331 (about empty 0; images empty 0; starting_price empty 50.7%; wifi_speed empty 19.9%). Connected project `uogdeyumztfbwxctilxi` was INACTIVE last run. Do not treat that as a schema change.

Next: unpause Vercel so hero waitlist can ship; restore listings DB to pin remaining high-impression 0-click GSC pages with real names.
