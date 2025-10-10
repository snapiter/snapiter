import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

import { Marker, lightboxIndexAtom, highlightedMarkerAtom } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/thumbnail';
import { useAtomValue, useSetAtom } from 'jotai';
import { bottomPanelExpandedAtom } from '@/store/atoms';
import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  markerId?: string;
}

export default function PhotoCarousel() {
  const { trip: selectedTrip } = useSelectedTrip();

  const isExpanded = useAtomValue(bottomPanelExpandedAtom);
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const setHighlightedMarker = useSetAtom(highlightedMarkerAtom);



  if (selectedTrip === null || selectedTrip.markers.length === 0) {
    return <></>;
  }

  if (!isExpanded) {
    return (
      <div className="relative w-full pt-4">
        <div className="bg-muted rounded-lg animate-pulse flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
  };
  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex;
    const activePhoto = selectedTrip.markers[activeIndex];
    if (activePhoto) {
      setHighlightedMarker(activePhoto.markerId);
    }
  };

  return (
    <div className="pt-4">
      <div className="w-full">
        <Swiper
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={selectedTrip.markers.length > 1 ? 1.2 : 1}
          navigation={false}
          onSlideChange={handleSlideChange}
          className="h-full rounded-lg"
        >
          {selectedTrip.markers.map((marker: Marker, index: number) => (
            <SwiperSlide key={marker.markerId} className="relative">
              <div
                className="relative w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handlePhotoClick(index)}
              >
                <Image
                  src={getMarkerUrlThumbnail(marker, "500x500")}
                  alt={marker.title || 'Marker photo'}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, 500px"

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
    </div>
  );
}