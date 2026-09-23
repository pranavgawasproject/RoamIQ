import {
  firstVenueListingImage,
  listingGalleryImages,
  isUsableImageUrl,
  usefulContactEmail,
  usefulContactPhone,
  usefulListingAbout,
  usefulListingWebsite,
  usefulOpenHours,
  usefulStartingPrice,
  usefulListedPrice,
  usefulListingUnits,
  usefulStreetAddress,
  usefulListingRegion,
  usefulWifiSpeed,
  usefulListingMapUrl,
  usefulListingTags,
  usefulListingSocialLinks,
  usefulListingInclusions,
  usefulListingServices,
  usefulListingContinent,
  usefulListingCapacity,
  usefulListingTitle,
  usefulListingProductName,
  usefulListingContactPerson,
  usefulListingRegisteredEntity,
} from "@/lib/listing-media";

type ListingLike = {
  id: string;
  company_name: string;
  company_title?: string | null;
  company_type?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  starting_price?: string | null;
  cost?: string | null;
  units?: string | null;
  capacity?: string | null;
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
  google_map?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  tags?: string[] | null;
  social_links?: Record<string, string> | null;
  inclusions?: string | null;
  services?: string | null;
  continent?: string | null;
  product_name?: string | null;
  contact_name?: string | null;
  contact_designation?: string | null;
  registered_entity_name?: string | null;
};

