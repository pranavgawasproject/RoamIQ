import Link from "next/link";

/** Venue names that already earned GSC clicks (2026-08-20–2026-09-18). */
const GSC_CLICK_VENUES = [
  { label: "Cafe Nenom", q: "cafe nenom" },
  { label: "Cafe Nook", q: "cafe nook" },
  { label: "Coliving Athens", q: "coliving athens" },
  { label: "NGB Living", q: "ngb living" },
  { label: "Izzy's Coffee", q: "izzy" },
  { label: "Innapartment Taipei", q: "innapartment" },
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
