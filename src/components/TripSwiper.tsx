'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';

import 'swiper/css';
import 'swiper/css/pagination';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import PhotoCarousel from './PhotoCarousel';

interface TripSwiperProps {
  trips: Trip[];
}

export default function TripSwiper({ trips }: TripSwiperProps) {
  const { runCommand } = useMapCommands();
  
  const { trip: selectedTrip } = useSelectedTrip();

  const markers = selectedTrip?.markers ?? [];

  const handleSlideChange = (swiper: any) => {
    runCommand({
      type: 'SELECT_TRIP',
      tripSlug: trips[swiper.activeIndex].slug
    });
  };
    
  return (
    <div className={`w-full h-full`}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1.1}
        onSlideChange={handleSlideChange}
        className=""
      >
        {trips.map((trip) => (
          <SwiperSlide key={`swiper-${trip.slug}`} className="">
            <TripDetails 
              trip={trip} 
              isSelected={selectedTrip?.slug === trip.slug}
              markers={markers}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {markers.length > 0 && (
          <div className="pt-4">
            <PhotoCarousel markers={markers} />
          </div>
        )}
    </div>
  );
}