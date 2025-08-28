'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import TripDetails from './TripDetails';
import { useSetAtom } from 'jotai';
import { selectedTripAtom, type Trip } from '@/store/atoms';

import 'swiper/css';
import 'swiper/css/pagination';

interface TripSwiperProps {
  trips: Trip[];
}

export default function TripSwiper({ trips }: TripSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    setSelectedTrip(trips[swiper.activeIndex] || null);
  };

  // Set initial trip when trips are loaded
  useEffect(() => {
    if (trips.length > 0 && !trips[activeIndex]) {
      setSelectedTrip(trips[0]);
    } else if (trips[activeIndex]) {
      setSelectedTrip(trips[activeIndex]);
    }
  }, [trips, activeIndex, setSelectedTrip]);


  const goToSlide = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  return (
    <div className={`w-full h-full`}>
      {/* Show "more content" indicator when there are multiple trips and not on last slide */}
      {trips.length > 1 && activeIndex < trips.length - 1 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[102] bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-muted animate-pulse"
          >
            <path 
              d="M9 18l6-6-6-6" 
              stroke="currentColor" 
              strokeWidth="2" 
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
        onSwiper={setSwiperInstance}
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