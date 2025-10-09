import PhotoGrid from '../../PhotoGrid';
import { FaRoute } from 'react-icons/fa6';
import DayAndPhoto from '../DayAndPhoto';
import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';

export default function DesktopMarkerMenu() {
  const { trip } = useSelectedTrip();

  if (trip === undefined || trip === null) {
    return <></>
  }

  if (trip.markers.length === 0) {
    return <></>
  }

  return (

    <div className="h-full flex flex-col">
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        {/* Sticky header */}
        <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-foreground mb-2 mt-2">{trip.title}</h2>
            <FaRoute className="w-4 h-4" color={trip.color} />
          </div>
          <DayAndPhoto
            startDate={trip.startDate}
            endDate={trip.endDate}
            markersLength={trip.markers.length}
          />
        </div>

        <div className="flex-1  overflow-y-auto">
          <PhotoGrid markers={trip.markers} />
        </div>
      </div>
    </div>
  );
}