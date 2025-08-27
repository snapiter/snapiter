import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import {
  vesselIdAtom,
  websiteAtom,
  isLoadingWebsiteAtom,
  errorAtom,
} from '@/store/atoms';
import { fetchWebsiteByHostname } from '@/services/api';



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
  }, [setError, setIsLoading, setWebsite, website]);

  return { website, isLoading };
}

export function useVesselConfig() {
  const vesselId = useAtomValue(vesselIdAtom);
  
  return { vesselId };
}