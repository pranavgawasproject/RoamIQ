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

const ABOUT_NOISE = [
  "skip to content",
  "sign in",
  "official white house",
  "official seal of",
  "official site of",
  "wayback machine",
  "stock market",
  "cookie policy",
  "privacy policy",
  "all rights reserved",
  "download the app",
  "subscribe to newsletter",
  "wikipedia",
  "an article in new york times",
  "an article in the new york times",
];

/**
 * Keep venue-written copy only. Scraped nav chrome, encyclopedia blurbs,
 * and government-seal pages are not a listing description.
 * Never invent replacement text — callers should show a pending state.
 */
export function usefulListingAbout(
  about: string | null | undefined,
  companyName?: string | null,
  maxLen = 0
): string | null {
  if (!about) return null;
  const cleaned = about.replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return null;
  const lower = cleaned.toLowerCase();
  const name = (companyName || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (name && (lower === name || lower === `${name}.`)) return null;
  if (ABOUT_NOISE.some((n) => lower.includes(n))) return null;
  if (maxLen > 0) return cleaned.slice(0, maxLen);
  return cleaned;
}
