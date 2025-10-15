"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useSelectedTrip } from "@/hooks/trips/useSelectedTrip";
import {
  bottomPanelExpandedAtom,
  BottomPanelState,
  dragEnabledAtom,
} from "@/store/atoms";
import { PhotoSwiper } from "./PhotoSwiper";
import MarkerGrid from "../../../MarkerGrid";
import { useEffect } from "react";

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  markerId?: string;
}

export default function PhotoCarousel() {
  const { trip: selectedTrip } = useSelectedTrip();

  const isExpanded = useAtomValue(bottomPanelExpandedAtom);

  const setDragEnabled = useSetAtom(dragEnabledAtom);

  useEffect(() => {
    // On mobile enable or disable dragging of the bottom drawer
    setDragEnabled(!(!selectedTrip || selectedTrip.markers.length === 0));
  }, [selectedTrip]);


  if (!selectedTrip || selectedTrip.markers.length === 0) {
    return null;
  }

  if (isExpanded === BottomPanelState.Closed) {
    return (
      <div className="relative w-full pt-4">
        <div className="bg-background border border-muted rounded-lg animate-pulse flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }


  return (
      <div className="w-full">
        {isExpanded === BottomPanelState.Fullscreen ? (
          <MarkerGrid markers={selectedTrip.markers} />
        ) : (
          <PhotoSwiper selectedTrip={selectedTrip} />
        )}
    </div>
  );
}  
