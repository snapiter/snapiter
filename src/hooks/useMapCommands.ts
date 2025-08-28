import { useSetAtom } from 'jotai';
import { mapCommandsAtom, type MapCommand } from '@/store/atoms';
import { useCallback } from 'react';

export function useMapCommands() {
  const setCommands = useSetAtom(mapCommandsAtom);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const runCommand = useCallback((command: Omit<MapCommand, 'id'>) => {
    const id = generateId();
    setCommands(prev => [...prev, { ...command, id }]);
    return id;
  }, [setCommands]);

  return { runCommand };
}