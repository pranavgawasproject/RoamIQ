import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, ExternalLink, Mail, MapPin, Phone, Star, Wifi } from "lucide-react";
import { supabase, type Listing } from "@/lib/supabase";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import {
  firstUsableListingImage,
  usefulContactEmail,
  usefulContactPhone,
  usefulListingAbout,
  usefulListingWebsite,
  usefulStartingPrice,
  usefulWifiSpeed,
} from "@/lib/listing-media";

function getCardImage(listing: Listing): string | null {
  return firstUsableListingImage(listing.images, listing.logo_url);
}

function usefulAboutSnippet(
  about: string | null | undefined,
  description?: string | null,
  companyName?: string | null
): string | null {
  return usefulListingAbout(about || description, companyName, 160);
}

export async function WorkspacesPreview() {
  const { data } = await supabase
    .from("listings")
    .select(
      "id, company_name, company_type, city, country, starting_price, wifi_speed, ratings, total_reviews, images, logo_url, about, description, website, contact_phone, contact_email"
    )
    .eq("is_public", true)
    .eq("is_active", true)
    .order("ratings", { ascending: false, nullsFirst: false })
    .limit(24);

  const listings = ((data ?? []) as Listing[])
    .filter((row) => usefulAboutSnippet(row.about, row.description, row.company_name) || getCardImage(row))
    .slice(0, 4);

  if (listings.length === 0) return null;

  return (
    <section id="workspaces-preview" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">Live from the listings table</div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Workspaces with a real description or photo — not a thin card.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Homepage traffic rarely reaches /workspaces. These four rows are public listings that already have an about snippet or a usable image in the database. Missing descriptions, prices, and Wi-Fi stay labeled pending. Official site, phone, and email appear only when those fields pass the same filters as the workspaces index.</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Link href="/workspaces" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:gap-2.5 hover:text-forest/80">Browse all workspaces<ArrowUpRight className="h-4 w-4" /></Link>
            <Link href="/workspaces?described=1" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-forest">Only listings with a description<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/workspaces?priced=1" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-forest">Only listings with a listed price<ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => {
            const imageUrl = getCardImage(listing);
            const about = usefulAboutSnippet(listing.about, listing.description, listing.company_name);
            const reviewCount = Number(listing.total_reviews ?? 0);
            const ratingValue = Number(listing.ratings ?? 0);
            const showRating = ratingValue > 0 && reviewCount > 0;
            const listedWifi = usefulWifiSpeed(listing.wifi_speed);
            const listedPhone = usefulContactPhone(listing.contact_phone);
            const listedEmail = usefulContactEmail(listing.contact_email);
            const listedWebsite = usefulListingWebsite(listing.website);
            return (
              <article key={listing.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <Link href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={listing.company_name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
                      <Building2 className="h-10 w-10 text-muted-foreground/50" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  {listing.company_type && (<div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">{listing.company_type}</div>)}
                  <h3 className="font-serif text-base font-semibold tracking-tight line-clamp-1"><Link href={`/workspaces/${listing.id}`} className="hover:text-accent">{listing.company_name}</Link></h3>
                  {about ? (<p className="mt-1 text-sm text-foreground/70 line-clamp-2">{about}</p>) : (<p className="mt-1 text-sm text-muted-foreground">Description pending</p>)}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-foreground/70"><MapPin className="h-3 w-3 shrink-0" /><span className="line-clamp-1">{[listing.city, listing.country].filter(Boolean).join(", ")}</span></div>
                  {(listedPhone || listedEmail || listedWebsite) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {listedWebsite && (<a href={listedWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><ExternalLink className="h-3 w-3" /> Official site</a>)}
                      {listedPhone && (<a href={`tel:${listedPhone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><Phone className="h-3 w-3" /> Call</a>)}
                      {listedEmail && (<a href={`mailto:${listedEmail}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><Mail className="h-3 w-3" /> Email</a>)}
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className={usefulStartingPrice(listing.starting_price) ? "text-sm font-semibold text-forest" : "text-xs text-muted-foreground"}>{usefulStartingPrice(listing.starting_price) || "Price not listed yet"}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><Wifi className="h-3 w-3" />{listedWifi || "Wi-Fi speed pending"}</div>
                    </div>
                    {showRating ? (<div className="flex items-center gap-1 text-xs font-medium"><Star className="h-3 w-3 fill-sunset text-sunset" />{ratingValue.toFixed(1)}</div>) : (<div className="text-[11px] text-muted-foreground">Reviews pending</div>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
          <WaitlistInline source="homepage_workspaces_preview" askCity heading="Get listed workspaces for a city you already have in mind" description="Most homepage visits never open /workspaces. Leave an email if you want a shortlist from rows that already have a description or photo — no invented prices." compact />
        </div>
      </div>
    </section>
  );
}
