"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { queryKeys } from "@/utils/queryKeys";

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.trips(variables.trackableId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tripsWithMarkers(variables.trackableId),
      });
    },
  });
}
