"use client";

import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import VisitLines from "./components/visit-lines";

// import GeoPie from "./components/geo-pie";
// import FourMetrics from "./components/four-metrics";

function getFormattedLocation(
  city: string | undefined,
  country: string | undefined,
  continent: string | undefined
) {
  if (city === "All Cities") {
    if (country === "All Countries") {
      if (continent === "All Continents") {
        return { title: "Worldwide", desc: null };
      } else {
        return { title: continent, desc: null };
      }
    } else {
      return { title: country, desc: `${continent} > ${country}` };
    }
  } else {
    return { title: country, desc: `${continent} > ${country}` };
  }
}

export default function TrendPage() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { continent, country, city } = geoFilter || {};
  const { title, desc } = getFormattedLocation(city, country, continent);

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-start justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground my-2">{desc}</p>
            </div>
          </div>
          <VisitLines />
        </div>
      </div>
    </>
  );
}
