'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import TripDetails from './TripDetails';

import 'swiper/css';
import 'swiper/css/pagination';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  distance: string;
  photos: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }>;
}

interface TripSwiperProps {
  trips: Trip[];
  className?: string;
  onTripChange?: (tripIndex: number) => void;
}

export default function TripSwiper({ trips, className = '', onTripChange }: TripSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    onTripChange?.(swiper.activeIndex);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Trip {activeIndex + 1} of {trips.length}
        </h2>
        <div className="flex space-x-1">
          {trips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
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
        className="h-full"
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-blue-500 !w-2 !h-2',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-600'
        }}
      >
        {trips.map((trip) => (
          <SwiperSlide key={trip.id} className="h-full">
            <TripDetails trip={trip} className="h-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}