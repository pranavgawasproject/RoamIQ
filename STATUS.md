## 2026-09-20 — workspaces H1 uses catalog count

Track A: `/workspaces` H1 now uses an exact `is_public` + `is_active` catalog count instead of the post-filter fetch window (which could render as "1 workspaces"). Matching-row copy stays separate. Waitlist above the fold cites the current GA4 fact for this path (10 sessions / 0 engaged / 100% bounce, last 30 days) — no invented urgency. Sitemap not resubmitted (same route).

About, images, price/wifi fallbacks, LocalBusiness JSON-LD, listed legal-name filter, and server-side admin auth were already live from prior runs.

GSC 2026-08-20 to 2026-09-18: 20 clicks / 6,379 impressions / CTR 0.31% / avg position 11.7. Branded `roam iq` 1 click / 35 impressions / pos ~8.1. Non-branded clicks are venue names (cafe nenom, cafe nook, coliving athens, ngb living). Query `4g-travel-tool.vercel.app` FLAG only (11 impressions, position ~3.1); no redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 last 30d: `/` 71 sessions / bounce 87.3%; `/workspaces` 10 / 100% bounce / 0 engaged.

`4g-travel-tool.vercel.app` duplicate-index status: FLAG / pending.

Supabase listings null-rate: connected project is INACTIVE; Management API not queried this pass — not treated as a schema change.
