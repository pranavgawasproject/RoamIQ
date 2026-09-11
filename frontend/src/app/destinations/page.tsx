import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CityCard } from "@/components/site/city-card";
import { supabase, type City } from "@/lib/supabase";
import { Compass, ArrowLeftRight } from "lucide-react";
import { WaitlistInline } from "@/components/site/waitlist-inline";
import { WaitlistSticky } from "@/components/site/waitlist-sticky";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Digital Nomad Destinations \u2014 Cost, Visa & Internet Scores | RoamIQ",
  description:
    "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty. Filter by continent and budget. Plan your next workation on RoamIQ.",
  keywords: [
    "digital nomad destinations",
    "best cities for remote work",
    "cost of living nomad cities",
    "digital nomad visa cities",
    "workation destinations",
    "nomad city ranking",
  ],
  alternates: {
    canonical: `${BASE_URL}/destinations`,
  },
  openGraph: {
    title: "Digital Nomad Destinations \u2014 Cost, Visa & Internet Scores | RoamIQ",
    description:
      "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty. Filter by continent and budget.",
    url: `${BASE_URL}/destinations`,
    siteName: "RoamIQ",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/logo.svg`,
        width: 512,
        height: 512,
        alt: "RoamIQ digital nomad destinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Nomad Destinations \u2014 Cost, Visa & Internet Scores | RoamIQ",
    description:
      "Ranked digital nomad cities by cost, internet, safety and visa difficulty.",
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

export const revalidate = 300;

const continents = ["All", "Asia", "Europe", "South America", "Africa", "North America"];
const sorts = [
  { value: "overall_score", label: "Top rated" },
  { value: "cost_usd_asc", label: "Cheapest" },
  { value: "internet_mbps", label: "Fastest internet" },
];

async function getCities(params: {
  search?: string;
  continent?: string;
  sort?: string;
}) {
  try {
    let query = supabase.from("cities").select("*");

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,country.ilike.%${params.search}%`
      );
    }
    if (params.continent && params.continent !== "All") {
      query = query.eq("continent", params.continent);
    }

    if (params.sort === "cost_usd_asc") {
      query = query.order("cost_usd", { ascending: true });
    } else if (params.sort === "internet_mbps") {
      query = query.order("internet_mbps", { ascending: false });
    } else {
      query = query.order("overall_score", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }
    return data as City[];
  } catch (error) {
    console.error("Error in getCities:", error);
    return [];
  }
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; continent?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const cities = await getCities(params);

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: `${BASE_URL}/destinations`,
      },
    ],
  };

  const itemListJsonLd = {
    "@type": "ItemList",
    name: "Digital nomad destinations on RoamIQ",
    numberOfItems: cities.length,
    itemListElement: cities.slice(0, 50).map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${city.name}, ${city.country}`,
      url: `${BASE_URL}/destinations/${city.id}`,
      item: {
        "@type": "Place",
        name: city.name,
        url: `${BASE_URL}/destinations/${city.id}`,
        additionalProperty: [
          ...(city.cost_usd != null
            ? [{ "@type": "PropertyValue", name: "Monthly cost USD", value: String(city.cost_usd) }]
            : []),
          ...(city.one_bed_rent_usd
            ? [{ "@type": "PropertyValue", name: "One-bed rent USD", value: String(city.one_bed_rent_usd) }]
            : []),
          ...(city.coworking_desk_usd
            ? [{ "@type": "PropertyValue", name: "Coworking desk USD", value: String(city.coworking_desk_usd) }]
            : []),
          ...((city.wifi_speed_p90 || city.internet_mbps)
            ? [{
                "@type": "PropertyValue",
                name: "Internet Mbps",
                value: String(city.wifi_speed_p90 || city.internet_mbps),
              }]
            : []),
          ...(city.visa_difficulty
            ? [{ "@type": "PropertyValue", name: "Visa difficulty", value: String(city.visa_difficulty) }]
            : []),
          ...(city.overall_score != null
            ? [{ "@type": "PropertyValue", name: "Overall score", value: Number(city.overall_score).toFixed(1) }]
            : []),
          ...(city.safety_score != null
            ? [{ "@type": "PropertyValue", name: "Safety score", value: Number(city.safety_score).toFixed(1) }]
            : []),
          ...(city.fun_score != null
            ? [{ "@type": "PropertyValue", name: "Fun score", value: Number(city.fun_score).toFixed(1) }]
            : []),
          ...(city.walkability_score != null
            ? [{ "@type": "PropertyValue", name: "Walkability score", value: Number(city.walkability_score).toFixed(1) }]
            : []),
          ...(city.nightlife_score != null
            ? [{ "@type": "PropertyValue", name: "Nightlife score", value: Number(city.nightlife_score).toFixed(1) }]
            : []),
          ...(city.air_score != null
            ? [{ "@type": "PropertyValue", name: "Air quality score", value: Number(city.air_score).toFixed(1) }]
            : []),
          ...(city.english_proficiency
            ? [{ "@type": "PropertyValue", name: "English proficiency", value: String(city.english_proficiency) }]
            : []),
          ...(city.quality_of_life_score != null
            ? [{ "@type": "PropertyValue", name: "Quality of life score", value: Number(city.quality_of_life_score).toFixed(1) }]
            : []),
        ],
      },
    })),
  };

  const collectionJsonLd = {
    "@type": "CollectionPage",
    name: "Destinations for Digital Nomads | RoamIQ",
    description:
      "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty.",
    url: `${BASE_URL}/destinations`,
    isPartOf: { "@type": "WebSite", name: "RoamIQ", url: BASE_URL },
    mainEntity: itemListJsonLd,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, collectionJsonLd],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Live from the database
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {cities.length} destinations, ranked by real cost & lifestyle data.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every score here is pulled straight from RoamIQ&apos;s database \u2014
              cost of living, internet speed, safety, and visa difficulty,
              side by side.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/destinations/compare"
                className="inline-flex items-center gap-2 rounded-full border border-forest/30 bg-forest/10 px-4 py-2 text-xs font-semibold text-forest hover:bg-forest/20 transition-colors"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Side-by-Side City Cost Comparator \u2192
              </Link>
            </div>

            <form className="mt-8 flex flex-wrap gap-3" action="/destinations">
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search city or country\u2026"
                className="min-w-[220px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                name="continent"
                defaultValue={params.continent ?? "All"}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {continents.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                name="sort"
                defaultValue={params.sort ?? "overall_score"}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sorts.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Filter
              </button>
            </form>
            <div className="mt-8 max-w-xl rounded-2xl border border-border bg-card/80 p-4 sm:p-5">
              <WaitlistInline
                source="destinations-list-after-filters"
                heading="Want a city shortlist instead of bouncing?"
                description="This index is a scan. Leave an email if you already know budget or visa window \u2014 we only write when a listed city score exists. No fabricated urgency."
                compact
              />
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {cities.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                <Compass className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No cities match those filters. Try clearing search or continent.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WaitlistSticky
        source="destinations-list-sticky"
        heading="Leaving the destination index?"
        description="These city pages are often a last stop. Email plus an optional city is enough. We only write when a listed city score or workspace already exists."
      />
    </div>
  );
}
