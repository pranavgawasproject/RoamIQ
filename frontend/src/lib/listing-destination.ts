import { supabase } from "@/lib/supabase";

/** Match a listing city to a live /destinations/[id] row. No invented slugs. */
export async function getDestinationForListingCity(
  cityName?: string | null,
  country?: string | null,
): Promise<{ id: string; name: string } | null> {
  if (!cityName) return null;
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("id, name, country")
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
    return { id: String(chosen.id), name: String(chosen.name || cityName) };
  } catch {
    return null;
  }
}
