"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";

import GeoPie from "./components/geo-pie";
import FourMetrics from "./components/four-metrics";

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
    return { title: city, desc: `${continent} > ${country} > ${city}` };
  }
}

export default function PatternPage() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { continent, country, city } = geoFilter || {};
  const { title, desc } = getFormattedLocation(city, country, continent);

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="user" className="space-y-4">
            <div className="flex items-start justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground my-2">{desc}</p>
              </div>
              <TabsList>
                <TabsTrigger value="user">Site Users</TabsTrigger>
                <TabsTrigger value="visit">Browsing Activity</TabsTrigger>
                <TabsTrigger value="book">Reading Activity</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="user" className="space-y-4">
              <FourMetrics metrics_idx="user" inspect="total_user" />
              <GeoPie inspect="total_user" />
            </TabsContent>
            <TabsContent value="visit" className="space-y-4">
              <FourMetrics metrics_idx="visit" inspect="total_click" />
              <GeoPie inspect="total_click" />
            </TabsContent>
            <TabsContent value="book" className="space-y-4">
              <FourMetrics metrics_idx="book" inspect="total_book" />
              <GeoPie inspect="total_book" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
