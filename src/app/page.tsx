'use client';

import { useState, useMemo } from 'react';
import MapView from '@/components/MapView';
import SlidingPanel from '@/components/SlidingPanel';
import TripSwiper from '@/components/TripSwiper';
import DesktopTripView from '@/components/DesktopTripView';
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
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (websiteLoading || trips.length == 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website...</p>
        </div>
      </div>
    );
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
              <p className="text-gray-600">No trips found.</p>
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
        <div className="w-[600px] bg-white shadow-xl overflow-hidden">
          <DesktopTripView trips={trips} />
        </div>
      </div>
    </div>
  );
}
