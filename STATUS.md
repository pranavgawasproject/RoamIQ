## 2026-09-21 — render extra venue photos + longer about on /workspaces cards

Track A: `/workspaces` listing cards now show up to three additional stored `images[]` thumbnails (real URLs only) under the hero, and the about snippet uses 420 characters with line-clamp-4. No invented copy or photos. Photo-pending placeholder unchanged. Sitemap not resubmitted (same routes).

GSC 2026-08-21 to 2026-09-20: 9 clicks; top queries non-branded venue names (cafe nenom, cafe nook, coliving zürich, durty nellys amsterdam, innapartment taipei, izzy's coffee, ngb living, urban place) plus branded `roam iq` (1 click / 36 impressions / pos ~8.2). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, pos ~3.1); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4: not queried this pass (no GA4 toolkit in this run). Prior snapshot `/workspaces` 10 sessions / 100% bounce.

Supabase listings (davvpymbybvniexmkgcu): total 10331; about blank 0; images empty-array 2063 / sql-null 0; starting_price null 5243; cost null 10331; wifi_speed null/empty 2055; contact_phone null 2178; logo_url null 895; contact_email null 4451.

Live site note: nomads-travel-indol.vercel.app currently returns Vercel “deployment is temporarily paused” — not changed this run (domain/config is human-owned).

---

## 2026-09-21 — extra listing photos + longer about on /workspaces

Track A: workspaces index cards now render additional venue photos from the `images` field (not just the first URL) and show a longer about snippet (line-clamp-4, 420 chars). No invented copy or photos. A placeholder commit was immediately restored. Sitemap not resubmitted (same routes).

GSC 2026-08-21 to 2026-09-20: clicks remain non-branded venue names (cafe nenom, cafe nook, coliving zürich, ngb living, izzy's coffee, innapartment taipei, roam iq). Query `4g-travel-tool.vercel.app` FLAG only — no redirect this run. Branded CTR capped until custom domain is live (human-owned).

GA4: prior snapshot `/workspaces` 10 sessions / 100% bounce / 0 engaged. Not re-queried this pass.

Supabase listings null-rate: not re-queried this pass (project previously INACTIVE).

---

## 2026-09-21 — homepage preview photo count + ask-rates CTA

Track A: homepage `workspaces-preview` now matches the /workspaces card for two conversion gaps — a photo-count badge when a listing has 2+ venue images, and an "Ask this venue for current rates" mailto/tel when `starting_price`/`cost` is empty. No invented prices. Sitemap not resubmitted (same routes).

GSC 2026-08-21 to 2026-09-20: clicks remain non-branded venue names (cafe nenom, cafe nook, coliving zürich, durty nellys amsterdam, innapartment taipei, izzy's coffee, ngb living, urban place) plus branded `roam iq` (1 click / 36 impressions / pos ~8.2). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, pos ~3.1); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4: not re-queried this pass (property id not confirmed in this run). Prior snapshot `/workspaces` 10 sessions / 100% bounce.

Supabase listings null-rate: not re-queried this pass (project previously INACTIVE).

---

## 2026-09-20 — search-aware waitlist on /workspaces

Track A: above-fold waitlist on `/workspaces` now changes heading/description when `?search=` is present (GSC venue-name chips). Copy no longer leads with a raw bounce rate; it asks for an email when the named venue filter is empty or thin. Added waitlist gap chip "Named venue looks thin". Sitemap not resubmitted (same routes).

GSC 2026-08-20 to 2026-09-19: clicks are non-branded venue names (cafe nenom, cafe nook, coliving athens, ngb living, izzy's coffee, innapartment taipei, roam iq). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, pos ~3.1); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4: prior snapshot `/workspaces` 10 sessions / 100% bounce / 0 engaged. Live nomads-travel-indol.vercel.app previously flagged DEPLOYMENT_DISABLED (human-owned).

Supabase listings null-rate: not re-queried this pass.

---

## 2026-09-20 — GSC venue-name chips on /workspaces

Track A: `/workspaces` above-fold waitlist now shows chips for venue names that already earned GSC clicks (Cafe Nenom, Cafe Nook, Coliving Athens, NGB Living, Izzy's Coffee, Innapartment Taipei). Each chip is a `?search=` filter — no invented listings. Hidden once a search is active. Sitemap not resubmitted (same routes).

GSC 2026-08-20 to 2026-09-18: non-branded clicks are venue names; branded `roam iq` 1 click / 35 impressions / pos ~8.1. Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, pos ~3.1); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4 last 30d: `/workspaces` 10 sessions / 100% bounce / 0 engaged. Live nomads-travel-indol.vercel.app 402 DEPLOYMENT_DISABLED (human-owned).

Supabase listings null-rate: not re-queried this pass (project INACTIVE on last check).

---
