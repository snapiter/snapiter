'use client';

import TripSidebar from './TripSidebar';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';

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
    <div className={`h-full hidden md:block md:w-1/2 lg:w-1/3 `}>
        <TripSidebar 
          trips={trips} 
          title={title}
        />
        <div className="flex-1 overflow-y-auto">
          <TripDetails trip={selectedTrip} isSelected={true} markers={markers} />
        </div>
    </div>
  );
}