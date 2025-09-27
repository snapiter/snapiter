import DesktopMarkerMenu from './DesktopMarkerMenu';
import { type Trip } from '@/store/atoms';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import DesktopTripMenu from './DesktopTripMenu';

interface DesktopSidebarProps {
  trips: Trip[];
  title?: string;
}

export default function DesktopSidebar({ trips, title }: DesktopSidebarProps) {
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
      <DesktopTripMenu 
        trips={trips} 
        title={title}
      />
      <DesktopMarkerMenu 
        trip={selectedTrip} 
        isSelected={true} 
        markers={markers} 
      />
  </div>
</div>

  );
}