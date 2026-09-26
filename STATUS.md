## 2026-09-26 — destination listing cards show stored identity fields

Track A (listings): destination `/destinations/[id]` workspace cards already rendered about, photos, price/Wi-Fi pending labels, and contact links, but omitted `product_name`, `registered_entity_name`, and `contact_name`/`contact_designation` even though those columns are stored and already visible on `/workspaces`. Cards now fetch those fields and render them only when helpers accept the stored value. Extra gallery thumbs use company-name alt text instead of empty alt. No invented copy. No new routes; sitemap not resubmitted.

Commit: https://github.com/pranavgawasproject/RoamIQ/commit/7ab0dde8d6c6db6ad5cca0eb4af1850989844323 (STATUS first); code commit follows.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25, query top-20): 12 clicked queries including tomodomo coliving (1/65, pos ~8.5), roam iq (1/34, pos ~8.2), ngb living (1/24), cafe nenom (1/22), atzomx (1/22). Query `4g-travel-tool.vercel.app` FLAG from prior STATUS (0 clicks / 10 impressions / pos ~3.3); not a RoamIQ property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 (last 30d landing pages): `/` 57 sessions bounce ~0.89; `/workspaces` 8 sessions bounce 1.0; some `/workspaces/{id}` bounce 0.25–0.38. Destination landings thin (`/destinations/lisbon`, `/destinations/tallinn`).

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: unpause Vercel so listing and destination schema can be crawled. Do not invent prices. Admin auth already env-based.

## 2026-09-26 — homepage preview cards emit ItemList JSON-LD

Track A (schema after visible fields): homepage `WorkspacesPreview` already rendered about, photos, and price/Wi-Fi pending labels, but had no structured data. The four featured cards now emit an ItemList that reuses `workspaceListItemJsonLd`. No new routes; sitemap not resubmitted. Live origin is still Vercel-paused — domain/billing not touched.

## 2026-09-26 — homepage workspace cards no longer hide price / Wi-Fi

Track A (listings): homepage cards now fetch starting_price / cost / wifi_speed and show stored figure or pending label. Commit: https://github.com/pranavgawasproject/RoamIQ/commit/3f240be4b854367d2a43f4a6b7a78e1a639c0bae
