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
  "tripadvisor",
  "unbiased reviews of",
  "how the site works",
  "accessibility statement",
  "google translate",
  "copy link",
  "web series",
  "km from city centre",
  "km from city center",
  "indicative rates:",
  "check the timetables",
  "train ticket to paris",
  "fully leased for next year",
  "latest from our blog",
  "потеряшки",
  "забывают драгоценные вещи",
];

/**
 * Keep venue-written copy only. Scraped nav chrome, encyclopedia blurbs,
 * OTA/review-site chrome, YouTube descriptions, and contact-dump pages are not a listing description.
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
  const emailHits = lower.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g) || [];
  if (emailHits.length >= 2) return null;
  if (/\b\d{1,3}(,\d{3})+\s+views\b/i.test(cleaned)) return null;
  if (/ranked\s+#\d+/i.test(cleaned)) return null;
  if (maxLen > 0) return cleaned.slice(0, maxLen);
  return cleaned;
}

/**
 * Show a listed price only when it is more than a placeholder.
 * Values like "$1" / "0" are treated as missing — never invent a replacement.
 */
export function usefulStartingPrice(price: string | number | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  const cleaned = String(price).replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();
  if (["n/a", "na", "tbd", "null", "undefined", "-", "—", "none"].includes(lower)) return null;
  const numeric = cleaned.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  if (numeric) {
    const amount = Number.parseFloat(numeric);
    if (Number.isFinite(amount) && amount < 2) return null;
  }
  return cleaned;
}

/** Mass-generated wifi labels that are not venue-reported measurements. */
const TEMPLATED_WIFI =
  /^\d+(\.\d+)?\s*mbps\s+(free wi-?fi|nomad wi-?fi|dedicated line|high-speed wi-?fi|dedicated fiber|high-speed fiber)$/i;

/**
 * Show a listed Wi-Fi speed only when it includes a real measurement.
 * "Free Wi-Fi", "0 Mbps", "N/A", empty strings, and bulk template labels
 * (e.g. "180 Mbps Free Wi-Fi" repeated across thousands of rows) are treated
 * as missing. Never invent a replacement speed.
 */
export function usefulWifiSpeed(speed: string | number | null | undefined): string | null {
  if (speed === null || speed === undefined) return null;
  const cleaned = String(speed).replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();
  if (["n/a", "na", "tbd", "null", "undefined", "-", "—", "none", "pending", "unknown"].includes(lower)) return null;
  if (/^(free\s*)?(wi-?fi|internet|wlan)$/i.test(cleaned)) return null;
  if (TEMPLATED_WIFI.test(cleaned)) return null;
  const numeric = cleaned.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  if (!numeric) return null;
  const amount = Number.parseFloat(numeric);
  if (!Number.isFinite(amount) || amount < 1) return null;
  return cleaned;
}

/**
 * download_speed_mbps / upload_speed_mbps / latency_ms are filled on every
 * listings row by the same bulk factory as templated wifi_speed labels.
 * They are not venue-reported measurements. Always return null so callers
 * show a pending state instead of publishing invented split speeds.
 */
export function usefulDirectionalMbps(_value: string | number | null | undefined): null {
  return null;
}
