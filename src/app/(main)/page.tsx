"use client";

import { useEffect, useRef, useState } from 'react';
import MapView from '@/components/map/MapView';
import BottomDrawer from '@/components/map/mobile/BottomDrawer';
import TripSwiper from '@/components/map/mobile/TripSwiper';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import Brand from '@/components/Brand';
import { useTrackableByHostname } from '@/hooks/trackable/useTrackableByHostname';
import { useAtomValue, useSetAtom } from 'jotai';
import { mapReadyAtom, selectedTripAtom } from '@/store/atoms';
import ErrorComponent from '@/components/ErrorComponent';
import DesktopSidebar from '@/components/map/desktop/DesktopSidebar';
import PhotoCarousel from '@/components/map/mobile/PhotoCarousel';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTripsByHostname } from '@/hooks/trips/useTripsByHostname';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { data: website, isLoading, error } = useTrackableByHostname();
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const mapReady = useAtomValue(mapReadyAtom);

  const { data: trips = [], isLoading: tripsLoading } = useTripsByHostname();

  useEffect(() => {
    if (website && mapReady && !isLoading && !tripsLoading) {
      setTimeout(() => {
        setIsLoaded(true);
        if (trips.length > 0) {
          setSelectedTrip(trips[0].slug);
        }
      }, 1000);
    }
  }, [website, mapReady, trips, isLoading, setSelectedTrip]);


  if (error) {
    return (
      <ErrorComponent message={error.message} />
    );
  }

  return (
    <>
      <DynamicTitle />
      <div className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Single MapView - responsive sizing */}
        <div className="flex-1 md:w-1/2 lg:w-2/3 relative transition-all duration-300 h-full">
          <MapView trips={trips} />
        </div>

        {isMobile && (
          <BottomDrawer>
            <div className="w-full h-full">
              <TripSwiper />
              <PhotoCarousel />
            </div>
          </BottomDrawer>)
          }
        {!isMobile && (
          <DesktopSidebar />
        )}

        {/* Loading Overlay */}
        {(!isLoaded) && (
          <SnapIterLoader website={website ?? null} />
        )}

        {/* Brand - Bottom Left (Desktop Only) */}
        <div className="hidden md:block absolute bottom-4 left-4 z-10">
          <Brand />
        </div>
      </div>
    </>
  );
}
