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
  const selectedTrip = useAtomValue(selectedTripAtom);
  const mapRef = useRef<MapRef | null>(null);
  const animationRef = useRef<number | null>(null);
  const markerRef = useRef<any>(null);

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

  // Animate using MapLibre native animation
  useEffect(() => {
    if (!mapRef.current || !selectedTrip || activePositions.length < 2) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const map = mapRef.current.getMap();
    const duration = selectedTrip.animationSpeed ?? 5000;
    const startTime = Date.now();
    
    // Clean up previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentIndex = Math.floor(progress * (activePositions.length - 1)) + 1;
      
      if (currentIndex < activePositions.length) {
        // Update the route source to show progress
        const progressCoordinates = activePositions.slice(0, currentIndex + 1).map(p => [p.longitude, p.latitude]);
        
        if (map.getSource(`route-${selectedTrip.slug}`)) {
          const source = map.getSource(`route-${selectedTrip.slug}`) as any;
          source.setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: progressCoordinates,
              },
            }],
          });
        }

        // Update marker position
        if (markerRef.current && currentIndex > 0) {
          const currentPos = activePositions[currentIndex];
          markerRef.current.setLngLat([currentPos.longitude, currentPos.latitude]);
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [selectedTrip, activePositions]);

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
          const isSelected = trip.slug === selectedTrip?.slug;

          // Show full route for all trips initially
          // Animation will update the selected trip's source dynamically
          const coordinates = trip.positions.map(p => [p.longitude, p.latitude]);

          if (coordinates.length < 2) return null;

          const routeData = {
            type: 'FeatureCollection' as const,
            features: [{
              type: 'Feature' as const,
              properties: {},
              geometry: {
                type: 'LineString' as const,
                coordinates: coordinates,
              },
            }],
          };

          return (
            <Source
              key={trip.slug}
              id={`route-${trip.slug}`}
              type="geojson"
              data={routeData}
            >
              <Layer
                id={`route-line-${trip.slug}`}
                type="line"
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round',
                }}
                paint={{
                  'line-width': 4,
                  'line-color': color,
                  'line-opacity': isSelected ? 1.0 : 0.3,
                }}
              />
            </Source>
          );
        })}

        {/* Marker at the front of the animated line */}
        {selectedTrip && activePositions.length > 0 && (
          <Marker
            ref={markerRef}
            longitude={activePositions[0].longitude}
            latitude={activePositions[0].latitude}
            anchor="center"
          >
            <img
              src="/assets/icons/van-passenger.svg"
              alt="car"
              style={{ width: 32, height: 32, transform: 'translate(-10%, -10%)' }}
            />
          </Marker>
        )}
      </Map>
    </div>
  );
}
