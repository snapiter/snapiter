import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import {
  vesselIdAtom,
  tripsAtom,
  selectedTripAtom,
  positionsAtom,
  markersAtom,
  isLoadingTripsAtom,
  isLoadingPositionsAtom,
  isLoadingMarkersAtom,
  errorAtom,
  Trip,
  Position
} from '@/store/atoms';
import { fetchTrips, fetchPositions, fetchTripMarkers } from '@/services/api';

export function useTrips() {
  const vesselId = useAtomValue(vesselIdAtom);
  const [trips, setTrips] = useAtom(tripsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingTripsAtom);
  const setError = useSetAtom(errorAtom);

  const loadTrips = useCallback(async () => {
    if (!vesselId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tripsData = await fetchTrips(vesselId);
      setTrips(tripsData.toReversed());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load trips');
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vesselId, setTrips, setIsLoading, setError]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return { trips, isLoading, refetch: loadTrips };
}

export function usePositions() {
  const vesselId = useAtomValue(vesselIdAtom);
  const selectedTrip = useAtomValue(selectedTripAtom);
  const [positions, setPositions] = useAtom(positionsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingPositionsAtom);
  const setError = useSetAtom(errorAtom);

  console.log('usePositions - selectedTrip:', selectedTrip?.title, 'slug:', selectedTrip?.slug);

  const loadPositions = useCallback(async (tripSlug?: string) => {
    if (!vesselId || !tripSlug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const positionsData = await fetchPositions(vesselId, tripSlug);
      setPositions(positionsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load positions');
      console.error('Error loading positions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vesselId, setPositions, setIsLoading, setError]);

  useEffect(() => {
    if (selectedTrip?.slug) {
      loadPositions(selectedTrip.slug);
    }
  }, [selectedTrip?.slug, loadPositions]);

  return { positions, isLoading, loadPositions };
}
export function useMarkers(trip?: Trip) {
  const vesselId = useAtomValue(vesselIdAtom);
  const [markers, setMarkers] = useAtom(markersAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingMarkersAtom);
  const setError = useSetAtom(errorAtom);

  const loadMarkers = useCallback(async (t?: Trip) => {
    if (!vesselId || !t) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const markersData = await fetchTripMarkers(vesselId, t);
      setMarkers(markersData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load markers');
      console.error('Error loading markers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vesselId, setMarkers, setIsLoading, setError]);

  useEffect(() => {
    if (trip) loadMarkers(trip);
  }, [trip, loadMarkers]);

  return { markers, isLoading, loadMarkers };
}


export function useAllTripsWithPositions(trips: Trip[]) {
  const vesselId = useAtomValue(vesselIdAtom);
  const [tripsWithPositions, setTripsWithPositions] = useState<Array<{trip: Trip, positions: Position[]}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setError = useSetAtom(errorAtom);

  const loadAllPositions = useCallback(async () => {
    if (!vesselId || trips.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const promises = trips.map(async (trip) => {
        try {
          const positions = await fetchPositions(vesselId, trip.slug);
          return { trip, positions: positions.toReversed() };
        } catch (error) {
          console.error(`Failed to load positions for trip ${trip.title}:`, error);
          return { trip, positions: [] };
        }
      });
      
      const results = await Promise.all(promises);
      setTripsWithPositions(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load positions');
      console.error('Error loading all positions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vesselId, trips, setError]);

  useEffect(() => {
    loadAllPositions();
  }, [loadAllPositions]);

  return { tripsWithPositions, isLoading };
}

export function useVesselConfig() {
  const vesselId = useAtomValue(vesselIdAtom);
  
  return { vesselId };
}