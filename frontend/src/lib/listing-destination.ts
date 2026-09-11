import { supabase } from "@/lib/supabase";

export type ListingDestinationMatch = {
  id: string;
  name: string;
  country?: string | null;
  internet_mbps?: number | null;
  wifi_speed_p90?: number | null;
  cost_usd?: number | null;
};

function asFiniteNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Match a listing city to a live /destinations/[id] row. No invented slugs. */
export async function getDestinationForListingCity(
  cityName?: string | null,
  country?: string | null,
): Promise<ListingDestinationMatch | null> {
  if (!cityName) return null;
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("id, name, country, internet_mbps, wifi_speed_p90, cost_usd")
      .ilike("name", cityName)
      .limit(8);
    if (error || !data?.length) return null;
    const needle = cityName.trim().toLowerCase();
    const countryNeedle = (country || "").trim().toLowerCase();
    const exact = data.filter((row) => String(row.name || "").trim().toLowerCase() === needle);
    const pool = exact.length ? exact : data;
    const countryMatch = countryNeedle
      ? pool.find((row) => String(row.country || "").trim().toLowerCase() === countryNeedle)
      : undefined;
    const chosen = countryMatch || pool[0];
    if (!chosen?.id) return null;
    return {
      id: String(chosen.id),
      name: String(chosen.name || cityName),
      country: chosen.country ? String(chosen.country) : null,
      internet_mbps: asFiniteNumber(chosen.internet_mbps),
      wifi_speed_p90: asFiniteNumber(chosen.wifi_speed_p90),
      cost_usd: asFiniteNumber(chosen.cost_usd),
    };
  } catch {
    return null;
  }
}
