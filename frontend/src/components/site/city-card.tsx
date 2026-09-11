import Link from "next/link";
import { Star, Wifi, ArrowUpRight } from "lucide-react";
import type { City } from "@/lib/supabase";
import { cityPhotos, cityGradient } from "@/lib/city-images";
import { cn } from "@/lib/utils";

export function CityCard({ city }: { city: City }) {
  const photo = city.image || cityPhotos[city.id];
  const [gradient, gradientText] = cityGradient(city.id);

  return (
    <Link
      href={`/destinations/${city.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${photo}')` }}
            aria-hidden
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 grid place-items-center bg-gradient-to-br",
              gradient
            )}
            aria-hidden
          >
            <span className="text-7xl opacity-90">{city.flag}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            Visa: {city.visa_difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-sunset text-sunset" />
            {Number(city.overall_score).toFixed(1)}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">
              {city.flag} {city.name}
            </h3>
            <span className="text-xs font-medium text-amber-200">
              {city.country}
            </span>
          </div>

          {(city.safety_score != null ||
            city.fun_score != null ||
            city.walkability_score != null ||
            city.nightlife_score != null ||
            city.air_score != null ||
            city.avg_temp != null ||
            Boolean(city.air_quality) ||
            Boolean(city.english_proficiency) ||
            city.quality_of_life_score != null) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {city.safety_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Safety {Number(city.safety_score).toFixed(1)}
                </span>
              )}
              {city.fun_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Fun {Number(city.fun_score).toFixed(1)}
                </span>
              )}
              {city.walkability_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Walk {Number(city.walkability_score).toFixed(1)}
                </span>
              )}
              {city.nightlife_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Nightlife {Number(city.nightlife_score).toFixed(1)}
                </span>
              )}
              {city.air_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Air {Number(city.air_score).toFixed(1)}
                </span>
              )}
              {city.avg_temp != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  {Number(city.avg_temp).toFixed(0)}°C avg
                </span>
              )}
              {city.air_quality ? (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  Air {city.air_quality}
                </span>
              ) : null}
              {city.english_proficiency ? (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  English {city.english_proficiency}
                </span>
              ) : null}
              {city.quality_of_life_score != null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  QoL {Number(city.quality_of_life_score).toFixed(1)}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/60">
                Cost / mo
              </div>
              <div className="font-serif text-xl font-semibold">
                ${city.cost_usd.toLocaleString()}
              </div>
              {city.one_bed_rent_usd && (
                <div className="text-[10px] font-medium text-white/75">
                  1-Bed: ${city.one_bed_rent_usd}/mo
                </div>
              )}
              {city.meal_price_usd != null && (
                <div className="text-[10px] font-medium text-white/75">
                  Meal: ${Number(city.meal_price_usd).toFixed(0)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-white/60">
                <Wifi className="h-3 w-3" /> Internet
              </div>
              <div className="font-serif text-xl font-semibold">
                {city.wifi_speed_p90 ? `${city.wifi_speed_p90} Mbps` : `${city.internet_mbps} Mbps`}
              </div>
              {city.coworking_desk_usd && (
                <div className="text-[10px] font-medium text-white/75">
                  Desk: ${city.coworking_desk_usd}/mo
                </div>
              )}
              {city.coffee_price_usd != null && (
                <div className="text-[10px] font-medium text-white/75">
                  Coffee: ${Number(city.coffee_price_usd).toFixed(2)}
                </div>
              )}
              {city.mobile_data_cost_gb != null && (
                <div className="text-[10px] font-medium text-white/75">
                  Data: ${Number(city.mobile_data_cost_gb).toFixed(2)}/GB
                </div>
              )}
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all group-hover:bg-accent group-hover:text-accent-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
