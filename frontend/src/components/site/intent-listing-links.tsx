import Link from "next/link";

/**
 * Listings that already earned a GSC click and/or a GA4 landing
 * (2026-08-26 to 2026-09-24). Names and IDs are from the listings table
 * — no invented venues.
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
  { id: "2c7df910-79b7-4b84-a087-2d657c7e5fc7", name: "GoLiving GmbH", city: "Berlin", source: "gsc" },
  { id: "9f80821c-8d6e-4b0d-82f4-bfdfe7f9d22f", name: "A&o Hostel Berlin Mitte", city: "Berlin", source: "gsc" },
  { id: "ae77f708-a2bb-4401-a8ea-345356c59ed7", name: "Josephine'S Guesthouse For Women", city: "Zurich", source: "gsc" },
  { id: "b572a395-ba11-4db3-ba42-6a7868e8ee5f", name: "Sunflower Hostel Berlin", city: "Berlin", source: "gsc" },
  { id: "c4685fae-34f6-4c30-9f13-827caca25b25", name: "Zuerich Apartments Kurvenstrasse", city: "Zurich", source: "gsc" },
  { id: "d7c64e22-3802-4976-945d-c6266fb84203", name: "Meccano Coworking Space", city: "Cairo", source: "gsc" },
  { id: "ea53ff4c-9ece-4e22-beec-7bddc54c0e36", name: "Café Restaurant NOOK", city: "Casablanca‑Settat", source: "gsc" },
  { id: "2d5aada6-fb8c-41ef-9947-1d34c502af4d", name: "Tomodomo Coliving", city: "Zurich", source: "gsc" },
  { id: "ce1965c3-4373-44d0-85cd-38aff9128c20", name: "Omiros Apartments Monastiraki", city: "Athens", source: "gsc" },
  { id: "0ea44424-25ee-46ea-8b57-3bb6c6f48e5d", name: "Work Up Hub At Athens North", city: "Athens", source: "gsc" },
  { id: "9970991f-886d-4d63-a437-f8ec530158ff", name: "WOTSO Blacktown", city: "Sydney", source: "gsc-impressions" },
  { id: "756eae33-718c-4ec9-bb1a-49e4e214af71", name: "Café Camas - Café - Club Social", city: "Montreal", source: "gsc-impressions" },
  { id: "a5ac284f-073e-4f8f-8388-e53342a94ddb", name: "Patio São Vicente Guest Houses", city: "Lisbon", source: "gsc-impressions" },
  { id: "94be613a-d3f7-4ddf-b069-2720a2d296b2", name: "Calmô Café", city: "Lisbon", source: "gsc-impressions" },
  { id: "64559270-8cca-4cc1-9d01-63f541c89f6e", name: "Oni Coffee", city: "Osaka", source: "gsc-impressions" },
  { id: "925c39de-842c-4c9f-8273-2df6977d9b03", name: "Coffee Bridge 24H Bkk", city: "Phnom Penh", source: "gsc-impressions" },
  { id: "7a90cc4d-575e-4eef-9a01-e008250a2cfa", name: "Uni Coworking Space", city: "Giza", source: "gsc-impressions" },
  { id: "81914d3c-6299-4398-b5d4-0f9bea072cb1", name: "Regus - Bucharest City Centre", city: "Bucharest", source: "gsc-impressions" },
] as const;

export const INTENT_LISTING_IDS = INTENT_LISTINGS.map((row) => row.id);

export const INTENT_PAGES = [
  { href: "/destinations/tallinn", label: "Tallinn city guide", source: "gsc-click" },
  { href: "/community", label: "Community", source: "gsc-click" },
  { href: "/about", label: "About RoamIQ", source: "gsc-impressions" },
  { href: "/destinations", label: "All city guides", source: "gsc-impressions" },
  { href: "/visa", label: "Visa lookup", source: "gsc-impressions" },
] as const;

export function IntentListingLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Open a listing people already landed on
      </p>
      <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
        Listings here already earned a Search click, a GA4 landing, or a high Search impression count with no click yet. Dashed chips are live city-guide and site pages that already get Search impressions — open one instead of bouncing from the homepage.
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
        {INTENT_PAGES.map((row) => (
          <Link
            key={row.href}
            href={row.href}
            className="rounded-full border border-dashed border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 hover:border-accent hover:text-accent"
          >
            {row.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
