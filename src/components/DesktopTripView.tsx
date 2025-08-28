'use client';

import { useState } from 'react';
import TripSidebar from './TripSidebar';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';

interface DesktopTripViewProps {
  trips: Trip[];
}

export default function DesktopTripView({ trips }: DesktopTripViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { runCommand } = useMapCommands();

  const handleTripSelect = (index: number) => {
    setActiveIndex(index);
    runCommand({
      type: 'ANIMATE_TRIP',
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
    <div className="flex h-full">
      <TripSidebar 
        trips={trips} 
        activeIndex={activeIndex} 
        onTripSelect={handleTripSelect} 
      />
      <div className="flex-1 overflow-y-auto">
        <TripDetails trip={trips[activeIndex]} />
      </div>
    </div>
  );
}