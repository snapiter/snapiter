import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useTrips(trackableId: string | null) {
  const api = useApiClient()
  
  return useQuery({
    queryKey: ['trips', trackableId],
    queryFn: async () => {
      if (!trackableId) throw new Error('Trackable ID is required');
      return api.get<Trip[]>(`/api/trackables/${trackableId}/trips`)
    },
    enabled: !!trackableId,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}