import { useAtomValue, useSetAtom } from 'jotai';
import { mapCommandsAtom, mapEventsAtom, type Trip, type MapEvent, lightboxIndexAtom, selectedTripAtom, bottomPanelExpandedAtom } from '@/store/atoms';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapRef } from 'react-map-gl/maplibre';
import { cleanupMarkers, highlightMarker } from '@/utils/mapMarkers';
import { stopAnimation } from '@/utils/mapAnimation';
import logger from '@/utils/logger';

export function useMapCommandHandler(
  mapRef: React.RefObject<MapRef | null>,
  trips: Trip[]
) {
  const commands = useAtomValue(mapCommandsAtom);
  const setMapEvents = useSetAtom(mapEventsAtom);

  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const setSelectedTrip = useSetAtom(selectedTripAtom);
  const setBottomPanelExpanded = useSetAtom(bottomPanelExpandedAtom);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const emitEvent = (event: MapEvent) => {
    logger.log("Dispatched:" + event.type);
    setMapEvents(prev => [...prev, event]);
  };

  useEffect(() => {
    if (commands.length === 0 || !mapRef.current) return;

    const command = commands[commands.length - 1];
    

    const map = mapRef.current.getMap();
    if (!map) return;

    const handleCommand = async () => {
      logger.log("Command: " + command.type);
      switch (command.type) {
        
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
        
        case 'HIGHLIGHT_MARKER': {
          highlightMarker(visibleMarkersRef, command.markerId);
          emitEvent({ type: 'MARKER_HIGHLIGHTED', markerId: command.markerId, commandId: command.id });
          break;
        }
        
        case 'HIGHLIGHT_MARKER_LEAVE': {
          // highlightMarker(visibleMarkersRef, command.markerId);
          emitEvent({ type: 'MARKER_HIGHLIGHTED_LEAVE', markerId: command.markerId, commandId: command.id });
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
        
        case 'SELECT_TRIP': {
          const trip = trips.filter(t => t.slug === command.tripSlug).pop();
          if(trip) {
            setSelectedTrip(command.tripSlug)
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
  }, [commands, setLightboxIndex, setMapEvents, mapRef]);

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