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
