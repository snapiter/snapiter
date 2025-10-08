import { useQuery } from '@tanstack/react-query';
import type { Position, Trip, TripWithPositions } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useTripWithPositionById(trackableId: string, tripId: string) {
  const api = useApiClient();

  return useQuery<TripWithPositions>({
    queryKey: ['trip-with-positions', trackableId, tripId],
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
    retry: 1
  });

}

export function useTripWithPosition(trip: Trip) {
  const api = useApiClient();

  return useQuery<TripWithPositions>({
    queryKey: ['trip-with-positions', trip.trackableId, trip.slug],
    queryFn: async () => {
      const positions = await api.get<Position[]>(
        `/api/trackables/${trip.trackableId}/trips/${trip.slug}/positions`
      );

      return { ...trip, positions };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: { ...trip, positions: [] },
  });

}
