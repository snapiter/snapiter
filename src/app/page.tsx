'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';
import DesktopTripView from '@/components/DesktopTripView';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import { useWebsite, useHostname } from '@/hooks/useApiData';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useAtomValue } from 'jotai';
import { errorAtom, bottomPanelExpandedAtom, mapEventsAtom, PageType } from '@/store/atoms';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const { website } = useWebsite();
  const hostname = useHostname();
  const { runCommand } = useMapCommands();
  const error = useAtomValue(errorAtom);
  const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);
  const mapEvents = useAtomValue(mapEventsAtom);

  // Check if map is ready by looking for MAP_READY events
  const mapReady = mapEvents.some(event => event.type === 'MAP_READY');

  // Check loading state - are we waiting for WEBSITE_LOADED event?
  const websiteReady = mapEvents.some(event => event.type === 'WEBSITE_LOADED');

  const trips = useMemo(() => {
    const tripsArray = website?.trips || [];
    return tripsArray.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [website]);

  // Trigger LOAD_WEBSITE command once when hostname is available
  useEffect(() => {
    if (!hostname || !mapReady || websiteReady) return;


    runCommand({ type: 'LOAD_WEBSITE', hostname });
  }, [hostname, mapReady, websiteReady, runCommand]);

  useEffect(() => {
    if (websiteReady && mapReady && trips.length > 0) {
      setTimeout(() => {
        setIsLoaded(true);
        runCommand({
          type: 'SELECT_TRIP',
          tripSlug: trips[0].slug
        });
      }, 1000)
      
    }
  }, [websiteReady, mapReady, trips])


  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-error mb-2">Error Loading Iter's</h2>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicTitle />
      <div className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Single MapView - responsive sizing */}
        <div className={`flex-1 relative transition-all duration-300 ${
          // Mobile: dynamic height based on panel state
          isPanelExpanded
            ? 'h-[calc(40vh+36px)] md:h-full'
            : 'h-[calc(100vh-36px)] md:h-full'
          }`}>
          <MapView trips={trips} />
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
        <div className="hidden md:block bg-background shadow-xl overflow-hidden">
          <DesktopTripView trips={trips} pageType={website?.pageType ?? null} />
        </div>

        {/* Loading Overlay */}
        {(!isLoaded) && (
          <div className="absolute inset-0 z-[200]">
            <SnapIterLoader website={website} />
          </div>
        )} 
      </div>
    </>
  );
}
