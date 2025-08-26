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
  className?: string;
  onTripChange?: (tripIndex: number, positions?: any[], trip?: Trip) => void;
}

export default function TripSwiper({ trips, className = '', onTripChange }: TripSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  
  // Get data directly from the active trip
  const markers = trips[activeIndex]?.markers || [];
  const positions = trips[activeIndex]?.positions || [];
  
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    setSelectedTrip(trips[swiper.activeIndex] || null);
    onTripChange?.(swiper.activeIndex, positions, trips[swiper.activeIndex]);
  };

  // Set initial trip when trips are loaded
  useEffect(() => {
    if (trips.length > 0 && !trips[activeIndex]) {
      setSelectedTrip(trips[0]);
    } else if (trips[activeIndex]) {
      setSelectedTrip(trips[activeIndex]);
    }
  }, [trips, activeIndex, setSelectedTrip]);

  // Trigger callback when positions change for current trip
  useEffect(() => {
    if (positions.length > 0) {
      onTripChange?.(activeIndex, positions, trips[activeIndex]);
    }
  }, [positions, activeIndex, onTripChange, trips]);

  const goToSlide = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="absolute right-0 top-10">
        <div className="flex space-x-1 pr-3 flex-shrink-0">
          {trips.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer hover:scale-110 ${
                index === activeIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
      
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiperInstance}
        className="h-full"
      >
        {trips.map((trip, index) => (
          <SwiperSlide key={`swiper-${trip.slug}`} className="h-full">
            <TripDetails 
              trip={trip} 
              markers={index === activeIndex ? markers : []}
              className="h-full" 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}