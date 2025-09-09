'use client';

import PhotoGrid from './PhotoGrid';
import type { Marker, Trip } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/api';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
import { FaCalendar, FaCamera, FaRegCalendar, FaRoute } from 'react-icons/fa6';

interface TripDetailsProps {
  trip: Trip;
  isSelected: boolean;
  selectedTripMarkers: Marker[];
}

export default function TripDetails({ trip, isSelected, selectedTripMarkers }: TripDetailsProps) {
  return (
    <div className={`h-full overflow-y-auto`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
          <h2 className="text-xl font-bold text-foreground mb-2 mt-2">{trip.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
            {trip.color && (
              <span className="flex items-center gap-1">
                <FaRoute className="w-4 h-4" color={trip.color} />
              </span>
            )}
            <span>
              {formatDate(trip.startDate, trip.endDate)}
            </span>
          </div>
          <p className="text-foreground text-sm leading-relaxed">{trip.description}</p>
        </div>
      </div>
      {selectedTripMarkers.length > 0 && (
        <div className="hidden md:block">
          <PhotoGrid markers={selectedTripMarkers} />
        </div>
      )}

      {/* This is visible on mobile while bar is NOT expanded */}
      <div className="block md:hidden">
        <div
          style={{ '--trip-color': trip.color ?? 'transparent' } as React.CSSProperties}
          className="flex border border-[var(--trip-color)] rounded-lg items-center space-x-2 p-2 min-h-22"
        >
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
            <h2
              title={trip.title}
              className="font-bold text-lg line-clamp-1"
            >
              {trip.title}
            </h2>
            <p className="mt-2 text-foreground flex items-center space-x-4 text-sm">
              {/* Duration */}
              <span className="flex items-center space-x-1 text-muted">
                <FaRegCalendar className="w-4 h-4" />
                <span>{formatDate(trip.startDate, trip.endDate)}</span>
              </span>

              {/* Photos (only if selected & has photos) */}
              {isSelected && selectedTripMarkers.length > 0 && (
                <span className="flex items-center space-x-1 text-muted">
                  <FaCamera className="w-4 h-4" />
                  <span>{selectedTripMarkers.length}</span>
                </span>
              )}
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}