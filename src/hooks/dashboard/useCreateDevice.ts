"use client";

import { useMutation } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import type { QuickCreateRes } from "@/store/atoms";

export interface CreateDeviceInput {
  trackableId: string;
}

export function useCreateDevice() {
  const apiClient = useDashboardApiClient();

  return useMutation({
    mutationFn: async ({ trackableId }: CreateDeviceInput) => {
      const payload = await apiClient.post<QuickCreateRes>(
        `/api/trackables/${trackableId}/devices/token`,
        {},
      );

      return payload;
    },
  });
}
