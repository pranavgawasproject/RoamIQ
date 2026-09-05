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
  // Favicons, 1x1 trackers, and generic placeholders load as a blank hero.
  if (/(favicon|apple-touch-icon|android-chrome|mstile|safari-pinned|1x1|pixel\.gif|spacer\.(gif|png)|placeholder|blank\.(png|gif|jpg|jpeg|webp)|default-image)/i.test(path)) return false;

  return true;
}

/** Venue photos only. Tiny logos stay usable as a last-resort card thumb via firstUsableListingImage. */
export function isVenuePhotoUrl(url: string | null | undefined): url is string {
  if (!isUsableImageUrl(url)) return false;
  const path = url.trim().toLowerCase();
  if (/(^|\/)(logo|icon|icons|brand)(\/|_|-|\.)/i.test(path)) return false;
  if (/logo/i.test(path) && !/(photo|gallery|image|img|media)/i.test(path)) return false;
  return true;
}

export function listingGalleryImages(
  images: string[] | null | undefined,
  logoUrl?: string | null
): string[] {
  const photos: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string | null | undefined, photoOnly: boolean) => {
    if (!raw) return;
    const trimmed = raw.trim();
    if (seen.has(trimmed)) return;
    if (photoOnly ? !isVenuePhotoUrl(trimmed) : !isUsableImageUrl(trimmed)) return;
    seen.add(trimmed);
    photos.push(trimmed);
  };
  if (Array.isArray(images)) {
    for (const raw of images) push(raw, true);
  }
  if (!photos.length) push(logoUrl, false);
  return photos;
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
  "site logo",
  "site photo",
  "contact us today",
  "after booking, all of the property",
  "a valid credit card is required",
  "free cancellation",
  "we're currently refreshing our website",
  "vat number",
  "owned by",
  "join today",
  "view on google maps",
  "search all coworking",
];

/**
 * Keep venue-written copy only. Scraped nav chrome, encyclopedia blurbs,
 * OTA/review-site chrome, YouTube descriptions, and contact-dump pages are not a listing description.
 * Never invent replacement text — callers should show a pending state.
 */
function isNoisyAboutChunk(chunk: string): boolean {
  const lower = chunk.toLowerCase();
  if (ABOUT_NOISE.some((n) => lower.includes(n))) return true;
  if (/\b\d{1,3}(,\d{3})+\s+views\b/i.test(chunk)) return true;
  if (/ranked\s+#\d+/i.test(chunk)) return true;
  if (/\b\d+\s+reviews?\b/i.test(lower) && /rating\s*:/i.test(lower)) return true;
  const emailHits = lower.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g) || [];
  if (emailHits.length >= 2) return true;
  if (/\b(tel|phone|whatsapp)\b/i.test(lower) && emailHits.length >= 1) return true;
  return false;
}

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
  const sentences = cleaned.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length >= 40);
  const picked: string[] = [];
  for (const sentence of sentences.length ? sentences : [cleaned]) {
    if (isNoisyAboutChunk(sentence)) continue;
    picked.push(sentence);
    const joined = picked.join(" ");
    if (maxLen > 0 && joined.length >= maxLen) break;
    if (maxLen === 0 && picked.length >= 2) break;
  }
  if (!picked.length) return null;
  const visible = picked.join(" ");
  if (maxLen > 0) return visible.slice(0, maxLen);
  return visible;
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

/**
 * Show a street address only when it is more specific than city/country.
 * City-name-only rows (e.g. "San José Province") stay hidden — never invent a street.
 */
export function usefulStreetAddress(
  address: string | null | undefined,
  city?: string | null,
  country?: string | null
): string | null {
  if (!address) return null;
  const cleaned = String(address).replace(/\s+/g, " ").trim();
  if (cleaned.length < 8) return null;
  const lower = cleaned.toLowerCase();
  if (["n/a", "na", "tbd", "null", "undefined", "-", "—", "none", "unknown"].includes(lower)) return null;
  const cityNorm = (city || "").replace(/\s+/g, " ").trim().toLowerCase();
  const countryNorm = (country || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (cityNorm && (lower === cityNorm || lower === `${cityNorm},`)) return null;
  if (countryNorm && lower === countryNorm) return null;
  if (cityNorm && countryNorm && (lower === `${cityNorm}, ${countryNorm}` || lower === `${cityNorm} ${countryNorm}`)) return null;
  return cleaned;
}

/**
 * Show a phone only when it looks like a reachable number.
 * Registry IDs, truncated fragments, and all-zero strings stay pending.
 * Never invent a replacement number.
 */
export function usefulContactPhone(phone: string | null | undefined): string | null {
  if (!phone || typeof phone !== "string") return null;
  const cleaned = phone.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();
  if (["n/a", "na", "tbd", "null", "undefined", "-", "—", "none", "pending"].includes(lower)) return null;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  if (/^0+$/.test(digits)) return null;
  if (/^0{3,}/.test(digits)) return null;
  return cleaned;
}

/**
 * Show an email only when it is a single well-formed address.
 * Never invent a replacement inbox.
 */
export function usefulContactEmail(email: string | null | undefined): string | null {
  if (!email || typeof email !== "string") return null;
  const cleaned = email.replace(/\s+/g, "").trim();
  if (!cleaned) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleaned)) return null;
  return cleaned;
}

