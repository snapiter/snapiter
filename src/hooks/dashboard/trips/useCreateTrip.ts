"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { queryKeys } from "@/utils/queryKeys";
import { slugify } from "@/utils/slugify";

export interface CreateTripInput {
  trackableId: string;
  title: string;
  description: string;
}

export function useCreateTrip() {
  const apiClient = useDashboardApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trackableId,
      title,
      description,
    }: CreateTripInput) => {
      const payload = {
        title,
        description,
        slug: slugify(title),
        startDate: new Date().toISOString(),
        color: "#648192",
        animationSpeed: 10000,
        positionType: "ALL",
      };

      await apiClient.post<void>(
        `/api/trackables/${trackableId}/trips`,
        payload,
      );

      return payload; // return what was created (useful for redirecting)
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
