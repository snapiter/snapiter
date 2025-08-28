'use client';

import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, lightboxIndexAtom, hoveredPhotoAtom, mapReadyAtom, mapCommandsAtom, mapEventsAtom, type Trip, type MapCommand, type MapEvent } from '@/store/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
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
  const setMapReady = useSetAtom(mapReadyAtom);
  const [commands, setCommands] = useAtom(mapCommandsAtom);
  const setMapEvents = useSetAtom(mapEventsAtom);

  const [lightboxIndex, setLightboxIndex] = useAtom(lightboxIndexAtom);
  const mapRef = useRef<MapRef | null>(null);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  console.log("RENDER" + trips.length)
  
  useEffect(() => {
    if (!selectedTrip || !isMapLoaded || selectedTrip?.positions.length < 2) {
      return;
    }

    console.log("EFFECT " + trips.length)
    // Use command system to animate the selected trip
    setCommands(prev => [...prev, { 
      type: 'ANIMATE_TRIP', 
      tripSlug: selectedTrip.slug, 
      id: `selected-${Date.now()}` 
    }]);

    return () => {
      stopAnimation(animationRef);
      cleanupMarkers(visibleMarkersRef, vehicleMarkerRef);
      startTimeRef.current = null;
    };
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

  // Handle photo hover highlighting
  useEffect(() => {
    highlightMarker(visibleMarkersRef, hoveredPhoto);
  }, [hoveredPhoto]);

  // Command handler
  const emitEvent = (event: MapEvent) => {
    console.log("Dispatched:" + event.type)
    setMapEvents(prev => [...prev, event]);
  };

  const findTripBySlug = (slug: string) => {
    return trips.find(trip => trip.slug === slug);
  };

  useEffect(() => {
    if (commands.length === 0 || !mapRef.current) return;

    const command = commands[0]; // Process first command
    const map = mapRef.current.getMap();
    if (!map) return;

    const handleCommand = async () => {
      console.log("Command: " + command.type)
      switch (command.type) {
        case 'ANIMATE_TRIP': {
          const trip = findTripBySlug(command.tripSlug);
          if (!trip) break;
          
          emitEvent({ type: 'ANIMATION_STARTED', tripSlug: command.tripSlug, commandId: command.id });
          
          // Stop current animation and start new one
          stopAnimation(animationRef);
          const activePositions = trip.positions.toReversed();
          
          createTripMarkers(trip.markers, visibleMarkersRef, (photoIndex: number) => {
            setLightboxIndex(photoIndex);
          });
          createVehicleMarker(activePositions[0], vehicleMarkerRef, map);
          fitMapBounds(mapRef, activePositions);
          
          startAnimation(
            mapRef,
            trip,
            activePositions,
            vehicleMarkerRef,
            visibleMarkersRef,
            currentPositionIndexRef,
            startTimeRef,
            animationRef,
            () => {
              // This callback fires when animation actually completes
              emitEvent({ type: 'ANIMATION_ENDED', tripSlug: command.tripSlug, commandId: command.id });
            }
          );
          break;
        }
        
        case 'FLY_TO': {
          emitEvent({ type: 'FLY_TO_STARTED', coordinates: command.coordinates, commandId: command.id });
          
          map.flyTo({
            center: command.coordinates,
            zoom: command.zoom || 10,
            duration: 1000
          });
          
          // Wait for flyTo to complete
          setTimeout(() => {
            emitEvent({ type: 'FLY_TO_ENDED', coordinates: command.coordinates, commandId: command.id });
          }, 1000);
          break;
        }
        
        case 'FIT_BOUNDS': {
          const trip = findTripBySlug(command.tripSlug);
          if (!trip) break;
          
          emitEvent({ type: 'FIT_BOUNDS_STARTED', tripSlug: command.tripSlug, commandId: command.id });
          
          const activePositions = trip.positions.toReversed();
          fitMapBounds(mapRef, activePositions);
          
          // Wait for bounds animation to complete
          setTimeout(() => {
            emitEvent({ type: 'FIT_BOUNDS_ENDED', tripSlug: command.tripSlug, commandId: command.id });
          }, 1500);
          break;
        }
      }
    };

    handleCommand();
    
  }, [commands, trips, setLightboxIndex, setCommands, setMapEvents]);

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
