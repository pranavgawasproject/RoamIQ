## 2026-09-26 — do not print a fake 1-row catalog on /workspaces

Track A (data-integrity): when `getCatalogCount()` fails or returns 0, the H1 fell back to the current page window length and read “1 workspaces & stays, live from the database.” That is a thin/broken headline (and was what crawlers saw when the catalog query missed). H1 now omits the number unless the exact public catalog count is known. Sticky waitlist on this index also gets explicit high-exit copy without fabricated stats. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/33 pos ~8.2; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` 0/10 pos ~3.3 — FLAG only; different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 not re-queried this run. Prior STATUS: homepage high bounce; `/workspaces` 8–10 sessions / 100% bounce. Property 541610896. Live origin currently returns Vercel DEPLOYMENT_DISABLED (402) — flag only; domain/billing config not touched.

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%). Connected Composio Supabase project `uogdeyumztfbwxctilxi` is INACTIVE this run.

Next: production deploy is disabled on Vercel (human-owned). After it is live, confirm H1 catalog count and `/workspaces` bounce. Admin auth already env-based.
