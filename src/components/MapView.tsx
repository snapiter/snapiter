'use client';

import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
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
  const [progress, setProgress] = useState<number>(1); // default: fully drawn when nothing is selected

  // Active positions for fitting bounds (selected trip or all)
  const activePositions =
    selectedTrip
      ? tripsWithPositions.find(t => t.trip.id === selectedTrip.id)?.positions ?? []
      : tripsWithPositions.flatMap(t => t.positions);

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

  // Animate line drawing when selectedTrip changes
  useEffect(() => {
    // if no trip selected => show everything
    if (!selectedTrip) {
      setProgress(1);
      return;
    }

    // reset and animate
    setProgress(0);

    const duration = selectedTrip.animationSpeed ?? 5000; // ms — adjust to change speed
    let rafId = 0;
    let startTime = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);
      setProgress(t);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    // small delay so the source/layer has time to be added to the map (helps in some setups)
    const timeout = window.setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 50);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, [selectedTrip, tripsWithPositions]);

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

          const coordinates = tripData.positions.map(pos => [pos.longitude, pos.latitude]);
          const routeData = {
            type: 'FeatureCollection' as const,
            features: [{
              type: 'Feature' as const,
              properties: {},
              geometry: {
                type: 'LineString' as const,
                coordinates
              }
            }]
          };

          const color = tripData.trip.color || '#3b82f6';
          const isSelected = tripData.trip.id === selectedTrip?.id;

          // If selected -> use gradient expression with 'step' so the line is colored up to `progress`
          // If not selected -> just show full color (optionally with lower opacity)
          const lineGradient = isSelected
            ? [
                'step',
                ['line-progress'],
                color,          // when line-progress < progress => color
                progress,       // stop
                'rgba(0,0,0,0)' // when line-progress >= progress => transparent
              ]
            : color;

          return (
            <Source
              key={tripData.trip.id}
              id={`route-${tripData.trip.id}`}
              type="geojson"
              data={routeData}
              lineMetrics={true} // required for line-progress
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
                  'line-opacity': isSelected ? 1.0 : 0.2,
                  'line-gradient': lineGradient as any,
                }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
