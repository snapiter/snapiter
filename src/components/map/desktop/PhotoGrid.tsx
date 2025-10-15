"use client";

import { useSetAtom } from "jotai";
import { useRef } from "react";
import {
  highlightedMarkerAtom,
  type Marker,
} from "@/store/atoms";
import MarkerGrid from "../../MarkerGrid";

interface PhotoGridProps {
  markers: Marker[];
  className?: string;
}

const BOUNCE_MS = 150; // tune this "bounce rate" window

export default function PhotoGrid({ markers }: PhotoGridProps) {
  const setHighlightedMarker = useSetAtom(highlightedMarkerAtom);

  // track the last hovered photo and a pending leave timeout
  const lastHoverIdRef = useRef<string | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const scheduleLeave = () => {
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      if (lastHoverIdRef.current) {
        setHighlightedMarker(null);
        lastHoverIdRef.current = null;
      }
      leaveTimerRef.current = null;
    }, BOUNCE_MS);
  };

  const handlePhotoEnter = (markerId: string) => {
    clearLeaveTimer(); // user is still inside grid; cancel any pending leave
    lastHoverIdRef.current = markerId; // remember current hovered photo
    setHighlightedMarker(markerId);
  };

  const handleGridMouseEnter = () => {
    clearLeaveTimer();
  };

  const handleGridMouseLeave = () => {
    // pointer left the entire grid; only then schedule the leave
    scheduleLeave();
  };

  return (
    <div className="px-4">

    <MarkerGrid
      markers={markers}
      handleMarkerHover={handlePhotoEnter}
      handleGridMouseEnter={handleGridMouseEnter}
      handleGridMouseLeave={handleGridMouseLeave}
    />
    </div>
  );
}
