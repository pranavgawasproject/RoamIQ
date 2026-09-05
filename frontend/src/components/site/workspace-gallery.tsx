"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

export function WorkspaceGallery({
  images,
  alt,
  typeLabel,
}: {
  images: string[];
  alt: string;
  typeLabel?: string | null;
}) {
  const [failed, setFailed] = useState<Record<string, true>>({});
  const visible = useMemo(
    () => images.filter((src) => src && !failed[src]),
    [images, failed]
  );
  const [active, setActive] = useState(0);
  const safeIndex = visible.length ? Math.min(active, visible.length - 1) : 0;
  const current = visible[safeIndex];

  return (
    <div>
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-secondary">
        {current ? (
          <Image
            src={current}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
            onError={() => setFailed((prev) => ({ ...prev, [current]: true }))}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
            <Building2 className="h-20 w-20 text-muted-foreground/40" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
              Photo pending
            </span>
          </div>
        )}
        {typeLabel ? (
          <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            {typeLabel}
          </span>
        ) : null}
        {visible.length > 1 ? (
          <span className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm">
            {safeIndex + 1} / {visible.length}
          </span>
        ) : null}
      </div>

      {visible.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="list">
          {visible.slice(0, 8).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${alt}`}
              aria-pressed={safeIndex === i}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-shadow ${
                safeIndex === i
                  ? "border-forest ring-2 ring-forest/30"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
                onError={() => setFailed((prev) => ({ ...prev, [src]: true }))}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
