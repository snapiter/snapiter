'use client';

import PhotoCarousel, { type Photo } from './PhotoCarousel';
import PhotoGrid from './PhotoGrid';
import type { Trip } from '@/store/atoms';

interface TripDetailsProps {
  trip: Trip;
}

export default function TripDetails({ trip}: TripDetailsProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const photosFromMarkers: Photo[] = (trip.markers || [])
    .filter(marker => marker.hasThumbnail)
    .map(marker => ({
      id: marker.id,
      url: `https://cache.partypieps.nl/marker/${marker.markerId}`,
      alt: marker.title || 'Marker photo',
      caption: marker.description
    }));


  return (
    <div className={`h-full overflow-y-auto`}>
      <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
        <h2 className="text-xl font-bold text-foreground mb-2">{trip.title}</h2>
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

      {photosFromMarkers.length > 0 && (
        <div className="mb-4">
          {/* Desktop: Show grid, Mobile: Show carousel */}
          <div className="hidden md:block">
            <PhotoGrid photos={photosFromMarkers} />
          </div>
          <div className="block md:hidden">
            <PhotoCarousel photos={photosFromMarkers} />
          </div>
        </div>
      )}
    </div>
  );
}