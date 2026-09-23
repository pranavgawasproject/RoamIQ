import Link from "next/link";

/**
 * Listings that already earned a GSC click and/or a GA4 landing
 * (2026-08-24 to 2026-09-20). Names and IDs are from the listings table
 * — no invented venues.
 *
 * Extra GSC rows are listing *pages* that received a click even when the
 * query was not a clean venue name (so the index chips stay query-based).
 */
export const INTENT_LISTINGS = [
  { id: "92952ead-ba02-4514-a768-d8e768ab671c", name: "Atzomx Café Y Coworking", city: "Oaxaca", source: "ga4" },
  { id: "7f4cc6c5-a990-4fb9-b34d-6855c647005e", name: "City West Apartments", city: "Berlin", source: "ga4" },
  { id: "d3013dbe-cf9f-4c77-9061-b69a8ff35cda", name: "Milenaria Cafe", city: "Lima", source: "ga4" },
  { id: "75a2fe92-79ac-4d29-af9d-d1f5a49dd639", name: "Combinata - Coworking Bologna Accessibile", city: "Bologna", source: "ga4" },
  { id: "77d5a817-365f-4625-8b70-272c971f4ba5", name: "Re-work Porto Cowork", city: "Porto", source: "ga4" },
  { id: "9f2a3805-808d-4aef-9126-a1a072c93c1d", name: "Café Nénom", city: "Berlin", source: "gsc" },
  { id: "7477259b-2d45-4353-a733-87db0ecb4005", name: "Durty Nellys", city: "Amsterdam", source: "gsc" },
  { id: "efb5a54f-fe54-449e-87c5-8eb2168f27ea", name: "Innapartment", city: "Taipei", source: "gsc" },
  { id: "e4300da9-c89f-4c5d-8e2b-ba7df9825565", name: "NGB Living", city: "Berlin", source: "gsc" },
  { id: "2c5ba005-9e21-4faf-8296-f828150e1514", name: "Urban Place", city: "Tel Aviv", source: "gsc" },
  { id: "65316cd8-7279-4863-9384-aea3183dcc08", name: "Izzy's Coffee and Brunch", city: "Sofia", source: "gsc" },
  { id: "6c1f5162-cd98-460b-bc27-8bf223d3250b", name: "Tomodomo Coliving | X-Tra", city: "Zurich", source: "gsc" },
  { id: "0c5ed3b6-406f-4b61-b4c2-82e45374ca15", name: "Co & Living - Athens Art Apartments", city: "Athens", source: "gsc" },
  { id: "0d6d47d8-1a8f-4a6e-9c88-9571d4ef7efb", name: "RezG Hub", city: "Colombo", source: "gsc" },
  { id: "25012204-63d4-4bb6-aa82-042afc5bb1b2", name: "Space2Work", city: "Casablanca", source: "gsc" },
  { id: "306408d2-2b5d-492c-b5d7-951c993341d9", name: "Facts Coworking", city: "Porto", source: "gsc" },
  { id: "5644ef1f-0afb-468e-966c-902cb2631f96", name: "COWORK at PARKLAND", city: "Colombo", source: "gsc" },
  { id: "6f36bfe2-aa2b-4d53-a90f-da29bb1ac371", name: "IRIE Location", city: "Montreal", source: "gsc" },
  { id: "847c1265-2b2c-43d9-aac4-4b37a3fb1bc5", name: "Home & Co Berlin Yard", city: "Berlin", source: "gsc" },
] as const;

export const INTENT_LISTING_IDS = INTENT_LISTINGS.map((row) => row.id);

export function IntentListingLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Open a listing people already landed on
      </p>
      <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
        These pages already show up as homepage exits or Search clicks. Jump to the card instead of bouncing from the index.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {INTENT_LISTINGS.map((row) => (
          <Link
            key={row.id}
            href={`/workspaces/${row.id}`}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 hover:border-accent hover:text-accent"
          >
            {row.name}
            <span className="ml-1 text-muted-foreground">· {row.city}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
