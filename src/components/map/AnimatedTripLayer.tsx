import { Layer, Source } from "react-map-gl/maplibre";
import type { Trip } from "@/store/atoms";

interface AnimatedTripLayerProps {
  trip: Trip;
}

export default function AnimatedTripLayer({ trip }: AnimatedTripLayerProps) {
  const color = trip.color || "#3b82f6";

  return (
    <Source
      id={`route-${trip.slug}-animation`}
      type="geojson"
      data={{
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: [] },
          },
        ],
      }}
    >
      <Layer
        id={`route-line-${trip.slug}-animation`}
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-width": 4,
          "line-color": color,
          "line-opacity": 1,
        }}
      />
    </Source>
  );
}
