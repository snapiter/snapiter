'use client';

import { type Trip } from '@/store/atoms';

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
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Trips</h2>
        <p className="text-sm text-gray-500">{trips.length} Travels</p>
      </div>
      
      <div className="p-2">
        {trips.map((trip, index) => (
          <button
            key={`button-${trip.slug}`}
            onClick={() => onTripSelect(index)}
            className={`w-full p-3 mb-2 rounded-lg text-left transition-colors hover:bg-white hover:shadow-sm ${
              index === activeIndex
                ? 'bg-white shadow-sm border-l-4 border-blue-500'
                : 'bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${
                index === activeIndex ? 'text-blue-600' : 'text-gray-900'
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
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(trip.startDate)}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {trip.positionType}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}