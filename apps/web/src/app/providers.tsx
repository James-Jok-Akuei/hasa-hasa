"use client";

import { configureApi } from "@hasahasa/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Module scope, so the base URL is set before any component can call the API.
configureApi(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
