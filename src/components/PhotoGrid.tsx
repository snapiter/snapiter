'use client';

import Image from 'next/image';
import { useSetAtom } from 'jotai';
import { lightboxIndexAtom } from '@/store/atoms';

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
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-3 px-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => handlePhotoClick(index)}
          >
            <Image
              src={photo.url + "/thumbnail/500x500"}
              alt={photo.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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