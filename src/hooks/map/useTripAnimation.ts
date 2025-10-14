import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { animationLineAtom, lightboxIndexAtom } from "@/store/atoms";
import { TripAnimator } from "@/utils/TripAnimator";
import { useSelectedTrip } from "../trips/useSelectedTrip";

export function useTripAnimation(mapRef: React.RefObject<MapRef | null>) {
  const { trip: selectedTrip } = useSelectedTrip();
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const setAnimationLine = useSetAtom(animationLineAtom);

  const animatorRef = useRef<TripAnimator | null>(null);

  if (!animatorRef.current) {
    animatorRef.current = new TripAnimator(
      mapRef,
      setAnimationLine,
      (photoIndex) => setLightboxIndex(photoIndex),
    );
  }

  useEffect(() => {
    const animator = animatorRef.current;
    if (!animator) return;

    if (!selectedTrip || selectedTrip.positions.length === 0) {
      animator.cleanup();
      return;
    }

    if (animator.getCurrentSlug() !== selectedTrip.slug) {
      animator.animate(selectedTrip, selectedTrip.trackableId);
    }

    return () => {
      // Don't cleanup here - let the next effect handle it
      // Only cleanup on unmount
    };
  }, [selectedTrip?.slug, selectedTrip?.trackableId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animatorRef.current?.cleanup();
    };
  }, []);
}
