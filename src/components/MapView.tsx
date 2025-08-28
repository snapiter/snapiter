'use client';

import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapEventsAtom, selectedTripAtom, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useEffect, useState } from 'react';
import { createRouteData } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const { runCommand } = useMapCommands();

  const mapRef = useRef<MapRef | null>(null);

  const mapEvents = useAtomValue(mapEventsAtom);
  
  // Check if map is ready by looking for MAP_READY events
  const mapReady = mapEvents.some(event => event.type === 'MAP_READY');
  
  // This handles the commands
  useMapCommandHandler(mapRef, trips);

  console.log("Mapview render" + trips.length)
  
  useEffect(() => {
    if (!selectedTrip || !mapReady || selectedTrip?.positions.length < 2) {
      return;
    }
    
    // Use command system to animate the selected trip
    runCommand({ 
      type: 'ANIMATE_TRIP', 
      tripSlug: selectedTrip.slug 
    });

  }, [selectedTrip, mapReady, runCommand]);


  return (
    <div className={className}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 5.1214201, latitude: 52.0907374, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/landscape/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl={{
          compact: true,
        }}
        onLoad={() => {
          runCommand({ type: 'MAP_READY' });
        }}
      >
        {trips.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = createRouteData(trip.positions, isSelected);
          return (
            <Source key={trip.slug} id={`route-${trip.slug}`} type="geojson" data={routeData}>
              <Layer
                id={`route-line-${trip.slug}`}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{ 'line-width': 4, 'line-color': color, 'line-opacity': isSelected ? 1 : 0.3 }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
