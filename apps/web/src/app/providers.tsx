"use client";

import { configureApi } from "@hasahasa/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * NEXT_PUBLIC_API_URL is baked into the bundle at build time, so a value of
 * localhost:4000 breaks the moment the page is opened at http://192.168.x.x —
 * which is how it gets tested on a real handset. When the configured host is
 * local but the page is not, follow the page instead.
 */
function resolveApiUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  if (typeof window === "undefined") return configured;

  try {
    const url = new URL(configured);
    const configuredIsLocal =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const pageIsLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (configuredIsLocal && !pageIsLocal) {
      url.hostname = window.location.hostname;
    }
    return url.origin;
  } catch {
    return configured;
  }
}

// Module scope, so the base URL is set before any component can call the API.
configureApi(resolveApiUrl());

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
