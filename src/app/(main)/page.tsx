"use client";

import { useEffect, useState } from 'react';
import MapView from '@/components/map/MapView';
import BottomDrawer from '@/components/map/mobile/BottomDrawer';
import TripSwiper from '@/components/map/mobile/TripSwiper';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import Brand from '@/components/Brand';
import { useTrackableByHostname } from '@/hooks/trackable/useTrackableByHostname';
import { useMapCommands } from '@/hooks/commands/useMapCommands';
import { useAtomValue } from 'jotai';
import { mapEventsAtom } from '@/store/atoms';
import ErrorComponent from '@/components/ErrorComponent';
import DesktopSidebar from '@/components/map/desktop/DesktopSidebar';
import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';
import PhotoCarousel from '@/components/map/mobile/PhotoCarousel';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTripsByHostname } from '@/hooks/trips/useTripsByHostname';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  const { data: website, isLoading, error } = useTrackableByHostname();
  const { runCommand } = useMapCommands();
  const mapEvents = useAtomValue(mapEventsAtom);

  const { trip: selectedTrip } = useSelectedTrip();
  const mapReady = mapEvents.some(event => event.type === 'MAP_READY');

  const { data: trips = [], isLoading: tripsLoading } = useTripsByHostname();

  useEffect(() => {
    if (website && mapReady && !isLoading && !tripsLoading) {
      setTimeout(() => {
        setIsLoaded(true);
        if (trips.length > 0) {
          runCommand({
            type: 'SELECT_TRIP',
            tripSlug: trips[0].slug
          });
        }
      }, 1000);
    }
  }, [website, mapReady, trips, isLoading, runCommand]);


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
              {selectedTrip?.markers && selectedTrip?.markers.length > 0 && (
                <div className="pt-4">
                  <PhotoCarousel markers={selectedTrip.markers} />
                </div>
              )}
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
