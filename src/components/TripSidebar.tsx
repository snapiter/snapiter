'use client';

import Image from 'next/image';
import { mapEventsAtom, type Trip } from '@/store/atoms';
import { useWebsite } from '@/hooks/useApiData';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

interface TripSidebarProps {
  trips: Trip[];
  activeIndex: number;
  onTripSelect: (index: number) => void;
}

export default function TripSidebar({ trips, activeIndex, onTripSelect }: TripSidebarProps) {
  const website = useWebsite()
  const mapEvents = useAtomValue(mapEventsAtom);
  const { runCommand } = useMapCommands();
  const [displayActiveIndex, setDisplayActiveIndex] = useState(activeIndex);

  // Sync displayActiveIndex with prop changes
  useEffect(() => {
    setDisplayActiveIndex(activeIndex);
  }, [activeIndex]);
    
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };




  // Listen to TRIP_HOVERED and TRIP_BLURRED events to update hover state
  useEffect(() => {
    const lastEvent = mapEvents[mapEvents.length - 1];
    if (!lastEvent) return;

    if(lastEvent.type === 'TRIP_SELECTED') {
      // Update visual state without triggering onTripSelect side effects
      const selectedTripIndex = trips.findIndex(trip => trip.slug === lastEvent.tripSlug);
      if (selectedTripIndex !== -1) {
        setDisplayActiveIndex(selectedTripIndex);
      }
    }
  }, [mapEvents]);

  return (
    <div className="w-64 bg-surface border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Image 
            src="/logo.svg" 
            alt="SnapIter" 
            width={32} 
            height={32} 
            className="flex-shrink-0"
          />
          <h1 className="text-xl font-bold text-foreground">
            {website.website?.websiteTitle ?? (
              <>
                <span className="text-primary">S</span>nap
                <span className="text-primary">I</span>ter
              </>
            )}
          </h1>

        </div>
        <p className="text-sm text-muted">
          {trips.length} {trips.length === 1 ? 'Journey' : 'Journeys'}
        </p>
      </div>
      
      <div className="p-2">
        {trips.map((trip, index) => (
          <button
            key={`button-${trip.slug}`}
            onClick={() => onTripSelect(index)}
            onMouseOver={() => {
              runCommand({ type: 'HOVER_TRIP', tripSlug: trip.slug, fitBounds: true });
            }}
            className={`w-full p-3 mb-2 cursor-pointer rounded-lg text-left transition-colors hover:bg-background hover:shadow-sm ${
              index === displayActiveIndex
                ? 'bg-background shadow-sm border-l-4 border-primary'
                : 'bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${
                index === displayActiveIndex ? 'text-primary' : 'text-foreground'
              }`}>
                {trip.title}
              </h3>
              {trip.color && (
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: trip.color }}
                />
              )}
            </div>
            <p className="text-sm text-muted mt-1">
              {formatDate(trip.startDate)}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
            </p>
            <p className="text-xs text-muted mt-1">
              {trip.positionType}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}