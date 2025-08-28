import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  websiteAtom,
} from '@/store/atoms';
import { useMapCommands } from './useMapCommands';


export function useWebsite() {
  const website = useAtomValue(websiteAtom);
  const { runCommand } = useMapCommands();

  useEffect(() => {
    if ( website) {
      return;
    }

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
    runCommand({ type: 'LOAD_WEBSITE', hostname: finalHostname });
  }, []);

  return { website };
}