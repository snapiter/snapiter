'use client';

import { useMemo } from 'react';
import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';
import DesktopTripView from '@/components/DesktopTripView';
import SnapIterLoader from '@/components/SnapIterLoader';
import { useWebsite } from '@/hooks/useApiData';
import { useAtomValue } from 'jotai';
import { errorAtom, bottomPanelExpandedAtom } from '@/store/atoms';

export default function Home() {
  const { website, isLoading: websiteLoading } = useWebsite();
  const error = useAtomValue(errorAtom);
  const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);
  
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

  if (websiteLoading || trips.length === 0) {
    return <SnapIterLoader />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        <MapView 
          className={`transition-all duration-300 ${
            isPanelExpanded ? 'h-[calc(40vh+36px)]' : 'h-[calc(100vh-36px)]'
          }`} 
          trips={trips}
        />
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

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <div className="flex-1 relative">
          <MapView className="h-full" trips={trips} />
        </div>
        <div className="w-[600px] bg-background shadow-xl overflow-hidden">
          <DesktopTripView trips={trips} />
        </div>
      </div>
    </div>
  );
}
