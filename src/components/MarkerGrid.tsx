"use client";

import { useSetAtom } from "jotai";
import { getMarkerUrlThumbnail } from "@/services/thumbnail";
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
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-2 gap-3"
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

          {marker.description && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-opacity rounded-lg flex items-end p-2">
              <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {marker.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
