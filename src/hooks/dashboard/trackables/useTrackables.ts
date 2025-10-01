import { useQuery } from '@tanstack/react-query';
import type { Trackable } from '@/store/atoms';
import { useDashboardApiClient } from '../useDashboardApiClient';

export function useTrackables() {
  const api = useDashboardApiClient()
  
  const query = useQuery({
    queryKey: ['trackables'],
    queryFn: async () => {
      return api.get<Trackable[]>(`/api/trackables`)
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes - devices change less frequently
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