## 2026-09-26 — destination cards actually render stored identity fields

Track A (listings): prior STATUS claimed destination `/destinations/[id]` cards showed `product_name`, `registered_entity_name`, and host name, but commit 7ab0dde only updated STATUS.md. This run fetches those columns and renders Plan / Legal name / Host only when `usefulListingProductName`, `usefulListingRegisteredEntity`, and `usefulListingContactPerson` accept the stored value. Extra gallery thumbs use company-name alt text instead of empty alt. No invented copy. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25): 28 clicks / 6,717 impressions / CTR 0.42% / avg position 10.74. Clicked queries include tomodomo coliving (1/65, pos ~8.5), roam iq (1/34, pos ~8.2), ngb living (1/24), cafe nenom (1/22), atzomx (1/22). Query `4g-travel-tool.vercel.app` FLAG: 0 clicks / 10 impressions / pos ~3.3 — not a RoamIQ property; no redirect (canonical already set). Branded CTR capped until the custom domain is live (human-owned).

GA4 property 541610896 (last 30d): `/` 57 sessions bounce 0.89; `/workspaces` 8 sessions bounce 1.0; `/workspaces/92952ead-...` 8 sessions bounce 0.38; destination landings thin (`/destinations` 1 bounce 1.0, `/destinations/lisbon` 1 bounce 0, `/destinations/tallinn` 1 bounce 0).

Listings null-rate (prior STATUS `davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%).

Next: unpause Vercel so listing and destination schema can be crawled. Homepage preview cards still omit identity fields. Do not invent prices. Admin auth already env-based.

