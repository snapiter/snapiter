import { useSetAtom } from 'jotai';
import { mapCommandsAtom, type MapCommand } from '@/store/atoms';
import { useCallback } from 'react';

type MapCommandWithoutId = 
  | { type: 'ANIMATE_TRIP'; tripSlug: string }
  | { type: 'FLY_TO'; coordinates: [number, number]; zoom?: number }
  | { type: 'FIT_BOUNDS'; tripSlug: string }
  | { type: 'HIGHLIGHT_MARKER'; markerId: string | null }
  | { type: 'LIGHTBOX_OPEN'; photoIndex: number }
  | { type: 'LIGHTBOX_CLOSE' }
  | { type: 'MAP_READY' }
  | { type: 'LOAD_WEBSITE'; hostname: string }
  | { type: 'TRIP_HOVERED'; tripSlug: string }
  | { type: 'TRIP_BLURRED' };

export function useMapCommands() {
  const setCommands = useSetAtom(mapCommandsAtom);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const runCommand = useCallback((command: MapCommandWithoutId) => {
    const id = generateId();
    setCommands(prev => [...prev, { ...command, id } as MapCommand]);
    return id;
  }, [setCommands]);

  return { runCommand };
}