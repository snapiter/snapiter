import { useQuery } from '@tanstack/react-query';
import type { Marker, Position, Trip, TripDetailed, TripWithPositions } from '@/store/atoms';
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


export function useDetailedTrip(trip: Trip | null) {
  const api = useApiClient();

  return useQuery<TripDetailed>({
    queryKey: ['trip-detailed', trip?.trackableId, trip?.slug],
    queryFn: async () => {
      if (!trip) throw new Error('Trip is required');

      const positions = await api.get<Position[]>(
        `/api/trackables/${trip.trackableId}/trips/${trip.slug}/positions`
      );
      const markers = await api.get<Marker[]>(
        `/api/trackables/${trip.trackableId}/trips/${trip.slug}/markers`
      );

      return { ...trip, positions, markers };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!trip,
    retry: 1,
    placeholderData: { ...trip, positions: [], markers: [] } as TripDetailed,
  });

}