import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useMapCommands } from '@/hooks/useMapCommands';
import MobileTripDetails from './MobileTripDetails';
import { useTripsByHostname } from '@/hooks/useTripsByHostname';


export default function TripSwiper() {
  const { runCommand } = useMapCommands();

  const { data: trips } = useTripsByHostname();

  const handleSlideChange = (swiper: any) => {
    runCommand({
      type: 'SELECT_TRIP',
      tripSlug: trips[swiper.activeIndex].slug
    });
  };

  if (trips.length === 0) return <></>;
    
  return (
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={trips.length > 1 ? 1.1 : 1} // 1.1 for multiple slides, 1 for single slide
        onSlideChange={handleSlideChange}
        className=""
      >
        {trips.map((trip) => (
          <SwiperSlide key={`swiper-${trip.slug}`} className="">
            <MobileTripDetails 
              trip={trip} 
            />  
          </SwiperSlide>
        ))}
      </Swiper>
  );
}