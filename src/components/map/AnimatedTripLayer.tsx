import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { animationLineAtom } from "@/store/atoms";

export default function AnimatedTripLayer() {
  const animationLine = useAtomValue(animationLineAtom);

  const routeData = useMemo(() => {
    if (!animationLine) {
      return {
        type: "FeatureCollection" as const,
        features: [],
      };
    }

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: animationLine.coordinates,
          },
        },
      ],
    };
  }, [animationLine]);

  if (!animationLine) return null;

  return (
    <Source
      id={`route-${animationLine.slug}-animation`}
      type="geojson"
      data={routeData}
    >
      <Layer
        id={`route-line-${animationLine.slug}-animation`}
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-width": 4,
          "line-color": animationLine.color,
          "line-opacity": 1,
        }}
      />
    </Source>
  );
}
