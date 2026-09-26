import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, ArrowRight, ArrowLeft, Building2, Phone, Mail, ExternalLink, Clock } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { WaitlistSticky } from "@/components/site/waitlist-sticky";
import { supabase, type Listing } from "@/lib/supabase";
import { firstVenueListingImage, isUsableImageUrl, isVenuePhotoUrl, usefulContactEmail, usefulContactPhone, usefulListingAbout, usefulListingWebsite, usefulListedPrice, usefulStreetAddress, usefulListingRegion, usefulListingContinent, usefulListingTags, usefulListingTitle, usefulListingInclusions, usefulListingServices, usefulOpenHours, usefulWifiSpeed, usefulListingMapUrl, usefulListingCoordinates, usefulListingSocialLinks, usefulListingUnits, usefulListingCapacity, usefulListingProductName, usefulListingContactPerson, usefulListingRegisteredEntity } from "@/lib/listing-media";
import { getDestinationForListingCity, type ListingDestinationMatch } from "@/lib/listing-destination";
import { workspaceListItemJsonLd } from "@/lib/listing-jsonld";
import { IntentListingLinks } from "@/components/site/intent-listing-links";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

/** Venue-name queries that earned at least one GSC click in the last 30d (2026-08-22 to 2026-09-21). No invented names. */
const GSC_CLICK_QUERIES = [
  "atzomx",
  "cafe nenom",
  "cafe nook",
  "coliving zürich",
  "durty nellys amsterdam",
  "innapartment taipei",
  "ngb living",
  "tomodomo coliving",
  "urban place",
] as const;

