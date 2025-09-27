'use client';

import DesktopTripDetails from './DesktopTripDetails';
import { type Trip } from '@/store/atoms';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import TripSidebar from './TripSidebar';

interface DesktopTripViewProps {
  trips: Trip[];
  title?: string;
}

export default function DesktopTripView({ trips, title }: DesktopTripViewProps) {
  const { trip: selectedTrip } = useSelectedTrip();
  const markers = selectedTrip?.markers ?? [];

  if(selectedTrip === null) {
    return <></>;
  }

  if (trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted">
          <p>No trips found</p>
        </div>
      </div>
    );
  }

  return (
<div className="h-full hidden md:block md:w-1/2 lg:w-1/3">
  <div className="flex h-full">
      <TripSidebar 
        trips={trips} 
        title={title}
      />
      <DesktopTripDetails 
        trip={selectedTrip} 
        isSelected={true} 
        markers={markers} 
      />
  </div>
</div>

  );
}