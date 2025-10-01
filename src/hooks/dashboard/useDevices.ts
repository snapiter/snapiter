import { useQuery } from '@tanstack/react-query';
import type { Device } from '@/store/atoms';
import { useDashboardApiClient } from './useDashboardApiClient';

export function useDevices(trackableId: string) {
  const api = useDashboardApiClient()
  
  const query = useQuery({
    queryKey: ['devices', trackableId],
    queryFn: async () => {
      if (!trackableId) throw new Error('Trackable ID is required');
      return api.get<Device[]>(`/api/trackables/${trackableId}/devices`)
    },
    enabled: !!trackableId,
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