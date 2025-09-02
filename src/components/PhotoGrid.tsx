'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useMapCommands } from '@/hooks/useMapCommands';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  className?: string;
}

export default function PhotoGrid({ photos, className = '' }: PhotoGridProps) {
  const { runCommand } = useMapCommands();
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set(photos.map(p => p.id)));

  const handlePhotoClick = (index: number) => {
    runCommand({ type: 'LIGHTBOX_OPEN', photoIndex: index });
  };

  const handlePhotoHover = (markerId: string) => {
    runCommand({ type: 'HIGHLIGHT_MARKER', markerId });
  };

  const handleImageLoad = (photoId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity group "
            onClick={() => handlePhotoClick(index)}
            onMouseEnter={() => handlePhotoHover(photo.id)}
          >
            {/* Loading skeleton */}
            {loadingImages.has(photo.id) && (
              <div className="absolute inset-0 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            
            <Image
              src={`${photo.url}/thumbnail/500x500`}
              alt={photo.alt}
              fill
              className={`object-cover rounded-lg transition-opacity duration-300 ${
                loadingImages.has(photo.id) ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={() => handleImageLoad(photo.id)}
            />
            {photo.caption && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-end p-2">
                <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}