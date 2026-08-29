export function isUsableImageUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return false;

  let host = "";
  try {
    host = new URL(trimmed).hostname.toLowerCase();
  } catch {
    return false;
  }

  // Venue photos only. Wallpaper / clip-art / video thumbs are stored on some rows
  // (e.g. wallpapers.com Disney art on Izzy's Coffee) and must not represent the place.
  const blockedExact = new Set([
    "wallpapers.com",
    "www.wallpapers.com",
    "wallpaperaccess.com",
    "www.wallpaperaccess.com",
    "images.alphacoders.com",
    "wallpapercave.com",
    "www.wallpapercave.com",
    "i.ytimg.com",
    "img.youtube.com",
    "tiktok.com",
    "www.tiktok.com",
  ]);
  if (blockedExact.has(host)) return false;
  if (host.endsWith(".tiktokcdn.com") || host.endsWith(".tiktok.com")) return false;
  if (host.includes("wallpaper")) return false;

  const path = trimmed.toLowerCase();
  if (/(disney|mickey-mouse|cartoon-wallpaper|4k-ultra-wide)/i.test(path)) return false;

  return true;
}

export function firstUsableListingImage(
  images: string[] | null | undefined,
  logoUrl?: string | null
): string | null {
  if (Array.isArray(images)) {
    for (const raw of images) {
      if (isUsableImageUrl(raw)) return raw.trim();
    }
  }
  if (isUsableImageUrl(logoUrl)) return logoUrl.trim();
  return null;
}
