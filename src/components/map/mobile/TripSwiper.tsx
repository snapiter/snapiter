import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Virtual } from 'swiper/modules';
import { useMapCommands } from '@/hooks/commands/useMapCommands';
import MobileTripDetails from './MobileTripDetails';
import { useTripsByHostname } from '@/hooks/trips/useTripsByHostname';

export default function TripSwiper() {
  const { runCommand } = useMapCommands();
  const { data: trips = [] } = useTripsByHostname();

  const handleSlideChange = (swiper: any) => {
    const activeTrip = trips[swiper.activeIndex];
    if (activeTrip) {
      runCommand({ type: 'SELECT_TRIP', tripSlug: activeTrip.slug });
    }
  };

  if (!trips.length) return null;

  return (
    <Swiper
      modules={[Pagination, Virtual]}
      virtual
      spaceBetween={16}
      slidesPerView={trips.length > 1 ? 1.1 : 1}
      onSlideChange={handleSlideChange}
      lazyPreloadPrevNext={1}
    >
      {trips.map((trip, index) => (
        <SwiperSlide key={trip.slug} virtualIndex={index}>
          <MobileTripDetails trip={trip} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
