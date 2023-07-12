"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import DeckGL from "@deck.gl/react/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { Map } from "react-map-gl/maplibre";

const INITIAL_VIEW_STATE = {
  longitude: -73.75,
  latitude: 40.73,
  zoom: 9,
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json"; // eslint-disable-line

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export default function Home({
  data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE,
}) {
  const layers = [
    new HeatmapLayer({
      data,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d[0], d[1]],
      getWeight: (d) => d[2],
      radiusPixels,
      intensity,
      threshold,
    }),
  ];
  return (
    <main>
      <Button>Click me</Button>
      <div className="relative w-[500px] h-[500px] rounded-xl overflow-hidden">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <Map
            reuseMaps
            mapStyle={mapStyle}
            styleDiffing={false}
            maplibreLogo
          />
        </DeckGL>
      </div>
    </main>
  );
}
