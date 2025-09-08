import { useQuery } from '@tanstack/react-query';
import { fetchPositions } from '@/services/api';

export function useTripPositions(vesselId: string | null, tripName: string | null) {
  return useQuery({
    queryKey: ['tripPositions', vesselId, tripName],
    queryFn: async () => {
      if (!vesselId || !tripName) throw new Error('Vessel ID and trip name are required');
      return fetchPositions(vesselId, tripName);
    },
    enabled: !!vesselId && !!tripName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}