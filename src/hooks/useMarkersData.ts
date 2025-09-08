import { useQuery } from '@tanstack/react-query';
import { fetchMarkers, fetchTripMarkers } from '@/services/api';
import type { Trip } from '@/store/atoms';

export function useMarkersData(
  vesselId: string | null,
  fromDate?: string,
  untilDate?: string,
  page: number = 0,
  size: number = 500
) {
  return useQuery({
    queryKey: ['markers', vesselId, fromDate, untilDate, page, size],
    queryFn: async () => {
      if (!vesselId) throw new Error('Vessel ID is required');
      return fetchMarkers(vesselId, fromDate, untilDate, page, size);
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

export function useTripMarkersData(vesselId: string | null, trip: Trip | null) {
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