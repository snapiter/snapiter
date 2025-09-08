'use client';

import Image from 'next/image';
import { type Trip } from '@/store/atoms';
import { useEffect, useState } from 'react';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';

interface TripSidebarProps {
  trips: Trip[];
  activeIndex: number;
  onTripSelect: (index: number) => void;
  websiteTitle?: string;
}

export default function TripSidebar({ trips, activeIndex, onTripSelect, websiteTitle }: TripSidebarProps) {
  const selectedTrip = useSelectedTrip();
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

  useEffect(() => {
    if (selectedTrip) {
      const selectedTripIndex = trips.findIndex(trip => trip.slug === selectedTrip.slug);
      if (selectedTripIndex !== -1) {
        setDisplayActiveIndex(selectedTripIndex);
      }
    }
  }, [selectedTrip]);


  return (
    <div className="w-full bg-surface border-r border-border h-full overflow-y-auto">
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
            {websiteTitle ?? (
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
            className={`w-full p-3 mb-2 cursor-pointer rounded-lg text-left transition-colors hover:bg-background hover:shadow-sm ${
              index === displayActiveIndex
                ? 'bg-background shadow-sm border-l-4 border-primary'
                : 'bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1 pointer-events-none">
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
            <p className="text-sm text-muted mt-1 pointer-events-none">
              {formatDate(trip.startDate)}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
            </p>
            <p className="text-xs text-muted mt-1 pointer-events-none">
              {trip.positionType}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}