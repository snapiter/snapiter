import { useQuery } from '@tanstack/react-query';
import { fetchPositions } from '@/services/api';

export function usePositionsData(
  vesselId: string | null,
  tripName: string | null,
  page: number = 0,
  size: number = 2000
) {
  return useQuery({
    queryKey: ['positions', vesselId, tripName, page, size],
    queryFn: async () => {
      if (!vesselId || !tripName) throw new Error('Vessel ID and trip name are required');
      return fetchPositions(vesselId, tripName, page, size);
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