export type ListingJsonLdDestination = {
  id: string;
  name: string;
  visa_difficulty?: string | null;
  safety_score?: number | null;
  walkability_score?: number | null;
  coworking_desk_usd?: number | null;
  one_bed_rent_usd?: number | null;
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
  destination?: ListingJsonLdDestination | null,
): Record<string, unknown> {
  const aboutSnippet = usefulListingAbout(listing.about || listing.description, listing.company_name, 180);
  const photoUrl = firstVenueListingImage(listing.images);
  const logoUrl = isUsableImageUrl(listing.logo_url) ? listing.logo_url!.trim() : null;
  const imageUrl = photoUrl || logoUrl;
  // Cards already render extra venue photos; only repeat those URLs in schema.
  const galleryImages = listingGalleryImages(listing.images, listing.logo_url).slice(0, 4);
  const schemaImages = galleryImages.length > 1 ? galleryImages : imageUrl ? [imageUrl] : [];
  const place: Record<string, unknown> = {
    "@type": listingSchemaType(listing.company_type),
    "@id": `${baseUrl}/workspaces/${listing.id}#place`,
    name: listing.company_name,
    url: `${baseUrl}/workspaces/${listing.id}`,
  };
  const listedTitle = usefulListingTitle(listing.company_title, listing.company_name);
  if (listedTitle) place.alternateName = listedTitle;
  const listedLegal = usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name);
  if (listedLegal) place.legalName = listedLegal;
  if (aboutSnippet) place.description = aboutSnippet;
  if (schemaImages.length > 1) place.image = schemaImages;
  else if (schemaImages.length === 1) place.image = schemaImages[0];
  if (logoUrl) place.logo = logoUrl;
  const street = usefulStreetAddress(listing.address, listing.city, listing.country);
  const region = usefulListingRegion(listing.state, listing.city);
  if (street || listing.city || region || listing.country) {
    place.address = {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      ...(listing.city ? { addressLocality: listing.city } : {}),
      ...(region ? { addressRegion: region } : {}),
      ...(listing.country ? { addressCountry: listing.country } : {}),
    };
  }
  const continent = usefulListingContinent(listing.continent);
  if (continent) {
    place.containedInPlace = { "@type": "Place", name: continent };
  }
  const listedPrice = usefulListedPrice(listing.starting_price, listing.cost);
  const listedUnits = usefulListingUnits(listing.units);
  const listedCapacity = usefulListingCapacity(listing.capacity);
  const capacityNumber = listedCapacity ? (() => { const m = listedCapacity.match(/(\d{1,5})/); return m ? Number(m[1]) : null; })() : null;
  if (capacityNumber && Number.isFinite(capacityNumber) && capacityNumber > 0) {
    place.maximumAttendeeCapacity = capacityNumber;
  }
  if (listedPrice) {
    place.priceRange = listedUnits ? `${listedPrice} ${listedUnits}` : listedPrice;
    place.makesOffer = {
      "@type": "Offer",
      url: `${baseUrl}/workspaces/${listing.id}`,
      priceSpecification: {
        "@type": "PriceSpecification",
        description: listedPrice,
        ...(listedUnits ? { unitText: listedUnits } : {}),
      },
    };
  }
  const listedWifi = usefulWifiSpeed(listing.wifi_speed);
  const visibleTags = usefulListingTags(listing.tags);
  const listedInclusions = usefulListingInclusions(listing.inclusions);
  const listedServices = usefulListingServices(listing.services);
  const amenityFeature = [
    ...(listedWifi ? [{ "@type": "LocationFeatureSpecification", name: "Wi-Fi Speed", value: listedWifi }] : []),
    ...visibleTags.map((tag) => ({ "@type": "LocationFeatureSpecification", name: tag, value: true })),
    ...(listedInclusions ? [{ "@type": "LocationFeatureSpecification", name: "Included", value: listedInclusions }] : []),
    ...listedServices.map((item) => ({ "@type": "LocationFeatureSpecification", name: item, value: true })),
  ];
  if (amenityFeature.length) place.amenityFeature = amenityFeature;
  if (visibleTags.length) place.keywords = visibleTags.join(", ");
  const listedPlan = usefulListingProductName(listing.product_name, listing.company_name);
  const listedHost = usefulListingContactPerson(listing.contact_name, listing.contact_designation);
  if (listedPlan) {
    const props = Array.isArray(place.additionalProperty) ? place.additionalProperty : [];
    props.push({ "@type": "PropertyValue", name: "Listed plan", value: listedPlan });
    place.additionalProperty = props;
  }
  if (listedHost) {
    place.employee = { "@type": "Person", name: listedHost };
  }
  const listedHours = usefulOpenHours(listing.open_hours);
  if (listedHours.length === 1) place.openingHours = listedHours[0];
  else if (listedHours.length > 1) place.openingHours = listedHours;
  const listedPhone = usefulContactPhone(listing.contact_phone);
  const listedEmail = usefulContactEmail(listing.contact_email);
  const listedWebsite = usefulListingWebsite(listing.website);
  if (listedPhone) place.telephone = listedPhone;
  if (listedEmail) place.email = listedEmail;
  const listedSocial = usefulListingSocialLinks(listing.social_links);
  const sameAs = [...(listedWebsite ? [listedWebsite] : []), ...listedSocial.map((s) => s.url)];
  if (sameAs.length) place.sameAs = sameAs;
  if (listedPhone || listedEmail) {
    place.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(listedPhone ? { telephone: listedPhone } : {}),
      ...(listedEmail ? { email: listedEmail } : {}),
    };
  }
  const mapUrl = usefulListingMapUrl(listing.google_map, listing.latitude, listing.longitude);
  if (mapUrl) place.hasMap = mapUrl;
  if (
    typeof listing.latitude === "number" &&
    Number.isFinite(listing.latitude) &&
    typeof listing.longitude === "number" &&
    Number.isFinite(listing.longitude)
  ) {
    place.geo = { "@type": "GeoCoordinates", latitude: listing.latitude, longitude: listing.longitude };
  }
  const ratingValue = Number(listing.ratings);
  const reviewCount = Number(listing.total_reviews);
  if (ratingValue > 0 && reviewCount > 0) {
    place.aggregateRating = { "@type": "AggregateRating", ratingValue, reviewCount };
  }
  if (destination?.id) {
    const cityProps = [
      destination.visa_difficulty ? { "@type": "PropertyValue", name: "Visa difficulty", value: destination.visa_difficulty } : null,
      destination.safety_score != null ? { "@type": "PropertyValue", name: "Safety score", value: Number(destination.safety_score).toFixed(1) } : null,
      destination.walkability_score != null ? { "@type": "PropertyValue", name: "Walkability score", value: Number(destination.walkability_score).toFixed(1) } : null,
      destination.coworking_desk_usd != null ? { "@type": "PropertyValue", name: "City coworking desk (USD/mo)", value: destination.coworking_desk_usd } : null,
      destination.one_bed_rent_usd != null ? { "@type": "PropertyValue", name: "City 1-bed rent (USD/mo)", value: destination.one_bed_rent_usd } : null,
    ].filter(Boolean);
    const cityPlace = {
      "@type": "City",
      "@id": `${baseUrl}/destinations/${destination.id}#city`,
      name: destination.name,
      url: `${baseUrl}/destinations/${destination.id}`,
      ...(cityProps.length ? { additionalProperty: cityProps } : {}),
    };
    place.containedInPlace = cityPlace;
    place.areaServed = cityPlace;
  }
  const item: Record<string, unknown> = {
    "@type": "ListItem",
    position,
    name: listing.company_name,
    url: `${baseUrl}/workspaces/${listing.id}`,
    item: place,
  };
  if (aboutSnippet) item.description = aboutSnippet;
  if (schemaImages.length > 1) item.image = schemaImages;
  else if (schemaImages.length === 1) item.image = schemaImages[0];
  return item;
}

