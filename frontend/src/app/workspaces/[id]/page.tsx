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
import { supabase, type Listing } from "@/lib/supabase";
import { firstUsableListingImage, isUsableImageUrl, usefulContactEmail, usefulContactPhone, usefulListingAbout, usefulListingInclusions, usefulListingServices, usefulListingTags, usefulListingTitle, usefulListingWebsite, usefulOpenHours, usefulStartingPrice, usefulStreetAddress, usefulWifiSpeed } from "@/lib/listing-media";
import { WorkspaceGallery } from "@/components/site/workspace-gallery";

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

async function getRelatedListings(listing: Listing) {
  if (!listing.city) return [] as Listing[];
  try {
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, company_name, company_type, city, country, starting_price, wifi_speed, images, logo_url, about, description, ratings, website, contact_phone, contact_email"
      )
      .eq("is_public", true)
      .eq("is_active", true)
      .eq("city", listing.city)
      .neq("id", listing.id)
      .order("ratings", { ascending: false, nullsFirst: false })
      .limit(4);

    if (error || !data) return [];
    return data as Listing[];
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

    const location = [
      listing.city,
      listing.state,
      listing.country,
    ]
      .filter(Boolean)
      .join(", ");

    const title = `${listing.company_name}${location ? ` — ${location}` : ""} | RoamIQ Workspaces`;

    const aboutSnippet = usefulListingAbout(listing.about || listing.description, listing.company_name, 140) || "";

    const extras: string[] = [];
    const listedPrice = usefulStartingPrice(listing.starting_price);
    if (listedPrice) extras.push(listedPrice);
    const listedWifiMeta = usefulWifiSpeed(listing.wifi_speed);
    if (listedWifiMeta) extras.push(listedWifiMeta);
    if (listing.company_type) extras.push(String(listing.company_type));

    const description =
      aboutSnippet ||
      `${listing.company_name}${location ? ` in ${location}` : ""} — coworking and workspace details for digital nomads on RoamIQ.${extras.length ? ` ${extras.join(" · ")}.` : ""}`;

    const url = `${BASE_URL}/workspaces/${listing.id}`;
    const image = firstUsableListingImage(listing.images, listing.logo_url) || undefined;

    return {
      title,
      description,
      keywords: [
        listing.company_name,
        `${listing.company_name} wifi speed`,
        `${listing.city || "coworking"} space`,
        `${listing.company_name} ${listing.city || ""}`,
        "digital nomad workspace",
        "roamiq workspace listing",
      ],
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: "RoamIQ",
        type: "article",
        ...(image
          ? { images: [{ url: image, alt: listing.company_name }] }
          : {}),
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

  const images: string[] = Array.from(
    new Set(
      [
        ...(Array.isArray(listing.images) ? listing.images : []),
        listing.logo_url,
      ].filter((u): u is string => isUsableImageUrl(u)).map((u) => u.trim())
    )
  );

  const tags: string[] = usefulListingTags(listing.tags);

  const locationParts = [listing.city, listing.state, listing.country].filter(Boolean);
  const pageUrl = `${BASE_URL}/workspaces/${listing.id}`;
  const primaryImage = images[0] || undefined;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Workspaces",
        item: `${BASE_URL}/workspaces`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.company_name,
        item: pageUrl,
      },
    ],
  };

  const typeKey = String(listing.company_type || "").toLowerCase();
  // schema.org has no CoworkingSpace — use types Google accepts, matching the list page.
  const schemaType =
    typeKey === "cafe" || typeKey === "coffee" || typeKey === "coffee shop"
      ? "CafeOrCoffeeShop"
      : typeKey === "coliving" || typeKey === "hostel" || typeKey === "workation"
      ? "LodgingBusiness"
      : "LocalBusiness";

  // LocalBusiness from real listing fields only — never invent ratings/prices
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
      founder: {
        "@type": "Person",
        name: "Pranav Gawas",
        jobTitle: "Founder & CEO",
      },
    },
  };
  const listedStreet = usefulStreetAddress(listing.address, listing.city, listing.country);
  const listedPhone = usefulContactPhone(listing.contact_phone);
  const listedEmail = usefulContactEmail(listing.contact_email);
  const listedWebsite = usefulListingWebsite(listing.website);
  if (listing.company_type) localBusinessJsonLd.additionalType = String(listing.company_type);
  if (images.length > 1) localBusinessJsonLd.image = images;
  else if (primaryImage) localBusinessJsonLd.image = primaryImage;
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
    localBusinessJsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    };
  }
  if (listing.google_map) {
    localBusinessJsonLd.hasMap = listing.google_map;
  } else if (listing.latitude != null && listing.longitude != null) {
    localBusinessJsonLd.hasMap = `https://maps.google.com/?q=${listing.latitude},${listing.longitude}`;
  }
  const listedPriceRange = usefulStartingPrice(listing.starting_price);
  if (listedPriceRange) {
    localBusinessJsonLd.priceRange = listedPriceRange;
  }
  if (listing.ratings > 0 && listing.total_reviews > 0) {
    localBusinessJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(listing.ratings),
      reviewCount: Number(listing.total_reviews),
    };
  }
  const listedHours = usefulOpenHours(listing.open_hours);
  if (listedHours.length === 1) {
    localBusinessJsonLd.openingHours = listedHours[0];
  } else if (listedHours.length > 1) {
    localBusinessJsonLd.openingHours = listedHours;
  }
  if (listedPhone) {
    localBusinessJsonLd.telephone = listedPhone;
  }
  if (listedEmail) {
    localBusinessJsonLd.email = listedEmail;
  }
  const listedWifi = usefulWifiSpeed(listing.wifi_speed);
  // download/upload/latency columns are populated on every row (bulk templates).
  // Only emit them when wifi_speed itself passed usefulWifiSpeed — same gate as the visible sidebar.
  if (tags.length > 0 || listedWifi) {
    localBusinessJsonLd.amenityFeature = [
      ...(listedWifi
        ? [
            {
              "@type": "LocationFeatureSpecification",
              name: "Wi-Fi Speed",
              value: listedWifi,
            },
          ]
        : []),
      ...tags.map((tag) => ({
        "@type": "LocationFeatureSpecification",
        name: tag,
        value: true,
      })),
    ];
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {/* Back link */}
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to workspaces
          </Link>
        </div>

        {/* Hero image */}
        <section className="mt-6">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <WorkspaceGallery
              images={images}
              alt={listing.company_name}
              typeLabel={listing.company_type}
            />
          </div>
        </section>

        {/* Content */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  {listing.company_name}
                </h1>
                {usefulListingTitle(listing.company_title, listing.company_name) && (
                  <p className="mt-2 text-lg text-muted-foreground">
                    {usefulListingTitle(listing.company_title, listing.company_name)}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {listing.city ? (
                      <Link
                        href={`/workspaces?city=${encodeURIComponent(listing.city)}`}
                        className="hover:text-accent underline-offset-2 hover:underline"
                      >
                        {listing.city}
                      </Link>
                    ) : null}
                    {listing.state ? `, ${listing.state}` : ""}
                    {listing.country ? `, ${listing.country}` : ""}
                  </span>
                  {listing.ratings > 0 && Number(listing.total_reviews) > 0 && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Star className="h-4 w-4 fill-sunset text-sunset" />
                      {Number(listing.ratings).toFixed(1)}
                      <span className="font-normal text-muted-foreground">
                        ({listing.total_reviews} reviews)
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* About — never invent copy; pending state when both fields empty */}
              {usefulListingAbout(listing.about || listing.description, listing.company_name) ? (
                <div>
                  <h2 className="font-serif text-xl font-semibold">About</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/80">
                    {usefulListingAbout(listing.about || listing.description, listing.company_name)}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-5">
                  <h2 className="font-serif text-xl font-semibold">About</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A written description has not been verified for this listing yet.
                    Photos, location, and any listed price or Wi-Fi figures above are
                    from the live database — we do not generate placeholder copy.
                  </p>
                </div>
              )}

              {/* Tags / amenities */}
              {tags.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Amenities</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              {usefulListingInclusions(listing.inclusions) && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Included</h2>
                  <p className="mt-3 leading-relaxed text-foreground/80">
                    {usefulListingInclusions(listing.inclusions)}
                  </p>
                </div>
              )}

              {usefulListingServices(listing.services).length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Services</h2>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/80">
                    {usefulListingServices(listing.services).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {related.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">
                    More workspaces in {listing.city}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Other live listings in the same city — prices and Wi-Fi only when the database has them.
                  </p>
                  <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                    {related.map((item) => {
                      const thumb = firstUsableListingImage(item.images, item.logo_url);
                      const snippet = usefulListingAbout(item.about || item.description, item.company_name, 140);
                      const aboutOk = Boolean(snippet);
                      const relatedWebsite = usefulListingWebsite(item.website);
                      const relatedPhone = usefulContactPhone(item.contact_phone);
                      const relatedEmail = usefulContactEmail(item.contact_email);
                      return (
                      <li key={item.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/workspaces/${item.id}`}
                            className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                          >
                            {thumb ? (
                              <Image
                                src={thumb.trim()}
                                alt={item.company_name}
                                fill
                                className="object-cover"
                                sizes="80px"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Building2 className="h-5 w-5 text-muted-foreground/50" />
                              </div>
                            )}
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={`/workspaces/${item.id}`} className="truncate font-medium hover:text-accent">
                              {item.company_name}
                            </Link>
                            {aboutOk ? (
                              <p className="mt-0.5 line-clamp-2 text-xs text-foreground/70">{snippet}</p>
                            ) : (
                              <p className="mt-0.5 text-xs text-muted-foreground">Description pending</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {item.company_type || "workspace"}
                              {usefulWifiSpeed(item.wifi_speed) ? ` · ${usefulWifiSpeed(item.wifi_speed)}` : " · Wi-Fi speed pending"}
                            </p>
                            {(relatedWebsite || relatedPhone || relatedEmail) && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {relatedWebsite && (
                                  <a
                                    href={relatedWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Official site
                                  </a>
                                )}
                                {relatedPhone && (
                                  <a
                                    href={`tel:${relatedPhone.replace(/[^+\d]/g, "")}`}
                                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
                                  >
                                    <Phone className="h-3 w-3" /> Call
                                  </a>
                                )}
                                {relatedEmail && (
                                  <a
                                    href={`mailto:${relatedEmail}`}
                                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80 hover:border-forest/40 hover:text-forest"
                                  >
                                    <Mail className="h-3 w-3" /> Email
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/workspaces/${item.id}`}
                            className="shrink-0 text-sm text-muted-foreground hover:text-accent"
                          >
                            {usefulStartingPrice(item.starting_price) || "Price not listed yet"}
                          </Link>
                        </div>
                      </li>
                      );
                    })}
                  </ul>
                  <Link
                    href={`/workspaces?city=${encodeURIComponent(listing.city || "")}`}
                    className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    Browse all in {listing.city}
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                {usefulStartingPrice(listing.starting_price) ? (
                  <div className="font-serif text-2xl font-semibold text-forest">
                    {usefulStartingPrice(listing.starting_price)}
                  </div>
                ) : (
                  <div className="font-serif text-lg text-muted-foreground">Price not listed yet</div>
                )}

                <div className="mt-5 space-y-3 text-sm">
                  {usefulWifiSpeed(listing.wifi_speed) ? (
                    <div className="flex flex-col gap-1 text-foreground/80">
                      <div className="flex items-center gap-2.5">
                        <Wifi className="h-4 w-4 text-forest shrink-0" />
                        <span className="font-semibold">{usefulWifiSpeed(listing.wifi_speed)}</span>
                      </div>
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
                      <div className="space-y-0.5">
                        {listedHours.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-muted-foreground/80">
                      <Clock className="h-4 w-4 shrink-0" />
                      Hours not listed yet
                    </div>
                  )}
                  {listing.capacity && (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {listing.capacity}
                    </div>
                  )}
                  {listedStreet && (
                    <div className="flex items-start gap-2.5 text-foreground/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {listedStreet}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact
                  </p>
                  {listedPhone ? (
                    <a
                      href={`tel:${listedPhone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-accent transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{listedPhone}</span>
                    </a>
                  ) : (
                    <p className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                      <Phone className="h-4 w-4 shrink-0" />
                      Phone not listed yet
                    </p>
                  )}
                  {listedEmail ? (
                    <a
                      href={`mailto:${listedEmail}`}
                      className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-accent transition-colors"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="break-all">{listedEmail}</span>
                    </a>
                  ) : (
                    <p className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                      <Mail className="h-4 w-4 shrink-0" />
                      Email not listed yet
                    </p>
                  )}
                </div>

                {listedWebsite && (
                  <a
                    href={listedWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Visit website <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {(listing.google_map || (listing.latitude != null && listing.longitude != null)) && (
                  <a
                    href={
                      listing.google_map ||
                      `https://maps.google.com/?q=${listing.latitude},${listing.longitude}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <Globe className="h-4 w-4" /> View on Google Maps
                  </a>
                )}

                {/* Conversion: on-page waitlist — no extra navigation, no fake urgency */}
                <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
                  <WaitlistInline
                    source="workspace_detail"
                    heading={
                      listing.city
                        ? `Want similar workspaces in ${listing.city}?`
                        : "Want similar workspaces after this listing?"
                    }
                    description={
                      listing.city
                        ? `This page is a common last stop. Leave an email for other live listings in ${listing.city} when a listed price or Wi-Fi value exists. No extra page, no fabricated urgency.`
                        : "This page is a common last stop. Leave an email for similar live listings when a listed price or Wi-Fi value exists. No extra page, no fabricated urgency."
                    }
                    context={{
                      city: listing.city,
                      type: listing.company_type,
                      listing: listing.company_name,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
