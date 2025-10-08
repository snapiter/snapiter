'use client';

import { Source, Layer, type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TripWithMarkers } from '@/store/atoms';
import { useRef, useState, RefObject } from 'react';
import { createRouteData } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useTripsWithPositions } from '@/hooks/useTripsWithPositions';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import MapWrapper from './MapWrapper';
import { useResponsiveMapHeight } from '@/hooks/map/useResponsiveMapHeight';
import { useAutoFlyToMarker } from '@/hooks/map/useAutoFlyToMarker';
import { useTripAnimation } from '@/hooks/map/useTripAnimation';

interface MapViewProps {
  trips?: TripWithMarkers[];
}

export default function MapView({ trips = [] }: MapViewProps) {
  const { trip: selectedTrip } = useSelectedTrip();

  const { runCommand } = useMapCommands();
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  

  const { data: tripsWithPositions = [] } = useTripsWithPositions(trips);

  useTripAnimation(mapRef, trips);

  useMapCommandHandler(mapRef, trips);

  useAutoFlyToMarker(mapRef, trips);

  useResponsiveMapHeight(mapRef)


  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const tripSlug = feature.layer.id.replace('route-line-', '');
      if (hoveredTrip !== tripSlug && selectedTrip?.slug !== tripSlug) {
        mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
        setHoveredTrip(tripSlug);
      }
    } else {
      if (hoveredTrip !== null) {
        setHoveredTrip(null);
      }
      mapRef.current?.getCanvas().style.removeProperty('cursor');
    }
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const clickedSlug = feature.layer.id.replace('route-line-', '');
      // Weird HACK, but otherwise if you click a marker it will reselect the already selected trip.
      if(clickedSlug == selectedTrip?.slug) {
        return;
      }
      setHoveredTrip(null);
      mapRef.current?.getCanvas().style.removeProperty('cursor');
      runCommand({
        type: 'SELECT_TRIP',
        tripSlug: clickedSlug
      });
    }
  };
  
  return (
      <MapWrapper
        mapRef={mapRef as RefObject<MapRef>}
        onMapReady={() => {
          runCommand({ type: 'MAP_READY' });
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        interactiveLayerIds={tripsWithPositions.map(trip => `route-line-${trip.slug}`)}
        mapStyle={{
          height: "100%",
        }}
      >
        {tripsWithPositions.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const isHovered = trip.slug === hoveredTrip;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = createRouteData(trip.positions, isSelected);
          return (
            <div key={trip.slug}>
              {/* Base route layer - hidden when selected */}
              <Source id={`route-${trip.slug}`} type="geojson" data={routeData}>
                <Layer
                  id={`route-line-${trip.slug}`}
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }} paint={{
                    'line-width': isHovered ? 6 : 4, // thicker on hover
                    'line-color': color,
                    'line-opacity': isSelected ? 0 : (isHovered ? 1 : 0.3),
                  }}
                />
              </Source>
              
              {/* Animation layer - only for selected trip */}
              {isSelected && (
                <Source id={`route-${trip.slug}-animation`} type="geojson" data={{
                  type: 'FeatureCollection',
                  features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: []
                    }
                  }]
                }}>
                  <Layer
                    id={`route-line-${trip.slug}-animation`}
                    type="line"
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{
                      'line-width': 4,
                      'line-color': color,
                      'line-opacity': 1,
                    }}
                  />
                </Source>
              )}
            </div>
          );
        })}
      </MapWrapper>
  );
}
