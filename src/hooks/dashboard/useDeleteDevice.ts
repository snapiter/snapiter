"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { Device } from "@/store/atoms";
import { queryKeys } from "@/utils/queryKeys";

export interface DeleteDeviceInput {
    trackableId: string;
    device: Device;
  }
  
export function useDeleteDevice() {
  const apiClient = useDashboardApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackableId, device}: DeleteDeviceInput) => {
      const payload = {
        device,
      };

      await apiClient.delete<void>(`/api/trackables/${trackableId}/devices/${device.deviceId}`);

      return payload; // return what was created (useful for redirecting)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.devices(variables.trackableId),
      });
    },
  });
}
