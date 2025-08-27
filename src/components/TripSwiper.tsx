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
      <div className="absolute right-0 top-10 z-[102] bg-white">
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