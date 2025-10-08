import { useQuery } from '@tanstack/react-query';
import type { Marker, Trip } from '@/store/atoms';
import { useApiClient } from './useApiClient';
import { TripWithMarkers } from '@/store/atoms';
import { useTrackableByHostname } from './useTrackableByHostname';

export function useTripsByHostname() {
  const { data: website } = useTrackableByHostname();
  const api = useApiClient();

  const query = useQuery({
    queryKey: ['trips-with-markers', website?.trackableId],
    queryFn: async (): Promise<TripWithMarkers[]> => {
      if (!website?.trackableId) return []; // no id yet → just empty trips
      
      const trips = await api.get<Trip[]>(`/api/trackables/${website.trackableId}/trips`);

      return Promise.all(
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
    },
    enabled: !!website?.trackableId,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    placeholderData: [],
  });

  return {
    ...query,
    data: query.data ?? [],
  };
}

