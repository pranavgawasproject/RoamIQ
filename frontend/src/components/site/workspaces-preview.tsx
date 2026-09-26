import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, Wifi } from "lucide-react";
import { supabase, type Listing } from "@/lib/supabase";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { ListingAbout } from "@/components/site/listing-about";
import { workspaceListItemJsonLd } from "@/lib/listing-jsonld";
import {
  firstVenueListingImage,
  isUsableImageUrl,
  isVenuePhotoUrl,
  usefulListedPrice,
  usefulListingAbout,
  usefulWifiSpeed,
} from "@/lib/listing-media";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

function getCardImage(listing: Listing) {
  const photo = firstVenueListingImage(listing.images);
  if (photo) return { url: photo, kind: "photo" as const };
  if (isUsableImageUrl(listing.logo_url)) return { url: listing.logo_url!.trim(), kind: "logo" as const };
  return null;
}

export async function WorkspacesPreview() {
  const { data } = await supabase
    .from("listings")
    .select("id, company_name, company_type, city, country, images, logo_url, about, description, starting_price, cost, wifi_speed")
    .eq("is_public", true)
    .eq("is_active", true)
    .order("ratings", { ascending: false, nullsFirst: false })
    .limit(24);

  const listings = ((data ?? []) as Listing[])
    .filter((row) => usefulListingAbout(row.about || row.description, row.company_name, 0, 12) || getCardImage(row))
    .slice(0, 4);

  if (listings.length === 0) return null;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured workspaces on RoamIQ",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) =>
      workspaceListItemJsonLd(listing, index + 1, BASE_URL),
    ),
  };

  return (
    <section id="workspaces-preview" className="relative scroll-mt-24 py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">Live from the listings table</div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Workspaces with a real description or photo.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">These rows already have stored about text or a usable image. Price and Wi-Fi appear only when stored — missing figures stay pending.</p>
          </div>
          <Link href="/workspaces" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest/80">Browse all workspaces<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => {
            const cardImage = getCardImage(listing);
            const imageUrl = cardImage?.url ?? null;
            const extras = Array.isArray(listing.images)
              ? listing.images.filter((u) => isVenuePhotoUrl(u) && u !== imageUrl).slice(0, 3)
              : [];
            const about = usefulListingAbout(listing.about || listing.description, listing.company_name, 0, 12);
            const listedPrice = usefulListedPrice(listing.starting_price, listing.cost);
            const listedWifi = usefulWifiSpeed(listing.wifi_speed);
            const place =
              [listing.city, listing.country].filter(Boolean).join(", ") || null;
            return (
              <article key={listing.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <Link href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={cardImage?.kind === "logo" ? `${listing.company_name} logo` : listing.company_name} fill className={cardImage?.kind === "logo" ? "object-contain bg-secondary p-8" : "object-cover"} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
                      <Building2 className="h-10 w-10 text-muted-foreground/50" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
                    </div>
                  )}
                </Link>
                {extras.length > 0 ? (
                  <div className="grid grid-cols-3 gap-px bg-border">
                    {extras.map((src) => (
                      <Link key={src} href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] overflow-hidden bg-secondary">
                        <Image src={src} alt={`${listing.company_name} photo`} fill className="object-cover" sizes="120px" unoptimized />
                      </Link>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-4">
                  {listing.company_type ? <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">{listing.company_type}</div> : null}
                  <h3 className="font-serif text-base font-semibold tracking-tight line-clamp-1">
                    <Link href={`/workspaces/${listing.id}`} className="hover:text-accent">{listing.company_name}</Link>
                  </h3>
                  {place ? <p className="mt-0.5 text-xs text-muted-foreground">{place}</p> : null}
                  <ListingAbout text={about} />
                  <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
                    <div className={listedPrice ? "font-semibold text-forest" : "text-muted-foreground"}>
                      {listedPrice || "Price not listed yet"}
                    </div>
                    {listedWifi ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Wifi className="h-3 w-3" /> {listedWifi}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground/70">
                        <Wifi className="h-3 w-3" /> Wi-Fi speed pending
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
          <WaitlistInline source="homepage_workspaces_preview" askCity heading="Searched a specific cafe or coliving?" description="Leave an email and city for a shortlist from rows that already have a description or photo — no invented prices or Wi-Fi numbers." compact />
        </div>
      </div>
    </section>
  );
}
