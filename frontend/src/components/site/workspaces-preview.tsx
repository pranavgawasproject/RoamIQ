import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, Clock, ExternalLink, Mail, MapPin, Phone, Star, Wifi } from "lucide-react";
import { supabase, type Listing } from "@/lib/supabase";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import {
  firstVenueListingImage,
  isUsableImageUrl,
  usefulContactEmail,
  usefulContactPhone,
  usefulListingAbout,
  usefulListingWebsite,
  usefulStartingPrice,
  usefulListingTags,
  usefulOpenHours, usefulStreetAddress, usefulListingRegion, usefulListingContinent, usefulListingUnits, usefulListingCapacity, usefulWifiSpeed,
  usefulListingInclusions, usefulListingServices, usefulListingSocialLinks, usefulListingMapUrl, usefulListingTitle,
} from "@/lib/listing-media";
import { getDestinationForListingCity } from "@/lib/listing-destination";

function getCardImage(listing: Listing): { url: string; kind: "photo" | "logo" } | null {
  const photo = firstVenueListingImage(listing.images);
  if (photo) return { url: photo, kind: "photo" };
  if (isUsableImageUrl(listing.logo_url)) return { url: listing.logo_url!.trim(), kind: "logo" };
  return null;
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
      "id, company_name, company_title, company_type, address, city, state, country, continent, starting_price, units, capacity, wifi_speed, open_hours, ratings, total_reviews, images, logo_url, about, description, website, tags, contact_phone, contact_email, inclusions, services, social_links, google_map, latitude, longitude"
    )
    .eq("is_public", true)
    .eq("is_active", true)
    .order("ratings", { ascending: false, nullsFirst: false })
    .limit(24);

  const listings = ((data ?? []) as Listing[])
    .filter((row) => usefulAboutSnippet(row.about, row.description, row.company_name) || getCardImage(row))
    .slice(0, 4);

  if (listings.length === 0) return null;

  const BASE_URL = "https://nomads-travel-indol.vercel.app";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured workspaces with a listed description or photo",
    numberOfItems: listings.length,
    itemListElement: listings.map((item, index) => {
      const cardImage = getCardImage(item);
      const imageUrl = cardImage?.url ?? null;
      const aboutSnippet = usefulAboutSnippet(item.about, item.description, item.company_name);
      const schemaType =
        item.company_type === "coliving" || item.company_type === "hostel" || item.company_type === "workation"
          ? "LodgingBusiness"
          : item.company_type === "cafe"
            ? "CafeOrCoffeeShop"
            : "LocalBusiness";
      const place: Record<string, unknown> = {
        "@type": schemaType,
        "@id": `${BASE_URL}/workspaces/${item.id}#place`,
        name: item.company_name,
        url: `${BASE_URL}/workspaces/${item.id}`,
      };
      const listedTitle = usefulListingTitle(item.company_title, item.company_name);
      if (listedTitle) place.alternateName = listedTitle;
      if (aboutSnippet) place.description = aboutSnippet;
      if (imageUrl) place.image = imageUrl;
      const listedStreet = usefulStreetAddress(item.address, item.city, item.country);
      if (listedStreet || item.city || item.country) {
        place.address = {
          "@type": "PostalAddress",
          ...(listedStreet ? { streetAddress: listedStreet } : {}),
          ...(item.city ? { addressLocality: item.city } : {}),
          ...(usefulListingRegion(item.state, item.city) ? { addressRegion: usefulListingRegion(item.state, item.city) } : {}),
          ...(item.country ? { addressCountry: item.country } : {}),
        };
      }
      const continent = usefulListingContinent(item.continent);
      if (continent) {
        place.containedInPlace = { "@type": "Place", name: continent };
      }
      const listedCapacitySchema = usefulListingCapacity(item.capacity);
      const capacityNumber = listedCapacitySchema ? parseInt(listedCapacitySchema.replace(/[^0-9]/g, ""), 10) : NaN;
      if (Number.isFinite(capacityNumber) && capacityNumber > 0) {
        place.maximumAttendeeCapacity = capacityNumber;
      }
      const listedPrice = usefulStartingPrice(item.starting_price);
      if (listedPrice) {
        place.priceRange = listedPrice;
        place.makesOffer = {
          "@type": "Offer",
          url: `${BASE_URL}/workspaces/${item.id}`,
          priceSpecification: { "@type": "PriceSpecification", description: listedPrice },
        };
      }
      const listedWifi = usefulWifiSpeed(item.wifi_speed);
      const visibleTags = usefulListingTags(item.tags);
      const listedInclusions = usefulListingInclusions(item.inclusions);
      const listedServices = usefulListingServices(item.services);
      if (listedWifi || visibleTags.length || listedInclusions || listedServices.length) {
        place.amenityFeature = [
          ...(listedWifi ? [{ "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi }] : []),
          ...visibleTags.map((tag) => ({ "@type": "LocationFeatureSpecification", name: tag, value: true })),
          ...(listedInclusions ? [{ "@type": "LocationFeatureSpecification", name: "Included", value: listedInclusions }] : []),
          ...listedServices.map((svc) => ({ "@type": "LocationFeatureSpecification", name: svc, value: true })),
        ];
      }
      const listedHours = usefulOpenHours(item.open_hours);
      if (listedHours.length === 1) place.openingHours = listedHours[0];
      else if (listedHours.length > 1) place.openingHours = listedHours;
      const listedPhone = usefulContactPhone(item.contact_phone);
      const listedEmail = usefulContactEmail(item.contact_email);
      const listedWebsite = usefulListingWebsite(item.website);
      if (listedPhone) place.telephone = listedPhone;
      if (listedEmail) place.email = listedEmail;
      const listedSocial = usefulListingSocialLinks(item.social_links);
      const listedMap = usefulListingMapUrl(item.google_map, item.latitude, item.longitude);
      const sameAs = [...(listedWebsite ? [listedWebsite] : []), ...listedSocial.map((s) => s.url)];
      if (sameAs.length) place.sameAs = sameAs;
      if (listedMap) place.hasMap = listedMap;
      const ratingValue = Number(item.ratings);
      const reviewCount = Number(item.total_reviews);
      if (ratingValue > 0 && reviewCount > 0) {
        place.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue,
          reviewCount,
        };
      }
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.company_name,
        url: `${BASE_URL}/workspaces/${item.id}`,
        item: place,
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(aboutSnippet ? { description: aboutSnippet } : {}),
      };
    }),
  };

  const destKey = (city?: string | null, country?: string | null) => `${city || ""}||${country || ""}`;
  const destPairs = await Promise.all(
    Array.from(new Set(listings.map((l) => destKey(l.city, l.country)))).map(async (key) => {
      const [city, country] = key.split("||");
      const dest = await getDestinationForListingCity(city || null, country || null);
      return [key, dest?.id ? `/destinations/${dest.id}` : null] as const;
    }),
  );
  const destByCityCountry = new Map(destPairs);

  return (
    <section id="workspaces-preview" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">Live from the listings table</div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Workspaces with a real description or photo — not a thin card.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Homepage traffic rarely reaches /workspaces. These four rows are public listings that already have an about snippet or a usable image in the database. Missing descriptions, prices, and Wi-Fi stay labeled pending. Company titles, tags, official site, phone, email, social links, map, inclusions, and services appear only when those fields pass the same filters as the workspaces index.</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Link href="/workspaces" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:gap-2.5 hover:text-forest/80">Browse all workspaces<ArrowUpRight className="h-4 w-4" /></Link>
            <Link href="/workspaces?described=1" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-forest">Only listings with a description<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/workspaces?priced=1" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-forest">Only listings with a listed price<ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => {
            const cardImage = getCardImage(listing);
            const imageUrl = cardImage?.url ?? null;
            const imageKind = cardImage?.kind ?? null;
            const about = usefulAboutSnippet(listing.about, listing.description, listing.company_name);
            const reviewCount = Number(listing.total_reviews ?? 0);
            const ratingValue = Number(listing.ratings ?? 0);
            const showRating = ratingValue > 0 && reviewCount > 0;
            const listedWifi = usefulWifiSpeed(listing.wifi_speed);
            const listedPhone = usefulContactPhone(listing.contact_phone);
            const listedEmail = usefulContactEmail(listing.contact_email);
            const listedWebsite = usefulListingWebsite(listing.website);
            const listedSocial = usefulListingSocialLinks(listing.social_links);
            const listedMap = usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude);
            const listedInclusions = usefulListingInclusions(listing.inclusions);
            const listedServices = usefulListingServices(listing.services);
            const visibleTags = usefulListingTags(listing.tags);
            const destinationHref = destByCityCountry.get(destKey(listing.city, listing.country)) || null;
            const cityFilterHref = listing.city ? `/workspaces?city=${encodeURIComponent(listing.city)}` : null;
            const regionLabel = usefulListingRegion(listing.state, listing.city);
            const continentLabel = usefulListingContinent(listing.continent);
            const listedUnits = usefulListingUnits(listing.units);
            const listedCapacity = usefulListingCapacity(listing.capacity);
            return (
              <article key={listing.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <Link href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={imageKind === "logo" ? `${listing.company_name} logo` : listing.company_name} fill className={imageKind === "logo" ? "object-contain bg-secondary p-8" : "object-cover"} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
                      <Building2 className="h-10 w-10 text-muted-foreground/50" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
                    </div>
                  )}
                  {imageKind === "logo" ? (
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                      Logo
                    </span>
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  {listing.company_type && (<div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">{listing.company_type}</div>)}
                  <div className="flex items-center gap-2.5">
                    {isUsableImageUrl(listing.logo_url) ? (
                      <Link href={`/workspaces/${listing.id}`} className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                        <Image src={listing.logo_url.trim()} alt="" fill className="object-contain p-0.5" sizes="32px" unoptimized />
                      </Link>
                    ) : null}
                    <h3 className="font-serif text-base font-semibold tracking-tight line-clamp-1"><Link href={`/workspaces/${listing.id}`} className="hover:text-accent">{listing.company_name}</Link></h3>
                  </div>
                  {usefulListingTitle(listing.company_title, listing.company_name) ? (
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{usefulListingTitle(listing.company_title, listing.company_name)}</p>
                  ) : null}
                  {about ? (<p className="mt-1 text-sm text-foreground/70 line-clamp-2">{about}</p>) : (<p className="mt-1 text-sm text-muted-foreground">Description pending</p>)}
                  {visibleTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {visibleTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-foreground/70"><MapPin className="h-3 w-3 shrink-0" /><span className="min-w-0"><span className="line-clamp-1">{listing.city ? (destinationHref ? <Link href={destinationHref} className="hover:text-accent hover:underline underline-offset-2">{listing.city}</Link> : cityFilterHref ? <Link href={cityFilterHref} className="hover:text-accent hover:underline underline-offset-2">{listing.city}</Link> : listing.city) : null}{regionLabel ? <>{listing.city ? ", " : ""}<span>{regionLabel}</span></> : null}{(listing.city || regionLabel) && listing.country ? ", " : ""}{listing.country ? <Link href={`/workspaces?country=${encodeURIComponent(listing.country)}`} className="hover:text-accent hover:underline underline-offset-2">{listing.country}</Link> : null}{continentLabel ? <>{(listing.city || regionLabel || listing.country) ? ", " : ""}<span>{continentLabel}</span></> : null}</span>{usefulStreetAddress(listing.address, listing.city, listing.country) ? (<span className="mt-0.5 block line-clamp-1 text-[11px] text-muted-foreground">{usefulStreetAddress(listing.address, listing.city, listing.country)}</span>) : null}{destinationHref ? (<span className="mt-0.5 block text-[11px]"><Link href={destinationHref} className="hover:text-accent hover:underline underline-offset-2">City guide: cost of living & visa</Link>{cityFilterHref ? <>{" · "}<Link href={cityFilterHref} className="hover:text-accent hover:underline underline-offset-2">More workspaces</Link></> : null}</span>) : null}</span></div>
                  <div className="mt-3 flex flex-wrap gap-2">
                      {!(listedPhone || listedEmail || listedWebsite) && (<span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-secondary/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Phone className="h-3 w-3" /> Contact pending</span>)}
                      {listedWebsite && (<a href={listedWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><ExternalLink className="h-3 w-3" /> Official site</a>)}
                      {listedPhone && (<a href={`tel:${listedPhone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><Phone className="h-3 w-3" /> Call</a>)}
                      {listedEmail && (<a href={`mailto:${listedEmail}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><Mail className="h-3 w-3" /> Email</a>)}
                      {listedSocial.map((s) => (
                        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><ExternalLink className="h-3 w-3" /> {s.label}</a>
                      ))}
                      {listedMap && (<a href={listedMap} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"><MapPin className="h-3 w-3" /> Map</a>)}
                    </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className={usefulStartingPrice(listing.starting_price) ? "text-sm font-semibold text-forest" : "text-xs text-muted-foreground"}>{usefulStartingPrice(listing.starting_price) || "Price not listed yet"}</div>
                      {listedUnits ? <div className="text-[11px] text-muted-foreground">{listedUnits}</div> : null}
                      {listedCapacity ? <div className="text-[11px] text-muted-foreground">{listedCapacity}</div> : null}
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><Wifi className="h-3 w-3" />{listedWifi || "Wi-Fi speed pending"}</div>
                      {usefulOpenHours(listing.open_hours)[0] ? (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />{usefulOpenHours(listing.open_hours)[0]}</div>
                      ) : (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/70"><Clock className="h-3 w-3" />Hours not listed yet</div>
                      )}
                      {listedInclusions ? <div className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">Included: {listedInclusions}</div> : null}
                      {listedServices.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {listedServices.slice(0, 4).map((item) => (
                            <span key={item} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-foreground/80">{item}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {showRating ? (<div className="flex items-center gap-1 text-xs font-medium"><Star className="h-3 w-3 fill-sunset text-sunset" />{ratingValue.toFixed(1)}<span className="text-[11px] font-normal text-muted-foreground">({reviewCount})</span></div>) : (<div className="text-[11px] text-muted-foreground">Reviews pending</div>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
          <WaitlistInline source="homepage_workspaces_preview" askCity heading="Searched a specific cafe or coliving?" description="Most homepage visits never open /workspaces. Leave an email and city if you want a shortlist from rows that already have a description or photo — no invented prices or Wi-Fi numbers." compact />
        </div>
      </div>
    </section>
  );
}
