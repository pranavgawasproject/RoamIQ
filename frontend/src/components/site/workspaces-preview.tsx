import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, MapPin, Star, Wifi } from "lucide-react";
import { supabase, type Listing } from "@/lib/supabase";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { usefulStartingPrice, usefulWifiSpeed } from "@/lib/listing-media";

function isUsableImageUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return Boolean(trimmed) && /^https?:\/\//i.test(trimmed);
}

function getCardImage(listing: Listing): string | null {
  if (listing.images && listing.images.length > 0) {
    const first = listing.images.find((u) => isUsableImageUrl(u));
    if (first) return first.trim();
  }
  if (isUsableImageUrl(listing.logo_url)) return listing.logo_url.trim();
  return null;
}

function usefulAboutSnippet(about: string | null | undefined, companyName?: string | null): string | null {
  if (!about) return null;
  const cleaned = about.replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return null;
  const lower = cleaned.toLowerCase();
  const name = (companyName || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (name && (lower === name || lower === `${name}.`)) return null;
  const noise = [
    "skip to content",
    "sign in",
    "official white house",
    "stock market",
    "cookie policy",
    "privacy policy",
    "all rights reserved",
    "download the app",
    "subscribe to newsletter",
  ];
  if (noise.some((n) => lower.includes(n))) return null;
  return cleaned.slice(0, 160);
}

export async function WorkspacesPreview() {
  const { data } = await supabase
    .from("listings")
    .select(
      "id, company_name, company_type, city, country, starting_price, wifi_speed, ratings, total_reviews, images, logo_url, about"
    )
    .eq("is_public", true)
    .eq("is_active", true)
    .not("about", "is", null)
    .order("ratings", { ascending: false })
    .limit(4);

  const listings = ((data ?? []) as Listing[]).filter(
    (row) => usefulAboutSnippet(row.about, row.company_name) || getCardImage(row)
  );

  if (listings.length === 0) return null;

  return (
    <section id="workspaces-preview" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Live from the listings table
            </div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Workspaces with a real description or photo — not a thin card.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Homepage traffic rarely reaches /workspaces. These four rows are public listings that already have an about snippet or a usable image in the database. Missing prices stay labeled pending.
            </p>
          </div>
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:gap-2.5 hover:text-forest/80"
          >
            Browse all workspaces
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.slice(0, 4).map((listing) => {
            const imageUrl = getCardImage(listing);
            const about = usefulAboutSnippet(listing.about, listing.company_name);
            const reviewCount = Number(listing.total_reviews ?? 0);
            const ratingValue = Number(listing.ratings ?? 0);
            const showRating = ratingValue > 0 && reviewCount > 0;
            return (
              <article
                key={listing.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
              >
                <Link
                  href={`/workspaces/${listing.id}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-secondary"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing.company_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
                      <Building2 className="h-10 w-10 text-muted-foreground/50" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Photo pending
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  {listing.company_type && (
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                      {listing.company_type}
                    </div>
                  )}
                  <h3 className="font-serif text-base font-semibold tracking-tight line-clamp-1">
                    <Link href={`/workspaces/${listing.id}`} className="hover:text-accent">
                      {listing.company_name}
                    </Link>
                  </h3>
                  {about && <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{about}</p>}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-foreground/70">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">
                      {[listing.city, listing.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className={usefulStartingPrice(listing.starting_price) ? "text-sm font-semibold text-forest" : "text-xs text-muted-foreground"}>
                        {usefulStartingPrice(listing.starting_price) || "Price not listed yet"}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Wifi className="h-3 w-3" />
                        {usefulWifiSpeed(listing.wifi_speed) || "Wi-Fi speed pending"}
                      </div>
                    </div>
                    {showRating ? (
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Star className="h-3 w-3 fill-sunset text-sunset" />
                        {ratingValue.toFixed(1)}
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground">Reviews pending</div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
          <WaitlistInline
            source="homepage_workspaces_preview"
            heading="Get listed workspaces for a city you already have in mind"
            description="Most homepage visits never open /workspaces. Leave an email if you want a shortlist from rows that already have a description or photo — no invented prices."
            compact
          />
        </div>
      </div>
    </section>
  );
}
