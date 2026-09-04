import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { DestinationsPreview } from "@/components/site/destinations-preview";
import { WorkspacesPreview } from "@/components/site/workspaces-preview";
import { WhyRoamIQ } from "@/components/site/why-roamiq";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";
import { WaitlistInline } from "@/components/site/waitlist-inline";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  // Absolute title (not template) for brand query "roamiq" CTR
  title: {
    absolute: "RoamIQ — Digital Nomad Visa, Cost of Living & Coworking Guides",
  },
  description:
    "RoamIQ helps digital nomads compare visa rules, monthly living costs, Wi-Fi speeds, and vetted coworking in 200+ cities. Free to browse — no signup required.",
  alternates: {
    canonical: BASE_URL, // primary host; secondary vercel host stays live (no 301)
  },
  openGraph: {
    title: "RoamIQ — Digital Nomad Visa, Cost of Living & Coworking Guides",
    description:
      "Plan your next workation with RoamIQ: visa intelligence, cost of living, and coworking spaces for digital nomads — free to browse.",
    url: BASE_URL,
    siteName: "RoamIQ",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/logo.svg`,
        width: 512,
        height: 512,
        alt: "RoamIQ — digital nomad operating system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoamIQ — Digital Nomad Visa, Cost of Living & Coworking Guides",
    description:
      "Compare visa rules, costs, Wi-Fi, and coworking with RoamIQ — built for digital nomads.",
    creator: "@pranavgawas",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "RoamIQ",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
      description:
        "AI-powered platform for digital nomads: visa intelligence, city cost data, vetted workspaces, and community.",
      founder: {
        "@type": "Person",
        name: "Pranav Gawas",
        jobTitle: "Founder & CEO",
        url: "https://github.com/Pranavgawas",
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#ceo`,
      name: "Pranav Gawas",
      jobTitle: "Founder & Chief Executive Officer",
      worksFor: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
      },
      sameAs: ["https://github.com/Pranavgawas"],
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#cto`,
      name: "RoamIQ Tech Leadership",
      jobTitle: "Chief Technology Officer & Lead AI Architect",
      worksFor: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
      },
    },
    {
      "@type": "WebSite",
      name: "RoamIQ",
      url: BASE_URL,
      description:
        "The operating system for digital nomads — discover cities, compare costs, find workspaces, and plan workations.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/destinations?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is RoamIQ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RoamIQ is an all-in-one platform for digital nomads with AI-powered visa intelligence, city cost and lifestyle data, workspace listings, workation planning, and community — so remote workers do not need a dozen tabs to research a move.",
          },
        },
        {
          "@type": "Question",
          name: "Can I browse destinations and visas without signing up?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Destinations, visa lookup for many countries, and public workspace listings are free to browse with no signup required during public beta.",
          },
        },
        {
          "@type": "Question",
          name: "What data appears on each destination page?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each destination page shows cost-of-living breakdowns, internet and lifestyle scores, visa difficulty, and related coworking or coliving workspaces for that city so you can compare locations before you go.",
          },
        },
        {
          "@type": "Question",
          name: "Does RoamIQ include digital nomad visa information?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. RoamIQ includes visa lookup and related intelligence for many countries so you can check stay duration, difficulty, and remote-work considerations before planning a workation.",
          },
        },
        {
          "@type": "Question",
          name: "Are workspace listings free to browse?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Public workspace listings (coworking and coliving) are available on the Workspaces section. You can open individual listing pages for location, Wi-Fi, pricing when provided, and other details published by the space.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <WaitlistInline
              source="homepage_after_hero"
              askCity
              heading="Leaving after the homepage? Send the city you are considering."
              description="Most sessions start and end here. Email is enough; add a city if you have one. We only write when a listed workspace description, price, or photo exists for that place. No extra page, no fabricated urgency."
            />
          </div>
        </section>
        <Features />
        <DestinationsPreview />
        <WorkspacesPreview />
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <WaitlistInline
              source="homepage_after_workspaces_preview"
              askCity
              heading="Scanned the preview cards and still leaving?"
              description="The homepage is the highest-exit landing page. Leave an email and optional city so a shortlist can follow — only for listings that already have a description, price, or photo."
            />
          </div>
        </section>
        <WhyRoamIQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
