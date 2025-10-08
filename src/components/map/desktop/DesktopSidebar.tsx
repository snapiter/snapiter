import DesktopMarkerMenu from './DesktopMarkerMenu';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import DesktopTripMenu from './DesktopTripMenu';
import { useTripsByHostname } from '@/hooks/useTripsByHostname';

export default function DesktopSidebar() {
  const { data: trips } = useTripsByHostname();
  const { trip: selectedTrip } = useSelectedTrip();

  if (selectedTrip === undefined) {
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
        <DesktopTripMenu />
        <DesktopMarkerMenu />
      </div>
    </div>

  );
}