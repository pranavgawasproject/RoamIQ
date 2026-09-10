import {
  firstVenueListingImage,
  isUsableImageUrl,
  usefulContactEmail,
  usefulContactPhone,
  usefulListingAbout,
  usefulListingWebsite,
  usefulOpenHours,
  usefulStartingPrice,
  usefulStreetAddress,
  usefulWifiSpeed,
} from "@/lib/listing-media";

type ListingLike = {
  id: string;
  company_name: string;
  company_type?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  starting_price?: string | null;
  wifi_speed?: string | null;
  open_hours?: string | null;
  ratings?: number | string | null;
  total_reviews?: number | string | null;
  images?: string[] | null;
  logo_url?: string | null;
  about?: string | null;
  description?: string | null;
  website?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
};

function listingSchemaType(companyType?: string | null): "LodgingBusiness" | "CafeOrCoffeeShop" | "LocalBusiness" {
  if (companyType === "coliving" || companyType === "hostel" || companyType === "workation") {
    return "LodgingBusiness";
  }
  if (companyType === "cafe") return "CafeOrCoffeeShop";
  return "LocalBusiness";
}

/** JSON-LD ListItem that only repeats fields already shown on listing cards. */
export function workspaceListItemJsonLd(
  listing: ListingLike,
  position: number,
  baseUrl: string,
): Record<string, unknown> {
  const aboutSnippet = usefulListingAbout(listing.about || listing.description, listing.company_name, 180);
  // Cards render venue photos, never logos, in the hero. Schema must match visible media.
  const imageUrl = firstVenueListingImage(listing.images);
  const logoUrl = isUsableImageUrl(listing.logo_url) ? listing.logo_url!.trim() : null;
  const place: Record<string, unknown> = {
    "@type": listingSchemaType(listing.company_type),
    "@id": `${baseUrl}/workspaces/${listing.id}#place`,
    name: listing.company_name,
    url: `${baseUrl}/workspaces/${listing.id}`,
  };
  if (aboutSnippet) place.description = aboutSnippet;
  if (imageUrl) place.image = imageUrl;
  if (logoUrl) place.logo = logoUrl;
  const street = usefulStreetAddress(listing.address, listing.city, listing.country);
  if (street || listing.city || listing.state || listing.country) {
    place.address = {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      ...(listing.city ? { addressLocality: listing.city } : {}),
      ...(listing.state ? { addressRegion: listing.state } : {}),
      ...(listing.country ? { addressCountry: listing.country } : {}),
    };
  }
  const listedPrice = usefulStartingPrice(listing.starting_price);
  if (listedPrice) {
    place.priceRange = listedPrice;
    place.makesOffer = {
      "@type": "Offer",
      url: `${baseUrl}/workspaces/${listing.id}`,
      priceSpecification: { "@type": "PriceSpecification", description: listedPrice },
    };
  }
  const listedWifi = usefulWifiSpeed(listing.wifi_speed);
  if (listedWifi) {
    place.amenityFeature = [
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi },
    ];
  }
  const listedHours = usefulOpenHours(listing.open_hours);
  if (listedHours.length === 1) place.openingHours = listedHours[0];
  else if (listedHours.length > 1) place.openingHours = listedHours;
  const listedPhone = usefulContactPhone(listing.contact_phone);
  const listedEmail = usefulContactEmail(listing.contact_email);
  const listedWebsite = usefulListingWebsite(listing.website);
  if (listedPhone) place.telephone = listedPhone;
  if (listedEmail) place.email = listedEmail;
  if (listedWebsite) place.sameAs = [listedWebsite];
  const ratingValue = Number(listing.ratings);
  const reviewCount = Number(listing.total_reviews);
  if (ratingValue > 0 && reviewCount > 0) {
    place.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    };
  }
  const item: Record<string, unknown> = {
    "@type": "ListItem",
    position,
    name: listing.company_name,
    url: `${baseUrl}/workspaces/${listing.id}`,
    item: place,
  };
  if (aboutSnippet) item.description = aboutSnippet;
  if (imageUrl) item.image = imageUrl;
  return item;
}

/**
 * FAQPage JSON-LD built only from fields already rendered on the listing page.
 * Skip questions when the matching UI shows a pending/empty state.
 */
export function workspaceFaqJsonLd(
  listing: ListingLike,
  baseUrl: string,
): Record<string, unknown> | null {
  const name = listing.company_name;
  const cityCountry = [listing.city, listing.country].filter(Boolean).join(", ");
  const about = usefulListingAbout(listing.about || listing.description, name, 280);
  const price = usefulStartingPrice(listing.starting_price);
  const wifi = usefulWifiSpeed(listing.wifi_speed);
  const hours = usefulOpenHours(listing.open_hours);
  const website = usefulListingWebsite(listing.website);
  const phone = usefulContactPhone(listing.contact_phone);
  const email = usefulContactEmail(listing.contact_email);

  const mainEntity: Record<string, unknown>[] = [];
  if (about) {
    mainEntity.push({
      "@type": "Question",
      name: `What is ${name}${cityCountry ? ` in ${cityCountry}` : ""}?`,
      acceptedAnswer: { "@type": "Answer", text: about },
    });
  }
  if (price) {
    mainEntity.push({
      "@type": "Question",
      name: `How much does ${name} cost?`,
      acceptedAnswer: { "@type": "Answer", text: `Listed starting price: ${price}.` },
    });
  }
  if (wifi) {
    mainEntity.push({
      "@type": "Question",
      name: `What Wi-Fi speed is listed for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: wifi },
    });
  }
  if (hours.length > 0) {
    mainEntity.push({
      "@type": "Question",
      name: `What are the listed hours for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: hours.join("; ") },
    });
  }
  const contactBits = [
    website ? `Official site: ${website}` : null,
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
  ].filter(Boolean);
  if (contactBits.length) {
    mainEntity.push({
      "@type": "Question",
      name: `How do I contact ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: contactBits.join(". ") + "." },
    });
  }

  if (mainEntity.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${baseUrl}/workspaces/${listing.id}`,
    mainEntity,
  };
}
