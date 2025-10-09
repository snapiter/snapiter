import { useEffect, useRef, useCallback } from "react";
import type { TripDetailed } from "@/store/atoms";
import type maplibregl from "maplibre-gl";
import { useSelectedTrip } from "../trips/useSelectedTrip";
import { lightboxIndexAtom, mapEventsAtom, Trip } from "@/store/atoms";
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
  const setMapEvents = useSetAtom(mapEventsAtom);

  const { trip: selectedTrip } = useSelectedTrip();

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);

  const animateTripDirect = useCallback(
    (trip: TripDetailed) => {
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
        (photoIndex) => setLightboxIndex(photoIndex),
        () => {
          setMapEvents((prev) => [
            ...prev,
            {
              type: "ANIMATION_ENDED",
              tripSlug: trip.slug,
              commandId: `animation-${Date.now()}`,
            },
          ]);
        }
      );
    },
    [animateTrip, mapRef, setLightboxIndex, setMapEvents]
  );

  useEffect(() => {
    if (!selectedTrip ) return;

    if (selectedTrip && selectedTrip.positions.length > 0) {
      animateTripDirect({
        ...selectedTrip,
        markers: selectedTrip.markers,
      });
    }
  }, [selectedTrip, animateTripDirect]);
}
