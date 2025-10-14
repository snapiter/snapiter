"use client";

import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { getMarkerUrlThumbnail } from "@/services/thumbnail";
import {
  highlightedMarkerAtom,
  lightboxIndexAtom,
  type Marker,
} from "@/store/atoms";
import { SafeImage } from "@/components/SafeImage";

interface PhotoGridProps {
  markers: Marker[];
}


export default function PhotoGrid2({ markers }: PhotoGridProps) {
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-2 lg:grid-cols-2 gap-3 px-4 "
      >
        {markers.map((marker, index) => (
          <div
            key={marker.markerId}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => setLightboxIndex(index)}
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
    </div>
  );
}
