## 2026-09-26 — destination listing cards show stored identity fields

Track A (listings): destination `/destinations/[id]` workspace cards already rendered about, photos, price/Wi-Fi pending labels, and contact links, but omitted `product_name`, `registered_entity_name`, and `contact_name`/`contact_designation` even though those columns are stored and already visible on `/workspaces`. Cards now fetch those fields and render them only when helpers accept the stored value. Extra gallery thumbs use company-name alt text instead of empty alt. No invented copy. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25, query top-20): 12 clicked queries including tomodomo coliving (1/65, pos ~8.5), roam iq (1/34, pos ~8.2), ngb living (1/24), cafe nenom (1/22), atzomx (1/22). Query `4g-travel-tool.vercel.app` not in this top-20 slice this pull — FLAG only from prior STATUS (0 clicks / 10 impressions / pos ~3.3); not a RoamIQ property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 (last 30d landing pages): `/` 57 sessions bounce ~0.89; `/workspaces` 8 sessions bounce 1.0; individual `/workspaces/{id}` rows show lower bounce on some IDs (e.g. 8 sessions / 0.38). Destination landings exist but thin (`/destinations/lisbon`, `/destinations/tallinn`).

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: unpause Vercel so listing and destination schema can be crawled. Do not invent prices. Admin auth already env-based.
