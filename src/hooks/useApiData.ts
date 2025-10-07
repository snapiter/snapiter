import { useState, useEffect } from 'react';

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

    if (finalHostname === 'localhost' || finalHostname === '127.0.0.1' || finalHostname === "snapiter.com") {
      finalHostname = 'maps.arnovanrossum.nl';
      // finalHostname = 'maps.lunaverde.nl';
    }

    setHostname(finalHostname);
  }, []);

  return hostname;
}


export { useHostname };