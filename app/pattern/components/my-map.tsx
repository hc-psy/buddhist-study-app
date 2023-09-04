"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { Map } from "react-map-gl/maplibre";
import { useGetUuserUclickGeoQuery } from "@/features/services/geo";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import type { GeoFilterInfo } from "@/types/filter";
import { useState, useEffect, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import { COUNTRYBOUNDS } from "@/data/country-by-geo-coordinates";
import React from "react";

function getCountryBounds(countryName: string) {
  // Convert the input to lowercase
  const lowerCaseCountryName = countryName.toLowerCase();

  // Find the first matching country
  const country = COUNTRYBOUNDS.find(
    ({ country }) => country.toLowerCase() === lowerCaseCountryName
  );

  // Check if any coordinate is null
  if (
    country &&
    country.north &&
    country.east &&
    country.south &&
    country.west
  ) {
    return country;
  }

  return null;
}

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json"; // eslint-disable-line

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface IData {
  id: number;
  lon: number;
  lat: number;
  lan: string;
  total_click: number;
  total_user: number;
  total_book: number;
}

function aggregateData(data: IData[]): IData[] {
  console.time("myFunction execution time");
  const result: { [key: string]: IData } = data.reduce(
    (acc: { [key: string]: IData }, cur) => {
      const key = `${cur.lon},${cur.lat}`; // Unique key for each lon, lat pair

      // If the key exists, sum up the total_click
      if (acc[key]) {
        acc[key].total_click += cur.total_click;
        acc[key].total_user += cur.total_user;
        acc[key].total_book += cur.total_book;
      } else {
        // If it does not exist, add the current object to the accumulator
        acc[key] = { ...cur };
      }

      return acc;
    },
    {}
  );

  console.timeEnd("myFunction execution time");
  return Object.values(result);
}

function MyMap({
  inspect = "total_user",
  switchers = { jp: false, en: false, tw: false, agg: true },
  intensity = 4,
  threshold = 0.02,
  radiusPixels = 20,
  mapStyle = MAP_STYLE,
}) {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData: data, isLoading } = useGetUuserUclickGeoQuery(
    geoFilter as GeoFilterInfo
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 0,
    bearing: 0,
    pitch: 0,
  });

  // After component mount
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const countryBounds = getCountryBounds(geoFilter?.country || "");

      if (!countryBounds) {
        setViewport({
          ...viewport,
          longitude: 0,
          latitude: 0,
          zoom: 0,
        });
        return;
      }

      const southWest: [number, number] = [
        countryBounds.west,
        countryBounds.south,
      ];
      const northEst: [number, number] = [
        countryBounds.east,
        countryBounds.north,
      ];
      const newViewport = new WebMercatorViewport({
        width,
        height,
      }).fitBounds([southWest, northEst]);
      const { longitude, latitude, zoom } = newViewport;
      // Update your map with the new viewport
      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom,
      });
    }
  }, [containerRef.current, data]);

  const jpLayer = useMemo(() => {
    return new HeatmapLayer({
      data: data?.jp_data,
      id: "heatmp-layer-jp",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat],
      getWeight: (d) => Math.log(d[inspect]) * 10,
      radiusPixels,
      intensity,
      threshold,
      colorRange: [
        [254, 237, 222],
        [253, 208, 162],
        [253, 174, 107],
        [253, 141, 60],
        [230, 85, 13],
        [166, 54, 3],
      ],
      visible: switchers.jp,
    });
  }, [data?.jp_data, switchers.jp, inspect]);

  const enLayer = useMemo(() => {
    return new HeatmapLayer({
      data: data?.en_data,
      id: "heatmp-layer-en",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat],
      getWeight: (d) => Math.log(d[inspect]) * 10,
      radiusPixels,
      intensity,
      threshold,
      colorRange: [
        [242, 240, 247],
        [218, 218, 235],
        [188, 189, 220],
        [158, 154, 200],
        [117, 107, 177],
        [84, 39, 143],
      ],
      visible: switchers.en,
    });
  }, [data?.en_data, switchers.en, inspect]);

  const twLayer = useMemo(() => {
    return new HeatmapLayer({
      data: data?.tw_data,
      id: "heatmp-layer-tw",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat],
      getWeight: (d) => Math.log(d[inspect]) * 10,
      radiusPixels,
      intensity,
      threshold,
      colorRange: [
        [237, 248, 233],
        [199, 233, 192],
        [161, 217, 155],
        [116, 196, 118],
        [49, 163, 84],
        [0, 109, 44],
      ],
      visible: switchers.tw,
    });
  }, [data?.tw_data, switchers.tw, inspect]);

  const aggLayer = useMemo(() => {
    return new HeatmapLayer({
      data: data?.agg_data,
      id: "heatmp-layer-agg",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat],
      getWeight: (d) => Math.log(d[inspect]) * 10,
      radiusPixels,
      intensity,
      threshold,
      visible: switchers.agg,
    });
  }, [data?.agg_data, switchers.agg, inspect]);

  if (isLoading || !data) return <Skeleton className="w-full h-full" />;

  const layers = [jpLayer, enLayer, twLayer, aggLayer];

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <DeckGL
        initialViewState={viewport}
        controller={true}
        layers={layers}
        width={"100%"}
        height={"100%"}
      >
        <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} />
      </DeckGL>
    </div>
  );
}

export default React.memo(MyMap);
