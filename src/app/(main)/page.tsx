'use client';

import { useEffect, useMemo, useState } from 'react';
import MapView from '@/components/map/MapView';
import BottomDrawer from '@/components/map/mobile/BottomDrawer';
import TripSwiper from '@/components/map/mobile/TripSwiper';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import Brand from '@/components/Brand';
import { useHostname } from '@/hooks/useApiData';
import { useWebsite } from '@/hooks/useWebsite';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useAtomValue } from 'jotai';
import { mapEventsAtom } from '@/store/atoms';
import { useTrips } from '@/hooks/useTrips';
import ErrorComponent from '@/components/ErrorComponent';
import DesktopSidebar from '@/components/map/desktop/DesktopSidebar';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const hostname = useHostname();
  const { data: website, isLoading, error } = useWebsite(hostname);
  const { runCommand } = useMapCommands();
  const mapEvents = useAtomValue(mapEventsAtom);

  const mapReady = mapEvents.some(event => event.type === 'MAP_READY');

  const { data: trips = [], isLoading: tripsLoading } = useTrips(website?.trackableId ?? null);

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
      <DynamicTitle title={website?.title} />
      <div className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Single MapView - responsive sizing */}
        <div className={`flex-1 md:w-1/2 lg:w-2/3 relative transition-all duration-300 h-full
          `}>
          <MapView trips={trips} websiteIcon={website?.icon} />
        </div>

        {/* Mobile: Sliding Panel */}
        <div className="md:hidden">
          <BottomDrawer>
            {trips.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted">No trips found.</p>
              </div>
            ) : (
              <TripSwiper trips={trips} />
            )}
          </BottomDrawer>
        </div>

        <DesktopSidebar trips={trips} title={website?.title} />

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
