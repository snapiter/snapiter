'use client';

import PhotoGrid from './PhotoGrid';
import type { Marker, Trip } from '@/store/atoms';
import { getMarkerUrlThumbnail } from '@/services/thumbnail';
import Image from 'next/image';
import { FaRoute } from 'react-icons/fa6';
import DayAndPhoto from './DayAndPhoto';

interface TripDetailsProps {
  trip: Trip;
  isSelected: boolean;
  selectedTripMarkers: Marker[];
}

export default function TripDetails({ trip, isSelected, selectedTripMarkers }: TripDetailsProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-foreground mb-2 mt-2">{trip.title} </h2>
            <FaRoute className="w-4 h-4" color={trip.color} />
          </div>
          <DayAndPhoto startDate={trip.startDate} endDate={trip.endDate} isSelected={isSelected} markersLength={selectedTripMarkers.length} />
        </div>
        {selectedTripMarkers.length > 0 && (
          <div className="overflow-y-auto">
            <PhotoGrid markers={selectedTripMarkers} />
          </div>
        )}
      </div>

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
            <DayAndPhoto startDate={trip.startDate} endDate={trip.endDate} isSelected={isSelected} markersLength={selectedTripMarkers.length} />

          </div>
        </div>
      </div>

    </div>
  );
}