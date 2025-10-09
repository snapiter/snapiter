import type { Trip, TripWithMarkers } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/thumbnail';
import Image from 'next/image';
import DayAndPhoto from '../DayAndPhoto';
import { useTripWithMarkers } from '@/hooks/useTripWithMarkers';

interface TripDetailsProps {
  trip: Trip;
}

export default function MobileTripDetails({ trip }: TripDetailsProps) {
  const { data: tripWithMarkers } = useTripWithMarkers(trip);
  if (trip === undefined || trip === null || tripWithMarkers === undefined) {
    return <></>
  }

  return (
      <div className="h-full flex flex-col">
        <div className="block md:hidden">
          <div
            style={{ '--trip-color': trip.color ?? 'transparent' } as React.CSSProperties}
            className="flex border border-[var(--trip-color)] rounded-lg items-center space-x-2 p-2 min-h-22"
          >
            {tripWithMarkers.markers.length > 0 ? (
                <div className="max-w-1/3 flex-shrink-0">
                  <Image
                    src={getMarkerUrlThumbnail(tripWithMarkers.markers[0])}
                    alt={tripWithMarkers.markers[0].title}
                    className="object-cover rounded-lg h-16 w-16"
                    width={64}
                    height={64}
                  />
                </div>
              ) : (<></>)
            }

            <div className="flex-1">
              <h2
                title={trip.title}
                className="font-bold text-lg line-clamp-1"
              >
                {trip.title}
              </h2>
              <DayAndPhoto startDate={trip.startDate} endDate={trip.endDate} markersLength={tripWithMarkers.markers.length} />
            </div>
          </div>
        </div>
      </div>

  );
}