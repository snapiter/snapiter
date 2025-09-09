'use client';

import PhotoGrid from './PhotoGrid';
import type { Marker, Trip } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/api';
import Image from 'next/image';

interface TripDetailsProps {
  trip: Trip;
  isSelected: boolean;
  selectedTripMarkers: Marker[];
}

export default function TripDetails({ trip, isSelected, selectedTripMarkers }: TripDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className={`h-full overflow-y-auto`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
          <h2 className="text-xl font-bold text-foreground mb-2 mt-2 text-center">{trip.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
            <span>
              {formatDate(trip.startDate)}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
            </span>
            {trip.color && (
              <span className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: trip.color }}
                />
                Route
              </span>
            )}
          </div>
          <p className="text-foreground text-sm leading-relaxed">{trip.description}</p>
        </div>
      </div>
      {selectedTripMarkers.length > 0 && (
        <div className="hidden md:block">
          <PhotoGrid markers={selectedTripMarkers} />
        </div>
      )}


      <div className="block md:hidden">
        <div className="flex border border-border rounded-lg items-center space-x-2 p-2 min-h-[88px]">
        {selectedTripMarkers.length > 0 && (
            isSelected ? (
              <div className="max-w-1/3 flex-shrink-0">
                <Image
                  src={getMarkerUrlThumbnail(selectedTripMarkers[0].markerId)}
                  alt={selectedTripMarkers[0].title}
                  className="object-cover rounded-lg h-16 w-16"
                  width={64}
                  height={64}
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg bg-surface flex-shrink-0 animate-pulse" />
            )
          )}

          <div className="flex-1">
            <h2 className="text-xl font-bold">{trip.title}</h2>
            <p className="mt-2 text-foreground">
              {formatDate(trip.startDate)}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}