## 2026-09-22 — waitlist on listing-detail when price/Wi-Fi missing

Track A: `/workspaces/[id]` completeness strip now includes a waitlist when `starting_price`/`cost` or `wifi_speed` is empty. Copy states the gap plainly and asks for email + optional gap chip. No invented prices, speeds, or urgency. Sitemap not resubmitted (same routes).

GSC 2026-08-22 to 2026-09-21: 8 clicks on non-branded venue queries plus branded `roam iq` (1 click / 35 impressions / pos ~8.2). Query `4g-travel-tool.vercel.app` FLAG only (12 impressions, pos ~3.25); no redirect. Branded CTR capped until custom domain is live (human-owned).

GA4: not re-queried this pass (no GA4 toolkit). Prior snapshot: 128 sessions / 79.7% bounce; `/workspaces` 10 sessions / 100% bounce.

Supabase listings: not re-queried this pass (prior snapshot total 10331; starting_price null 5243; wifi_speed empty 2055).

Live site note: nomads-travel-indol.vercel.app returns Vercel “deployment is temporarily paused” — not changed this run (domain/config is human-owned).

---

