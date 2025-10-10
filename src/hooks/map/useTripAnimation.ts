import { useEffect, useRef, useCallback } from "react";
import type { TripDetailed } from "@/store/atoms";
import type maplibregl from "maplibre-gl";
import { useSelectedTrip } from "../trips/useSelectedTrip";
import { lightboxIndexAtom, animationStateAtom } from "@/store/atoms";
import { useSetAtom, useAtom } from "jotai";
import { animateTrip, } from '@/utils/tripAnimationHandler';
import { MapRef } from "react-map-gl/maplibre";

interface AnimationRefs {
  animationRef: React.MutableRefObject<number | null>;
  timeoutRef: React.MutableRefObject<number | null>;
  vehicleMarkerRef: React.MutableRefObject<maplibregl.Marker | null>;
  startTimeRef: React.MutableRefObject<number | null>;
  currentPositionIndexRef: React.MutableRefObject<number>;
  visibleMarkersRef: React.MutableRefObject<Record<string, maplibregl.Marker>>;
}


export function useTripAnimation(
  mapRef: React.RefObject<MapRef | null>
) {
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const [animationState, setAnimationState] = useAtom(animationStateAtom);
  const { trip: selectedTrip } = useSelectedTrip();

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);

  const animateTripDirect = useCallback(
    (trip: TripDetailed) => {
      if (animationState.currentSlug === trip.slug) {
        return;
      }

      if (animationState.animationId !== null) {
        cancelAnimationFrame(animationState.animationId);
      }
      if (animationState.timeoutId !== null) {
        clearTimeout(animationState.timeoutId);
      }
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
        vehicleMarkerRef.current = null;
      }
      Object.values(visibleMarkersRef.current).forEach(marker => marker.remove());
      visibleMarkersRef.current = {};

      const map = mapRef.current?.getMap();
      if (map && animationState.currentSlug) {
        const oldAnimationSource = map.getSource(`route-${animationState.currentSlug}-animation`) as any;
        if (oldAnimationSource) {
          oldAnimationSource.setData({
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
      }

      const refs: AnimationRefs = {
        animationRef,
        timeoutRef,
        vehicleMarkerRef,
        startTimeRef,
        currentPositionIndexRef,
        visibleMarkersRef,
      };

      animateTrip(
        trip,
        mapRef,
        refs,
        trip.trackableId,
        (photoIndex) => setLightboxIndex(photoIndex)
      );

      setAnimationState({
        animationId: animationRef.current,
        timeoutId: timeoutRef.current,
        currentSlug: trip.slug,
      });
    },
    [mapRef, setLightboxIndex, animationState, setAnimationState]
  );

  useEffect(() => {
    if (selectedTrip?.slug !== animationState.currentSlug) {
      if (animationState.animationId !== null) {
        cancelAnimationFrame(animationState.animationId);
      }
      if (animationState.timeoutId !== null) {
        clearTimeout(animationState.timeoutId);
      }
      setAnimationState({
        animationId: null,
        timeoutId: null,
        currentSlug: null,
      });
    }

    if (selectedTrip && selectedTrip.positions.length > 0) {
      animateTripDirect({
        ...selectedTrip,
        markers: selectedTrip.markers,
      });
    }
  }, [selectedTrip?.slug]);
}
