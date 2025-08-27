'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const slides = photos.map(photo => ({
    src: photo.url,
    alt: photo.alt,
    title: photo.caption
  }));

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-3">
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

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </div>
  );
}