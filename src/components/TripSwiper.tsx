'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';

import 'swiper/css';
import 'swiper/css/pagination';
import { useMapCommands } from '@/hooks/useMapCommands';

interface TripSwiperProps {
  trips: Trip[];
}

export default function TripSwiper({ trips }: TripSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { runCommand } = useMapCommands();
  
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    runCommand({
      type: 'SELECT_TRIP',
      tripSlug: trips[swiper.activeIndex].slug
    });
  };

  return (
    <div className={`w-full h-full`}>
      {/* Show "more content" indicator when there are multiple trips and not on last slide */}

      {trips.length > 1 && activeIndex != 0 && (
        <div className="absolute left-0 top-10 z-[102] bg-background mt-2">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
          >
          <path 
            d="M15 6l-6 6 6 6" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          </svg>
        </div>
      )}
      {trips.length > 1 && activeIndex < trips.length - 1 && (
        <div className="absolute right-0 top-10 z-[102] bg-background mt-2">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
          >
            <path 
              d="M9 18l6-6-6-6" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      
      
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        className="h-full"
      >
        {trips.map((trip) => (
          <SwiperSlide key={`swiper-${trip.slug}`} className="h-full">
            <TripDetails 
              trip={trip} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}