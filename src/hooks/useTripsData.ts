import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/services/api';

export function useTripsData(vesselId: string | null) {
  return useQuery({
    queryKey: ['trips', vesselId],
    queryFn: async () => {
      if (!vesselId) throw new Error('Vessel ID is required');
      return fetchTrips(vesselId);
    },
    enabled: !!vesselId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}