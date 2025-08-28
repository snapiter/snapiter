import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { mapCommandsAtom, mapEventsAtom, type Trip, type MapEvent, lightboxIndexAtom, isLoadingWebsiteAtom, websiteAtom, errorAtom } from '@/store/atoms';
import { fetchWebsiteByHostname } from '@/services/api';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapRef } from 'react-map-gl/maplibre';
import { createTripMarkers, createVehicleMarker, cleanupMarkers, highlightMarker } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds } from '@/utils/mapBounds';

export function useMapCommandHandler(
  mapRef: React.RefObject<MapRef | null>,
  trips: Trip[],
) {
  const commands = useAtomValue(mapCommandsAtom);
  const setMapEvents = useSetAtom(mapEventsAtom);
  const setIsLoadingWebsite = useSetAtom(isLoadingWebsiteAtom);
  const setWebsite = useSetAtom(websiteAtom);
  const setError = useSetAtom(errorAtom);

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
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
          
          // Stop current animation and reset ALL animation state
          stopAnimation(animationRef);
          
          // Restore the previous trip's full route line if there was one
          const allTrips = trips;
          for (const previousTrip of allTrips) {
            if (previousTrip.slug !== command.tripSlug) {
              const previousSource = map.getSource(`route-${previousTrip.slug}`) as any;
              if (previousSource) {
                const fullCoordinates = previousTrip.positions.toReversed()
                  .map(p => [p.longitude, p.latitude]);
                previousSource.setData({
                  type: 'FeatureCollection',
                  features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: fullCoordinates
                    }
                  }]
                });
              }
            }
          }
          
          // Reset all animation state completely
          currentPositionIndexRef.current = 0;
          startTimeRef.current = null;
          
          // Clean up existing markers and vehicle
          cleanupMarkers(visibleMarkersRef, vehicleMarkerRef);
          
          // Reset the route line to empty for the new trip
          const routeSource = map.getSource(`route-${command.tripSlug}`) as any;
          if (routeSource) {
            routeSource.setData({
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: []
                }
              }]
            });
          }
          
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
        
        case 'HIGHLIGHT_MARKER': {
          highlightMarker(visibleMarkersRef, command.photoId);
          emitEvent({ type: 'MARKER_HIGHLIGHTED', photoId: command.photoId, commandId: command.id });
          break;
        }
        
        case 'LIGHTBOX_OPEN': {
          setLightboxIndex(command.photoIndex);
          emitEvent({ type: 'LIGHTBOX_OPENED', photoIndex: command.photoIndex, commandId: command.id });
          break;
        }
        
        case 'LIGHTBOX_CLOSE': {
          setLightboxIndex(-1);
          emitEvent({ type: 'LIGHTBOX_CLOSED', commandId: command.id });
          break;
        }
        
        case 'MAP_READY': {
          emitEvent({ type: 'MAP_READY', commandId: command.id });
          break;
        }
        
        case 'LOAD_WEBSITE': {
          setIsLoadingWebsite(true);
          setError(null);
          
          // Perform the API call
          (async () => {
            try {
              console.log('Loading website for hostname:', command.hostname);
              const websiteData = await fetchWebsiteByHostname(command.hostname);
              setWebsite(websiteData);
              emitEvent({ type: 'WEBSITE_LOADED', commandId: command.id });
            } catch (error) {
              setError(error instanceof Error ? error.message : 'Failed to load website data');
              console.error('Error loading website:', error);
            } finally {
              setIsLoadingWebsite(false);
            }
          })();
          break;
        }
        
        case 'TRIP_HOVERED': {
          emitEvent({ type: 'TRIP_HOVERED', tripSlug: command.tripSlug, commandId: command.id });
          break;
        }
        
        case 'TRIP_BLURRED': {
          emitEvent({ type: 'TRIP_BLURRED', commandId: command.id });
          break;
        }
      }
    };

    handleCommand();
  }, [commands, setLightboxIndex, setMapEvents, setIsLoadingWebsite, setWebsite, setError, mapRef]);

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