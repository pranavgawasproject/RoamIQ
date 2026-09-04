import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import {
  firstUsableListingImage,
  usefulListingAbout,
} from "@/lib/listing-media";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

/** Fallback city IDs when Supabase is unavailable at sitemap generation time.
 *  Keeps destination detail URLs discoverable for Google even if the DB call fails.
 *  Slugs must match live /destinations/[id] routes (hyphenated). */
const FALLBACK_CITY_IDS = [
  "bangkok",
  "lisbon",
  "bali",
  "medellin",
  "berlin",
  "tokyo",
  "chiangmai",
  "chiang-mai",
  "barcelona",
  "mexicocity",
  "mexico-city",
  "budapest",
  "dubai",
  "tbilisi",
  "da-nang",
  "buenos-aires",
  "cape-town",
  "valencia",
  "tallinn",
  "prague",
  "taipei",
  "kuala-lumpur",
  "split",
  "florianopolis",
  "florence",
  "athens",
  "san-jose",
  "st-julians",
  "grand-baie",
  "bansko",
  "las-palmas",
  "playa-del-carmen",
  "fukuoka",
  "rome",
  "dubrovnik",
  "santiago",
  "willemstad",
  "st-georges",
  "ljubljana",
  "kotor",
  "puebla",
  "penang",
  "seoul",
  "porto",
  "funchal",
  "panama-city",
  "ho-chi-minh-city",
  "montevideo",
  "tenerife",
  "langkawi",
  "krakow",
  "osaka",
  "puerto-vallarta",
  "belgrade",
  "sofia",
  "riga",
  "vilnius",
  "quito",
  "antigua",
  "kyoto",
  "plovdiv",
  "valletta",
  "cebu",
  "santo-domingo",
  "andorra-la-vella",
  "bratislava",
  "cartagena",
  "palma",
  "cuenca",
  "larnaca",
  "mendoza",
  "bari",
  "varna",
  "da-lat",
  "alicante",
  "chiang-rai",
  "arequipa",
  "nha-trang",
  "innsbruck",
  "heraklion",
  "merida",
  "phuket",
  "oaxaca",
  "tirana",
  "fethiye",
  "jeju",
  "goa",
  "hoi-an",
  "budva",
  "nicosia",
  "brasov",
  "sarajevo",
  "pristina",
  "siargao",
  "dahab",
  "pai",
  "cusco",
  "batumi",
  "san-cristobal",
  "poprad",
  "lake-atitlan",
  "salento",
  "mostar",
  "santa-marta",
  "bariloche",
  "luang-prabang",
  "pokhara",
  "kandy",
  "salvador",
  "ohrid",
  "taghazout",
  "siem-reap",
  "baguio",
  "huaraz",
  "la-paz",
  "bishkek",
  "valparaiso",
  "zadar",
  "auckland",
  "granada",
  "bregenz",
  "wellington",
  "lille",
  "san-sebastian",
  "inverness",
  "guanajuato",
  "nantes",
  "coimbra",
  "bologna",
  "ghent",
  "turin",
  "braga",
  "marseille",
  "verona",
  "pilsen",
  "tivat",
  "maribor",
  "szeged",
  "kosice",
  "debrecen",
  "timisoara",
  "subotica",
  "sibiu",
  "oradea",
  "pecs",
  "banska-bystrica",
  "gyor",
  "koper",
  "trnava",
  "alba-iulia",
  "liberec",
  "parnu",
  "nitra",
  "constanta",
  "opava",
  "tartu",
  "presov",
  "arad",
  "ostrava",
  "craiova",
  "zlin",
  "siauliai",
  "seychelles",
  "st-kitts-nevis",
  "dominica",
  "saint-lucia",
  "antigua",
  "bahamas",
  "cape-verde",
  "saint-vincent",
  "st-vincent",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/about",
    "/community",
    "/destinations",
    "/destinations/compare",
    "/pricing",
    "/visa",
    "/workspaces",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  let cityIds: string[] = [];
  try {
    const { data: cities } = await supabase
      .from("cities")
      .select("id")
      .order("overall_score", { ascending: false });

    if (cities && cities.length > 0) {
      cityIds = cities.map((city) => city.id);
    }
  } catch (error) {
    console.error("Sitemap: failed to fetch cities", error);
  }

  if (cityIds.length === 0) {
    cityIds = [...FALLBACK_CITY_IDS];
  }

  const cityEntries: MetadataRoute.Sitemap = cityIds.map((id) => ({
    url: `${BASE_URL}/destinations/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Include only listing URLs that already render visible depth on the page.
  // Same helpers as the UI: reject scrape-junk about and wallpaper photos.
  // Cap so crawl budget stays on destinations + static routes.
  let workspaceEntries: MetadataRoute.Sitemap = [];
  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("id, company_name, about, description, images, logo_url, ratings")
      .eq("is_public", true)
      .eq("is_active", true)
      .not("about", "is", null)
      .order("ratings", { ascending: false, nullsFirst: false })
      .limit(500);

    if (listings && listings.length > 0) {
      // About + a usable photo are the fields the detail page actually renders.
      // Do not require wifi_speed: that column is almost entirely bulk templates
      // and usefulWifiSpeed rejects them, which previously emptied this list.
      const verifiedListings = listings.filter((l) => {
        const about = usefulListingAbout(l.about || l.description, l.company_name);
        const photo = firstUsableListingImage(l.images, l.logo_url);
        return Boolean(about && photo);
      });
      workspaceEntries = verifiedListings.slice(0, 80).map((l) => ({
        url: `${BASE_URL}/workspaces/${l.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap: failed to fetch workspace listings", error);
  }

  // Intentionally omit query-string comparison URLs (?cityA=&cityB=) from the sitemap.
  // Google treats many of these as non-canonical / parameter URLs and they were
  // contributing to the single GSC sitemap error. The clean /destinations/compare
  // route remains indexed; users still reach specific pairs via UI and internal links.

  return [...staticEntries, ...cityEntries, ...workspaceEntries];
}
