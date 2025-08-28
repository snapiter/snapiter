'use client';

import Image from 'next/image';
import type { Trip } from '@/store/atoms';

interface TripSidebarProps {
  trips: Trip[];
  activeIndex: number;
  onTripSelect: (index: number) => void;
}

export default function TripSidebar({ trips, activeIndex, onTripSelect }: TripSidebarProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

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
          <h1 className="text-xl font-bold text-foreground">SnapIter</h1>
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
              index === activeIndex
                ? 'bg-background shadow-sm border-l-4 border-primary'
                : 'bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${
                index === activeIndex ? 'text-primary' : 'text-foreground'
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