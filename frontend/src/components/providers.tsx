"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { CompareProvider } from "@/components/compare/compare-selection";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CompareProvider>{children}</CompareProvider>
    </QueryClientProvider>
  );
}
