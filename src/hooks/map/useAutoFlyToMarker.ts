import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { flyToAtom, highlightedMarkerAtom } from "@/store/atoms";
import { fitMapBounds } from "@/utils/mapBounds";
import { useSelectedTrip } from "../trips/useSelectedTrip";

export function useAutoFlyToMarker(mapRef: React.RefObject<MapRef | null>) {
  const highlightedMarkerId = useAtomValue(highlightedMarkerAtom);
  const { trip: selectedTrip } = useSelectedTrip();
  const [flyTo, setFlyTo] = useAtom(flyToAtom);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    map.flyTo({
      center: flyTo.coordinates,
      zoom: flyTo.zoom || 10,
      duration: flyTo.duration || 1000,
    });
  }, [flyTo?.timestamp]);

  useEffect(() => {
    if (!selectedTrip) return;

    // If a marker is highlighted, fly to it
    if (highlightedMarkerId) {
      const marker = selectedTrip.markers?.find(
        (m) => m.markerId === highlightedMarkerId,
      );
      if (marker) {
        setFlyTo({
          coordinates: [marker.longitude, marker.latitude],
          zoom: 8,
          duration: 1500,
          timestamp: Date.now(),
        });
      }
    } else {
      // If no marker is highlighted, fit bounds to the entire trip
      if (selectedTrip.positions && selectedTrip.positions.length > 0) {
        fitMapBounds(mapRef, selectedTrip.positions);
      }
    }
  }, [highlightedMarkerId, selectedTrip?.slug]);
}
