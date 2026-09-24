## 2026-09-24 ~13:05 UTC — sticky waitlist visible on first paint

Track A (conversion): About/images already render; admin auth is env-based; price/Wi-Fi empty states and listing JSON-LD already ship. Could not pin the next GSC 0-click listing pages: Vercel live is `DEPLOYMENT_DISABLED` and the listings Supabase project (`uogdeyumztfbwxctilxi`) is INACTIVE, so company_name/city could not be confirmed from the table — no invented venue names. Instead fixed `WaitlistSticky`: `scrollY > afterPx` hid the bar at scroll 0 even when `afterPx` is 0. `/workspaces` is 10 sessions / 100% bounce in the current GA4 window — those visits never scroll. Bar now shows on first paint (`scrollY >= afterPx`, initial state true when afterPx is 0). No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-24–2026-09-22, query): apartment 1/1 pos 1; atzomx 1/20 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/34 pos ~8.3; tomodomo coliving 1/62 pos ~8.6. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only; that host is not a GSC property on this account (403); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 last 30 days: `/` 61 sessions / 90.2% bounce; `/workspaces` 10 / 100%; top listing landings `/workspaces/92952ead-…` 8 / 37.5% bounce.

Listings null-rate: prior STATUS on `davvpymbybvniexmkgcu` n=10331 (about empty 0; images empty 0; starting_price empty 50.7%; wifi_speed empty 19.9%). Fresh SQL against connected project `uogdeyumztfbwxctilxi` timed out — project INACTIVE. Do not treat that as a schema change.

Next: restore Vercel deploy + listings DB so remaining high-impression 0-click pages from GSC start_row 200 (e.g. 9970991f 87 imp, 756eae33 67, a5ac284f 65) can be pinned with real names.
