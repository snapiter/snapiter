'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';
import DesktopTripView from '@/components/DesktopTripView';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import Brand from '@/components/Brand';
import { useHostname } from '@/hooks/useApiData';
import { useWebsite } from '@/hooks/useWebsite';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useAtomValue } from 'jotai';
import { bottomPanelExpandedAtom, mapEventsAtom, PageType, MapStyle } from '@/store/atoms';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const hostname = useHostname();
  const { data: website, isLoading, error } = useWebsite(hostname);
  const { runCommand } = useMapCommands();
  const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);
  const mapEvents = useAtomValue(mapEventsAtom);

  // Check if map is ready by looking for MAP_READY events
  const mapReady = mapEvents.some(event => event.type === 'MAP_READY');

  const trips = useMemo(() => {
    const tripsArray = website?.trips || [];
    return tripsArray.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [website]);

  useEffect(() => {
    if (website && mapReady && trips.length > 0 && !isLoading) {
      setTimeout(() => {
        setIsLoaded(true);
        runCommand({
          type: 'SELECT_TRIP',
          tripSlug: trips[0].slug
        });
      }, 1000);
    }
  }, [website, mapReady, trips, isLoading, runCommand]);


  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-error mb-2">Error Loading Iter's</h2>
          <p className="text-muted">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicTitle title={website?.websiteTitle} />
      <div className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Single MapView - responsive sizing */}
        <div className={`flex-1 md:w-1/2 lg:w-2/3 relative transition-all duration-300 ${
          // Mobile: dynamic height based on panel state
          isPanelExpanded
            ? 'h-[calc(40vh+36px)] md:h-full'
            : 'h-[calc(100vh-36px)] md:h-full'
          }`}>
          <MapView trips={trips} mapStyle={website?.mapStyle ?? MapStyle.LANDSCAPE} websiteIcon={website?.icon} />
        </div>

        {/* Mobile: Sliding Panel */}
        <div className="md:hidden">
          <SlidingPanel>
            {trips.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted">No Iter's found.</p>
              </div>
            ) : (
              <TripSwiper trips={trips} />
            )}
          </SlidingPanel>
        </div>

        {/* Desktop: Side Panel */}
        <div className="hidden md:block md:w-1/2 lg:w-1/3 bg-background shadow-xl overflow-hidden">
          <DesktopTripView trips={trips} pageType={website?.pageType ?? null} websiteTitle={website?.websiteTitle} />
        </div>

        {/* Loading Overlay */}
        {(!isLoaded) && (
          <div className="absolute inset-0 z-[200]">
            <SnapIterLoader website={website} />
          </div>
        )}

        {/* Brand - Bottom Left (Desktop Only) */}
        <div className="hidden md:block absolute bottom-4 left-4 z-10">
          <Brand />
        </div>
      </div>
    </>
  );
}
