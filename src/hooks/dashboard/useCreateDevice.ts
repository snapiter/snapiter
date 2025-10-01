"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { QuickCreateRes } from "@/store/atoms";

export interface CreateDeviceInput {
    trackableId: string;
}

export function useCreateDevice() {
    const apiClient = useDashboardApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ trackableId }: CreateDeviceInput) => {
            const payload = await apiClient.post<QuickCreateRes>(
                `/api/trackables/${trackableId}/devices/token`,
                {}
            );

            return payload;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['devices', variables.trackableId],
            });
        },
    });
}
