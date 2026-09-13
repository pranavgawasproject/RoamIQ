## 2026-09-13 — listing price units on workspaces cards

Track A: `/workspaces` cards and listing detail now select `units` and show `per day` / `per month` under a listed `starting_price` when that column is one of those two stored labels. ItemList/LocalBusiness JSON-LD adds `unitText` only for the same visible unit. No invented prices or periods. Sitemap not resubmitted (no new routes).

## 2026-09-13 — list inclusions and services on workspace cards

Track A: /workspaces now selects inclusions and services and renders them on cards when those fields already pass the existing filters (no invented amenities). ItemList JSON-LD adds the same visible inclusions/services as amenityFeature. Sitemap not resubmitted (no new routes).

GSC 2026-08-14 to 2026-09-12 (https://nomads-travel-indol.vercel.app/): query sample still led by 4g-travel-tool.vercel.app (2 clicks / 17 impressions / pos ~3.1) — FLAG only, no redirect. Branded roam iq 1 click / 34 impressions / pos ~7.9. Branded CTR capped until the custom domain is live (human-owned).

GA4 last 30d (property 541610896): homepage ~178 sessions / high bounce; /workspaces ~9 sessions. Homepage remains the main exit.

4g-travel-tool.vercel.app duplicate-index status: FLAG / pending — do not mark resolved.

## 2026-09-13 — list ItemList ContactPoint + visible tags

Track A: `workspaceListItemJsonLd` now emits `contactPoint` when a card already shows Call/Email, and copies visible listing tags into `amenityFeature` / `keywords`. Schema stays visible-only. Sitemap not resubmitted (no new routes).

GSC 2026-08-15 to 2026-09-11 (`https://nomads-travel-indol.vercel.app/`): sample query rows include `4g-travel-tool.vercel.app` 2 clicks / 17 impressions / pos ~3.1 (FLAG only, no redirect). Branded `roam iq` 1 click / 33 impressions / pos ~8.0. Branded CTR capped until the custom domain is live (human-owned).

GA4 last 30d (property `541610896`): `/` 178 sessions / ~80% bounce; `/workspaces` 9 / ~89%; `/destinations` 9 / ~78%.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — do not mark resolved.

## 2026-09-12 (evening) — listing map on workspaces cards

Track A: `/workspaces` cards now select `google_map` / lat-lng and show a Map chip when those fields exist. ItemList JSON-LD adds `hasMap` and `geo` only for the same visible coordinates/URL. No invented locations. Sitemap not resubmitted (no new routes).

## 2026-09-12 (late) — ItemList image matches visible card media

Track A: `workspaceListItemJsonLd` now sets `image` from the venue photo or, when the card hero falls back to `logo_url`, from that logo. About/images stay visible-only; no invented prices or Wi-Fi. Sitemap not resubmitted (no new routes).

## 2026-09-12 (late) — listing contact CTA + ContactPoint

Track A: workspace detail primary button now uses listed email (`Ask about availability`) when no official website exists — only the DB email, no invented contact. LocalBusiness JSON-LD adds a ContactPoint when phone or email is already rendered. Workspaces index adds a waitlist block after the card grid (pagination exit). Sitemap not resubmitted (no new routes).

## 2026-09-12 — city desk and rent fallbacks

## 2026-09-12 (evening) — listing ItemList JSON-LD helper

Track A: `/workspaces` ItemList schema now uses `workspaceListItemJsonLd` (same visible-only fields as cards) and attaches city destination properties (visa, safety, walkability, desk, 1-bed rent) when a destination match exists. No invented prices or Wi-Fi.

Track A: destination match now includes live `coworking_desk_usd` and `one_bed_rent_usd`. When a listing has no `starting_price`, workspace cards and the listing sidebar show those city figures as labeled city-level context (not as the listing price). City JSON-LD additionalProperty repeats only values already visible. No invented prices. Sitemap not resubmitted (no new routes).

GSC 2026-08-12 to 2026-09-11 (`https://nomads-travel-indol.vercel.app/`): 15 clicks / ~4.7k impressions in the sampled query rows; branded `roam iq` 1 click / 34 impressions / pos ~7.9. Top query still `4g-travel-tool.vercel.app` (2 clicks / 21 impressions / pos ~3.14) — duplicate-index FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

Listings table (n=10,331): about filled 9,780; images present 10,331 (2,063 empty arrays); starting_price 5,088; wifi_speed 8,276; contact_phone 3,784; logo_url 2,936; contact_email 2,347.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — inspecting that host is a different GSC property; do not mark resolved.
