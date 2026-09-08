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
  usefulOpenHours, usefulStreetAddress, usefulWifiSpeed,
} from "@/lib/listing-media";
import { getDestinationForListingCity } from "@/lib/listing-destination";

function getCardImage(listing: Listing): { url: string; kind: "photo" | "logo" } | null {
  const photo = firstVenueListingImage(listing.images);
  if (photo) return { url: photo, kind: "photo" };
  if (isUsableImageUrl(listing.logo_url)) return { url: listing.logo_url!.trim(), kind: "logo" };
  return null;
}
