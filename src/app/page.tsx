'use client';

import { useMemo } from 'react';
import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';
import DesktopTripView from '@/components/DesktopTripView';
import SnapIterLoader from '@/components/SnapIterLoader';
import DynamicTitle from '@/components/DynamicTitle';
import { useWebsite } from '@/hooks/useApiData';
import { useAtomValue } from 'jotai';
import { errorAtom, bottomPanelExpandedAtom, mapReadyAtom } from '@/store/atoms';

export default function Home() {
  const { website, isLoading: websiteLoading } = useWebsite();
  const error = useAtomValue(errorAtom);
  const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);
  const mapReady = useAtomValue(mapReadyAtom);
  
  const trips = useMemo(() => {
    const tripsArray = website?.trips || [];
    return tripsArray.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [website]);


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
      <div className={`flex-1 transition-all duration-300 ${
        // Mobile: dynamic height based on panel state
        isPanelExpanded 
          ? 'h-[calc(40vh+36px)] md:h-full' 
          : 'h-[calc(100vh-36px)] md:h-full'
      }`}>
        <MapView className="w-full h-full" trips={trips} />
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
      <div className="hidden md:block w-[600px] bg-background shadow-xl overflow-hidden">
        <DesktopTripView trips={trips} />
      </div>

      {/* Loading Overlay */}
      {(websiteLoading || !mapReady || trips.length === 0) && (
        <div className="absolute inset-0 z-[200]">
          <SnapIterLoader />
        </div>
      )}
      </div>
    </>
  );
}
