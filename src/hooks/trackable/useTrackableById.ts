import { useQuery } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import type { Trackable } from "@/store/atoms";
import { queryKeys } from "@/utils/queryKeys";

export function useTrackableById(trackableId: string | null) {
  const apiClient = useDashboardApiClient();

  return useQuery({
    queryKey: queryKeys.trackable(trackableId ?? ""),
    queryFn: async () => {
      if (!trackableId) throw new Error("Trackable ID is required");
      return apiClient.get<Trackable>(`/api/trackables/${trackableId}`);
    },
    enabled: !!trackableId, // only run when we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false; // don't retry if not found
      }
      return failureCount < 2;
    },
  });
}
