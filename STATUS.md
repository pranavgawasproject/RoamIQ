## 2026-09-26 — sticky waitlist no longer covers pagination

Track A (conversion): `/workspaces` and listing detail already render about, photos, price/Wi-Fi pending states, and JSON-LD. GA4 still treats `/workspaces` as a high-bounce landing, so the sticky waitlist stays above-fold (`afterPx=0`). Gap: the bar had no dismiss and pages had no bottom padding, so pagination and the footer form sat under the bar. Sticky now has a session-only "Not now" control; both listing views add `pb-36` on `<main>` so those CTAs stay clickable. No invented stats. No new routes; sitemap not resubmitted.

GSC property https://nomads-travel-indol.vercel.app/ (2026-08-26–2026-09-25, query): apartment 1/1 pos 1; atzomx 1/21 pos ~6.4; cafe nenom 1/22 pos ~9.1; cafe nook 1/13 pos ~7.7; coliving zürich 1/1; roam iq 1/33 pos ~8.2; tomodomo coliving 1/65 pos ~8.5. Query `4g-travel-tool.vercel.app` 0/10 pos ~3.3 — FLAG only; different live product, not a RoamIQ property. No redirect. Branded CTR capped until the custom domain is live (human-owned).

GA4 not connected in this Composio session; prior STATUS: homepage high bounce; `/workspaces` 8–10 sessions / 100% bounce. Property 541610896.

Listings null-rate (`davvpymbybvniexmkgcu` n=10331): about empty 0; images null 0; starting_price empty 5243 (50.8%); wifi_speed empty 2055 (19.9%); contact_phone empty 944 (9.1%); logo_url empty 894 (8.7%); contact_email empty 1889 (18.3%). Phone/email fill improved vs prior STATUS; do not invent remaining gaps.

Next: admin auth already env-based. After deploy lag, confirm `/workspaces` bounce is no longer 100% before more CTA copy churn.
