## 2026-09-23 ~03:44 UTC — remaining GSC-clicked listing pages on intent links

Track A (conversion): About/images already render; admin auth is already env-based; price/Wi-Fi empty states already have waitlist; detail JSON-LD already includes visible capacity/price units. GSC page dimension 2026-08-24–2026-09-21 still had 7 clicked listing URLs missing from `INTENT_LISTINGS`. Added from the listings table (no invented names): GoLiving GmbH (Berlin), A&o Hostel Berlin Mitte, Josephine'S Guesthouse For Women (Zurich), Sunflower Hostel Berlin, Zuerich Apartments Kurvenstrasse, Meccano Coworking Space (Cairo), Café Restaurant NOOK (Casablanca‑Settat). Sitemap already includes `INTENT_LISTING_IDS` — not resubmitted (no new routes; extra listing URLs already live).

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-24–2026-09-21): 22 clicks / 6,272 impressions / CTR 0.35% / avg position ~11.1. Top queries: cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/9 pos 7. Branded: `roamiq` 0/6 pos 9.5; `roamiq price` 0/25 pos ~8.9; `roam iq` not re-sliced this pass. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only; host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: not re-run this pass (prior 24 Aug–20 Sep: `/` 63 sessions / 90.5% bounce; `/workspaces` 10 / 100%). Live host still returns Vercel “deployment paused” — not changed.

