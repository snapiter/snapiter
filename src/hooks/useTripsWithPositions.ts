import { useQuery } from '@tanstack/react-query';
import type { Position, Trip, TripWithPositions } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useTripsWithPositions(trips: Trip[]) {
  const api = useApiClient();

  return useQuery({
    queryKey: ['tripsWithPositions', trips.map(t => t.slug)], // include slugs for cache uniqueness
    queryFn: async (): Promise<TripWithPositions[]> => {
      const results = await Promise.all(
        trips.map(async trip => {
          const positions = await api.get<Position[]>(
            `/api/trackables/${trip.trackableId}/trips/${trip.slug}/positions`
          );
          return { ...trip, positions };
        })
      );
      return results;
    },
    enabled: trips.length > 0, // only fetch if trips exist
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    placeholderData: [],
  });
}
