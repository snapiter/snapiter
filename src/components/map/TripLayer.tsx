import { useTripPositions } from "@/hooks/trips/useTripPositions";
import { selectedTripAtom, Trip } from "@/store/atoms";
import { EnvContext } from "@/utils/env/EnvProvider";
import { createRouteData } from "@/utils/mapBounds";
import { useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";

import { useAtomValue, useSetAtom } from "jotai";

interface TripLayerProps {
  trip: Trip;
}

export default function TripLayer({ trip }: TripLayerProps) {
  const selectedTripSlug = useAtomValue(selectedTripAtom);
  const setSelectedTrip = useSetAtom(selectedTripAtom);

  const { data: positions = [] } = useTripPositions(trip.trackableId, trip.slug);

  const env = useContext(EnvContext);
  const { current: map } = useMap();
  const layerIdRef = useRef(`route-line-${trip.slug}`);

  const handleMouseEnter = useCallback((e: maplibregl.MapLayerMouseEvent) => {
    if (!map) return;
    const realMap = map.getMap();
    const layerId = layerIdRef.current;

    if (e.features?.[0]?.layer?.id !== layerId) return;
    if (!realMap.getLayer(layerId)) return;

    realMap.getCanvas().style.cursor = "pointer";
    realMap.setPaintProperty(layerId, "line-width", 6);
    realMap.setPaintProperty(layerId, "line-opacity", 1);
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (!map) return;
    const realMap = map.getMap();
    const layerId = layerIdRef.current;

    if (!realMap.getLayer(layerId)) return;

    realMap.getCanvas().style.cursor = "";
    realMap.setPaintProperty(layerId, "line-width", 4);
    realMap.setPaintProperty(layerId, "line-opacity", 0.3);
  }, [map]);

  const handleClick = useCallback((e: maplibregl.MapLayerMouseEvent) => {
    const layerId = layerIdRef.current;
    if (e.features?.[0]?.layer?.id !== layerId) return;
    setSelectedTrip(trip.slug);
  }, [setSelectedTrip, trip.slug]);

  useEffect(() => {
    if (!map || positions.length < 2) return;

    const realMap = map.getMap();
    const layerId = layerIdRef.current;

    realMap.on("mousemove", layerId, handleMouseEnter);
    realMap.on("mouseleave", layerId, handleMouseLeave);
    realMap.on("click", layerId, handleClick);

    return () => {
      realMap.off("mousemove", layerId, handleMouseEnter);
      realMap.off("mouseleave", layerId, handleMouseLeave);
      realMap.off("click", layerId, handleClick);
    };
  }, [map, positions.length, handleMouseEnter, handleMouseLeave, handleClick]);


  const routeData = createRouteData(positions);


  if (positions.length < 2) return null;

  const isSelected = trip.slug === selectedTripSlug;
  const color = trip.color || "#3b82f6";


  let opacity = 0.3;
  if(isSelected && !env.SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION) {
    opacity = 0;
  }

  return (
    <Source 
    id={`route-${trip.slug}`} 
    type="geojson" data={routeData}>
      <Layer
        id={`route-line-${trip.slug}`}
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-width": 4,
          "line-color": color,
          "line-opacity": opacity,
        }}
      />
    </Source>
  );
}
