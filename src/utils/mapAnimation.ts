import type maplibregl from "maplibre-gl";
import type { Position, TripDetailed } from "@/store/atoms";
import { getVisibleMarkers, updateMarkersOnMap } from "./mapMarkers";

export function startAnimation(
  mapRef: React.RefObject<any>,
  selectedTrip: TripDetailed,
  activePositions: Position[],
  vehicleMarkerRef: React.RefObject<maplibregl.Marker | null>,
  visibleMarkersRef: React.RefObject<Record<string, maplibregl.Marker>>,
  currentPositionIndexRef: React.RefObject<number>,
  startTimeRef: React.RefObject<number | null>,
  animationRef: React.RefObject<number | null>,
  timeoutRef: React.RefObject<number | null>,
) {
  const map = mapRef.current?.getMap?.();
  if (!map || !selectedTrip || activePositions.length < 2) return;

  const duration = selectedTrip.animationSpeed ?? 5000;
  startTimeRef.current = performance.now();

  const getProgressData = () => {
    const elapsed = performance.now() - (startTimeRef.current ?? 0);
    const progress = Math.min(elapsed / duration, 1);
    const exactIndex = progress * (activePositions.length - 1);
    const currentIndex = Math.floor(exactIndex);
    return { progress, exactIndex, currentIndex };
  };

  const animateVehicle = () => {
    const { progress, exactIndex } = getProgressData();

    const lower = Math.floor(exactIndex);
    const upper = Math.min(lower + 1, activePositions.length - 1);
    const t = exactIndex - lower;

    const p1 = activePositions[lower];
    const p2 = activePositions[upper];
    const lng = p1.longitude + (p2.longitude - p1.longitude) * t;
    const lat = p1.latitude + (p2.latitude - p1.latitude) * t;

    vehicleMarkerRef.current?.setLngLat([lng, lat]);
    currentPositionIndexRef.current = lower;

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateVehicle);
    } else {
      animationRef.current = null;
      startTimeRef.current = null;
    }
  };

  const animateMap = () => {
    const { progress, currentIndex } = getProgressData();

    const source = map.getSource(`route-${selectedTrip.slug}-animation`) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (source) {
      const coords = activePositions
        .slice(0, currentIndex + 1)
        .map((p) => [p.longitude, p.latitude]);
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
          },
        ],
      });
    }

    const currentPosition = activePositions[currentIndex];
    const visibleMarkers = getVisibleMarkers(
      selectedTrip.markers,
      currentPosition,
    );
    updateMarkersOnMap(visibleMarkers, visibleMarkersRef, map);

    if (progress < 1) {
      timeoutRef.current = window.setTimeout(animateMap, 100);
    } else {
      timeoutRef.current = null;
    }
  };

  animationRef.current = requestAnimationFrame(animateVehicle);
  timeoutRef.current = window.setTimeout(animateMap, 100);
}

/** Stop animation cleanly */
export function stopAnimation(
  animationRef: React.RefObject<number | null>,
  timeoutRef: React.RefObject<number | null>,
) {
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}
