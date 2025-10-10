'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Marker, lightboxIndexAtom, highlightedMarkerAtom } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/thumbnail';
import { useSetAtom } from 'jotai';


interface PhotoGridProps {
  markers: Marker[];
}

const BOUNCE_MS = 150; // tune this "bounce rate" window

export default function PhotoGrid({ markers }: PhotoGridProps) {
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const setHighlightedMarker = useSetAtom(highlightedMarkerAtom);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set(markers.map(p => p.markerId)));

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
    clearLeaveTimer();                // user is still inside grid; cancel any pending leave
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

  const handleImageLoad = (markerId: string) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(markerId);
      return next;
    });
  };

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4"
        onMouseEnter={handleGridMouseEnter}
        onMouseLeave={handleGridMouseLeave}
      >
        {markers.map((marker, index) => (
          <div
            key={marker.markerId}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => setLightboxIndex(index)}
            onMouseEnter={() => handlePhotoEnter(marker.markerId)}
          >
            {loadingImages.has(marker.markerId) && (
              <div className="absolute inset-0 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={getMarkerUrlThumbnail(marker, "500x500")}
              alt={marker.title}
              fill
              className={`object-cover rounded-lg transition-opacity duration-300 ${
                loadingImages.has(marker.markerId) ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={() => handleImageLoad(marker.markerId)}
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
