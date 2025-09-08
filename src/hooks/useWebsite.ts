import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteByHostname } from '@/services/api';
import { MapStyle, type Website } from '@/store/atoms';

export function useWebsite(hostname: string | null) {
  return useQuery({
    queryKey: ['website', hostname],
    queryFn: async () => {
      if (!hostname) throw new Error('Hostname is required');
      const websiteData = await fetchWebsiteByHostname(hostname);
      return {
        ...websiteData,
        mapStyle: hostname === "maps.lunaverde.nl" ? MapStyle.STREETS_V2 : MapStyle.LANDSCAPE
      } as Website;
    },
    enabled: !!hostname,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}