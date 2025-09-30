"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import type { Trip } from "@/store/atoms";

interface UpdateTripInput {
  trackableId: string;
  originalSlug: string;
  trip: Trip;
}

export function useUpdateTrip() {
  const apiClient = useDashboardApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackableId, originalSlug, trip }: UpdateTripInput) => {
      return apiClient.put<void>(
        `/api/trackables/${trackableId}/trips/${originalSlug}`,
        trip
      );
    },
    onSuccess: (_data, variables) => {
      // Invalidate cached trips for this trackable
      queryClient.invalidateQueries({
        queryKey: ["trips-with-markers", variables.trackableId],
      });
    },
  });
}
