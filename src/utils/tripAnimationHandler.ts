import type maplibregl from 'maplibre-gl';
import type { MapRef } from 'react-map-gl/maplibre';
import type { Trip, Position, Marker } from '@/store/atoms';
import { createTripMarkers, createVehicleMarker, cleanupMarkers } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds } from '@/utils/mapBounds';

export interface TripWithPositions extends Trip {
  positions: Position[];
  markers?: Marker[];
}

export interface AnimationRefs {
  animationRef: React.RefObject<number | null>;
  vehicleMarkerRef: React.RefObject<maplibregl.Marker | null>;
  startTimeRef: React.RefObject<number | null>;
  currentPositionIndexRef: React.RefObject<number>;
  visibleMarkersRef: React.RefObject<Record<string, maplibregl.Marker>>;
}

export function animateTrip(
  tripWithPositions: TripWithPositions,
  mapRef: React.RefObject<MapRef | null>,
  refs: AnimationRefs,
  websiteIcon?: string,
  onPhotoClick?: (photoIndex: number) => void,
  onComplete?: () => void
) {
  const map = mapRef.current?.getMap();
  if (!map) return;

  // Stop current animation and clean up
  stopAnimation(refs.animationRef);
  cleanupMarkers(refs.visibleMarkersRef, refs.vehicleMarkerRef);

  // Reset animation state
  refs.currentPositionIndexRef.current = 0;
  refs.startTimeRef.current = null;

  // Reset the route line to empty
  const routeSource = map.getSource(`route-${tripWithPositions.slug}`) as any;
  if (routeSource) {
    routeSource.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }]
    });
  }

  const activePositions = tripWithPositions.positions.toReversed();
  
  createTripMarkers(tripWithPositions.markers || [], refs.visibleMarkersRef, (photoIndex: number) => {
    onPhotoClick?.(photoIndex);
  });
  
  createVehicleMarker(activePositions[0], refs.vehicleMarkerRef, map, websiteIcon);
  fitMapBounds(mapRef, activePositions);

  startAnimation(
    mapRef,
    tripWithPositions,
    activePositions,
    refs.vehicleMarkerRef,
    refs.visibleMarkersRef,
    refs.currentPositionIndexRef,
    refs.startTimeRef,
    refs.animationRef,
    () => {
      onComplete?.();
    }
  );
}