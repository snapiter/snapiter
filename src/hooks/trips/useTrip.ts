import { useQuery } from '@tanstack/react-query';
import type { Marker, Position, Trip, TripDetailed, TripWithPositions } from '@/store/atoms';
import { useApiClient } from '../useApiClient';
import { queryKeys } from '@/utils/queryKeys';

export function useTripWithPosition(trackableId: string, tripId: string) {
  const api = useApiClient();

  return useQuery<TripWithPositions>({
    queryKey: queryKeys.tripWithPositions(trackableId, tripId),
    queryFn: async () => {
      const trip = await api.get<Trip>(`/api/trackables/${trackableId}/trips/${tripId}`);
      const positions = await api.get<Position[]>(`/api/trackables/${trackableId}/trips/${tripId}/positions`);

      return { ...trip, positions };
    },
    enabled: !!trackableId && !!tripId,
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
    retry: 1
  });
}
export function useTrip(trip: Trip | null) {
  const api = useApiClient();

  return useQuery<TripDetailed>({
    queryKey: queryKeys.trip(trip?.trackableId ?? '', trip?.slug ?? ''),
    queryFn: async () => {
      if (!trip?.trackableId || !trip?.slug) throw new Error('IDs are required');
      const positions = await api.get<Position[]>(`/api/trackables/${trip?.trackableId}/trips/${trip?.slug}/positions`);
      const markers = await api.get<Marker[]>(`/api/trackables/${trip?.trackableId}/trips/${trip?.slug}/markers`);
      return { ...trip, positions, markers };
    },
    enabled: !!trip?.trackableId && !!trip?.slug,
    retry: 1,
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
  });
}
