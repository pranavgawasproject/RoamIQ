/** Render stored listing about text. Never invent copy. Long text expands via native details. */
export function ListingAbout({
  text,
  pendingLabel = "Description pending",
  className = "mt-1 text-sm text-foreground/70",
  clampClass = "line-clamp-4",
  previewChars = 320,
}: {
  text: string | null | undefined;
  pendingLabel?: string;
  className?: string;
  clampClass?: string;
  previewChars?: number;
}) {
  const value = (text || "").trim();
  if (!value) {
    return <p className="mt-1 text-sm text-muted-foreground">{pendingLabel}</p>;
  }
  if (value.length <= previewChars) {
    return <p className={className}>{value}</p>;
  }
  const preview = value.slice(0, previewChars).replace(/\s+\S*$/, "");
  return (
    <details className="group mt-1">
      <summary className="cursor-pointer list-none">
        <p className={`${className} ${clampClass} group-open:hidden`}>{preview}…</p>
        <span className="mt-1 inline-block text-[11px] font-medium text-accent group-open:hidden">
          Read full listing notes
        </span>
        <span className="mt-1 hidden text-[11px] font-medium text-accent group-open:inline-block">
          Hide listing notes
        </span>
      </summary>
      <p className={`${className} whitespace-pre-line`}>{value}</p>
    </details>
  );
}
