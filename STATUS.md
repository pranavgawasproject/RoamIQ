## 2026-09-26 — homepage workspace cards no longer hide price / Wi-Fi

Track A (listings): `WorkspacesPreview` already rendered about + photos, but omitted `starting_price` / `cost` / `wifi_speed`. Homepage cards now fetch those columns and show the stored figure or an explicit pending label (same copy as `/workspaces`). No invented numbers. No new routes; sitemap not resubmitted.

Commit: https://github.com/pranavgawasproject/RoamIQ/commit/3f240be4b854367d2a43f4a6b7a78e1a639c0bae

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-24, query): clicks on apartment, atzomx, cafe nenom, cafe nook, coliving zürich, roam iq (1/33, pos ~8.2), tomodomo coliving (1/65, pos ~8.5). Query `4g-travel-tool.vercel.app` 0 clicks / 10 impressions / pos ~3.3 — FLAG only; different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 not re-queried this run. Prior STATUS: homepage high bounce; `/workspaces` 8–10 sessions / 100% bounce. Property 541610896. Live origin previously flagged Vercel DEPLOYMENT_DISABLED (402) — domain/billing config not touched.

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: after production is live, confirm homepage cards show pending labels. Admin auth already env-based. JSON-LD already repeats only visible fields.
