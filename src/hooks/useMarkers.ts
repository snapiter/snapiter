import { useQuery } from '@tanstack/react-query';
import type { Marker, Trip } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useMarkers(trackableId: string | null, trip: Trip | null) {
  const api = useApiClient()
  
  return useQuery({
    queryKey: ['markers', trackableId, trip?.slug],
    queryFn: async () => {
      if (!trackableId || !trip) throw new Error('Trackable ID and trip are required');
      return api.get<Marker[]>(`/api/trackables/${trackableId}/trips/${trip.slug}/markers`)
    },
    enabled: !!trackableId && !!trip,
    staleTime: 10 * 60 * 1000, // 10 minutes - markers change less frequently
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}