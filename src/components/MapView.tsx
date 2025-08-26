'use client';

import Map, { Source, Layer, MapRef, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Position, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useEffect, useState } from 'react';

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
  const mapRef = useRef<MapRef | null>(null);

  const [lineProgressIndex, setLineProgressIndex] = useState(1);

  // Get positions of the selected trip
  const selectedTripData = selectedTrip
    ? tripsWithPositions.find(t => t.trip.id === selectedTrip.id)
    : null;

  const activePositions = selectedTripData?.positions ?? [];

  // Fit map bounds when positions change
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
      { padding: 40, duration: 1000 }
    );
  }, [activePositions]);

  // Animate the dashed line
  useEffect(() => {
    if (!selectedTripData || activePositions.length < 2) {
      setLineProgressIndex(1);
      return;
    }

    setLineProgressIndex(1);

    const duration = selectedTripData.trip.animationSpeed ?? 5000;
    const stepTime = duration / (activePositions.length - 1);

    let index = 1;
    const interval = setInterval(() => {
      index += 1;
      if (index >= activePositions.length) {
        clearInterval(interval);
        index = activePositions.length - 1;
      }
      setLineProgressIndex(index);
    }, stepTime);

    return () => clearInterval(interval);
  }, [selectedTripData, activePositions]);

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
        {tripsWithPositions.map(tripData => {
          if (tripData.positions.length < 2) return null;

          const color = tripData.trip.color || '#3b82f6';
          const isSelected = tripData.trip.id === selectedTrip?.id;

          const displayedCoordinates = isSelected
            ? tripData.positions.slice(0, lineProgressIndex + 1).map(p => [p.longitude, p.latitude])
            : tripData.positions.map(p => [p.longitude, p.latitude]);

          if (displayedCoordinates.length < 2) return null;

          const routeData = {
            type: 'FeatureCollection' as const,
            features: [{
              type: 'Feature' as const,
              properties: {},
              geometry: {
                type: 'LineString' as const,
                coordinates: displayedCoordinates,
              },
            }],
          };

          return (
            <Source
              key={tripData.trip.id}
              id={`route-${tripData.trip.id}`}
              type="geojson"
              data={routeData}
            >
              <Layer
                id={`route-line-${tripData.trip.id}`}
                type="line"
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round',
                }}
                paint={{
                  'line-width': 4,
                  'line-color': color,
                  'line-opacity': isSelected ? 1.0 : 0.2,
                  // 'line-dasharray': [4, 2],
                }}
              />
            </Source>
          );
        })}

        {/* Marker at the front of the animated line */}
        {selectedTripData && lineProgressIndex > 0 && lineProgressIndex < activePositions.length && (
          <Marker
            longitude={activePositions[lineProgressIndex].longitude}
            latitude={activePositions[lineProgressIndex].latitude}
            color="red"
            anchor="center"
          />
        )}
      </Map>
    </div>
  );
}
