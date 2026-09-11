import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Wifi,
  ArrowLeft,
  Building2,
  Globe,
  Clock,
  Users,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { WaitlistSticky } from "@/components/site/waitlist-sticky";
import { supabase, type Listing } from "@/lib/supabase";
import { firstUsableListingImage, firstVenueListingImage, isUsableImageUrl, listingGalleryImages, usefulContactEmail, usefulContactPhone, usefulListingAbout, usefulListingInclusions, usefulListingServices, usefulListingTags, usefulListingTitle, usefulListingWebsite, usefulOpenHours, usefulStartingPrice, usefulStreetAddress, usefulWifiSpeed } from "@/lib/listing-media";
import { getDestinationForListingCity } from "@/lib/listing-destination";
import { workspaceFaqJsonLd } from "@/lib/listing-jsonld";
import { WorkspaceGallery } from "@/components/site/workspace-gallery";
import { TrackedAnchor } from "@/components/site/tracked-anchor";

export const revalidate = 180;

const BASE_URL = "https://nomads-travel-indol.vercel.app";

async function getListing(id: string) {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .eq("is_active", true)
      .single();
    if (error || !data) return null;
    return data as Listing;
  } catch {
    return null;
  }
}

function relatedListingScore(item: Listing): number {
  let score = 0;
  if (firstUsableListingImage(item.images, item.logo_url)) score += 40;
  if (usefulListingAbout(item.about || item.description, item.company_name, 140)) score += 30;
  if (usefulStartingPrice(item.starting_price)) score += 10;
  if (usefulWifiSpeed(item.wifi_speed)) score += 8;
  if (usefulListingWebsite(item.website)) score += 6;
  if (usefulContactPhone(item.contact_phone) || usefulContactEmail(item.contact_email)) score += 6;
  if (Number(item.ratings) > 0 && Number(item.total_reviews) > 0) {
    score += Math.min(10, Number(item.ratings));
  }
  if (usefulListingTags(item.tags).length > 0) score += 4;
  return score;
}

