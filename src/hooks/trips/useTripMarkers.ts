import { useQuery } from '@tanstack/react-query';
import type { Marker } from '@/store/atoms';
import { useApiClient } from '../useApiClient';
import { queryKeys } from '@/utils/queryKeys';

export function useTripMarkers(trackableId: string, slug: string) {
  const api = useApiClient();

  return useQuery<Marker[]>({
    queryKey: queryKeys.tripMarkers(trackableId, slug),
    queryFn: async () => {
      if (!trackableId || !slug) return [];
      return await api.get<Marker[]>(`/api/trackables/${trackableId}/trips/${slug}/markers`);
    },
    enabled: !!trackableId && !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
