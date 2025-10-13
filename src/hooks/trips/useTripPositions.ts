import { useQuery } from "@tanstack/react-query";
import type { Position } from "@/store/atoms";
import { queryKeys } from "@/utils/queryKeys";
import { useApiClient } from "../useApiClient";

export function useTripPositions(trackableId: string, slug: string) {
  const api = useApiClient();

  return useQuery<Position[]>({
    queryKey: queryKeys.tripPositions(trackableId, slug),
    queryFn: async () => {
      if (!trackableId || !slug) return [];
      return await api.get<Position[]>(
        `/api/trackables/${trackableId}/trips/${slug}/positions`,
      );
    },
    enabled: !!trackableId && !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
