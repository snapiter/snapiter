'use client';

import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, lightboxIndexAtom, hoveredPhotoAtom, type Trip } from '@/store/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { useRef, useEffect, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import { createTripMarkers, createVehicleMarker, cleanupMarkers, highlightMarker } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds, createRouteData } from '@/utils/mapBounds';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const hoveredPhoto = useAtomValue(hoveredPhotoAtom);

  const [lightboxIndex, setLightboxIndex] = useAtom(lightboxIndexAtom);
  const mapRef = useRef<MapRef | null>(null);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false)


  
  useEffect(() => {
    if (!selectedTrip || !isMapLoaded || selectedTrip?.positions.length < 2) {
      return;
    }
    const activePositions = selectedTrip?.positions.toReversed() ?? [];

    stopAnimation(animationRef);
    startTimeRef.current = null;
    currentPositionIndexRef.current = 0;

    const map = mapRef.current?.getMap();
    if (!map) return;

    createTripMarkers(selectedTrip.markers, visibleMarkersRef, (photoIndex: number) => {
      setLightboxIndex(photoIndex);
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
        // Fly to marker location
        map.flyTo({
          center: [targetMarker.longitude, targetMarker.latitude],
          zoom: 10, // Close zoom level
          duration: 1000 // 1 second animation
        });
      }
    }
  }, [lightboxIndex, selectedTrip]);

  // Handle photo hover highlighting
  useEffect(() => {
    highlightMarker(visibleMarkersRef, hoveredPhoto);
  }, [hoveredPhoto]);

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 5.1214201, latitude: 52.0907374, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/outdoor-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl={{
          compact: true,
        }}
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
