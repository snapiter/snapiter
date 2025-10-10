"use client";

import { useQuery } from '@tanstack/react-query';
import type { Marker, Trip } from '@/store/atoms';
import { useApiClient } from '../../useApiClient';
import { TripWithMarkers } from '@/store/atoms';
import { queryKeys } from '@/utils/queryKeys';


export function useTrips(trackableId: string | null) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.tripsWithMarkers(trackableId ?? ''),
    queryFn: async (): Promise<TripWithMarkers[]> => {
      if (!trackableId) throw new Error('Trackable ID is required');
      const trips = await api.get<Trip[]>(`/api/trackables/${trackableId}/trips`);

      const tripsWithMarkers = await Promise.all(
        trips.map(async (trip) => {
          try {
            const markers = await api.get<Marker[]>(
              `/api/trackables/${trip.trackableId}/trips/${trip.slug}/markers`
            );
            return { ...trip, markers };
          } catch (err) {
            console.error(`Failed to load markers for trip ${trip.slug}`, err);
            return { ...trip, markers: [] };
          }
        })
      );

      return tripsWithMarkers;
    },
    enabled: !!trackableId,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
