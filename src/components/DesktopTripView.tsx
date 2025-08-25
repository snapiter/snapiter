'use client';

import { useState } from 'react';
import TripSidebar from './TripSidebar';
import TripDetails from './TripDetails';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  distance: string;
  photos: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }>;
}

interface DesktopTripViewProps {
  trips: Trip[];
}

export default function DesktopTripView({ trips }: DesktopTripViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex h-full">
      <TripSidebar 
        trips={trips} 
        activeIndex={activeIndex} 
        onTripSelect={setActiveIndex} 
      />
      <div className="flex-1 p-6 overflow-y-auto">
        <TripDetails trip={trips[activeIndex]} className="h-full" />
      </div>
    </div>
  );
}