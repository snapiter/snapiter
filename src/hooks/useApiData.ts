import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import {
  websiteAtom,
} from '@/store/atoms';

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
  const website = useAtomValue(websiteAtom);
  return { website };
}

export { useHostname };