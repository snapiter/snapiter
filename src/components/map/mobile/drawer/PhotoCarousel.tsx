import { useAtomValue } from "jotai";
import { useSelectedTrip } from "@/hooks/trips/useSelectedTrip";
import {
  bottomPanelExpandedAtom,
  BottomPanelState,
} from "@/store/atoms";
import { PhotoSwiper } from "./PhotoSwiper";
import PhotoGrid2 from "./PhotoGrid";

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
    <div className="pt-4">
      <div className="w-full">
        {isExpanded === BottomPanelState.Fullscreen ? (
          <PhotoGrid2 markers={selectedTrip.markers} />
        ) : (
          <PhotoSwiper selectedTrip={selectedTrip} />
        )}
      </div>
    </div>
  );
}  
