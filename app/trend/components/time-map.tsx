import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Map } from "react-map-gl/maplibre";

import DeckGL from "@deck.gl/react/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { DataFilterExtension } from "@deck.gl/extensions/typed";
// import {MapView} from '@deck.gl/core';
// import RangeInput from './range-input';
import { useMemo } from "react";
import { useGetWeeklyMapQuery } from "@/features/services/geo";
import RangeInput from "./range-input";
// This is only needed for this particular dataset - the default view assumes
// that the furthest geometries are on the ground. Because we are drawing the
// circles at the depth of the earthquakes, i.e. below sea level, we need to
// push the far plane away to avoid clipping them.
// const MAP_VIEW = new MapView({
//   // 1 is the distance between the camera and the ground
//   farZMultiplier: 100
// });

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MS_PER_DAY = 8.64e7;

type IDataType = {
  lat: number;
  lon: number;
  count: number;
  time: string;
};

type DataType = IDataType[];

const dataFilter = new DataFilterExtension({
  filterSize: 1,
  // Enable for higher precision, e.g. 1 second granularity
  // See DataFilterExtension documentation for how to pick precision
  fp64: false,
});

// function getTooltip({ object: any }) {
//   return (
//     object &&
//     `\
//     Time: ${new Date(object.timestamp).toUTCString()}
//     Magnitude: ${object.magnitude}
//     Depth: ${object.depth}
//     `
//   );
// }

export default function WeeklyMap({ mapStyle = MAP_STYLE }) {
  const { currentData: data, isLoading } = useGetWeeklyMapQuery("");

  const [viewport, setViewport] = useState({
    longitude: 0,
    latitude: 30,
    zoom: 1,
    bearing: 0,
    pitch: 0,
  });

  const [filter, setFilter] = useState<any>(null);
  const timeRange = useMemo(() => [0, data?.weeks.length - 1], [data]);
  const filterValue = filter || timeRange;

  const layers = [
    data &&
      new ScatterplotLayer({
        id: "earthquakes",
        data: data.data,
        opacity: 0.8,
        radiusScale: 100,
        radiusMinPixels: 1,
        wrapLongitude: true,

        getPosition: (d: IDataType) => [d.lon, d.lat],
        getRadius: (d: IDataType) => Math.log2(d.count),
        getFillColor: (d: IDataType) => {
          const r = Math.sqrt(Math.max(d.count, 0));
          return [255 - r * 15, r * 5, r * 10];
        },

        getFilterValue: (d: IDataType) => d.time,
        filterRange: [filterValue[0], filterValue[1]],
        extensions: [dataFilter],

        pickable: true,
      }),
  ];

  return (
    <>
      <Card className="my-4">
        <CardHeader>
          <CardTitle>Geolocated IP Activity Over Time</CardTitle>
          <CardDescription>
            This interactive map visualizes user engagement by plotting IP
            locations. The size of each point indicates the activity level of
            the corresponding IP. Use the time-range slider below the map to
            filter IP activity between two time points. For an automated view,
            press the Play button next to the slider to advance the time range
          </CardDescription>
        </CardHeader>
        <CardContent className="w-[95%] h-[400px] p-0 mx-auto mb-2 rounded-2xl overflow-clip">
          <div className="relative w-full h-full">
            <DeckGL
              layers={layers}
              initialViewState={viewport}
              controller={true}
              //   getTooltip={getTooltip}
            >
              <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} />
            </DeckGL>
            {timeRange && (
              <RangeInput
                min={timeRange[0]}
                max={timeRange[1]}
                value={filterValue}
                weeks={data?.weeks}
                onChange={setFilter}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
