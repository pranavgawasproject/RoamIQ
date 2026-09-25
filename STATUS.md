## 2026-09-25 — /workspaces waitlist GA4 window + GSC click chips

Track A (conversion): About/images already render; admin auth is env-based (`ADMIN_ACCESS_KEY`); price/Wi-Fi empty states and listing JSON-LD already ship. `/workspaces` is still the thin high-exit index in GA4. First-paint waitlist copy now cites the current window: 8 sessions, 100% bounce (26 Aug–24 Sep, property 541610896) — not the prior 10-session 24 Aug–20 Sep line. Two venue-name queries that earned a GSC click in 26 Aug–24 Sep (`atzomx`, `tomodomo coliving`) were added to the index name chips. No invented stats. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-24, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/32 pos ~8.1; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` FLAG only — different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

Top GSC pages (same window, by clicks): `/workspaces/2d5aada6-…` 2/40; `/` 1/76; `/destinations/tallinn` 1/11; high-impression listings include `/workspaces/ce1965c3-…` 1/165 and `/workspaces/6c1f5162-…` 1/159. `/workspaces` index 0/20.

GA4 property 541610896 last 30 days: `/` 59 sessions / 89.8% bounce; `/workspaces` 8 / 100%; `/workspaces/92952ead-…` 8 / 37.5%; `/workspaces/d3013dbe-…` 4 / 100%.

Listings null-rate on `davvpymbybvniexmkgcu` n=10331: about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178 (21.1%); logo_url empty 895 (8.7%); contact_email empty 4451 (43.1%). Project `uogdeyumztfbwxctilxi` remains INACTIVE.

Next: unpause Vercel so this copy can ship; keep pinning remaining 0-click listing URLs only when company_name + city exist.

## 2026-09-25 â pin next 0-click GSC listing pages

Track A (conversion): About/images already render on `/workspaces` and `/workspaces/[id]`; admin auth is env-based (`ADMIN_ACCESS_KEY`); price/Wi-Fi empty states and listing JSON-LD already ship. Next gap: six listing URLs with Search impressions and 0 clicks (2026-08-25â2026-09-24) were not on the homepage intent chips. Names and cities are from `listings` on `davvpymbybvniexmkgcu` â no invented venues: de Werkplek (Amsterdam, 7 imp), CafÃ© Don TomÃ¡s (Tulum, 5), CAFE TALES (Osaka, 5), E6 Apartments (Austin, 5), Prana CafÃ© (Austin, 4), Nao Good Vibes (Tirana, 3). No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-25â2026-09-24, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zÃ¼rich 1/1; roam iq 1/34 pos ~8.3; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` 0/11 pos ~3.3 â FLAG only. That host is a different live product, not a RoamIQ property. No redirect, no sameAs. Branded: roamiq 0/5 pos 10.2; roamiq price 0/27 pos ~8.9; roam iq 1/34. Branded CTR capped until the custom domain is live (human-owned).

Top GSC pages (same window): `/workspaces/ce1965c3-â¦` 1 click / 165 imp; `/workspaces/6c1f5162-â¦` 1/159; homepage 1/81; `/workspaces/ea53ff4c-â¦` 1/65; `/about` 0/21; `/workspaces` index 0/20.

GA4: not re-queried this run. Prior STATUS: `/` 61 sessions / 90.2% bounce; `/workspaces` 10 / 100%.

Listings null-rate on `davvpymbybvniexmkgcu` n=10331: about empty 0; images empty 2063 (20.0%); starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178 (21.1%); logo_url empty 895 (8.7%); contact_email empty 4451 (43.1%). Project `uogdeyumztfbwxctilxi` remains INACTIVE.

Next: unpause Vercel so hero waitlist and these chips can ship; keep pinning remaining 0-click listing URLs only when company_name + city exist.

## 2026-09-25 ~03:30 UTC — about first-paint waitlist + visible FAQ

Track A (conversion + schema integrity): `/about` had 21 impressions and 0 clicks in GSC (2026-08-25–2026-09-24) and shipped FAQ JSON-LD with no matching on-page Q&A. Hero now includes `WaitlistInline` (`source=about_hero`). The four FAQ answers already in `faqJsonLd` render as visible `<dl>` cards so schema matches the page. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-25–2026-09-24, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; roam iq 1/34 pos ~8.3; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` 0/11 pos ~3.3 — FLAG only; not a RoamIQ property. Branded CTR capped until the custom domain is live (human-owned).

Top GSC pages same window: `/workspaces/2d5aada6-…` 2 clicks / 40 impr; `/` 1/81; `/community` 1/7; `/destinations/tallinn` 1/11; `/workspaces/6c1f5162-…` 1/159; `/workspaces/ce1965c3-…` 1/165. `/about` 0/21; `/workspaces` 0/20.

GA4 not re-queried this run (no GA4 Composio tool in this session). Prior STATUS: `/` 61 sessions / 90.2% bounce; `/workspaces` 10 / 100%.

Next: unpause Vercel so about hero waitlist and FAQ can ship; keep listing pins current as 0-click high-impression pages appear.

## 2026-09-24 ~13:20 UTC — homepage waitlist in hero

Track A (conversion): About/images already render; admin auth is env-based; price/Wi-Fi empty states and listing JSON-LD already ship; `/workspaces` sticky already shows on first paint. GA4 still has `/` as the largest landing (61 sessions / 90.2% bounce last 30d). The first waitlist sat *below* a tall hero, so bounce sessions never reached it. Hero now accepts a children slot; `WaitlistInline` (`source=homepage_hero`) renders in a card under the destination/workspace/visa chips. No new routes; sitemap not resubmitted. Vercel live remains `DEPLOYMENT_DISABLED` — code is on main only until deploy is unpaused (human-owned).

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-24–2026-09-23, query): apartment 1/1 pos 1; atzomx 1/20 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/34 pos ~8.3; tomodomo coliving 1/62 pos ~8.6. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only. That host is a *different* live product (Chinese trip planner), not a RoamIQ property (403 in GSC). No redirect, no sameAs. Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 last 30 days (prior STATUS): `/` 61 sessions / 90.2% bounce; `/workspaces` 10 / 100%; top listing landings `/workspaces/92952ead-…` 8 / 37.5% bounce. Fresh GA4 not re-queried this run.

Listings null-rate: prior STATUS on `davvpymbybvniexmkgcu` n=10331 (about empty 0; images empty 0; starting_price empty 50.7%; wifi_speed empty 19.9%). Connected project `uogdeyumztfbwxctilxi` was INACTIVE last run. Do not treat that as a schema change.

Next: unpause Vercel so hero waitlist can ship; restore listings DB to pin remaining high-impression 0-click GSC pages with real names.
