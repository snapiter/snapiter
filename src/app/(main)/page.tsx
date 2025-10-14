"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import Brand from "@/components/Brand";
import DynamicTitle from "@/components/DynamicTitle";
import ErrorComponent from "@/components/ErrorComponent";
import DesktopSidebar from "@/components/map/desktop/DesktopSidebar";
import MapView from "@/components/map/MapView";
import BottomDrawer from "@/components/map/mobile/BottomDrawer";
import PhotoCarousel from "@/components/map/mobile/drawer/PhotoCarousel";
import TripSwiper from "@/components/map/mobile/TripSwiper";
import SnapIterLoader from "@/components/SnapIterLoader";
import { useTripsByHostname } from "@/hooks/trips/useTripsByHostname";
import { useIsMobile } from "@/hooks/useIsMobile";
import { mapReadyAtom, selectedTripAtom } from "@/store/atoms";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const mapReady = useAtomValue(mapReadyAtom);

  const { trackable, trips = [], isLoading, error } = useTripsByHostname();

  useEffect(() => {
    if (trackable && mapReady && !isLoading) {
      setTimeout(() => {
        setIsLoaded(true);
        if (trips.length > 0) {
          setSelectedTrip(trips[0].slug);
        }
      }, 1000);
    }
  }, [trackable, mapReady, trips, isLoading, setSelectedTrip]);

  if (error) {
    return <ErrorComponent message={error.message} />;
  }
  return (
    <>
      <DynamicTitle />
      <div className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 md:w-1/2 lg:w-2/3 relative transition-all duration-300 h-full">
          <MapView trips={trips} />
        </div>

        {isMobile && (
          <BottomDrawer>
            <div className="w-full h-full">
              <TripSwiper />
              <PhotoCarousel />
            </div>
          </BottomDrawer>
        )}
        {!isMobile && <DesktopSidebar />}

        {!isLoaded && <SnapIterLoader trackable={trackable ?? null} />}

        <div className="hidden md:block absolute bottom-4 left-4 z-10">
          <Brand />
        </div>
      </div>
    </>
  );
}