export function workspaceFaqJsonLd(
  listing: ListingLike,
  baseUrl: string,
): Record<string, unknown> | null {
  const name = listing.company_name;
  const cityCountry = [listing.city, listing.country].filter(Boolean).join(", ");
  const about = usefulListingAbout(listing.about || listing.description, name, 280);
  const price = usefulListedPrice(listing.starting_price, listing.cost);
  const wifi = usefulWifiSpeed(listing.wifi_speed);
  const hours = usefulOpenHours(listing.open_hours);
  const website = usefulListingWebsite(listing.website);
  const phone = usefulContactPhone(listing.contact_phone);
  const email = usefulContactEmail(listing.contact_email);
  const capacity = usefulListingCapacity(listing.capacity);
  const units = usefulListingUnits(listing.units);
  const title = usefulListingTitle(listing.company_title, listing.company_name);
  const mainEntity: Record<string, unknown>[] = [];
  if (title) {
    mainEntity.push({
      "@type": "Question",
      name: `What is the listed title for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: title },
    });
  }
  const legal = usefulListingRegisteredEntity(listing.registered_entity_name, listing.company_name);
  if (legal) {
    mainEntity.push({
      "@type": "Question",
      name: `What is the listed legal name for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: legal },
    });
  }
  const plan = usefulListingProductName(listing.product_name, listing.company_name);
  if (plan) {
    mainEntity.push({
      "@type": "Question",
      name: `What plan is listed for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: plan },
    });
  }
  const host = usefulListingContactPerson(listing.contact_name, listing.contact_designation);
  if (host) {
    mainEntity.push({
      "@type": "Question",
      name: `Who is the listed host for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: host },
    });
  }
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
      acceptedAnswer: {
        "@type": "Answer",
        text: units ? `Listed starting price: ${price} (${units}).` : `Listed starting price: ${price}.`,
      },
    });
  }
  if (units && !price) {
    mainEntity.push({
      "@type": "Question",
      name: `What unit type is listed for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: units },
    });
  }
  if (wifi) {
    mainEntity.push({
      "@type": "Question",
      name: `What Wi-Fi speed is listed for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: wifi },
    });
  }
  if (capacity) {
    mainEntity.push({
      "@type": "Question",
      name: `What capacity is listed for ${name}?`,
      acceptedAnswer: { "@type": "Answer", text: capacity },
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
