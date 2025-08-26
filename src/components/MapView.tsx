'use client';

import Map, { Source, Layer, MapRef, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Position, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useEffect, useState } from 'react';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
console.log("MAPVIEW RENDER" + trips.length)

  const selectedTrip = useAtomValue(selectedTripAtom);
  const mapRef = useRef<MapRef | null>(null);

  const [lineProgressIndex, setLineProgressIndex] = useState(1);

  const activePositions = selectedTrip?.positions ?? [];

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



    if (activePositions.length < 2) {
      setLineProgressIndex(1);
      return;
    }

    setLineProgressIndex(1);

    const duration = selectedTrip?.animationSpeed ?? 5000;
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
        {trips.map(trip => {
          if (trip.positions.length < 2) return null;

          const color = trip.color || '#3b82f6';
          const isSelected = trip.id === selectedTrip?.id;

          const displayedCoordinates = isSelected
            ? trip.positions.slice(0, lineProgressIndex + 1).map(p => [p.longitude, p.latitude])
            : trip.positions.map(p => [p.longitude, p.latitude]);

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
              key={`${trip.id}-${trip.slug}`}
              id={`route-${trip.id}`}
              type="geojson"
              data={routeData}
            >
              <Layer
                id={`route-line-${trip.id}`}
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
        {selectedTrip && lineProgressIndex > 0 && lineProgressIndex < activePositions.length && (
          <Marker
            longitude={activePositions[lineProgressIndex].longitude}
            latitude={activePositions[lineProgressIndex].latitude}
            anchor="center"
          >
            <img
              src="/assets/icons/van-passenger.svg"
              alt="car"
              style={{ width: 32, height: 32, transform: 'translate(-10%, -10%)' }} // center the icon
            />
          </Marker>

        )}
      </Map>
    </div>
  );
}