/**
 * Official venue site only. Social video URLs are not a booking/contact page.
 */
export function usefulListingWebsite(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) return null;
  let host = "";
  try {
    host = new URL(cleaned).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (
    host === "tiktok.com" ||
    host.endsWith(".tiktok.com") ||
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "youtu.be" ||
    host === "i.ytimg.com"
  ) {
    return null;
  }
  return cleaned;
}

/**
 * open_hours is stored as a JSON object on most filled rows
 * (e.g. {"typical": "Mon-Fri 07:00-19:00"}). Render those keys as labels;
 * never invent hours. Raw JSON dumped into the sidebar is not usable.
 */
export function usefulOpenHours(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== "string") return [];
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const lower = cleaned.toLowerCase();
  if (["n/a", "na", "tbd", "null", "undefined", "-", "—", "none", "pending", "unknown"].includes(lower)) {
    return [];
  }

  const looksLikeHours = (value: string) => {
    const v = value.replace(/\s+/g, " ").trim();
    if (v.length < 4 || v.length > 120) return false;
    return /(\d{1,2}[:.]\d{2}|\d{1,2}\s*(am|pm)|24\s*\/?\s*7|closed|by appointment)/i.test(v);
  };

  const labelize = (key: string) =>
    key.replace(/[_-]+/g, " ").replace(/\w/g, (c) => c.toUpperCase()).trim();

  const tryParse = (text: string): unknown => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const parsed = cleaned.startsWith("{") || cleaned.startsWith("[") ? tryParse(cleaned) : null;

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value !== "string") continue;
      if (!looksLikeHours(value)) continue;
      const label = labelize(key);
      lines.push(label && label.toLowerCase() !== "typical" ? `${label}: ${value.trim()}` : value.trim());
    }
    return lines.slice(0, 6);
  }

  if (Array.isArray(parsed)) {
    return parsed
      .filter((item): item is string => typeof item === "string" && looksLikeHours(item))
      .map((item) => item.replace(/\s+/g, " ").trim())
      .slice(0, 6);
  }

  if (looksLikeHours(cleaned) && !cleaned.startsWith("{")) {
    return [cleaned];
  }
  return [];
}

/**
 * services is a JSON array string on a handful of rows. Show only real strings.
 * Never invent amenities.
 */
export function usefulListingServices(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== "string") return [];
  const cleaned = raw.trim();
  if (!cleaned) return [];
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 3 && item.length <= 140)
    .filter((item) => {
      const key = item.toLowerCase();
      if (/24\s*\/?\s*7/.test(key) && /access/.test(key)) return false;
      if (/standing\s*desk/.test(key)) return false;
      return true;
    })
    .slice(0, 12);
}

/**
 * has_24_7_access / has_standing_desks default TRUE on every listings row
 * (schema DEFAULT true + bulk factory). They are not venue-reported amenities.
 * Always return false so callers omit the badges instead of claiming them.
 */
export function usefulVenueAmenityFlag(_value: boolean | null | undefined): false {
  return false;
}

const TYPE_OR_FACTORY_TAGS = new Set([
  "coworking",
  "coliving",
  "workation",
  "hostel",
  "cafe",
  "coffee",
  "coffee shop",
  "meetingroom",
  "meeting room",
  "workspace",
  "24/7",
  "24/7 access",
  "24-7 access",
  "standing desk",
  "standing desks",
  "site logo",
]);

/**
 * Tags shown as amenities. Drops category labels and factory 24/7 / standing-desk
 * strings that are not venue-reported. Never invents replacements.
 */
export function usefulListingTags(tags: string[] | null | undefined): string[] {
  if (!Array.isArray(tags)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    if (typeof raw !== "string") continue;
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (cleaned.length < 2 || cleaned.length > 32) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    if (/https?:\/\//i.test(cleaned)) continue;
    if (TYPE_OR_FACTORY_TAGS.has(key)) continue;
    if (/24\s*\/?\s*7/.test(key) && /access/.test(key)) continue;
    if (/standing\s*desk/.test(key)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= 6) break;
  }
  return out;
}
