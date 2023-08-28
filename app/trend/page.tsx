"use client";

import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import UserLine from "./components/user-line";
import VisitLines from "./components/visit-lines";
import LanLines from "./components/lan-lines";
import VisitBubble from "./components/visit-bubble";
import BarRace from "./components/bar-race";
import WeeklyCloud from "./components/weekly-cloud";
import WeeklyMap from "./components/time-map";
import { Sidebar } from "./components/sidebar";
import { useState } from "react";

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
  const [focus, setFocus] = useState<number>(0);

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
                <Sidebar
                  className="hidden lg:block"
                  focus={focus}
                  setFocus={setFocus}
                />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="h-full px-4 py-6 lg:px-8">
                    {focus === 0 && <UserLine />}
                    {focus === 0 && <WeeklyMap />}
                    {focus === 1 && <LanLines />}
                    {focus === 1 && <VisitLines />}
                    {focus === 1 && <VisitBubble />}
                    {focus === 2 && <WeeklyCloud />}
                    {focus === 2 && <BarRace />}
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
