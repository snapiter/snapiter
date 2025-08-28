import { useSetAtom, useAtomValue } from 'jotai';
import { mapCommandsAtom, mapEventsAtom, type MapCommand, type MapEvent } from '@/store/atoms';
import { useCallback } from 'react';

export function useMapCommands() {
  const setCommands = useSetAtom(mapCommandsAtom);
  const events = useAtomValue(mapEventsAtom);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const animateTrip = useCallback((tripSlug: string) => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'ANIMATE_TRIP', tripSlug, id }]);
    return id;
  }, [setCommands]);

  const flyTo = useCallback((coordinates: [number, number], zoom?: number) => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'FLY_TO', coordinates, zoom, id }]);
    return id;
  }, [setCommands]);

  const fitBounds = useCallback((tripSlug: string) => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'FIT_BOUNDS', tripSlug, id }]);
    return id;
  }, [setCommands]);

  const highlightMarker = useCallback((photoId: string | null) => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'HIGHLIGHT_MARKER', photoId, id }]);
    return id;
  }, [setCommands]);

  const openLightbox = useCallback((photoIndex: number) => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'LIGHTBOX_OPEN', photoIndex, id }]);
    return id;
  }, [setCommands]);

  const closeLightbox = useCallback(() => {
    const id = generateId();
    setCommands(prev => [...prev, { type: 'LIGHTBOX_CLOSE', id }]);
    return id;
  }, [setCommands]);

  // Helper to get events for a specific command
  const getEventsForCommand = useCallback((commandId: string) => {
    return events.filter(event => event.commandId === commandId);
  }, [events]);

  // Helper to check if a command is complete
  const isCommandComplete = useCallback((commandId: string) => {
    const commandEvents = getEventsForCommand(commandId);
    return commandEvents.some(event => 
      event.type.endsWith('_ENDED')
    );
  }, [getEventsForCommand]);

  // Helper to wait for command completion
  const waitForCommand = useCallback((commandId: string): Promise<MapEvent> => {
    return new Promise((resolve) => {
      const checkCompletion = () => {
        const endEvent = events.find(event => 
          event.commandId === commandId && event.type.endsWith('_ENDED')
        );
        
        if (endEvent) {
          resolve(endEvent);
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      
      checkCompletion();
    });
  }, [events]);

  return {
    // Commands
    animateTrip,
    flyTo,
    fitBounds,
    highlightMarker,
    openLightbox,
    closeLightbox,
    
    // Event helpers
    events,
    getEventsForCommand,
    isCommandComplete,
    waitForCommand
  };
}