import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { supabase, type Listing } from "@/lib/supabase";
import { firstUsableListingImage, usefulListingAbout, usefulStartingPrice, usefulWifiSpeed } from "@/lib/listing-media";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Workspaces & Stays — Coworking, Coliving & Workations | RoamIQ",
  description:
    "Browse coworking desks, coliving houses, workations, hostels, cafes and meeting rooms for digital nomads. Filter by city, type, price and Wi-Fi speed.",
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
    title: "Workspaces & Stays — Coworking, Coliving & Workations | RoamIQ",
    description:
      "Browse coworking desks, coliving houses, workations, hostels, cafes and meeting rooms for digital nomads with verified Wi-Fi speeds.",
    url: `${BASE_URL}/workspaces`,
    siteName: "RoamIQ",
    type: "website",
    images: [{ url: `${BASE_URL}/logo.svg`, width: 512, height: 512, alt: "RoamIQ Workspaces" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workspaces & Stays — Coworking, Coliving & Workations | RoamIQ",
    description:
      "Browse coworking desks, coliving houses, workations, hostels, cafes and meeting rooms for digital nomads with verified Wi-Fi speeds.",
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
  page?: string;
}) {
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  try {
    let query = supabase
      .from("listings")
      .select(
        "id, company_name, company_title, company_type, city, state, country, address, starting_price, wifi_speed, ratings, total_reviews, tags, logo_url, images, about",
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
      query = query.not("about", "is", null).neq("about", "");
    }
    if (params.priced === "1") {
      // Real listed prices only — empty / placeholder rows stay off this view.
      query = query
        .not("starting_price", "is", null)
        .neq("starting_price", "")
        .neq("starting_price", "n/a")
        .neq("starting_price", "N/A")
        .neq("starting_price", "TBD");
    }
    const unfilteredFirstPage =
      page === 1 &&
      !params.search &&
      !params.type &&
      !params.city &&
      !params.country &&
      !params.min_wifi &&
      params.described !== "1" &&
      params.priced !== "1";

    // Page 1 of the unfiltered index is the bounce landing (GA4 ~87.5%).
    // Over-fetch a rated pool and prefer cards that already show a real about
    // snippet or a usable photo — never invent copy, and do not hide the rest
    // of the catalog on later pages.
    const fetchTo = unfilteredFirstPage ? Math.max(to, PAGE_SIZE * 4 - 1) : to;
    const { data, error, count } = await query
      .order("ratings", { ascending: false, nullsFirst: false })
      .range(from, fetchTo);
    if (error) {
      console.error(error);
      return { listings: [] as Listing[], count: 0, page };
    }
    const rows = (data ?? []) as Listing[];
    if (!unfilteredFirstPage) {
      return { listings: rows, count: count ?? 0, page };
    }
    const scored = rows
      .map((listing, index) => {
        let score = 0;
        if (usefulListingAbout(listing.about, listing.company_name)) score += 100;
        if (firstUsableListingImage(listing.images, listing.logo_url)) score += 20;
        if (usefulStartingPrice(listing.starting_price)) score += 10;
        if (usefulWifiSpeed(listing.wifi_speed)) score += 10;
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

function getCardImage(listing: Listing): string | null {
  return firstUsableListingImage(listing.images, listing.logo_url);
}

function usefulAboutSnippet(about: string | null | undefined, companyName?: string | null): string | null {
  return usefulListingAbout(about, companyName, 180);
}


function usefulTitle(title: string | null | undefined, companyName?: string | null): string | null {
  if (!title) return null;
  const cleaned = title.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const name = (companyName || "").replace(/\s+/g, " ").trim();
  if (name && cleaned.toLowerCase() === name.toLowerCase()) return null;
  return cleaned;
}

function usefulTags(tags: string[] | null | undefined): string[] {
  if (!Array.isArray(tags)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    if (typeof raw !== "string") continue;
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (cleaned.length < 2 || cleaned.length > 32) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    if (/https?:\/\//i.test(cleaned)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= 4) break;
  }
  return out;
}

function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl = getCardImage(listing);
  const reviewCount = Number(listing.total_reviews ?? 0);
  const ratingValue = Number(listing.ratings ?? 0);
  const showRating = ratingValue > 0 && reviewCount > 0;
  const visibleTags = usefulTags(listing.tags);
  const typeHref = listing.company_type ? `/workspaces?type=${encodeURIComponent(listing.company_type)}` : null;
  const cityHref = listing.city ? `/workspaces?city=${encodeURIComponent(listing.city)}` : null;
  const countryHref = listing.country ? `/workspaces?country=${encodeURIComponent(listing.country)}` : null;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-forest/5 hover:-translate-y-0.5">
      <Link href={`/workspaces/${listing.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image src={imageUrl} alt={listing.company_name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Photo pending</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {typeHref && (
          <div className="mb-2">
            <Link href={typeHref} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 hover:bg-accent/15 hover:text-accent">
              {listing.company_type}
            </Link>
          </div>
        )}
        <h3 className="font-serif text-lg font-semibold tracking-tight line-clamp-1">
          <Link href={`/workspaces/${listing.id}`} className="hover:text-accent transition-colors">{listing.company_name}</Link>
        </h3>
        {usefulTitle(listing.company_title, listing.company_name) && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{usefulTitle(listing.company_title, listing.company_name)}</p>}
        {(() => {
          const aboutSnippet = usefulAboutSnippet(listing.about, listing.company_name);
          const addressSnippet = (listing.address || "").replace(/\s+/g, " ").trim();
          if (aboutSnippet) {
            return <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{aboutSnippet}</p>;
          }
          if (addressSnippet.length >= 8) {
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
        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-foreground/70">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {cityHref ? (
              <Link href={cityHref} className="hover:text-accent hover:underline underline-offset-2">{listing.city}</Link>
            ) : (
              listing.city
            )}
            {listing.country ? (
              <>
                {listing.city ? ", " : ""}
                {countryHref ? (
                  <Link href={countryHref} className="hover:text-accent hover:underline underline-offset-2">{listing.country}</Link>
                ) : (
                  listing.country
                )}
              </>
            ) : null}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            {usefulStartingPrice(listing.starting_price) ? (
              <div className="font-serif text-lg font-semibold text-forest">{usefulStartingPrice(listing.starting_price)}</div>
            ) : (
              <div className="text-sm text-muted-foreground">Price not listed yet</div>
            )}
            {usefulWifiSpeed(listing.wifi_speed) ? (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Wifi className="h-3 w-3" /> {usefulWifiSpeed(listing.wifi_speed)}</div>
            ) : (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/70"><Wifi className="h-3 w-3" /> Wi-Fi speed pending</div>
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
  searchParams: Promise<{ search?: string; type?: string; city?: string; country?: string; min_wifi?: string; described?: string; priced?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { listings, count, page } = await getListings(params);
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
      const imageUrl = getCardImage(item);
      const aboutSnippet = usefulAboutSnippet(item.about, item.company_name);
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
      // Only fields already visible on the card — never invent prices, wifi, or copy.
      if (aboutSnippet) place.description = aboutSnippet;
      if (imageUrl) place.image = imageUrl;
      if (item.city || item.country) {
        place.address = {
          "@type": "PostalAddress",
          ...(item.city ? { addressLocality: item.city } : {}),
          ...(item.country ? { addressCountry: item.country } : {}),
        };
      }
      const listedPrice = usefulStartingPrice(item.starting_price);
      if (listedPrice) place.priceRange = listedPrice;
      const listedWifi = usefulWifiSpeed(item.wifi_speed);
      if (listedWifi) {
        place.amenityFeature = [
          { "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi },
        ];
      }
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
        ...(usefulTags(item.tags).length ? { keywords: usefulTags(item.tags).join(", ") } : {}),
      };
    }),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd,
      {
        "@type": "CollectionPage",
        name: "Workspaces & Stays | RoamIQ",
        description: "Browse coworking, coliving, workations and cafes for digital nomads with verified Wi-Fi speeds.",
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
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{count.toLocaleString()} workspaces & stays, live from the database.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Coworking desks, coliving houses, workations, hostels, cafes, and meeting rooms — filter by location, category, and Wi-Fi speed.</p>
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
            <div className="mt-8 max-w-xl rounded-2xl border border-border bg-card/80 p-4 sm:p-5">
              <WaitlistInline source="workspaces-list-above-fold" heading="Get a shortlist for this search instead of bouncing" description="This index is long. If you already know the city or type you need, leave an email — we only write when a listed price or Wi-Fi value matches. No extra page." compact />
            </div>
          </div>
        </section>
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No listings match those filters. Try a different city or type, or drop the description / listed-price filters.</p>
                <Link href="/workspaces?described=1" className="text-sm font-medium text-accent hover:underline">
                  Browse listings that already have a written description
                </Link>
                <div className="mt-2 w-full max-w-md text-left">
                  <WaitlistInline
                    source="workspaces-list-empty"
                    heading="Want this search when a match exists?"
                    description="Leave an email if you want a shortlist once a listing in this city or type has a written description. We do not invent missing copy."
                    compact
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.slice(0, 6).map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
                {listings.length > 6 && (
                  <div className="my-8 rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
                    <WaitlistInline source="workspaces-list-mid-grid" heading="Still scanning cards? Grab a shortlist" description="If you are about to leave, drop an email here. We send matching workspaces when price or Wi-Fi is listed — we do not invent missing numbers." compact />
                  </div>
                )}
                {listings.length > 6 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.slice(6).map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                )}
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
            <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">Found a workspace you like — or still deciding where to go?</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Leave your email on this page. We send destination shortlists matched to budget, visa window, and listed Wi-Fi speeds. No fabricated urgency, no spam.</p>
          </div>
          <WaitlistInline source="workspaces-list" heading="Leave with a shortlist, not a blank tab" description="No extra page. We email city and workspace picks only when listed price or Wi-Fi exists. No fabricated urgency." compact={false} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
