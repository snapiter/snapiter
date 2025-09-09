'use client';

import Image from 'next/image';
import { type Trip } from '@/store/atoms';
import { useEffect, useState } from 'react';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import { FaRoute } from 'react-icons/fa6';

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
      const selectedTripIndex = trips.findIndex(trip => trip.slug === selectedTrip.trip?.slug);
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
            style={{ '--trip-color': trip.color ?? 'transparent' } as React.CSSProperties}
            className={`w-full p-3 mb-2 cursor-pointer rounded-lg text-left transition-colors
              hover:bg-background hover:shadow-sm border-l-4
              ${index === displayActiveIndex
                ? 'bg-background shadow-sm border-[var(--trip-color)]'
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
                  {formatDate(trip.startDate)}
                  {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
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