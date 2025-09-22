import { useQuery } from '@tanstack/react-query';
import type { Position, Trip, TripWithPositions } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useTripWithPosition(trackableId: string, tripId: string) {
  const api = useApiClient();

  return useQuery<TripWithPositions>({
    queryKey: ['tripWithPositions', trackableId, tripId],
    queryFn: async () => {
      const trip = await api.get<Trip>(
        `/api/trackables/${trackableId}/trips/${tripId}`
      );

      const positions = await api.get<Position[]>(
        `/api/trackables/${trackableId}/trips/${tripId}/positions`
      );

      return { ...trip, positions };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

}
