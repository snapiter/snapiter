'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
  return (
    <div className={`w-full ${className}`}>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={true}
        className="h-full rounded-lg"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id} className="relative">
            <div className="relative w-full h-48 md:h-64">
              <Image
                src={photo.url}
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