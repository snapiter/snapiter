import type maplibregl from 'maplibre-gl';
import type { Trip, Position } from '@/store/atoms';
import { getVisibleMarkers, updateMarkersOnMap } from './mapMarkers';

export function createAnimationLoop(
  mapRef: { current: any },
  selectedTrip: Trip,
  activePositions: Position[],
  vehicleMarkerRef: { current: maplibregl.Marker | null },
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  currentPositionIndexRef: { current: number },
  startTimeRef: { current: number | null },
  animationRef: { current: number | null },
  onComplete?: () => void
) {
  const animate = () => {
    if (!mapRef.current || !selectedTrip || activePositions.length < 2) return;

    const map = mapRef.current.getMap();
    const duration = selectedTrip.animationSpeed ?? 5000;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const currentIndex = Math.floor(progress * (activePositions.length - 1));
    currentPositionIndexRef.current = currentIndex;

    if (currentIndex < activePositions.length) {
      const progressCoordinates = activePositions.slice(0, currentIndex + 1)
        .map(p => [p.longitude, p.latitude]);
      const source = map.getSource(`route-${selectedTrip.slug}`) as any;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: progressCoordinates
            }
          }]
        });
      }

      if (vehicleMarkerRef.current) {
        const pos = activePositions[currentIndex];
        vehicleMarkerRef.current.setLngLat([pos.longitude, pos.latitude]);
      }

      const currentPosition = activePositions[currentIndex];
      const visibleMarkers = getVisibleMarkers(selectedTrip.markers, currentPosition);
      updateMarkersOnMap(visibleMarkers, visibleMarkersRef, map);
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null;
      startTimeRef.current = null;
      onComplete?.(); // Fire callback when animation completes
    }
  };

  return animate;
}

export function startAnimation(
  mapRef: { current: any },
  selectedTrip: Trip,
  activePositions: Position[],
  vehicleMarkerRef: { current: maplibregl.Marker | null },
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  currentPositionIndexRef: { current: number },
  startTimeRef: { current: number | null },
  animationRef: { current: number | null },
  onComplete?: () => void
) {
  const animate = createAnimationLoop(
    mapRef,
    selectedTrip,
    activePositions,
    vehicleMarkerRef,
    visibleMarkersRef,
    currentPositionIndexRef,
    startTimeRef,
    animationRef,
    onComplete
  );

  const map = mapRef.current?.getMap();
  if (!map) return;

  // Remove any existing moveend listeners to prevent conflicts
  map.off('moveend');
  
  const startAnimationHandler = () => {
    animationRef.current = requestAnimationFrame(animate);
    map.off('moveend', startAnimationHandler);
  };

  // Wait for any ongoing map movements to complete before starting animation
  map.on('moveend', startAnimationHandler);
}

export function stopAnimation(animationRef: { current: number | null }) {
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }
}