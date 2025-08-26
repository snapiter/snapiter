'use client';

import PhotoCarousel from './PhotoCarousel';
import { type Trip } from '@/store/atoms';
import { useMarkers } from '@/hooks/useApiData';
import { useEffect } from 'react';

interface TripDetailsProps {
  trip: Trip;
  className?: string;
}

export default function TripDetails({ trip, className = '' }: TripDetailsProps) {
  const { markers, isLoading: markersLoading } = useMarkers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const photosFromMarkers = markers
    .filter(marker => marker.hasThumbnail)
    .map(marker => ({
      id: marker.id,
      url: `/api/marker/${marker.markerId}/thumbnail`, // Assuming thumbnail endpoint
      alt: marker.title || 'Marker photo',
      caption: marker.description
    }));

  const allPhotos = [...(trip.photos || []), ...photosFromMarkers];

  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
          <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
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
        <p className="text-gray-700 text-sm leading-relaxed">{trip.description}</p>
      </div>
      
      {markersLoading && (
        <div className="mb-4 text-sm text-gray-500">
          Loading photos...
        </div>
      )}

      {allPhotos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Photos ({allPhotos.length})</h3>
          <PhotoCarousel photos={allPhotos} />
        </div>
      )}

      {markers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Markers ({markers.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {markers.slice(0, 5).map(marker => (
              <div key={marker.id} className="p-2 bg-gray-50 rounded text-sm">
                <div className="font-medium">{marker.title}</div>
                {marker.description && (
                  <div className="text-gray-600 text-xs mt-1">{marker.description}</div>
                )}
                <div className="text-gray-500 text-xs mt-1">
                  {formatDate(marker.createdAt)}
                </div>
              </div>
            ))}
            {markers.length > 5 && (
              <div className="text-xs text-gray-500 text-center py-1">
                ... and {markers.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}