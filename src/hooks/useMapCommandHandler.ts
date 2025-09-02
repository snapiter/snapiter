import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { mapCommandsAtom, mapEventsAtom, type Trip, type MapEvent, lightboxIndexAtom, isLoadingWebsiteAtom, websiteAtom, errorAtom, selectedTripAtom, bottomPanelExpandedAtom, MapStyle } from '@/store/atoms';
import { fetchWebsiteByHostname } from '@/services/api';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapRef } from 'react-map-gl/maplibre';
import { createTripMarkers, createVehicleMarker, cleanupMarkers, highlightMarker } from '@/utils/mapMarkers';
import { startAnimation, stopAnimation } from '@/utils/mapAnimation';
import { fitMapBounds } from '@/utils/mapBounds';
import logger from '@/utils/logger';

export function useMapCommandHandler(
  mapRef: React.RefObject<MapRef | null>,
  trips: Trip[],
) {
  const commands = useAtomValue(mapCommandsAtom);
  const setMapEvents = useSetAtom(mapEventsAtom);
  const setIsLoadingWebsite = useSetAtom(isLoadingWebsiteAtom);
  const [website, setWebsite] = useAtom(websiteAtom);
  const setError = useSetAtom(errorAtom);

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const setBottomPanelExpanded = useSetAtom(bottomPanelExpandedAtom);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const emitEvent = (event: MapEvent) => {
    logger.log("Dispatched:" + event.type);
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
      logger.log("Command: " + command.type);
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
          createVehicleMarker(activePositions[0], vehicleMarkerRef, map, website?.icon);
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
          map.flyTo({
            center: command.coordinates,
            zoom: command.zoom || 10,
            duration: command.duration || 1000
          });
          
          // Wait for flyTo to complete
          setTimeout(() => {
            emitEvent({ type: 'FLY_TO_ENDED', coordinates: command.coordinates, commandId: command.id });
          }, command.duration || 1000);
          break;
        }
        
        case 'FIT_BOUNDS': {
          const trip = findTripBySlug(command.tripSlug);
          if (!trip) break;
          
          const activePositions = trip.positions.toReversed();
          fitMapBounds(mapRef, activePositions, command.duration ?? 1000);
          
          // Wait for bounds animation to complete
          setTimeout(() => {
            emitEvent({ type: 'FIT_BOUNDS_ENDED', tripSlug: command.tripSlug, commandId: command.id });
          }, command.duration ?? 1000);
          break;
        }
        
        case 'HIGHLIGHT_MARKER': {
          highlightMarker(visibleMarkersRef, command.markerId);
          emitEvent({ type: 'MARKER_HIGHLIGHTED', markerId: command.markerId, commandId: command.id });
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
              logger.log('Loading website for hostname:', command.hostname);
              const websiteData = await fetchWebsiteByHostname(command.hostname);
              setWebsite({...websiteData, 
                mapStyle: command.hostname === "maps.lunaverde.nl" ? MapStyle.STREETS_V2 : MapStyle.LANDSCAPE
              });
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
        
        case 'HOVER_TRIP': {
          emitEvent({ type: 'TRIP_HOVERED', tripSlug: command.tripSlug, fitBounds: command.fitBounds, commandId: command.id });
          break;
        }
        
        case 'BLUR_TRIP': {
          emitEvent({ type: 'TRIP_BLURRED', commandId: command.id });
          break;
        }
        
        case 'SELECT_TRIP': {
          const trip = trips.filter(t => t.slug === command.tripSlug).pop();
          if(trip) {
            setSelectedTrip(trip)
            emitEvent({ type: 'TRIP_SELECTED', tripSlug: command.tripSlug, commandId: command.id });
          }
          else {
            console.error("Invalid trip found")
          }
          break;
        }
        
        case 'PANEL_EXPAND': {
          setBottomPanelExpanded(true);
          emitEvent({ type: 'PANEL_EXPANDED', commandId: command.id });
          break;
        }
        
        case 'PANEL_COLLAPSE': {
          setBottomPanelExpanded(false);
          emitEvent({ type: 'PANEL_COLLAPSED', commandId: command.id });
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