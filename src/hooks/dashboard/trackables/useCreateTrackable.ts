"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { queryKeys } from "@/utils/queryKeys";

export interface CreateTrackableInput {
  title: string;
  name: string;
  hostName: string;
}

export function useCreateTrackable() {
  const apiClient = useDashboardApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, name, hostName }: CreateTrackableInput) => {
      const payload = {
        title,
        name,
        hostName: hostName,
      };

      await apiClient.post<void>(`/api/trackables`, payload);

      return payload;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trackables(),
      });
    },
  });
}
