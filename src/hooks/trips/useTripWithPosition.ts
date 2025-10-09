import { useQuery } from '@tanstack/react-query';
import type { Marker, Position, Trip, TripDetailed, TripWithPositions } from '@/store/atoms';
import { useApiClient } from '../useApiClient';

export function useTripWithPosition(trackableId: string, tripId: string) {
  const api = useApiClient();
  const positionsQuery = useTripPositions(trackableId, tripId);

  return useQuery<TripWithPositions>({
    queryKey: ['trip-with-positions', trackableId, tripId],
    queryFn: async () => {
      const trip = await api.get<Trip>(`/api/trackables/${trackableId}/trips/${tripId}`);
      return { ...trip, positions: positionsQuery.data ?? [] };
    },
    enabled: !!positionsQuery.data, // wait for positions
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: positionsQuery.data
      ? { positions: positionsQuery.data } as TripWithPositions
      : undefined,
  });
}

export function useDetailedTrip(trip: Trip | null) {
  const api = useApiClient();
  const positionsQuery = useTripPositions(trip?.trackableId, trip?.slug);

  return useQuery<TripDetailed>({
    queryKey: ['trip-detailed', trip?.trackableId, trip?.slug],
    queryFn: async () => {
      if (!trip) throw new Error('Trip is required');

      const markers = await api.get<Marker[]>(
        `/api/trackables/${trip.trackableId}/trips/${trip.slug}/markers`
      );

      return { ...trip, positions: positionsQuery.data ?? [], markers };
    },
    enabled: !!trip && positionsQuery.isSuccess,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: {
      ...trip,
      positions: positionsQuery.data ?? [],
      markers: [],
    } as TripDetailed,
  });
}

// This is ment to be private
// It is used to avoid duplicate network requests for positions on useDetailedTrip and useTripWithPosition
function useTripPositions(trackableId?: string, tripId?: string) {
  const api = useApiClient();

  return useQuery<Position[]>({
    queryKey: ['trip-positions', trackableId, tripId],
    queryFn: async () => {
      if (!trackableId || !tripId) throw new Error('IDs are required');
      return api.get<Position[]>(`/api/trackables/${trackableId}/trips/${tripId}/positions`);
    },
    enabled: !!trackableId && !!tripId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
