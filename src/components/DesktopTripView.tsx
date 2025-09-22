'use client';

import TripSidebar from './TripSidebar';
import TripDetails from './TripDetails';
import { type Trip } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';

interface DesktopTripViewProps {
  trips: Trip[];
  title?: string;
}

export default function DesktopTripView({ trips, title }: DesktopTripViewProps) {
  const { runCommand } = useMapCommands();

  const { trip: selectedTrip } = useSelectedTrip();

  const activeIndex = trips.findIndex(trip => trip.slug === selectedTrip?.slug);


  const markers = selectedTrip?.markers ?? [];


  const handleTripSelect = (index: number) => {
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
          onTripSelect={handleTripSelect}
          title={title}
        />
      </div>
      {markers.length > 0 && (
        <div className="w-1/2 overflow-y-auto">
          <TripDetails trip={trips[activeIndex]} isSelected={selectedTrip?.slug === trips[activeIndex]?.slug} selectedTripMarkers={markers} />
        </div>
      )}
    </div>
  );
}