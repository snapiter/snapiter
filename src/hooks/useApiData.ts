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
  websiteAtom,
  isLoadingWebsiteAtom,
  errorAtom,
  Trip,
  Position,
  Website
} from '@/store/atoms';
import { fetchTrips, fetchTripMarkers, fetchWebsiteByHostname } from '@/services/api';





export function useWebsite() {
  const [website, setWebsite] = useAtom(websiteAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingWebsiteAtom);
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    const loadWebsite = async () => {
      if (website) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const websiteData = await fetchWebsiteByHostname('partypieps.nl');
          setWebsite(websiteData);
      } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load website data');
          console.error('Error loading website:', error);
      } finally {
          setIsLoading(false);
      }
    };

    loadWebsite();
    
    return () => {
    };
  }, []);

  return { website, isLoading };
}

export function useVesselConfig() {
  const vesselId = useAtomValue(vesselIdAtom);
  
  return { vesselId };
}