import { useTripWithPosition } from "@/hooks/trips/useTrip";
import { selectedTripAtom, Trip } from "@/store/atoms";
import { EnvContext } from "@/utils/env/EnvProvider";
import { createRouteData } from "@/utils/mapBounds";
import { useContext, useEffect, useMemo } from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";

import { useMapCommands } from "@/hooks/commands/useMapCommands";
import { useAtomValue } from "jotai";

interface TripLayerProps {
  trip: Trip;
}

export default function TripLayer({ trip }: TripLayerProps) {
  const selectedTripSlug = useAtomValue(selectedTripAtom);

  const { data: tripWithPositions = { ...trip, positions: [] } } =
    useTripWithPosition(trip.trackableId, trip.slug);

  const env = useContext(EnvContext);
  const { runCommand } = useMapCommands();
  const { current: map } = useMap();

  const isSelected = trip.slug === selectedTripSlug;
  const color = trip.color || "#3b82f6";

  // Compute coordinates safely
  const coordinates = useMemo(
    () =>
      tripWithPositions.positions?.toReversed().map((p) => [p.longitude, p.latitude]) ?? [],
    [tripWithPositions.positions]
  );

  const routeData = createRouteData(tripWithPositions.positions)

  useEffect(() => {
    if (!map) return;
    const realMap = map.getMap();
    const layerId = `route-line-${trip.slug}`;

    const handleMouseEnter = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features?.[0]?.layer?.id !== layerId) return;
      realMap.getCanvas().style.cursor = "pointer";
      realMap.setPaintProperty(layerId, "line-width", 6);
      realMap.setPaintProperty(layerId, "line-opacity", 1);
    };

    const handleMouseLeave = () => {
      realMap.getCanvas().style.cursor = "";
      realMap.setPaintProperty(layerId, "line-width", 4);
      realMap.setPaintProperty(layerId, "line-opacity", 0.3);
    };

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features?.[0]?.layer?.id !== layerId) return;
      const clickedSlug = trip.slug;

      // prevent reselecting the same trip
      if (clickedSlug === selectedTripSlug) return;

      // remove hover cursor
      realMap.getCanvas().style.cursor = "";

      // send command to select
      runCommand({
        type: "SELECT_TRIP",
        tripSlug: clickedSlug,
      });
    };

    realMap.on("mousemove", layerId, handleMouseEnter);
    realMap.on("mouseleave", layerId, handleMouseLeave);
    realMap.on("click", layerId, handleClick);

    return () => {
      realMap.off("mousemove", layerId, handleMouseEnter);
      realMap.off("mouseleave", layerId, handleMouseLeave);
      realMap.off("click", layerId, handleClick);
    };
  }, [map, trip.slug, selectedTripSlug, runCommand]);

  if (coordinates.length < 2) return null;


  const shouldShowBaseLine =
  env.SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION
    ? true
    : isSelected;


  return (
    <Source id={`route-${trip.slug}`} type="geojson" data={routeData}>
      <Layer
        id={`route-line-${trip.slug}`}
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-width": 4,
          "line-color": color,
          "line-opacity": shouldShowBaseLine ? 1 : 0.3,
        }}
      />
    </Source>
  );
}
