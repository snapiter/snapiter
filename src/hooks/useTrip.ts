import { useQueries } from '@tanstack/react-query';
import { fetchPositions } from '@/services/api';
import type { Trip, TripWithPositions } from '@/store/atoms';

export function useTripPositions(trips: Trip[]) {
  const tripPositionQueries = useQueries({
    queries: trips.map(trip => ({
      queryKey: ['tripPositions', trip.vesselId, trip.slug],
      queryFn: async () => {
        const positions = await fetchPositions(trip.vesselId, trip.slug);
        return { ...trip, positions } as TripWithPositions;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })),
  });

  const tripsWithPositions: TripWithPositions[] = tripPositionQueries
    .map(q => q.data)
    .filter((t): t is TripWithPositions => t !== undefined);

  const isLoading = tripPositionQueries.some(query => query.isLoading);
  const loadedCount = tripPositionQueries.filter(query => query.data).length;
  const totalCount = trips.length;
  const hasError = tripPositionQueries.some(query => query.isError);
  const errors = tripPositionQueries.filter(query => query.isError).map(query => query.error);

  return {
    data: tripsWithPositions,
    isLoading,
    loadedCount,
    totalCount,
    hasError,
    errors,
    isComplete: loadedCount === totalCount && totalCount > 0
  };
}