'use client';

import Map, { Source, Layer, type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useState } from 'react';
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
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);

  const mapRef = useRef<MapRef | null>(null);

  
  // This handles the commands
  useMapCommandHandler(mapRef, trips);

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      setHoveredTrip(feature.layer.id.replace('route-line-', ''));
      mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
    } else {
      setHoveredTrip(null);
      mapRef.current?.getCanvas().style.removeProperty('cursor');
    }

    console.log(hoveredTrip);
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const clickedSlug = feature.layer.id.replace('route-line-', '');
      setHoveredTrip(null);
      mapRef.current?.getCanvas().style.removeProperty('cursor');
      runCommand({
        type: 'ANIMATE_TRIP',
        tripSlug: clickedSlug
      });
    }
  };
  
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
        interactiveLayerIds={trips.map(trip => `route-line-${trip.slug}`)} // 👈 IMPORTANT
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {trips.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const isHovered = trip.slug === hoveredTrip;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = createRouteData(trip.positions, isSelected);
          return (
            <Source key={trip.slug} id={`route-${trip.slug}`} type="geojson" data={routeData}
            
            >
              <Layer
                id={`route-line-${trip.slug}`}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }} paint={{
                  'line-width': isHovered ? 6 : 4, // thicker on hover
                  'line-color': color,
                  'line-opacity': (isSelected || isHovered) ? 1 : 0.3,
                }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
