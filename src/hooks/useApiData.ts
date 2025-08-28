import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  websiteAtom,
  isLoadingWebsiteAtom,
  errorAtom,
} from '@/store/atoms';
import { fetchWebsiteByHostname } from '@/services/api';

function useHostname() {
  const [hostname, setHostname] = useState<string>('');

  useEffect(() => {
    // Try to get hostname from cookie first (set by middleware)
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const cookieHostname = getCookieValue('hostname');
    let finalHostname = '';
    
    if (cookieHostname) {
      finalHostname = cookieHostname;
    } else if (typeof window !== 'undefined') {
      // Fallback to window.location.hostname
      finalHostname = window.location.hostname;
    }

    // If localhost, automatically use partypieps.nl for development
    if (finalHostname === 'localhost' || finalHostname === '127.0.0.1' || finalHostname === "snapiter.com") {
      finalHostname = 'partypieps.nl';
    }

    setHostname(finalHostname);
  }, []);

  return hostname;
}



export function useWebsite() {
  const [website, setWebsite] = useAtom(websiteAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingWebsiteAtom);
  const setError = useSetAtom(errorAtom);
  const hostname = useHostname();

  useEffect(() => {
    const loadWebsite = async () => {
      // Don't load until we have a hostname
      if (!hostname || website) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Loading website for hostname:', hostname);
        const websiteData = await fetchWebsiteByHostname(hostname);
        setWebsite(websiteData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load website data');
        console.error('Error loading website:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWebsite();
  }, [hostname, setError, setIsLoading, setWebsite, website]);

  return { website, isLoading };
}