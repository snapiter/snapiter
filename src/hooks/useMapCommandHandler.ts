import { useAtom, useSetAtom } from 'jotai';
import { mapCommandsAtom, mapEventsAtom, type Trip, type MapEvent } from '@/store/atoms';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapRef } from 'react-map-gl/maplibre';
import { createTripMarkers, createVehicleMarker, cleanupMarkers } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds } from '@/utils/mapBounds';

export function useMapCommandHandler(
  mapRef: React.RefObject<MapRef | null>,
  trips: Trip[],
  setLightboxIndex: (index: number) => void
) {
  const [commands] = useAtom(mapCommandsAtom);
  const setMapEvents = useSetAtom(mapEventsAtom);

  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const emitEvent = (event: MapEvent) => {
    console.log("Dispatched:" + event.type);
    setMapEvents(prev => [...prev, event]);
  };

  const findTripBySlug = (slug: string) => {
    return trips.find(trip => trip.slug === slug);
  };

  useEffect(() => {
    if (commands.length === 0 || !mapRef.current) return;

    const command = commands[commands.length - 1];
    
    const map = mapRef.current.getMap();
    if (!map) return;

    const handleCommand = async () => {
      console.log("Command: " + command.type);
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
  }, [commands, trips, setLightboxIndex, setMapEvents, mapRef]);

  // Cleanup function
  useEffect(() => {
    return () => {
      stopAnimation(animationRef);
      cleanupMarkers(visibleMarkersRef, vehicleMarkerRef);
      startTimeRef.current = null;
    };
  }, []);

  // Return refs for external access if needed
  return {
    animationRef,
    vehicleMarkerRef,
    visibleMarkersRef
  };
}