export const metadata: Metadata = {
  title: "Coworking, Coliving & Workation Spaces for Nomads | RoamIQ",
  description:
    "Browse RoamIQ workspaces: coworking desks, coliving, workations, cafes and meeting rooms. Filter by city — Wi-Fi and prices when listed.",
  keywords: [
    "coworking spaces digital nomad",
    "coliving for remote workers",
    "vetted workspaces wifi speed",
    "workation hubs",
    "remote work spaces",
    "roamiq workspaces",
  ],
  alternates: { canonical: `${BASE_URL}/workspaces` },
  openGraph: {
    title: "Coworking, Coliving & Workation Spaces for Nomads | RoamIQ",
    description:
      "Browse coworking desks, coliving houses, workations, hostels, cafes and meeting rooms for digital nomads. Price and Wi-Fi appear only when the listing has a real value.",
    url: `${BASE_URL}/workspaces`,
    siteName: "RoamIQ",
    type: "website",
    images: [{ url: `${BASE_URL}/logo.svg`, width: 512, height: 512, alt: "RoamIQ Workspaces" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coworking, Coliving & Workation Spaces for Nomads | RoamIQ",
    description:
      "Browse coworking desks, coliving houses, workations, hostels, cafes and meeting rooms for digital nomads. Price and Wi-Fi appear only when the listing has a real value.",
    images: [`${BASE_URL}/logo.svg`],
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

export const revalidate = 180;
const PAGE_SIZE = 24;

/** Exact public catalog size — H1 must not use a post-filter window length. */
async function getCatalogCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("is_public", true)
      .eq("is_active", true);
    if (error) {
      console.error(error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error("Error in getCatalogCount:", error);
    return 0;
  }
}

const types = [
  { value: "", label: "All types" },
  { value: "coworking", label: "Coworking" },
  { value: "coliving", label: "Coliving" },
  { value: "workation", label: "Workation" },
  { value: "hostel", label: "Hostel" },
  { value: "cafe", label: "Cafe" },
  { value: "meetingroom", label: "Meeting room" },
];

async function getListings(params: {
  search?: string;
  type?: string;
  city?: string;
  country?: string;
  min_wifi?: string;
  described?: string;
  priced?: string;
  photographed?: string;
  logoed?: string;
  contactable?: string;
  hours?: string;
  addressed?: string;
  mapped?: string;
  equipped?: string;
  website?: string;
  social?: string;
  reviewed?: string;
  phoned?: string;
  emailed?: string;
  sized?: string;
  united?: string;
  complete?: string;
  tagged?: string;
  titled?: string;
  regioned?: string;
  continented?: string;
  wifiable?: string;
  coordinated?: string;
  producted?: string;
  hosted?: string;
  included?: string;
  serviced?: string; legal?: string;
  page?: string;
}) {
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  try {
    let query = supabase
      .from("listings")
      .select(
        "id, company_name, company_title, company_type, city, state, country, continent, address, starting_price, cost, units, wifi_speed, open_hours, ratings, total_reviews, tags, logo_url, images, about, description, product_name, registered_entity_name, website, contact_name, contact_designation, contact_phone, contact_email, google_map, latitude, longitude, inclusions, services, social_links, capacity",
        { count: "planned" }
      )
      .eq("is_public", true)
      .eq("is_active", true);
    if (params.search) query = query.ilike("company_name", `%${params.search}%`);
    if (params.type) query = query.eq("company_type", params.type);
    if (params.city) query = query.ilike("city", `%${params.city}%`);
    if (params.country) query = query.ilike("country", `%${params.country}%`);
    if (params.min_wifi) {
      // "Verified" means a Mbps label that is not one of the bulk templates
      // already treated as pending in usefulWifiSpeed. Matching %Mbps% alone
      // returned nearly the whole catalog.
      query = query
        .ilike("wifi_speed", "%Mbps%")
        .not("wifi_speed", "ilike", "%Free Wi-Fi%")
        .not("wifi_speed", "ilike", "%Nomad Wi-Fi%")
        .not("wifi_speed", "ilike", "%Dedicated Line%")
        .not("wifi_speed", "ilike", "%High-Speed Wi-Fi%")
        .not("wifi_speed", "ilike", "%Dedicated Fiber%")
        .not("wifi_speed", "ilike", "%High-Speed Fiber%");
    }
    if (params.described === "1") {
      // Prefer rows with a usable about *or* description — both are rendered
      // as the card snippet. PostgREST or() keeps this a single request.
      query = query.or("about.neq.,description.neq.");
    }
    if (params.priced === "1") {
      // Keep rows that already store a figure on starting_price *or* cost.
      // Placeholder strings are dropped after fetch via usefulListedPrice.
      query = query.or("starting_price.neq.,cost.neq.");
    }
    const photographedOnly = params.photographed === "1";
    const logoedOnly = params.logoed === "1";
    const websiteOnly = params.website === "1";
    const contactableOnly = params.contactable === "1";
    const hoursOnly = params.hours === "1";
    const addressedOnly = params.addressed === "1";
    const mappedOnly = params.mapped === "1";
    const equippedOnly = params.equipped === "1";
    const socialOnly = params.social === "1";
    const reviewedOnly = params.reviewed === "1";
    const phonedOnly = params.phoned === "1";
    const emailedOnly = params.emailed === "1";
    const sizedOnly = params.sized === "1";
    const unitedOnly = params.united === "1";
    const completeOnly = params.complete === "1";
    const taggedOnly = params.tagged === "1";
    const titledOnly = params.titled === "1";
    const regionedOnly = params.regioned === "1";
    const continentedOnly = params.continented === "1";
    const wifiableOnly = params.wifiable === "1";
    const coordinatedOnly = params.coordinated === "1";
    const productedOnly = params.producted === "1";
    const hostedOnly = params.hosted === "1";
    const includedOnly = params.included === "1";
    const servicedOnly = params.serviced === "1";
    const legalOnly = params.legal === "1";
    const unfilteredFirstPage =
      page === 1 &&
      !params.search &&
      !params.type &&
      !params.city &&
      !params.country &&
      !params.min_wifi &&
      params.described !== "1" &&
      params.priced !== "1" &&
      !photographedOnly &&
      !logoedOnly &&
      !contactableOnly &&
      !hoursOnly &&
      !addressedOnly &&
      !mappedOnly &&
      !equippedOnly &&
      !websiteOnly &&
      !socialOnly &&
      !reviewedOnly &&
      !phonedOnly &&
      !emailedOnly &&
      !sizedOnly &&
      !unitedOnly &&
      !completeOnly &&
      !taggedOnly &&
      !titledOnly &&
      !regionedOnly &&
      !continentedOnly &&
      !wifiableOnly &&
      !coordinatedOnly &&
      !productedOnly &&
      !hostedOnly &&
      !includedOnly &&
      !servicedOnly &&
      !legalOnly;

    // Page 1 of the unfiltered index is the bounce landing (GA4 ~87.5%).
    // Over-fetch a rated pool and prefer cards that already show a real about
    // snippet or a usable photo — never invent copy, and do not hide the rest
    // of the catalog on later pages.
    const fetchTo =
      unfilteredFirstPage || photographedOnly || logoedOnly || contactableOnly || hoursOnly || addressedOnly || mappedOnly || equippedOnly || websiteOnly || socialOnly || reviewedOnly || phonedOnly || emailedOnly || sizedOnly || unitedOnly || completeOnly || taggedOnly || titledOnly || regionedOnly || continentedOnly || wifiableOnly || coordinatedOnly || productedOnly || hostedOnly || includedOnly || servicedOnly || legalOnly ? Math.max(to, PAGE_SIZE * 4 - 1) : to;
    const { data, error, count } = await query
      .order("ratings", { ascending: false, nullsFirst: false })
      .range(from, fetchTo);
    if (error) {
      console.error(error);
      return { listings: [] as Listing[], count: 0, page };
    }
    const rows = (data ?? []) as Listing[];
    if (params.priced === "1") {
      const priced = rows.filter((listing) =>
        Boolean(usefulListedPrice(listing.starting_price, listing.cost))
      );
      return { listings: priced.slice(0, PAGE_SIZE), count: priced.length, page };
    }
    if (photographedOnly) {
      // images[] is populated on almost every row; only keep cards whose
      // photo already passes firstUsableListingImage (same gate as the UI).
      const withPhoto = rows.filter((listing) =>
        Boolean(firstVenueListingImage(listing.images))
      );
      return { listings: withPhoto.slice(0, PAGE_SIZE), count: withPhoto.length, page };
    }
    if (logoedOnly) {
      const withLogo = rows.filter((listing) => isUsableImageUrl(listing.logo_url));
      return { listings: withLogo.slice(0, PAGE_SIZE), count: withLogo.length, page };
    }
    if (websiteOnly) {
      const withSite = rows.filter((listing) => Boolean(usefulListingWebsite(listing.website)));
      return { listings: withSite.slice(0, PAGE_SIZE), count: withSite.length, page };
    }
    if (contactableOnly) {
      const withContact = rows.filter((listing) =>
        Boolean(
          usefulListingWebsite(listing.website) ||
          usefulContactPhone(listing.contact_phone) ||
          usefulContactEmail(listing.contact_email)
        )
      );
      return { listings: withContact.slice(0, PAGE_SIZE), count: withContact.length, page };
    }
    if (hoursOnly) {
      const withHours = rows.filter((listing) => usefulOpenHours(listing.open_hours).length > 0);
      return { listings: withHours.slice(0, PAGE_SIZE), count: withHours.length, page };
    }
    if (addressedOnly) {
      const withAddress = rows.filter((listing) =>
        Boolean(usefulStreetAddress(listing.address, listing.city, listing.country))
      );
      return { listings: withAddress.slice(0, PAGE_SIZE), count: withAddress.length, page };
    }
    if (mappedOnly) {
      const withMap = rows.filter((listing) =>
        Boolean(usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude))
      );
      return { listings: withMap.slice(0, PAGE_SIZE), count: withMap.length, page };
    }
    if (equippedOnly) {
      const withAmenities = rows.filter((listing) =>
        Boolean(usefulListingInclusions(listing.inclusions) || usefulListingServices(listing.services).length)
      );
      return { listings: withAmenities.slice(0, PAGE_SIZE), count: withAmenities.length, page };
    }
    if (socialOnly) {
      const withSocial = rows.filter((listing) => usefulListingSocialLinks(listing.social_links).length > 0);
      return { listings: withSocial.slice(0, PAGE_SIZE), count: withSocial.length, page };
    }
    if (reviewedOnly) {
      const withReviews = rows.filter((listing) => {
        const reviews = Number(listing.total_reviews ?? 0);
        const rating = Number(listing.ratings ?? 0);
        return Number.isFinite(reviews) && reviews > 0 && Number.isFinite(rating) && rating > 0;
      });
      return { listings: withReviews.slice(0, PAGE_SIZE), count: withReviews.length, page };
    }
    if (phonedOnly) {
      const withPhone = rows.filter((listing) => Boolean(usefulContactPhone(listing.contact_phone)));
      return { listings: withPhone.slice(0, PAGE_SIZE), count: withPhone.length, page };
    }
    if (emailedOnly) {
      const withEmail = rows.filter((listing) => Boolean(usefulContactEmail(listing.contact_email)));
      return { listings: withEmail.slice(0, PAGE_SIZE), count: withEmail.length, page };
    }
    if (sizedOnly) {
      const withCapacity = rows.filter((listing) => Boolean(usefulListingCapacity(listing.capacity)));
      return { listings: withCapacity.slice(0, PAGE_SIZE), count: withCapacity.length, page };
    }
    if (unitedOnly) {
      const withUnits = rows.filter((listing) => Boolean(usefulListingUnits(listing.units)));
      return { listings: withUnits.slice(0, PAGE_SIZE), count: withUnits.length, page };
    }
    if (completeOnly) {
      // Cards that already show the three fields that stop a listing looking thin:
      // usable photo + visible about + listed starting price. No invented values.
      const complete = rows.filter((listing) =>
        Boolean(
          firstVenueListingImage(listing.images) &&
          usefulListingAbout(listing.about || listing.description, listing.company_name) &&
          usefulListedPrice(listing.starting_price, listing.cost)
        )
      );
      return { listings: complete.slice(0, PAGE_SIZE), count: complete.length, page };
    }
    if (taggedOnly) {
      const tagged = rows.filter((listing) => usefulListingTags(listing.tags).length > 0);
      return { listings: tagged.slice(0, PAGE_SIZE), count: tagged.length, page };
    }
    if (titledOnly) {
      const titled = rows.filter((listing) =>
        Boolean(usefulListingTitle(listing.company_title, listing.company_name))
      );
      return { listings: titled.slice(0, PAGE_SIZE), count: titled.length, page };
    }
    if (regionedOnly) {
      // Keep cards whose state already passes usefulListingRegion (same label
      // rendered next to city). Never invent a region.
      const regioned = rows.filter((listing) =>
        Boolean(usefulListingRegion(listing.state, listing.city))
      );
      return { listings: regioned.slice(0, PAGE_SIZE), count: regioned.length, page };
    }
    if (continentedOnly) {
      // Keep cards whose continent already passes usefulListingContinent
      // (same label rendered after country). Never invent a continent.
      const continented = rows.filter((listing) =>
        Boolean(usefulListingContinent(listing.continent))
      );
      return { listings: continented.slice(0, PAGE_SIZE), count: continented.length, page };
    }
    if (wifiableOnly) {
      // Keep cards whose wifi_speed already passes usefulWifiSpeed (same
      // gate as the card label). Pending / template strings stay out.
      const wifiable = rows.filter((listing) => Boolean(usefulWifiSpeed(listing.wifi_speed)));
      return { listings: wifiable.slice(0, PAGE_SIZE), count: wifiable.length, page };
    }
    if (coordinatedOnly) {
      // Keep cards whose stored lat/lng already pass usefulListingCoordinates
      // (same pair shown next to the Map chip). Never invent a pin.
      const coordinated = rows.filter((listing) =>
        Boolean(usefulListingCoordinates(listing.latitude, listing.longitude))
      );
      return { listings: coordinated.slice(0, PAGE_SIZE), count: coordinated.length, page };
    }
    if (productedOnly) {
      // Keep cards whose stored product_name already passes usefulListingProductName
      // (the same plan label rendered under the venue name). Never invent a plan.
      const producted = rows.filter((listing) =>
        Boolean(usefulListingProductName(listing.product_name, listing.company_name))
      );
      return { listings: producted.slice(0, PAGE_SIZE), count: producted.length, page };
    }
    if (hostedOnly) {
      const hosted = rows.filter((listing) =>
        Boolean(usefulListingContactPerson(listing.contact_name, listing.contact_designation))
      );
      return { listings: hosted.slice(0, PAGE_SIZE), count: hosted.length, page };
    }
    if (includedOnly) {
      // Keep cards whose stored inclusions already pass usefulListingInclusions
      // (same line under price on the card). Never invent what's included.
      const included = rows.filter((listing) =>
        Boolean(usefulListingInclusions(listing.inclusions))
      );
      return { listings: included.slice(0, PAGE_SIZE), count: included.length, page };
    }
    if (legalOnly) {
      // Keep cards whose stored registered_entity_name already passes
      // usefulListingRegisteredEntity. Never invent a legal name.
      const legal = rows.filter((listing) =>
        Boolean(usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name))
      );
      return { listings: legal.slice(0, PAGE_SIZE), count: legal.length, page };
    }
    if (servicedOnly) {
      // Keep cards whose stored services already pass usefulListingServices
      // (same chips under price). Never invent a service list.
      const serviced = rows.filter((listing) =>
        usefulListingServices(listing.services).length > 0
      );
      return { listings: serviced.slice(0, PAGE_SIZE), count: serviced.length, page };
    }
    if (!unfilteredFirstPage) {
      return { listings: rows, count: count ?? 0, page };
    }
    const scored = rows
      .map((listing, index) => {
        let score = 0;
        if (usefulListingAbout(listing.about || listing.description, listing.company_name)) score += 100;
        if (firstVenueListingImage(listing.images)) score += 20;
        if (isUsableImageUrl(listing.logo_url)) score += 12;
        if (usefulListingInclusions(listing.inclusions)) score += 6;
        if (usefulListedPrice(listing.starting_price, listing.cost)) score += 10;
        if (usefulWifiSpeed(listing.wifi_speed)) score += 10;
        if (usefulOpenHours(listing.open_hours).length) score += 8;
        if (usefulStreetAddress(listing.address, listing.city, listing.country)) score += 7;
        if (usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude)) score += 6;
        if (usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name)) score += 3;
        if (usefulListingInclusions(listing.inclusions) || usefulListingServices(listing.services).length) score += 6;
        if (usefulListingWebsite(listing.website) || usefulContactPhone(listing.contact_phone) || usefulContactEmail(listing.contact_email)) score += 15;
        if (usefulListingSocialLinks(listing.social_links).length) score += 8;
        const reviews = Number(listing.total_reviews ?? 0);
        if (Number.isFinite(reviews) && reviews > 0 && Number(listing.ratings ?? 0) > 0) score += 9;
        if (usefulContactPhone(listing.contact_phone)) score += 8;
        if (usefulContactEmail(listing.contact_email)) score += 8;
        if (usefulListingCapacity(listing.capacity)) score += 6;
        if (usefulListingUnits(listing.units)) score += 5;
        if (usefulListingRegion(listing.state, listing.city)) score += 4;
        if (usefulListingContinent(listing.continent)) score += 3;
        if (usefulListingCoordinates(listing.latitude, listing.longitude)) score += 4;
        if (usefulListingProductName(listing.product_name, listing.company_name)) score += 5;
        if (usefulListingContactPerson(listing.contact_name, listing.contact_designation)) score += 4;
        if (
          firstVenueListingImage(listing.images) &&
          usefulListingAbout(listing.about || listing.description, listing.company_name) &&
          usefulListedPrice(listing.starting_price, listing.cost)
        ) score += 18;
        score += Number(listing.ratings ?? 0);
        return { listing, score, index };
      })
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, PAGE_SIZE)
      .map((row) => row.listing);
    return { listings: scored, count: count ?? 0, page };
  } catch (error) {
    console.error("Error in getListings:", error);
    return { listings: [] as Listing[], count: 0, page };
  }
}

