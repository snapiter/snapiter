'use client';

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('404')) {
            return false;
          }
          return failureCount < 3;
        },
      },
    },
  }));

  const [persister] = useState(() => createAsyncStoragePersister({
    storage: window.localStorage,
  }));

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.queryKey[0] === 'trips';
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}