Listings `davvpymbybvniexmkgcu` n=10331: about empty 0; images empty (cardinality=0) 2063 / usable-image treatment in app treats most as present; starting_price empty 5243 (50.7%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178; logo_url empty 895; contact_email empty 4451.

---

## 2026-09-23 ~03:40 UTC — GA4 bounce listing + visible capacity in detail JSON-LD

Track A (conversion + schema): About/images already render; admin auth is already env-based; price/Wi-Fi empty states already have waitlist. Two remaining gaps this run:

1. GA4 landing `/workspaces/75a2fe92-79ac-4d29-af9d-d1f5a49dd639` (Combinata - Coworking Bologna Accessibile, Bologna) had 2 sessions / 100% bounce in 24 Aug–20 Sep and was missing from `INTENT_LISTINGS`. Added from the listings table — no invented name.
2. Workspace detail JSON-LD now emits `maximumAttendeeCapacity` and price `unitText` when those values are already visible on the page (same rules as related-row schema). No schema for empty capacity/price.

GSC (query, 2026-08-24–2026-09-20): cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/9 pos 7; ngb living 1/25 pos ~7.1; roam iq 1/34 pos ~8.3; urban place 1/2. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only; host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property `541610896` (2026-08-24–2026-09-20): `/` 63 sessions / 90.5% bounce; `/workspaces` 10 / 100%; `/workspaces/92952ead-...` 8 / 37.5%; `/workspaces/7f4cc6c5-...` 4 / 25%; `/workspaces/d3013dbe-...` 4 / 100%; `/workspaces/75a2fe92-...` 2 / 100%. Live host still returns Vercel “deployment paused” — not changed.

Listings `davvpymbybvniexmkgcu` n=10331: about empty 0; images empty 0; starting_price empty 5243 (50.7%); wifi_speed empty 2055 (19.9%); contact_phone empty 2178; logo_url empty 895; contact_email empty 4451.

Sitemap not resubmitted (no new routes; existing listing URL already in catalog).

---

## 2026-09-23 ~03:35 UTC — street address in listing SERP title/description

Track A (SEO/conversion): GSC 2026-08-23 to 2026-09-21 still shows 0-click impressions on street-address queries (e.g. `301 brazos street austin`, `11801 domain blvd`, `1 university avenue toronto`, `4g-travel-tool.vercel.app` FLAG only). About/images already render; admin auth is already env-based. Listing pages now put the *stored* street address into `<title>`, meta description, and keywords when `usefulStreetAddress` returns a value. No invented addresses. Title extras cap raised to 3 so address can sit next to listed price/Wi-Fi.

GSC (query, 2026-08-23–2026-09-21): cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/9 pos 7; ngb living 1/29 pos ~6.9; roam iq 1/34 pos ~8.3; urban place 1/2. Query `4g-travel-tool.vercel.app` 0/12 pos ~3.3 — FLAG only; host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: not re-run this pass (prior snapshot 24 Aug–20 Sep: `/` ~63 sessions / ~90% bounce; `/workspaces` 10 / 100%).

Listings null-rates: reused prior n=10331 (SQL not re-run): about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Sitemap not resubmitted (no new routes).

---

## 2026-09-22 ~14:05 UTC — price/Wi-Fi transparency on /workspaces

Track A (conversion): GSC still shows impression demand for price-shaped queries (`roamiq price` in the prior window) while GA4 keeps `/workspaces` at 100% bounce (10 sessions, 24 Aug–20 Sep). About/images already render. Added an above-the-fold note that price and Mbps only appear when stored, plus filters to `priced=1` and `wifiable=1`. No invented figures. Waitlist copy unchanged.

GSC 2026-08-22 to 2026-09-21 (query): cafe nenom 1/22 pos ~9.1; cafe nook 1/12; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/8; ngb living 1/31; roam iq 1/35 pos ~8.2; urban place 1/2. Query `4g-travel-tool.vercel.app` 0 clicks / 12 impressions pos ~3.3 — FLAG only; that host is not on this GSC property so inspect is not possible here; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: reused same-day snapshot — `/` ~63–67 sessions / ~90% bounce; `/workspaces` 10 / 100%. Live `nomads-travel-indol.vercel.app` and `roamiq-app.vercel.app` still return Vercel “deployment paused” — not changed (domain config is human-owned).

Listings null-rates: reused prior n=10331 (Composio SQL 403 / PostgREST 401 this run): about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Sitemap not resubmitted (no new routes).

---

## 2026-09-22 ~13:58 UTC — waitlist on thin /workspaces cards

Track A (conversion): `/workspaces` remains a 100% bounce landing page (GA4 2026-08-24–2026-09-20, 10 sessions). About and images already render on cards. Listings that still have no listed price *and* no listed Wi-Fi *and* no venue email/phone now show an on-card waitlist (`source=workspaces-card-thin`) instead of a dead footer. Copy states we only write when a stored price or Wi-Fi figure exists — no invented numbers. Top-of-page waitlist description updated to the current bounce window.

GSC 2026-08-24 to 2026-09-20 (query dimension, top rows): cafe nenom 1/22 pos ~9.1; cafe nook 1/12; coliving zürich 1/1; durty nellys amsterdam 1/1; innapartment taipei 1/8; ngb living 1/25; roam iq 1/34 pos ~8.3; urban place 1/2. Branded `roamiq` 0 clicks / 6 impressions pos ~9.5; `roamiq price` 0/21 pos ~8.8. Query `4g-travel-tool.vercel.app` FLAG only — inspect of that host is not on this GSC property; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 property `541610896` (2026-08-24 to 2026-09-20): `/` 63 sessions / 90.5% bounce; `/workspaces` 10 / 100%; individual listing landings lower bounce (e.g. `/workspaces/92952ead-...` 8 / 37.5%).

Listings null-rates: Composio SQL 403 / PostgREST 401 this run — reused prior snapshot n=10331: about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Sitemap not resubmitted (no new routes).

---

## 2026-09-22 — Pin GSC-clicked listing pages into intent links + sitemap

Track A: `/workspaces` still 100% bounce on the index. Added the listing *pages* that already earned a GSC click (page dimension, 2026-08-22–2026-09-21) to `IntentListingLinks` — Tomodomo Zurich, Athens Art Apartments, RezG Hub, Space2Work, Facts Coworking, PARKLAND Colombo, IRIE Montreal, Home & Co Berlin Yard — IDs resolved from the listings table. Sitemap now always includes those intent IDs so crawl budget is not limited to the ratings-capped 80-row slice. Refreshed index chips (dropped Izzy's; 0 clicks in this window). Sitemap routes unchanged except extra listing URLs already live.

GSC 2026-08-22 to 2026-09-21: venue queries with 1 click each include cafe nenom, cafe nook, coliving zürich, durty nellys amsterdam, innapartment taipei, ngb living, urban place; branded `roam iq` 1 click / 35 impressions / pos ~8.2. Query `4g-travel-tool.vercel.app` FLAG only — no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4 (prior same-day snapshot): `/` 67 sessions / 89.6% bounce; `/workspaces` 10 sessions / 100% bounce.

Listings null-rates (n=10331): about 0 empty, images 0 empty, starting_price 5243 empty (50.7%), wifi_speed 2055 empty (19.9%), contact_phone 2178, logo_url 895, contact_email 4451.

Live site note: nomads-travel-indol.vercel.app still returns Vercel deployment paused — not changed this run.

---
