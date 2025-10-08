import { useQuery } from '@tanstack/react-query';
import type { Marker, Trip, TripWithMarkers } from '@/store/atoms';
import { useApiClient } from './useApiClient';

export function useMarkers(trip: Trip | null) {
  const api = useApiClient()
  
  return useQuery({
    queryKey: ['markers', trip?.trackableId, trip?.slug],
    queryFn: async () => {
      if (!trip?.trackableId || !trip) throw new Error('Trackable ID and trip are required');
      return api.get<Marker[]>(`/api/trackables/${trip.trackableId}/trips/${trip.slug}/markers`)
    },
    enabled: !!trip?.trackableId && !!trip,
    staleTime: 10 * 60 * 1000, // 10 minutes - markers change less frequently
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}


export function useTripWithMarkers(trip: Trip | null) {
  const api = useApiClient()
  
  return useQuery<TripWithMarkers>({
    queryKey: ['markers', trip?.trackableId, trip?.slug],
    queryFn: async () => {
      if (!trip?.trackableId || !trip) throw new Error('Trackable ID and trip are required');
      return { ...trip, markers: await api.get<Marker[]>(`/api/trackables/${trip.trackableId}/trips/${trip.slug}/markers`) }
    },
    enabled: !!trip?.trackableId && !!trip,
    staleTime: 10 * 60 * 1000, // 10 minutes - markers change less frequently
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}