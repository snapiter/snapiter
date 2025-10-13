import "swiper/css";
import "swiper/css/pagination";

import { useSetAtom } from "jotai";
import { Pagination, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTripsByHostname } from "@/hooks/trips/useTripsByHostname";
import { selectedTripAtom } from "@/store/atoms";
import MobileTripDetails from "./MobileTripDetails";

export default function TripSwiper() {
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const { trips = [] } = useTripsByHostname();

  const handleSlideChange = (swiper: any) => {
    const activeTrip = trips[swiper.activeIndex];
    if (activeTrip) {
      setSelectedTrip(activeTrip.slug);
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
