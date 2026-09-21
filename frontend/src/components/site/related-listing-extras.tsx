import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/supabase";
import {
  firstVenueListingImage,
  isUsableImageUrl,
  listingGalleryImages,
  usefulListingAbout,
} from "@/lib/listing-media";

/** Extra venue photos + longer about for related-city rows. Real URLs only. */
export function RelatedListingExtras({ item }: { item: Listing }) {
  const venueThumb = firstVenueListingImage(item.images);
  const logoThumb = isUsableImageUrl(item.logo_url) ? item.logo_url!.trim() : null;
  const thumb = venueThumb || logoThumb;
  const extraPhotos = listingGalleryImages(item.images, item.logo_url)
    .filter((url) => url !== thumb)
    .slice(0, 3);
  const photoCount = listingGalleryImages(item.images).length;
  const snippet = usefulListingAbout(item.about || item.description, item.company_name, 220);
  return (
    <>
      {snippet ? (
        <p className="mt-0.5 line-clamp-3 text-xs text-foreground/70">{snippet}</p>
      ) : (
        <p className="mt-0.5 text-xs text-muted-foreground">Description pending</p>
      )}
      {extraPhotos.length > 0 ? (
        <div className="mt-1.5 flex items-center gap-1">
          {extraPhotos.map((url) => (
            <Link
              key={url}
              href={`/workspaces/${item.id}`}
              className="relative h-8 w-10 shrink-0 overflow-hidden rounded bg-secondary"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="40px" unoptimized />
            </Link>
          ))}
          {photoCount > 1 ? (
            <span className="text-[10px] font-medium text-muted-foreground">{photoCount} photos</span>
          ) : null}
        </div>
      ) : photoCount > 1 ? (
        <p className="mt-1 text-[10px] font-medium text-muted-foreground">{photoCount} photos on listing</p>
      ) : null}
    </>
  );
}
