'use client';

import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, lightboxStateAtom, type Trip, type Marker as TripMarker } from '@/store/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { createTripMarkers, createVehicleMarker, cleanupMarkers } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds, createRouteData } from '@/utils/mapBounds';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const setLightboxState = useSetAtom(lightboxStateAtom);
  const mapRef = useRef<MapRef | null>(null);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const activePositions = selectedTrip?.positions.toReversed() ?? [];

  
  useEffect(() => {
    // if (!mapRef.current || !selectedTrip || activePositions.length < 2) return;

    if (!selectedTrip || !isMapLoaded || activePositions.length < 2) {
      return;
    }

    stopAnimation(animationRef);
    startTimeRef.current = null;
    currentPositionIndexRef.current = 0;

    const map = mapRef.current?.getMap();
    if (!map) return;

    createTripMarkers(selectedTrip.markers, visibleMarkersRef, (marker: TripMarker) => {
      // Find all photos from trip markers to create lightbox photos array
      const photosFromMarkers = selectedTrip.markers
        .filter(m => m.hasThumbnail)
        .map(m => ({
          src: `https://cache.partypieps.nl/marker/${m.markerId}`,
          alt: m.title || 'Marker photo',
          title: m.description
        }));
      
      // Find the index of the clicked marker in the photos array
      const photoIndex = photosFromMarkers.findIndex(photo => 
        photo.src.includes(marker.markerId)
      );
      
      if (photoIndex !== -1) {
        setLightboxState({
          isOpen: true,
          photos: photosFromMarkers,
          currentIndex: photoIndex
        });
      }
    });
    createVehicleMarker(activePositions[0], vehicleMarkerRef, map);
    fitMapBounds(mapRef, activePositions);
    
    startAnimation(
      mapRef,
      selectedTrip,
      activePositions,
      vehicleMarkerRef,
      visibleMarkersRef,
      currentPositionIndexRef,
      startTimeRef,
      animationRef
    );

    return () => {
      stopAnimation(animationRef);
      cleanupMarkers(visibleMarkersRef, vehicleMarkerRef);
      startTimeRef.current = null;
    };
  }, [selectedTrip, isMapLoaded]);

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 5.1214201, latitude: 52.0907374, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl
        onLoad={() => setIsMapLoaded(true)}
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
