import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ChooseFlow } from "@/components/discovery/choose-flow";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { parseDiscoveryAnswers } from "@/lib/api/discovery";
import { getQueryClient } from "@/lib/query-client";
import { prefetchDiscovery } from "@/server/prefetch/discovery";

export const metadata = {
  title: "Help me choose",
};

type ChoosePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ChoosePage({ searchParams }: ChoosePageProps) {
  const answers = parseDiscoveryAnswers(await searchParams);
  const queryClient = getQueryClient();
  if (answers) {
    await prefetchDiscovery(queryClient, answers);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <ChooseFlow />
      </Suspense>
    </HydrationBoundary>
  );
}
