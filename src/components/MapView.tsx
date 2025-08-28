'use client';

import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, lightboxIndexAtom, mapReadyAtom, mapCommandsAtom, type Trip } from '@/store/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef, useEffect, useState } from 'react';
import { stopAnimation } from '@/utils/mapAnimation';
import { createRouteData } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const setMapReady = useSetAtom(mapReadyAtom);
  const [commands, setCommands] = useAtom(mapCommandsAtom);

  const [lightboxIndex, setLightboxIndex] = useAtom(lightboxIndexAtom);
  const mapRef = useRef<MapRef | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { animationRef } = useMapCommandHandler(mapRef, trips, setLightboxIndex);

  console.log("RENDER" + trips.length)
  
  useEffect(() => {
    if (!selectedTrip || !isMapLoaded || selectedTrip?.positions.length < 2) {
      return;
    }
    
    // Use command system to animate the selected trip
    setCommands(prev => [...prev, { 
      type: 'ANIMATE_TRIP', 
      tripSlug: selectedTrip.slug, 
      id: `selected-${Date.now()}` 
    }]);

  }, [selectedTrip, isMapLoaded, setCommands]);


  useEffect(() => {
    if (lightboxIndex >= 0 && selectedTrip && mapRef.current) {
      // 1. End animation and show complete route
      stopAnimation(animationRef);
      const map = mapRef.current.getMap();
      
      // Show complete route line
      const source = map.getSource(`route-${selectedTrip.slug}`) as any;
      if (source) {
        const allCoordinates = selectedTrip?.positions.map(p => [p.longitude, p.latitude]);
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: allCoordinates
            }
          }]
        });
      }

      // 2. Get the marker corresponding to lightboxIndex
      const photosFromMarkers = selectedTrip.markers.filter(m => m.hasThumbnail);
      const targetMarker = photosFromMarkers[lightboxIndex];
      
      if (targetMarker) {
        // Use command system to fly to marker location
        setCommands(prev => [...prev, {
          type: 'FLY_TO',
          coordinates: [targetMarker.longitude, targetMarker.latitude],
          zoom: 10,
          id: `lightbox-${Date.now()}`
        }]);
      }
    }
  }, [lightboxIndex, selectedTrip, setCommands]);



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
          setIsMapLoaded(true);
          setMapReady(true);
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
