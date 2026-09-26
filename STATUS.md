## 2026-09-26 — listing JSON-LD now includes visible title and legal name

Track A (listings/schema): about + images were already rendered. Primary listing JSON-LD repeated photos, about, price, Wi-Fi, hours, and address when those fields are on the page, but omitted the visible `company_title` and registered-entity line. `alternateName` and `legalName` are now set only when those helpers return a real value. No invented copy. No new routes; sitemap not resubmitted.

Commit: https://github.com/pranavgawasproject/RoamIQ/commit/5abb32a37e147adcd4112c83904c8777512b9d89

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25, query): clicks on apartment, atzomx, cafe nenom, cafe nook, coliving zurich/zürich, roam iq (1/34, pos ~8.2), tomodomo coliving (1/65, pos ~8.5). Query `4g-travel-tool.vercel.app` 0 clicks / 10 impressions / pos ~3.3 — FLAG only; inspect of that host against this property is 403 (not this property). No redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: see run report below / prior STATUS homepage high bounce; `/workspaces` thin sessions + high bounce. Property 541610896.

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: confirm production deploy of JSON-LD fields. Do not invent prices/wifi.
