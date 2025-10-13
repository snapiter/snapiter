import { useQuery } from "@tanstack/react-query";
import type { Trip } from "@/store/atoms";
import { queryKeys } from "@/utils/queryKeys";
import { useApiClient } from "../useApiClient";

export function useTrip(trackableId: string, slug: string) {
  const api = useApiClient();

  return useQuery<Trip>({
    queryKey: [...queryKeys.trips(trackableId), slug] as const,
    queryFn: async () => {
      if (!trackableId || !slug)
        throw new Error("Trackable ID and slug are required");
      return await api.get<Trip>(
        `/api/trackables/${trackableId}/trips/${slug}`,
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
