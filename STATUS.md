## 2026-09-14 — homepage preview inclusions services social map

Track A: Homepage featured workspace cards now select listing `inclusions`, `services`, `social_links`, `google_map`, `latitude`, and `longitude` and render them the same way as `/workspaces` cards (social + map chips; inclusions/services under hours). ItemList JSON-LD adds `amenityFeature` for inclusions/services, `sameAs` for social URLs, and `hasMap` only when those values are visible. Placeholders stay hidden. Sitemap not resubmitted (no new routes).

GSC 2026-08-15 to 2026-09-13 (`https://nomads-travel-indol.vercel.app/`): query sample still led by `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4: connector property listing incomplete this run; prior 28d note stands — homepage is the main landing; `/workspaces` is a small, high-bounce sample.

Listings table: default connected Supabase project on this account has no `listings` relation; counts from prior STATUS (n=10,331) stand.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.

## 2026-09-14 — listing continent, units, and capacity on homepage workspace preview

Track A: Homepage featured workspace cards now select listing `continent`, `units`, and `capacity` and render them the same way as `/workspaces` cards (named continent after city/region/country; units and capacity under price when helpers accept the stored value). ItemList JSON-LD adds `containedInPlace` and `maximumAttendeeCapacity` only when those values are visible and parseable. Placeholders stay hidden. Sitemap not resubmitted (no new routes).

GSC 2026-08-15 to 2026-09-14 (`https://nomads-travel-indol.vercel.app/`): query sample still led by `4g-travel-tool.vercel.app` (2 clicks / 17 impressions / pos ~3.06) — FLAG only; no redirect. Branded `roam iq` 1 click / 35 impressions / pos ~7.91. Branded CTR capped until the custom domain is live (human-owned).

GA4 ~28d (property 541610896): `/` 163 sessions bounce 81.0%; `/workspaces` 9 sessions bounce 88.9% (1 engaged).

Listings table (n=10,331): about 9,791; images column present 10,331; starting_price null 5,243; wifi_speed null 2,055; contact_phone null 6,547; logo_url null 7,395; contact_email null 7,984.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending — that host is not a GSC property on this account; do not mark resolved.
