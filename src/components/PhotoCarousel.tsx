'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useMapCommands } from '@/hooks/useMapCommands';

import 'swiper/css';
import 'swiper/css/pagination';
import { Marker } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/api';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  markerId?: string;
}

interface PhotoCarouselProps {
  markers: Marker[];
  className?: string;
}
export default function PhotoCarousel({ markers, className = '' }: PhotoCarouselProps) {
  const { runCommand } = useMapCommands();

  const handlePhotoClick = (index: number) => {
    runCommand({ type: 'LIGHTBOX_OPEN', photoIndex: index });
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex;
    const activePhoto = markers[activeIndex];
    if (activePhoto) {
      runCommand({ type: 'HIGHLIGHT_MARKER', markerId: activePhoto.id });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={markers.length > 1 ? 1.2 : 1}
        navigation={false}
        pagination={{
          dynamicBullets: true,
        }}
        onSlideChange={handleSlideChange}
        className="h-full rounded-lg"
      >
        {markers.map((marker: Marker, index: number) => (
          <SwiperSlide key={marker.markerId} className="relative">
            <div 
              className="relative w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handlePhotoClick(index)}
            >
              <Image
                src={getMarkerUrlThumbnail(marker.markerId, "500x500")}
                alt={marker.title  || 'Marker photo'}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {marker.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
                <p className="text-sm">{marker.description}</p>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}