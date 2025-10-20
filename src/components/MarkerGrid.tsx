"use client";

import { useSetAtom } from "jotai";
import { useMarkerUrls } from "@/services/thumbnail";
import {
  lightboxIndexAtom,
  type Marker,
} from "@/store/atoms";
import { SafeImage } from "@/components/SafeImage";

interface PhotoGridProps {
  markers: Marker[];
  handleMarkerHover?: (markerId: string) => void;
  handleGridMouseEnter?: () => void;
  handleGridMouseLeave?: () => void;
}


export default function MarkerGrid({ markers, handleMarkerHover, handleGridMouseEnter, handleGridMouseLeave }: PhotoGridProps) {
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const { getMarkerUrlThumbnail } = useMarkerUrls();

  // The grid seems weird, on mobile view fullscreen bottomdrawer it needs to be 2 columns.
  // Desktop small view needs to be 1 column.
  // Desktop Large view needs to be 2 columns.
  return (
    <div
      className="grid grid-cols-2  md:grid-cols-1 lg:grid-cols-2 gap-3"
      onMouseEnter={handleGridMouseEnter}
      onMouseLeave={handleGridMouseLeave}
    >
      {markers.map((marker, index) => (
        <div
          key={marker.markerId}
          className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity group"
          onClick={() => setLightboxIndex(index)}
          onMouseEnter={() => handleMarkerHover?.(marker.markerId)}
        >
          <SafeImage
            src={getMarkerUrlThumbnail(marker, "500x500")}
            alt={marker.title}
            fill
            className={`object-cover rounded-lg transition-opacity duration-300`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            size="small"
          />

          {marker.title && (
            <div className="absolute inset-0 transition-opacity rounded-lg flex items-end justify-center p-2">
              <p className="text-foreground text-xs bg-background/50 rounded-sm transition-opacity line-clamp-2 p-1">
                {marker.title}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
