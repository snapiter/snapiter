'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { useMapCommands } from '@/hooks/useMapCommands';

import 'swiper/css';
import 'swiper/css/pagination';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
  className?: string;
}
export default function PhotoCarousel({ photos, className = '' }: PhotoCarouselProps) {
  const { runCommand } = useMapCommands();

  const handlePhotoClick = (index: number) => {
    runCommand({ type: 'LIGHTBOX_OPEN', photoIndex: index });
  };

  return (
    <div className={`w-full ${className}`}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={false}
        pagination={{
          dynamicBullets: true,
        }}
        className="h-full rounded-lg"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo.id} className="relative">
            <div 
              className="relative w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handlePhotoClick(index)}
            >
              <Image
                src={`${photo.url}/thumbnail/500x500`}
                alt={photo.alt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
                <p className="text-sm">{photo.caption}</p>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}