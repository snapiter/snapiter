'use client';

import PhotoCarousel from './PhotoCarousel';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  distance: string;
  photos: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }>;
}

interface TripDetailsProps {
  trip: Trip;
  className?: string;
}

export default function TripDetails({ trip, className = '' }: TripDetailsProps) {
  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
          <span>{trip.startDate} - {trip.endDate}</span>
          <span>{trip.distance}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{trip.description}</p>
      </div>
      
      {trip.photos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Photos</h3>
          <PhotoCarousel photos={trip.photos} />
        </div>
      )}
    </div>
  );
}