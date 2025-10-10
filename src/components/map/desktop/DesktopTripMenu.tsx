'use client';

import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';
import { FaRoute } from 'react-icons/fa6';
import { formatTripDate } from '@/utils/formatTripDate';
import { useTripsByHostname } from '@/hooks/trips/useTripsByHostname';
import { useTrackableByHostname } from '@/hooks/trackable/useTrackableByHostname';
import { Logo } from '@snapiter/designsystem';
import { useSetAtom } from 'jotai';
import { selectedTripAtom } from '@/store/atoms';

export default function DesktopTripMenu() {
  const { trips: trips } = useTripsByHostname();
  const selectedTrip = useSelectedTrip();
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const { data: trackable } = useTrackableByHostname();

  const displayActiveIndex = trips.findIndex(trip => trip.slug === selectedTrip?.trip?.slug);

  const handleTripSelect = (index: number) => {
    setSelectedTrip(trips[index].slug);
  };

  
  if(trips.length === 0) {
    return <></>
  }

  return (
    <div className="w-full bg-surface border-r border-border h-full overflow-y-auto flex-1">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Logo size="md" showTitle={true} title={trackable?.title}/>
        </div>
        <p className="text-sm text-muted">
          {trips.length} {trips.length === 1 ? 'Journey' : 'Journeys'}
        </p>
      </div>
      <div className="p-2">
        {trips.map((trip, index) => (
          <button
            key={`button-${trip.slug}`}
            onClick={() => handleTripSelect(index)}
            style={{ '--trip-color': trip.color ?? 'transparent' } as React.CSSProperties}
            className={`w-full p-3 mb-2 cursor-pointer rounded-lg text-left transition-colors
              hover:bg-background border-l-4
              ${index === displayActiveIndex
                ? 'bg-background border-[var(--trip-color)]'
                : 'bg-transparent border-transparent hover:border-[var(--trip-color)]'
              }`}
          >
            <div className="flex items-center justify-between mb-1 pointer-events-none">
              <div className="flex flex-col  mb-1 pointer-events-none">
                <h3 className={`font-medium truncate ${index === displayActiveIndex ? 'text-primary' : 'text-foreground'
                  }`}>
                  {trip.title}
                </h3>
                <p className="text-sm text-muted mt-1 pointer-events-none">
                  {formatTripDate(trip.startDate, trip.endDate)}
                </p>
              </div>

              {trip.color && (
                <FaRoute className="w-10 h-10" color={trip.color} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}