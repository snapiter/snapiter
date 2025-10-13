"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useState } from "react";
import { QueryKey } from "@/utils/queryKeys";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [persister, setPersister] = useState<any>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes("404")) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = createAsyncStoragePersister({
        storage: window.localStorage,
      });
      setPersister(p);
    }
  }, []);

  if (!persister) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            query.queryKey[0] === QueryKey.TRIPS ||
            query.queryKey[0] === QueryKey.TRACKABLE ||
            query.queryKey[0] === QueryKey.TRIP_POSITIONS ||
            query.queryKey[0] === QueryKey.TRIP_MARKERS,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
