/* global fetch */
import React, { useState, useMemo } from "react";
import { Map } from "react-map-gl/maplibre";

import DeckGL from "@deck.gl/react/typed";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers/typed";

import type { PickingInfo } from "@deck.gl/core/typed/lib/picking/pick-info";
import type { TooltipContent } from "@deck.gl/core/typed/lib/tooltip";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useGetArcsPointsQuery,
  useGetArcsArcsQuery,
} from "@/features/services/book";
import { Skeleton } from "@/components/ui/skeleton";

function valueToColor(value: number) {
  // Ensure value is between 0 and 1
  value = Math.min(1, Math.max(0, value));

  // Calculate the red component
  let red = Math.floor(255 * (1 - value));

  // Green remains constant at 255
  let green = 255;

  // Blue remains at 0
  let blue = 0;

  return new Uint8Array([red, green, blue, 255]);
}

const INITIAL_VIEW_STATE = {
  longitude: 10,
  latitude: 30,
  zoom: 0,
  maxZoom: 15,
  pitch: 30,
  bearing: 30,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

function getTooltip(info: PickingInfo): TooltipContent {
  const { object } = info;
  if (object && object.from && object.to) {
    const from_d = object.from.name
      .split("_")
      .map((e: any) => parseFloat(e).toFixed(2));
    const to_d = object.to.name
      .split("_")
      .map((coord: any) => parseFloat(coord).toFixed(2));
    return `${from_d[0]}, ${from_d[1]} to ${to_d[0]}, ${
      to_d[1]
    } (similarity: ${object.value.toFixed(2)})`;
  }
  return null;
}

export default function UserNetwork({ strokeWidth = 1, mapStyle = MAP_STYLE }) {
  const [selectedPoint, setSelectedPoint] = useState("");

  const { currentData: data, isLoading: isLoadingPoints } =
    useGetArcsPointsQuery("");
  const { currentData: arcs, isLoading: isLoadingArcs } =
    useGetArcsArcsQuery(selectedPoint);

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data,
      pickable: true,
      opacity: 0.8,
      filled: true,
      radiusScale: 15,
      radiusMinPixels: 1,
      radiusMaxPixels: 200,
      lineWidthMinPixels: 1,
      getFillColor: [255, 140, 0],
      getPosition: (d) => [d.lon, d.lat],
      getRadius: (d) => 50,
      onClick: (info) => setSelectedPoint(info.object.name),
    }),
    new ArcLayer({
      id: "arc",
      data: arcs,
      pickable: true,

      getSourcePosition: (d) => d.from.coordinates,
      getTargetPosition: (d) => d.to.coordinates,
      getSourceColor: (d) => valueToColor(d.value),
      getTargetColor: (d) => valueToColor(d.value),
      getWidth: 2.2,
    }),
  ];

  return (
    <>
      <Card className="my-4">
        <CardHeader>
          <CardTitle>
            Interactive Map of Bibliographic Record-Driven IP Relationships
          </CardTitle>
          <CardDescription>
            Each orange point on this map represents an IP address, located
            based on their geographic coordinates. Click on a point to explore
            IPs with similar bibliographic record interactions. Arcs will
            appear, connecting the selected IP address to similar IPs; the
            greener the arc, the higher the similarity based on IP-bibliographic
            record interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="w-[95%] h-[400px] p-0 mx-auto mb-2 rounded-2xl overflow-clip">
          {isLoadingArcs || isLoadingPoints || !data ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="relative w-full h-full">
              <DeckGL
                layers={layers}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                getTooltip={getTooltip}
              >
                <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} />
              </DeckGL>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
