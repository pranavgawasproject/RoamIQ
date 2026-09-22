import Link from "next/link";

/** Venue names that already earned GSC clicks (2026-08-22–2026-09-21). */
const GSC_CLICK_VENUES = [
  { label: "Café Nénom", q: "cafe nenom" },
  { label: "Cafe Nook", q: "cafe nook" },
  { label: "Coliving Zürich", q: "coliving zürich" },
  { label: "Durty Nellys", q: "durty nellys amsterdam" },
  { label: "Innapartment Taipei", q: "innapartment taipei" },
  { label: "NGB Living", q: "ngb living" },
  { label: "Urban Place", q: "urban place" },
] as const;

export function GscVenueSearchChips({ activeSearch }: { activeSearch?: string }) {
  if (activeSearch) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Venue names already bringing search visits
      </span>
      {GSC_CLICK_VENUES.map((chip) => (
        <Link
          key={chip.q}
          href={`/workspaces?search=${encodeURIComponent(chip.q)}`}
          className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-secondary"
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}
