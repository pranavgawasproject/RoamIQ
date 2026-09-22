## 2026-09-22 — Deep-link GSC/GA4 intent listings on homepage and /workspaces

Track A: added `IntentListingLinks` so homepage exits and `/workspaces` (100% bounce on the index) can open listings that already earned a GSC click or a GA4 landing — Café Nénom, Durty Nellys, Innapartment, NGB Living, Urban Place, Atzomx, City West Apartments, Milenaria Cafe, Re-work Porto, Izzy's. Names and IDs from the listings table only. Refreshed GSC venue chips to the 2026-08-22–2026-09-21 click set. Sitemap not resubmitted (same routes).

GSC 2026-08-22 to 2026-09-21: 8 clicks / venue + branded `roam iq` 1 click / 35 impressions / pos ~8.2. Query `4g-travel-tool.vercel.app` FLAG only (12 impressions, pos ~3.25); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4 2026-08-22 to 2026-09-21: `/` 67 sessions / 89.6% bounce; `/workspaces` 10 sessions / 100% bounce. Highest listing landings: Atzomx (8), City West Apartments (4), Milenaria Cafe (4), Re-work Porto (3).

---

## 2026-09-22 — JSON-LD legalName for visible registered entity

Track A: listing JSON-LD and FAQ schema now emit `legalName` / a legal-name FAQ only when `registered_entity_name` already passes `usefulListingRegisteredEntity` and is shown on listing cards and `/workspaces/[id]`. No invented legal names. Sitemap not resubmitted (same routes).

GSC 2026-08-22 to 2026-09-21: 8 clicks (venue queries + branded `roam iq` 1/35 / pos ~8.2). Query `4g-travel-tool.vercel.app` FLAG only (12 impressions, pos ~3.25); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4: not re-queried this pass. Prior snapshot: 128 sessions / 79.7% bounce; `/workspaces` 10 sessions / 100% bounce.

Live site note: nomads-travel-indol.vercel.app returns Vercel “deployment is temporarily paused” — not changed this run.

---

