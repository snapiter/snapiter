import { useEffect, useRef, useCallback } from "react";
import type { TripDetailed } from "@/store/atoms";
import type maplibregl from "maplibre-gl";
import { useSelectedTrip } from "../trips/useSelectedTrip";
import { lightboxIndexAtom } from "@/store/atoms";
import { useSetAtom } from "jotai";
import { animateTrip, } from '@/utils/tripAnimationHandler';
import { MapRef } from "react-map-gl/maplibre";

interface AnimationRefs {
  animationRef: React.MutableRefObject<number | null>;
  vehicleMarkerRef: React.MutableRefObject<maplibregl.Marker | null>;
  startTimeRef: React.MutableRefObject<number | null>;
  currentPositionIndexRef: React.MutableRefObject<number>;
  visibleMarkersRef: React.MutableRefObject<Record<string, maplibregl.Marker>>;
}


export function useTripAnimation(
  mapRef: React.RefObject<MapRef | null>
) {
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const currentlyAnimatingSlugRef = useRef<string | null>(null);

  const { trip: selectedTrip } = useSelectedTrip();

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);

  const animateTripDirect = useCallback(
    (trip: TripDetailed) => {
      if (currentlyAnimatingSlugRef.current === trip.slug) {
        return;
      }

      currentlyAnimatingSlugRef.current = trip.slug;


      const refs: AnimationRefs = {
        animationRef,
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
    },
    [mapRef, setLightboxIndex]
  );

  useEffect(() => {
    if (selectedTrip?.slug !== currentlyAnimatingSlugRef.current) {
      currentlyAnimatingSlugRef.current = null;
    }

    if (selectedTrip && selectedTrip.positions.length > 0) {
      animateTripDirect({
        ...selectedTrip,
        markers: selectedTrip.markers,
      });
    }
  }, [selectedTrip]);
}
