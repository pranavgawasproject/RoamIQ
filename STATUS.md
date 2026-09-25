## 2026-09-25 — give extra listing photos real alt text

Track A (content): About and venue photos already render on `/workspaces` cards and detail pages. Remaining gap: extra gallery thumbs on list cards and related-city rows used empty `alt=""`, so crawlers and screen readers treated stored venue photos as decorative. Alts now use the stored `company_name` only (no invented captions). No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-25–2026-09-24, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/35 pos ~8.3; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` 0/11 pos ~3.3 — FLAG only; different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 not re-queried this run. Prior STATUS: homepage high bounce; `/workspaces` 8–10 sessions / 100% bounce. Property 541610896.

Listings null-rate (prior STATUS on `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178 (21.1%); logo_url empty 895 (8.7%); contact_email empty 4451 (43.1%).

Next: admin auth already env-based; price/Wi-Fi empty states and listing JSON-LD already ship. Conversion copy on `/workspaces` waitlist if bounce stays 100% after deploy lag.