async function getRelatedListings(listing: Listing) {
  if (!listing.city) return [] as Listing[];
  try {
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, company_name, company_type, city, country, address, starting_price, wifi_speed, open_hours, images, logo_url, about, description, ratings, total_reviews, website, contact_phone, contact_email, tags"
      )
      .eq("is_public", true)
      .eq("is_active", true)
      .eq("city", listing.city)
      .neq("id", listing.id)
      .order("ratings", { ascending: false, nullsFirst: false })
      .limit(20);
    if (error || !data) return [];
    const pool = data as Listing[];
    return [...pool].sort((a, b) => relatedListingScore(b) - relatedListingScore(a)).slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getListing(id);
    if (!listing) {
      return {
        title: "Workspace not found | RoamIQ",
        description: "This workspace listing could not be found on RoamIQ.",
      };
    }
    const cityCountry = [listing.city, listing.country].filter(Boolean).join(", ");
    const typeRaw = String(listing.company_type || "").trim().toLowerCase();
    const typeLabelMap: Record<string, string> = {
      cafe: "cafe",
      coffee: "cafe",
      "coffee shop": "cafe",
      coliving: "coliving",
      coworking: "coworking",
      hostel: "hostel",
      meetingroom: "meeting room",
      "meeting room": "meeting room",
      workation: "workation",
      workspace: "workspace",
    };
    const typeLabel = typeRaw
      ? typeLabelMap[typeRaw] || typeRaw.replace(/[_-]+/g, " ")
      : "";
    const name = listing.company_name;
    let titleCore = name;
    if (typeLabel && cityCountry) {
      titleCore = `${name} \u2014 ${typeLabel} in ${cityCountry}`;
    } else if (cityCountry) {
      titleCore = `${name} \u2014 ${cityCountry}`;
    } else if (typeLabel) {
      titleCore = `${name} \u2014 ${typeLabel}`;
    }
    const extras: string[] = [];
    const listedPrice = usefulStartingPrice(listing.starting_price);
    if (listedPrice) extras.push(listedPrice);
    const listedWifiMeta = usefulWifiSpeed(listing.wifi_speed);
    if (listedWifiMeta) extras.push(`Wi-Fi ${listedWifiMeta}`);
    // Prefer clickable SERP titles; keep brand light (not the only differentiator).
    const title = extras.length
      ? `${titleCore} \u00b7 ${extras.slice(0, 2).join(" \u00b7 ")}`
      : titleCore;
    const aboutSnippet = usefulListingAbout(listing.about || listing.description, listing.company_name, 140) || "";
    const audience =
      typeLabel === "cafe"
        ? "laptop-friendly cafe for digital nomads"
        : typeLabel === "coliving"
        ? "coliving for remote workers and digital nomads"
        : typeLabel === "meeting room"
        ? "meeting room and flexible workspace"
        : typeLabel === "hostel"
        ? "hostel stay with workspace options for digital nomads"
        : "coworking and workspace for digital nomads";
    const description =
      aboutSnippet ||
      `${name}${cityCountry ? ` in ${cityCountry}` : ""} \u2014 ${audience} on RoamIQ.${extras.length ? ` ${extras.join(" \u00b7 ")}.` : ""}`;
    const url = `${BASE_URL}/workspaces/${listing.id}`;
    const image = firstUsableListingImage(listing.images, listing.logo_url) || undefined;
    return {
      title,
      description,
      keywords: [
        listing.company_name,
        typeLabel || "workspace",
        `${listing.company_name} ${listing.city || ""}`.trim(),
        `${listing.city || ""} ${typeLabel || "coworking"}`.trim(),
        "digital nomad workspace",
        "roamiq",
      ].filter(Boolean),
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: "RoamIQ",
        type: "article",
        ...(image ? { images: [{ url: image, alt: listing.company_name }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
      other: {
        founder: "Pranav Gawas",
        ceo: "Pranav Gawas",
        cto: "RoamIQ Tech Leadership",
        "executive-team": "Pranav Gawas (Founder & CEO), RoamIQ Tech Leadership (CTO & Lead AI Architect)",
        "organization:ceo": "Pranav Gawas",
        "organization:cto": "RoamIQ Tech Leadership",
      },
    };
  } catch {
    return {
      title: "Workspace | RoamIQ",
      description: "Explore coworking spaces and workspaces for digital nomads on RoamIQ.",
    };
  }
}

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();
  const related = await getRelatedListings(listing);
  const destination = await getDestinationForListingCity(listing.city, listing.country);
  const images: string[] = listingGalleryImages(listing.images, listing.logo_url);
  const tags: string[] = usefulListingTags(listing.tags);
  const locationParts = [listing.city, listing.state, listing.country].filter(Boolean);
  const pageUrl = `${BASE_URL}/workspaces/${listing.id}`;
  const primaryImage = images[0] || undefined;
  const listedLogo = isUsableImageUrl(listing.logo_url) ? listing.logo_url.trim() : null;
  const typeFilterHref = listing.company_type
    ? `${BASE_URL}/workspaces?type=${encodeURIComponent(listing.company_type)}`
    : null;
  const destinationHref = destination?.id ? `${BASE_URL}/destinations/${destination.id}` : null;
  const breadcrumbItems: { name: string; item: string }[] = [
    { name: "Home", item: BASE_URL },
    { name: "Workspaces", item: `${BASE_URL}/workspaces` },
  ];
  if (listing.company_type && typeFilterHref) {
    breadcrumbItems.push({ name: listing.company_type, item: typeFilterHref });
  }
  if (destination && destinationHref) {
    breadcrumbItems.push({ name: destination.name, item: destinationHref });
  } else if (listing.city) {
    breadcrumbItems.push({
      name: listing.city,
      item: `${BASE_URL}/workspaces?city=${encodeURIComponent(listing.city)}`,
    });
  }
  breadcrumbItems.push({ name: listing.company_name, item: pageUrl });
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
  const typeKey = String(listing.company_type || "").toLowerCase();
  const schemaType =
    typeKey === "cafe" || typeKey === "coffee" || typeKey === "coffee shop"
      ? "CafeOrCoffeeShop"
      : typeKey === "coliving" || typeKey === "hostel" || typeKey === "workation"
      ? "LodgingBusiness"
      : "LocalBusiness";
  const localBusinessJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: listing.company_name,
    url: pageUrl,
    description: usefulListingAbout(listing.about || listing.description, listing.company_name, 300) || undefined,
    publisher: {
      "@type": "Organization",
      name: "RoamIQ",
      url: BASE_URL,
      founder: { "@type": "Person", name: "Pranav Gawas", jobTitle: "Founder & CEO" },
    },
  };
  const listedStreet = usefulStreetAddress(listing.address, listing.city, listing.country);
  const listedPhone = usefulContactPhone(listing.contact_phone);
  const listedEmail = usefulContactEmail(listing.contact_email);
  const listedWebsite = usefulListingWebsite(listing.website);
  if (listing.company_type) localBusinessJsonLd.additionalType = String(listing.company_type);
  if (images.length > 1) localBusinessJsonLd.image = images;
  else if (primaryImage) localBusinessJsonLd.image = primaryImage;
  if (listedLogo) localBusinessJsonLd.logo = listedLogo;
  if (listedWebsite) localBusinessJsonLd.sameAs = [listedWebsite];
  if (listedStreet || locationParts.length) {
    localBusinessJsonLd.address = {
      "@type": "PostalAddress",
      ...(listedStreet ? { streetAddress: listedStreet } : {}),
      ...(listing.city ? { addressLocality: listing.city } : {}),
      ...(listing.state ? { addressRegion: listing.state } : {}),
      ...(listing.country ? { addressCountry: listing.country } : {}),
    };
  }
  if (listing.latitude != null && listing.longitude != null) {
    localBusinessJsonLd.geo = { "@type": "GeoCoordinates", latitude: listing.latitude, longitude: listing.longitude };
  }
  if (listing.google_map) {
    localBusinessJsonLd.hasMap = listing.google_map;
  } else if (listing.latitude != null && listing.longitude != null) {
    localBusinessJsonLd.hasMap = `https://maps.google.com/?q=${listing.latitude},${listing.longitude}`;
  }
  const listedPriceRange = usefulStartingPrice(listing.starting_price);
  if (listedPriceRange) {
    localBusinessJsonLd.priceRange = listedPriceRange;
    localBusinessJsonLd.makesOffer = {
      "@type": "Offer",
      url: pageUrl,
      priceSpecification: {
        "@type": "PriceSpecification",
        description: listedPriceRange,
      },
      availability: "https://schema.org/InStock",
    };
  }
  if (listing.ratings > 0 && listing.total_reviews > 0) {
    localBusinessJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(listing.ratings),
      reviewCount: Number(listing.total_reviews),
    };
  }
  const listedHours = usefulOpenHours(listing.open_hours);
  if (listedHours.length === 1) localBusinessJsonLd.openingHours = listedHours[0];
  else if (listedHours.length > 1) localBusinessJsonLd.openingHours = listedHours;
  if (listedPhone) localBusinessJsonLd.telephone = listedPhone;
  if (listedEmail) localBusinessJsonLd.email = listedEmail;
  const listedWifi = usefulWifiSpeed(listing.wifi_speed);
  const listedInclusions = usefulListingInclusions(listing.inclusions);
  const listedServices = usefulListingServices(listing.services);
  if (tags.length > 0 || listedWifi || listedInclusions || listedServices.length > 0) {
    localBusinessJsonLd.amenityFeature = [
      ...(listedWifi ? [{ "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi }] : []),
      ...tags.map((tag) => ({ "@type": "LocationFeatureSpecification", name: tag, value: true })),
      ...(listedInclusions ? [{ "@type": "LocationFeatureSpecification", name: "Included", value: listedInclusions }] : []),
      ...listedServices.map((item) => ({ "@type": "LocationFeatureSpecification", name: item, value: true })),
    ];
  }
  if (tags.length > 0) {
    localBusinessJsonLd.keywords = tags.join(", ");
  }
  const faqJsonLd = workspaceFaqJsonLd(listing, BASE_URL);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        {faqJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        {related.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: listing.city ? `More workspaces in ${listing.city}` : "More workspaces",
                numberOfItems: related.length,
                itemListElement: related.map((item, index) => {
                  const thumb = firstVenueListingImage(item.images);
                  const snippet = usefulListingAbout(item.about || item.description, item.company_name, 140);
                  const relatedUrl = `${BASE_URL}/workspaces/${item.id}`;
                  const typeKey = String(item.company_type || "").toLowerCase();
                  const relatedType =
                    typeKey === "cafe" || typeKey === "coffee" || typeKey === "coffee shop"
                      ? "CafeOrCoffeeShop"
                      : typeKey === "coliving" || typeKey === "hostel" || typeKey === "workation"
                        ? "LodgingBusiness"
                        : "LocalBusiness";
                  const place: Record<string, unknown> = {
                    "@type": relatedType,
                    name: item.company_name,
                    url: relatedUrl,
                  };
                  if (snippet) place.description = snippet;
                  if (thumb) place.image = thumb;
                  const relatedStreet = usefulStreetAddress(item.address, item.city, item.country);
                  if (relatedStreet || item.city || item.country) {
                    place.address = {
                      "@type": "PostalAddress",
                      ...(relatedStreet ? { streetAddress: relatedStreet } : {}),
                      ...(item.city ? { addressLocality: item.city } : {}),
                      ...(item.country ? { addressCountry: item.country } : {}),
                    };
                  }
                  const listedPrice = usefulStartingPrice(item.starting_price);
                  if (listedPrice) {
                    place.priceRange = listedPrice;
                    place.makesOffer = {
                      "@type": "Offer",
                      url: relatedUrl,
                      priceSpecification: { "@type": "PriceSpecification", description: listedPrice },
                    };
                  }
                  const listedWifi = usefulWifiSpeed(item.wifi_speed);
                  if (listedWifi) {
                    place.amenityFeature = [
                      { "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi },
                    ];
                  }
                  const relatedRating = Number(item.ratings);
                  const relatedReviews = Number(item.total_reviews);
                  if (relatedRating > 0 && relatedReviews > 0) {
                    place.aggregateRating = {
                      "@type": "AggregateRating",
                      ratingValue: relatedRating,
                      reviewCount: relatedReviews,
                    };
                  }
                  const relatedHours = usefulOpenHours(item.open_hours);
                  if (relatedHours.length === 1) place.openingHours = relatedHours[0];
                  else if (relatedHours.length > 1) place.openingHours = relatedHours;
                  const relatedWebsite = usefulListingWebsite(item.website);
                  const relatedPhone = usefulContactPhone(item.contact_phone);
                  const relatedEmail = usefulContactEmail(item.contact_email);
                  if (relatedWebsite) place.sameAs = [relatedWebsite];
                  if (relatedPhone) place.telephone = relatedPhone;
                  if (relatedEmail) place.email = relatedEmail;
                  const relatedWifi = usefulWifiSpeed(item.wifi_speed);
                  const relatedTags = usefulListingTags(item.tags);
                  if (relatedWifi || relatedTags.length > 0) {
                    place.amenityFeature = [
                      ...(relatedWifi
                        ? [{ "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: relatedWifi }]
                        : []),
                      ...relatedTags.map((tag) => ({
                        "@type": "LocationFeatureSpecification",
                        name: tag,
                        value: true,
                      })),
                    ];
                  }
                  return { "@type": "ListItem", position: index + 1, url: relatedUrl, item: place };
                }),
              }),
            }}
          />
        )}
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Link href="/workspaces" className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Workspaces
            </Link>
            {listing.company_type ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/workspaces?type=${encodeURIComponent(listing.company_type)}`} className="hover:text-foreground hover:underline underline-offset-2">
                  {listing.company_type}
                </Link>
              </>
            ) : null}
            {destination ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/destinations/${destination.id}`} className="hover:text-foreground hover:underline underline-offset-2">
                  {destination.name}
                </Link>
              </>
            ) : listing.city ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/workspaces?city=${encodeURIComponent(listing.city)}`} className="hover:text-foreground hover:underline underline-offset-2">
                  {listing.city}
                </Link>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span className="line-clamp-1 text-foreground/80">{listing.company_name}</span>
          </nav>
        </div>
        <section className="mt-6">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <WorkspaceGallery images={images} alt={listing.company_name} typeLabel={listing.company_type} />
          </div>
        </section>
        <section className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-start gap-3 sm:gap-4">
                  {listedLogo ? (
                    <div className="relative mt-1 h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary sm:h-14 sm:w-14">
                      <Image src={listedLogo} alt={`${listing.company_name} logo`} fill className="object-contain p-1" sizes="56px" unoptimized />
                    </div>
                  ) : null}
                  <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{listing.company_name}</h1>
                </div>
                {usefulListingTitle(listing.company_title, listing.company_name) && (
                  <p className="mt-2 text-lg text-muted-foreground">{usefulListingTitle(listing.company_title, listing.company_name)}</p>
                )}
                {listing.city ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {destination ? (
                      <Link href={`/destinations/${destination.id}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                        Explore {destination.name} cost of living & visa data on RoamIQ
                        {destination.avg_temp != null || destination.air_quality ? (
                          <span className="text-muted-foreground">
                            {" "}
                            ({destination.avg_temp != null ? `${destination.avg_temp}°C avg` : null}
                            {destination.avg_temp != null && destination.air_quality ? " · " : null}
                            {destination.air_quality ? `air ${destination.air_quality}` : null})
                          </span>
                        ) : null}
                      </Link>
                    ) : (
                      <Link href={`/destinations?search=${encodeURIComponent(listing.city)}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                        Explore {listing.city} cost of living & visa data on RoamIQ
                      </Link>
                    )}
                    {" · "}
                    <Link href={`/workspaces?city=${encodeURIComponent(listing.city)}`} className="underline-offset-4 hover:underline">
                      More workspaces in {listing.city}
                    </Link>
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {listing.city ? (
                      <Link href={`/workspaces?city=${encodeURIComponent(listing.city)}`} className="hover:text-accent underline-offset-2 hover:underline">{listing.city}</Link>
                    ) : null}
                    {listing.state ? `, ${listing.state}` : ""}
                    {listing.country ? `, ${listing.country}` : ""}
                  </span>
                  {listing.ratings > 0 && Number(listing.total_reviews) > 0 ? (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Star className="h-4 w-4 fill-sunset text-sunset" />
                      {Number(listing.ratings).toFixed(1)}
                      <span className="font-normal text-muted-foreground">({listing.total_reviews} reviews)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      Reviews pending
                    </span>
                  )}
                </div>
              </div>
              {usefulListingAbout(listing.about || listing.description, listing.company_name) ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">About</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/80">{usefulListingAbout(listing.about || listing.description, listing.company_name)}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5">
                  <h2 className="font-serif text-xl font-semibold">About</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A written description has not been verified for this listing yet. Photos, location, and any listed price or Wi-Fi figures above are from the live database — we do not generate placeholder copy.</p>
                </div>
              )}
              <div className="lg:hidden rounded-2xl border border-border bg-secondary/30 p-4">
                <WaitlistInline
                  source="workspace_detail_after_about"
                  compact
                  askCity={!listing.city}
                  heading={listing.city ? `Email other ${listing.city} listings` : "Email similar listings"}
                  description={
                    listing.city
                      ? `Most visitors leave this page after the description. Leave an email for other live ${listing.city} workspaces when a price or Wi-Fi figure exists. No invented numbers, no fake urgency.`
                      : "Most visitors leave this page after the description. Leave an email for similar live workspaces when a price or Wi-Fi figure exists. No invented numbers, no fake urgency."
                  }
                  context={{ city: listing.city, type: listing.company_type, listing: listing.company_name }}
                />
              </div>
              {tags.length > 0 ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Amenities</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5">
                  <h2 className="font-serif text-xl font-semibold">Amenities</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Amenity tags have not been verified for this listing yet. We do not invent desks, kitchens, or access hours to fill the gap.</p>
                </div>
              )}
              {listedInclusions ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Included</h2>
                  <p className="mt-3 leading-relaxed text-foreground/80">{listedInclusions}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5">
                  <h2 className="font-serif text-xl font-semibold">Included</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">What the stay or desk includes is not listed in the database yet. No placeholder perks.</p>
                </div>
              )}
              {listedServices.length > 0 ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Services</h2>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/80">
                    {listedServices.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5">
                  <h2 className="font-serif text-xl font-semibold">Services</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No verified service list yet. Meeting rooms, cleaning, and similar extras stay hidden until they exist in the listing row.</p>
                </div>
              )}
              {faqJsonLd && Array.isArray(faqJsonLd.mainEntity) && faqJsonLd.mainEntity.length > 0 ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Listing facts</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Answers use only fields already shown on this page. Missing price, Wi-Fi, hours, or contact stay off this list.</p>
                  <dl className="mt-4 space-y-4">
                    {(faqJsonLd.mainEntity as Array<{ name?: string; acceptedAnswer?: { text?: string } }>).map((qa) => (
                      <div key={String(qa.name)} className="rounded-2xl border border-border bg-card/60 p-4">
                        <dt className="text-sm font-semibold text-foreground">{qa.name}</dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-foreground/80">{qa.acceptedAnswer?.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {related.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">More workspaces in {listing.city}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Other live listings in the same city — prices and Wi-Fi only when the database has them. Ranked by photo, description, and listed price when those fields exist.</p>
                  <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                    {related.map((item) => {
                      const venueThumb = firstVenueListingImage(item.images);
                      const logoThumb = isUsableImageUrl(item.logo_url) ? item.logo_url!.trim() : null;
                      const thumb = venueThumb || logoThumb;
                      const thumbKind = venueThumb ? "photo" : logoThumb ? "logo" : null;
                      const snippet = usefulListingAbout(item.about || item.description, item.company_name, 140);
                      const aboutOk = Boolean(snippet);
                      const relatedWebsite = usefulListingWebsite(item.website);
                      const relatedPhone = usefulContactPhone(item.contact_phone);
                      const relatedEmail = usefulContactEmail(item.contact_email);
                      const relatedTags = usefulListingTags(item.tags);
                      return (
                        <li key={item.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Link href={`/workspaces/${item.id}`} className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                              {thumb ? (
                                <Image
                                  src={thumb.trim()}
                                  alt={thumbKind === "logo" ? `${item.company_name} logo` : item.company_name}
                                  fill
                                  className={thumbKind === "logo" ? "object-contain bg-secondary p-1.5" : "object-cover"}
                                  sizes="80px"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 px-1">
                                  <Building2 className="h-4 w-4 text-muted-foreground/50" />
                                  <span className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
                                </div>
                              )}
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link href={`/workspaces/${item.id}`} className="truncate font-medium hover:text-accent">{item.company_name}</Link>
                              {aboutOk ? (
                                <p className="mt-0.5 line-clamp-2 text-xs text-foreground/70">{snippet}</p>
                              ) : (
                                <p className="mt-0.5 text-xs text-muted-foreground">Description pending</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {item.company_type || "workspace"}
                                {Number(item.ratings) > 0 && Number(item.total_reviews) > 0
                                  ? ` · ${Number(item.ratings).toFixed(1)} (${Number(item.total_reviews)})`
                                  : " · Reviews pending"}
                                {usefulWifiSpeed(item.wifi_speed) ? ` · ${usefulWifiSpeed(item.wifi_speed)}` : " · Wi-Fi speed pending"}{usefulOpenHours(item.open_hours)[0] ? ` · ${usefulOpenHours(item.open_hours)[0]}` : " · Hours not listed yet"}
                              </p>
                              {usefulStreetAddress(item.address, item.city, item.country) ? (
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground/80">{usefulStreetAddress(item.address, item.city, item.country)}</p>
                              ) : null}
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                  {!(relatedWebsite || relatedPhone || relatedEmail) && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-secondary/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                      <Phone className="h-3 w-3" /> Contact pending
                                    </span>
                                  )}
                                  {relatedWebsite && (
                                    <a href={relatedWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest">
                                      <ExternalLink className="h-3 w-3" /> Official site
                                    </a>
                                  )}
                                  {relatedPhone && (
                                    <a href={`tel:${relatedPhone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest">
                                      <Phone className="h-3 w-3" /> Call
                                    </a>
                                  )}
                                  {relatedEmail && (
                                    <a href={`mailto:${relatedEmail}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest">
                                      <Mail className="h-3 w-3" /> Email
                                    </a>
                                  )}
                                  {relatedTags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                            </div>
                            <Link href={`/workspaces/${item.id}`} className="shrink-0 text-sm text-muted-foreground hover:text-accent">
                              {usefulStartingPrice(item.starting_price) || "Price not listed yet"}
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href={`/workspaces?city=${encodeURIComponent(listing.city || "")}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                    Browse all in {listing.city}
                  </Link>
                </div>
              )}
            </div>
            <div className="space-y-5">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                {usefulStartingPrice(listing.starting_price) ? (
                  <div className="font-serif text-2xl font-semibold text-forest">{usefulStartingPrice(listing.starting_price)}</div>
                ) : (
                  <div className="font-serif text-lg text-muted-foreground">Price not listed yet</div>
                )}
                <div className="mt-5 space-y-3 text-sm">
                  {usefulWifiSpeed(listing.wifi_speed) ? (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Wifi className="h-4 w-4 text-forest shrink-0" />
                      <span className="font-semibold">{usefulWifiSpeed(listing.wifi_speed)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-muted-foreground/80">
                      <Wifi className="h-4 w-4 shrink-0" />
                      <span>Wi-Fi speed pending</span>
                    </div>
                  )}
                  {listedHours.length > 0 ? (
                    <div className="flex items-start gap-2.5 text-foreground/80">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="space-y-0.5">{listedHours.map((line) => (<div key={line}>{line}</div>))}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-muted-foreground/80">
                      <Clock className="h-4 w-4 shrink-0" /> Hours not listed yet
                    </div>
                  )}
                  {listing.capacity ? (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {listing.capacity}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-muted-foreground/80">
                      <Users className="h-4 w-4 shrink-0" />
                      Capacity not listed yet
                    </div>
                  )}
                  {listedStreet ? (
                    <div className="flex items-start gap-2.5 text-foreground/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {listedStreet}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 text-muted-foreground/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      Street address not listed yet
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
                  {listedPhone ? (
                    <TrackedAnchor eventName="contact_workspace" eventParams={{ method: "phone", listing_id: listing.id, city: listing.city || undefined }} href={`tel:${listedPhone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{listedPhone}</span>
                    </TrackedAnchor>
                  ) : (
                    <p className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                      <Phone className="h-4 w-4 shrink-0" /> Phone not listed yet
                    </p>
                  )}
                  {listedEmail ? (
                    <TrackedAnchor eventName="contact_workspace" eventParams={{ method: "email", listing_id: listing.id, city: listing.city || undefined }} href={`mailto:${listedEmail}`} className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-accent transition-colors">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="break-all">{listedEmail}</span>
                    </TrackedAnchor>
                  ) : (
                    <p className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                      <Mail className="h-4 w-4 shrink-0" /> Email not listed yet
                    </p>
                  )}
                </div>
                {listedWebsite ? (
                  <a href={listedWebsite} target="_blank" rel="noopener noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Visit website <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                    Official website not listed yet
                  </p>
                )}
                {(listing.google_map || (listing.latitude != null && listing.longitude != null)) && (
                  <a href={listing.google_map || `https://maps.google.com/?q=${listing.latitude},${listing.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors">
                    <Globe className="h-4 w-4" /> View on Google Maps
                  </a>
                )}
                <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
                  <WaitlistInline
                    source="workspace_detail"
                    heading={listing.city ? `Want similar workspaces in ${listing.city}?` : "Want similar workspaces after this listing?"}
                    description={listing.city ? `This page is a common last stop. Leave an email for other live listings in ${listing.city} when a listed price or Wi-Fi value exists. No extra page, no fabricated urgency.` : "This page is a common last stop. Leave an email for similar live listings when a listed price or Wi-Fi value exists. No extra page, no fabricated urgency."}
                    context={{ city: listing.city, type: listing.company_type, listing: listing.company_name }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WaitlistSticky
        source="workspace_detail_sticky"
        context={{ city: listing.city, type: listing.company_type, listing: listing.company_name }}
      />
      <Footer />
    </div>
  );
}
