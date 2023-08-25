"use client";

import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import VisitLines from "./components/visit-lines";
import LanLines from "./components/lan-lines";
import VisitBubble from "./components/visit-bubble";
import { Sidebar } from "./components/sidebar";
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
          <div className="border-t">
            <div className="bg-background">
              <div className="grid grid-cols-3 lg:grid-cols-5">
                <Sidebar className="hidden lg:block" />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="h-full px-4 py-6 lg:px-8">
                    <VisitLines />
                    <LanLines />
                    <VisitBubble />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
