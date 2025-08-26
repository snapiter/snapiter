'use client';

import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { type Position } from '@/store/atoms';

interface MapViewProps {
  className?: string;
  positions?: Position[];
}

export default function MapView({ className, positions = [] }: MapViewProps) {
  console.log('MapView received positions:', positions.length, positions.slice(0, 2));
  
  // Create GeoJSON from positions
  const routeData = {
    type: 'FeatureCollection' as const,
    features: positions.length > 0 ? [
      {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: positions.map(pos => [pos.longitude, pos.latitude])
        }
      }
    ] : []
  };

  // Calculate bounds to fit route
  const bounds = positions.length > 0 ? {
    longitude: positions.length > 0 ? positions[0].longitude : -74.006,
    latitude: positions.length > 0 ? positions[0].latitude : 40.7128,
    zoom: positions.length > 1 ? 8 : 12,
  } : {
    longitude: -74.006,
    latitude: 40.7128,
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
        {positions.length > 0 && (
          <Source id="route" type="geojson" data={routeData}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 3,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
