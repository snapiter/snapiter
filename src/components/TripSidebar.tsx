'use client';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  distance: string;
}

interface TripSidebarProps {
  trips: Trip[];
  activeIndex: number;
  onTripSelect: (index: number) => void;
}

export default function TripSidebar({ trips, activeIndex, onTripSelect }: TripSidebarProps) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Trips</h2>
        <p className="text-sm text-gray-500">{trips.length} voyages</p>
      </div>
      
      <div className="p-2">
        {trips.map((trip, index) => (
          <button
            key={trip.id}
            onClick={() => onTripSelect(index)}
            className={`w-full p-3 mb-2 rounded-lg text-left transition-colors hover:bg-white hover:shadow-sm ${
              index === activeIndex
                ? 'bg-white shadow-sm border-l-4 border-blue-500'
                : 'bg-transparent'
            }`}
          >
            <h3 className={`font-medium truncate ${
              index === activeIndex ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {trip.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {trip.startDate} - {trip.endDate}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {trip.distance}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}