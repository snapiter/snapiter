"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";

interface UpdateTripInput {
  trackableId: string;
  originalSlug: string;
  trip: UpdateTrip;
}

export interface UpdateTrip {
  startDate?: string;
  endDate?: string;
  title?: string;
  description?: string;
  slug?: string;
  color?: string;
  animationSpeed?: number;
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
        queryKey: ['trip-with-positions', variables.trackableId, variables.originalSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["trips-with-markers", variables.trackableId],
      });
    },
  });
}
