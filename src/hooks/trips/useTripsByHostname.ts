import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/store/atoms';
import { useApiClient } from '../useApiClient';
import { useTrackableByHostname } from '../trackable/useTrackableByHostname';

export function useTripsByHostname() {
  const { data: website } = useTrackableByHostname();
  const api = useApiClient();

  const query = useQuery({
    queryKey: ['trips', website?.trackableId],
    queryFn: async (): Promise<Trip[]> => {
      if (!website?.trackableId) return []; 
      return await api.get<Trip[]>(`/api/trackables/${website.trackableId}/trips`);

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

