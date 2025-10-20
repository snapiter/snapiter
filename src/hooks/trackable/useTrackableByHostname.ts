import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMarkerUrls } from "@/services/thumbnail";
import type { Trackable } from "@/store/atoms";
import { queryKeys } from "@/utils/queryKeys";
import { useApiClient } from "../useApiClient";
import { useHostname } from "./useHostname";

export function useTrackableByHostname() {
  const api = useApiClient();
  const hostname = useHostname();
  const { getTrackableIcon } = useMarkerUrls();

  const query = useQuery({
    queryKey: queryKeys.trackable(hostname ?? ""),
    queryFn: async () => {
      if (!hostname) throw new Error("Hostname is required");
      return api.get<Trackable>(`/api/trackables/host/${hostname}`);
    },
    enabled: !!hostname,
    staleTime: 2 * 24 * 60 * 60 * 1000,
    gcTime: 2 * 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // When the data is fetched, preload the icon, this speeds up the map
  useEffect(() => {
    if (query.data?.trackableId) {
      const url = getTrackableIcon(query.data.trackableId);
      const img = new Image();
      img.src = url; // triggers preload into browser cache
    }
  }, [query.data?.trackableId, getTrackableIcon]);

  return query;
}
