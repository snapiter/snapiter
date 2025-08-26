'use client';

import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Position, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useEffect } from 'react';

interface TripWithPositions {
  trip: Trip;
  positions: Position[];
}

interface MapViewProps {
  className?: string;
  tripsWithPositions?: TripWithPositions[];
}

export default function MapView({ className, tripsWithPositions = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const mapRef = useRef<MapRef>(null);

  // All positions of either selected trip or all trips
  const activePositions =
    selectedTrip
      ? tripsWithPositions.find(t => t.trip.id === selectedTrip.id)?.positions ?? []
      : tripsWithPositions.flatMap(t => t.positions);

  // On mount or when trips change → fit bounds
  useEffect(() => {
    if (!mapRef.current || activePositions.length === 0) return;

    const lats = activePositions.map(p => p.latitude);
    const lngs = activePositions.map(p => p.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 1000 } // padding around bounds + animation
    );
  }, [activePositions]);

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 5.12142010,
          latitude: 52.09073740,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl={true}
      >
        {tripsWithPositions.map((tripData) => {
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
