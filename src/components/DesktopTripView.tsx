'use client';

import { useState } from 'react';
import TripSidebar from './TripSidebar';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';

interface DesktopTripViewProps {
  trips: Trip[];
  websiteTitle?: string;
}

export default function DesktopTripView({ trips, websiteTitle }: DesktopTripViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { runCommand } = useMapCommands();

  const { trip: selectedTrip, isLoading } = useSelectedTrip();

  const markers = selectedTrip?.slug === trips[activeIndex]?.slug ? selectedTrip?.markers : [];

  const handleTripSelect = (index: number) => {
    setActiveIndex(index);
    runCommand({
      type: 'SELECT_TRIP',
      tripSlug: trips[index].slug
    });
  };

  if (trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted">
          <p>No trips found for this vessel</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex h-full`}>
      <div className={markers.length > 0 ? "w-1/2" : "w-full"}>
        <TripSidebar 
          trips={trips} 
          activeIndex={activeIndex} 
          onTripSelect={handleTripSelect}
          websiteTitle={websiteTitle}
        />
      </div>
      {markers.length > 0 && (
        <div className="w-1/2 overflow-y-auto">
          <TripDetails trip={trips[activeIndex]} selectedTripMarkers={markers} />
        </div>
      )}
    </div>
  );
}