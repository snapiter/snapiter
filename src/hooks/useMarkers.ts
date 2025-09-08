import { useQuery } from '@tanstack/react-query';
import { fetchTripMarkers } from '@/services/api';
import type { Trip } from '@/store/atoms';

export function useMarkers(vesselId: string | null, trip: Trip | null) {
  return useQuery({
    queryKey: ['tripMarkers', vesselId, trip?.slug],
    queryFn: async () => {
      if (!vesselId || !trip) throw new Error('Vessel ID and trip are required');
      return fetchTripMarkers(vesselId, trip);
    },
    enabled: !!vesselId && !!trip,
    staleTime: 10 * 60 * 1000, // 10 minutes - markers change less frequently
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}