function getCardImage(listing: Listing): { url: string; kind: "photo" | "logo" } | null {
  const photo = firstVenueListingImage(listing.images);
  if (photo) return { url: photo, kind: "photo" };
  if (isUsableImageUrl(listing.logo_url)) return { url: listing.logo_url!.trim(), kind: "logo" };
  return null;
}

function usefulAboutSnippet(about: string | null | undefined, companyName?: string | null): string | null {
  return usefulListingAbout(about, companyName, 420);
}



function usefulTags(tags: string[] | null | undefined): string[] {
  return usefulListingTags(tags);

}

function ListingCard({ listing, destination }: { listing: Listing; destination?: ListingDestinationMatch | null }) {
  const destinationHref = destination?.id ? `/destinations/${destination.id}` : null;
  const cityInternet = destination?.wifi_speed_p90 || destination?.internet_mbps || null;
  const cityCost = destination?.cost_usd || null;
  const cityTemp = destination?.avg_temp;
  const cityAir = destination?.air_quality || null;
  const citySafety = destination?.safety_score;
  const cityVisa = destination?.visa_difficulty || null;
  const cityWalk = destination?.walkability_score ?? null;
  const cityDesk = destination?.coworking_desk_usd ?? null;
  const cityRent = destination?.one_bed_rent_usd ?? null;
  const cardImage = getCardImage(listing);
  const imageUrl = cardImage?.url ?? null;
  const imageKind = cardImage?.kind ?? null;
  const reviewCount = Number(listing.total_reviews ?? 0);
  const ratingValue = Number(listing.ratings ?? 0);
  const showRating = ratingValue > 0 && reviewCount > 0;
  const visibleTags = usefulTags(listing.tags);
  const listedPhone = usefulContactPhone(listing.contact_phone);
  const listedEmail = usefulContactEmail(listing.contact_email);
  const listedWebsite = usefulListingWebsite(listing.website);
  const listedSocial = usefulListingSocialLinks(listing.social_links);
  const typeHref = listing.company_type ? `/workspaces?type=${encodeURIComponent(listing.company_type)}` : null;
  const cityFilterHref = listing.city ? `/workspaces?city=${encodeURIComponent(listing.city)}` : null;
  const cityHref = destinationHref || cityFilterHref;
  const countryHref = listing.country ? `/workspaces?country=${encodeURIComponent(listing.country)}` : null;
  const regionLabel = usefulListingRegion(listing.state, listing.city);
  const continentLabel = usefulListingContinent(listing.continent);
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-forest/5 hover:-translate-y-0.5">
      <Link href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageKind === "logo" ? `${listing.company_name} logo` : listing.company_name} fill className={imageKind === "logo" ? "object-contain bg-secondary p-8 transition-transform duration-300 group-hover:scale-105" : "object-cover transition-transform duration-300 group-hover:scale-105"} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
          </div>
        )}
        {(() => {
          const photoCount = Array.isArray(listing.images)
            ? listing.images.filter((u) => isVenuePhotoUrl(u)).length
            : 0;
          if (imageKind === "logo") {
            return (
              <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                Logo
              </span>
            );
          }
          if (!imageUrl || photoCount < 2) return null;
          return (
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground/80">
              {photoCount} photos
            </span>
          );
        })()}
      </Link>
      {Array.isArray(listing.images) ? (() => {
        const extras = listing.images
          .filter((u) => isVenuePhotoUrl(u) && u !== imageUrl)
          .slice(0, 3);
        if (extras.length === 0) return null;
        return (
          <div className="grid grid-cols-3 gap-px bg-border">
            {extras.map((src) => (
              <Link key={src} href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <Image src={src} alt={`${listing.company_name} photo`} fill className="object-cover" sizes="120px" unoptimized />
              </Link>
            ))}
          </div>
        );
      })() : null}
      <div className="flex flex-1 flex-col p-5">
        {typeHref && (
          <div className="mb-2">
            <Link href={typeHref} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 hover:bg-accent/15 hover:text-accent">
              {listing.company_type}
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          {isUsableImageUrl(listing.logo_url) ? (
            <Link href={`/workspaces/${listing.id}`} className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
              <Image src={listing.logo_url.trim()} alt={`${listing.company_name} logo`} fill className="object-contain p-0.5" sizes="32px" unoptimized />
            </Link>
          ) : null}
          <h3 className="font-serif text-lg font-semibold tracking-tight line-clamp-1">
            <Link href={`/workspaces/${listing.id}`} className="hover:text-accent transition-colors">{listing.company_name}</Link>
          </h3>
        </div>
        {usefulListingTitle(listing.company_title, listing.company_name) && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{usefulListingTitle(listing.company_title, listing.company_name)}</p>}
        {usefulListingProductName(listing.product_name, listing.company_name) && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">Plan: {usefulListingProductName(listing.product_name, listing.company_name)}</p>
        )}
        {usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name) && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">Legal name: {usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name)}</p>
        )}
        {(() => {
          const aboutSnippet = usefulAboutSnippet(listing.about || listing.description, listing.company_name);
          const addressSnippet = usefulStreetAddress(listing.address, listing.city, listing.country);
          if (aboutSnippet) {
            return <p className="mt-1 text-sm text-foreground/70 line-clamp-4">{aboutSnippet}</p>;
          }
          if (addressSnippet) {
            return <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{addressSnippet}</p>;
          }
          return <p className="mt-1 text-sm text-muted-foreground">Description pending</p>;
        })()}
        {visibleTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/70">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2.5 flex items-start gap-1.5 text-sm text-foreground/70">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0">
            <span className="line-clamp-1">
            {cityHref ? (
              <Link href={cityHref} className="hover:text-accent hover:underline underline-offset-2">{listing.city}</Link>
            ) : (
              listing.city
            )}
            {regionLabel ? (
              <>
                {listing.city ? ", " : ""}
                <span>{regionLabel}</span>
              </>
            ) : null}
            {listing.country ? (
              <>
                {listing.city || regionLabel ? ", " : ""}
                {countryHref ? (
                  <Link href={countryHref} className="hover:text-accent hover:underline underline-offset-2">{listing.country}</Link>
                ) : (
                  listing.country
                )}
              </>
            ) : null}
            {continentLabel ? (
              <>
                {listing.city || regionLabel || listing.country ? ", " : ""}
                <span>{continentLabel}</span>
              </>
            ) : null}
            </span>
            {usefulStreetAddress(listing.address, listing.city, listing.country) ? (
              <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
                {usefulStreetAddress(listing.address, listing.city, listing.country)}
              </span>
            ) : null}
            {destinationHref && listing.city ? (
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                <Link href={destinationHref} className="hover:text-accent hover:underline underline-offset-2">
                  City guide: cost of living & visa
                </Link>
                {cityFilterHref ? (
                  <>
                    {" · "}
                    <Link href={cityFilterHref} className="hover:text-accent hover:underline underline-offset-2">
                      More workspaces
                    </Link>
                  </>
                ) : null}
              </span>
            ) : null}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {!(listedPhone || listedEmail || listedWebsite || listedSocial.length) && (
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-secondary/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Phone className="h-3 w-3" /> Contact pending
            </span>
          )}
            {listedWebsite && (
              <a
                href={listedWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
              >
                <ExternalLink className="h-3 w-3" /> Official site
              </a>
            )}
            {listedPhone && (
              <a
                href={`tel:${listedPhone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
              >
                <Phone className="h-3 w-3" /> Call
              </a>
            )}
            {usefulListingContactPerson(listing.contact_name, listing.contact_designation) && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
                <Phone className="h-3 w-3" /> {usefulListingContactPerson(listing.contact_name, listing.contact_designation)}
              </span>
            )}
            {listedEmail && (
              <a
                href={`mailto:${listedEmail}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
              >
                <Mail className="h-3 w-3" /> Email
              </a>
            )}
            {listedSocial.slice(0, 3).map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
              >
                <ExternalLink className="h-3 w-3" /> {s.label}
              </a>
            ))}
            {usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude) && (
              <a
                href={usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
              >
                <MapPin className="h-3 w-3" /> Map
                {usefulListingCoordinates(listing.latitude, listing.longitude) ? (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {usefulListingCoordinates(listing.latitude, listing.longitude)}
                  </span>
                ) : null}
              </a>
            )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            {usefulListedPrice(listing.starting_price, listing.cost) ? (
              <div>
                <div className="font-serif text-lg font-semibold text-forest">{usefulListedPrice(listing.starting_price, listing.cost)}</div>
              </div>
            ) : cityCost || cityDesk || cityRent ? (
              <div>
                <div className="text-sm text-muted-foreground">Price not listed yet</div>
                <div className="text-[11px] text-muted-foreground/80">
                  {[
                    cityDesk ? `city coworking desk ~$${cityDesk.toLocaleString()}/mo` : null,
                    cityRent ? `1-bed rent ~$${cityRent.toLocaleString()}/mo` : null,
                    cityCost ? `city living cost ~$${cityCost.toLocaleString()}/mo` : null,
                  ].filter(Boolean).join(" · ")}
                </div>
                {listedEmail ? (
                  <div className="mt-1 text-[11px]">
                    <a href={`mailto:${listedEmail}?subject=${encodeURIComponent(`Rates at ${listing.company_name}`)}`} className="font-medium text-accent underline-offset-2 hover:underline">
                      Ask this venue for current rates
                    </a>
                  </div>
                ) : listedPhone ? (
                  <div className="mt-1 text-[11px]">
                    <a href={`tel:${listedPhone.replace(/[^+\d]/g, "")}`} className="font-medium text-accent underline-offset-2 hover:underline">
                      Call for current rates
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">Price not listed yet</div>
                {listedEmail || listedPhone ? (
                  <div className="mt-1 text-[11px] text-muted-foreground/80">
                    {listedEmail ? (
                      <a href={`mailto:${listedEmail}?subject=${encodeURIComponent(`Rates at ${listing.company_name}`)}`} className="font-medium text-accent underline-offset-2 hover:underline">
                        Ask this venue for current rates
                      </a>
                    ) : (
                      <a href={`tel:${listedPhone!.replace(/[^+\d]/g, "")}`} className="font-medium text-accent underline-offset-2 hover:underline">
                        Call for current rates
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            {usefulListingUnits(listing.units) ? (
              <div className="text-[11px] text-muted-foreground">{usefulListingUnits(listing.units)}</div>
            ) : null}
            {usefulListingCapacity(listing.capacity) ? (
              <div className="text-[11px] text-muted-foreground">{usefulListingCapacity(listing.capacity)}</div>
            ) : null}
            {usefulWifiSpeed(listing.wifi_speed) ? (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Wifi className="h-3 w-3" /> {usefulWifiSpeed(listing.wifi_speed)}</div>
            ) : cityInternet ? (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/80"><Wifi className="h-3 w-3" /> City internet ~{cityInternet} Mbps · listing Wi-Fi pending</div>
            ) : (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/70"><Wifi className="h-3 w-3" /> Wi-Fi speed pending</div>
            )}
            {!usefulListedPrice(listing.starting_price, listing.cost) && !usefulWifiSpeed(listing.wifi_speed) && !listedEmail && !listedPhone ? (
              <div className="mt-3">
                <WaitlistInline
                  source="workspaces-card-thin"
                  heading="Want this card when a price or Wi-Fi figure is listed?"
                  description="This listing is still missing both. Email is enough — we only write when a stored price or Wi-Fi value exists. No invented numbers."
                  compact
                  askCity
                  context={{ city: listing.city, listing: listing.id, gap: "no_price_no_wifi" }}
                />
              </div>
            ) : null}
            {usefulOpenHours(listing.open_hours)[0] ? (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {usefulOpenHours(listing.open_hours)[0]}</div>
            ) : (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/70"><Clock className="h-3 w-3" /> Hours not listed yet</div>
            )}
            {usefulListingInclusions(listing.inclusions) ? (
              <div className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">Included: {usefulListingInclusions(listing.inclusions)}</div>
            ) : null}
            {usefulListingServices(listing.services).length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {usefulListingServices(listing.services).slice(0, 4).map((item) => (
                  <span key={item} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-foreground/80">{item}</span>
                ))}
              </div>
            ) : null}
            {(cityTemp != null || cityAir) && (
              <div className="mt-0.5 text-[11px] text-muted-foreground/80">
                City climate
                {cityTemp != null ? ` · ${cityTemp}°C avg` : ""}
                {cityAir ? ` · air ${cityAir}` : ""}
                {" · listing-level weather not stored"}
              </div>
            )}
            {(cityVisa || citySafety != null || cityWalk != null) && (
              <div className="mt-0.5 text-[11px] text-muted-foreground/80">
                City guide
                {cityVisa ? ` · visa ${cityVisa}` : ""}
                {citySafety != null ? ` · safety ${Number(citySafety).toFixed(1)}` : ""}
                {cityWalk != null ? ` · walk ${Number(cityWalk).toFixed(1)}` : ""}
              </div>
            )}
          </div>
          {showRating ? (
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
              {ratingValue.toFixed(1)}
              <span className="text-xs font-normal text-muted-foreground">({reviewCount})</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Reviews pending</div>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function WorkspacesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; city?: string; country?: string; min_wifi?: string; described?: string; priced?: string; photographed?: string; logoed?: string; website?: string; social?: string; reviewed?: string; phoned?: string; emailed?: string; sized?: string; united?: string; complete?: string; tagged?: string; titled?: string; regioned?: string; continented?: string; wifiable?: string; coordinated?: string; producted?: string; hosted?: string; included?: string; serviced?: string; legal?: string; contactable?: string; hours?: string; addressed?: string; mapped?: string; equipped?: string; page?: string }>;
}) {
  const params = await searchParams;
  const waitlistContext = { city: params.city, country: params.country, type: params.type, search: params.search };
  const [{ listings, count, page }, catalogCount] = await Promise.all([
    getListings(params),
    getCatalogCount(),
  ]);
  const headlineCount = catalogCount > 0 ? catalogCount : count;
  const destKey = (city?: string | null, country?: string | null) => `${city || ""}||${country || ""}`;
  const destPairs = await Promise.all(
    Array.from(new Set(listings.map((l) => destKey(l.city, l.country)))).map(async (key) => {
      const [city, country] = key.split("||");
      const dest = await getDestinationForListingCity(city || null, country || null);
      return [key, dest] as const;
    }),
  );
  const destByCityCountry = new Map(destPairs);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const filterQs = (overrides: Record<string, string | null | undefined> = {}) => {
    const qs = new URLSearchParams();
    const merged: Record<string, string | null | undefined> = {
      search: params.search,
      type: params.type,
      city: params.city,
      country: params.country,
      min_wifi: params.min_wifi,
      described: params.described,
      priced: params.priced,
      photographed: params.photographed,
      logoed: params.logoed,
      website: params.website,
      contactable: params.contactable,
      hours: params.hours,
      addressed: params.addressed,
      mapped: params.mapped,
      equipped: params.equipped,
      social: params.social,
      reviewed: params.reviewed,
      phoned: params.phoned,
      emailed: params.emailed,
      sized: params.sized,
      united: params.united,
      complete: params.complete,
      tagged: params.tagged,
      titled: params.titled,
      regioned: params.regioned,
      continented: params.continented,
      wifiable: params.wifiable,
      coordinated: params.coordinated,
      producted: params.producted,
      hosted: params.hosted,
      included: params.included,
      serviced: params.serviced,
      legal: params.legal,
      ...overrides,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    return qs;
  };
  const buildHref = (targetPage: number) => {
    const qs = filterQs();
    qs.set("page", String(targetPage));
    return `/workspaces?${qs.toString()}`;
  };
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Workspaces", item: `${BASE_URL}/workspaces` },
    ],
  };
  const itemListJsonLd = {
    "@type": "ItemList",
    name: "Coworking spaces and digital nomad accommodations on RoamIQ",
    numberOfItems: count,
    itemListElement: listings.map((item, index) => {
      const dest = destByCityCountry.get(destKey(item.city, item.country));
      const listItem = workspaceListItemJsonLd(item, index + 1, BASE_URL, dest);
      const visibleTags = usefulTags(item.tags);
      if (visibleTags.length) listItem.keywords = visibleTags.join(", ");
      return listItem;
    }),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd,
      {
        "@type": "CollectionPage",
        name: "Workspaces & Stays | RoamIQ",
        description: "Browse coworking, coliving, workations and cafes for digital nomads. Wi-Fi and prices appear only when the listing database has a real value.",
        url: `${BASE_URL}/workspaces`,
        isPartOf: { "@type": "WebSite", name: "RoamIQ", url: BASE_URL },
        mainEntity: itemListJsonLd,
      },
    ],
  };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">Coworking, coliving & more</div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{headlineCount.toLocaleString()} workspaces & stays, live from the database.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Coworking desks, coliving houses, workations, hostels, cafes, and meeting rooms — filter by location, category, and Wi-Fi speed.{catalogCount > 0 && count !== catalogCount ? ` This view lists ${count.toLocaleString()} matching rows from that catalog.` : ""}</p>
            <div className="mt-6 max-w-xl rounded-2xl border border-border bg-card/80 p-4 sm:p-5">
              <WaitlistInline source="workspaces-list-above-fold" askCity askGap heading={params.search ? `Looking for ${params.search}? Leave an email if this filter is empty or thin.` : "Open a workspace card, or leave an email if you are exiting"} description={params.search ? `This page filtered to “${params.search}” because that name showed up in Search Console. Email is enough if the matching cards are missing a listed price, photo, or Wi-Fi figure — we do not invent those values.` : "This index is a high-exit landing page; individual workspace pages keep people reading. Open a card below for listed photos and about text, or leave an email and optional city if you are leaving. We only write when a listed price or Wi-Fi value exists. No extra page, no invented numbers."} compact context={waitlistContext} />
            </div>
            <IntentListingLinks className="mt-5" />
            <div className="mt-5 max-w-2xl rounded-2xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">How listed prices and Wi-Fi appear</p>
              <p className="mt-1">A card only shows a price or Mbps figure when that value is already stored on the listing. Empty fields stay empty — we do not invent a rate. If you landed here from a price search, filter to rows that already have a figure, or leave an email above and we write when one is added.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/workspaces?priced=1" className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:border-accent hover:text-accent">Show listed prices only</Link>
                <Link href="/workspaces?wifiable=1" className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:border-accent hover:text-accent">Show listed Wi-Fi only</Link>
              </div>
            </div>
            {!params.search && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Names already earning Search clicks</span>
                {GSC_CLICK_QUERIES.map((q) => (
                  <Link
                    key={q}
                    href={`/workspaces?search=${encodeURIComponent(q)}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:border-accent hover:text-accent"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            )}
            <form className="mt-8 flex flex-wrap gap-3" action="/workspaces">
              <input type="text" name="search" defaultValue={params.search ?? ""} placeholder="Search by name..." className="min-w-[200px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              <input type="text" name="city" defaultValue={params.city ?? ""} placeholder="City..." className="w-40 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              <input type="text" name="country" defaultValue={params.country ?? ""} placeholder="Country..." className="w-40 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              <select name="type" defaultValue={params.type ?? ""} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                {types.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select name="min_wifi" defaultValue={params.min_wifi ?? ""} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Any Wi-Fi speed</option>
                <option value="verified">Verified Wi-Fi listed</option>
              </select>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="described" value="1" defaultChecked={params.described === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has description
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="priced" value="1" defaultChecked={params.priced === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed price
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="photographed" value="1" defaultChecked={params.photographed === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has usable photo
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="logoed" value="1" defaultChecked={params.logoed === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed logo
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="website" value="1" defaultChecked={params.website === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has official site
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="social" value="1" defaultChecked={params.social === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed social
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="reviewed" value="1" defaultChecked={params.reviewed === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed reviews
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="phoned" value="1" defaultChecked={params.phoned === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed phone
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="emailed" value="1" defaultChecked={params.emailed === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed email
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="sized" value="1" defaultChecked={params.sized === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed capacity
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="united" value="1" defaultChecked={params.united === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed units
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="complete" value="1" defaultChecked={params.complete === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Photo + description + price
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="tagged" value="1" defaultChecked={params.tagged === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed tags
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="titled" value="1" defaultChecked={params.titled === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed subtitle
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="regioned" value="1" defaultChecked={params.regioned === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed region
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="continented" value="1" defaultChecked={params.continented === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed continent
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="wifiable" value="1" defaultChecked={params.wifiable === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed Wi-Fi speed
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="contactable" value="1" defaultChecked={params.contactable === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed contact
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="hours" value="1" defaultChecked={params.hours === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed hours
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="addressed" value="1" defaultChecked={params.addressed === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has street address
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="mapped" value="1" defaultChecked={params.mapped === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has map link
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="coordinated" value="1" defaultChecked={params.coordinated === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed coordinates
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="producted" value="1" defaultChecked={params.producted === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed plan name
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="hosted" value="1" defaultChecked={params.hosted === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed host
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="included" value="1" defaultChecked={params.included === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed inclusions
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="serviced" value="1" defaultChecked={params.serviced === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Listed services
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="legal" value="1" defaultChecked={params.legal === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Listed legal name
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <input type="checkbox" name="equipped" value="1" defaultChecked={params.equipped === "1"} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                Has listed amenities
              </label>
              <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Search</button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Jump to</span>
              <Link
                href={`/workspaces?${filterQs({ described: params.described === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.described === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has description
              </Link>
              <Link
                href={`/workspaces?${filterQs({ priced: params.priced === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.priced === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed price
              </Link>
              <Link
                href={`/workspaces?${filterQs({ photographed: params.photographed === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.photographed === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has usable photo
              </Link>
              <Link
                href={`/workspaces?${filterQs({ logoed: params.logoed === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.logoed === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed logo
              </Link>
              <Link
                href={`/workspaces?${filterQs({ website: params.website === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.website === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has official site
              </Link>
              <Link
                href={`/workspaces?${filterQs({ social: params.social === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.social === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed social
              </Link>
              <Link
                href={`/workspaces?${filterQs({ reviewed: params.reviewed === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.reviewed === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed reviews
              </Link>
              <Link
                href={`/workspaces?${filterQs({ phoned: params.phoned === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.phoned === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed phone
              </Link>
              <Link
                href={`/workspaces?${filterQs({ emailed: params.emailed === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.emailed === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed email
              </Link>
              <Link
                href={`/workspaces?${filterQs({ sized: params.sized === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.sized === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed capacity
              </Link>
              <Link
                href={`/workspaces?${filterQs({ united: params.united === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.united === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed units
              </Link>
              <Link
                href={`/workspaces?${filterQs({ complete: params.complete === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.complete === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Photo + description + price
              </Link>
              <Link
                href={`/workspaces?${filterQs({ tagged: params.tagged === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.tagged === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed tags
              </Link>
              <Link
                href={`/workspaces?${filterQs({ titled: params.titled === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.titled === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed subtitle
              </Link>
              <Link
                href={`/workspaces?${filterQs({ regioned: params.regioned === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.regioned === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed region
              </Link>
              <Link
                href={`/workspaces?${filterQs({ continented: params.continented === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.continented === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed continent
              </Link>
              <Link
                href={`/workspaces?${filterQs({ wifiable: params.wifiable === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.wifiable === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed Wi-Fi speed
              </Link>
              <Link
                href={`/workspaces?${filterQs({ contactable: params.contactable === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.contactable === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed contact
              </Link>
              <Link
                href={`/workspaces?${filterQs({ hours: params.hours === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.hours === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed hours
              </Link>
              <Link
                href={`/workspaces?${filterQs({ addressed: params.addressed === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.addressed === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has street address
              </Link>
              <Link
                href={`/workspaces?${filterQs({ mapped: params.mapped === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.mapped === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has map link
              </Link>
              <Link
                href={`/workspaces?${filterQs({ coordinated: params.coordinated === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.coordinated === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed coordinates
              </Link>
              <Link
                href={`/workspaces?${filterQs({ producted: params.producted === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.producted === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed plan name
              </Link>
              <Link
                href={`/workspaces?${filterQs({ hosted: params.hosted === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.hosted === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed host
              </Link>
              <Link
                href={`/workspaces?${filterQs({ included: params.included === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.included === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed inclusions
              </Link>
              <Link
                href={`/workspaces?${filterQs({ serviced: params.serviced === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.serviced === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed services
              </Link>
              <Link
                href={`/workspaces?${filterQs({ legal: params.legal === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.legal === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed legal name
              </Link>
              <Link
                href={`/workspaces?${filterQs({ equipped: params.equipped === "1" ? null : "1", page: null }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${params.equipped === "1" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
              >
                Has listed amenities
              </Link>
              {types.filter((t) => t.value).map((t) => {
                const active = params.type === t.value;
                return (
                  <Link
                    key={t.value}
                    href={`/workspaces?type=${encodeURIComponent(t.value)}`}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
                  >
                    {t.label}
                  </Link>
                );
              })}
              {Array.from(new Set(listings.map((l) => l.city).filter((c): c is string => Boolean(c && c.trim())))).slice(0, 8).map((city) => {
                const active = (params.city ?? "").toLowerCase() === city.toLowerCase();
                return (
                  <Link
                    key={city}
                    href={`/workspaces?city=${encodeURIComponent(city)}`}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
                  >
                    {city}
                  </Link>
                );
              })}
              {Array.from(new Set(listings.map((l) => l.country).filter((c): c is string => Boolean(c && c.trim())))).slice(0, 6).map((country) => {
                const active = (params.country ?? "").toLowerCase() === country.toLowerCase();
                return (
                  <Link
                    key={`country-${country}`}
                    href={`/workspaces?country=${encodeURIComponent(country)}`}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"}`}
                  >
                    {country}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No listings match those filters. Try a different city or type, or drop the description / listed-price / contact filters.</p>
                <Link href="/workspaces?contactable=1" className="text-sm font-medium text-accent hover:underline">
                  Browse listings that already show a site, phone, or email
                </Link>
                <div className="mt-2 w-full max-w-md text-left">
                  <WaitlistInline
                    source="workspaces-list-empty"
                    askCity
                    heading="Want this search when a match exists?"
                    description="Leave an email and optional city if you want a shortlist once a listing in this place has a written description. We do not invent missing copy."
                    compact
                    context={waitlistContext}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.slice(0, 6).map((l) => (
                    <ListingCard key={l.id} listing={l} destination={destByCityCountry.get(destKey(l.city, l.country))} />
                  ))}
                </div>
                {listings.length > 6 && (
                  <div className="my-8 rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
                    <WaitlistInline source="workspaces-list-mid-grid" askCity askGap heading="Still scanning cards? Leave a city and email" description="If you are about to leave this index, drop an email and optional city. We send matching workspaces when price or Wi-Fi is listed — we do not invent missing numbers." compact context={waitlistContext} />
                  </div>
                )}
                {listings.length > 6 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.slice(6).map((l) => (
                      <ListingCard key={l.id} listing={l} destination={destByCityCountry.get(destKey(l.city, l.country))} />
                    ))}
                  </div>
                )}
                <div className="mt-10 rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
                  <WaitlistInline source="workspaces-list-after-pagination" askCity askGap heading="Reached the end of this page?" description="Pagination is a common exit. Leave an email and optional city if you want a shortlist of listings that already show a price or Wi-Fi figure. No invented numbers." compact context={waitlistContext} />
                </div>
                <div className="mt-12 flex items-center justify-between">
                  {page > 1 ? (
                    <Link href={buildHref(page - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"><ArrowLeft className="h-4 w-4" /> Previous</Link>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages.toLocaleString()}</span>
                  {page < totalPages ? (
                    <Link href={buildHref(page + 1)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">Next <ArrowRight className="h-4 w-4" /></Link>
                  ) : (
                    <span />
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <section id="waitlist" className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">Open a listing card first — then leave an email if you still need a shortlist</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Workspace detail pages are where listed photos, about text, and contact fields live. If the index is enough, email plus an optional city is fine. We only follow up when a listed price or Wi-Fi value exists. No fabricated urgency, no spam.</p>
          </div>
          <WaitlistInline source="workspaces-list" askCity askGap heading="Leave with a shortlist, not a blank tab" description="No extra page. Add a city if filters did not stick. We email picks only when a listed price or Wi-Fi value exists. No fabricated urgency." compact={false} context={waitlistContext} />
        </div>
      </section>
      <WaitlistSticky source="workspaces-list-sticky" context={waitlistContext} />
      <Footer />
    </div>
  );
}
