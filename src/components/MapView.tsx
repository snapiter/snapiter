'use client';

import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Position, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';

interface TripWithPositions {
  trip: Trip;
  positions: Position[];
}

interface MapViewProps {
  className?: string;
  tripsWithPositions?: TripWithPositions[];
}

export default function MapView({ className, tripsWithPositions = [] }: MapViewProps) {
  // Calculate bounds to fit all routes 

  const selectedTrip = useAtomValue(selectedTripAtom);

  const allPositions = tripsWithPositions.flatMap(t => t.positions);
  const bounds = allPositions.length > 0 ? {
    longitude: allPositions[0].longitude,
    latitude: allPositions[0].latitude,
    zoom: 8,
  } : {
    longitude: 5.12142010,
    latitude: 52.09073740,
    zoom: 12,
  };

  return (
    <div className={className}>
      <Map
        initialViewState={bounds}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl={true}
      >
        {tripsWithPositions.map((tripData, index) => {
          if (tripData.positions.length === 0) return null;
          
          const routeData = {
            type: 'FeatureCollection' as const,
            features: [{
              type: 'Feature' as const,
              properties: {},
              geometry: {
                type: 'LineString' as const,
                coordinates: tripData.positions.map(pos => [pos.longitude, pos.latitude])
              }
            }]
          };

          return (
            <Source key={tripData.trip.id} id={`route-${tripData.trip.id}`} type="geojson" data={routeData}>
              <Layer
                id={`route-line-${tripData.trip.id}`}
                type="line"
                paint={{
                  'line-color': tripData.trip.color || '#3b82f6',
                  'line-width': 3,
                  'line-opacity': tripData.trip.id === selectedTrip?.id ? 1.0 : 0.2
                }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
