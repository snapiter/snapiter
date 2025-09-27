import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { Trackable } from '@/store/atoms';
import { useHostname } from './useApiData';

export function useTrackableByHostname() {
  const api = useApiClient()
  const hostname = useHostname();

  return useQuery({
    queryKey: ['website', hostname],
    queryFn: async () => {
      if (!hostname) throw new Error('Hostname is required');
      return api.get<Trackable>(`/api/trackables/host/${hostname}`)
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